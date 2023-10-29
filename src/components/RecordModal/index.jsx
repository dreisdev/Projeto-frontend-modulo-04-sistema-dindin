import React, { useState, useEffect } from 'react';
import api from '../../api/apiConfig';
import CloseModal from '../../assets/closemodal.svg';
import './styles.css';

export default function RecordModal({ modalOpen, setModalOpen, loginToken, updateRecords, transactionId, isEditing }) {

    const [entry, setEntry] = useState(false);
    const [remove, setRemove] = useState(true);
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [money, setMoney] = useState('');
    const [categories, setCategories] = useState([]);
    const [showError, setShowError] = useState(false);
    const [recordData, setRecordData] = useState(null);

    const handleEntry = (e) => {
        e.preventDefault();
        setEntry(true);
        setRemove(false);
    };

    const handleRemove = (e) => {
        e.preventDefault();
        setEntry(false);
        setRemove(true);
    };

    async function handleSubmit(e) {
        e.preventDefault();

        let formattedDate = new Date(date);
        formattedDate.setDate(formattedDate.getDate() + 1);

        try {
            const response = await api.post(
                '/transacao',
                {
                    tipo: entry === true ? 'entrada' : 'saida',
                    descricao: description.toString(),
                    valor: Number(money),
                    data: formattedDate.toISOString(),
                    categoria_id: category === '' ? 1 : Number(category),
                },
                {
                    headers: {
                        Authorization: `Bearer ${loginToken}`,
                    },
                }
            );

            setDate('');
            setDescription('');
            setCategory('');
            setMoney('');
            setModalOpen(false);
            setShowError(false);
            updateRecords();
        } catch (error) {
            if (!date || !description || !money) {
                setShowError(true);
                return;
            }
            return console.log(error.response.data);
        };
    };

    async function handleEdit(e) {
        e.preventDefault();

        let formattedDate = new Date(date);
        formattedDate.setDate(formattedDate.getDate() + 1);

        try {
            const response = await api.put(
                `/transacao/${transactionId}`,
                {
                    tipo: entry === true ? 'entrada' : 'saida',
                    descricao: description.toString(),
                    valor: Number(money),
                    data: formattedDate.toISOString(),
                    categoria_id: category === '' ? 1 : Number(category),
                },
                {
                    headers: {
                        Authorization: `Bearer ${loginToken}`,
                    },
                }
            );

            setDate('');
            setDescription('');
            setCategory('');
            setMoney('');
            setModalOpen(false);
            setShowError(false);
            updateRecords();
        } catch (error) {
            if (!date || !description || !money) {
                setShowError(true);
                return;
            }
            return console.log(error.response.data);
        };
    };

    async function getCategories() {
        try {
            const response = await api.get('/categoria', {
                headers: {
                    Authorization: `Bearer ${loginToken}`,
                },
            });
            setCategories(response.data);
        } catch (error) {
            console.log(error.response);
        }
    }

    useEffect(() => {
        getCategories();
    }, []);

    useEffect(() => {
        if (isEditing) {
            async function fetchRecordData() {
                try {
                    const response = await api.get(`/transacao/${transactionId}`, {
                        headers: {
                            Authorization: `Bearer ${loginToken}`,
                        },
                    });

                    const { tipo, descricao, valor, data, categoria_id } = response.data;

                    setRecordData({
                        tipo,
                        descricao,
                        valor,
                        data: new Date(data).toISOString().substr(0, 10),
                        categoria_id,
                    });
                } catch (error) {
                    console.log(error.response);
                }
            }

            fetchRecordData();
        } else {
            setDate('');
            setDescription('');
            setCategory('');
            setMoney('');
        };

    }, [isEditing, transactionId, loginToken]);

    useEffect(() => {
        if (recordData) {
            setEntry(recordData.tipo === 'entrada');
            setRemove(recordData.tipo === 'saida');
            setDate(recordData.data);
            setDescription(recordData.descricao);
            setCategory(recordData.categoria_id);
            setMoney(recordData.valor);
        }
    }, [recordData]);

    if (modalOpen) {
        return (
            <div className='background-style'>
                <form onSubmit={isEditing ? handleEdit : handleSubmit} className='modal-style'>
                    <div>
                        <div className='modal-start'>
                            <h1 className='record-h1'>{isEditing ? 'Editar Registro' : 'Adicionar Registro'}</h1>
                            <img onClick={() => setModalOpen(false)} className='close-modal' src={CloseModal} alt='close-modal' />
                        </div>
                        <div className='modal-buttons'>
                            <button
                                className='modal-button'
                                onClick={handleEntry}
                                style={{ backgroundColor: entry ? '#3A9FF1' : '#B9B9B9' }}
                            >
                                Entrada
                            </button>
                            <button
                                className='modal-button'
                                onClick={handleRemove}
                                style={{ backgroundColor: remove ? '#FF576B' : '#B9B9B9' }}
                            >
                                Saída
                            </button>
                        </div>
                        <div className='modal-forms'>
                            <label className='modal-label'>Valor</label>
                            <input value={money} onChange={(e) => setMoney(e.target.value)} className='record-input' type='number' min='1' />
                            <label className='modal-label'>Categoria</label>
                            <select onChange={(e) => setCategory(e.target.value)} className='record-select'>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.descricao}
                                    </option>
                                ))}
                            </select>
                            <label className='modal-label'>Data</label>
                            <input value={date} onChange={(e) => setDate(e.target.value)} className='record-input' type='date' />
                            <label className='modal-label'>Descrição</label>
                            <input value={description} onChange={(e) => setDescription(e.target.value)} className='record-input' type='text' />
                        </div>
                        <div className='center-submit'>
                            <div className='modal-submit'>
                                {showError && <p className='error-message'>É obrigatório preencher todos os campos.</p>}
                                <button className='submit-button' type='submit'>
                                    {isEditing ? 'Atualizar' : 'Confirmar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    } else {
        return null;
    }
}