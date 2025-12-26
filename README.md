# YALC - Yet Another Lunar Calendar

A JavaScript library for converting between Gregorian (solar) and Chinese lunar calendar dates.

**Maintainer:** Jimmy Lim <mirageglobe@gmail.com>

---

## Features

- ✅ **Solar to Lunar** conversion
- ✅ **Lunar to Solar** conversion (with leap month support)
- ✅ **Chinese zodiac animals** (12-year cycle)
- ✅ **Time periods** (时辰) - Traditional 12 two-hour periods
- ✅ **Stem-Branch system** (干支) - Year, month, day pillars
- ✅ **Lunar day formatting** - Chinese character representation
- ✅ **Date range:** 1900-2049

---

## Quick Start

### Installation

```bash
npm install
```

### Usage

```javascript
const { solarToLunar, lunarToSolar } = require('./yalc.js');

// Convert solar date to lunar
const result = solarToLunar(new Date('2024-12-26'));
console.log(result.lunar);
// Output: { year: 2024, month: 11, day: 26, zodiac: '龙', ... }

// Convert lunar date to solar (with leap month flag)
const solar = lunarToSolar(new Date(2012, 3, 7), false);
console.log(solar.solar);
// Output: { year: 2012, month: 4, day: 27, ... }
```

---

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npx ava --watch

# Run tests with verbose output
npx ava --verbose
```

---

## Development

```bash
# Run the main script
node yalc.js

# Run test examples
node run.js
```

---

## Known Issues

⚠️ **Time Boundary Issue**: The hour 23:00-01:00 (子时/Rat time) is considered part of the **next day** in traditional Chinese timekeeping. This is handled automatically by the library but may seem counterintuitive.

⚠️ **2026 Conversion Bug**: There is a known bug where January 1, 2026 converts incorrectly. Expected: Lunar 2025-11-13, but returns Lunar 2025-6-16. Investigation ongoing.

---

## Architecture

This project uses **functional programming** principles:

- **Pure functions** - Easier testing and debugging
- **Immutable data** - Predictable behavior
- **Function composition** - Better code reusability
- **No side effects** - Easier to reason about

---

## File Structure

```
yalc/
├── yalc.js                  # Main library (functional edition)
├── test.js                  # AVA test suite (20+ tests)
├── run.js                   # Test runner with examples
├── yalunar-legacy.js        # Original implementation
└── yalunar-legacy-refactor.js  # Refactored legacy code
```

---

## How It Works

### Lunar Information Encoding

Each lunar year (1900-2049) is encoded as a hexadecimal value in the `LUNAR_INFO` array:

```
Example: 0x095b0 for year 1980
Binary:  0000 1001 0101 1011 0000

Bits 1-4:   0000 = No leap month
Bits 5-16:  Month sizes (1=30 days, 0=29 days)
Bit 17-20:  Leap month size (if applicable)

Result: 1980 had months of 30,29,29,30,29,30,29,30,30,29,30,30 days
```

---

## References

- [lunar-javascript](https://github.com/6tail/lunar-javascript) - Reference implementation
- [Programming Hunter Article](https://www.programminghunter.com/article/85501142176/) - Algorithm explanation
- [gopherjs](https://github.com/gopherjs/gopherjs) - Go to JavaScript transpiler (reference)

---

## License

MIT License - See LICENSE file for details
