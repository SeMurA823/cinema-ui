import {Card, CardContent, CardMedia, Chip, Skeleton, Stack, Typography} from "@mui/material";
import {SERVER_URL} from "../http/config";
import {FilmType} from "../models/response/FilmTypes";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

type Props = {
    film: FilmType,
}

export default function FilmCard(props: Props) {
    const navigate = useNavigate();
    let film = props.film;

    const [loaded, setLoaded] = useState<boolean>(false);

    return (
        <Card style={{margin: 10, width: 350}}>
            {props.film.posters.length > 0 &&
                <div>
                    <CardMedia
                        component='img'
                        height='450'
                        image={SERVER_URL + `/files/${film.posters[0].filename}`}
                        onLoad={() => setLoaded(true)}
                        style={{display: (loaded) ? 'block' : 'none'}}
                    />
                    <Skeleton variant={'rectangular'}
                              style={{display: (loaded) ? 'none' : 'block', height: 260}}/>
                </div>
            }
            <CardContent>
                <Stack spacing={1}>
                    <Typography variant='h4' component='h4' fontWeight='bolder' style={{cursor: 'pointer'}}
                                onClick={() => navigate(`/films/${film.id}`)}>
                        {film.name}
                    </Typography>
                    <Stack direction='row' spacing={2}>
                        {film.countries.map(country => (
                            <Chip key={country.id} label={country.shortName}/>
                        ))}
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}