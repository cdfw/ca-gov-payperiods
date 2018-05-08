/*!
MIT License

Copyright (c) 2018 State of California, Department of Fish and Wildlife

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
 * A service to generate California State Government monthly
 * pay periods starting with 1994 thru 2299.
 *
 * The source of the pay period pattern sequence and table
 * are the State Administrative Manual sections 8500.
 *
 * @copyright California Department of Fish and Wildlife 2017, 2018
 * @author Eric G. Miller
 * @version 1.2
 */
var PayPeriodService;
(function (PayPeriodService) {
    /**
     * The first year of the pattern
     */
    var PATTERN_SEED_YEAR = 1994;
    /**
     * The first pattern number sequence
     */
    var PATTERN_NUMBER_MIN = 1;
    /**
     * The last pattern number sequence
     */
    var PATTERN_NUMBER_MAX = 14;
    /**
     * The minimum month number.
     */
    var MONTH_MIN = 1;
    /**
     * The maximum month number.
     */
    var MONTH_MAX = 12;
    /**
     * The maximun year supported.
     */
    var YEAR_MAX = 2299;
    /**
     * Pattern table column sequence number
     */
    var COL_SEQ = 0;
    /**
     * Pattern table column month number
     */
    var COL_MONTH = 1;
    /**
     * Pattern table column start month
     */
    var COL_START_MONTH = 2;
    /**
     * Pattern table column start day
     */
    var COL_START_DAY = 3;
    /**
     * Pattern table column end month
     */
    var COL_END_MONTH = 4;
    /**
     * Pattern table column end day
     */
    var COL_END_DAY = 5;
    /**
     * Pattern table column work days
     */
    var COL_WORK_DAYS = 6;
    /**
     * The pattern sequence
     */
    var PATTERN_SEQUENCE = [7, 1, 9, 4, 5, 6, 14, 2, 3, 4, 12, 7, 1, 2, 10, 5, 6, 7, 8, 3, 4, 5, 13, 1, 2, 3, 11, 6];
    /**
     * The pattern table
     */
    var PATTERNS = [
        [1, 1, 1, 1, 1, 31, 22],
        [1, 2, 2, 1, 3, 1, 21],
        [1, 3, 3, 2, 3, 31, 22],
        [1, 4, 4, 1, 5, 1, 21],
        [1, 5, 5, 2, 5, 31, 22],
        [1, 6, 6, 1, 6, 30, 22],
        [1, 7, 7, 1, 8, 1, 22],
        [1, 8, 8, 2, 8, 31, 22],
        [1, 9, 9, 1, 9, 30, 21],
        [1, 10, 10, 1, 10, 31, 22],
        [1, 11, 11, 1, 11, 30, 22],
        [1, 12, 12, 1, 12, 31, 21],
        [2, 1, 1, 1, 1, 30, 22],
        [2, 2, 1, 31, 2, 28, 21],
        [2, 3, 3, 1, 3, 31, 22],
        [2, 4, 4, 1, 4, 30, 21],
        [2, 5, 5, 1, 5, 30, 22],
        [2, 6, 5, 31, 6, 30, 22],
        [2, 7, 7, 1, 7, 31, 22],
        [2, 8, 8, 1, 8, 30, 22],
        [2, 9, 8, 31, 9, 30, 21],
        [2, 10, 10, 1, 10, 30, 22],
        [2, 11, 10, 31, 11, 29, 22],
        [2, 12, 11, 30, 12, 31, 22],
        [3, 1, 1, 1, 1, 30, 22],
        [3, 2, 1, 31, 2, 28, 21],
        [3, 3, 3, 1, 3, 31, 21],
        [3, 4, 4, 1, 4, 30, 22],
        [3, 5, 5, 1, 5, 30, 22],
        [3, 6, 5, 31, 6, 30, 21],
        [3, 7, 7, 1, 7, 30, 22],
        [3, 8, 7, 31, 8, 29, 22],
        [3, 9, 8, 30, 9, 30, 22],
        [3, 10, 10, 1, 10, 30, 22],
        [3, 11, 10, 31, 11, 30, 22],
        [3, 12, 12, 1, 12, 31, 22],
        [4, 1, 1, 1, 1, 30, 22],
        [4, 2, 1, 31, 2, 28, 21],
        [4, 3, 3, 1, 3, 31, 21],
        [4, 4, 4, 1, 4, 30, 22],
        [4, 5, 5, 1, 5, 31, 22],
        [4, 6, 6, 1, 6, 30, 21],
        [4, 7, 7, 1, 7, 30, 22],
        [4, 8, 7, 31, 8, 31, 22],
        [4, 9, 9, 1, 9, 30, 22],
        [4, 10, 10, 1, 10, 30, 22],
        [4, 11, 10, 31, 12, 1, 22],
        [4, 12, 12, 2, 12, 31, 22],
        [5, 1, 1, 1, 1, 29, 21],
        [5, 2, 1, 30, 2, 28, 21],
        [5, 3, 3, 1, 3, 31, 22],
        [5, 4, 4, 1, 4, 30, 22],
        [5, 5, 5, 1, 5, 31, 21],
        [5, 6, 6, 1, 6, 30, 22],
        [5, 7, 7, 1, 7, 30, 22],
        [5, 8, 7, 31, 8, 31, 22],
        [5, 9, 9, 1, 9, 30, 22],
        [5, 10, 10, 1, 10, 31, 22],
        [5, 11, 11, 1, 12, 1, 22],
        [5, 12, 12, 2, 12, 31, 22],
        [6, 1, 1, 1, 1, 31, 21],
        [6, 2, 2, 1, 3, 1, 21],
        [6, 3, 3, 2, 3, 31, 22],
        [6, 4, 4, 1, 4, 30, 22],
        [6, 5, 5, 1, 5, 31, 21],
        [6, 6, 6, 1, 6, 30, 22],
        [6, 7, 7, 1, 7, 31, 22],
        [6, 8, 8, 1, 8, 31, 22],
        [6, 9, 9, 1, 9, 30, 22],
        [6, 10, 10, 1, 11, 1, 22],
        [6, 11, 11, 2, 12, 1, 22],
        [6, 12, 12, 2, 12, 31, 22],
        [7, 1, 1, 1, 1, 31, 21],
        [7, 2, 2, 1, 3, 1, 21],
        [7, 3, 3, 2, 3, 31, 22],
        [7, 4, 4, 1, 4, 30, 21],
        [7, 5, 5, 1, 5, 31, 22],
        [7, 6, 6, 1, 6, 30, 22],
        [7, 7, 7, 1, 8, 1, 22],
        [7, 8, 8, 2, 8, 31, 22],
        [7, 9, 9, 1, 9, 30, 22],
        [7, 10, 10, 1, 10, 31, 21],
        [7, 11, 11, 1, 11, 30, 22],
        [7, 12, 12, 1, 12, 31, 22],
        [8, 1, 1, 1, 1, 31, 22],
        [8, 2, 2, 1, 2, 29, 21],
        [8, 3, 3, 1, 3, 31, 22],
        [8, 4, 4, 1, 4, 30, 21],
        [8, 5, 5, 1, 5, 30, 22],
        [8, 6, 5, 31, 6, 30, 22],
        [8, 7, 7, 1, 7, 31, 22],
        [8, 8, 8, 1, 8, 30, 22],
        [8, 9, 8, 31, 9, 30, 21],
        [8, 10, 10, 1, 10, 30, 22],
        [8, 11, 10, 31, 11, 29, 22],
        [8, 12, 11, 30, 12, 31, 22],
        [9, 1, 1, 1, 1, 30, 22],
        [9, 2, 1, 31, 2, 29, 22],
        [9, 3, 3, 1, 3, 31, 21],
        [9, 4, 4, 1, 4, 30, 22],
        [9, 5, 5, 1, 5, 30, 22],
        [9, 6, 5, 31, 6, 30, 21],
        [9, 7, 7, 1, 7, 30, 22],
        [9, 8, 7, 31, 8, 29, 22],
        [9, 9, 8, 30, 9, 30, 22],
        [9, 10, 10, 1, 10, 30, 22],
        [9, 11, 10, 31, 11, 30, 22],
        [9, 12, 12, 1, 12, 31, 22],
        [10, 1, 1, 1, 1, 30, 22],
        [10, 2, 1, 31, 2, 29, 22],
        [10, 3, 3, 1, 3, 31, 21],
        [10, 4, 4, 1, 4, 30, 22],
        [10, 5, 5, 1, 5, 31, 22],
        [10, 6, 6, 1, 6, 30, 21],
        [10, 7, 7, 1, 7, 30, 22],
        [10, 8, 7, 31, 8, 31, 22],
        [10, 9, 9, 1, 9, 30, 22],
        [10, 10, 10, 1, 10, 30, 22],
        [10, 11, 10, 31, 12, 1, 22],
        [10, 12, 12, 2, 12, 31, 22],
        [11, 1, 1, 1, 1, 30, 22],
        [11, 2, 1, 31, 2, 29, 21],
        [11, 3, 3, 1, 3, 31, 22],
        [11, 4, 4, 1, 4, 30, 22],
        [11, 5, 5, 1, 5, 31, 21],
        [11, 6, 6, 1, 6, 30, 22],
        [11, 7, 7, 1, 7, 30, 22],
        [11, 8, 7, 31, 8, 31, 22],
        [11, 9, 9, 1, 9, 30, 22],
        [11, 10, 10, 1, 10, 31, 22],
        [11, 11, 11, 1, 12, 1, 22],
        [11, 12, 12, 2, 12, 31, 22],
        [12, 1, 1, 1, 1, 31, 22],
        [12, 2, 2, 1, 3, 1, 21],
        [12, 3, 3, 2, 3, 31, 22],
        [12, 4, 4, 1, 4, 30, 22],
        [12, 5, 5, 1, 5, 31, 21],
        [12, 6, 6, 1, 6, 30, 22],
        [12, 7, 7, 1, 7, 31, 22],
        [12, 8, 8, 1, 8, 31, 22],
        [12, 9, 9, 1, 9, 30, 22],
        [12, 10, 10, 1, 11, 1, 22],
        [12, 11, 11, 2, 12, 1, 22],
        [12, 12, 12, 2, 12, 31, 22],
        [13, 1, 1, 1, 1, 31, 21],
        [13, 2, 2, 1, 3, 1, 22],
        [13, 3, 3, 2, 3, 31, 22],
        [13, 4, 4, 1, 4, 30, 21],
        [13, 5, 5, 1, 5, 31, 22],
        [13, 6, 6, 1, 6, 30, 22],
        [13, 7, 7, 1, 8, 1, 22],
        [13, 8, 8, 2, 8, 31, 22],
        [13, 9, 9, 1, 9, 30, 22],
        [13, 10, 10, 1, 10, 31, 21],
        [13, 11, 11, 1, 11, 30, 22],
        [13, 12, 12, 1, 12, 31, 22],
        [14, 1, 1, 1, 1, 31, 21],
        [14, 2, 2, 1, 3, 1, 22],
        [14, 3, 3, 2, 3, 31, 22],
        [14, 4, 4, 1, 5, 1, 21],
        [14, 5, 5, 2, 5, 31, 22],
        [14, 6, 6, 1, 6, 30, 22],
        [14, 7, 7, 1, 7, 31, 21],
        [14, 8, 8, 1, 8, 30, 22],
        [14, 9, 8, 31, 9, 30, 22],
        [14, 10, 10, 1, 10, 31, 22],
        [14, 11, 11, 1, 11, 30, 22],
        [14, 12, 12, 1, 12, 31, 21],
    ];
    /**
     * Compute the pattern sequence for the pay period's year.
     *
     * @param {{number}} year
     */
    function GetPatternSequence(year) {
        var idx = (year - PATTERN_SEED_YEAR) % PATTERN_SEQUENCE.length;
        return PATTERN_SEQUENCE[idx];
    }
    /**
     * Get the patterns for the pay period year.
     *
     * @param {{number}} year - The year
     */
    function GetPatterns(year) {
        var seq = GetPatternSequence(year);
        var idx = (seq - 1) * 12;
        return PATTERNS.slice(idx, idx + 12);
    }
    /**
     * Create a PayPeriod object
     *
     * @param {{number}} year - The pay period year.
     * @param {{number}} month - The pay period month (1-12).
     * @param {{number}} startMonth - The starting month (1-12) of the pay period.
     * @param {{number}} startDay - The starting day (1-31) of the pay period.
     * @param {{number}} endMonth - The ending month (1-12) of the pay period.
     * @param {{number}} endDay - The ending day (1-31) of the pay period.
     * @param {{number}} workDays - The number of work days in the pay period.
     */
    function CreatePayPeriod(year, month, startMonth, startDay, endMonth, endDay, workDays) {
        return {
            startDate: new Date(year, startMonth - 1, startDay),
            endDate: new Date(year, endMonth - 1, endDay),
            year: year,
            month: month,
            workDays: workDays,
            workHours: workDays * 8,
        };
    }
    /**
     * Validate the pay period year.
     *
     * @param {{number}} year - The year (1994..2299)
     */
    function ValidateYear(year) {
        if (year < PATTERN_SEED_YEAR || year > YEAR_MAX)
            throw new Error("The year must be between " + PATTERN_SEED_YEAR + " and " + YEAR_MAX);
    }
    /**
     * Validate the pay period month.
     *
     * @param {{number}} month - The month (1..12)
     */
    function ValidateMonth(month) {
        if (month < 1 || month > 12)
            throw new Error("The month must be between 1 and 12.");
    }
    /**
     * Get pay periods for a year. Optionally, only return a single month.
     *
     * @param {{number}} year - The calendar year.
     * @param {{number}} [month] - The month (1..12).
     */
    function GetPayPeriods(year, month) {
        ValidateYear(year);
        var monthStart = 1;
        var monthEnd = 12;
        if (month) {
            ValidateMonth(month);
            monthStart = monthEnd = month;
        }
        return GetPatterns(year)
            .slice(monthStart - 1, monthEnd)
            .map(function (p) {
            return CreatePayPeriod(year, p[COL_MONTH], p[COL_START_MONTH], p[COL_START_DAY], p[COL_END_MONTH], p[COL_END_DAY], p[COL_WORK_DAYS]);
        });
    }
    PayPeriodService.GetPayPeriods = GetPayPeriods;
    /**
     * Get the pay period for a date.
     *
     * @param {{Date}} date - The date
     */
    function GetPayPeriod(date) {
        var year = date.getFullYear();
        ValidateYear(year);
        var month = date.getMonth();
        var day = date.getDate();
        var ps = GetPatterns(year);
        // First try the same month as the date's month...
        var result = CreatePayPeriod(year, ps[month][COL_MONTH], ps[month][COL_START_MONTH], ps[month][COL_START_DAY], ps[month][COL_END_MONTH], ps[month][COL_END_DAY], ps[month][COL_WORK_DAYS]);
        if (date >= result.startDate && date <= result.endDate) {
            return result;
        }
        // Then try the month before...
        if (month > 0) {
            result = CreatePayPeriod(year, ps[month - 1][COL_MONTH], ps[month - 1][COL_START_MONTH], ps[month - 1][COL_START_DAY], ps[month - 1][COL_END_MONTH], ps[month - 1][COL_END_DAY], ps[month - 1][COL_WORK_DAYS]);
            if (date >= result.startDate && date <= result.endDate) {
                return result;
            }
        }
        // Then try the month after...
        if (month < 12) {
            result = CreatePayPeriod(year, ps[month + 1][COL_MONTH], ps[month + 1][COL_START_MONTH], ps[month + 1][COL_START_DAY], ps[month + 1][COL_END_MONTH], ps[month + 1][COL_END_DAY], ps[month + 1][COL_WORK_DAYS]);
            if (date >= result.startDate && date <= result.endDate) {
                return result;
            }
        }
        throw new Error("This error should never happen!");
    }
    PayPeriodService.GetPayPeriod = GetPayPeriod;
})(PayPeriodService || (PayPeriodService = {}));
