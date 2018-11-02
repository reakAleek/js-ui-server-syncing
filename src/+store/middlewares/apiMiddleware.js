// @flow
import {Action, Store} from "redux";
import type {SavePersonAction, UpdatePersonAction} from "../actions";
import {
    ADD_PERSON,
    FETCH_PERSONS,
    fetchPersonsSuccessAction,
    SAVE_PERSON,
    savePersonAction,
    savePersonSuccessAction,
    UPDATE_PERSON,
} from "../actions";
import RequestQueueService from "../../services/requestQueueService";
import PersonService from "../../services/personService";
import MockHttpApi from "../../services/mockHttpApi";
import type {Entity, Person} from "../model";
import _ from "lodash";


const apiMiddleware = (store: Store) => {

    const http = new MockHttpApi();
    const requestQueueService = new RequestQueueService();
    const personService = new PersonService(http, requestQueueService);

    return (next) => (action: Action) => {

        const result = next(action);

        switch (action.type) {

            case FETCH_PERSONS: {
                personService.fetchAll().subscribe(persons => {
                    store.dispatch(fetchPersonsSuccessAction(persons))
                });
                break;
            }

            case ADD_PERSON: {
                const person = _.last(store.getState().persons);
                store.dispatch(savePersonAction(person));
                break;
            }

            case UPDATE_PERSON: {
                const person: Entity = (action: UpdatePersonAction).person;
                store.dispatch(savePersonAction(person));
                break;
            }

            case SAVE_PERSON: {
                const person: Person = (action: SavePersonAction).person;
                personService.save(person).subscribe((p: Person | false) => {
                    if (p) {
                        store.dispatch(savePersonSuccessAction({...p, uuid: person.uuid}));
                    }
                });
                break;
            }
            default:
                break;
        }
        return result;
    };
};

export default apiMiddleware;