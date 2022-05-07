import React from "react";
import {CircularProgress} from "@mui/material";

export default class LoadingComponent extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }
    render() {
        return (
            <div style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex'
            }}>
                <CircularProgress/>
            </div>
        );
    }
}