import { TestBed } from '@angular/core/testing';
import { PathfindingService } from './pathfinding.service';

describe('PathfindingService', () => {
  let service: PathfindingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PathfindingService);
  });

  it('should return a shortest valid path from start to goal', () => {
    const grid = [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 1, 0],
    ];

    const path = service.findPath(grid, { row: 0, col: 0 }, { row: 3, col: 3 });

    expect(path.length).toBeGreaterThan(0);
    expect(path[0]).toEqual({ row: 0, col: 0 });
    expect(path[path.length - 1]).toEqual({ row: 3, col: 3 });
  });

  it('should return an empty array when the route is completely blocked', () => {
    const grid = [
      [0, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 0],
    ];

    const path = service.findPath(grid, { row: 0, col: 0 }, { row: 3, col: 3 });

    expect(path).toEqual([]);
  });
});
