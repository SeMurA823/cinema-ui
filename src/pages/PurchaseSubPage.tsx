import React from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import ReservationList from "../components/ReservationList";
import {Container, Stack} from "@mui/material";
import {ReservationType} from "../models/response/PurchasesTypes";
import {NOT_FOUND_URL} from "../App";

export default function PurchaseSubPage() {
    const navigate = useNavigate();
    const [params, setParams] = useSearchParams();

    const screening = params.get("screening");
    if (!screening || Number.isInteger(Number(screening)))
        navigate(NOT_FOUND_URL);
    let selected: ReservationType[] = [];

    return (
        <Container>
            <Stack padding={2} alignItems={'center'}>
                <ReservationList screeningId={Number(screening)} onChange={(reservations)=>{selected = reservations}}/>
            </Stack>
        </Container>
    )
}