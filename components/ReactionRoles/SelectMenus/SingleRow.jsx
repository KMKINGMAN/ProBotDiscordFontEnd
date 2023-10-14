import strings from "@script/locale";
import EmojiPicker from "@component/emoji-picker";
import Emoji from "@component/emoji-picker/Emoji";

import styles from "./styles.module.css";
import RolesList from "@component/roles_list";
import { DragHandle } from "../Row";

export default function SingleRow(props) {
  const { option, handleChange, index } = props;

  return (
    <div className={styles.singleRow__container}>
      <DragHandle dots />
      <div className={styles.header}>
        <div>
          <div className={styles["singleRow__label-description-roles"]}>
            <div className={styles["singleRow__label-description"]}>
              <div className={styles["emoji-picker__container"]}>
                <label className="control-label">{strings.emoji}</label>
                <div className={styles["emoji-picker"]}>
                  {option.emoji && (
                    <button
                      className={styles.remove_emoji}
                      onClick={() =>
                        handleChange("CHANGE_SELECT_OPTION_EMOJI", index, {
                          optionIndex: option.index,
                          emoji: null,
                        })
                      }
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                  <EmojiPicker
                    onClick={(emoji) => {
                      handleChange("CHANGE_SELECT_OPTION_EMOJI", index, {
                        emoji,
                        optionIndex: option.index,
                      });
                    }}
                    childrenClassName={styles["emoji-picker-children"]}
                    emojiPickerContainerClassName={
                      styles["emoji-picker-container"]
                    }
                  >
                    {option.emoji ? (
                      <div className={styles.selected_emoji}>
                        <Emoji
                          emoji={option.emoji}
                          size={"1.4rem"}
                          className="flewx"
                        />
                      </div>
                    ) : (
                      <button className={styles.add_emoji_button}>
                        <i class="fas fa-plus"></i>
                      </button>
                    )}
                  </EmojiPicker>
                </div>
              </div>
              <div>
                <label
                  className="control-label"
                  htmlFor={`option-label-${option.index}`}
                >
                  {strings.label}
                </label>
                <input
                  className="form-control"
                  id={`option-label-${option.index}`}
                  placeholder={strings.rr_option_title}
                  value={option.label}
                  onChange={({ target: { value } }) =>
                    handleChange("UPDATE_SELECT_OPTION_LABEL", index, {
                      optionIndex: option.index,
                      value,
                    })
                  }
                />
              </div>
              <div>
                <label
                  className="control-label"
                  htmlFor={`option-description-${option.index}`}
                >
                  {strings.rr_select_menu_description}
                </label>
                <input
                  id={`option-description-${option.index}`}
                  type="text"
                  className="form-control"
                  placeholder={strings.rr_option_description}
                  value={option.description}
                  maxLength={100}
                  onChange={({ target: { value } }) =>
                    handleChange("UPDATE_SELECT_OPTION_DESCRIPTION", index, {
                      optionIndex: option.index,
                      value,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <div className={styles.singleRow__actions}>
            <button
              onClick={() =>
                handleChange("REMOVE_SELECT_MENU_OPTION", index, option.index)
              }
              className="btn btn-danger btn-icon"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div>
          <label className="control-label">{strings.roles}</label>

          <RolesList
            value={option.value ? option.value.split(",") : []}
            onChange={(data) =>
              handleChange("CHANGE_SELECT_OPTION_ROLES", index, {
                optionIndex: option.index,
                data: data.join(","),
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
