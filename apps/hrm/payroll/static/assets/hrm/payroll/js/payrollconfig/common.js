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
        this.$taxBracketEffectiveDay = $('#effective_day_tax_bracket');
        this.$taxBracketStatus = $('#status_field');
        this.$tblTaxBracket = $('#table_tax_bracket');
        this.$btnAddBracket = $('#add_tax_bracket');

        // form
        this.$frmPayrollConfig = $('#frm_payroll_config');
    }
}

const payrollConfigElements = new PayrollConfigElements();

class PayrollConfigDataHandler {
    static initTaxBracketTable(data) {
        payrollConfigElements.$tblTaxBracket.DataTable().clear().destroy();
        payrollConfigElements.$tblTaxBracket.DataTableDefault({
            scrollY: '70vh',
            scrollX: true,
            scrollCollapse: true,
            rowIndex: false,
            data: data,
            columns: [
                {
                    className: "w-10 text-center",
                    render: (data, type, row) => {
                        return `<input class="form-control row_level" type="text">`;
                    }
                },
                {
                    className: "w-35 text-center",
                    render: (data, type, row) => {
                        return `<input class="form-control row_min_amount" type="text">`;
                    }
                },
                {
                    className: "w-35 text-center",
                    render: (data, type, row) => {
                        return `<input class="form-control row_max_amount" type="text">`;
                    }
                },
                {
                    className: "w-10 text-center",
                    render: (data, type, row) => {
                        return `<input class="form-control row_rate" type="text">`;
                    }
                },
                {
                    className: "w-10 text-center",
                    render: () => {
                        return `<button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del_row">
                                   <span class="icon"><i class="far fa-trash-alt"></i></span>
                              </button>`;
                    }
                },
            ],
            initComplete: function() {
                payrollConfigElements.$tblTaxBracket.find('tbody tr').each(function (index, ele) {
                    $(ele).find('.row_level').val(data[index]?.order || 1)
                    $(ele).find('.row_min_amount').val(data[index]?.min_amount || 0)
                    $(ele).find('.row_max_amount').val(data[index]?.max_amount || 0)
                    $(ele).find('.row_rate').val(data[index]?.rate || 0)
                })
            }
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
        const taxBracketData = [];
        payrollConfigElements.$tblTaxBracket.find('tbody tr').each(function () {
            let $tr = $(this);
            let status = false;
            let effectiveDateStr = payrollConfigElements.$taxBracketEffectiveDay.val()
                ? DateTimeControl.formatDateType(
                    'DD/MM/YYYY',
                    'YYYY-MM-DD',
                    payrollConfigElements.$taxBracketEffectiveDay.val()) : null

            if (effectiveDateStr) {
                const effectiveDate = new Date(effectiveDateStr);
                const today = new Date();

                effectiveDate.setHours(0, 0, 0, 0);
                today.setHours(0, 0, 0, 0);

                status = effectiveDate >= today;
            }

            let item = {
                order: parseInt($tr.find('.row_level').val() || 1),
                min_amount: parseFloat($tr.find('.row_min_amount').val() || 0),
                max_amount: parseFloat($tr.find('.row_max_amount').val() || 0),
                rate: parseFloat($tr.find('.row_rate').val() || 0),
                effective_date: effectiveDateStr,
                status: status
            }
            taxBracketData.push(item);
        })

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
                const today = moment().startOf('day');
                let insurance_data = data?.insurance_data[0] || {};
                let personal_tax_data = data?.personal_tax_data[0] || {};
                let tax_bracket_data = data?.tax_bracket_data || [];

                let tax_bracket_effective_date = tax_bracket_data[0]?.effective_date
                    ? moment(tax_bracket_data[0]?.effective_date, 'YYYY-MM-DD').startOf('day') : null;

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
                payrollConfigElements.$effectiveDate.val(
                    personal_tax_data?.effective_date ? moment(personal_tax_data?.effective_date).format('DD/MM/YYYY') : ''
                );

                payrollConfigElements.$taxBracketEffectiveDay.val(tax_bracket_effective_date ? tax_bracket_effective_date.format('DD/MM/YYYY') : '');

                if (tax_bracket_effective_date && tax_bracket_effective_date.isBefore(today)) {
                    payrollConfigElements.$taxBracketStatus
                        .text($.fn.gettext('Expired'))
                        .removeClass('text-success')
                        .addClass('text-danger');
                } else {
                    payrollConfigElements.$taxBracketStatus
                        .text($.fn.gettext('Active'))
                        .removeClass('text-danger')
                        .addClass('text-success');
                }

                if (data?.tax_bracket_data) {
                    data.tax_bracket_data.sort((a, b) => a.order - b.order);
                }
                PayrollConfigDataHandler.initTaxBracketTable(tax_bracket_data);

            }
        )
    }
}

class PayrollConfigEventHandler {
    static InitPageEvent() {
        // event when click add button
        payrollConfigElements.$btnAddBracket.on('click', function () {
            UsualLoadPageFunction.AddTableRow(payrollConfigElements.$tblTaxBracket);
        });

        // event for deleting row
        payrollConfigElements.$tblTaxBracket.on('click', '.del_row', function () {
            const table = payrollConfigElements.$tblTaxBracket.DataTable();
            const row = $(this).closest('tr');
            table.row(row).remove().draw(false);

            // update order after deleting
            table.rows().every(function (index) {
                $(this.node()).find('.row_level').val(index + 1);
            });
        });

        // event when change effective day tax bracket
        $('#btn_apply').on('click', function () {
            const inputValue = payrollConfigElements.$taxBracketEffectiveDay.val();
            const parts = inputValue.split('/');
            const inputDate = new Date(parts[2], parts[1] - 1, parts[0]);
            const today = new Date();

            inputDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            if (inputDate < today) {
                payrollConfigElements.$taxBracketStatus.text($.fn.gettext('Expired')).removeClass('text-success').addClass('text-danger');
            } else {
                payrollConfigElements.$taxBracketStatus.text($.fn.gettext('Active')).removeClass('text-danger').addClass('text-success');
            }
        });
    }
}
