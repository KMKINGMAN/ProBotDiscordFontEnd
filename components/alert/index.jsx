import alert from "./style.module.css";

const icons = {
  success: "fa-check-circle",
  warning: "fa-exclamation-triangle",
  info: "fa-info-circle",
  error: "fa-circle-exclamation",
};

// type: "success", "info", "warning", "error"
export default function Alert(props) {
  const {
    startIcon,
    centerdText,
    children,
    type,
    handelClose,
    open,
    className,
  } = props;
  const STYLES = {
    text: centerdText && {
      textAlign: "center",
      justifyContent: "center",
      width: "100%",
    },
  };

  if (!open) return <></>;
  return (
    <div
      className={`${alert["container"]} ${alert[type]}${
        className ? ` ${className}` : ""
      }`}
    >
      <span style={STYLES.text}>
        {startIcon ? (
          startIcon
        ) : (
          <i
            className={`iconify ${alert.icon} ${alert[`icon-${type}`]} fas ${
              icons[type]
            }`}
          />
        )}
        {children}
      </span>
      {handelClose && (
        <div onClick={handelClose} className={alert.close}>
          <i className="fas fa-times"></i>
        </div>
      )}
    </div>
  );
}
