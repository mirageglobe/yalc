# yet another lunar calendar

maintainer: jimmy lim <mirageglobe@gmail.com>

yet another lunar calendar conversion is a lunar to solar conversion in javascript

## to use

```bash
# run with node
node yalc.js

# test with ava
npx ava

# ava test with watch (test only changed files)
npx ava --watch
```

## known problems

```text
# time issue
there is an issue if time is between 23:00:00 - 01:00:00, it time of rat which means day+1
```

## todo

- code - test nodejs built in test runner
- [x] code - investigate using commonjs (nodejs format) or es6 as lunar.js cannot be added 
- [x] code - investigate and describe how lunarinfo is used
- [x] code - setup basic ava test
- [x] code - test and select <https://github.com/cucumber/cucumber-js> or <https://github.com/avajs/ava>

## functional programming

the benefits of functional programming are :

- easier testing
- better composability
- predictable behavior
- easier to reason about
- better for functional programming patterns

## reference

- <https://github.com/gopherjs/gopherjs>
- <https://github.com/6tail/lunar-javascript>
- <https://www.programminghunter.com/article/85501142176/>
