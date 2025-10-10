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
            {'level': '1', 'from': '0', 'to': '5,000,000', 'rate': '5'},
            {'level': '2', 'from': '5,000,000', 'to': '10,000,000', 'rate': '10'},
            {'level': '3', 'from': '10,000,000', 'to': '18,000,000', 'rate': '15'},
            {'level': '4', 'from': '18,000,000', 'to': '32,000,000', 'rate': '20'},
            {'level': '5', 'from': '32,000,000', 'to': '52,000,000', 'rate': '25'},
            {'level': '6', 'from': '52,000,000', 'to': '80,000,000', 'rate': '30'},
            {'level': '7', 'from': '80,000,000', 'to': '', 'rate': '35'}
        ];
    }
}

const pageElements = new PayrollConfigElements();

class PayrollConfigInsuranceHandler {
    static combineInsuranceData() {
        return {
            social_employee_rate: pageElements.$socialEmployeeRate.val(),
            social_employer_rate: pageElements.$socialEmployerRate.val(),
            social_ceiling: pageElements.$socialCeilingRate.val(),
            unemployment_employee_rate: pageElements.$unemploymentEmployeeRate.val(),
            unemployment_employer_rate: pageElements.$unemploymentEmployerRate.val(),
            unemployment_ceiling: pageElements.$unemploymentCeiling.val(),
            health_employee_rate: pageElements.$healthEmployeeRate.val(),
            health_employer_rate: pageElements.$healthEmployerRate.val(),
            union_employee_rate: pageElements.$unionEmployeeRate.val(),
            union_employer_rate: pageElements.$unionEmployerRate.val(),
        };
    }
}

class PayrollConfigPersonalTaxHandler {
    static initTaxBracketTable() {
        pageElements.$tblTaxBracket.DataTable().clear().destroy();
        pageElements.$tblTaxBracket.DataTableDefault({
            scrollY: '70vh',
            scrollX: true,
            scrollCollapse: true,
            rowIndex: false,
            data: pageElements.$taxBracketData,
            columns: [
                {
                    className: "w-10 text-center",
                    render: (data, type, row) => {
                        return row?.['level'] || '0';
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
            personal_tax: pageElements.$personalTax.val(),
            dependent_tax: pageElements.$dependentTax.val(),
            tax_bracket: pageElements.$taxBracketData
        }
    }
}
