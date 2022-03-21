import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeReportingComponent } from './employee-reporting.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { EmployeeReportingRoutingModule } from './employee-reporting-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { ReportUploadComponent } from './report-upload/report-upload.component';
import { ReportUploadDialogComponent } from './report-upload/report-upload-dialog.component';


@NgModule({
  declarations: [
    EmployeeReportingComponent,
    ReportUploadComponent,
    ReportUploadDialogComponent
  ],
  imports: [
    CommonModule,
    EmployeeReportingRoutingModule,
    SharedModule,
    TranslateModule.forChild({
      extend: true
    }),
    MatExpansionModule,
    MatTabsModule
  ],
  exports: [
    EmployeeReportingComponent,
    ReportUploadComponent,
    ReportUploadDialogComponent]
})
export class EmployeeReportingModule { }
