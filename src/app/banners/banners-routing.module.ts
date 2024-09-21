import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BannerListComponent } from './banner-list/banner-list.component';
import { BannerEditComponent } from './banner-edit/banner-edit.component';
import { BannerCreateComponent } from './banner-create/banner-create.component';

const routes: Routes = [
    { path: '', component:  BannerListComponent },
    { path: 'edit/:id', component: BannerEditComponent },
    { path: 'create', component: BannerCreateComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BannersRoutingModule { }
