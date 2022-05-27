import React, {ReactNode, useContext, useEffect, useState} from "react";
import {Context} from "../index";
import {LOGIN_URL} from "../App";
import {Navigate} from "react-router-dom";
import LoadingComponent from "../components/LoadingComponent";

type Props = {
    children: ReactNode
}

function AuthPage(props: Props) {
    const {store} = useContext(Context);
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        setLoaded(false);

        async function asyncFoo() {
            await store.refresh();
            setLoaded(true);
        }

        asyncFoo();
    }, [])

    if (!loaded)
        return (
            <LoadingComponent/>
        )

    if (loaded && !store.isAuth) {
        return (<Navigate to={LOGIN_URL}/>)
    }
    return (<>
        {props.children}
    </>);
}

export default AuthPage;