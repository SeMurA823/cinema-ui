import * as React from "react";
import {Container} from "@mui/material";
import TodayFilmsBlock from "../components/TodayFilmsBlock";
import PremiereFilmsBlock from "../components/PremiereFilmsBlock";

export default function HomeSubPage() {
    return (
        <Container style={{minHeight: '100vh'}}>
            <div id={'today'}>
                <TodayFilmsBlock/>
            </div>
            <div id={'premieres'}>
                <PremiereFilmsBlock/>
            </div>
        </Container>
    )
}