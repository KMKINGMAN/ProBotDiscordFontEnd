import { useState, useEffect, useContext } from "react";
import { Context } from "@script/_context";
import axios from "axios";
import strings from "@script/locale";
import numeral from "numeral";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useRouter } from "next/router";

function Player({ index, user: leaderboard }) {

  const { user } = useContext(Context);

  return (
    <div
      className="top-container"
      dir="ltr"
      style={{ animationDuration: index >= 10 ? "1s" : `0.${index}s` }}
    >
      {index !== 1 && (
        <h4 className={index <= 10 ? "top-number-10" : "top-number"}>
          {index}
        </h4>
      )}
      <div
        className={index === 1 ? undefined : "top-100"}
        id={index === 1 ? "top-1" : undefined}
      >
        <div className="top-user-info">
          {index === 1 && (
            <img
              src="/static/crowns.svg"
              className="top-one-crown"
              id="top-one-crown-id"
            />
          )}
          <div className="tw-relative">
             {
               index !== 1 && !!leaderboard.membership_tier && (
                <img className="tw-rounded-2xl tw-absolute top_crown tw-left-0" src="/static/crown.png" width="23px" height="auto" />
              )
            }

            <img
                width="100"
                src={leaderboard.avatar?.replace("size=1024", "size=64")}
                alt={`${leaderboard.name}s Avatar image`}
                onError={(e) =>
                  (e.target.src = "https://cdn.discordapp.com/embed/avatars/1.png")
                }
                className={index === 1 ? undefined : "top-username-avatar"}
                id={index === 1 ? "top-1-username-avatar" : undefined}
              />
           </div>
          <div className="tw-flex tw-gap-3 tw-items-center">
            <h5 className="top-username">
              {leaderboard.name?.replace(/\s/g, " ")}
            </h5>
            {
              !!leaderboard.membership_tier && (
                <span className="membership_tag">{strings.membership}</span>
              )
            }
          </div>
        </div>
        <div className="top-user-levels-credits">
          <img
            className="xp-or-credits-img"
            src={
              leaderboard.level ? "/static/topStar.svg" : "/static/dollar.svg"
            }
          />
          {leaderboard.level && (
            <div className="top-hover-credits">
              <p>{leaderboard.level}</p>
              <p dir="ltr" className="top-txt-color">
                {leaderboard.xp.toFixed()?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
              </p>
            </div>
          )}
          {leaderboard.credits && (
            <div className="top-hover-credits">
              <p>{numeral(leaderboard.credits).format("0.0a")}</p>
              <p
                dir="ltr"
                className="top-txt-color d-flex align-items-center gap-1"
              >
                {leaderboard.credits
                  .toFixed()
                  ?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                <i className="fa-solid fa-cedi-sign"></i>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Top() {
  const [leaderboard, setLeaderboard] = useState([]);
  const router = useRouter();
  const { type } = router.query;

  useEffect(() => {
    let isMounted = true;

    if (!["credits", "xp"].includes(type)) return router.push("/dashboard");
    setLeaderboard([]);
    axios.get(`/top_${type}`).then((response) => {
      if (isMounted) setLeaderboard(response.data);
    });
    return () => {
      isMounted = false;
    };
  }, [type]);

  if (!leaderboard || !leaderboard[0]) {
    return Array.from(Array(10).keys()).map((index) => (
      <SkeletonTheme key={index} color="#36393F" highlightColor="#2F3136">
        <div style={{ display: "flex" }} dir="ltr">
          {index !== 0 && (
            <Skeleton circle className="top-skeleton-loading-rank" />
          )}
          <div className="top-100 top-skeleton-user-info">
            <div className="top-user-info">
              <Skeleton className="top-username-avatar" count={1} />
              <Skeleton className="top-skeleton-username" count={1} />
            </div>
            <div className="top-user-info">
              <Skeleton className="top-skeleton-value" count={1} />
              <Skeleton className="top-username-avatar" count={1} />
            </div>
          </div>
        </div>
      </SkeletonTheme>
    ));
  }

  return (
    <div className="pt-25">
      {leaderboard.map((user, index) => (
        <Player key={index + 1} user={user} index={index + 1} />
      ))}
    </div>
  );
}
