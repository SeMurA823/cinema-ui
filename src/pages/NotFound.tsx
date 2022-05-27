import {Button, Stack, Typography} from "@mui/material";
import React from "react";
import back from '../back404.gif'

export default class NotFound extends React.Component {
    render() {
        return (
            <div style={{position: 'relative'}}>
                <img src={back}
                     style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%', top: 0, left: 0}}
                     alt={''}/>
                <Stack justifyContent='center' alignItems='center'
                       style={{minHeight: '100vh', zIndex: 2, backgroundColor: 'rgba(0,0,0,0.55)', color: 'white'}}>
                    <Typography variant='h2' fontWeight='bolder'>404</Typography>
                    <Typography variant='h3' fontWeight='lighter'>Страница не найдена</Typography>
                    <div style={{height: 15}}/>
                    <Button variant='outlined' color={'inherit'} href={'/'}>На главную</Button>
                </Stack>
            </div>

        );
    }
}