import { useContext, useEffect, useState } from "react";
import { Context } from "@script/_context";
import PagesTitle from "@component/PagesTitle";
import Unsaved from "@component/unsaved";
import strings from "@script/locale";
import Switch from "react-switch";
import Premium from "@component/premium/pricing";
import Select from "react-select";
import TooltipSlider from "@component/TooltipSlider.tsx";
import { CountingComponent } from "@component/fields";


export default function AntiRaid() {
  const {guild} = useContext(Context);
	const [state, setStates] = useState(guild?.anti_raid || {});
	const setState = (object) => setStates((prevState) =>({ ...prevState, ...object }));

  if (!guild.vip) return <Premium />;
  return (
    <>
      <PagesTitle
        data={{
          name: "anti_raid",
          description: "anti_raid_description",
          module: "anti_raid",
        }}
      />
      <Unsaved
        method="anti_raid"
        state={state}
        setStates={setStates}
        default={{
          action: "null", // could be also ban and mute
          actionOptions: {
            welcomer_disabled: true, // system disables welcomer whenever a raid starts
            duration: {
              number: 1,
              type: "months",
            },
          },
          account_age: "3_months",
          list: {
            length: 15,
            timeToAct: 5,
          },
          message: {
            channel: null, // channel snowflake(id)
            start: `@admins \n A raid has been started and the bot started to take action ....`, // message to send when raid starts
            end: `Raid has ended, Raided Users: [users]`, // message to send when raid ends
          },
        }}
      />
      <label className="control-label" htmlFor="account_age">
        {strings.account_age}
      </label>
      <select
        id="account_age"
        className="form-control"
        value={state?.account_age}
        onChange={(event) => {
          setState({ account_age: event.target.value });
        }}
      >
        <option value="1_week">{strings["1_weeks"]}</option>
        <option value="1_months">{strings["1_months"]}</option>
        <option value="3_months">{strings["3_months"]}</option>
        <option value="NONE">{strings.NONE}</option>
      </select>

      <label className="control-label mt-10" htmlFor="list_length">
        {strings.list_length}:{" "}{state?.list?.length}
      </label>
      
      <TooltipSlider
        id="list_length"
        min={5}
        type="number"
        value={state?.list?.length}
        onChange={(value) =>
          setState({
            list: {
              ...state?.list,
              length: value,
            },
          })
        }
      />

      <label className="control-label mt-10" htmlFor="list_time">
        {strings.list_time} ({strings.SECONDS})
      </label>
      <CountingComponent
        id="list_time"
        min={5}
        max={300}
        className="form-control"
        value={state?.list?.timeToAct}
        onChange={(value) =>
          setState({
            list: {
              ...state?.list,
              timeToAct: value,
            },
          })
        }
      />

      <div className="form-group mt-10">
        <label
          className="control-label"
          style={{ marginInlineEnd: "0.5rem", color: "#EB459E" }}
        >
          {strings.how_it_works}:
        </label>
        <label className="control-label tt-none">
          {strings.formatString(
            strings.anti_raid_work,
            state?.list?.length || "",
            state?.list?.timeToAct > 300 ? 300 : state?.list?.timeToAct || "",
            strings.SECONDS,
            strings[state?.account_age?.replace("week", "weeks")] || ""
          )}
        </label>
      </div>

      <label className="control-label mt-10" htmlFor="action_take">
        {strings.action_take}
      </label>
      <select
        id="action_take"
        className="form-control"
        value={state?.action}
        onChange={(e) => {
          setState({ action: e.target.value });
        }}
      >
        <option value="null">{strings.no_action}</option>
        <option value="ban">{strings.action_ban}</option>
        <option value="mute">{strings.action_mute}</option>
      </select>

      {(state?.action === "ban" || state?.action === "mute") && (
        <>
          <label className="control-label mt-10">{strings.DURATION}</label>
          <div className="form-group d-flex">
            <input
              type="number"
              className="form-control anti-raid-ninput"
              value={state?.actionOptions?.duration.number}
              placeholder={strings.DURATION}
              min="1"
              onChange={(e) =>
                setState({
                  actionOptions: {
                    ...state?.actionOptions,
                    duration: {
                      ...state?.actionOptions?.duration,
                      number: e.target.value,
                    },
                  },
                })
              }
            />
            <select
              className="form-control"
              value={state?.actionOptions?.duration.type}
              onChange={(e) =>
                setState({
                  actionOptions: {
                    ...state?.actionOptions,
                    duration: {
                      ...state?.actionOptions?.duration,
                      type: e.target.value,
                    },
                  },
                })
              }
            >
              <option value="hours">{strings.HOURS}</option>
              <option value="days">{strings.DAYS}</option>
              <option value="months">{strings.MONTHS}</option>
            </select>
          </div>
        </>
      )}

      <div className="d-flex justify-content-between mt-10 mb-10 align-items-center"
      >
        <label         onClick={() =>
          setState({
            actionOptions: {
              ...state?.actionOptions,
              welcomer_disabled: !state?.actionOptions?.welcomer_disabled,
            },
          })
        } className="control-label tt-none">
          {strings.raid_welcomer_disabled}
        </label>
        <Switch
          checked={state?.actionOptions?.welcomer_disabled}
          onChange={(bool) =>
            setState({
              actionOptions: {
                ...state?.actionOptions,
                welcomer_disabled: bool,
              },
            })
          }
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

      <label className="control-label" htmlFor="send_message_channel">
        {strings.send_message_channel}
      </label>

      <Select
        value={
          guild.channels &&
          guild.channels
            .filter(
              (channel) =>
                state?.message?.channel === channel.id
            )
            .map((channel) => ({ label: "#"+channel.name, value: channel.id }))
        }
        onChange={(val) => setState({ message: { ...state?.message, channel: val.value } })}
        classNamePrefix="formselect"
        options={
          guild.channels &&
          guild.channels
            .filter((channel) => channel.type === 0)
            .map((channel) => ({ label: "#"+channel.name, value: channel.id }))
        }
        placeholder={strings.select_placeholder_select}
      />

      <label className="control-label mt-10" htmlFor="message_anti_raid_start">
        {strings.message_anti_raid_start}
      </label>
      <textarea
        id="message_anti_raid_start"
        className="form-control"
        placeholder={strings.type_here}
        onChange={(e) =>
          setState({ message: { ...state?.message, start: e.target.value } })
        }
        value={state?.message?.start}
      />

      <label className="control-label mt-10" htmlFor="message_anti_raid_end">
        {strings.message_anti_raid_end}
      </label>
      <textarea
        id="message_anti_raid_end"
        placeholder={strings.type_here}
        className="form-control"
        onChange={(e) =>
          setState({ message: { ...state?.message, end: e.target.value } })
        }
        value={state?.message?.end}
      />

      <label className="control-label mt-10">{strings.Variables}:</label>
      <p>
        <code>[usersNames]</code> {strings.users_names}
      </p>
      <p>
        <code>[users]</code> {strings.users_mentions}
      </p>
      <p>
        <code>[usersCount]</code> {strings.users_amount}
      </p>
    </>
  );
}
