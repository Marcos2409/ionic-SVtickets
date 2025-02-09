import { Routes } from '@angular/router';
import { profileResolver } from './resolvers/profile.resolver';
import { numericIdGuard } from '../shared/guards/numeric-id.guard';

export const profileRoutes: Routes = [
  {
    path: '',
    resolve: {
      user: profileResolver,
    },
    loadComponent: () =>
      import('./profile-page/profile-page.page').then(
        (m) => m.ProfilePagePage
      ),
    title: 'Profile | SVTickets',
    data: { animation: 'profilePage' },
  },
  {
    path: ':id',
    canActivate: [numericIdGuard],
    resolve: {
      user: profileResolver,
    },
    loadComponent: () =>
      import('./profile-page/profile-page.page').then(
        (m) => m.ProfilePagePage
      ),
    title: 'Profile | SVTickets',
    data: { animation: 'profilePage' },
  },
];
