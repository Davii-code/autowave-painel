import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {inject, Injectable} from '@angular/core';
import {SecurityService} from './security.service';
import {Observable} from 'rxjs';

@Injectable()
export class SecurityGuard implements CanActivate {

  private _securityService = inject(SecurityService);

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let valid = false;
    if (this._securityService.isValid()) {
      const roles = next.data['security'] ? next.data['security'].roles : [];
      if (this._securityService.hasRoles(roles)) {
        valid = true;
      } else {
        this._securityService.onUnauthorized.emit(this._securityService.credential);
      }
    } else {
      this._securityService.onForbidden.emit(this._securityService.credential);
    }
    return valid;
  }
}

