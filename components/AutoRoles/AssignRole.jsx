import makeAnimated from "react-select/animated";
import { ROLES_STYLES } from "@script/constants";
import strings from "@script/locale";
import { Context } from "@script/_context";
import { useContext, useState } from "react";
import Select from "react-select";

export default function AssignRole({ data, setData }) {
  const { guild } = useContext(Context);
  const [openRow, setOpenRow] = useState(false);

  const removeTheAssign = () => {
    setData("delete");
  }

  return (
    <div className="assign-role-container">
      <div>
        <h5 className="m-0">{data.invite || strings.no_link_provide}</h5>
        <div className="actions-button">
          <button
            className={`btn btn-primary btn-icon${openRow ? " activeBtn" : ""}`}
            onClick={() => setOpenRow(!openRow)}
          >
            <img src="/static/edit.svg" alt="edit-image" /> {strings.EDIT}
          </button>
          <button className="btn btn-danger btn-icon" onClick={removeTheAssign}>
            <i className="fas fa-trash"></i> {strings.delete}
          </button>
        </div>
      </div>
      {openRow && (
        <div className="row row-cols-1 row-cols-md-2 mt-10">
          <div className="col">
            <label className="control-label" htmlFor="SELECT_ROLES">
              {strings.autorole_select_roles}
            </label>
            <Select
              value={
                guild?.roles &&
                guild?.roles
                  .filter((r) => data.roles?.includes(r.id) && !r.managed)
                  .map((r) => ({ label: r.name, value: r.id, color: r.color }))
              }
              onChange={(val) =>
                setData({
                  roles: val ? val.map((val) => val.value) : [],
                })
              }
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
                  }))
              }
              isMulti
              placeholder={strings.select_placeholder_select}
              styles={ROLES_STYLES}
              noOptionsMessage={() => strings.no_option}
              isDisabled={guild.botnumber < 2}
            />
          </div>
          <div className="col mt-md-15">
            <label className="control-label" htmlFor="INVITE_LINK">
              {strings.autorole_invite_link}
            </label>
            <input
              id="INVITE_LINK"
              placeholder={strings.autorole_invite_link}
              type="text"
              className="form-control"
              value={data.invite}
              onChange={(val) => setData({ invite: val.target.value })}
              disabled={guild.botnumber < 2}
            />
          </div>
        </div>
      )}
    </div>
  );
}
