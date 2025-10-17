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

        // form
        this.$frmPayrollConfig = $('#frm_payroll_config');
    }
}

const payrollConfigElements = new PayrollConfigElements();

class PayrollConfigDataHandler {
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

    static validateRateValue(value, fieldName) {
        const num = parseFloat(value);
        if (num < 0 || num > 100) {
            throw new Error(`${fieldName} must be between 0 and 100 (current value: ${num}).`);
        }
        return num;
    }

    static combinePayrollConfigData($form) {
        // combine insurance data
        const insuranceData = {
            social_insurance_employee: this.validateRateValue(
                payrollConfigElements.$socialEmployeeRate.val() || 0,
                'Social insurance employee rate'
            ),
            // social_insurance_employer: parseFloat(payrollConfigElements.$socialEmployerRate.val() || 0),
            social_insurance_employer: this.validateRateValue(
                payrollConfigElements.$socialEmployerRate.val() || 0,
                'Social insurance employer rate'
            ),
            social_insurance_ceiling: parseFloat(payrollConfigElements.$socialCeilingRate.attr('value') || 0),
            unemployment_insurance_employee: this.validateRateValue(
                payrollConfigElements.$unemploymentEmployeeRate.val() || 0,
                'Unemployment insurance employee rate'
            ),
            unemployment_insurance_employer: this.validateRateValue(
                payrollConfigElements.$unemploymentEmployerRate.val() || 0,
                'Unemployment insurance employer rate'
            ),
            unemployment_insurance_ceiling: parseFloat(payrollConfigElements.$unemploymentCeiling.attr('value') || 0),
            health_insurance_employee: this.validateRateValue(
                payrollConfigElements.$healthEmployeeRate.val() || 0,
                'Health insurance employee rate'
            ),
            health_insurance_employer: this.validateRateValue(
                payrollConfigElements.$healthEmployerRate.val() || 0,
                'Health insurance employer rate'
            ),
            union_insurance_employee: this.validateRateValue(
                payrollConfigElements.$unionEmployeeRate.val() || 0,
                'Union insurance employee rate'
            ),
            union_insurance_employer: this.validateRateValue(
                payrollConfigElements.$unionEmployerRate.val() || 0,
                'Union insurance employer rate'
            ),
        };

        // combine personal income tax data
        const personalTaxData = {
            personal_deduction: parseFloat(payrollConfigElements.$personalTax.attr('value') || 0),
            dependent_deduction: parseFloat(payrollConfigElements.$dependentTax.attr('value') || 0),
            effective_date: payrollConfigElements.$effectiveDate.val()
                ? DateTimeControl.formatDateType(
                    'DD/MM/YYYY',
                    'YYYY-MM-DD',
                    payrollConfigElements.$effectiveDate.val()) : null
        };

        // combine tax bracket data
        const taxBracketData = payrollConfigElements.$taxBracketData.map(item => ({
            order: parseInt(item.order),
            min_amount: parseFloat(item.from.replace(/,/g, '')) || 0,
            max_amount: item.to ? parseFloat(item.to.replace(/,/g, '')) : 0,
            rate: parseFloat(item.rate)
        }));

        // assign all to form data
        $form.dataForm = {
            insurance_data: insuranceData,
            personal_tax_data: personalTaxData,
            tax_bracket_data: taxBracketData
        };

        return $form.dataForm;
}

    // load Detail
    static loadDetailPayrollConfig() {
        const data_url = payrollConfigElements.$frmPayrollConfig.attr('data-url');
        $.fn.callAjax2({
            url: data_url,
            method: 'GET'
        }).then(
            (resp) => {
                const data = $.fn.switcherResp(resp);
                let insurance_data = data?.insurance_data[0] || {};
                let personal_tax_data = data?.personal_tax_data[0] || {};
                payrollConfigElements.$socialEmployeeRate.val(insurance_data?.social_insurance_employee || 0);
                payrollConfigElements.$socialEmployerRate.val(insurance_data?.social_insurance_employer || 0);
                payrollConfigElements.$socialCeilingRate.attr('value', insurance_data?.social_insurance_ceiling || 0);
                payrollConfigElements.$unemploymentEmployeeRate.val(insurance_data?.unemployment_insurance_employee || 0);
                payrollConfigElements.$unemploymentEmployerRate.val(insurance_data?.unemployment_insurance_employer || 0);
                payrollConfigElements.$unemploymentCeiling.attr('value', insurance_data?.unemployment_insurance_ceiling || 0);
                payrollConfigElements.$healthEmployeeRate.val(insurance_data?.health_insurance_employee || 0);
                payrollConfigElements.$healthEmployerRate.val(insurance_data?.health_insurance_employer || 0);
                payrollConfigElements.$unionEmployeeRate.val(insurance_data?.union_insurance_employee || 0);
                payrollConfigElements.$unionEmployerRate.val(insurance_data?.union_insurance_employer || 0);

                payrollConfigElements.$personalTax.attr('value', personal_tax_data?.personal_deduction || 0);
                payrollConfigElements.$dependentTax.attr('value', personal_tax_data?.dependent_deduction || 0);
                payrollConfigElements.$effectiveDate.val(personal_tax_data?.effective_date ? moment(personal_tax_data?.effective_date).format('DD/MM/YYYY') : '');

            }
        )
    }
}
