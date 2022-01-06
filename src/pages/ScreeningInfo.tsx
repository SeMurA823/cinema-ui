import React, {useEffect, useState} from "react";
import {Button, Container, Stack, Typography} from "@mui/material";
import ScreeningSeats from "../components/ScreeningSeats";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {NOT_FOUND_URL} from "../App";
import $api from "../http/config";
import {ScreeningType} from "../models/response/ScreeningTypes";
import LoadingComponent from "../components/LoadingComponent";
import {FilmType} from "../models/response/FilmTypes";
import moment from "moment";
import {SeatType} from "../models/response/HallTypes";


export default function ScreeningInfo() {
    const {id} = useParams();

    const navigate = useNavigate();

    const [film, setFilm] = useState<FilmType>({} as FilmType);
    const [screening, setScreening] = useState<ScreeningType>({} as ScreeningType);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    let selectedSeats: SeatType[] = [];

    const onClickBuyButton = () => {
        localStorage.setItem(String(screening.id), JSON.stringify(selectedSeats));
        localStorage.setItem("screening", String(screening.id));
        navigate(`/booking`);
    }

    useEffect(() => {
        async function asyncFoo() {
            try {
                const responseScreening = await $api.get<ScreeningType>(`/screenings/${id}`);
                setScreening(responseScreening.data);
                const responseFilm = await $api.get<FilmType>(`/screenings/${id}/film`);
                setFilm(responseFilm.data);
            } catch (e) {
                setError(true);
            } finally {
                setLoaded(true);
            }
        }

        if (id)
            asyncFoo();
    }, [])

    if (!id || Number.isNaN(Number(id)) || (loaded && error))
        return (<Navigate to={NOT_FOUND_URL}/>)

    if (!loaded)
        return (<LoadingComponent/>)

    const date = new Date(film.duration * 60 * 1000);
    const strDate = moment(new Date(date.getDate() - date.getTimezoneOffset())).format('LT')

    return (
        <Container>
            <Stack>
                <Typography variant='h4'>{film.name}</Typography>
                <Typography><span
                    style={{fontWeight: 'bolder'}}>Время: </span>{moment(new Date(screening.date)).format('LLLL')}
                </Typography>
                <Typography><span
                    style={{fontWeight: 'bolder'}}>Продолжительность: </span>
                    {strDate}
                    <span> ({film.duration} мин) </span>
                </Typography>
                <Typography fontWeight={'bolder'}>{screening.hall.name}</Typography>
            </Stack>
            <Stack alignItems={'center'} justifyContent={'center'} style={{overflow: 'auto'}} padding={2} sx={{alignItems: { xs: 'start', md: 'center'}}}>
                <ScreeningSeats screeningId={Number(id)} onChange={seats => selectedSeats = seats}/>
            </Stack>
            <Stack direction={'row'} justifyContent={'center'} spacing={2}>
                <Button color={'inherit'} variant={'outlined'} onClick={()=>navigate(-1)}>Отмена</Button>
                <Button variant={'contained'} onClick={()=>onClickBuyButton()}>Купить</Button>
            </Stack>
        </Container>
    )
}