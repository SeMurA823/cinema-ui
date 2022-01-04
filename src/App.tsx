import React from 'react';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import './App.css';
import LoginPage from './pages/LoginPage';
import HomeSubPage from './pages/HomeSubPage';
import {createTheme, CssBaseline, ThemeProvider} from '@mui/material';
import GeneralPage from "./pages/GeneralPage";
import FilmSubPage from "./pages/FilmSubPage";
import NotFound from "./pages/NotFound";
import ScreeningInfo from "./pages/ScreeningInfo";
import AuthPage from "./pages/AuthPage";
import BookingSubPage from "./pages/BookingSubPage";
import moment from "moment";
import 'moment/locale/ru'
import PurchaseSubPage from "./pages/PurchaseSubPage";
import ProfilePage from "./pages/ProfilePage";
import LogoutPage from "./pages/LogoutPage";
import RegPage from "./pages/RegPage";
moment.locale('ru');

export const ruMoment = (date: Date):moment.Moment => {
    return moment(date);
}

const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#3d3d3d'
        }
    }
});

export const NOT_FOUND_URL = '/notfound';
export const LOGIN_URL = '/signin';
export const LOGOUT_URL = '/logout'
export const REG_URL = '/signup';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<GeneralPage/>}>
                        <Route path='/' element={<Navigate to='/home'/>}/>
                        <Route path='home' element={<HomeSubPage/>}/>
                        <Route path='films/:id' element={<FilmSubPage/>}/>
                        <Route path='screenings/:id' element={<ScreeningInfo/>}/>
                        <Route path='booking' element={<AuthPage><BookingSubPage/></AuthPage>}/>
                        <Route path='purchase' element={<AuthPage><PurchaseSubPage/></AuthPage>}/>
                        <Route path='profile' element={<AuthPage><ProfilePage/></AuthPage>}/>
                        <Route path='signup' element={<RegPage/>}/>
                    </Route>
                    <Route path={LOGOUT_URL} element={<AuthPage><LogoutPage/></AuthPage>}/>
                    <Route path={LOGIN_URL} element={<LoginPage/>}/>
                    <Route path={NOT_FOUND_URL} element={<NotFound/>}/>
                    <Route path="*" element={<Navigate to={NOT_FOUND_URL}/>}/>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
