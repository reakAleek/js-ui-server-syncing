// @flow
import uuid from "uuid/v1";
import {Action} from "redux";
import type {AppState} from "./model";
import {NOT_YET_PERSISTED} from "./model";
import type {
    FetchPersonsSuccessAction,
    SavePersonSuccessAction,
    SetSyncStatusAction,
    UpdatePersonAction
} from "./actions";
import {ADD_PERSON, FETCH_PERSONS_SUCCESS, SAVE_PERSON_SUCCESS, SET_SYNC_STATUS, UPDATE_PERSON} from "./actions";


const initialState: AppState = {
    isSyncing: false,
    persons: []
};

export const reducer = (state: AppState = initialState, action: Action) => {

    switch (action.type) {

        case FETCH_PERSONS_SUCCESS: {
            return {
                ...state,
                persons: (action: FetchPersonsSuccessAction).persons.map(p => ({ ...p, uuid: uuid()}))
            };
        }

        case SAVE_PERSON_SUCCESS: {
            const newPerson = (action: SavePersonSuccessAction).person;
            return {
                ...state,
                persons: state.persons
                    .map(oldPerson =>
                        (newPerson.uuid === oldPerson.uuid)
                            ? {...oldPerson, id: newPerson.id }
                            : oldPerson
                    )
            }
        }

        case ADD_PERSON: {
            return {
                ...state,
                persons: [...state.persons, { id: NOT_YET_PERSISTED, name: '', uuid: uuid()}]
            }
        }

        case UPDATE_PERSON: {
            const updatePerson = (action: UpdatePersonAction).person;
            return {
                ...state,
                persons: state.persons.map((person) => {
                    return (updatePerson.uuid === person.uuid)
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
