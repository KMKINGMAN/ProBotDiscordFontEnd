import { useContext, useState } from "react";
import { Context } from "@script/_context";
import PagesTitle from "@component/PagesTitle";
import Unsaved from "@component/unsaved";
import Alert from "@component/alert";
import strings from "@script/locale";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { ROLES_STYLES } from "@script/constants";
import AssignRole from "@component/AutoRoles/AssignRole";

export default function AutoRoles() {
  const { guild } = useContext(Context);
  const [state, setStates] = useState(guild?.autoroles || {});
  const [error, setError] = useState(false);
  const [higherRole, setHigherRole] = useState("");
  const setState = (object) =>
    setStates((prevState) => ({ ...prevState, ...object }));

  const [alert, setAlert] = useState(true);

  const addNewInvite = () => {
    setState({
      assignRoles: [...(state.assignRoles || []), { roles: [], invite: "" }],
    })
  }

  return (
    <>
      <PagesTitle
        data={{
          name: "AUTO_ROLES",
          module: "autoroles",
        }}
      />
      <Unsaved
        state={state}
        setStates={setStates}
        method="autoroles"
        default={{ roles: [] }}
      />
      <Alert
        open={alert}
        type="warning"
        handelClose={() => setAlert(false)}
        children={strings.AUTO_ROLES_NOTE}
        className="mb-15"
      />
      <label className="control-label" htmlFor="channel">
        {strings.AUTO_ROLES}
      </label>
      <Select
        value={
          guild?.roles &&
          guild?.roles
            .filter((r) => state.roles?.includes(r.id) && !r.managed)
            .map((r) => ({ label: r.name, value: r.id, color: r.color }))
        }
        onChange={(val) => {
          const hasHigherPosition = val.some((r) => {
            r.position >= guild.member.position ? setHigherRole(r.label) : null
            return r.position >= guild.member.position
          });
          hasHigherPosition ? null : setState({ roles: val ? val.map((r) => r.value) : [] });
          setError(hasHigherPosition);
        }}
        classNamePrefix="formselect"
        components={makeAnimated()}
        options={
          guild?.roles &&
          guild?.roles
            .filter((role) => role.id !== guild?.id && !role.managed)
            .map((role) => ({
              label: role.name,
              value: role.id,
              color: role.color,
              position: role.position,
            }))
        }
        isMulti
        placeholder={strings.select_placeholder_select}
        styles={ROLES_STYLES}
        noOptionsMessage={() => strings.no_option}
      />
      {error ? <p className="error-message">{`Oh no! "${higherRole}" role has a higher position than my role, Make sure that my role is higher than the selected role.`}</p> : null}
      <label className="control-label mt-10" htmlFor="channel">
        {strings.auto_role_bots}
      </label>
      <Select
        value={
          guild?.roles
          .filter(r => state.bots_roles?.includes(r.id) && !r.managed)
          .map(role => ({ label: role.name, value: role.id, color: role.color }))
        }
        onChange={(val) => setState({ bots_roles: val ? val.map(r => r.value) : [] })}
        classNamePrefix="formselect"
        components={makeAnimated()}
        options={
          guild.roles
          .filter(role => role.id !== guild?.id && !role.managed)
          .map(role => ({ label: role.name, value: role.id, color: role.color }))
        }
        isMulti
        placeholder={strings.select_placeholder_select}
        styles={ROLES_STYLES}
        noOptionsMessage={() => strings.no_option}
      />
      <hr className="mt-20 mb-20" />
      <div>
        <div className="d-flex flex-wrap gap-3 justify-content-between mb-10">
          <h5 className="m-0 d-flex flex-wrap gap-2 align-items-center">
            {strings.autorole_specific_invite}
            <span className="vip-component-tag" style={{ marginInlineStart: 0 }}>
              {strings.Premium}
            </span>
          </h5>
          <button onClick={addNewInvite} className="btn btn-secondary btn-icon" disabled={guild.botnumber < 2}>
            <i className="fas fa-plus"></i>
            {strings.add}
          </button>
        </div>
        {state.assignRoles?.map((data, index) => (
          <AssignRole
            key={index}
            data={data}
            setData={(object) => {
              if (typeof object === "string" && object === "delete") {
                return setState({
                  assignRoles: state.assignRoles.filter(
                    (d, i) => i !== index
                  ),
                });
              };
              setState({
                assignRoles: state.assignRoles?.map((data, assignRolesIndex) => {
                  if (index === assignRolesIndex) {
                    return { ...data, ...object };
                  }
                  return data;
                }),
              });
            }}
          />
        ))}
      </div>
    </>
  );
}
