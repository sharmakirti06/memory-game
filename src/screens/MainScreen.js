
import React, { Component } from 'react'
import {
  View, StyleSheet, Text, FlatList, TouchableOpacity, SafeAreaView
} from 'react-native'
import { connect } from 'react-redux'
import CardComponent from '../components/Card'
import constants from '../constants'
import { nextLevel } from '../actions/game'
import { getRandomNumbers } from '../utils/Helpers'

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: 'white',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  levelScoreView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 10
  },
  textStyleDefualt: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 16
  }
})



class MainScreen extends Component {

  constructor(props) {
    super(props)
    const { cardsData, cardsRef } = this.getCardsData(props)
    this.state = {
      cardsData,
      timeLeft: constants.TIME_LIMIT * constants.SECONDS_IN_ONE_MINUTE
    }
    this.cardsRef = cardsRef
  }

  componentDidMount() {
      this.timeLeftTimer = setInterval(() => {
        const { timeLeft } = this.state
        if (timeLeft > -1) {
          this.setState(prevState => ({
            timeLeft: prevState.timeLeft - 1
          }))
        }
      }, 1000)
  }

  componentWillReceiveProps(nextProps) {
    const { level } = this.props
    if (nextProps.level && level !== nextProps.level) {
      // new data of cards on level change
      const { cardsData, cardsRef } = this.getCardsData(nextProps)
      this.setState({ cardsData, cardsRef })
    }
  }

  componentWillUnmount() {
    // clearing all timers 
    if (this.timer) clearTimeout(this.timer)
    if (this.timer1) clearTimeout(this.timer1)
    if (this.timeLeftTimer) clearTimeout(this.timeLeftTimer)
  }

  getCardsData = (props) => {
    const { noOfCards } = props
    let n = noOfCards
    const cardsData = [] // data {state, number} of all cards
    const cardsRef = [] // refs of all cards
    const numbers = getRandomNumbers(n)
    while(n--){
      const obj = {
        state: constants.STATE_HIDDEN,
        number: numbers[n]
      }
      cardsData.push(obj)
      cardsRef.push(null)
    }
    return ({ cardsData, cardsRef })
  }

  setRef = (ref, index) => {
    this.cardsRef[index] = ref
  }


  // Method checking if same number card is already shown then return it's index
  getMatchedCardIndex = (index) => {
    const { cardsData } = this.state
    const indx = cardsData.findIndex((item, indx) => indx !== index
      && item.state === constants.STATE_SHOWN && item.number === cardsData[index].number)
    return indx
  }

  // if no matching card present, mark card hidden agai  after 300ms
  markStateHidden = (index) => {
    this.timer = setTimeout(() => {
      this.cardsRef[index] && this.cardsRef[index].flipBack()
      this.changeState(index, constants.STATE_HIDDEN)
    }, 300)
  }

  checkIsFirstCard = (index) => {
    const { cardsData } = this.state
    if (cardsData.findIndex((item, indx) => indx !== index && item.state === constants.STATE_SHOWN) > -1) {
      return false
    }
    return true
  }

  changeState = (index, state) => {
    const { cardsData } = this.state
    cardsData[index] = this.getChangedDataState(index, state)
    this.setState({
      cardsData
    })
  }

  getChangedDataState = (index, state) => {
    const { cardsData } = this.state
    const data = { ...cardsData[index] }
    data.state = state
    return data
  }

  isLastCard = () => {
    const { cardsData } = this.state
    if (cardsData.findIndex((item) => item.state === constants.STATE_HIDDEN) === -1) {
      return true
    }
    return false
  }

  // Method to be called on card click with index
  flipCard = (index) => {
    const { cardsData, timeLeft } = this.state
    if(cardsData[index].state === constants.STATE_HIDDEN && timeLeft > 0) {
      this.cardsRef[index].flip()
      this.changeState(index, constants.STATE_SHOWN)
      const matchedCardIndex = this.getMatchedCardIndex(index)
      const isFirstCard = this.checkIsFirstCard(index)

      if(matchedCardIndex > -1) {
        const matchedCardnewData = this.getChangedDataState(matchedCardIndex,constants.STATE_MATCHED)
        const newdata = this.getChangedDataState(index,constants.STATE_MATCHED)
        cardsData[matchedCardIndex] = matchedCardnewData
        cardsData[index] = newdata
        this.setState({
          cardsData
        })
      } else if(matchedCardIndex === -1 && !isFirstCard){
        this.markStateHidden(index)
      }

      // if clicked card is last card go to next level
      if (this.isLastCard()) {
        this.timer1 = setTimeout(() => {
          this.props.nextLevel()
        }, 400)
      }
    }
  }


  renderListItem = ({ item, index }) => {
    const { height, width } = this.props
    const { cardsData } = this.state
    return (
      <TouchableOpacity onPress={() => this.flipCard(index)} style={{ flex: 1, margin: 5 }}>
        <CardComponent
          ref={ref => this.setRef(ref, index)}
          number={cardsData[index].number}
          height={height}
          width={width}
          state={cardsData[index].state}
        />
      </TouchableOpacity>
    )
  }

  itemSeparatorLine = () => (
    <View style={{ height: 5 }} />
  )

  renderText = ({ text, style }) => (
    <Text
      style={[styles.textStyleDefualt, style]}
      >
      {text}
    </Text>
  )

  renderLevelScore = () => {
    const { level, score } = this.props
      return (
      <View style={styles.levelScoreView}>
        <View>
          {this.renderText({ text: 'Level' })}
          {this.renderText({ text: level, style: {textAlign: 'center', color: 'red'} })}
        </View>
        <View>
          {this.renderText({ text: 'Score' })}
          {this.renderText({ text: score , style: {textAlign: 'center', color: 'red'} })}
        </View>
      </View>
    )
  }

  renderTimer = () => {
    const { timeLeft } = this.state
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft - minutes * 60
    if (minutes === 0 && seconds === 0) {
      alert(`TIMES UP!!!\n Your score is ${this.props.score}`)
      return
    }
    return (
      <View>
        {this.renderText({ text: 'Time Left' })}
        {this.renderText({ text: `${minutes} : ${seconds}`, style: {textAlign: 'center', color: 'red'} })}
      </View>
    )
  }

  renderCards = () => {
    const { cardsData } = this.state
    const { noOfCol } = this.props
    return (
      <FlatList
        data={cardsData}
        renderItem={this.renderListItem}
        numColumns={noOfCol}
        keyExtractor={(_, indx) => indx}
        style={{ width: '100%'}}
        key={cardsData.length}
      />
    )
  }

  render() {
    return (
      <SafeAreaView>
        <View style={styles.container}>
          { this.renderText({ text: 'Memory game', style: {color: '#5e0be0', fontSize: 18 }}) }
          { this.renderLevelScore() }
          { this.renderTimer() }
          { this.renderCards() }
        </View>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => {
  const { gameReducer: { level, score, noOfCol,
    noOfRows, cardWidth, cardHeight, noOfCards } } = state
  return {
    level,
    score,
    noOfRows,
    noOfCol,
    height: cardHeight,
    width: cardWidth,
    noOfCards
  }
}
export default connect(mapStateToProps, { nextLevel })(MainScreen)
