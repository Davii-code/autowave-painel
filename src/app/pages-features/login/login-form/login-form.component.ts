import {Component, inject, OnInit} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {provideNativeDateAdapter} from '@angular/material/core';
import {CredentialDTO} from '../../../models/CredentialDTO';
import {Router} from '@angular/router';
import {LoginService} from '../login.service';
import {SecurityService} from '../../../authentication/security/security.service';
import {ForgotPasswordComponent} from '../forgot-password/forgot-password.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-login-form',
  imports: [
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    MatCardHeader,
    NgOptimizedImage,
    MatCardTitle,
    MatFormField,
    MatFormFieldModule,
    MatInput,
    MatButton,
    MatLabel,
    NgIf
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true}
    },
    [provideNativeDateAdapter()],
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent implements OnInit{
  private _formBuilder = inject(FormBuilder);
  private _service = inject(LoginService);
  private _securityService = inject(SecurityService);
  private _router = inject(Router);
  private _dialog = inject(MatDialog);

  loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = this._formBuilder.group({
      login: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: [null, Validators.required],
    });
  }

  login() {
    if (this.loginForm.valid) {
      this._service.login(this.loginForm.value).subscribe((credential: CredentialDTO) => {
        this._securityService.init(credential);
        this._router.navigate(['/pacienteList']);
      });
    }
  }

  openForgotPasswordModal(): void {
    this._dialog.open(ForgotPasswordComponent, {
      width: '400px'
    });
  }

  public handleError = (controlName: string, errorName: string) => {
    return this.loginForm.controls[controlName].hasError(errorName);
  };
}
