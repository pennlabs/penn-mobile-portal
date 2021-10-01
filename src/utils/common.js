import {
  DEV_API_URL,
  DEV_STUDENT_LIFE_URL,
  API_URL,
  STUDENT_LIFE_URL,
} from './constants'

// File for all common functions and objects

const dev = false

export const fetchApiRequest = (route, data, student_life) => {
  let url = ''
  if (student_life) {
    url = dev
      ? `${DEV_STUDENT_LIFE_URL}/${route}`
      : `${STUDENT_LIFE_URL}/${route}`
  } else {
    // url = dev ? `${DEV_API_URL}/${route}` : `${API_URL}/${route}`
    url = `${API_URL}/${route}`
  }
  data.headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  try {
    return fetch(url, data)
  } catch (error) {
    console.log(error)
  }
}

/**
 * returns current graduation years (year increments after 8/1)
 * @returns {Array}
 */
export const getClassYears = () => {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()
  const seniorYear = currentMonth >= 8 ? currentYear + 1 : currentYear
  return [seniorYear, seniorYear + 1, seniorYear + 2, seniorYear + 3]
}

export const getSchools = {
  COL: 'College',
  WH: 'Wharton',
  EAS: 'SEAS',
  NUR: 'Nursing',
}

/**
 * formats date strings to YYYY-MM-DDTHH:MM:SS
 * @param {Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  function paddedString(amt) {
    return amt < 10 ? '0' + amt : amt
  }

  var month = paddedString(date.getMonth() + 1)
  var day = paddedString(date.getDate())
  var hours = paddedString(date.getHours())
  var minutes = paddedString(date.getMinutes())

  var strTime = hours + ':' + minutes + ':00'
  return date.getFullYear() + '-' + month + '-' + day + 'T' + strTime
}
