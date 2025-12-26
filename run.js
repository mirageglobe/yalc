/**
 * Test Runner for YALC (Yet Another Lunar Calendar)
 * 
 * Uncomment any example below to test different date conversions
 */

const { solarToLunar, lunarToSolar } = require('./yalc.js');

// ===== HELPER FUNCTION TO DISPLAY RESULTS =====

function displaySolarToLunar(result) {
    console.log('\n--- Solar to Lunar Conversion ---');
    console.log(`Solar: ${result.solar.year}-${result.solar.month}-${result.solar.day}`);
    console.log(`Lunar: ${result.lunar.year}-${result.lunar.month}-${result.lunar.day}`);
    console.log(`Lunar Day Name: ${result.lunar.dayName}`);
    console.log(`Lunar Month Name: ${result.lunar.monthName}`);
    console.log(`Zodiac Animal: ${result.lunar.zodiac}`);
    console.log(`Is Leap Month: ${result.lunar.isLeapMonth}`);
    if (result.timePeriod) {
        console.log(`Time Period: ${result.timePeriod.name} (${result.timePeriod.period})`);
    }
}

function displayLunarToSolar(result) {
    console.log('\n--- Lunar to Solar Conversion ---');
    console.log(`Lunar: ${result.lunar.year}-${result.lunar.month}-${result.lunar.day}`);
    console.log(`Solar: ${result.solar.year}-${result.solar.month}-${result.solar.day}`);
    console.log(`Week Day: ${result.solar.weekDay}`);
}

// ===== TEST EXAMPLES - UNCOMMENT TO RUN =====

// Example 1: Basic solar to lunar conversion
// const result1 = solarToLunar(new Date('2021-01-01'));
// displaySolarToLunar(result1);

// Example 2: Solar to lunar with time (tests time period calculation)
// const result2 = solarToLunar(new Date('1980-03-21T23:30:35'));
// displaySolarToLunar(result2);

// Example 3: Different time periods throughout the day
// console.log('\n--- Time Period Examples ---');
// const times = [
//   new Date('2023-12-25T00:30:00'),  // Rat (子时)
//   new Date('2023-12-25T06:30:00'),  // Rabbit (卯时)
//   new Date('2023-12-25T12:30:00'),  // Horse (午时)
//   new Date('2023-12-25T18:30:00'),  // Rooster (酉时)
// ];
// times.forEach(time => {
//   const result = solarToLunar(time);
//   console.log(`${time.toLocaleTimeString()}: ${result.timePeriod.name} - ${result.timePeriod.zodiac}`);
// });

// Example 4: Lunar to solar conversion (regular month)
// const result4 = lunarToSolar(new Date(2011, 0, 3), false);
// displayLunarToSolar(result4);
// Expected: 2010-11-29

// Example 5: Lunar to solar conversion (leap month - IMPORTANT!)
// When converting a leap month, you MUST set the second parameter to true
// const result5a = lunarToSolar(new Date(2012, 3, 7), false);  // Regular 4th month
// displayLunarToSolar(result5a);
// Expected: 2012-04-27

// const result5b = lunarToSolar(new Date(2012, 3, 7), true);   // Leap 4th month
// displayLunarToSolar(result5b);
// Expected: 2012-05-27

// Example 6: Test your own date (current date)
const testDate = new Date('2024-12-26');
const result = solarToLunar(testDate);
displaySolarToLunar(result);

// Example 7: Test future date (2026) - Verification check
console.log('\n=== VERIFICATION TEST FOR 2026-01-01 ===');
const testDate2026 = new Date('2026-01-01');
const result2026 = solarToLunar(testDate2026);
displaySolarToLunar(result2026);

console.log('\n--- VERIFICATION RESULTS ---');
const expected = { year: 2025, month: 11, day: 13, isLeapMonth: false };
const actual = result2026.lunar;

const isCorrect =
    actual.year === expected.year &&
    actual.month === expected.month &&
    actual.day === expected.day &&
    actual.isLeapMonth === expected.isLeapMonth;

if (isCorrect) {
    console.log('✅ PASS: Conversion is accurate.');
    console.log(`   Lunar: ${actual.year}-${actual.month}-${actual.day} (leap: ${actual.isLeapMonth})`);
} else {
    console.log('❌ FAIL: Incorrect output detected!');
    console.log(`   Actual:   Lunar ${actual.year}-${actual.month}-${actual.day} (leap: ${actual.isLeapMonth})`);
    console.log(`   Expected: Lunar ${expected.year}-${expected.month}-${expected.day} (leap: ${expected.isLeapMonth})`);
    console.log('\n   According to online lunar calendar sources:');
    console.log('   • Jan 1, 2026 = 13th day of 11th lunar month (Year of Snake)');
    console.log('   • Chinese New Year 2026: Feb 17, 2026');
}

// Example 8: Batch test multiple dates
// const testDates = [
//   '2020-01-25',  // Chinese New Year 2020
//   '2021-02-12',  // Chinese New Year 2021
//   '2022-02-01',  // Chinese New Year 2022
//   '2023-01-22',  // Chinese New Year 2023
// ];
// 
// console.log('\n--- Chinese New Year Dates ---');
// testDates.forEach(dateStr => {
//   const result = solarToLunar(new Date(dateStr));
//   console.log(`${dateStr} => Lunar: ${result.lunar.monthName}月${result.lunar.dayName}`);
// });

console.log('\n✓ Test completed');
