import { useContext, useEffect, useState } from 'react'
import { Context } from '@script/_context'
import strings from '@script/locale'
import Switch from 'react-switch'
import PagesTitle from '@component/PagesTitle'
import Unsaved from '@component/unsaved'
import ProUploader from '@component/prouploader'
import { CountingComponent } from '../../../components/fields'
import ColorPicker from '@component/ColorPicker'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import Modal from 'react-modal'

import dynamic from 'next/dynamic'
import { WELCOMER_INITIAL_DATA, WELCOMER_TEMPLATES } from '@script/constants'
const WelcomeEditor = dynamic(
  () => import('../../../components/welcome_editor'),
  {
    ssr: false
  }
)
export default function Welcomer() {
  const { guild, rtl } = useContext(Context)
  const [state, setStates] = useState(guild?.welcome_2_settings || {})
  const setState = (object) =>
    setStates((prevState) => ({ ...prevState, ...object }))

  const [imageFilter, setImageFilter] = useState('Background')
  const [openTemplates, setOpenTemplates] = useState(false)

  const filerData = [
    { string: 'Background', icon: 'fas fa-images' },
    { string: 'Avatar', icon: 'fas fa-user-circle' },
    { string: 'Username', icon: 'fas fa-text-width' },
    { string: 'Text', icon: 'fas fa-text-width' }
  ]

  return (
    <>
      <PagesTitle
        data={{
          name: 'WELCOMER',
          module: 'welcomer'
        }}
      />
      <Unsaved
        method="welcome_2_settings"
        state={state}
        setStates={setStates}
        default={WELCOMER_INITIAL_DATA}
      />
      <Modal
        isOpen={openTemplates}
        className={`smallModal welcomer-template-modal${rtl ? ' rtl' : ''}`}
        parentSelector={() => document.getElementById('main')}
        onRequestClose={() => setOpenTemplates(false)}
      >
        <div className="Modalhead">
          <h5>
            <i className="fas fa-images"></i> {strings.welcome_select_template}
          </h5>
          <button onClick={() => setOpenTemplates(false)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <div className='welcomer-template-container'>
            {WELCOMER_TEMPLATES.map((template, index) => (
              <div key={`template-${index}`} className="welcomer-template">
                <WelcomeEditor
                  state={{
                    ...state,
                    ...template
                  }}
                  allowEdit={false}
                  setState={() => {}}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setState({
                      ...template
                    })
                    setOpenTemplates(false)
                  }}
                >
                  {strings.welcome_use_template}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-primary"
            onClick={() => setOpenTemplates(false)}
          >
            {strings.close}
          </button>
        </div>
      </Modal>
      <div className="row-container">
        <div className="welcome-row">
          <div className="welcome-row-header">
            <h1>{strings.WELCOME_MESSAGE}</h1>
            <Switch
              checked={state.textEnable ? state.textEnable : false}
              onChange={(value) => {
                setState({ textEnable: value })
              }}
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
          {state.textEnable ? (
            <div>
              <textarea
                className="form-control mt-5"
                placeholder={strings.type_here}
                value={state.textMsg}
                onChange={(event) => setState({ textMsg: event.target.value })}
              />
              <div className="d-flex gap-5 welcomer__variables-send">
                <div className="mt-20 mb-5 variablesRtl welcomer-variables">
                  <h5>{strings.Variables}:</h5>
                  <p>
                    <code>[user]</code> {strings.welcomer_variable_user}
                  </p>
                  <p>
                    <code>[userName]</code> {strings.welcomer_variable_username}
                  </p>
                  <p>
                    <code>[memberCount]</code>{' '}
                    {strings.welcomer_variable_membercount}
                  </p>
                  <p>
                    <code>[server]</code> {strings.welcomer_variable_server}
                  </p>
                  <p>
                    <code>[inviter]</code> {strings.welcomer_variable_inviter}{' '}
                    <span className="vip-component-tag">{strings.Premium}</span>{' '}
                  </p>
                  <p>
                    <code>[inviterName]</code>{' '}
                    {strings.welcomer_variable_invitername}{' '}
                    <span className="vip-component-tag">{strings.Premium}</span>{' '}
                  </p>
                  <p>
                    <code>[invites]</code> {strings.user_invites_counter}{' '}
                    <span className="vip-component-tag">{strings.Premium}</span>{' '}
                  </p>
                </div>
                <div className="mt-20 mb-5 welcomer-send">
                  <h5>{strings.send}:</h5>
                  <div>
                    <div className="radio-item">
                      <input
                        type="radio"
                        id="welcomer-send__dm"
                        name="welcomer-text"
                        value="sendTo"
                        onChange={() => setState({ textSendTo: 'DM' })}
                        checked={state.textSendTo === 'DM'}
                      />
                      <label
                        className="control-label"
                        htmlFor="welcomer-send__dm"
                      >
                        {strings.SEND_AS_DM}
                      </label>
                      <br />
                    </div>
                    <div>
                      <div className="radio-item mb-5">
                        <input
                          type="radio"
                          id="welcomer-send__to-channel"
                          name="welcomer-text"
                          value="option2"
                          onChange={() => setState({ textSendTo: 0 })}
                          checked={
                            state.textSendTo !== null &&
                            state.textSendTo !== 'DM'
                          }
                        />
                        <label
                          className="control-label"
                          htmlFor="welcomer-send__to-channel"
                        >
                          {strings.SEND_TO_CHANNEL}
                        </label>
                      </div>
                      {state.textSendTo !== null &&
                        state.textSendTo !== 'DM' && (
                          <Select
                            value={
                              guild.channels.find(
                                (c) => c.id === state.textSendTo
                              )
                                ? {
                                    label: `#${
                                      guild.channels.find(
                                        (c) => c.id === state.textSendTo
                                      ).name
                                    }`,
                                    value: state.textSendTo
                                  }
                                : ''
                            }
                            onChange={(e) => setState({ textSendTo: e.value })}
                            classNamePrefix="formselect"
                            components={makeAnimated()}
                            options={guild.channels
                              .filter((c) => [0, 5].includes(c.type))
                              .map((c) => ({
                                label: `#${c.name}`,
                                value: c.id
                              }))}
                            placeholder={strings.select_placeholder_select}
                            noOptionsMessage={() => strings.no_option}
                          />
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
        <div className="welcome-row">
          <div className="welcome-row-header">
            <h1>{strings.WELCOME_IMAGE}</h1>
            <Switch
              checked={state.designEnable ? state.designEnable : false}
              onChange={(value) => {
                setState({ designEnable: value })
              }}
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
          {state.designEnable ? (
            <>
              <div className="welcomer-design-mode">
                <span>{strings.send}:</span>
                <div>
                  <div className="radio-item">
                    <input
                      type="radio"
                      id="welcomer-send_with"
                      name="welcomer-designSendTo"
                      onChange={() => setState({ designSendTo: 'WITH' })}
                      value="sendTo"
                      checked={state.designSendTo === 'WITH'}
                    />
                    <label
                      className="control-label"
                      htmlFor="welcomer-send_with"
                    >
                      {strings.WITH_TEXT}
                    </label>
                    <br />
                  </div>
                  <div className="radio-item">
                    <input
                      type="radio"
                      id="welcomer-send__before"
                      name="welcomer-designSendTo"
                      onChange={() => setState({ designSendTo: 'BEFORE' })}
                      value="sendTo"
                      checked={state.designSendTo === 'BEFORE'}
                    />
                    <label
                      className="control-label"
                      htmlFor="welcomer-send__before"
                    >
                      {strings.BEFORE_TEXT}
                    </label>
                    <br />
                  </div>
                  <div className="radio-item">
                    <input
                      type="radio"
                      id="welcomer-image-channel"
                      name="welcomer-designSendTo"
                      value="sendTo"
                      onChange={() => setState({ designSendTo: 0 })}
                      checked={
                        state.designSendTo !== null &&
                        state.designSendTo !== 'BEFORE' &&
                        state.designSendTo !== 'WITH'
                      }
                    />
                    <label
                      className="control-label"
                      htmlFor="welcomer-image-channel"
                    >
                      {strings.to_channel}
                    </label>
                    <br />
                  </div>
                  {state.designSendTo !== null &&
                    state.designSendTo !== 'BEFORE' &&
                    state.designSendTo !== 'WITH' && (
                      <div className="width-25 align-self-center">
                        <Select
                          value={
                            guild.channels.find(
                              (c) => c.id === state.designSendTo
                            )
                              ? {
                                  label: `#${
                                    guild.channels.find(
                                      (c) => c.id === state.designSendTo
                                    ).name
                                  }`,
                                  value: state.designSendTo
                                }
                              : ''
                          }
                          classNamePrefix="formselect"
                          onChange={(e) => setState({ designSendTo: e.value })}
                          components={makeAnimated()}
                          options={guild.channels
                            .filter((c) => [0, 5].includes(c.type))
                            .map((c) => ({ label: `#${c.name}`, value: c.id }))}
                          placeholder={strings.select_placeholder_select}
                          noOptionsMessage={() => strings.no_option}
                        />
                      </div>
                    )}
                </div>
              </div>
              <div className="d-flex justify-content-center mt-10 welcome-editor">
                {/* <img className="w-50" src="https://probot.media/KQcRU16M0r.png" alt="hi" /> */}
                <WelcomeEditor state={state} setState={setState} />
              </div>
              <div className="flex justify-content-between align-items-center flex-wrap gap-2 mb-10">
                <ul className="welcomer-image__filter">
                  {filerData.map((data, index) => (
                    <li
                      key={index}
                      className={imageFilter === data.string ? 'active' : ''}
                      onClick={() => setImageFilter(data.string)}
                    >
                      <i className={data.icon}></i>
                      {strings[data.string]}
                    </li>
                  ))}
                </ul>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setOpenTemplates(true)
                  }}
                >
                  {strings.welcome_use_template}
                </button>
              </div>
              {imageFilter === 'Background' && (
                <>
                  <div className="two-inputs-row">
                    <div>
                      <label className="control-label" htmlFor="Background">
                        {strings.Background}
                      </label>
                      <select
                        name="server-embeds"
                        id="Background"
                        className="form-control form-select"
                        value={state.backgroundType}
                        onChange={(event) =>
                          setState({ backgroundType: event.target.value })
                        }
                      >
                        <option value="transparent">
                          {strings.transparent}
                        </option>
                        <option value="image">{strings.embed_image}</option>
                      </select>
                    </div>
                    {state.backgroundType === 'image' && (
                      <div>
                        <label className="control-label" htmlFor="embed_image">
                          {strings.embed_image}
                        </label>
                        <div>
                          <ProUploader
                            id={guild.id}
                            type="guild"
                            module="welcome"
                            value={state.welcome_background}
                            onChange={(value) =>
                              setState({ welcome_background: value })
                            }
                            acceptFiles="image/png, image/jpg, image/jpeg"
                            maxSize={3000000}
                          />
                        </div>
                      </div>
                    )}

                    {state.backgroundType === 'transparent' && (
                      <div>
                        <label className="control-label" htmlFor="WIDTH">
                          {strings.WIDTH}
                        </label>
                        <CountingComponent
                          value={state.Transparent.width}
                          onChange={(v) =>
                            setState({
                              Transparent: { ...state.Transparent, width: v }
                            })
                          }
                          className="full-width"
                        />
                      </div>
                    )}
                  </div>

                  <div className="two-inputs-row">
                    {state.backgroundType === 'transparent' && (
                      <div>
                        <label className="control-label" htmlFor="HEIGHT">
                          {strings.HEIGHT}
                        </label>
                        <CountingComponent
                          value={state.Transparent.height}
                          onChange={(v) =>
                            setState({
                              Transparent: { ...state.Transparent, height: v }
                            })
                          }
                          className="full-width"
                        />
                      </div>
                    )}
                  </div>
                </>
              )}

              {imageFilter === 'Avatar' && (
                <>
                  <div className="two-inputs-row">
                    <div>
                      <label className="control-label" htmlFor="AVATAR_TYPE">
                        {strings.AVATAR_TYPE}
                      </label>
                      <select
                        name="server-embeds"
                        id="AVATAR_TYPE"
                        className="form-control form-select"
                        value={state.avatar_type}
                        onChange={(e) =>
                          setState({ avatar_type: e.target.value })
                        }
                      >
                        <option value="square">{strings.SQUARE}</option>
                        <option value="circle">{strings.CIRCLE}</option>
                      </select>
                    </div>
                    <div>
                      <label className="control-label" htmlFor="AVATAR_WIDTH">
                        {strings.AVATAR_WIDTH}
                      </label>
                      <CountingComponent
                        value={state.welcome_avatar_w}
                        onChange={(v) => setState({ welcome_avatar_w: v })}
                        className="full-width"
                        footer={strings.EDIT_IT_USING_MOUSE}
                      />
                    </div>
                  </div>
                  <div className="two-inputs-row mt-10">
                    <div>
                      <label className="control-label" htmlFor="AVATAR_HEIGHT">
                        {strings.AVATAR_HEIGHT}
                      </label>
                      <CountingComponent
                        value={state.welcome_avatar_h}
                        onChange={(v) => setState({ welcome_avatar_h: v })}
                        className="full-width"
                        footer={strings.EDIT_IT_USING_MOUSE}
                      />
                    </div>
                    <div>
                      <label
                        className="control-label"
                        htmlFor="Coordinate_left"
                      >
                        {strings.Coordinate_left}
                      </label>
                      <CountingComponent
                        value={state.welcome_avatar_left}
                        onChange={(v) => setState({ welcome_avatar_left: v })}
                        className="full-width"
                        footer={strings.EDIT_IT_USING_MOUSE}
                      />
                    </div>
                  </div>
                  <div className="two-inputs-row mt-10">
                    <div>
                      <label className="control-label" htmlFor="Coordinate_top">
                        {strings.Coordinate_top}
                      </label>
                      <CountingComponent
                        value={state.welcome_avatar_top}
                        onChange={(v) => setState({ welcome_avatar_top: v })}
                        className="full-width"
                        footer={strings.EDIT_IT_USING_MOUSE}
                      />
                    </div>
                  </div>
                </>
              )}
              {imageFilter === 'Username' && (
                <>
                  <div className="two-inputs-row">
                    <div>
                      <label className="control-label">
                        {strings.Coordinate_left}
                      </label>
                      <CountingComponent
                        value={state.welcome_name_left}
                        onChange={(v) => setState({ welcome_name_left: v })}
                        className="full-width"
                        footer={strings.EDIT_IT_USING_MOUSE}
                      />
                    </div>
                    <div>
                      <label className="control-label">
                        {strings.Coordinate_top}
                      </label>
                      <CountingComponent
                        value={state.welcome_name_top}
                        onChange={(v) => setState({ welcome_name_top: v })}
                        className="full-width"
                        footer={strings.EDIT_IT_USING_MOUSE}
                      />
                    </div>
                  </div>
                  <div className="two-inputs-row mt-10">
                    <div>
                      <label className="control-label">{strings.WIDTH}</label>
                      <CountingComponent
                        value={state.welcome_name_w}
                        onChange={(v) => setState({ welcome_name_w: v })}
                        className="full-width"
                        footer={strings.EDIT_IT_USING_MOUSE}
                      />
                    </div>
                    <div>
                      <label className="control-label">
                        {strings.TEXT_SIZE}
                      </label>
                      <CountingComponent
                        value={state.welcome_name_size}
                        onChange={(v) => setState({ welcome_name_size: v })}
                        className="full-width"
                        footer={strings.EDIT_IT_USING_MOUSE}
                      />
                    </div>
                  </div>
                  <div className="two-inputs-row mt-10">
                    <div>
                      <label className="control-label" htmlFor="AVATAR_HEIGHT">
                        {strings.TEXT_ALIGN}
                      </label>
                      <br />
                      <select
                        className="form-control form-select"
                        onChange={(e) =>
                          setState({ textAlign: e.target.value })
                        }
                        value={state.textAlign}
                      >
                        <option value="center">{strings.CENTER}</option>
                        <option value="left">{strings.LEFT}</option>
                        <option value="right">{strings.RIGHT}</option>
                      </select>
                    </div>
                    <div>
                      <label className="control-label">
                        {strings.TEXT_COLOR}
                      </label>
                      <br />
                      <ColorPicker
                        value={state.welcome_name_color}
                        onChange={(color) =>
                          setState({ welcome_name_color: color.hex })
                        }
                      />
                    </div>
                  </div>
                </>
              )}
              {imageFilter === 'Text' && (
                <>
                  <div className="two-inputs-row">
                    <div>
                      <label className="control-label">{strings.Text}</label>
                      <input
                        placeholder={strings.type_here}
                        value={state.welcome_text}
                        onChange={(e) =>
                          setState({ welcome_text: e.target.value })
                        }
                        type="text"
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label className="control-label">
                        {strings.Coordinate_left}
                      </label>
                      <CountingComponent
                        value={state.welcome_text_left}
                        onChange={(v) => setState({ welcome_text_left: v })}
                        className="full-width"
                        footer={strings.EDIT_IT_USING_MOUSE}
                      />
                    </div>
                  </div>
                  <div className="two-inputs-row mt-10">
                    <div>
                      <label className="control-label">
                        {strings.Coordinate_top}
                      </label>
                      <CountingComponent
                        value={state.welcome_text_top}
                        onChange={(v) => setState({ welcome_text_top: v })}
                        className="full-width"
                        footer={strings.EDIT_IT_USING_MOUSE}
                      />
                    </div>
                    <div>
                      <label className="control-label">
                        {strings.TEXT_SIZE}
                      </label>
                      <CountingComponent
                        value={state.welcome_text_size}
                        onChange={(v) => setState({ welcome_text_size: v })}
                        className="full-width"
                        footer={strings.EDIT_IT_USING_MOUSE}
                      />
                    </div>
                  </div>
                  <div className="two-inputs-row mt-10">
                    <div>
                      <label className="control-label">{strings.WIDTH}</label>
                      <br />
                      <CountingComponent
                        value={state.welcome_text_w}
                        onChange={(v) => setState({ welcome_text_w: v })}
                        className="full-width"
                        footer={strings.EDIT_IT_USING_MOUSE}
                      />
                    </div>
                    <div>
                      <label className="control-label">
                        {strings.TEXT_COLOR}
                      </label>
                      <br />
                      <ColorPicker
                        value={state.welcome_text_color}
                        onChange={(color) =>
                          setState({ welcome_text_color: color.hex })
                        }
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            ''
          )}
        </div>
        <div className="welcome-row">
          <div className="welcome-row-header">
            <h1>{strings.LEAVE_MESSAGE}</h1>
            <Switch
              checked={
                state.leaveMessage?.enabled ? state.leaveMessage.enabled : false
              }
              onChange={(value) => {
                setState({
                  leaveMessage: { ...state.leaveMessage, enabled: value }
                })
              }}
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
          {state.leaveMessage?.enabled ? (
            <div>
              <textarea
                className="form-control mt-5"
                placeholder={strings.type_here}
                value={state.leaveMessage?.content}
                onChange={(event) =>
                  setState({
                    leaveMessage: {
                      ...state.leaveMessage,
                      content: event.target.value
                    }
                  })
                }
              />
              <div className="d-flex gap-5 welcomer__variables-send">
                <div className="mt-20 mb-5 variablesRtl welcomer-variables">
                  <h5>{strings.Variables}:</h5>
                  <p>
                    <code>[user]</code> {strings.welcomer_variable_user}
                  </p>
                  <p>
                    <code>[userName]</code> {strings.welcomer_variable_username}
                  </p>
                  <p>
                    <code>[memberCount]</code>{' '}
                    {strings.welcomer_variable_membercount}
                  </p>
                  <p>
                    <code>[server]</code> {strings.welcomer_variable_server}
                  </p>
                </div>
                <div className="mt-20 mb-5 welcomer-send">
                  <label className="control-label">
                    {strings.SEND_TO_CHANNEL}:
                  </label>
                  <div>
                    <Select
                      value={
                        guild.channels.find(
                          (c) => c.id === state.leaveMessage?.textSendTo
                        )
                          ? {
                              label: `#${
                                guild.channels.find(
                                  (c) => c.id === state.leaveMessage.textSendTo
                                ).name
                              }`,
                              value: state.leaveMessage.textSendTo
                            }
                          : ''
                      }
                      onChange={(e) =>
                        setState({
                          leaveMessage: {
                            ...state.leaveMessage,
                            textSendTo: e.value
                          }
                        })
                      }
                      classNamePrefix="formselect"
                      components={makeAnimated()}
                      options={guild.channels
                        .filter((c) => [0, 5].includes(c.type))
                        .map((c) => ({ label: `#${c.name}`, value: c.id }))}
                      placeholder={strings.select_placeholder_select}
                      noOptionsMessage={() => strings.no_option}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </>
  )
}
