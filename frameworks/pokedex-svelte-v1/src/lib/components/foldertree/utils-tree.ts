import {
  createTreeDataNode,
  type TreeNodeData,
} from './tree-types';

let nodeCounter = 0;
function generateTreeData(
    maxNodes: number,
    maxDepth: number,
    parentId: number | null = null,
    currentDepth: number = 0
  ): TreeNodeData | null {
    if (currentDepth >= maxDepth) {
    //   console.log(`Svelte Max depth ${maxDepth} reached at node ${parentId}`);

      return  null;
    }

    nodeCounter++;
    const node = createTreeDataNode(
      nodeCounter,
      `Node ${nodeCounter} (Depth ${currentDepth})`,
      currentDepth,
      parentId
    );

    const numChildren = maxNodes; //Math.floor(Math.random() * maxNodes) + 1;
    // console.log(`Generating ${numChildren} children for node ${node.id} at depth ${currentDepth}`);
    for (let i = 0; i < numChildren; i++) {
      const child = generateTreeData(
        maxNodes,
        maxDepth,
        node.id,
        currentDepth + 1
      );
      if (child) {
        node.children.push(child);
      }
    }
    return node;
  }

  export function generateTree(maxNodesPerLevel: number, maxDepth: number) {

    const tree = generateTreeData(maxNodesPerLevel, maxDepth);

    return { tree, totalNodes: nodeCounter };

  }