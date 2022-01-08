import React from "react";
import AuthPage from "./AuthPage";
import {Stack, Typography} from "@mui/material";
import {LogNotificationComponent} from "../components/LogNotificationComponent";

export const NotificationSubPage = () => {
    return (
        <AuthPage>
            <Stack spacing={2}>
                <Typography textAlign={'center'} variant={'h5'} fontWeight={'bolder'}>Журнал событий</Typography>
                <LogNotificationComponent/>
            </Stack>
        </AuthPage>
    )
}