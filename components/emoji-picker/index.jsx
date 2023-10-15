import { useState, useContext, useRef, useEffect, useCallback } from "react";
import { Context } from "@script/_context";
import styles from "./style.module.css";
import EmojisList from "./EmojisList";
import { CATEGORY_LIST } from "./constants";
import ColorsTheme from "./ColorsTheme";
import { useInView } from "react-intersection-observer";

export default function EmojiPicker({
  childrenClassName,
  emojiPickerContainerClassName,
  customEmojiPickerContainerClassName,
  onClick,
  children,
}) {
  const { rtl, guild } = useContext(Context);
  const views = Array.from({ length: CATEGORY_LIST.length }, () =>
    useInView({
      threshold: 0.1,
    })
  );
  const refs = Array.from({ length: CATEGORY_LIST.length }, () => useRef());

  const setRefs = useCallback(
    (node, index) => {
      refs[index].current = node;
      views[index].ref(node);
    },
    [views]
  );

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [themeColor, setThemeColor] = useState(0);

  const ref = useRef(false);

  const handleSearchChange = (event) => setSearch(event.target.value);

  function handleClickOutside(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      setOpen(false);
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  useEffect(() => {
    if (open) {
      document.body.classList.add("emoji-picker-open");

      return;
    }

    document.body.classList.remove("emoji-picker-open");
  }, [open]);

  return (
    <>
      <div
        style={{ height: "max-content", width: "max-content" }}
        onClick={() => setOpen(!open)}
        className={childrenClassName ?? ""}
      >
        {children}
      </div>
      {open ? (
        <div
          ref={ref}
          className={`${styles.EmojiPicker__container} ${
            open ? styles.active : ""
          } ${customEmojiPickerContainerClassName ?? ""}`}
        >
          <div
            className={`${styles.container} ${
              emojiPickerContainerClassName ?? ""
            }`}
          >
            <div className={styles["category__list-emoji"]}>
              <div className={styles["list-emoji"]}>
                {CATEGORY_LIST.filter((c) =>
                  c.id === 0 ? guild?.emojis?.length : true
                ).map((category, index) => {
                  const { name, icon } = category;
                  const customClassName = `${
                    styles["category__list-emoji__item"]
                  } ${views[index].inView ? styles.active : ""}`;

                  return (
                    <button
                      type='button'
                      key={index}
                      title={name}
                      className={customClassName}
                      onClick={() => {
                        refs[index].current?.scrollIntoView({
                          behavior: "smooth",
                          block: "nearest",
                          inline: "start",
                        });
                      }}
                    >
                      {icon}
                    </button>
                  );
                })}
              </div>

              <div className={styles["list-emoji__search"]}>
                <div className={styles["list-emoji__search-input"]}>
                  <i
                    className="fa-solid fa-magnifying-glass"
                    style={rtl ? { right: "10px" } : { left: "10px" }}
                  ></i>
                  <input
                    type="search"
                    placeholder="Search"
                    onChange={handleSearchChange}
                    value={search}
                  />
                </div>
                <ColorsTheme
                  themeColor={themeColor}
                  setThemeColor={setThemeColor}
                />
              </div>

              <EmojisList
                search={search}
                onSelect={(e) => {
                  setOpen(false);
                  if (onClick) return onClick(e);
                }}
                themeColor={themeColor}
                setRefs={setRefs}
              />
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
