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
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
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
