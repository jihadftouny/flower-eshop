import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { EventsComponent } from "./events.component";
import { EventCreateComponent } from "./event-create/event-create.component";
import { AngularMaterialModule } from "../angular-material.module";

@NgModule({
  declarations: [EventsComponent, EventCreateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class EventsModule {}
