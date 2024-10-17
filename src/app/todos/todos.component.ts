import { Component, inject, OnInit, signal } from '@angular/core';
import { TodosService } from '../services/todos.service';
import { Todo } from '../model/todo.type';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs';
import { TodoItemComponent } from '../components/todo-item/todo-item.component';
import { FormsModule } from '@angular/forms';
import { FilterTodosPipe } from '../pipes/filter-todos.pipe';
@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, TodoItemComponent, FormsModule, FilterTodosPipe],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss'
})
export class TodosComponent implements OnInit {
  todosService = inject(TodosService);
  todosItems = signal<Array<Todo>>([]);
  searchTerm = signal("");

  ngOnInit(): void {
    this.todosService.getTodosFromAPI().pipe(
      catchError((err) => {
        console.log(err);
        throw err
      }))
      .subscribe((todos) => {
        this.todosItems.set(todos);
      })
  }

  updateTodoItem(todoItem: Todo) {
    // const index = this.todosItems().indexOf(todoItem);
    // const newTodos = [...this.todosItems()];
    // newTodos[index] = { ...todoItem, completed: !todoItem.completed };
    // this.todosItems.set(newTodos);

    this.todosItems.update((todos) => {
      return todos.map((todo) => {
        if (todo.id === todoItem.id) {
          return {
            ...todo,
            completed: !todo.completed
          }
        }
        return todo
      })
    })
  }
}
