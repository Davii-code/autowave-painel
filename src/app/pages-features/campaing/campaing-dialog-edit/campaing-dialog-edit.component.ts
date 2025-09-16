import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  MAT_DIALOG_DATA, MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogModule,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {CampaingService} from '../campaing-service/campaing.service';
import {Campaing} from '../../../models/Campaing';
import {UserSecond} from '../../../models/UserSecond';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatProgressBar, MatProgressBarModule} from '@angular/material/progress-bar';
import {MatButton, MatButtonModule, MatIconButton} from '@angular/material/button';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatOption} from '@angular/material/core';
import {MatSelect, MatSelectModule} from '@angular/material/select';
import {CommonModule, NgIf} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {RouterModule} from '@angular/router';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {SecurityService} from '../../../authentication/security/security.service';

@Component({
  selector: 'app-campaing-dialog-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatProgressBarModule, MatSelectModule
  ],
  templateUrl: './campaing-dialog-edit.component.html',
  standalone: true,
  styleUrl: './campaing-dialog-edit.component.css'
})
export class CampaingDialogEditComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CampaingDialogEditComponent>);
  private service = inject(CampaingService);
  private data = inject<Campaing>(MAT_DIALOG_DATA);
  private _securityService = inject(SecurityService);

  readonly id = Number(this.data.id);
  loading = signal(true);
  saving = signal(false);
  private readonly credUser = this._securityService.credential.user;

  /** Converte entrada de data do backend para YYYY-MM-DD (aceito pelo <input type="date">) */
  private toDateInput(value?: string): string {
    if (!value) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;             // já OK
    if (/^\d{8}$/.test(value)) {                                     // YYYYMMDD -> YYYY-MM-DD
      return `${value.slice(0,4)}-${value.slice(4,6)}-${value.slice(6,8)}`;
    }
    const d = new Date(value);
    if (isNaN(d.getTime())) return '';
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  }

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    scheduledDate: ['', [Validators.required]],       // usar <input type="date">
    type: ['', [Validators.required]],
    messageTemplate: ['', [Validators.required]],
    user: this.fb.nonNullable.control<UserSecond>({
      id: this.credUser?.id,
      name: this.credUser?.name,
      login: this.credUser?.login
    })
  });

  constructor() { this.load(); }

  private load() {
    this.service.getById(this.id).subscribe({
      next: (c: Campaing) => {
        this.form.patchValue({
          name: c.name ?? '',
          scheduledDate: this.toDateInput(c.scheduledDate),
          type: c.type ?? '',
          messageTemplate: c.messageTemplate ?? ''
        });
        this.loading.set(false);
      },
      error: (e) => {
        alert(e?.message || 'Erro ao carregar campanha');
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

    const raw = this.form.getRawValue();

    // Ajuste aqui conforme sua API espera a data:
    // - manter "YYYY-MM-DD" (como está)
    // - ou enviar só dígitos: raw.scheduledDate.replace(/\D/g, '')
    const normalizedDate = raw.scheduledDate;

    const payload: Partial<Campaing> = {
      name: raw.name.trim(),
      scheduledDate: normalizedDate,
      type: raw.type,
      messageTemplate: raw.messageTemplate ? raw.messageTemplate : undefined,
      user: raw.user
    };

    this.service.update(payload as Campaing,this.id).subscribe({
      next: (updated) => this.dialogRef.close({ updated: true, Campaing: updated }),
      error: (err) => { alert(err?.message || 'Erro ao atualizar campanha'); this.saving.set(false); }
    });
  }
}
