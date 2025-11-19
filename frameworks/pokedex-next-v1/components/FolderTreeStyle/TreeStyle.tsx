'use client';
import './Tree.css'; // Assumi che questo file sia disponibile

// Tree.tsx
import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { TreeNodeData } from './tree-types'; // Importa i tipi
import { generateTree } from './tree-utils';
import TreeNode from './TreeNodeSyle';

let nodeCounter = 0; // Contatore globale

function updateNodeExpansionRecursive(node: TreeNodeData | null, expand: boolean): void {
    if (node) {
        node.isExpanded = expand;
        node.children.forEach(child => updateNodeExpansionRecursive(child, expand));
    }
}

function findNodeByIdRecursive(id: number, currentNode: TreeNodeData | null): TreeNodeData | null {
    if (!currentNode) return null;
    if (currentNode.id === id) return currentNode;

    for (const child of currentNode.children) {
        const found = findNodeByIdRecursive(id, child);
        if (found) return found;
    }
    return null;
}

// --- Componente React Principale ---
const DynamicTree: React.FC = () => {
    // Stato tipizzato. treeData è di tipo TreeNodeData o null.
    const [maxNodesPerLevel, setMaxNodesPerLevel] = useState<number>(5);
    const [maxDepth, setMaxDepth] = useState<number>(4);
    const [treeData, setTreeData] = useState<TreeNodeData | null>(null);
    const [isColorToggled, setIsColorToggled] = useState<boolean>(false); 

    const generateAndSetTree = useCallback(() => {
        console.log(`MAIN GENERATING new tree with maxNodesPerLevel=${maxNodesPerLevel}, maxDepth=${maxDepth}`);
        nodeCounter = 0;
        const {tree, totalNodes} = generateTree(maxNodesPerLevel, maxDepth);
        nodeCounter = totalNodes
        setTreeData(tree);
        console.log(`Albero rigenerato. Nodi totali: ${nodeCounter}`);
        console.log(`Albero newTree: ${tree}`);
    }, [maxNodesPerLevel, maxDepth]);

    useEffect(() => {
        generateAndSetTree();
    }, []);

    useEffect(() => {
        console.log("tree", treeData);
    }, [treeData]);
    // --- Componente DynamicTree modificato ---

    const handleToggleNode = useCallback((nodeId: number) => {
        if (!treeData) return;

        // Usa la funzione di aggiornamento dello stato per garantire l'immutabilità
        setTreeData(prevTreeData => {
            if (!prevTreeData) return null;

            // Creare una copia profonda non è sempre necessario, ma cloniamo
            // l'oggetto radice per innescare un re-render del componente principale.
            const newTreeData: TreeNodeData = JSON.parse(JSON.stringify(prevTreeData));

            // Troviamo il nodo da mutare sulla COPIA
            const nodeToToggle = findNodeByIdRecursive(nodeId, newTreeData);

            if (nodeToToggle) {
                nodeToToggle.isExpanded = !nodeToToggle.isExpanded;
                return newTreeData; // Restituiamo il nuovo stato mutato/clonato
            }
            return prevTreeData; // Nessun cambiamento
        });
    }, [treeData]);

    const handleExpandCollapseAll = (expand: boolean) => {
        if (!treeData) return;

        // Cloniamo l'oggetto radice
        const newTreeData: TreeNodeData = JSON.parse(JSON.stringify(treeData));
        updateNodeExpansionRecursive(newTreeData, expand);
        setTreeData(newTreeData);
    };

    return (
        <div className="dynamic-tree-app">
            <h1>Dynamic Tree (React + TypeScript)</h1>
            <div className="controls">
                <div className="flex items-center gap-2 bg-gray-700 p-2 rounded-lg">
                    <input 
                        type="checkbox" 
                        id="colorToggle" 
                        checked={isColorToggled} 
                        onChange={() => setIsColorToggled(!isColorToggled)}
                        className="h-4 w-4 text-red-600 bg-gray-900 border-gray-600 rounded focus:ring-red-500"
                    /> 
                    <label htmlFor="colorToggle" className="text-sm font-medium">
                        Colore Rosso Condizionale (text-red-600)
                    </label>
                </div>
                {/* Controllo Max Nodes per Livello */}
                <label htmlFor="numNodes">Max Nodes per Livello:</label>
                <input
                    type="range"
                    id="numNodes"
                    min="2"
                    max="10"
                    value={maxNodesPerLevel}
                    step="1"
                    // e: React.ChangeEvent<HTMLInputElement>
                    onChange={(e) => setMaxNodesPerLevel(parseInt(e.target.value))}
                />
                <span id="numNodesValue">{maxNodesPerLevel}</span>

                {/* Controllo Max Depth */}
                <label htmlFor="maxDepth">Max Depth:</label>
                <input
                    type="range"
                    id="maxDepth"
                    min="2"
                    max="7"
                    value={maxDepth}
                    step="1"
                    onChange={(e) => setMaxDepth(parseInt(e.target.value))}
                />
                <span id="maxDepthValue">{maxDepth}</span>

                {/* Pulsanti di controllo */}
                <button onClick={generateAndSetTree}>Regenerate Tree</button>
                <button onClick={() => handleExpandCollapseAll(true)}>Expand All</button>
                <button onClick={() => handleExpandCollapseAll(false)}>Collapse All</button>
            </div>

            <div className="tree-container">
                {treeData ? (
                    <TreeNode 
                        node={treeData}
                     onToggle={handleToggleNode}
                     isColored={isColorToggled}
                      />
                ) : (
                    <p>Generating tree...</p>
                )}
            </div>
        </div>
    );
};

export default DynamicTree;