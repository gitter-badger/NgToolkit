import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface ObservableStateChange<TState, TAction> {
  action: TAction;
  propChanges: ObservableStatePropChanges<TState>;
}

export type ObservableStatePropChanges<TState> = {
  [TProp in keyof TState]: {
    prevValue: TState[TProp];
    nextValue: TState[TProp];
  };
};

export abstract class ObservableStore<TState, TAction> {
  public get state(): Readonly<TState> {
    return this._state$.getValue();
  }

  public get state$(): Observable<Readonly<TState>> {
    return this._state$.asObservable();
  }

  public get stateChange(): ObservableStateChange<TState, TAction> {
    return this._stateChange;
  }

  public get stateChange$(): Observable<
    ObservableStateChange<TState, TAction>
  > {
    return this._stateChange$.asObservable();
  }

  public patchState(action: TAction, patch: Partial<TState>): void {
    const nextState: TState = {
      ...this.state,
      ...patch,
    } as TState;
    const stateChange = this.buildStateChange(action, patch, nextState);

    this.changeState(stateChange, patch, nextState);
  }

  public setState(action: TAction, state: Partial<TState>): void {
    const nextState: TState = state as TState;
    const patch = {};
    const stateChange = this.buildStateChange(action, patch, nextState);
    this.changeState(stateChange, patch, nextState);
  }

  protected constructor(protected initialState: Partial<TState> = {}) {
    this._stateChange$ = new Subject();
    this._state$ = new BehaviorSubject(initialState as TState);
  }

  protected buildStateChange(
    action: TAction,
    patch: Partial<TState>,
    nextState: TState
  ): ObservableStateChange<TState, TAction> {
    let props: (keyof TState)[] = patch
      ? (Object.keys(patch) as (keyof TState)[])
      : [];
    if (!props.length) {
      const allProps = [
        ...Object.keys(this.state),
        ...Object.keys(nextState),
      ] as (keyof TState)[];
      props = allProps.filter(
        (item, index) => allProps.indexOf(item) === index
      );
    }

    const statePropChanges: ObservableStatePropChanges<TState> = {} as ObservableStatePropChanges<
      TState
    >;
    for (const prop of props) {
      if (this.state[prop] !== nextState[prop]) {
        statePropChanges[prop] = {
          prevValue: this.state[prop],
          nextValue: nextState[prop],
        };
      }
    }

    return {
      action,
      propChanges: statePropChanges,
    };
  }

  // tslint:disable-next-line: variable-name
  private _stateChange: ObservableStateChange<TState, TAction>;
  // tslint:disable-next-line: variable-name
  private _stateChange$: Subject<ObservableStateChange<TState, TAction>>;
  // tslint:disable-next-line: variable-name
  private _state$: BehaviorSubject<Readonly<TState>>;

  // @logStateChange()
  private changeState(
    stateChange: ObservableStateChange<TState, TAction>,
    patch: Partial<TState>,
    nextState: TState
  ): void {
    if (patch) {
      this._state$.next(nextState);
    }

    this._stateChange = stateChange;
    this._stateChange$.next(stateChange);
  }
}

// function logStateChange(): (
//   target: ObservableStore<any, any>,
//   prop: string | symbol,
//   descriptor: PropertyDescriptor
// ) => PropertyDescriptor {
//   return (
//     target: ObservableStore<any, any>,
//     propertyKey: string | symbol,
//     descriptor: PropertyDescriptor
//   ): PropertyDescriptor => {
//     if (!environment.production) {
//       const originalMethod = descriptor.value;
//       descriptor.value = (): void => {
//         console.log({
//           action: arguments[0].action,
//           patch: arguments[1],
//           nextState: arguments[2],
//           prevState: this.state,
//           propChanges: arguments[0].propChanges,
//         });

//         originalMethod.apply(this, arguments);
//       };
//     }

//     return descriptor;
//   };
// }