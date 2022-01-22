import {TicketType} from "../models/response/PurchasesTypes";
import {Link, Stack, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import $api from "../http/config";
import {FilmType} from "../models/response/FilmTypes";
import {ruMoment} from "../App";
import {useNavigate} from "react-router-dom";

type Props = {
    ticket: TicketType,
}

export default function TicketItem(props: Props) {

    let mounted = false;

    const navigate = useNavigate();

    const [film, setFilm] = useState<FilmType>({} as FilmType);

    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const getFilm = async () => {
        mounted = true;
        try {
            setLoaded(false);
            const filmResponse = await $api.get<FilmType>(`/screenings/${props.ticket.filmScreening.id}/film`);
            if (mounted)
                setFilm(filmResponse.data);
        } catch (e) {
            if (mounted)
                setError(true);
        } finally {
            if (mounted)
                setLoaded(true);
        }
    }

    useEffect(()=>{
        getFilm();
        return ()=>{mounted = false}
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
                <Typography fontWeight='bold' onClick={()=>navigate(`/films/${film.id}`)}>{film.name}</Typography>
                <Typography fontWeight='bolder'>{ruMoment(new Date(props.ticket.filmScreening.date)).format('LLLL')}</Typography>
                <Typography>
                    <span style={{color: 'skyblue', fontWeight: 'bolder'}}>
                        {props.ticket.filmScreening.hall.name}
                    </span>
                    <span> </span>
                    <span>
                        Ряд: {props.ticket.seat.row}
                    </span>
                    <span> </span>
                    <span>
                        Место: {props.ticket.seat.number}
                    </span>
                </Typography>
            </Stack>
        </Stack>
    )
}