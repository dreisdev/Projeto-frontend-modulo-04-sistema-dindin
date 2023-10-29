import React from 'react';
import { clear } from '../../utils/storage';
import LogoutButton from '../../assets/logoutbutton.svg';

const LogoutUser = ({ navigate }) => {

    const handleLogout = () => {
        clear();
        navigate('/login');
    };

    return <img className="logout-button" src={LogoutButton} alt="logout-button" onClick={handleLogout} />;

};

export default LogoutUser;


