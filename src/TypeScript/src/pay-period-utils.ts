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

import { PayPeriod } from "./pay-period";

/**
 * Is a date in a pay period?
 * @param {PayPeriod} payPeriod - The pay period.
 * @param {string | Date} date - The date as an ISO 8601 string
 * @returns {boolean} true if the date is in the payPeriod.
 */
 export function contains(payPeriod: PayPeriod, date: string | Date): boolean {
    let _date: string;
    if (typeof date === 'string')
        _date = date;
    else if (date instanceof Date) {
        _date = toISODate(<Date>date);
    }
    else {
        return false;
    }
    return payPeriod.firstDay <= _date && _date <= payPeriod.lastDay;
}

/**
 * Left-pad some value as a string with a minimum length.
 * @param {any} src - The value to left pad. It will be converted to a string, if necessary.
 * @param {number} length - The minimum length of the resulting string.
 * @param {string} [c=" "] - The padding character.
 * @returns {string} The left-padded result.
 */
export function padLeft(src: any, length: number, c = " "): string {
    let result = "";
    if (src !== null && src !== undefined)
        result = src.toString();
    const _c = c.length === 1 ? c : c.length > 1 ? c[0] : " ";
    if (result.length < length) {
        result = _c.repeat(length - result.length) + result;
    }
    return result;
}

/**
 * Format a date object as an ISO 8601 date string (ignoring any time component).
 * @param {Date} date - The date object.
 * @returns {string} The date string.
 */
export function toISODate(date: Date): string {
    return `${date.getFullYear()}-${padLeft(date.getMonth() + 1,2,"0")}-${padLeft(date.getDate(),2,"0")}`;
}

/**
 * Format the date parts as an ISO 8601 date string.
 * @param year - The year. 
 * @param month - The month (1..12).
 * @param day - The day of the month.
 * @returns The formatted date.
 */
export function formatDate(year: number, month: number, day: number): string {
    return `${padLeft(year,4,"0")}-${padLeft(month,2,"0")}-${padLeft(day,2,"0")}`;
}