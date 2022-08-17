import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { UsersPageComponent } from './components/users-page/users-page.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { UsersProfilePageComponent } from './components/users-page/users-profile-page/users-profile-page.component';
import { GlobalPageComponent } from './components/global-page/global-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'global', component: GlobalPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'users', component: UsersPageComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'users/:user_id', component: UsersProfilePageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
