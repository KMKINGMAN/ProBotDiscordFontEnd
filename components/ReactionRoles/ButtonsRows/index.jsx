import { Context } from "@script/_context";
import { useContext, useState } from "react";
import {
  SortableContainer,
  SortableItem,
} from "pages/server/[guild_id]/reaction_roles";
import RowElement from "./SingleRow";
import styles from "./styles.module.css";
import { arrayMoveImmutable } from "array-move";

export default function ButtonsRowList({ handleChange, reactions, index }) {
  const { rtl } = useContext(Context);
  const [open, setOpen] = useState(false);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    handleChange(
      "UPDATE_BUTTONS_LOCATION",
      index,
      arrayMoveImmutable(reactions, oldIndex, newIndex)
    );
  };

  if (!reactions.length) return <></>;
  return (
    <div className={styles.container}>
      <SortableContainer onSortEnd={onSortEnd} useDragHandle>
        {reactions.map((reaction, index2) => (
          <SortableItem
            key={`item-${index2}`}
            index={index2}
            dir={rtl ? "rtl" : "ltr"}
            value={
              <RowElement
                key={index2}
                index={index}
                reactionIndex={index2}
                reaction={reaction}
                handleChange={handleChange}
                open={open === reaction.id}
                toggle={() => setOpen(open === reaction.id ? false : reaction.id)}
              />
            }
          />
        ))}
      </SortableContainer>
    </div>
  );
}
