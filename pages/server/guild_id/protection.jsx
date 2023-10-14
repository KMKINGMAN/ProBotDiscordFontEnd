import { useContext, useEffect, useState } from "react";
import { Context } from "@script/_context";
import PagesTitle from "@component/PagesTitle";
import Unsaved from "@component/unsaved";
import strings from "@script/locale";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Switch from "react-switch";
import Premium from "@component/premium/pricing";
import Dropdown from "@component/dropdown";
import { CountingComponent } from "@component/fields";
import InfoIconWithText from "@component/InfoIconWithText";
import { ROLES_STYLES } from "@script/constants";

export default function Protection() {
  const { guild } = useContext(Context);
  const [state, setStates] = useState(guild?.protection || {});
  const setState = (object) =>
    setStates((prevState) => ({ ...prevState, ...object }));
  const [openAddRole, setOpenAddRole] = useState(false);
  const [activeRoleID, setActiveRoleID] = useState(guild?.id);
  const [activeLimit, setActiveLimit] = useState("permissions");
  const [activeRole, setActiveRole] = useState();
  const [searchRole, setSearchRole] = useState("");
  const roleData = {
    ban_limit: 0,
    ban_action: "none",
    kick_limit: 0,
    kick_action: "none",
    roles_limit: 0,
    roles_action: "none",
    channels_limit: 0,
    channels_action: "none",
    mute_command: 0,
    vmute_command: 0,
    timeout_command: 0,
    kick_command: 0,
    ban_command: 0,
    role_command: 0,
    role_command_status: "disable",
    role_command_roles: [],
    ...(state?.roles?.[activeRoleID] || {}),
  };

  useEffect(() => {
    setActiveLimit("permissions");
    setActiveRole(guild?.roles.find((role) => role.id === activeRoleID));
  }, [activeRoleID]);

  useEffect(() => {
    if (!Object.keys(state?.roles || {}).includes(activeRoleID))
      setActiveRoleID(guild?.id);
  }, [state?.roles]);

  const updateActive = (key, value) =>
    setState({
      roles: {
        ...(state?.roles || {}),
        [activeRoleID]: { ...roleData, [key]: value },
      },
    });
  const deleteActive = () => {
    const roles = { ...state?.roles };
    delete roles[activeRoleID];
    setState({ roles });
    setActiveRoleID(guild?.id);
  };

  if (!guild?.vip) return <Premium />;

  if (guild?.protection && guild?.protection?.only_owner && !guild?.owner)
    return (
      <div className="invite_div center">
        <h1>
          <i className="fas fa-exclamation-triangle"></i>
        </h1>
        <h4>{strings.vip_owner_only}</h4>
      </div>
    );

  return (
    <>
      <PagesTitle
        data={{
          name: "protection",
          description: "protection_description",
          module: "protection",
        }}
      />
      <Unsaved
        method="protection"
        state={state}
        setStates={setStates}
        default={{
          roles: {
            [guild?.id]: {
              ban_limit: 0,
              ban_action: "none",
              kick_limit: 0,
              kick_action: "none",
              roles_limit: 0,
              roles_action: "none",
              channels_limit: 0,
              channels_action: "none",
              mute_command: 0,
              vmute_command: 0,
              timeout_command: 0,
              kick_command: 0,
              ban_command: 0,
              role_command: 0,
              role_command_status: "disable",
              role_command_roles: [],
            },
          },
          without_administrative: [],
          protect_prune: false,
          bot_joined: "none",
          bot_given: "none",
          whitelist_bots: "",
          guildupdate_action: "none",
          probot_access: "Administrator",
          only_owner: false,
        }}
      />

      <div className="row crtl protection-crtl">
        <div className="col-md-12 d-flex flex-wrap align-items-center gap-2 mb-10 p-0">
          <Dropdown
            visible={openAddRole}
            onClick={() => setOpenAddRole(!openAddRole)}
            onClickOutside={() => setOpenAddRole(false)}
            overlay={
              <div className="dropdown-content">
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
                    value={searchRole}
                    onChange={(r) => setSearchRole(r.target.value)}
                  />
                  <ul className="roles-content">
                    {guild.roles
                      .filter((r) => {
                        if (r.id === guild.id) return false;
                        if (r.position >= guild.member.position) return false;
                       // if (r.managed) return false;
                        return !Object.keys(state?.roles || {}).includes(r.id);
                      })
                      .filter((rr) => {
                        if (searchRole) {
                          return (
                            rr.name.toLowerCase().includes(searchRole) ||
                            rr.id.includes(searchRole)
                          );
                        } else {
                          return true;
                        }
                      })
                      .map((role) => (
                        <li
                          key={role.id}
                          className="roles-item"
                          onClick={() => {
                            setOpenAddRole(false);
                            setState({
                              roles: {
                                ...state?.roles,
                                [role.id]: { ...state?.roles[guild?.id] },
                              },
                            });
                            setActiveRoleID(role.id);
                          }}
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
              </div>
            }
          >
            <button className="btn btn-primary btn-icon" type="button">
              <i className="fas fa-plus"></i>
              {strings.ADD_ROLE}
            </button>
          </Dropdown>
          <ul className="protection-roles-list">
            {Object.keys(state?.roles || {})
              .filter((roleID) =>
                guild?.roles.find((role) => role.id === roleID)
              )
              .map((roleID, index) => (
                <li
                  key={index}
                  className={activeRoleID === roleID ? "active" : ""}
                >
                  <button
                    onClick={() => setActiveRoleID(roleID)}
                    className="d-flex align-items-center gap-2"
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: guild?.roles.find(
                          (role) => role.id === roleID
                        )?.color,
                      }}
                    />
                    {guild?.roles.find((role) => role.id === roleID).name}
                  </button>
                </li>
              ))}
          </ul>
        </div>
        <div className="col-md-12 p-0">
          <div className="panel-dark">
            <div className="panel-heading d-flex align-items-center justify-content-between p-0">
              <ul
                role="tablist"
                className="nav nav-pills nav-pills-outline nav-pills-rounded crtl protection-tablist mb-10"
                id="myTabs_13"
              >
                <li
                  className={activeLimit === "permissions" ? "active" : ""}
                  role="presentation"
                >
                  <button
                    aria-expanded="true"
                    onClick={() => setActiveLimit("permissions")}
                  >
                    {strings.PERMISSIONS_LIMITS}
                  </button>
                </li>
                <li
                  role="presentation"
                  className={activeLimit === "commands" ? "active" : ""}
                >
                  <button
                    data-toggle="tab"
                    onClick={() => setActiveLimit("commands")}
                  >
                    {strings.COMMANDS_LIMITS}
                  </button>
                </li>
              </ul>
              <i
                onClick={() =>
                  setActiveLimit(
                    activeLimit === "none" ? "permissions" : "none"
                  )
                }
                className={`fas ${
                  activeLimit === "none" ? "fa-chevron-down" : "fa-chevron-up"
                } active-limit-icon`}
              ></i>
            </div>
            {activeLimit === "permissions" && (
              <div className="row row-cols-1 row-cols-sm-2">
                <div className="form-group mb-15">
                  <label htmlFor="BAN_LIMIT" className="control-label">
                    {strings.BAN_LIMIT}
                  </label>
                  <div>
                    <CountingComponent
                      value={roleData.ban_limit}
                      onChange={(number) => updateActive("ban_limit", number)}
                      min="0"
                      max={Infinity}
                      className="full-width"
                    />
                  </div>
                </div>
                <div className="form-group mb-15">
                  <label htmlFor="ACTION_IF_BAN" className="control-label">
                    {strings.ACTION_IF_BAN}
                  </label>
                  <div>
                    <select
                      className="form-control form-select"
                      id="ACTION_IF_BAN"
                      value={roleData.ban_action}
                      onChange={(event) =>
                        updateActive("ban_action", event.target.value)
                      }
                    >
                      <option value="none">{strings.NONE}</option>
                      <option
                        value="permissions_all"
                      >
                        {strings.PERMISSIONS_ALL}{" "}
                      </option>
                      <option
                        value="permissions_user"
                      >
                        {strings.PERMISSIONS_USER}{" "}
                        {`( ${strings.RECOMMANDED} )`}
                      </option>
                      <option value="remove_roles">
                        {strings.REMOVE_ROLES}
                      </option>
                    </select>
                  </div>
                </div>
                <div className="form-group  mb-15">
                  <label htmlFor="KICK_LIMIT" className="control-label">
                    {strings.KICK_LIMIT}
                  </label>
                  <div>
                    <CountingComponent
                      value={roleData.kick_limit}
                      onChange={(number) => updateActive("kick_limit", number)}
                      min="0"
                      max={Infinity}
                      className="full-width"
                    />
                  </div>
                </div>
                <div className="form-group mb-15">
                  <label htmlFor="ACTION_IF_KICK" className="control-label">
                    {strings.ACTION_IF_KICK}
                  </label>
                  <div>
                    <select
                      className="form-control form-select"
                      id="ACTION_IF_KICK"
                      value={roleData.kick_action}
                      onChange={(event) =>
                        updateActive("kick_action", event.target.value)
                      }
                    >
                      <option value="none">{strings.NONE}</option>
                      <option
                        value="permissions_all"
                      >
                        {strings.PERMISSIONS_ALL}{" "}
                      </option>
                      <option
                        value="permissions_user"
                      >
                        {strings.PERMISSIONS_USER}{" "} ( {strings.RECOMMANDED} )
                      </option>
                      <option value="remove_roles">
                        {strings.REMOVE_ROLES}
                      </option>
                    </select>
                  </div>
                </div>
                <div className="form-group  mb-15">
                  <label htmlFor="CHANNELS_LIMIT" className="control-label">
                    {strings.CHANNELS_LIMIT}
                  </label>
                  <div>
                    <CountingComponent
                      value={roleData.channels_limit}
                      onChange={(number) =>
                        updateActive("channels_limit", number)
                      }
                      min="0"
                      max={Infinity}
                      className="full-width"
                    />
                    <span className="help-block mt-10 mb-0">
                      <small>{strings.CHANNELS_LIMIT_HINT}</small>
                    </span>
                  </div>
                </div>
                <div className="form-group mb-15">
                  <label htmlFor="ACTION_IF_CHANNELS" className="control-label">
                    {strings.ACTION_IF_CHANNELS}
                  </label>
                  <div>
                    <select
                      className="form-control form-select form-select"
                      id="ACTION_IF_CHANNELS"
                      value={roleData.channels_action}
                      onChange={(event) =>
                        updateActive("channels_action", event.target.value)
                      }
                    >
                      <option value="none">{strings.NONE}</option>
                      <option
                        value="permissions_all"
                      >
                        {strings.PERMISSIONS_ALL}{" "}
                      </option>
                      <option
                        value="permissions_user"
                      >
                        {strings.PERMISSIONS_USER}{" "}
                        {`( ${strings.RECOMMANDED} )`}
                      </option>
                      <option value="remove_roles">
                        {strings.REMOVE_ROLES}
                      </option>
                    </select>
                  </div>
                </div>
                <div className="form-group  mb-15">
                  <label htmlFor="ROLES_LIMIT" className="control-label">
                    {strings.ROLES_LIMIT}
                  </label>
                  <div>
                    <CountingComponent
                      value={roleData.roles_limit}
                      onChange={(number) => updateActive("roles_limit", number)}
                      min="0"
                      max={Infinity}
                      className="full-width"
                    />
                    <span className="help-block mt-10 mb-0">
                      <small>{strings.ROLE_LIMIT_HINT}</small>
                    </span>
                  </div>
                </div>
                <div className="form-group mb-15">
                  <label htmlFor="ACTION_IF_ROLE" className="control-label">
                    {strings.ACTION_IF_ROLE}
                  </label>
                  <div>
                    <select
                      className="form-control form-select"
                      id="ACTION_IF_ROLE"
                      value={roleData.roles_action}
                      onChange={(event) =>
                        updateActive("roles_action", event.target.value)
                      }
                    >
                      <option value="none">{strings.NONE}</option>
                      <option
                        value="permissions_all"
                      >
                        {strings.PERMISSIONS_ALL}{" "}
                      </option>
                      <option
                        value="permissions_user"
                      >
                        {strings.PERMISSIONS_USER}{" "}
                        {`( ${strings.RECOMMANDED} )`}
                      </option>
                      <option value="remove_roles">
                        {strings.REMOVE_ROLES}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            {activeLimit === "commands" && (
              <div className="form-wrap form-horizontal">
                <div className="form-group  mb-15">
                  <label htmlFor="COMMAND_LIMIT" className="control-label ltr">
                    /mute {strings.COMMAND_LIMIT}
                  </label>
                  <div>
                    <CountingComponent
                      value={roleData.mute_command}
                      onChange={(number) =>
                        updateActive("mute_command", number)
                      }
                      min="0"
                      max={Infinity}
                      className="full-width"
                    />
                  </div>
                </div>
                <div className="form-group  mb-15">
                  <label
                    htmlFor="vmute_COMMAND_LIMIT"
                    className="control-label ltr"
                  >
                    /vmute {strings.COMMAND_LIMIT}
                  </label>
                  <div>
                    <CountingComponent
                      value={roleData.vmute_command}
                      onChange={(number) =>
                        updateActive("vmute_command", number)
                      }
                      min="0"
                      className="full-width"
                      max={Infinity}
                    />
                  </div>
                </div>
                <div className="form-group  mb-15">
                  <label
                    htmlFor="timeout_COMMAND_LIMIT"
                    className="control-label ltr"
                  >
                    /timeout {strings.COMMAND_LIMIT}
                  </label>
                  <div>
                    <CountingComponent
                      value={roleData.timeout_command}
                      onChange={(number) =>
                        updateActive("timeout_command", number)
                      }
                      min="0"
                      className="full-width"
                      max={Infinity}
                    />
                  </div>
                </div>
                <div className="form-group  mb-15">
                  <label
                    htmlFor="kick_COMMAND_LIMIT"
                    className="control-label ltr"
                  >
                    /kick {strings.COMMAND_LIMIT}
                  </label>
                  <div>
                    <CountingComponent
                      value={roleData.kick_command}
                      onChange={(number) =>
                        updateActive("kick_command", number)
                      }
                      min="0"
                      max={Infinity}
                      className="full-width"
                    />
                  </div>
                </div>
                <div className="form-group  mb-15">
                  <label
                    htmlFor="ban_COMMAND_LIMIT"
                    className="control-label ltr"
                  >
                    /ban {strings.COMMAND_LIMIT}
                  </label>
                  <div>
                    <CountingComponent
                      value={roleData.ban_command}
                      onChange={(number) => updateActive("ban_command", number)}
                      min="0"
                      max={Infinity}
                      className="full-width"
                    />
                  </div>
                </div>
                <div className="form-group  mb-15">
                  <label
                    htmlFor="role_COMMAND_LIMIT"
                    className="control-label ltr"
                  >
                    /role {strings.COMMAND_LIMIT}
                  </label>
                  <div>
                    <CountingComponent
                      value={roleData.role_command}
                      onChange={(number) =>
                        updateActive("role_command", number)
                      }
                      min="0"
                      max={Infinity}
                      className="full-width"
                    />
                  </div>
                </div>
                <div className="form-group mb-15">
                  <select
                    className="form-control form-select mb-5"
                    style={{ width: "100%" }}
                    value={roleData.role_command_status}
                    onChange={(event) =>
                      updateActive("role_command_status", event.target.value)
                    }
                  >
                    <option className="simpleOption" value="disable">
                      /role {strings.DISABLED_ROLES}
                    </option>
                    <option className="simpleOption" value="enable">
                      /role {strings.ENABLED_ROLES}
                    </option>
                  </select>
                  <div>
                    <Select
                      value={guild?.roles
                        .filter((role) =>
                          roleData.role_command_roles.includes(role.id)
                        )
                        .map((r) => ({
                          label: r.name,
                          value: r.id,
                          color: r.color,
                        }))}
                      onChange={(val) =>
                        updateActive(
                          "role_command_roles",
                          val ? val.map((val) => val.value) : []
                        )
                      }
                      classNamePrefix="formselect"
                      components={makeAnimated()}
                      options={
                        guild?.roles &&
                        guild?.roles
                          .filter((role) => {
                            if (role.id === guild?.id) return false;
                            return true;
                          })
                          .map((role) => ({
                            label: role.name,
                            value: role.id,
                            color: role.color,
                          }))
                      }
                      isMulti
                      placeholder={strings.select_placeholder_select}
                      styles={ROLES_STYLES}
                    />
                  </div>
                </div>
              </div>
            )}
            {activeRoleID !== guild?.id && (
              <button
                className="protection__delete-role mt-3"
                onClick={deleteActive}
              >
                {" "}
                <span className="btn-label">
                  <i className="fa fa-exclamation-triangle"></i>{" "}
                </span>
                <span className="btn-text">
                  {strings.formatString(
                    strings.protection_delete_limits,
                    <strong>{activeRole.name}</strong>
                  )}
                </span>
              </button>
            )}
            <div className="d-flex mt-10 flex-wrap align-items-center">
              <code>{strings.tip}:</code>{" "}
              <label className="mt-1 mb-1">
                {strings.protection_limits_tip}
              </label>
            </div>
                        <div className="d-flex mt-10 flex-wrap align-items-center">
              <code>{strings.mod_warning}:</code>{" "}
              <label className="mt-1 mb-1">
                {strings.protection_bots_warning}
              </label>
            </div>
          </div>
        </div>
      </div>
      <h6 className="panel-title txt-light">{strings.protection_options}</h6>
      <div className="panel-dark protection">
        <div className="form-wrap form-horizontal">
          <div className="form-group mb-15">
            <label
              htmlFor="without_administrative"
              className="col-sm-4 control-label full-width"
            >
              {strings.without_administrative}
              <InfoIconWithText text={strings.protection_roles_adminstrative} />
            </label>
            <div>
              <Select
                value={
                  guild?.roles &&
                  state?.without_administrative &&
                  guild?.roles
                    .filter((r) => state?.without_administrative.includes(r.id))
                    .map((r) => ({
                      label: r.name,
                      value: r.id,
                      color: r.color,
                    }))
                }
                onChange={(val) =>
                  setState({
                    without_administrative: val
                      ? val.map((val) => val.value)
                      : [],
                  })
                }
                classNamePrefix="formselect"
                inputId="without_administrative"
                components={makeAnimated()}
                options={
                  guild?.roles &&
                  guild?.roles
                    .filter((role) => true)
                    .map((role) => ({
                      label: role.name,
                      value: role.id,
                      color: role.color,
                    }))
                }
                isMulti
                placeholder={strings.select_placeholder_select}
                styles={ROLES_STYLES}
              />
              <span className="help-block mt-10 mb-0">
                <small>
                  {strings.formatString(
                    strings.PROTECTED_HINT,
                    <code>@everyone</code>
                  )}
                </small>
              </span>
              <br />
            </div>
          </div>

          <div className="form-group mb-15">
            <label htmlFor="BOT_GIVEN_A_ROLE" className="control-label">
              {strings.BOT_GIVEN_A_ROLE}
            </label>
            <div>
              <select
                className="form-control form-select"
                id="BOT_GIVEN_A_ROLE"
                value={state?.bot_given}
                onChange={(event) => {
                  setState({ bot_given: event.target.value });
                  if (event.target.value === "none") {
                    setState({ whitelist_bots: "" });
                  }
                }}
              >
                <option value="none">{strings.NONE}</option>
                <option value="remove_admin_bot">
                  {strings.REMOVE_ADMIN_BOT} ( {strings.RECOMMANDED} )
                </option>
                <option
                  value="permissions_all"
                  disabled={guild?.botnumber === 2}
                >
                  {strings.PERMISSIONS_ALL}{" "}
                  {guild?.botnumber === 2 ? "( Premium Tier 2 )" : ""}{" "}
                </option>
                <option value="kick">{strings.KICK_THE_BOT}</option>
              </select>
              <span className="help-block mt-10 mb-0">
                <small>{strings.BOTS_HINT}</small>
              </span>
            </div>
          </div>
          {state?.bot_given !== "none" && (
            <div className="form-group mb-15">
              <label
                htmlFor="WHITELIST_BOTS"
                className="col-sm-4 control-label"
              >
                {strings.WHITELIST_BOTS}
              </label>
              <div>
                <input
                  type="text"
                  className="form-control"
                  id="WHITELIST_BOTS"
                  value={state?.whitelist_bots}
                  onChange={(event) =>
                    setState({ whitelist_bots: event.target.value })
                  }
                />
                <span className="help-block mt-10 mb-0">
                  <small>
                    {strings.USE_COMMA} <code>,</code> .
                  </small>
                </span>
              </div>
            </div>
          )}
          <div className="form-group mb-15">
            <label htmlFor="PROTECTION_ACCESS" className="control-label">
              {strings.PROTECTION_ACCESS}
            </label>
            <div>
              <select
                className="form-control form-select"
                id="PROTECTION_ACCESS"
                value={state?.probot_access}
                onChange={(event) =>
                  setState({ probot_access: event.target.value })
                }
              >
                <option value="Administrator">
                  {strings.PROTECTION_ACCESS_ANY_ADMINISTRATOR}
                </option>
                <option value="members">
                  {strings.PROTECTION_ACCESS_MEMBERS}
                </option>
              </select>
              {state?.probot_access === "members" && (
                <div>
                  <span className="help-block mt-10 mb-0">
                    <small>{strings.MEMBERS} :</small>
                  </span>
                  <input
                    type="text"
                    id="MEMBERS"
                    name="example-input-normal"
                    className="form-control"
                    value={state?.probot_members}
                    onChange={(event) =>
                      setState({ probot_members: event.target.value })
                    }
                    placeholder={strings.type_here}
                  />
                  <span className="help-block mt-10 mb-0">
                    <small>
                      {strings.USE_COMMA} <code>,</code> .
                    </small>
                  </span>
                </div>
              )}
              <br />

              <div className="d-flex justify-content-between align-items-center">
                <span className="text_b_s align-self-end">
                  {strings.PROTECTION_ONLY_OWNER}
                </span>
                <Switch
                  checked={state?.only_owner || false}
                  onChange={(val) => setState({ only_owner: val })}
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
              <br />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
