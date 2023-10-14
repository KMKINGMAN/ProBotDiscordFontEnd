import { Context } from "@script/_context";
import { useRouter } from "next/router"
import { useContext, useEffect } from "react"

export default function LoginIntoGuild(){
    const router = useRouter();
    const {login} = useContext(Context);
    useEffect(() => {
        if(!login || !router.query.token) return;
        login(router.query.token);

        router.push(`/dashboard`);  
    },[login, router.query.token])
    return <>Redirecting ...</>
}