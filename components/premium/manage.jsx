import { useState, useRef, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Subscriptions from "./subscriptions";
import Billing from "./billing";
import strings from "../../scripts/locale";
import { Context } from "@script/_context";
import axios from "axios";
import Loading from "@component/loader";
import Alert from "@component/alert";

export default function Manage() {
  const router = useRouter();
  const { guild, user, Toast, rtl, getSubscriptions } = useContext(Context);
  const switchRef = useRef();
  const [type, setType] = useState("subscriptions");
  const [subscriptions, setSubscriptions] = useState([]);
  const { setMethods, methods } = useContext(Context);
  const [paymentHistory, setPaymentHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  const getInitialData = async () => {
    if (!user) return;

    try {
      router.asPath.split("#")[1] === "billing"
        ? setType("billing")
        : setType("subscriptions");

      const billingResponse = await Promise.all([
        axios.get(`/billing/methods`),
        axios.get(`/billing/history`),
        guild ? getSubscriptions() : axios.get("/billing/subscriptions"),
      ]);

      setMethods(billingResponse[0].data);
      setPaymentHistory(billingResponse[1].data);
      setSubscriptions(
        guild
          ? {
              users: billingResponse[2].users,
              data: [
                ...billingResponse[2].premium.map((sub) => ({
                  ...sub,
                  tier: 2,
                })),
                ...billingResponse[2].prime.map((sub) => ({
                  ...sub,
                  tier: 1,
                })),
              ],
            }
          : {
              data: billingResponse[2].data,
            }
      );
      setLoading(false);
    } catch (error) {
      console.error(error);

      Toast.fire({
        icon: "error",
        title: "something wrong",
      });
    }
  };

  useEffect(() => {
    getInitialData();
  }, [user]);

  const onMessage = (event) => {
    if (event.data === "updatepremiums1778") {
      axios.get("/billing/subscriptions").then((r) => setSubscriptions({data: r.data}));
    }
  };

  useEffect(() => {
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onMessage]);

  const onChangeSwitch = (type) => {
    setType(type);
  };

  if (loading) return <Loading />;
  return (
    <>
      <div className="pricing-switcher-container center mb-25">
        <div className="fieldset">
          <input
            onClick={() => {
              onChangeSwitch("subscriptions");
            }}
            type="radio"
            name="duration-1"
            value="subscriptions"
            id="subscriptions-1"
          />
          <label className="manage" htmlFor="subscriptions-1">
            {strings.subscriptions}
          </label>
          <input
            type="radio"
            name="duration-1"
            value="billing"
            id="billing-1"
          />
          <label
            onClick={() => {
              onChangeSwitch("billing");
            }}
            htmlFor="billing-1"
          >
            {strings.billing}
          </label>
          <span
            className={`switch ${
              type === "billing"
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
      <Alert
        open={true}
        type="info"
        children={strings.premium_invite_required}
        className="full-width mb-20"
      />
      {type === "subscriptions" ? (
        <Subscriptions
          paymentHistory={paymentHistory}
          subscriptions={subscriptions}
        />
      ) : (
        <Billing
          paymentHistory={paymentHistory}
          methods={methods}
          setMethods={setMethods}
        />
      )}
    </>
  );
}
