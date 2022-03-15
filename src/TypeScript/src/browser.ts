import * as PayPeriodService from './main';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).PayPeriodService = PayPeriodService;  // instead of casting window to any, you can extend the Window interface: https://stackoverflow.com/a/43513740/5433572

console.log('The "PayPeriodService" API was added to the window object. You can try it yourself by just entering "PayPeriodService.getPayPeriod(\'2022-03-15\')"');
