import {
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonListHeader,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { EventDetailPage } from '../../event-detail.page';
import { User } from 'src/app/shared/interfaces/user';
import { EventsService } from 'src/app/events/services/events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-event-attend',
  templateUrl: './event-attend.page.html',
  styleUrls: ['./event-attend.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonFabButton,
    IonFab,
    IonListHeader,
    IonLabel,
    IonAvatar,
    IonItem,
    IonList,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class EventAttendPage {
  event = inject(EventDetailPage).event;
  attendees = signal<User[]>([]);

  #eventService = inject(EventsService);
  #destroyRef = inject(DestroyRef);

  isAttending = signal<boolean>(this.event()!.attend);

  constructor() {
    effect(() => {
      if (this.event()) {
        this.setAttendees(this.event()!.id);
      }
    });
  }

  setAttendees(id: number) {
    this.#eventService
      .getAttendees(id)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((result) => {
        this.attendees.set(result.users);
      });
  }

  toggleAttendance() {
    if (this.event()!.attend) {
      this.#eventService
        .deleteAttendee(this.event()!.id)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe(() => {
          this.isAttending.set(!this.isAttending());
          this.setAttendees(this.event()!.id);
        });
      this.event()!.attend = false;
    } else {
      this.#eventService
        .postAttendee(this.event()!.id)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe(() => {
          this.isAttending.set(!this.isAttending());
          this.setAttendees(this.event()!.id);
        });
      this.event()!.attend = true;
    }
  }
}
