// App.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import PokemonList from './Components/PokemonList';
import PokemonInfo from './Components/PokemonInfo';
import './Components/style.css';

const Main = () => {
    const [pokeData, setPokeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon/");
    const [nextUrl, setNextUrl] = useState();
    const [prevUrl, setPrevUrl] = useState();
    const [pokeDex, setPokeDex] = useState();

    const pokeFun = async () => {
        setLoading(true);
        const limit = 9; 
        let offset = 0;
    
        if (nextUrl) {
            const urlParams = new URLSearchParams(nextUrl.split('?')[1]);
            offset = parseInt(urlParams.get('offset'));
        }
    
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`);
        setNextUrl(res.data.next);
        setPrevUrl(res.data.previous);
        getPokemon(res.data.results);
        setLoading(false);
    }

    const getPokemon = async (res) => {
        const pokemonDetails = await Promise.all(res.map(async (item) => {
            const result = await axios.get(item.url);
            return result.data;
        }));
        setPokeData(pokemonDetails); 
    }

    useEffect(() => {
        pokeFun();
    }, [url]);

    return (
    <div>
        <header>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/pokemons">Pokemons</a></li>
                     <li><a href="/login">Login</a></li>
                </ul>
                </nav>
            </header>
            <div className="container">
                <div className="left-content">
                    <PokemonList pokemon={pokeData} loading={loading} infoPokemon={(poke) => setPokeDex(poke)} />
                    <div className="btn-group">
                        {prevUrl && <button onClick={() => {
                            setPokeData([]);
                            setUrl(prevUrl);
                        }}>Previous</button>}
                        {nextUrl && <button onClick={() => {
                            setPokeData([]);
                            setUrl(nextUrl);
                        }}>Next</button>}
                    </div>
                </div>
                <div className="right-content">
                    <PokemonInfo data={pokeDex} />
                </div>
            </div>
        </div>
    );
}

export default Main;