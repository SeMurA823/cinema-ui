import React, {useContext, useEffect, useState} from "react";
import {IUser} from "../models/response/IUser";
import {Alert, Button, Container, Divider, Link, MenuItem, Select, Stack, TextField} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterMoment from "@mui/lab/AdapterMoment";
import moment from "moment";
import $api from "../http/config";
import LoadingComponent from "../components/LoadingComponent";
import {Context} from "../index";
import {useNavigate} from "react-router-dom";

type Password = {
    password: string,
    repeatPassword: string,
}

export default function RegPage() {
    const [user, setUser] = useState<IUser>({
        firstName: '',
        lastName: '',
        patronymic: '',
        gender: '',
        tel: '',
        birthDate: new Date(1970,1,1).toISOString(),
    } as IUser);
    const [password, setPassword] = useState<Password>({
        password: '',
        repeatPassword: ''
    } as Password);
    const [error, setError] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(true);

    const {store} = useContext(Context);
    const navigate = useNavigate();

    useEffect(()=>{
        if (store.isAuth)
            navigate("/");
    },[])

    const onSubmit = async () => {
        try {
            setLoaded(false);
            setError(false);
            await $api.post(`/auth/registration`, JSON.stringify({...user, ...password}));
            navigate('/signin');
        } catch (e) {
            setError(true);
        } finally {
            setLoaded(true);
        }
    }


    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const prop: string = event.target.id;
        const value: string = event.target.value;
        setUser({
            ...user,
            [prop]: value
        });
    }

    const handleChangePassword = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const prop: string = event.target.id;
        const value: string = event.target.value;
        setPassword({
            ...password,
            [prop]: value
        });
    }

    if (!loaded)
        return <LoadingComponent/>

    return (
        <Container>
            <Stack spacing={2}>
                <Divider>Личная информация</Divider>
                <Stack direction={'row'} flexWrap={'wrap'} spacing={2} justifyContent='center'>
                    <TextField label='Имя' value={user.firstName} id={'firstName'} onChange={handleChange} required/>
                    <TextField label='Фамилия' value={user.lastName} id={'lastName'} onChange={handleChange} required/>
                </Stack>
                <Stack direction={'row'} flexWrap={'wrap'} spacing={2} justifyContent='center'>
                    <TextField label='Отчество' value={user.patronymic} id={'patronymic'} onChange={handleChange}
                               required/>
                    <LocalizationProvider dateAdapter={AdapterMoment} locale={'ru'}>
                        <DatePicker label='Дата'
                                    mask={'__.__.____'}
                                    onChange={(newDate) => {
                                        setUser({
                                            ...user,
                                            birthDate: (newDate) ? moment(newDate).format() : user.birthDate
                                        });
                                    }}
                                    value={moment(new Date(user.birthDate))}
                                    renderInput={(props) => <TextField {...props} required/>}/>
                    </LocalizationProvider>
                </Stack>
                <Stack direction={'row'} flexWrap={'wrap'} spacing={2} justifyContent='center'>
                    <Select value={user.gender} id='gender' defaultValue={user.gender} required onChange={e => setUser({
                        ...user,
                        gender: e.target.value
                    })}>
                        <MenuItem value={''}>Не указано</MenuItem>
                        <MenuItem value={'Male'}>Мужчина</MenuItem>
                        <MenuItem value={'Female'}>Женщина</MenuItem>
                    </Select>
                </Stack>
                <Divider>Контактная информация</Divider>
                <Stack direction={'row'} flexWrap={'wrap'} spacing={2} justifyContent='center'>
                    <TextField label='Номер телефона' value={user.tel} id={'tel'} onChange={handleChange} required
                               inputProps={{
                                   inputMode: 'tel',
                                   pattern: '^((8|\\+7)[\\- ]?)?(\\(?\\d{3}\\)?[\\- ]?)?[\\d\\- ]{7,10}$'
                               }}/>
                </Stack>
                <Divider>Безопасность</Divider>
                <Stack direction={'row'} flexWrap={'wrap'} spacing={2} justifyContent='center'>
                    <TextField label='Пароль' type={'password'} value={password.password} id={'password'}
                               onChange={handleChangePassword}
                               helperText={'Минимум 6 символов'}
                               required error={password.repeatPassword !== password.password || password.password?.length < 6}/>
                    <TextField label='Повторите пароль' type={'password'} value={password.repeatPassword}
                               id={'repeatPassword'} onChange={handleChangePassword}
                               required error={password.repeatPassword !== password.password}/>
                </Stack>
                {error &&
                    <Alert severity={'error'}>
                        Пользователь с данным номером телефона уже существует <Link href='/signin'>Войти?</Link>
                    </Alert>
                }
                <Button onClick={()=>onSubmit()}>
                    Зарегистрироваться
                </Button>
            </Stack>
        </Container>
    )
}