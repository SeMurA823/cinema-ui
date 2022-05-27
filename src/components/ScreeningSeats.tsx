import React, {useEffect, useState} from "react";
import $api from "../http/config";
import {ScreeningSeatType} from "../models/response/ScreeningTypes";
import {Button, Skeleton, Stack, ToggleButton, Typography} from "@mui/material";
import {SeatType} from "../models/response/HallTypes";

type Props = {
    screeningId: number
    onChange: (seats: Array<SeatType>) => any
}

export default function ScreeningSeats(props: Props) {

    const [seats, setSeats] = useState<Map<number, Array<ScreeningSeatType>>>(new Map());
    const [rows, setRows] = useState<Array<number>>([]);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [selectedSeats, setSelectedSeats] = useState<Array<ScreeningSeatType>>([]);

    function onSelectSeat(seat: ScreeningSeatType) {
        if (selectedSeats.includes(seat)) {
            const newSelectedSeats = selectedSeats.filter(selectedSeat => selectedSeat !== seat);
            setSelectedSeats([...newSelectedSeats]);
            props.onChange([...newSelectedSeats]);
        } else {
            setSelectedSeats([...selectedSeats, seat]);
            props.onChange([...selectedSeats, seat]);
        }
    }

    useEffect(() => {
        async function asyncFoo() {
            try {
                const response = await $api.get<Array<ScreeningSeatType>>(`/screenings/${props.screeningId}/seats`);
                const items = response.data;
                items.forEach(item => {
                    let seatsInRow = seats.get(item.row);
                    if (!seatsInRow) {
                        seatsInRow = new Array<ScreeningSeatType>();
                        seats.set(item.row, seatsInRow);
                        rows.push(item.row);
                    }
                    seatsInRow.push(item);
                })
                setSeats(seats);
                setRows(rows);
            } catch (e) {
                setError(true);
            } finally {
                setLoaded(true);
            }
        }

        asyncFoo();
    }, [])

    if (!loaded)
        return (
            <Skeleton style={{width: '100%', height: '100%'}} variant={'rectangular'}/>
        )

    return (
        <Stack style={{width: 'max-content'}}>
            <Stack alignItems={'center'}>
                <Button color={'inherit'} variant={'outlined'}
                        style={{width: '100%', height: 50, backgroundColor: 'rgba(255,255,255,0.09)'}}>
                    ЭКРАН
                </Button>
                <div style={{height: 50}}/>
            </Stack>
            {rows.map(row => (
                <Stack direction={'row'} justifyContent={'center'} key={row}>
                    {seats.get(row)?.map(seat => (
                        <ToggleButton selected={selectedSeats.includes(seat)} onClick={() => onSelectSeat(seat)}
                                      disabled={seat.status !== 'FREE'}
                                      style={{margin: 5, width: 40}} key={seat.id} value={seat.id}>
                            {seat.number}
                        </ToggleButton>
                    ))}
                </Stack>
            ))}
        </Stack>
    )
}