import LocalizedStrings from "react-localization";
import Langs, {webLangs} from "probot-locale";

export const lang = webLangs;


const locale = new LocalizedStrings(Langs);
// locale._props = null;
export default locale;
