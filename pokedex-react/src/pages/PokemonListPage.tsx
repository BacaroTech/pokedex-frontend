import { PokeFooter } from '../components/PokeFooter';
import { PokeHeader } from '../components/PokeHeader';
import { PokeTable } from '../components/PokeTable';

export const PokemonListPage = () => {
    
    return (
        <>
            <PokeHeader />

            <div className="mx-auto px-20">
                <PokeTable />
            </div>
            <PokeFooter />
        </>
    )
}