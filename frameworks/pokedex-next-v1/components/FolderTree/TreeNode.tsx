'use client';
import React from 'react';

import { TreeNodeData } from './tree-types'; // Importa il tipo

/**
 * Definisce le props per il componente TreeNode.
 */
interface TreeNodeProps {
    node: TreeNodeData;
    onToggle: (nodeId: number) => void;
}

const TreeNode: React.FC<TreeNodeProps> = React.memo(({ node, onToggle }) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = node.isExpanded;
    const toggleIcon = hasChildren ? (isExpanded ? '▼' : '►') : '';

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (hasChildren) {
            onToggle(node.id);
        }
    };

    return (
        <div className="tree-node">
            <div className="node-header" onClick={handleToggle}>
                <span className="node-toggle">{toggleIcon}</span>
                <span>{node.name}</span>
            </div>

            {hasChildren && (
                <div className={`node-children-container ${isExpanded ? '' : 'collapsed'}`}>
                    {/* Renderizzazione ricorsiva dei figli, con chiave e props tipizzate */}
                    {isExpanded && node.children.map((child: TreeNodeData) => (
                        <TreeNode 
                            key={child.id} 
                            node={child} 
                            onToggle={onToggle} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
});

export default TreeNode;