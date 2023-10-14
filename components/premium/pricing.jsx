import { useState, useRef, useContext, useEffect } from "react";
import Head from "next/head";
import strings from "../../scripts/locale";
import { Context } from "../../scripts/_context";
import Checkout from "@component/premium/checkout";
import axios from "axios";
import { useRouter } from "next/router";

export default function Pricing() {
  const router = useRouter();
  const { user, loading, auth, methods, setMethods, rtl, guild, Toast } =
    useContext(Context);
  const [type, setType] = useState("yearly");
  const [sub, setSub] = useState(undefined);
  const [openModal, setOpenModal] = useState(false);
  const data = [
    {
      item: 1,
      name: strings.premium + " " + strings.tier + " 1",
      featured: sub ? type === sub.period : true,
      features: [
        strings.prime_features_1,
        strings.prime_features_2,
        strings.prime_features_3,
        strings.prime_features_4,
      ],
      description: strings.prime_description_2,
      pricing: {
        monthly: 5,
        yearly: 2.5,
      },
    },
    {
      item: 2,
      name: strings.premium + " " + strings.tier + " 2",
      features: [
        strings.premium_features_1,
        strings.premium_features_2,
        strings.premium_features_3,
      ],
      description: strings.premium_description_1,
      pricing: {
        monthly: 10,
        yearly: 5,
      },
    }
  ];
  const switchRef = useRef();
  const onChangeSwitch = (type) => {
    strings.getLanguage() === "ar"
      ? (switchRef.current.style.transform =
          type === "yearly" ? "translateX(0px)" : "translateX(97px)")
      : (switchRef.current.style.transform =
          type === "yearly" ? "translateX(97px)" : "translateX(0px)");
    setType(type);
  };
  useEffect(() => {
    if (!user) return;
    axios.get(`/billing/methods`).then((response) => {
      setMethods(response.data);
      console.log("METHODS", methods);
    });
  }, [user]);

  useEffect(() => {
    if (!router.query.upgrade) return;
    axios
      .get(`/billing/subscriptions/${router.query.upgrade}`)
      .then((res) => {
        setSub({
          ...res.data,
          period: res.data.period === 1 ? "monthly" : "yearly",
        });
        setType(res.data.period === 1 ? "monthly" : "yearly");
      })
      .catch((err) => {
        alert("bot not found");
      });
  }, [router.query.upgrade]);

  const switchTier = () => {
    axios
      .put("/billing/subscriptions", {
        period: type === "monthly" ? 1 : 2,
        autoRenew: sub.autoRenew === undefined ? true : sub.autoRenew,
        tier: sub.tier || 1,
        id: sub.id || sub.n,
      })
      .then(() => {
        setSub({ ...sub, period: type });
        Toast.fire({
          icon: "success",
          title: strings.success,
        });
      });
  };
  return (
    <div
      className={`component-container${
        !user && !loading ? " mt-95" : " mt-30"
      }`}
    >
      <Head>
        <title>{strings.Premium} - {strings.probot}</title>
      </Head>
      <div className="center mb-30">
        <h1 className="weight-700 pricing-title">{strings.premium_index_1}</h1>
        <p className="txt-grey pricing-description">
          {strings.premium_index_2}
        </p>
      </div>
      <div className="pricing-switcher-container center mb-25">
        <div className="fieldset">
          <input
            onClick={() => {
              onChangeSwitch("monthly");
            }}
            type="radio"
            name="duration-1"
            value="monthly"
            id="monthly-1"
          />
          <label htmlFor="monthly-1">{strings.monthly}</label>
          <input type="radio" name="duration-1" value="yearly" id="yearly-1" />
          <label
            onClick={() => {
              onChangeSwitch("yearly");
            }}
            htmlFor="yearly-1"
          >
            {strings.yearly}
          </label>
          <span
            className={`switch ${
              type === "yearly"
                ? rtl
                  ? "left"
                  : "right"
                : rtl
                ? "right"
                : "left"
            }`}
            ref={switchRef}
          ></span>
        </div>
      </div>
      <div className="pricing-container">
        {data.map((subscription, index) => {
          const { name, featured, features, pricing, description, item } =
            subscription;
          return (
            <div
              className={`pricing-card${
                featured === true ? " pricing-card-featured" : ""
              }`}
              key={index}
            >
              <div className="pricing-card-header">
                <span className="pricing-card-type capitalize-font">
                  {name}
                </span>
                <span className="pricing-card-price">
                  {pricing ? `$${pricing[type]}` : strings.contact_us}
                </span>
                {featured === true ? (
                  <span className="pricing-card-best">
                    {strings.prime_description_1}
                  </span>
                ) : pricing ? (
                  <small className="mb-15">/ {strings.monthly}</small>
                ) : (
                  ""
                )}
              </div>
              <div>
                <p>{description}</p>
              </div>
              <div className="pricing-card-features ml-25 mr-25">
                <ul>
                  {features.map((feature, index) => (
                    <li key={index}>
                      <i className="fas fa-check-circle"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pricing-card-footer">
                {pricing ? (
                  <a
                    className={`${
                      index === 0 && sub?.period === type && `disabled`
                    }`}
                    onClick={() =>
                      index === 0 && sub
                        ? sub.period === type
                          ? () => {}
                          : switchTier()
                        : user
                        ? setOpenModal({
                            sub_id: sub ? sub.id : undefined,
                            type: sub ? "upgrade" : "new",
                            name: sub
                              ? strings.formatString(strings.upgrade_to, name)
                              : name,
                            item,
                            period: type === "monthly" ? 1 : 2,
                            price: pricing[type],
                            guild: guild?.id || null,
                          })
                        : auth()
                    }
                  >
                    {index === 0 && sub
                      ? sub.period === type
                        ? strings.current_plan
                        : type === "monthly"
                        ? strings.billing_switch_monthly
                        : strings.billing_switch_yearly
                      : sub
                      ? strings.upgrade
                      : strings.subscribe}
                  </a>
                ) : (
                  <a href="mailto:hi@probot.io">{strings.contact_us}</a>
                )}
              </div>
            </div>
          );
        })}
        {openModal && (
          <Checkout open={openModal} setOpen={setOpenModal} sub={sub} />
        )}
      </div>
    </div>
  );
}
