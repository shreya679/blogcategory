import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogcategoryRoutingModule } from './blogcategory-routing.module';
import { ListComponent } from './list/list.component';


import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSortModule } from "@angular/material/sort";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatMenuModule } from "@angular/material/menu";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatChipsModule } from "@angular/material/chips";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTabsModule } from "@angular/material/tabs";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { MatTableExporterModule } from "mat-table-exporter";
import { ComponentsModule } from 'src/app/shared/components/components.module';
// import { FormDialogComponent } from './list/dialogs/form-dialogs/form-dialogs.component';
import { BlogcategoryService } from './blogcategory.service';
import { FormDialogComponent } from './list/dialogs/form-dialog/form-dialog.component';


@NgModule({
  declarations: [
    ListComponent,
    // FormDialogComponent
    FormDialogComponent
  ],
  imports: [
    CommonModule,
    BlogcategoryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSortModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    DragDropModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTabsModule,    
    MatTableExporterModule,
    ComponentsModule
  ],
  providers: [BlogcategoryService],
})
export class BlogcategoryModule { }