import React from 'react';
import { Route, Routes } from 'react-router-dom'
import Login from './components/Login';

import Test from './components/Test'



const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/test' element={<Test />} />
        </Routes>
    )
}

export default AppRoutes;