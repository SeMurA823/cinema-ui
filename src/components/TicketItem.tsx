import {TicketType} from "../models/response/PurchasesTypes";
import {Link, Stack, Typography} from "@mui/material";
import {ScreeningType} from "../models/response/ScreeningTypes";
import {useEffect, useState} from "react";
import $api from "../http/config";
import {FilmType} from "../models/response/FilmTypes";
import {ruMoment} from "../App";

type Props = {
    ticket: TicketType,
}

export default function TicketItem(props: Props) {

    const [film, setFilm] = useState<FilmType>({} as FilmType);

    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const getFilm = async () => {
        try {
            setLoaded(false);
            const filmResponse = await $api.get<FilmType>(`/screenings/${props.ticket.filmScreening.id}/film`);
            setFilm(filmResponse.data);
        } catch (e) {
            setError(true);
        } finally {
            setLoaded(true);
        }
    }

    useEffect(()=>{
        getFilm();
    }, [])

    return (
        <Stack>
            <Stack>
                <Typography variant='h4'>
                    <Link>
                        <span style={{fontWeight: 'bolder'}}>Билет: </span>
                        <span>{props.ticket.id}</span>
                    </Link>
                </Typography>
                <Typography fontWeight='bold'>{film.name}</Typography>
                <Typography fontWeight='bolder'>{ruMoment(new Date(props.ticket.filmScreening.date)).format('LLLL')}</Typography>
                <Typography>
                    Ряд: {props.ticket.seat.row} Место: {props.ticket.seat.number}
                </Typography>
            </Stack>
        </Stack>
    )
}