import { useState, useCallback, useEffect } from 'react';

interface Tile {
  id: string;
  value: number;
  position: [number, number];
  isNew?: boolean;
  isMerging?: boolean;
}

type Direction = 'up' | 'down' | 'left' | 'right';

const GRID_SIZE = 4;

const generateId = () => Math.random().toString(36).substr(2, 9);

const getInitialTiles = (): Tile[] => {
  const tiles: Tile[] = [];
  for (let i = 0; i < 2; i++) {
    tiles.push(createRandomTile(tiles));
  }
  return tiles;
};

const createRandomTile = (existingTiles: Tile[]): Tile => {
  const emptyCells = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!existingTiles.some(tile => tile.position[0] === row && tile.position[1] === col)) {
        emptyCells.push([row, col]);
      }
    }
  }
  
  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  return {
    id: generateId(),
    value: Math.random() < 0.9 ? 2 : 4,
    position: [row, col],
    isNew: true
  };
};

const moveInDirection = (tiles: Tile[], direction: Direction): [Tile[], number] => {
  let score = 0;
  let newTiles = [...tiles];
  const isHorizontal = direction === 'left' || direction === 'right';
  const isReverse = direction === 'right' || direction === 'down';

  // Sort tiles for proper merging
  newTiles.sort((a, b) => {
    const posA = isHorizontal ? a.position[1] : a.position[0];
    const posB = isHorizontal ? b.position[1] : b.position[0];
    return isReverse ? posB - posA : posA - posB;
  });

  // Process each row/column
  for (let i = 0; i < GRID_SIZE; i++) {
    let line = newTiles.filter(tile => 
      (isHorizontal ? tile.position[0] : tile.position[1]) === i
    );

    // Merge tiles
    const merged: Tile[] = [];
    while (line.length > 0) {
      const current = line.shift()!;
      const next = line[0];
      
      if (next && current.value === next.value) {
        merged.push({
          id: generateId(),
          value: current.value * 2,
          position: current.position,
          isMerging: true
        });
        score += current.value * 2;
        line.shift();
      } else {
        merged.push(current);
      }
    }

    // Update positions
    merged.forEach((tile, index) => {
      const pos = isReverse ? GRID_SIZE - 1 - index : index;
      tile.position = isHorizontal ? [i, pos] : [pos, i];
    });

    // Update tiles array
    newTiles = newTiles.filter(tile => 
      (isHorizontal ? tile.position[0] : tile.position[1]) !== i
    ).concat(merged);
  }

  return [newTiles, score];
};

export default function useGame() {
  const [tiles, setTiles] = useState<Tile[]>(getInitialTiles);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('2048-best-score');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('2048-best-score', score.toString());
    }
  }, [score, bestScore]);

  const checkGameOver = useCallback((currentTiles: Tile[]) => {
    if (currentTiles.length < GRID_SIZE * GRID_SIZE) return false;

    // Check for possible moves
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const current = currentTiles.find(
          t => t.position[0] === row && t.position[1] === col
        );
        if (!current) continue;

        // Check adjacent cells
        const adjacent = [
          [row - 1, col], [row + 1, col],
          [row, col - 1], [row, col + 1]
        ];

        for (const [r, c] of adjacent) {
          if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) continue;
          const neighbor = currentTiles.find(
            t => t.position[0] === r && t.position[1] === c
          );
          if (!neighbor || neighbor.value === current.value) return false;
        }
      }
    }

    return true;
  }, []);

  const moveTiles = useCallback((direction: Direction) => {
    const [newTiles, moveScore] = moveInDirection(tiles, direction);
    
    // Check if tiles actually moved
    const hasMoved = JSON.stringify(tiles.map(t => t.position)) !== 
                    JSON.stringify(newTiles.map(t => t.position));
    
    if (hasMoved) {
      // Remove animation flags
      const cleanTiles = newTiles.map(tile => ({
        ...tile,
        isNew: false,
        isMerging: false
      }));

      // Add new tile
      const finalTiles = [...cleanTiles, createRandomTile(cleanTiles)];
      
      setTiles(finalTiles);
      setScore(score + moveScore);
      
      // Check for game over
      if (checkGameOver(finalTiles)) {
        setIsGameOver(true);
      }
    }
  }, [tiles, score, checkGameOver]);

  const resetGame = useCallback(() => {
    setTiles(getInitialTiles());
    setScore(0);
    setIsGameOver(false);
  }, []);

  return {
    tiles,
    score,
    bestScore,
    isGameOver,
    resetGame,
    moveTiles
  };
}