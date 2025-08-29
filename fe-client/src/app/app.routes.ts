import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TreeComponent } from './pages/tree/tree.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Beranda' },
  { path: 'tree', component: TreeComponent, title: 'Family Tree' },
  { path: 'profile', component: ProfileComponent, title: 'Profil' },
  { path: '**', redirectTo: '' }
];
