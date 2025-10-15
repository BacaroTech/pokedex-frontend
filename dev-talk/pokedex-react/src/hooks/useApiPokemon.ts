import { useState } from 'react';

import {
  INamedApiResourceList,
} from '../interfaces/poke-api-ts/NamedApiResourceList';
import { extractBaseAPI } from '../utils/url-utils';
import useBaseApi from './useBaseApi';

const baseUrl = "/api/v2";
const action = "pokemon";
//const baseUrl = "https://pokeapi.co/api/v2/pokemon/";
//const baseUrl = "http://localhost:5173/api/v2/pokemon/";
const useApiPokemon = () => {
  const [url, setUrl] = useState(`${baseUrl}/${action}`);
  const { data, loading, error } = useBaseApi<INamedApiResourceList>(
    url, //endpoint url
    { timeout: 5000 } //extra parameter just for example
  );

  const back = () => {
    
    if(data?.previous) {
      setUrl(extractBaseAPI(data.previous, baseUrl));
    }

  }
  const next = () => {
    if (data?.next) {
      setUrl(extractBaseAPI(data.next, baseUrl));
    }
  }


  return { data, loading, error, back, next };
};

export default useApiPokemon;
