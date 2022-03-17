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

/**
 * California State Government Pay Period API.
 * @copyright Copyright (c) 2018-2022 California Department of Fish and Wildlife
 * @author Eric G. Miller
 * @version 3.0.0
 */
import { PayPeriod } from "./pay-period";
import { padLeft } from "./pay-period-utils";

/**
 * Given an array of pay periods, return a string formatted as
 * an iCalendar message with the pay periods as events.
 * @example
 * ```javascript
 * // Get the pay periods for a year.
 * const payPeriods = getPayPeriods(2020);
 * // Get the iCalendar representation of that year.
 * const msg = ical(payPeriods, "2020 Pay Periods");
 * ```
 * ```text
 * BEGIN:VCALENDAR
 * VERSION:2.0
 * PRODID:CA-GOV-PAYPERIOD
 * X-WR-CALNAME:2020 Pay Periods
 * BEGIN:VEVENT
 * UID:CA-GOV-PAYPERIOD-2020-01
 * DTSTAMP:20200731T190554Z
 * DTSTART:20200101
 * DTEND:20200131
 * SUMMARY:January 2020
 * DESCRIPTION:January 2020 Pay Period
 *  \nFirst Day: 2020-01-01
 *  \nLast Day: 2020-01-30
 *  \nWork Days: 22
 *  \nWork Hours: 176
 * END:VEVENT
 * ...
 * END:VCALENDAR
 * ```
 * @param {Array<PayPeriod>} payPeriods - One or more payperiods to write as events in the calendar.
 * @param {string} [name] - (default: "Pay Periods") Optional name for the calendar.
 * @returns {string} The pay periods formatted into an iCalendar message.
 */
export function ical(payPeriods: PayPeriod[], name?: string) : string {
    const calName = name || "Pay Periods";
    let result = "";
    result += "BEGIN:VCALENDAR\n";
    result += "VERSION:2.0\n";
    result += "PRODID:CA-GOV-PAYPERIOD\n";
    result += `X-WR-CALNAME:${calName}\n`;
    for(const pp of payPeriods){
        result += toVEvent(pp);
    }
    result += "END:VCALENDAR\n";
    return result;
}

/**
 * Convert a single pay period to an iCalendar event entry.
 * @param {PayPeriod} pp - The pay period.
 * @returns {string} The iCalendar event text.
 */
function toVEvent(pp: PayPeriod) : string
{        
    const sYear = pp.year.toString(); // should always be four digits...
    const sMonth = padLeft(pp.month, 2, "0");
    const monthName = MONTH_NAMES[pp.month - 1];
    const now = new Date();
    // ISO string without hypens, colons, or fractions of a second.
    const dtStamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
    // ISO date only with no hyphens
    // Must add one day to endDate (up to, not including...)
    const endDate = new Date(pp.lastDay);
    endDate.setUTCDate(endDate.getUTCDate() + 1);
    const dtEnd = endDate.getUTCFullYear().toString()
        + padLeft((endDate.getUTCMonth() + 1), 2, "0")
        + padLeft(endDate.getUTCDate(), 2, "0")    
        ;
    let result = "";
    result += "BEGIN:VEVENT\n";
    result += `UID:CA-GOV-PAYPERIOD-${sYear}-${sMonth}\n`;
    result += `DTSTAMP:${dtStamp}\n`;
    result += `DTSTART:${pp.firstDay.replace(/-/g,"")}\n`;
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

/**
 * Month names (English)
 */
const MONTH_NAMES = Object.freeze([
    "January", "February", "March"
    , "April", "May", "June"
    , "July", "August", "September"
    , "October", "November", "December"
]);
