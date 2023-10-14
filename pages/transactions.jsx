import { useState, useEffect, useContext, Fragment } from "react";
import { Context } from "@script/_context";
import axios from "axios";
import Pagination from "@component/Pagination";
import Head from "next/head";
import moment from "moment";
import strings from "@script/locale";
import Modal from "react-modal";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import Tooltip from "rc-tooltip";
import transactions from "@style/transactions.module.css";

export default function Transactions() {
  const { user } = useContext(Context);

  const [state, setStates] = useState({
    transactions: [],
    loading: false,
    modal: false,
    currentPage: 1,
    pages: 1,
  });
  const setState = (object) =>
    setStates((prevState) => ({ ...prevState, ...object }));

  useEffect(() => {
    if (!user) return;
    const cancelTokenSource = axios.CancelToken.source();
    setState({ loading: true });
    axios
      .get("/user/transactions", {
        params: { page: state.currentPage },
        cancelToken: cancelTokenSource.token,
      })
      .then((response) => {
        setState({
          pages: response.data.pages,
          transactions: response.data.transactions.map((transaction) => {
            if (transaction.from === user?.id) {
              transaction.isMe = true;
              transaction.user = response.data.users.find(
                (user) => user?.id === transaction.to
              ) ?? { avatar: "https://cdn.discordapp.com/embed/avatars/0.png", name: "unknown", discriminator: "0000", _id: transaction.to };
            } else {
              transaction.isMe = false;
              //transaction.credits = ~~(transaction.credits - (transaction.credits * 0.05) || 1);
              transaction.user = response.data.users.find(
                (user) => user?.id === transaction.from
              ) ?? { avatar: "https://cdn.discordapp.com/embed/avatars/0.png", name: "unknown", discriminator: "0000", _id: transaction.from }
            }
            return transaction;
          }),
          loading: false,
        });
      });

    return () => {
      cancelTokenSource.cancel();
    };
  }, [state.currentPage, user]);

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>{strings.credit_transactions} - {strings.probot}</title>
      </Head>
      {state.loading ? (
        <SkeletonTheme color="#36393F" highlightColor="#2F3136">
          {Array.from(Array(10).keys()).map((index) => (
            <div
              key={index}
              className="transactions-row transactions-skeleton-row"
              style={{
                borderBottom: "1px solid #434242",
                padding: "20px 0",
                width: "max-content",
              }}
            >
              <Skeleton
                style={{ margin: "0 10px", padding: "18px" }}
                circle
                height={50}
                width={50}
              />
              <Skeleton style={{ margin: "0 10px" }} width="10em" />
              <Skeleton style={{ margin: "0 10px" }} width="10em" />
              <Skeleton style={{ margin: "0 10px" }} width="10em" />
              <Skeleton style={{ margin: "0 10px" }} width="10em" />
            </div>
          ))}
        </SkeletonTheme>
      ) : (
        <div
          id={transactions.container}
          className={strings.getLanguage() === "ar" ? transactions.rtl : ""}
        >
          <table className={transactions.table}>
            <thead>
              <tr className={transactions.head}>
                {[
                  "transactions_user",
                  "transactions_date",
                  "transactions_amount",
                  "transactions_balance",
                ].map((headText, index) => (
                  <th key={index}>{strings[headText]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {state.transactions.map((transaction, index) => (
                <Fragment key={index}>
                  <tr
                    onClick={() => setState({ modal: transaction.id })}
                    className={`${transactions.user} pointer ${
                      index + 1 !== state.transactions.length &&
                      transactions["border-bottom"]
                    }`}
                  >
                    <td>
                      <div className={transactions["user-info"]}>
                        <img
                          src={transaction.user?.avatar}
                          alt={transaction.user?.name}
                          className={transactions["user-avatar"]}
                          onError={(event) =>
                            (event.target.src =
                              "https://cdn.discordapp.com/embed/avatars/0.png")
                          }
                        />
                        <p className="ms-2">
                          {transaction.user?.name}{" "}
                          {transaction.user?.id === "282859044593598464" || (
                            <span className="text-muted">
                              <span>#</span>
                              <span>{transaction.user?.discriminator}</span>
                            </span>
                          )}
                        </p>
                      </div>
                    </td>
                    <td>
                      <div className={transactions["user-date"]}>
                        {moment(transaction.time).format(
                          "DD/MM/YYYY h:mm:ss a"
                        )}
                      </div>
                    </td>
                    <td>
                      <div className={`${transactions["user-credits"]} d-flex align-items-center`}>
                        {transaction.isMe ? (
                          <p dir="ltr" className="negative align-items-center">
                            <i className="fa-solid fa-cedi-sign me-1"></i>-
                            {transaction.credits}
                          </p>
                        ) : (
                          <p dir="ltr" className="plus align-items-center">
                            <i className="fa-solid fa-cedi-sign me-1"></i>+
                            {transaction.credits}
                          </p>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className={transactions["user-balance"]}>
                        {transaction.isMe
                          ? transaction.balance
                          : transaction.to_balance}
                        {transaction.isMe ? (
                          <i className="fa-solid fa-angle-down"></i>
                        ) : (
                          <i className="fa-solid fa-angle-up"></i>
                        )}
                      </div>
                    </td>
                  </tr>
                  {state.modal === transaction.id && (
                    <Modal
                      isOpen={state.modal === transaction.id}
                      onRequestClose={() => setState({ modal: false })}
                      contentLabel="more information"
                      className="smallModal bg-modal"
                      ariaHideApp={false}
                      parentSelector={() => document.getElementById("main")}
                    >
                      <div
                        id="transactions-model-parent"
                        className={
                          strings.getLanguage() === "ar" ? "rtl" : "ltr"
                        }
                      >
                        <div className="Modalhead">
                          <img
                            src={transaction.user?.avatar}
                            className="trans-avatar"
                            onError={(e) =>
                              (e.target.src =
                                "https://cdn.discordapp.com/embed/avatars/0.png")
                            }
                          />
                          <div className="transactions-model-user" dir="ltr">
                            <h5>
                              {transaction.user?.name}
                              {transaction.user?.id ===
                                "282859044593598464" || (
                                <div>
                                  <span>#</span>
                                  <span>
                                    {transaction.user?.discriminator}{" "}
                                  </span>
                                </div>
                              )}
                            </h5>
                            {transaction.user?.id === "282859044593598464" && (
                              <Tooltip placement="top" overlay={"Verified Bot"}>
                                <span id="verified-bot-tag-modal">
                                  <i className="fas fa-check" />
                                  BOT
                                </span>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                        <div className="row modalDram">
                          <div className="transactions-modal-reason">
                            <h5>{strings.reason}</h5>
                            <p>
                              {transaction.reason ||
                                strings.transactions_no_reason}
                            </p>
                          </div>
                          <div className="transactions-modal-reason">
                            <h5>{strings.user_id}</h5>
                            <p>{transaction.user?.id}</p>
                          </div>

                          <div className="transactions-modal-reason">
                            <h5>{strings.transactions_amount}</h5>
                            <p>
                              {transaction.isMe ? (
                                <p
                                  dir="ltr"
                                  className="negative d-flex align-items-center"
                                >
                                  <i className="fa-solid fa-cedi-sign me-1"></i>
                                  -{transaction.credits}
                                </p>
                              ) : (
                                <p
                                  dir="ltr"
                                  className="plus d-flex align-items-center"
                                >
                                  <i className="fa-solid fa-cedi-sign me-1"></i>
                                  {transaction.credits}
                                </p>
                              )}
                            </p>
                          </div>
                          <div className="transactions-modal-reason">
                            <h5>{strings.transactions_balance}</h5>
                            <p className="d-flex gap-2 align-items-center">
                              {transaction.isMe
                                ? transaction.balance
                                : transaction.to_balance}
                              {transaction.isMe ? (
                                <i className="fa-solid fa-angle-down"></i>
                              ) : (
                                <i className="fa-solid fa-angle-up"></i>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="transactions-modal-footer">
                          <p>
                            {moment(transaction.time).format(
                              "DD/MM/YYYY h:mm:ss a"
                            )}
                          </p>
                          <button
                            className="btn btn-green"
                            onClick={() => setState({ modal: false })}
                          >
                            {strings.done}
                          </button>
                        </div>
                      </div>
                    </Modal>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination
        pages={state.pages}
        currentPage={state.currentPage}
        loading={state.loading}
        emit={(currentPage) => setState({ currentPage })}
      />
    </>
  );
}
