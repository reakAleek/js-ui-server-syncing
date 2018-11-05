// @flow

import React from 'react';
import Person from "./Person";
import {connect} from "react-redux";
import type {AppState} from "../+store/model";

const PersonList = ({ persons }) => (
    <ul>
        {persons.map( (p) =>
            <li key={p.uid}><Person person={p}/></li>
        )}
    </ul>
);

const mapStateToProps = (state: AppState) => ({
    persons: state.persons
});

export default connect(mapStateToProps)(PersonList);