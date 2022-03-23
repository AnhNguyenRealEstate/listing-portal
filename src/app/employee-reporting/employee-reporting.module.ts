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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RTEditorModule } from '../rich-text-editor/rich-text-editor.module';
import { MatNativeDateModule } from '@angular/material/core';

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
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RTEditorModule
  ],
  exports: [
    EmployeeReportingComponent,
    ReportUploadComponent,
    ReportUploadDialogComponent]
})
export class EmployeeReportingModule { }
