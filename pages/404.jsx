import strings from "@script/locale";
import Head from "next/head";
import style from "@style/Notfound.module.css";
import { useContext } from "react";
import { Context } from "@script/_context";

export default function NotFound() {
  useContext(Context);
  return (
    <>
      <Head>
        <title>{"Not found"} - {strings.probot}</title>
      </Head>
      <div className={style.container}>
        <img src="/static/notfound.svg" alt="not-found" className={style["not-found-img"]} />
        <h4>The page you're looking for can't be found.</h4>
        <button className={style["not-found-button"]} onClick={() => window.history.back()}>Home</button>
      </div>
    </>
  );
}
