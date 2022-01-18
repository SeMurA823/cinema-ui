export interface IUser {
    firstName: string,
    lastName: string,
    patronymic: string,
    tel: string,
    gender: string,
    id: number,
    birthDate: string
}

export type Notification = {
    id: number,
    message: string,
    isViewed: boolean,
    created: string
}