import {
    AppBar,
    Avatar,
    Box,
    Button, Container,
    IconButton,
    Link,
    Menu,
    MenuItem,
    Stack,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";

import * as React from "react";
import {useContext, useEffect} from "react";
import {Context} from "../index";
import {LOGIN_URL, LOGOUT_URL} from "../App";
import {observer} from "mobx-react-lite";
import {
    CameraIndoor,
    MenuBookOutlined,
    MenuOpenOutlined,
    MenuOutlined,
    Movie,
    VideoFileOutlined
} from "@mui/icons-material";

type TextLink = {
    value: string,
    link: string
}

const pages: Array<TextLink> = [
    {
        value: 'Премьеры',
        link: '/home#premieres'
    },
    {
        value: 'Кинопоказы',
        link: '/home#today'
    }
];

const settings: TextLink[] = [
    {
        value: 'Профиль',
        link: '/profile'
    },
    {
        value: 'Билеты',
        link: '/profile?tickets'
    }
];


type Props = {
    color?: "secondary" | "default" | "inherit" | "transparent" | "primary",
    position?: "fixed" | "absolute" | "sticky" | "static" | "relative"
};


function Header(props: Props) {
    const {store} = useContext(Context);

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (link: string) => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = (link: string) => {
        setAnchorElUser(null);
    };

    useEffect(() => {
        const asyncFoo = async () => {
            await store.refresh();
        }
        asyncFoo();
    }, [])


    return (
        <>
            <AppBar position={(props.position) ? props.position : 'static'}
                    color={(props.color) ? props.color : 'default'}>
                <Container>
                    <Toolbar disableGutters style={{justifyContent: 'space-around'}}>
                        <Button variant='text' href='/'>
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                            >
                                КИНOFF
                            </Typography>
                        </Button>

                        <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                            <Button
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuOutlined/>
                            </Button>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: {xs: 'block', md: 'none'},
                                }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page.value} onClick={()=>handleCloseNavMenu(page.link)}>
                                        <Link href={page.link} underline={'none'}>
                                            <Typography textAlign="center">{page.value}</Typography>
                                        </Link>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        {/*<Typography*/}
                        {/*    variant="h6"*/}
                        {/*    noWrap*/}
                        {/*    component="div"*/}
                        {/*    sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}*/}
                        {/*>*/}
                        {/*    КИНOFF*/}
                        {/*</Typography>*/}
                        <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                            {pages.map((page) => (
                                <Button
                                    key={page.value}
                                    href={page.link}
                                    onClick={()=>handleCloseNavMenu(page.link)}
                                    sx={{my: 2, color: 'white', display: 'block'}}
                                >
                                    {page.value}
                                </Button>
                            ))}
                        </Box>
                        {(!store.isAuth && store.loaded) &&
                            <Box sx={{flexGrow: 0}}>
                                <Button color={'inherit'} href={LOGIN_URL}>Войти</Button>
                            </Box>
                        }

                        {(store.isAuth && store.loaded) &&
                            <Box sx={{flexGrow: 0}}>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                        <Avatar>{store.user.lastName.charAt(0)}{store.user.firstName.charAt(0)}</Avatar>
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
                                    onClose={handleCloseUserMenu}
                                >
                                    {settings.map((setting) => (
                                        <MenuItem key={setting.value} onClick={()=>handleCloseNavMenu(setting.link)}>
                                            <Link href={setting.link} underline={'none'} style={{display: 'block', width: '100%'}}>{setting.value}</Link>
                                        </MenuItem>
                                    ))}
                                    <MenuItem divider/>
                                    <MenuItem onClick={()=>handleCloseNavMenu(LOGOUT_URL)}>
                                        <Link href={LOGOUT_URL} underline={'none'} style={{display: 'block', width: '100%'}}>Выйти</Link>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        }
                    </Toolbar>
                </Container>
            </AppBar>
            <div style={{height: 90}}/>
        </>
    );
}

export default observer(Header);