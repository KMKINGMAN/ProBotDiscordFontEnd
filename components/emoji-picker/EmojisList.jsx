import { Context } from "@script/_context";
import { useState, useRef, useEffect, useContext } from "react";
import { CATEGORY_LIST, EMOJIS } from "./constants";
import Emoji from "./Emoji";
import EmojiDescription from "./EmojiDescription";
import styles from "./style.module.css";
const EmojisList = ({ setRefs, search, onSelect, themeColor }) => {
  const [hoveredEmoji, setHoveredEmoji] = useState(null);
  const { guild } = useContext(Context);

  useEffect(() => {
    return () => {
      setHoveredEmoji(null);
    };
  }, []);

  return (
    <div className={styles.emojisListContainer}>
      <div
        className={styles.emojisList}
        onScroll={!search ? () => {} : () => {}}
      >
        {search
          ? [
              ...(guild
                ? guild.emojis.map((emoji) => ({
                    id: emoji.id,
                    name: emoji.name,
                    short_names: [emoji.name],
                    custom: true,
                    category: "custom",
                  }))
                : []),
              ...EMOJIS,
            ]
              .filter((emoji) =>
                emoji.name.toLowerCase().includes(search.toLowerCase())
              )
              .filter((e) => {
                if (e.name.includes(`tone${themeColor}`)) return true;
                return !e.name.includes("tone");
              })
              .map((emoji, index) => (
                <Emoji
                  key={index}
                  onClick={onSelect}
                  onMouseEnter={setHoveredEmoji}
                  emoji={emoji}
                />
              ))
          : CATEGORY_LIST.filter((c) =>
              c.id === 0 ? guild?.emojis?.length : true
            ).map((category, index) => (
              <div
                key={index}
                className={styles.emoji}
                ref={(node) => setRefs(node, index)}
              >
                <div className={styles["category-title"]}>
                  {category.id === 0 ? guild.name : category.name}
                </div>
                {[
                  ...(guild
                    ? guild.emojis.map((emoji) => ({
                        id: emoji.id,
                        name: emoji.name,
                        short_names: [emoji.name],
                        custom: true,
                        category: "custom",
                        animated: emoji.animated,
                      }))
                    : []),
                  ...EMOJIS,
                ]
                  .filter((e) => e.category === category.name.toLowerCase())
                  .filter((e) => {
                    if (e.name.includes(`tone${themeColor}`)) return true;
                    return !e.name.includes("tone");
                  })
                  .map((emojiItem, emojiIndex) => (
                    <Emoji
                      key={emojiIndex}
                      onClick={onSelect}
                      onMouseEnter={setHoveredEmoji}
                      emoji={emojiItem}
                    />
                  ))}
              </div>
            ))}
      </div>
      <div>
        <EmojiDescription hoveredEmoji={hoveredEmoji} />
      </div>
    </div>
  );
};

export default EmojisList;
