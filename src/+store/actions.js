import type {Person} from "./model";

/*********************************************
 * FETCH PERSON
 *********************************************/

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


/*********************************************
 * SAVE PERSON
 *********************************************/

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


/*********************************************
 * PATCH PERSON
 *********************************************/

export const PATCH_PERSON = 'PATCH_PERSON';
export type PatchPersonAction = {
    type: PATCH_PERSON,
    person: Person
}
export const patchPersonAction =
    (person: Person): PatchPersonAction => ({
        type: PATCH_PERSON, person
    });

export const PATCH_PERSON_SUCCESS = 'PATCH_PERSON_SUCCESS';
export type PatchPersonSuccessAction = {
    type: PATCH_PERSON_SUCCESS,
    person: Person
}
export const patchPersonSuccessAction =
    (person: Person): PatchPersonSuccessAction => ({
        type: PATCH_PERSON_SUCCESS, person
    });


/*********************************************
 * DELETE PERSON
 *********************************************/

export const DELETE_PERSON = 'DELETE_PERSON';
export type DeletePersonAction = {
    type: DELETE_PERSON,
    person: Person
}
export const deletePersonAction =
    (person: Person): DeletePersonAction => ({
        type: DELETE_PERSON, person
    });

export const DELETE_PERSON_SUCCESS = 'DELETE_PERSON_SUCCESS';
export type DeletePersonSuccessAction = {
    type: DELETE_PERSON_SUCCESS,
    person: Person
}
export const deletePersonSuccessAction =
    (person: Person): DeletePersonSuccessAction => ({
        type: DELETE_PERSON_SUCCESS, person
    });

/*********************************************
 * REMOVE PERSON
 *********************************************/

export const REMOVE_PERSON = 'REMOVE_PERSON';
export type RemovePersonAction = {
    type: REMOVE_PERSON,
    person: Person
}
export const removePersonAction =
    (person: Person): RemovePersonAction => ({
        type: REMOVE_PERSON, person
    });

/*********************************************
 * ADD PERSON
 *********************************************/

export const ADD_PERSON = 'ADD_PERSON';
export type AddPersonAction = {
    type: ADD_PERSON
};
export const addPersonAction = (): AddPersonAction => ({
    type: ADD_PERSON
});

/*********************************************
 * ON UPDATE PERSON
 *********************************************/

export const ON_UPDATE_PERSON = 'ON_UPDATE_PERSON';
export type OnUpdatePersonAction = {
    type: ON_UPDATE_PERSON,
    person: Person
}
export const onUpdatePersonAction =
    (person: Person): OnUpdatePersonAction => ({
        type: ON_UPDATE_PERSON, person
    });

/*********************************************
 * UPDATE PERSON
 *********************************************/

export const UPDATE_PERSON = 'UPDATE_PERSON';
export type UpdatePersonAction = {
    type: UPDATE_PERSON,
    person: Person
}
export const updatePersonAction =
    (person: Person): UpdatePersonAction => ({
        type: UPDATE_PERSON, person
    });


/*********************************************
 * SET SYNC STATUS
 *********************************************/

export const SET_SYNC_STATUS = 'SET_SYNC_STATUS';
export type SetSyncStatusAction = {
    type: SET_SYNC_STATUS,
    isSyncing: boolean
};
export const setSyncStatusAction = (isSyncing): SetSyncStatusAction => ({
    type: SET_SYNC_STATUS,
    isSyncing
});