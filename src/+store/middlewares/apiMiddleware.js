// @flow
import {Action, Store} from "redux";
import type {
    DeletePersonAction,
    OnUpdatePersonAction,
    PatchPersonAction, RemovePersonAction,
    SavePersonAction,
    SavePersonSuccessAction,
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
    REMOVE_PERSON,
    SAVE_PERSON,
    SAVE_PERSON_SUCCESS,
    savePersonAction,
    savePersonSuccessAction,
    updatePersonAction,
} from "../actions";
import PersonService from "../../services/personService";
import _ from "lodash";
import ActionProcrastinator from "../util/actionProcrastinator";

const apiMiddleware = (personService: PersonService) => (store: Store) => {

    const actionPostponeManager = new ActionProcrastinator(store);

    return (next) => (action: Action) => {

        const result = next(action);

        switch (action.type) {

            case ADD_PERSON: {
                const person = _.last(store.getState().persons);
                store.dispatch(savePersonAction(person));
                break;
            }

            case SAVE_PERSON: {
                const person = (action: SavePersonAction).person;
                actionPostponeManager.put(person.uuid, personService.post(person), savePersonSuccessAction, 'person');
                break;
            }

            case SAVE_PERSON_SUCCESS: {
                const person = (action: SavePersonSuccessAction).person;
                store.dispatch(updatePersonAction({ uuid: person.uuid, id: person.id }));
                break;
            }

            case PATCH_PERSON: {
                const person = (action: PatchPersonAction).person;
                if (person.id === -1) {
                    actionPostponeManager.pushAction(person.uuid, patchPersonAction(person));
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
                    actionPostponeManager.pushAction(person.uuid, deletePersonAction(person));
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