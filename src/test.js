import {delay, map, pluck, switchMap, toArray} from "rxjs/operators";
import {forkJoin, Observable} from "rxjs";
import MockHttpApi from "./services/mockHttpApi";
import PersonService from "./services/personService";
import ActionProcrastinator from "./+store/util/actionProcrastinator";
import {
    DELETE_PERSON,
    deletePersonAction,
    patchPersonAction,
    POST_PERSON_SUCCESS,
    postPersonSuccessAction
} from "./+store/actions";

it('posting 2 persons with the id -1 should store 2 entities', (done) => {
    // Arrange
    const http = new MockHttpApi();
    const personService = new PersonService(http);
    const a$ = personService.post({ uuid: 'uuid', id: -1, name: '' });
    const b$ = personService.post({ uuid: 'uuid', id: -1, name: 'John' }).pipe(delay(250));

    // Act
    forkJoin(a$, b$).subscribe(() => {
        // Assert
        expect(http.persons).toHaveLength(2);
        expect(http.persons[0].id).toEqual(0);
        expect(http.persons[0].name).toEqual('');
        expect(http.persons[1].id).toEqual(1);
        expect(http.persons[1].name).toEqual('John');
        done();
    });
});

it('updating a person entity with patch should update persons name with given id', (done) => {
    // Arrange
    const http = new MockHttpApi();
    const a$ = http.post('/api/persons', { id: -1, name: '' }).pipe(
        pluck('id'),
        switchMap(id => http.patch('/api/persons/' + id, { id, name: 'Jan' })),
    );
    // Act
    a$.subscribe(() => {
        // Assert
        expect(http.persons).toHaveLength(1);
        expect(http.persons[0].id).toEqual(0);
        expect(http.persons[0].name).toEqual('Jan');
        done();
    })
});

it('ActionProcrastinator without follow up actions should emit only initial action', (done) => {
    // Arrange
    const actionProcrastinator = new ActionProcrastinator();
    const uuid = 'random-uuid';
    const personObservable = Observable.create(observer => {
        observer.next({id: 0, name: '' })
    }).pipe(delay(500));

    // Act
    actionProcrastinator.put(
        uuid,
        personObservable.pipe(map(person => postPersonSuccessAction({...person, uuid}))),
        'person',
        'person.id'
    ).asObservable()
    .pipe(toArray())
    .subscribe(actions => {
        // Assert
        expect(actions).toHaveLength(1);
        expect(actions[0].type).toEqual(POST_PERSON_SUCCESS);
        expect(actions[0].person.name).toEqual('');
        done();
    });
});

it('ActionProcrastinator with follow up actions should emit initial action and last pushed action', (done) => {
    // Arrange
    const actionProcrastinator = new ActionProcrastinator();
    const uuid = 'random-uuid';

    const personObservable$ = Observable.create(observer => {
        observer.next({id: 0, name: '' })
    }).pipe(delay(500));

    // Act
    actionProcrastinator.put(
        uuid,
        personObservable$.pipe(map(person => postPersonSuccessAction({...person, uuid}))),
        'person',
        'person.id'
    ).asObservable()
    .pipe(toArray())
    .subscribe(actions => {

        // Assert
        expect(actions).toHaveLength(2);
        expect(actions[0].type).toEqual(DELETE_PERSON);
        expect(actions[0].person.id).toEqual(0);
        expect(actions[1].type).toEqual(POST_PERSON_SUCCESS);
        expect(actions[1].person.name).toEqual('');
        done();
    });

    actionProcrastinator.pushAction(uuid, patchPersonAction({ id: -1, name: 'Jan'}));
    actionProcrastinator.pushAction(uuid, deletePersonAction({ id: -1, name: 'Jan'}));
});