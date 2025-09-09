import {Component, computed, effect, inject, signal} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Campaing} from '../../models/Campaing';
import {MatSortModule, Sort} from '@angular/material/sort';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {
  ConfirmDeleteData,
  ConfirmDeleteDialogComponent
} from '../../shared/confirm-delete-dialog/confirm-delete-dialog.component';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CampaingService} from './campaing-service/campaing.service';
import {CampaingCreateComponent} from './campaing-create/campaing-create.component';
import {CampaingDialogEditComponent} from './campaing-dialog-edit/campaing-dialog-edit.component';

@Component({
  selector: 'app-campaing',
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule,
    MatProgressBarModule, MatTooltipModule
  ],
  templateUrl: './campaing.component.html',
  standalone: true,
  styleUrl: './campaing.component.css'
})
export class CampaingComponent {
  private service = inject(CampaingService);
  private dialog = inject(MatDialog);

  loading = signal(false);
  data = signal<Campaing[]>([]);
  total = signal(0);

  displayedColumns = ['id', 'name', 'scheduledDate', 'actions'] as const;

  pageIndex = signal(0);
  pageSize = signal(10);
  sort = signal<Sort | null>(null);
  search = new FormControl<string>('', { nonNullable: true });

  filtro = computed(() => {
    const term = this.search.value?.trim() ?? '';
    return term ? { q: term } : {};
  });

  constructor() {
    effect(() => {
      const p = this.pageIndex();
      const s = this.pageSize();
      const sort = this.sort();
      const filtro = this.filtro();
      this.fetch(p, s, sort || undefined, filtro);
    });
  }

  fetch(page: number, size: number, sort?: Sort, filtro?: any) {
    this.loading.set(true);
    const sortData = sort?.active ? { sortParam: sort.active, sortDirection: (sort.direction || 'asc') as 'asc' | 'desc' } : undefined;

    this.service.listarCampaing(filtro ?? {}, page, size, sortData).subscribe({
      next: ({ content, total }) => {
        this.data.set(content);
        this.total.set(total);
        this.loading.set(false);
      },
      error: () => {
        this.data.set([]);
        this.total.set(0);
        this.loading.set(false);
      }
    });
  }

  onPage(e: PageEvent) {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
  }

  onSort(e: Sort) {
    this.sort.set(e);
  }

  applySearch() {
    this.pageIndex.set(0); // reativa o effect e refaz a busca
  }

  clearSearch() {
    this.search.setValue('');  // <-- era this.search.set('')
    this.pageIndex.set(0);     // força refetch pelo effect
  }

  trackById = (_: number, item: Campaing) => item.id!;
  confirmDelete(row: { id: number; name?: string }) {
    const ref = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '420px',
      data: {
        title: 'Excluir Campainge',
        message: `Tem certeza que deseja excluir "${row.name ?? 'este Campanha'}" (Código: ${row.id})?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
      } as ConfirmDeleteData,
    });

    ref.afterClosed().subscribe((ok) => {
      if (ok) {
        this.delete(row.id);
      }
    });
  }

  delete(id: number) {
    this.loading.set(true);
    this.service.excluir(id).subscribe({
      next: () => {
        // atualiza a tabela localmente sem recarregar a página toda
        this.data.update((list: any[]) => list.filter((i) => i.id !== id));
        this.total.update((t: number) => Math.max(0, (t ?? 0) - 1));
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Erro ao excluir:', err?.error || err);
        alert(err?.error?.message || err?.message || 'Erro ao excluir Campainge');
      },
    });
  }

  openCreateDialog() {
    const ref = this.dialog.open(CampaingCreateComponent, {
      width: '960px',
      maxWidth: '98vw',
      maxHeight: '90vh',
      disableClose: true
    });

    ref.afterClosed().subscribe(result => {
      if (result?.created) {
        this.fetch(this.pageIndex(), this.pageSize(), this.sort() || undefined, this.filtro());
      }
    });
  }

  openEditDialog(id?: number) {
    if (!id) return;
    const ref = this.dialog.open(CampaingDialogEditComponent, {
      width: '960px',
      maxWidth: '98vw',
      maxHeight: '92vh',
      disableClose: true,
      data: { id }
    });
    ref.afterClosed().subscribe(res => {
      if (res?.updated) {
        this.fetch(this.pageIndex(), this.pageSize(), this.sort() || undefined, this.filtro());
      }
    });
  }
}

