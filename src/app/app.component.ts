import {Component, inject} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {SecurityService} from './authentication/security/security.service';
import {NgIf} from '@angular/common';
import {NavBarComponent} from './shared/nav-bar/nav-bar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgIf, NavBarComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  private _router = inject(Router);
  private _securityService = inject(SecurityService);
  title = 'Auto-Wave';
  showBars: boolean = true;

  constructor() {
    this._securityService.init();

    this._router.events.subscribe(() => {
      this.showBars = this._router.url !== '/login';
    });
  }
}
