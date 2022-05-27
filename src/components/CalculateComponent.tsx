import React, {useEffect, useState} from "react";
import {ReservationType} from "../models/response/PurchasesTypes";
import {Stack, Typography} from "@mui/material";

type Props = {
    selected: ReservationType[];
    onSubmit: () => any
}

export default function CalculateComponent(props: Props) {

    const [sum, setSum] = useState<number>(0);

    useEffect(() => {
        let res = 0;
        props.selected.forEach(x => res += x.filmScreening.price);
        setSum(res);

    }, [props.selected])

    return (
        <Stack>
            <Stack>
                <Typography variant='h4'><span style={{fontWeight: 'bold'}}>Итого: </span>{sum} ₽</Typography>
            </Stack>
        </Stack>
    )
}
