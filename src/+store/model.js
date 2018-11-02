// @flow

export type UUID = number;

export type Entity = { id: number, uuid: UUID };
export type Person = { name: string } & Entity;

export type AppState = {
    isSyncing: boolean,
    persons: Person[]
};

export const NOT_YET_PERSISTED = -1;