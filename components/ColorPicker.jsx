import { useState, cloneElement, useEffect } from "react";
import { SketchPicker } from "react-color";
import LogsStyle from "@style/logs.module.css";
import { useContext } from "react";
import { Context } from "@script/_context";

export default function ColorPicker({
  children,
  disabled,
  value,
  onChange,
  fullWidth,
  parentStyles,
  parentClassName,
}) {
  const { isLaptop } = useContext(Context);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show && isLaptop) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [show]);

  return (
    <div
      style={{ ...(fullWidth ? { width: "100%" } : {}), ...parentStyles }}
      className={`${parentClassName ?? ""} ${show ? "active" : ""}`}
    >
      {children ? (
        cloneElement(children, {
          onClick: () => !disabled && setShow(!show),
        })
      ) : (
        <div
          onClick={() => !disabled && setShow(!show)}
          className={LogsStyle.color_picker}
          style={{ backgroundColor: [value] }}
        ></div>
      )}
      {show && (
        <>
          <div
            style={{
              position: "fixed",
              top: "0px",
              right: "0px",
              bottom: "0px",
              left: "0px",
            }}
            onClick={() => setShow(!show)}
          />
          <SketchPicker color={value} onChange={onChange} />
        </>
      )}
    </div>
  );
}
