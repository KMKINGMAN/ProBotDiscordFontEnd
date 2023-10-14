import { useContext, useState } from "react";
import Select from "react-select";
import Switch from "react-switch";
import humanizeDuration from "humanize-duration";
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";

import { Context } from "@script/_context";
import PagesTitle from "@component/PagesTitle";
import Unsaved from "@component/unsaved";
import makeAnimated from "react-select/animated";
import strings from "@script/locale";
import { CHANNELS_STYLES, ROLES_STYLES } from "@script/constants";

import Command from "@component/Command";
import { CountingComponent } from "@component/fields";

import "@webscopeio/react-textarea-autocomplete/style.css";
import InfoIconWithText from "@component/InfoIconWithText";

export default function Leveling() {
  const { guild } = useContext(Context);
  const [state, setStates] = useState(guild?.leveling || {});
  const setState = (object) =>
    setStates((prevState) => ({ ...prevState, ...object }));

  const levels = [
    "0",
    "70",
    "277",
    "625",
    "1111",
    "1736",
    "2500",
    "3402",
    "4444",
    "5625",
    "6944",
    "8402",
    "10000",
    "11756",
    "13631",
    "15625",
    "17777",
    "20069",
    "22500",
    "25069",
    "27777",
    "30625",
    "33611",
    "36736",
    "40000",
    "42500",
    "46944",
    "50625",
    "54444",
    "58402",
    "62500",
    "66736",
    "71111",
    "75625",
    "80277",
    "85069",
    "90000",
    "95069",
    "100277",
    "105625",
    "111111",
    "116736",
    "122500",
    "128402",
    "134444",
    "140625",
    "146941",
    "153402",
    "160000",
    "166736",
    "172000",
    "177000",
    "180000",
    "190000",
    "202500",
    "210069",
    "217777",
    "225625",
    "233611",
    "250000",
    "258402",
    "262560",
    "275625",
    "284444",
    "300000",
    "310069",
    "333300",
    "348265",
    "369999",
    "380060",
    "399999",
    "412345",
    "438723",
    "455889",
    "472651",
    "491050",
    "500500",
    "520784",
    "533483",
    "554552",
    "578264",
    "589774",
    "610221",
    "629442",
    "640239",
    "678875",
    "691239",
    "711111",
    "728012",
    "742379",
    "759999",
    "770869",
    "794583",
    "809541",
    "821668",
    "843354",
    "860666",
    "888888",
    "900000",
    "930000",
    "950000",
  ];

  if (!state) return <></>;

  const Item = ({ entity: { name, char } }) => <div>{`${name}: ${char}`}</div>;

  return (
    <>
      <PagesTitle
        data={{
          name: "leveling_title",
          description: "leveling_description",
          module: "leveling",
        }}
      />
      <Unsaved
        method="leveling"
        state={state}
        setStates={setStates}
        default={{
          levelup_message: strings.leveling_default_levelup,
          no_xp_channels: [],
          no_xp_roles: [],
          levelup_channel: false,
          levelRewards: [],
        }}
      />
      <div className="row row-cols-1 row-cols-md-2">
        <div className="col">
          <label className="control-label" htmlFor="leveling_no_xp_roles">
            {strings.leveling_no_xp_roles}
          </label>
          <Select
            placeholder={strings.select_placeholder_select}
            value={
              guild.roles &&
              guild.roles
                .filter((r) => state.no_xp_roles?.includes(r.id))
                .map((r) => {
                  return { label: r.name, value: r.id, color: r.color };
                })
            }
            onChange={(val) =>
              setState({
                ...state,
                no_xp_roles: val ? val.map((val) => val.value) : [],
              })
            }
            options={
              guild.roles &&
              guild.roles
                .filter((role) => {
                  if (role.id === guild.id) return false;
                  return true;
                })
                .map((role) => {
                  return {
                    label: role.name,
                    value: role.id,
                    color: role.color,
                  };
                })
            }
            inputId="leveling_no_xp_roles"
            classNamePrefix="formselect"
            isMulti
            components={makeAnimated()}
            styles={ROLES_STYLES}
            noOptionsMessage={() => strings.no_option}
          />
        </div>
        <div className="col mt-md-15">
          <label className="control-label" htmlFor="leveling_no_xp_channels">
            {strings.leveling_no_xp_channels}
          </label>
          <Select
            placeholder={strings.select_placeholder_select}
            inputId="leveling_no_xp_channels"
            classNamePrefix="formselect"
            value={
              guild.channels &&
              guild.channels
                .filter((r) => state.no_xp_channels?.includes(r.id))
                .map((ch) => {
                  return {
                    label: `${ch.type === 0 ? "#" : "🔊 "}${ch.name}`,
                    value: ch.id,
                  };
                })
            }
            onChange={(val) =>
              setState({
                ...state.data,
                no_xp_channels: val ? val.map((val) => val.value) : [],
              })
            }
            options={
              guild.roles &&
              guild.channels
                .filter((ch) => ch.type === 0 || ch.type === 2)
                .map((ch) => {
                  return {
                    label: `${ch.type === 0 ? "#" : "🔊 "}${ch.name}`,
                    value: ch.id,
                  };
                })
            }
            isMulti
            components={makeAnimated()}
            styles={CHANNELS_STYLES}
            noOptionsMessage={() => strings.no_option}
          />
        </div>
        <div className="col mt-15">
          <label
            className="control-label"
            htmlFor="leveling_text_levelup_channel"
          >
            {strings.leveling_text_levelup_channel}
          </label>
          <Select
            placeholder={strings.select_placeholder_select}
            inputId="leveling_text_levelup_channel"
            classNamePrefix="formselect"
            value={
              guild.channels.find((c) => c.id === state.levelup_channel)
                ? {
                    label: `#${
                      guild.channels.find((c) => c.id === state.levelup_channel)
                        .name
                    }`,
                    value: state.levelup_channel,
                  }
                : state.levelup_channel === "current"
                ? { label: strings.leveling_current_channel, value: "current" }
                : { label: strings.leveling_disabled, value: "disabled" }
            }
            onChange={(val) =>
              setState({
                ...state,
                levelup_channel: val.value,
              })
            }
            options={[
              { label: strings.leveling_disabled, value: false },
              { label: strings.leveling_current_channel, value: "current" },
              ...guild.channels
                .filter((c) => [0, 5].includes(c.type))
                .map((c) => ({ label: `#${c.name}`, value: c.id })),
            ]}
            components={makeAnimated()}
            styles={CHANNELS_STYLES}
            noOptionsMessage={() => strings.no_option}
          />
        </div>
        {state.levelup_channel && (
          <div className="col mt-15" style={{ height: "fit-content" }}>
            <label className="control-label" htmlFor="leveling_levelup_message">
              {strings.leveling_levelup_message}
            </label>
            <ReactTextareaAutocomplete
              id="leveling_levelup_message"
              className="form-control"
              onChange={(event) =>
                setState({ levelup_message: event.target.value })
              }
              value={state?.levelup_message}
              placeholder={strings.leveling_levelup_message}
              loadingComponent={() => <span>Loading...</span>}
              minChar={0}
              style={{ direction: "ltr" }}
              containerClassName="autocomplete-list"
              trigger={{
                "[": {
                  dataProvider: (token) => {
                    return [
                      ...strings.leveling_variables
                        .split("\n")
                        .map((el) => ({
                          name: el.split(" - ")[0].match(/\[(.*?)\]/)[1],
                          char: el.split(" - ")[1],
                        }))
                        .filter((token2) =>
                          token2.name
                            .toLowerCase()
                            .startsWith(token.toLowerCase())
                        ),
                    ];
                  },
                  component: Item,
                  output: (item) => `[${item.name}]`,
                },
                "/": {
                  dataProvider: (token) => {
                    return [
                      ...strings.leveling_variables
                        .split("\n")
                        .map((el) => ({
                          name: el.split(" - ")[0].match(/\[(.*?)\]/)[1],
                          char: el.split(" - ")[1],
                        }))
                        .filter((token2) =>
                          token2.name
                            .toLowerCase()
                            .startsWith(token.toLowerCase())
                        ),
                    ];
                  },
                  component: Item,
                  output: (item) => `[${item.name}]`,
                },
                ":": {
                  dataProvider: (token) => {
                    return [
                      ...strings.leveling_variables
                        .split("\n")
                        .map((el) => ({
                          name: el.split(" - ")[0].match(/\[(.*?)\]/)[1],
                          char: el.split(" - ")[1],
                        }))
                        .filter((token2) =>
                          token2.name
                            .toLowerCase()
                            .startsWith(token.toLowerCase())
                        ),
                    ];
                  },
                  component: Item,
                  output: (item) => `[${item.name}]`,
                },
              }}
            />
          </div>
        )}
      </div>
      <h4 className="mt-25 mb-25">{strings.rewards}</h4>
      <div id="resultsTable">
        <div className="custom-resposive-table">
          <table>
            <thead className="text-light bg-gray-2">
              <tr>
                {[
                  "leveling_text_level",
                  "leveling_voice_level",
                  "leveling_rewarded_role",
                  "leveling_remove_with_higher",
                  "leveling_DM",
                  "leveling_actions",
                ].map((th, index) => (
                  <th
                    key={index}
                    style={
                      !state?.levelRewards?.length ? { minWidth: "150px" } : {}
                    }
                  >
                    <div
                      style={{
                        width: "80%",
                        wordBreak: "break-word",
                      }}
                    >
                      {strings[th]}
                      {th === "leveling_rewarded_role" && (
                        <InfoIconWithText text={strings.role_under_position} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-light">
              {state?.levelRewards?.length ? (
                state.levelRewards?.map((data, index) => (
                  <tr
                    key={index}
                    className={`align-middle bg-command${
                      !(state.levelRewards.length === index + 1)
                        ? " table-border-bottom"
                        : ""
                    }`}
                  >
                    <td style={{ minWidth: "200px" }}>
                      <CountingComponent
                        max={100}
                        min={0}
                        value={data.textLevel}
                        onChange={(textLevel) =>
                          setState({
                            levelRewards: state?.levelRewards.map((reward, i) =>
                              i === index ? { ...reward, textLevel } : reward
                            ),
                          })
                        }
                        footer={`~${humanizeDuration(
                          (levels[data.textLevel] / 20) * 120000,
                          {
                            round: true,
                            largest: 2,
                            language: strings.getLanguage() === "zh-TW" ? "zh_TW" : strings.getLanguage() === "zh" ? "zh_CN" : strings.getLanguage().substring(0, 2),
                            fallbacks: ["en"],
                            units: ["y", "mo", "w", "d", "h", "m"],
                          }
                        )} *`}
                      />
                    </td>
                    <td style={{ minWidth: "200px" }}>
                      <CountingComponent
                        max={100}
                        min={0}
                        value={data.voiceLevel}
                        onChange={(voiceLevel) =>
                          setState({
                            levelRewards: state?.levelRewards.map((reward, i) =>
                              i === index
                                ? {
                                    ...reward,
                                    voiceLevel,
                                  }
                                : reward
                            ),
                          })
                        }
                        footer={`~${humanizeDuration(
                          (levels[data.voiceLevel] / 4) * 60000,
                          {
                            round: true,
                            largest: 2,
                            language: strings.getLanguage() === "zh-TW" ? "zh_TW" : strings.getLanguage() === "zh" ? "zh_CN" : strings.getLanguage().substring(0, 2),
                            fallbacks: ["en"],
                            units: ["y", "mo", "w", "d", "h", "m"],
                          }
                        )}`}
                      />
                    </td>
                    <td style={{ minWidth: "200px" }}>
                      <div style={{ width: "90%" }}>
                        <Select
                          placeholder={strings.select_placeholder_select}
                          onChange={(rewardedRole) => {
                            setState({
                              levelRewards: state?.levelRewards.map(
                                (reward, i) =>
                                  i === index
                                    ? {
                                        ...reward,
                                        role: rewardedRole.value,
                                      }
                                    : reward
                              ),
                            });
                          }}
                          name="leveling_rewarded_role"
                          classNamePrefix="formselect"
                          menuPortalTarget={document.body}
                          options={guild.roles
                            ?.filter(
                              (role) =>
                                role.id !== guild.id &&
                                !role.managed &&
                                role.position < guild.member.position
                            )
                            .map((role) => ({
                              label: role.name,
                              value: role.id,
                              color: role.color,
                            }))}
                          value={
                            guild.roles.find((r) => r.id === data.role)
                              ? {
                                  label: guild.roles.find(
                                    (r) => r.id === data.role
                                  ).name,
                                  value: data.role,
                                  color: guild.roles.find(
                                    (r) => r.id === data.role
                                  ).color,
                                }
                              : undefined
                          }
                          isOptionDisabled={(option) => option.isDisabled}
                          noOptionsMessage={() => strings.no_option}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            option: (base, state) => ({
                              ...base,
                              alignItems: "center",
                              display: "flex",

                              ":before": {
                                backgroundColor: state.data.color,
                                borderRadius: 10,
                                content: '" "',
                                display: "block",
                                marginInlineEnd: 8,
                                height: 10,
                                width: 10,
                              },
                            }),
                            singleValue: (base, state) => ({
                              ...base,
                              alignItems: "center",
                              display: "flex",

                              ":before": {
                                backgroundColor: state.data.color,
                                borderRadius: 10,
                                content: '" "',
                                display: "block",
                                marginInlineEnd: 8,
                                height: 10,
                                width: 10,
                              },
                            }),
                          }}
                        />
                      </div>
                      <div className="levelExplain">
                        {state?.levelRewards.filter((r) => r.role === data.role)
                          .length > 1 ? (
                          <p style={{ color: "#DAA520" }}>
                            {strings.leveling_role_poisiton}
                          </p>
                        ) : data.textLevel === 0 && data.voiceLevel > 0 ? (
                          <p style={{ color: "#43b581" }}>
                            {strings.leveling_voice_only}
                          </p>
                        ) : data.textLevel > 0 && data.voiceLevel === 0 ? (
                          <p style={{ color: "#7289DA" }}>
                            {strings.leveling_text_only}
                          </p>
                        ) : (
                          <p style={{ color: "#e2409e" }}>
                            {strings.both_voice_and_text}
                          </p>
                        )}
                      </div>
                    </td>
                    <td style={{ minWidth: "200px" }}>
                      <Switch
                        checked={data.removeWithHigher}
                        onChange={(removeWithHigher) =>
                          setState({
                            levelRewards: state?.levelRewards.map((reward, i) =>
                              i === index
                                ? {
                                    ...reward,
                                    removeWithHigher,
                                  }
                                : reward
                            ),
                          })
                        }
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
                    </td>
                    <td style={{ minWidth: "100px" }}>
                      <Switch
                        checked={data.DM}
                        onChange={(DM) =>
                          setState({
                            levelRewards: state?.levelRewards.map((reward, i) =>
                              i === index
                                ? {
                                    ...reward,
                                    DM,
                                  }
                                : reward
                            ),
                          })
                        }
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
                    </td>
                    <td style={{ minWidth: "120px" }}>
                      <button
                        onClick={() =>
                          setState({
                            levelRewards: state?.levelRewards.filter(
                              (reward, i) => i !== index
                            ),
                          })
                        }
                        className="btn btn-danger btn-icon"
                      >
                        <i
                          style={{ color: "#ED4245" }}
                          className="fas fa-trash"
                        ></i>
                        {strings.delete}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <></>
              )}
              {!state?.levelRewards?.length && (
                <tr>
                  <td
                    colspan="7"
                    className="p-0 text-center full-width no-results-found"
                  >
                    {strings.no_results_found}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="d-flex justify-content-between mt-3 mb-40 leveling_add_role_reward">
        <p
          style={{
            margin: "0",
            alignSelf: "center",
          }}
        >
          {strings.leveling_note}
        </p>
        <button
          onClick={() =>
            setState({
              levelRewards: [
                ...(state?.levelRewards || []),
                {
                  DM: false,
                  removeWithHigher: false,
                  role: "",
                  textLevel: 1,
                  voiceLevel: 1,
                },
              ],
            })
          }
          className="btn btn-primary btn-icon"
        >
          <i className="fas fa-plus"></i>
          {strings.leveling_add_role_reward}
        </button>
      </div>
      <Command name="top" />
      <Command name="rank" />
      <Command name="setxp" />
      <Command name="setlevel" />
    </>
  );
}
