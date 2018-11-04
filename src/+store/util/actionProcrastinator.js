// @flow
import {merge, Observable, Subject} from "rxjs";
import {Action} from "redux";
import type {Entity, UUID} from "../model";
import {buffer, filter, map, take, tap, withLatestFrom} from "rxjs/operators";
import _ from "lodash";

/**
 * Basically, this class creates an observable of type Observable<Action>
 * which can be subscribed. As long as this observable has not yet emitted
 * an action, follow-up actions can be pushed into the actionSubject.
 * However, only the last action that has been pushed is included in the
 * stream of the initial observable. The payload of the follow-up action
 * adopts the ID (or any given path) of the payload of the initial action
 * payload and is also emitted by the observable.
 */
export class ActionPostponeObject {

    buffer$ = new Subject<any>();
    actionSubject$ = new Subject<Action>();

    constructor(
        observable$: Observable<Action>,
        payloadPath: string = 'payload',
        mergeObjectPath: string = 'payload.id'
    ) {
        this.followUpObservable = this._initFollowUpObservable(payloadPath, mergeObjectPath);
        this.initialObservable$ = this._initObservable(observable$, mergeObjectPath);
    }

    asObservable = (): Observable<Action> => {
        return merge(
            this.initialObservable$,
            this.followUpObservable,
        ).pipe(filter(action => !!action));
    };

    _initFollowUpObservable = (
        payloadPath: string,
        mergeObjectPath: string
    ): Observable<Action> => {
        return this.actionSubject$.asObservable()
            .pipe(
                buffer(this.buffer$),
                map(actions => _.last(actions)),
                withLatestFrom(this.buffer$),
                map(([action, mergeObject]) => {
                    return (action)
                        ? _.setWith(_.clone(action), mergeObjectPath, mergeObject)
                        : false;
                }),
                take(1)
            );
    };

    _initObservable = (
        obs$: Observable<Action>,
        mergeObjectPath: string
    ): Observable<Action> => {
        return obs$.pipe(
            tap(action  => { this.buffer$.next(_.get(action, mergeObjectPath)); }),
            take(1)
        );
    };

    push = (action: Action) => {
        this.actionSubject$.next(action);
    };
}

/*
 * This class manages ActionPostponeObjects by storing them in a map.
 * Once the ActionPostponeObject is finished with its task, the entry
 * is deleted from the map again.
 * The UUID is used to assign follow-up actions to a specific running action.
 */
export class ActionProcrastinator {

    _uuidMap: {[UUID]: ActionPostponeObject} = {};

    put = (
        uuid: UUID,
        obs$: Observable<Entity>,
        payloadPath: string = 'payload',
        mergeObjectPath: string = 'payload.id'
    ): ActionPostponeObject => {
        this._uuidMap[uuid] = new ActionPostponeObject(
            obs$.pipe(tap(() => { this._remove(uuid) })),
            payloadPath,
            mergeObjectPath
        );
        return this.get(uuid);
    };

    pushAction = (
        uuid: UUID,
        action: Action
    ): void => {
        if (this.hasUUID(uuid)) {
            this.get(uuid).push(action);
        } else {
            throw Error(`Cannot find ActionPostponeObject with the UUID: ${uuid}`);
        }
    };

    hasUUID = (uuid: UUID): boolean => {
        return uuid in this._uuidMap;
    };

    get = (uuid: UUID): ActionPostponeObject => {
        return this._uuidMap[uuid];
    };

    _remove = (uuid: UUID): void => {
        delete this._uuidMap[uuid];
    };
}

export default ActionProcrastinator;