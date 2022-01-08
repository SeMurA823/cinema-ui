import React, {useEffect, useState} from "react";
import {Divider, Pagination, Stack, Typography} from "@mui/material";
import {IPage} from "../models/response/IPage";
import $api from "../http/config";
import LoadingComponent from "./LoadingComponent";
import {Notification} from "../models/response/IUser";
import {ruMoment} from "../App";

export const LogNotificationComponent = () => {
    const [notifications, setNotifications] =
        useState<IPage<Notification>>({content: [] as Notification[], number: 1, size: 30} as IPage<Notification>);

    const [loaded, setLoaded] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        editPage(0);
    }, [])

    const editPage = async (page: number) => {
        setLoaded(false);
        setError(false);
        try {
            const response = await $api.get<IPage<Notification>>(`/notifications?size=${notifications.size}&page=${page}`);
            setNotifications(response.data);
        } catch (e) {
            setError(true);
        } finally {
            setLoaded(true);
        }
    }

    if (!loaded)
        return (
            <LoadingComponent/>
        )


    return (
        <Stack alignItems={'center'} style={{cursor: 'default'}}>
            <Stack divider={<Divider/>} spacing={1}>
                { notifications.totalElements !== 0 &&
                    notifications.content.map(notification => (
                        <Stack key={notification.id}>
                            <Typography>{notification.message}</Typography>
                            <Typography fontWeight={'lighter'}
                                        color={'gray'}>{ruMoment(new Date(notification.created)).calendar()}</Typography>
                        </Stack>
                    ))
                }
            </Stack>
            {(!notifications.totalElements || notifications.totalElements === 0) &&
                <Stack padding={2}>
                    <Typography textAlign={'center'}>Пусто</Typography>
                </Stack>
            }
            <Pagination showLastButton={true} showFirstButton={true} count={notifications.totalPages}
                        page={notifications.number + 1} onChange={(event, page) => editPage(page - 1)}/>
        </Stack>
    )
}