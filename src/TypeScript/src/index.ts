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
export {PayPeriod} from './pay-period';
export {getPayPeriod, getPayPeriods, getPayPeriodForMonth, YEAR_MAX, YEAR_MIN, MONTH_MAX, MONTH_MIN } from './pay-period-service';
export {ical} from './pay-period-ical';