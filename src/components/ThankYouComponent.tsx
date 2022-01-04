import React from "react";
import {Button, Stack, Typography} from "@mui/material";

export default function ThankYouComponent() {
    return (
        <Stack justifyContent={'center'} alignItems={'center'}>
            <Typography variant='h4'>Спасибо за покупку</Typography>
            <Button href={'/profile?tickets'}>К билетам</Button>
        </Stack>
    )
}