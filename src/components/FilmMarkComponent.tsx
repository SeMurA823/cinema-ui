import React, {useContext, useEffect, useState} from "react";
import {FilmType, MarkType} from "../models/response/FilmTypes";
import {Button, Chip, Stack, Typography} from "@mui/material";
import {Done} from "@mui/icons-material";
import {Context} from "../index";
import $api from "../http/config";
import {FilmUserMarkComponent} from "./FilmUserMarkComponent";


type Props = {
    film: FilmType
}

const getColor = (rating: number) => {
    if (rating >= 7)
        return 'success';
    if (rating >= 4)
        return 'warning'
    if (rating > 0)
        return 'error'
    return 'primary'
}

export const FilmMarkComponent = (props: Props) => {

    let {store} = useContext(Context);

    const [rating, setRating] = useState<number>(0.);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [userMark, setUserMark] = useState<number | null>(null);

    const [loaded, setLoaded] = useState<boolean>(false);

    const getRating = async () => {
        setLoaded(false);
        try {
            let response = await $api.get<number>(`/rating?film=${props.film.id}`);
            setRating(response.data);
        } finally {
            setLoaded(true);
        }
    };

    useEffect(() => {
        getRating();
    }, [openDialog])

    const getUserMark = async () => {
        setLoaded(false);
        try {
            let axiosResponse = await $api.get<MarkType>(`/rating/mark?film=${props.film.id}`);
            setUserMark(axiosResponse.data.mark);
        } catch (e) {
            setUserMark(null);
        } finally {
            setLoaded(true);
        }
    };

    useEffect(() => {
        if (store.isAuth)
            getUserMark();
    }, [openDialog])

    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    const label = (<Typography fontWeight={'bold'}>{loaded ? rating.toFixed(1) : '∞'}</Typography>)

    return (
        <Stack direction={'column'} spacing={2} alignItems={'start'}>
            <Button color={getColor(rating)} size={'large'} variant={'contained'} style={{borderRadius: 20}}
                    disabled={!loaded} onClick={store.isAuth?(() => setOpenDialog(true)):(()=>{})}>
                {rating > 0 &&
                    <Stack direction={'row'} spacing={2} alignItems={'center'}>
                        {label}
                        {userMark &&
                            <Chip label={userMark} icon={<Done/>}/>
                        }
                    </Stack>
                }
                {rating === 0 &&
                    (<Typography fontWeight={'bold'}>-</Typography>)
                }
            </Button>
            <FilmUserMarkComponent defaultValue={userMark ? userMark : 0} film={props.film} open={openDialog}
                                   onClose={handleCloseDialog}/>
        </Stack>

    )
}