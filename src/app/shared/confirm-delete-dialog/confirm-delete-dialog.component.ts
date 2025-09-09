import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDeleteData {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon color="warn">delete</mat-icon>
      {{ data.title || 'Excluir registro' }}
    </h2>

    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="close(false)">{{ data.cancelText || 'Cancelar' }}</button>
      <button mat-flat-button color="warn" (click)="close(true)">
        {{ data.confirmText || 'Excluir' }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDeleteDialogComponent {
  private dialogRef = inject(MatDialogRef<ConfirmDeleteDialogComponent>);
  data = inject<ConfirmDeleteData>(MAT_DIALOG_DATA);

  close(result: boolean) {
    this.dialogRef.close(result);
  }
}

