import { PokeFooter } from '../components/PokeFooter';
import { PokeHeader } from '../components/PokeHeader';
import { PokeTable } from '../components/PokeTable';

type Props = Record<string, unknown>

export const PokemonListPage = (props: Props) => {
    return (
        <>
            <PokeHeader />

            <div>
                <PokeTable />
            </div>
            <PokeFooter />
        </>
    )
}