import { useContext, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Command from "@component/Command";
import commands from "@script/commands";
import strings from "@script/locale";
import style from "@component/Command/commands.module.css";
import PagesTitle from "@component/PagesTitle";
import { Context } from "@script/_context";
import Unsaved from "@component/unsaved";
import { ROLES_STYLES } from "@script/constants";
import Tooltip from "rc-tooltip";

export default function Mod() {
	const { guild } = useContext(Context);
	const [state, setStates] = useState(guild?.moderation || {});
	const setState = (object) => setStates((prevState) =>({ ...prevState, ...object }));
	
	const voiceMuteTranslation = [strings.MOD_UNTIL_LEAVES, strings.SPECIFIC_TIME];
	const durationOptions = [
		{ title: "MIN", value: "minutes" },
		{ title: "HOURS", value: "hours" },
		{ title: "DAYS", value: "days" },
		{ title: "WEEKS", value: "weeks" },
		{ title: "MONTHS", value: "months" }
	];
	if (!guild || !guild.roles) return <>OKAY</>;
	return (
		<>
			<PagesTitle data={{
				name: "Moderation",
				description: "Moderate your server easily",
				module: "mod"
			}} />
			<Unsaved method="moderation" state={state} setStates={setStates} default={{roles: [],voice_mute: 0,voice_mute_duration: "days",voice_mute_time: 3}} />

			<div className={style["mod-container"]}>
				<div>
					<label className="control-label" htmlFor="mod_roles">{strings.mod_roles}</label>
					<Tooltip placement={'top'} overlay={strings.mod_roles_tooltip}>
						<i class="fas fa-exclamation-circle pointer text-muted ms-2"></i>
					</Tooltip>
					<Select onChange={values => setState({ roles: values.map(({ value }) => value) })}
						value={guild.roles?.filter(role => state?.roles?.includes(role.id)).map(role => ({ label: role.name, value: role.id, color: role.color }))}
						classNamePrefix="formselect"
						inputId="mod_roles"
						components={makeAnimated()}
						options={guild.roles?.filter(role => role.id !== guild.id).map(role => ({ label: role.name, value: role.id, color: role.color }))}
						isMulti
						placeholder={strings.select_placeholder_select}
						styles={ROLES_STYLES}
						noOptionsMessage={() => strings.no_option}
					/>
				</div>

				<div className="mt-md-15">
					<label className="control-label" htmlFor="voice_mute_time">{strings.voice_mute_time}</label>
					<Select onChange={({ value: voice_mute }) => setState({ voice_mute: voice_mute })}
						value={{ label: voiceMuteTranslation[state?.voice_mute], value: state?.voice_mute }}
						classNamePrefix="formselect"
						components={makeAnimated()}
						options={voiceMuteTranslation.map((label, value) => ({ label, value: `${value}` }))}
						placeholder={strings.select_placeholder_select}
						isSearchable={false}
					/>
					{state?.voice_mute === '1' &&
						<div className={style["specified-time"]}>
							<input id="voice_mute_time" placeholder={strings.voice_mute_time} type="text" className="form-control" value={state?.voice_mute_time} onChange={event => setState({ voice_mute_time: parseInt(event.target.value > 0 ? event.target.value : 0, 10) })} />
							<Select onChange={values => setState({ voice_mute_duration: values.value })}
								value={{ label: strings[durationOptions.find(({ value }) => value === state?.voice_mute_duration)?.title], value: state?.voice_mute_duration }}
								classNamePrefix="formselect"
								components={makeAnimated()}
								options={durationOptions.map(({ title, value }) => ({ label: strings[title], value }))}
								placeholder={strings.select_placeholder_select}
								isSearchable={false}
							/>
						</div>}
				</div>
			</div>
			{commands.moderation.map((command, index) => <Command key={index} name={command} />)}
		</>
	);
}

