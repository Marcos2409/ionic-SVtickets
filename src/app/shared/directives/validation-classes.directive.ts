import { computed, Directive, inject, Injector, input, OnInit, signal, Signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgControl, NgModel } from '@angular/forms';
import { EMPTY } from 'rxjs';

@Directive({
  selector: '[validationClasses][ngModel],[validationClasses][formControl],[validationClasses][formControlName])',
  standalone: true,
  host: {
    '[class]': 'inputClass()',
    '(blur)': 'touched.set(true)',
  },
})
export class ValidationClassesDirective implements OnInit {
  #ngModel = inject(NgModel, { optional: true }); // Formulario de plantilla
  #ngControl = inject(NgControl, { optional: true }); // Formulario reactivo
  #injector = inject(Injector);
  validationClasses = input<{ valid: string; invalid: string }>();
  valueChanges!: Signal<string>;
  touched = signal(false);

  ngOnInit(): void {
    this.valueChanges = toSignal(
      this.#ngModel?.valueChanges ?? this.#ngControl?.valueChanges ?? EMPTY,
      { injector: this.#injector }
    );
  }

  inputClass = computed(() => {
    const touched = this.touched();
    const validationClasses = this.validationClasses();
    this.valueChanges();

    return untracked(() => {
      if (touched) {
        return this.#ngModel?.invalid || this.#ngControl?.invalid
          ? validationClasses?.invalid
          : validationClasses?.valid;
      }
      return '';
    });
  });
}