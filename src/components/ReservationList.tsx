import React, {useEffect, useState} from 'react';
import {ReservationType} from "../models/response/PurchasesTypes";
import {
    Alert,
    Button,
    Checkbox,
    Chip,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Skeleton,
    Stack,
    Typography
} from "@mui/material";
import {FilmType} from "../models/response/FilmTypes";
import {ruMoment} from "../App";
import $api from "../http/config";
import {ErrorType} from "../models/response/ErrorTypes";
import axios from "axios";
import CalculateComponent from "./CalculateComponent";
import {Timer} from "@mui/icons-material";
import ThankYouComponent from "./ThankYouComponent";


type ListProps = {
    screeningId: number,
    onChange: (reservations: ReservationType[]) => any
}

export default function ReservationList(props: ListProps) {
    const [reservations, setReservations] = useState<Array<ReservationType>>([]);
    const [selected, setSelected] = useState<Array<ReservationType>>([]);
    const [film, setFilm] = useState<FilmType>({} as FilmType);

    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<ErrorType | null>(null);
    const [bought, setBought] = useState<boolean>(false);

    useEffect(() => {
        async function asyncFoo() {
            try {
                const bookingResponse = await $api.get<Array<ReservationType>>(`/booking/mybooking?screening=${props.screeningId}`);
                setReservations(bookingResponse.data);
                const filmResponse = await $api.get<FilmType>(`/screenings/${props.screeningId}/film`);
                setFilm(filmResponse.data);
            } catch (e) {
                if (axios.isAxiosError(e)) {
                    setError({
                        message: 'При загрузке возникла ошибка'
                    });
                }
            } finally {
                setLoaded(true);
            }
        }

        asyncFoo();
    }, []);

    const handleToggle = (value: ReservationType) => {
        if (selected.includes(value)) {
            setSelected(selected.filter(x => x !== value));
            props.onChange(selected.filter(x => x !== value));
        } else {
            setSelected([...selected, value]);
            props.onChange([...selected, value]);
        }
    }

    const buyTicket = async () => {
        try {
            setLoaded(false);
            await $api.post(`/purchases/buy?id=${selected.map(x => x.id)}`, {});
            setBought(true);
        } catch (e) {

        } finally {
            setLoaded(true);
        }
    }

    if (!loaded)
        return (
            <Skeleton style={{width: '100%', height: '100%'}} variant={'rectangular'}/>
        )

    if (loaded && error)
        return <Alert variant="outlined" severity="error">{error.message}</Alert>;

    if (loaded && bought)
        return <ThankYouComponent/>

    return (
        <Stack spacing={2} alignItems={'center'}>
            <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} spacing={1}>
                <Typography variant={'h4'} fontWeight={'bold'} textAlign={'center'}>{film.name}</Typography>
                <Chip label={
                    <Stack direction={'row'} alignItems={'center'}><Timer/>{film.duration} мин</Stack>
                }/>
            </Stack>

            <List sx={{width: '100%', maxWidth: 400, bgcolor: 'background.paper'}}>
                <ListSubheader color={'primary'}>
                    <Typography fontWeight='bolder' textAlign={'center'}>Забронированные места</Typography>
                </ListSubheader>
                {reservations.map((value) => {
                    return (
                        <ListItem
                            key={value.id}
                            disablePadding
                        >
                            <ListItemButton role={undefined} onClick={() => handleToggle(value)} dense>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={selected.includes(value)}
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography><span style={{fontWeight: "bold"}}>Ряд: </span>{value.seat.row}
                                        <span style={{fontWeight: "bold"}}> Место: </span>{value.seat.number}{'\n'}
                                        <span
                                            style={{fontWeight: "bold"}}>Цена: </span>{value.filmScreening.price} ₽{'\n'}
                                        <span style={{fontWeight: "bold"}}>{value.filmScreening.hall.name}</span>{'\n'}
                                        <span
                                            style={{fontWeight: "bold"}}>Время: </span>{ruMoment(new Date(value.filmScreening.date)).format('LLL')}{'\n'}
                                        <span
                                            style={{fontWeight: "bold"}}>Действует до: </span>{'\n' + ruMoment(new Date(value.expiryDate)).format('LLL')}
                                    </Typography>}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <Typography variant='h6'>{film.ageLimit.description}</Typography>
            {selected.length > 0 &&
                <>
                    <CalculateComponent selected={selected} onSubmit={() => {
                    }}/>
                    <Stack direction={'row'} justifyContent={'center'}>
                        <Button onClick={() => buyTicket()}>Купить</Button>
                    </Stack>
                </>
            }

        </Stack>
    );
}