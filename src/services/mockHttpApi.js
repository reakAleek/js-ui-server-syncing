// @flow
import {Observable, of} from "rxjs";
import {delay, take} from "rxjs/operators";
import type {Person} from "../+store/model";
import _ from 'lodash';

export default class MockHttpApi {
    currentId = 0;
    persons: Person[] = [];

    get = (url: string): Observable<Person[]> => {
        const persons = this.persons.map(p => _.omit(p, 'uuid'));
        console.info(
            '%c[GET]\t',
            'color:green;',
            'request:', {},
            'response:',
            persons
        );
        return of(persons).pipe(take(1), delay(500))
    };

    post = (url: string, person: Person): Observable<Person>  => {
        return Observable.create((observer) => {
            setTimeout(() => {
                const id = this.currentId++;
                const personWithNewId = { ...person, id };
                this.persons = [...this.persons, personWithNewId];
                console.info(
                    '%c[POST]\t',
                    'color:green;',
                    'request:',
                    _.omit(person, ['uuid']),
                    'response:',
                    _.omit(personWithNewId, ['uuid'])
                );
                observer.next(_.omit(personWithNewId, ['uuid']));
                observer.complete();
            }, 1000)
        });
    };

    patch = (url: string, updatePerson: Person): Observable<Person> => {
        return Observable.create(observer => {
            if (updatePerson.id === -1) {
                console.error(
                    '%c[PATCH]\t',
                    'color:red;',
                    'request:',
                    updatePerson,
                    'response:',
                    { status: 400, msg: 'BAD REQUEST' }
                );
                observer.error("ID cannot be -1");
            }
            setTimeout(() => {
                this.persons = this.persons
                    .map(oldPerson =>
                        (oldPerson.id === updatePerson.id)
                            ?  { ...oldPerson, ...updatePerson }
                            : oldPerson
                    );

                console.info(
                    '%c[PATCH]\t',
                    'color:green;',
                    'request:',
                    _.omit(updatePerson, ['uuid']),
                    'response:',
                    _.omit(updatePerson, ['uuid'])
                );
                observer.next(_.omit(updatePerson, ['uuid']));
                observer.complete();
            }, 500);
        });
    };
}