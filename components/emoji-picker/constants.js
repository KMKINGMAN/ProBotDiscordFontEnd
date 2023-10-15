import data from "./discord-emojis.json";
const toneArray = [];
export const EMOJIS = data.emojiDefinitions.map((emoji, i) => {
  return {
    id: emoji.primaryName,
    name: !emoji.primaryName.includes("_tone") && ["_tone1","_tone2","_tone3","_tone4","_tone5"].some((e) => data.emojiDefinitions[i+1]?.primaryName.endsWith(e)) ? `${emoji.primaryName}_tone0` : emoji.primaryName,
    native: emoji.surrogates,
    category: emoji.category,
    asset: emoji.assetFileName,
  };
}).filter((e, i) => data.emojiDefinitions.findIndex((s) => s.assetFileName === e.asset) === i);



//console.log(EMOJIS.filter(e => e.name?.includes("thumb")))
export function getEmojiAsset(native){
  let emoji = data.emojiDefinitions.find((e) => e.surrogates === native);
  if(!emoji) return {};
  console.log("i'm running now lmao and i'm expensive on your browser")
  return emoji.assetFileName;
}

export const CATEGORY_LIST = [
  { id: 0, name: "Custom", icon: <i className="fa-solid fa-star"></i> },
  {
    id: 1,
    name: "People",
    icon: <i className="fa-solid fa-face-smile"></i>,
  },
  {
    id: 2,
    name: "Nature",
    icon: <i className="fa-solid fa-paw"></i>,
  },
  { name: "Food", icon: <i className="fa-solid fa-burger"></i> },
  {
    id: 3,
    name: "Travel",
    icon: <i className="fa-solid fa-earth-americas"></i>,
  },
  { id: 4, name: "Activity", icon: <i className="fa-solid fa-music"></i> },
  { id: 5, name: "Objects", icon: <i className="fa-solid fa-gift"></i> },
  { id: 6, name: "Symbols", icon: <i className="fa-solid fa-fire"></i> },
  { id: 7, name: "Flags", icon: <i className="fa-solid fa-flag"></i> },
];

export const EMOJIS_THEME_COLOR_LIST = [
  {id: 0, name: "Default", emoji: "👏"},
  { id: 1, name: "Light Skin Tone", emoji: "👏🏻" },
  {
    id: 2,
    name: "Medium-Light Skin Tone",
    emoji: "👏🏼",
  },
  { id: 3, name: "Medium Skin Tone", emoji: "👏🏽" },
  {
    id: 4,
    name: "Medium-Dark Skin Tone",
    emoji: "👏🏾",
  },
  { id: 5, name: "Dark Skin Tone", emoji: "👏🏿" },
];
