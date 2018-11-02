import {delay, pluck, switchMap} from "rxjs/operators";
import {forkJoin} from "rxjs";
import MockHttpApi from "./services/mockHttpApi";
import PersonService from "./services/personService";
import RequestQueueService from "./services/requestQueueService";

it('posting 2 persons with the id -1 should store 2 entities', (done) => {
    const http = new MockHttpApi();
    const personService = new PersonService(http);
    const a$ = personService.post({ uuid: 'uuid', id: -1, name: '' });
    const b$ = personService.post({ uuid: 'uuid', id: -1, name: 'John' }).pipe(delay(250));

    forkJoin(a$, b$).subscribe(() => {
      expect(http.persons).toHaveLength(2);
      expect(http.persons[0].id).toEqual(0);
      expect(http.persons[0].name).toEqual('');
      expect(http.persons[1].id).toEqual(1);
      expect(http.persons[1].name).toEqual('John');
      done();
    });
});

it('saving 2 persons with the id -1 but same uuid should store only 1 entity', (done) => {
    const http = new MockHttpApi();
    const requestQueueService = new RequestQueueService();
    const personService = new PersonService(http, requestQueueService);
    const a$ = personService.save({ uuid: 'uuid', id: -1, name: '' });
    const b$ = personService.save({ uuid: 'uuid', id: -1, name: 'John' }).pipe(delay(250));

    forkJoin(a$,b$).subscribe(() => {
        expect(http.persons).toHaveLength(1);
        expect(http.persons[0].id).toEqual(0);
        expect(http.persons[0].name).toEqual('John');
        done();
    });
});

it('saving 2 persons with the id -1 but different uuid should store 2 entities', (done) => {
    const http = new MockHttpApi();
    const requestQueueService = new RequestQueueService();
    const personService = new PersonService(http, requestQueueService);
    const a$ = personService.save({ uuid: 'uuid1', id: -1, name: '' });
    const b$ = personService.save({ uuid: 'uuid2', id: -1, name: 'John' }).pipe(delay(250));

    forkJoin(a$,b$).subscribe(() => {
        expect(http.persons).toHaveLength(2);
        expect(http.persons[0].id).toEqual(0);
        expect(http.persons[0].name).toEqual('');
        expect(http.persons[1].id).toEqual(1);
        expect(http.persons[1].name).toEqual('John');
        done();
    });
});


it('updating a person entity with patch should update persons name with given id', (done) => {
    const http = new MockHttpApi();
    const a$ = http.post('/api/persons', { id: -1, name: '' }).pipe(
        pluck('id'),
        switchMap(id => http.patch('/api/persons/' + id, { id, name: 'Jan' })),
    );

    a$.subscribe(() => {
        expect(http.persons).toHaveLength(1);
        expect(http.persons[0].id).toEqual(0);
        expect(http.persons[0].name).toEqual('Jan');
        done();
    })
});