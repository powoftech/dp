import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dp-calculator/dp-calculator').then((m) => m.DpCalculatorComponent),
  },
];
