import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { nameof } from 'ng-toolkit-lib';
import { debounceTime } from 'rxjs/operators';
import { Action, State, StateChange, Store, StoreComponent } from 'src/app/store';
import { TodoService } from '../../services';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent extends StoreComponent implements OnInit {  
  get todos() {
    return this.store.state.todos
  }

  constructor(protected store: Store, protected changeDetectorRef: ChangeDetectorRef, protected todoService: TodoService) {
    super(store, changeDetectorRef);
  }

  ngOnInit() {
    super.ngOnInit();
    this.update();
  }

  add(title: string) {
    this.subscribeSafe('add', this.todoService.createItem(title), null);
  }

  update() {
    this.subscribeSafe('update', this.todoService.readItems().pipe(debounceTime(1000)), null);
  }

  protected onStateChange(change: StateChange): void {
    if([Action.updateTodoCompleted, Action.deleteTodoCompleted].includes(change.action)) {
      this.update();
    }
    
    if(change.propChanges[nameof<State>('todos')]) {
      this.markForChangeDetection();
    }
  }
}
