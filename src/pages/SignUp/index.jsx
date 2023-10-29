import './styles.css';
import logoImg from '../../assets/logo.svg';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/apiConfig';
import Modal from '../../components/Modal';

const SignUpPage = () => {

    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const navigate = useNavigate();

    const handleSignUp = () => {
        if (!userName || !userEmail || !password || !confirmPassword) {
            setModalContent('Por favor, preencha todos campos.');
            setModalOpen(true);
            return;
        };

        if (password !== confirmPassword) {
            setIsLoading(false);
            setModalContent('As senhas não coicidem. Por favor, tente novamente');
            setModalOpen(true);
            return;
            ;
        }

        setIsLoading(true);

        const userData = {
            nome: userName,
            email: userEmail,
            senha: password
        };

        api.post('/usuario', userData)
            .then(response => {
                setIsLoading(false);
                setModalContent('Usuário cadastrado com sucesso!');
                setModalOpen(true);
                console.log(response.data);
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            })
            .catch(error => {
                setIsLoading(false);
                console.log('Erro ao cadastrar usuário:', error);
                console.log('Detalhes do erro:', error.response.data);
                setModalContent('Erro ao cadastrar usuário. Por favor, tente novamente.');
                setModalOpen(true);
            });
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <div className="boxSignUP">
            <img className='logo' src={logoImg} alt="logoImg" />
            <div className='full-signup' >
                <h1 className='signup-h1'>Cadastre-se</h1>
                <form >
                    <label className='signup-label' htmlFor="nome">Nome</label>
                    <input className='signup-input' type="text" id="nome" value={userName} onChange={e => setUserName(e.target.value)} />

                    <label className='signup-label' htmlFor="email">E-mail</label>
                    <input className='signup-input' type="text" id="email" value={userEmail} onChange={e => setUserEmail(e.target.value)} />

                    <label className='signup-label' htmlFor="senha">Senha</label>
                    <input className='signup-input' type="password" id="senha" value={password} onChange={e => setPassword(e.target.value)} />

                    <label className='signup-label' htmlFor="ConfirmarSenha">Confirmação de senha</label>
                    <input className='signup-input' type="password" id="ConfirmarSenha" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />

                    <button className='signup-button' type="button" onClick={handleSignUp} disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Cadastrar'}
                    </button>

                    <div className='login-link'>
                        <h3 className='login-h3'>Já tem cadastro? <Link to='/login' style={{ textDecoration: 'none', color: 'inherit' }}>Clique aqui!</Link> </h3>
                    </div>
                </form>
                <Modal isOpen={modalOpen} onClose={closeModal}>
                    <div>{modalContent}</div>
                </Modal>
            </div>
        </div>
    );
};

export default SignUpPage;