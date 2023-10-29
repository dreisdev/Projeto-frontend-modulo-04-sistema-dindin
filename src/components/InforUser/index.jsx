import React, { useState, useEffect } from 'react';
import { getItem } from '../../utils/storage';
import api from '../../api/apiConfig';

const LogoutInforUser = () => {
    const [userName, setUserNameState] = useState('');
    let key = 'token';
    const longinToken = getItem(key);

    const fetchUser = async () => {
        try {
            const response = await api.get('/usuario/', {
                headers: {
                    Authorization: `Bearer ${longinToken}`,
                },
            });

            const userInfor = response.data.nome;
            const capitalizedUserName = userInfor.charAt(0).toUpperCase() + userInfor.slice(1);
            setUserNameState(capitalizedUserName);

        } catch (error) {
            console.error('Erro ao obter dados do usuário:', error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return <b>{userName}</b>

}

export default LogoutInforUser;