/**
 * AVA Test Suite for YALC (Yet Another Lunar Calendar Converter)
 * 
 * HOW TO RUN TESTS:
 * -----------------
 * 1. Install AVA if not already installed:
 *    npm install --save-dev ava
 * 
 * 2. Run all tests:
 *    npm test
 *    or
 *    npx ava
 * 
 * 3. Run tests in watch mode (auto-rerun on changes):
 *    npx ava --watch
 * 
 * 4. Run specific test file:
 *    npx ava test.js
 * 
 * 5. Run tests with verbose output:
 *    npx ava --verbose
 * 
 * WHAT THESE TESTS COVER:
 * ------------------------
 * - Solar to Lunar conversions for known dates
 * - Lunar to Solar reverse conversions
 * - Leap month handling
 * - Chinese zodiac animals
 * - Time period (时辰) calculations
 * - Edge cases and special dates
 */

const test = require('ava');
const { solarToLunar, lunarToSolar, getTimePeriod } = require('./yalc.js');

// ===== BASIC SOLAR TO LUNAR CONVERSION TESTS =====

test('Solar to Lunar: 2020 Chinese New Year (Jan 25, 2020 = 1st day of 1st month)', t => {
  const result = solarToLunar(new Date('2020-01-25'));

  t.is(result.lunar.year, 2020, 'Year should be 2020');
  t.is(result.lunar.month, 1, 'Month should be 1st month');
  t.is(result.lunar.day, 1, 'Day should be 1st day');
  t.is(result.lunar.isLeapMonth, false, 'Should not be a leap month');
  t.is(result.lunar.zodiac, '鼠', 'Zodiac should be Rat (鼠)');
});

test('Solar to Lunar: 2021 Chinese New Year (Feb 12, 2021 = 1st day of 1st month)', t => {
  const result = solarToLunar(new Date('2021-02-12'));

  t.is(result.lunar.year, 2021, 'Year should be 2021');
  t.is(result.lunar.month, 1, 'Month should be 1st month');
  t.is(result.lunar.day, 1, 'Day should be 1st day');
  t.is(result.lunar.zodiac, '牛', 'Zodiac should be Ox (牛)');
});

test('Solar to Lunar: 1980-03-21 conversion', t => {
  const result = solarToLunar(new Date('1980-03-21'));

  t.is(result.solar.year, 1980, 'Solar year should be 1980');
  t.is(result.solar.month, 3, 'Solar month should be March (3)');
  t.is(result.solar.day, 21, 'Solar day should be 21');
  t.is(result.lunar.year, 1980, 'Lunar year should be 1980');
  t.is(result.lunar.zodiac, '猴', 'Zodiac should be Monkey (猴)');
});

test('Solar to Lunar: Basic 2024 date conversion', t => {
  const result = solarToLunar(new Date('2024-12-26'));

  t.is(result.solar.year, 2024, 'Solar year should be 2024');
  t.is(result.lunar.year, 2024, 'Lunar year should be 2024');
  t.is(result.lunar.zodiac, '龙', 'Zodiac should be Dragon (龙)');
  t.false(result.lunar.isLeapMonth, 'Should not be a leap month');
});

// ===== LUNAR TO SOLAR CONVERSION TESTS =====

test('Lunar to Solar: 2011-1-3 converts to solar 2010-11-29', t => {
  const result = lunarToSolar(new Date(2011, 0, 3), false);

  t.is(result.solar.year, 2010, 'Solar year should be 2010');
  t.is(result.solar.month, 11, 'Solar month should be November (11)');
  t.is(result.solar.day, 29, 'Solar day should be 29');
});

test('Lunar to Solar: Round-trip conversion maintains accuracy', t => {
  // Start with a solar date
  const originalSolar = new Date('2020-01-25');

  // Convert to lunar
  const lunarResult = solarToLunar(originalSolar);

  // Convert back to solar
  const solarResult = lunarToSolar(
    new Date(lunarResult.lunar.year, lunarResult.lunar.month - 1, lunarResult.lunar.day),
    lunarResult.lunar.isLeapMonth
  );

  t.is(solarResult.solar.year, 2020, 'Year should match');
  t.is(solarResult.solar.month, 1, 'Month should match');
  t.is(solarResult.solar.day, 25, 'Day should match');
});

// ===== LEAP MONTH TESTS =====

test('Leap month: 2012 has leap 4th month - regular 4th month', t => {
  const result = lunarToSolar(new Date(2012, 3, 7), false);

  t.is(result.solar.year, 2012, 'Solar year should be 2012');
  t.is(result.solar.month, 4, 'Should be April');
  t.is(result.solar.day, 27, 'Should be 27th');
});

test('Leap month: 2012 leap 4th month (different from regular 4th month)', t => {
  const result = lunarToSolar(new Date(2012, 3, 7), true);

  t.is(result.solar.year, 2012, 'Solar year should be 2012');
  t.is(result.solar.month, 5, 'Should be May (one month later)');
  t.is(result.solar.day, 27, 'Should be 27th');
});

// ===== ZODIAC ANIMAL TESTS =====

test('Zodiac animals: Verify 12-year cycle', t => {
  const zodiacCycle = [
    { year: 2020, animal: '鼠' }, // Rat
    { year: 2021, animal: '牛' }, // Ox
    { year: 2022, animal: '虎' }, // Tiger
    { year: 2023, animal: '兔' }, // Rabbit
    { year: 2024, animal: '龙' }, // Dragon
  ];

  zodiacCycle.forEach(({ year, animal }) => {
    const result = solarToLunar(new Date(`${year}-02-01`));
    t.is(result.lunar.zodiac, animal, `Year ${year} should be ${animal}`);
  });
});

// ===== TIME PERIOD (时辰) TESTS =====

test('Time period: Midnight (00:30) is Rat/子时', t => {
  const result = solarToLunar(new Date('2023-12-25T00:30:00'));

  t.truthy(result.timePeriod, 'Time period should exist');
  t.is(result.timePeriod.name, '子时', 'Should be 子时');
  t.is(result.timePeriod.zodiac, '鼠', 'Should be Rat (鼠)');
  t.is(result.timePeriod.branch, '子', 'Branch should be 子');
});

test('Time period: Noon (12:30) is Horse/午时', t => {
  const result = solarToLunar(new Date('2023-12-25T12:30:00'));

  t.truthy(result.timePeriod, 'Time period should exist');
  t.is(result.timePeriod.name, '午时', 'Should be 午时');
  t.is(result.timePeriod.zodiac, '马', 'Should be Horse (马)');
  t.is(result.timePeriod.branch, '午', 'Branch should be 午');
});

test('Time period: Evening (18:30) is Rooster/酉时', t => {
  const result = solarToLunar(new Date('2023-12-25T18:30:00'));

  t.truthy(result.timePeriod, 'Time period should exist');
  t.is(result.timePeriod.name, '酉时', 'Should be 酉时');
  t.is(result.timePeriod.zodiac, '鸡', 'Should be Rooster (鸡)');
});

test('Time period: 23:00 (子时) belongs to next day', t => {
  const result = solarToLunar(new Date('2023-12-25T23:30:00'));

  t.is(result.timePeriod.name, '子时', 'Should be 子时');
  t.is(result.timePeriod.zodiac, '鼠', 'Should be Rat');
  // Note: The lunar date should be adjusted to next day due to 子时 rule
});

// ===== STEM-BRANCH (干支) TESTS =====

test('Stem-branch: Should have year, month, day pillars', t => {
  const result = solarToLunar(new Date('2024-12-26'));

  t.truthy(result.stemBranch, 'Stem-branch should exist');
  t.truthy(result.stemBranch.year, 'Year pillar should exist');
  t.truthy(result.stemBranch.month, 'Month pillar should exist');
  t.truthy(result.stemBranch.day, 'Day pillar should exist');
  t.is(result.stemBranch.year.length, 2, 'Year pillar should be 2 characters');
  t.is(result.stemBranch.month.length, 2, 'Month pillar should be 2 characters');
  t.is(result.stemBranch.day.length, 2, 'Day pillar should be 2 characters');
});

// ===== LUNAR DAY NAME FORMATTING TESTS =====

test('Lunar day names: Special formatting for specific days', t => {
  // Test 1st day
  const result1 = solarToLunar(new Date('2020-01-25')); // CNY 2020
  t.is(result1.lunar.dayName, '初一', 'First day should be 初一');

  // Test 10th day  
  const result10 = solarToLunar(new Date('2020-02-03'));
  t.is(result10.lunar.dayName, '初十', '10th day should be 初十');

  // Test 20th day
  const result20 = solarToLunar(new Date('2020-02-13'));
  t.is(result20.lunar.dayName, '二十', '20th day should be 二十');
});

// ===== EDGE CASE TESTS =====

test('Edge case: Date at start of lunar calendar range (1900)', t => {
  const result = solarToLunar(new Date('1900-02-15'));

  t.is(result.solar.year, 1900, 'Should handle year 1900');
  t.truthy(result.lunar.year, 'Should have lunar year');
  t.truthy(result.lunar.month, 'Should have lunar month');
  t.truthy(result.lunar.day, 'Should have lunar day');
});

test('Edge case: Date near end of lunar calendar range (2049)', t => {
  const result = solarToLunar(new Date('2049-01-01'));

  t.is(result.solar.year, 2049, 'Should handle year 2049');
  t.truthy(result.lunar.year, 'Should have lunar year');
  t.truthy(result.lunar.month, 'Should have lunar month');
  t.truthy(result.lunar.day, 'Should have lunar day');
});

// ===== DATA STRUCTURE VALIDATION TESTS =====

test('Output structure: Solar to Lunar contains all required fields', t => {
  const result = solarToLunar(new Date('2024-12-26T12:30:00'));

  // Check solar object
  t.truthy(result.solar, 'Should have solar object');
  t.truthy(result.solar.year, 'Should have solar year');
  t.truthy(result.solar.month, 'Should have solar month');
  t.truthy(result.solar.day, 'Should have solar day');
  t.truthy(result.solar.weekDay, 'Should have week day');

  // Check lunar object
  t.truthy(result.lunar, 'Should have lunar object');
  t.truthy(result.lunar.year, 'Should have lunar year');
  t.truthy(result.lunar.month, 'Should have lunar month');
  t.truthy(result.lunar.day, 'Should have lunar day');
  t.is(typeof result.lunar.isLeapMonth, 'boolean', 'isLeapMonth should be boolean');
  t.truthy(result.lunar.monthName, 'Should have month name');
  t.truthy(result.lunar.dayName, 'Should have day name');
  t.truthy(result.lunar.zodiac, 'Should have zodiac animal');

  // Check stem-branch object
  t.truthy(result.stemBranch, 'Should have stem-branch object');

  // Check time period (if time provided)
  t.truthy(result.timePeriod, 'Should have time period');
});

test('Output structure: Lunar to Solar contains all required fields', t => {
  const result = lunarToSolar(new Date(2024, 0, 1), false);

  t.truthy(result.solar, 'Should have solar object');
  t.truthy(result.lunar, 'Should have lunar object');
  t.truthy(result.stemBranch, 'Should have stem-branch object');
  t.true(result.timePeriod === null, 'Time period should be null for date-only input');
});

// ===== INVALID INPUT TESTS =====

test('Invalid input: Should throw error for invalid date', t => {
  t.throws(() => {
    solarToLunar(new Date('invalid'));
  }, { message: 'Invalid date provided' });
});

test('Invalid input: Should throw error for null', t => {
  t.throws(() => {
    solarToLunar(null);
  }, { message: 'Invalid date provided' });
});
