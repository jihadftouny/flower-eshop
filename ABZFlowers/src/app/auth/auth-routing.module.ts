import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { MyAccountComponent } from "../my-account/my-account.component";

const routes: Routes = [
  { path: "auth/login", component: LoginComponent },
  { path: "auth/signup", component: SignupComponent },
  { path: 'my-account', component: MyAccountComponent },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
