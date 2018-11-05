// @flow
import {Action, Store} from "redux";
import type {
    DeletePersonAction,
    OnUpdatePersonAction,
    PatchPersonAction,
    PostPersonAction,
    PostPersonSuccessAction,
    RemovePersonAction,
} from "../actions";
import {
    ADD_PERSON,
    DELETE_PERSON,
    deletePersonAction,
    deletePersonSuccessAction,
    FETCH_PERSONS,
    fetchPersonsSuccessAction,
    ON_UPDATE_PERSON,
    PATCH_PERSON,
    patchPersonAction,
    patchPersonSuccessAction,
    POST_PERSON,
    POST_PERSON_SUCCESS,
    postPersonAction,
    postPersonSuccessAction,
    REMOVE_PERSON,
    updatePersonAction,
} from "../actions";
import PersonService from "../../services/personService";
import _ from "lodash";
import {map} from "rxjs/operators";
import ActionProcrastinator from "../util/actionProcrastinator";

const apiMiddleware = (personService: PersonService) => (store: Store) => {

    const actionProcrastinator = new ActionProcrastinator();

    return (next) => (action: Action) => {

        const result = next(action);

        switch (action.type) {

            case ADD_PERSON: {
                const person = _.last(store.getState().persons);
                store.dispatch(postPersonAction(person));
                break;
            }

            case POST_PERSON: {
                const person = (action: PostPersonAction).person;
                const actionPostpone$ = actionProcrastinator.create(
                    person.uid,
                    personService.post(person).pipe(map(p => postPersonSuccessAction({...p, uid: person.uid }))),
                    'person.id'
                ).asObservable();
                actionPostpone$.subscribe(action => {
                    store.dispatch(action);
                });
                break;
            }

            case POST_PERSON_SUCCESS: {
                const person = (action: PostPersonSuccessAction).person;
                store.dispatch(updatePersonAction({ uid: person.uid, id: person.id }));
                break;
            }

            case PATCH_PERSON: {
                const person = (action: PatchPersonAction).person;
                if (person.id === -1) {
                    actionProcrastinator.pushAction(person.uid, patchPersonAction(person));
                } else {
                    personService.patch(person).subscribe(p => {
                        store.dispatch(patchPersonSuccessAction(p));
                    });
                }
                break;
            }

            case REMOVE_PERSON: {
                const person = (action: RemovePersonAction).person;
                store.dispatch(deletePersonAction(person));
                break;
            }

            case DELETE_PERSON: {
                const person = (action: DeletePersonAction).person;
                if (person.id === -1) {
                    actionProcrastinator.pushAction(person.uid, deletePersonAction(person));
                } else {
                    personService.delete(person).subscribe(p => {
                        store.dispatch(deletePersonSuccessAction(p));
                    });
                }
                break;
            }

            case ON_UPDATE_PERSON: {
                const person = (action: OnUpdatePersonAction).person;
                store.dispatch(updatePersonAction(person));
                store.dispatch(patchPersonAction(person));
                break;
            }

            case FETCH_PERSONS: {
                personService.fetchAll().subscribe(persons => {
                    store.dispatch(fetchPersonsSuccessAction(persons))
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