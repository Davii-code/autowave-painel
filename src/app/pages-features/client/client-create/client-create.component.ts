import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {ClientService} from '../client-service/client.service';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {SecurityService} from '../../../authentication/security/security.service';
import {UserSecond} from '../../../models/UserSecond';
import {ClientCreateRequest} from '../../../models/ClientCreateRequest';


@Component({
  selector: 'app-client-create',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSlideToggleModule, MatButtonModule, MatIconModule,
    MatProgressBarModule, MatSnackBarModule, MatDialogActions, MatDialogTitle, MatDialogClose, MatDialogContent
  ],
  templateUrl: './client-create.component.html',
  styleUrl: './client-create.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientCreateComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ClientCreateComponent>);
  private service = inject(ClientService);
  private _securityService = inject(SecurityService);


  saving = signal(false);
  private readonly credUser = this._securityService.credential.user;

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    telephone: ['', [
      Validators.required,
      Validators.pattern(/^\d{10,11}$/) // só números, 10 ou 11 dígitos
    ]],
    dateofbirth: ['', [Validators.required]],
    lastPurchase: ['', [Validators.required]],
    user: this.fb.nonNullable.control<UserSecond>({
      id: this.credUser?.id,
      name: this.credUser?.name,
      login: this.credUser?.login
    })
  });

  close() {
    this.dialogRef.close();
  }

  hasError(control: keyof typeof this.form.controls, error: string) {
    const c = this.form.controls[control];
    return c.touched && c.hasError(error);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    const raw = this.form.getRawValue(); // inclui 'user' mesmo desabilitado

    const payload: ClientCreateRequest = {
      name: raw.name.trim(),
      telephone: (raw.telephone || '').replace(/\D/g, ''), // só dígitos
      dateofbirth: raw.dateofbirth,
      lastPurchase: raw.lastPurchase ?raw.lastPurchase : undefined,
      user: raw.user
    };

    this.service.create(payload).subscribe({
      next: (created) => {
        this.dialogRef.close({ created: true, client: created });
      },
      error: (err) => {
        this.saving.set(false);
        alert(err?.message || 'Erro ao criar cliente');
      }
    });
  }

  digitsOnly(ctrl: 'telephone') {
    const v = this.form.controls[ctrl].value ?? '';
    const only = v.replace(/\D/g, '');
    if (v !== only) {
      this.form.controls[ctrl].setValue(only, { emitEvent: false });
    }
  }

}
