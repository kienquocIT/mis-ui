$(document).ready(function () {
    "use strict";
    $(function () {
        let url_detail = $('#datatable-price-list').attr('data-url-detail');
        let config = {
            dom: '<"row"<"col-7 mb-3"<"blog-toolbar-left">><"col-5 mb-3"<"blog-toolbar-right"flip>>><"row"<"col-sm-12"t>><"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
            ordering: false,
            columnDefs: [{
                "searchable": false, "orderable": false, // "targets": [0,1,3,4,5,6,7,8,9]
            }],
            order: [2, 'asc'],
            language: {
                search: "",
                searchPlaceholder: "Search",
                info: "_START_ - _END_ of _TOTAL_",
                sLengthMenu: "View  _MENU_",
                paginate: {
                    next: '<i class="ri-arrow-right-s-line"></i>', // or '→'
                    previous: '<i class="ri-arrow-left-s-line"></i>' // or '←'
                }
            },
            drawCallback: function () {
                $('.dataTables_paginate > .pagination').addClass('custom-pagination pagination-simple');
                feather.replace();
            },
            data: [],
            columns: [{
                'render': (data, type, row, meta) => {
                    let currentId = "chk_sel_" + String(meta.row + 1)
                    return `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select" id="${currentId}" data-id=` + row.id + `><label class="form-check-label" for="${currentId}"></label></span>`;
                }
            }, {
                'data': 'title', render: (data, type, row, meta) => {
                    if (row.is_default) {
                        return `<a class="btn-detail" href="` + url_detail.replace(0, row.id) + `">
                            <span><b>` + row.title.toUpperCase() + `</b></span>
                        </a>`
                    }
                    else {
                        return `<a class="btn-detail" href="` + url_detail.replace(0, row.id) + `">
                            <span><b>` + row.title + `</b></span>
                        </a>`
                    }
                }
            }, {
                'data': 'type', render: (data, type, row, meta) => {
                    if (row.price_list_type.value === 0) {
                        return `<center><span style="width: 50%; min-width: max-content" class="badge badge-soft-danger badge-pill">` + row.price_list_type.name + `</span></center>`
                    } else if (row.price_list_type.value === 1) {
                        return `<center><span style="width: 50%; min-width: max-content" class="badge badge-soft-indigo badge-pill">` + row.price_list_type.name + `</span></center>`
                    } else if (row.price_list_type.value === 2) {
                        return `<center><span style="width: 50%; min-width: max-content" class="badge badge-soft-green badge-pill">` + row.price_list_type.name + `</span></center>`
                    } else {
                        return ''
                    }
                }
            }, {
                'className': 'action-center', 'render': (data, type, row, meta) => {
                    return ``;
                }
            },]
        }

        function initDataTable(config, id_table) {
            /*DataTable Init*/
            let dtb = $(id_table);
            if (dtb.length > 0) {
                var targetDt = dtb.DataTable(config);
                /*Checkbox Add*/
                $(document).on('click', '.del-button', function () {
                    targetDt.rows('.selected').remove().draw(false);
                    return false;
                });
                $("div.blog-toolbar-left").html('<div class="d-xxl-flex d-none align-items-center"> <select class="form-select form-select-sm w-120p"><option selected>Bulk actions</option><option value="1">Edit</option><option value="2">Move to trash</option></select> <button class="btn btn-sm btn-light ms-2">Apply</button></div><div class="d-xxl-flex d-none align-items-center form-group mb-0"> <label class="flex-shrink-0 mb-0 me-2">Sort by:</label> <select class="form-select form-select-sm w-130p"><option selected>Date Created</option><option value="1">Date Edited</option><option value="2">Frequent Contacts</option><option value="3">Recently Added</option> </select></div> <select class="d-flex align-items-center w-130p form-select form-select-sm"><option selected>Export to CSV</option><option value="2">Export to PDF</option><option value="3">Send Message</option><option value="4">Delegate Access</option> </select>');
                dtb.parent().addClass('table-responsive');
            }
        }

        function loadTablePriceList() {
            const table = $('#datatable-price-list')
            let ele = $('#select-box-price-list')
            ele.html('');
            $.fn.callAjax(table.attr('data-url'), table.attr('data-method')).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('price_list')) {
                        config['data'] = resp.data.price_list;
                        ele.append(`<option></option>`)
                        data.price_list.map(function (item) {
                            ele.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                        })
                    }
                    initDataTable(config, '#datatable-price-list');
                }
            }, (errs) => {
                initDataTable(config, '#datatable-price-list');
            },)
        }

        function loadCurrency() {
            $('#select-box-currency').select2();
            let ele = $('#select-box-currency');
            let url = ele.attr('data-url');
            let method = ele.attr('data-method');
            $.fn.callAjax(url, method).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        ele.text("");
                        if (data.hasOwnProperty('currency_list') && Array.isArray(data.currency_list)) {
                            data.currency_list.map(function (item) {
                                if (item.is_primary) {
                                    ele.append(`<option disabled data-primary="1" value="` + item.id + `" selected>` + item.title + `</option>`);
                                } else
                                    ele.append(`<option data-primary="0" value="` + item.id + `">` + item.title + `</option>`);
                            })
                        }
                    }
                }
            )
        }

        loadCurrency();
        loadTablePriceList();

        $('#btn-show-modal-create').on('click', function () {
            let primaryOption = $('#select-box-currency').find('option[data-primary="1"]').text();
            $('ul').find(`li[title="` + primaryOption + `"]`).find('span').prop('hidden', true);
        })
        $('#select-box-currency').on('change', function () {
            let primaryOption = $('#select-box-currency').find('option[data-primary="1"]').text();
            $('ul').find(`li[title="` + primaryOption + `"]`).find('span').prop('hidden', true);
        })

        //logic checkbox
        $('#checkbox-copy-source').on('change', function () {
            if ($(this).prop("checked")) {
                $('#select-box-price-list').removeAttr('disabled');
                $('#checkbox-update-auto').removeAttr('disabled');
                $('#select-box-currency').prop('disabled', true);
                $('#factor-inp').prop('readonly', false);
            } else {
                $('#checkbox-update-auto').prop('checked', false);
                $('#checkbox-can-delete').prop('checked', false);
                $('#select-box-price-list').attr('disabled', 'disabled');
                $('#select-box-price-list').find('option').prop('selected', false);
                $('#checkbox-update-auto').attr('disabled', 'disabled');
                $('#checkbox-can-delete').attr('disabled', 'disabled');
                $('#select-box-currency').prop('disabled', false);
                $('#factor-inp').prop('readonly', true);
            }
        })

        $('#checkbox-update-auto').on('change', function () {
            if ($(this).prop("checked")) {
                $('#checkbox-can-delete').removeAttr('disabled');
                $('#factor-inp').val('');
            } else {
                $('#checkbox-can-delete').prop('checked', false);
                $('#checkbox-can-delete').attr('disabled', 'disabled');
                $('#factor-inp').val(1);
            }
        })

        // submit form create price list
        let frm = $('#form-create-price')
        frm.submit(function (event) {
            event.preventDefault();
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            let frm = new SetupFormSubmit($(this));

            frm.dataForm['currency'] = $('#select-box-currency').val();
            frm.dataForm['currency'].push($('#select-box-currency').find('option[data-primary="1"]').val())
            if (frm.dataForm['currency'].length === 0) {
                frm.dataForm['currency'] = null;
            }

            // if (frm.dataForm['factor'] === undefined) {
            //     frm.dataForm['factor'] =
            // }

            $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: "Successfully"}, 'success')
                            $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                        }
                    },
                    (errs) => {
                        // $.fn.notifyPopup({description: errs.data.errors}, 'failure');
                    }
                )
        });

        // onchange select box select-box-price-list
        $('#select-box-price-list').on('change', function () {
            let data_url = $(this).attr('data-url').replace(0, $(this).val())
            $.fn.callAjax(data_url, 'GET').then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('price')) {
                            $('#select-box-currency').val(data.price.currency).trigger('change');
                        }
                    }
                }
            )
        })
    })
})
