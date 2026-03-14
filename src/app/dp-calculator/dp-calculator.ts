import { DecimalPipe, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../theme.service';

interface DensityBucket {
  qualifier: string;
  scaleFactor: number;
  dpiRange: string;
  dpiMin: number;
  dpiMax: number;
  description: string;
}

const DENSITY_BUCKETS: DensityBucket[] = [
  {
    qualifier: 'ldpi',
    scaleFactor: 0.75,
    dpiRange: '< 140',
    dpiMin: 0,
    dpiMax: 140,
    description: 'Small or low-resolution screens',
  },
  {
    qualifier: 'mdpi',
    scaleFactor: 1.0,
    dpiRange: '140 – 200',
    dpiMin: 140,
    dpiMax: 200,
    description: 'Baseline density — 160 dpi reference',
  },
  {
    qualifier: 'hdpi',
    scaleFactor: 1.5,
    dpiRange: '200 – 280',
    dpiMin: 200,
    dpiMax: 280,
    description: 'Mid-range phones',
  },
  {
    qualifier: 'xhdpi',
    scaleFactor: 2.0,
    dpiRange: '280 – 400',
    dpiMin: 280,
    dpiMax: 400,
    description: 'High-res phones and small tablets',
  },
  {
    qualifier: 'xxhdpi',
    scaleFactor: 3.0,
    dpiRange: '400 – 560',
    dpiMin: 400,
    dpiMax: 560,
    description: 'Flagship phones (e.g., Pixel, iPhone Pro)',
  },
  {
    qualifier: 'xxxhdpi',
    scaleFactor: 4.0,
    dpiRange: '560+',
    dpiMin: 560,
    dpiMax: Number.MAX_SAFE_INTEGER,
    description: 'Ultra-high-resolution screens',
  },
];

@Component({
  selector: 'app-dp-calculator',
  imports: [
    ReactiveFormsModule,
    DecimalPipe,
    TitleCasePipe,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: './dp-calculator.html',
  styleUrl: './dp-calculator.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DpCalculatorComponent {
  protected readonly themeService = inject(ThemeService);

  protected readonly screenForm = new FormGroup({
    diagonal: new FormControl<number | null>(null, [Validators.min(0.1)]),
    widthPx: new FormControl<number | null>(null, [Validators.min(1)]),
    heightPx: new FormControl<number | null>(null, [Validators.min(1)]),
  });

  protected readonly pxControl = new FormControl<number | null>({
    value: null,
    disabled: true,
  });

  protected readonly dpControl = new FormControl<number | null>({
    value: null,
    disabled: true,
  });

  private readonly screenValues = toSignal(this.screenForm.valueChanges, {
    initialValue: this.screenForm.value,
  });

  private readonly pxValue = toSignal(this.pxControl.valueChanges, {
    initialValue: null,
  });

  private readonly dpValue = toSignal(this.dpControl.valueChanges, {
    initialValue: null,
  });

  protected readonly ppi = computed(() => {
    const { diagonal, widthPx, heightPx } = this.screenValues();
    if (!diagonal || !widthPx || !heightPx || diagonal <= 0 || widthPx <= 0 || heightPx <= 0) {
      return null;
    }
    return Math.sqrt(widthPx ** 2 + heightPx ** 2) / diagonal;
  });

  protected readonly densityBucket = computed(() => {
    const ppi = this.ppi();
    if (ppi === null) return null;
    return (
      DENSITY_BUCKETS.find((b) => ppi >= b.dpiMin && ppi < b.dpiMax) ??
      DENSITY_BUCKETS[DENSITY_BUCKETS.length - 1]
    );
  });

  protected readonly isValidScreen = computed(() => this.ppi() !== null);

  protected readonly dpFromPx = computed(() => {
    const px = this.pxValue();
    const ppi = this.ppi();
    if (px === null || ppi === null) return null;
    return px * (160 / ppi);
  });

  protected readonly pxFromDp = computed(() => {
    const dp = this.dpValue();
    const ppi = this.ppi();
    if (dp === null || ppi === null) return null;
    return dp * (ppi / 160);
  });

  protected readonly densityBuckets = DENSITY_BUCKETS;
  protected readonly tableColumns = ['qualifier', 'scale', 'dpiRange', 'description'];
  protected readonly formula = signal('dp = px × (160 / ppi)');

  constructor() {
    effect(() => {
      if (this.isValidScreen()) {
        this.pxControl.enable();
        this.dpControl.enable();
      } else {
        this.pxControl.disable();
        this.dpControl.disable();
      }
    });
  }

  protected isActiveBucket(bucket: DensityBucket): boolean {
    return this.densityBucket()?.qualifier === bucket.qualifier;
  }
}
