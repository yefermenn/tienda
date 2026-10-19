import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { GridMatrix, GridPosition, PathfindingService } from '../../services/pathfinding.service';
import { VehiculoConfigComponent, VehiculoConfig } from '../vehiculo-config/vehiculo-config.component';

const GRID_SIZE = 4;

type ConfigurationTab = 'bodega' | 'vehiculo';

@Component({
  selector: 'app-bodega',
  standalone: true,
  imports: [CommonModule, VehiculoConfigComponent],
  templateUrl: './bodega.component.html',
  styleUrl: './bodega.component.scss',
})
export class BodegaComponent {
  readonly gridSize = signal(GRID_SIZE);
  readonly grid = signal<GridMatrix>(this.createEmptyGrid(GRID_SIZE));
  readonly path = signal<GridPosition[]>([]);
  readonly robotPosition = signal<GridPosition | null>(null);
  readonly errorMessage = signal('');
  readonly boardTemplate = computed(() => `repeat(${this.gridSize()}, minmax(0, 1fr))`);
  readonly activeTab = signal<ConfigurationTab>('bodega');
  readonly vehicleConfig = signal<VehiculoConfig>({
    velocidadGiroIzquierda: 35,
    velocidadGiroDerecha: 42,
    correccionGiroFrontal: 5,
  });

  private robotTimer: number | null = null;

  constructor(private readonly pathfindingService: PathfindingService) {}

  protected readonly startPosition: GridPosition = { row: 0, col: 0 };
  protected readonly goalPosition: GridPosition = { row: GRID_SIZE - 1, col: GRID_SIZE - 1 };

  setTab(tab: ConfigurationTab): void {
    this.activeTab.set(tab);
  }

  calculateRoute(): void {
    const start = { ...this.startPosition };
    const goal = { row: this.gridSize() - 1, col: this.gridSize() - 1 };
    const route = this.pathfindingService.findPath(this.grid(), start, goal);

    this.path.set(route);
    this.robotPosition.set(null);

    if (route.length === 0) {
      this.errorMessage.set('Ruta no disponible: El camino está completamente bloqueado');
      return;
    }

    this.errorMessage.set('');
    this.animateRobot(route);
  }

  clearWarehouse(): void {
    this.grid.set(this.createEmptyGrid(this.gridSize()));
    this.path.set([]);
    this.robotPosition.set(null);
    this.errorMessage.set('');
    this.stopRobotAnimation();
  }

  onShelfDragStart(event: DragEvent): void {
    event.dataTransfer?.setData('application/shelf', 'true');
    event.dataTransfer!.effectAllowed = 'copy';
  }

  onShelfDragEnd(): void {
    // No-op: se mantiene intencionalmente para compatibilidad con el flujo de drag & drop.
  }

  allowDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  handleDrop(event: DragEvent, row: number, col: number): void {
    event.preventDefault();

    const isShelf = event.dataTransfer?.getData('application/shelf') === 'true';
    if (!isShelf) {
      return;
    }

    this.addObstacle(row, col);
  }

  toggleObstacleCell(row: number, col: number): void {
    if (this.isProtectedCell(row, col)) {
      return;
    }

    const nextGrid = this.grid().map((line) => [...line]);
    nextGrid[row][col] = nextGrid[row][col] === 1 ? 0 : 1;
    this.grid.set(nextGrid);
    this.path.set([]);
    this.errorMessage.set('');
  }

  isProtectedCell(row: number, col: number): boolean {
    return (row === 0 && col === 0) || (row === this.gridSize() - 1 && col === this.gridSize() - 1);
  }

  isObstacle(row: number, col: number): boolean {
    return this.grid()[row]?.[col] === 1;
  }

  isStartCell(row: number, col: number): boolean {
    return row === this.startPosition.row && col === this.startPosition.col;
  }

  isGoalCell(row: number, col: number): boolean {
    return row === this.goalPosition.row && col === this.goalPosition.col;
  }

  isPathCell(row: number, col: number): boolean {
    return this.path().some((position) => position.row === row && position.col === col);
  }

  isRobotPosition(row: number, col: number): boolean {
    const position = this.robotPosition();
    return position !== null && position.row === row && position.col === col;
  }

  private createEmptyGrid(size: number): GridMatrix {
    return Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
  }

  private addObstacle(row: number, col: number): void {
    if (this.isProtectedCell(row, col)) {
      return;
    }

    const nextGrid = this.grid().map((line) => [...line]);
    nextGrid[row][col] = 1;
    this.grid.set(nextGrid);
    this.path.set([]);
    this.errorMessage.set('');
  }

  private animateRobot(route: GridPosition[]): void {
    this.stopRobotAnimation();

    if (route.length <= 1) {
      this.robotPosition.set(route[0] ?? { ...this.startPosition });
      return;
    }

    let stepIndex = 0;
    this.robotPosition.set(route[0]);

    this.robotTimer = window.setInterval(() => {
      stepIndex += 1;
      if (stepIndex >= route.length) {
        this.robotPosition.set(route[route.length - 1]);
        this.stopRobotAnimation();
        return;
      }

      this.robotPosition.set(route[stepIndex]);
    }, 220);
  }

  private stopRobotAnimation(): void {
    if (this.robotTimer !== null) {
      window.clearInterval(this.robotTimer);
      this.robotTimer = null;
    }
  }
}
