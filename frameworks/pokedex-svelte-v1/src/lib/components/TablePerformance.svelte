<script lang="ts">
	// --- STATE MANAGEMENT (Svelte 5 Runes) ---
	// Usiamo $state.raw per le massime prestazioni su array di grandi dimensioni,
	// come suggerito dal primo esempio per questo tipo di benchmark.
	let data: Item[] = $state.raw([]);
	let selected: number | undefined = $state();

	// --- DATA GENERATION ---
	let rowId = 1;

	const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
	const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'white', 'black', 'orange'];
	const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

	function _random(max: number) {
		return Math.round(Math.random() * 1000) % max;
	}

	// Definiamo la classe Item per rappresentare una riga.
	// La sua proprietà `label` è anch'essa $state.raw per permettere aggiornamenti granulari.
	class Item {
		id = rowId++;
		label = $state.raw(
			`${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`
		);
	}

	function buildData(count = 1000): Item[] {
		const data = new Array(count);
		for (let i = 0; i < count; i++) {
			data[i] = new Item();
		}
		return data;
	}

	// --- ACTIONS ---
	const run = () => {
		data = buildData(1000);
		selected = undefined;
	};

	const runLots = () => {
		data = buildData(10000);
		selected = undefined;
	};

	const add = () => {
		data = [...data, ...buildData(1000)];
	};

	const partialUpdate = () => {
		// Svelte 5 con $state.raw gestisce questo in modo molto efficiente.
		// Vengono aggiornati solo i componenti DOM che dipendono dalla label modificata.
		for (let i = 0; i < data.length; i += 10) {
			data[i].label += ' !!!';
		}
	};

	const clear = () => {
		data = [];
		selected = undefined;
	};

	const swapRows = () => {
		if (data.length > 998) {
			const clone = data.slice();
			const tmp = clone[1];
			clone[1] = clone[998];
			clone[998] = tmp;
			data = clone;
		}
	};

	const remove = (itemToRemove: Item) => {
		const index = data.findIndex(d => d.id === itemToRemove.id);
		if (index > -1) {
            // Creiamo un nuovo array senza l'elemento, che è il modo corretto
            // per triggerare l'aggiornamento con le runes.
			data = [...data.slice(0, index), ...data.slice(index + 1)];
		}
	};
</script>

<div class="p-8 font-sans">
	<h1 class="text-2xl font-bold mb-2">Svelte 5 Runes: Performance Benchmark</h1>
	<p class="mb-4">
		Test completo di performance per la manipolazione di un grande numero di righe.
	</p>

	<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
		<button onclick={run} class="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">Crea 1000 righe</button>
		<button onclick={runLots} class="px-4 py-2 bg-orange-700 text-white rounded hover:bg-orange-800">Crea 10,000 righe</button>
		<button onclick={add} class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Aggiungi 1,000 righe</button>
		<button onclick={partialUpdate} class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Aggiorna 1 riga su 10</button>
		<button onclick={swapRows} class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Scambia Righe</button>
		<button onclick={clear} class="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Pulisci Tabella</button>
	</div>

	<div class="overflow-x-auto border border-gray-200 rounded-lg">
		<table class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
				<tr>
					<th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">ID</th>
					<th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
					<th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Azione</th>
				</tr>
			</thead>
			<tbody class="bg-white divide-y divide-gray-200">
				{#each data as row (row.id)}
					<tr class:bg-orange-100={selected === row.id}>
						<td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{row.id}</td>
						<td class="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
							<button class="text-left w-full" onclick={() => (selected = row.id)}>
								{row.label}
							</button>
						</td>
						<td class="px-4 py-2 whitespace-nowrap text-sm text-center">
							<button onclick={() => remove(row)} class="text-red-600 hover:text-red-800 font-bold">
								&times; </button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>