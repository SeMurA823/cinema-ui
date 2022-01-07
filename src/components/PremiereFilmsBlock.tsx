import {useEffect, useState} from "react";
import {IPage} from "../models/response/IPage";
import {FilmType} from "../models/response/FilmTypes";
import $api from "../http/config";
import {Button, Skeleton, Stack, Typography} from "@mui/material";
import '@fontsource/ubuntu';
import FilmCard from "./FilmCard";

export default function PremiereFilmsBlock() {
    const [responseFilms, setResponseFilms] = useState<IPage<FilmType>>({number: -1, size: 10} as IPage<FilmType>);
    const [films, setFilms] = useState<Array<FilmType>>([]);
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        getTodayFilms();
    }, [])

    async function getTodayFilms() {
        try {
            let response = await $api.get<IPage<FilmType>>(`/films/premieres?page=${responseFilms.number + 1}&size=${responseFilms.size}&sort=name,asc`);
            setResponseFilms(response.data);
            const filmsId = films.map(x=>x.id);
            setFilms([...films, ...(response.data.content.filter(x=>!filmsId.includes(x.id)))]);
        } catch (e) {
            console.log(e);
        } finally {
            setLoaded(true);
        }
    }

    if (!loaded)
        return (
            <Stack spacing={2}>
                <Typography variant='h3' fontWeight='bolder'>Скоро</Typography>
                <Skeleton variant={'rectangular'} width={350} height={350}/>
            </Stack>
        )
    return (
        <Stack spacing={2}>
            <Typography variant='h3' fontWeight='bolder'>Скоро</Typography>
            <Stack direction={'row'} flexWrap={'wrap'} alignItems={'center'}>
                {films.map(film=>(
                    <FilmCard film={film} key={film.id}/>
                ))}
            </Stack>
            {responseFilms.numberOfElements === 0 &&
                <Stack justifyContent={'center'} alignItems={'center'}>
                    <Typography variant={'h4'} fontWeight={'bolder'}>Пусто</Typography>
                </Stack>
            }
            {!responseFilms.last &&
                <Stack alignItems='center'>
                    <Button variant={'outlined'}>Ещё</Button>
                </Stack>
            }
        </Stack>
    )
}