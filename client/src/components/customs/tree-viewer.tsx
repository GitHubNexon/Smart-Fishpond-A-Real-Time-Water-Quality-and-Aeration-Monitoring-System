//src/components/customs/tree-viewer.tsx
'use client';
import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TreeNode {
  id: string;
  name: string;
  value?: any;
  children?: TreeNode[];
  metadata?: {
    type?: 'added' | 'removed' | 'modified' | 'unchanged';
    isRoot?: boolean;
  };
}

interface TreeViewerProps {
  data: any;
  title?: string;
  variant?: 'default' | 'diff';
  className?: string;
}

// Convert JSON object to tree structure
function jsonToTree(
  obj: any,
  parentKey = 'root',
  type?: 'added' | 'removed' | 'modified',
): TreeNode[] {
  if (obj === null || obj === undefined) {
    return [
      {
        id: parentKey,
        name: parentKey,
        value: String(obj),
        metadata: { type },
      },
    ];
  }

  if (typeof obj !== 'object') {
    return [
      {
        id: parentKey,
        name: parentKey,
        value: String(obj),
        metadata: { type },
      },
    ];
  }

  if (Array.isArray(obj)) {
    return obj.map((item, index) => {
      const key = `${parentKey}[${index}]`;
      if (typeof item === 'object' && item !== null) {
        return {
          id: key,
          name: `[${index}]`,
          children: jsonToTree(item, key, type),
          metadata: { type },
        };
      }
      return {
        id: key,
        name: `[${index}]`,
        value: String(item),
        metadata: { type },
      };
    });
  }

  return Object.entries(obj).map(([key, value]) => {
    const nodeId = `${parentKey}.${key}`;
    if (typeof value === 'object' && value !== null) {
      return {
        id: nodeId,
        name: key,
        children: jsonToTree(value, nodeId, type),
        metadata: { type },
      };
    }
    return {
      id: nodeId,
      name: key,
      value: String(value),
      metadata: { type },
    };
  });
}

export default function TreeViewer({
  data,
  title,
  variant = 'default',
  className,
}: TreeViewerProps) {
  const treeData: TreeNode[] = React.useMemo(() => {
    const nodes = jsonToTree(data, title || 'root');
    return [
      {
        id: 'root',
        name: title || 'Data',
        children: nodes,
        metadata: { isRoot: true },
      },
    ];
  }, [data, title]);

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'added':
        return 'text-green-600 dark:text-green-400';
      case 'removed':
        return 'text-red-600 dark:text-red-400';
      case 'modified':
        return 'text-amber-600 dark:text-amber-400';
      default:
        return 'text-foreground';
    }
  };

  const getTypeBg = (type?: string) => {
    switch (type) {
      case 'added':
        return 'bg-green-50 dark:bg-green-950/20';
      case 'removed':
        return 'bg-red-50 dark:bg-red-950/20';
      case 'modified':
        return 'bg-amber-50 dark:bg-amber-950/20';
      default:
        return '';
    }
  };

  return (
    <div className={cn('font-mono text-sm', className)}>
      {treeData.map((node) => (
        <TreeNodeComponent
          key={node.id}
          node={node}
          level={0}
          getTypeColor={getTypeColor}
          getTypeBg={getTypeBg}
          variant={variant}
        />
      ))}
    </div>
  );
}

interface TreeNodeComponentProps {
  node: TreeNode;
  level: number;
  getTypeColor: (type?: string) => string;
  getTypeBg: (type?: string) => string;
  variant: 'default' | 'diff';
}

function TreeNodeComponent({
  node,
  level,
  getTypeColor,
  getTypeBg,
  variant,
}: TreeNodeComponentProps) {
  const [isOpen, setIsOpen] = useState(true);
  const isFolder = !!node.children && node.children.length > 0;
  const type = node.metadata?.type;
  const isRoot = node.metadata?.isRoot;

  return (
    <div className={cn('select-none', getTypeBg(type))}>
      <div
        className={cn(
          'flex items-start gap-2 py-1 px-2 hover:bg-accent/50 rounded transition-colors',
          isFolder && 'cursor-pointer',
          isRoot && 'font-semibold',
        )}
        onClick={() => isFolder && setIsOpen(!isOpen)}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {isFolder ? (
          <span className="mt-0.5 flex-shrink-0">
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        ) : (
          <span className="w-4 flex-shrink-0" />
        )}

        <div className="flex-1 min-w-0">
          <span className={cn('break-all', getTypeColor(type))}>
            {node.name}
            {!isFolder && node.value !== undefined && (
              <>
                <span className="text-muted-foreground mx-2">:</span>
                <span className="text-primary font-normal">{node.value}</span>
              </>
            )}
          </span>
        </div>

        {variant === 'diff' && type && (
          <span
            className={cn(
              'text-xs px-2 py-0.5 rounded-full flex-shrink-0',
              type === 'added' &&
                'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
              type === 'removed' &&
                'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
              type === 'modified' &&
                'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
            )}
          >
            {type}
          </span>
        )}
      </div>

      {isFolder &&
        isOpen &&
        node.children?.map((child) => (
          <TreeNodeComponent
            key={child.id}
            node={child}
            level={level + 1}
            getTypeColor={getTypeColor}
            getTypeBg={getTypeBg}
            variant={variant}
          />
        ))}
    </div>
  );
}
