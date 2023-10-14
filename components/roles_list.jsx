import { useState, useRef, useContext } from "react";
import { Context } from "@script/_context";
import strings from "@script/locale";
import InfoIconWithText from "./InfoIconWithText";
import Dropdown from "@component/dropdown";
import Tooltip from "rc-tooltip";

export default function RolesList({ value, onChange, className }) {
  const { guild, rtl } = useContext(Context);
  const rolesContent = useRef(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const addRole = (role) => {
    const roles = [...value];
    roles.push(role);
    onChange(roles);
    setOpen(!open);
  };
  const deleteRole = (role) => {
    onChange(value.filter((r) => r !== role));
  };

  return (
    <div
      className={`flex reaction-role__emojiRow${
        className ? ` ${className}` : ""
      }`}
    >
      {value &&
        value.map((v, g) => {
          let role = guild.roles.find((r) => r.id === v);
          if (!role) role = { id: v, name: "Unknown", color: 0 };
          return (
            <div key={g} className="role" style={{ borderColor: role.color }}>
              <div
                className="roleCircle"
                style={{ backgroundColor: role.color }}
                onClick={() => deleteRole(role.id)}
              >
                <svg
                  className="pointer"
                  aria-hidden="true"
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#ffffff"
                    d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"
                  />
                </svg>
              </div>
              <div style={{ lineHeight: "normal" }}>{role.name}</div>
            </div>
          );
        })}
      <Dropdown
        trigger={["click"]}
        visible={open}
        onClick={() => setOpen(!open)}
        onClickOutside={() => setOpen(false)}
        placement={rtl ? "bottomRight" : "bottomLeft"}
        overlay={
          <div className="dropdown-content" ref={rolesContent}>
            {value.length >= 1 && guild.botnumber === 1 ? (
              <div>{strings.premium_only}</div>
            ) : (
              <div>
                <label htmlFor="role_search" className="control-label">
                  {strings.role_search}
                  <InfoIconWithText text={strings.role_under_position} />
                </label>
                <input
                  onClick={(e) => e.preventDefault()}
                  id="role_search"
                  type="text"
                  className="form-control"
                  placeholder={strings.type_here}
                  value={search}
                  onChange={(r) => setSearch(r.target.value)}
                />
                <ul className="roles-content">
                  {guild.roles
                    .filter((r) => {
                      if (r.id === guild.id) return false;
                      if (r.position >= guild.member.position) return false;
                      if (r.managed) return false;
                      return !value.includes(r.id);
                    })
                    .filter((rr) => {
                      if (search) {
                        return (
                          rr.name
                            .toLowerCase()
                            .includes(search.toLowerCase()) ||
                          rr.id.includes(search)
                        );
                      } else {
                        return true;
                      }
                    })
                    .map((role) => (
                      <li
                        key={role.id}
                        className="roles-item"
                        onClick={() => addRole(role.id)}
                      >
                        <span
                          style={{
                            minWidth: "10px",
                            minHeight: "10px",
                            maxWidth: "10px",
                            maxHeight: "10px",
                            display: "inline-block",
                            borderRadius: "50%",
                            backgroundColor: role.color,
                            marginInlineEnd: "10px",
                            flex: "none",
                          }}
                        />
                        <span className="roles-itemLabel">{role.name}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        }
      >
          <Tooltip placement={'top'} overlay={strings.autorole_select_roles}>
            <div className="role addRoleButton">
             +
            </div>
          </Tooltip>
      </Dropdown>
    </div>
  );
}
