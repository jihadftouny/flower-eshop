import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsComponent } from './events/events.component';
import { HomeComponent } from './home/home.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './auth/login/login.component';
import { LoginDashboardComponent } from './login-dashboard/login-dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { ProductCreateComponent } from './home/products/product-create/product-create.component';
import { ProductListComponent } from './home/products/product-list/product-list.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'events', component: EventsComponent },
  { path: 'admin-panel', component: AdminComponent },

  { path: 'login-dashboard', component: LoginDashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'cart', component: CartComponent },

  { path: 'list-product', component: ProductListComponent },
  { path: 'create-product', component: ProductCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:productId', component: ProductCreateComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
