import {ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {ClientService} from '../client-service/client.service';

@Component({
  selector: 'app-client-select',
  imports: [MatTableModule, MatCheckbox, MatSort, MatSortHeader],
  templateUrl: './client-select.component.html',
  standalone: true,
  styleUrl: './client-select.component.css'
})
export class ClientSelectComponent {
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['checkAll', 'name'];
  selectedClients: any[] = [];
  @Input() disabled: boolean = true;

  @ViewChild(MatSort) sort!: MatSort;
  @Output() selectedClientsChange = new EventEmitter<any[]>();

  constructor(private clientService: ClientService, private changeDetectorRef: ChangeDetectorRef) {
    this.dataSource = new MatTableDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.listClients();
    this.changeDetectorRef.detectChanges();
  }

  toggleSelection(paciente: any) {
    const index = this.selectedClients.indexOf(paciente);
    if (index === -1) {
      this.selectedClients.push(paciente);
    } else {
      this.selectedClients.splice(index, 1);
    }
    this.selectedClientsChange.emit(this.selectedClients);
  }

  listClients() {
    const sortData = this.sort.active ? {sortParam: this.sort.active, sortDirection: this.sort.direction} : null;
    this.clientService.listarClientes(null,0, 100,sortData).subscribe(response => {
      this.dataSource.data = response.content;
    });
  }

  checkAll(checked: boolean) {
    if (checked) {
      this.selectedClients = this.dataSource.data;
    } else {
      this.selectedClients = [];
    }
    this.selectedClientsChange.emit(this.selectedClients);
  }
}
