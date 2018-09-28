import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SourceComponent } from './source/source.component';

const routes: Routes = [
  { path: 'source/:id', component: SourceComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }