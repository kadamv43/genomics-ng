import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannersRoutingModule } from './banners-routing.module';
import { BannerListComponent } from './banner-list/banner-list.component';
import { BannerEditComponent } from './banner-edit/banner-edit.component';
import { BannerCreateComponent } from './banner-create/banner-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';


@NgModule({
  declarations: [
    BannerListComponent,
    BannerEditComponent,
    BannerCreateComponent
  ],
  imports: [
    CommonModule,
    BannersRoutingModule,
    ReactiveFormsModule,
    DropdownModule,
    ToastModule,
    ToolbarModule,
    TableModule,
    ButtonModule,
    InputTextModule,
  ]
})
export class BannersModule { }
