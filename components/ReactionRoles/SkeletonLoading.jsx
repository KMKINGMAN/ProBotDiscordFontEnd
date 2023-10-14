import { Context } from "@script/_context";
import { useContext } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export default function SkeletonLoading() {
  const { rtl } = useContext(Context);

  return (
    <>
      <SkeletonTheme color="#1f1f25" highlightColor="#393943">
        <div style={{ textAlign: rtl ? "right" : "left" }}>
          <Skeleton count={1} width={140} height={40} />
        </div>
      </SkeletonTheme>
      <SkeletonTheme color="#393943" highlightColor="#1f1f25">
        <div
          className="pa-25 mt-50 file-directory borderRadiusBg rr-all-card"
          style={{ backgroundColor: "#1f1f25" }}
        >
          <div
            className="close-button pt-20"
            style={{
              left: rtl ? "30px" : "",
              right: rtl ? "" : "30px",
            }}
          >
            <Skeleton count={1} width={15} height={15} />
          </div>
          <div style={{ textAlign: rtl ? "right" : "left" }}>
            <Skeleton count={1} width={100} height={15} />
          </div>
          <div
            className="file-directory mt-20 borderRadiusBg reaction-role-form"
            style={{ backgroundColor: "#1f1f25" }}
          >
            <div className={`form-group mt-15${rtl ? " mr-5" : " ml-15"}`}>
              <div>
                <Skeleton
                  count={1}
                  width="100%"
                  height="2em"
                  style={{ backgroundColor: "#2f3136d9" }}
                />
              </div>
            </div>
            <div className={`form-group mt-15${rtl ? " mr-5" : " ml-15"}`}>
              <div>
                <Skeleton
                  count={1}
                  width="100%"
                  height="2em"
                  style={{ backgroundColor: "#2f3136d9" }}
                />
              </div>
            </div>
            <div className="form-group ml-15 mt-15 rr-type-radios-parent">
              <div className="rr-type-radios">
                <label className="container">
                  <Skeleton count={1} width={100} height={15} />
                  <input type="radio" name="type2" value="Toggle" />
                  <p>
                    <Skeleton count={1} width="100%" height={15} />
                  </p>
                  <span className="checkmark"></span>
                </label>
              </div>
              <div className="rr-type-radios">
                <label className="container">
                  <Skeleton count={1} width={100} height={15} />
                  <input type="radio" name="type2" value="Toggle" />
                  <p>
                    <Skeleton count={1} width="100%" height={15} />
                  </p>
                  <span className="checkmark"></span>
                </label>
              </div>
              <div className="rr-type-radios">
                <label className="container">
                  <Skeleton count={1} width={100} height={15} />
                  <input type="radio" name="type2" value="Toggle" />
                  <p>
                    <Skeleton count={1} width="100%" height={15} />
                  </p>
                  <span className="checkmark"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </SkeletonTheme>
    </>
  );
}
