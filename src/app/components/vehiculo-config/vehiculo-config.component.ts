import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface VehiculoConfig {
  velocidadGiroIzquierda: number | null;
  velocidadGiroDerecha: number | null;
  correccionGiroFrontal: number | null;
}

@Component({
  selector: 'app-vehiculo-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehiculo-config.component.html',
  styleUrl: './vehiculo-config.component.css',
})
export class VehiculoConfigComponent implements OnChanges {
  @Input() config: VehiculoConfig = {
    velocidadGiroIzquierda: 35,
    velocidadGiroDerecha: 42,
    correccionGiroFrontal: 5,
  };

  readonly form: FormGroup;

  constructor(private readonly formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      velocidadGiroIzquierda: [35, [Validators.min(-100), Validators.max(100)]],
      velocidadGiroDerecha: [42, [Validators.min(-100), Validators.max(100)]],
      correccionGiroFrontal: [5, [Validators.min(-30), Validators.max(30)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && this.config) {
      this.form.patchValue(this.config, { emitEvent: false });
    }
  }

  enviar(): void {
    const payload = this.buildPayload();
    console.log(JSON.stringify(payload));
  }

  test(): void {
    console.log(JSON.stringify({ test: 'test' }));
  }

  private buildPayload(): VehiculoConfig {
    const rawValue = this.form.getRawValue() as VehiculoConfig;

    return {
      velocidadGiroIzquierda: this.toNumberOrNull(rawValue.velocidadGiroIzquierda),
      velocidadGiroDerecha: this.toNumberOrNull(rawValue.velocidadGiroDerecha),
      correccionGiroFrontal: this.toNumberOrNull(rawValue.correccionGiroFrontal),
    };
  }

  private toNumberOrNull(value: number | string | null | undefined): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
}
