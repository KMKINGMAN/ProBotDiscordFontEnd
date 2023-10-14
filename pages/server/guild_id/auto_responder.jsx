import { useContext, useState, useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useRouter } from "next/router";
import Modal from "react-modal";
import axios from "axios";
import isEqual from "lodash/isEqual";
import Confirm from "@component/Confirm";

import { Context } from "@script/_context";
import strings from "@script/locale";
import { CHANNELS_STYLES, ROLES_STYLES } from "@script/constants";

import PagesTitle from "@component/PagesTitle";
import InfoIconWithText from "@component/InfoIconWithText";
import { getLocaleError } from "@script/handle_error";

function Response({ type, data, oldData, setData, save, cancel, isModal }) {
  const [currentResponse, setCurrentResponse] = useState(0);
  const { guild } = useContext(Context);

  useEffect(() => {
    if(data.response[currentResponse] === undefined) setCurrentResponse(0);
  },[data]);

  return (
    <div className={isModal ? " custom-modal__body" : ""}>
      <label className="control-label">{strings.Trigger}</label>
      <input
        className="form-control"
        type="text"
        id="trigger"
        placeholder={strings.Trigger}
        value={data?.trigger}
        disabled={type === "edit"}
        onChange={(event) => setData({ ...data, trigger: event.target.value })}
        autoComplete="off"
      />

    <div className="d-flex">

            <div
        className="form-check ml-5 mt-5 d-flex align-items-center gap-1"
        style={{ padding: "0" }}
      >
        <input
          className="form-check-input"
          style={{ marginTop: "0", marginLeft: "0" }}
          type="checkbox"
          checked={data.wildcard}
          onChange={(event) =>
            setData({ ...data, wildcard: event.target.checked })
          }
          id={`${isModal ? "modal-" : ""}flexCheckDefault`}
        />
        <label
          className="form-check-label d-flex align-items-center gap-1 p-0 pt-1"
          htmlFor={`${isModal ? "modal-" : ""}flexCheckDefault`}
        >
          {strings.wildcard}
          <InfoIconWithText ms={0} text={strings.wildcard_description} data-background-color="#464668" />
        </label>
      </div>

      <div
        className="form-check ms-2 mt-5 d-flex align-items-center gap-1"
        style={{ padding: "0" }}
      >
        <input
          className="form-check-input"
          style={{ marginTop: "0", marginLeft: "0" }}
          type="checkbox"
          checked={data.send_as_reply}
          onChange={(event) =>
            setData({ ...data, send_as_reply: event.target.checked })
          }
          id={`${isModal ? "modal-" : ""}send_as_reply`}
        />
        <label
          className="form-check-label d-flex align-items-center gap-1 p-0 pt-1"
          htmlFor={`${isModal ? "modal-" : ""}send_as_reply`}
        >
          {strings.send_as_reply}
        </label>
      </div>

       {data.send_as_reply &&       <div
        className="form-check ms-2 mt-5 d-flex align-items-center gap-1"
        style={{ padding: "0" }}
      >
        <input
          className="form-check-input"
          style={{ marginTop: "0", marginLeft: "0" }}
          type="checkbox"
          checked={data.ping_the_author}
          onChange={(event) =>
            setData({ ...data, ping_the_author: event.target.checked })
          }
          id={`${isModal ? "modal-" : ""}ping_the_author`}
        />
        <label
          className="form-check-label d-flex align-items-center gap-1 p-0 pt-1"
          htmlFor={`${isModal ? "modal-" : ""}ping_the_author`}
        >
          {strings.ping_the_author}
        </label>
      </div>}

    </div>



      <label className="control-label mt-10">{strings.Response}</label>
      <textarea
        label={strings.Response}
        className={"form-control"}
        placeholder={strings.Response}
        value={data.response[currentResponse]}
        onChange={(event) =>
          setData({
            ...data,
            response: [
              ...data.response.map((r, i) =>
                i === currentResponse ? event.target.value : r
              ),
            ],
          })
        }
      />
      {data.response.length > 1 && (
        <div className="d-flex justify-content-end">
          <button
            onClick={() => {
              setData({
                ...data,
                response: [
                  ...data.response.filter((r, i) => i !== currentResponse),
                ],
              });
              setCurrentResponse(
                currentResponse === 0 ? 0 : currentResponse - 1
              );
            }}
            className="btn btn-danger mt-3  cursor-pointer capitalize-font"
          >
            <i className="fas fa-trash me-2"></i>
            {strings.delete_this_response}
          </button>
        </div>
      )}
      <div className="mb-15">
        <label className="control-label mt-15">{strings.random_responses}</label>
        <div className="row row-cols-auto">
          <div className="col">
            <ul className="custom-pagination mt-8 p-0">
              {data?.response.map((r, i) => (
                <li
                  key={i}
                  className={i === currentResponse ? "active" : ""}
                  onClick={() => setCurrentResponse(i)}
                >
                  {i + 1}
                </li>
              ))}
            </ul>
          </div>
          {!data.response.includes("") && (
            <button
              onClick={() => {
                setData({ ...data, response: [...data.response, ""] });
                setCurrentResponse(data.response.length);
              }}
              className="btn btn-primary d-flex flex-sm-row align-self-center align-items-center gap-1 ma-10"
            >
              <i className="fas fa-plus"></i>
              {strings.ADD_RESPONSE}
            </button>
          )}
        </div>
      </div>
      <div className="d-flex flex-column align-items-start">
        <label className="control-label">{strings.Variables}</label>
        <p>
          <code>[user]</code>
          {strings.to_mention_author}
        </p>
        <p>
          <code>[userName]</code>
          {strings.name_of_user}
        </p>
        <p>
          <code>[invites]</code>
          {strings.user_invites_counter}
          <span className="vip-component-tag">{strings.Premium}</span>
        </p>
      </div>
      <div className="row row-cols-1 row-cols-md-2">
        <div className="col mt-10">
          <label className="control-label">{strings.ENABLED_ROLES}</label>
          <Select
            placeholder={strings.select_placeholder_select}
            isDisabled={data.disabledRoles?.length}
            value={guild.roles
              .filter((r) => data.enabledRoles?.includes(r.id))
              .map((r) => ({ label: r.name, value: r.id, color: r.color }))}
            onChange={(val) => {
              const valValue = val.map((v) => v.value);
              const disabledRoles = data.disabledRoles?.filter(
                (r) => !valValue.includes(r)
              );
              setData({ ...data, enabledRoles: valValue, disabledRoles });
            }}
            options={
              guild.roles
                ?.filter((r) => r.id !== guild.id)
                .map((role) => ({ label: role.name, value: role.id, color: role.color })) || []
            }
            classNamePrefix="formselect"
            isMulti
            components={makeAnimated()}
            menuPortalTarget={document.body}
            styles={ROLES_STYLES}
            noOptionsMessage={() => strings.no_option}
          />
        </div>
        <div className="col mt-10">
          <label className="control-label">{strings.DISABLED_ROLES}</label>
          <Select
            isDisabled={data.enabledRoles?.length}
            placeholder={strings.select_placeholder_select}
            value={guild.roles
              .filter((r) => data.disabledRoles?.includes(r.id))
              .map((r) => ({ label: r.name, value: r.id, color: r.color }))}
            onChange={(val) => {
              const valValue = val.map((v) => v.value);
              const enabledRoles = data.enabledRoles?.filter(
                (r) => !valValue.includes(r)
              );
              setData({ ...data, disabledRoles: valValue, enabledRoles });
            }}
            options={
              guild.roles
                ?.filter((r) => r.id !== guild.id)
                .map((role) => ({ label: role.name, value: role.id, color: role.color })) || []
            }
            classNamePrefix="formselect"
            isMulti
            components={makeAnimated()}
            menuPortalTarget={document.body}
            styles={ROLES_STYLES}
            noOptionsMessage={() => strings.no_option}
          />
        </div>
        <div className="col mt-10">
          <label className="control-label">{strings.ENABLED_CHANNELS}</label>
          <Select
            placeholder={strings.select_placeholder_select}
            isDisabled={data.disabledChannels?.length}
            value={guild.channels
              .filter((channel) => data.enabledChannels?.includes(channel.id))
              .map((r) => ({ label: "#" + r.name, value: r.id }))}
            onChange={(val) => {
              const valValue = val.map((v) => v.value);
              setData({ ...data, enabledChannels: valValue });
            }}
            menuPortalTarget={document.body}
            options={
              guild.channels
                ?.filter((c) => c.type === 0)
                .map((channel) => ({
                  label: "#" + channel.name,
                  value: channel.id,
                })) || []
            }
            classNamePrefix="formselect"
            isMulti
            components={makeAnimated()}
            styles={CHANNELS_STYLES}
            noOptionsMessage={() => strings.no_option}
          />
        </div>
        <div className="col mt-10">
          <label className="control-label">{strings.DISABLED_CHANNELS}</label>
          <Select
            placeholder={strings.select_placeholder_select}
            isDisabled={data.enabledChannels?.length}
            value={guild.channels
              .filter((channel) => data.disabledChannels?.includes(channel.id))
              .map((r) => ({ label: `#${r.name}`, value: r.id }))}
            onChange={(val) => {
              const valValue = val.map((v) => v.value);
              setData({ ...data, disabledChannels: valValue });
            }}
            menuPortalTarget={document.body}
            options={
              guild.channels
                ?.filter((c) => c.type === 0)
                .map((channel) => ({
                  label: `#${channel.name}`,
                  value: channel.id,
                })) || []
            }
            classNamePrefix="formselect"
            isMulti
            components={makeAnimated()}
            styles={CHANNELS_STYLES}
            noOptionsMessage={() => strings.no_option}
          />
        </div>
      </div>

      <div className="mt-25 d-flex gap-2">
        <button
          className="btn btn-secondary"
          disabled={isEqual(oldData, data)}
          onClick={() => save()}
        >
          <i className="fas fa-save"></i> {strings.SAVE_CHANGES}
        </button>
        <button
          className="btn btn-primary"
          disabled={isEqual(oldData, data)}
          onClick={() => cancel()}
        >
          {strings.cancel}
        </button>
      </div>
    </div>
  );
}

function Row({ value, deleteResponse, isDeleting, editResponse }) {
  const [data, setData] = useState(value);
  const [open, setOpen] = useState(false);
  const [isTablet, changeIsTablet] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setData(value);
  }, [value]);

  useEffect(() => {
    changeIsTablet(Boolean(window.innerWidth <= 768));
    window.addEventListener("resize", () =>
      changeIsTablet(Boolean(window.innerWidth <= 768))
    );
  }, []);

  return (
    <div className="black-container pa-15">
      <div className="row">
        <Confirm
          title="are_you_sure"
          text={strings.mod_want_delete_action}
          show={confirmDelete}
          onConfirm={() => {
            deleteResponse(value?.trigger);
            setConfirmDelete(false);
          }}
          onCancel={() => setConfirmDelete(false)}
        />
        {isTablet ? (
          <>
            <div className="d-flex gap-3">
              <h6 className="col-md-8">{`${strings.Trigger} : `}</h6>
              <p className="d-flex col-md-8 text-break">{value?.trigger}</p>
            </div>
            <div className="d-flex gap-3 flex-wrap">
              <h6 className="col-md-3 align-self-end">
                {`${strings.Action} : `}
              </h6>
              <div className="col-md-3 mt-5 d-flex gap-2">
                <button
                  onClick={() => {
                    setOpen(!open);
                  }}
                  className={`btn btn-primary d-flex flex-sm-row align-items-center gap-1${
                    open ? " active" : ""
                  }`}
                >
                  <img src="/static/edit.svg" alt="edit" /> {strings.EDIT}
                </button>
                <button
                  disabled={isDeleting === value?.trigger}
                  onClick={() => setConfirmDelete(true)}
                  className="btn btn-danger d-flex flex-sm-row align-items-center gap-1"
                >
                  <i className="fas fa-trash"></i> {strings.delete}
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="d-flex ml-15 mt-15 col-md-9 text-break">
              {value?.trigger}
            </p>
            <div className="col-md-2 mt-5 d-flex gap-2 pa-0">
              <button
                onClick={() => {
                  setOpen(!open);
                }}
                className={`btn btn-primary btn-icon${open ? " active" : ""}`}
              >
                <img src="/static/edit.svg" alt="edit" /> {strings.EDIT}
              </button>
              <button
                disabled={isDeleting === value?.trigger}
                onClick={() => setConfirmDelete(true)}
                className="btn btn-danger btn-icon"
              >
                <i className="fas fa-trash"></i> {strings.delete}
              </button>
            </div>
          </>
        )}
      </div>
      {open && (
        <Response
          type="edit"
          data={data}
          setData={setData}
          save={() => editResponse(data)}
          oldData={value}
          cancel={() => setData(value)}
        />
      )}
    </div>
  );
}

export default function AutoResponder() {
  const { guild, updateGuild, Toast, rtl } = useContext(Context);
  const router = useRouter();

  const [openModal, setOpenModal] = useState(false);
  const [tempNew, setTempNew] = useState({
    response: [""],
    disabledChannels: [],
    disabledRoles: [],
    enabledChannels: [],
    enabledRoles: [],
    trigger: "",
    wildcard: false,
  });
  const [responses, setResponses] = useState([]);
  const [isTablet, changeIsTablet] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    changeIsTablet(Boolean(window.innerWidth <= 768));
    window.addEventListener("resize", () =>
      changeIsTablet(Boolean(window.innerWidth <= 768))
    );
  }, []);

  useEffect(() => {
    setResponses(guild?.responses);
  }, []);

  const deleteResponse = (trigger) => {
    setIsDeleting(trigger);
    axios
      .put("/", {
        access: localStorage.ac,
        method: "DELETE_RESPONSE",
        guild_id: guild.id,
        data: { trigger },
      })
      .then(() => {
        Toast.fire({
          icon: "success",
          title: strings.success,
        });
        setResponses(responses.filter((r) => r.trigger !== trigger));
        guild.responses = responses.filter((r) => r.trigger !== trigger);
        setIsDeleting(false);
      })
      .catch((err) => {
        Toast.fire({
          icon: "error",
          title: getLocaleError(err)
        });
      });
  };
  const editResponse = (data, index) => {
    if (!data.trigger) {
      return Toast.fire({
        icon: "error",
        title: strings.trigger_required,
      });
    }

    axios
      .put("/", {
        method: "EDIT_RESPONSE",
        access: localStorage.ac,
        data,
        guild_id: guild.id,
      })
      .then(() => {
        Toast.fire({
          icon: "success",
          title: strings.success,
        });
        const responsesCopy = [...responses];
        responsesCopy[index] = data;
        setResponses(responsesCopy);
        guild.responses = responsesCopy;
      })
      .catch((err) => {
        Toast.fire({
          icon: "error",
          title: getLocaleError(err)
        });
      });
  };

  const addResponse = () => {
    if (!tempNew.trigger) {
      return Toast.fire({
        icon: "error",
        title: strings.trigger_required,
      });
    }
    if (responses.find((r) => r.trigger === tempNew.trigger)) {
      return Toast.fire({
        icon: "error",
        title: strings.trigger_exists,
      });
    }
    axios
      .put("/", {
        access: localStorage.ac,
        data: tempNew,
        guild_id: guild.id,
        method: "ADD_RESPONSE",
      })
      .then(() => {
        Toast.fire({
          icon: "success",
          title: strings.success,
        });
        setTempNew({ response: [""] });
        setOpenModal(false);
        setResponses([...responses, tempNew]);
        guild.responses = [...responses, tempNew];
      })
      .catch((err) => {
        Toast.fire({
          icon: "error",
          title: getLocaleError(err)
        });
      });
  };
  return (
    <>
      <Modal
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        className={`autoResponderModel smallModal bg-modal${
          rtl ? " rtl" : ""
        }`}
        overlayClassName={
          "ReactModal__Overlay make-scroll-modal overflow-hidden"
        }
        ariaHideApp={false}
        parentSelector={() => document.getElementById("main")}
      >
        <div className="Modalhead" style={{ marginBottom: "1rem" }}>
          <h5>{strings.ADD_RESPONSE}</h5>
          <button onClick={() => setOpenModal(false)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div>
          <Response
            isModal
            data={tempNew}
            setData={setTempNew}
            save={() => addResponse()}
            cancel={() => {
              setTempNew({ response: [""] });
              setOpenModal(false);
            }}
          />
        </div>
      </Modal>
      <PagesTitle
        data={{
          name: "AUTO_RESPONDER",
          description: "auto responder description",
          module: "auto_responder",
        }}
      />

      <div>
        <button
          onClick={() => setOpenModal(true)}
          className="btn btn-primary d-flex flex-sm-row align-items-center gap-1"
        >
          <i className="fas fa-plus"></i>
          {strings.ADD_RESPONSE}
        </button>
        {isTablet || (
          <div className="mt-25 row">
            <h6 className="col-md-9">{strings.Trigger}</h6>
            <h6 className="col-md-2">{strings.Action}</h6>
          </div>
        )}
        {responses?.map((data, index) => (
          <Row
            value={data}
            key={index}
            isDeleting={isDeleting}
            deleteResponse={deleteResponse}
            editResponse={(unsavedData) => editResponse(unsavedData, index)}
          />
        ))}
      </div>
    </>
  );
}
