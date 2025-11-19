<script lang="ts">
  import { onMount } from "svelte";
  import TreeNode from "./TreeNode.svelte";
  import { type TreeNodeData, createTreeDataNode } from "./tree-types";
  import { generateTree } from "./utils-tree";
  // Assumi che tu abbia importato il file CSS nella tua App principale o lo abbia aggiunto qui:
  // import './Tree.css';

  let nodeCounter = 0; // Variabile interna non reattiva

  // --- Stati Runes ---
  let maxNodesPerLevel = $state(5);
  let maxDepth = $state(4);
  let treeData = $state<TreeNodeData | null>(null);

  // --- Logica di Generazione e Manipolazione (Tipizzata) ---


  function findNodeByIdRecursive(
    id: number,
    currentNode: TreeNodeData | null
  ): TreeNodeData | null {
    if (!currentNode) return null;
    if (currentNode.id === id) return currentNode;

    for (const child of currentNode.children) {
      const found = findNodeByIdRecursive(id, child);
      if (found) return found;
    }
    return null;
  }

  function updateExpansionRecursive(
    node: TreeNodeData | null,
    expand: boolean
  ): void {
    if (node) {
      node.isExpanded = expand;
      node.children.forEach((child) => updateExpansionRecursive(child, expand));
    }
  }

  // --- Handler e Logica del Componente ---

  const regenerateTree = () => {
    // La mutazione di una variabile $state in Svelte innesca il re-render
    nodeCounter = 0;
    // const builder = new Promise((resolve) => {
    //   // Usa setTimeout per evitare il blocco dell'UI durante la generazione
      
    //     const {tree, totalNodes} = generateTree(maxNodesPerLevel, maxDepth);
    //     treeData = tree;
    //     nodeCounter = totalNodes;
    //     resolve(true);
      
    // });
    // builder.then();
        const {tree, totalNodes} = generateTree(maxNodesPerLevel, maxDepth);
        treeData = tree;
        nodeCounter = totalNodes;
    // treeData = generateTreeData(maxNodesPerLevel, maxDepth);
    console.log(`Albero rigenerato. Nodi totali: ${nodeCounter}`);
  };

  const handleToggleNode = (nodeId: number) => {
    if (!treeData) return;

    // In Svelte, possiamo trovare il nodo e mutarlo direttamente
    // se l'oggetto treeData è stato dichiarato con $state.
    const nodeToToggle = findNodeByIdRecursive(nodeId, treeData);

    if (nodeToToggle) {
      // MUTAZIONE DIRETTA: Svelte 5 gestisce automaticamente la reattività
      // senza la necessità di clonare l'oggetto radice come in React.
      nodeToToggle.isExpanded = !nodeToToggle.isExpanded;
    }
  };

  const handleExpandCollapseAll = (expand: boolean) => {
    if (!treeData) return;

    // Mutiamo direttamente l'albero nello stato reattivo
    updateExpansionRecursive(treeData, expand);
  };

  // --- Effetti (Equivalente di useEffect con dipendenze) ---
  // Esegue la rigenerazione all'inizio
  // $effect(() => {
  //   regenerateTree();
  // });

  onMount(() => {
    regenerateTree()
  })
</script>

<div class="dynamic-tree-app">
  <h1>Dynamic Tree (Svelte 5 Runes)</h1>
  <div class="controls">
    <label for="numNodes">Max Nodes per Livello:</label>
    <input
      type="range"
      id="numNodes"
      min="2"
      max="10"
      bind:value={maxNodesPerLevel}
      step="1"
    />
    <span id="numNodesValue">{maxNodesPerLevel}</span>

    <label for="maxDepth">Max Depth:</label>
    <input
      type="range"
      id="maxDepth"
      min="2"
      max="7"
      bind:value={maxDepth}
      step="1"
    />
    <span id="maxDepthValue">{maxDepth}</span>

    <button onclick={regenerateTree}>Regenerate Tree</button>
    <button onclick={() => handleExpandCollapseAll(true)}>Expand All</button>
    <button onclick={() => handleExpandCollapseAll(false)}>Collapse All</button>
  </div>

  <div class="tree-container">
    {#if treeData}
      <TreeNode node={treeData} onToggle={handleToggleNode} />
    {:else}
      <p>Generating tree...</p>
    {/if}
  </div>
</div>

<style>


  h1 {
    margin-bottom: 20px;
    color: #fff;
  }

  .controls {
    margin-bottom: 20px;
    display: flex;
    gap: 15px;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 10px 20px;
    border-radius: 8px;
    z-index: 100;
  }

  .controls label {
    margin-right: 5px;
  }

  .controls input[type="range"] {
    width: 150px;
  }

  .controls button {
    padding: 8px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .controls button:hover {
    background-color: #0056b3;
  }
  
.tree-container {
    width: 90%;
    max-width: 800px;
    height: 600px;
    /* Altezza fissa con scroll */
    overflow-y: auto;
    border: 2px solid #555;
    background-color: #0d0d0d;
    padding: 10px;
}

</style>
