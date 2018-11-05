// @flow

export type UID = number;

export type Entity = { id: number, uid: UID };
export type Person = { name: string } & Entity;

export type AppState = {
    isSyncing: boolean,
    persons: Person[]
};

export const NOT_YET_PERSISTED = -1;