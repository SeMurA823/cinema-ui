import React, {useContext, useEffect, useState} from "react";
import {Alert, Button, ButtonGroup, CircularProgress, Link, Stack, TextField, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {Context} from "../index";
import axios, {AxiosError} from "axios";
import {ErrorType} from "../models/response/ErrorTypes";
import {observer} from "mobx-react-lite";

function LoginPage() {
    const navigate = useNavigate();

    const {store} = useContext(Context);

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);

    const [loaded, setLoaded] = useState<boolean>(true);
    const [error, setError] = useState<ErrorType | null>(null)


    useEffect(()=>{
        if (!store.isAuth)
            store.refresh();
    },[])

    const onLogin = async () => {
        setError(null);
        setLoaded(false);
        try {
            await store.login(username, password, rememberMe);
            navigate(-1);
        } catch (e) {
            console.log(e);
            if (axios.isAxiosError(e)) {
                const axiosError = e as AxiosError;
                const code = axiosError.response?.status;
                if (code === 401) {
                    setError({
                        message: 'Неверный логин или пароль'
                    })
                } else if (code === 500) {
                    setError({
                        message: 'Ошибка сервера'
                    })
                } else {
                    setError({
                        message: 'Неизвестная ошибка'
                    })
                }

            }
        } finally {
            setLoaded(true);
        }
    }

    if (store.isAuth)
        navigate(-1);

    return (
        <Stack justifyContent='center' alignItems='center' style={{minHeight: '100vh'}} spacing={2}>
            <Stack spacing={2}>

                <Typography variant='h3'>Авторизация</Typography>
                {error &&
                    <Alert variant={'outlined'} severity={'error'}>{error.message}</Alert>
                }
                <TextField variant='outlined' label='Номер телефона' value={username} disabled={!loaded}
                           onChange={event => setUsername(event.target.value)}/>
                <TextField variant='outlined' label='Пароль' type='password' value={password} disabled={!loaded}
                           onChange={event => setPassword(event.target.value)}/>
                <Stack alignItems={'center'}>
                    <ButtonGroup>
                        <Button onClick={() => navigate('/')} color={'inherit'} disabled={!loaded}>
                            Отмена
                        </Button>
                        <Button variant={'contained'} onClick={() => onLogin()} disabled={!loaded}>
                            {!loaded &&
                                <CircularProgress size={10}/>
                            }
                            Готово
                        </Button>
                    </ButtonGroup>
                </Stack>
            </Stack>
            <Link href='/signup' underline={'none'}>
                Зарегистрироваться
            </Link>
        </Stack>
    )
}

export default observer(LoginPage);