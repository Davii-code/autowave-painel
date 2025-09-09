import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {NgStyle} from '@angular/common';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {PacienteSelectComponent} from '../../paciente/paciente-select/paciente-select.component';
import {MensageiroService} from '../mensageiro.service';
import {MatInput} from '@angular/material/input';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-mensageiro-status',
  imports: [MatCardModule, MatButtonModule, NgStyle, MatToolbar, MatIcon, FormsModule, PacienteSelectComponent, MatInput, MatTooltip],
  templateUrl: './mensageiro.component.html',
  styleUrl: './mensageiro.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MensageiroComponent {
  haveInstance: boolean = false;
  status: string = '';
  qrCodeBase64: string = '';

  text: string = '';
  selectedPacientes: any[] = [];

  constructor(public service: MensageiroService,
              private changeDetectorRef: ChangeDetectorRef) {
    this.getStatus();
  }

  getTittleCard(): string {
    const labels: { [key: string]: string } = {
      connecting: 'Escaneie o QR Code para conectar o WhatsApp com nosso sistema',
      open: 'Mensageiro conectado e funcionando',
      close: 'Mensageiro desconectado'
    };
    return labels[this.status] || labels['close'];
  }

  getImage(): string {
    const images: { [key: string]: string } = {
      connecting: this.qrCodeBase64,
      open: 'assets/circle-check-solid.svg',
      close: 'assets/circle-xmark-solid.svg'
    };
    return images[this.status] || images['close'];
  }

  getButtonLabel(): string {
    const labels: { [key: string]: string } = {
      connecting: 'Atualizar',
      open: 'Desconectar',
      close: 'Conectar'
    };
    return labels[this.status] || labels['close'];
  }

  getButtonStyle(): { [key: string]: string } {
    const styles: { [key: string]: any } = {
      connecting: { 'background-color': 'var(--azul-claro)' },
      open: { 'background-color': 'var(--vermelho)' },
      close: { 'background-color': 'var(--verde)' }
    };
    return styles[this.status] || styles['close'];
  }

  handleButtonClick(): void {
    const actions: { [key: string]: () => void } = {
      connecting: () => this.atualizar(),
      open: () => this.desconectar(),
      close: () => this.conectar()
    };
    (actions[this.status] ?? actions['close'])();
  }

  getStatus() {
    this.service.status().subscribe({
      next: response => {
        this.haveInstance = true
        this.status = response.status
        console.log(this.status)
        this.changeDetectorRef.detectChanges()
      },
      error: err => {
        this.haveInstance = false
        this.changeDetectorRef.detectChanges();
      }
    })
  }

  conectar() {
    this.service.connect().subscribe({
      next: response => {
        console.log(response)
        this.qrCodeBase64 = response.base64;
        this.status = 'connecting';
        this.changeDetectorRef.detectChanges()
      }
    })
  }

  desconectar() {
    this.service.logout().subscribe({
      next: () => {
        this.getStatus();
      }
    })
  }

  atualizar() {
    this.getStatus();
  }

  enviar() {
    let dto = { patients: this.selectedPacientes, message: this.text }
    console.log(dto)
    this.service.sendMessage(dto).subscribe({
      next: response => {
        console.log(response)
      },
      error: err => {
        console.log(err)
      }
    })  }

  formatText(format: string) {
    const textarea = document.getElementById('editor') as HTMLTextAreaElement;
    const { selectionStart: start, selectionEnd: end } = textarea;
    const selectedText = this.text.substring(start, end);

    const formats: Record<string, [string, string]> = {
      bold: ['*', '*'],
      italic: ['_', '_'],
    };

    if (formats[format]) {
      const [before, after] = formats[format];
      this.text = this.text.substring(0, start) + before + selectedText + after + this.text.substring(end);
    }

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + (formats[format]?.[0]?.length || 0), start + (formats[format]?.[0]?.length || 0) + selectedText.length);
    });
  }

  onSelectedPacientesChange(selected: any[]) {
    this.selectedPacientes = selected;
  }
}
