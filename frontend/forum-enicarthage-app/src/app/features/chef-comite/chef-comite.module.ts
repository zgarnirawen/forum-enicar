import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ChefDashboardComponent } from './dashboard/chef-dashboard.component';
import { ChefMembresComponent } from './membres/chef-membres.component';
import { ChefTachesComponent } from './taches/chef-taches.component';

const routes: Routes = [
  { path: 'dashboard', component: ChefDashboardComponent },
  { path: 'membres',   component: ChefMembresComponent },
  { path: 'taches',    component: ChefTachesComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  declarations: [ChefDashboardComponent, ChefMembresComponent, ChefTachesComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class ChefComiteModule {}
