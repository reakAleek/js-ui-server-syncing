// @flow
import type {Person} from "../+store/model";
import MockHttpApi from "./mockHttpApi";
import { Observable } from "rxjs";

export default class PersonService {

    constructor(http: MockHttpApi) {
        this.http = http;
    }

    fetchAll = (): Observable<Person[]> => {
        return this.http.get('/api/persons');
    };

    post = (person: Person): Observable<Person> => {
        return this.http.post('/api/persons', person);
    };

    patch = (person: Person): Observable<Person> => {
        return this.http.patch('/api/persons', person);
    };

    delete = (person: Person): Observable<Person> => {
      return this.http.delete('/api/persons', person);
    };
}