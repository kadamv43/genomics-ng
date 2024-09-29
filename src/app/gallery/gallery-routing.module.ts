import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GalleryListComponent } from './gallery-list/gallery-list.component';
import { GalleryEditComponent } from './gallery-edit/gallery-edit.component';
import { GalleryCreateComponent } from './gallery-create/gallery-create.component';
import { GalleryImagesComponent } from './gallery-images/gallery-images.component';

const routes: Routes = [
    { path: '', component: GalleryListComponent },
    { path: 'edit/:id', component: GalleryEditComponent },
    { path: 'create', component: GalleryCreateComponent },
    { path: 'images/:id', component: GalleryImagesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GalleryRoutingModule { }
