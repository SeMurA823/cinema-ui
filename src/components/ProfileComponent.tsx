import React, {useContext, useState} from "react";
import {Button, Divider, MenuItem, Select, Skeleton, Stack, TextField} from "@mui/material";
import {IUser} from "../models/response/IUser";
import {Context} from "../index";
import AdapterMoment from "@mui/lab/AdapterMoment";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import moment from "moment";
import $api from "../http/config";
import PasswordEditComponent from "./PasswordEditComponent";


export default function ProfileComponent() {
    const {store} = useContext(Context);

    const [user, setUser] = useState<IUser>(store.user);


    const [edited, setEdited] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(true);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const prop: string = event.target.id;
        const value: string = event.target.value;
        const newUser = {
            ...user,
            [prop]: value
        };
        setUser(newUser);
        let checkEdit: boolean = false;
        for (let p in store.user) {
            // @ts-ignore
            if (newUser[p] !== store.user[p])
                checkEdit = true;
        }
        setEdited(checkEdit);
    }

    const editUser = async () => {
        try {
            setLoaded(false);
            const response = await $api.post<IUser>(`/users/edit`, JSON.stringify(user));
            store.setUser(response.data);
            setUser(response.data);
            setEdited(false);
        } catch (e) {
            console.log(e);
            setUser(store.user)
        } finally {
            setLoaded(true);
        }
    }


    if (!loaded)
        return (<Skeleton style={{width: '100%', height: '420'}}/>)

    return (
        <Stack spacing={2}>
            <Divider>Личная информация</Divider>
            <Stack direction={'row'} flexWrap={'wrap'} spacing={2} justifyContent='center'>
                <TextField label='Имя' value={user.firstName} id={'firstName'} onChange={handleChange}/>
                <TextField label='Фамилия' value={user.lastName} id={'lastName'} onChange={handleChange}/>
            </Stack>
            <Stack direction={'row'} flexWrap={'wrap'} spacing={2} justifyContent='center'>
                <TextField label='Отчество' value={user.patronymic} id={'patronymic'} onChange={handleChange}/>
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
                                renderInput={(props) => <TextField {...props}/>}/>
                </LocalizationProvider>
            </Stack>
            <Stack direction={'row'} flexWrap={'wrap'} spacing={2} justifyContent='center'>
                <Select value={user.gender} id='gender' defaultValue={user.gender} onChange={e => setUser({
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
            {edited &&
                <Stack direction={'row'} justifyContent={'center'}>
                    <Button variant={'outlined'} onClick={() => editUser()}>Сохранить</Button>
                </Stack>
            }
            <Divider>Безопасность</Divider>
            <PasswordEditComponent/>

        </Stack>
    )
}