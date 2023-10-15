import { FileUploader } from "react-drag-drop-files";

export default function DragDropFiles({
  handleChange,
  uploadedFile,
  accept,
  height,
  width,
  className,
  ...props
}) {
  return (
    <div
      style={
        uploadedFile
          ? {}
          : {
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }
      }
    >
      {uploadedFile ? (
        <div
          style={{
            height: "100%",
            width: "100%",
            // backgroundImage: `url(${uploadedFile})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className={`uploaded-file-container ${className ?? ""}`}
        >
          <button onClick={() => handleChange(null)}>
            <i className="fas fa-times" />
          </button>
          <img
            src={uploadedFile}
            className={className ?? ""}
            alt={`uploaded file - ${props.name}`}
          />
        </div>
      ) : (
        <FileUploader
          handleChange={handleChange}
          onSelectFile={(file) => {
            handleChange(file);
          }}
          types={accept ? accept : "image/*"}
          multiple={false}
          children={
            <div className="drag-drop-files">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.4"
                  d="M22.02 16.82L18.89 9.49999C18.32 8.15999 17.47 7.39999 16.5 7.34999C15.54 7.29999 14.61 7.96999 13.9 9.24999L12 12.66C11.6 13.38 11.03 13.81 10.41 13.86C9.78001 13.92 9.15002 13.59 8.64002 12.94L8.42002 12.66C7.71002 11.77 6.83002 11.34 5.93002 11.43C5.03002 11.52 4.26002 12.14 3.75002 13.15L2.02002 16.6C1.40002 17.85 1.46002 19.3 2.19002 20.48C2.92002 21.66 4.19002 22.37 5.58002 22.37H18.34C19.68 22.37 20.93 21.7 21.67 20.58C22.43 19.46 22.55 18.05 22.02 16.82Z"
                  fill="#70707C"
                />
                <path
                  d="M6.96997 8.38C8.83669 8.38 10.35 6.86672 10.35 5C10.35 3.13327 8.83669 1.62 6.96997 1.62C5.10324 1.62 3.58997 3.13327 3.58997 5C3.58997 6.86672 5.10324 8.38 6.96997 8.38Z"
                  fill="#70707C"
                />
              </svg>
            </div>
          }
          {...props}
        />
      )}
    </div>
  );
}
