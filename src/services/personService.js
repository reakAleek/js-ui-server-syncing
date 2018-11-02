// @flow
import type {Person} from "../+store/model";
import RequestQueueService from "./requestQueueService";
import MockHttpApi from "./mockHttpApi";
import {Observable} from "rxjs";

export default class PersonService {

    constructor(http: MockHttpApi, requestQueue: RequestQueueService) {
        this.http = http;
        this.requestQueue = requestQueue;
    }

    fetchAll = (): Observable<Person[]> => {
        return this.http.get('/api/persons');
    };

    save = (person: Person): Observable<Person | false> => {
        return this.requestQueue.postOrPatch(person, this.post, this.patch);
    };

    post = (person: Person): Observable<Person> => {
        return this.http.post('/api/persons', person);
    };

    patch = (person: Person): Observable<Person> => {
        return this.http.patch('/api/persons/' + person.id, person);
    }
}