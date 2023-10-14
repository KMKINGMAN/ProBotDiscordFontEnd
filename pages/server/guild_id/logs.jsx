import { useContext, useState } from "react";
import { Context } from "@script/_context";
import Unsaved from "@component/unsaved";
import PagesTitle from "@component/PagesTitle";
import Switch from "react-switch";
import LogsStyle from "@style/logs.module.css";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import strings from "@script/locale";
import ColorPicker from "@component/ColorPicker";

export default function Logs() {
  const { guild } = useContext(Context);
  const [state, setStates] = useState(guild?.logs2 || {});
  const setState = (object) =>
    setStates((prevState) => ({ ...prevState, ...object }));

  const LOGS_KEYS = [
    "ban_member",
    "timeout",
    "create_channel",
    "create_thread",
    "create_role",
    "delete_channel",
    "delete_thread",
    "delete_messages",
    "delete_role",
    "edit_messages",
    "kick_member",
    "voice_move",
    "voice_disconnect",
    "member_joined",
    "member_left",
    "nickname_changed",
    "probot_mods",
    "member_role_given",
    "member_role_removed",
    "servers_invites",
    "unban_member",
    "update_channel",
    "update_thread",
    "update_channel_premissions",
    "update_role",
    "update_server",
    "voice_joined",
    "voice_left",
    "voice_state",
    "voice_switched",
  ];

  const LOGS_VIP_KEYS = ["voice_move", "voice_disconnect"];

  const checkVIPLogs = (cc) => guild.tier === 2 ? false : LOGS_VIP_KEYS.includes(cc);

  return (
    <>
      <PagesTitle
        data={{
          name: "Logs",
          description: "logs description",
          module: "logs",
        }}
      />
      <Unsaved method="logs2" state={state} setStates={setStates} default={LOGS_KEYS.map((key) => ({[key] : {enabled : false}})).reduce((acc, val) => Object.assign(acc, val))} />
      
      <div className={LogsStyle.logs_component}>
        {LOGS_KEYS.map((cc, index) => (
          <div key={index} className={LogsStyle.continuer}>
            <div className={LogsStyle.heder}>
              <h3
                htmlFor="material-switch"
                className={checkVIPLogs(cc) ? "" : "pointer"}
                onClick={() =>
                  !checkVIPLogs(cc) && setState({
                    [cc]: { ...state[cc], enabled: !state?.[cc]?.enabled },
                  })
                }
                >
                {strings[cc]}
              </h3>
              <Switch
                onChange={() =>
                  checkVIPLogs(cc) ? undefined :
                  setState({
                    [cc]: { ...state[cc], enabled: !state?.[cc]?.enabled },
                  })
                }
                checked={checkVIPLogs(cc) ? false : state?.[cc]?.enabled}
                value={state?.[cc]?.enabled}
                onColor="#5865F2"
                handleDiameter={27}
                height={30}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                aria-label="reaction role"
                width={60}
                id="material-switch"
              />
            </div>
            {LOGS_VIP_KEYS.includes(cc) ? <span className="vip-component-tag align-self-start m-0 mt-5">{strings.Premium} {strings.tier} 2</span> : null}
            <Select
              placeholder={strings.select_placeholder_select}
              onChange={({ value }) =>
                setState({ [cc]: { ...state[cc], channel: value } })
              }
              value={
                guild.channels
                  ?.map((channel) => ({
                    label: `#${channel.name}`,
                    value: channel.id,
                  }))
                  .find(
                    (channel) =>
                      channel.value && channel.value === state?.[cc]?.channel
                  ) || null
              }
              options={guild.channels
                ?.filter((channel) => channel.type === 0)
                .map((channel) => ({
                  label: `#${channel.name}`,
                  value: channel.id,
                }))}
              classNamePrefix="formselect"
              components={makeAnimated()}
              className={LogsStyle.select}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              isDisabled={checkVIPLogs(cc)}
              menuPortalTarget={document.body}
              noOptionsMessage={() => strings.no_option}
            />
            <div className={LogsStyle["color-bicker__continuer"]}>
              <label className="control-label" htmlFor={`color-bicker-${cc}`}>{strings.color}</label>
              <ColorPicker
                disabled={checkVIPLogs(cc)}
                value={state?.[cc]?.color}
                onChange={(value) =>
                  setState({ [cc]: { ...state[cc], color: value.hex } })
                }
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
