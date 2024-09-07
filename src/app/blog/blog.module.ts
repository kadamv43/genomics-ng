import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogEditComponent } from './blog-edit/blog-edit.component';
import { BlogCreateComponent } from './blog-create/blog-create.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { EditorModule } from 'primeng/editor';


@NgModule({
    declarations: [
      BlogEditComponent,
      BlogCreateComponent,
      BlogListComponent
    ],
    imports: [
      CommonModule,
      ToolbarModule,
      TableModule,
      InputTextModule,
      CalendarModule,
      ButtonModule,
      ReactiveFormsModule,
      PanelModule,
      DropdownModule,MultiSelectModule,
      ToastModule,
      EditorModule,
      BlogRoutingModule],
})
export class BlogModule {}
