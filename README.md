# YALC - Yet Another Lunar Calendar

[![CI](https://github.com/mirageglobe/yalc/actions/workflows/ci.yml/badge.svg)](https://github.com/mirageglobe/yalc/actions/workflows/ci.yml)

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
- ✅ **Festival detection** - Solar, lunar, and religious festivals
- ✅ **Date range:** 1900-2100

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

// Check for festivals
console.log(result.festivals);
// Output: { solar: null, lunar: {...}, sanniangSha: false }

// Convert lunar date to solar (with leap month flag)
const solar = lunarToSolar(new Date(2012, 3, 7), false);
console.log(solar.solar);
// Output: { year: 2012, month: 4, day: 27, ... }
```

---

## Festival Data

The library returns festival information in the `festivals` object:

```javascript
{
  solar: { name: '元旦', isHoliday: true, english: "New Year's Day" },
  lunar: { name: '春节', isHoliday: true, english: 'Spring Festival', extra: '...' },
  sanniangSha: false  // Wedding inauspicious day warning
}
```

### Included Festivals

| Category | Count | Examples |
|----------|-------|----------|
| **Solar Festivals** | 13 | 元旦, 情人节, 劳动节, 国庆节, 圣诞节 |
| **Major Lunar Festivals** | 8 | 春节, 元宵节, 端午节, 七夕, 中秋节, 重阳节, 腊八节, 除夕 |
| **Buddhist Dates** | 6 | 释迦牟尼佛诞, 观世音菩萨圣旦/成道/出家日, 地藏王菩萨诞 |
| **Taoist Dates** | 6 | 玉皇大帝诞, 太上老君圣旦, 关公圣旦, 妈祖圣旦, 值年太岁 |
| **Folk Traditions** | 8+ | 龙抬头, 头牙/尾牙, 送神/迎神日, 寒衣节, 下元节 |
| **三娘煞日** | 6/month | Days 3, 7, 13, 18, 22, 27 (wedding warnings) |
| **24 Solar Terms** | 24 | 立春→冬至 (data defined) |

---

## Testing

```bash
# Run tests (22 tests including Mid-Autumn Festival drift tests)
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

~~⚠️ **2026 Conversion Bug**: There is a known bug where January 1, 2026 converts incorrectly. Expected: Lunar 2025-11-13, but returns Lunar 2025-6-16. Investigation ongoing.~~ **FIXED** ✅

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
├── .github/
│   ├── dependabot.yml           # Automated dependency updates
│   ├── PULL_REQUEST_TEMPLATE.md # PR checklist
│   ├── ISSUE_TEMPLATE/          # Bug/feature templates
│   └── workflows/
│       └── ci.yml               # Tests + Lint + Coverage
├── yalc.js                      # Main library (functional edition)
├── test.js                      # AVA test suite (22 tests)
├── run.js                       # Test runner with examples
├── .eslintrc.json               # ESLint configuration
└── package.json                 # Dependencies
```

---

## Contributing

Contributions are welcome! The project uses automated CI checks:

- **Tests**: Run on Node.js 18, 20, 22
- **ESLint**: Code style checking
- **CodeQL**: Security vulnerability scanning
- **Dependabot**: Automated dependency updates

Before submitting a PR:
```bash
npm test              # Run tests
npx eslint yalc.js    # Check code style
```

---

## How It Works

### Lunar Information Encoding

Each lunar year (1900-2100) is encoded as a 20-bit hexadecimal value in the `LUNAR_INFO` array:

```
Bit Position:  20  19-8 (12 bits)  7-5   4-1
               ─   ───────────────  ───   ───
               L   M1 M2 ... M12    ---   Leap Month
               │   │                      │
               │   └─ Month sizes ────────│── 1=30 days, 0=29 days
               │      (Jan to Dec)        │
               └─ Leap month size         └── 0=none, 1-12=which month

Example: 0x095b0 for year 1980 (庚申年 - Year of the Monkey)

  Hex:    0x095b0
  Binary: 0000 1001 0101 1011 0000
                              └─── Bits 1-4: 0000 = No leap month
          └─── Bit 17: 0 = N/A (no leap month this year)

  Month sizes (bits 5-16): 30,29,29,30,29,30,29,30,30,29,30,30 days
```

---

## References

- [lunar-javascript](https://github.com/6tail/lunar-javascript) - Reference implementation
- [Programming Hunter Article](https://www.programminghunter.com/article/85501142176/) - Algorithm explanation
- [晶晶的博客](https://blog.jjonline.cn/userInterFace/173.html) - Extended lunar data source (1900-2100)

---

## License

Apache License 2.0 - See [LICENSE](LICENSE) file for details
