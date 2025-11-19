import {
  TreeDataNode,
  TreeNodeData,
} from './tree-types';

let nodeCounter = 0;
function generateTreeData(
    maxNodes: number,
    maxDepth: number,
    parentId: number | null = null,
    currentDepth: number = 0
): TreeNodeData | null {
    if (currentDepth >= maxDepth) {

        return null;
    }

    nodeCounter++;
    const node = new TreeDataNode(
        nodeCounter,
        `Node ${nodeCounter} (Depth ${currentDepth})`,
        currentDepth,
        parentId
    );

    const numChildren = maxNodes; //Math.floor(Math.random() * maxNodes) + 1;
    for (let i = 0; i < numChildren; i++) {
        const child = generateTreeData(maxNodes, maxDepth, node.id, currentDepth + 1);
        if (child) {
            node.addChild(child);
            //  node.children.push(child);
        }
    }
    return node;
}

  export function generateTree(maxNodesPerLevel: number, maxDepth: number) {

    const tree = generateTreeData(maxNodesPerLevel, maxDepth);

    return { tree, totalNodes: nodeCounter };

  }