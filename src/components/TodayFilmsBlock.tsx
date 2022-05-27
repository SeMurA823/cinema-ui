import React, {useEffect, useState} from "react";
import {IPage} from "../models/response/IPage";
import {FilmType} from "../models/response/FilmTypes";
import $api from "../http/config";
import {Button, Skeleton, Stack, Typography} from "@mui/material";
import '@fontsource/ubuntu';
import FilmCard from "./FilmCard";
import AdapterMoment from "@mui/lab/AdapterMoment";
import {DesktopDatePicker, LocalizationProvider} from "@mui/lab";
import moment, {Moment} from "moment";

export default function TodayFilmsBlock() {
    const [responseFilms, setResponseFilms] = useState<IPage<FilmType>>({number: -1, size: 10} as IPage<FilmType>);
    const [films, setFilms] = useState<Array<FilmType>>([]);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [date, setDate] = useState<Moment>(moment());

    useEffect(() => {
        const asyncFoo = async () => {
            await getTodayFilms([],
                {number: -1, size: 10} as IPage<FilmType>);
        }
        asyncFoo();
    }, [date])


    async function getTodayFilms(films: FilmType[], responseFilms: IPage<FilmType>) {
        try {
            const response = await $api.get<IPage<FilmType>>(`/screenings/films?`
                + `page=${responseFilms.number + 1}&size=${responseFilms.size}&sort=name,asc`
                + `&start=${encodeURIComponent(date.startOf('day').toISOString(false))}`
                + `&end=${encodeURIComponent(date.endOf('day').toISOString(false))}`);
            setResponseFilms(response.data);
            const filmsId = films.map(x => x.id);
            const newFilms = [...films, ...(response.data.content.filter(x => !filmsId.includes(x.id)))];
            setFilms(newFilms);
            // console.log(newFilms);
        } catch (e) {
            console.log(e);
        } finally {
            setLoaded(true);
        }
    }

    if (!loaded)
        return (
            <Stack spacing={2} alignItems={'center'}>
                <Stack direction={'row'} justifyContent={'center'} alignItems={'center'}>
                    <Skeleton variant={'rectangular'} width={350} height={350}/>
                </Stack>
            </Stack>
        )

    return (
        <Stack spacing={2} alignItems={'center'}>
            <Stack>

                <LocalizationProvider dateAdapter={AdapterMoment} locale={'ru'}>
                    <DesktopDatePicker mask={'__.__.____'}
                                       onChange={(newDate) => {
                                           setDate(moment(newDate));
                                       }}
                                       minDate={moment()}
                                       value={date}
                                       renderInput={({inputRef, inputProps, InputProps}) =>
                                           <Stack>
                                               <Typography textAlign={'center'} variant={'h3'} fontWeight={'bolder'}>
                                                   В кино
                                               </Typography>
                                               <Stack direction={'row'} alignItems={'center'}>
                                                   <Typography textAlign={'center'} variant={'h3'} fontWeight={'bolder'}
                                                               ref={inputRef}>
                                                       {date.format('LL')}
                                                   </Typography>
                                                   {InputProps?.endAdornment}
                                               </Stack>
                                           </Stack>}/>
                </LocalizationProvider>
            </Stack>
            <Stack direction={'row'} flexWrap={'wrap'} alignItems={'center'} justifyContent={'center'}>
                {films.map(film => (
                    <FilmCard film={film} key={film.id}/>
                ))}
            </Stack>
            {responseFilms.totalElements === 0 &&
                <Stack justifyContent={'center'} alignItems={'center'}>
                    <Typography variant={'h4'} fontWeight={'bolder'}>Пусто</Typography>
                </Stack>
            }
            {!responseFilms.last &&
                <Stack alignItems='center'>
                    <Button variant={'outlined'} onClick={() => getTodayFilms(films, responseFilms)}>Ещё</Button>
                </Stack>
            }
        </Stack>
    )
}