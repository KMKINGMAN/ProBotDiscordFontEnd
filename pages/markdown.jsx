// import Editor from "@component/Editor";
import { useState } from "react";

export default function Mark() {
  const [value, setValue] = useState("");
  return (
    <div className="mt-80">
      <h1 className="center">Lexical Textarea</h1>
      {/* <Editor value={value} onChange={(val) => setValue(val)} /> */}

      <h1 className="center">Normal Textarea</h1>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter some text..."
        className="form-control"
        style={{ maxWidth: "600px", margin: "20px auto 20px auto" }}
      ></textarea>
    </div>
  );
}
