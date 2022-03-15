import * as PayPeriodUtils from './pay-period-utils';
import { PayPeriod } from './pay-period';

describe("Pay Period Utilities", () => {

    describe("Convert a Date object to an ISO date string", () => {
        it("Should be equal", () => {
            const srcDate = new Date(2018, 9, 31);
            const expectDate = "2018-10-31";
            expect(PayPeriodUtils.toISODate(srcDate))
                .toBe(expectDate);    
        });
        it("Should not be equal", () =>{
            const srcDate = new Date(2018, 9, 31);
            const expectDate = "2020-10-31";
            expect(PayPeriodUtils.toISODate(srcDate))
                .not
                .toBe(expectDate);    
        });
    });

    describe("Left-pad objects.", () => {
        it("'undefined' should be equal to '  '", () => {
            expect(PayPeriodUtils.padLeft(undefined, 2))
                .toBe("  ");
        });
        it("42 left-pad to five zeros should equal '00042'", ()=>{
            expect(PayPeriodUtils.padLeft(42, 5, "0"))
                .toBe("00042");
        });
        it("[object Object] left-pad to 20 with '*' should be '*****[object Object]'", () => {
            expect(PayPeriodUtils.padLeft({}, 20, "*"))
                .toBe('*****[object Object]');
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
        const bdt = new Date(2021, 12, 31);
        const bsdt = "2022-03-02";
        it("The pay-period contains the date object", () => {
            expect(PayPeriodUtils.contains(pp, dt))
                .toBeTruthy();
        });
        it ("The pay-period contains the date string", () => {
            expect(PayPeriodUtils.contains(pp, sdt))
                .toBeTruthy();
        });
        it("The pay-period does not contain the date object", () => {
            expect(PayPeriodUtils.contains(pp, bdt))
                .toBeFalsy();
        });
        it("The pay-period doew not contain the date string,", () => {
            expect(PayPeriodUtils.contains(pp, bsdt))
                .toBeFalsy();
        });
    });
});
