import { Component } from '@angular/core';
import { Product } from '../home/products/product.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductsService } from '../home/products/products.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems: Product[] = [];

  phoneNumber: string;
  checkoutForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private productService: ProductsService
  ) {
    this.checkoutForm = this.formBuilder.group({
      phoneNumber: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const storedCartItems = localStorage.getItem("abz-flowers-cart");
    if (storedCartItems) {
      this.cartItems = JSON.parse(storedCartItems);
    }

    // Retrieve the phone number from local storage
    this.phoneNumber = localStorage.getItem('phoneNumber');
  }

  confirmOrder() {
    if (this.checkoutForm.valid) {
      const phoneNumber = this.checkoutForm.value.phoneNumber;
      const order = {
        cartItems: this.cartItems.map(item => item.title).join(', '),
        phoneNumber: phoneNumber,
      };

      this.productService.createOrder(order).subscribe(() => {
        console.log(order)
        // Success message or redirection to a success page
        this.snackBar.open('Order confirmed!', 'Dismiss', {
          duration: 2000, // Duration in milliseconds
        });
      });
    }
  }

  deleteCart() {
    localStorage.removeItem("abz-flowers-cart");
    this.snackBar.open('Cart emptied successfully!', 'Dismiss', {
      duration: 2000, // Duration in milliseconds
    });
  }
}
