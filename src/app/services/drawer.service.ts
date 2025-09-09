import {Injectable, signal} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';

@Injectable({ providedIn: 'root' })
export class DrawerService {

  constructor() { }

  private drawer!: MatDrawer;

  setDrawer(drawer: MatDrawer) {
    this.drawer = drawer;
  }

  toggle() {
    this.drawer.toggle();
  }
}
