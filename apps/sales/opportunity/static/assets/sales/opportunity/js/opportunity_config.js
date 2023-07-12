$(document).ready(function () {
    const frmDetail = $('#frm-detail-opportunity-config');
    const property_stage_condition_list = JSON.parse($('#id-property-stage-condition').text());
    const dict_property = property_stage_condition_list.reduce((obj, item) => {
        obj[item.id] = item;
        return obj;
    }, {});

    function loadFactorTable() {
        if (!$.fn.DataTable.isDataTable('#table-opportunity-customer-decision-factor')) {
            let $table = $('#table-opportunity-customer-decision-factor')
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
                        targets: 0,
                        render: (data, type, row) => {
                            return ``
                        }
                    },
                    {
                        targets: 1,
                        className: 'text-center',
                        render: (data, type, row) => {
                            return `<p>${row.title}</p>`
                        }
                    },
                    {
                        targets: 2,
                        render: (data, type, row) => {
                            return `<a class="btn btn-icon btn-del-factor" data-id="${row.id}"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`
                        }
                    },
                ],
            });
        }
    }

    function loadDetail() {
        let url = frmDetail.data('url');
        let method = 'GET';
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $('#opportunity_config_id').attr('value', data.id);
                    $('#is-select-stage')[0].checked = data.is_select_stage;
                    $('#is-input-win-rate')[0].checked = data.is_input_win_rate;
                    $('#is-AM-create')[0].checked = data.is_account_manager_create;
                    loadFactorTable();
                }
            }
        )
    }

    loadDetail();

    // Update Opportunity config
    frmDetail.submit(function (event) {
        event.preventDefault();
        let frm = new SetupFormSubmit($(this));
        let csr = $("[name=csrfmiddlewaretoken]").val();
        $.fn.showLoading();
        frm.dataForm['is_select_stage'] = $('#is-select-stage')[0].checked;
        frm.dataForm['is_input_win_rate'] = $('#is-input-win-rate')[0].checked;
        frm.dataForm['is_account_manager_create'] = $('#is-AM-create')[0].checked;
        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: 'Successfully'}, 'success')
                        $.fn.redirectUrl(window.location, 1000);
                    }
                },
                (errs) => {
                    console.log(errs)
                }
            )
    })

    // Create + Delete Customer Decision Factor
    const frmCreateFactor = $('#frm-create-factor')
    frmCreateFactor.submit(function (event) {
        event.preventDefault();
        let csr = $("[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: 'Successfully'}, 'success')
                        $.fn.redirectUrl(window.location, 1000);
                    }
                },
                (errs) => {
                    console.log(errs)
                }
            )
    })

    $(document).on('click', '.btn-del-factor', function () {
        let rowData = $(this).getRowData();
        if (
            confirm(
                $('#msgConfirmDeleteFactor').text().format_by_idx(rowData?.['title'])
            )
        ) {
            let table = $('#table-opportunity-customer-decision-factor');
            let url = table.data('url-detail').format_url_with_uuid($(this).data('id'));
            let method = 'DELETE';
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            $.fn.callAjax(url, method, {}, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: 'Successfully'}, 'success')
                            $.fn.redirectUrl(window.location, 1000);
                        }
                    },
                    (errs) => {
                        console.log(errs)
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
        dict_property[$(this).val()].stage_compare_data['='].map(function (compare) {
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
        dict_property[id_attr].opp_stage_operator.map(function (operator) {
            ele_operator.append(`<option value="${operator}">${operator}</option>`);
        });
    }

    function load_compare_data_stage_condition(ele_compare, id_attr, operator) {
        ele_compare.empty();
        dict_property[id_attr].stage_compare_data[operator].map(function (compare) {
            ele_compare.append(`<option value="${compare.id}">${compare.value}</option>`)
        })
    }

    function sortStage(list_stage) {
        let object_lost = null;
        let delivery = null;
        let object_close = null;
        let list_result = []

        for (let i = 0; i < list_stage.length; i++) {
            if (list_stage[i].is_closed_lost) {
                object_lost = list_stage[i];
            } else if (list_stage[i].is_delivery) {
                delivery = list_stage[i];
            } else if (list_stage[i].is_deal_closed) {
                object_close = list_stage[i];
            } else {
                list_result.push(list_stage[i]);
            }
        }

        list_result.sort(function (a, b) {
            return a.win_rate - b.win_rate;
        });
        list_result.push(object_lost);
        if (delivery !== null)
            list_result.push(delivery);
        list_result.push(object_close);

        return list_result
    }

    function loadStage() {
        if (!$.fn.DataTable.isDataTable('#table-opportunity-config-stage')) {
            let $table = $('#table-opportunity-config-stage')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                rowIdx: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);

                        if (data && resp.data.hasOwnProperty('opportunity_config_stage')) {
                            sortStage(resp.data['opportunity_config_stage']);
                            return resp.data['opportunity_config_stage'] ? sortStage(resp.data['opportunity_config_stage']) : [];
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: [
                    {
                        targets: 0,
                        render: (data, type, row) => {
                            return ``
                        }
                    },
                    {
                        targets: 1,
                        className: 'text-center',
                        render: (data, type, row) => {
                            return `<p>${row.indicator}</p>`
                        }
                    },
                    {
                        targets: 2,
                        className: 'text-center',
                        render: (data, type, row) => {
                            return `<p>${row.description}</p>`
                        }
                    },
                    {
                        targets: 3,
                        className: 'text-center',
                        render: (data, type, row) => {
                            return `<div class="input-group mb-3">
                                        <div class="input-affix-wrapper affix-wth-text">
                                            <input type="number" step="0.1" class="form-control input-win-rate" data-id="${row.id}" value="${row.win_rate}">
                                            <span class="input-suffix">%</span>
                                        </div>
                                        <span></span>
                                    </div>`
                        }
                    },
                    {
                        targets: 4,
                        render: (data, type, row) => {
                            return `<a class="btn btn-icon btn-detail-stage" data-id="${row.id}" data-bs-toggle="modal" data-bs-target="#modalDetailStage"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`
                        }
                    },
                    {
                        targets: 5,
                        render: (data, type, row) => {
                            if (row.is_delete === false) {
                                return `<a class="btn btn-icon btn-del-stage disabled" data-id="${row.id}"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`
                            } else {
                                return `<a class="btn btn-icon btn-del-stage" data-id="${row.id}"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`
                            }
                        }
                    },
                ],
            });
        }
    }

    $(document).on('click', '.nav-link', function () {
        if ($(this).attr('href') === '#tab_stage') {
            loadStage();
            $('.btn-save-config').hide();
        } else {
            $('.btn-save-config').show();
        }
    })

    function loadRowCondition(ele, data) {
        ele.find('.box-select-attr').val(data.condition_property.id);
        load_operator_stage_condition(ele.find('.box-select-comparison-operator'), data.condition_property.id);
        ele.find('.box-select-comparison-operator').val(data.comparison_operator);
        load_compare_data_stage_condition(ele.find('.box-select-compare'), data.condition_property.id, data.comparison_operator);
        ele.find('.box-select-compare').val(data.compare_data);
    }

    $(document).on('click', '.btn-detail-stage', function () {
        let modal = $('#modalDetailStage');
        let pk = $(this).data('id');
        let method = modal.data('method');
        let url = modal.data('url').format_url_with_uuid(pk);
        let first_condition = $('.condition .sub-condition').first();
        let ele_condition = $('.condition');
        ele_condition.html('');
        ele_condition.append(first_condition);
        ele_condition.find('select').val('');
        $.fn.callAjax(url, method)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        modal.find('.header-title').text(data.indicator);
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
                    console.log(errs)
                }
            )
    })

    // submit form create Stage

    const frmCreateStage = $('#frm-create-stage')
    frmCreateStage.submit(function (event) {
        event.preventDefault();
        let csr = $("[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: 'Successfully'}, 'success')
                        let table = $('#table-opportunity-config-stage').DataTable();
                        table.ajax.reload();
                        $('#modalCreateStage').modal('hide');
                    }
                },
                (errs) => {
                    console.log(errs)
                }
            )
    })

    $(document).on('click', '.btn-del-stage', function () {
        let rowData = $(this).getRowData();
        if (
            confirm(
                $('#msgConfirmDeleteFactor').text().format_by_idx(rowData?.['indicator'])
            )
        ) {
            let method = 'DELETE';
            let csr = $("[name=csrfmiddlewaretoken]").val();
            let url = $(this).closest('table').data('url-detail').format_url_with_uuid($(this).data('id'));
            $.fn.callAjax(url, method, {}, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: 'Successfully'}, 'success')
                            let table = $('#table-opportunity-config-stage').DataTable();
                            table.ajax.reload();
                        }
                    },
                    (errs) => {
                        console.log(errs)
                    }
                )
        }
    })

    const frmUpdateStageCondition = $('#frm-edit-condition');
    frmUpdateStageCondition.submit(function (event) {
        event.preventDefault();
        let csr = $("[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
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
        $.fn.callAjax(frm.dataUrl.format_url_with_uuid(pk), frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: 'Successfully'}, 'success')
                        $('#modalDetailStage').modal('hide');
                    }
                },
                (errs) => {
                    console.log(errs)
                }
            )
    })

    $(document).on('click', '#btn-restore-default-stage', function () {
        let method = $(this).data('method');
        let url = $(this).data('url');
        let csr = $("[name=csrfmiddlewaretoken]").val();
        $.fn.callAjax(url, method, {}, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        let modal = $('#modalRestoreDefault');
                        modal.find('.modal-body h4').prop('hidden', true);
                        modal.find('.modal-body .div-loading').prop('hidden', false);
                        setTimeout(function () {
                            let table = $('#table-opportunity-config-stage').DataTable();
                            table.ajax.reload();
                            modal.modal('hide');
                            $.fn.notifyPopup({description: 'Successfully'}, 'success')
                            modal.find('.modal-body h4').prop('hidden', false);
                            modal.find('.modal-body .div-loading').prop('hidden', true);
                        }, 2000);

                    }
                },
                (errs) => {
                    console.log(errs)
                }
            )
    })

    $(document).on('change', '.input-win-rate', function () {
        Swal.fire({
            title: 'Do you want update win rate ?',
            showCancelButton: true,
            confirmButtonText: 'Save',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                let csr = $("[name=csrfmiddlewaretoken]").val();
                let frm = new SetupFormSubmit(frmUpdateStageCondition);
                let pk = $(this).data('id');
                frm.dataForm['win_rate'] = $(this).val();
                $.fn.callAjax(frm.dataUrl.format_url_with_uuid(pk), frm.dataMethod, frm.dataForm, csr)
                    .then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                Swal.fire('Saved!', '', 'success');
                            }
                        },
                        (errs) => {
                            console.log(errs)
                        }
                    )
            }
        })
    })
})