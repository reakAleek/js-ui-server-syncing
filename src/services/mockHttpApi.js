// @flow
import {Observable, of, throwError} from "rxjs";
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

    delete = (url: string, person: Person): Observable<Person> => {

        if (person.id === -1) {
            return throwError('ID cannot be -1');
        }

        this.persons = this.persons.filter(p => p.id !== person.id);
        console.info(
            '%c[DELETE]\t',
            'color:green;',
            'request:',
            _.omit(person, ['uuid']),
            'response:',
            _.omit(person, ['uuid'])
        );
        return of(person).pipe(delay(1000));
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
            }, 2000)
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
            }, 1000);
        });
    };
}