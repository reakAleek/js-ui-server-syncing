import React from 'react';
import {connect} from "react-redux";
import {addPersonAction, fetchPersonsAction} from "../+store/actions";
import type {AppState} from "../+store/model";

const ActionBar = ({ addPerson, fetch, isSyncing }) => (
    <div className="field is-grouped">
        <p className="control" style={{ width: '50%'}}>
            <button className="button is-fullwidth is-success" onClick={() => addPerson()}>Add Person</button>
        </p>
        <p className="control" style={{ width: '50%'}}>
            <button className={`button is-fullwidth is-light ${ isSyncing ? '' : '' } `}
                    disabled={isSyncing}
                    onClick={() => !isSyncing && fetch() }>
                {isSyncing ? 'Syncing...' : 'Refresh' }
            </button>
        </p>
    </div>
);

const mapDispatchToProps = (dispatch) => ({
    addPerson: () => dispatch(addPersonAction()),
    fetch: () => dispatch(fetchPersonsAction())
});

const mapStateToProps = (state: AppState) => ({
    isSyncing: state.isSyncing
});

export default connect(mapStateToProps, mapDispatchToProps)(ActionBar);