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
merge into [dbo].[PayPeriodSequence] as target
using (values 
  (1, 7)
, (2, 1)
, (3, 9)
, (4, 4)
, (5, 5)
, (6, 6)
, (7, 14)
, (8, 2)
, (9, 3)
, (10, 4)
, (11, 12)
, (12, 7)
, (13, 1)
, (14, 2)
, (15, 10)
, (16, 5)
, (17, 6)
, (18, 7)
, (19, 8)
, (20, 3)
, (21, 4)
, (22, 5)
, (23, 13)
, (24, 1)
, (25, 2)
, (26, 3)
, (27, 11)
, (28, 6)
) as source ([IndexValue], [PayPeriodCalendarId])
on (target.IndexValue = source.IndexValue)
when matched and not(source.PayPeriodCalendarId = target.PayPeriodCalendarId) then
	update
	set [PayPeriodCalendarId] = source.PayPeriodCalendarId
when not matched by target then
	insert ([IndexValue], [PayPeriodCalendarId])
	values (source.[IndexValue], source.[PayPeriodCalendarId])
when not matched by source then
	delete
output $action, inserted.*, deleted.*
;
go
