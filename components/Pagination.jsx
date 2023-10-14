/* eslint-disable indent */
import strings from "@script/locale";
import { Context } from "@script/_context";
import { useState, useContext, useRef } from "react";


const EnterPageNumberInput = ({ switchPage, pages }) => {
  const [specificPage, setSpecificPage] = useState(null);
  const inputRef = useRef(null);

  return (
    <li
      style={
        ["string", "number"].includes(typeof specificPage)
          ? { width: "50px" }
          : {}
      }
      onClick={() => {
        setSpecificPage("");
      }}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          switchPage(specificPage, true);
          setSpecificPage(null);
        }}
        style={{
          display: ["string", "number"].includes(typeof specificPage)
            ? "block"
            : "none",
        }}
      >
        <input
          ref={inputRef}
          style={{
            height: "24px",
            borderRadius: "6px",
            padding: "5px",
          }}
          onBlur={() => setSpecificPage(null)}
          value={specificPage || ""}
          onChange={({ target }) =>
            target.value <= pages && setSpecificPage(target.value)
          }
          className="form-control pagination-input"
          type="number"
          placeholder="Page"
        />
      </form>
      <a
        style={{
          display: ["string", "number"].includes(typeof specificPage)
            ? "none"
            : "flex",
        }}
      >
        ...
      </a>
    </li>
  );
};

const Pagination = (props) => {
  const { rtl } = useContext(Context);

  let currentPage = props.currentPage;

  const switchPage = (page = 1, inputValue) => {
    if (page === "previous" && currentPage > 1) {
      currentPage--;
    } else if (page === "next") {
      currentPage++;
    } else if (typeof page === "number" || inputValue) {
      currentPage = Number(page);
    }
    props.emit(currentPage);
  };

  return (
    <nav
      aria-label="Page navigation"
      className={`pagination-parent ${rtl ? " pagination-parent-rtl" : ""}`}
    >
      <ul className="pagination">
        <li
          className={`previous${
            currentPage === 1 || props.loading ? " disabled" : ""
          }`}
        >
          <a onClick={() => switchPage("previous")}>
            <i className="fas fa-angle-left"></i>
          </a>
        </li>

        <div>
          {props.pages >= 5 &&
            currentPage <= 5 &&
            Array.from(new Array(5).keys()).map((i) => (
              <li
                className={
                  currentPage === i + 1
                    ? "active"
                    : "" || props.loading
                    ? " disabled"
                    : ""
                }
                key={i}
              >
                <a onClick={() => switchPage(i + 1)}>{i + 1}</a>
              </li>
            ))}
          {props.pages < 5 &&
            Array.from(new Array(props.pages).keys()).map((i) => (
              <li
                className={
                  currentPage === i + 1
                    ? "active"
                    : "" || props.loading
                    ? " disabled"
                    : ""
                }
                key={i}
              >
                <a onClick={() => switchPage(i + 1)}>{i + 1}</a>
              </li>
            ))}

          {props.pages > 5 && currentPage > 5 && (
            <>
              <li className={props.loading ? " disabled" : ""}>
                <a onClick={() => switchPage(1)}>1</a>
              </li>
              <EnterPageNumberInput pages={props.pages} switchPage={switchPage} />
              {(currentPage === props.pages ||
                currentPage === props.pages - 1) && (
                <>
                  {currentPage !== props.pages - 1 && (
                    <li className={props.loading ? " disabled" : ""}>
                      <a onClick={() => switchPage(currentPage - 4)}>
                        {currentPage - 4}
                      </a>
                    </li>
                  )}
                  <li className={props.loading ? " disabled" : ""}>
                    <a onClick={() => switchPage(currentPage - 3)}>
                      {currentPage - 3}
                    </a>
                  </li>
                  <li className={props.loading ? " disabled" : ""}>
                    <a onClick={() => switchPage(currentPage - 2)}>
                      {currentPage - 2}
                    </a>
                  </li>
                </>
              )}
              <li className={props.loading ? " disabled" : ""}>
                <a onClick={() => switchPage(currentPage - 1)}>
                  {currentPage - 1}
                </a>
              </li>
              <li className="active">
                <a onClick={() => switchPage(currentPage)}>{currentPage}</a>
              </li>
              {currentPage !== props.pages && (
                <li className={props.loading ? " disabled" : ""}>
                  <a onClick={() => switchPage(currentPage + 1)}>
                    {currentPage + 1}
                  </a>
                </li>
              )}
            </>
          )}
          {props.pages > 5 &&
            currentPage < props.pages &&
            currentPage < props.pages - 1 && (
              <>
                {props.pages > 6 && <EnterPageNumberInput pages={props.pages} switchPage={switchPage} />}
                <li
                  className={props.loading ? " disabled" : ""}
                  onClick={() => switchPage(props.pages)}
                >
                  <a>{props.pages}</a>
                </li>
              </>
            )}
        </div>

        <li
          className={`next${
            currentPage === props.pages || props.loading ? " disabled" : ""
          }`}
        >
          <a onClick={() => switchPage("next")}>
            <i className="fas fa-angle-right"></i>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
