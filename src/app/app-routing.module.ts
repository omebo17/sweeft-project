import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersComponent } from 'src/components/users/users.component'; 
import { UserProfileComponent } from 'src/components/user-profile/user-profile.component';


const routes: Routes = [
    { path: '', component: UsersComponent },
    { path: 'users/:id', component: UserProfileComponent },
    { path: '**', redirectTo: '' }
 ];

 @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
 })
 export class AppRoutingModule { }