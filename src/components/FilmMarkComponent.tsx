import React, {useContext, useEffect, useState} from "react";
import {FilmType, MarkType} from "../models/response/FilmTypes";
import {Button, Chip, Stack, Typography} from "@mui/material";
import {Done} from "@mui/icons-material";
import {Context} from "../index";
import $api from "../http/config";
import {FilmUserMarkComponent} from "./FilmUserMarkComponent";
import moment from "moment";


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

    let mounted = false;

    const [rating, setRating] = useState<number>(0.);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [userMark, setUserMark] = useState<number | null>(null);

    const [loaded, setLoaded] = useState<boolean>(false);

    const getRating = async () => {
        mounted = true;
        setLoaded(false);
        try {
            if (moment(new Date(props.film.localPremiere)).isBefore(moment())) {
                let response = await $api.get<number>(`/rating?film=${props.film.id}`);
                if (mounted)
                    setRating(response.data)
            } else {
                if (mounted)
                    setRating(0.)
            }

        } finally {
            if (mounted)
                setLoaded(true);
        }
    };

    useEffect(() => {
        getRating();
        return () => {
            mounted = false;
        }
    }, [openDialog])

    const getUserMark = async () => {
        setLoaded(false);
        try {
            if (moment(new Date(props.film.localPremiere)).isBefore(moment())) {
                let axiosResponse = await $api.get<MarkType>(`/rating/mark?film=${props.film.id}`);
                if (mounted)
                    setUserMark(axiosResponse.data.mark);
            } else {
                if (mounted)
                    setUserMark(null);
            }
        } catch (e) {
            setUserMark(null);
        } finally {
            if (mounted)
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

    const label = (<Typography fontWeight={'bold'}>{loaded ? rating.toFixed(2) : '∞'}</Typography>)

    return (
        <Stack direction={'column'} spacing={2} alignItems={'start'}>
            <Button color={getColor(rating)} size={'large'} variant={'contained'} style={{borderRadius: 20}}
                    disabled={!loaded}
                    onClick={(store.isAuth && moment(new Date(props.film.localPremiere)).isBefore(moment())) ? (() => setOpenDialog(true)) : (() => {
                    })}>
                {rating > 0 &&
                    <Stack direction={'row'} spacing={2} alignItems={'center'}>
                        {label}
                        <Chip label={userMark} icon={<Done/>}
                              style={{display: (userMark && userMark > 0) ? 'flex' : "none"}}/>
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