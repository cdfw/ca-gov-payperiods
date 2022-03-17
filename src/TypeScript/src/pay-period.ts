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

import {COL_SEQ, COL_MONTH, COL_START_DAY, COL_START_MONTH, COL_END_DAY, COL_END_MONTH, COL_WORK_DAYS} from './pay-period-service'
import {formatDate} from './pay-period-utils'

/**
 * A Pay Period
 */
export interface PayPeriod {
    /**
     * Get the pay-period year.
     */
    get year(): number;
    /**
     * Get the pay-period month.
     */
    get month(): number;
    /**
     * Get the day of the month that
     * the pay-period starts on.
     * See {@link startMonth}
     */
    get startDay(): number;
    /**
     * Get the month that the pay-period
     * starts in; it may be different than
     * the pay-period {@link month}.
     * See {@link startDay}
     */
    get startMonth(): number;
    /**
     * Get the first day of the pay-period
     * as a formatted ISO 8601 date string.
     */
    get firstDay(): string;
    /**
     * Get the day of the month that
     * the pay-period ends on.
     * See {@link endMonth}
     */
    get endDay(): number;
    /**
     * Get the month that the pay-period
     * ends in; it may be different than
     * the pay-period {@link month}.
     */
    get endMonth(): number;
    /**
     * Get the last day of the pay-period
     * as a formatted ISO 8601 date string.
     */
    get lastDay(): string;
    /**
     * Get the number of work days in the
     * pay-period. It is either 21 or 22.
     * The number of work days is based on
     * a standard full-time schedule from
     * Monday thru Friday.
     */
    get workDays(): number;
    /**
     * Get the number of work hours in
     * the pay-period. This is simply
     * the {@link workDays} × 8.0 and
     * is either 168 or 176 hours.
     */
    get workHours(): number;
    /**
     * Get the calendar pattern
     * number used for this
     * pay-period. It is a value
     * between 1 and 14 (inclusive).
     * @see {@link https://www.dgs.ca.gov/Resources/SAM/TOC/8500/8512|SAM 8512}
     */
    get patternNumber(): number;
}

/**
 * An implemention of the {@link PayPeriod} interface.
 */
export class PayPeriodImpl implements PayPeriod {
    private _workHours: number | null = null;
    private _firstDay: string | null = null;
    private _lastDay: string | null = null;

    /**
     * Constructor
     * @param year - The pay-period year. 
     * @param pattern - The pattern data.
     */
    constructor(public readonly year: number, private readonly pattern: Uint8Array) {}
    
    get startDay(): number { return this.pattern[COL_START_DAY]; }
    get startMonth(): number { return this.pattern[COL_START_MONTH]; }
    get firstDay(): string {
        if (this._firstDay === null) {
            this._firstDay = formatDate(this.year, this.startMonth, this.startDay);
        }
        return this._firstDay;
    }
    get endDay(): number { return this.pattern[COL_END_DAY]; }
    get endMonth(): number { return this.pattern[COL_END_MONTH]; }
    get lastDay(): string {
        if (this._lastDay === null) {
            this._lastDay = formatDate(this.year, this.endMonth, this.endDay);
        }
        return this._lastDay;
    }
    
    get workDays(): number { return this.pattern[COL_WORK_DAYS]; }
    
    get workHours(): number {
        if (this._workHours === null) {
            this._workHours = this.workDays * 8;
        }
        return this._workHours;
    }

    get patternNumber(): number { return this.pattern[COL_SEQ]; }

    get month() { return this.pattern[COL_MONTH]; }
}