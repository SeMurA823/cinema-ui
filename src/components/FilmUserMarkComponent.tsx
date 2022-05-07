import React, {useContext, useState} from "react";
import {FilmType, MarkType} from "../models/response/FilmTypes";
import {Context} from "../index";
import {Button, Chip, Dialog, DialogContent, DialogTitle, Rating, Stack, Typography} from "@mui/material";
import {Star, StarBorder} from "@mui/icons-material";
import $api from "../http/config";

type Props = {
    film: FilmType,
    open: boolean,
    onClose: () => void,
    defaultValue: number
};


export const FilmUserMarkComponent = (props: Props) => {

    const [userMark, setUserMark] = useState<number>(props.defaultValue);
    const [loaded, setLoadedMark] = useState<boolean>(true);
    const [errorMark, setErrorMark] = useState<boolean>(false);

    const uploadMark = async () => {
        setLoadedMark(false);
        setErrorMark(false);
        try {
            let response = await $api.post<MarkType>(`/rating/mark?film=${props.film.id}`, userMark);
            setUserMark(response.data.mark);
            props.onClose();
        } catch (e) {
            setErrorMark(true);
        } finally {
            setLoadedMark(true);
        }
    }

    const deleteMark = async () => {
        setLoadedMark(false);
        setErrorMark(false);
        try {
            await $api.delete(`/rating/mark?film=${props.film.id}`);
            setUserMark(0);
            props.onClose();
        } catch (e) {
            setErrorMark(true);
        } finally {
            setLoadedMark(true);
        }
    }

    let {store} = useContext(Context);

    if (!store.isAuth) return <></>

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>
                <Typography fontWeight={'bold'}>
                    Оценка фильма
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Stack alignItems={'center'} spacing={2}>
                    <Stack direction={'row'} spacing={1} alignItems={'center'} justifyContent={'center'}>
                        <Rating
                            max={10}
                            icon={<Star color={'primary'} fontSize={'large'}/>}
                            emptyIcon={<StarBorder color={'primary'} fontSize={'large'}/>}
                            value={userMark}
                            onChange={(event, value) => setUserMark(value ? value : 0)}
                        />
                        <Chip color={'primary'} label={
                            (<Typography fontWeight={'bold'} fontSize={'larger'}>
                                {userMark}
                            </Typography>)}/>
                    </Stack>
                    {userMark > 0 &&
                        <Button color={errorMark ? 'error' : 'primary'} variant={'outlined'} disabled={!loaded}
                                onClick={() => uploadMark()}>
                            OK
                        </Button>
                    }
                    {userMark === 0 &&
                        <Button color={'inherit'} variant={'outlined'} disabled={!loaded}
                                onClick={() => deleteMark()}>
                            Удалить
                        </Button>
                    }
                </Stack>
            </DialogContent>
        </Dialog>
    )
}