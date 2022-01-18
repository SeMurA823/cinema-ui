import React, {useEffect, useState} from "react";
import {Container, Pagination, Stack} from "@mui/material";
import $api from "../http/config";
import {IPage} from "../models/response/IPage";
import {TicketType} from "../models/response/PurchasesTypes";
import TicketItem from "../components/TicketItem";
import LoadingComponent from "../components/LoadingComponent";

export default function TicketComponent() {

    const [ticketPage, setTicketPage] = useState<IPage<TicketType>>({} as IPage<TicketType>);

    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const getTickets = async (page: number, size: number) => {
        try {
            setLoaded(false);
            const response = await $api
                .get<IPage<TicketType>>(`/tickets/mytickets?page=${page - 1}&size=${size}&sort=filmScreening.date,asc`);
            setTicketPage(response.data);
        } catch (e) {
            setError(true);
        } finally {
            setLoaded(true);
        }
    }

    useEffect(() => {
        getTickets(1, 10);
    }, [])

    if (!loaded)
        return (
            <LoadingComponent/>
        )

    return (
        <Container>
            <Stack alignItems={'center'}>
                <Stack spacing={2}>
                    {ticketPage.content.map(ticket=>(<TicketItem key={ticket.id} ticket={ticket}/>))}
                </Stack>
                <Pagination count={ticketPage.totalPages} page={ticketPage.number + 1} onChange={(event, page) => getTickets(page, ticketPage.size)}/>
            </Stack>
        </Container>
    );
}
