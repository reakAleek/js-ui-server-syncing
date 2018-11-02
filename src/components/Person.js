// @flow
import React from 'react';
import {connect} from "react-redux";
import {addPersonAction, savePersonAction, updatePersonAction} from "../+store/actions";
import _ from "lodash";

const handleSubmit = (ev, addPerson, isLast) => {
    ev.preventDefault();

    if (isLast) {
        addPerson();
    }
};

const Person = ({ person, updatePersonName, createOrUpdate, addPerson, isLast }) => (
    <div className="card person-card">
        <form className="card-content" onSubmit={(ev) => handleSubmit(ev, addPerson, isLast)}>
            <div className="field has-addons">
                <p className="control">
                    <button style={{width: '2.7rem'}} className="button is-static" tabIndex={-1}>
                        { person.id }
                    </button>
                </p>
                <p className="control is-expanded">
                    <input type="text"
                           className="input"
                           placeholder={'Name'}
                           value={person.name}
                           onChange={ (ev) => {updatePersonName(ev.target.value)} }
                           autoFocus={true}
                    />
                </p>
            </div>
        </form>
    </div>
);

const mapDispatchToProps = (dispatch, ownProps) => ({
    updatePersonName: (name) => dispatch(updatePersonAction({ ...ownProps.person , name })),
    createOrUpdate: (person) => dispatch(savePersonAction(person)),
    addPerson: () => dispatch(addPersonAction())
});

const mapStateToProps = (state, ownProps) => ({
    isLast: (state.persons.length-1) === _.findIndex(state.persons, ({uuid}) => ownProps.person.uuid === uuid)
});

export default connect(mapStateToProps, mapDispatchToProps)(Person);
