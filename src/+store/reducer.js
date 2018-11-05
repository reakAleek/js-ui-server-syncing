// @flow
import {Action} from "redux";
import type {AppState} from "./model";
import {NOT_YET_PERSISTED} from "./model";
import type {
    FetchPersonsSuccessAction,
    PostPersonSuccessAction,
    RemovePersonAction,
    SetSyncStatusAction,
    UpdatePersonAction
} from "./actions";
import {
    ADD_PERSON,
    FETCH_PERSONS_SUCCESS,
    POST_PERSON_SUCCESS,
    REMOVE_PERSON,
    SET_SYNC_STATUS,
    UPDATE_PERSON
} from "./actions";
import _ from "lodash";

const initialState: AppState = {
    isSyncing: false,
    persons: []
};

export const reducer = (state: AppState = initialState, action: Action) => {

    switch (action.type) {

        case FETCH_PERSONS_SUCCESS: {
            return {
                ...state,
                persons: (action: FetchPersonsSuccessAction).persons.map(p => ({ ...p, uid: _.uniqueId('person_')}))
            };
        }

        case POST_PERSON_SUCCESS: {
            const newPerson = (action: PostPersonSuccessAction).person;
            return {
                ...state,
                persons: state.persons
                    .map(oldPerson =>
                        (newPerson.uid === oldPerson.uid)
                            ? {...oldPerson, id: newPerson.id }
                            : oldPerson
                    )
            }
        }

        case REMOVE_PERSON: {
            const deletedPerson = (action: RemovePersonAction).person;
            const uid = deletedPerson.uid;
            return {
                ...state,
                persons: state.persons.filter(p => p.uid !== uid)
            };
        }

        case ADD_PERSON: {
            return {
                ...state,
                persons: [...state.persons, { id: NOT_YET_PERSISTED, name: '', uid: _.uniqueId('person_') }]
            }
        }

        case UPDATE_PERSON: {
            const updatePerson = (action: UpdatePersonAction).person;
            return {
                ...state,
                persons: state.persons.map((person) => {
                    return (updatePerson.uid === person.uid)
                        ? { ...person, ...updatePerson }
                        : person
                })
            }
        }

        case SET_SYNC_STATUS: {
            return {
                ...state,
                isSyncing: (action: SetSyncStatusAction).isSyncing
            }
        }

        default:
            return state;
    }
};
