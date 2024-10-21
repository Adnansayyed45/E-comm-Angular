import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SellerService } from './services/seller.service';

import { CanMatch, Route, UrlSegment, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate , CanMatch {
  constructor(private sellerService:SellerService,
    private router: Router
  ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(localStorage.getItem('seller')){
       return true;
      }
      return this.sellerService.isSellerLoggedIn;
  }
  canMatch(route: Route, segments: UrlSegment[]): boolean {
    // Check if seller data exists in localStorage
    const sellerData = localStorage.getItem('seller');
    
    if (sellerData) {
      return true;  // Seller is logged in, allow access
    } else {
      // If not, redirect to a different page (e.g., login or home)
      this.router.navigate(['/']);
      return false;  // Deny access
    }
  }
  
} 