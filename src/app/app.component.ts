import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  courses$;
  courses;
  list$: AngularFireList<any[]>;
  isUpdatePressed = false;

  constructor(private db: AngularFireDatabase) {}

  ngOnInit(): void {
    this.courses = this.db.list('/courses');
    this.list$ = this.courses.valueChanges();
    this.courses$ = this.db.list('/courses').snapshotChanges().pipe(
      map(changes => changes.map(change => ({
        key: change.payload.key,
        value: change.payload.val()
      })))
    );
  }

  add(course: HTMLInputElement) {
    this.courses.push(course.value);
    course.value = '';
    }

  update(course, enteredValue) {
    console.log(enteredValue.value);
    this.db.object('/courses/' + course.key).set(enteredValue.value);
  }

  delete(course) {
    this.db.object('/courses/' + course.key)
      .remove()
      .then(x => console.log('DELETED'));
  }
}
