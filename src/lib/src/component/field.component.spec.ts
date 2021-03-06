import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormsExtensionModule} from '../forms-extension.module';
import {By} from '@angular/platform-browser';
import {NgForm} from '@angular/forms';

describe('FieldComponent', () => {

  @Component({
    template: `
      <form (validSubmit)="save()">
        <fx-field label="User Name"><input [(ngModel)]="username" name="username" required/></fx-field>
        <button #submit>Submit</button>
      </form>
    `
  })
  class TestComponent {
    username = '';

    @ViewChild('submit') button: ElementRef;

    @ViewChild(NgForm) ngForm: NgForm;

    save() {
    }

    markAsDirty() {
      this.ngForm.controls['username'].markAsDirty();
    }
  }

  let fixture: ComponentFixture<TestComponent>;
  let instance: TestComponent;

  beforeEach(() => {
    fixture = TestBed
      .configureTestingModule({imports: [FormsExtensionModule.forRoot()], declarations: [TestComponent]})
      .createComponent(TestComponent);
    instance = fixture.componentInstance;
  });

  beforeEach(async(() => fixture.detectChanges()));

  it('should render a label for the control', async(() => {
    expect(fixture.debugElement.query(By.css('.fx-field__label')).nativeElement.innerHTML).toBe('User Name');
  }));

  it('should render the form control', async(() => {
    expect(fixture.debugElement.query(By.css('.fx-field__control'))).toBeTruthy();
  }));

  it('should add a required style when control is required', async(() => {
    expect(fixture.debugElement.query(By.css('.fx-field--required'))).toBeTruthy();
  }));

  it('should NOT an invalid style when control even though the field is invalid when pristine', async(() => {
    expect(fixture.debugElement.query(By.css('.fx-field--invalid'))).toBeFalsy();
  }));

  describe('after submission', () => {
    beforeEach(async(() => {
      instance.button.nativeElement.click();
      fixture.detectChanges();
    }));

    expectInvalidStyles();
  });

  describe('when field is dirty', () => {
    beforeEach(async(() => {
      instance.markAsDirty();
      fixture.detectChanges();
    }));

    expectInvalidStyles();
  });

  function expectInvalidStyles() {
    it('should add an invalid style', async(() =>
      expect(fixture.debugElement.query(By.css('.fx-field--invalid'))).toBeTruthy()));

    it('should list the errors of the invalid fields', async(() =>
      expect(fixture.debugElement.query(By.css('.fx-field__error')).nativeElement.innerHTML)
        .toBe('User Name is required')));
  }
});
