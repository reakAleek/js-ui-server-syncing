// @flow
import {Observable, Subject} from "rxjs";
import {Action, Store} from "redux";
import type {Entity, UUID} from "../model";
import {buffer, map, withLatestFrom} from "rxjs/operators";
import _ from "lodash";

/**
 *
 */
export class ActionPostponeObject {

    buffer$ = new Subject<number>();
    actionQueue$ = new Subject<Action>();

    constructor(
        uuidMap: {[UUID]: ActionPostponeObject},
        store: Store, uuid: UUID,
        post$: Observable<Entity>,
        successActionCreator: (entity: Entity) => Action,
        entityIdentifier: string = 'payload'
    ) {
        this.uuidMap = uuidMap;
        this.store = store;
        this.uuid = uuid;
        this.post$ = post$;
        this.successActionCreator = successActionCreator;
        this.actionQueue$.asObservable()
            .pipe(
                buffer(this.buffer$),
                map(actions => _.last(actions)),
                withLatestFrom(this.buffer$),
                map(([action, id]) => {
                    if (action) {
                        return {
                            ...action,
                            [entityIdentifier]: {...action[entityIdentifier], id}
                        };
                    }
                    else {
                        return false;
                    }
                })
            )
            .subscribe(action => {
                if (action) {
                    this.store.dispatch(action);
                }
            });
        this._init();
    }

    _init = (): void => {
        this.post$.subscribe(entity => {
            this.store.dispatch(this.successActionCreator({...entity, uuid: this.uuid }));
            this.buffer$.next(entity.id);
            delete this.uuidMap[this.uuid];
        });
    };

    push = (action: Action) => {
        this.actionQueue$.next(action);
    }
}

export class ActionProcrastinator {

    _uuidMap: {[UUID]: ActionPostponeObject} = {};

    constructor(store: Store) {
        this.store = store;
    }

    put = (
        uuid: UUID,
        obs$: Observable<Entity>,
        successActionCreator: (entity: Entity) => Action,
        entityIdentifier: string = 'payload'
    ): ActionPostponeObject => {
        if (!this.hasUUID(uuid)) {
            this._uuidMap[uuid] = new ActionPostponeObject(
                this._uuidMap,
                this.store,
                uuid,
                obs$,
                successActionCreator,
                entityIdentifier
            );
        }
    };

    pushAction = (uuid: UUID, action: Action): void => {
        if (this.hasUUID(uuid)) {
            this._get(uuid).push(action);
        } else {
            throw Error(`Cannot find UUID: ${uuid}`);
        }
    };

    hasUUID = (uuid: UUID): boolean => {
        return uuid in this._uuidMap;
    };

    _get = (uuid: UUID): ActionPostponeObject => {
        return this._uuidMap[uuid];
    };
}

export default ActionProcrastinator;