import { Component } from '@angular/core';
import { Product } from '../home/products/product.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems: Product[] = [];
  phoneNumber: string;

  constructor() { }

  ngOnInit(): void {
    const storedCartItems = localStorage.getItem("abz-flowers-cart");
    if (storedCartItems) {
      this.cartItems = JSON.parse(storedCartItems);
    }

    // Retrieve the phone number from local storage
    this.phoneNumber = localStorage.getItem('phoneNumber');
  }

  confirmOrder() {
    //this will store the numbers to a new document that will be displayed on, the admin panel
    //then clear the cart
    localStorage.removeItem("abz-flowers-cart");
  }

  deleteCart() {
    localStorage.removeItem("abz-flowers-cart");
  }
}
