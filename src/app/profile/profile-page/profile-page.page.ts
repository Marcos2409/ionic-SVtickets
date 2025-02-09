import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { OlMapDirective } from '../../shared/directives/ol-maps/ol-map.directive';
import { OlMarkerDirective } from '../../shared/directives/ol-maps/ol-marker.directive';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonImg,
  IonFooter,
  IonModal,
  IonText,
} from '@ionic/angular/standalone';
import { ProfileService } from '../services/profile.service';
import { RouterLink, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from 'src/app/shared/interfaces/user';
import { EncodeBase64Directive } from 'src/app/shared/directives/encode-base64.directive';

@Component({
  selector: 'profile-page',
  imports: [
    IonInput,
    IonLabel,
    IonItem,
    IonIcon,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    ReactiveFormsModule,
    OlMapDirective,
    OlMarkerDirective,
    IonImg,
    IonButtons,
    RouterLink,
    IonModal,
    IonFooter,
    EncodeBase64Directive,
    IonText,
  ],
  templateUrl: './profile-page.page.html',
  styleUrl: './profile-page.page.css',
})
export class ProfilePagePage {
  showProfileForm = false;
  showPasswordForm = false;
  imageBase64 = '';

  user = input.required<User>();

  #profileService = inject(ProfileService);
  #fb = inject(NonNullableFormBuilder);

  #destroyRef = inject(DestroyRef);
  coordinates = signal<[number, number]>([-0.5, 38.5]);

  profileDataForm = this.#fb.group({
    name: ['', [Validators.required, Validators.minLength(4)]],
    email: ['', [Validators.required, Validators.email]],
  });

  passwordForm = this.#fb.group({
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  constructor() {
    effect(() => {
      this.updateData();
    });
    
  }

  

  updateData() {
    if (this.user()) {
      this.profileDataForm.get('email')?.setValue(this.user().email);
      this.profileDataForm.get('name')?.setValue(this.user().name);
      this.coordinates.set([this.user()!.lng, this.user()!.lat]);
      this.profileDataForm.setValue({ name: this.user().name, email: this.user().email });
    }
  }

  toggleProfileForm() {
    this.showProfileForm = !this.showProfileForm;
    this.showPasswordForm = false;
  }

  togglePasswordForm() {
    this.showPasswordForm = !this.showPasswordForm;
    this.showProfileForm = false;
  }

  hideFormButtons() {
    this.showProfileForm = false;
    this.showPasswordForm = false;
  }

  putProfileInfo() {
    const userInfo = this.profileDataForm.getRawValue();

    this.#profileService
      .updateProfile(userInfo)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.user().name = userInfo.name;
        this.user().email = userInfo.email;
        this.hideFormButtons();
      });

    this.updateData();
    this.showProfileForm = false;
    this.showPasswordForm = false;
  }

  putPassword() {
    const newPassword = this.passwordForm.getRawValue();

    this.#profileService
      .updateUserPassword(newPassword)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.hideFormButtons();
      });
  }

  handleAvatarChange(base64Image: string) {
    this.imageBase64 = base64Image;

    const avatarSend = { avatar: this.imageBase64 };

    this.#profileService
      .updateProfileAvatar(avatarSend)
      .subscribe(() => this.updateData());
  }
}
