import {
  Component,
  computed,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { EventsService } from '../services/events.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel
  ],
})

export class EventDetailPage {
  #eventService = inject(EventsService);

  id = input.required({ transform: numberAttribute });
  eventResource = rxResource({
    request: () => this.id(),
    loader: ({ request: id }) => this.#eventService.getEvent(id),
  });
  event = computed(() => this.eventResource.value());
}
