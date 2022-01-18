import {HallType, SeatType} from "./HallTypes";

export type ScreeningType = {
    id: number,
    hall: HallType,
    date: string,
    price: number,
    active: boolean
}

export type ScreeningSeatType = SeatType & {
    status: string
}