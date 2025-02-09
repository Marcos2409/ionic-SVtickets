import { Routes } from '@angular/router';
import { leavePageGuard } from '../shared/guards/leave-page.guard';
import { numericIdGuard } from '../shared/guards/numeric-id.guard';
import { eventResolver } from './resolvers/event-resolver.resolver';

export const eventsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./event-page/event-page.page').then((m) => m.EventsPageComponent),
    title: 'Eventos | SVTickets',
    data: { animation: 'eventsPage' },
  },
  {
    path: 'add',
    canDeactivate: [leavePageGuard],
    loadComponent: () =>
      import('./event-form/event-form.page').then(
        (m) => m.EventFormPage
      ),
    title: 'Añadir evento | SVTickets',
    data: { animation: 'eventForm' },
  },
  {
    path: ':id/edit',
    canActivate: [numericIdGuard],
    resolve: {
      event: eventResolver,
    },
    loadComponent: () =>
      import('./event-form/event-form.page').then(
        (m) => m.EventFormPage
      ),
    data: { animation: 'eventEdit' },
  },
  {
    path: ':id',
    canActivate: [numericIdGuard],
    resolve: {
      event: eventResolver,
    },
    loadComponent: () =>
      import('./event-detail/event-detail.page').then((m) => m.EventDetailPage),
    loadChildren: () =>
      import('./event-detail/event-detail.routes').then(
        (m) => m.eventDetailRoutes
      ),
  },
];
