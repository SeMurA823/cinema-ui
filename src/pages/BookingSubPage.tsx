import React, {useEffect, useState} from "react";
import {SeatType} from "../models/response/HallTypes";
import {useNavigate, useSearchParams} from "react-router-dom";
import $api from "../http/config";
import {ReservationType} from "../models/response/PurchasesTypes";
import {CircularProgress, Container, Stack, Typography} from "@mui/material";

type RequestBody = {
    seat: {
        number: number,
        row: number
    },
    screeningId: number
}

export default function BookingSubPage() {

    const screening = localStorage.getItem("screening");

    const [loaded, setLoaded] = useState<boolean>(false);
    const navigate = useNavigate();
    const [error, setError] = useState<boolean>(false)

    const convert = (seat: SeatType, screeningId: number): RequestBody => {
        return {
            seat: {
                number: seat.number,
                row: seat.row
            },
            screeningId: screeningId
        };
    }

    useEffect(() => {
        setLoaded(false);
        if (screening && Number.isInteger(Number(screening))) {
            const jsonSeats = localStorage.getItem(screening);
            localStorage.removeItem(String(screening));
            localStorage.removeItem('screening');
            if (jsonSeats) {
                const seats = JSON.parse(jsonSeats) as SeatType[];
                const asyncFoo = async () => {
                    try {
                        await $api.post<Array<ReservationType>>(`/booking/create`,
                            JSON.stringify(seats.map<RequestBody>(s => convert(s, Number(screening)))));
                        navigate(`/purchase?screening=${screening}`)
                    } catch (e) {
                        navigate(-1);
                    } finally {
                        setLoaded(true);
                    }
                };
                asyncFoo()
                return () => {};
            }
        }
        setLoaded(true);
    }, [])

    if (loaded)
        navigate(-1);

    return (
        <Stack justifyContent='center' alignItems='center'>
            <Typography variant='h3' fontWeight='lighter'>Бронирование <CircularProgress color='inherit'/></Typography>
        </Stack>
    )
}