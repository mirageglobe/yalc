# yet another lunar calendar

maintainer: jimmy lim <mirageglobe@gmail.com>

yet another lunar calendar conversion: a lunar to solar conversion in JavaScript

## known problems

```text
# time issue
there is an issue if time is between 23:00:00 - 01:00:00, it time of rat which means day+1
```

## to use

```bash
# run with node
node lunar.js

# test with ava
npx ava

# ava test with watch (test only changed files)
npx ava --watch
```

## lunar-calendar

alternatively, there is another package which has more features. <https://github.com/6tail/lunar-javascript>
the following works for lunar-javascript

```html
demo.html
    <script src="lunar.js"></script>
    <script>
      //当前日期生成农历对象
      var date = Lunar.fromDate(new Date());
      document.write(date.toFullString());
      document.write('<br>');
      //转阳历
      document.write(date.getSolar().toFullString());
      document.write('<br><br>');

      //指定日期生成农历对象
      // var date = Lunar.fromDate(new Date(2021-12-28));
      // note month starts from 0 .. therefore 0 is jan - 11 is dec
      var testdate = new Date(1950, 4, 19, 20, 30, 0);
      var date = Lunar.fromDate(testdate);
      document.write(date.toFullString());
      document.write('<br><br><br><br>');
      document.write(testdate);
      //转阳历
      document.write(date.getSolar().toFullString());
    </script>
```

## to do

- [] investigate using commonjs (nodejs format) or es6 as lunar.js cannot be
  added 
- [x] investigate and describe how lunarinfo is used
- [x] setup basic ava test
- [x] test and select <https://github.com/cucumber/cucumber-js> or <https://github.com/avajs/ava>

## reference

- <https://github.com/gopherjs/gopherjs>
- <https://github.com/6tail/lunar-javascript>
- <https://www.programminghunter.com/article/85501142176/>
