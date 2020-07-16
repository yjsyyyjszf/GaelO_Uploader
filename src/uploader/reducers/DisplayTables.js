// Gérer les IDs, selected study, warnings
import { SELECT_STUDY, SELECT_SERIES, VALIDATE_CHECK_PATIENT, SERIES_READY } from '../actions/actions-types'

const initialState = {
  selectedStudy: undefined,
  selectedSeries: [],
  seriesReady: {},
  validatedPatients: []
}

export default function DisplayTablesReducer(state = initialState, action) {
  switch (action.type) {
    case SELECT_STUDY:
      //SK ICI PREVOIR LE MEME TYPE DE FONCTION QUE SERIES POUR LE MULTIUPLOADER 
      return {
        ...state,
        selectedStudy: action.payload
      }

    case SELECT_SERIES:
      if (action.payload !== undefined && action.payload.isSelect) {
        return {
          ...state,
          selectedSeries: [...state.selectedSeries, action.payload.row.seriesInstanceUID]
        }
      } else if (action.payload !== undefined && !action.payload.isSelect) {
        return {
          ...state,
          selectedSeries: state.selectedSeries.filter(thisRow => thisRow !== action.payload.row.seriesInstanceUID)
        }
      }

    case VALIDATE_CHECK_PATIENT:
      return {
        ...state
      }

    case SERIES_READY:
      if (action.payload !== undefined && action.payload.isSelect) {
        return {
          ...state,
          seriesReady: [...state.seriesReady, action.payload.validSeries.seriesInstanceUID]
        }
      } else if (action.payload !== undefined && !action.payload.isSelect) {
        return {
          ...state,
          seriesReady: state.seriesReady.filter(thisRow => thisRow !== action.payload.validSeries.seriesInstanceUID)
        }
      }

    default:
      return state
  }
}
