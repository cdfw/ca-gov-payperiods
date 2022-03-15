import { describe, it } from 'mocha';
import { expect } from 'chai';
import * as PayPeriodUtils from '../src/pay-period-utils.js';
import { PayPeriod } from '../src/pay-period.js';

describe("Pay Period Utilities", () => {

    describe("Convert a Date object to an ISO date string", () => {
        it("Should be equal", () => {
            const srcDate = new Date(2018, 9, 31);
            const expectDate = "2018-10-31";
            expect(PayPeriodUtils.toISODate(srcDate))
                .to
                .equal(expectDate);    
        });
        it("Should not be equal", () =>{
            const srcDate = new Date(2018, 9, 31);
            const expectDate = "2020-10-31";
            expect(PayPeriodUtils.toISODate(srcDate))
                .to
                .not
                .equal(expectDate);    
        });
    });

    describe("Left-pad objects.", () => {
        it("'undefined' should be equal to '  '", () => {
            expect(PayPeriodUtils.padLeft(undefined, 2))
                .to
                .equal("  ");
        });
        it("42 left-pad to five zeros should equal '00042'", ()=>{
            expect(PayPeriodUtils.padLeft(42, 5, "0"))
                .to.equal("00042");
        });
        it("[object Object] left-pad to 20 with '*' should be '*****[object Object]'", () => {
            expect(PayPeriodUtils.padLeft({}, 20, "*"))
                .to.equal('*****[object Object]');
        });
    });

    describe("contains(PayPeriod, Date) truthiness", () => {
        const pp = <PayPeriod>{
            year: 2022,
            month: 2,
            workDays: 22,
            workHours: 176,
            firstDay: "2022-02-01",
            lastDay: "2022-03-01"
        };
        const dt = new Date(2022, 1, 15);
        const sdt = "2022-02-28";
        it("The pay-period contains the date object", () => {
            expect(PayPeriodUtils.contains(pp, dt))
                .to.true;
        });
        it ("The pay-period contains the date string", () => {
            expect(PayPeriodUtils.contains(pp, sdt))
                .to.true;
        });
    });
});
