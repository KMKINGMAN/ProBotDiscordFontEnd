import { useState, useContext } from "react";
import strings from "@script/locale";
import EmojiPicker from "@component/emoji-picker";
import TooltipSlider from "@component/TooltipSlider.tsx";
import { Context } from "@script/_context";
import moment from "moment";
import Alert from "@component/alert";
import SwitchType from "./SwitchType";
import EmojisRowList from "./EmojisRows";
import ButtonsRowList from "./ButtonsRows";
import Tooltip from "rc-tooltip";
import styles from "./ButtonsRows/styles.module.css";
import SelectMenus from "./SelectMenus";
import { DISCORD_BUTTONS_COLORS } from '@script/constants'

export default function RowContent(props) {
  const { guild, rtl } = useContext(Context);
  const { index, card, embeds, handleChange, onChangeSwitch } = props;
  const [MaxReactionsAlert, setMaxReactionsAlert] = useState(true);
  const [visible, setVisible] = useState(false);

  const onVisibleChange = (visible) => setVisible(visible);

  const getMessages = (embed_id) => {
    if (!embeds || embeds.length === 0) return;
    const embed = embeds.find((e) => e.id === embed_id);
    if (embed) return embed.messages;
    return false;
  };

  const CURRENT_TYPE = {
    2: (
      <ButtonsRowList
        reactions={card.reactions.filter((r) => r.type === 2)}
        handleChange={handleChange}
        index={index}
      />
    ),
    0: (
      <EmojisRowList
        reactions={card.reactions.filter((r) => !r.type)}
        handleChange={handleChange}
        index={index}
      />
    ),
    3: (
      <SelectMenus
        reactions={card.reactions.find((r) => r.type === 3)}
        handleChange={handleChange}
        index={index}
      />
    ),
  };

  const CURRENT_ADD_BUTTON = {
    2: (
      <Tooltip
        visible={visible}
        onVisibleChange={onVisibleChange}
        trigger="click"
        placement={rtl ? "left" : "right"}
        overlay={
          <div className={styles.edit_colors} style={{ width: "190px" }}>
            <label className="control-label">{strings.color}</label>
            <div>
              {DISCORD_BUTTONS_COLORS.map(({ color, name, value }) => (
                <button
                  title={name}
                  onClick={() => {
                    handleChange("ADD_BUTTON", index, value);
                    setVisible(false);
                  }}
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
        }
      >
        <button
          type="button"
          id={`rr_emoji-${index}`}
          className="btn btn-icon btn-primary"
        >
          <i className="fas fa-plus"></i>
          {strings.rr_add_button}
        </button>
      </Tooltip>
    ),
    0: (
      <EmojiPicker
        onClick={(emoji) => {
          if (
            card.reactions
              .filter((re) => !re.type)
              .map((emoji2) => emoji2.emoji?.id)
              .includes(emoji.id)
          )
            return;
          handleChange("ADD_REACTION", index, emoji);
        }}
        customEmojiPickerContainerClassName="emoji-picker-container__reaction"
        childrenClassName={card.reactions.length >= 20 ? "disabled" : ""}
      >
        <button
          type="button"
          disabled={card.reactions.length >= 20}
          id={`rr_emoji-${index}`}
          className="btn btn-icon btn-primary"
        >
          <i className="fas fa-plus"></i>
          {strings.rr_reaction_emoji}
        </button>
      </EmojiPicker>
    ),
    3: (
      <button
        type="button"
        id={`rr_emoji-${index}`}
        className="btn btn-icon btn-primary"
        onClick={(e) => {
          handleChange("ADD_SELECT", index);
        }}
      >
        <i className="fas fa-plus"></i>
        {strings.rr_add_option}
      </button>
    ),
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="mt-20 borderRadiusBg reaction-role-form"
    >
      <div className="d-flex align-items-center full-width gap-2">
        <div className="form-group flex-1">
          <label htmlFor="rr_embeds" className="txt-LightBlack">
            {strings.rr_embeds}
          </label>
          <select
            if="Message"
            className="form-control form-select"
            id="rr_embeds"
            value={card.embed || ""}
            onChange={(event) =>
              handleChange("SET_EMBED", index, event.target.value)
            }
          >
            <option value="">{strings.rr_select_embed}</option>
            {embeds[0] &&
              embeds.map((embed, event) => (
                <option
                  key={event}
                  value={embed.id}
                  defaultValue={embed.id === card.embed}
                >
                  {embed.name}
                </option>
              ))}
          </select>
        </div>
        {card.embed && (
          <div className="form-group flex-1">
            <label htmlFor="embed_choosemsg" className="txt-LightBlack">
              {strings.embed_choosemsg}
            </label>
            <select
              className="form-control form-select"
              id="embed_choosemsg"
              value={
                card.message_id !== "" && card.channel_id !== ""
                  ? `${card.message_id}-${card.channel_id}`
                  : ""
              }
              onChange={(e) =>
                handleChange("SET_MESSAGE", index, e.target.value)
              }
            >
              <option value="">{strings.rr_select_message}</option>
              {getMessages(card.embed) ? (
                getMessages(card.embed).map((message, e) => {
                  const channel = guild.channels.find(
                    (channel) => channel.id === message.channelId || message.channel
                  );
                  if (channel)
                    return (
                      <option
                        key={e}
                        value={`${message.messageId || message.msg}-${message.channelId || message.channel}`}
                      >
                        #{channel.name} -{" "}
                        {moment(message.date)
                          .local()
                          .format("YYYY-MM-DD hh:mm:ss A")}
                      </option>
                    );
                })
              ) : (
                <></>
              )}
            </select>
          </div>
        )}
      </div>
      <div className="form-group has-feedback">
        <div className="rr-emoji-btn-div">
          <div className="form-group mt-15">
            <label htmlFor="Message" className="txt-LightBlack">
              {strings.rr_roles_limit}:{" "}
              {!card.roles_limit || card.roles_limit === 0
                ? "∞"
                : card.roles_limit}
            </label>
            <TooltipSlider
              max={99}
              min={0}
              className="mt-2 mb-4"
              value={card.roles_limit}
              onChange={(value) =>
                handleChange("ROLES_LIMIT", index, Math.floor(value))
              }
              tipFormatter={(val) => (val === 0 ? "∞" : val)}
            />
          </div>
          <hr style={{ marginTop: "2.5rem" }} />
          <div className="mb-10" id="Emoji-reaction">
            <Alert
              open={
                MaxReactionsAlert &&
                card.reactions.filter((r) => !r.type || r.type === 0).length >=
                  20
              }
              type="warning"
              handelClose={() => setMaxReactionsAlert(false)}
              className="mb-15"
            >
              Max Reactions!
            </Alert>
            <div className="d-flex flex-wrap gap-3 align-items-end justify-content-between">
              <div style={{ flex: "1 1 400px" }}>
                <label className="txt-LightBlack mb-3">
                  {strings.rr_types}
                </label>
                <SwitchType
                  switchType={card.action_type}
                  onChangeSwitch={onChangeSwitch}
                />
              </div>
            </div>
            {CURRENT_TYPE[card.action_type]}
            <div className="mt-20 position-relative">
              {CURRENT_ADD_BUTTON[card.action_type]}
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="form-group rr-type-radios-parent">
        <label className="txt-LightBlack">{strings.rr_type}</label>
        <div
          onClick={() => handleChange("REACTION_CHANGE_TYPE", index, "toggle")}
          className={`rr-type-radios${
            card.type === "toggle" ? " rr-type-radios-active" : ""
          }`}
        >
          <label className="container">
            {strings.rr_toggle}
            <input
              type="radio"
              value="Toggle"
              name="rr-type"
              checked={card.type === "toggle"}
              readOnly
            />
            <p>{strings.rr_toggle_desc}</p>
            <span className="checkmark"></span>
          </label>
        </div>
        <div
          onClick={() => handleChange("REACTION_CHANGE_TYPE", index, "give")}
          className={`rr-type-radios${
            card.type === "give" ? " rr-type-radios-active" : ""
          }`}
        >
          <label className="container">
            {strings.rr_give}
            <input
              type="radio"
              value="Toggle"
              name="rr-type"
              checked={card.type === "give"}
              readOnly
            />
            <p>{strings.rr_give_desc}</p>
            <span className="checkmark"></span>
          </label>
        </div>
        <div
          onClick={() => handleChange("REACTION_CHANGE_TYPE", index, "take")}
          className={`rr-type-radios${
            card.type === "take" ? " rr-type-radios-active" : ""
          }`}
        >
          <label className="container">
            {strings.rr_take}
            <input
              type="radio"
              value="Toggle"
              name="rr-type"
              checked={card.type === "take"}
              readOnly
            />
            <p>{strings.rr_take_desc}</p>
            <span className="checkmark"></span>
          </label>
        </div>
      </div>

      <div className="form-group rr-type-radios-parent">
        <label className="txt-LightBlack">{strings.rr_notification_type}</label>
        <div
          onClick={() =>
            handleChange("REACTION_CHANGE_NOTIFICATION", index, true)
          }
          className={`rr-type-radios${
            card.notification?.enabled ?? true ? " rr-type-radios-active" : ""
          }`}
        >
          <label className="container">
            {strings.rr_notification_notify}
            <input
              type="radio"
              value="Toggle"
              name="rr-notification"
              checked={card.notification?.enabled ?? true}
              readOnly
            />
            <p>
              {strings.rr_notification_notify_description}
              <code>{strings.rr_notification_notify_role}</code>{" "}
            </p>
            <span className="checkmark"></span>
            <input
              className="mt-2 form-control"
              onChange={(e) =>
                handleChange(
                  "REACTION_NOTIFICATION_GIVE",
                  index,
                  e.target.value
                )
              }
              value={card.notification?.give_message}
              placeholder={strings.self_assignable_roles_give_notification}
              defaultValue="✅ Added **{0}**"
            />
            <input
              className="mt-2 form-control"
              onChange={(e) =>
                handleChange(
                  "REACTION_NOTIFICATION_TAKE",
                  index,
                  e.target.value
                )
              }
              value={card.notification?.take_message}
              placeholder={strings.self_assignable_roles_take_notification}
              defaultValue="❌ Removed **{0}**"
            />
            <input
              className="mt-2 form-control"
              onChange={(e) =>
                handleChange(
                  "REACTION_NOTIFICATION_NO_CHANGES",
                  index,
                  e.target.value
                )
              }
              value={card.notification?.no_changes_message}
              placeholder={strings.self_assignable_roles_no_notification}
              defaultValue="❌ There have been no changes in roles."
            />
          </label>
        </div>
        <div
          onClick={() =>
            handleChange("REACTION_CHANGE_NOTIFICATION", index, false)
          }
          className={`rr-type-radios${
            card.notification?.enabled === false ? " rr-type-radios-active" : ""
          }`}
        >
          <label className="container">
            {strings.rr_notification_silent}
            <input
              type="radio"
              value="Toggle"
              name="rr-notification"
              checked={card.notification?.enabled === false}
              readOnly
            />
            <p>{strings.rr_notification_silent_description}</p>
            <span className="checkmark"></span>
          </label>
        </div>
      </div>
    </form>
  );
}
