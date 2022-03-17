# CA Gov Pay Periods API in TypeScript (JavaScript)

A Pay Periods API for standard monthly pay periods
for California State Government as defined in the
[State Administrative Manual](https://www.dgs.ca.gov/Resources/SAM) 
[section 8500](https://www.dgs.ca.gov/Resources/SAM/TOC/8500).

Standardized montly calendars are defined from 1994 thru 2299. The repeating pattern fails in 2300.

## `PayPeriodService`

The `PayPeriodService` is the primary namespace for the Pay Periods API.

### `PayPeriod` interface

The `PayPeriod` interface defines a single Pay Period.

- `startDate` {Date} - The first day of the Pay Period.
- `endDate` {Date} - The last day of the Pay Period.
- `year` {Number} - The year of the Pay Period.
- `month` {Number} - The month (1..12) of the Pay Period.
- `workDays` {Number} - The work days for the month (21 or 22).
- `workHours` {Number} - The work hours for the month (8 &times; `workDays`).

### `GetPayPeriods` function

The `GetPayPeriods` function returns either a full year's or single month's `PayPeriod` as an array.

#### Function Arguments

- `year` {Number} - The year to fetch. Must be between 1994 and 2299 (inclusive).
- `month` {Number} - Optional month (1..12). When specified, only one month is returned. Must be between 1 and 12 (inclusive).

#### Examples

```js
// Get a year.
var result = PayPeriodService.GetPayPeriods(2020);

// Get a single month.
var result = PayPeriodService.GetPayPeriods(2020, 7);
```

### `GetPayPeriod` function

The `GetPayPeriod` function returns a single `PayPeriod` for the given `Date` argument. The `Date` must have a year between 1994 and 2299.

#### Function Arguments

- `date` {Date} - The date of interest.

#### Examples

```js
// Construct the date 2020-07-31.
var date = new Date(2020, 6, 31);
var pp = PayPeriodService.GetPayPeriod(date);
// Returns the Pay Period for August 2020!
```

## `PayPeriodService` *iCalendar* functions

### `toEventCalendar` function

A very simple function to export one or more
`PayPeriod` objects as *events* to an *iCalendar*
formatted string.

*NOTE: The `DTEND` value is the day after the `PayPeriod.endDate`
because *iCalendar* calendars do not include the `DTEND` in the
time period. This can be a little confusing in a Calendar's
description of the event. The `DESCRIPTION` explicitly notes
the first and lat* 

#### Function Arguments

- `payPeriods` {`PayPeriod[]`} - The array of pay periods to write as *iCalendar* events.
- `name?` {`string`} - An optional name for the calendar. If not specified *Pay Periods* will be used.

#### Examples

```js
// Get pay periods for 2020...
var payPeriods = PayPeriodService.GetPayPeriods(2020);

// Get iCalendar representation...
var ics = PayPeriodService.toEventCalendar(payPeriods, "2020 Pay Periods");
```

```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:CA-GOV-PAYPERIOD
X-WR-CALNAME:2020 Pay Periods
BEGIN:VEVENT
UID:CA-GOV-PAYPERIOD-2020-01
DTSTAMP:20200731T190554Z
DTSTART:20200101
DTEND:20200131
SUMMARY:January 2020
DESCRIPTION:January 2020 Pay Period
 \nFirst Day: 1/1/2020
 \nLast Day: 1/30/2020
 \nWork Days: 21
 \nWork Hours: 168
END:VEVENT
...
END:VCALENDAR
```