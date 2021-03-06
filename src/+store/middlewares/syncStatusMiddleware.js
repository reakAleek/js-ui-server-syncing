// @flow
import {Action, Store} from "redux";
import {Subject} from "rxjs";
import {
    DELETE_PERSON,
    DELETE_PERSON_SUCCESS,
    FETCH_PERSONS,
    FETCH_PERSONS_SUCCESS,
    PATCH_PERSON,
    PATCH_PERSON_SUCCESS,
    POST_PERSON,
    POST_PERSON_SUCCESS,
    setSyncStatusAction,
} from "../actions";
import {debounceTime} from "rxjs/operators";

const syncStatusMiddleware = (store: Store) => {

    const syncStatus = new Subject<boolean>();
    syncStatus.asObservable().pipe(debounceTime(1000)).subscribe(isSyncing => {
        store.dispatch(setSyncStatusAction(isSyncing));
    });

    return (next) => (action: Action) => {

        switch (action.type) {

            case FETCH_PERSONS:
            case POST_PERSON:
            case PATCH_PERSON:
            case DELETE_PERSON:
                store.dispatch(setSyncStatusAction(true));
                syncStatus.next(true);
                break;

            case FETCH_PERSONS_SUCCESS:
            case POST_PERSON_SUCCESS:
            case PATCH_PERSON_SUCCESS:
            case DELETE_PERSON_SUCCESS:
                syncStatus.next(false);
                break;

            default:
                break;
        }
        return next(action);
    }
};

export default syncStatusMiddleware;