import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft} from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../../services/api';
import { LeafletMouseEvent } from 'leaflet';
import axios from 'axios';
import Dropzone from '../../components/Dropzone'

import './styles.css'
import logo from '../../assets/logo.svg'

// Array ou Objeto - criar interface para indicar o tipo (genecic type)
interface Item {
    id: number,
    title: string,
    image_url: string
}

interface IBGEUfResponse {
    sigla: string,
}

interface IBGECityResponse {
    nome: string,
}


const CreatePoint = () =>{

    const [ items, setItems ] = useState<Item[]>([]);
    const [ ufs, setUfs ] = useState<string[]>([]);
    const [ cities, setCities ] = useState<string[]>([]);
    const [ selectedUf, setSelectedUf] = useState('');
    const [ selectedCity, setSelectedCity] = useState('');
    const [ initialPosition, setInitialPosition ] = useState<[number, number]>([0,0])
    const [ selectedPosition, setSelectedPosition ] = useState<[number, number]>([0,0])
    const [ selectedItems, setSelectedItems ] = useState<number[]>([])
    
    const [ selectedFile, setSelectedFile] = useState<File>();

    const [ formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });
    
    const history = useHistory();

    //obter a localização inicial / setar e marcar no mapa
    useEffect(() => {
        navigator.geolocation.getCurrentPosition( position =>{
            const { latitude, longitude } = position.coords;
            setInitialPosition([latitude, longitude]);
            setSelectedPosition([latitude, longitude]);
        })
    },[]);

    // obter a lista com os itens 
    useEffect(()=>{
        api.get('items').then( response => {
            setItems(response.data)
        });
    },[]);    

    // obter os estados
    useEffect(() => {
        axios.get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then( response => {
            // percorrer o json de retorno, e armazenar no array ufInitials
            const ufInitials = response.data.map( uf => uf.sigla )
            setUfs(ufInitials);
        })
    }, [])

    //obter as cidades, sempre que ocorrer alteração na escolha do Estado
    useEffect(() => {
        if(selectedUf === ""){
            return;
        }
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
             .then( response => {
                // percorrer o json de retorno, e armazenar no array ufInitials
                const cityNames = response.data.map( city => city.nome )
                setCities(cityNames);
             })
    },[selectedUf]);

    function handleSelectUf(e: ChangeEvent<HTMLSelectElement>){
        const ufSelected = e.target.value;
        setSelectedUf(ufSelected);
    }

    function handleSelectCity(e: ChangeEvent<HTMLSelectElement>){
        const citySelected = e.target.value;
        setSelectedCity(citySelected);
    }

    function handleMapCick(e: LeafletMouseEvent){
        setSelectedPosition([
            e.latlng.lat,
            e.latlng.lng
        ])
    }

    /*
      função para armazenar os valores dos inputs do formulário
      uso do spread operator: 
        pega todos os valores do objeto formData, e adiciona. 
        Como [name] (dinâmico) já existe, o subsitui
    */
    function handleInputChange(e: ChangeEvent<HTMLInputElement>){
        const { name, value } = e.target;                
        setFormData({ ...formData, [name]: value})
    }

    function handleSelectItem(id: number){
        
        if(selectedItems.find(item => item === id)){
            const filteredItems = selectedItems.filter(item => item !== id); 
            setSelectedItems(filteredItems);
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    }

    async function handleSubmit(e: FormEvent ){
        
        e.preventDefault();        
        const { name, email, whatsapp } = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;

        const data = new FormData();
        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('uf', uf);
        data.append('city', city);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('items', items.join(','));
        if(selectedFile){
            data.append('image', selectedFile);
        }
        await api.post('points', data);

        alert('Ponto de coleta criado');

        
        history.push('/');

    }


    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>

                <Link to="/">
                        <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>            

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br />ponto de coleta</h1>
                <Dropzone onFileUploaded={setSelectedFile} />
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                            type="text" 
                            name="name"
                            className="name" 
                            id="name"
                            placeholder="Informe o nome"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="name">E-mail</label>
                            <input 
                                type="email" 
                                name="email"
                                className="email" 
                                id="email"
                                placeholder="E-mail"
                                onChange={handleInputChange}
                            />
                        </div>
                        
                        <div className="field">
                            <label htmlFor="name">Whatsapp</label>
                            <input 
                                type="text" 
                                name="whatsapp"
                                className="whatsapp" 
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>
                
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend> 

                    <Map center={initialPosition} zoom={17} onClick={handleMapCick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select 
                                onChange={handleSelectUf} 
                                name="uf" 
                                id="uf" 
                                value={selectedUf}>
                                <option value="">Selecione o Estado</option>
                                {ufs.map( uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>                            
                        
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select 
                                onChange={handleSelectCity}
                                name="city" 
                                id="city"
                                value={selectedCity}
                                >
                                <option value="">Selecione a Cidade</option>
                                {cities.map( city =>(
                                    <option 
                                        key={city} 
                                        value={city}>{city}</option>
                                ))}
                            </select>
                        </div>                            
                    </div>                    
                </fieldset>
                
                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map( item => (   
                            <li key={item.id} 
                                onClick={ () => handleSelectItem(item.id) } 
                                className={selectedItems.includes(item.id) ? 'selected' : ' ' }
                            >
                                <img src={item.image_url} alt={item.title}/>
                                <span>{item.title}</span>
                            </li>
                        ))}                       
                    </ul>

                </fieldset>
                <button type="submit">Cadastrar ponto de coleta</button>
            </form>

        </div>
    )
}

export default CreatePoint;