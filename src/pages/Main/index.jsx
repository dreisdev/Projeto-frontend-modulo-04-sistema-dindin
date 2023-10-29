import React, { useState, useEffect } from 'react';
import './styles.css';
import Logo from '../../assets/logo.svg';
import ProfileButton from '../../assets/profilebutton.svg';
import RecordTable from '../../components/RecordTable';
import api from '../../api/apiConfig';
import { getItem } from '../../utils/storage'
import InforUser from '../../components/InforUser';
import LogoutUser from '../../components/LogoutUser';
import { useNavigate } from 'react-router-dom';

const Main = () => {
    let key = "token";
    const loginToken = getItem(key);
    const [setUserName] = useState('');

    const [records, setRecords] = useState([]);
    const navigate = useNavigate();

    async function getApiRecords() {
        try {
            const response = await api.get("transacao", {
                headers: {
                    Authorization: `Bearer ${loginToken}`
                }
            });
            setRecords(response.data);
        } catch (error) {
            console.log(error.response);
        }
    }

    useEffect(() => {
        getApiRecords();
    }, []);

    const updateRecords = async () => {
        await getApiRecords();
    }

    return (
        <div className='container-main'>
            <nav className='navbar'>
                <img src={Logo} alt="logo" />
                <div className="container-profile">
                    <img className="profile-button" src={ProfileButton} alt="profile-button" />
                    <b className="username"><InforUser setUserName={setUserName} /></b>
                    <LogoutUser navigate={navigate} />
                </div>
            </nav>
            <main className='record-table'>
                <RecordTable
                    loginToken={loginToken}
                    records={records}
                    updateRecords={updateRecords}
                />
            </main>
        </div>
    )
};

export default Main;