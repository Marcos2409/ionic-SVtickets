import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonRefresher,
  IonGrid,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonFab,
  IonRefresherContent,
  IonFabButton,
  IonIcon,
  IonRow,
  IonCol,
  IonSearchbar,
} from '@ionic/angular/standalone';
import { MyEvent } from 'src/app/shared/interfaces/my-event';
import { EventsService } from '../services/events.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { RouterLink } from '@angular/router';
import { EventCardPage } from '../event-card/event-card.page';
import { AlertController } from '@ionic/angular';
import { FiltersPopoverPage } from './filters-popover/filters-popover.page';
import { text } from 'ionicons/icons';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.page.html',
  styleUrls: ['./event-page.page.scss'],
  standalone: true,
  imports: [
    IonSearchbar,
    IonCol,
    IonRow,
    IonIcon,
    IonFabButton,
    IonRefresherContent,
    IonFab,
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonGrid,
    IonRefresher,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    EventCardPage,
  ],
  providers: [],
})
export class EventsPageComponent {
  #destroyRef = inject(DestroyRef);
  #eventsService = inject(EventsService);
  #alertController = inject(AlertController);
  // #popoverCtrl = inject(PopoverController);
  private refresher = viewChild(IonRefresher);
  private infiniteScroll = viewChild(IonInfiniteScroll);

  events = signal<MyEvent[]>([]);
  currentPage = signal<number>(1);
  eventsLeft = signal<boolean>(false);
  order = signal<string>('distance');
  creator = input<number>();
  attending = input<number>();
  selected = false;
  searchVisible = false;

  searchControl = new FormControl('');
  search = toSignal(
    this.searchControl.valueChanges.pipe(
      debounceTime(600),
      distinctUntilChanged()
    ),
    { initialValue: '' }
  );

  filterDescription = signal<string>('');

  constructor() {
    effect(() => {
      this.loadEvents(
        this.currentPage(),
        this.search()!,
        this.order(),
        this.creator(),
        this.attending()
      );
    });
  }

  toggleSearch() {
    this.searchVisible = !this.searchVisible;
  }

  loadEvents(
    currentPage: number,
    search: string,
    order: string,
    creator?: number,
    attending?: number
  ) {
    this.#eventsService
      .getEvents(currentPage, search, order, creator, attending)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((res) => {
        if (currentPage === 1) {
          this.events.set(res.events);
        } else {
          this.events.update((events) => [...events, ...res.events]);
        }
        this.eventsLeft.set(res.more);
        this.refresher()?.complete();
        this.infiniteScroll()?.complete();
      });
  }

  loadMore() {
    this.currentPage.update((page) => page + 1);
    this.loadEvents(this.currentPage(), this.search()!, this.order());
  }

  // async openFilters(ev: Event) {
  //   const popover = await this.#popoverCtrl.create({
  //     component: FiltersPopoverPage,
  //     event: ev,
  //     translucent: true,
  //     componentProps: {
  //       orderDistance: () => this.orderDistance(),
  //       orderDate: () => this.orderDate(),
  //       orderPrice: () => this.orderPrice(),
  //     },
  //   });
  //   await popover.present();
  // }

  async openFilters() {
    console.log('Opening filter alert...');
    const alert = await this.#alertController.create({
      header: 'Filters',
      buttons: [
        {
          text: 'Distance',
          handler: () => this.orderDistance(),
        },
        {
          text: 'Date',
          handler: () => this.orderDate(),
        },
        {
          text: 'Price',
          handler: () => this.orderPrice(),
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });

    await alert.present();

    const result = await alert.onDidDismiss();
  }

  orderDate() {
    this.order.set('date');
    this.resetPagination();
  }

  orderPrice() {
    this.order.set('price');
    this.resetPagination();
  }

  orderDistance() {
    this.order.set('distance');
    this.resetPagination();
  }

  resetPagination() {
    this.currentPage.set(1);
    this.events.set([]);
    this.loadEvents(this.currentPage(), this.search()!, this.order());
  }

  addEvent(event: MyEvent) {
    this.events.update((events) => [...events, event]);
  }

  deleteEvent(event: MyEvent) {
    this.events.update((events) => events.filter((e) => e !== event));
  }

  refresh(refresher: IonRefresher) {
    setTimeout(() => {
      this.currentPage.set(1);
    }, 2000);
  }
}
