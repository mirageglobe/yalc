/**
 * YALC - Yet Another Lunar Calendar Converter
 * 
 * @author Jimmy Lim (mirageglobe@gmail.com)
 * @version 2.0.0 - Functional Edition
 */

// ===== CONSTANTS =====

const LUNAR_INFO = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0
];

const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const ZODIAC_ANIMALS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
const DAY_NAMES = ['日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const DAY_PREFIXES = ['初', '十', '廿', '卅'];
const MONTH_NAMES = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '腊'];

const TIME_PERIODS = [
  { name: '子时', zodiac: '鼠', startHour: 23, endHour: 1, dayOffset: 1, branch: '子' },
  { name: '丑时', zodiac: '牛', startHour: 1, endHour: 3, dayOffset: 0, branch: '丑' },
  { name: '寅时', zodiac: '虎', startHour: 3, endHour: 5, dayOffset: 0, branch: '寅' },
  { name: '卯时', zodiac: '兔', startHour: 5, endHour: 7, dayOffset: 0, branch: '卯' },
  { name: '辰时', zodiac: '龙', startHour: 7, endHour: 9, dayOffset: 0, branch: '辰' },
  { name: '巳时', zodiac: '蛇', startHour: 9, endHour: 11, dayOffset: 0, branch: '巳' },
  { name: '午时', zodiac: '马', startHour: 11, endHour: 13, dayOffset: 0, branch: '午' },
  { name: '未时', zodiac: '羊', startHour: 13, endHour: 15, dayOffset: 0, branch: '未' },
  { name: '申时', zodiac: '猴', startHour: 15, endHour: 17, dayOffset: 0, branch: '申' },
  { name: '酉时', zodiac: '鸡', startHour: 17, endHour: 19, dayOffset: 0, branch: '酉' },
  { name: '戌时', zodiac: '狗', startHour: 19, endHour: 21, dayOffset: 0, branch: '戌' },
  { name: '亥时', zodiac: '猪', startHour: 21, endHour: 23, dayOffset: 0, branch: '亥' }
];

const TIME_DESCRIPTIONS = {
  '子时': '夜半，又名子夜、中夜',
  '丑时': '鸡鸣，又名荒鸡',
  '寅时': '平旦，又称黎明、早晨、日旦',
  '卯时': '日出，又名日始、破晓、旭日',
  '辰时': '食时，又名早食',
  '巳时': '隅中，又名日禺',
  '午时': '日中，又名日正、中午',
  '未时': '日昳，又名日跌、日央',
  '申时': '晡时，又名日铺、夕食',
  '酉时': '日入，又名日落、日沉、傍晚',
  '戌时': '黄昏，又名日夕、日暮、日晚',
  '亥时': '人定，又名定昏'
};

const BASE_DATE = new Date(1900, 0, 31);
const MILLISECONDS_PER_DAY = 86400000;

// ===== UTILITY FUNCTIONS =====

/**
 * Check if a value is a valid Date
 */
const isValidDate = date => date instanceof Date && !isNaN(date.getTime());

/**
 * Get lunar year information from lookup table
 */
const getLunarYearInfo = year => LUNAR_INFO[year - 1900];

/**
 * Calculate total days in a lunar year
 */
const calculateLunarYearDays = year => {
  const yearInfo = getLunarYearInfo(year);
  let totalDays = 348; // Base: 12 months × 29 days
  
  // Add extra days for big months (30 days vs 29)
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    totalDays += (yearInfo & i) ? 1 : 0;
  }
  
  return totalDays + calculateLeapMonthDays(year);
};

/**
 * Get which month is the leap month (0 if none)
 */
const getLeapMonth = year => getLunarYearInfo(year) & 0xf;

/**
 * Calculate days in leap month (0 if no leap month)
 */
const calculateLeapMonthDays = year => {
  const leapMonth = getLeapMonth(year);
  if (leapMonth === 0) return 0;
  
  const yearInfo = getLunarYearInfo(year);
  return (yearInfo & 0x10000) ? 30 : 29;
};

/**
 * Calculate days in a specific lunar month
 */
const calculateMonthDays = (year, month) => {
  const yearInfo = getLunarYearInfo(year);
  return (yearInfo & (0x10000 >> month)) ? 30 : 29;
};

/**
 * Check if a Gregorian year is a leap year
 */
const isLeapYear = year => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

/**
 * Get stem-branch combination from number
 */
const getStemBranch = num => HEAVENLY_STEMS[num % 10] + EARTHLY_BRANCHES[num % 12];

/**
 * Format lunar day into Chinese characters
 */
const formatLunarDay = day => {
  switch (day) {
    case 10: return '初十';
    case 20: return '二十';
    case 30: return '三十';
    default:
      return DAY_PREFIXES[Math.floor(day / 10)] + DAY_NAMES[day % 10];
  }
};

/**
 * Adjust date for Chinese time zodiac system
 * 子时 (23:00-01:00) belongs to the next day
 */
const adjustForTimeZodiac = date => {
  const hour = date.getHours();
  
  if (hour === 23) {
    const adjustedDate = new Date(date);
    adjustedDate.setDate(adjustedDate.getDate() + 1);
    return adjustedDate;
  }
  
  return date;
};

// ===== TIME PERIOD FUNCTIONS =====

/**
 * Get time period information for a given time
 */
const getTimePeriod = date => {
  if (!isValidDate(date)) {
    throw new Error('Invalid date provided');
  }

  const hour = date.getHours();
  
  // Handle special case for 子时 (23:00-01:00 next day)
  if (hour >= 23 || hour < 1) {
    return {
      name: '子时',
      zodiac: '鼠',
      period: '23:00-01:00',
      branch: '子',
      description: TIME_DESCRIPTIONS['子时']
    };
  }

  // Find the appropriate time period using functional approach
  const timePeriod = TIME_PERIODS.find(period => {
    if (period.name === '子时') return false; // Already handled above
    
    return hour >= period.startHour && hour < period.endHour;
  });

  if (!timePeriod) {
    return {
      name: '未知',
      zodiac: '未知',
      period: '未知',
      branch: '未知',
      description: '时间段未知'
    };
  }

  return {
    name: timePeriod.name,
    zodiac: timePeriod.zodiac,
    period: `${String(timePeriod.startHour).padStart(2, '0')}:00-${String(timePeriod.endHour).padStart(2, '0')}:00`,
    branch: timePeriod.branch,
    description: TIME_DESCRIPTIONS[timePeriod.name] || '时间段描述未知'
  };
};

// ===== CORE CONVERSION FUNCTIONS =====

/**
 * Convert solar date to lunar date information
 */
const calculateLunarFromSolar = solarDate => {
  const dayOffset = Math.round((solarDate.valueOf() - BASE_DATE.valueOf()) / MILLISECONDS_PER_DAY);
  let remainingDays = dayOffset;
  let year = 1900;
  
  // Find the lunar year using functional approach
  while (year < 2050 && remainingDays > 0) {
    const yearDays = calculateLunarYearDays(year);
    if (remainingDays < yearDays) break;
    remainingDays -= yearDays;
    year++;
  }

  if (remainingDays < 0) {
    year--;
    remainingDays += calculateLunarYearDays(year);
  }

  // Find the lunar month and day
  const leapMonth = getLeapMonth(year);
  let month = 1;
  let isLeapMonth = false;

  while (month <= 12 && remainingDays > 0) {
    let monthDays;
    
    // Handle leap month
    if (leapMonth > 0 && month === leapMonth + 1 && !isLeapMonth) {
      month--;
      isLeapMonth = true;
      monthDays = calculateLeapMonthDays(year);
    } else {
      monthDays = calculateMonthDays(year, month);
    }

    if (remainingDays < monthDays) break;
    
    remainingDays -= monthDays;
    
    if (isLeapMonth) {
      isLeapMonth = false;
    }
    month++;
  }

  // Handle edge case for leap month
  if (remainingDays === 0 && leapMonth > 0 && month === leapMonth + 1) {
    if (isLeapMonth) {
      isLeapMonth = false;
    } else {
      isLeapMonth = true;
      month--;
    }
  }

  if (remainingDays < 0) {
    month--;
    remainingDays += calculateMonthDays(year, month);
  }

  return {
    year,
    month,
    day: remainingDays + 1,
    isLeap: isLeapMonth
  };
};

/**
 * Convert lunar date to solar date information
 */
const calculateSolarFromLunar = (lunarYear, lunarMonth, lunarDay, isLeapMonth = false) => {
  let totalDays = 0;

  // Add days for complete years using functional approach
  for (let year = 1900; year < lunarYear; year++) {
    totalDays += calculateLunarYearDays(year);
  }

  // Add days for complete months in the current year
  for (let month = 1; month < lunarMonth; month++) {
    if (month === getLeapMonth(lunarYear)) {
      totalDays += calculateLeapMonthDays(lunarYear);
    }
    totalDays += calculateMonthDays(lunarYear, month);
  }

  // If current month is leap month, add normal month days
  if (isLeapMonth && getLeapMonth(lunarYear) === lunarMonth) {
    totalDays += calculateMonthDays(lunarYear, lunarMonth);
  }

  // Add days in current month
  totalDays += lunarDay - 1;

  const solarDate = new Date(BASE_DATE.valueOf() + totalDays * MILLISECONDS_PER_DAY);
  
  return {
    year: solarDate.getFullYear(),
    month: solarDate.getMonth(),
    day: solarDate.getDate()
  };
};

/**
 * Calculate stem-branch information for a date
 */
const calculateStemBranch = (year, month, day) => {
  // Year stem-branch (simplified)
  const yearStemBranch = getStemBranch(year - 1900 + 36);
  
  // Month stem-branch
  const monthStemBranch = getStemBranch((year - 1900) * 12 + month + 12);
  
  // Day stem-branch
  const dayOffset = Math.floor(Date.UTC(year, month, day) / MILLISECONDS_PER_DAY) + 25567 + 10;
  const dayStemBranch = getStemBranch(dayOffset + day - 1);

  return {
    year: yearStemBranch,
    month: monthStemBranch,
    day: dayStemBranch
  };
};

// ===== MAIN API FUNCTIONS =====

/**
 * Convert Gregorian (solar) date to comprehensive lunar calendar information
 */
const solarToLunar = solarDate => {
  if (!isValidDate(solarDate)) {
    throw new Error('Invalid date provided');
  }

  // Adjust for time zodiac boundary
  const adjustedDate = adjustForTimeZodiac(solarDate);
  const normalizedDate = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), adjustedDate.getDate());
  
  // Calculate lunar information
  const lunarInfo = calculateLunarFromSolar(normalizedDate);
  
  // Get time period if time is available
  const timePeriod = solarDate.getHours !== undefined ? getTimePeriod(solarDate) : null;
  
  // Calculate stem-branch information
  const stemBranchInfo = calculateStemBranch(normalizedDate.getFullYear(), normalizedDate.getMonth(), normalizedDate.getDate());

  return {
    solar: {
      year: normalizedDate.getFullYear(),
      month: normalizedDate.getMonth() + 1,
      day: normalizedDate.getDate(),
      weekDay: DAY_NAMES[normalizedDate.getDay()],
      time: solarDate.getHours !== undefined ? {
        hour: solarDate.getHours(),
        minute: solarDate.getMinutes(),
        second: solarDate.getSeconds()
      } : null
    },
    lunar: {
      year: lunarInfo.year,
      month: lunarInfo.month,
      day: lunarInfo.day,
      isLeapMonth: lunarInfo.isLeap,
      monthName: MONTH_NAMES[lunarInfo.month - 1],
      dayName: formatLunarDay(lunarInfo.day),
      zodiac: ZODIAC_ANIMALS[(lunarInfo.year - 1900) % 12]
    },
    stemBranch: {
      year: stemBranchInfo.year,
      month: stemBranchInfo.month,
      day: stemBranchInfo.day,
      time: timePeriod ? timePeriod.branch : null
    },
    timePeriod,
    festivals: { solar: '', lunar: '' },
    solarTerms: ''
  };
};

/**
 * Convert lunar date to Gregorian (solar) calendar information
 */
const lunarToSolar = (lunarDate, isLeapMonth = false) => {
  if (!isValidDate(lunarDate)) {
    throw new Error('Invalid date provided');
  }

  const lunarYear = lunarDate.getFullYear();
  const lunarMonth = lunarDate.getMonth() + 1;
  const lunarDay = lunarDate.getDate();
  
  // Calculate solar date
  const solarInfo = calculateSolarFromLunar(lunarYear, lunarMonth, lunarDay, isLeapMonth);
  const solarDate = new Date(solarInfo.year, solarInfo.month, solarInfo.day);
  
  // Calculate stem-branch information
  const stemBranchInfo = calculateStemBranch(solarInfo.year, solarInfo.month, solarInfo.day);

  return {
    solar: {
      year: solarInfo.year,
      month: solarInfo.month + 1,
      day: solarInfo.day,
      weekDay: DAY_NAMES[solarDate.getDay()],
      time: null
    },
    lunar: {
      year: lunarYear,
      month: lunarMonth,
      day: lunarDay,
      isLeapMonth: isLeapMonth,
      monthName: MONTH_NAMES[lunarMonth - 1],
      dayName: formatLunarDay(lunarDay),
      zodiac: ZODIAC_ANIMALS[(lunarYear - 1900) % 12]
    },
    stemBranch: {
      year: stemBranchInfo.year,
      month: stemBranchInfo.month,
      day: stemBranchInfo.day,
      time: null
    },
    timePeriod: null,
    festivals: { solar: '', lunar: '' },
    solarTerms: ''
  };
};

// ===== EXAMPLE USAGE =====

// Test solar to lunar conversion with time
const testDateTime1 = new Date('1980-03-21T23:30:35');
const result1 = solarToLunar(testDateTime1);

console.log('=== Functional Solar to Lunar Conversion (with Time) ===');
console.log(`Solar Date: ${testDateTime1.toLocaleString()}`);
console.log(`Lunar Date: ${result1.lunar.year}-${result1.lunar.month}-${result1.lunar.day}`);
console.log(`Lunar Day Name: ${result1.lunar.dayName}`);
console.log(`Lunar Month Name: ${result1.lunar.monthName}`);
console.log(`Year Zodiac Animal: ${result1.lunar.zodiac}`);
console.log(`Time Period: ${result1.timePeriod.name} (${result1.timePeriod.period})`);
console.log(`Time Zodiac: ${result1.timePeriod.zodiac}`);
console.log(`Time Branch: ${result1.timePeriod.branch}`);
console.log(`Description: ${result1.timePeriod.description}`);

// Test different time periods using functional approach
console.log('\n=== Time Period Examples (Functional) ===');
const testTimes = [
  new Date('2023-12-25T00:30:00'), // 子时 (Rat)
  new Date('2023-12-25T02:15:00'), // 丑时 (Ox)
  new Date('2023-12-25T06:45:00'), // 卯时 (Rabbit)
  new Date('2023-12-25T12:00:00'), // 午时 (Horse)
  new Date('2023-12-25T18:30:00'), // 酉时 (Rooster)
  new Date('2023-12-25T23:45:00')  // 子时 (Rat - next day)
];

// Using functional approach with map
testTimes
  .map(time => ({ time, result: solarToLunar(time) }))
  .forEach(({ time, result }) => {
    console.log(`${time.toLocaleTimeString()}: ${result.timePeriod.name} - ${result.timePeriod.zodiac} (${result.timePeriod.period})`);
  });

// Test lunar to solar conversion
const testDate2 = new Date(2012, 3, 7);
const result2 = lunarToSolar(testDate2, false);

console.log('\n=== Functional Lunar to Solar Conversion ===');
console.log(`Lunar Date: ${testDate2.getFullYear()}-${testDate2.getMonth()+1}-${testDate2.getDate()}`);
console.log(`Solar Date: ${result2.solar.year}-${result2.solar.month}-${result2.solar.day}`);
console.log(`Week Day: ${result2.solar.weekDay}`);

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    solarToLunar,
    lunarToSolar,
    getTimePeriod,
    calculateLunarFromSolar,
    calculateSolarFromLunar
  };
} else if (typeof window !== 'undefined') {
  window.LunarCalendarFunctional = {
    solarToLunar,
    lunarToSolar,
    getTimePeriod,
    calculateLunarFromSolar,
    calculateSolarFromLunar
  };
}