import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyManagementComponent } from './property-management.component';
import { PropertyManagementRoutingModule } from './property-management-routing';
import { SharedModule } from '../shared/shared.module';
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { PropertyCardComponent } from './property-card/property-card.component';
import { PropertyUploadModule } from './property-upload/property-upload.module';


@NgModule({
  declarations: [
    PropertyManagementComponent,
    PropertyDetailsComponent,
    PropertyCardComponent],
  imports: [
    CommonModule,
    PropertyManagementRoutingModule,
    SharedModule,
    MatTableModule,
    TranslateModule.forChild(
      { extend: true }
    ),
    PropertyUploadModule
  ]
})
export class PropertyManagementModule {
}
