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

const pageElements = new PayrollConfigElements();

class PayrollConfigInsuranceHandler {
    static combineInsuranceData() {
        return {
            social_insurance_employee: pageElements.$socialEmployeeRate.val(),
            social_insurance_employer: pageElements.$socialEmployerRate.val(),
            social_insurance_ceiling: pageElements.$socialCeilingRate.val(),
            unemployment_insurance_employee: pageElements.$unemploymentEmployeeRate.val(),
            unemployment_insurance_employer: pageElements.$unemploymentEmployerRate.val(),
            unemployment_insurance_ceiling: pageElements.$unemploymentCeiling.val(),
            health_insurance_employee: pageElements.$healthEmployeeRate.val(),
            health_insurance_employer: pageElements.$healthEmployerRate.val(),
            union_insurance_employee: pageElements.$unionEmployeeRate.val(),
            union_insurance_employer: pageElements.$unionEmployerRate.val(),
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
            personal_deduction: pageElements.$personalTax.val(),
            dependent_deduction: pageElements.$dependentTax.val(),
            effective_date: DateTimeControl.formatDateType(
                'DD/MM/YYYY',
                'YYYY-MM-DD',
                pageElements.$effectiveDate.val()
            )
        }
    }

    static combineTaxBracketData() {
        let taxBracketData = pageElements.$taxBracketData.map(item => ({
            order: parseInt(item.order),
            min_amount: parseFloat(item.from.replace(/,/g, '')) || 0,
            max_amount:item.to ? parseFloat(item.to.replace(/,/g, '')) : 0,
            rate: parseFloat(item.rate)
        }));
        return taxBracketData;
    }
}
