import React, {useEffect, useState} from "react";
import {Checkbox, Container, FormControlLabel, Pagination, Stack, Typography} from "@mui/material";
import $api from "../http/config";
import {IPage} from "../models/response/IPage";
import {TicketType} from "../models/response/PurchasesTypes";
import TicketItem from "../components/TicketItem";
import LoadingComponent from "../components/LoadingComponent";
import {FilmType} from "../models/response/FilmTypes";

export default function TicketComponent() {
    let mounted = false;

    const [ticketPage, setTicketPage] = useState<IPage<TicketType>>({totalPages: 1, number: 0} as IPage<TicketType>);
    const [films, setFilms] = useState<Map<number, FilmType>>(new Map<number, FilmType>());

    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const [viewAll, setViewAll] = useState<boolean>(false);

    const getTickets = async (page: number, size: number, viewAll: boolean) => {
        try {
            mounted = true
            setLoaded(false);
            const response = await $api
                .get<IPage<TicketType>>(`/tickets/mytickets?page=${page - 1}&size=${size}&sort=filmScreening.date,asc${viewAll ? '&all' : ''}`);
            if (mounted)
                setTicketPage(response.data);

            const ids = response.data.content.map(ticket => ticket.filmScreening.id);
            const screeningIds = new Set<number>(ids);
            const filmMap = new Map<number, FilmType>();
            for (const id of Array.from(screeningIds)) {
                const filmResponse = await $api.get<FilmType>(`/screenings/${id}/film`);
                filmMap.set(id, filmResponse.data);
            }
            if (mounted)
                setFilms(filmMap);
        } catch (e) {
            if (mounted)
                setError(true);
        } finally {
            if (mounted)
                setLoaded(true);
        }
    }

    useEffect(() => {
        mounted = true;
        getTickets(1, 10, viewAll);
        return () => {
            mounted = false;
        }
    }, [viewAll])

    // if (!loaded)
    //     return (
    //         <LoadingComponent/>
    //     )

    return (
        <Container>
            <Stack alignItems={'center'}>
                <Stack alignItems={'center'}>
                    <Typography>
                        Возврат билета возможна не позднее трёх суток до кинопоказа
                    </Typography>
                    <FormControlLabel control={<Checkbox checked={viewAll} onChange={() => setViewAll(!viewAll)}/>}
                                      disabled={!loaded}
                                      label="Показывать отмененные"/>
                </Stack>
                {loaded &&
                    <>
                        <Stack spacing={2}>
                            {ticketPage.content.map(ticket => (<TicketItem key={ticket.id} ticket={ticket}
                                                                           film={films.get(ticket.filmScreening.id) as FilmType}/>))}
                        </Stack>
                        <Pagination count={ticketPage.totalPages} page={ticketPage.number + 1}
                                    onChange={(event, page) => getTickets(page, ticketPage.size, viewAll)}/>
                    </>
                }
                {!loaded &&
                    <div>
                        <div style={{minHeight: '100vh'}}>
                            <LoadingComponent/>
                        </div>
                        <Pagination count={ticketPage.totalPages} page={ticketPage.number + 1}/>
                    </div>

                }
            </Stack>
        </Container>
    );
}
