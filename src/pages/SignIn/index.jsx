import './styles.css';
import logoImg from '../../assets/logo.svg';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import api from '../../api/apiConfig';
import Modal from '../../components/Modal';

const SignInPage = () => {

    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    if (isAuthenticated) {
        return navigate('/main');
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleSignIn = () => {

        if (!userEmail || !password) {
            setModalContent('Por favor, preencha todos campos.');
            setModalOpen(true);
            return;
        };

        setIsLoading(true);

        const userData = {
            email: userEmail,
            senha: password
        };

        api.post('/login', userData)
            .then(response => {
                setIsLoading(false);
                setModalContent('Usuário logado com sucesso!');
                setModalOpen(true);
                const token = response.data.token;
                localStorage.setItem('token', token);
                const userId = response.data.usuario.id;
                localStorage.setItem('userId', userId);
                setTimeout(() => {
                    navigate('/main');
                }, 2000);
            })
            .catch(error => {
                setIsLoading(false);
                console.log('Erro ao cadastrar usuário:', error);
                console.log('Detalhes do erro:', error.response.data);
                setModalContent('Usuário não Cadastrado. Clique em cadastra-se');
                setModalOpen(true);
            });
    };

    const handleSignUp = () => {
        navigate('/signup');
    };

    return (
        <div className='boxSignIn font-face'>
            <img className='logoSignIn' src={logoImg} alt="logoImg" />
            <div>
                <h1 className='title-h1'>Controle suas <strong className='finances'>finanças</strong>,
                    sem planilha chata.
                </h1>
            </div>
            <div>
                <h1 className='text-h1'> Organizar as suas finanças nunca foi tão fácil,
                    com o DINDIN, você tem tudo num único lugar
                    e em um clique de distância.
                </h1>
            </div>
            <button className='signupButton-SignIn' onClick={handleSignUp}>Cadastre-se</button>
            <div className='Login-box' >
                <div className='login-h1'> <h1>Login</h1> </div>
                <form >
                    <label className='signin-label' htmlFor="email">E-mail</label>
                    <input className='signin-input' type="text" id="email" value={userEmail} onChange={e => setUserEmail(e.target.value)} />

                    <label className='signin-label' htmlFor="senha">Password</label>
                    <input className='signin-input' type="password" id="senha" value={password} onChange={e => setPassword(e.target.value)} />

                    <button className='signin-button' type="button" onClick={handleSignIn} disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Entrar'}
                    </button>

                </form>
                <Modal isOpen={modalOpen} onClose={closeModal}>
                    <div>{modalContent}</div>
                </Modal>
            </div>
        </div>
    );
};

export default SignInPage;