/**
 * YALC - Yet Another Lunar Calendar Converter
 * 
 * @author Jimmy Lim (mirageglobe@gmail.com)
 * @version 2.0.0 - Functional Edition
 */

// ===== CONSTANTS =====

/**
 * Lunar calendar information for years 1900-2100
 * 
 * Each hexadecimal value is a 20-bit encoding of lunar year information.
 * The bit structure (from MSB to LSB) is:
 * 
 *   Bit Position:  20  19 18 17 16 15 14 13 12 11 10  9  8  7  6  5   4  3  2  1
 *                  ──  ─────────────────────────────────────────────  ──────────
 *   Represents:    L   M1 M2 M3 M4 M5 M6 M7 M8 M9 M10 M11 M12          Leap Month
 *                  │   │                                    │          │
 *                  │   └── Month sizes (1=30 days, 0=29)────┘          │
 *                  │       M1=Jan, M2=Feb, ... M12=Dec                 │
 *                  │                                                   │
 *                  └── Leap month size (1=30 days, 0=29 days)          │
 *                                                                      │
 *                      Leap month number (0=none, 1-12=which month) ───┘
 * 
 * Example: 0x095b0 for year 1980 (庚申年 - Year of the Monkey)
 * 
 *   Hex:    0x095b0
 *   Binary: 0000 1001 0101 1011 0000 (20 bits)
 *           │    │              │
 *           │    │              └── Bits 1-4: 0000 = No leap month
 *           │    │
 *           │    └── Bits 5-16 (month sizes, M12 to M1):
 *           │        1 0 0 1  0 1 0 1  1 0 1 1
 *           │        │ │ │ │  │ │ │ │  │ │ │ │
 *           │        │ │ │ │  │ │ │ │  │ │ │ └── M1  (Jan): 1 = 30 days
 *           │        │ │ │ │  │ │ │ │  │ │ └──── M2  (Feb): 1 = 30 days
 *           │        │ │ │ │  │ │ │ │  │ └────── M3  (Mar): 0 = 29 days
 *           │        │ │ │ │  │ │ │ │  └──────── M4  (Apr): 1 = 30 days
 *           │        │ │ │ │  │ │ │ └────────── M5  (May): 1 = 30 days
 *           │        │ │ │ │  │ │ └──────────── M6  (Jun): 0 = 29 days
 *           │        │ │ │ │  │ └────────────── M7  (Jul): 1 = 30 days
 *           │        │ │ │ │  └──────────────── M8  (Aug): 0 = 29 days
 *           │        │ │ │ └──────────────────── M9  (Sep): 1 = 30 days
 *           │        │ │ └────────────────────── M10 (Oct): 0 = 29 days
 *           │        │ └──────────────────────── M11 (Nov): 0 = 29 days
 *           │        └────────────────────────── M12 (Dec): 1 = 30 days
 *           │
 *           └── Bit 17: 0 = N/A (no leap month)
 * 
 * Example with leap month: 0x16554 for year 1906 (丙午年)
 * 
 *   Hex:    0x16554
 *   Binary: 0001 0110 0101 0101 0100 (20 bits)
 *                                 └── Bits 1-4: 0100 = 4 (leap month is 4th month)
 *           └── Bit 17: 1 = Leap month has 30 days
 */
const LUNAR_INFO = [
  // 1900-1909
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  // 1910-1919
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  // 1920-1929
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  // 1930-1939
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  // 1940-1949
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  // 1950-1959
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
  // 1960-1969
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  // 1970-1979
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
  // 1980-1989
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  // 1990-1999
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
  // 2000-2009
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  // 2010-2019
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  // 2020-2029
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  // 2030-2039
  0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
  // 2040-2049
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  // 2050-2059
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
  // 2060-2069
  0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
  // 2070-2079
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
  // 2080-2089
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d260,
  // 2090-2099
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a4d0, 0x0d150, 0x0f252,
  // 2100
  0x0d520
];

// Heavenly Stems (天干) - Used in stem-branch calendar system
const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// Earthly Branches (地支) - Used in stem-branch calendar and time periods
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// Chinese Zodiac Animals - 12-year cycle
const ZODIAC_ANIMALS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

// Chinese numerals for days and dates
const DAY_NAMES = ['日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const DAY_PREFIXES = ['初', '十', '廿', '卅']; // First, Ten, Twenty, Thirty

// Traditional Chinese month names
const MONTH_NAMES = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '腊'];

/**
 * Traditional Chinese Time Periods (时辰)
 * 
 * Ancient Chinese divided the day into 12 periods of 2 hours each,
 * corresponding to the 12 Earthly Branches and zodiac animals.
 * Note: 子时 (23:00-01:00) spans midnight and belongs to the next day
 */
const TIME_PERIODS = [
  { name: '子时', zodiac: '鼠', startHour: 23, endHour: 1, dayOffset: 1, branch: '子' },  // Rat: 11pm-1am
  { name: '丑时', zodiac: '牛', startHour: 1, endHour: 3, dayOffset: 0, branch: '丑' },   // Ox: 1am-3am
  { name: '寅时', zodiac: '虎', startHour: 3, endHour: 5, dayOffset: 0, branch: '寅' },   // Tiger: 3am-5am
  { name: '卯时', zodiac: '兔', startHour: 5, endHour: 7, dayOffset: 0, branch: '卯' },   // Rabbit: 5am-7am
  { name: '辰时', zodiac: '龙', startHour: 7, endHour: 9, dayOffset: 0, branch: '辰' },   // Dragon: 7am-9am
  { name: '巳时', zodiac: '蛇', startHour: 9, endHour: 11, dayOffset: 0, branch: '巳' },  // Snake: 9am-11am
  { name: '午时', zodiac: '马', startHour: 11, endHour: 13, dayOffset: 0, branch: '午' }, // Horse: 11am-1pm
  { name: '未时', zodiac: '羊', startHour: 13, endHour: 15, dayOffset: 0, branch: '未' }, // Goat: 1pm-3pm
  { name: '申时', zodiac: '猴', startHour: 15, endHour: 17, dayOffset: 0, branch: '申' }, // Monkey: 3pm-5pm
  { name: '酉时', zodiac: '鸡', startHour: 17, endHour: 19, dayOffset: 0, branch: '酉' }, // Rooster: 5pm-7pm
  { name: '戌时', zodiac: '狗', startHour: 19, endHour: 21, dayOffset: 0, branch: '戌' }, // Dog: 7pm-9pm
  { name: '亥时', zodiac: '猪', startHour: 21, endHour: 23, dayOffset: 0, branch: '亥' }  // Pig: 9pm-11pm
];

const TIME_DESCRIPTIONS = {
  '子时': '夜半，又名子夜、中夜',
  '丑时': '鸡鸣，又名荒鸡',
  '寅时': '平旦，又称黎明、早晨、日旦',
  '卯时': '卯时，又名日始、破晓、旭日',
  '辰时': '食时，又名早食',
  '巳时': '隅中，又名日禺',
  '午时': '日中，又名日正、中午',
  '未时': '日昳，又名日跌、日央',
  '申时': '晡时，又名日铺、夕食',
  '酉时': '日入，又名日落、日沉、傍晚',
  '戌时': '黄昏，又名日夕、日暮、日晚',
  '亥时': '人定，又名定昏'
};

// ===== FESTIVAL DATA =====

/**
 * Solar (Gregorian) Festivals
 * Format: 'MMDD*Name' where * indicates a public holiday
 */
const SOLAR_FESTIVALS = {
  '0101': { name: '元旦', isHoliday: true, english: "New Year's Day" },
  '0214': { name: '情人节', isHoliday: false, english: "Valentine's Day" },
  '0308': { name: '妇女节', isHoliday: false, english: "Women's Day" },
  '0312': { name: '植树节', isHoliday: false, english: 'Arbor Day' },
  '0401': { name: '愚人节', isHoliday: false, english: "April Fool's Day" },
  '0422': { name: '地球日', isHoliday: false, english: 'Earth Day' },
  '0501': { name: '劳动节', isHoliday: true, english: 'Labor Day' },
  '0504': { name: '青年节', isHoliday: false, english: 'Youth Day' },
  '0601': { name: '儿童节', isHoliday: false, english: "Children's Day" },
  '0910': { name: '教师节', isHoliday: false, english: "Teachers' Day" },
  '1001': { name: '国庆节', isHoliday: true, english: 'National Day' },
  '1224': { name: '平安夜', isHoliday: false, english: 'Christmas Eve' },
  '1225': { name: '圣诞节', isHoliday: false, english: 'Christmas Day' }
};

/**
 * Lunar (Chinese) Festivals
 * Format: 'MMDD' where MM is lunar month, DD is lunar day
 * Special: '0100' means last day of 12th month (New Year's Eve)
 * 
 * Includes major festivals and traditional religious/cultural dates:
 * - Buddhist dates (释迦牟尼, 观世音菩萨, 地藏王)
 * - Taoist dates (元始天尊, 太上老君, 玉皇大帝, 关公, 妈祖)
 * - Folk traditions (三娘煞, 头牙/尾牙)
 * 
 * Dates verified against: nationsonline.org, kenyon.edu, wikipedia.org
 */
const LUNAR_FESTIVALS = {
  // First month (正月)
  '0101': { name: '春节', isHoliday: true, english: 'Spring Festival', extra: '元始天尊圣旦 四始吉日' },
  '0104': { name: '迎神日', isHoliday: false, english: 'Welcoming Gods Day' },
  '0105': { name: '接财神', isHoliday: false, english: 'Welcoming God of Wealth' },
  '0109': { name: '玉皇大帝诞', isHoliday: false, english: 'Jade Emperor Birthday' },
  '0115': { name: '元宵节', isHoliday: false, english: 'Lantern Festival', extra: '上元节' },
  // Second month
  '0202': { name: '龙抬头', isHoliday: false, english: 'Dragon Raises Head', extra: '福德正神圣旦' },
  '0203': { name: '文昌圣旦', isHoliday: false, english: 'Wenchang Birthday' },
  '0215': { name: '释迦牟尼涅槃', isHoliday: false, english: 'Buddha Nirvana Day', extra: '太上老君圣旦' },
  '0216': { name: '头牙', isHoliday: false, english: 'First Ya Festival', extra: '祭拜地主日' },
  '0219': { name: '观世音菩萨圣旦', isHoliday: false, english: 'Guanyin Birthday' },
  // Third month
  '0303': { name: '上巳节', isHoliday: false, english: 'Shangsi Festival', extra: '玄天上帝诞' },
  '0323': { name: '妈祖圣旦', isHoliday: false, english: 'Mazu Birthday' },
  // Fourth month
  '0401': { name: '四始吉日', isHoliday: false, english: 'Auspicious Day' },
  '0408': { name: '释迦牟尼佛诞', isHoliday: false, english: 'Buddha Birthday', extra: '浴佛节' },
  // Fifth month
  '0505': { name: '端午节', isHoliday: true, english: 'Dragon Boat Festival' },
  '0513': { name: '关公磨刀日', isHoliday: false, english: 'Guan Yu Sword Day' },
  // Sixth month
  '0619': { name: '观世音菩萨成道日', isHoliday: false, english: 'Guanyin Enlightenment' },
  '0624': { name: '关公圣旦', isHoliday: false, english: 'Guan Yu Birthday' },
  // Seventh month
  '0701': { name: '四始吉日', isHoliday: false, english: 'Auspicious Day' },
  '0707': { name: '七夕', isHoliday: false, english: 'Qixi Festival', extra: 'Chinese Valentine\'s Day' },
  '0715': { name: '中元节', isHoliday: false, english: 'Ghost Festival', extra: '盂兰盆节' },
  '0719': { name: '值年太岁圣旦', isHoliday: false, english: 'Tai Sui Birthday' },
  '0730': { name: '地藏王菩萨诞', isHoliday: false, english: 'Dizang Bodhisattva Birthday' },
  // Eighth month
  '0815': { name: '中秋节', isHoliday: true, english: 'Mid-Autumn Festival' },
  // Ninth month
  '0909': { name: '重阳节', isHoliday: false, english: 'Double Ninth Festival' },
  '0919': { name: '观世音菩萨出家日', isHoliday: false, english: 'Guanyin Renunciation Day' },
  // Tenth month
  '1001': { name: '寒衣节', isHoliday: false, english: 'Cold Clothes Festival', extra: '祭祖节' },
  '1015': { name: '下元节', isHoliday: false, english: 'Lower Yuan Festival', extra: '水官大帝诞' },
  // Eleventh month
  '1119': { name: '观世音菩萨诞', isHoliday: false, english: 'Guanyin Day', extra: '南海观音入海日' },
  // Twelfth month (腊月)
  '1208': { name: '腊八节', isHoliday: false, english: 'Laba Festival' },
  '1216': { name: '尾牙', isHoliday: false, english: 'Last Ya Festival', extra: '谢地主日' },
  '1223': { name: '小年', isHoliday: false, english: 'Little New Year' },
  '1224': { name: '送神日', isHoliday: false, english: 'Sending Gods Day' },
  '1225': { name: '天官巡人间', isHoliday: false, english: 'Heaven Official Inspection' },
  // Special: Last day of year (varies 29 or 30)
  '0100': { name: '除夕', isHoliday: true, english: "New Year's Eve" }
};

/**
 * 三娘煞日 (Sanniang Sha Days) - Inauspicious days for weddings
 * Days: 3, 7, 13, 18, 22, 27 of each lunar month
 */
const SANNIANG_SHA_DAYS = [3, 7, 13, 18, 22, 27];

/**
 * 24 Solar Terms (二十四节气)
 * Traditional Chinese calendar divisions based on sun's position
 * Two per month, roughly 15 days apart
 */
const SOLAR_TERMS = [
  { name: '小寒', english: 'Minor Cold', month: 1 },
  { name: '大寒', english: 'Major Cold', month: 1 },
  { name: '立春', english: 'Start of Spring', month: 2 },
  { name: '雨水', english: 'Rain Water', month: 2 },
  { name: '惊蛰', english: 'Awakening of Insects', month: 3 },
  { name: '春分', english: 'Spring Equinox', month: 3 },
  { name: '清明', english: 'Clear and Bright', month: 4 },
  { name: '谷雨', english: 'Grain Rain', month: 4 },
  { name: '立夏', english: 'Start of Summer', month: 5 },
  { name: '小满', english: 'Grain Buds', month: 5 },
  { name: '芒种', english: 'Grain in Ear', month: 6 },
  { name: '夏至', english: 'Summer Solstice', month: 6 },
  { name: '小暑', english: 'Minor Heat', month: 7 },
  { name: '大暑', english: 'Major Heat', month: 7 },
  { name: '立秋', english: 'Start of Autumn', month: 8 },
  { name: '处暑', english: 'End of Heat', month: 8 },
  { name: '白露', english: 'White Dew', month: 9 },
  { name: '秋分', english: 'Autumn Equinox', month: 9 },
  { name: '寒露', english: 'Cold Dew', month: 10 },
  { name: '霜降', english: 'Frost Descent', month: 10 },
  { name: '立冬', english: 'Start of Winter', month: 11 },
  { name: '小雪', english: 'Minor Snow', month: 11 },
  { name: '大雪', english: 'Major Snow', month: 12 },
  { name: '冬至', english: 'Winter Solstice', month: 12 }
];

// Base date for lunar calendar calculations (Jan 31, 1900)
const BASE_DATE = new Date(1900, 0, 31);

// Constant for date calculations (24 * 60 * 60 * 1000)
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
 * 
 * The calculation:
 * 1. Start with base of 348 days (12 months × 29 days)
 * 2. Add 1 day for each "big month" (30 days) by checking bits
 * 3. Add days from leap month if present
 * 
 * @param {number} year - Lunar year (1900-2049)
 * @returns {number} Total days in the lunar year (353-385)
 */
const calculateLunarYearDays = year => {
  const yearInfo = getLunarYearInfo(year);
  let totalDays = 348; // Base: 12 months × 29 days

  // Check each bit (0x8000 to 0x10) to determine 30-day months
  // Bit set to 1 = 30 days (big month), 0 = 29 days (small month)
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
 * 
 * In traditional Chinese timekeeping, 子时 (23:00-01:00) is considered
 * the beginning of the next day. This function adjusts the date accordingly.
 * 
 * @param {Date} date - The date to adjust
 * @returns {Date} Adjusted date (next day if hour is 23, same day otherwise)
 */
const adjustForTimeZodiac = date => {
  const hour = date.getHours();

  // If it's 11pm (23:00), it's considered the next day in lunar calendar
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
 * Convert solar (Gregorian) date to lunar date information
 * 
 * Algorithm:
 * 1. Calculate days from base date (Jan 31, 1900)
 * 2. Subtract year by year to find lunar year
 * 3. Subtract month by month (handling leap months) to find lunar month
 * 4. Remaining days = lunar day
 * 
 * @param {Date} solarDate - Gregorian date to convert
 * @returns {Object} Lunar date info: { year, month, day, isLeap }
 */
const calculateLunarFromSolar = solarDate => {
  // Calculate total days from base date (1900/1/31)
  const dayOffset = Math.round((solarDate.valueOf() - BASE_DATE.valueOf()) / MILLISECONDS_PER_DAY);
  let remainingDays = dayOffset;
  let year = 1900;

  // Find the lunar year by subtracting year lengths
  while (year < 2101 && remainingDays > 0) {
    const yearDays = calculateLunarYearDays(year);
    if (remainingDays < yearDays) break;
    remainingDays -= yearDays;
    year++;
  }

  if (remainingDays < 0) {
    year--;
    remainingDays += calculateLunarYearDays(year);
  }

  // Find the lunar month and day by subtracting month lengths
  const leapMonth = getLeapMonth(year);
  let month;
  let isLeapMonth = false;

  for (month = 1; month <= 12; month++) {
    // Regular month days
    const monthDays = calculateMonthDays(year, month);
    if (remainingDays < monthDays) {
      isLeapMonth = false;
      break;
    }
    remainingDays -= monthDays;

    // Leap month days (if applicable)
    if (month === leapMonth) {
      const leapDays = calculateLeapMonthDays(year);
      if (remainingDays < leapDays) {
        isLeapMonth = true;
        break;
      }
      remainingDays -= leapDays;
    }
  }

  return {
    year,
    month,
    day: remainingDays + 1,
    isLeap: isLeapMonth
  };
};

/**
 * Convert lunar date to solar (Gregorian) date information
 * 
 * Algorithm (reverse of lunar to solar):
 * 1. Add up all days from 1900 to target lunar year
 * 2. Add days for complete months in target year
 * 3. Add days in target month
 * 4. Add to base date to get Gregorian date
 * 
 * @param {number} lunarYear - Lunar year
 * @param {number} lunarMonth - Lunar month (1-12)
 * @param {number} lunarDay - Lunar day (1-30)
 * @param {boolean} isLeapMonth - Whether this is a leap month
 * @returns {Object} Solar date info: { year, month, day }
 */
const calculateSolarFromLunar = (lunarYear, lunarMonth, lunarDay, isLeapMonth = false) => {
  let totalDays = 0;

  // Sum all days from 1900 to target year (exclusive)
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
 * Calculate stem-branch (干支) information for a date
 * 
 * The stem-branch system is a 60-year/60-day cycle combining:
 * - 10 Heavenly Stems (天干)
 * - 12 Earthly Branches (地支)
 * Used for years, months, days, and hours in traditional Chinese calendar
 * 
 * @param {number} year - Gregorian year
 * @param {number} month - Gregorian month (0-11)
 * @param {number} day - Gregorian day
 * @returns {Object} Stem-branch for year, month, and day
 */
const calculateStemBranch = (year, month, day) => {
  // Year stem-branch: 1900 = 36th in 60-year cycle (庚子年)
  const yearStemBranch = getStemBranch(year - 1900 + 36);

  // Month stem-branch: based on year and month
  const monthStemBranch = getStemBranch((year - 1900) * 12 + month + 12);

  // Day stem-branch: 1900/1/1 = 10th in 60-day cycle (甲戌日)
  // Days between 1970/1/1 and 1900/1/1 = 25567 days
  const dayOffset = Math.floor(Date.UTC(year, month, day) / MILLISECONDS_PER_DAY) + 25567 + 10;
  const dayStemBranch = getStemBranch(dayOffset + day - 1);

  return {
    year: yearStemBranch,
    month: monthStemBranch,
    day: dayStemBranch
  };
};

// ===== FESTIVAL LOOKUP FUNCTIONS =====

/**
 * Get solar (Gregorian) festival for a given date
 * @param {number} month - Month (1-12)
 * @param {number} day - Day (1-31)
 * @returns {Object|null} Festival info or null
 */
const getSolarFestival = (month, day) => {
  const key = String(month).padStart(2, '0') + String(day).padStart(2, '0');
  return SOLAR_FESTIVALS[key] || null;
};

/**
 * Get lunar festival for a given lunar date
 * @param {number} month - Lunar month (1-12)
 * @param {number} day - Lunar day (1-30)
 * @param {number} year - Lunar year (for New Year's Eve calculation)
 * @returns {Object|null} Festival info or null
 */
const getLunarFestival = (month, day, year) => {
  const key = String(month).padStart(2, '0') + String(day).padStart(2, '0');

  // Check for New Year's Eve (last day of 12th month)
  if (month === 12) {
    const lastDay = calculateMonthDays(year, 12);
    if (day === lastDay) {
      return LUNAR_FESTIVALS['0100']; // 除夕
    }
  }

  return LUNAR_FESTIVALS[key] || null;
};

/**
 * Check if a lunar day is a 三娘煞日 (Sanniang Sha Day)
 * These are inauspicious days for weddings: 3, 7, 13, 18, 22, 27
 * @param {number} day - Lunar day
 * @returns {boolean} True if it's a Sanniang Sha day
 */
const isSanniangShaDay = day => SANNIANG_SHA_DAYS.includes(day);

// ===== MAIN API FUNCTIONS =====

/**
 * Convert Gregorian (solar) date to comprehensive lunar calendar information
 * 
 * Main API function that returns complete lunar calendar data including:
 * - Solar date info (year, month, day, time)
 * - Lunar date info (year, month, day, zodiac)
 * - Stem-branch (干支) for year, month, day, hour
 * - Time period (时辰) information
 * - Festivals (solar and lunar)
 * 
 * @param {Date} solarDate - Gregorian date (with optional time)
 * @returns {Object} Comprehensive lunar calendar information
 * @throws {Error} If invalid date provided
 */
const solarToLunar = solarDate => {
  if (!isValidDate(solarDate)) {
    throw new Error('Invalid date provided');
  }

  // Adjust date if time is 23:00 (belongs to next day in lunar calendar)
  const adjustedDate = adjustForTimeZodiac(solarDate);
  const normalizedDate = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), adjustedDate.getDate());

  // Calculate lunar information
  const lunarInfo = calculateLunarFromSolar(normalizedDate);

  // Get time period if time is available
  const timePeriod = solarDate.getHours !== undefined ? getTimePeriod(solarDate) : null;

  // Calculate stem-branch information
  const stemBranchInfo = calculateStemBranch(normalizedDate.getFullYear(), normalizedDate.getMonth(), normalizedDate.getDate());

  // Get festival information
  const solarFestival = getSolarFestival(normalizedDate.getMonth() + 1, normalizedDate.getDate());
  const lunarFestival = getLunarFestival(lunarInfo.month, lunarInfo.day, lunarInfo.year);
  const sanniangSha = isSanniangShaDay(lunarInfo.day);

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
    festivals: {
      solar: solarFestival,
      lunar: lunarFestival,
      sanniangSha
    },
    solarTerms: ''
  };
};

/**
 * Convert lunar date to Gregorian (solar) calendar information
 * 
 * Reverse conversion from lunar to solar date.
 * Important: If the lunar month is a leap month, set isLeapMonth to true
 * 
 * Example:
 * - lunar2solar(new Date(2012, 3, 7), false) → 2012-04-27 (regular 4th month)
 * - lunar2solar(new Date(2012, 3, 7), true)  → 2012-05-27 (leap 4th month)
 * 
 * @param {Date} lunarDate - Lunar date (year, month, day)
 * @param {boolean} isLeapMonth - Whether this is a leap month
 * @returns {Object} Comprehensive solar calendar information
 * @throws {Error} If invalid date provided
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

  // Get festival information
  const solarFestival = getSolarFestival(solarInfo.month + 1, solarInfo.day);
  const lunarFestival = getLunarFestival(lunarMonth, lunarDay, lunarYear);
  const sanniangSha = isSanniangShaDay(lunarDay);

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
    festivals: {
      solar: solarFestival,
      lunar: lunarFestival,
      sanniangSha
    },
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
console.log(`Lunar Date: ${testDate2.getFullYear()}-${testDate2.getMonth() + 1}-${testDate2.getDate()}`);
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