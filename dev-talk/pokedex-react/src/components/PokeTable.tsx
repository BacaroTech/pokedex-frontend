import useApiPokemon from '../hooks/useApiPokemon';

export const PokeTable = () => {
    
    const { data, back, next } = useApiPokemon();

    const people = data?.results?.map((a) => ({ name: a.name }));

 
    return (
        <>
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th>
                                            <button onClick={back}>
                                                BACK
                                            </button>
                                        </th>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-center text-sm font-bold text-gray-900 sm:pl-0">
                                            Nome Pokemon
                                        </th>
                                        <th>
                                            <button onClick={next}>
                                                NEXT
                                            </button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {people?.map((person) => (
                                        <tr key={person.name}>
                                            <td></td>
                                            <td className="whitespace-nowrap text-center py-5 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                {person.name}
                                            </td>
                                            <td></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}