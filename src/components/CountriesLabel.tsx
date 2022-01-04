import React from "react";
import {CountryType} from "../models/response/CountryTypes";
import {Chip, Stack, Typography} from "@mui/material";

type Props = {
    countries: CountryType[]
}

export default function CountriesLabel(props: Props) {
    return (
        <Stack direction={'row'} alignItems={'center'}>
            <Typography fontWeight={'bolder'}>Страны: </Typography>
            {props.countries.map(country => (
                <Chip label={country.shortName} style={{margin: 10}} key={country.id}/>
            ))}
        </Stack>
    )
}