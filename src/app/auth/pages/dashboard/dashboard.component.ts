import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeSwitcherComponent } from '../../../shared/components/theme-switcher/theme-switcher.component';
import { MessageService } from 'primeng/api';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { User } from '../../model/entities/user.entity';

/**
 * Dashboard component - protected page for authenticated users
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    AvatarModule,
    MenuModule,
    ThemeSwitcherComponent
  ],
  template: `
    <div class="dashboard-container fade-in">
      <header class="dashboard-header">
        <div class="header-content">
          <div class="brand">
            <h1><i class="pi pi-car"></i> ParkUp Dashboard</h1>
          </div>
          <div class="user-info">
            <app-theme-switcher></app-theme-switcher>
            <p-avatar
              [label]="getInitials(user?.email || '')"
              styleClass="mr-2"
              size="large"
              shape="circle">
            </p-avatar>
            <span class="user-email">{{ user?.email }}</span>
            <p-button
              label="Logout"
              icon="pi pi-sign-out"
              styleClass="p-button-outlined logout-btn"
              (click)="logout()">
            </p-button>
          </div>
        </div>
      </header>

      <main class="dashboard-content">
        <div class="welcome-section slide-up">
          <p-card>
            <ng-template pTemplate="header">
              <div class="welcome-header">
                <i class="pi pi-home welcome-icon"></i>
              </div>
            </ng-template>
            <h2>Welcome to ParkUp!</h2>
            <p>Your smart parking management solution is ready to use. Find, book, and manage parking spots with ease.</p>
          </p-card>
        </div>

        <div class="stats-grid slide-up">
          <p-card class="stat-card">
            <ng-template pTemplate="header">
              <div class="stat-icon active">
                <i class="pi pi-calendar"></i>
              </div>
            </ng-template>
            <h3>Active Bookings</h3>
            <p class="stat-number">0</p>
          </p-card>

          <p-card class="stat-card">
            <ng-template pTemplate="header">
              <div class="stat-icon total">
                <i class="pi pi-chart-bar"></i>
              </div>
            </ng-template>
            <h3>Total Bookings</h3>
            <p class="stat-number">0</p>
          </p-card>

          <p-card class="stat-card">
            <ng-template pTemplate="header">
              <div class="stat-icon favorite">
                <i class="pi pi-heart"></i>
              </div>
            </ng-template>
            <h3>Favorite Spots</h3>
            <p class="stat-number">0</p>
          </p-card>
        </div>

        <div class="actions-section slide-up">
          <p-card>
            <ng-template pTemplate="header">
              <h3><i class="pi pi-bolt"></i> Quick Actions</h3>
            </ng-template>
            <div class="action-buttons">
              <p-button
                label="Find Parking"
                icon="pi pi-map-marker"
                styleClass="action-btn primary">
              </p-button>
              <p-button
                label="View Bookings"
                icon="pi pi-list"
                styleClass="action-btn secondary p-button-outlined">
              </p-button>
              <p-button
                label="Manage Profile"
                icon="pi pi-user"
                styleClass="action-btn secondary p-button-outlined">
              </p-button>
            </div>
          </p-card>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: var(--background-color);
    }

    .dashboard-header {
      background: var(--surface-color);
      border-bottom: 1px solid var(--border-color);
      color: var(--text-color);
      padding: 1.5rem 2rem;
      box-shadow: var(--shadow);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }

    .brand h1 {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-color);
    }

    .brand h1 i {
      color: var(--primary-color);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-email {
      font-size: 1rem;
      font-weight: 500;
      color: var(--text-color);
    }

    .dashboard-content {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .welcome-section {
      animation-delay: 0.1s;
    }

    .welcome-header {
      text-align: center;
      padding: 1rem;
      background: var(--primary-color);
      color: var(--background-color);
      border-radius: 8px 8px 0 0;
      margin: -1rem -1rem 0 -1rem;
    }

    .welcome-icon {
      font-size: 2rem;
      color: var(--background-color);
    }

    .welcome-section h2 {
      color: var(--text-color);
      margin-bottom: 1rem;
      font-size: 1.8rem;
      text-align: center;
    }

    .welcome-section p {
      color: var(--text-color-secondary);
      font-size: 1.1rem;
      line-height: 1.6;
      text-align: center;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      animation-delay: 0.2s;
    }

    .stat-card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      background: var(--surface-color);
      border: 1px solid var(--border-color);
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-hover);
    }

    .stat-icon {
      text-align: center;
      padding: 1rem;
      border-radius: 8px 8px 0 0;
      margin: -1rem -1rem 0 -1rem;
      background: var(--primary-color);
    }

    .stat-icon i {
      font-size: 2rem;
      color: var(--background-color);
    }

    .stat-card h3 {
      color: var(--text-color);
      margin: 1rem 0 0.5rem 0;
      font-size: 1.1rem;
      text-align: center;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--primary-color);
      margin: 0;
      text-align: center;
    }

    .actions-section {
      animation-delay: 0.3s;
    }

    .actions-section h3 {
      color: var(--background-color);
      margin: 0 0 1.5rem 0;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: var(--primary-color);
      border-radius: 8px 8px 0 0;
      margin: -1rem -1rem 0 -1rem;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    :host ::ng-deep .action-btn.primary {
      background: var(--primary-color) !important;
      border: 1px solid var(--primary-color) !important;
      color: var(--background-color) !important;
    }

    :host ::ng-deep .action-btn.primary:hover {
      background: var(--primary-color-hover) !important;
      border-color: var(--primary-color-hover) !important;
    }

    :host ::ng-deep .action-btn.secondary {
      background: transparent !important;
      border: 1px solid var(--primary-color) !important;
      color: var(--primary-color) !important;
    }

    :host ::ng-deep .action-btn.secondary:hover {
      background: var(--primary-color) !important;
      color: var(--background-color) !important;
    }

    :host ::ng-deep .action-btn {
      font-size: 1rem !important;
      padding: 0.75rem 1.5rem !important;
      transition: all 0.2s ease !important;
      border-radius: 6px !important;
    }

    :host ::ng-deep .action-btn:hover {
      transform: translateY(-1px) !important;
    }

    :host ::ng-deep .logout-btn {
      background: transparent !important;
      border: 1px solid var(--primary-color) !important;
      color: var(--primary-color) !important;
    }

    :host ::ng-deep .logout-btn:hover {
      background: var(--primary-color) !important;
      color: var(--background-color) !important;
    }

    :host ::ng-deep .p-card {
      background: var(--surface-color) !important;
      border: 1px solid var(--border-color) !important;
      color: var(--text-color) !important;
    }

    :host ::ng-deep .p-avatar {
      background: var(--primary-color) !important;
      color: var(--background-color) !important;
    }

    @media (max-width: 768px) {
      .dashboard-header {
        padding: 1rem;
      }

      .header-content {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .user-info {
        flex-wrap: wrap;
        gap: 0.5rem;
        width: 100%;
      }

      .dashboard-content {
        padding: 1rem;
      }

      .action-buttons {
        flex-direction: column;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  /**
   * Handles user logout
   */
  logout(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Logged Out',
      detail: 'You have been successfully logged out. Redirecting...'
    });

    setTimeout(() => {
      this.authService.logout();
      this.router.navigate(['/login']);
    }, 1000);
  }

  /**
   * Gets user initials from email for avatar display
   */
  getInitials(email: string): string {
    if (!email) return 'U';
    const parts = email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email[0].toUpperCase();
  }
}
