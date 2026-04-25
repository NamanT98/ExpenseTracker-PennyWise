import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDarkTheme = signal<boolean>(true); // dark by default

  constructor() {
    const saved = localStorage.getItem('theme');
    if (saved) {
      this.isDarkTheme.set(saved === 'dark');
    }
    effect(() => {
      const isDark = this.isDarkTheme();
      document.body.classList.toggle('light-theme', !isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  toggleTheme() { this.isDarkTheme.update(v => !v); }
}
