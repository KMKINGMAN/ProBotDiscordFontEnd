/* eslint-disable indent */
import { useState, useContext, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import debounce from "lodash/debounce";
import strings from "@script/locale";
import Loading from "./loader";
import { Context } from "@script/_context";

function BgItem({ owned, store, data, current }) {
  const { user, updateUser, Toast, rtl } = useContext(Context);

  const [state, setStates] = useState({
    open: false,
    confirm: false,
    loaded: false,
    buying: false,
    colors: false,
    background: null,
  });
  const setState = (object) =>
    setStates((prevState) => ({ ...prevState, ...object }));
  const onCloseModal = () => setState({ open: false, buying: false });
  const onOpenModal = () => {
    if (store === "id") {
      setState({
        background: `${process.env.NEXT_PUBLIC_API_URL}/rank/224308865427046402/${user.id}?background=${data.filename}&name=${user.name}`,
      });
    } else {
      setState({
        background: `${process.env.NEXT_PUBLIC_API_URL}/profile/${user.id}?background=${data.filename}&name=${user.name}`,
      });
    }
    setState({ open: true });
  };
  const buy = debounce(() => {
    if (state.buying) return;
    setState({ buying: true });
    axios
      .post("/buyanduse", {
        Number: data.id,
        type: "profile",
        nocolor: !state.colors,
        store: store,
      })
      .then((response) => {
        if (response.data.status === "use") {
          Toast.fire({
            icon: "success",
            title: strings.store_background_changed,
          });
        }
        if (response.data.status === "credits") {
          Toast.fire({
            icon: "error",
            title: strings.store_credits_too_low,
          });
        }
        updateUser();
      })
      .catch(() => {
        Toast.fire({
          icon: "error",
          title: strings.store_error_contact_support,
        });
      })
      .finally(onCloseModal);
  }, 300);
  useEffect(() => {
    setState({ colors: !user[`${store}_noColor`] });
  }, []);
  return (
    <div className={`${owned ? "bg-item-active " : ""}bg-item`}>
      <div id="p_143" className="bg-price" dir="ltr">
        <i className="fa-solid fa-cedi-sign me-1"></i>
        {data.price}
      </div>
      {owned && (
        <div id="p_143" className={rtl ? "bg-owned-rtl" : "bg-owned"}>
          {current ? strings.store_bg_current : strings.store_owned}
        </div>
      )}
      <a onClick={onOpenModal} className="full-width">
        <img
          className={`bg-img${store === "id" ? " bg-img-id" : ""}`}
          src={`https://probot.media/store/${data.filename}`}
          loading="lazy"
        />
      </a>
      {state.open && (
        <Modal
          isOpen={state.open}
          ariaHideApp={false}
          onRequestClose={onCloseModal}
          className="smallModal bg-modal store-modal"
          parentSelector={() => document.getElementById("main")}
        >
          <div className="Modalhead">
            <h5>{data.name}</h5>
            <button onClick={() => setState({ open: false, buying: false })}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="row modalDram">
            <center className={current && "mb-20"}>
              {!state.loaded && <Loading />}
              <div>
                <img
                  className={state.colors ? "" : "hidden"}
                  src={`${state.background}&nocolor=0`}
                  onLoad={() => setState({ loaded: true })}
                />
                <img
                  className={state.colors ? "hidden" : ""}
                  src={`${state.background}&nocolor=1`}
                  onLoad={() => setState({ loaded: true })}
                />
              </div>
            </center>
            <div className="form-check d-flex justify-content-center align-items-center mt-2 mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="with-color-checkbox"
                checked={state.colors}
                onChange={(event) => setState({ colors: event.target.checked })}
              />
              <label className="form-check-label ps-2" htmlFor="with-color-checkbox">
                {strings.store_with_colors}
              </label>
            </div>
          </div>
          <div className="bg-price-modal-footer">
            <h5 className="mt-20">
              
              {strings.formatString(strings.store_price, <div dir="ltr" className="d-inline">
                <i className="fa-solid fa-cedi-sign me-1"></i>
                {data.price}
              </div>)}
            </h5>
            <div
              className={`mt-20 btn btn-success btn-rounded ld-over-inverse${
                state.buying ? " running disabled" : ""
              }`}
              onClick={buy}
            >
              {!owned ? strings.store_buy_use : strings.store_use}{" "}
              {state.buying && (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
export default BgItem;
