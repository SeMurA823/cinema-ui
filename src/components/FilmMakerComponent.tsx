import React, {useEffect, useState} from "react";
import {Chip, Stack, Typography} from "@mui/material";
import {FilmType} from "../models/response/FilmTypes";
import $api from "../http/config";
import {FilmMakerPostType, FilmMakerType} from "../models/response/FilmMakerType";

type Props = {
    film: FilmType
}

type Dictionary = { [key: string]: FilmMakerType[] };

const getFullName = (maker: FilmMakerType) => {
    return `${maker.firstName} ${maker.patronymic} ${maker.lastName}`;
}

export const FilmMakerComponent = (props: Props) => {
    const [makers, setMakers] = useState<Dictionary>({} as Dictionary);
    useEffect(() => {
        const asyncFoo = async () => {
            const response = await $api.get<Dictionary>(`/filmmakers?film=${props.film.id}`);
            setMakers(response.data);
        }
        asyncFoo();
    }, [])
    return (
        <Stack padding={2} spacing={2}>
            <Typography variant={'h5'} fontWeight={'bolder'}>Съёмочная группа</Typography>
            <Stack spacing={1}>
                {
                    Object.keys(makers).map(post => (
                        <Stack key={post}>
                            <Typography fontWeight={'bold'}>{post}</Typography>
                            <Stack direction={'row'} alignItems={'center'} flexWrap={'wrap'} paddingX={1}>
                                {makers[post].map(maker => (
                                    <Chip key={maker.id} label={getFullName(maker)} variant={'filled'}
                                          style={{margin: '5px'}}/>
                                ))}
                            </Stack>
                        </Stack>
                    ))
                }
            </Stack>
        </Stack>
    )
}