import Loading from "@component/loader";
import { useEffect, useRef, useState } from "react";
import CheckoutComForm from "./method_checkout";
import Approved from "./status_approved";
import Declined from "./status_declined";

export default function CheckoutFullIframe({payText}){
    const [processing, processPayment] = useState(false);
    const [payment,paymentData] = useState(null);
    const checkoutForm = useRef(null);

    useEffect(() => {
        console.log("CHECKOUT OFOFOFOFF ", payment)
    },[payment]);

    const onPaymentMessage = (event) => {
        if (event.data?.type === "checkout_payment") {
            paymentData(event.data)
          console.log("got message checkout form", event.data, event);
        }
      };

    useEffect(() => {
        window.addEventListener("message", onPaymentMessage);
        return () => window.removeEventListener("message", onPaymentMessage);
      }, [onPaymentMessage]);

    if(payment?.redirect) return  <iframe
      src={payment.redirect}
      width="600px"
      height="400px"
      id="myId"
      className="dsframe"
      display="initial"
      position="relative"
      frameBorder="0"
    />
    if(payment) return payment.approved ? <Approved msg={"Payment method updated!"} /> : <Declined payment={payment}/>;
    if(processing) return    <div className="checkout-loading">
    <Loading />
  </div>
    
    return <>

    <CheckoutComForm processing={processing} processPayment={processPayment} paymentData={paymentData} checkoutForm={checkoutForm} data={{type: "verify"}} payText={payText} />
    </>
}