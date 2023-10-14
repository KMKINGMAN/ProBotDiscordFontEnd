import { useContext, useState } from "react";
import Head from "next/head";
import Unsaved from "@component/unsaved";
import { Context } from "@script/_context";
import PagesTitle from "@component/PagesTitle";
import strings from "@script/locale";
import Select from "react-select";
import { CountingComponent } from "@component/fields";
import InfoIconWithText from "@component/InfoIconWithText";
import Command from "@component/Command";

export default function TempModule() {
  const { guild } = useContext(Context);
  const [state, setStates] = useState(guild.temp);
  const setState = (newObject) =>
    setStates((prev) => ({ ...prev, ...newObject }));

  return (
    <>
      <PagesTitle
        data={{
          name: "temp_description",
          module: "temp-module",
        }}
      />
      <Unsaved
        method="temp"
        default={{
          new_id: "",
          max: 1,
          time: 3,
          parentID: "",
          users: 0,
        }}
        state={state}
        setStates={setState}
      />
      <Head>
        <title>{"Temporary Channels"} - {guild?.name}</title>
      </Head>
      <div>
        <div>
          <label htmlFor="parentID" className="control-label">
            {strings.category}
            <InfoIconWithText text={strings.temp_category_description} />
          </label>
          <Select
            id="parentID"
            classNamePrefix="formselect"
            placeholder={strings.select_placeholder_select}
            onChange={(value) => {
              setState({ ...state, parentID: value.value });
            }}
            value={
              state.parentID &&
              guild.channels
                .filter((c) => c.id === state.parentID)
                .map((c) => ({ value: c.id, label: c.name }))
            }
            options={guild.channels
              .filter(
                (channel) => channel.type === 4 && channel.id !== state.parentID
              )
              .map((channel) => ({
                value: channel.id,
                label: channel.name,
              }))}
            noOptionsMessage={() => strings.no_option}
          />
        </div>
        <div className="mt-10">
          <label htmlFor="new_id" className="control-label">
            {strings.temp_create_channel}
            <InfoIconWithText text={strings.temp_create_channel_description} />
          </label>
          <Select
            id="new_id"
            classNamePrefix="formselect"
            placeholder={strings.select_placeholder_select}
            onChange={(value) => {
              setState({ ...state, new_id: value.value });
            }}
            value={
              state.new_id &&
              guild.channels
                .filter((c) => c.id === state.new_id)
                .map((c) => ({ value: c.id, label: c.name }))
            }
            options={guild.channels
              .filter(
                (channel) => channel.type === 2 && channel.id !== state.new_id
              )
              .map((channel) => ({
                value: channel.id,
                label: channel.name,
              }))}
            noOptionsMessage={() => strings.no_option}
          />
        </div>
        <div className="mt-10">
          <label htmlFor="time" className="control-label">
            {strings.temp_time}
          </label>
          <CountingComponent
            className="full-width"
            max={100}
            min={0}
            value={state.time}
            onChange={(textLevel) =>
              setState({ ...state, time: parseInt(textLevel) })
            }
          />
        </div>
        <div className="mt-10">
          <label htmlFor="max" className="control-label">
            {strings.temp_max}
          </label>
          <CountingComponent
            className="full-width"
            max={100}
            min={0}
            value={state.max}
            onChange={(textLevel) =>
              setState({ ...state, max: parseInt(textLevel) })
            }
          />
        </div>
        <div className="mt-10">
          <label htmlFor="max" className="control-label">
            {strings.temp_max_users}
          </label>
          <CountingComponent
            className="full-width"
            max={100}
            min={0}
            value={state.users}
            onChange={(textLevel) =>
              setState({ ...state, users: parseInt(textLevel) })
            }
          />
        </div>
        <div className="mt-30">
          <Command name="temp" />
        </div>
      </div>
    </>
  );
}
