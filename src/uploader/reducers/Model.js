//Gérer les IDs, selected study, warnings
import { ADD_STUDIES_SERIES, UPDATE_WARNING_STUDY, ADD_WARNING_SERIES, UPDATE_WARNING_SERIES } from '../actions/actions-types'

const initialState = {
    studies: {},
    series: {},
}

export default function StudiesSeriesReducer(state = initialState, action) {

    switch (action.type) {

        case ADD_STUDIES_SERIES:
            let studies = {}
            let seriesList = {}

            //Info necessary for Studies table
            let studyUID
            let patientName
            let studyDescription
            let accessionNumber
            let acquisitionDate
            let firstName
            let lastName
            let birthDate
            let sex
            let series
            let studyWarnings = {}

            //Info necessary for Series table
            let seriesInstanceUID
            let seriesDescription
            let modality
            let seriesNumber
            let seriesDate
            let numberOfInstances
            let seriesWarnings = {}

            for (let stID in action.payload) {
                let study = action.payload[stID]
                studyUID = stID
                patientName = study.patientName
                studyDescription = study.studyDescription
                accessionNumber = study.accessionNumber
                acquisitionDate = study.acquisitionDate
                firstName = study.firstName
                lastName = study.lastName
                birthDate = study.birthDate
                sex = study.sex
                studyWarnings = study.warnings
                series = Object.keys(study.series)
                let studyToAdd
                if (studies[studyUID] == undefined) {
                    studyToAdd = {
                        studyUID, patientName, studyDescription, accessionNumber, acquisitionDate, firstName, lastName, birthDate, sex,
                        warnings:{...studyWarnings}, series: [series]
                    }
                } else {
                    studyToAdd = {
                        studyUID, patientName, studyDescription, accessionNumber, acquisitionDate, firstName, lastName, birthDate, sex,
                        warnings:{...studyWarnings}, series: [series]
                    }
                }
                studies[studyUID] = { ...studyToAdd }
                for (let srID in action.payload[stID].series) {
                    let series = action.payload[stID].series[srID]
                    seriesInstanceUID = srID
                    seriesDescription = series.seriesDescription
                    modality = series.modality
                    seriesNumber = series.seriesNumber
                    seriesDate = series.seriesDate
                    numberOfInstances = series.numberOfInstances
                    seriesWarnings = series.warnings
                    if (state.series[seriesInstanceUID] == undefined) {
                        series = {
                            seriesInstanceUID, seriesDescription, modality, seriesNumber, seriesDate, numberOfInstances, warnings:{...seriesWarnings}
                        }
                    } else {
                        series = {
                            seriesInstanceUID, seriesDescription, modality, seriesNumber, seriesDate, numberOfInstances, warnings:{...seriesWarnings}
                        }
                    }
                    seriesList[seriesInstanceUID] = {...series}
                }
            }

            console.log(state)

            return {
                ...state,
                studies: {
                    ...state.studies,
                    ...studies,
                },
                series: {
                    ...state.series,
                    ...seriesList,
                }
            }

        case UPDATE_WARNING_SERIES:
            let warningCopy = action.payload
            let seriesID_W = action.payload.objectID
            warningCopy.dismissed = !warningCopy.dismissed
            console.log(state.series[seriesID_W])
            return {
                ...state,
                series: {
                    ...state.series,
                    [seriesID_W]: {
                        ...state.series[seriesID_W],
                        [warningCopy.key]: { ...warningCopy }
                    }
                }
            }

        default:
            return state
    }
}