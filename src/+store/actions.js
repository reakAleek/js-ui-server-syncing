import type {Person} from "./model";


export const FETCH_PERSONS = 'FETCH_PERSONS';
export type FetchPersonsAction = {
    type: FETCH_PERSONS
}
export const fetchPersonsAction = (): FetchPersonsAction => ({
    type: FETCH_PERSONS
});

export const FETCH_PERSONS_SUCCESS = 'FETCH_PERSONS_SUCCESS';
export type FetchPersonsSuccessAction = {
    type: FETCH_PERSONS_SUCCESS,
    persons: Person[]
}

export const fetchPersonsSuccessAction = (persons: Person[]): FetchPersonsSuccessAction => ({
    type: FETCH_PERSONS_SUCCESS,
    persons
});

export const SAVE_PERSON = 'SAVE_PERSON';
export type SavePersonAction = {
    type: SAVE_PERSON,
    person: Person
}
export const savePersonAction =
    (person: Person): SavePersonAction => ({
        type: SAVE_PERSON, person
    });

export const SAVE_PERSON_SUCCESS = 'SAVE_PERSON_SUCCESS';
export type SavePersonSuccessAction = {
    type: SAVE_PERSON_SUCCESS,
    person: Person
}
export const savePersonSuccessAction =
    (person: Person): SavePersonSuccessAction => ({
        type: SAVE_PERSON_SUCCESS, person
    });

export const ADD_PERSON = 'ADD_PERSON';
export type AddPersonAction = {
    type: ADD_PERSON
};
export const addPersonAction = (): AddPersonAction => ({
    type: ADD_PERSON
});

export const UPDATE_PERSON = 'UPDATE_PERSON';
export type UpdatePersonAction = {
    type: UPDATE_PERSON,
    person: Person
}
export const updatePersonAction =
    (person: Person): UpdatePersonAction => ({
        type: UPDATE_PERSON, person
    });

export const SET_SYNC_STATUS = 'SET_SYNC_STATUS';
export type SetSyncStatusAction = {
    type: SET_SYNC_STATUS,
    isSyncing: boolean
};
export const setSyncStatusAction = (isSyncing): SetSyncStatusAction => ({
    type: SET_SYNC_STATUS,
    isSyncing
});