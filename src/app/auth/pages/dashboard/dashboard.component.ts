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
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
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
