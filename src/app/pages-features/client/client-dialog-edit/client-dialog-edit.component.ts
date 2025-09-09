import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {ClientService} from '../client-service/client.service';
import {Client} from '../../../models/Client';
import {UserSecond} from '../../../models/UserSecond';
import {SecurityService} from '../../../authentication/security/security.service';
import {ClientCreateRequest} from '../../../models/ClientCreateRequest';


@Component({
  selector: 'app-client-dialog-edit',
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSlideToggleModule,
    MatButtonModule, MatIconModule, MatProgressBarModule
  ],
  templateUrl: './client-dialog-edit.component.html',
  standalone: true,
  styleUrl: './client-dialog-edit.component.css'
})
export class ClientDialogEditComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ClientDialogEditComponent>);
  private service = inject(ClientService);
  private data = inject<Client>(MAT_DIALOG_DATA);
  private _securityService = inject(SecurityService);

  readonly id = Number(this.data.id);
  loading = signal(true);
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

  constructor() { this.load(); }

  private load() {
    this.service.getById(this.id).subscribe({
      next: (c: Client) => {
        console.log(c)
        this.form.patchValue({
          name: c.name ?? '',
          telephone: c.telephone ?? '',
          dateofbirth: c.dateofbirth ??'',
          lastPurchase: c.lastPurchase ?? ''
        });
        this.loading.set(false);
      },
      error: (e) => {
        alert(e?.message || 'Erro ao carregar cliente');
        this.dialogRef.close();
      }
    });
  }

  hasError(control: keyof typeof this.form.controls, error: string) {
    const c = this.form.controls[control];
    return c.touched && c.hasError(error);
  }

  close() { this.dialogRef.close(); }

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

    this.service.updateById(this.id, payload).subscribe({
      next: (updated) => this.dialogRef.close({ updated: true, client: updated }),
      error: (err) => { alert(err?.message || 'Erro ao atualizar cliente'); this.saving.set(false); }
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
