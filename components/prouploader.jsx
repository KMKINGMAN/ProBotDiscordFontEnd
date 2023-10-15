import { useState, useContext, useRef } from "react";
import axios from "axios";
import { Line } from "rc-progress";
import strings from "@script/locale";
import { Context } from "@script/_context";

export default function ProUploader(props) {
  const [progress, setProgress] = useState(0);
  const chooseFile = useRef(null);
  const { Toast } = useContext(Context);

  const callback = (event) => {
    const file = event.target.files[0];
    if (props.acceptFiles && props.acceptFiles.indexOf(file.type) === -1) {
      return Toast.fire({
        icon: "error",
        title: strings.file_type,
      });
    }
    if (props.maxSize && file.size > props.maxSize) {
      return Toast.fire({
        icon: "error",
        title: `File size must be less than ${props.maxSize / 1000000}MB`,
      });
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", props.id);
    formData.append("type", props.type);
    formData.append("module", props.module);

    const progress = (percentCompleted) => {
      setProgress(percentCompleted);
    };
    setProgress(1);
    axios
      .post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: function (progressEvent) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          progress(percentCompleted);
        },
      })
      .then((response) => {
        setProgress(0);
        props.onChange(response.data.success);
      })
      .catch((error) => {
        setProgress(0);
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          const d = error.response.data;
          if (strings[`error_upload_${d.error}`]) {
            return Toast.fire({
              icon: "error",
              title: strings[`error_upload_${d.error}`],
            });
          }
          if (d.message) {
            return Toast.fire({
              icon: "error",
              title: d.message,
            });
          }
        }
        Toast.fire({
          icon: "error",
          title: "Error, try again later.",
        });

        console.log(error);
      });
  };
  if (progress) {
    return (
      <Line
        percent={progress}
        strokeWidth="2"
        strokeColor="#09a34f"
        trailColor="#42FFA7"
        className="mt-10"
      />
    );
  }
  return (
    <div
      style={{ width: props.fullWidth ? "100%" : "" }}
      className={props.className}
    >
      <div
        className={`fileinput fileinput-new${
          props.embed ? " embed-fileinput" : ""
        }`}
        data-provides="fileinput"
      >
        <input
          type="text"
          style={{
            borderRadius: props.remove_border_top && 0,
            borderEndStartRadius: props.remove_border_top && "11px",
          }}
          className="form-control"
          data-trigger="fileinput"
          value={props.value}
          onChange={(event) => props.onChange(event.target.value)}
          disabled={props.disabled}
          placeholder={
            props.disabled ? strings.upload_image : strings.insertorupload
          }
        />
        <div
          style={{
            borderRadius: props.remove_border_top && 0,
            borderEndEndRadius: props.remove_border_top && "11px",
          }}
          className="fileupload btn btn-info btn-anim btn-file"
          onClick={() => chooseFile.current.click()}
        >
          <i className="fa fa-upload" />
          <span className="fileinput-exists btn-text">{strings.UPLOAD}</span>
          <input type="hidden" />
          <input
            type="file"
            style={{ display: "none" }}
            name="upload-image"
            onChange={callback}
            accept={props.acceptFiles || "image/*"}
            ref={chooseFile}
          />
        </div>
      </div>
    </div>
  );
}
