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
create table [dbo].[PayPeriodSequence] (
	-- The sequences' index 1..28
	[IndexValue] tinyint not null,
	-- The pay period calendar 1..14
	[PayPeriodCalendarId] tinyint not null,
	constraint [PK_PayPeriodSequence] primary key ([IndexValue]),
	constraint [CK_PayPeriodSequence_IndexValue_Range] check ([IndexValue] > 0 and [IndexValue] < 29),
	-- There are 14 calendars (1..14)
	constraint [CK_PayPeriodSequence_PayPeriodCalendarId_Range] check([PayPeriodCalendarId] > 0 and [PayPeriodCalendarId] < 15),
);
go