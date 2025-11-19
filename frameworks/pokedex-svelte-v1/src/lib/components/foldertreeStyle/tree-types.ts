// types.ts

/**
 * Interfaccia per un singolo nodo nella struttura dati dell'albero.
 */
export interface TreeNodeData {
    id: number;
    name: string;
    depth: number;
    parentId: number | null;
    children: TreeNodeData[];
    isExpanded: boolean;
}

/**
 * Classe utilizzata per costruire i nodi dell'albero.
 * Mantiene la stessa struttura dati dell'interfaccia.
 */
export class TreeDataNode implements TreeNodeData {
    id: number;
    name: string;
    depth: number;
    parentId: number | null;
    children: TreeNodeData[] = [];
    isExpanded: boolean = false;

    constructor(id: number, name: string, depth: number, parentId: number | null = null) {
        this.id = id;
        this.name = name;
        this.depth = depth;
        this.parentId = parentId;
    }

    addChild(childNode: TreeNodeData): void {
        this.children.push(childNode);
    }
}


/**
 * Funzione di utilità per costruire i nodi.
 */
export function createTreeDataNode(
    id: number, name: string, depth: number, parentId: number | null = null): TreeNodeData {
    return {
        id,
        name,
        depth,
        parentId,
        children: [],
        isExpanded: false
    };
}