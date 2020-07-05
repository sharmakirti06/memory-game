import {
  StyleSheet, Text, Animated
} from 'react-native'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import constants from '../constants';
  
const styles = StyleSheet.create({
  container: {
      alignItems: 'center',
      borderWidth: 1,
      justifyContent: 'center',
      borderColor: '#1dd38f',
      borderRadius: 10
  },
  textDefaultStyle: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 30
  }
})
  

class CardComponent extends PureComponent {
  constructor(props) {
      super(props)
      this.animatedValue = new Animated.Value(0)
      this.value = 0
      this.animatedValue.addListener(({ value }) => {
        this.value = value
      })
  }

  flip = () => {
    Animated.spring(this.animatedValue, {
        toValue: 4,
        tension: 10,
        friction: 8,
        useNativeDriver: true
      }).start()
  }

  flipBack = () => {
    Animated.spring(this.animatedValue, {
        toValue: 2,
        tension: 10,
        friction: 8,
        useNativeDriver: true
      }).start()
  }

  renderText = ({ text, style }) => (
    <Text
      style={[styles.textDefaultStyle, style]}
      >
      {text}
    </Text>
  )

  getVisibility = (state) => {
    return (state === constants.STATE_SHOWN || state === constants.STATE_MATCHED)
  }

  render() {
    this.setInterpolate = this.animatedValue.interpolate({
        inputRange: [0, 2, 2.000001, 3.9999],
        outputRange: ['0deg', '-180deg', '180deg', '0deg'],
    })
    const rotateYstyle = {
      transform: [{ rotateY: this.setInterpolate }],
    }
    const { height, width, number, state } = this.props
    const isVisible = this.getVisibility(state)
    return (
      <Animated.View style={[styles.container, { height, width, backgroundColor: isVisible ? 'white' : '#1dd38f' }, rotateYstyle]}>
          { isVisible && this.renderText({ text: number })}
      </Animated.View>
    )
  }
}

CardComponent.propTypes = {
    number: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    state: PropTypes.string.isRequired
}

export default connect(
    null,
    null,
    null,
    { forwardRef: true }
  )(CardComponent)