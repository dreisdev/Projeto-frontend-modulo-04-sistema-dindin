import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "./pages/SignUp/";
import SignInPage from "./pages/SignIn/";
import Main from "./pages/Main";
import { getItem } from "./utils/storage";
import { useNavigate } from "react-router-dom";

const ProjectRoutes = () => {
    const navigate = useNavigate();
    const token = getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token]);

    return (
        <Routes>
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<SignInPage />} />
            {token ? (<Route path="/main" element={<Main />} />) : (<Route path="/*" element={<Navigate to='/login' replace />} />)}
        </Routes>
    );
};

export default ProjectRoutes;