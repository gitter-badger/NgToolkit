import {
  Directive,
  Input,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { nameof } from '../helpers';

@Directive({
  selector: '[atlForm]',
})
export class FormDirective implements OnInit, OnChanges {
  @Input()
  formGroup: FormGroup;

  @Input()
  formState: any;

  @Input()
  isEditEnabled: boolean;

  constructor() {}

  ngOnInit() {
    if (this.formState) {
      this.ngOnChanges({
        [nameof<FormDirective>('formState')]: new SimpleChange(
          undefined,
          this.formState,
          false
        ),
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const formStateChange = changes[nameof<FormDirective>('formState')];
    if (!formStateChange && changes[nameof<FormDirective>('isEditEnabled')]) {
      this.updateFormEnabled();
    }

    if (!formStateChange) {
      return;
    }

    if (formStateChange.currentValue) {
      this.applyFormState(formStateChange.currentValue);
    }
  }

  discardChanges() {
    this.applyFormState({ ...this.formState });
  }

  applyFormState(state: any) {
    this.formGroup.reset(); // TODO: Allow reset with initial state
    this.formGroup.patchValue(state);
    this.formGroup.markAsPristine();
    this.formGroup.markAsUntouched();
    this.updateFormEnabled();
  }

  protected updateFormEnabled(options?: {
    emitEvent?: boolean;
    onlySelf?: boolean;
  }) {
    const opts = { emitEvent: false, ...options };
    this.isEditEnabled
      ? this.formGroup.enable(opts)
      : this.formGroup.disable(opts);
  }
}