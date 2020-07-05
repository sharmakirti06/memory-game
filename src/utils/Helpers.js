// utility method to shuffle array randomly
const shuffleArray = (numbers) => {
  const n = numbers.length
  for (let i = n - 1; i >= 0; i--) {
    let randomIndex = Math.floor(Math.random() * (i + 1))
    let itemAtIndex = numbers[randomIndex]
    numbers[randomIndex] = numbers[i]
    numbers[i] = itemAtIndex
  }
  return numbers
}

// Method to get random numbers array of size equal to no of cards
export const getRandomNumbers = (n) => {
    let half = n/2
    const rand = new Array(half) // half sized array of random numbers
    while(half--) {
      const no = Math.floor((Math.random() * 10) + 1)
      if(rand.includes(no)) {
        half++
      } else {
        rand[half] = no
      } 
    }
    const numbers = [...rand, ...rand]
    return shuffleArray(numbers)
  }