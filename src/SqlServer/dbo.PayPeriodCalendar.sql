/****************************************************************************************
	California State Government Pay Periods per the State Administrative Manual
	Section 8500 et seq.

	ONLINE: https://www.documents.dgs.ca.gov/sam/SamPrint/new/sam_master/sam_master_file/chap8500/8512.pdf

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

 ****************************************************************************************/
go
create table [dbo].[PayPeriodCalendar]
(
	[PayPeriodCalendarId] tinyint not null,
	[PayPeriodMonth] tinyint not null,
	[StartMonth] tinyint not null,
	[StartDay] tinyint not null,
	[EndMonth] tinyint not null,
	[EndDay] tinyint not null,
	[WorkDays] tinyint not null,

	constraint [PK_PayPeriodCalendar] primary key ([PayPeriodCalendarId], [PayPeriodMonth]),
	-- There are 14 calendars (1..14)
	constraint [CK_PayPeriodCalendar_PayPeriodCalendarId_Range] check([PayPeriodCalendarId] > 0 and [PayPeriodCalendarId] < 15),
	-- There are 12 months (1..12)
	constraint [CK_PayPeriodCalendar_PayPeriodMonth_Range] check([PayPeriodMonth] > 0 and [PayPeriodMonth] < 13),
	constraint [CK_PayPeriodCalendar_StartMonth_Range] check([StartMonth] > 0 and [StartMonth] < 13),
	constraint [CK_PayPeriodCalendar_EndMonth_Range] check([EndMonth] > 0 and [EndMonth] < 13),
	-- There are 1 to 28, or 29, or 30 or 31 days...
	constraint [CK_PayPeriodCalendar_StartDay_Range] check(
		([StartMonth] in (1,3,5,7,8,10,12) and [StartDay] <= 31) or
		([StartMonth] in (4,6,9,11) and [StartDay] <= 30) or
		([StartMonth] in (2) and [StartDay] <= 29)
		),
	constraint [CK_PayPeriodCalendar_EndDay_Range] check(
		([EndMonth] in (1,3,5,7,8,10,12) and [EndDay] <= 31) or
		([EndMonth] in (4,6,9,11) and [EndDay] <= 30) or
		([EndMonth] in (2) and [EndDay] <= 29)
		),
	-- There are 21 or 22 Work Days in a calendar based on M-F, 8hr day
	constraint [CK_PayPeriodCalendar_WorkDays_Range] check([WorkDays] in (21, 22))
);
go