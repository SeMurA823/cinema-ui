import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import $api from "../http/config";
import {Context} from "../index";
import LoadingComponent from "../components/LoadingComponent";

export default function LogoutPage() {
    const navigate = useNavigate();
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const {store} = useContext(Context);

    useEffect(() => {
        const asyncFoo = async () => {
            setLoaded(false);
            try {
                await store.logout();
            } catch (e) {
            } finally {
                setLoaded(true);
                navigate(-1);
            }
        }
        asyncFoo();
    }, [])

    return (
        <LoadingComponent/>
    )
}