import { useContext, useState } from 'react'
import { Context } from '@script/_context'
import PagesTitle from '@component/PagesTitle'
import Unsaved from '@component/unsaved'
import strings from '@script/locale'
import Select from 'react-select'
import Switch from 'react-switch'
import Premium from '@component/premium/pricing'
import { CountingComponent } from '@component/fields'
import TooltipSlider from '@component/TooltipSlider.tsx'
import { ROLES_STYLES } from '@script/constants'
import SelectChannels from '@component/SelectChannels'

export default function TempLink() {
  const { guild, rtl } = useContext(Context)
  const [state, setStates] = useState(guild?.linksettings || {})

  const setState = (object) =>
    setStates((prevState) => ({ ...prevState, ...object }))

  if (!guild.vip) return <Premium />

  return (
    <>
      <PagesTitle
        data={{
          name: 'Link',
          description: 'Link_description',
          module: 'link'
        }}
      />
      <Unsaved
        method="linksettings"
        state={state}
        setStates={setStates}
        default={{
          link_command: strings.link_command,
          link_onorder: strings.link_onorder,
          link_onlink: strings.link_onlink,
          link_onfiald: strings.link_onfiald,
          link_channelsstatus: 'disable',
          link_channels: [],
          link_rolesstatus: 'disable',
          link_roles: [],
          link_maxage: 1430,
          link_uses: 3,
          link_defaultchannel: null,
          link_daily: 1,
          link_waittime: 6,
          link_waittext: strings.link_waittext,
          link_skip: true,
          deleteMsg: false
        }}
      />

      <label className="control-label" htmlFor="command">
        {strings.command}
      </label>
      <input
        className="form-control"
        type="text"
        id="command"
        placeholder={strings.Trigger}
        value={state?.link_command || ''}
        onChange={(value) => setState({ link_command: value.target.value })}
      />

      <label className="control-label mt-10" htmlFor="message_on_link_request">
        {strings.message_on_link_request}
      </label>
      <textarea
        label={strings.message_on_link_request}
        id="message_on_link_request"
        className="form-control"
        placeholder={strings.type_here}
        value={state.link_onorder || ''}
        onChange={(value) => setState({ link_onorder: value.target.value })}
      />

      <label className="control-label mt-10" htmlFor="message_on_link_field">
        {strings.message_on_link_field}
      </label>
      <textarea
        label={strings.message_on_link_field}
        id="message_on_link_field"
        className="form-control"
        placeholder={strings.type_here}
        value={state.link_onfiald || ''}
        onChange={(value) => setState({ link_onfiald: value.target.value })}
      />

      <div className="form-group pt-1">
        <div className="mt-10">
          <div className="row row-cols-1 row-cols-sm-2">
            <div className="col">
              <select
                className="simpleSelect mt-10"
                value={state.link_rolesstatus || 'disable'}
                onChange={(value) =>
                  setState({ link_rolesstatus: value.target.value })
                }
              >
                <option className="simpleOption" value="disable">
                  {strings.DISABLED_ROLES}
                </option>
                <option className="simpleOption" value="enable">
                  {strings.ENABLED_ROLES}
                </option>
              </select>

              <Select
                value={
                  guild.roles &&
                  guild.roles
                    .filter((r) => state.link_roles?.includes(r.id))
                    .map((r) => {
                      return { label: r.name, value: r.id, color: r.color }
                    })
                }
                options={
                  guild?.roles &&
                  guild?.roles
                    .filter((role) => role.id !== guild?.id && !role.managed)
                    .map((role) => ({
                      label: role.name,
                      value: role.id,
                      color: role.color
                    }))
                }
                isMulti
                onChange={(val) =>
                  setState({ link_roles: val ? val.map((v) => v.value) : [] })
                }
                classNamePrefix="formselect"
                styles={ROLES_STYLES}
                className="mt-5"
                placeholder={strings.select_placeholder_select}
                noOptionsMessage={() => strings.no_option}
              />
            </div>
            <div className="col">
              <select
                className="simpleSelect mt-10 tw-mb-1"
                value={state.link_channelsstatus || 'disable'}
                onChange={(value) =>
                  setState({ link_channelsstatus: value.target.value })
                }
              >
                <option className="simpleOption" value="disable">
                  {strings.DISABLED_CHANNELS}
                </option>
                <option className="simpleOption" value="enable">
                  {strings.ENABLED_CHANNELS}
                </option>
              </select>
              <SelectChannels
                handleChange={(targets) => {
                  setState({
                    link_channels: targets ? targets.map((v) => v.value) : []
                  })
                }}
                handleRemove={(target) => {
                  setState({
                    link_channels: state.link_channels.filter(
                      (channel) => target.value !== channel
                    )
                  })
                }}
                selectedValue={
                  guild.channels &&
                  guild.channels
                    .filter(
                      (channel) =>
                        [0, 4, 5]?.includes(channel.type) &&
                        state.link_channels?.includes(channel.id)
                    )
                    .map((channel) => ({
                      ...channel,
                      label: channel.name,
                      value: channel.id
                    }))
                }
                isMulti
                placeholder="Select channels"
              />
            </div>
          </div>
        </div>
      </div>

      <label className="control-label mt-10" htmlFor="text_with_link">
        {strings.text_with_link}
      </label>
      <textarea
        type="text"
        id="text_with_link"
        placeholder={strings.type_here}
        className="form-control"
        value={state.link_onlink || ''}
        onChange={(value) => setState({ link_onlink: value.target.value })}
      />

      <div className="row row-cols-1 mt-15 row-cols-sm-2">
        <div className="col">
          <label htmlFor="usesRange" className="txt-LightBlack mt-10">
            {strings.link_uses}:{' '}
            {!state.link_uses || state.link_uses === 0 ? '∞' : state.link_uses}
          </label>

          <div className="form-group mr-5 ml-5 ">
            <TooltipSlider
              id="usesRange"
              max={100}
              min={0}
              className="mt-2 mb-2"
              value={state.link_uses || 0}
              onChange={(value) => setState({ link_uses: Math.floor(value) })}
              tipFormatter={(val) => (val === 0 ? '∞' : val)}
            />
          </div>
          <div className="mt-15 pt-1">
            <label
              className="control-label mt-15 tw-mb-1"
              htmlFor="link_default_channel"
            >
              {strings.link_default_channel}
            </label>
            {console.log(
              state.link_defaultchannel &&
              guild.channels &&
              guild.channels.find(
                (channel) => channel.id === state.link_defaultchannel
              )
            )}
            {/* <Select
              value={
                guild.channels &&
                guild.channels
                  .filter(
                    (channel) =>
                      [0, 5]?.includes(channel.type) &&
                      state.link_defaultchannel === channel.id
                  )
                  .map((channel) => ({
                    label: channel.name,
                    value: channel.id,
                  }))
              }
              onChange={(val) => setState({ link_defaultchannel: val.value })}
              classNamePrefix="formselect"
              options={
                guild.channels &&
                guild.channels
                  .filter((channel) => [0, 5]?.includes(channel.type))
                  .map((channel) => ({
                    label: channel.name,
                    value: channel.id,
                  }))
              }
              placeholder={strings.select_placeholder_select}
              noOptionsMessage={() => strings.no_option}
            /> */}
            <SelectChannels
              handleChange={(target) => {
                setState({
                  link_defaultchannel: target.value
                })
              }}
              handleRemove={() => {
                setState({
                  link_defaultchannel: ''
                })
              }}
              selectedValue={
                state.link_defaultchannel &&
                guild.channels &&
                guild.channels.find(
                  (channel) => channel.id === state.link_defaultchannel
                )
              }
              placeholder="Select channels"
            />
          </div>
        </div>
        <div className="col d-flex justify-content-end flex-column">
          <label className="control-label mt-10" htmlFor="link_age">
            {strings.link_age}
          </label>
          <CountingComponent
            type="number"
            id="link_age"
            min={0}
            max={1440}
            name="link_age"
            className="form-control input-lg full-width"
            value={state.link_maxage > 1440 ? 1440 : state.link_maxage || ''}
            onChange={(value) =>
              setState({
                link_maxage: Number(value)
              })
            }
          />

          <label className="control-label mt-10" htmlFor="link_wait_time">
            {strings.link_wait_time}
          </label>
          <CountingComponent
            type="number"
            id="link_wait_time"
            min={1}
            name="link_wait_time"
            className="form-control input-lg full-width"
            value={state.link_waittime}
            onChange={(value) => setState({ link_waittime: Number(value) })}
          />

          <label className="control-label mt-10" htmlFor="link_limit">
            {strings.link_limit}
          </label>
          <CountingComponent
            type="number"
            id="link_limit"
            name="link_limit"
            min={1}
            className="form-control input-lg full-width"
            value={state.link_daily}
            onChange={(value) => setState({ link_daily: Number(value) })}
          />
        </div>
      </div>
      <label className="control-label mt-10" htmlFor="link_wait_message">
        {strings.link_wait_message}
      </label>
      <textarea
        type="text"
        id="link_wait_message"
        name="link_wait_message"
        className="form-control"
        placeholder={strings.type_here}
        value={state.link_waittext || ''}
        onChange={(value) => setState({ link_waittext: value.target.value })}
      />

      <div className="d-flex justify-content-between mt-20 align-items-center">
        <div>
          <label
            className="control-label mt-10"
            htmlFor="link_disable_wait"
            onClick={() => setState({ link_skip: !state.link_skip })}
          >
            {strings.link_disable_wait}
          </label>
          <span className="ms-3">({strings.link_invite_permission})</span>
        </div>
        <Switch
          onChange={(value) => setState({ link_skip: value })}
          checked={state.link_skip || false}
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
      <div className="d-flex justify-content-between mt-20 align-items-center">
        <label
          className="control-label mt-10"
          htmlFor="link_disable_wait"
          onClick={() => setState({ deleteMsg: !state.deleteMsg })}
        >
          {strings.link_auto_delete}
        </label>
        <Switch
          onChange={(value) => setState({ deleteMsg: value })}
          checked={state.deleteMsg || false}
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
    </>
  )
}
