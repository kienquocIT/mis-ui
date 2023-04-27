/*Blog Init*/
"use strict";
$(function () {
    $(document).ready(function () {
        let company_current_id = $('#company-current-id').attr('data-id')
        let config = {
            ordering: false, paginate: false, language: {
                search: "", searchPlaceholder: "Search", info: "", sLengthMenu: "View  MENU",
            }, drawCallback: function () {
                $('.dataTables_paginate > .pagination').addClass('custom-pagination pagination-simple');
                feather.replace();
            }, data: [], columns: [{
                width: '5%', render: () => {
                    return '';
                },
            }, {
                width: '10%', data: 'code', className: 'wrap-text', render: (data, type, row, meta) => {
                    return `<a href="/company/detail/` + row.id + `">` + data + `</a>`
                }
            }, {
                width: '30%', data: 'title', className: 'wrap-text', 'render': (data, type, row, meta) => {
                    if (data) {
                        return `<div class="media align-items-center">
                                        <div class="media-head me-2">
                                            <div class="avatar avatar-xs avatar-success avatar-rounded">
                                                <span class="initial-wrap"><b>` + row.title.charAt(0).toUpperCase() + `</b></span>
                                            </div>
                                        </div>
                                        <div class="media-body">
                                            <a href="/company/detail/` + row.id + `">
                                                <span class="d-block"><b>` + row.title + `</b></span>
                                            </a>
                                        </div>
                                    </div>`;
                    } else {
                        return ''
                    }
                }

            }, {
                width: '20%', data: 'date_created', render: (data, type, row, meta) => {
                    let date = new Date(data).toLocaleDateString("en-GB")
                    let time = new Date(data).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
                    return date + ' ' + time;
                }
            }, {
                width: '20%', data: 'representative_fullname', render: (data, type, row, meta) => {
                    if (data) {
                        return `<div class="representative_fullname"><span class="badge badge-primary">` + data + `</span></div>`;
                    } else {
                        return `<div class="representative_fullname"><span class="badge badge-primary">` + $('input[name=default_representative_name]').val() + `</span></div>`;
                    }
                }
            }, {
                width: '15%', className: 'action-center', render: (data, type, row, meta) => {
                    let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover" id="edit-company-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href="/company/update/` + row.id + `" data-id="` + row.id + `"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                    let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover" id="del-company-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="" data-id="` + row.id + `"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                    let bt1 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-setting" data-bs-toggle="modal" data-bs-target="#modal-setting" data-id="` + row.id + `"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="settings"></i></span></span></a>`;
                    if(row.id === company_current_id){
                        return `<div>` + bt2 + bt3 + bt1 + `</div>`;
                    }
                    else{
                        return `<div>` + bt2 + bt3 + `</div>`;
                    }
                }
            },]
        }

        function initDataTable(config) {
            /*DataTable Init*/
            let dtb = $('#datable_company_list');
            if (dtb.length > 0) {
                var targetDt = dtb.DataTable(config);
                /*Checkbox Add*/
                var tdCnt = 0;
                $('table tr').each(function () {
                    $('<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select" id="chk_sel_' + tdCnt + '"><label class="form-check-label" for="chk_sel_' + tdCnt + '"></label></span>').appendTo($(this).find("td:first-child"));
                    tdCnt++;
                });
                $(document).on('click', '.del-button', function () {
                    targetDt.rows('.selected').remove().draw(false);
                    return false;
                });
                $("div.blog-toolbar-left").html('<div class="d-xxl-flex d-none align-items-center"> <select class="form-select form-select-sm w-120p"><option selected>Bulk actions</option><option value="1">Edit</option><option value="2">Move to trash</option></select> <button class="btn btn-sm btn-light ms-2">Apply</button></div><div class="d-xxl-flex d-none align-items-center form-group mb-0"> <label class="flex-shrink-0 mb-0 me-2">Sort by:</label> <select class="form-select form-select-sm w-130p"><option selected>Date Created</option><option value="1">Date Edited</option><option value="2">Frequent Contacts</option><option value="3">Recently Added</option> </select></div> <select class="d-flex align-items-center w-130p form-select form-select-sm"><option selected>Export to CSV</option><option value="2">Export to PDF</option><option value="3">Send Message</option><option value="4">Delegate Access</option> </select>');
                dtb.parent().addClass('table-responsive');


                /*Select all using checkbox*/
                var DT1 = dtb.DataTable();
                $(".check-select-all").on("click", function (e) {
                    $('.check-select').attr('checked', true);
                    if ($(this).is(":checked")) {
                        DT1.rows().select();
                        $('.check-select').prop('checked', true);
                    } else {
                        DT1.rows().deselect();
                        $('.check-select').prop('checked', false);
                    }
                });
                $(".check-select").on("click", function (e) {
                    if ($(this).is(":checked")) {
                        $(this).closest('tr').addClass('selected');
                    } else {
                        $(this).closest('tr').removeClass('selected');
                        $('.check-select-all').prop('checked', false);
                    }
                });
            }
        }

        function loadDataTable() {
            let tb = $('#datable_company_list');
            $.fn.callAjax(tb.attr('data-url'), tb.attr('data-method')).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && resp.hasOwnProperty('data') && resp.data.hasOwnProperty('company_list')) {
                    config['data'] = resp.data['company_list'] ? resp.data['company_list'] : [];
                }
                if (resp.data.company_list[0].tenant_auto_create_company === false) {
                    const add_company_div = document.getElementById("add_company_button");
                    add_company_div.remove();
                }
            }).then(() => initDataTable(config))
        }

        loadDataTable();


        function loadCurrency() {
            let ele = $('#setting-currency')
            ele.empty();
            $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && resp.hasOwnProperty('data') && resp.data.hasOwnProperty('currency_list')) {
                    data.currency_list.map(function (item) {
                        if (item.is_primary === true) {
                            ele.append(`<option value="` + item.id + `" selected>` + item.abbreviation + `</option>`)
                        } else {
                            ele.append(`<option value="` + item.id + `">` + item.abbreviation + `</option>`)
                        }
                    })
                }
            })
        }

        let url_detail;
        $(document).on('click', '.btn-setting', function () {
            loadCurrency();
            url_detail = $('#form-setting').attr('data-url')
        })

        let frm_setting_company = $('#form-setting')
        frm_setting_company.submit(function () {
            event.preventDefault();
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            let frm = new SetupFormSubmit($(this));
            let data_url = url_detail.replace(0, $('#setting-currency').val())
            let data_form = {};
            $.fn.callAjax(data_url, 'GET').then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && resp.hasOwnProperty('data') && resp.data.hasOwnProperty('currency')) {
                    data_form = data.currency;
                }
            }).then((resp) => {
                data_form["is_primary"] = 1;
                data_form["rate"] = 1;

                $.fn.callAjax(data_url, frm.dataMethod, data_form, csr)
                    .then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                $.fn.notifyPopup({description: "Successfully"}, 'success');
                                $('#modal-setting').hide();
                            }
                        },
                        (errs) => {
                        }
                    )
            })
        })
    })
});
