// returns current graduation years (year increments after 8/1)
export const getClassYears = () => {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()
  const seniorYear = currentMonth >= 8 ? currentYear + 1 : currentYear
  return [seniorYear, seniorYear + 1, seniorYear + 2, seniorYear + 3]
}
