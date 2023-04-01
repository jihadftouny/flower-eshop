import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { LoginDashboardComponent } from './login-dashboard/login-dashboard.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AbouttUsComponent } from './aboutt-us/aboutt-us.component';
import { CartComponent } from './cart/cart.component';
import { EventsComponent } from './events/events.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    LoginComponent,
    LoginDashboardComponent,
    ContactUsComponent,
    AbouttUsComponent,
    CartComponent,
    EventsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
