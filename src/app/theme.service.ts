import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

const THEME_KEY = 'dp-theme';
const CYCLE: Theme[] = ['system', 'light', 'dark'];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  readonly theme = signal<Theme>((localStorage.getItem(THEME_KEY) as Theme | null) ?? 'system');

  constructor() {
    effect(() => {
      const theme = this.theme();
      localStorage.setItem(THEME_KEY, theme);
      this.document.body.style.colorScheme = theme === 'system' ? 'light dark' : theme;
    });
  }

  cycleTheme(): void {
    const next = CYCLE[(CYCLE.indexOf(this.theme()) + 1) % CYCLE.length];
    this.theme.set(next);
  }
}
