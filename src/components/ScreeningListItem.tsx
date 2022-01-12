import React, {useEffect, useState} from "react";
import $api from "../http/config";
import {ScreeningType} from "../models/response/ScreeningTypes";
import {Navigate} from "react-router-dom";
import {NOT_FOUND_URL, ruMoment} from "../App";
import {Badge, Button, Skeleton, Stack, Typography} from "@mui/material";
import moment from "moment/moment";
import 'moment/locale/ru'
import {HallType} from "../models/response/HallTypes";

moment.locale("ru")

type Props = {
    filmId: number,
    date?: Date
}

export default function ScreeningListItem(props: Props) {
    const date = (props.date) ? props.date : new Date(new Date(Date.now()).toDateString())
    const [screenings, setScreenings] = useState<Map<number, Array<ScreeningType>>>(new Map());
    const [halls, setHalls] = useState<Array<HallType>>([]);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    useEffect(() => {
        async function asyncFoo() {
            setLoaded(false);
            setHalls([]);
            setScreenings(new Map());
            try {
                const response =
                    await $api.get<Array<ScreeningType>>(`/screenings?film=${props.filmId}&start=${ruMoment(date).startOf("day").toISOString()}&end=${ruMoment(date).endOf('day').toISOString()}`);
                const newItems = response.data;
                const localeMapScreenings = new Map();
                const localeHalls: HallType[] = [];
                newItems.forEach(item => {
                    let screeningsInHall = localeMapScreenings.get(item.hall.id);
                    if (!screeningsInHall) {
                        screeningsInHall = new Array<ScreeningType>();
                        localeMapScreenings.set(item.hall.id, screeningsInHall);
                        localeHalls.push(item.hall);
                    }
                    screeningsInHall.push(item);
                });
                setScreenings(localeMapScreenings);
                setHalls(localeHalls);
            } catch (e) {
                setError(true);
            } finally {
                setLoaded(true);
            }
        }

        asyncFoo();
    }, [props.date])

    if (loaded && error)
        return (<Navigate to={NOT_FOUND_URL}/>);

    if (!loaded)
        return (<Stack padding={3}>
            <Skeleton variant={'rectangular'} style={{width: '100%', height: 100, borderRadius: 10}}/>
        </Stack>)

    if (halls.length === 0)
        return (
            <Stack padding={3}>
                <Stack padding={2} bgcolor={'#555555'} style={{borderRadius: 10}} justifyContent={'center'}
                       alignItems={'center'}>
                    <Typography variant={'h4'} fontWeight={'bolder'}>Пусто</Typography>
                </Stack>
            </Stack>
        )

    return (
        <Stack padding={3} spacing={2}>
            {halls.map(hall => (
                <Stack padding={2} bgcolor={'#555555'} style={{borderRadius: 10}} key={hall.id}>
                    <Typography variant='h5' fontWeight='bolder'>{hall.name}: </Typography>
                    <Stack direction={"row"} padding={2} flexWrap={'wrap'}>
                        {screenings.get(hall.id)?.map(screening => (
                            <Badge badgeContent={(`${screening.price}₽`)} color={'primary'} style={{margin: 10}}
                                   key={screening.id}>
                                <Button variant={'outlined'} href={`/screenings/${screening.id}`}>{moment(new Date(screening.date)).format("LT")}</Button>
                            </Badge>
                        ))}
                    </Stack>
                </Stack>
            ))}
        </Stack>
    );
}