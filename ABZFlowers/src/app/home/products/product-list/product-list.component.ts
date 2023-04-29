import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../product.model';
import { ProductsService } from '../products.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  // products = [
  //   { title: 'First Product', content: "This is the first product's content" },
  //   { title: 'Second Product', content: "This is the second product's content" },
  //   { title: 'Third Product', content: "This is the third product's content" },
  // ];

  products: Product[] = [];
  isLoading = false;
  private productsSub: Subscription; //will avoid memory leaks when this component is not part of the display (kills the data)
  // productsService: ProductsService; the public keyword in the constructor automatically creates this and stores values on it

  constructor(public productsService: ProductsService) {
    //this.productsService = productsService; the public keyword in the constructor automatically creates this and stores values on it
  }

  ngOnInit() {
    this.isLoading = true;
    this.productsService.getProducts();

    this.productsSub = this.productsService
      .getProductUpdateListener()
      .subscribe((products: Product[]) => {
        this.isLoading = false;
        this.products = products;
      });
  }

  //called whenever the component is about to be destroyed
  ngOnDestroy() {
    this.productsSub.unsubscribe();
  }

  onDelete(productId: string) {
    this.productsService.deleteProduct(productId);
  }
}
