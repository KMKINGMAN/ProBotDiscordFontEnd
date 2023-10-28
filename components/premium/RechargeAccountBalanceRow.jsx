import { useState, useContext, useEffect } from "react";
import { Context } from "../../scripts/_context";
import Checkout from "./checkout";
import strings from "@script/locale";

export default function RechargeAccountBalanceRow() {
  const { user } = useContext(Context);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(5);
  const [openModal, setOpenModal] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (amount >= 5) {
      setOpenModal({
        item: 5,
        type: "recharge",
        name: strings.transactions_amount,
        price: amount,
      });
    }
  };



  return (
    <>
      <div className="black-container pa-15">
        <div className="d-flex align-items-center justify-content-between">
          <p className="text-break mb-0">
            {strings.formatString(
              strings.billing_account_balance,
              user.balance
            )}
          </p>
          <button
            className={`btn ${open ? "btn-secondary" : "btn-primary"} btn-icon`}
            onClick={() => setOpen(!open)}
          >
            <i className="fas fa-plus"></i>
            {strings.add_funds}
          </button>
        </div>
        {open && (
          <div className="row row-cols-1 row-cols-sm-2">
            <div className="col">
              <form className="col" onSubmit={handleSubmit}>
                <label className="control-label" htmlFor="amount">
                  {strings.transactions_amount}
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder={strings.transactions_amount}
                  value={amount}
                  onChange={(event) => setAmount(Number(event.target.value))}
                  id="amount"
                  required
                  min={5}
                  max={500}
                />
                <button
                  className="btn btn-secondary mt-3 full-width"
                  type="submit"
                >
                  {strings.add_funds}
                </button>
              </form>
            </div>
            <div className="col">
              <div className="col mt-25 d-flex justify-content-center align-items-center flex-column available-credit">
                <label className="d-block cursor-default">
                  $ {strings.billing_available_credit}
                </label>
                <span>${user.balance} USD</span>
              </div>
            </div>
          </div>
        )}
      </div>
      {openModal && <Checkout open={openModal} setOpen={setOpenModal} />}
    </>
  );
}
