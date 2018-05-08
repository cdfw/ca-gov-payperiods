/****************************************************************************************
	California State Government Pay Periods per the State Administrative Manual
	Section 8500 et seq.

	ONLINE: https://www.documents.dgs.ca.gov/sam/SamPrint/new/sam_master/sam_master_file/chap8500/8512.pdf

	MIT License

	Copyright (c) 2018 eric-miller-cdfw

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

 ****************************************************************************************/
go
create function [dbo].[GetPayPeriodForDate] (@date date) returns table
as return (
	select datepart(year, @date) as [Year], c.[PayPeriodMonth] as [Month]
		, datefromparts(datepart(year, @date), c.[StartMonth], c.[StartDay]) as [StartDate]
		, datefromparts(datepart(year, @date), c.[EndMonth], c.[EndDay]) as [EndDate]
		, c.[WorkDays]
		, c.[WorkDays] * 8 as [WorkHours]
		from [dbo].[PayPeriodCalendar] c
		inner join [dbo].[PayPeriodSequence] s
		on c.[PayPeriodCalendarId] = s.[PayPeriodCalendarId]
		and s.[IndexValue] = (((datepart(year, @date) - 1994) % 28) + 1)
		where @date between 
			datefromparts(datepart(year, @date), c.[StartMonth], c.[StartDay]) and
			datefromparts(datepart(year, @date), c.[EndMonth], c.[EndDay])
);
go

