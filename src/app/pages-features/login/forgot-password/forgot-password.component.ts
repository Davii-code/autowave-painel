import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {LoginService} from '../login.service';
import {ToastrService} from 'ngx-toastr';
import {MatProgressBar} from '@angular/material/progress-bar';
import {ResetPasswordComponent} from '../reset-password/reset-password.component';

@Component({
  selector: 'app-forgot-password',
  imports: [
    MatDialogModule,
    MatLabel,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInput,
    NgIf,
    MatButton,
    MatProgressBar
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  private _service = inject(LoginService);
  private _fb = inject(FormBuilder);
  private _notificationsService = inject(ToastrService);
  private _dialog = inject(MatDialog);
  private _dialogRef = inject(MatDialogRef<ForgotPasswordComponent>);

  form: FormGroup;
  isLoading: boolean = false;

  constructor() {
    this.form = this._fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  sendResetCode(): void {
    if (this.form.valid) {
      this.isLoading = true;
      this._service.sendRecoveryCode(this.form.get('email')?.value).subscribe(() => {
        this.isLoading = false;
        const email = this.form.get('email')?.value;
        this._notificationsService.info(`Código de redefinição enviado para: ${email}`);

        const dialogRef = this._dialog.open(ResetPasswordComponent, {
          width: '400px',
          data: { email: email }
        });

        dialogRef.afterClosed().subscribe(() => {
          this._dialogRef.close();
        });
      });
    }
  }


}
