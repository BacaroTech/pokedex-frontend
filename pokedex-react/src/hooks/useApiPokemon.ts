import {
  INamedApiResourceList,
} from '../interfaces/poke-api-ts/NamedApiResourceList';
import useBaseApi from './useBaseApi';

const useApiPokemon = () => {
    const { data, loading, error } = useBaseApi<INamedApiResourceList>(
        "/api/v2/pokemon/", //endpoint url
        { timeout: 5000 } //extra parameter just for example
      );


    return { data, loading, error };
};

export default useApiPokemon;