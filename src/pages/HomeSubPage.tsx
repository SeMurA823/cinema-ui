import * as React from "react";
import {Container, Stack} from "@mui/material";
import TodayFilmsBlock from "../components/TodayFilmsBlock";
import PremiereFilmsBlock from "../components/PremiereFilmsBlock";

export default function HomeSubPage() {
    return (
        <Container style={{minHeight: '100vh'}}>
            <Stack spacing={2}>
                <div id={'today'}>
                    <TodayFilmsBlock/>
                </div>
                <div id={'premieres'}>
                    <PremiereFilmsBlock/>
                </div>
            </Stack>
        </Container>
    )
}