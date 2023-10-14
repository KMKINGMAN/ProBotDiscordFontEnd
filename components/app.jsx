import {Context} from "@script/_context";
import {useContext} from 'react';
import Modal from "react-modal";
Modal.setAppElement("body");
export default function App({children}) {
	const {rtl, providerClass} = useContext(Context);
	return <div className={`${rtl? "rtl" : ""} ${providerClass}`}>{children}</div>;
}
