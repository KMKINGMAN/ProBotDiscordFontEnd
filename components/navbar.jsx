/* eslint-disable indent */
import { useRef, useState, useEffect, useContext } from "react";
import strings, { lang } from "@script/locale";
import { useRouter } from "next/router";
import { CustomLink as Link } from "./link";
import nav from "../styles/navbar.module.css";
import { Context } from "../scripts/_context";
import Dropdown from "rc-dropdown";

export default function Navbar({}) {
  const router = useRouter();
  const {
    user,
    language,
    rtl,
    showSidebarRef,
    isLaptop,
    showSidebar,
    setShowSidebar,
  } = useContext(Context);
  const [showNavSettings, setShowNavSettings] = useState(false);
  const [showNav, changeShowNav] = useState(false);
  const [isSideBar, setIsSideBar] = useState(false);

  useEffect(() => {
    changeShowNav(Boolean(window.innerWidth <= 830));
    window.addEventListener("resize", () =>
      changeShowNav(Boolean(window.innerWidth <= 830))
    );
  }, []);

  useEffect(() => {
    setShowNavSettings(false);
  }, [showNav]);

  useEffect(() => {
    if (!user) return setIsSideBar(false);
    if (
      router.pathname
        .split("/")
        .some((p) =>
          ["dashboard", "server", "daily", "badges", "store", "premium", "top", "transactions", "memberships"].includes(p)
        )
    ) {
      setIsSideBar(true);
    } else {
      setIsSideBar(false);
    }
  }, [router.pathname, user]);
  //if (process.env.NODE_ENV === "development") console.log(router.pathname);

  return (
    <>
      <nav
        dir={rtl ? "rtl" : "ltr"}
        className={`${nav.container} ${nav.container__home} ${
          rtl ? nav.rtl : ""
        }`}
      >
        <Link href="/">
          <img
            id={nav["probot-logo"]}
            draggable={false}
            src="/static/logo2.svg"
            alt="brand"
          />
        </Link>
        {isSideBar && isLaptop && (
          <div ref={showSidebarRef} id={nav.showSidebar}>
            <div
              className={`${nav["menu-button"]} ${
                showSidebar
                  ? nav["menu-button__not-active"]
                  : nav["menu-button__active"]
              }`}
              tabIndex="0"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <span className={nav["icon-bar"]} />
              <span className={nav["icon-bar"]} />
              <span className={nav["icon-bar"]} />
            </div>
          </div>
        )}
        <div>
          {showNav && (
            <div id={nav["showNav-settings"]}>
              <img
                onClick={() => setShowNavSettings(!showNavSettings)}
                draggable={false}
                src="/static/menu-nav-icon.svg"
                alt="menu-nav-icon"
                className={`${nav["menu-nav-icon"]} ${
                  showNavSettings ? nav["menu-nav-icon-active"] : ""
                }`}
              />
            </div>
          )}
          <div>
            <img
              src="/static/commandIcon.svg"
              alt="command-icon"
              draggable={false}
            />
            <h5>
              <Link href="/commands">{strings.commands}</Link>
            </h5>
          </div>
          <div>
            <img
              src="/static/questionmark.svg"
              alt="question-mark"
              draggable={false}
            />
            <h5>
              <Link href="https://discord.com/invite/ProBot" target="_blank">
                {strings.support}
              </Link>
            </h5>
          </div>
        </div>
        <div>
          <Dropdown
            prefixCls={"dropdown"}
            trigger={"click"}
            overlay={
              <div className="dropdown__content">
                <ul
                  className={rtl ? nav.rtl : ""}
                  style={{
                    height: "50vh",
                    overflow: "auto",
                    overflowX: "hidden",
                    scrollbarWidth: "thin",
                    margin: "0",
                    padding: "0",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {Object.keys(lang)
                    .sort()
                    .filter((index) => language !== index)
                    .map((index, i) => (
                      <Link key={index} locale={index}>
                        <li
                          key={index}
                          className={nav["languages__flag-name"]}
                          onClick={() =>
                            localStorage.setItem("language", index)
                          }
                        >
                          <a>
                            <img
                              src={`/static/flags/${lang[index].flag}.png`}
                              alt={`${language} flag`}
                              draggable={false}
                            />
                            <p>{lang[index].name}</p>
                          </a>
                        </li>
                      </Link>
                    ))}
                </ul>
              </div>
            }
            className={`inline-block`}
          >
            <img
              className="flag"
              alt={`${language} flag`}
              src={`/static/flags/${lang[language]?.flag}.png`}
              draggable={false}
            />
          </Dropdown>
        </div>
      </nav>
      <nav
        className={
          showNavSettings ? "navbar-mobile-active" : nav["navbar-mobile"]
        }
      >
        <div>
          <h5>
            <Link href="/commands">{strings.commands}</Link>
          </h5>
        </div>
        <div>
          <h5>
            <Link href="https://discord.com/invite/ProBot" target="_blank">
              {strings.support}
            </Link>
          </h5>
        </div>
      </nav>
      {showNavSettings && (
        <div
          style={{
            position: "fixed",
            top: "0px",
            right: "0px",
            bottom: "0px",
            left: "0px",
          }}
          onClick={() => setShowNavSettings(!showNavSettings)}
        />
      )}
    </>
  );
}
