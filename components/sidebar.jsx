import { useContext, useState, useRef, useEffect } from "react";
import { CustomLink as Link } from "./link";
import { useRouter } from "next/router";
import { Context } from "@script/_context";
import Loading from "./loader";
import strings from "@script/locale";
import { useOnClickOutside } from "./modal";
import Modal from "react-modal";
import style from "@style/sidebar.module.css";
import Login from "./login";
import Tooltip from "rc-tooltip";
import SubscriptionsDropdown from "./SubscriptionsDropdown";

export function Sidebar({ children }) {
  const {
    user,
    guild,
    guilds,
    loading,
    logout,
    auth,
    logged,
    rtl,
    sidebarRef,
    showSidebarRef,
    guildsRef,
    checkboxRef,
    showSidebar,
    setShowSidebar,
    isLaptop,
  } = useContext(Context);
  const [logoutModal, setLogoutModal] = useState(false);
  const router = useRouter();

  useOnClickOutside(
    [showSidebarRef, sidebarRef, guildsRef],
    () => isLaptop && setShowSidebar(true)
  );

  useEffect(() => {
    setShowSidebar(true);
  }, [isLaptop]);

  if (
    !router.pathname
      .split("/")
      .some((p) =>
        [
          "dashboard",
          "premium",
          "top",
          "transactions",
          "server",
          "daily",
          "badges",
          "store",
          "memberships"
        ].includes(p)
      ) ||
    (router.pathname.split("/").some((p) => ["daily", "premium"].includes(p)) &&
      !user)
  )
    return children;

  // if (router.pathname.startsWith("/server") && !guild) return <>Guild loading</>;

  if (!logged && loading) return <Loading />;
  if (!logged) return <Login />;

  function SidebarLink({
    id,
    icon,
    href,
    as,
    children,
    newCom,
    module,
    isVip,
    isUpdated,
    iconImg,
    onClick,
  }) {
    const currentPath = router.pathname
      .split("/")
      .filter((route) => route)
      .map((route) => {
        const cleanPath = route.replace(/\[/g, "").replace(/\]/g, "");
        if (router.query[cleanPath]) return router.query[cleanPath];
        return route;
      })
      .join("/");
    let hrefPath = guild
      ? `server/${guild?.id}${
          (as || href) === "" ? "" : `/${(as || href).replace(/\/$/, "")}`
        }`
      : (as || href).replace(/\/$/, "");
    const active =
      hrefPath.split("/").length > (guild ? 2 : 0) && !hrefPath.endsWith("mod")
        ? currentPath.startsWith(hrefPath)
        : currentPath === hrefPath;
    return guild.loading || loading ? (
      <div className={style.loading}>&nbsp;</div>
    ) : (
      <Link
        onClick={onClick}
        href={guild ? `/server/${guild.id}/${href}` : `/${href}`}
        passHref
      >
        <div
          className={`${style["sidebar__general-item-row"]} ${
            active ? style["sidebar__link-active"] : ""
          }`}
          onClick={() => isLaptop && setShowSidebar(!showSidebar)}
        >
          <div className={style["sidebar__sidebar-link"]}>
            <div>
              {icon ? (
                <i className={icon}></i>
              ) : (
                <img className={style["icon-image"]} src={iconImg} alt={href} />
              )}
              {children}
              {newCom && (
                <span
                  className={`${style["new-component-tag"]} new-component-tag`}
                >
                  {strings.new}
                </span>
              )}
              {isVip && (
                <span
                  className={`${style["vip-component-tag"]} vip-component-tag`}
                  style={{ margin: isVip && newCom && "0" }}
                >
                  {strings.Premium}
                </span>
              )}
              {isUpdated && (
                <span
                  className="updated-component-tag"
                  style={{ margin: isVip && newCom && "0" }}
                >
                  {strings.update}
                </span>
              )}
            </div>
            {module &&
              (guild?.modules?.[id || href] ||
              guild?.modules?.[id || href] === undefined ? (
                <i className="fa fa-check-circle module-on success-circle"></i>
              ) : (
                <i className="fas fa-circle iconify sidebar-circle-icon"></i>
              ))}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <>
      <div
        className={`${rtl ? style.rtl : style.ltr} ${
          isLaptop ? (showSidebar ? style["hidden"] : "") : ""
        }`}
      >
        <div
          ref={guildsRef}
          className={`${style.sidebar__servers} ${
            isLaptop
              ? showSidebar
                ? style["sidebar__servers-hidden"]
                : ""
              : ""
          }`}
        >
          {loading ? (
            <></>
          ) : (
            <div className="user-image">
              <Link href="/dashboard">
                <Tooltip
                  placement={rtl ? "left" : "right"}
                  overlay={strings.home}
                >
                  <img
                    onError={(e) =>
                      (e.target.src =
                        "https://cdn.discordapp.com/embed/avatars/1.png")
                    }
                    src={user?.avatar}
                    className={`${style.guild__images} ${style.user_image}`}
                    alt="user"
                    draggable={false}
                  />
                </Tooltip>
              </Link>
            </div>
          )}
          {loading ? (
            Array.from(new Array(10).keys()).map((index) => (
              <div
                key={index}
                className={`${style["loading__guild-icon"]} mt-10`}
              ></div>
            ))
          ) : !guilds.length ? (
            <Tooltip
              placement={rtl ? "left" : "right"}
              overlay={"No Servers Found"}
            >
              <div
                className="no-server-found"
                data-background-color="#0c0c0e"
                onClick={() => auth("authback")}
              >
                <i className="fas fa-exclamation"></i>
              </div>
            </Tooltip>
          ) : (
            guilds
              .filter((g) => g.admin)
              .map((g) => (
                <Link key={g.id} href={`/server/${g.id}`}>
                  <Tooltip placement={rtl ? "left" : "right"} overlay={g.name}>
                    <img
                      className={`${style.guild__images}${
                        router.query.guild_id === g.id
                          ? ` ${style["active-server"]}`
                          : ""
                      }`}
                      name={g.name}
                      alt={g.name}
                      src={g.icon}
                      onMouseEnter={(event) => {
                        g.icon.split("/")[5]?.startsWith("a_")
                          ? (event.target.src = `${event.target.src
                              .split(".")
                              .slice(0, -1)
                              .join(".")}.gif`)
                          : "";
                      }}
                      onMouseLeave={(event) =>
                        g.icon.split("/")[5]?.startsWith("a_")
                          ? (event.target.src = g.icon)
                          : ""
                      }
                      draggable={false}
                    />
                  </Tooltip>
                </Link>
              ))
          )}
        </div>
        {((!guild && !router.pathname.includes("/server")) ||
          (guild && guild.in)) && (
          <>
            <div
              className={`${style["slider-background-color"]} ${
                isLaptop && showSidebar ? style.sidebar__hidden : ""
              }`}
            ></div>
            <aside
              ref={sidebarRef}
              className={`${style.sidebar} ${
                isLaptop && showSidebar ? style.sidebar__hidden : ""
              }`}
            >
              <div className={style.sidebar__links}>
                <>
                  <div id={style["sidebar__server-info"]}>
                    {loading ? (
                      <>
                        <div className={style.loading__avatar}></div>
                        <div className={style.loading__username}>&nbsp;</div>
                      </>
                    ) : (
                      <>
                        <div className="tw-relative">
                          {
                            !!user.membership_tier && !router.pathname.includes("/server") && (
                              <img className="tw-absolute crown__membership tw-rounded-2xl tw-p-1" src="/static/crown.png" width="27px" height="auto" />
                            )
                          }
                          <img
                            id={style.sidebar__avatar}
                            draggable={false}
                            src={
                              guild && guild.icon
                                ? guild.icon.split("/")[5]?.startsWith("a_")
                                  ? `${guild.icon
                                      .split(".")
                                      .slice(0, -1)
                                      .join(".")}.gif`
                                  : guild.icon
                                : user?.avatar.split("/")[5]?.startsWith("a_")
                                ? `${user?.avatar
                                    .split(".")
                                    .slice(0, -1)
                                    .join(".")}.gif`
                                : user?.avatar
                            }
                            alt={guild ? "server image" : "avatar"}
                            onError={(e) =>
                              (e.target.src =
                                "https://cdn.discordapp.com/embed/avatars/1.png")
                            }
                          />
                        </div>
                        <div className="tw-flex tw-w-full tw-mt-2 tw-items-center tw-justify-center tw-gap-2">
                         <h4>{guild ? guild.name : user?.name}</h4>
                         {!!user.membership_tier && !router.pathname.includes("/server") && (
                            <p className="tw-relative membership_tag tw-top-[7px]">{strings.membership}</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  <div id={style.sidebar__items}>
                    {guild.loading || loading || guild ? (
                      <>
                        <Category text="GENERAL">
                          <SidebarLink href="" icon="fas fa-eye">
                            {strings.OVERVIEW}
                          </SidebarLink>
                          <SidebarLink href="settings" icon="fas fa-cog">
                            {strings.server_settings}
                          </SidebarLink>
                          <SidebarLink
                            href="embed"
                            icon="fas fa-window-restore"
                            isUpdated
                          >
                            {strings.embeder}
                          </SidebarLink>
                          <SidebarLink
                            href={
                              guild.botnumber > 1 ? "premium/manage" : "premium"
                            }
                            as="premium"
                            icon="fas fa-chevron-circle-up"
                          >
                            {guild.botnumber > 1
                              ? strings.manage_premium
                              : strings.get_premium}
                          </SidebarLink>
                        </Category>

                        <Category text="MODULE_SETTINGS">
                          <SidebarLink href="utility" icon="fas fa-sun" module>
                            {strings.Utility}
                          </SidebarLink>
                          <SidebarLink href="mod" icon="fas fa-tasks" module>
                            {strings.Moderation}
                          </SidebarLink>
                          <SidebarLink
                            href="automod"
                            icon="fas fa-robot"
                            module
                          >
                            {strings.automod}
                          </SidebarLink>
                          <SidebarLink
                            href="welcomer"
                            icon="fas fa-hand-paper"
                            module
                          >
                            {strings.WELCOMER}
                          </SidebarLink>

                          <SidebarLink
                            href="auto_responder"
                            icon="fas fa-paper-plane"
                            module
                          >
                            {strings.AUTO_RESPONDER}
                          </SidebarLink>
                          <SidebarLink
                            href="leveling"
                            icon="fas fa-sort-amount-up"
                            module
                          >
                            {strings.index_card3_title}
                          </SidebarLink>
                          <SidebarLink
                            href="autoroles"
                            icon="fas fa-medal"
                            module
                          >
                            {strings.AUTO_ROLES}
                          </SidebarLink>
                          <SidebarLink href="logs" icon="fas fa-history" module>
                            {strings.Logs}
                          </SidebarLink>
                          <SidebarLink
                            href="colors"
                            icon="fas fa-palette"
                            module
                            isUpdated
                          >
                            {strings.Colors}
                          </SidebarLink>
                          <SidebarLink
                            href="reaction_roles"
                            icon="fas fa-grin-wink"
                            module
                          >
                            {strings.reaction_roles}
                          </SidebarLink>
                          <SidebarLink
                            id="starboard"
                            href="starboard"
                            icon="fa-solid fa-star"
                            module
                            newCom
                          >
                            {strings.starboard}
                          </SidebarLink>
                          <SidebarLink
                            id="temp-module"
                            href="temporary-channel"
                            icon="fa-solid fa-square-plus"
                            module
                          >
                            {strings.temp_channel_module}
                          </SidebarLink>

                          <SidebarLink
                            id="link"
                            href="temp_link"
                            icon="fas fa-link"
                            module
                            isVip
                          >
                            {strings.Link}
                          </SidebarLink>
                          <SidebarLink
                            id="vn"
                            href="voice_online"
                            icon="fas fa-microphone-alt"
                            module
                            isVip
                          >
                            {strings.Voice_Online}
                          </SidebarLink>
                          <SidebarLink
                            href="anti_raid"
                            icon="fas fa-hand-paper"
                            module
                            isVip
                          >
                            {strings.anti_raid}
                          </SidebarLink>
                          <SidebarLink
                            href="protection"
                            icon="fas fa-shield-alt"
                            module
                            isVip
                          >
                            {strings.protection}
                          </SidebarLink>
                        </Category>

                          <Category text="notifications">
                            <SidebarLink
                              href="notifications/twitch"
                              icon="fab fa-twitch"
                              id="notifications_twitch"
                              module
                              newCom
                            >
                              {strings.twitch}
                            </SidebarLink>
                            {/* <SidebarLink href="notifications/youtube" icon="fab fa-youtube" module newCom>{strings.youtube}</SidebarLink>
														<SidebarLink href="notifications/trovo" iconImg="/static/LogoTrovo.png" module newCom>{strings.trovo}</SidebarLink>
														<SidebarLink href="notifications/reddit" icon="fab fa-reddit-alien" module newCom>{strings.reddit}</SidebarLink> */}
                          </Category>

                        <Category text="OTHERS">
                          <SidebarLink href="panel_logs" icon="fas fa-wrench">
                            {strings.PANEL_LOGS}
                          </SidebarLink>
                          <SidebarLink
                            href="mod_actions"
                            icon="fas fa-file-alt"
                          >
                            {strings.mod_actions}
                          </SidebarLink>
                        </Category>
                      </>
                    ) : (
                      <>
                        <Category text="GENERAL">
                          <SidebarLink href="dashboard" icon="fas fa-eye">
                            {strings.OVERVIEW}
                          </SidebarLink>
                          <SidebarLink
                            href={user.membership_tier ? "memberships/manage" : "memberships"}
                            as="membership"
                            icon="far fa-gem"
                            newCom
                          >
                            {strings.membership}
                          </SidebarLink>
                          <SidebarLink
                            href="premium/manage"
                            as="premium"
                            icon="fas fa-chevron-circle-up"
                          >
                            {strings.manage_premium}
                          </SidebarLink>
                        </Category>

                        <Category text="CREDITS_STORE">
                          <SidebarLink
                            as="profile"
                            href="store/profile"
                            icon="fas fa-user-circle"
                          >
                            {strings.PROFILE_BACKGROUNDS}
                          </SidebarLink>
                          <SidebarLink href="badges" icon="fas fa-certificate">
                            {strings.BADGES}
                          </SidebarLink>
                          <SidebarLink
                            as="rank"
                            href="store/rank"
                            icon="fas fa-id-card"
                          >
                            {strings.ID_BACKGROUNDS}
                          </SidebarLink>
                        </Category>

                        <Category text="LEADERBOARD">
                          <SidebarLink href="top/xp" icon="fas fa-medal">
                            {strings.top_xp}
                          </SidebarLink>
                          <SidebarLink
                            href="top/credits"
                            icon="fas fa-money-bill-wave"
                          >
                            {strings.top_credits}
                          </SidebarLink>
                        </Category>

                        <Category text="OTHERS">
                          <SidebarLink href="daily" icon="fas fa-gift">
                            {strings.daily}
                          </SidebarLink>
                          <SidebarLink
                            href="transactions"
                            icon="fas fa-exchange-alt"
                          >
                            {strings.credit_transactions}
                          </SidebarLink>
                          <SidebarLink
                            href="#"
                            onClick={() => setLogoutModal(true)}
                            icon="fas fa-sign-out-alt"
                          >
                            {strings.LOGOUT}
                          </SidebarLink>
                        </Category>
                      </>
                    )}
                  </div>
                </>
              </div>
            </aside>
          </>
        )}
      </div>
      <Modal
        isOpen={logoutModal}
        onRequestClose={() => setLogoutModal(false)}
        className="smallModal bg-modal logout-modal__content"
        parentSelector={() => document.getElementById("main")}
      >
        <div id="logout-modal" dir="auto">
          <div className="Modalhead">
            <h5>{strings.LOGOUT_CONFIRM}</h5>
            <button onClick={() => setLogoutModal(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div>
            <div className="form-check">
              <input
                style={{ marginTop: "3px" }}
                ref={checkboxRef}
                className="form-check-input"
                type="checkbox"
                id="logout_all"
              />
              <label className="form-check-label" htmlFor="logout_all">
                {strings.logout_all}
              </label>
            </div>
          </div>
          <div>
            <button onClick={() => setLogoutModal(false)}>
              {strings.cancel}
            </button>
            <button
              onClick={() => {
                logout(checkboxRef.current.checked);
                setLogoutModal(false);
              }}
            >
              {strings.LOGOUT}
            </button>
          </div>
        </div>
      </Modal>
      <section
        className={`${
          showSidebar
            ? isLaptop
              ? "dashboard-container-hidden"
              : `dashboard-container ${
                  (!guild && !router.pathname.includes("/server")) ||
                  (guild && guild.in)
                    ? ""
                    : "no-guild"
                }`
            : "dashboard-container remove-margin"
        }`}
      >
        <div
          className="component"
          style={{
            opacity: isLaptop && !showSidebar ? "0.5" : undefined,
            pointerEvents: isLaptop && !showSidebar ? "none" : undefined,
          }}
        >
          {guild.loading || loading || !user ? (
            <>
              <Loading />{`  `}
              <span>
                {guild.loading && <div className="Guild loading" />}{" "}
                {loading && <div className="loading" />}{" "}
                {!user && <div className="Not user" />}{" "}
                {guild.loading && <div className="Guild loading" />}{" "}
                {guild !== true && <div className="Guild data not true" />}
              </span>
            </>
          ) : (
            <>
              <div className={`component-container${rtl ? " rtl" : ""}`}>
                {guild && guild.botnumber > 1 &&
                guild.protection &&
                guild.protection.probot_access === "members" &&
                  !(
                    guild.owner === user.id ||
                    (guild.protection.probot_members && guild.protection.probot_members.includes(user.id))
                  )
                ? <div className="mt-50 invite_div center">
                <h1>
                  <i className="fas fa-exclamation-triangle"></i>
                </h1>
                <h3>
                  {strings["contact_owner_allow"]}
                </h3>
              </div> : (guild && guild.in) ||
                (!guild && !router.pathname.includes("/server")) ? (
                  children
                ) : ( guild.error ? (
                  <div className="mt-50 invite_div center">
                    <h1>
                      <i className="fas fa-exclamation-triangle"></i>
                    </h1>
                    <h3>
                      {guild.strings
                        ? strings.formatString(
                            ...guild.strings.map((s) => strings[s] || s)
                          )
                        : guild.error}
                    </h3>
                  </div>
                ) : (
                  <div
                    className={`mt-50 invite_div center ${
                      style["guild-not-in"]
                    } ${rtl ? style["guild-not-in-rtl"] : ""}`}
                  >
                    <SubscriptionsDropdown />
                  </div>
                ))}
                <div style={{ height: "100px" }} />
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

function Category({ children, text }) {
  const { user, loading, guild } = useContext(Context);
  const [state, setState] = useState(true);

  useEffect(() => {
    if (
      !localStorage.getItem(`hide_${guild.id || user?.id}_${text}`) &&
      !guild.loading &&
      !loading
    ) {
      localStorage.setItem(`hide_${guild.id || user?.id}_${text}`, 1);
      setState(`hide_${guild.id || user?.id}_${text}`);
    }
  }, [guild.loading, loading]);

  return (
    <>
      <div
        onClick={() => {
          if (guild.loading || loading) return;
          if (
            localStorage.getItem(`hide_${guild.id || user?.id}_${text}`) == 0
          ) {
            setState(`hide_${guild.id || user?.id}_${text}`);
            localStorage.setItem(`hide_${guild.id || user?.id}_${text}`, 1);
          } else {
            setState(null);
            localStorage.setItem(`hide_${guild.id || user?.id}_${text}`, 0);
          }
        }}
        className={`${style["sidebar__general-item"]} ${
          localStorage.getItem(`hide_${guild.id || user?.id}_${text}`) == 1
            ? style["category_opened"]
            : style["category_closed"]
        }`}
      >
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L5 5L9 1"
            stroke="#878787"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h3>{strings[text]}</h3>
      </div>
      {(localStorage.getItem(`hide_${guild.id || user?.id}_${text}`) == 1 ||
        loading ||
        guild.loading) && <div>{children}</div>}
    </>
  );
}
