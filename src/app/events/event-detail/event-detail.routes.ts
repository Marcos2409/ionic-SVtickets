import { Routes } from '@angular/router';

export const eventDetailRoutes: Routes = [
  {
    path: 'info',
    loadComponent: () =>
      import('./pages/event-info/event-info.page').then(
        (m) => m.EventInfoPage
      ),
  },
  {
    path: 'location',
    loadComponent: () =>
      import('./pages/event-location/event-location.page').then(
        (m) => m.EventLocationPage
      ),
  },
  {
    path: 'attend',
    loadComponent: () =>
      import('./pages/event-attend/event-attend.page').then(
        (m) => m.EventAttendPage
      ),
  },
  {
    path: 'comments',
    loadComponent: () =>
      import('./pages/event-comments/event-comments.page').then(
        (m) => m.EventCommentsPage
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'info',
  },
];