
/* eslint-disable indent */
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import Head from "next/head";
import { Context } from "@script/_context";
import Select from "react-select";
import strings, { lang } from "@script/locale";
import { FilledSelectInput } from "@component/fields";

import Pt from "@style/PagesTitle.module.css";
import Unsaved from "@component/unsaved";

export default function Settings() {
  const { guild, selectServer, Toast } = useContext(Context);
  const [state, setStates] = useState(guild?.settings || {});
  const [loading, setLoading] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const setState = (object) =>
    setStates((prevState) => ({ ...prevState, ...object }));

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setConfirmName("");
  }, [openModal]);

  function handleReset() {
    setLoading(true);
    axios
      .delete(`/guilds/${guild?.id}`)
      .then(() => {
        setState({ language: "en", prefix: "#" });
        Toast.fire({
          icon: "success",
          title: `${strings.success} ${strings.formatString(
            strings.reset_guild_settings,
            guild?.name
          )}`,
        });
      })
      .catch((err) => {
        console.error(err);
        Toast.fire({
          icon: "error",
          title: "something wrong",
        });
      })
      .finally(() => {
        setOpenModal(false);
        setLoading(false);
      });
  }

  return (
    <>
      <Unsaved
        method="settings"
        default={{
          language: "en",
          prefix: "#",
        }}
        state={state}
        setStates={setStates}
      />
      <Head>
        <title>
          {strings.server_settings} - {guild?.name}
        </title>
      </Head>
      <div className="component-container">
        <div className={Pt["pages-title"]}>
          <div>
            <h3 className="mt-10">{strings.server_settings}</h3>
          </div>
          <div>
            {guild?.owner ? (
              <button
                className={Pt["reset-settings-button"]}
                onClick={() => setOpenModal(true)}
              >
                <i className="fas fa-undo-alt" />
                {strings.reset_settings}
              </button>
            ) : (
              <div className="custom-tooltip">
                <button className={Pt["reset-settings-button"]} disabled>
                  <i className="fas fa-undo-alt" />
                  {strings.reset_settings}
                </button>
                <span className="tooltiptext">
                  {strings.only_owner_reset_settings}
                </span>
              </div>
            )}
          </div>
        </div>
        <form role="form" id="server-settings__form" className="mt-20">
          <FilledSelectInput label={strings.language} className="full-width">
            <Select
              id={strings.language}
              classNamePrefix="formselect"
              onChange={(value) => {
                setState({ language: value.value });
              }}
              value={{
                value:
                  state?.language !== undefined
                    ? state?.language
                    : guild?.language,
                label:
                  lang[state?.language?.replace("_", "-")]?.name ||
                  state?.language,
              }}
              options={Object.keys(lang)
                .sort()
                .map((Languages) => ({
                  value: Languages,
                  label: lang[Languages].name,
                }))}
              noOptionsMessage={() => strings.no_option}
            />
          </FilledSelectInput>
        </form>
      </div>
      <Modal
        isOpen={openModal}
        onRequestClose={() => {
          setOpenModal(false);
        }}
        parentSelector={() => document.getElementById("main")}
        className={`smallModal bg-modal${
          ["ar", "fa"].includes(strings?.getLanguage()) ? " rtl" : ""
        }`}
      >
        <div className="Modalhead">
          <h5>{strings.reset_settings_confirm}</h5>
          <button onClick={() => setOpenModal(false)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="row modalDram">
          <h6 id="server-reset-text">
            <div className="text-danger mt-2">
              - {strings.reset_settings_warn}
            </div>
            <div className="text-warning mt-1">
              - {strings.reset_settings_embed_no_effect}
            </div>
            <div className="mt-3 mb-2 ms-1">
              {strings.servername_to_continue}: <strong>{guild.name}</strong>
            </div>
            <input
              className="form-control"
              placeholder={strings.type_here}
              onChange={(e) => setConfirmName(e.target.value)}
              value={confirmName}
            />
          </h6>
        </div>
        <div className="server-reset">
          <button className="cancel-btn" onClick={() => setOpenModal(false)}>
            {strings.cancel}
          </button>
          <button
            className="reset-settings-btn btn-loading"
            onClick={confirmName === guild?.name ? handleReset : () => {}}
            disabled={confirmName !== guild?.name || loading}
          >
            {loading && (
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            {strings.reset_settings}
          </button>
        </div>
      </Modal>
    </>
  );
}