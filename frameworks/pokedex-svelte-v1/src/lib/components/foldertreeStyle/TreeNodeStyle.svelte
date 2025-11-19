<script lang="ts">
  import { type TreeNodeData } from "./tree-types";
  import Self from "./TreeNodeStyle.svelte";
  // Il componente non ha bisogno di reattività interna per 'node',
  // ma solo di ricevere il dato tipizzato.
  let {
    node,
    onToggle,
    toggleColor = false
  }: { 
    node: TreeNodeData; 
    onToggle: (nodeId: number) => void, 
    toggleColor?: boolean

   } = $props();


  const hasChildren = node.children && node.children.length > 0;
  const toggleIcon = hasChildren ? (node.isExpanded ? "▼" : "►") : "";

  // Non è necessario usare useCallback, la reattività di Svelte è più efficiente
  const handleToggle = (e: MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      // Deleghiamo la logica di mutazione dello stato al componente padre
      onToggle(node.id);
    }
  };
  const handlePress = (e: KeyboardEvent) => {
    if (!hasChildren) return;

    const key = e.key;
    if (key === "Enter" || key === " " || key === "Spacebar") {
      e.preventDefault();
      e.stopPropagation();
      onToggle(node.id);
    }
  };
</script>

<div class="tree-node">
  <div
    class="node-header"
    onclick={handleToggle}
    onkeydown={handlePress}
    aria-pressed="true"
    tabindex="0"
    role="button"
  >
    <span class="node-toggle">{toggleIcon}</span>
    <span 
    class:text-red-600={toggleColor}
    >{node.name}</span>
  </div>

  {#if hasChildren && node.isExpanded}
    <div class="node-children-container" class:collapsed={!node.isExpanded}>
      {#each node.children as child}
        <Self {onToggle} node={child} {toggleColor} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .tree-node {
    display: flex;
    flex-direction: column;
  }

  .node-header {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 5px 0;
    white-space: nowrap; /* Impedisce il ritorno a capo */
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .node-header:hover {
    background-color: #333;
  }

  .node-toggle {
    display: inline-block;
    width: 1em;
    text-align: center;
    margin-right: 5px;
    font-weight: bold;
    color: #007bff;
  }

  .node-children-container {
    display: flex;
    flex-direction: column;
    padding-left: 15px; /* Indentazione per i figli */
  }
  .node-children-container.collapsed {
    display: none;
  }
</style>
