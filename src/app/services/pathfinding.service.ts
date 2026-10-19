import { Injectable } from '@angular/core';

export interface GridPosition {
  row: number;
  col: number;
}

export type GridMatrix = number[][];

@Injectable({
  providedIn: 'root',
})
export class PathfindingService {
  private readonly directions: GridPosition[] = [
    { row: 1, col: 0 },
    { row: -1, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: -1 },
  ];

  findPath(grid: GridMatrix, start: GridPosition, goal: GridPosition): GridPosition[] {
    if (!this.isInsideGrid(grid, start) || !this.isInsideGrid(grid, goal)) {
      return [];
    }

    if (this.isBlocked(grid, start) || this.isBlocked(grid, goal)) {
      return [];
    }

    const openSet: GridPosition[] = [start];
    const closedSet = new Set<string>();
    const cameFrom = new Map<string, GridPosition | null>();
    const gScore = new Map<string, number>([[this.key(start), 0]]);
    const fScore = new Map<string, number>([[this.key(start), this.heuristic(start, goal)]]);

    while (openSet.length > 0) {
      openSet.sort((a, b) => {
        const aScore = fScore.get(this.key(a)) ?? Number.POSITIVE_INFINITY;
        const bScore = fScore.get(this.key(b)) ?? Number.POSITIVE_INFINITY;
        return aScore - bScore;
      });

      const current = openSet.shift()!;
      const currentKey = this.key(current);

      if (this.isSamePosition(current, goal)) {
        return this.reconstructPath(cameFrom, current);
      }

      if (closedSet.has(currentKey)) {
        continue;
      }

      closedSet.add(currentKey);

      for (const direction of this.directions) {
        const next: GridPosition = {
          row: current.row + direction.row,
          col: current.col + direction.col,
        };

        if (!this.isInsideGrid(grid, next) || this.isBlocked(grid, next)) {
          continue;
        }

        const nextKey = this.key(next);

        if (closedSet.has(nextKey)) {
          continue;
        }

        const tentativeGScore = (gScore.get(currentKey) ?? Number.POSITIVE_INFINITY) + 1;
        const existingGScore = gScore.get(nextKey);

        if (existingGScore === undefined || tentativeGScore < existingGScore) {
          cameFrom.set(nextKey, current);
          gScore.set(nextKey, tentativeGScore);
          fScore.set(nextKey, tentativeGScore + this.heuristic(next, goal));

          const existsInOpen = openSet.some((position) => this.isSamePosition(position, next));
          if (!existsInOpen) {
            openSet.push(next);
          }
        }
      }
    }

    return [];
  }

  private isBlocked(grid: GridMatrix, position: GridPosition): boolean {
    return grid[position.row]?.[position.col] === 1;
  }

  private isInsideGrid(grid: GridMatrix, position: GridPosition): boolean {
    return position.row >= 0 && position.col >= 0 && position.row < grid.length && position.col < grid[0].length;
  }

  private heuristic(a: GridPosition, b: GridPosition): number {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
  }

  private reconstructPath(cameFrom: Map<string, GridPosition | null>, current: GridPosition): GridPosition[] {
    const totalPath: GridPosition[] = [current];
    let cursor: GridPosition | null = current;

    while (cursor) {
      const next = cameFrom.get(this.key(cursor));
      if (!next) {
        break;
      }
      totalPath.push(next);
      cursor = next;
    }

    return totalPath.reverse();
  }

  private key(position: GridPosition): string {
    return `${position.row}:${position.col}`;
  }

  private isSamePosition(a: GridPosition, b: GridPosition): boolean {
    return a.row === b.row && a.col === b.col;
  }
}
