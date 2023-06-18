import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from './products/product.model';
import { ProductsService } from './products/products.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  products: Product[] = [];
  isLoading = false;
  totalPosts = 0;
  productsPerPage = 10;
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
  ) {}

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
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  //called whenever the component is about to be destroyed
  ngOnDestroy() {
    this.productsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
    //need to add a second authStatusSub here
  }

  //modify here
  // onSaveEvent() {
  //   this.isLoading = true;
  //   this.eventtsService.addEvent(
  //     this.form.value.name,
  //     this.form.value.index,
  //     this.form.value.image
  //   );
  // }

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

  addToCart(product: Product) {
    const list = []
    list.push(product)
    if (localStorage.getItem("abz-flowers-cart") !== null) {
      const productList = JSON.parse(localStorage.getItem("abz-flowers-cart")) //isso aqui transforma string pra array
      productList.push(product)
      localStorage.setItem("abz-flowers-cart", JSON.stringify(productList))
    } else {
      localStorage.setItem("abz-flowers-cart", JSON.stringify(list))
    }
  }
}
