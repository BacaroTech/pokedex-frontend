<script lang="ts">
  import { goto } from '$app/navigation';
  import type { INamedApiResourceList } from "../interfaces/poke-api-ts/NamedApiResourceList";
  import { extractBaseAPI } from "../utils/url-utils";
  const baseUrl = "/api/v2";
  const defaultUrl = "/api/v2/pokemon/";

  let pokemonItems: {name: string, id: number, url: string}[] = [];
  let nextUrl: string | undefined;
  let previousUrl: string | undefined;
  
  const next = () => {
    console.log("click next");
    if (nextUrl) {
        fetchData(nextUrl);
    }
  };
  const back = () => {
    console.log("click back");
    if (previousUrl) {
        fetchData(previousUrl);
    }
  };

  const goToDetail = (url: string) => {
    const split = url.split("/");
    if (split.length > 0) {
      const pokemonId = split[split.length - 2];
      goto(`/detail/${pokemonId}`)
    }
    
  }

  const fetchData = (url: string) => {
    fetch(url)
      .then((response: Response) => {
        return response.json();
      })
      .then((data: INamedApiResourceList) => {
        previousUrl = data.previous && extractBaseAPI(data.previous, baseUrl);
        nextUrl = data.next && extractBaseAPI(data.next, baseUrl);

        pokemonItems = data?.results?.map((a, i) => ({ 
            name: a.name,
            id: i,
            url: a.url
         }));
        console.log(pokemonItems)
      })
      .catch((err) => { console.warn(err)});
  };

  fetchData(defaultUrl);
  
</script>

<div class="px-4 sm:px-6 lg:px-8">
  <div class="flow-root">
    <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <table class="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th>
                <button on:click={back}> BACK </button>
              </th>
              <th
                scope="col"
                class="py-3.5 pl-4 pr-3 text-center text-sm font-bold text-gray-900 sm:pl-0"
              >
                Nome Pokemon
              </th>
              <th>
                <button on:click={next}> NEXT </button>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#each pokemonItems as person (person.id)}
              <tr id={person.name}>
                <td></td>
                <td
                  class="whitespace-nowrap text-center py-5 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
                >
                  {person.name}
                </td>
                
                <td><button on:click={() => goToDetail(person.url)}>Dettaglio</button></td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
