/* ===========================================================================
 * ================================================================== main ===
 * ===========================================================================
 */

// # ============================================================ example ===== #

const {yalunar} = require('./yalunar.js')
const greDate = '2021-01-01 18:30:35'

console.log(greDate.toString())

console.log('lunar-day : ' + lunar.calDate)

// const calDate = lunar.solar2lunar(new Date(greDate.toString()))

// let calDate = lalune.lunar2solar(new Date(2011, 0, 3))
// 2010,11,29

// let calDate = lalune.solar2lunar(new Date(2010, 10, 29))
// 2011, 1, 3

// 农历转公历时，如果那一月是那一年的闰月，则需额外传一个参数，才能得到正确的公历日期
// let calDate = lalune.solar2lunar(new Date(2012, 4, 27))
// 2012年4月初7, 其中 isLeap为true，表示为闰四月

// let calDate = lalune.lunar2solar(new Date(2012, 3, 7))
// 得到错误时间：2012, 4, 27

// let calDate = lalune.lunar2solar(new Date(2012, 3, 7), true)
// 正确: 2012, 5, 27
