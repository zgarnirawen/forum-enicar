import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CandidatureComponent } from './candidature.component';
import { PosteLabelPipe } from './poste-label.pipe';
 
const routes: Routes = [
  { path: '', component: CandidatureComponent },
];
 
@NgModule({
  declarations: [CandidatureComponent, PosteLabelPipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(routes),
  ],
})
export class CandidatureModule {}
 