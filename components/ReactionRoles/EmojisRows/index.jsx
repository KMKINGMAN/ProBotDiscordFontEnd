import Emoji from "@component/emoji-picker/Emoji";
import RolesList from "@component/roles_list";

export default function EmojisRowList({ reactions, handleChange, index }) {
  return (
    <>
      {reactions.map((reaction, i) => (
        <div className="rr-reactions-list" key={i}>
          <div>
            <Emoji emoji={reaction.emoji} size={"1.8rem"} className="flex" />
            <RolesList
              value={reaction.roles}
              onChange={(data) =>
                handleChange("CHANGE_ROLES", index, {
                  i,
                  data,
                })
              }
            />
          </div>
          <button className="btn btn-danger btn-icon" onClick={() => handleChange("REMOVE_REACTION", index, i)}>
            <i className="fas fa-trash" style={{ color: "var( --red)" }}></i>
          </button>
        </div>
      ))}
    </>
  );
}
