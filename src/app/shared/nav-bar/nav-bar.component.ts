import {Component, computed, inject, signal} from '@angular/core';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {RouterOutlet} from '@angular/router';
import {SidNavComponent} from '../sid-nav/sid-nav.component';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {SecurityService} from '../../authentication/security/security.service';

@Component({
  selector: 'app-nav-bar',
  imports: [
    MatSidenav,
    MatSidenavContent,
    RouterOutlet,
    SidNavComponent,
    MatSidenavContainer,
    MatIcon,
    MatToolbar,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem
  ],
  templateUrl: './nav-bar.component.html',
  standalone: true,
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  private _securityService = inject(SecurityService);

  collapsed=signal(true);

  sidenavWidth = computed(()=>this.collapsed() ? '70px':'250px')

  logout() {
    this._securityService.logout();
  }
}
