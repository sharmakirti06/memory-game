import {
  Dimensions
} from 'react-native'

const WIDTH = Dimensions.get('window').width
const CARD_WIDTH_INITIAL = (WIDTH / 2) - 30
const CARD_HEIGHT_INITIAL = CARD_WIDTH_INITIAL * 1.5


const initialState = {
    level: 1,
    score: 0,
    noOfCol: 2,
    noOfRows: 2,
    noOfCards : 4,
    cardHeight: CARD_HEIGHT_INITIAL,
    cardWidth: CARD_WIDTH_INITIAL
  }

  function getRowsAndCols(level, currentRows, currentCols) {
    const noOfCards = 2 * (level+1)
    if(currentRows * currentCols < noOfCards){
      if(currentCols === currentRows){
        currentRows++
      } else if (currentRows - currentCols >= 1 && currentCols <= 2) {
        currentCols++
      } else {
        currentRows++
      }

    }
    return ({ row: currentRows, col: currentCols })
  }
  
  export default function Reducer(state = initialState, action) {
    switch (action.type) {
      case 'INCREMENET_LEVEL': {
        const { level, noOfRows, noOfCol } = state
        const newLevel = level+1
        const score = level * 10
        const { row, col } = getRowsAndCols(newLevel, noOfRows, noOfCol)
        return {
            ...state,
            level: newLevel,
            score,
            noOfCol: col,
            noOfRows: row,
            cardWidth: (WIDTH/col) - 30,
            cardHeight: 1.2 * ((WIDTH/col) - 30),
            noOfCards: 2 * (newLevel+1)
        }
      }
      default:
        return state
    }
  }
  