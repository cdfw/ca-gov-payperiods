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
set ansi_nulls, ansi_padding, ansi_warnings, arithabort, concat_null_yields_null, quoted_identifier on;

set numeric_roundabort off;

go
merge into [dbo].[PayPeriodCalendar] as target
using (values 
(1, 1, 1, 1, 1, 31, 22),
(1, 2, 2, 1, 3, 1, 21),
(1, 3, 3, 2, 3, 31, 22),
(1, 4, 4, 1, 5, 1, 21),
(1, 5, 5, 2, 5, 31, 22),
(1, 6, 6, 1, 6, 30, 22),
(1, 7, 7, 1, 8, 1, 22),
(1, 8, 8, 2, 8, 31, 22),
(1, 9, 9, 1, 9, 30, 21),
(1, 10, 10, 1, 10, 31, 22),
(1, 11, 11, 1, 11, 30, 22),
(1, 12, 12, 1, 12, 31, 21),
(2, 1, 1, 1, 1, 30, 22),
(2, 2, 1, 31, 2, 28, 21),
(2, 3, 3, 1, 3, 31, 22),
(2, 4, 4, 1, 4, 30, 21),
(2, 5, 5, 1, 5, 30, 22),
(2, 6, 5, 31, 6, 30, 22),
(2, 7, 7, 1, 7, 31, 22),
(2, 8, 8, 1, 8, 30, 22),
(2, 9, 8, 31, 9, 30, 21),
(2, 10, 10, 1, 10, 30, 22),
(2, 11, 10, 31, 11, 29, 22),
(2, 12, 11, 30, 12, 31, 22),
(3, 1, 1, 1, 1, 30, 22),
(3, 2, 1, 31, 2, 28, 21),
(3, 3, 3, 1, 3, 31, 21),
(3, 4, 4, 1, 4, 30, 22),
(3, 5, 5, 1, 5, 30, 22),
(3, 6, 5, 31, 6, 30, 21),
(3, 7, 7, 1, 7, 30, 22),
(3, 8, 7, 31, 8, 29, 22),
(3, 9, 8, 30, 9, 30, 22),
(3, 10, 10, 1, 10, 30, 22),
(3, 11, 10, 31, 11, 30, 22),
(3, 12, 12, 1, 12, 31, 22),
(4, 1, 1, 1, 1, 30, 22),
(4, 2, 1, 31, 2, 28, 21),
(4, 3, 3, 1, 3, 31, 21),
(4, 4, 4, 1, 4, 30, 22),
(4, 5, 5, 1, 5, 31, 22),
(4, 6, 6, 1, 6, 30, 21),
(4, 7, 7, 1, 7, 30, 22),
(4, 8, 7, 31, 8, 31, 22),
(4, 9, 9, 1, 9, 30, 22),
(4, 10, 10, 1, 10, 30, 22),
(4, 11, 10, 31, 12, 1, 22),
(4, 12, 12, 2, 12, 31, 22),
(5, 1, 1, 1, 1, 29, 21),
(5, 2, 1, 30, 2, 28, 21),
(5, 3, 3, 1, 3, 31, 22),
(5, 4, 4, 1, 4, 30, 22),
(5, 5, 5, 1, 5, 31, 21),
(5, 6, 6, 1, 6, 30, 22),
(5, 7, 7, 1, 7, 30, 22),
(5, 8, 7, 31, 8, 31, 22),
(5, 9, 9, 1, 9, 30, 22),
(5, 10, 10, 1, 10, 31, 22),
(5, 11, 11, 1, 12, 1, 22),
(5, 12, 12, 2, 12, 31, 22),
(6, 1, 1, 1, 1, 31, 21),
(6, 2, 2, 1, 3, 1, 21),
(6, 3, 3, 2, 3, 31, 22),
(6, 4, 4, 1, 4, 30, 22),
(6, 5, 5, 1, 5, 31, 21),
(6, 6, 6, 1, 6, 30, 22),
(6, 7, 7, 1, 7, 31, 22),
(6, 8, 8, 1, 8, 31, 22),
(6, 9, 9, 1, 9, 30, 22),
(6, 10, 10, 1, 11, 1, 22),
(6, 11, 11, 2, 12, 1, 22),
(6, 12, 12, 2, 12, 31, 22),
(7, 1, 1, 1, 1, 31, 21),
(7, 2, 2, 1, 3, 1, 21),
(7, 3, 3, 2, 3, 31, 22),
(7, 4, 4, 1, 4, 30, 21),
(7, 5, 5, 1, 5, 31, 22),
(7, 6, 6, 1, 6, 30, 22),
(7, 7, 7, 1, 8, 1, 22),
(7, 8, 8, 2, 8, 31, 22),
(7, 9, 9, 1, 9, 30, 22),
(7, 10, 10, 1, 10, 31, 21),
(7, 11, 11, 1, 11, 30, 22),
(7, 12, 12, 1, 12, 31, 22),
(8, 1, 1, 1, 1, 31, 22),
(8, 2, 2, 1, 2, 29, 21),
(8, 3, 3, 1, 3, 31, 22),
(8, 4, 4, 1, 4, 30, 21),
(8, 5, 5, 1, 5, 30, 22),
(8, 6, 5, 31, 6, 30, 22),
(8, 7, 7, 1, 7, 31, 22),
(8, 8, 8, 1, 8, 30, 22),
(8, 9, 8, 31, 9, 30, 21),
(8, 10, 10, 1, 10, 30, 22),
(8, 11, 10, 31, 11, 29, 22),
(8, 12, 11, 30, 12, 31, 22),
(9, 1, 1, 1, 1, 30, 22),
(9, 2, 1, 31, 2, 29, 22),
(9, 3, 3, 1, 3, 31, 21),
(9, 4, 4, 1, 4, 30, 22),
(9, 5, 5, 1, 5, 30, 22),
(9, 6, 5, 31, 6, 30, 21),
(9, 7, 7, 1, 7, 30, 22),
(9, 8, 7, 31, 8, 29, 22),
(9, 9, 8, 30, 9, 30, 22),
(9, 10, 10, 1, 10, 30, 22),
(9, 11, 10, 31, 11, 30, 22),
(9, 12, 12, 1, 12, 31, 22),
(10, 1, 1, 1, 1, 30, 22),
(10, 2, 1, 31, 2, 29, 22),
(10, 3, 3, 1, 3, 31, 21),
(10, 4, 4, 1, 4, 30, 22),
(10, 5, 5, 1, 5, 31, 22),
(10, 6, 6, 1, 6, 30, 21),
(10, 7, 7, 1, 7, 30, 22),
(10, 8, 7, 31, 8, 31, 22),
(10, 9, 9, 1, 9, 30, 22),
(10, 10, 10, 1, 10, 30, 22),
(10, 11, 10, 31, 12, 1, 22),
(10, 12, 12, 2, 12, 31, 22),
(11, 1, 1, 1, 1, 30, 22),
(11, 2, 1, 31, 2, 29, 21),
(11, 3, 3, 1, 3, 31, 22),
(11, 4, 4, 1, 4, 30, 22),
(11, 5, 5, 1, 5, 31, 21),
(11, 6, 6, 1, 6, 30, 22),
(11, 7, 7, 1, 7, 30, 22),
(11, 8, 7, 31, 8, 31, 22),
(11, 9, 9, 1, 9, 30, 22),
(11, 10, 10, 1, 10, 31, 22),
(11, 11, 11, 1, 12, 1, 22),
(11, 12, 12, 2, 12, 31, 22),
(12, 1, 1, 1, 1, 31, 22),
(12, 2, 2, 1, 3, 1, 21),
(12, 3, 3, 2, 3, 31, 22),
(12, 4, 4, 1, 4, 30, 22),
(12, 5, 5, 1, 5, 31, 21),
(12, 6, 6, 1, 6, 30, 22),
(12, 7, 7, 1, 7, 31, 22),
(12, 8, 8, 1, 8, 31, 22),
(12, 9, 9, 1, 9, 30, 22),
(12, 10, 10, 1, 11, 1, 22),
(12, 11, 11, 2, 12, 1, 22),
(12, 12, 12, 2, 12, 31, 22),
(13, 1, 1, 1, 1, 31, 21),
(13, 2, 2, 1, 3, 1, 22),
(13, 3, 3, 2, 3, 31, 22),
(13, 4, 4, 1, 4, 30, 21),
(13, 5, 5, 1, 5, 31, 22),
(13, 6, 6, 1, 6, 30, 22),
(13, 7, 7, 1, 8, 1, 22),
(13, 8, 8, 2, 8, 31, 22),
(13, 9, 9, 1, 9, 30, 22),
(13, 10, 10, 1, 10, 31, 21),
(13, 11, 11, 1, 11, 30, 22),
(13, 12, 12, 1, 12, 31, 22),
(14, 1, 1, 1, 1, 31, 21),
(14, 2, 2, 1, 3, 1, 22),
(14, 3, 3, 2, 3, 31, 22),
(14, 4, 4, 1, 5, 1, 21),
(14, 5, 5, 2, 5, 31, 22),
(14, 6, 6, 1, 6, 30, 22),
(14, 7, 7, 1, 7, 31, 21),
(14, 8, 8, 1, 8, 30, 22),
(14, 9, 8, 31, 9, 30, 22),
(14, 10, 10, 1, 10, 31, 22),
(14, 11, 11, 1, 11, 30, 22),
(14, 12, 12, 1, 12, 31, 21)
) as source ([PayPeriodCalendarId], [PayPeriodMonth],	[StartMonth], [StartDay], [EndMonth], [EndDay],	[WorkDays])
on (source.[PayPeriodCalendarId] = target.[PayPeriodCalendarId] and source.[PayPeriodMonth] = target.[PayPeriodMonth])
when not matched by target then
	insert ([PayPeriodCalendarId], [PayPeriodMonth], [StartMonth], [StartDay], [EndMonth], [EndDay], [WorkDays])
	values (source.[PayPeriodCalendarId], source.[PayPeriodMonth], source.[StartMonth], source.[StartDay], source.[EndMonth], source.[EndDay], source.[WorkDays])
when not matched by source then
	delete
when matched and not(source.StartMonth = target.StartMonth and source.StartDay = target.StartDay and source.EndMonth = target.EndMonth and source.EndDay = target.EndDay and source.WorkDays = target.WorkDays) then
	update
	set [StartMonth] = source.[StartMonth]
	, [StartDay] = source.[StartDay]
	, [EndMonth] = source.[EndMonth]
	, [EndDay] = source.[EndDay]
	, [WorkDays] = source.[WorkDays]
output $action, inserted.*, deleted.*
;
go
