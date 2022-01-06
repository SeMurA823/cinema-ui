import React from "react";
import {FilmType} from "../models/response/FilmTypes";
import AliceCarousel from "react-alice-carousel";
import 'react-alice-carousel/lib/alice-carousel.css';
import {Stack, Typography} from "@mui/material";
import PosterImage from "./PosterImage";
import moment from "moment";
import AgeLimitLabel from "./AgeLimitLabel";
import CountriesLabel from "./CountriesLabel";
import ReservOnScreeningsComponent from "./ReservOnScreeningsComponent";

type Props = {
    film: FilmType
}

export default function FilmPoster(props: Props) {

    const film = props.film;
    const posters = film.posters;



    if (posters.length === 0)
        return (
            <div/>
        )


    const items = posters.map(poster => (
        <PosterImage poster={poster}/>
    ));



    return (
        <Stack alignItems={'center'} justifyContent={'center'} sx={{flexDirection: {xs: 'column', md: 'row'}}}>
            <Stack style={{width: 300}}>
                <AliceCarousel items={items} animationDuration={2000} autoPlayInterval={30000} autoHeight autoWidth autoPlay disableButtonsControls infinite disableDotsControls/>
            </Stack>
            <Stack padding={2} style={{minHeight: '100%', maxWidth: '100%'}} spacing={1}>
                <Stack direction={'row'}>
                    <Typography variant={'h3'} fontWeight={'bolder'}>
                        {film.name}
                    </Typography>
                    <ReservOnScreeningsComponent film={film}/>
                </Stack>
                <AgeLimitLabel limit={film.ageLimit}/>
                <CountriesLabel countries={film.countries}/>
                <Typography>
                    <span style={{fontWeight: 'bolder'}}>Премьера в мире: </span>{moment(new Date(film.worldPremiere)).format('L')}
                </Typography>
                <Typography>
                    <span style={{fontWeight: 'bolder'}}>Премьера в России: </span>{moment(new Date(film.localPremiere)).format('L')}
                </Typography>
                <Typography>
                    <span style={{fontWeight: 'bolder'}}>Продолжительность: </span>{film.duration} мин
                </Typography>
                <Typography>
                    {film.plot}
                </Typography>

            </Stack>
        </Stack>
    )
}