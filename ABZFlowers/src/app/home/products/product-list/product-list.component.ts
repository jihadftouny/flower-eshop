import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../product.model';
import { ProductsService } from '../products.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

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
  totalPosts = 0;
  productsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private authStatusSub: Subscription;
  private productsSub: Subscription; //will avoid memory leaks when this component is not part of the display (kills the data)
  // productsService: ProductsService; the public keyword in the constructor automatically creates this and stores values on it

  constructor(
    public productsService: ProductsService,
    private authService: AuthService
  ) {
    //this.productsService = productsService; the public keyword in the constructor automatically creates this and stores values on it
  }

  ngOnInit() {
    this.isLoading = true;
    this.productsService.getProducts(this.productsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.productsSub = this.productsService
      .getProductUpdateListener()
      .subscribe(
        (productData: { products: Product[]; productCount: number }) => {
          this.isLoading = false;
          this.totalPosts = productData.productCount;
          this.products = productData.products;
        }
      );
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }



  //called whenever the component is about to be destroyed
  ngOnDestroy() {
    this.productsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onDelete(productId: string) {
    this.isLoading = true;
    this.productsService.deleteProduct(productId).subscribe(() => {
      this.productsService.getProducts(this.productsPerPage, this.currentPage);
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.productsPerPage = pageData.pageSize;
    this.productsService.getProducts(this.productsPerPage, this.currentPage);
  }
}
