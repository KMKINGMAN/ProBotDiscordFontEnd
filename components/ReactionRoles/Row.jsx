import { useContext, useState } from "react";
import { Context } from "@script/_context";
import strings from "@script/locale";
import { SortableHandle } from "@component/react-sortable-hoc";
import RowContent from "./RowContent";
import { isEqual } from "lodash";

const uniqueId = () => `rr_${Math.random().toString(36).substring(2, 10)}`;

export const DragHandle = SortableHandle((props) =>
  props.dots ? (
    <button className="Showcase__style__handle--dots">
      <svg
        width="10"
        height="15"
        viewBox="0 0 10 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.333 1.667C3.333 0.75 2.583 0 1.667 0C0.75 0 0 0.75 0 1.667C0 2.583 0.75 3.333 1.667 3.333C2.583 3.333 3.333 2.583 3.333 1.667ZM10 1.667C10 0.75 9.25 0 8.333 0C7.417 0 6.667 0.75 6.667 1.667C6.667 2.583 7.417 3.333 8.333 3.333C9.25 3.333 10 2.583 10 1.667ZM3.333 13.333C3.333 12.416 2.583 11.666 1.667 11.666C0.75 11.666 0 12.416 0 13.333C0 14.25 0.75 15 1.667 15C2.583 15 3.333 14.25 3.333 13.333ZM10 13.333C10 12.416 9.25 11.666 8.333 11.666C7.417 11.666 6.667 12.416 6.667 13.333C6.667 14.25 7.417 15 8.333 15C9.25 15 10 14.25 10 13.333ZM3.333 7.5C3.333 6.584 2.583 5.834 1.667 5.834C0.75 5.834 0 6.584 0 7.5C0 8.417 0.75 9.167 1.667 9.167C2.583 9.167 3.333 8.417 3.333 7.5ZM10 7.5C10 6.584 9.25 5.834 8.333 5.834C7.417 5.834 6.667 6.584 6.667 7.5C6.667 8.417 7.417 9.167 8.333 9.167C9.25 9.167 10 8.417 10 7.5Z"
          fill="#9B9D9F"
        />
      </svg>
    </button>
  ) : (
    <div className="Showcase__style__handle" />
  )
);

const ACTION_TYPE = {
  reaction: 0,
  buttons: 2,
  "select-menus": 3,
};

export default function ReactionRolesRow(props) {
  const { data, setData, card, embeds, index, open, setOpen } = props;
  const { Toast, rtl } = useContext(Context);

  const onChangeSwitch = (newType) => {
    setData(
      data.map((card, i) => {
        if (i === index) {
          return { ...card, action_type: newType };
        }
        return card;
      })
    );
  };

  function handleChange(type, index, value) {
    const editCard = (object) =>
      setData(
        data.map((card, cardIndex) =>
          cardIndex === index ? { ...card, ...object } : card
        )
      );
    switch (type) {
      case "REMOVE_CARD":
        setData(data.filter((_, i) => i !== index));
        break;
      case "REACTION_CHANGE_TYPE":
        editCard({ type: value });
        break;
      case "REACTION_CHANGE_NOTIFICATION":
        editCard({ notification: {...data[index].notification,
          enabled: value
        } });
        break;
      case "REACTION_NOTIFICATION_GIVE":
        editCard({ notification: {...data[index].notification,
          give_message: value
        } });
        break;
      case "REACTION_NOTIFICATION_TAKE":
        editCard({ notification: {...data[index].notification,
          take_message: value
        } });
        break;
      case "REACTION_NOTIFICATION_NO_CHANGES":
        editCard({ notification: {...data[index].notification,
          no_changes_message: value
        } });
        break;
      case "ADD_REACTION":
        editCard({
          reactions: [...data[index].reactions, { emoji: value, roles: [] }],
        });
        break;
      case "REMOVE_REACTION":
        editCard({
          reactions: [
            ...data[index].reactions.filter((reaction) => reaction.type),
            ...data[index].reactions
              .filter((r) => !r.type)
              .filter((reaction, i) => i !== value),
          ],
        });
        break;
      case "CHANGE_ROLES":
        editCard({
          reactions: [
            ...data[index].reactions
              .filter((r) => !r.type)
              .map((reaction, i) =>
                i === value.i
                  ? {
                      ...reaction,
                      roles: value.data,
                    }
                  : reaction
              ),
            ...data[index].reactions.filter((r) => r.type),
          ],
        });
        break;
      case "SET_EMBED":
        editCard({ embed: value, message_id: "" });
        break;
      case "SET_MESSAGE":
        editCard({
          message_id: value.split("-")[0],
          channel_id: value.split("-")[1],
        });
        break;
      case "ROLES_LIMIT":
        editCard({ roles_limit: value });
        break;
      case "CHANGE_BUTTON_LABEL":
        editCard({
          reactions: [
            ...data[index].reactions
              .filter((r) => r.type === 2)
              .map((reaction, i) =>
                i === value.i
                  ? {
                      ...reaction,
                      label: value.text,
                    }
                  : reaction
              ),
            ...data[index].reactions.filter((r) => r.type !== 2),
          ],
        });
        break;
      case "CHANGE_BUTTON_EMOJI":
        editCard({
          reactions: [
            ...data[index].reactions
              .filter((r) => r.type === 2)
              .map((reaction, i) =>
                i === value.i
                  ? {
                      ...reaction,
                      emoji: value.emoji,
                    }
                  : reaction
              ),
            ...data[index].reactions.filter((r) => r.type !== 2),
          ],
        });
        break;
      case "CHANGE_BUTTON_ROLES":
        editCard({
          reactions: [
            ...data[index].reactions
              .filter((r) => r.type === 2)
              .map((reaction, i) =>
                i === value.i
                  ? {
                      ...reaction,
                      roles: value.data,
                    }
                  : reaction
              ),
            ...data[index].reactions.filter((r) => r.type !== 2),
          ],
        });
        break;
      case "ADD_BUTTON":
        let newReactions = data[index].reactions.filter((r) => r.type === 2);

        if (newReactions.length > 24) {
          return Toast.fire({
            icon: "warning",
            title: strings.formatString(strings.rr_buttons_limit, 25),
          });
        }

        editCard({
          reactions: [
            ...data[index].reactions,
            {
              emoji: null,
              label: "My Button",
              roles: [],
              style: value,
              type: 2,
              id: uniqueId(),
            },
          ],
        });
        break;
      case "UPDATE_BUTTONS_LOCATION":
        if (
          !isEqual(
            value,
            data[index].reactions.filter((r) => r.type === 2)
          )
        ) {
          editCard({
            reactions: [
              ...data[index].reactions.filter((r) => r.type !== 2),
              ...value,
            ],
          });
        }
        break;
      case "CHANGE_BUTTON_COLOR":
        editCard({
          reactions: [
            ...data[index].reactions
              .filter((r) => r.type === 2)
              .map((reaction, i) =>
                i === value.i
                  ? {
                      ...reaction,
                      style: value.value,
                    }
                  : reaction
              ),
            ...data[index].reactions.filter((r) => r.type !== 2),
          ],
        });
        break;
      case "REMOVE_BUTTON":
        editCard({
          reactions: [
            ...data[index].reactions
              .filter((r) => r.type === 2)
              .filter((reaction, i) => i !== value),
            ...data[index].reactions.filter((r) => r.type !== 2),
          ],
        });
        break;
      case "ADD_SELECT":
        const isThereSelectMenu = data[index].reactions.find(
          (r) => r.type === 3
        );
        let optionsSelectMenuLength = data[index].reactions.find(
          (r) => r.type === 3
        )?.options.length;

        if (optionsSelectMenuLength > 25) {
          return Toast.fire({
            icon: "warning",
            title: strings.rr_select_limits,
          });
        }
        if (isThereSelectMenu) {
          if (isThereSelectMenu.options.length > 24) {
            return Toast.fire({
              icon: "warning",
              title: strings.rr_options_limit,
            });
          }
          return editCard({
            reactions: [
              ...data[index].reactions
                .filter((r) => r.type === 3)
                .map((reaction) => ({
                  ...reaction,
                  options: [
                    ...reaction.options,
                    {
                      id: `${uniqueId()}_roleid`,
                      label: "",
                      description: "",
                      value: "",
                      emoji: null,
                    },
                  ],
                })),
              ...data[index].reactions.filter((r) => r.type !== 3),
            ],
          });
        }

        editCard({
          reactions: [
            ...data[index].reactions,
            {
              id: uniqueId(),
              placeholder: "",
              type: 3,
              options: [
                {
                  id: `${uniqueId()}_roleid`,
                  label: "",
                  description: "",
                  value: "",
                  emoji: null,
                },
              ],
            },
          ],
        });
        break;
      case "REMOVE_SELECT_MENU":
        editCard({
          reactions: [...data[index].reactions.filter((r) => r.type !== 3)],
        });
        break;
      case "REMOVE_SELECT_MENU_OPTION":
        if (
          data[index].reactions.find((r) => r.type === 3).options.length === 1
        ) {
          return editCard({
            reactions: [...data[index].reactions.filter((r) => r.type !== 3)],
          });
        }
        editCard({
          reactions: [
            ...data[index].reactions
              .filter((r) => r.type === 3)
              .map((r) => ({
                ...r,
                options: r.options.filter((o, i) => i !== value),
              })),
            ...data[index].reactions.filter((r) => !r.type),
          ],
        });
        break;
      case "UPDATE_SELECT_OPTION_LABEL":
        editCard({
          reactions: [
            ...data[index].reactions
              .filter((r) => r.type === 3)
              .map((r) => ({
                ...r,
                options: r.options.map((o, i) =>
                  i === value.optionIndex
                    ? {
                        ...o,
                        label: value.value,
                      }
                    : o
                ),
              })),
            ...data[index].reactions.filter((r) => r.type !== 3),
          ],
        });
        break;
      case "UPDATE_SELECT_OPTION_DESCRIPTION":
        editCard({
          reactions: [
            ...data[index].reactions
              .filter((r) => r.type === 3)
              .map((r) => ({
                ...r,
                options: r.options.map((o, i) =>
                  i === value.optionIndex
                    ? {
                        ...o,
                        description: value.value,
                      }
                    : o
                ),
              })),
            ...data[index].reactions.filter((r) => r.type !== 3),
          ],
        });
        break;
      case "CHANGE_SELECT_OPTION_EMOJI":
        editCard({
          reactions: [
            ...data[index].reactions
              .filter((r) => r.type === 3)
              .map((r) => ({
                ...r,
                options: r.options.map((o, i) =>
                  i === value.optionIndex
                    ? {
                        ...o,
                        emoji: value.emoji,
                      }
                    : o
                ),
              })),
            ...data[index].reactions.filter((r) => r.type !== 3),
          ],
        });
        break;
      case "CHANGE_SELECT_OPTION_ROLES":
        editCard({
          reactions: [
            ...data[index].reactions
              .filter((r) => r.type === 3)
              .map((r) => ({
                ...r,
                options: r.options.map((o, i) =>
                  i === value.optionIndex
                    ? {
                        ...o,
                        value: value.data,
                      }
                    : o
                ),
              })),
            ...data[index].reactions.filter((r) => r.type !== 3),
          ],
        });
        break;
      case "UPDATE_SELECT_MENU_PLACEHOLDER":
        editCard({
          reactions: [
            ...data[index].reactions
              .filter((r) => r.type === 3)
              .map((r) => ({
                ...r,
                placeholder: value,
              })),
            ...data[index].reactions.filter((r) => r.type !== 3),
          ],
        });
        break;
      case "UPDATE_SELECT_OPTION_LOCATION":
        editCard({
          reactions: [
            ...data[index].reactions
              .filter((r) => r.type === 3)
              .map((r) => ({
                ...r,
                options: value,
              })),
            ...data[index].reactions.filter((r) => r.type !== 3),
          ],
        });
        break;
    }
  }

  return (
    <div className="borderRadiusBg rr-all-card">
      <header>
        <div>
          <h5 className="pt-10 d-flex break-word" dir={rtl ? "rtl" : "ltr"}>
            <DragHandle />
            {(card.embed &&
              embeds.find((embed) => embed.id === card.embed) &&
              embeds.find((embed) => embed.id === card.embed).name) ||
              strings.rr_select_embed}
          </h5>
          <div className="actions-button">
            <button
              onClick={() => (open === index ? setOpen(false) : setOpen(index))}
              className={`btn btn-primary btn-icon ${
                open === index ? "activeBtn" : ""
              }`}
            >
              <img src="/static/edit.svg" alt="edit-image" /> {strings.EDIT}
            </button>
            <button
              onClick={() => {
                setData(data.filter((_, i) => i !== index));
                setOpen(false);
              }}
              className="btn btn-danger btn-icon"
            >
              <i className="fas fa-trash"></i> {strings.delete}
            </button>
          </div>
        </div>
      </header>
      {open === index && (
        <RowContent
          card={card}
          embeds={embeds}
          index={index}
          handleChange={handleChange}
          switchType={card.action_type}
          onChangeSwitch={onChangeSwitch}
        />
      )}
    </div>
  );
}
