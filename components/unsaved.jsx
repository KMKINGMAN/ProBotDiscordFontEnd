import isEqual from "lodash/isEqual";
import debounce from "lodash/debounce";
import merge from "lodash/merge";
import axios from "axios";
import strings from "@script/locale";
import { useContext, useState, useEffect } from "react";
import { Context } from "@script/_context";

export default function Unsaved({
  method,
  type,
  default: defaultState,
  state,
  setStates,
  validate,
  formId,
}) {
  const [loading, loadPage] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [cancel, setCancel] = useState(false);

  const { guild, setGuild, unsaved, setUnsaved, Toast } = useContext(Context);

  useEffect(() => {
    if (unsaved) setHidden(false);
  }, [unsaved]);
  useEffect(() => {
    setHidden(true);
  }, [method]);
  const saveSettings = debounce((save) => {
    if (save) {
      if (validate && validate() !== true) {
        return Toast.fire({
          icon: "error",
          title: validate(),
        });
      }
      loadPage(true);

      axios
        .put(`/guilds/${guild.id}/${method}`, state)
        .then(() => {
          // save guild
          setGuild({ ...guild, [method]: state });
          // end save
          setUnsaved(false);
        })
        .catch((err) => {
          if (err.response?.data) {
            return Toast.fire({
              icon: "error",
              title: err.response.data.strings
                ? strings[err.response.data.strings[0]]
                : err.response.data.error,
            });
          }
          return Toast.fire({
            icon: "error",
            title: "Error while sending request",
          });
        })
        .finally(() => {
          loadPage(false);
        });

      return;
    }

    setCancel(true);
  }, 300);

  useEffect(() => {
    console.log(
      "[debug] [unsaved]",
      "new",
      state,
      "guild",
      guild[method],
      "default",
      defaultState
    );
    if (!state) return setUnsaved(false);
    if (
      defaultState &&
      type === "array" &&
      isEqual(state, merge({}, defaultState, guild[method]))
    )
      return setUnsaved(false);
    if (
      defaultState &&
      type !== "array" &&
      isEqual(state, merge({}, defaultState, guild[method]))
    )
      return setUnsaved(false);
    if (isEqual(state, guild[method])) return setUnsaved(false);
    if (
      defaultState &&
      (!guild[method] ||
        (type === "array"
          ? !guild[method].length
          : !Object.keys(guild[method]).length)) &&
      isEqual(state, defaultState)
    )
      return setUnsaved(false);

    if (!unsaved) setUnsaved(true);
  }, [state]);

  useEffect(() => {
    if (!unsaved || cancel) {
      let defaultData = defaultState
        ? JSON.parse(JSON.stringify(defaultState))
        : type === "array"
        ? []
        : {};
      setStates(
        type === "array"
          ? [...(defaultData || []), ...(guild[method] || [])]
          : { ...(defaultData || {}), ...(guild[method] || {}) }
      );
      setCancel(false);
    }
  }, [method, cancel, guild]);

  // if (!unsaved) return <></>;
  return (
    <div
      className={`confo row animate__animated ${
        hidden
          ? "hidden"
          : unsaved
          ? "animate__fadeInUp"
          : "animate__fadeOutDown"
      }`}
    >
      <div className="col-md-6 col-sm-6 confoText">
        {strings.UNSAVED_CONFIRM}
      </div>
      <div className="col-md-6 col-sm-6 confoButtons">
        <button
          type="button"
          className="unsaved__close-btn"
          onClick={() => {
            saveSettings(false);
          }}
        >
          {strings.cancel}
        </button>
        {formId ? (
          <button type="submit" form={formId} className="unsaved__save-btn">
            {strings.SAVE_CHANGES}
          </button>
        ) : (
          <div
            style={
              loading
                ? { pointerEvents: "none", position: "relative" }
                : { position: "relative" }
            }
            onClick={() => {
              !loading && saveSettings(true);
            }}
            className={`unsaved__save-btn${
              loading ? " running disabled" : ""
            } gap-2`}
          >
            {strings.SAVE_CHANGES}
            {loading && (
              <div className="spin-saving-icon">
                <i className="fas fa-circle-notch fa-spin"></i>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
