import RolesList from "@component/roles_list";
import styles from "./styles.module.css";
import strings from "@script/locale";
import EmojiPicker from "@component/emoji-picker";
import { DragHandle } from "../Row";
import Emoji from "@component/emoji-picker/Emoji";
import { DISCORD_BUTTONS_COLORS } from '@script/constants'

export default function RowElement(props) {
  const { reaction, index, reactionIndex, handleChange, open, toggle } = props;

  return (
    <div className={styles.singleRow_container}>
      <DragHandle dots />
      <div>
        <div className={styles.header}>
          <div>
            <div className={styles.review}>
              <div
                className={`btn btn-icon ${styles.button_review}`}
                style={{
                  backgroundColor: DISCORD_BUTTONS_COLORS.find(
                    (colorButton) => colorButton.value === reaction.style
                  ).color,
                }}
                onClick={toggle}
              >
                {reaction.emoji && (
                  <Emoji
                    emoji={reaction.emoji}
                    size={"1rem"}
                    className="flex"
                  />
                )}
                {reaction.label && <p>{reaction.label}</p>}
              </div>
              <div className={styles.mobile__actions}>
                <button
                  onClick={toggle}
                  className={`btn btn-primary btn-icon${
                    open ? " activeBtn" : ""
                  }`}
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() =>
                    handleChange("REMOVE_BUTTON", index, reactionIndex)
                  }
                  className="btn btn-danger btn-icon"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <RolesList
              className={styles.rolesList}
              value={reaction.roles}
              onChange={(data) =>
                handleChange("CHANGE_BUTTON_ROLES", index, {
                  i: reactionIndex,
                  data,
                })
              }
            />
          </div>
          <div className={styles.actions}>
            <button
              onClick={toggle}
              className={`btn btn-primary btn-icon${open ? " activeBtn" : ""}`}
            >
              <i className="fas fa-edit"></i>
            </button>
            <button
              onClick={() =>
                handleChange("REMOVE_BUTTON", index, reactionIndex)
              }
              className="btn btn-danger btn-icon"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>

        {open && (
          <>
            <hr className={`${styles.hr} settings`} />
            <div className={styles.edit_container}>

              <div className={styles.edit_body}>
                <div style={{ flex: "1 1 200px" }}>
                  <label
                    className="control-label"
                    htmlFor="button-emoji-and-text"
                  >
                    {strings.rr_button_description}
                  </label>
                  <div className="d-flex gap-2 align-items-center">
                    <div className={styles["emoji-picker"]}>
                      {reaction.emoji && (
                        <button
                          className={styles.remove_emoji}
                          onClick={() =>
                            handleChange("CHANGE_BUTTON_EMOJI", index, {
                              i: reactionIndex,
                              emoji: null,
                            })
                          }
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                      <EmojiPicker
                        onClick={(emoji) => {
                          handleChange("CHANGE_BUTTON_EMOJI", index, {
                            emoji,
                            i: reactionIndex,
                          });
                        }}
                        childrenClassName={styles["emoji-picker-children"]}
                        emojiPickerContainerClassName={
                          styles["emoji-picker-container"]
                        }
                      >
                        {reaction.emoji ? (
                          <div className={styles.selected_emoji}>
                            <Emoji
                              emoji={reaction.emoji}
                              size={"1.4rem"}
                              className="flex"
                            />
                          </div>
                        ) : (
                          <button className={styles.add_emoji_button}>
                            <i class="fas fa-plus"></i>
                          </button>
                        )}
                      </EmojiPicker>
                    </div>
                    <input
                      className="form-control"
                      type="text"
                      id="button-emoji-and-text"
                      placeholder={strings.Text}
                      value={reaction.label}
                      maxLength={80}
                      onChange={(value) =>
                        handleChange("CHANGE_BUTTON_LABEL", index, {
                          text: value.target.value,
                          i: reactionIndex,
                        })
                      }
                    />
                  </div>
                </div>
                <div className={styles.edit_colors}>
                  <label className="control-label">{strings.color}</label>
                  <div>
                    {DISCORD_BUTTONS_COLORS.map(({ color, name, value }) => (
                      <button
                        title={name}
                        onClick={() =>
                          handleChange("CHANGE_BUTTON_COLOR", index, {
                            i: reactionIndex,
                            value,
                          })
                        }
                        style={{ borderColor: color }}
                        className={
                          reaction.style === value
                            ? styles.button_color__active
                            : ""
                        }
                      >
                        <span
                          style={{
                            backgroundColor: color,
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
