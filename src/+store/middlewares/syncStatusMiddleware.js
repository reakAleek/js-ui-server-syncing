// @flow
import {Action, Store} from "redux";
import {Subject} from "rxjs";
import {FETCH_PERSONS, FETCH_PERSONS_SUCCESS, SAVE_PERSON, SAVE_PERSON_SUCCESS, setSyncStatusAction} from "../actions";
import {debounceTime} from "rxjs/operators";

const syncStatusMiddleware = (store: Store) => {

    const syncStatus = new Subject<boolean>();
    syncStatus.asObservable().pipe(debounceTime(500)).subscribe(isSyncing => {
        store.dispatch(setSyncStatusAction(isSyncing));
    });

    return (next) => (action: Action) => {

        switch (action.type) {

            case FETCH_PERSONS:
            case SAVE_PERSON:
                store.dispatch(setSyncStatusAction(true));
                syncStatus.next(true);
                break;

            case FETCH_PERSONS_SUCCESS:
            case SAVE_PERSON_SUCCESS:
                syncStatus.next(false);
                break;

            default:
                break;
        }
        return next(action);
    }
};

export default syncStatusMiddleware;