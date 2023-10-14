import { useState } from "react";
import EmojiPicker from "@component/emoji-picker";

export default function EmojiPickerPage() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  return (
    <>
      <div className="mt-60">
        <EmojiPicker
          open={open}
          setOpen={setOpen}
          onClick={(emoji) => {
            setText(text + emoji.native);
            setOpen(false);
          }}
        >
          <button className="btn btn-primary">Pick</button>
        </EmojiPicker>
        <input
          type="text"
          className="form-control"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      </div>
    </>
  );
}
