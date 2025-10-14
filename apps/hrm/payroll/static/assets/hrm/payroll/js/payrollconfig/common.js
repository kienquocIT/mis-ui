class PayrollConfigElements {
    constructor() {
        // tab insurance element
        this.$socialEmployeeRate = $('#social_insurance_employee_rate');
        this.$socialEmployerRate = $('#social_insurance_employer_rate');
        this.$socialCeilingRate = $('#social_insurance_ceiling');
        this.$unemploymentEmployeeRate = $('#unemployment_insurance_employee_rate');
        this.$unemploymentEmployerRate = $('#unemployment_insurance_employer_rate');
        this.$unemploymentCeiling = $('#unemployment_insurance_ceiling');
        this.$healthEmployeeRate = $('#health_insurance_employee_rate');
        this.$healthEmployerRate = $('#health_insurance_employer_rate');
        this.$unionEmployeeRate = $('#union_insurance_employee_rate');
        this.$unionEmployerRate = $('#union_insurance_employer_rate');

        // tab personal income tax element
        this.$personalTax = $('#personal_tax');
        this.$dependentTax = $('#dependent_tax');
        this.$effectiveDate = $('#effective_date');
        this.$tblTaxBracket = $('#table_tax_bracket');

        // constant
        this.$taxBracketData = [
            {'order': '1', 'from': '0', 'to': '5,000,000', 'rate': '5'},
            {'order': '2', 'from': '5,000,000', 'to': '10,000,000', 'rate': '10'},
            {'order': '3', 'from': '10,000,000', 'to': '18,000,000', 'rate': '15'},
            {'order': '4', 'from': '18,000,000', 'to': '32,000,000', 'rate': '20'},
            {'order': '5', 'from': '32,000,000', 'to': '52,000,000', 'rate': '25'},
            {'order': '6', 'from': '52,000,000', 'to': '80,000,000', 'rate': '30'},
            {'order': '7', 'from': '80,000,000', 'to': '', 'rate': '35'}
        ];
    }
}

const payrollConfigElements = new PayrollConfigElements();

class PayrollConfigDataHandler {
    // Insurance Tab
    static combineInsuranceData() {
        return {
            social_insurance_employee: parseFloat(payrollConfigElements.$socialEmployeeRate.val() || 0),
            social_insurance_employer: parseFloat(payrollConfigElements.$socialEmployerRate.val() || 0),
            social_insurance_ceiling: parseFloat(payrollConfigElements.$socialCeilingRate.val() || 0),
            unemployment_insurance_employee: parseFloat(payrollConfigElements.$unemploymentEmployeeRate.val() || 0),
            unemployment_insurance_employer: parseFloat(payrollConfigElements.$unemploymentEmployerRate.val() || 0),
            unemployment_insurance_ceiling: parseFloat(payrollConfigElements.$unemploymentCeiling.val() || 0),
            health_insurance_employee: parseFloat(payrollConfigElements.$healthEmployeeRate.val() || 0),
            health_insurance_employer: parseFloat(payrollConfigElements.$healthEmployerRate.val() || 0),
            union_insurance_employee: parseFloat(payrollConfigElements.$unionEmployeeRate.val() || 0),
            union_insurance_employer: parseFloat(payrollConfigElements.$unionEmployerRate.val() || 0),
        };
    }

    // Personal Income Tax
    static initTaxBracketTable() {
        payrollConfigElements.$tblTaxBracket.DataTable().clear().destroy();
        payrollConfigElements.$tblTaxBracket.DataTableDefault({
            scrollY: '70vh',
            scrollX: true,
            scrollCollapse: true,
            rowIndex: false,
            data: payrollConfigElements.$taxBracketData,
            columns: [
                {
                    className: "w-10 text-center",
                    render: (data, type, row) => {
                        return row?.['order'] || '0';
                    }
                },
                {
                    className: "w-40 text-center",
                    render: (data, type, row) => {
                        return row?.['from'] || '';
                    }
                },
                {
                    className: "w-40 text-center",
                    render: (data, type, row) => {
                        return row?.['to'] || '';
                    }
                },
                {
                    className: "w-10 text-center",
                    render: (data, type, row) => {
                        return row?.['rate'] || '';
                    }
                },
            ]
        });
    }

    static combinePersonalIncomeTaxData() {
        return {
            personal_deduction: parseFloat(payrollConfigElements.$personalTax.val() || 0),
            dependent_deduction: parseFloat(payrollConfigElements.$dependentTax.val() || 0),
            effective_date: DateTimeControl.formatDateType(
                'DD/MM/YYYY',
                'YYYY-MM-DD',
                payrollConfigElements.$effectiveDate.val()
            )
        }
    }

    static combineTaxBracketData() {
        let taxBracketData = payrollConfigElements.$taxBracketData.map(item => ({
            order: parseInt(item.order),
            min_amount: parseFloat(item.from.replace(/,/g, '')) || 0,
            max_amount:item.to ? parseFloat(item.to.replace(/,/g, '')) : 0,
            rate: parseFloat(item.rate)
        }));
        return taxBracketData;
    }
}
