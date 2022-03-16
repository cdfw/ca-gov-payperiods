# CA Gov Pay Periods API in TypeScript (JavaScript)

A Pay Periods API for standard monthly pay periods
for California State Government as defined in the
[State Administrative Manual](https://www.dgs.ca.gov/Resources/SAM) 
[section 8512](https://www.dgs.ca.gov/Resources/SAM/TOC/8500/8512).

Standardized monthly calendars are defined from 1994 thru 2299. The repeating pattern fails in 2300.

## Installation

TODO: Install directly from GitHub download or by unpacking a package.

### Script Files
Choose the correct script file for your usage scenario. The files with tne *.min.js* ending have
been minified. The related *.map* files are debugging map files.

- **Browser** - Directly include in a web page.
    - ca-gov-payperiods.js
- **Module** - Standard ECMAScript module
    - ca-gov-payperiods.esm.js

### Usage

In the browser, the library objects are exposed through the global `PayPeriodService` property set on the `window` object. So, you might use a function like the following.

```javascript
const pp = PayPeriodService.getPayPeriods(2022);
```

For the ECMAScript module, standard `import` usage works.

```javascript
import * as PayPeriodService from './ca-gov-payperiods.esm.js'
const pp = PayPeriodService.getPayPeriods(2022);
```

[BOILERPLATE]: https://github.com/metachris/typescript-boilerplate