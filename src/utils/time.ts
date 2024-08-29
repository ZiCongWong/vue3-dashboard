export const getTime = () => {
  let message = ''
  let hours = new Date().getHours()
  if (5 < hours <= 12) {
    message = 'Morning'
  } else if (11 < hours <= 18) {
    message = 'Afternoon'
  } else {
    message = 'Night'
  }
  return message
}