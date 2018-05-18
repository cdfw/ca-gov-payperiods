var MonthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

var PayPeriodNavigationLink = {
    view: function (vnode) {
        let year = vnode.attrs.year;
        let text = vnode.attrs.text;
        if (year && text)
            return m(".pp-nav",
                m("a", { href: "/" + year, oncreate: m.route.link, onupdate: m.route.link }, text)
            );
        else
            return m(".pp-nav", "");
    }
}

var PayPeriodCalendar = {
    view: function (vnode) {
        let year = vnode.attrs.year * 1;
        if (year < 1994 || year > 2299) {
            return m(".pp",
                m("h2.error", "Pay periods are only defined from the year 1994 to the year 2299."),
                m(PayPeriodNavigationLink, { year: (new Date()).getFullYear(), text: "View the current year's pay period." }));
        }
        let prevYear = year > 1994 ? year - 1 : null;
        let nextYear = year < 2299 ? year + 1 : null;
        console.debug("PayPeriodCalendar: " + JSON.stringify({ prevYear: prevYear, year: year, nextYear: nextYear }));
        let payPeriods = PayPeriodService.GetPayPeriods(year);
        return m(".pp",
            m("h2", year),
            m(".pp-nav",
                m(PayPeriodNavigationLink, { year: prevYear, text: prevYear }),
                m(PayPeriodNavigationLink, { year: nextYear, text: nextYear })
            ),
            m(".pp-months",
                payPeriods.map(function (payPeriod) {
                    return m(PayPeriodMonth, { payPeriod: payPeriod });
                })
            )
        );
    }
}

var PayPeriodMonth = {
    view: function (vnode) {
        let payPeriod = vnode.attrs.payPeriod;
        console.debug("PayPeriodMonth: " + JSON.stringify({ year: payPeriod.year, month: payPeriod.month }));
        return m(".pp-month",
            m("table",
                m("caption", MonthNames[payPeriod.month - 1] + ", " + payPeriod.year.toString()),
                m(PayPeriodHeading),
                m(PayPeriodBody, { payPeriod: payPeriod })
            )
        );
    }
}

var PayPeriodHeading = {
    view: function (vnode) {
        return m("thead",
            m("tr",
                m("th", "Sun"),
                m("th", "Mon"),
                m("th", "Tue"),
                m("th", "Wed"),
                m("th", "Thu"),
                m("th", "Fri"),
                m("th", "Sat")
            ));
    }
}

var PayPeriodBody = {
    view: function (vnode) {
        let payPeriod = vnode.attrs.payPeriod;
        let mFirst = moment(payPeriod.startDate);
        let firstDayOfWeek = payPeriod.startDate.getDay();
        if (firstDayOfWeek > 0)
            mFirst.add(-firstDayOfWeek, "days");
        let nWeeks = -mFirst.diff(payPeriod.endDate, "weeks") + 1;
        let weeks = [];
        for (var i = 0; i < nWeeks; i++) {
            weeks.push({ firstDate: moment(mFirst).add(i, "week"), payPeriod: payPeriod });
        }
        console.debug("PayPeriodBody: " + JSON.stringify({ mFirst: mFirst, nWeeks: nWeeks, weeks: weeks }));
        return m("tbody",
            weeks.map(function (week) {
                return m(PayPeriodWeek, week)
            })
        );
    }
}

var PayPeriodWeek = {
    view: function (vnode) {
        let firstDate = vnode.attrs.firstDate;
        let days = [0, 1, 2, 3, 4, 5, 6];
        console.debug("PayPeriodWeek: " + JSON.stringify({ firstDate: firstDate, days: days }));
        return m("tr",
            days.map(function (dayOfWeek) {
                return m(PayPeriodDay, {
                    payPeriod: vnode.attrs.payPeriod,
                    firstDate: firstDate,
                    addDays: dayOfWeek
                });
            })
        )
    }
}

var PayPeriodDay = {
    view: function (vnode) {
        let payPeriod = vnode.attrs.payPeriod;
        let mDay = moment(vnode.attrs.firstDate).add(vnode.attrs.addDays, "days");
        let css = "pp-day ";
        if (mDay.month() == (payPeriod.month - 1)) { css += " pp-in"; }
        else { css += " pp-out"; }
        if (mDay.isBetween(payPeriod.startDate, payPeriod.endDate, 'date', '[]')) { css += " pp-month-day"; }
        if (mDay.isSame(payPeriod.startDate)) { css += " pp-start"; }
        if (mDay.isSame(payPeriod.endDate)) { css += " pp-end"; }
        let day = mDay.date();
        console.debug("PayPeriodDay: " + JSON.stringify({ mDay: mDay, css: css, day: day }));
        return m("td", { "class": css }, day);
    }
}
