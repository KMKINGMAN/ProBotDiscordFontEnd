import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { Context } from "@script/_context";

export function CustomLink({
  children,
  href,
  activeClass,
  className,
  onClick,
  target,
  locale,
  query
}) {
  const router = useRouter();
  const active =
    router.pathname
      .split("/")
      .filter((s) => s)
      .map((s) => {
        const cleanPath = s.replace(/\[/g, "").replace(/\]/g, "");
        if (router.query[cleanPath]) return router.query[cleanPath];
        return s;
      })
      .join("/") === href?.replace(/\/$/, "");

  const { shake, unsaved } = useContext(Context);
  return href && (unsaved || onClick) ? (
    <div
      onClick={unsaved ? shake : onClick}
      className={active ? (activeClass ? activeClass : "") : ""}
    >
      {children}
    </div>
  ) : (
    <div
      onClick={onClick}
      className={`${className ? className : ""} ${
        active ? (activeClass ? activeClass : "") : ""
      }`}
    >
      <Link legacyBehavior href={{pathname: href ? href : router.pathname, query: href ? query : router.query}} locale={locale}><a target={target}>{children}</a></Link>
    </div>
  );
}
