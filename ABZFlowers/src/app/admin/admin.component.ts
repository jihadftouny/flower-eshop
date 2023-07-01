import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../home/products/product.model';
import { ProductsService } from '../home/products/products.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthData } from '../auth/auth-data.model';
import { AuthService } from 'src/app/auth/auth.service';
import { EventsService } from '../events/events.service';
import { Eventt } from '../events/event.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit, OnDestroy {
  // products = [
  //   { title: 'First Product', content: "This is the first product's content" },
  //   { title: 'Second Product', content: "This is the second product's content" },
  //   { title: 'Third Product', content: "This is the third product's content" },
  // ];
  searchTermProducts: string;
  searchTermUsers: string;
  filteredProducts: Product[];
  filteredUsers: AuthData[];
  searched = false;

  users: AuthData[] = [];
  products: Product[] = [];
  events: Eventt[] = [];
  isLoading = false;
  totalPosts = 0;
  totalUsers = 0;
  totalEvents = 0;
  productsPerPage = 10;
  usersPerPage = 10;
  eventsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [10, 25, 50];
  userIsAuthenticated = false;
  userId: string;
  userIdUsers: string;
  userIdEvents: string;
  private authStatusSub: Subscription;
  private authStatusSubUsers: Subscription;
  private authStatusSubEvents: Subscription;
  private userSub: Subscription;
  private productsSub: Subscription;
  private eventsSub: Subscription; //will avoid memory leaks when this component is not part of the display (kills the data)
  // productsService: ProductsService; the public keyword in the constructor automatically creates this and stores values on it

  modalImage = '';

  constructor(
    public productsService: ProductsService,
    public eventsService: EventsService,
    private authService: AuthService,
    private authServiceUsers: AuthService,
    private authServiceEvents: AuthService
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
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
    // users //
    this.authServiceUsers.getUsers(this.usersPerPage, this.currentPage);
    this.userIdUsers = this.authServiceUsers.getUserId();
    this.userSub = this.authServiceUsers
      .getUserUpdateListener()
      .subscribe((authData: { users: AuthData[]; userCount: number }) => {
        this.isLoading = false;
        this.totalUsers = authData.userCount;
        this.users = authData.users;
      });
    this.userIsAuthenticated = this.authServiceUsers.getIsAuth();
    this.authStatusSubUsers = this.authServiceUsers
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userIdUsers = this.authServiceUsers.getUserId();
      });

    //events
    this.eventsService.getEvents(this.eventsPerPage, this.currentPage);
    this.userIdEvents = this.authServiceEvents.getUserId();
    this.eventsSub = this.eventsService
      .getEventUpdateListener()
      .subscribe(
        (eventData: { events: Eventt[]; eventCount: number }) => {
          this.isLoading = false;
          this.totalEvents = eventData.eventCount;
          this.events = eventData.events;
        }
      );
    this.userIsAuthenticated = this.authServiceEvents.getIsAuth();
    this.authStatusSubEvents = this.authServiceEvents
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userIdEvents = this.authServiceEvents.getUserId();
      });
  }

  searchProducts(): void {
    if (!this.searchTermProducts) {
      // If search query is empty, show all products
      this.filteredProducts = this.products;
      this.searched = false;
    } else {
      // Filter products based on search query
      this.searched = true;
      this.filteredProducts = this.products.filter((product) =>
        product.title
          .toLowerCase()
          .includes(this.searchTermProducts.toLowerCase())
      );
    }
  }

  //called whenever the component is about to be destroyed
  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.productsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
    this.authStatusSubUsers.unsubscribe();
  }

  onDeleteUser(userId: string) {
    this.isLoading = true;
    this.authService.deleteUser(userId).subscribe(() => {
      this.authService.getUsers(this.usersPerPage, this.currentPage);
    });
  }
  onDelete(productId: string) {
    this.isLoading = true;
    this.productsService.deleteProduct(productId).subscribe(() => {
      this.productsService.getProducts(this.productsPerPage, this.currentPage);
    });
  }

  //deprecated
  onSearch() {
    // Call a method in the service to perform the search
    this.productsService.searchProducts(this.searchTermProducts);
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.productsPerPage = pageData.pageSize;
    this.productsService.getProducts(this.productsPerPage, this.currentPage);
  }

  openImageModal(productId: string) {
    this.productsService.getProduct(productId).subscribe((product) => {
      this.modalImage = product.imagePath;
    });
  }

  // USERS //

  searchUsers(): void {
    if (!this.searchTermUsers) {
      // If search query is empty, show all productss
      this.filteredUsers = this.users;
      this.searched = false;
    } else {
      // Filter users based on search query
      this.searched = true;
      this.filteredUsers = this.users.filter((user) =>
        user.email.toLowerCase().includes(this.searchTermUsers.toLowerCase())
      );
    }
  }
}
