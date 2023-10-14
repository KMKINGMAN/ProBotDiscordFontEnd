import strings from "@script/locale";

export default function SwitchType({ switchType, onChangeSwitch }) {
  const TYPES = [
    { key: 2, label: strings.rr_buttons },
    { key: 3, label: strings.rr_select_menu },
    { key: 0, label: strings.rr_reaction },
  ];
  return (
    <div className="reactions-type">
      {TYPES.map(({ key, label }) => (
        <label
          key={key}
          className={switchType === key ? "active" : ""}
          onClick={() => onChangeSwitch(key)}
        >
          <input
            type="radio"
            checked={switchType === key}
            name="reaction-type"
          />
          {label}
        </label>
      ))}
    </div>
  );
}