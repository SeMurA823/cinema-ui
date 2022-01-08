import React, {useEffect, useState} from "react";
import $api from "../http/config";
import {Badge, IconButton, Link, Menu, MenuItem, Tooltip, Typography} from "@mui/material";
import {NotificationsOutlined} from "@mui/icons-material";
import {Notification} from "../models/response/IUser";
import {LOGOUT_URL} from "../App";

export const NotificationsInHeaderComponent = () => {

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = async (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = async () => {
        setAnchorElUser(null);
        await $api.post(`/notifications/viewed`, JSON.stringify(notifications
            .map((value, index, array) => value.id)))
        setNotifications([]);
    };

    const [error, setError] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        const asyncFoo = async () => {
            setLoaded(false);
            setError(false);
            try {
                const response = await $api.get<Notification[]>(`/notifications?new`);
                setNotifications(response.data);
            } catch (e) {
                setError(true);
            } finally {
                setLoaded(true);
            }
            setTimeout(asyncFoo, 2000);
        };
        asyncFoo();
    }, [])

    return (
        <>
            <Tooltip title="Open notifications">
                <IconButton sx={{p: 1}} onClick={handleOpenNavMenu}>
                    <Badge badgeContent={notifications.length} color={'primary'}>
                        <NotificationsOutlined/>
                    </Badge>
                </IconButton>
            </Tooltip>
            <Menu
                sx={{mt: '45px'}}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseNavMenu}
            >
                <MenuItem disabled>
                    <Typography textAlign={'center'} color={'palette.primary.main'} fontWeight={'bold'}
                                width={'100%'}>Уведомления</Typography>
                </MenuItem>
                {notifications.length !== 0 &&
                    notifications.map(notification => (
                        <MenuItem key={notification.id} onClick={() => handleCloseNavMenu()}>
                            <Typography>
                                {notification.message}
                            </Typography>
                        </MenuItem>
                    ))
                }
                {notifications.length === 0 &&
                    <MenuItem disabled>
                        <Typography textAlign={'center'} color={'palette.primary.main'} fontWeight={'bold'}
                                    width={'100%'}>Пусто</Typography>
                    </MenuItem>
                }
                <MenuItem>
                    <Link textAlign={'center'} width={'100%'} href={'/notifications'} underline={'none'}
                          style={{display: 'block', width: '100%'}}>Все уведомления</Link>
                </MenuItem>
            </Menu>
        </>
    )
}