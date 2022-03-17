import * as PayPeriodService from './main'

describe("PayPeriodService main tests", () => {
  it("PayPeriodService.YEAR_MIN is 1994", () => {
    expect(PayPeriodService.YEAR_MIN).toBe(1994);
  });
  it("PayPeriodService.YEAR_MAX is 2299", () => {
    expect(PayPeriodService.YEAR_MAX).toBe(2299);
  });
  it("PayPeriodService.MONTH_MIN is 1", ()=>{
    expect(PayPeriodService.MONTH_MIN).toBe(1);
  });
  it("PayPeriodService.MONTH_MAX is 12", ()=>{
    expect(PayPeriodService.MONTH_MAX).toBe(12);
  });
  it("PayPeriodService.getPayPeriod by a Date object should be valid", () =>{
    const theDate = new Date(2022, 2, 15);
    const pp = PayPeriodService.getPayPeriod(theDate);
    expect(pp).not.toBeNull();
    expect(pp.year).toBeGreaterThanOrEqual(PayPeriodService.YEAR_MIN);
    expect(pp.year).toBeLessThanOrEqual(PayPeriodService.YEAR_MAX);
    expect(pp.month).toBeGreaterThanOrEqual(PayPeriodService.MONTH_MIN);
    expect(pp.month).toBeLessThanOrEqual(PayPeriodService.MONTH_MAX);
    expect(pp.year).toBe(theDate.getFullYear());
    expect(pp.month).toBe(theDate.getMonth() + 1);
    expect(pp.firstDay < pp.lastDay).toBeTruthy();
    expect(pp.firstDay).toBe("2022-03-02");
    expect(pp.lastDay).toBe("2022-03-31");
    expect(pp.workDays).toBe(22);
    expect(pp.workHours).toBe(176);
  });
  it("PayPeriodService.getPayPeriod by string object should be valid", () => {
    const theYear = 2022;
    //const theMonth = 8;
    const thePPMonth = 7;
    //const theDay = 1;
    const theDate = "2022-08-01";
    const pp = PayPeriodService.getPayPeriod(theDate);
    expect(pp).not.toBeNull();
    expect(pp.year).toBeGreaterThanOrEqual(PayPeriodService.YEAR_MIN);
    expect(pp.year).toBeLessThanOrEqual(PayPeriodService.YEAR_MAX);
    expect(pp.month).toBeGreaterThanOrEqual(PayPeriodService.MONTH_MIN);
    expect(pp.month).toBeLessThanOrEqual(PayPeriodService.MONTH_MAX);
    expect(pp.year).toBe(theYear);
    expect(pp.month).toBe(thePPMonth);
    expect(pp.firstDay < pp.lastDay).toBeTruthy();
    expect(pp.firstDay).toBe("2022-07-01");
    expect(pp.lastDay).toBe("2022-08-01");
    expect(pp.workDays).toBe(22);
    expect(pp.workHours).toBe(176);
  });
  it("PayPeriodService.getPayPeriodForMonth(2022, 8) should be between 2022-08-02 and 2022-08-31", () => {
    const theYear = 2022;
    const theMonth = 8;
    const pp = PayPeriodService.getPayPeriodForMonth(theYear, theMonth);
    expect(pp).not.toBeNull();
    expect(pp.year).toBeGreaterThanOrEqual(PayPeriodService.YEAR_MIN);
    expect(pp.year).toBeLessThanOrEqual(PayPeriodService.YEAR_MAX);
    expect(pp.month).toBeGreaterThanOrEqual(PayPeriodService.MONTH_MIN);
    expect(pp.month).toBeLessThanOrEqual(PayPeriodService.MONTH_MAX);
    expect(pp.year).toBe(theYear);
    expect(pp.month).toBe(theMonth);
    expect(pp.firstDay < pp.lastDay).toBeTruthy();
    expect(pp.firstDay).toBe("2022-08-02");
    expect(pp.lastDay).toBe("2022-08-31");
    expect(pp.workDays).toBe(22);
    expect(pp.workHours).toBe(176);
  });
  it("PayPeriodService.getPayPeriods(2022, 8) should be between 2022-08-02 and 2022-08-31", () => {
    const theYear = 2022;
    const theMonth = 8;
    const pps = PayPeriodService.getPayPeriods(theYear, theMonth);
    expect(pps).not.toBeNull();
    expect(pps.length).toBe(1);
    const pp = pps[0];
    expect(pp).not.toBeNull();
    expect(pp.year).toBeGreaterThanOrEqual(PayPeriodService.YEAR_MIN);
    expect(pp.year).toBeLessThanOrEqual(PayPeriodService.YEAR_MAX);
    expect(pp.month).toBeGreaterThanOrEqual(PayPeriodService.MONTH_MIN);
    expect(pp.month).toBeLessThanOrEqual(PayPeriodService.MONTH_MAX);
    expect(pp.year).toBe(theYear);
    expect(pp.month).toBe(theMonth);
    expect(pp.firstDay < pp.lastDay).toBeTruthy();
    expect(pp.firstDay).toBe("2022-08-02");
    expect(pp.lastDay).toBe("2022-08-31");
    expect(pp.workDays).toBe(22);
    expect(pp.workHours).toBe(176);
  });
  it("PayPeriodService.getPayPeriods(2022) should return whole 2022 year.", () => {
    const theYear = 2022;
    const pps = PayPeriodService.getPayPeriods(theYear);
    expect(pps).not.toBeNull();
    expect(pps.length).toBe(12);
    const allowedWorkDays = Object.freeze([21, 22]);
    const allowedWorkHours = Object.freeze([168, 176]);
    for (let i = 0; i < pps.length; i++) {
      const pp = pps[i];
      expect(pp).not.toBeNull();
      expect(pp.year).toBeGreaterThanOrEqual(PayPeriodService.YEAR_MIN);
      expect(pp.year).toBeLessThanOrEqual(PayPeriodService.YEAR_MAX);
      expect(pp.month).toBeGreaterThanOrEqual(PayPeriodService.MONTH_MIN);
      expect(pp.month).toBeLessThanOrEqual(PayPeriodService.MONTH_MAX);
      expect(pp.year).toBe(theYear);
      expect(pp.month).toBe(i + 1);
      expect(pp.firstDay < pp.lastDay).toBeTruthy();
      expect(allowedWorkDays).toContain(pp.workDays);
      expect(allowedWorkHours).toContain(pp.workHours);
      if (i === 0 || i === 6) {
        // January and July always start on the first
        expect(pp.firstDay).toBe(`${theYear}-0${i+1}-01`);
      }
      else if (i === 5) {
        // June always ends on the 30th
        expect(pp.lastDay).toBe(`${theYear}-06-30`);
      }
      else if (i === 11) {
        // December always ends on the 31st
        expect(pp.lastDay).toBe(`${theYear}-12-31`);
      }
      if (i > 0) {
        const prev = pps[i-1];
        expect(prev.lastDay < pp.firstDay).toBeTruthy();
      }
    }
  });

});
