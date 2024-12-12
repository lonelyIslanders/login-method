import React from 'react';
import { Route, Routes } from 'react-router-dom'
import Login from './components/Login';

import UploadImage from './components/UploadImage'



const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/upload' element={<UploadImage />} />
        </Routes>
    )
}

export default AppRoutes;