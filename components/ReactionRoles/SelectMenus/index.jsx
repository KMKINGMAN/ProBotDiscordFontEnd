import { useState, useContext } from "react";
import SingleRow from "./SingleRow";
import styles from "./styles.module.css";
import strings from "@script/locale";
import {
  SortableContainer,
  SortableItem,
} from "pages/server/[guild_id]/reaction_roles";
import { Context } from "@script/_context";
import { arrayMoveImmutable } from "array-move";

export default function SelectMenus({ reactions, handleChange, index }) {
  const { rtl } = useContext(Context);
  const [open, setOpen] = useState(false);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    handleChange(
      "UPDATE_SELECT_OPTION_LOCATION",
      index,
      arrayMoveImmutable(reactions.options, oldIndex, newIndex)
    );
  };

  if (!reactions) return <></>;
  return (
    <div className={styles.container}>
      <div>
        <label className="control-label" htmlFor={`optionLabel-${index}`}>
          {strings.rr_select_menu_placeholder}
        </label>
        <input
          id={`optionLabel-${index}`}
          className="form-control"
          type="text"
          value={reactions.placeholder}
          onChange={({ target: { value } }) =>
            handleChange("UPDATE_SELECT_MENU_PLACEHOLDER", index, value)
          }
          placeholder={strings.type_here}
        />
      </div>
      <SortableContainer onSortEnd={onSortEnd} useDragHandle>
        {reactions.options.map((selectMenu, selectMenuIndex) => (
          <SortableItem
            key={`item-${selectMenuIndex}`}
            index={selectMenuIndex}
            dir={rtl ? "rtl" : "ltr"}
            value={
              <SingleRow
                option={{
                  ...selectMenu,
                  index: selectMenuIndex,
                }}
                handleChange={handleChange}
                index={index}
                open={open === selectMenuIndex}
                toggle={() =>
                  setOpen(open === selectMenuIndex ? false : selectMenuIndex)
                }
              />
            }
          />
        ))}
      </SortableContainer>
    </div>
  );
}
