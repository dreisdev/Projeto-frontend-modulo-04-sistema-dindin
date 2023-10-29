import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import setDefaultOptions from 'date-fns/setDefaultOptions';
import './styles.css';
import Filter from '../../assets/filter.svg';
import EditButton from '../../assets/editregisterbutton.svg';
import DeleteButton from '../../assets/deleteregisterbutton.svg';
import RecordModal from '../RecordModal/index.jsx';
import api from '../../api/apiConfig';

setDefaultOptions({ locale: ptBR });

const RecordTable = ({ records, loginToken, updateRecords }) => {

    const [openModal, setOpenModal] = useState(false);
    const [entries, setEntries] = useState(0);
    const [removes, setRemoves] = useState(0);
    const [balance, setBalance] = useState(0);

    const [transactionId, setTransactionId] = useState('');
    const [isDeleteClicked, setIsDeleteClicked] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    function handleButtonClick() {
        setIsDeleteClicked(true);
    };

    function handleEditClick() {
        setIsEditing(true);
        setOpenModal(true);
    };

    async function handleDeleteRecord() {
        try {
            const response = await api.delete(`/transacao/${transactionId}`, { headers: { Authorization: `Bearer ${loginToken}`, }, });
            updateRecords();
            setIsDeleteClicked(false);
        } catch (error) {
            return console.log(error.data)
        }
    };

    const fetchStatement = async () => {
        try {
            const response = await api.get('/transacao/extrato', {
                headers: {
                    Authorization: `Bearer ${loginToken}`,
                },
            });
            const statement = response.data;
            let totalEntries = statement.entrada;
            let totalRemoves = statement.saida;
            const currentBalance = totalEntries - totalRemoves;

            setEntries(totalEntries);
            setRemoves(totalRemoves);
            setBalance(currentBalance);
        } catch (error) {
            console.error('Erro ao obter extrato:', error);
        };
    };

    useEffect(() => {
        fetchStatement();
    }, [records]);

    useEffect(() => {
        if (isDeleteClicked) {
            handleDeleteRecord();
        }
    }, [isDeleteClicked]);

    return (
        <div className='container-record'>
            <main>
                <button className="filter-button"><img src={Filter} alt="filter" />Filtrar</button>
                <table className='full-table'>
                    <thead className='table-head'>
                        <tr>
                            <th>Data</th>
                            <th>Dia da semana</th>
                            <th>Descrição</th>
                            <th>Categoria</th>
                            <th>Valor</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody >
                        {records.map((record, index) => (
                            <tr key={index}>
                                <td className='table-d data'>{format(new Date(record.data), 'dd/MM/yyyy')}</td>
                                <td className='table-d'>{(format(new Date(record.data), 'E')[0].toUpperCase()) + (format(new Date(record.data), 'E').slice(1))}</td>
                                <td className='table-d'>{(record.descricao)[0].toUpperCase() + (record.descricao).slice(1)}</td>
                                <td className='table-d'>{record.categoria_nome}</td>
                                <td className={`table-d ${record.tipo === 'saida' ? 'yellow' : 'purple'}`}>{record.valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                                <td className='table-d'><img className="icon" src={EditButton} alt="edit" onClick={() => {
                                    setTransactionId(record.id);
                                    handleEditClick();
                                }} /></td>
                                <td className='table-d'><img className="icon" src={DeleteButton} alt="delete" onClick={() => {
                                    setTransactionId(record.id);
                                    handleButtonClick();
                                }} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </main>
            <div className='full-resume'>
                <section className='section-resume'>
                    <h1 className='money-resume'>Resumo</h1>
                    <div className='money-div'>
                        <h2 className='money-in'>Entradas</h2>
                        <h2 className='money purple'>{entries.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</h2>
                    </div>
                    <div className='money-div out'>
                        <h2 className='money-out'>Saídas</h2>
                        <h2 className='money yellow'>{removes.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</h2>
                    </div>
                    <div className='money-div '>
                        <h1 className='money-total'>Saldo</h1>
                        <h2 className='money cyan'>{balance.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</h2>
                    </div>
                </section>
                <button onClick={() => {
                    setOpenModal(true)
                    setIsEditing(false)
                }} className="record-button">Adicionar Registro</button>
            </div>
            <RecordModal
                loginToken={loginToken}
                modalOpen={openModal}
                setModalOpen={setOpenModal}
                updateRecords={updateRecords}
                transactionId={transactionId}
                isEditing={isEditing}
            />
        </div >
    );
}

export default RecordTable;