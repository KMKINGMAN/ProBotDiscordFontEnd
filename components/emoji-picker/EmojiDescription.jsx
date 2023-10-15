import Emoji from "./Emoji";
import styles from "./style.module.css";

export default function EmojiDescription({ hoveredEmoji }) {
  return (
    <div className={styles.emoji__hover}>
      <div className={styles.emoji__hover__icon}>
        {hoveredEmoji ? <Emoji emoji={hoveredEmoji} /> : "☝"}
      </div>
      <div>
        <h3
          className={styles.emoji__hover__name}
        >
          {hoveredEmoji ? `:${hoveredEmoji.id}:` : "Pick an emoji.."}
        </h3>
      </div>
    </div>
  );
}
