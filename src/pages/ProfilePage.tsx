import React, {useState} from "react";
import ProfileComponent from "../components/ProfileComponent";
import TicketComponent from "./TicketComponent";
import {Container, Stack, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {useSearchParams} from "react-router-dom";

const labels = ['Профиль', 'Билеты'];
const paramLabels = ['profile', 'tickets'];

const components = [(<ProfileComponent/>), (<TicketComponent/>)]

export default function ProfilePage() {
    let [searchParams, setSearchParams] = useSearchParams();

    const getIndexByParams = () => {
        const searchedParams = paramLabels.filter(x => searchParams.has(x));
        if (searchedParams.length > 0)
            return paramLabels.indexOf(searchedParams[0]);
        return 0;
    }


    const [index, setIndex] = useState<number>(getIndexByParams());

    return (
        <Container>
            <Stack direction={'row'} justifyContent={'center'} margin={3}>
                <ToggleButtonGroup
                    value={index}
                    exclusive
                    onChange={(event, value) => setIndex(value)}
                >
                    {labels.map((v, i, array) => (
                        <ToggleButton value={i} key={i}>{v}</ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Stack>
            <Stack>
                {components[index]}
            </Stack>
        </Container>
    )
}
