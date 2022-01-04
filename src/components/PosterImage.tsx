import React, {useState} from 'react';
import {SERVER_URL} from "../http/config";
import {Skeleton, Stack} from "@mui/material";
import {PosterType} from "../models/response/PosterTypes";

type Props = {
    poster: PosterType
}

export default function PosterImage(props: Props) {
    const [loaded, setLoaded] = useState<boolean>()
    return (
        <Stack style={{width: 450, height: 640, background: 'transparent'}} alignItems={'center'}
               justifyContent={'center'}>
            <img src={`${SERVER_URL}/files/${props.poster.filename}`} alt={''}
                 style={{maxWidth: '100%', maxHeight: '100%', display: (loaded) ? 'block' : 'none', borderRadius: 10}}
                 onLoad={() => setLoaded(true)}/>
            <Skeleton variant={'rectangular'} color={'#989898'} style={{width: '100%', height: '100%', display: (!loaded) ? 'block' : 'none', borderRadius: 10}}/>
        </Stack>
    )
}