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
import {Client} from '../../../models/Client';


@Component({
  selector: 'app-client-create',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSlideToggleModule, MatButtonModule, MatIconModule,
    MatProgressBarModule, MatSnackBarModule
  ],
  templateUrl: './client-create.component.html',
  styleUrl: './client-create.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientCreateComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private service = inject(ClientService);
  private snack = inject(MatSnackBar);

  saving = signal(false);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    document: [''],
    active: [true]
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);

    const payload = this.form.getRawValue() as Partial<Client>;
    this.service.create(payload).subscribe({
      next: (created) => {
        this.snack.open('Cliente criado com sucesso!', 'OK', { duration: 2500 });
        this.router.navigate(['/client']); // volta para a lista
      },
      error: (err) => {
        const msg = (err?.message || 'Erro ao criar cliente');
        this.snack.open(msg, 'Fechar', { duration: 3500 });
        this.saving.set(false);
      }
    });
  }

  cancel() {
    this.router.navigate(['/client']);
  }

  hasError(control: keyof typeof this.form.controls, error: string) {
    const c = this.form.controls[control];
    return c.touched && c.hasError(error);
  }
}
