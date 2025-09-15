import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeSwitcherComponent } from '../../../shared/components/theme-switcher/theme-switcher.component';
import { MessageService } from 'primeng/api';
import { RegisterRequest } from '../../model/dtos/register-request.dto';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';

/**
 * Register component for user registration
 */
@Component({
  selector: 'app-register',
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
    <div class="register-container fade-in">
      <div class="theme-switcher-wrapper">
        <app-theme-switcher></app-theme-switcher>
      </div>
      <p-card class="register-card slide-up">
        <ng-template pTemplate="header">
          <div class="register-header">
            <h1><i class="pi pi-car"></i> ParkUp</h1>
            <p>Create your account</p>
          </div>
        </ng-template>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
          <div class="p-field">
            <label for="email">Email Address</label>
            <input
              pInputText
              type="email"
              id="email"
              formControlName="email"
              placeholder="Enter your email"
              class="w-full"
              [class.p-invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
            />
            <small
              class="p-error"
              *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
            >
              <span *ngIf="registerForm.get('email')?.errors?.['required']">Email is required</span>
              <span *ngIf="registerForm.get('email')?.errors?.['email']">Please enter a valid email</span>
            </small>
          </div>

          <div class="p-field">
            <label for="password">Password</label>
            <p-password
              formControlName="password"
              placeholder="Enter your password"
              [toggleMask]="true"
              [feedback]="true"
              styleClass="w-full"
              inputStyleClass="w-full"
              [class.p-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
            ></p-password>
            <small
              class="p-error"
              *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
            >
              <span *ngIf="registerForm.get('password')?.errors?.['required']">Password is required</span>
              <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</span>
            </small>
          </div>

          <div class="p-field">
            <label for="confirmPassword">Confirm Password</label>
            <p-password
              formControlName="confirmPassword"
              placeholder="Confirm your password"
              [toggleMask]="true"
              [feedback]="false"
              styleClass="w-full"
              inputStyleClass="w-full"
              [class.p-invalid]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
            ></p-password>
            <small
              class="p-error"
              *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
            >
              <span *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">Please confirm your password</span>
            </small>
            <small
              class="p-error"
              *ngIf="registerForm.errors?.['passwordMismatch'] && registerForm.get('confirmPassword')?.touched"
            >
              Passwords do not match
            </small>
          </div>

          <p-message
            *ngIf="registerError"
            severity="error"
            [text]="registerError"
            styleClass="w-full"
          ></p-message>

          <p-button
            type="submit"
            label="Create Account"
            icon="pi pi-user-plus"
            styleClass="w-full register-btn"
            [disabled]="registerForm.invalid || isLoading"
            [loading]="isLoading"
            loadingIcon="pi pi-spinner pi-spin"
          ></p-button>
        </form>

        <ng-template pTemplate="footer">
          <div class="register-footer">
            <p>Already have an account?
              <a routerLink="/login" class="login-link">
                <i class="pi pi-sign-in"></i> Sign in
              </a>
            </p>
          </div>
        </ng-template>
      </p-card>
    </div>
  `,
  styles: [`
    .register-container {
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

    .register-card {
      width: 100%;
      max-width: 400px;
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow);
    }

    .register-header {
      text-align: center;
      padding: 2rem 0 1rem 0;
    }

    .register-header h1 {
      color: var(--text-color);
      margin-bottom: 0.5rem;
      font-size: 2rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .register-header h1 i {
      color: var(--primary-color);
    }

    .register-header p {
      color: var(--text-color-secondary);
      margin: 0;
      font-size: 1rem;
    }

    .register-form {
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

    .register-btn {
      margin-top: 1rem;
    }

    :host ::ng-deep .register-btn {
      background: var(--primary-color) !important;
      border: 1px solid var(--primary-color) !important;
      color: var(--background-color) !important;
      font-size: 1rem !important;
      padding: 0.75rem 1.5rem !important;
      border-radius: 6px !important;
      transition: all 0.2s ease !important;
    }

    :host ::ng-deep .register-btn:hover {
      background: var(--primary-color-hover) !important;
      border-color: var(--primary-color-hover) !important;
      transform: translateY(-1px) !important;
      box-shadow: var(--shadow-hover) !important;
    }

    .register-footer {
      text-align: center;
      padding: 1rem 0;
      border-top: 1px solid var(--border-color);
      margin-top: 1rem;
    }

    .login-link {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      transition: all 0.2s ease;
    }

    .login-link:hover {
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

      .register-card {
        max-width: 100%;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  registerError = '';
  registerSuccess = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  /**
   * Custom validator to check if passwords match
   */
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  /**
   * Handles form submission for user registration
   */
  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.registerError = '';
      this.registerSuccess = '';

      const registerRequest: RegisterRequest = {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        roles: ['ROLE_USER'] // Default role for new users
      };

      this.authService.register(registerRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.registerSuccess = 'Account created successfully! Please sign in.';
          this.messageService.add({
            severity: 'success',
            summary: 'Registration Successful',
            detail: 'Account created successfully! Redirecting to login...'
          });

          // Redirect to login after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.registerError = 'Registration failed. Please try again.';
          this.messageService.add({
            severity: 'error',
            summary: 'Registration Failed',
            detail: 'Registration failed. Please try again.'
          });
          console.error('Registration error:', error);
        }
      });
    }
  }
}
