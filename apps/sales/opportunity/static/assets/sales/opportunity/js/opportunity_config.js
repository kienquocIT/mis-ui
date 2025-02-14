$(document).ready(function () {
    const frmDetail = $('#frm-detail-opportunity-config');
    const property_stage_condition_list = JSON.parse($('#id-property-stage-condition').text());
    const dict_property = property_stage_condition_list.reduce((obj, item) => {
        obj[item.id] = item;
        return obj;
    }, {});

    function loadFactorTable() {
        let $table = $('#table-opportunity-customer-decision-factor')
        $table.DataTable().clear().destroy()
        let frm = new SetupFormSubmit($table);
        $table.DataTableDefault({
            rowIdx: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('opportunity_decision_factor')) {
                        return resp.data['opportunity_decision_factor'] ? resp.data['opportunity_decision_factor'] : [];
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columnDefs: [],
            columns: [
                {
                    className: 'wrap-text w-5',
                    render: () => {
                        return ``
                    }
                },
                {
                    className: 'wrap-text w-90',
                    render: (data, type, row) => {
                        return `<i class="fa-regular fa-hand-point-right mr-2"></i><span class="text-muted">${row.title}</span>`
                    }
                },
                {
                    className: 'wrap-text w-5 text-right',
                    render: (data, type, row) => {
                        return `<a class="btn btn-icon btn-del-factor" data-id="${row.id}"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`
                    }
                },
            ],
        });
    }

    function loadDetail() {
        let url = frmDetail.data('url');
        let method = 'GET';
        $.fn.callAjax2({
            url: url,
            method: method
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $('#opportunity_config_id').attr('value', data.id);
                    $('#is-select-stage')[0].checked = data?.['opportunity_config'].is_select_stage;
                    $('#is-input-win-rate')[0].checked = data?.['opportunity_config'].is_input_win_rate;
                    $('#is-AM-create')[0].checked = data?.['opportunity_config'].is_account_manager_create;
                    loadFactorTable();
                }
            }
        )
    }

    loadDetail();

    // Update Opportunity config
    new SetupFormSubmit(frmDetail).validate({
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            let csr = $("[name=csrfmiddlewaretoken]").val();
            frm.dataForm['is_select_stage'] = $('#is-select-stage')[0].checked;
            frm.dataForm['is_input_win_rate'] = $('#is-input-win-rate')[0].checked;
            frm.dataForm['is_account_manager_create'] = $('#is-AM-create')[0].checked;
            $.fn.callAjax2({
                url: frm.dataUrl,
                method: frm.dataMethod,
                data: frm.dataForm,
            }, frm.dataMethod, frm.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({'description': $.fn.gettext('Successful')}, 'success')
                            $.fn.redirectUrl(window.location, 1000);
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
        }
    })

    // Create + Delete Customer Decision Factor
    const frmCreateFactor = $('#frm-create-factor')
    new SetupFormSubmit(frmCreateFactor).validate({
        rules: {
            title: {
                required: true,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            $.fn.callAjax2({
                url: frm.dataUrl,
                method: frm.dataMethod,
                data: frm.dataForm
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({'description': $.fn.gettext('Successful')}, 'success')
                        $('#frm-create-factor')[0].reset()
                        $('#modalCreateFactor').modal('hide');
                        loadFactorTable()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    $(document).on('click', '.btn-del-factor', function () {
        let rowData = DTBControl.getRowData($(this));
        if (
            confirm(
                $('#msgConfirmDeleteFactor').text().format_by_idx(rowData?.['title'])
            )
        ) {
            let table = $('#table-opportunity-customer-decision-factor');
            let url = table.data('url-detail').format_url_with_uuid($(this).data('id'));
            let method = 'DELETE';
            $.fn.callAjax2({
                url: url,
                method: method,
                data: {}
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({'description': $.fn.gettext('Successful')}, 'success')
                        loadFactorTable()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })


    // event stage
    function addRowCondition(text_logic) {
        let row = $('.row-condition-hidden').html();
        let ele_condition = $('.condition')
        ele_condition.append(row);
        let last_row = ele_condition.find('.sub-condition').last();
        let ele_logic = last_row.find('.span-logic-operator');
        ele_logic.text(text_logic);
    }

    $(document).on('click', '#btn-add-condition', function () {
        let ele_logic_operator = $('#box-select-logic-operator option:selected');
        addRowCondition(ele_logic_operator.text());
    })

    $(document).on('change', '#box-select-logic-operator', function () {
        let ele_span_logic_condition = $('.condition .span-logic-operator');
        ele_span_logic_condition.text($(this).find('option:selected').text());
    })

    $(document).on('click', '.btn-delete-condition', function () {
        $(this).closest('.sub-condition').remove();
    })


    // event in modal edit stage condition
    $(document).on('change', '.box-select-attr', function () {
        let ele_operator = $(this).closest('.sub-condition').find('.box-select-comparison-operator');
        let ele_compare = $(this).closest('.sub-condition').find('.box-select-compare');
        load_operator_stage_condition(ele_operator, $(this).val());
        ele_compare.empty();
        dict_property[$(this).val()]?.['stage_compare_data']['='].map(function (compare) {
            ele_compare.append(`<option value="${compare.id}">${compare.value}</option>`)
        })
    })

    $(document).on('change', '.box-select-comparison-operator', function () {
        let id_attr = $(this).closest('.sub-condition').find('.box-select-attr option:selected').val();
        let ele_compare = $(this).closest('.sub-condition').find('.box-select-compare');
        load_compare_data_stage_condition(ele_compare, id_attr, $(this).val());
    })

    function load_operator_stage_condition(ele_operator, id_attr) {
        ele_operator.empty();
        dict_property[id_attr]?.['opp_stage_operator'].map(function (operator) {
            ele_operator.append(`<option value="${operator}">${operator}</option>`);
        });
    }

    function load_compare_data_stage_condition(ele_compare, id_attr, operator) {
        ele_compare.empty();
        dict_property[id_attr]?.['stage_compare_data'][operator].map(function (compare) {
            ele_compare.append(`<option value="${compare.id}">${compare.value}</option>`)
        })
    }

    function loadStage() {
        let $table = $('#table-opportunity-config-stage')
        $table.DataTable().clear().destroy()
        let frm = new SetupFormSubmit($table);
        $table.DataTableDefault({
            rowIdx: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('opportunity_config_stage')) {
                        return resp.data['opportunity_config_stage'] ? LoadConfigAndLoadStage.sortStage(resp.data['opportunity_config_stage']) : [];
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    className: 'wrap-text w-5',
                    render: () => {
                        return ``
                    }
                },
                {
                    className: 'wrap-text w-15',
                    render: (data, type, row) => {
                        return `<span class="text-primary fw-bold">${row.indicator}</span>`
                    }
                },
                {
                    className: 'wrap-text w-50',
                    render: (data, type, row) => {
                        return `<span class="fst-italic">${row.description}</span>`
                    }
                },
                {
                    className: 'wrap-text w-15',
                    render: (data, type, row) => {
                        return `<div class="input-group">
                                    <input type="number" step="0.1" class="form-control input-win-rate" data-id="${row.id}" value="${row.win_rate}">
                                    <span class="input-group-text">%</span>
                                </div>`
                    }
                },
                {
                    className: 'wrap-text text-center w-10',
                    render: (data, type, row) => {
                        return `<a class="btn btn-icon btn-detail-stage" data-id="${row.id}" data-bs-toggle="modal" data-bs-target="#modalStageCondition"><span class="btn-icon-wrap"><span class="feather-icon"><i class="fa-solid fa-sitemap"></i></span></span></a>`
                    }
                },
                {
                    className: 'wrap-text text-right w-5',
                    render: (data, type, row) => {
                        if (!row?.['is_default']) {
                            return `<a class="btn btn-icon btn-del-stage" data-id="${row.id}"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`
                        }
                        return ''
                    }
                },
            ],
        });
    }

    loadStage();

    function loadRowCondition(ele, data) {
        ele.find('.box-select-attr').val(data.condition_property.id);
        load_operator_stage_condition(ele.find('.box-select-comparison-operator'), data.condition_property.id);
        ele.find('.box-select-comparison-operator').val(data.comparison_operator);
        load_compare_data_stage_condition(ele.find('.box-select-compare'), data.condition_property.id, data.comparison_operator);
        ele.find('.box-select-compare').val(data.compare_data);
    }

    $(document).on('click', '.btn-detail-stage', function () {
        let modal = $('#modalStageCondition');
        let pk = $(this).data('id');
        let method = modal.data('method');
        let url = modal.data('url').format_url_with_uuid(pk);
        let first_condition = $('.condition .sub-condition').first();
        let ele_condition = $('.condition');
        ele_condition.html('');
        ele_condition.append(first_condition);
        ele_condition.find('select').val('');
        $.fn.callAjax2({
            url: url,
            method: method
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    modal.find('.header-title').text(data.indicator);
                    modal.find('.header-title-des').text(data.description);
                    if (data.indicator === 'Closed Lost') {
                        modal.find('#box-select-logic-operator').prop('hidden', true)
                        modal.find('#btn-add-condition').prop('hidden', true)
                        modal.find('select').prop('disabled', true).prop('readonly', true)
                    }
                    else {
                        modal.find('#box-select-logic-operator').prop('hidden', false)
                        modal.find('#btn-add-condition').prop('hidden', false)
                        modal.find('select').prop('disabled', false).prop('readonly', false)
                    }
                    let ele_logical_operator = modal.find('#box-select-logic-operator');
                    $('#input-id-stage').val(data.id);
                    ele_logical_operator.val(data.logical_operator);
                    modal.find('.span-logic-operator').text(ele_logical_operator.find('option:selected').text());

                    if (data.condition_datas.length > 0) {
                        let ele_condition = modal.find('.condition');
                        let html_add = modal.find('.row-condition-hidden').html();
                        let first_condition = data.condition_datas.shift();
                        let first_row = ele_condition.find('.sub-condition').first();
                        loadRowCondition(first_row, first_condition);

                        data.condition_datas.map(function (condition) {
                            ele_condition.append(html_add);
                            let last_condition = ele_condition.find('.sub-condition').last();
                            loadRowCondition(last_condition, condition)
                        });
                    }
                }
            },
            (errs) => {
                $.fn.notifyB({description: errs.data.errors}, 'failure');
            }
        )
    })

    // submit form create Stage

    const frmCreateStage = $('#frm-create-stage')
    new SetupFormSubmit(frmCreateStage).validate({
        rules: {
            indicator: {
                required: true,
            },
            win_rate: {
                required: true,
                number: true,
                min: 0.00000001,
            },
            description: {
                required: true,
            },
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            $.fn.callAjax2({
                url: frm.dataUrl,
                method: frm.dataMethod,
                data: frm.dataForm
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({'description': $.fn.gettext('Successful')}, 'success')
                        let table = $('#table-opportunity-config-stage').DataTable();
                        table.ajax.reload();
                        $('#modalCreateStage').modal('hide');
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    $(document).on('click', '.btn-del-stage', function () {
        let rowData = DTBControl.getRowData($(this));
        if (
            confirm(
                $('#msgConfirmDeleteFactor').text().format_by_idx(rowData?.['indicator'])
            )
        ) {
            let method = 'DELETE';
            let url = $(this).closest('table').data('url-detail').format_url_with_uuid($(this).data('id'));
            $.fn.callAjax2({
                url: url,
                method: method,
                data: {}
            })
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({'description': $.fn.gettext('Successful')}, 'success')
                            let table = $('#table-opportunity-config-stage').DataTable();
                            table.ajax.reload();
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
        }
    })

    const frmUpdateStageCondition = $('#frm-edit-condition');
    new SetupFormSubmit(frmUpdateStageCondition).validate({
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            let pk = $('#input-id-stage').val();
            let ele_condition = $('.condition');
            let condition_list = [];
            ele_condition.find('.sub-condition').each(function () {
                condition_list.push(
                    {
                        'condition_property': {
                            'id': $(this).find('.box-select-attr').val(),
                            'title': $(this).find('.box-select-attr option:selected').text(),
                        },
                        'comparison_operator': $(this).find('.box-select-comparison-operator').val(),
                        'compare_data': $(this).find('.box-select-compare').val(),
                    }
                )
            })
            frm.dataForm['logical_operator'] = $('#box-select-logic-operator').val();
            frm.dataForm['condition_datas'] = condition_list;
            $.fn.callAjax2({
                url: frm.dataUrl.format_url_with_uuid(pk),
                method: frm.dataMethod,
                data: frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({'description': $.fn.gettext('Successful')}, 'success')
                        $('#modalStageCondition').modal('hide');
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    $(document).on('change', '.input-win-rate', function () {
        let ele_base_tran = $('#base-trans-factory')
        Swal.fire({
            title: ele_base_tran.data('are-you-sure'),
            showCancelButton: true,
            confirmButtonText: ele_base_tran.data('confirm'),
            cancelButtonText: ele_base_tran.data('cancel'),
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                let frm = new SetupFormSubmit(frmUpdateStageCondition);
                let pk = $(this).data('id');
                frm.dataForm['win_rate'] = $(this).val();
                $.fn.callAjax2({
                    url: frm.dataUrl.format_url_with_uuid(pk),
                    method: frm.dataMethod,
                    data: frm.dataForm,
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            Swal.fire(ele_base_tran.data('success'), '', 'success');
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
            }
        })
    })
})