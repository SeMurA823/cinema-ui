import React, {useContext, useEffect, useState} from "react";
import {FilmType} from "../models/response/FilmTypes";
import $api from "../http/config";
import {ScreeningType} from "../models/response/ScreeningTypes";
import {Context} from "../index";
import {Badge, Box, Drawer, Link, List, ListItem, ListSubheader, Typography} from "@mui/material";
import {Timelapse} from "@mui/icons-material";
import {ruMoment} from "../App";
import {LoadingButton} from "@mui/lab";

type Props = {
    film: FilmType
}

export default function ReservOnScreeningsComponent(props: Props) {
    const {store} = useContext(Context);

    const [screenings, setScreenings] = useState<Array<ScreeningType>>([]);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    useEffect(()=>{
        setLoaded(false);
        const asyncFoo = async () => {
            try {
                if (!store.isAuth)
                    await store.refresh();
                if (store.isAuth) {
                    const response = await $api.get<Array<ScreeningType>>(`/booking/mybooking/screenings?film=${props.film.id}`);
                    setScreenings(response.data);
                }
            } catch (e) {
                setError(true);
            } finally {
                setLoaded(true);
            }
        }
        asyncFoo();
    },[])

    const items = screenings.map(screening => (
        <ListItem key={screening.id}>
            <Link href={`/purchase?screening=${screening.id}`}>
                <Typography fontWeight={'bolder'}>
                    {ruMoment(new Date(screening.date)).format('LLL')}
                </Typography>
            </Link>
        </ListItem>
    ));

    const list = (
        <Box style={{maxWidth: 300}}>
            <List>
                <ListSubheader>
                    <Typography variant={"h5"} fontWeight={'bold'}>
                        Забронированные кинопоказы
                    </Typography>
                </ListSubheader>
                {items}
            </List>
            {items.length === 0 &&
                <Typography>
                    Пусто
                </Typography>
            }
        </Box>
    )

    if (!store.isAuth || screenings.length === 0)
        return <></>


    return (
        <div>
            <LoadingButton onClick={()=>setOpen(true)} loading={!loaded}>
                <Badge color={'warning'} badgeContent={screenings.length}>
                    <Timelapse/>
                </Badge>
            </LoadingButton>
            <Drawer
                anchor='left'
                open={open}
                onClose={()=>setOpen(false)}
            >
                {list}
            </Drawer>
        </div>
    )
}