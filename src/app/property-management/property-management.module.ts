import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyManagementComponent } from './property-management.component';
import { PropertyManagementRoutingModule } from './property-management-routing';
import { SharedModule } from '../shared/shared.module';
import { PropertyDetailsComponent } from './details/details.component';
import { MatTableModule } from '@angular/material/table';


@NgModule({
  declarations: [
    PropertyManagementComponent,
    PropertyDetailsComponent],
  imports: [
    CommonModule,
    PropertyManagementRoutingModule,
    SharedModule,
    MatTableModule
  ]
})
export class PropertyManagementModule { }
