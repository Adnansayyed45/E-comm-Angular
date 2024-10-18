import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userName: string = '';
  cartItems = 0;
  searchResult: undefined | product[];
  isMenuOpen = false; // Property to track the menu state

  // Method to toggle the hamburger menu
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen; // Toggle the boolean value
  }

  constructor(private route: Router, private product: ProductService) {}

  ngOnInit(): void {
    this.updateHeader(); // Initialize header based on user/seller state

    // Subscribe to cart changes
    const cartData = localStorage.getItem('localCart');
    if (cartData) {
      this.cartItems = JSON.parse(cartData).length;
    }

    this.product.cartData.subscribe((items) => {
      this.cartItems = items.length;
    });
  }

  // Function to dynamically update header based on user/seller login
  updateHeader() {
    const userStore = localStorage.getItem('user');
    if (userStore) {
      const userData = JSON.parse(userStore);
      this.userName = userData.name;
      this.product.getCartList(userData.id);
    }
  }

  // Handle user logout with a page reload
  userLogout() {
    localStorage.removeItem('user');
    this.route.navigate(['/user-auth']).then(() => {
      location.reload(); // Force page reload after logout
    });
    this.product.cartData.emit([]); // Reset cart data
  }

  searchProduct(query: KeyboardEvent) {
    if (query) {
      const element = query.target as HTMLInputElement;
      this.product.searchProduct(element.value).subscribe((result) => {
        this.searchResult = result.length > 5 ? result.slice(0, 5) : result;
      });
    }
  }

  hideSearch() {
    this.searchResult = undefined;
  }

  redirectToDetails(id: number) {
    this.route.navigate(['/details/' + id]);
  }

  submitSearch(val: string) {
    this.route.navigate([`search/${val}`]);
  }
}