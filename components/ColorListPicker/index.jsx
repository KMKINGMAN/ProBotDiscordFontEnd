import ColorPicker from "@component/ColorPicker";
import Image from "next/image";
import { DEFAULT_COLORS_LIST } from "./constants";

export default function ColorListPicker({ activeColor, onChange }) {
  const ACTIVE_COLOR_OBJECT = DEFAULT_COLORS_LIST.find(
    (item) => parseInt(item.color.replace("#", ""), 16) === activeColor
  );

  return (
    <div className="colors-list">
      {DEFAULT_COLORS_LIST.map((item) => (
        <div
          key={item.color}
          className={`color${
            parseInt(item.color.replace("#", ""), 16) === activeColor
              ? " active"
              : ""
          }`}
          style={
            parseInt(item.color.replace("#", ""), 16) === activeColor
              ? {
                  "--backgroundColorPicker": item.color,
                  backgroundColor: item.background,
                  outline: `2px solid ${item.borderColor}`,
                }
              : { backgroundColor: item.color }
          }
          onClick={() => onChange(parseInt(item.color.replace("#", ""), 16))}
          data-color={item.color}
        />
      ))}
      <ColorPicker
        parentStyles={{ height: "20px" }}
        parentClassName="color-picker"
        value={
          ACTIVE_COLOR_OBJECT
            ? ACTIVE_COLOR_OBJECT.color
            : `#${activeColor.toString(16).padStart(6,0)}`
        }
        onChange={(color) => onChange(parseInt(color.hex.replace("#", ""), 16))}
      >
        <Image src="/static/colors.png" alt="Colors" width={20} height={20} />
      </ColorPicker>
    </div>
  );
}
