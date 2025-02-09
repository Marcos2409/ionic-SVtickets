import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import {
  Platform,
  IonApp,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonRouterLink,
  IonRouterOutlet,
  IonSplitPane,
  IonAvatar,
  IonImg,
  NavController,
  IonHeader,
  IonToolbar,
  IonTitle
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { User } from './shared/interfaces/user';
import { AuthService } from './auth/services/auth.service';
import {
  home,
  logIn,
  documentText,
  checkmarkCircle,
  images,
  camera,
  arrowUndoCircle,
  logOut,
  exit,
  peopleSharp,
  calendarOutline,
  cashOutline,
  locationSharp,
  informationCircleSharp,
  chatboxEllipsesSharp,
  addCircleSharp,
  locationOutline,
  navigateSharp,
  personAddOutline,
  personAddSharp,
  personRemove,
  personRemoveSharp,
  addSharp,
  searchSharp,
  closeSharp,
  calendarSharp,
  mapSharp,
  cashSharp,
  optionsSharp,
  closeCircle,
  mailSharp,
  pencilSharp,
  imageSharp,
  lockOpenSharp,
  trashBinSharp,
  eyeSharp,
} from 'ionicons/icons';
import { ProfileService } from './profile/services/profile.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    RouterLink,
    RouterLinkActive,
    IonRouterLink,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonAvatar,
    IonImg,
    IonHeader,
    IonToolbar,
    IonTitle
  ],
})
export class AppComponent {
  user = signal<User | null>(null);

  #authService = inject(AuthService);
  #platform = inject(Platform);
  #profileService = inject(ProfileService);
  #nav = inject(NavController);

  public appPages = [{ title: 'Home', url: '/events', icon: 'home' }];
  constructor() {
    addIcons({
      home,
      logIn,
      logOut,
      documentText,
      checkmarkCircle,
      images,
      camera,
      arrowUndoCircle,
      exit,
      peopleSharp,
      calendarOutline,
      calendarSharp,
      mapSharp,
      cashSharp,
      cashOutline,
      locationSharp,
      informationCircleSharp,
      chatboxEllipsesSharp,
      addCircleSharp,
      locationOutline,
      navigateSharp,
      personAddSharp,
      personRemoveSharp,
      addSharp,
      searchSharp,
      closeSharp,
      optionsSharp,
      closeCircle,
      mailSharp,
      pencilSharp,
      imageSharp,
      lockOpenSharp,
      trashBinSharp,
      eyeSharp
    });

    effect(() => {
      if (this.#authService.isLogged()) {
        this.#profileService
          .getProfile()
          .subscribe((user) => this.user.set(user));
      } else {
        this.user.set(null);
      }
    });

    this.initializeApp();
  }

  async initializeApp() {
    if (this.#platform.is('capacitor')) {
      await this.#platform.ready();
      SplashScreen.hide();
    }
  }

  async logout() {
    await this.#authService.logout();
    this.#nav.navigateRoot(['/auth/login']);
  }
}
