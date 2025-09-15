import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeSwitcherComponent } from '../../../shared/components/theme-switcher/theme-switcher.component';
import { MessageService } from 'primeng/api';
import { LoginRequest } from '../../model/dtos/login-request.dto';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

/**
 * Login component for user authentication with PrimeNG components
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    MessageModule,
    ThemeSwitcherComponent
  ],
  template: `
    <div class="login-container fade-in">
      <div class="theme-switcher-wrapper">
        <app-theme-switcher></app-theme-switcher>
      </div>
      <p-card class="login-card slide-up">
        <ng-template pTemplate="header">
          <div class="login-header">
            <h1><i class="pi pi-car"></i> ParkUp</h1>
            <p>Sign in to your account</p>
          </div>
        </ng-template>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="p-field">
            <label for="email">Email Address</label>
            <input
              pInputText
              type="email"
              id="email"
              formControlName="email"
              placeholder="Enter your email"
              class="w-full"
              [class.p-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
            />
            <small
              class="p-error"
              *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
            >
              <span *ngIf="loginForm.get('email')?.errors?.['required']">Email is required</span>
              <span *ngIf="loginForm.get('email')?.errors?.['email']">Please enter a valid email</span>
            </small>
          </div>

          <div class="p-field">
            <label for="password">Password</label>
            <p-password
              formControlName="password"
              placeholder="Enter your password"
              [toggleMask]="true"
              [feedback]="false"
              styleClass="w-full"
              inputStyleClass="w-full"
              [class.p-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
            ></p-password>
            <small
              class="p-error"
              *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
            >
              <span *ngIf="loginForm.get('password')?.errors?.['required']">Password is required</span>
              <span *ngIf="loginForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</span>
            </small>
          </div>

          <p-message
            *ngIf="loginError"
            severity="error"
            [text]="loginError"
            styleClass="w-full"
          ></p-message>

          <p-button
            type="submit"
            label="Sign In"
            icon="pi pi-sign-in"
            styleClass="w-full login-btn"
            [disabled]="loginForm.invalid || isLoading"
            [loading]="isLoading"
            loadingIcon="pi pi-spinner pi-spin"
          ></p-button>
        </form>

        <ng-template pTemplate="footer">
          <div class="login-footer">
            <p>Don't have an account?
              <a routerLink="/register" class="register-link">
                <i class="pi pi-user-plus"></i> Sign up
              </a>
            </p>
          </div>
        </ng-template>
      </p-card>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--background-color);
      padding: 1rem;
      position: relative;
    }

    .theme-switcher-wrapper {
      position: absolute;
      top: 1rem;
      right: 1rem;
      z-index: 10;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow);
    }

    .login-header {
      text-align: center;
      padding: 2rem 0 1rem 0;
    }

    .login-header h1 {
      color: var(--text-color);
      margin-bottom: 0.5rem;
      font-size: 2rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .login-header h1 i {
      color: var(--primary-color);
    }

    .login-header p {
      color: var(--text-color-secondary);
      margin: 0;
      font-size: 1rem;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .p-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .p-field label {
      font-weight: 500;
      color: var(--text-color);
      font-size: 0.9rem;
    }

    .login-btn {
      margin-top: 1rem;
    }

    :host ::ng-deep .login-btn {
      background: var(--primary-color) !important;
      border: 1px solid var(--primary-color) !important;
      color: var(--background-color) !important;
      font-size: 1rem !important;
      padding: 0.75rem 1.5rem !important;
      border-radius: 6px !important;
      transition: all 0.2s ease !important;
    }

    :host ::ng-deep .login-btn:hover {
      background: var(--primary-color-hover) !important;
      border-color: var(--primary-color-hover) !important;
      transform: translateY(-1px) !important;
      box-shadow: var(--shadow-hover) !important;
    }

    .login-footer {
      text-align: center;
      padding: 1rem 0;
      border-top: 1px solid var(--border-color);
      margin-top: 1rem;
    }

    .register-link {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      transition: all 0.2s ease;
    }

    .register-link:hover {
      color: var(--primary-color-hover);
      transform: translateY(-1px);
    }

    .w-full {
      width: 100%;
    }

    :host ::ng-deep .p-inputtext {
      background: var(--surface-color) !important;
      border: 1px solid var(--border-color) !important;
      color: var(--text-color) !important;
    }

    :host ::ng-deep .p-inputtext:focus {
      border-color: var(--primary-color) !important;
      box-shadow: 0 0 0 2px var(--focus-ring) !important;
    }

    :host ::ng-deep .p-password input {
      width: 100%;
      background: var(--surface-color) !important;
      border: 1px solid var(--border-color) !important;
      color: var(--text-color) !important;
    }

    :host ::ng-deep .p-password input:focus {
      border-color: var(--primary-color) !important;
      box-shadow: 0 0 0 2px var(--focus-ring) !important;
    }

    :host ::ng-deep .p-message {
      margin: 0.5rem 0;
      background: var(--surface-color) !important;
      border: 1px solid #ef4444 !important;
      color: #ef4444 !important;
    }

    :host ::ng-deep .p-card {
      background: var(--surface-color) !important;
      border: 1px solid var(--border-color) !important;
      color: var(--text-color) !important;
    }

    :host ::ng-deep .p-card .p-card-body {
      background: var(--surface-color) !important;
    }

    @media (max-width: 768px) {
      .theme-switcher-wrapper {
        top: 0.5rem;
        right: 0.5rem;
      }

      .login-card {
        max-width: 100%;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  loginError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Handles form submission for user login
   */
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginError = '';

      const loginRequest: LoginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Login Successful',
            detail: 'Welcome back! Redirecting to dashboard...'
          });
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1000);
        },
        error: (error) => {
          this.isLoading = false;
          this.loginError = 'Invalid email or password. Please try again.';
          this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: 'Invalid email or password. Please try again.'
          });
          console.error('Login error:', error);
        }
      });
    }
  }
}
