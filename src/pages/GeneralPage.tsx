import Header from "../components/Header";
import {Outlet} from "react-router-dom";

export default function GeneralPage() {
    return (
        <>
            <Header position={'fixed'}/>
            <div style={{height: 100}}/>
            <main style={{minHeight: '100vh'}}>
                <Outlet/>
            </main>
        </>
    )
}