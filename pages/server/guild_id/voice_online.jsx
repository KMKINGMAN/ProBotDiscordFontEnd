import { useContext, useState } from "react";
import { Context } from "@script/_context";
import PagesTitle from "@component/PagesTitle";
import Unsaved from "@component/unsaved";
import strings from "@script/locale";
import Select from "react-select";
import Switch from "react-switch";
import makeAnimated from "react-select/animated";
import Premium from "@component/premium/pricing";
import { CHANNELS_STYLES } from "@script/constants";

export default function VoiceOnline() {
  const { guild } = useContext(Context);
  const [state, setStates] = useState(guild?.voice_online || {});
  const setState = (object) =>
    setStates((prevState) => ({ ...prevState, ...object }));

  if (!guild.vip) return <Premium />;
  return (
    <>
      <PagesTitle
        data={{
          name: "Voice_Online",
          description: "Voice_Online_description",
          module: "vn",
        }}
      />
      <Unsaved
        method="voice_online"
        state={state}
        setStates={setStates}
        default={{
          hiddenChannels: [],
          text: "Voice Online [00]",
          channel: null,
          no_bots: false,
        }}
      />

      <label className="control-label" htmlFor="Text">
        {strings.Text}
      </label>
      <input
        className="form-control"
        type="text"
        id="Text"
        placeholder={strings.Text}
        value={state?.text || ""}
        onChange={(value) => setState({ text: value.target.value })}
      />

      <label className="control-label mt-15" htmlFor="channel">
        {strings.channel}
      </label>
      <Select
        value={
          guild.channels &&
          guild.channels
            .filter(
              (channel) =>
                [2, 4]?.includes(channel.type) &&
                state?.channel?.includes(channel.id)
            )
            .map((channel) => ({ label: `${channel.type === 2 ? "#" : "📁 "}${channel.name}`, value: channel.id }))
        }
        onChange={({ value: channel }) => setState({ channel })}
        inputId="channel"
        classNamePrefix="formselect"
        options={
          guild.channels &&
          guild.channels
            .filter((channel) => [2, 4]?.includes(channel.type))
            .map((channel) => ({ label: `${channel.type === 2 ? "#" : "📁 "}${channel.name}`, value: channel.id }))
        }
        components={makeAnimated()}
        placeholder={strings.select_placeholder_select}
      />

      <label className="control-label mt-15" htmlFor="hidden_channels">
        {strings.hidden_channels}
      </label>
      <Select
        value={
          guild.channels &&
          guild.channels
            .filter(
              (channel) =>
                channel.type === 2 &&
                state?.hiddenChannels?.map(c => c.value || c).includes(channel.id)
            )
            .map((channel) => ({ label: channel.name, value: channel.id }))
        }
        onChange={(values) =>
          setState({ hiddenChannels: values.map(({ value }) => value) })
        }
        inputId="hidden_channels"
        classNamePrefix="formselect"
        isMulti
        options={
          guild.channels &&
          guild.channels
            .filter((channel) => channel.type === 2)
            .map((channel) => ({ label: channel.name, value: channel.id }))
        }
        components={makeAnimated()}
        placeholder={strings.select_placeholder_select}
        styles={CHANNELS_STYLES}
      />

      <div className="d-flex justify-content-between mt-15">
        <label
          className="control-label"
          htmlFor="no_bots"
          onClick={() => setState({ no_bots: !state?.no_bots })}
        >
          {strings.no_bots}
        </label>
        <Switch
          checked={state?.no_bots ? state?.no_bots : false}
          onChange={(val) => setState({ no_bots: val })}
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
  );
}
