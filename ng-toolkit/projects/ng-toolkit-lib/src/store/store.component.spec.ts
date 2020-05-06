import { ChangeDetectorRef, Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestAction, TestState, TestStore } from './observable-store.spec';
import { StoreComponent } from './store.component';

@Component({
  template: ` <p>{{ store.state.testValue }}</p> `,
})
class StoreTestComponent extends StoreComponent<TestState, TestAction> {
  constructor(
    public store: TestStore,
    public changeDetectorRef: ChangeDetectorRef
  ) {
    super(store, changeDetectorRef);
  }
}

describe('StoreComponent', () => {
  let component: StoreTestComponent;
  let fixture: ComponentFixture<StoreTestComponent>;
  let compiled: DebugElement;
  let changeDetectorRefSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StoreTestComponent],
      providers: [TestStore],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement;
    changeDetectorRefSpy = spyOn(component.changeDetectorRef, 'markForCheck');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark component for change detection', () => {
    component.markForChangeDetection();
    expect(changeDetectorRefSpy).toHaveBeenCalledTimes(1);
  });

  it('should listen for state change', () => {
    component.store.patchState(TestAction.patchPartialState, {
      firstName: 'xxx',
    });
    expect(changeDetectorRefSpy).toHaveBeenCalledTimes(1);
  });

  it('should not listen for state change after destroy', () => {
    component.ngOnDestroy();
    component.store.patchState(TestAction.patchPartialState, {
      firstName: 'xxx',
    });
    expect(changeDetectorRefSpy).not.toHaveBeenCalled();
  });
});
