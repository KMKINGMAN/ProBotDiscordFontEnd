/* eslint-disable indent */
import { useContext, useState } from 'react'
import { Context } from '@script/_context'
import isEqual from 'lodash/isEqual'
import strings from '@script/locale'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import PagesTitle from '@component/PagesTitle'
import Unsaved from '@component/unsaved'
import Modal from 'react-modal'
import { FilledSelectInput } from '@component/fields'
import Switch from 'react-switch'
import axios from 'axios'
import {
  AUTOMOD_CARD_ICON,
  CHANNELS_STYLES,
  ROLES_STYLES
} from '@script/constants'
import { useCallback } from 'react'
import { debounce } from 'lodash'

export default function AutoMod() {
  const { guild, setGuild, rtl } = useContext(Context)
  const [state, setStates] = useState(guild.auto_mod || {})

  const POWERED_BY_DISCORD_RESPONSE_TYPES = [
    {
      label: strings.block_message,
      value: 'delete',
      description: strings.block_message_description,
      icon: '/static/block-icon.svg'
    },
    {
      label: strings.timeout_member,
      value: 'mute',
      description: strings.timeout_member_description,
      icon: '/static/timeout-icon.svg'
    }
  ]
  const RESPONSE_TYPES = [
    {
      label: strings.block_message,
      value: 'delete',
      description: strings.block_message_description,
      icon: '/static/block-icon.svg'
    },
    {
      label: strings.mute_member,
      value: 'mute',
      description: strings.mute_member_description,
      icon: '/static/timeout-icon.svg'
    }
  ]

  const setState = (object) =>
    setStates((prevState) => ({ ...prevState, ...object }))

  const names = {
    AUTOMOD_SPAM: 'spam',
    AUTOMOD_BADWORDS: 'badwords',
    AUTOMOD_DUPS: 'duplicated',
    AUTOMOD_REPEATED: 'repeated',
    AUTOMOD_DISCORD_INVITES: 'invites',
    AUTOMOD_LINKS: 'links',
    AUTOMOD_CAPS: 'caps',
    AUTOMOD_EMOJI_SPAM: 'emoji',
    AUTOMOD_MASS_MENTION: 'mention'
  }

  function ModalComponent({ openModal, setOpenModal, label, name, tier }) {
    const [creatableValue, setCreatableValue] = useState('')
    const defaultState = {
      enabled: false,
      action: ['delete'],
      whitelist: [],
      disabledChannels: [],
      disabledRoles: [],
      blacklist: [],
      muteCount: 3,
      muteTime: 1,
      muteTimeString: 'hours',
      resetMuteTime: 1,
      resetMuteTimeString: 'days'
    }
    const [data, setDatas] = useState({
      ...defaultState,
      ...(state[name] ? state[name] : {}),
      action:
        state[name]?.action.length > 0
          ? state[name].action
          : defaultState.action
    })
    const setData = (values) => setDatas({ ...data, ...values })
    const [loading, setLoading] = useState(false)
    const submitCreatable = (field) => {
      let newArray = data[field] ? data[field] : []
      if (!creatableValue) return
      if (newArray.includes(creatableValue)) return setCreatableValue('')
      setData({
        [field]: [...newArray, creatableValue]
      })
      setCreatableValue('')
    }
    const save = () => {
      setLoading(true)
      axios
        .put(`/guilds/${guild.id}/auto_mod`, {
          ...guild.auto_mod,
          [name]: data
        })
        .then((res) => {
          setLoading(false)
          setGuild({ ...guild, auto_mod: { ...guild.auto_mod, [name]: data } })
          setState({ ...guild.auto_mod, [name]: data })
          setOpenModal(false)
        })
    }

    const POWERED_BY_DISCORD = [
      'AUTOMOD_BADWORDS',
      'AUTOMOD_DISCORD_INVITES',
      'AUTOMOD_MASS_MENTION',
      'AUTOMOD_LINKS',
      'AUTOMOD_CAPS'
    ].includes(label)

    return (
      <Modal
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        className={`smallModal bg-modal automod-modal__content${
          rtl ? ' rtl' : ''
        }`}
        ariaHideApp={false}
        parentSelector={() => document.getElementById('main')}
      >
        <div className="Modalhead">
          <h5>{strings[label]}</h5>
        </div>
        <div className="modal__custom-automod-body">
          {label === 'AUTOMOD_BADWORDS' && (
            <>
              <div className="mb-5 commandItem modalTitle control-label">
                {strings.AUTOMOD_BADWORDS}
              </div>
              <CreatableSelect
                classNamePrefix="formselect"
                inputValue={creatableValue}
                onInputChange={(val) => setCreatableValue(val)}
                onBlur={() => submitCreatable('words')}
                onKeyDown={(event) => {
                  if (['Enter', 'Tab', ' '].includes(event.key))
                    submitCreatable('words')
                }}
                onChange={(values) =>
                  setData({ words: values.map(({ value }) => value) })
                }
                value={data.words?.map((word) => ({
                  label: word,
                  value: word
                }))}
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                isMulti
                placeholder={strings.select_placeholder_create}
                isClearable
                formatCreateLabel={(userInput) =>
                  strings.formatString(strings.select_create, userInput)
                }
                noOptionsMessage={() => strings.no_option}
              />
              <div className="flex mt-15  mb-15">
                <div
                  className="control-label modalTitle"
                  onClick={() => setData({ matchString: !data.matchString })}
                >
                  {strings.MATCH_THE_WHOLE_SENTENCE}
                </div>
                <div className="proswitch">
                  <Switch
                    checked={data.matchString}
                    onChange={(v) => setData({ matchString: v })}
                    onColor="#5865F2"
                    handleDiameter={20}
                    height={24}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    width={42}
                    className="react-switch"
                    id="material-switch"
                  />
                </div>
              </div>
            </>
          )}
          <div className="mb-15">
            <div className="mb-5 commandItem modalTitle control-label">
              {strings.choose_the_response}
            </div>
            <div className="response-types">
              {(POWERED_BY_DISCORD
                ? POWERED_BY_DISCORD_RESPONSE_TYPES
                : RESPONSE_TYPES
              ).map((type) => (
                <div
                  className={`response-types__item${
                    data.action?.includes(type.value) ? ' active' : ''
                  }`}
                  key={type.value}
                  onClick={() =>
                    tier && tier !== guild.tier
                      ? null
                      : setData({
                          action: [
                            ...data.action.filter((val) => val !== type.value),
                            ...(data.action.includes(type.value)
                              ? []
                              : [type.value])
                          ]
                        })
                  }
                >
                  {data.action?.includes(type.value) && (
                    <div className="response-types__item-check">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.57994 13.5801C8.37994 13.5801 8.18994 13.5001 8.04994 13.3601L5.21994 10.5301C4.92994 10.2401 4.92994 9.7601 5.21994 9.4701C5.50994 9.1801 5.98994 9.1801 6.27994 9.4701L8.57994 11.7701L13.7199 6.6301C14.0099 6.3401 14.4899 6.3401 14.7799 6.6301C15.0699 6.9201 15.0699 7.4001 14.7799 7.6901L9.10994 13.3601C8.96994 13.5001 8.77994 13.5801 8.57994 13.5801Z"
                          fill="var(--white)"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="icon">
                    <img src={type.icon} alt="type-icon" />
                  </div>
                  <div className="response-types__item-content">
                    <div className="response-types__item-title">
                      {type.label}
                    </div>
                    <div className="response-types__item-description">
                      {type.description}
                    </div>
                    {type.value === 'mute' && data.action.includes('mute') && (
                      <div
                        className="mt-5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div>
                          <div className="d-flex inputs_mute inputs-group-border">
                            <div className="col-md-8 pr-0 ">
                              <input
                                ref={(el) => {
                                  if (el) {
                                    el.style.setProperty(
                                      'border-inline-end',
                                      '2px solid #292930',
                                      'important'
                                    )
                                  }
                                }}
                                style={{
                                  borderStartEndRadius: '0',
                                  borderEndEndRadius: '0'
                                }}
                                type="number"
                                min="0"
                                className="inputs_mute"
                                placeholder="Mute Violations Count"
                                value={data.muteTime || 5}
                                onChange={(event) => {
                                  if (
                                    data.muteTimeString === 'days' &&
                                    event.target.value > 30
                                  ) {
                                    return
                                  }

                                  setData({ muteTime: event.target.value })
                                }}
                              />
                            </div>
                            <div className="col-md-4 pl-0 full-width__select">
                              <select
                                style={{
                                  borderStartStartRadius: 0,
                                  borderEndStartRadius: 0
                                }}
                                className="form-control form-select"
                                value={data.muteTimeString || 'hours'}
                                onChange={(event) =>
                                  setData({
                                    muteTimeString: event.target.value
                                  })
                                }
                              >
                                <option value="minutes">
                                  {strings.automod_mute_time_mintues}
                                </option>
                                <option value="hours">
                                  {strings.automod_mute_time_hours}
                                </option>
                                <option value="days">
                                  {strings.automod_mute_time_days}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-15">
            <div className="mb-5 commandItem modalTitle control-label">
              {strings.DISABLED_CHANNELS}
            </div>
            <Select
              classNamePrefix="formselect"
              value={
                data.disabledChannels
                  ? data.disabledChannels
                      .filter((r) => guild.channels?.some((g) => g.id === r))
                      .map((r) => guild.channels?.find((g) => g.id === r))
                      .map((r) => ({ label: `#${r.name}`, value: r.id }))
                  : []
              }
              onChange={(value) =>
                setData({
                  disabledChannels: value ? value.map((val) => val.value) : []
                })
              }
              menuPortalTarget={document.body}
              styles={CHANNELS_STYLES}
              options={
                guild?.channels &&
                guild?.channels
                  .filter((channel) => {
                    if (channel.type !== 0 && channel.type !== 5) return false
                    return true
                  })
                  .map((channel) => ({
                    label: `#${channel.name}`,
                    value: channel.id
                  }))
              }
              isMulti
              placeholder={strings.select_placeholder_select}
              noOptionsMessage={() => strings.no_option}
            />
          </div>
          <div className="mb-15">
            <div className="mb-5 commandItem modalTitle control-label">
              {strings.DISABLED_ROLES}
            </div>
            <Select
              classNamePrefix="formselect"
              value={
                data.disabledRoles
                  ? data.disabledRoles
                      .filter((r) => guild.roles?.some((g) => g.id === r))
                      .map((r) => guild.roles?.find((g) => g.id === r))
                      .map((r) => ({
                        label: r.name,
                        value: r.id,
                        color: r.color
                      }))
                  : []
              }
              onChange={(value) =>
                setData({
                  disabledRoles: value ? value.map((val) => val.value) : []
                })
              }
              menuPortalTarget={document.body}
              styles={ROLES_STYLES}
              options={
                guild?.roles &&
                guild?.roles
                  .filter((role) => {
                    if (role.id === guild?.id) return false
                    return true
                  })
                  .map((role) => ({
                    label: role.name,
                    value: role.id,
                    color: role.color
                  }))
              }
              isMulti
              placeholder={strings.select_placeholder_select}
              noOptionsMessage={() => strings.no_option}
            />
          </div>
          <div
            className=" commandItem modalTitle mb-10"
            style={{ fontSize: 10 }}
          >
            {strings.excluded_from_filter_rules}
          </div>
          {label === 'AUTOMOD_LINKS' && (
            <>
              <div className="mb-15 mt-5 pt-3 autmod_links">
                <div className="commandItem modalTitle control-label">
                  {strings.whitelist_urls}
                </div>
                <CreatableSelect
                  classNamePrefix="formselect"
                  inputValue={creatableValue}
                  onInputChange={(val) => setCreatableValue(val)}
                  onBlur={() => submitCreatable('whitelist')}
                  onKeyDown={(event) => {
                    if (['Enter', 'Tab'].includes(event.key))
                      submitCreatable('whitelist')
                  }}
                  onChange={(values) =>
                    setData({ whitelist: values.map(({ value }) => value) })
                  }
                  value={data.whitelist.map((whitelist) => ({
                    label: whitelist,
                    value: whitelist
                  }))}
                  menuPortalTarget={document.body}
                  styles={CHANNELS_STYLES}
                  isMulti
                  placeholder={strings.select_placeholder_create}
                  isClearable
                  isDisabled={data.blacklist.length > 0}
                  noOptionsMessage={() => strings.no_option}
                />
              </div>
              <div className="mb-15">
                <div className="commandItem modalTitle control-label">
                  {strings.BLACKLIST_LINKS}
                </div>
                <CreatableSelect
                  classNamePrefix="formselect"
                  inputValue={creatableValue}
                  onInputChange={(val) => setCreatableValue(val)}
                  onBlur={() => submitCreatable('blacklist')}
                  onKeyDown={(event) => {
                    if (['Enter', 'Tab', ' '].includes(event.key))
                      submitCreatable('blacklist')
                  }}
                  onChange={(values) =>
                    setData({ blacklist: values.map(({ value }) => value) })
                  }
                  value={data.blacklist.map((blacklist) => ({
                    label: blacklist,
                    value: blacklist
                  }))}
                  menuPortalTarget={document.body}
                  styles={CHANNELS_STYLES}
                  isMulti
                  placeholder={strings.select_placeholder_create}
                  isClearable
                  isDisabled={data.whitelist.length > 0}
                  noOptionsMessage={() => strings.no_option}
                />
              </div>
            </>
          )}
        </div>
        <div
          className="commandSave"
          style={{
            justifyContent: POWERED_BY_DISCORD ? 'space-between' : 'flex-end'
          }}
        >
          {POWERED_BY_DISCORD && (
            <h3 className="d-flex flex-column">
              {strings.formatString(
                strings.powered_by_discord,
                <span>{strings.discord_automod}</span>
              )}
            </h3>
          )}
          <div>
            <button
              type="button"
              className="ml2 mr2 unsaved__close-btn"
              onClick={() => setOpenModal(false)}
            >
              {strings.cancel}
            </button>
            {console.log(data.action)}
            <button
              disabled={
                data.action.length === 0 ||
                loading ||
                isEqual(data, state[name])
              }
              style={{ position: 'relative' }}
              onClick={() => {
                ;(!loading || !isEqual(data, state[name])) && save()
              }}
              className={`unsaved__save-btn ${
                loading ? 'running disabled' : ''
              }`}
            >
              {strings.SAVE_CHANGES}
              {loading && (
                <div className="spin-saving-icon">
                  <i className="fas fa-circle-notch fa-spin"></i>
                </div>
              )}
            </button>
          </div>
        </div>
      </Modal>
    )
  }

  function Filter({ label, tier }) {
    const [openModal, setOpenModal] = useState(false)
    const name = names[label]
    const POWERED_BY_DISCORD = [
      'AUTOMOD_BADWORDS',
      'AUTOMOD_DISCORD_INVITES',
      'AUTOMOD_MASS_MENTION',
      'AUTOMOD_LINKS'
    ].includes(label)

    const actionOptions = [
      { label: strings.block_message, value: 'delete' },
      { label: 'Kick User', value: 'kick' },
      {
        label: POWERED_BY_DISCORD
          ? strings.timeout_member
          : strings.mute_member,
        value: 'mute'
      }
    ]

    const RESPONDED = (
      state[name]?.action?.map((action) =>
        actionOptions.find((actionOption) => actionOption.value === action)
      ) || []
    )
      .map((action) => (typeof action === 'string' ? action : action?.label))
      .join(' - ')

    const enableRequest = useCallback(
      debounce((name, bool) => {
        axios.put(`/guilds/${guild.id}/auto_mod`, {
          ...guild.auto_mod,
          [name]: {
            ...state[name],
            enabled: bool,
            action:
              state[name]?.action?.length > 0 ? state[name]?.action : ['delete']
          }
        })
      }, 800),
      []
    )

    const toggleEnabled = useCallback(
      (name, bool) => {
        setState({
          [name]: {
            ...state[name],
            enabled: bool,
            action:
              state[name]?.action?.length > 0 ? state[name]?.action : ['delete']
          }
        })
        setGuild({
          ...guild,
          auto_mod: {
            ...guild.auto_mod,
            [name]: {
              ...state[name],
              enabled: bool,
              action:
                state[name]?.action?.length > 0
                  ? state[name]?.action
                  : ['delete']
            }
          }
        })
      },
      [state]
    )

    return (
      <>
        <div className="automod-item">
          <div className="automod-item__content">
            <div>
              <div className="automod-item__automod-icon">
                {AUTOMOD_CARD_ICON[label]}
              </div>
              <div className="automod-item__text">
                <div className="automod-item__title">{strings[label]}</div>
                {RESPONDED && (
                  <div className="automod-item__setup">{RESPONDED}</div>
                )}
              </div>
            </div>
            <Switch
              checked={state[name]?.enabled ?? false}
              disabled={tier && tier !== guild.tier}
              onChange={(bool) => {
                toggleEnabled(name, bool)
                enableRequest(name, bool)
              }}
              onColor="#5865F2"
              height={24}
              uncheckedIcon={false}
              checkedIcon={false}
              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
              activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
              width={52}
              className="react-switch dramexSwi"
              id="material-switch"
            />
          </div>
          <div>
            {tier && (
              <span className="vip-component-tag no-cursor">
                {strings.Premium} {strings.tier} {tier}
              </span>
            )}
          </div>
          <button
            className="automod-item__setup-btn"
            onClick={() => {
              setOpenModal(true)
            }}
            disabled={tier && tier !== guild.tier}
          >
            {RESPONDED ? strings.edit_rule : strings.need_setup}
          </button>
        </div>
        {openModal && (
          <ModalComponent
            filletedOptions={RESPONDED}
            openModal={openModal}
            setOpenModal={setOpenModal}
            name={name}
            label={label}
            tier={tier}
            actionOptions={actionOptions}
          />
        )}
      </>
    )
  }

  return (
    <>
      <PagesTitle
        data={{
          name: 'automod',
          module: 'automod'
        }}
      />
      <Unsaved
        method="auto_mod"
        state={state}
        setStates={setStates}
        default={{
          igonredChannels: [],
          igonredRoles: [],
          youtubeOnly: [],
          imagesOnly: [],
          badwords: { action: Array(0) },
          caps: { action: Array(0) },
          duplicated: { action: Array(0) },
          emoji: { action: Array(0) },
          invites: { action: Array(0) },
          links: { action: Array(0) },
          mention: { action: Array(0) },
          repeated: { action: Array(0) },
          spam: { action: Array(0) }
        }}
      />

      <div className="automod-container">
        <Filter label="AUTOMOD_SPAM" />
        <Filter label="AUTOMOD_BADWORDS" />
        <Filter label="AUTOMOD_DUPS" />
        <Filter label="AUTOMOD_REPEATED" tier={2} />
        <Filter label="AUTOMOD_DISCORD_INVITES" />
        <Filter label="AUTOMOD_LINKS" />
        <Filter label="AUTOMOD_CAPS" />
        <Filter label="AUTOMOD_EMOJI_SPAM" />
        <Filter label="AUTOMOD_MASS_MENTION" />
      </div>
      <div className="split mt-15 mb-30" />
      <div>
        <FilledSelectInput
          label={strings.AUTOMOD_IGNORED_CHANNELS}
          labelClassName="control-label"
        >
          <Select
            placeholder={strings.select_placeholder_select}
            value={
              state.igonredChannels
                ? state.igonredChannels
                    ?.filter((r) => guild.channels?.some((g) => g.id === r))
                    .map((r) => guild.channels?.find((g) => g.id === r))
                    .map((r) => ({ label: `#${r.name}`, value: r.id }))
                : []
            }
            onChange={(value) =>
              setState({
                igonredChannels: value ? value.map((val) => val.value) : []
              })
            }
            options={
              guild?.channels &&
              guild?.channels
                .filter((channel) => {
                  if (channel.type !== 0 && channel.type !== 5) return false
                  return true
                })
                .map((channel) => ({
                  label: `#${channel.name}`,
                  value: channel.id
                }))
            }
            classNamePrefix="formselect"
            isMulti
            styles={CHANNELS_STYLES}
            noOptionsMessage={() => strings.no_option}
          />
        </FilledSelectInput>
        <FilledSelectInput
          label={strings.AUTOMOD_IGNORED_ROLES}
          className="mt-10"
          labelClassName="control-label"
        >
          <Select
            placeholder={strings.select_placeholder_select}
            classNamePrefix="formselect"
            value={
              guild?.roles && state?.igonredRoles
                ? guild?.roles
                    .filter((r) => state?.igonredRoles.includes(r.id))
                    .map((r) => ({
                      label: r.name,
                      value: r.id,
                      color: r.color
                    }))
                : []
            }
            onChange={(value) =>
              setState({
                igonredRoles: value ? value.map((val) => val.value) : []
              })
            }
            options={
              guild?.roles &&
              guild?.roles
                .filter((role) => {
                  if (role.id === guild?.id) return false
                  return true
                })
                .map((role) => ({
                  label: role.name,
                  value: role.id,
                  color: role.color
                }))
            }
            isMulti
            styles={ROLES_STYLES}
            noOptionsMessage={() => strings.no_option}
          />
        </FilledSelectInput>
        <FilledSelectInput
          label={strings.AUTOMOD_ONLY_IMAGES}
          className="mt-10"
          labelClassName="control-label"
        >
          <Select
            placeholder={strings.select_placeholder_select}
            classNamePrefix="formselect"
            value={
              state.imagesOnly
                ? state.imagesOnly
                    .filter((r) => guild.channels?.some((g) => g.id === r))
                    .map((r) => guild.channels?.find((g) => g.id === r))
                    .map((r) => ({ label: `#${r.name}`, value: r.id }))
                : []
            }
            onChange={(value) =>
              setState({
                imagesOnly: value ? value.map((val) => val.value) : []
              })
            }
            options={
              guild?.channels &&
              guild?.channels
                .filter((channel) => {
                  if (channel.type !== 0 && channel.type !== 5) return false
                  return true
                })
                .map((channel) => ({
                  label: `#${channel.name}`,
                  value: channel.id
                }))
            }
            isMulti
            styles={CHANNELS_STYLES}
            noOptionsMessage={() => strings.no_option}
          />
        </FilledSelectInput>
        <FilledSelectInput
          label={strings.AUTOMOD_ONLY_YOUTUBE}
          className="mt-10"
          labelClassName="control-label"
        >
          <Select
            placeholder={strings.select_placeholder_select}
            classNamePrefix="formselect"
            value={
              state.youtubeOnly
                ? state.youtubeOnly
                    .filter((r) => guild.channels?.some((g) => g.id === r))
                    .map((r) => guild.channels?.find((g) => g.id === r))
                    .map((r) => ({ label: `#${r.name}`, value: r.id }))
                : []
            }
            onChange={(value) =>
              setState({
                youtubeOnly: value ? value.map((val) => val.value) : []
              })
            }
            options={
              guild?.channels &&
              guild?.channels
                .filter((channel) => {
                  if (channel.type !== 0 && channel.type !== 5) return false
                  return true
                })
                .map((channel) => ({
                  label: `#${channel.name}`,
                  value: channel.id
                }))
            }
            isMulti
            styles={CHANNELS_STYLES}
            noOptionsMessage={() => strings.no_option}
          />
        </FilledSelectInput>
      </div>
    </>
  )
}
