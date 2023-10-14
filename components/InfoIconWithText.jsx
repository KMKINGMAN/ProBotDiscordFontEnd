import Tooltip from "rc-tooltip";

export default function InfoIconWithText({ ms = 2, text, ...props }) {
  return (
    <>
      <Tooltip
        placement="top"
        overlay={text}
        overlayClassName="pb-tooltip"
        trigger={["hover", "focus"]}
      >
        <i
          className={`fas fa-exclamation-circle pointer text-muted ms-${ms}`}
          onClick={(e) => e.preventDefault()}
          {...props}
        ></i>
      </Tooltip>
    </>
  );
}
