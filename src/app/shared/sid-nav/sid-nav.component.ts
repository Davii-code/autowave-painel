import {Component, computed, Input, signal} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatListItem, MatListItemIcon, MatNavList} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-sid-nav',
  imports: [
    RouterLinkActive,
    MatListItemIcon,
    MatListItem,
    RouterLink,
    MatIcon,
    MatNavList
  ],
  templateUrl: './sid-nav.component.html',
  standalone: true,
  styleUrl: './sid-nav.component.css'
})
export class SidNavComponent {

  sidenavCollapsed = signal(false)
  @Input() set collapsed(value: boolean) {
    this.sidenavCollapsed.set(value)
  }

  profilePicSize = computed(()=> this.sidenavCollapsed() ? '35' : '100')

}
