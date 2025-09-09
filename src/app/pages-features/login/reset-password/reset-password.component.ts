import {Component, Inject, inject} from '@angular/core';
import {LoginService} from '../login.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-reset-password',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    NgIf,
    MatButton
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  private _service = inject(LoginService);
  private _fb = inject(FormBuilder);
  private _notificationsService = inject(ToastrService);
  private _dialogRef = inject(MatDialogRef<ResetPasswordComponent>);

  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = this._fb.group({
      code: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatch });
  }

  passwordsMatch(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  resetPassword(): void {
    if (this.form.valid) {
      const { code, newPassword } = this.form.value;
      this._service.changePassword(this.data.email, code, newPassword).subscribe(() => {
        this._notificationsService.success('Senha redefinida com sucesso!');
        this._dialogRef.close();
      });
    }
  }

  public handleError = (controlName: string, errorName: string) => {
    return this.form.get(controlName)?.hasError(errorName);
  };
}
