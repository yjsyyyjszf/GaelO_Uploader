/**
 Copyright (C) 2018-2020 KANOUN Salim
 This program is free software; you can redistribute it and/or modify
 it under the terms of the Affero GNU General Public v.3 License as published by
 the Free Software Foundation;
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 Affero GNU General Public Public for more details.
 You should have received a copy of the Affero GNU General Public Public along
 with this program; if not, write to the Free Software Foundation, Inc.,
 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
 */

import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import Button from 'react-bootstrap/Button'
import CheckPatient from './CheckPatient'
//Redux
import { connect } from 'react-redux';
import { selectStudy } from './actions/DisplayTables'

class StudiesTab extends Component {

    state = {
        isCheck: false,
    }

    constructor(props) {
        super(props)
        this.toggleCheckPatient = this.toggleCheckPatient.bind(this)
        this.selectedStudy = null;
    }

    columns = [
        {
            dataField: 'studyUID',
            text: '',
            isDummyField: true,
            hidden: false,
            formatter: (cell, row, rowIndex, extraData) => (
                <Button onClick={() => { this.toggleCheckPatient(row); }}>
                    Check Patient
                </Button>
            ),
        },
        {
            dataField: 'status',
            text: 'Status',
        },
        {
            dataField: 'patientName',
            text: 'Patient name',
        },
        {
            dataField: 'studyDescription',
            text: 'Description',
        },
        {
            dataField: 'accessionNumber',
            text: 'Accession #',
        },
        {
            dataField: 'acquisitionDate',
            text: 'Date',
        },
    ]

    selectRow = {
        mode: 'radio',
        clickToSelect: true,
        hideSelectColumn: true,
        bgColor: 'lightgrey',
        onSelect: (row) => {
            this.props.selectStudy(row.studyUID)
        }
    };

    toggleCheckPatient(row) {
        this.setState((state) => { return { isCheck: !state.isCheck } })
        return row
    }

    getStudies() {
        return Object.values(this.props.studies)
    }

    render() {
        return (
            <>
                <BootstrapTable
                    keyField='studyUID'
                    classes="table table-borderless"
                    bodyClasses="du-studies-tbody"
                    headerClasses="du-studies th"
                    rowClasses="du-studies td"
                    data={this.getStudies()}
                    columns={this.columns}
                    selectRow={this.selectRow}
                />
                <CheckPatient studyUID={this.selectedStudy} validateCheckPatient={this.props.validateCheckPatient}
                    show={this.state.isCheck} closeListener={() => this.toggleCheckPatient(this.selectedStudy)}
                    expectedStudy={this.props.studies} currentStudy={this.props.studies} />
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        studies: state.Model.studies,
        selectedStudy: state.DisplayTables.selectedStudy
    }
}
const mapDispatchToProps = {
    selectStudy
}

export default connect(mapStateToProps, mapDispatchToProps)(StudiesTab)