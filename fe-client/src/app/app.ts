import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('fe-client');
  protected readonly dark = signal(false);

  constructor() {
    // Initialize theme from localStorage; default to light
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      const isDark = saved === 'dark';
      this.applyTheme(isDark);
    }
  }

  protected toggleTheme() {
    this.applyTheme(!this.dark());
  }

  private applyTheme(enableDark: boolean) {
    this.dark.set(enableDark);
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (enableDark) {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }
}
