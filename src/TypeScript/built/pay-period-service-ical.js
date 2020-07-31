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
 * Export Pay Periods to iCalendar events and calendar entries.
 *
 * @copyright California Department of Fish and Wildlife 2020
 * @author Eric G. Miller
 * @version 1.0
 */
var PayPeriodService;
(function (PayPeriodService) {
    // NOTES: 
    // This export is very simplistic.
    // A better implementation would handle line breaking
    // better. We just try to avoid long lines and manually
    // handle potential long lines in the DESCRIPTION field.
    /**
     * Given an array of pay periods, return a string formatted as
     * an iCalendar file with the pay periods as events.
     *
     * @param payPeriods One or more payperiods to write as events in the calendar.
     */
    function toEventCalendar(payPeriods, name) {
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
    PayPeriodService.toEventCalendar = toEventCalendar;
    function toVEvent(pp) {
        const sYear = pp.year.toString(); // should always be four digits...
        const sMonth = (pp.month < 10 ? "0" : "") + pp.month.toString();
        const monthName = ["January", "February", "March", "April", "May",
            "June", "July", "August", "September",
            "October", "November", "December"][pp.month - 1];
        const now = new Date();
        // ISO string with hypens, colons, or fractions of a second.
        const dtStamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
        // ISO date only with no hyphens
        const localStart = new Date(pp.startDate.getUTCFullYear(), pp.startDate.getUTCMonth(), pp.startDate.getUTCDate());
        const localEnd = new Date(pp.endDate.getUTCFullYear(), pp.endDate.getUTCMonth(), pp.endDate.getUTCDate());
        const dtStart = pp.startDate.toISOString().replace(/T.*$/, "").replace(/[-]/g, "");
        // Must add one day to endDate (up to, not including...)
        const endDate = new Date(Date.UTC(pp.endDate.getUTCFullYear(), pp.endDate.getUTCMonth(), pp.endDate.getUTCDate() + 1));
        const dtEnd = endDate.toISOString().replace(/T.*$/, "").replace(/[-]/g, "");
        var result = "";
        result += "BEGIN:VEVENT\n";
        result += `UID:CA-GOV-PAYPERIOD-${sYear}-${sMonth}\n`;
        result += `DTSTAMP:${dtStamp}\n`;
        result += `DTSTART:${dtStart}\n`;
        result += `DTEND:${dtEnd}\n`;
        result += `SUMMARY:${monthName} ${sYear}\n`;
        result += `DESCRIPTION:${monthName} ${sYear} Pay Period\n`;
        result += ` \\nFirst Day: ${localStart.toLocaleDateString()}\n`;
        result += ` \\nLast Day: ${localEnd.toLocaleDateString()}\n`;
        result += ` \\nWork Days: ${pp.workDays}\n`;
        result += ` \\nWork Hours: ${pp.workHours}\n`;
        result += "END:VEVENT\n";
        return result;
    }
})(PayPeriodService || (PayPeriodService = {}));
