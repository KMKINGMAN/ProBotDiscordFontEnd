import React, {
  useState,
  useEffect,
  Fragment,
  useRef,
  useContext,
  useCallback,
} from "react";
import axios from "axios";
import moment from "moment";
import strings from "@script/locale";
import Pagination from "@component/Pagination";
import Modal from "react-modal";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import Dropdown from "@component/dropdown";
import { Context } from "@script/_context";
import PagesTitle from "@component/PagesTitle";
import Confirm from "@component/Confirm";
import debounce from "lodash/debounce";
import InfoIconWithText from "@component/InfoIconWithText";

export default function ModActions() {
  const { guild, Toast, rtl } = useContext(Context);
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdown, openDropdown] = useState(false);
  const [state, setStates] = useState({
    actions: [],
    open: -1,
    loading: true,
    modal: {
      action: -1,
      open: false,
      type: 0,
    },
    filter: {
      type: "all",
      search: "",
      user: {},
    },
    users: [],
    searching: false,
    sort: 1,
  });

  const setState = (object) =>
    setStates((prevState) => ({ ...prevState, ...object }));
  const reasonRef = useRef();
  const dateRef = useRef();

  useEffect(() => {
    fetchActions(null, null, true);
  }, []);

  async function deleteAction(action) {
    const response = await axios
      .delete("/actions", {
        data: {
          guild_id: guild.id,
          type: action.action,
          id: String(action.id),
        },
      })
      .catch(() => undefined);

    if (!response || !response.data?.success) {
      return Toast.fire({
        icon: "error",
        title: "Error deleting action, try again in a second!",
      });
    }
    setState({
      actions: state.actions.filter(
        (filteredAction) => filteredAction.id !== action.id
      ),
      open: -1,
      modal: {
        ...state.modal,
        open: false,
        action: -1,
        type: 0,
      },
      sure: false,
      loading: false,
    });
    Toast.fire({
      icon: "success",
      title: strings.success,
    });
  }

  async function fetchActions(type, id, refreshUsers, page = 1) {
    setState({ actions: [], loading: true, open: -1 });
    const { data } = await axios.get("/actions", {
      params: {
        guild_id: guild.id,
        user_id: id,
        page,
        sort: state.sort ? -1 : 1,
        type: type ?? undefined,
      },
    });
    setState({
      total: data.total,
      pages:
        parseInt(
          data.total % 20 === 0 ? data.total / 20 : data.total / 20 + 1,
          10
        ) || 1,
    });
    if (refreshUsers) setState({ users: data.users });

    const globalActions = [];
    for (const action of data.actions) {
      action.user = data.users.find((user) => user?.id === action.member) || {
        avatar: "https://cdn.discordapp.com/embed/avatars/0.png",
        name: "Unknown",
        discriminator: "0000",
      };
      action.responsible = data.users.find((user) => user?.id === action.by);
      action.punishedAt = moment(action.lastmodified || action.last_modified).format(
        "MM/DD/YYYY h:mm A"
      );
      globalActions.push({
        ...action,
        modalOpen: false,
        id: action.id,
      });
      if (data.actions.indexOf(action) === data.actions.length - 1) {
        setState({
          actions: globalActions.filter(
            (action) => action.action === type || !type || type === "all"
          ),
          loading: false,
        });
      }
    }
    if (!globalActions[0]) setState({ actions: [], loading: false });
  }

  async function editAction(action, reason, time) {
    if (time && moment(time).toDate().getTime() < new Date().getTime())
      return setState({ sure: true });
    await axios.put("/actions", {
      guild_id: guild.id,
      id: action.id,
      type: action.action,
      time: time ? moment(time).toDate().getTime() : time,
      reason,
    });
    setState({
      modal: {
        ...state.modal,
        open: false,
        type: 0,
      },
      actions: state.actions.map((mapAction, i) =>
        i === state.actions.indexOf(action)
          ? {
              ...action,
              reason,
              time,
            }
          : mapAction
      ),
    });
    Toast.fire({
      icon: "success",
      title: strings.success,
    });
  }

  const sort = () => setState({ sort: !state.sort });

  useEffect(() => {
    if(!state.loading) fetchActions(state.filter.type, state.filter.user?.id, true);
  }, [state.sort]);

  const searchRequest = useCallback(
    debounce(async (query) => {
      if (!query || query === "") return setState({ searching: false });

      try {
        setState({ searching: true });

        const response = await axios.get("/search_users", {
          params: {
            guildID: guild.id,
            username: query,
          },
        });
        setState({
          searching: false,
          users: [
            ...state.users,
            ...response.data.users.filter(
              (newUser) => !state.users.find((user) => newUser.id === user?.id)
            ),
          ],
        });
      } catch (error) {
        setState({
          searching: false,
        });
      }
    }, 800),
    []
  );

  const search = (query) => {
    setState({
      filter: { ...state.filter, search: `${query}` },
      open: -1,
      searching: true,
    });
    searchRequest(query);
  };

  function handleNavClick(filterType) {
    if (filterType === state.filter.type) return;
    setState({
      filter: {
        ...state.filter,
        type: filterType,
        search: state.filter.user?.name,
      },
    });
  }

  useEffect(() => {
    if(!state.loading) fetchActions(state.filter.type, state.filter.user?.id || null);
  }, [state.filter.type]);

  function handleDropdownClick(filterUser) {
    openDropdown(!dropdown);
    if (filterUser.id === state.filter.user?.id) return;
    setState({
      loading: true,
      filter: {
        ...state.filter,
        user: filterUser,
        search: `${filterUser.name}#${filterUser.discriminator}`,
      },
    });
  }

  useEffect(() => {
    if(!state.loading) fetchActions(state.filter.type, state.filter.user?.id);
  }, [state.filter.user]);

  const modalAction = state.actions[state.modal.action];
  return (
    <>
      <PagesTitle
        data={{
          name: "mod_actions",
          description: "mod_actions",
        }}
      />
      <div
        className={`component-container${rtl ? " rtl" : ""}`}
        id="ModActions-parent"
      >
        <div className="card nav-card">
          <div className="nav-group-btns">
            <button
              disabled={state.loading || state.filter.type === "all"}
              className={`nav-btns${
                state.filter.type === "all" ? " nav-btns-active" : ""
              }`}
              onClick={() => {
                handleNavClick("all");
                setState({ open: -1 });
              }}
            >
              {state.loading && state.filter.type === "all" ? (
                <i className="nav-btns-loading" />
              ) : (
                strings.all
              )}
            </button>
            <button
              disabled={state.loading || state.filter.type === "ban"}
              className={`nav-btns${
                state.filter.type === "ban" ? " nav-btns-active" : ""
              }`}
              onClick={() => {
                handleNavClick("ban");
                setState({ open: -1 });
              }}
            >
              {state.loading && state.filter.type === "ban" ? (
                <i className="nav-btns-loading" />
              ) : (
                strings.mod_bans
              )}
            </button>
            <button
              disabled={state.loading || state.filter.type === "mute"}
              className={`nav-btns${
                state.filter.type === "mute" ? " nav-btns-active" : ""
              }`}
              onClick={() => {
                handleNavClick("mute");
                setState({ open: -1 });
              }}
            >
              {state.loading && state.filter.type === "mute" ? (
                <i className="nav-btns-loading" />
              ) : (
                strings.mod_mutes
              )}
            </button>
            <button
              disabled={state.loading || state.filter.type === "warn"}
              className={`nav-btns${
                state.filter.type === "warn" ? " nav-btns-active" : ""
              }`}
              onClick={() => {
                handleNavClick("warn");
                setState({ open: -1 });
              }}
            >
              {state.loading && state.filter.type === "warn" ? (
                <i className="nav-btns-loading" />
              ) : (
                strings.WARNINGS
              )}
            </button>
          </div>
          <div className="search dropdown__trigger">
            <Dropdown
              className="d-flex full-width align-items-center gap-2 pull-right dropdowntext"
              trigger={"click"}
              visible={dropdown}
              onOverlayClick={() => openDropdown(false)}
              onClickOutside={() => openDropdown(false)}
              placement={rtl ? "bottomRight" : "bottomLeft"}
              getPopupContainer={() =>
                document.getElementById("ModActions-parent")
              }
              overlay={
                <div className="dropdown__content actions-dropdown">
                  <ul>
                    {state.searching ? (
                      <div className="actions-dropdown-item">
                        <img
                          src={"https://cdn.discordapp.com/embed/avatars/0.png"}
                          onError={(e) =>
                            (e.target.src =
                              "https://cdn.discordapp.com/embed/avatars/0.png")
                          }
                          className="actions-dropdown-avatar"
                        />
                        <span>{strings.loading}</span>
                      </div>
                    ) : state.users.filter(
                        (user) =>
                          !state.filter.search ||
                          state.filter.search === "" ||
                          user?.id === state.filter.search ||
                          user?.name
                            .toLowerCase()
                            .includes(state.filter.search.toLowerCase())
                      ).length > 0 ? (
                      state.users
                        .filter(
                          (user) =>
                            !state.filter.search ||
                            state.filter.search === "" ||
                            user?.id === state.filter.search ||
                            user?.name
                              .toLowerCase()
                              .includes(state.filter.search.toLowerCase())
                        )
                        .slice(0, 4)
                        .map((user, i) => (
                          <li key={i}>
                            <div
                              className="actions-dropdown-item"
                              onClick={() => {
                                handleDropdownClick(user);
                              }}
                            >
                              <img
                                src={user?.avatar}
                                onError={(e) =>
                                  (e.target.src =
                                    "https://cdn.discordapp.com/embed/avatars/0.png")
                                }
                                className="actions-dropdown-avatar"
                              />
                              <span>{`${user?.name || "Unknown"}#${
                                user?.discriminator || "0000"
                              }`}</span>
                            </div>
                          </li>
                        ))
                    ) : (
                      <div style={{ textAlign: "center", marginTop: "15px" }}>
                        {strings.no_results_found}
                      </div>
                    )}
                  </ul>
                </div>
              }
            >
              <>
                <i id="actions-search-icon" className="fas fa-search" />
                <input
                  autoComplete="off"
                  type="text"
                  id="search"
                  placeholder={strings.mod_search_username}
                  onChange={(event) => search(event.target.value)}
                  value={state.filter.search}
                  onClick={() => openDropdown(true)}
                />
                {state.filter.search && (
                  <i
                    id="actions-dropdown-x"
                    className="fas fa-times"
                    onClick={() => {
                      // const condition = Object.keys(state.filter.user).length === 0;
                      if (Object.keys(state.filter.user).length !== 0) {
                        setState({
                          filter: {
                            ...state.filter,
                            user: {},
                            search: "",
                          },
                          searching: false,
                        });
                      } else {
                        setState({
                          filter: { ...state.filter, search: "" },
                          searching: false,
                        });
                      }
                      // if (!condition) fetchActions(null, null, true);
                    }}
                  />
                )}
              </>
            </Dropdown>
          </div>
        </div>
        <SkeletonTheme color="#36393F" highlightColor="#2F3136">
          <div className="table_modactions">
          <table dir={rtl ? "rtl" : ""} className="all-table mod-actions">
            <thead>
              <tr className="bg-gray-2">
                <th scope="col" className="users-padding">
                  {strings.transactions_user}
                </th>
                {state.filter.type === "all" && (
                  <th id="action" scope="col">
                    {strings.Action}
                  </th>
                )}
                <th id="responsible" scope="col">
                  {strings.mod_responsible}
                </th>
                <th id="punishTime" scope="col">
                  {strings.mod_punish_time}
                </th>
                <th id="timeLeft" scope="col">
                  {strings.mod_time_left}
                </th>
                <th
                  id="createdAt"
                  scope="col"
                  className="pointer"
                  onClick={sort}
                >
                  {strings.mod_punished_at}
                  {state.sort ? (
                    <i className="fas fa-sort-numeric-down"></i>
                  ) : (
                    <i className="fas fa-sort-numeric-up"></i>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {state.loading ? (
                Array.from(Array(3).keys()).map((i) => (
                  <tr key={i}>
                    <td scope="row" className="flex avatar-name">
                      <Skeleton className="table-avatar" />
                      <p className="mt-15 ml-10">
                        <Skeleton />
                      </p>
                    </td>
                    {state.filter.type === "all" && (
                      <td id="actionTd">
                        <Skeleton />
                      </td>
                    )}
                    <td id="responsibleTd">
                      <Skeleton />
                    </td>
                    <td id="punishTimeTd">
                      <Skeleton />
                    </td>
                    <td id="timeLeftTd">
                      <Skeleton />
                    </td>
                    <td id="createdAtTd">
                      <Skeleton />
                    </td>
                  </tr>
                ))
              ) : state.actions.length ? (
                state.actions.map((action, key) => (
                  <Fragment key={key}>
                    <tr
                      className={`bg-command${
                        !(state.actions.length === key + 1)
                          ? " table-border-bottom"
                          : ""
                      } pointer${state.open === key ? " row-opened" : ""}`}
                      onClick={() =>
                        setState({ open: key === state.open ? -1 : key })
                      }
                    >
                      <td scope="row" className="flex avatar-name">
                        {
                          <img
                            src={
                              action.user?.avatar?.includes("a_")
                                ? `${action.user?.avatar
                                    .split(".")
                                    .slice(0, -1)
                                    .join(".")}.gif`
                                : action.user?.avatar ||
                                  "https://cdn.discordapp.com/embed/avatars/0.png"
                            }
                            alt="user name"
                            className="table-avatar"
                            onError={(e) =>
                              (e.target.src =
                                "https://cdn.discordapp.com/embed/avatars/0.png")
                            }
                          />
                        }
                        <div
                          className={`username-id mt-15${
                            rtl ? " mr-10" : " ml-10"
                          }`}
                        >
                          <p>
                            {action.user?.name || "Unknown"}#
                            {action.user?.discriminator &&
                            action.user?.discriminator.length === 4
                              ? action.user?.discriminator
                              : "0000"}
                          </p>
                          <p>{action.member}</p>
                        </div>
                      </td>
                      {state.filter.type === "all" && (
                        <td id="actionTd">
                          {`${action.action[0].toUpperCase()}${action.action.slice(
                            1
                          )}`}
                        </td>
                      )}
                      {action.responsible ? (
                        <td id="responsibleTd">
                          {action.responsible.name || "Unknown"}#
                          {action.responsible.discriminator || "0000"}
                        </td>
                      ) : (
                        <td>
                          <i className="fas fa-window-minimize" />
                        </td>
                      )}
                      <td id="punishTimeTd">
                        {action.punishTime ? (
                          `${action.punishTime.amount} ${action.punishTime.unit}`
                        ) : (
                          <i className="fas fa-window-minimize" />
                        )}
                      </td>
                      <td id="timeLeftTd">
                        {action.action === "warn" ? (
                          <i className="fas fa-window-minimize" />
                        ) : (
                          <Countdown
                            endDate={action.time}
                            deleteAction={() => {
                              setState({
                                actions: state.actions.filter(
                                  (filteredAction) =>
                                    filteredAction.id !== action.id
                                ),
                                open: -1,
                                sure: false,
                                modal: {
                                  ...state.modal,
                                  open: false,
                                  action: -1,
                                  type: 0,
                                },
                              });
                            }}
                          />
                        )}
                      </td>
                      <td id="createdAtTd" className={rtl ? "rtl" : ""}>
                        {action.punishedAt || <Skeleton count={1} />}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="6" id="footer-td">
                        <div
                          className={
                            state.open === key
                              ? "row-footer row-footer-active"
                              : "row-footer"
                          }
                        >
                          <div itemScope="row" className="footer-reason">
                            <p className="faq-question mt-10">
                              {strings.reason}
                            </p>
                            <p className="faq-answer">
                              {action.reason || strings.transactions_no_reason}
                            </p>
                          </div>
                          <div className="flex pt-20 pb-20 footer-btns">
                            <button
                              type="button"
                              className="footer-btns-edit"
                              onClick={() => {
                                setState({
                                  modal: {
                                    ...state.modal,
                                    action: key,
                                    open: true,
                                    type: 1,
                                  },
                                });
                              }}
                            >
                              {strings.EDIT}
                            </button>
                            <button
                              type="button"
                              className="footer-btns-undo"
                              onClick={() => {
                                setState({
                                  modal: {
                                    ...state.modal,
                                    action: key,
                                    open: true,
                                    type: 2,
                                  },
                                });
                              }}
                            >
                              {strings.mod_undo_action}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6" id="noResults">
                    {strings.no_results_found}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </SkeletonTheme>

        <Modal
          isOpen={
            state.modal.action !== -1 &&
            state.modal.open &&
            state.modal.type === 1
          }
          className={`smallModal bg-modal${rtl ? " rtl" : ""}`}
          onRequestClose={() => {
            setState({
              modal: { ...state.modal, open: false, type: 0 },
              sure: false,
            });
          }}
          parentSelector={() => document.getElementById("main")}
        >
          {modalAction && (
            <Fragment>
              <div className="Modalhead">
                <h5>
                  {strings.mod_edit_action_id}{" "}
                  {state.users.find((u) => u.id === modalAction.member)?.name ||
                    modalAction.member}
                </h5>
                <button
                  onClick={() => {
                    setState({
                      modal: { ...state.modal, open: false, type: 0 },
                      sure: false,
                    });
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="row modalDram">
                <div className="mb-10">
                  <div className="mb-5">{strings.mod_action_reason}</div>
                  <input
                    placeholder={
                      modalAction.reason ? "" : strings.transactions_no_reason
                    }
                    className="form-control"
                    defaultValue={modalAction.reason}
                    type="text"
                    ref={reasonRef}
                  />
                </div>
                {modalAction.type !== "warn" && (
                  <div className="mb-10">
                    <div className="mb-5">{strings.mod_punishment_end}</div>
                    <input
                      className="form-control"
                      type="date"
                      ref={dateRef}
                      defaultValue={moment(modalAction.time)
                        .locale("en")
                        .format("YYYY-MM-DD")}
                    />
                  </div>
                )}
              </div>
              <div
                className={`${
                  state.sure
                    ? "something flex justify-content-space-between "
                    : ""
                }commandSave`}
              >
                {state.sure && (
                  <div className="will-be-deleted-div">
                    <p className="action-will-be-deleted">
                      {strings.mod_this_will_deleted}
                      <InfoIconWithText text={strings.mod_delete_date_action} />
                    </p>
                    <div className="delete-action-btns">
                      <a
                        href="#"
                        className="sure-delete-action"
                        onClick={() => deleteAction(modalAction)}
                      >
                        {" "}
                        {state.modalLoading ? "..." : strings.delete}{" "}
                      </a>
                      <a
                        href="#"
                        className="dont-delete-action"
                        onClick={() =>
                          setState({
                            modal: { ...state.modal, open: false, type: 0 },
                            sure: false,
                          })
                        }
                      >
                        {" "}
                        {strings.cancel}{" "}
                      </a>
                    </div>
                  </div>
                )}
                <button
                  className="btn btn-success btn-rounded editActionBtn"
                  onClick={() => {
                    editAction(
                      modalAction,
                      reasonRef.current.value,
                      modalAction.type === "warn" ? null : dateRef.current.value
                    );
                  }}
                >
                  {strings.EDIT}
                </button>
              </div>
            </Fragment>
          )}
        </Modal>

        <Confirm
          title="are_you_sure"
          text={strings.mod_want_delete_action}
          show={
            state.modal.action !== -1 &&
            state.modal.open === true &&
            state.modal.type === 2 &&
            modalAction !== null
          }
          onConfirm={() => {
            deleteAction(modalAction);
          }}
          onCancel={() =>
            setState({
              modal: { ...state.modal, open: false, type: 0, action: -1 },
            })
          }
          loading={state.loading}
        />
        <Pagination
          pages={state.pages}
          loading={state.loading}
          currentPage={currentPage}
          emit={(page) => {
            setCurrentPage(page);
            setState({ open: -1 });
            fetchActions(
              state.filter.type,
              state.filter.user?.id || null,
              true,
              page
            );
          }}
        />
      </div>
    </>
  );
}

class Countdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  componentDidMount() {
    const date = this.countDown.bind(this)();
    date
      ? this.setState(date)
      : clearInterval(this.intreval) && this.props.onEnd();
    this.intreval = setInterval(() => {
      const date = this.countDown.bind(this)();
      date
        ? this.setState(date)
        : clearInterval(this.intreval) && this.props.onEnd();
    }, 1000);
  }

  countDown() {
    let diff =
      (Date.parse(new Date(this.props.endDate)) - Date.parse(new Date())) /
      1000;
    if (diff <= 0) return this.props.deleteAction();
    const timeLeft = {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (diff >= 365.25 * 86400) {
      timeLeft.years = Math.floor(diff / (365.25 * 86400));
      diff -= timeLeft.years * (365.25 * 86400);
    }
    if (diff >= 31 * 86400) {
      timeLeft.months = Math.floor(diff / (31 * 86400));
      diff -= timeLeft.months * (31 * 86400);
    }
    if (diff >= 86400) {
      timeLeft.days = Math.floor(diff / 86400);
      diff -= timeLeft.days * 86400;
    }
    if (diff >= 3600) {
      timeLeft.hours = Math.floor(diff / 3600);
      diff -= timeLeft.hours * 3600;
    }
    if (diff >= 60) {
      timeLeft.minutes = Math.floor(diff / 60);
      diff -= timeLeft.minutes * 60;
    }
    timeLeft.seconds = diff;
    return timeLeft;
  }

  render() {
    return (
      <span>
        {`${this.state.years !== 0 ? `${this.state.years}y ` : ""}${
          this.state.months !== 0 ? `${this.state.months}mo ` : ""
        }${this.state.days !== 0 ? `${this.state.days}d ` : ""}${
          this.state.hours !== 0 ? `${this.state.hours}h ` : ""
        }${this.state.minutes !== 0 ? `${this.state.minutes}m ` : ""}${
          this.state.seconds !== 0 ? `${this.state.seconds}s ` : ""
        }`}
      </span>
    );
  }
}
