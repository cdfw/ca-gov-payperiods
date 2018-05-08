# CA GOV Pay Periods - Sql Server

This is a SQL Server implementation of the CA GOV Pay Periods.

## Tables

### PayPeriodCalendar

This table contains the fourteen pay period calendar patterns. Each pattern has a record for each month of the year.

* PayPeriodCalendarId (tinyint, PK) - The calendar pattern ID.
* PayPeriodMonth (tinyint, PK) - The calendar month number (1..12).
* StartMonth (tinyint) - The month number (1..12) for the first day in the Pay Period.
* StartDay (tinyint) - The day of the month (1..31) for the first day in the Pay Period.
* EndMonth (tinyint) - The month number (1..12) for the last day in the Pay Period.
* EndDay (tinyint) - The day of the month (1..31) for the last day in the Pay Period.
* WorkDays (tinyint) - The number of work days for the Pay Period based on M-F work week.

### PayPeriodSequence

This table contains the repeating sequence of PayPeriodCalendars with *IndexValue* 1 corresponding to the initial year of 1994.

* IndexValue (tinyint, PK) - The ordering index 1..28 for the repeating sequence. 
* PayPeriodCalendarId (tinyint) - The Pay Period Calendar for the index value.

## Functions

### GetPayPeriods

This table-valued function returns either all of the pay-periods for a year, or the specific pay-period for a month. The first argument, @year, is the year (1994-2299). The second argument, @month, is the month (1-12) and may be null to return all of the relevant info for the year.


	declare @year int = 2018;
	declare @month int = 10;
	select * from GetPayPeriods(@year, @month);

	+---------------------------------------------------------------+
	| Year | Month | StartDate  |   EndDate  | WorkDays | WorkHours |
	+------+-------+------------+------------+----------+-----------+
	| 2018 |  10   | 2018-10-01 | 2018-10-30 |    22    |    176    |
	+---------------------------------------------------------------+

### GetPayPeriodForDate

This table-valued function returns at most one record for a specific date. It returns the Pay Period data for the pay-period that includes the specified @date argument.  

	declare @date date = '2018-08-31';
	select * from [dbo].[GetPayPeriodForDate] (@date);

	+---------------------------------------------------------------+
	| Year | Month | StartDate  |   EndDate  | WorkDays | WorkHours |
	+------+-------+------------+------------+----------+-----------+
	| 2018 |   9   | 2018-08-31 | 2018-09-30 |    21    |    168    |
	+---------------------------------------------------------------+
