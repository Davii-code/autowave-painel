import {Component, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {SecurityService} from '../../../authentication/security/security.service';
import {UserSecond} from '../../../models/UserSecond';
import {CampaingService} from '../campaing-service/campaing.service';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {Campaing} from '../../../models/Campaing';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-campaing-create',
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSlideToggleModule, MatButtonModule, MatIconModule,
    MatProgressBarModule, MatSnackBarModule, MatDialogActions, MatDialogTitle, MatDialogClose, MatDialogContent, MatOption, MatSelect
  ],
  templateUrl: './campaing-create.component.html',
  standalone: true,
  styleUrl: './campaing-create.component.css'
})
export class CampaingCreateComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CampaingCreateComponent>);
  private service = inject(CampaingService);
  private _securityService = inject(SecurityService);


  saving = signal(false);
  private readonly credUser = this._securityService.credential.user;

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    scheduledDate: ['', [
      Validators.required,
      Validators.pattern(/^\d{10,11}$/) // só números, 10 ou 11 dígitos
    ]],
    type: ['', [Validators.required]],
    messageTemplate: ['', [Validators.required]],
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

    const payload: Campaing = {
      name: raw.name.trim(),
      scheduledDate: (raw.scheduledDate || '').replace(/\D/g, ''), // só dígitos
      type: raw.type,
      messageTemplate: raw.messageTemplate ?raw.messageTemplate : undefined,
      user: raw.user
    };

    this.service.create(payload).subscribe({
      next: (created) => {
        this.dialogRef.close({ created: true, Campaing: created });
      },
      error: (err) => {
        this.saving.set(false);
        alert(err?.message || 'Erro ao criar Campainge');
      }
    });
  }


}

