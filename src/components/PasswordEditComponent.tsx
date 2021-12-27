import React, {useState} from 'react';
import {Alert, Button, Stack, TextField} from "@mui/material";
import $api from "../http/config";


export default function PasswordEditComponent() {
    const [password, setPassword] = useState<string>('');
    const [repeatPassword, setRepeatPassword] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);

    const editPass = async () => {
        try {
            setLoaded(false);
            await $api.post(`/users/edit?password`, JSON.stringify(password));
            setError(false);
        } catch (e) {
            setError(true);
        } finally {
            setLoaded(true);
        }
    }

    return (
        <Stack spacing={2}>
            <Stack direction={'row'} flexWrap={'wrap'} spacing={2} justifyContent='center'>
                <TextField type='password' label='Новый пароль' value={password}
                           onChange={e => setPassword(e.target.value)}/>
                <TextField type='password' label='Повторить пароль' value={repeatPassword}
                           onChange={e => setRepeatPassword(e.target.value)} error={password !== repeatPassword}/>
            </Stack>
            {loaded && !error &&
                <Alert severity={'success'}>Пароль успешно изменен</Alert>
            }
            {loaded && error &&
                <Alert severity={'error'}>Пароль не изменен</Alert>
            }
            {(password !== '' && repeatPassword === password) &&
                <Stack direction={'row'} justifyContent={'center'}>
                    <Button onClick={()=>editPass()}>Изменить пароль</Button>
                </Stack>
            }
        </Stack>
    )
}