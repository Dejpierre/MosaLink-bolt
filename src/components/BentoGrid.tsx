'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { BentoCard } from '../types';
import { BentoCardComponent } from './BentoCardComponent';
import { Plus, Crown, Move } from 'lucide-react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { ResizableCard } from './ResizableCard';

interface BentoGridProps {
  cards: BentoCard[];
  isPreview?: boolean;
  onCardClick?: (cardId: string) => void;
  className?: string;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  cards,
  isPreview = false,
  onCardClick,
  className = ''
}) => {
  const { currentLayout, updateCard, addCard, userPlan } = useStore();
  const [gridDimensions, setGridDimensions] = useState({ width: 0, height: 0 });
  const [cellSize, setCellSize] = useState(100);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isLayoutChanging, setIsLayoutChanging] = useState(false);
  const [addingCard, setAddingCard] = useState(false);
  const [emptyGridCells, setEmptyGridCells] = useState<{row: number, col: number}[]>([]);
  
  // Calculate grid dimensions on mount and resize
  useEffect(() => {
    setMounted(true);
    
    const calculateDimensions = () => {
      if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        setGridDimensions({ width: rect.width, height: rect.height });
        
        // Calculate cell size based on grid width and columns
        const cols = getGridColumns();
        const gapSize = getGap();
        const totalGapWidth = gapSize * (cols - 1);
        const availableWidth = rect.width - totalGapWidth;
        const calculatedCellSize = Math.floor(availableWidth / cols);
        setCellSize(calculatedCellSize);
      }
    };
    
    calculateDimensions();
    
    const resizeObserver = new ResizeObserver(calculateDimensions);
    if (gridRef.current) {
      resizeObserver.observe(gridRef.current);
    }
    
    window.addEventListener('resize', calculateDimensions);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', calculateDimensions);
    };
  }, [currentLayout]);
  
  // Determine number of columns based on layout
  const getGridColumns = () => {
    switch (currentLayout) {
      case 'mobile': return 2;
      case 'tablet': return 4;
      case 'desktop': default: return 12;
    }
  };
  
  // Determine number of rows based on layout - FIXED TO 6 ROWS MAX
  const getGridRows = () => {
    switch (currentLayout) {
      case 'mobile': return 6;
      case 'tablet': return 6;
      case 'desktop': default: return 6;
    }
  };
  
  // Determine gap based on layout
  const getGap = () => {
    switch (currentLayout) {
      case 'mobile': return 8;
      case 'tablet': return 12;
      case 'desktop': default: return 16;
    }
  };
  
  // Convert card size to column and row span
  const getCardSize = (card: BentoCard) => {
    const [colSpan, rowSpan] = card.size.split('x').map(Number);
    
    // Adapt size based on layout
    if (currentLayout === 'mobile') {
      // On mobile, limit to 2 columns max
      const adaptedColSpan = Math.min(colSpan, 2);
      return { colSpan: adaptedColSpan, rowSpan };
    } else if (currentLayout === 'tablet') {
      // On tablet, limit to 4 columns max
      const adaptedColSpan = Math.min(colSpan, 4);
      return { colSpan: adaptedColSpan, rowSpan };
    } else {
      // On desktop, use normal size but limit to 12 columns max
      // Also ensure minimum size of 2x2
      const minColSpan = Math.max(2, colSpan);
      const minRowSpan = Math.max(2, rowSpan);
      return { 
        colSpan: Math.min(minColSpan, 12), 
        rowSpan: Math.min(minRowSpan, 6) 
      };
    }
  };
  
  // Check for collisions
  const hasCollision = (cardId: string, col: number, row: number, colSpan: number, rowSpan: number): boolean => {
    // Check grid boundaries
    if (col < 0 || row < 0 || col + colSpan > getGridColumns() || row + rowSpan > getGridRows()) {
      return true;
    }
    
    for (const card of cards) {
      if (card.id === cardId || !card.gridPosition) continue;
      
      const { colSpan: cardColSpan, rowSpan: cardRowSpan } = getCardSize(card);
      
      // Check if rectangles overlap
      const overlap = !(
        col >= card.gridPosition.col + cardColSpan || // Right
        col + colSpan <= card.gridPosition.col ||     // Left
        row >= card.gridPosition.row + cardRowSpan || // Bottom
        row + rowSpan <= card.gridPosition.row        // Top
      );
      
      if (overlap) return true;
    }
    
    return false;
  };

  // Intelligent resize function
  const handleIntelligentResize = (cardId: string, newCols: number, newRows: number): boolean => {
    const card = cards.find(c => c.id === cardId);
    if (!card || !card.gridPosition) return false;
    
    const currentCol = card.gridPosition.col;
    const currentRow = card.gridPosition.row;
    
    // Check grid limits
    if (currentCol + newCols > getGridColumns() || currentRow + newRows > getGridRows()) {
      return false;
    }
    
    // Check for collisions
    if (hasCollision(cardId, currentCol, currentRow, newCols, newRows)) {
      return false;
    }
    
    return true;
  };
  
  // Convert cards to React-Grid-Layout format
  const getLayoutItems = () => {
    return cards.map(card => {
      if (!card.gridPosition) return null;
      
      const { colSpan, rowSpan } = getCardSize(card);
      
      return {
        i: card.id,
        x: card.gridPosition.col,
        y: card.gridPosition.row,
        w: colSpan,
        h: rowSpan,
        static: isPreview,
        maxW: getGridColumns(),
        maxH: getGridRows()
      };
    }).filter(Boolean) as GridLayout.Layout[];
  };
  
  // Handle layout change from React-Grid-Layout
  const handleLayoutChange = (layout: GridLayout.Layout[]) => {
    if (isPreview || isLayoutChanging) return;
    
    // Set a flag to prevent multiple updates
    setIsLayoutChanging(true);
    
    // Process layout changes one by one to prevent cascading updates
    const updates = layout.map(item => {
      const card = cards.find(c => c.id === item.i);
      if (card && card.gridPosition) {
        if (card.gridPosition.col !== item.x || card.gridPosition.row !== item.y) {
          return { id: card.id, x: item.x, y: item.y };
        }
      }
      return null;
    }).filter(Boolean);
    
    // Apply updates sequentially
    if (updates.length > 0) {
      // Only update the card that was actually moved by the user
      const update = updates[0];
      if (update) {
        updateCard(update.id, {
          gridPosition: { col: update.x, row: update.y }
        });
      }
    }
    
    // Reset the flag after a short delay
    setTimeout(() => {
      setIsLayoutChanging(false);
    }, 100);
  };

  // Check if a cell is free (not occupied by any card)
  const isCellFree = (row: number, col: number) => {
    if (row >= getGridRows() || col >= getGridColumns()) return false;
    
    // Check if any card occupies this cell
    for (const card of cards) {
      if (!card.gridPosition) continue;
      
      const { colSpan, rowSpan } = getCardSize(card);
      const cardStartCol = card.gridPosition.col;
      const cardEndCol = cardStartCol + colSpan - 1;
      const cardStartRow = card.gridPosition.row;
      const cardEndRow = cardStartRow + rowSpan - 1;
      
      if (col >= cardStartCol && col <= cardEndCol && 
          row >= cardStartRow && row <= cardEndRow) {
        return false;
      }
    }
    
    return true;
  };

  // Function to add a new card at a specific position
  const handleAddCard = async (row: number, col: number) => {
    // Check if the cell is free
    if (!isCellFree(row, col) || addingCard) return;
    
    setAddingCard(true);
    
    try {
      // For desktop, ensure minimum size is 2x2
      const cardSize = currentLayout === 'desktop' ? '2x2' as const : '1x1' as const;
      
      const newCard = {
        title: 'Nouvelle Carte',
        description: 'Cliquez pour éditer cette carte',
        url: '',
        backgroundColor: '#6366f1',
        textColor: '#ffffff',
        size: cardSize,
        gridPosition: { col, row } // Specific position
      };
      
      const result = await addCard(newCard);
      
      if (!result.success) {
        alert(result.error);
      } else {
        // Open editor for the new card
        onCardClick && onCardClick(result.cardId || '');
      }
    } catch (error) {
      console.error("Error adding card:", error);
    } finally {
      setAddingCard(false);
    }
  };

  // Check plan limits
  const canAddMoreCards = () => {
    if (userPlan === 'free') return cards.length < 3;
    if (userPlan === 'starter') return cards.length < 25;
    return true; // Pro plan = unlimited
  };

  // Calculate grid height based on content
  const gridHeight = getGridRows() * cellSize + (getGridRows() - 1) * getGap();

  // Calculate all empty cells for the grid
  useEffect(() => {
    const maxCols = getGridColumns();
    const maxRows = getGridRows();
    const emptyCells: {row: number, col: number}[] = [];
    
    // Check each cell in the grid
    for (let row = 0; row < maxRows; row++) {
      for (let col = 0; col < maxCols; col++) {
        if (isCellFree(row, col)) {
          // For desktop, check if there's enough space for a 2x2 block
          if (currentLayout === 'desktop') {
            // Check if we have a 2x2 space available
            let hasSpace = true;
            for (let r = row; r < row + 2 && r < maxRows; r++) {
              for (let c = col; c < col + 2 && c < maxCols; c++) {
                if (!isCellFree(r, c)) {
                  hasSpace = false;
                  break;
                }
              }
              if (!hasSpace) break;
            }
            
            // Only add this cell if there's enough space for a 2x2 block
            if (hasSpace) {
              emptyCells.push({ row, col });
            }
          } else {
            // For tablet and mobile, just add the free cell
            emptyCells.push({ row, col });
          }
        }
      }
    }
    
    setEmptyGridCells(emptyCells);
  }, [cards, currentLayout]);
  
  // Use fallback values to ensure GridLayout always receives valid props
  const safeGridWidth = gridDimensions.width || 1;
  const safeCellSize = cellSize || 1;

  if (!mounted) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-gray-400">Loading grid...</div>
      </div>
    );
  }
  
  return (
    <div 
      ref={gridRef}
      className={`relative touch-none ${className}`}
      style={{ 
        height: gridHeight,
        minHeight: '300px',
        position: 'relative'
      }}
    >
      {isPreview ? (
        // Preview mode - static grid
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)`,
            gridTemplateRows: `repeat(${getGridRows()}, 1fr)`,
            gap: `${getGap()}px`,
            height: '100%',
            width: '100%'
          }}
        >
          {cards.map((card) => {
            if (!card.gridPosition) return null;
            
            // Get grid span
            const { colSpan, rowSpan } = getCardSize(card);
            
            return (
              <div 
                key={card.id}
                style={{
                  gridColumn: `${card.gridPosition.col + 1} / span ${colSpan}`,
                  gridRow: `${card.gridPosition.row + 1} / span ${rowSpan}`,
                  position: 'relative'
                }}
              >
                <BentoCardComponent
                  card={card}
                  isPreviewMode={true}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <GridLayout
            className="layout"
            layout={getLayoutItems()}
            cols={getGridColumns()}
            rowHeight={safeCellSize}
            width={safeGridWidth}
            margin={[getGap(), getGap()]}
            containerPadding={[0, 0]}
            onLayoutChange={handleLayoutChange}
            isDraggable={!isPreview && currentLayout === 'desktop'}
            isResizable={false}  // Disable RGL's built-in resize
            compactType={null}
            preventCollision={true}
            useCSSTransforms={true}
            draggableHandle=".drag-handle"
            maxRows={getGridRows()}
            resizeHandles={[]}  // Remove all RGL resize handles
          >
            {cards.map((card) => {
              if (!card.gridPosition) return null;
              
              return (
                <div key={card.id} className="h-full w-full">
                  <ResizableCard
                    card={card}
                    cellSize={safeCellSize}
                    gap={getGap()}
                    maxCols={getGridColumns()}
                    maxRows={getGridRows()}
                    onIntelligentResize={handleIntelligentResize}
                    onEdit={() => onCardClick && onCardClick(card.id)}
                  />
                </div>
              );
            })}
          </GridLayout>
          
          {/* Empty cell grid for adding new cards */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)`,
              gridTemplateRows: `repeat(${getGridRows()}, 1fr)`,
              gap: `${getGap()}px`,
              zIndex: 5
            }}
          >
            {emptyGridCells.map(({ row, col }) => {
              const isHovered = hoveredCell?.row === row && hoveredCell?.col === col;
              
              return (
                <div
                  key={`cell-${row}-${col}`}
                  style={{
                    gridColumn: col + 1,
                    gridRow: row + 1,
                    position: 'relative'
                  }}
                  className="cursor-pointer pointer-events-auto"
                  onMouseEnter={() => setHoveredCell({ row, col })}
                  onMouseLeave={() => setHoveredCell(null)}
                  onClick={() => handleAddCard(row, col)}
                >
                  {/* Empty cell with hover effect */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: isHovered ? 1 : 0,
                      scale: isHovered ? 1 : 0.8
                    }}
                    className="absolute inset-0 rounded-lg border-2 border-dashed border-indigo-500/40 bg-indigo-500/10 flex items-center justify-center"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 rounded-full ${
                        canAddMoreCards()
                          ? 'bg-indigo-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {canAddMoreCards() ? (
                        <Plus size={16} />
                      ) : (
                        <Crown size={16} />
                      )}
                    </motion.div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default BentoGrid;