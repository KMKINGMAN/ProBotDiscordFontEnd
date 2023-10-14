/* eslint-disable indent */
import { useState, useContext } from "react";
import Modal from "react-modal";
import axios from "axios";
import debounce from "lodash/debounce";
import strings from "@script/locale";
import Loading from "./loader";
import { Context } from "@script/_context";

export default function BadgeItem({ owned, selected, data, current }) {
  const { updateUser, user, Toast, rtl } = useContext(Context);

  const [state, setStates] = useState({
    open: false,
    confirm: false,
    loaded: false,
    buying: false,
  });

  const setState = (object) =>
    setStates((prevState) => ({ ...prevState, ...object }));
  const onCloseModal = () => setState({ open: false, buying: false });

  const buy = debounce(() => {
    if (state.buying) return;
    setState({ buying: true });
    axios
      .post("buyanduse", {
        Number: data.n,
        type: "badges",
        Selected: selected + 1,
      })
      .then((response) => {
        if (response.data.status === "credits") {
          return Toast.fire({
            icon: "error",
            title: strings.store_credits_too_low,
          });
        }
        Toast.fire({
          icon: "success",
          title: strings.store_badge_changed,
        });
        updateUser();
      })
      .catch((err) => {
        console.error(err);
        Toast.fire({
          icon: "error",
          title: strings.store_error_contact_support,
        });
      })
      .then(onCloseModal);
  }, 300);
  return (
    <div className={`${owned ? "bg-item-active " : ""}badges-item`}>
      <div id="p_143" className="bg-price">
        <i className="fa-solid fa-cedi-sign"></i>
        {data.price}
      </div>
      {owned && (
        <div id="p_143" className={rtl ? "bg-owned-rtl" : "bg-owned"}>
          {strings.store_owned}
        </div>
      )}
      <a onClick={() => setState({ open: true })} className="full-width">
        <img
          className="badges-img"
          src={`https://probot.media/badges/${data.filename}`}
        />
      </a>
      {state.open && (
        <Modal
          isOpen={state.open}
          onRequestClose={onCloseModal}
          className="smallModal bg-modal store-modal"
          parentSelector={() => document.getElementById("main")}
        >
          <div className="Modalhead">
            <h5>{data.name}</h5>
            <button onClick={() => setState({ open: false })}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="modalDram" style={{ textAlign: "center" }}>
            {!state.loaded && <Loading />}
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/profile/${user.id}?badge${selected}=${data.filename}&name=${user.name}`}
              onLoad={() => setState({ loaded: true })}
            />
          </div>
          <div className="bg-price-modal-footer">
            <h5 className="mt-20">
              {strings.store_price?.replace("{0}", data.price)}
            </h5>
            {!current && (
              <div
                className={`mt-20 btn btn-success btn-rounded ld-over-inverse ${
                  state.buying ? "running disabled" : ""
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
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
