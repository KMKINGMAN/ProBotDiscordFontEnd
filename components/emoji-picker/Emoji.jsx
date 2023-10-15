import { useMemo } from "react";
import { getEmojiAsset } from "./constants";
import styles from "./style.module.css";
const paths = {
  main: "/static/emojis/main.png",
};
const Emoji = ({ emoji, onClick, onMouseEnter, size, className }) => {
  const asset =
    emoji?.asset ??
    (emoji?.native
      ? useMemo(() => getEmojiAsset(emoji.native), [emoji.native])
      : null);

  if (!emoji) return <></>;
  return (
    <div
      onClick={() => onClick && onClick({ ...emoji, asset: null })}
      onMouseEnter={() =>
        onMouseEnter && onMouseEnter({ ...emoji, asset: null })
      }
      className={`${styles.emojiItem} ${onClick ? styles.emojiClickable : ""} ${className ?? ""}`}
    >
      <img
        src={
          emoji.custom
            ? `https://cdn.discordapp.com/emojis/${emoji.id}.${
                emoji.animated ? "gif" : "png"
              }`
            : `/static/emojis/` + asset
        }
        style={{
          height: size ?? "25px",
          width: size ?? "25px",
        }}
        loading="lazy"
      />
    </div>
  );
};

export default Emoji;
