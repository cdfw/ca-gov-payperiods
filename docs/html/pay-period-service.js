/*!
MIT License

Copyright (c) 2018-2020 State of California, Department of Fish and Wildlife

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
/**
 * California State Government Pay Period API.
 * @copyright Copyright (c) 2018-2020 California Department of Fish and Wildlife
 * @author Eric G. Miller
 * @version 2.0.0
 */
var PayPeriodService;
(function (PayPeriodService) {
    /**
     * Get the pay period for a date. The time of day is ignored.
     *
     * @param {{Date}} date - The date
     */
    function getPayPeriod(date) {
        var year = date.getFullYear();
        validateYear(year);
        var month = date.getMonth();
        var day = date.getDate();
        var ps = getPatterns(year);
        // First try the same month as the date's month...
        var result = createPayPeriod(year, ps[month]);
        if (isBetween(date, result.startDate, result.endDate)) {
            return result;
        }
        // Then try the month before...
        if (month > 0) {
            result = createPayPeriod(year, ps[month - 1]);
            if (isBetween(date, result.startDate, result.endDate)) {
                return result;
            }
        }
        // Then try the month after...
        if (month < 12) {
            result = createPayPeriod(year, ps[month + 1]);
            if (isBetween(date, result.startDate, result.endDate)) {
                return result;
            }
        }
        throw new Error("This error should never happen!");
    }
    PayPeriodService.getPayPeriod = getPayPeriod;
    /**
     * Get pay periods for a year. Optionally, only return a single month.
     *
     * @param {{number}} year - The calendar year.
     * @param {{number}} [month] - The month (1..12).
     */
    function getPayPeriods(year, month) {
        validateYear(year);
        var monthStart = 1;
        var monthEnd = 12;
        if (month) {
            validateMonth(month);
            monthStart = monthEnd = month;
        }
        return getPatterns(year)
            .slice(monthStart - 1, monthEnd)
            .map(function (p) {
            return createPayPeriod(year, p);
        });
    }
    PayPeriodService.getPayPeriods = getPayPeriods;
    /**
     * Given an array of pay periods, return a string formatted as
     * an iCalendar file with the pay periods as events.
     *
     * @param {{PayPeriod[]}} payPeriods One or more payperiods to write as events in the calendar.
     * @param {{string}} [name] (default: "Pay Periods") Optional name for the calendar.
     */
    function ical(payPeriods, name) {
        var calName = name || "Pay Periods";
        var result = "";
        result += "BEGIN:VCALENDAR\n";
        result += "VERSION:2.0\n";
        result += "PRODID:CA-GOV-PAYPERIOD\n";
        result += `X-WR-CALNAME:${calName}\n`;
        for (var pp of payPeriods) {
            result += toVEvent(pp);
        }
        result += "END:VCALENDAR\n";
        return result;
    }
    PayPeriodService.ical = ical;
    function toVEvent(pp) {
        const sYear = pp.year.toString(); // should always be four digits...
        const sMonth = padLeft(pp.month, 2, "0");
        const monthName = MONTH_NAMES[pp.month - 1];
        const now = new Date();
        // ISO string with hypens, colons, or fractions of a second.
        const dtStamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
        // ISO date only with no hyphens
        // Must add one day to endDate (up to, not including...)
        const endDate = new Date(pp.lastDay);
        endDate.setUTCDate(endDate.getUTCDate() + 1);
        const dtEnd = endDate.getUTCFullYear().toString()
            + padLeft((endDate.getUTCMonth() + 1), 2, "0")
            + padLeft(endDate.getUTCDate(), 2, "0");
        var result = "";
        result += "BEGIN:VEVENT\n";
        result += `UID:CA-GOV-PAYPERIOD-${sYear}-${sMonth}\n`;
        result += `DTSTAMP:${dtStamp}\n`;
        result += `DTSTART:${pp.firstDay.replace(/-/g, "")}\n`;
        result += `DTEND:${dtEnd}\n`;
        result += `SUMMARY:${monthName} ${sYear}\n`;
        result += `DESCRIPTION:${monthName} ${sYear} Pay Period\n`;
        result += ` \\nFirst Day: ${pp.firstDay}\n`;
        result += ` \\nLast Day: ${pp.lastDay}\n`;
        result += ` \\nWork Days: ${pp.workDays}\n`;
        result += ` \\nWork Hours: ${pp.workHours}\n`;
        result += "END:VEVENT\n";
        return result;
    }
    const MONTH_NAMES = Object.freeze([
        "January", "February", "March",
        "April", "May", "June",
        "July", "August", "September",
        "October", "November", "December"
    ]);
    function padLeft(src, length, c = " ") {
        var result = (src !== null && src !== undefined) ? src.toString() : "";
        var _c = c.length === 1 ? c : c.length > 1 ? c[0] : " ";
        if (result.length < length) {
            result = _c.repeat(length - result.length) + result;
        }
        return result;
    }
    /**
     * Is one date between two others ignoring time?
     * @param {{Date}} date The date in question.
     * @param {{Date}} start The earlier date.
     * @param {{Date}} end The greater date.
     */
    function isBetween(date, start, end) {
        const d2 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const _start = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        const _end = new Date(end.getFullYear(), end.getMonth(), end.getDate());
        return _start <= d2 && d2 <= _end;
    }
    /**
     * Create a PayPeriod object
     *
     * @param {{number}} year - The pay period year.
     * @param {{Uint8Array}} p - The pay period pattern array.
     */
    function createPayPeriod(year, p) {
        const sYear = year.toString();
        return {
            startDate: new Date(year, p[COL_START_MONTH] - 1, p[COL_START_DAY]),
            endDate: new Date(year, p[COL_END_MONTH] - 1, p[COL_END_DAY]),
            year: year,
            month: p[COL_MONTH],
            firstDay: `${sYear}-${padLeft(p[COL_START_MONTH], 2, "0")}-${padLeft(p[COL_START_DAY], 2, "0")}`,
            lastDay: `${sYear}-${padLeft(p[COL_END_MONTH], 2, "0")}-${padLeft(p[COL_END_DAY], 2, "0")}`,
            workDays: p[COL_WORK_DAYS],
            workHours: p[COL_WORK_DAYS] * 8,
        };
    }
    /**
     * Validate the pay period year.
     *
     * @param {{number}} year - The year (1994..2299)
     */
    function validateYear(year) {
        if (year < PATTERN_SEED_YEAR || year > PayPeriodService.YEAR_MAX)
            throw new Error("The year must be between " + PATTERN_SEED_YEAR + " and " + PayPeriodService.YEAR_MAX);
    }
    /**
     * Validate the pay period month.
     *
     * @param {{number}} month - The month (1..12)
     */
    function validateMonth(month) {
        if (month < 1 || month > 12)
            throw new Error("The month must be between 1 and 12.");
    }
    /**
     * The first year of the pattern
     */
    const PATTERN_SEED_YEAR = 1994;
    PayPeriodService.YEAR_MIN = PATTERN_SEED_YEAR;
    /**
     * The first pattern number sequence
     */
    const PATTERN_NUMBER_MIN = 1;
    /**
     * The last pattern number sequence
     */
    const PATTERN_NUMBER_MAX = 14;
    /**
     * The minimum month number.
     */
    PayPeriodService.MONTH_MIN = 1;
    /**
     * The maximum month number.
     */
    PayPeriodService.MONTH_MAX = 12;
    /**
     * The maximun year supported.
     */
    PayPeriodService.YEAR_MAX = 2299;
    /**
     * Pattern table column sequence number
     */
    const COL_SEQ = 0;
    /**
     * Pattern table column month number
     */
    const COL_MONTH = 1;
    /**
     * Pattern table column start month
     */
    const COL_START_MONTH = 2;
    /**
     * Pattern table column start day
     */
    const COL_START_DAY = 3;
    /**
     * Pattern table column end month
     */
    const COL_END_MONTH = 4;
    /**
     * Pattern table column end day
     */
    const COL_END_DAY = 5;
    /**
     * Pattern table column work days
     */
    const COL_WORK_DAYS = 6;
    /**
     * The pattern sequence
     */
    const PATTERN_SEQUENCE = new Uint8Array([7, 1, 9, 4, 5, 6, 14, 2, 3, 4, 12, 7, 1, 2, 10, 5, 6, 7, 8, 3, 4, 5, 13, 1, 2, 3, 11, 6]);
    /**
     * The pattern table
     */
    const PATTERNS = new Array(new Uint8Array([1, 1, 1, 1, 1, 31, 22]), new Uint8Array([1, 2, 2, 1, 3, 1, 21]), new Uint8Array([1, 3, 3, 2, 3, 31, 22]), new Uint8Array([1, 4, 4, 1, 5, 1, 21]), new Uint8Array([1, 5, 5, 2, 5, 31, 22]), new Uint8Array([1, 6, 6, 1, 6, 30, 22]), new Uint8Array([1, 7, 7, 1, 8, 1, 22]), new Uint8Array([1, 8, 8, 2, 8, 31, 22]), new Uint8Array([1, 9, 9, 1, 9, 30, 21]), new Uint8Array([1, 10, 10, 1, 10, 31, 22]), new Uint8Array([1, 11, 11, 1, 11, 30, 22]), new Uint8Array([1, 12, 12, 1, 12, 31, 21]), new Uint8Array([2, 1, 1, 1, 1, 30, 22]), new Uint8Array([2, 2, 1, 31, 2, 28, 21]), new Uint8Array([2, 3, 3, 1, 3, 31, 22]), new Uint8Array([2, 4, 4, 1, 4, 30, 21]), new Uint8Array([2, 5, 5, 1, 5, 30, 22]), new Uint8Array([2, 6, 5, 31, 6, 30, 22]), new Uint8Array([2, 7, 7, 1, 7, 31, 22]), new Uint8Array([2, 8, 8, 1, 8, 30, 22]), new Uint8Array([2, 9, 8, 31, 9, 30, 21]), new Uint8Array([2, 10, 10, 1, 10, 30, 22]), new Uint8Array([2, 11, 10, 31, 11, 29, 22]), new Uint8Array([2, 12, 11, 30, 12, 31, 22]), new Uint8Array([3, 1, 1, 1, 1, 30, 22]), new Uint8Array([3, 2, 1, 31, 2, 28, 21]), new Uint8Array([3, 3, 3, 1, 3, 31, 21]), new Uint8Array([3, 4, 4, 1, 4, 30, 22]), new Uint8Array([3, 5, 5, 1, 5, 30, 22]), new Uint8Array([3, 6, 5, 31, 6, 30, 21]), new Uint8Array([3, 7, 7, 1, 7, 30, 22]), new Uint8Array([3, 8, 7, 31, 8, 29, 22]), new Uint8Array([3, 9, 8, 30, 9, 30, 22]), new Uint8Array([3, 10, 10, 1, 10, 30, 22]), new Uint8Array([3, 11, 10, 31, 11, 30, 22]), new Uint8Array([3, 12, 12, 1, 12, 31, 22]), new Uint8Array([4, 1, 1, 1, 1, 30, 22]), new Uint8Array([4, 2, 1, 31, 2, 28, 21]), new Uint8Array([4, 3, 3, 1, 3, 31, 21]), new Uint8Array([4, 4, 4, 1, 4, 30, 22]), new Uint8Array([4, 5, 5, 1, 5, 31, 22]), new Uint8Array([4, 6, 6, 1, 6, 30, 21]), new Uint8Array([4, 7, 7, 1, 7, 30, 22]), new Uint8Array([4, 8, 7, 31, 8, 31, 22]), new Uint8Array([4, 9, 9, 1, 9, 30, 22]), new Uint8Array([4, 10, 10, 1, 10, 30, 22]), new Uint8Array([4, 11, 10, 31, 12, 1, 22]), new Uint8Array([4, 12, 12, 2, 12, 31, 22]), new Uint8Array([5, 1, 1, 1, 1, 29, 21]), new Uint8Array([5, 2, 1, 30, 2, 28, 21]), new Uint8Array([5, 3, 3, 1, 3, 31, 22]), new Uint8Array([5, 4, 4, 1, 4, 30, 22]), new Uint8Array([5, 5, 5, 1, 5, 31, 21]), new Uint8Array([5, 6, 6, 1, 6, 30, 22]), new Uint8Array([5, 7, 7, 1, 7, 30, 22]), new Uint8Array([5, 8, 7, 31, 8, 31, 22]), new Uint8Array([5, 9, 9, 1, 9, 30, 22]), new Uint8Array([5, 10, 10, 1, 10, 31, 22]), new Uint8Array([5, 11, 11, 1, 12, 1, 22]), new Uint8Array([5, 12, 12, 2, 12, 31, 22]), new Uint8Array([6, 1, 1, 1, 1, 31, 21]), new Uint8Array([6, 2, 2, 1, 3, 1, 21]), new Uint8Array([6, 3, 3, 2, 3, 31, 22]), new Uint8Array([6, 4, 4, 1, 4, 30, 22]), new Uint8Array([6, 5, 5, 1, 5, 31, 21]), new Uint8Array([6, 6, 6, 1, 6, 30, 22]), new Uint8Array([6, 7, 7, 1, 7, 31, 22]), new Uint8Array([6, 8, 8, 1, 8, 31, 22]), new Uint8Array([6, 9, 9, 1, 9, 30, 22]), new Uint8Array([6, 10, 10, 1, 11, 1, 22]), new Uint8Array([6, 11, 11, 2, 12, 1, 22]), new Uint8Array([6, 12, 12, 2, 12, 31, 22]), new Uint8Array([7, 1, 1, 1, 1, 31, 21]), new Uint8Array([7, 2, 2, 1, 3, 1, 21]), new Uint8Array([7, 3, 3, 2, 3, 31, 22]), new Uint8Array([7, 4, 4, 1, 4, 30, 21]), new Uint8Array([7, 5, 5, 1, 5, 31, 22]), new Uint8Array([7, 6, 6, 1, 6, 30, 22]), new Uint8Array([7, 7, 7, 1, 8, 1, 22]), new Uint8Array([7, 8, 8, 2, 8, 31, 22]), new Uint8Array([7, 9, 9, 1, 9, 30, 22]), new Uint8Array([7, 10, 10, 1, 10, 31, 21]), new Uint8Array([7, 11, 11, 1, 11, 30, 22]), new Uint8Array([7, 12, 12, 1, 12, 31, 22]), new Uint8Array([8, 1, 1, 1, 1, 31, 22]), new Uint8Array([8, 2, 2, 1, 2, 29, 21]), new Uint8Array([8, 3, 3, 1, 3, 31, 22]), new Uint8Array([8, 4, 4, 1, 4, 30, 21]), new Uint8Array([8, 5, 5, 1, 5, 30, 22]), new Uint8Array([8, 6, 5, 31, 6, 30, 22]), new Uint8Array([8, 7, 7, 1, 7, 31, 22]), new Uint8Array([8, 8, 8, 1, 8, 30, 22]), new Uint8Array([8, 9, 8, 31, 9, 30, 21]), new Uint8Array([8, 10, 10, 1, 10, 30, 22]), new Uint8Array([8, 11, 10, 31, 11, 29, 22]), new Uint8Array([8, 12, 11, 30, 12, 31, 22]), new Uint8Array([9, 1, 1, 1, 1, 30, 22]), new Uint8Array([9, 2, 1, 31, 2, 29, 22]), new Uint8Array([9, 3, 3, 1, 3, 31, 21]), new Uint8Array([9, 4, 4, 1, 4, 30, 22]), new Uint8Array([9, 5, 5, 1, 5, 30, 22]), new Uint8Array([9, 6, 5, 31, 6, 30, 21]), new Uint8Array([9, 7, 7, 1, 7, 30, 22]), new Uint8Array([9, 8, 7, 31, 8, 29, 22]), new Uint8Array([9, 9, 8, 30, 9, 30, 22]), new Uint8Array([9, 10, 10, 1, 10, 30, 22]), new Uint8Array([9, 11, 10, 31, 11, 30, 22]), new Uint8Array([9, 12, 12, 1, 12, 31, 22]), new Uint8Array([10, 1, 1, 1, 1, 30, 22]), new Uint8Array([10, 2, 1, 31, 2, 29, 22]), new Uint8Array([10, 3, 3, 1, 3, 31, 21]), new Uint8Array([10, 4, 4, 1, 4, 30, 22]), new Uint8Array([10, 5, 5, 1, 5, 31, 22]), new Uint8Array([10, 6, 6, 1, 6, 30, 21]), new Uint8Array([10, 7, 7, 1, 7, 30, 22]), new Uint8Array([10, 8, 7, 31, 8, 31, 22]), new Uint8Array([10, 9, 9, 1, 9, 30, 22]), new Uint8Array([10, 10, 10, 1, 10, 30, 22]), new Uint8Array([10, 11, 10, 31, 12, 1, 22]), new Uint8Array([10, 12, 12, 2, 12, 31, 22]), new Uint8Array([11, 1, 1, 1, 1, 30, 22]), new Uint8Array([11, 2, 1, 31, 2, 29, 21]), new Uint8Array([11, 3, 3, 1, 3, 31, 22]), new Uint8Array([11, 4, 4, 1, 4, 30, 22]), new Uint8Array([11, 5, 5, 1, 5, 31, 21]), new Uint8Array([11, 6, 6, 1, 6, 30, 22]), new Uint8Array([11, 7, 7, 1, 7, 30, 22]), new Uint8Array([11, 8, 7, 31, 8, 31, 22]), new Uint8Array([11, 9, 9, 1, 9, 30, 22]), new Uint8Array([11, 10, 10, 1, 10, 31, 22]), new Uint8Array([11, 11, 11, 1, 12, 1, 22]), new Uint8Array([11, 12, 12, 2, 12, 31, 22]), new Uint8Array([12, 1, 1, 1, 1, 31, 22]), new Uint8Array([12, 2, 2, 1, 3, 1, 21]), new Uint8Array([12, 3, 3, 2, 3, 31, 22]), new Uint8Array([12, 4, 4, 1, 4, 30, 22]), new Uint8Array([12, 5, 5, 1, 5, 31, 21]), new Uint8Array([12, 6, 6, 1, 6, 30, 22]), new Uint8Array([12, 7, 7, 1, 7, 31, 22]), new Uint8Array([12, 8, 8, 1, 8, 31, 22]), new Uint8Array([12, 9, 9, 1, 9, 30, 22]), new Uint8Array([12, 10, 10, 1, 11, 1, 22]), new Uint8Array([12, 11, 11, 2, 12, 1, 22]), new Uint8Array([12, 12, 12, 2, 12, 31, 22]), new Uint8Array([13, 1, 1, 1, 1, 31, 21]), new Uint8Array([13, 2, 2, 1, 3, 1, 22]), new Uint8Array([13, 3, 3, 2, 3, 31, 22]), new Uint8Array([13, 4, 4, 1, 4, 30, 21]), new Uint8Array([13, 5, 5, 1, 5, 31, 22]), new Uint8Array([13, 6, 6, 1, 6, 30, 22]), new Uint8Array([13, 7, 7, 1, 8, 1, 22]), new Uint8Array([13, 8, 8, 2, 8, 31, 22]), new Uint8Array([13, 9, 9, 1, 9, 30, 22]), new Uint8Array([13, 10, 10, 1, 10, 31, 21]), new Uint8Array([13, 11, 11, 1, 11, 30, 22]), new Uint8Array([13, 12, 12, 1, 12, 31, 22]), new Uint8Array([14, 1, 1, 1, 1, 31, 21]), new Uint8Array([14, 2, 2, 1, 3, 1, 22]), new Uint8Array([14, 3, 3, 2, 3, 31, 22]), new Uint8Array([14, 4, 4, 1, 5, 1, 21]), new Uint8Array([14, 5, 5, 2, 5, 31, 22]), new Uint8Array([14, 6, 6, 1, 6, 30, 22]), new Uint8Array([14, 7, 7, 1, 7, 31, 21]), new Uint8Array([14, 8, 8, 1, 8, 30, 22]), new Uint8Array([14, 9, 8, 31, 9, 30, 22]), new Uint8Array([14, 10, 10, 1, 10, 31, 22]), new Uint8Array([14, 11, 11, 1, 11, 30, 22]), new Uint8Array([14, 12, 12, 1, 12, 31, 21]));
    /**
     * Compute the pattern sequence for the pay period's year.
     *
     * @param {{number}} year
     */
    function getPatternSequence(year) {
        var idx = (year - PATTERN_SEED_YEAR) % PATTERN_SEQUENCE.length;
        return PATTERN_SEQUENCE[idx];
    }
    /**
     * Get the patterns for the pay period year.
     *
     * @param {{number}} year - The year
     */
    function getPatterns(year) {
        var seq = getPatternSequence(year);
        var idx = (seq - 1) * 12;
        return PATTERNS.slice(idx, idx + 12);
    }
})(PayPeriodService || (PayPeriodService = {}));
