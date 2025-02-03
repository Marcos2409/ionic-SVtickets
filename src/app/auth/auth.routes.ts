import { Routes } from '@angular/router';
import { leavePageGuard } from '../shared/guards/leave-page.guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.page').then((m) => m.LoginPage),
    title: 'Login | SVTickets',
    canDeactivate: [leavePageGuard],
    data: { animation: 'loginPage' }
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.page').then((m) => m.RegisterPage),
    title: 'Register | SVTickets',
    canDeactivate: [leavePageGuard],
    data: { animation: 'registerPage' }
  },
];
