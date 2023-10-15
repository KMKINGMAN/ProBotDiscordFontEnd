import { useContext, useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'
import debounce from 'lodash/debounce'
import isEqual from 'lodash/isEqual'
import strings from '@script/locale'
import style from './commands.module.css'
import Switch from 'react-switch'
import CreatableSelect from 'react-select/creatable'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { Context } from '@script/_context'
import { CountingComponent } from '../fields'
import axios from 'axios'
import { CHANNELS_STYLES, ROLES_STYLES } from '@script/constants'
import SelectChannels from '../SelectChannels'
import { Button } from '@component/ui/button'

export const CustomName = {
  vmute: 'mute voice',
  mute: 'mute text',
  unvmute: 'unmute voice',
  unmute: 'unmute text',
  removewarn: 'warn_remove',
  np: 'now_playing',
  vol: 'volume'
}

export default function Command({ name, premium }) {
  const { guild, setGuild, Toast } = useContext(Context)
  const router = useRouter()
  const defaultValues = {
    aliases: [],
    disabledChannels: [],
    enabledChannels: [],
    disabledRoles: [],
    enabledRoles: [],
    deleteCommandMsg: false,
    deleteReply: false,
    deletewithinvocation: false,
    enabled: true,
    skipRoles: [],
    ...(name === 'ban' ? { deleteHistory: 0 } : {}),
    ...(name === 'points' ? { managers: [] } : {}),
    ...(['ban', 'mute', 'vmute', 'timeout'].includes(name)
      ? {
          defaultTimeType: 'time',
          time_duration: 'm',
          time_number: false,
          reasons: []
        }
      : {}),
    ...(name === 'moveme' ? { skipMax: 4 } : {}),
    ...(name === 'warn' ? { reasons: [] } : {})
  }
  const [command, setCommands] = useState(defaultValues)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [reason_text, setReasonText] = useState('')
  const [reason_number, setReasonNum] = useState(5)
  const [reason_time, setReasonTime] = useState('minutes')
  const [aliasInput, setAliasInput] = useState('')
  const [autoFocus, setAutoFocus] = useState(false)
  const addReason = useRef()
  const setCommand = (obj) => setCommands({ ...command, ...obj })

  let knownAliases = [
    { command: 'credits', aliases: ['credit'], arabic_aliases: [] },
    { command: 'rank', aliases: ['id'], arabic_aliases: ['هوية', 'هويه'] },
    { command: 'np', aliases: ['nowplaying'], arabic_aliases: ['الان'] },
    { command: 'skip', aliases: ['s'], arabic_aliases: ['تخطي', 'التالي'] },
    { command: 'search', aliases: ['se'], arabic_aliases: ['بحث'] },
    { command: 'setnick', aliases: ['nick'], arabic_aliases: [] },
    { command: 'play', aliases: ['p'], arabic_aliases: ['ش', 'شغل'] },
    { command: 'nick', aliases: ['nick'], arabic_aliases: [] },
    {
      command: 'stop',
      aliases: ['st', 'end'],
      arabic_aliases: ['ايقاف', 'وقف']
    },
    { command: 'user', aliases: [], arabic_aliases: ['معلوماتي'] },
    { command: 'vol', aliases: ['volume'], arabic_aliases: ['صوت'] },
    { command: 'help', aliases: [], arabic_aliases: ['مساعدة'] },
    { command: 'color', aliases: [], arabic_aliases: ['لون'] },
    { command: 'colors', aliases: [], arabic_aliases: ['الوان'] },
    { command: 'pause', aliases: [], arabic_aliases: ['انتظار'] },
    { command: 'repeat', aliases: ['loop'], arabic_aliases: ['تكرار'] },
    { command: 'clear', aliases: [], arabic_aliases: ['مسح', 'امسح'] },
    { command: 'ban', aliases: [], arabic_aliases: ['حظر'] },
    { command: 'kick', aliases: [], arabic_aliases: ['طرد'] },
    { command: 'mute', aliases: [], arabic_aliases: ['اسكت', 'اسكات'] },
    { command: 'move', aliases: [], arabic_aliases: ['سحب'] },
    { command: 'moveme', aliases: [], arabic_aliases: ['ودني', 'اسحبني'] },
    { command: 'points', aliases: [], arabic_aliases: ['نقاط'] },
    { command: 'unmute', aliases: [], arabic_aliases: ['تكلم'] },
    { command: 'warn', aliases: [], arabic_aliases: ['انذار'] },
    { command: 'seek', aliases: [], arabic_aliases: ['تقديم'] },
    { command: 'warnings', aliases: [], arabic_aliases: ['تحذيرات'] },
    { command: 'lock', aliases: [], arabic_aliases: ['قفل', 'اقفل'] },
    { command: 'unlock', aliases: [], arabic_aliases: ['افتح', 'فتح'] }
  ]

  useEffect(() => {
    if (open) {
      setCommands({
        ...command,
        enabled:
          guild.commands?.[name]?.enabled !== undefined
            ? guild.commands?.[name]?.enabled
            : true
      })
    } else {
      setCommands({ ...defaultValues, ...guild.commands?.[name] })
    }
  }, [guild.commands?.[name]])

  useEffect(() => {
    if (window.location.hash?.slice(1) === `/` + name) setOpen(true)
  }, [window.location.hash])

  useEffect(() => {
    setAutoFocus(false)
  }, [open])
  const updateCommand = (data) =>
    axios.put(`guilds/${guild.id}/commands/${encodeURIComponent(name)}`, data)

  const handleReasonAdd = (value) => {
    setAutoFocus(true)
    setCommand({
      reasons: [
        ...command.reasons,
        {
          reason_text: '',
          reason_number: reason_number,
          reason_time: reason_time,
          ...{ reason_text: value }
        }
      ]
    })
    setReasonText('')
    setReasonNum(5)
    setReasonTime('minutes')
  }

  const handleReasonEdit = (index, name, value) => {
    // let reasons = [...command.reasons];
    // reasons[index][name] = value;
    // setCommand({ reasons });

    setCommand({
      reasons: command.reasons.map((reason, i) => {
        if (i === index) {
          return { ...reason, [name]: value }
        }
        return reason
      })
    })
  }
  const deleteReason = (index) => {
    setCommand({ reasons: command.reasons.filter((e, i) => i !== index) })
  }

  const moveReason = (type, index) => {
    let reasons = [...command.reasons]
    let f = reasons.splice(index, 1)[0]
    reasons.splice(type === 'up' ? index - 1 : index + 1, 0, f)
    setCommand({ reasons })
  }

  const handleWarnReasonAdd = (value) => {
    setAutoFocus(true)

    if (value) {
      let reasons = command.reasons ? [...command.reasons] : []
      reasons.push(value)
      setCommand({ reasons })
    }
  }

  const handleWarnReasonEdit = (index, value) => {
    let reasons = [...command.reasons]
    reasons[index] = value
    if (!reasons[index]) {
      reasons.splice(index, 1)
      //addReason.focus();
    }
    setCommand({ reasons })
  }

  const submitAliases = () => {
    if (!aliasInput) return
    if (command.aliases.includes(aliasInput)) return setAliasInput('')
    setCommand({
      aliases: [...command.aliases, aliasInput.replace(/\s/g, '')]
    })
    setAliasInput('')
  }

  const commandEnable = useCallback(
    debounce((command, enabled) => {
      updateCommand({ ...command, enabled })
    }, 800),
    []
  )

  return (
    <div
      className={
        'tw-group tw-my-3 tw-flex tw-cursor-pointer tw-flex-col tw-rounded-lg tw-bg-grey-4 tw-p-4 tw-duration-200 hover:tw-ring-1 hover:tw-ring-grey-2'
      }
    >
      <div
        onClick={() => {
          if (
            isEqual({ ...defaultValues, ...guild.commands?.[name] }, command) ||
            confirm(strings.UNSAVED_CONFIRM)
          ) {
            setCommand({ ...defaultValues, ...guild.commands?.[name] })

            if (!open) {
              window.location.hash = `/` + name
            } else {
              router.push({ pathname: '', query: router.query }, undefined, {
                scroll: false
              })
              setOpen(false)
            }
          }
        }}
        className="tw-flex tw-items-center tw-justify-between tw-gap-2 sm:tw-flex-col sm:tw-items-start"
      >
        <div className={'tw-flex tw-flex-col tw-gap-1'}>
          <h5 className="tw-m-0 tw-select-none tw-text-s2">
            /{CustomName[name] || name}
          </h5>
          {premium && (
            <span className="ms-2 pt-1 vip-component-tag">
              {strings.Premium}
            </span>
          )}
          <p className="tw-m-0 tw-select-none tw-text-s3 tw-text-grey-text2 tw-duration-200 group-hover:tw-text-grey-text3">
            {strings[`${name}_description`]}
          </p>
        </div>
        <div
          className={`${style.edit} ${
            premium && guild.botnumber < 2 && 'disabled'
          }`}
        >
          <Button
            className="tw-select-none"
            onClick={() => {
              if (
                isEqual(
                  { ...defaultValues, ...guild.commands?.[name] },
                  command
                ) ||
                confirm(strings.UNSAVED_CONFIRM)
              ) {
                setCommand({ ...defaultValues, ...guild.commands?.[name] })

                if (!open) {
                  window.location.hash = `/` + name
                } else {
                  router.push(
                    { pathname: '', query: router.query },
                    undefined,
                    {
                      scroll: false
                    }
                  )
                  setOpen(false)
                }
              }
            }}
            intent={open ? 'primary' : 'secondary'}
          >
            {strings.EDIT}
          </Button>
          <div onClick={(e) => e.stopPropagation()}>
            <Switch
              onChange={(enabled) => {
                setCommand({ enabled })
                setGuild({
                  ...guild,
                  commands: {
                    ...guild.commands,
                    [name]: { ...guild.commands[name], enabled }
                  }
                })
                commandEnable(guild.commands[name], enabled)
              }}
              //disabled={toggleLoading}
              checked={command.enabled}
              value={command.enabled}
              onColor="#5865F2"
              handleDiameter={27}
              height={30}
              uncheckedIcon={false}
              checkedIcon={false}
              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
              activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
              aria-label="reaction role"
              width={60}
              className="dramexSwi"
              id="material-switch"
            />
          </div>
        </div>
      </div>
      <div
        className={`tw-grid tw-transition-all tw-duration-200 ${
          open ? 'tw-grid-rows-[1fr]' : 'tw-grid-rows-[0fr]'
        } `}
      >
        <div className="tw-overflow-hidden">
          <hr className="tw-my-4 tw-h-[1px] tw-bg-grey-2 tw-opacity-100" />
          <div className="row row-cols-1 row-cols-sm-2   ">
            <div className="col mt-10">
              <label className="control-label">{strings.Aliases}</label>
              <CreatableSelect
                isClearable
                isMulti
                inputValue={aliasInput}
                onChange={(val) =>
                  setCommand({
                    aliases: val
                      .filter((a) => {
                        let k = knownAliases.find((k) => k.command === name)
                        if (
                          k &&
                          (k.aliases.includes(a.value) ||
                            k.arabic_aliases.includes(a.value))
                        )
                          return false
                        return true
                      })
                      .map((val) => val.value)
                  })
                }
                onInputChange={(val) => setAliasInput(val.replace(/\s/g, ''))}
                onKeyDown={(event) => {
                  if (['Enter', 'Tab', ' '].includes(event.key)) submitAliases()
                }}
                onBlur={() => submitAliases()}
                placeholder={strings.select_placeholder_create}
                value={[
                  ...(knownAliases.find((k) => k.command === name)
                    ? knownAliases
                        .find((k) => k.command === name)
                        [
                          strings.getLanguage() === 'ar'
                            ? 'arabic_aliases'
                            : 'aliases'
                        ].map((k) => ({
                          label: `${guild.prefix}${k}`,
                          value: k,
                          isFixed: true
                        }))
                    : []),
                  ...command.aliases.map((alias) => ({
                    label: alias,
                    value: alias
                  }))
                ]}
                classNamePrefix="formselect"
                components={{
                  DropdownIndicator: null
                }}
                noOptionsMessage={() => strings.no_option}
                styles={CHANNELS_STYLES}
                formatCreateLabel={(userInput) =>
                  strings.formatString(strings.select_create, userInput)
                }
              />
            </div>
            <div className="col mt-10">
              <label className="control-label">{strings.ENABLED_ROLES}</label>
              <Select
                placeholder={strings.select_placeholder_select}
                classNamePrefix="formselect"
                onChange={(targets) =>
                  setCommand({
                    enabledRoles: targets.map((target) => target.value),
                    disabledRoles: command.disabledRoles.filter(
                      (disabledRole) =>
                        !targets.find((target) => target.value === disabledRole)
                    )
                  })
                }
                isDisabled={
                  command.disabledRoles.length && command.enabledRoles.length
                    ? false
                    : Boolean(command.disabledRoles.length)
                }
                value={command.enabledRoles.map((roleID) => {
                  const role = guild.roles.find((role) => role.id === roleID)
                  return role
                    ? { label: role.name, value: roleID, color: role.color }
                    : {
                        label: 'deleted-role',
                        value: roleID
                      }
                })}
                isMulti
                components={makeAnimated()}
                options={guild.roles
                  ?.filter(
                    (role) =>
                      role.id !== guild.id &&
                      (!command.enabledRoles.find(
                        (enabledRole) => enabledRole === role.id
                      ) ||
                        [])
                  )
                  .map((role) => ({
                    label: role.name,
                    value: role.id,
                    color: role.color
                  }))}
                styles={ROLES_STYLES}
                noOptionsMessage={() => strings.no_option}
                menuPortalTarget={document.body}
              />
            </div>
            <div className="col mt-10">
              <label className="control-label">{strings.DISABLED_ROLES}</label>
              <Select
                placeholder={strings.select_placeholder_select}
                classNamePrefix="formselect"
                onChange={(targets) =>
                  setCommand({
                    disabledRoles: targets.map((target) => target.value),
                    enabledRoles: command.enabledRoles.filter(
                      (enabledRole) =>
                        !targets.find((target) => target.value === enabledRole)
                    )
                  })
                }
                isDisabled={
                  command.disabledRoles.length && command.enabledRoles.length
                    ? false
                    : Boolean(command.enabledRoles.length)
                }
                components={makeAnimated()}
                value={command.disabledRoles.map((roleID) => {
                  const role = guild.roles.find((role) => role.id === roleID)
                  return role
                    ? { label: role.name, value: roleID, color: role.color }
                    : { label: 'deleted-role', value: roleID }
                })}
                isMulti
                options={guild.roles
                  ?.filter(
                    (role) =>
                      role.id !== guild.id &&
                      (!command.disabledRoles.find(
                        (disabledRole) => disabledRole === role.id
                      ) ||
                        [])
                  )
                  .map((role) => ({
                    label: role.name,
                    value: role.id,
                    color: role.color
                  }))}
                styles={ROLES_STYLES}
                noOptionsMessage={() => strings.no_option}
                menuPortalTarget={document.body}
              />
            </div>
            <div className="col mt-10">
              <label className="control-label">
                {strings.ENABLED_CHANNELS}
              </label>
              <SelectChannels
                isDisabled={Boolean(command.disabledChannels.length)}
                handleChange={(targets) => {
                  setCommand({
                    enabledChannels: targets.map((target) => target.value)
                  })
                }}
                handleRemove={(target) => {
                  setCommand({
                    enabledChannels: command.enabledChannels.filter(
                      (enabledChannel) => target.value !== enabledChannel
                    )
                  })
                }}
                selectedValue={command.enabledChannels
                  .map((channelID) => {
                    const channel = guild.channels.find(
                      (channel) => channel.id === channelID
                    )
                    return channel
                      ? { ...channel, label: channel.name, value: channelID }
                      : null
                  })
                  .filter((channel) => channel !== null)}
                isMulti
                placeholder="Select channels"
              />
            </div>
            <div className="col mt-10">
              <label className="control-label">
                {strings.DISABLED_CHANNELS}
              </label>
              <SelectChannels
                isDisabled={Boolean(command.enabledChannels.length)}
                handleChange={(targets) => {
                  setCommand({
                    disabledChannels: targets.map((target) => target.value)
                  })
                }}
                handleRemove={(target) => {
                  setCommand({
                    disabledChannels: command.disabledChannels.filter(
                      (disabledChannel) => target.value !== disabledChannel
                    )
                  })
                }}
                selectedValue={command.disabledChannels
                  .map((channelID) => {
                    const channel = guild.channels.find(
                      (channel) => channel.id === channelID
                    )
                    return channel
                      ? { ...channel, label: channel.name, value: channelID }
                      : null
                  })
                  .filter((channel) => channel !== null)}
                isMulti
                placeholder="Select channels"
              />
            </div>

            {name === 'moveme' && (
              <>
                <div className="col mt-10">
                  <label className="control-label">
                    {strings.ROLES_MAX_LIMIT}
                  </label>
                  <Select
                    placeholder={strings.select_placeholder_select}
                    classNamePrefix="formselect"
                    onChange={(targets) =>
                      setCommand({
                        skipRoles: targets.map((target) => target.value)
                      })
                    }
                    components={makeAnimated()}
                    value={command.skipRoles.map((roleID) => {
                      const role = guild.roles.find(
                        (role) => role.id === roleID
                      )
                      return role
                        ? { label: role.name, value: roleID, color: role.color }
                        : { label: 'deleted role', value: roleID }
                    })}
                    isMulti
                    options={guild.roles
                      ?.filter(
                        (role) =>
                          role.id !== guild.id &&
                          (!command.skipRoles.find(
                            (enabledRole) => enabledRole === role.id
                          ) ||
                            [])
                      )
                      .map((role) => ({
                        label: role.name,
                        value: role.id,
                        color: role.color
                      }))}
                    styles={ROLES_STYLES}
                    noOptionsMessage={() => strings.no_option}
                    menuPortalTarget={document.body}
                  />
                </div>
                <div className="col mt-10">
                  <label className="control-label">
                    {strings.MAX_LIMIT_NO_SKIP}
                  </label>
                  <input
                    placeholder={strings.MAX_LIMIT_NO_SKIP}
                    onChange={(event) =>
                      setCommand({ skipMax: event.target.value })
                    }
                    type="number"
                    min={0}
                    value={command.skipMax}
                    className="form-control"
                  />
                </div>
              </>
            )}

            {name === 'ban' && (
              <div className="col mt-10">
                <label className="control-label">
                  {strings.DELETE_MESSAGE_HISTORY}
                </label>
                <Select
                  onChange={({ value }) => setCommand({ deleteHistory: value })}
                  isSearchable={false}
                  value={{
                    label: `${
                      command.deleteHistory == 0
                        ? strings.NONE
                        : command.deleteHistory
                    } ${command.deleteHistory == 0 ? '' : strings.DAYS}`
                  }}
                  classNamePrefix="formselect"
                  components={makeAnimated()}
                  options={Array.from(new Array(8).keys()).map((num) => ({
                    label: `${num == 0 ? strings.NONE : num} ${
                      num == 0 ? '' : strings.DAYS
                    }`,
                    value: num
                  }))}
                  placeholder={strings.select_placeholder_select}
                  menuPortalTarget={document.body}
                />
              </div>
            )}
            {['ban', 'mute', 'vmute', 'timeout'].includes(name) && (
              <>
                <div className="col mt-10">
                  <div className="mb-5 commandItem control-label">
                    {' '}
                    {strings.NO_TIME_ACTION}{' '}
                  </div>
                  <Select
                    classNamePrefix="formselect"
                    isSearchable={false}
                    value={
                      [
                        {
                          label:
                            strings[name + '_specific_time'] ||
                            strings.mute_specific_time,
                          value: 'time'
                        },
                        { label: strings.SELECT_REASON, value: 'select' }
                      ].find((o) => o.value === command.defaultTimeType) ||
                      undefined
                    }
                    onChange={(item) =>
                      setCommand({ defaultTimeType: item.value })
                    }
                    options={[
                      {
                        label:
                          strings[name + '_specific_time'] ||
                          strings.mute_specific_time,
                        value: 'time'
                      },
                      { label: strings.SELECT_REASON, value: 'select' }
                    ]}
                    menuPortalTarget={document.body}
                  />
                </div>

                {(!command.defaultTimeType ||
                  command.defaultTimeType === 'time') && (
                  <div className="col mt-10">
                    <div className="mb-5 commandItem control-label">
                      {' '}
                      {strings.SPECIFIC_TIME}{' '}
                    </div>
                    <div className="row mr-0 ml-0">
                      <div className="col-md-8  pr-0 pl-0">
                        <input
                          className="form-control"
                          type="number"
                          min={0}
                          value={command.time_number}
                          onChange={(event) =>
                            setCommand({ time_number: event.target.value })
                          }
                          placeholder={strings.SPECIFIC_TIME}
                        />
                      </div>
                      <div className="col-md-4 pl-0 pr-0">
                        <select
                          className="form-control form-select"
                          value={command.time_duration}
                          onChange={(event) =>
                            setCommand({ time_duration: event.target.value })
                          }
                        >
                          <option value="minutes">{strings.MIN}</option>
                          <option value="hours">{strings.HOURS}</option>
                          <option value="days">{strings.DAYS}</option>
                          <option value="weeks">{strings.WEEKS}</option>
                          <option value="months">{strings.MONTHS}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                {command.defaultTimeType === 'select' && (
                  <div className="col-md-12 mt-10">
                    <div className="mb-5 control-label">
                      {' '}
                      {strings.Reasons}{' '}
                    </div>
                    {command.reasons &&
                      command.reasons.map((element, index) => (
                        <div className={style.reasons_row} key={index}>
                          <i
                            onClick={() => deleteReason(index)}
                            className={`${style['red-minus-circle-icon']} ${style['red-minus-circle-icon-bg']}`}
                          >
                            -
                          </i>
                          <input
                            className="form-control"
                            placeholder={strings.reason}
                            autoFocus={autoFocus}
                            type="text"
                            value={element.reason_text}
                            onChange={(event) =>
                              handleReasonEdit(
                                index,
                                'reason_text',
                                event.target.value
                              )
                            }
                          />
                          <div
                            style={{ flex: 6 }}
                            className={`d-flex gap-3 align-items-center full-width ${style['reasons-settings']}`}
                          >
                            <CountingComponent
                              value={element.reason_number}
                              onChange={(number) =>
                                handleReasonEdit(index, 'reason_number', number)
                              }
                              min="1"
                              max={Infinity}
                            />
                            <div className="full-width">
                              <select
                                className="form-control form-select"
                                value={element.reason_time}
                                onChange={(event) =>
                                  handleReasonEdit(
                                    index,
                                    'reason_time',
                                    event.target.value
                                  )
                                }
                              >
                                <option value="minutes">{strings.MIN}</option>
                                <option value="hours">{strings.HOURS}</option>
                                <option value="days">{strings.DAYS}</option>
                                <option value="weeks">{strings.WEEKS}</option>
                                <option value="months">{strings.MONTHS}</option>
                              </select>
                            </div>
                            <div
                              className={`d-flex gap-3 align-items-center justify-content-center ${style['reasons-actions']}`}
                            >
                              <div
                                className={`${style['reasons-arrows']} ${
                                  index === 0
                                    ? style['reasons-disabled-arrow']
                                    : ''
                                }`}
                                onClick={() => moveReason('up', index)}
                              >
                                <i className="fas fa-chevron-up"></i>
                              </div>
                              <div>
                                <i
                                  onClick={() => deleteReason(index)}
                                  className={`${style['red-minus-circle-icon']} ${style['red-minus-circle-icon-sm']}`}
                                >
                                  -
                                </i>
                              </div>
                              <div
                                className={`${style['reasons-arrows']} ${
                                  command.reasons.length === index + 1
                                    ? style['reasons-disabled-arrow']
                                    : ''
                                }`}
                                onClick={() => moveReason('down', index)}
                              >
                                <i className="fas fa-chevron-down"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    <div className="row mr-0 ml-0 gap-1">
                      <div
                        className="col-md-1 pr-0 pl-0"
                        style={{ margin: 'auto', textAlign: 'center' }}
                      >
                        {strings.add}:
                      </div>
                      <div className="col-md-5 pr-0 pl-0">
                        <input
                          className="form-control"
                          placeholder={strings.reason}
                          type="text"
                          disabled={command.reasons.length >= 25}
                          value={reason_text}
                          onChange={(event) =>
                            handleReasonAdd(event.target.value)
                          }
                        />
                      </div>
                      <div className="col-md-2 pl-0 pr-0">
                        <input
                          className="form-control"
                          placeholder={strings.number}
                          type="number"
                          value={reason_number}
                          onChange={(event) =>
                            event.target.value > 0 &&
                            setReasonNum(event.target.value)
                          }
                        />
                      </div>
                      <div className="col-md-2 pl-0 pr-0">
                        <select
                          className="form-control form-select"
                          value={reason_time}
                          onChange={(event) =>
                            setReasonTime(event.target.value)
                          }
                        >
                          <option value="minutes">{strings.MIN}</option>
                          <option value="hours">{strings.HOURS}</option>
                          <option value="days">{strings.DAYS}</option>
                          <option value="weeks">{strings.WEEKS}</option>
                          <option value="months">{strings.MONTHS}</option>
                        </select>
                      </div>
                      <div
                        className="col-md-1 pr-0 pl-0"
                        style={{ margin: 'auto', textAlign: 'center' }}
                      ></div>
                      <div
                        className="col-md-1 pr-0 pl-0"
                        style={{ margin: 'auto', textAlign: 'center' }}
                      ></div>
                    </div>
                  </div>
                )}
              </>
            )}

            {name === 'roll' && (
              <div className="mt-10">
                <label className="mb-5 control-label">
                  {strings.default_roll}
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={command.roll_dice ? command.roll_dice : 100}
                  onChange={(event) =>
                    setCommand({ roll_dice: event.target.value })
                  }
                />
              </div>
            )}

            {name === 'warn' && (
              <div className="col mt-10">
                <div className="control-label"> {strings.Reasons} </div>
                {command.reasons &&
                  command.reasons?.map((element, index) => {
                    return (
                      <div key={index}>
                        <div
                          className={style.reasons_row}
                          style={index === 0 ? { marginTop: 0 } : {}}
                          key={index}
                        >
                          <input
                            style={{ flex: 1 }}
                            autoFocus={autoFocus}
                            className="form-control"
                            placeholder={strings.reason}
                            type="text"
                            value={command.reasons[index]}
                            onChange={(event) =>
                              handleWarnReasonEdit(index, event.target.value)
                            }
                          />
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className={`${style['reasons-arrows']} ${
                                index === 0
                                  ? style['reasons-disabled-arrow']
                                  : ''
                              }`}
                              onClick={() => moveReason('up', index)}
                            >
                              <i className="fas fa-chevron-up"></i>
                            </div>
                            <div
                              className={`${style['reasons-arrows']} ${
                                command.reasons.length === index + 1
                                  ? style['reasons-disabled-arrow']
                                  : ''
                              }`}
                              onClick={() => moveReason('down', index)}
                            >
                              <i className="fas fa-chevron-down"></i>
                            </div>
                            <i
                              onClick={() => deleteReason(index)}
                              className={style['red-minus-circle-icon']}
                            >
                              -
                            </i>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                <div>
                  {command.reasons?.length < 25 && (
                    <input
                      className="form-control"
                      placeholder={strings.reason}
                      ref={addReason}
                      type="text"
                      value={reason_text}
                      onChange={(event) =>
                        handleWarnReasonAdd(event.target.value)
                      }
                      disabled={command.reasons.length > 24}
                    />
                  )}
                </div>
              </div>
            )}

            {name === 'points' && (
              <div className="col mt-10">
                <div className="mb-5 control-label">
                  {' '}
                  {strings.POINTS_MANAGERS}{' '}
                </div>
                <Select
                  onChange={(value) =>
                    setCommand({
                      managers: value.map((target) => target.value)
                    })
                  }
                  value={
                    guild.roles &&
                    command.managers &&
                    guild.roles
                      .filter((r) => command.managers.includes(r.id))
                      .map((r) => {
                        return {
                          label: r.name,
                          value: r.id,
                          color: r.color
                        }
                      })
                  }
                  classNamePrefix="formselect"
                  components={makeAnimated()}
                  options={
                    guild.roles &&
                    guild.roles
                      .filter((role) => {
                        if (role.id === guild.id) return false
                        if (
                          command.disabledRoles &&
                          command.disabledRoles.filter(
                            (r) => r.value === role.id
                          ).length > 0
                        )
                          return false
                        return true
                      })
                      .map((role) => {
                        return {
                          label: role.name,
                          value: role.id,
                          color: role.color
                        }
                      })
                  }
                  isMulti
                  placeholder={strings.select_placeholder_select}
                  styles={ROLES_STYLES}
                  noOptionsMessage={() => strings.no_option}
                  menuPortalTarget={document.body}
                />
              </div>
            )}
            <div className={style.row_footer}>
              <h3>{strings.DELETE_WITH_MESSAGE_DELETION}</h3>
              <Switch
                onChange={() =>
                  setCommand({
                    deletewithinvocation: !command.deletewithinvocation
                  })
                }
                checked={command.deletewithinvocation}
                value={command.deletewithinvocation}
                onColor="#5865F2"
                handleDiameter={17}
                height={20}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                aria-label="reaction role"
                width={35}
                className="dramexSwi"
                id="material-switch"
              />
            </div>
            <div className={style.row_footer}>
              <h3>{strings.AUTO_INVOCATION}</h3>
              <Switch
                onChange={() =>
                  setCommand({ deleteCommandMsg: !command.deleteCommandMsg })
                }
                checked={command.deleteCommandMsg}
                value={command.deleteCommandMsg}
                onColor="#5865F2"
                handleDiameter={17}
                height={20}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                aria-label="reaction role"
                width={35}
                className="dramexSwi"
                id="material-switch"
              />
            </div>
            <div className={style.row_footer}>
              <h3>{strings.AUTO_DELETE_REPLY}</h3>
              <Switch
                onChange={() =>
                  setCommand({ deleteReply: !command.deleteReply })
                }
                checked={command.deleteReply}
                value={command.deleteReply}
                onColor="#5865F2"
                handleDiameter={17}
                height={20}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                aria-label="reaction role"
                width={35}
                className="dramexSwi"
                id="material-switch"
              />
            </div>
            <div className={style['unsaved-command'] + ' col-md-10'}>
              <button
                onClick={() => {
                  if (loading) return
                  setLoading(true)
                  updateCommand(command)
                    .then(() => {
                      setLoading(false)
                      Toast.fire({
                        icon: 'success',
                        title: strings.command_saved_success?.replace(
                          '{0}',
                          '/' + name
                        )
                      })
                      router.push(
                        { pathname: '', query: router.query },
                        undefined,
                        {
                          scroll: false
                        }
                      )
                    })
                    .catch((err) => {
                      Toast.fire({
                        icon: 'error',
                        title: err.response.data.error
                      })
                      setLoading(false)
                    })
                }}
                className={`${style.btn} ${open ? style.activeBtn : ''}`}
              >
                <i className="fas fa-save" style={{ fontSize: '1rem' }}></i>
                {strings.SAVE_CHANGES}
              </button>
              <button
                className="tw-rounded-[5px]"
                onClick={() => {
                  setCommand({ ...defaultValues, ...guild.commands[name] })
                }}
              >
                {strings.cancel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
