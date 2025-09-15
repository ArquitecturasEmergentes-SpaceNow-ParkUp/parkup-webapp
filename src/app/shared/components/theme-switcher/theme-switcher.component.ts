import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ThemeService, Theme } from '../../services/theme.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <p-button
      [icon]="currentTheme === 'light' ? 'pi pi-moon' : 'pi pi-sun'"
      [label]="currentTheme === 'light' ? 'Dark' : 'Light'"
      styleClass="p-button-text theme-switcher-btn"
      (click)="toggleTheme()"
      [attr.aria-label]="'Switch to ' + (currentTheme === 'light' ? 'dark' : 'light') + ' theme'"
    />
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    :host ::ng-deep .theme-switcher-btn {
      color: var(--text-color) !important;
      background: transparent !important;
      border: 1px solid var(--border-color) !important;
      border-radius: 8px !important;
      padding: 0.5rem 1rem !important;
      transition: all 0.3s ease !important;
      font-weight: 500 !important;
    }

    :host ::ng-deep .theme-switcher-btn:hover {
      background: var(--hover-bg) !important;
      border-color: var(--primary-color) !important;
      transform: translateY(-1px) !important;
    }

    :host ::ng-deep .theme-switcher-btn:focus {
      box-shadow: 0 0 0 2px var(--focus-ring) !important;
    }

    :host ::ng-deep .theme-switcher-btn .p-button-icon {
      margin-right: 0.5rem !important;
    }
  `]
})
export class ThemeSwitcherComponent {
  private themeService = inject(ThemeService);
  currentTheme: Theme = 'light';

  constructor() {
    this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
