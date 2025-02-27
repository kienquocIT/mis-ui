/*
This file is about to handle all logics about depreciation
Can be used for applications in Sale, Finance,...
Include classes:
DepreciationControl{}
*/

class DepreciationControl {
    static callDepreciation(opts) {
        let {method, months, start_date, end_date, price, adjust = null} = opts;
        /*
        method: 0: line method || 1: adjust method
        months: total months depreciation
        start_date: date start depreciation (DD/MM/YYYY)
        end_date: date end depreciation (DD/MM/YYYY)
        price: origin price to depreciation
        adjust: use for method is adjustment method
        */
        let result = [];
        let totalMonths = months;
        let depreciationValue = Math.round(price / totalMonths); // Khấu hao đều
        let accumulativeValue = 0;
        let currentStartDate = start_date;
        let currentMonth = 1;
        let currentValue = price;
        let endDateObj = DepreciationControl.parseToDateObj(end_date);

        while (true) {
            let currentStartDateObj = DepreciationControl.parseToDateObj(currentStartDate);
            let currentEndDate;
            if (result.length === 0) {
                // Tháng đầu: ngày bắt đầu là start_date và kết thúc vào ngày cuối cùng của tháng
                currentEndDate = DepreciationControl.addOneMonthToLast(currentStartDate, true);
            } else {
                // Các tháng giữa: ngày bắt đầu là ngày 1 và kết thúc vào ngày cuối cùng của tháng
                currentStartDate = `01/${String(currentStartDateObj.getMonth() + 1).padStart(2, '0')}/${currentStartDateObj.getFullYear()}`;
                currentEndDate = DepreciationControl.addOneMonthToLast(currentStartDate, true);
            }
            let currentEndDateObj = DepreciationControl.parseToDateObj(currentEndDate);
            let daysEven = DepreciationControl.calDaysBetween(currentStartDateObj, currentEndDateObj);
            // Tính khấu hao hệ số nếu method === 1
            if (method === 1 && adjust) {
                // Khấu hao hệ số
                let depreciationAdjustValue = Math.round(price / totalMonths * adjust);
                depreciationValue = depreciationAdjustValue;
                if (result.length > 0) {
                    let last_end_value = 0;
                    let last = result[result.length - 1];
                    last_end_value = last?.['end_value'];
                    let total_accumulative_month = 0;
                    for (let data of result) {
                        total_accumulative_month += data?.['accumulative_month'];
                    }
                    // Khấu hao hệ số
                    depreciationAdjustValue = Math.round(last_end_value / totalMonths * adjust);
                    // Kiểm tra nếu khấu hao theo hệ số mà lớn hơn khấu hao chia đều số tháng còn lại thì lấy theo khấu hao hệ số còn ngược lại thì lấy theo khấu hao chia đều.
                    let monthsRemain = totalMonths - total_accumulative_month;
                    let depreciationValueCompare = last_end_value / monthsRemain;
                    if (depreciationAdjustValue > depreciationValueCompare) {
                        depreciationValue = depreciationAdjustValue;
                    } else {
                        depreciationValue = depreciationValueCompare;
                    }
                }
            }

            if (currentEndDateObj > endDateObj) {
                if (currentStartDateObj < endDateObj) {
                    let daysOdd = DepreciationControl.calDaysBetween(currentStartDateObj, endDateObj);
                    depreciationValue = depreciationValue * (daysOdd + 1) / (daysEven + 1);
                    accumulativeValue += depreciationValue;
                    result.push({
                        month: currentMonth.toString(),
                        begin: currentStartDate,
                        end: end_date,
                        accumulative_month: DepreciationControl.getAccumulativeMonth(currentStartDate, end_date),
                        start_value: Math.round(currentValue),
                        depreciation_value: Math.round(depreciationValue),
                        accumulative_value: Math.round(accumulativeValue),
                        end_value: Math.round(currentValue - depreciationValue),
                    });
                }
                break;
            } else {
                if (currentStartDateObj.getDate() !== 1) {
                    let month = currentStartDateObj.getMonth() + 1;
                    let year = currentStartDateObj.getFullYear();
                    let totalDays = new Date(year, month, 0).getDate();
                    let daysOdd = DepreciationControl.calDaysBetween(currentStartDateObj, currentEndDateObj);
                    depreciationValue = depreciationValue / totalDays * (daysOdd + 1);
                }
                accumulativeValue += depreciationValue;
                result.push({
                    month: currentMonth.toString(),
                    begin: currentStartDate,
                    end: currentEndDate,
                    accumulative_month: DepreciationControl.getAccumulativeMonth(currentStartDate, currentEndDate),
                    start_value: Math.round(currentValue),
                    depreciation_value: Math.round(depreciationValue),
                    accumulative_value: Math.round(accumulativeValue),
                    end_value: Math.round(currentValue - depreciationValue),
                });
            }

            currentValue = Math.round(currentValue - depreciationValue);
            if (currentStartDateObj.getDate() !== 1) {
                depreciationValue = Math.round(price / totalMonths);
            }
            currentStartDate = DepreciationControl.addOneDay(currentEndDate);
            currentMonth++;
        }

        return result;
    };

    static addOneDay(date_current) {
        const [day, month, year] = date_current.split('/').map(num => parseInt(num));
        const date = new Date(year, month - 1, day);
        date.setDate(date.getDate() + 1);

        const newDay = String(date.getDate()).padStart(2, '0');
        const newMonth = String(date.getMonth() + 1).padStart(2, '0');
        const newYear = date.getFullYear();

        return `${newDay}/${newMonth}/${newYear}`;
    };

    static addOneMonthToLast(date_current, alignToEndOfMonth = false) {
        const [day, month, year] = date_current.split('/').map(num => parseInt(num));
        const date = new Date(year, month - 1, day);

        if (alignToEndOfMonth) {
            // Move to the last day of the current month
            date.setMonth(date.getMonth() + 1, 0);
        } else {
            // Move to the same day next month
            date.setMonth(date.getMonth() + 1);
        }

        const newDay = String(date.getDate()).padStart(2, '0');
        const newMonth = String(date.getMonth() + 1).padStart(2, '0');
        const newYear = date.getFullYear();

        return `${newDay}/${newMonth}/${newYear}`;
    };

    static parseToDateObj(dateStr) {
        const [day, month, year] = dateStr.split('/').map(num => parseInt(num));
        return new Date(year, month - 1, day); // Convert to Date object
    };

    static calDaysBetween(startDateObj, endDateObj) {
        let timeDifference = endDateObj - startDateObj;
        return timeDifference / (1000 * 60 * 60 * 24);
    };

    static getAccumulativeMonth(begin, end) {
        // Convert strings to Date objects
        let [beginDay, beginMonth, beginYear] = begin.split('/').map(Number);
        let [endDay, endMonth, endYear] = end.split('/').map(Number);
        let beginDate = new Date(beginYear, beginMonth - 1, beginDay);
        let endDate = new Date(endYear, endMonth - 1, endDay);
        // Get total days between begin and end
        let totalDaysBetween = (endDate - beginDate) / (1000 * 60 * 60 * 24) + 1;
        // Get total days of the month
        let totalDaysInMonth = new Date(beginYear, beginMonth, 0).getDate();
        // Calculate the fraction
        return totalDaysBetween / totalDaysInMonth;
    };

    static getMonthsRange(start_date, months) {
        let result = [];
        let currentStartDate = start_date;
        let currentMonth = 1;

        while (true) {
            let currentStartDateObj = DepreciationControl.parseToDateObj(currentStartDate);
            let currentEndDate;
            if (result.length === 0) {
                // First range: ends at the last day of the starting month
                currentEndDate = DepreciationControl.addOneMonthToLast(currentStartDate, true);
            } else {
                // Other ranges: align to calendar months
                currentStartDate = `01/${String(currentStartDateObj.getMonth() + 1).padStart(2, '0')}/${currentStartDateObj.getFullYear()}`;
                currentEndDate = DepreciationControl.addOneMonthToLast(currentStartDate, true);
            }
            if (currentMonth > months) {
                break;
            }
            result.push(currentEndDate);

            currentStartDate = DepreciationControl.addOneDay(currentEndDate);
            currentMonth++;
        }

        return result;
    }

    static findMatchingRange(lease_from, lease_to, data) {
        let leaseFromDate = new Date(lease_from.split('/').reverse().join('-'));
        let leaseToDate = new Date(lease_to.split('/').reverse().join('-'));

        // Find start index (first dict where lease_from falls in range)
        let startIndex = data.findIndex(item => {
            let beginDate = new Date(item.begin.split('/').reverse().join('-'));
            let endDate = new Date(item.end.split('/').reverse().join('-'));
            return leaseFromDate >= beginDate && leaseFromDate <= endDate;
        });

        // Find end index (first dict where lease_to falls in range)
        let endIndex = data.findIndex(item => {
            let beginDate = new Date(item.begin.split('/').reverse().join('-'));
            let endDate = new Date(item.end.split('/').reverse().join('-'));
            return leaseToDate >= beginDate && leaseToDate <= endDate;
        });

        // If both start and end indexes are found, return the range
        if (startIndex !== -1 && endIndex !== -1) {
            return data.slice(startIndex, endIndex + 1);
        }

        return []; // Return empty array if no match found
    };
}