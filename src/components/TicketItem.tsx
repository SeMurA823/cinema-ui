import {TicketType} from "../models/response/PurchasesTypes";
import {Button, Link, Stack, Typography} from "@mui/material";
import {useState} from "react";
import $api from "../http/config";
import {FilmType} from "../models/response/FilmTypes";
import {ruMoment} from "../App";
import {useNavigate} from "react-router-dom";
import moment from "moment";

type Props = {
    ticket: TicketType,
    film: FilmType
}

export default function TicketItem(props: Props) {

    let mounted = false;

    const navigate = useNavigate();

    const [loaded, setLoaded] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [canceled, setCanceled] = useState<boolean>(!props.ticket.active);


    const returnTicket = async () => {
        setLoaded(false);
        try {
            const response = await $api.post(`/tickets/${props.ticket.id}/cancel`, {});
            setCanceled(true);
        } finally {
            setLoaded(true);
        }
    }


    const screeningMoment = moment(new Date(props.ticket.filmScreening.date));
    return (
        <Stack>
            <Stack padding={2} margin={1} bgcolor={canceled?'darkred':'dimgray'} borderRadius={2}>
                <Typography variant='h4'>
                    <span style={{fontWeight: 'bolder'}}>Билет: </span>
                    <span>{props.ticket.id}</span>
                </Typography>
                <Typography fontWeight='bold' style={{cursor: 'pointer'}}>
                    <Link href={`/films/${props.film.id}`}>
                        {props.film.name}
                    </Link>
                </Typography>
                <Typography
                    fontWeight='bolder'>{ruMoment(new Date(props.ticket.filmScreening.date)).format('LLLL')}</Typography>
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
                <Typography>
                    <span style={{fontWeight: 'bold'}}>Стоимость:</span> {props.ticket.price} ₽
                </Typography>
                {(!canceled && moment().add(3, 'day').isBefore(screeningMoment)) &&
                    <Button color={'inherit'} variant={'outlined'} onClick={() => returnTicket()} disabled={!loaded}>
                        Вернуть
                    </Button>
                }
                {canceled &&
                    <Button color={'inherit'} variant={'outlined'} disabled={true}>
                        Отменен
                    </Button>
                }
            </Stack>
        </Stack>
    )
}