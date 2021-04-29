/*!
MIT License

Copyright (c) 2018-2021 State of California, Department of Fish and Wildlife

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
 * @copyright Copyright (c) 2018-2021 California Department of Fish and Wildlife
 * @author Eric G. Miller
 * @version 2.0.1
 */
declare namespace PayPeriodService {
    /**
     * A Pay Period
     */
    interface PayPeriod {
        /**
         * The starting date of the pay period
         * @deprecated Use firstDay instead.
         */
        readonly startDate: Date;
        /**
         * The ending date of the pay period
         * @deprecated Use lastDay instead.
         */
        readonly endDate: Date;
        /**
         * The pay period year
         */
        readonly year: number;
        /**
         * the pay period month (1-12)
         */
        readonly month: number;
        /**
         * The first day of the pay period as an ISO 8601 date.
         */
        readonly firstDay: string;
        /**
         * The last day of the pay period as an ISO 8601 date.
         */
        readonly lastDay: string;
        /**
         * The number of work days in the pay period
         */
        readonly workDays: number;
        /**
         * The number of work hours in the pay period
         * assuming an eight-hour work day.
         */
        readonly workHours: number;
    }
    /**
     * Get the pay period for a date. The time of day is ignored.
     *
     * @param {{Date}} date - The date
     */
    function getPayPeriod(date: Date): PayPeriod;
    /**
     * Get pay periods for a year. Optionally, only return a single month.
     *
     * @param {{number}} year - The calendar year.
     * @param {{number}} [month] - The month (1..12).
     */
    function getPayPeriods(year: number, month?: number): Array<PayPeriod>;
    /**
     * Given an array of pay periods, return a string formatted as
     * an iCalendar file with the pay periods as events.
     *
     * @param {{PayPeriod[]}} payPeriods One or more payperiods to write as events in the calendar.
     * @param {{string}} [name] (default: "Pay Periods") Optional name for the calendar.
     */
    function ical(payPeriods: PayPeriod[], name?: string): string;
    const YEAR_MIN = 1994;
    /**
     * The minimum month number.
     */
    const MONTH_MIN = 1;
    /**
     * The maximum month number.
     */
    const MONTH_MAX = 12;
    /**
     * The maximun year supported.
     */
    const YEAR_MAX = 2299;
}
