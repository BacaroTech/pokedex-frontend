'use client';
import React from 'react';

import { cn } from '@/lib/utils/cn';

import { TreeNodeData } from './tree-types'; // Importa il tipo

/**
 * Definisce le props per il componente TreeNode.
 */
interface TreeNodeProps {
    node: TreeNodeData;
    onToggle: (nodeId: number) => void;
    isColored: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = React.memo(({ node, onToggle, isColored }) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = node.isExpanded;
    const toggleIcon = hasChildren ? (isExpanded ? '▼' : '►') : '';
    const nodeNameClasses = cn(
        'transition-colors duration-200',
        isColored && 'text-red-600 font-bold' // Applicazione condizionale della classe
    );
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
                <span className={nodeNameClasses}>{node.name}</span>
            </div>

            {hasChildren && (
                <div className={`node-children-container ${isExpanded ? '' : 'collapsed'}`}>
                    {/* Renderizzazione ricorsiva dei figli, con chiave e props tipizzate */}
                    {isExpanded && node.children.map((child: TreeNodeData) => (
                        <TreeNode 
                            key={child.id} 
                            node={child} 
                            onToggle={onToggle} 
                            isColored={isColored}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});

export default TreeNode;