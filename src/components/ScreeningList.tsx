import React, {useState} from "react";
import {FilmType} from "../models/response/FilmTypes";
import {Stack, TextField, Typography} from "@mui/material";
import AdapterMoment from '@mui/lab/AdapterMoment'
import ScreeningListItem from "./ScreeningListItem";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import moment, {Moment} from "moment";
import MomentUtils from "@mui/lab/AdapterMoment";

type Props = {
    film: FilmType
}

export default function ScreeningList(props: Props) {
    const [date, setDate] = useState<Moment | null>(moment(new Date()));
    return (
        <Stack paddingX={5} paddingY={3}>
            <Stack direction='row' alignItems='center' spacing={2}>
                <Typography variant='h4' fontWeight='bolder'>Кинопоказы</Typography>
                <LocalizationProvider dateAdapter={AdapterMoment} locale={'ru'}>
                    <DatePicker label='Дата'
                                mask={'__.__.____'}
                                onChange={(newDate) => {
                                    setDate(newDate)
                                }}
                                value={date}
                                renderInput={(props) => <TextField {...props}/>}/>
                </LocalizationProvider>
            </Stack>
            <ScreeningListItem filmId={props.film.id} date={(date)?date.toDate():new Date()}/>
        </Stack>
    )
}