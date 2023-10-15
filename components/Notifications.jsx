import { useState, useContext } from "react";
import strings from "@script/locale";
import PagesTitle from "@component/PagesTitle";
import Unsaved from "./unsaved";
import { Context } from "@script/_context";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Alert from "@component/alert";
import Dropdown from "@component/dropdown";

export default function Notifications({ page }) {
  const { guild } = useContext(Context);
  const [state, setState] = useState([]);
  const [openRow, setOpenRow] = useState(0);
  const [openDropdown, setOpenDropdown] = useState();
  const [openWarn, setOpenWarn] = useState(false);

  return (
    <>
      <header>
        <div className="custom-page-title">
          <PagesTitle data={{
            name: page,
            module: `notifications_${page}`
          }} />
        </div>
        <Unsaved method={`notifications_${page}`} state={state} setStates={setState}/>
        <div className={`header-image ${`${page}-image`}`} />
      </header>
      {page === "youtube" ? (
        <Dropdown 
        className="full-width"
        visible={openDropdown}
        overlay={<div className="youtube-select-notifications_type" style={{ left: "unset!important" }}>
        <ul>
          <li onClick={() => {
            setOpenDropdown(false);
            if (guild.vip) {
              setState([...state, { username: "", channel: "", content: "", alertType: "liveAlert" }]);
            } else if (state.length > 1 || state.some(alert => alert.alertType === "liveAlert")) {
              setOpenWarn(true);
            } else {
              setState([...state, { username: "", channel: "", content: "", alertType: "liveAlert" }]);
            }
          }}>
            <i className="fad fa-signal-stream"></i>
            Add Live Alert
          </li>
          <li onClick={() => {
            setOpenDropdown(false);
            if (guild.vip) {
              setState([...state, { username: "", channel: "", content: "", alertType: "videoAlert" }]);
            } else if (state.length > 1 || state.some(alert => alert.alertType === "videoAlert")) {
              setOpenWarn(true);
            } else {
              setState([...state, { username: "", channel: "", content: "", alertType: "videoAlert" }]);
            }
          }}>
            <i className="fab fa-youtube"></i>
            Add Channel
          </li>
        </ul>
      </div>
    }
        >
          
            <button className="btn btn-primary btn-icon justify-content-between full-width"
              style={{ zIndex: "2", maxWidth: "187px" }}
              onClick={() => setOpenDropdown(!openDropdown)}
            >
              Add Alert
              <i className="fas fa-chevron-down"></i>
            </button>
          
          </Dropdown>
      ) : (
        <button className="btn btn-primary btn-icon"
          onClick={() => {
            if (guild.vip) {
              setState([...state, { username: "", channel: "", content: "" }]);
            } else if (state.length > 0) {
              setOpenWarn(true);
            } else {
              setState([...state, { username: "", channel: "", content: "" }]);
            }
          }}
          style={{ zIndex: "2" }}
        >
          <i className="fas fa-plus"></i>
          Add {page === "reddit" ? "Alert" : "Channel"}
        </button>
      )}
      <div className="row-container mt-25">
        {Array.isArray(state) && state?.map((channel, index) => (
          <div className="notifications-row" key={index}>
            <div>
              <header>
                <h1 className="d-flex gap-1 align-items-center text-break">
                  {page === "youtube" ? channel.alertType === "liveAlert" ? <i className="fad fa-signal-stream"></i> : <i className="fab fa-youtube"></i> : ""}
                  {channel.username || "Need setup"}
                </h1>
                {channel.content && <p>{channel.content}</p>}
              </header>
              <div className="d-flex align-items-center gap-2">
                <button
                  onClick={() => { (openRow === index) ? setOpenRow(false) : setOpenRow(index) }}
                  className={`btn btn-primary btn-icon ${openRow === index ? "activeBtn" : ""}`}>
                  <img src="/static/edit.svg" alt="edit-image" /> {strings.EDIT}
                </button>
                <button onClick={() => {
                  setState(state.filter((card, i) => i !== index));
                }} className="btn btn-danger btn-icon">
                  <i className="fas fa-trash"></i> {strings.delete}
                </button>
              </div>
            </div>
            <div className={`edit-notifications-row${openRow === index ? " edit-notifications-row__opened" : ""}`}>
              <div className="two-inputs-row">
                <div className="d-flex flex-column">
                  <label htmlFor={`notifications-username-${index}`}>Username</label>
                  <input type="text" value={state[index].username}
                    onChange={event => {
                      const array = state.slice();
                      array[index].username = event.target.value
                      setState(array);
                    }}
                    className="form-control mt-5" placeholder="Username (able to be a link)"
                    id={`notifications-username-${index}`}
                  />
                </div>
                <div className="d-flex flex-column">
                  <label htmlFor="notifications-channel" className="mb-5">Send to Channel</label>
                  <Select placeholder={strings.select_placeholder_select}
                    classNamePrefix="formselect"
                    onChange={(value) => {
                      const array = state.slice();
                      array[index].channel = value.value;
                      setState(array);
                    }}
                    value={guild.channels.filter((channel) => state[index].channel?.includes(channel.id)).map((r) => ({ label: "#" + r.name, value: r.id }))}
                    options={guild.channels?.filter((c) => c.type === 0)
                      .map((channel) => ({ label: "#" + channel.name, value: channel.id })) || []}
                    isMulti={guild.vip}
                    components={makeAnimated()}
                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                  />
                </div>
              </div>
              <div className="d-flex flex-column mt-16">
                <label htmlFor={`notifications-content-${index}`}>Content</label>
                <textarea value={state.content}
                  onChange={event => {
                    const array = state.slice();
                    array[index].content = event.target.value
                    setState(array);
                  }} id={`notifications-content-${index}`}
                  className="form-control mt-5" placeholder="Insert Content Here" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}