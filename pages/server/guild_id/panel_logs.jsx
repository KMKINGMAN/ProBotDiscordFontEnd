/* eslint-disable indent */
import { Fragment, useState, useContext, useEffect } from "react";
import strings from "@script/locale";
import axios from "axios";
import moment from "moment";
import Pagination from "@component/Pagination";
import { Context } from "@script/_context";
import PagesTitle from "@component/PagesTitle";
import Unsaved from "@component/unsaved";
import style from "@style/panelLogs.module.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export default function PanelLogs() {
  const { guild } = useContext(Context);
  const [state, setStates] = useState({
    loading: true,
    currentPage: 1
  });

  const icons = {
    modules: "fas fa-circle",
    rr: "fas fa-smile-wink",
    reaction_roles: "fas fa-smile-wink",
    set_welcome: "fas fa-hand-paper",
    command: "fas fa-terminal",
    colors: "fas fa-palette",
    logs: "fas fa-history",
    music: "fas fa-music",
    logs2: "fas fa-history",
    embed: "fas fa-cog",
    send_embed: "fas fa-cog",
    add_embed: "fas fa-cog",
    delete_embed: "fas fa-cog",
    edit_embed: "fas fa-cog",
    moderation: "fas fa-cog",
    mod: "fas fa-cog",
    settings: "fas fa-cog",
    add_response: "fas fa-paper-plane",
    edit_response: "fas fa-paper-plane",
    delete_response: "fas fa-paper-plane",
    leveling: "fas fa-sort-amount-up",
    anti_raid: "fas fa-hand-paper",
    protection: "fas fa-shield-alt",
    automod: "fas fa-robot",
    auto_mod: "fas fa-robot",
    autorole: "fas fa-medal",
    autoroles: "fas fa-medal",
    linksettings: "fas fa-link",
    link_settings: "fas fa-link",
    voice_online: "fas fa-microphone-alt",
    utility: "fas fa-cogs",
    welcomer: "fas fa-hand-paper",
    auto_responder: "fas fa-paper-plane",
    link: "fas fa-link",
    welcome_2_settings: "fas fa-hand-paper",
  };

  const setState = object => setStates(prevState => ({ ...prevState, ...object }));

  function getlogs(page = 1) {
    setState({ loading: true });
    axios.get(`${guild.id}/panel_logs`, {
      params: { page }
    })
      .then(response => {
        setState({ logs: response.data, loading: false });
      });
  }
  useEffect(() => { getlogs(); }, []);

  return (
    <>
      <PagesTitle data={{ name: "PANEL_LOGS" }} />
      {state.loading || <div className="custom-resposive-table">
        <table>
          <thead className="bg-gray-2">
            <tr>
              <th>{strings.transactions_user}</th>
              <th>{strings.Action}</th>
              <th>{strings.transactions_date}</th>
            </tr>
          </thead>
          <tbody>
            {state.logs.logs.map((action, index) => {
              const user = state.logs.users.find(user => user?.id === action.user);
              return (
                <tr className={`bg-command${!(state.logs.logs.length === index+1)	? " table-border-bottom" : ""}`} key={index}>
                  <td style={{ minWidth: "300px" }} className={style["user-info"]}>
                    <img src={user?.avatar} alt={user?.name} className={style["user-avatar"]} onError={event => event.target.src = "https://cdn.discordapp.com/embed/avatars/0.png"} />
                    <div>
                      <p className={style.username_d}>{`${user?.name}#${user?.discriminator}`}</p>
                      <p className={style.user_id}>{user?.id}</p>
                    </div>
                  </td>
                  <td style={{ minWidth: "300px" }} className={style["row-action"]}>{action.action}<i className={`iconify ${icons[action.action.split(" ")[1]]}`}></i></td>
                  <td style={{ minWidth: "200px" }}>{moment(action.time).format("DD/MM/YYYY h:mm:ss a")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>}
      {state.loading &&
        <SkeletonTheme color="#36393F" highlightColor="#2F3136">
          {Array.from(Array(10).keys()).map(index => (
            <div key={index} className="transactions-row transactions-skeleton-row" style={{ borderBottom: "1px solid #434242", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{
                display: "flex",
                alignItems: "center"
              }}>
                <Skeleton style={{ margin: "0 10px" }} circle height={50} width={50} />
                <Skeleton style={{ margin: "0 10px" }} width="10em" />
              </div>
              <Skeleton style={{ margin: "0 10px" }} width="10em" />
              <Skeleton style={{ margin: "0 10px" }} width="10em" />
            </div>
          ))}
        </SkeletonTheme>}
      {(!state.loading && !state.logs.logs.length) && (
        <div className={`${style.row} d-flex justify-content-center`}>
          <h6>{strings.no_results_found}</h6>
        </div>
      )}
      <Pagination pages={state?.logs?.pages} currentPage={state.currentPage} loading={state.loading} emit={page => {
        state.currentPage = page;
        getlogs(page);
      }} />
    </>
  );
}
