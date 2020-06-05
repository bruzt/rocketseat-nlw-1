import React, { useState, useEffect, MouseEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';

import './styles.css';

import logo from '../../assets/logo.svg';
import api from '../../services/api';

import LeafletMap from '../../components/LeafletMap';
import Dropzone from '../../components/dropzone';

export interface Item {
    id: number;
    title: string;
    image_url: string;
}

export interface IBGEUF {
    id: number;
    nome: string;
    sigla: string;
}

export interface IBGECity {
    id: number;
    nome: string;
}

const CreatePoint: React.FC = () => {

    const [getItems, setItems] = useState<Item[]>([]);
    const [getUfs, setUfs] = useState<IBGEUF[]>([]);
    const [getCities, setCities] = useState<IBGECity[]>([]);

    const [getSelectedUf, setSelectedUf] = useState<string>('0');
    const [getSelectedCity, setSelectedCity] = useState<string>('0');
    const [getSelectedItems, setSelectedItems] = useState<number[]>([]);
    const [getSelectedImage, setSelectedImage] = useState<File>();

    const [getSelectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])

    const [getEntityName, setEntityName] = useState<string>('');
    const [getEntityEmail, setEntityEmail] = useState<string>('');
    const [getEntityWhatsapp, setEntityWhatsapp] = useState<string>('');

    const history = useHistory();

    useEffect( () => {

        fetchItems();
        fetchUfs();

    }, []);

    useEffect( () => {

        if(getSelectedUf !== "0"){

            fetchCities();
        }

    }, [getSelectedUf]); 

    async function fetchItems(){

        try {

            const response = await api.get('/items');

            setItems(response.data);
            
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchUfs(){

        try {

            const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');

            setUfs(response.data);
            
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchCities(){

        try {

            const response = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${getSelectedUf}/municipios`);
            
            setCities(response.data);

        } catch (error) {
            console.log(error);
        }
    }

    function handleMapClick(event: LeafletMouseEvent){

        setSelectedPosition([event.latlng.lat, event.latlng.lng]);
    }

    async function handleSubmit(event: MouseEvent<HTMLButtonElement>) {
        
        event.preventDefault();

        try {

            if(
                getEntityName.length > 2 &&
                getEntityEmail.length > 2 &&
                getEntityWhatsapp.length > 2 &&
                getSelectedPosition[0] !== 0 &&
                getSelectedPosition[1] !== 0 &&
                getSelectedCity.length > 1 &&
                getSelectedUf.length > 1 &&
                getSelectedItems.length > 0
            ){

                const data = new FormData();

                data.append('name', getEntityName);
                data.append('email', getEntityEmail);
                data.append('whatsapp', getEntityWhatsapp);
                data.append('latitude', String(getSelectedPosition[0]));
                data.append('longitude', String(getSelectedPosition[1]));
                data.append('city', getSelectedCity);
                data.append('uf', getSelectedUf);
                data.append('items', getSelectedItems.join(','));
                if(getSelectedImage) data.append('image', getSelectedImage);

                /*const data = {
                    name: getEntityName,
                    email: getEntityEmail,
                    whatsapp: getEntityWhatsapp,
                    latitude: getSelectedPosition[0],
                    longitude: getSelectedPosition[1],
                    city: getSelectedCity,
                    uf: getSelectedUf,
                    items: getSelectedItems
                }*/

                await api.post('/points', data);

                alert('Ponto de coleta criado');

                history.push('/');
            }
            
        } catch (error) {
            console.error(error);
        }
    }

    function handleSelectItem(id: number){

        if(getSelectedItems.includes(id)){

            let items = getSelectedItems.filter( (item) => item !== id);

            setSelectedItems(items);

        } else {

            setSelectedItems([ ...getSelectedItems, id ]);
        }
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="ecoleta" />

                <Link to='/'>
                    <FiArrowLeft /> Voltar para Home
              </Link>
            </header>


            <form>
                <h1>Cadastro do<br/>ponto de coleta</h1>

                <Dropzone onFileUploaded={setSelectedImage} />
                
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                            type="text" 
                            id="name"
                            value={getEntityName}
                            onChange={(event) => setEntityName(event.target.value)}
                        />
                    </div>

                    <div className="field-group">

                        <div className="field">
                            <label htmlFor="email">e-mail</label>
                            <input 
                                type="email" 
                                id="email"
                                value={getEntityEmail}
                                onChange={(event) => setEntityEmail(event.target.value)}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input 
                                type="text" 
                                id="whatsapp"
                                value={getEntityWhatsapp}
                                onChange={(event) => setEntityWhatsapp(event.target.value)}
                            />
                        </div>

                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <LeafletMap markerPosition={getSelectedPosition} onClick={handleMapClick} />
                    
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado</label>
                            <select 
                                id="uf"
                                value={getSelectedUf}
                                onChange={(event) => setSelectedUf(event.target.value)}
                            >
                                <option value="0">Selecione um estado</option>
                                {getUfs.map( (uf) => (
                                    <option key={uf.id} value={uf.sigla}>{uf.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select 
                                id="city"
                                value={getSelectedCity}
                                onChange={(event) => setSelectedCity(event.target.value)}
                            >
                                <option value="0">Selecione uma cidade</option>
                                {getCities.map( (city) => (
                                    <option key={city.id} value={city.nome}>{city.nome}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>selecione um ou mais ítens abaixo</span>
                    </legend>

                    <ul className="items-grid">

                        {getItems.map( (item) => (
                            <li 
                                key={item.id} 
                                className={`${(getSelectedItems.includes(item.id) ? 'selected' : '')}`} 
                                onClick={() => handleSelectItem(item.id)}
                            >
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))}

                    </ul>
                </fieldset>

                <button type="submit" onClick={(event) => handleSubmit(event)}>
                    Cadastrar ponto de coleta
                </button>
            </form>
        </div>
    );
}

export default CreatePoint;