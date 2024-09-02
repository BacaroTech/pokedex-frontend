import { useState } from 'react';

import {
  INamedApiResourceList,
} from '../interfaces/poke-api-ts/NamedApiResourceList';
import useBaseApi from './useBaseApi';

const baseUrl = "/api/v2/pokemon/";
const useApiPokemon = () => {
  const [url, setUrl] = useState(baseUrl);
  const { data, loading, error } = useBaseApi<INamedApiResourceList>(
    url, //endpoint url
    { timeout: 5000 } //extra parameter just for example
  );

  const back = () => {
    
    if(data?.previous) {
      setUrl(data?.previous);
    }

  }
  const next = () => {
    if (data?.next) {
      setUrl(data.next);
    }
  }


  return { data, loading, error, back, next };
};

export default useApiPokemon;