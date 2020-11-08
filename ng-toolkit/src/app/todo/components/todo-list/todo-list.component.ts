import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { ObservableStoreComponent } from 'ng-toolkit-lib';
import { ObservableStateChange } from 'projects/ng-toolkit-lib/src/lib/store';
import { debounceTime } from 'rxjs/operators';
import { TodoService } from '../../services/todo/todo.service';
import { TodoAction, TodoState, TodoStore } from '../../todo-store';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent
  extends ObservableStoreComponent<TodoState, TodoAction>
  implements OnInit {
  get todos() {
    return this.todoStore.state.todos;
  }

  get isCreating() {
    const createSubscription = this.subscriptions['create'];
    return createSubscription && !createSubscription.closed;
  }

  constructor(
    protected todoStore: TodoStore,
    protected changeDetectorRef: ChangeDetectorRef,
    protected todoService: TodoService
  ) {
    super(todoStore, changeDetectorRef);
  }

  ngOnInit() {
    super.ngOnInit();
    this.update();
  }

  create(title: string) {
    this.subscribeSafe('create', this.todoService.createItem(title), null);
  }

  update() {
    this.subscribeSafe(
      'update',
      this.todoService.readItems().pipe(debounceTime(500)),
      null
    );
  }

  protected onStateChange(
    change: ObservableStateChange<TodoState, TodoAction>
  ): void {
    switch (change.action) {
      case 'updateTodoCompleted':
      case 'createTodoCompleted':
      case 'deleteTodoCompleted':
        this.update();
        break;
    }

    if (change.propChanges.todos) {
      this.markForChangeDetection();
    }
  }
}
