import React from "react";
import {AgeLimitType} from "../models/response/AgeLimitTypes";

type Props = {
    limit: AgeLimitType
}

export default function AgeLimitLabel(props: Props) {
    return (
        <p>{props.limit.id}</p>
    )
}