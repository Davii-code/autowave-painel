import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {NgStyle} from '@angular/common';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MensageiroService} from '../mensageiro.service';
import {MatInput} from '@angular/material/input';
import {MatTooltip} from '@angular/material/tooltip';
import {ClientSelectComponent} from '../../client/client-select/client-select.component';

@Component({
  selector: 'app-mensageiro-status',
  imports: [MatCardModule, MatButtonModule, NgStyle, MatToolbar, MatIcon, FormsModule, MatInput, MatTooltip, ClientSelectComponent],
  templateUrl: './mensageiro.component.html',
  styleUrl: './mensageiro.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class MensageiroComponent {
  haveInstance = false;
  /** 'connecting' | 'open' | 'close' */
  status: string = '';
  qrCodeBase64: string = '';

  text = '';
  selectedClients: any[] = [];

  /** Pode enviar se tiver conectado, houver texto e houver clientes selecionados */
  get canSend() {
    return this.haveInstance && this.status === 'open' && !!this.text.trim() && this.selectedClients.length > 0;
  }

  constructor(public service: MensageiroService, private cdr: ChangeDetectorRef) {
    this.getStatus();
  }

  // Mantém o nome antigo como alias para não quebrar o HTML antigo (se existir)
  getTittleCard(): string { return this.getTitleCard(); }

  getTitleCard(): string {
    const labels: Record<string, string> = {
      connecting: 'Escaneie o QR Code para conectar o WhatsApp com nosso sistema',
      open: 'Mensageiro conectado e funcionando',
      close: 'Mensageiro desconectado'
    };
    return labels[this.status] ?? labels['close'];
  }

  getImage(): string {
    if (this.status === 'connecting' && this.qrCodeBase64) {
      // Garante prefixo data URL
      return this.qrCodeBase64.startsWith('data:')
        ? this.qrCodeBase64
        : `data:image/png;base64,${this.qrCodeBase64}`;
    }
    const images: Record<string, string> = {
      open: 'assets/circle-check-solid.svg',
      close: 'assets/circle-xmark-solid.svg',
      connecting: 'assets/qrcode-placeholder.svg' // fallback enquanto não vem o base64
    };
    return images[this.status] ?? images['close'];
  }

  getButtonLabel(): string {
    const labels: Record<string, string> = {
      connecting: 'Atualizar',
      open: 'Desconectar',
      close: 'Conectar'
    };
    return labels[this.status] ?? labels['close'];
  }

  getButtonStyle(): Record<string, string> {
    const styles: Record<string, Record<string, string>> = {
      connecting: { 'background-color': 'var(--azul-claro)' },
      open: { 'background-color': 'var(--vermelho)' },
      close: { 'background-color': 'var(--verde)' }
    };
    return styles[this.status] ?? styles['close'];
  }

  handleButtonClick(): void {
    const actions: Record<string, () => void> = {
      connecting: () => this.atualizar(),
      open: () => this.desconectar(),
      close: () => this.conectar()
    };
    (actions[this.status] ?? actions['close'])();
  }

  getStatus() {
    this.service.status().subscribe({
      next: (response) => {
        this.haveInstance = true;
        this.status = response.status;
        // Se estiver pedindo conexão, pode vir QR em status()
        if (response.base64) this.qrCodeBase64 = response.base64;
        this.cdr.detectChanges();
      },
      error: () => {
        this.haveInstance = false;
        this.status = 'close';
        this.cdr.detectChanges();
      }
    });
  }

  conectar() {
    this.service.connect().subscribe({
      next: (response) => {
        this.qrCodeBase64 = response.base64 || '';
        this.status = 'connecting';
        this.cdr.detectChanges();
      }
    });
  }

  desconectar() {
    this.service.logout().subscribe({
      next: () => this.getStatus()
    });
  }

  atualizar() { this.getStatus(); }

  enviar() {
    // Regras simples de segurança/UX
    const message = this.text.trim();
    if (!message) return;
    if (message.length > 4096) { // ajuste se sua API permitir outro tamanho
      alert('Mensagem muito longa. Reduza o texto para até 4096 caracteres.');
      return;
    }
    if (this.selectedClients.length === 0) {
      alert('Selecione ao menos um cliente.');
      return;
    }

    const dto = { clients: this.selectedClients, message };
    this.service.sendMessage(dto).subscribe({
      next: (response) => {
        // feedback básico; ideal: snackbar
        console.log(response);
      },
      error: (err) => console.error(err)
    });
  }

  formatText(format: 'bold' | 'italic') {
    const textarea = document.getElementById('editor') as HTMLTextAreaElement | null;
    if (!textarea) return;
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const selectedText = this.text.substring(start, end);

    const formats: Record<string, [string, string]> = {
      bold: ['*', '*'],
      italic: ['_', '_']
    };
    const wrapper = formats[format];
    if (!wrapper) return;

    const [before, after] = wrapper;
    this.text = this.text.substring(0, start) + before + selectedText + after + this.text.substring(end);

    // Reposiciona o cursor
    setTimeout(() => {
      textarea.focus();
      const caretStart = start + before.length;
      textarea.setSelectionRange(caretStart, caretStart + selectedText.length);
    });
  }

  onSelectedClientsChange(selected: any[]) {
    this.selectedClients = selected ?? [];
  }
}
