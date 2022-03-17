# CA Gov Pay Periods API in TypeScript (JavaScript)

A Pay Periods API for standard monthly pay periods
for California State Government as defined in the
[State Administrative Manual](https://www.dgs.ca.gov/Resources/SAM) 
section [8512](https://www.dgs.ca.gov/Resources/SAM/TOC/8500/8512).

## Installation

Download the file or package from the [GitHub Releases](https://github.com/cdfw/ca-gov-payperiods/releases) page.

### Script Files

Choose the correct script file for your usage scenario. The files with the *.min.js* ending have
been minified.

- **Browser** - Directly include in a web page.
    - pay-period-service.js
- **Module** - Standard ECMAScript module
    - pay-period-service.esm.js

## Usage

In the browser, the library objects are exposed through the global `PayPeriodService` property set on the `window` object. So, you might use a function like the following.

```javascript
const pp = PayPeriodService.getPayPeriods(2022);
```

For the ECMAScript module, standard `import` usage works.

```javascript
import * as PayPeriodService from './ca-gov-payperiods.esm.js'
const pp = PayPeriodService.getPayPeriods(2022);
```

<!--
3.0 project adapted from https://github.com/metachris/typescript-boilerplate
-->