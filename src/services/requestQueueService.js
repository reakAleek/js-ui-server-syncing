// @flow
import type {Entity, UUID} from "../+store/model";
import {NOT_YET_PERSISTED} from "../+store/model";
import {BehaviorSubject, concat, Observable, of} from "rxjs";
import {filter, last, switchMap, withLatestFrom} from "rxjs/operators";

/**
 * If the method postOrPatch is called and the passed entity is
 * passed for the first time (and has an ID of -1), then the UUID
 * of the entity is stored in a map, where the UUID is the key
 * and the value is a new BehaviorSubject. The entity is then sent
 * to the server via POST.
 *
 * If the POST request has not yet been completed and the method is
 * called again with an entity with the same UUID, the entity is pushed
 * into the previously stored BehaviorSubject. As soon as the POST
 * request is completed and the BehaviorSubject contains an entity (by a repeated call),
 * this entity together with the ID from the POST request is sent to the
 * server via PATCH, so that the server still remains up-to-date.
 *
 * If the passed entity is has an ID other than -1, then the entity is simply sent via PATCH
 * to the server.
 */

const SUBJECT_KEY = 0;
const ID_KEY = 1;

class RequestQueueService {

    _uuidMap: { [UUID]: [BehaviorSubject<Entity | false>, number] } = {};
    _isRegistered = (entity: Entity) => entity.uuid in this._uuidMap;
    _hasPersistedId = (entity: Entity) => entity.id !== NOT_YET_PERSISTED;
    _isPersistedOnServer = (entity: Entity) => this._isRegistered(entity) && this._uuidMap[entity.uuid][1] !== NOT_YET_PERSISTED;
    postOrPatch(
        entity: Entity,
        post: (entity: Entity) => Observable<Entity>,
        patch: (entity: Entity) => Observable<Entity>
    ): Observable<Entity | false> {
        return Observable.create(observer => {
            if (!this._hasPersistedId(entity)
            && !this._isRegistered(entity)) {
                this._uuidMap[entity.uuid] = [new BehaviorSubject<Entity | false>(false), NOT_YET_PERSISTED];
                post(entity).pipe(
                    withLatestFrom(this._uuidMap[entity.uuid][SUBJECT_KEY].asObservable()),
                    switchMap(([postEntity, patchEntity]) => {
                        this._uuidMap[entity.uuid][ID_KEY] = postEntity.id;
                        return (patchEntity)
                            ? concat(of(postEntity), patch({ ...patchEntity, id: postEntity.id }))
                            : of(postEntity)
                    }),
                    filter(p => p !== false),
                    last(),
                ).subscribe(entity => {
                    delete this._uuidMap[entity.uuid];
                    observer.next(entity);
                    observer.complete();
                })
            } else if (!this._hasPersistedId(entity)
                   && this._isRegistered(entity)
                   && this._isPersistedOnServer(entity)) {
                patch({...entity, id: this._uuidMap[entity.uuid][ID_KEY]}).subscribe(p => {
                    observer.next(p);
                    observer.complete();
                })
            } else if (!this._hasPersistedId(entity)
                   && this._isRegistered(entity)
                   && !this._isPersistedOnServer(entity)) {
                this._uuidMap[entity.uuid][SUBJECT_KEY].next(entity);
                observer.next(false);
                observer.complete();
            } else {
                patch(entity).subscribe(entity => {
                    observer.next(entity);
                    observer.complete();
                });
            }
        });
    }
}

export default RequestQueueService;