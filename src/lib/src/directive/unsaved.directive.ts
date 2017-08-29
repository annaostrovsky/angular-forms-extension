import {Directive, EventEmitter, HostListener, OnInit, Output, Self} from '@angular/core';
import {ValidSubmitDirective} from './valid-submit.directive';
import {NgForm} from '@angular/forms';

@Directive({
  selector: 'form[unsaved]'
})
export class UnsavedDirective implements OnInit {

  @Output('unsaved') unsavedChange = new EventEmitter();

  unsaved: boolean;

  submitted: boolean;

  constructor(@Self() private ngForm: NgForm,
              @Self() private hasSubmitButton: ValidSubmitDirective) {
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => {
      this.submitted = false;
      this.unsavedParameterChange();
    });
    this.form.statusChanges.subscribe(() => this.unsavedParameterChange());
  }

  @HostListener('submit', ['$event'])
  onSubmit() {
    this.submitted = true;
    this.unsavedParameterChange();
  }

  unsavedParameterChange() {
    const unsaved = this.hasSubmitButton ?
      this.form.dirty && (!this.submitted || !this.form.valid):
      !this.form.valid;

    if (unsaved != this.unsaved) {
      this.unsaved = unsaved;
      this.unsavedChange.emit(this.unsaved);
    }
  }

  private get form() {
    return this.ngForm.form;
  }
}
