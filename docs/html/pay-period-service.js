(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/main.ts
  var main_exports = {};
  __export(main_exports, {
    MONTH_MAX: () => MONTH_MAX,
    MONTH_MIN: () => MONTH_MIN,
    YEAR_MAX: () => YEAR_MAX,
    YEAR_MIN: () => YEAR_MIN,
    getPayPeriod: () => getPayPeriod,
    getPayPeriodForMonth: () => getPayPeriodForMonth,
    getPayPeriods: () => getPayPeriods,
    ical: () => ical
  });

  // src/pay-period-utils.ts
  function contains(payPeriod, date) {
    let _date;
    if (typeof date === "string")
      _date = date;
    else if (date instanceof Date) {
      _date = toISODate(date);
    } else {
      return false;
    }
    return payPeriod.firstDay <= _date && _date <= payPeriod.lastDay;
  }
  function padLeft(src, length, c = " ") {
    let result = "";
    if (src !== null && src !== void 0)
      result = src.toString();
    const _c = c.length === 1 ? c : c.length > 1 ? c[0] : " ";
    if (result.length < length) {
      result = _c.repeat(length - result.length) + result;
    }
    return result;
  }
  function toISODate(date) {
    return `${date.getFullYear()}-${padLeft(date.getMonth() + 1, 2, "0")}-${padLeft(date.getDate(), 2, "0")}`;
  }
  function formatDate(year, month, day) {
    return `${padLeft(year, 4, "0")}-${padLeft(month, 2, "0")}-${padLeft(day, 2, "0")}`;
  }

  // src/pay-period-service.ts
  function getPayPeriod(date) {
    let sdate;
    let _year;
    let _month;
    if (typeof date === "string") {
      sdate = date;
      const [year, month] = sdate.split("-", 3);
      _year = parseInt(year, 10);
      _month = parseInt(month, 10);
    } else if (date instanceof Date) {
      _year = date.getFullYear();
      _month = date.getMonth() + 1;
      sdate = toISODate(date);
    } else {
      throw Error("Invalid argument");
    }
    validateYear(_year);
    validateMonth(_month);
    const ps = getPatterns(_year);
    let result = new PayPeriodImpl(_year, ps[_month - 1]);
    if (contains(result, sdate)) {
      return result;
    }
    if (_month > 1) {
      result = new PayPeriodImpl(_year, ps[_month - 2]);
      if (contains(result, sdate))
        return result;
    }
    if (_month < 13) {
      result = new PayPeriodImpl(_year, ps[_month]);
      if (contains(result, sdate))
        return result;
    }
    throw new Error("This error should never happen!");
  }
  function getPayPeriodForMonth(year, month) {
    validateYear(year);
    validateMonth(month);
    const pat = getPattern(year, month);
    return new PayPeriodImpl(year, pat);
  }
  function getPayPeriods(year, month) {
    validateYear(year);
    if (month) {
      validateMonth(month);
      return [new PayPeriodImpl(year, getPattern(year, month))];
    }
    return getPatterns(year).map((p) => new PayPeriodImpl(year, p));
  }
  function validateYear(year) {
    if (year < YEAR_MIN || year > YEAR_MAX)
      throw new Error(`The year must be between ${YEAR_MIN} and ${YEAR_MAX}`);
  }
  function validateMonth(month) {
    if (month < MONTH_MIN || month > MONTH_MAX)
      throw new Error(`The month must be between ${MONTH_MIN} and ${MONTH_MAX}.`);
  }
  var YEAR_MIN = 1994;
  var PATTERN_SEED_YEAR = YEAR_MIN;
  var MONTH_MIN = 1;
  var MONTH_MAX = 12;
  var YEAR_MAX = 2299;
  var COL_SEQ = 0;
  var COL_MONTH = 1;
  var COL_START_MONTH = 2;
  var COL_START_DAY = 3;
  var COL_END_MONTH = 4;
  var COL_END_DAY = 5;
  var COL_WORK_DAYS = 6;
  var PATTERN_SEQUENCE = new Uint8Array([7, 1, 9, 4, 5, 6, 14, 2, 3, 4, 12, 7, 1, 2, 10, 5, 6, 7, 8, 3, 4, 5, 13, 1, 2, 3, 11, 6]);
  var PATTERNS = new Array(new Uint8Array([1, 1, 1, 1, 1, 31, 22]), new Uint8Array([1, 2, 2, 1, 3, 1, 21]), new Uint8Array([1, 3, 3, 2, 3, 31, 22]), new Uint8Array([1, 4, 4, 1, 5, 1, 21]), new Uint8Array([1, 5, 5, 2, 5, 31, 22]), new Uint8Array([1, 6, 6, 1, 6, 30, 22]), new Uint8Array([1, 7, 7, 1, 8, 1, 22]), new Uint8Array([1, 8, 8, 2, 8, 31, 22]), new Uint8Array([1, 9, 9, 1, 9, 30, 21]), new Uint8Array([1, 10, 10, 1, 10, 31, 22]), new Uint8Array([1, 11, 11, 1, 11, 30, 22]), new Uint8Array([1, 12, 12, 1, 12, 31, 21]), new Uint8Array([2, 1, 1, 1, 1, 30, 22]), new Uint8Array([2, 2, 1, 31, 2, 28, 21]), new Uint8Array([2, 3, 3, 1, 3, 31, 22]), new Uint8Array([2, 4, 4, 1, 4, 30, 21]), new Uint8Array([2, 5, 5, 1, 5, 30, 22]), new Uint8Array([2, 6, 5, 31, 6, 30, 22]), new Uint8Array([2, 7, 7, 1, 7, 31, 22]), new Uint8Array([2, 8, 8, 1, 8, 30, 22]), new Uint8Array([2, 9, 8, 31, 9, 30, 21]), new Uint8Array([2, 10, 10, 1, 10, 30, 22]), new Uint8Array([2, 11, 10, 31, 11, 29, 22]), new Uint8Array([2, 12, 11, 30, 12, 31, 22]), new Uint8Array([3, 1, 1, 1, 1, 30, 22]), new Uint8Array([3, 2, 1, 31, 2, 28, 21]), new Uint8Array([3, 3, 3, 1, 3, 31, 21]), new Uint8Array([3, 4, 4, 1, 4, 30, 22]), new Uint8Array([3, 5, 5, 1, 5, 30, 22]), new Uint8Array([3, 6, 5, 31, 6, 30, 21]), new Uint8Array([3, 7, 7, 1, 7, 30, 22]), new Uint8Array([3, 8, 7, 31, 8, 29, 22]), new Uint8Array([3, 9, 8, 30, 9, 30, 22]), new Uint8Array([3, 10, 10, 1, 10, 30, 22]), new Uint8Array([3, 11, 10, 31, 11, 30, 22]), new Uint8Array([3, 12, 12, 1, 12, 31, 22]), new Uint8Array([4, 1, 1, 1, 1, 30, 22]), new Uint8Array([4, 2, 1, 31, 2, 28, 21]), new Uint8Array([4, 3, 3, 1, 3, 31, 21]), new Uint8Array([4, 4, 4, 1, 4, 30, 22]), new Uint8Array([4, 5, 5, 1, 5, 31, 22]), new Uint8Array([4, 6, 6, 1, 6, 30, 21]), new Uint8Array([4, 7, 7, 1, 7, 30, 22]), new Uint8Array([4, 8, 7, 31, 8, 31, 22]), new Uint8Array([4, 9, 9, 1, 9, 30, 22]), new Uint8Array([4, 10, 10, 1, 10, 30, 22]), new Uint8Array([4, 11, 10, 31, 12, 1, 22]), new Uint8Array([4, 12, 12, 2, 12, 31, 22]), new Uint8Array([5, 1, 1, 1, 1, 29, 21]), new Uint8Array([5, 2, 1, 30, 2, 28, 21]), new Uint8Array([5, 3, 3, 1, 3, 31, 22]), new Uint8Array([5, 4, 4, 1, 4, 30, 22]), new Uint8Array([5, 5, 5, 1, 5, 31, 21]), new Uint8Array([5, 6, 6, 1, 6, 30, 22]), new Uint8Array([5, 7, 7, 1, 7, 30, 22]), new Uint8Array([5, 8, 7, 31, 8, 31, 22]), new Uint8Array([5, 9, 9, 1, 9, 30, 22]), new Uint8Array([5, 10, 10, 1, 10, 31, 22]), new Uint8Array([5, 11, 11, 1, 12, 1, 22]), new Uint8Array([5, 12, 12, 2, 12, 31, 22]), new Uint8Array([6, 1, 1, 1, 1, 31, 21]), new Uint8Array([6, 2, 2, 1, 3, 1, 21]), new Uint8Array([6, 3, 3, 2, 3, 31, 22]), new Uint8Array([6, 4, 4, 1, 4, 30, 22]), new Uint8Array([6, 5, 5, 1, 5, 31, 21]), new Uint8Array([6, 6, 6, 1, 6, 30, 22]), new Uint8Array([6, 7, 7, 1, 7, 31, 22]), new Uint8Array([6, 8, 8, 1, 8, 31, 22]), new Uint8Array([6, 9, 9, 1, 9, 30, 22]), new Uint8Array([6, 10, 10, 1, 11, 1, 22]), new Uint8Array([6, 11, 11, 2, 12, 1, 22]), new Uint8Array([6, 12, 12, 2, 12, 31, 22]), new Uint8Array([7, 1, 1, 1, 1, 31, 21]), new Uint8Array([7, 2, 2, 1, 3, 1, 21]), new Uint8Array([7, 3, 3, 2, 3, 31, 22]), new Uint8Array([7, 4, 4, 1, 4, 30, 21]), new Uint8Array([7, 5, 5, 1, 5, 31, 22]), new Uint8Array([7, 6, 6, 1, 6, 30, 22]), new Uint8Array([7, 7, 7, 1, 8, 1, 22]), new Uint8Array([7, 8, 8, 2, 8, 31, 22]), new Uint8Array([7, 9, 9, 1, 9, 30, 22]), new Uint8Array([7, 10, 10, 1, 10, 31, 21]), new Uint8Array([7, 11, 11, 1, 11, 30, 22]), new Uint8Array([7, 12, 12, 1, 12, 31, 22]), new Uint8Array([8, 1, 1, 1, 1, 31, 22]), new Uint8Array([8, 2, 2, 1, 2, 29, 21]), new Uint8Array([8, 3, 3, 1, 3, 31, 22]), new Uint8Array([8, 4, 4, 1, 4, 30, 21]), new Uint8Array([8, 5, 5, 1, 5, 30, 22]), new Uint8Array([8, 6, 5, 31, 6, 30, 22]), new Uint8Array([8, 7, 7, 1, 7, 31, 22]), new Uint8Array([8, 8, 8, 1, 8, 30, 22]), new Uint8Array([8, 9, 8, 31, 9, 30, 21]), new Uint8Array([8, 10, 10, 1, 10, 30, 22]), new Uint8Array([8, 11, 10, 31, 11, 29, 22]), new Uint8Array([8, 12, 11, 30, 12, 31, 22]), new Uint8Array([9, 1, 1, 1, 1, 30, 22]), new Uint8Array([9, 2, 1, 31, 2, 29, 22]), new Uint8Array([9, 3, 3, 1, 3, 31, 21]), new Uint8Array([9, 4, 4, 1, 4, 30, 22]), new Uint8Array([9, 5, 5, 1, 5, 30, 22]), new Uint8Array([9, 6, 5, 31, 6, 30, 21]), new Uint8Array([9, 7, 7, 1, 7, 30, 22]), new Uint8Array([9, 8, 7, 31, 8, 29, 22]), new Uint8Array([9, 9, 8, 30, 9, 30, 22]), new Uint8Array([9, 10, 10, 1, 10, 30, 22]), new Uint8Array([9, 11, 10, 31, 11, 30, 22]), new Uint8Array([9, 12, 12, 1, 12, 31, 22]), new Uint8Array([10, 1, 1, 1, 1, 30, 22]), new Uint8Array([10, 2, 1, 31, 2, 29, 22]), new Uint8Array([10, 3, 3, 1, 3, 31, 21]), new Uint8Array([10, 4, 4, 1, 4, 30, 22]), new Uint8Array([10, 5, 5, 1, 5, 31, 22]), new Uint8Array([10, 6, 6, 1, 6, 30, 21]), new Uint8Array([10, 7, 7, 1, 7, 30, 22]), new Uint8Array([10, 8, 7, 31, 8, 31, 22]), new Uint8Array([10, 9, 9, 1, 9, 30, 22]), new Uint8Array([10, 10, 10, 1, 10, 30, 22]), new Uint8Array([10, 11, 10, 31, 12, 1, 22]), new Uint8Array([10, 12, 12, 2, 12, 31, 22]), new Uint8Array([11, 1, 1, 1, 1, 30, 22]), new Uint8Array([11, 2, 1, 31, 2, 29, 21]), new Uint8Array([11, 3, 3, 1, 3, 31, 22]), new Uint8Array([11, 4, 4, 1, 4, 30, 22]), new Uint8Array([11, 5, 5, 1, 5, 31, 21]), new Uint8Array([11, 6, 6, 1, 6, 30, 22]), new Uint8Array([11, 7, 7, 1, 7, 30, 22]), new Uint8Array([11, 8, 7, 31, 8, 31, 22]), new Uint8Array([11, 9, 9, 1, 9, 30, 22]), new Uint8Array([11, 10, 10, 1, 10, 31, 22]), new Uint8Array([11, 11, 11, 1, 12, 1, 22]), new Uint8Array([11, 12, 12, 2, 12, 31, 22]), new Uint8Array([12, 1, 1, 1, 1, 31, 22]), new Uint8Array([12, 2, 2, 1, 3, 1, 21]), new Uint8Array([12, 3, 3, 2, 3, 31, 22]), new Uint8Array([12, 4, 4, 1, 4, 30, 22]), new Uint8Array([12, 5, 5, 1, 5, 31, 21]), new Uint8Array([12, 6, 6, 1, 6, 30, 22]), new Uint8Array([12, 7, 7, 1, 7, 31, 22]), new Uint8Array([12, 8, 8, 1, 8, 31, 22]), new Uint8Array([12, 9, 9, 1, 9, 30, 22]), new Uint8Array([12, 10, 10, 1, 11, 1, 22]), new Uint8Array([12, 11, 11, 2, 12, 1, 22]), new Uint8Array([12, 12, 12, 2, 12, 31, 22]), new Uint8Array([13, 1, 1, 1, 1, 31, 21]), new Uint8Array([13, 2, 2, 1, 3, 1, 22]), new Uint8Array([13, 3, 3, 2, 3, 31, 22]), new Uint8Array([13, 4, 4, 1, 4, 30, 21]), new Uint8Array([13, 5, 5, 1, 5, 31, 22]), new Uint8Array([13, 6, 6, 1, 6, 30, 22]), new Uint8Array([13, 7, 7, 1, 8, 1, 22]), new Uint8Array([13, 8, 8, 2, 8, 31, 22]), new Uint8Array([13, 9, 9, 1, 9, 30, 22]), new Uint8Array([13, 10, 10, 1, 10, 31, 21]), new Uint8Array([13, 11, 11, 1, 11, 30, 22]), new Uint8Array([13, 12, 12, 1, 12, 31, 22]), new Uint8Array([14, 1, 1, 1, 1, 31, 21]), new Uint8Array([14, 2, 2, 1, 3, 1, 22]), new Uint8Array([14, 3, 3, 2, 3, 31, 22]), new Uint8Array([14, 4, 4, 1, 5, 1, 21]), new Uint8Array([14, 5, 5, 2, 5, 31, 22]), new Uint8Array([14, 6, 6, 1, 6, 30, 22]), new Uint8Array([14, 7, 7, 1, 7, 31, 21]), new Uint8Array([14, 8, 8, 1, 8, 30, 22]), new Uint8Array([14, 9, 8, 31, 9, 30, 22]), new Uint8Array([14, 10, 10, 1, 10, 31, 22]), new Uint8Array([14, 11, 11, 1, 11, 30, 22]), new Uint8Array([14, 12, 12, 1, 12, 31, 21]));
  function getPatternSequence(year) {
    const idx = (year - PATTERN_SEED_YEAR) % PATTERN_SEQUENCE.length;
    return PATTERN_SEQUENCE[idx];
  }
  function getPatterns(year) {
    const seq = getPatternSequence(year);
    const idx = (seq - 1) * 12;
    return PATTERNS.slice(idx, idx + 12);
  }
  function getPattern(year, month) {
    const seq = getPatternSequence(year);
    const idx = (seq - 1) * 12 + month - 1;
    const pat = PATTERNS[idx];
    return pat;
  }

  // src/pay-period.ts
  var PayPeriodImpl = class {
    constructor(year, pattern) {
      this.year = year;
      this.pattern = pattern;
      this._workHours = null;
      this._firstDay = null;
      this._lastDay = null;
    }
    get startDay() {
      return this.pattern[COL_START_DAY];
    }
    get startMonth() {
      return this.pattern[COL_START_MONTH];
    }
    get firstDay() {
      if (this._firstDay === null) {
        this._firstDay = formatDate(this.year, this.startMonth, this.startDay);
      }
      return this._firstDay;
    }
    get endDay() {
      return this.pattern[COL_END_DAY];
    }
    get endMonth() {
      return this.pattern[COL_END_MONTH];
    }
    get lastDay() {
      if (this._lastDay === null) {
        this._lastDay = formatDate(this.year, this.endMonth, this.endDay);
      }
      return this._lastDay;
    }
    get workDays() {
      return this.pattern[COL_WORK_DAYS];
    }
    get workHours() {
      if (this._workHours === null) {
        this._workHours = this.workDays * 8;
      }
      return this._workHours;
    }
    get patternNumber() {
      return this.pattern[COL_SEQ];
    }
    get month() {
      return this.pattern[COL_MONTH];
    }
  };

  // src/pay-period-ical.ts
  function ical(payPeriods, name) {
    const calName = name || "Pay Periods";
    let result = "";
    result += "BEGIN:VCALENDAR\n";
    result += "VERSION:2.0\n";
    result += "PRODID:CA-GOV-PAYPERIOD\n";
    result += `X-WR-CALNAME:${calName}
`;
    for (const pp of payPeriods) {
      result += toVEvent(pp);
    }
    result += "END:VCALENDAR\n";
    return result;
  }
  function toVEvent(pp) {
    const sYear = pp.year.toString();
    const sMonth = padLeft(pp.month, 2, "0");
    const monthName = MONTH_NAMES[pp.month - 1];
    const now = new Date();
    const dtStamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
    const endDate = new Date(pp.lastDay);
    endDate.setUTCDate(endDate.getUTCDate() + 1);
    const dtEnd = endDate.getUTCFullYear().toString() + padLeft(endDate.getUTCMonth() + 1, 2, "0") + padLeft(endDate.getUTCDate(), 2, "0");
    let result = "";
    result += "BEGIN:VEVENT\n";
    result += `UID:CA-GOV-PAYPERIOD-${sYear}-${sMonth}
`;
    result += `DTSTAMP:${dtStamp}
`;
    result += `DTSTART:${pp.firstDay.replace(/-/g, "")}
`;
    result += `DTEND:${dtEnd}
`;
    result += `SUMMARY:${monthName} ${sYear}
`;
    result += `DESCRIPTION:${monthName} ${sYear} Pay Period
`;
    result += ` \\nFirst Day: ${pp.firstDay}
`;
    result += ` \\nLast Day: ${pp.lastDay}
`;
    result += ` \\nWork Days: ${pp.workDays}
`;
    result += ` \\nWork Hours: ${pp.workHours}
`;
    result += "END:VEVENT\n";
    return result;
  }
  var MONTH_NAMES = Object.freeze([
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]);

  // src/browser.ts
  window.PayPeriodService = main_exports;
  console.log(`The "PayPeriodService" API was added to the window object. You can try it yourself by just entering "PayPeriodService.getPayPeriod('2022-03-15')"`);
})();
/*!
MIT License

Copyright (c) 2018-2022 State of California, Department of Fish and Wildlife

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
