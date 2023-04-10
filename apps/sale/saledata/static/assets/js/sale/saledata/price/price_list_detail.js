$(document).ready(function () {
    let url_item_detail = $('#datatable-item-list').attr('data-url-detail')
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
                next: '<i class="ri-arrow-right-s-line"></i>', // or '?'
                previous: '<i class="ri-arrow-left-s-line"></i>' // or '?'
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
            'data': 'code', render: (data, type, row, meta) => {
                return `<a class="badge badge-outline badge-soft-success btn-detail" data-id="` + row.id + `"
                            style="min-width: max-content; width: 70%" href="` + url_item_detail.replace(0, row.id) + `"><center><span><b>` + row.code + `</b></span></center></a>`
            }
        }, {
            'data': 'title', render: (data, type, row, meta) => {
                return `<a class="btn-detail" href="` + url_item_detail.replace(0, row.id) + `" data-id="` + row.id + `">
                        <span><b>` + row.title + `</b></span>
                    </a>`
            }
        }, {
            'data': 'uom_group', 'render': (data, type, row, meta) => {
                return `<div class="row">
                        <div class="col-6" style="padding-right: 5px"><span class="badge badge-soft-danger badge-pill" style="min-width: max-content; width: 100%">` + row.uom_group + `</span></div>
                        </div>`
            }
        }, {
            'data': 'uom', 'render': (data, type, row, meta) => {
                return `<div class="row">
                        <div class="col-6" style="padding-right: 5px"><span class="badge badge-soft-blue badge-pill" style="min-width: max-content; width: 100%">` + row.uom + `</span></div>
                        </div>`
            }
        }, {
            'data': 'price', 'render': (data, type, row, meta) => {
                return `<span>` + row.price.toLocaleString('en-US', {minimumFractionDigits: 0}) + `</span>`
            }
        }, {
            'render': (data, type, row, meta) => {
                return ''
            }
        }, {
            'className': 'action-center', 'render': (data, type, row, meta) => {
                let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-bs-placement="top" title="" data-bs-original-title="Edit"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                let bt3 = `<a class="btn btn-icon"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                return ''
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

    function loadCurrency(list_id) {
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
                            if (list_id.includes(item.id)) {
                                if (item.is_primary === true)
                                    ele.append(`<option disabled data-primary="1" value="` + item.id + `" selected>` + item.title + `</option>`);
                                else
                                    ele.append(`<option disabled data-primary="0" value="` + item.id + `" selected>` + item.title + `</option>`);
                            } else
                                ele.append(`<option data-primary="0" value="` + item.id + `">` + item.title + `</option>`);
                        })
                    }
                }
            }
        )
    }

    function loadSourcePriceList(id) {
        let ele = $('#select-box-price-list')
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('price_list')) {

                    ele.append(`<option></option>`)
                    data.price_list.map(function (item) {
                        if (item.id === id) {
                            ele.append(`<option value="` + item.id + `" selected>` + item.title + `</option>`);
                        } else
                            ele.append(`<option value="` + item.id + `">` + item.title + `</option>`);
                    })
                }

            }
        })
    }

    function loadProDuctCategory() {
        let element = $('#select-product-category');
        $.fn.callAjax(element.attr('data-url'), element.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('product_category_list')) {
                    element.append(`<option></option>`)
                    data.product_category_list.map(function (item) {
                        element.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function loadUoMGroup() {
        let ele = $('#select-uom-group');
        ele.html('');
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('unit_of_measure_group')) {
                    ele.append(`<option></option>`);
                    resp.data.unit_of_measure_group.map(function (item) {
                        if (Object.keys(item.referenced_unit).length !== 0)
                            ele.append(`<option value="` + item.id + `">` + item.title + `</option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    $('#select-uom-group').on('change', function () {
        let select_box_uom = $('#select-uom');
        select_box_uom.html('');
        if ($(this).val()) {
            let data_url = $(this).attr('data-url-detail').replace(0, $(this).val());
            let data_method = $(this).attr('data-method');
            $.fn.callAjax(data_url, data_method).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('uom_group')) {
                        select_box_uom.append(`<option></option>`);
                        data.uom_group.uom.map(function (item) {
                            select_box_uom.append(`<option value="` + item.uom_id + `">` + item.uom_title + `</option>`);
                        })
                    }
                }
            }, (errs) => {
            },)
        }
    })

    let frm = $('#form-update-price-list')
    let pk = window.location.pathname.split('/').pop();
    $.fn.callAjax(frm.attr('data-url').replace(0, pk), 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                console.log(data)
                $('#price_list_name').text(data.price.title)
                if (data.hasOwnProperty('price')) {
                    config['data'] = data.price.products_mapped;
                    initDataTable(config, '#datatable-item-list');
                    loadCurrency(data.price.currency);
                    $('#select-box-type').val(data.price.price_list_type);
                    $('#inp-factor').val(data.price.factor);
                    if (data.price.auto_update === true) {
                        $('#checkbox-update-auto').prop('checked', true);
                        $('#select-product-category').prop('disabled', 'disabled');
                        $('#select-box-currency').prop('disabled', 'disabled');
                        $('#checkbox-can-delete').prop('disabled', false);
                    }
                    if (data.price.can_delete === true) {
                        $('#checkbox-can-delete').prop('checked', true);
                    }
                    if (data.price.price_list_mapped !== null) {
                        loadSourcePriceList(data.price.price_list_mapped);
                        $('#checkbox-update-auto').prop('disabled', false);
                    }
                    loadProDuctCategory();
                    loadUoMGroup();
                }
            }
        }).then((resp) => {
        if (config['data'].length === 0) {
            let table = document.getElementById('datatable-item-list')
            table.rows[0].cells[6].remove();
        }
    })

    $('#checkbox-update-auto').on('change', function () {
        if ($(this).prop("checked")) {
            $('#checkbox-can-delete').removeAttr('disabled');
        } else {
            $('#checkbox-can-delete').prop('checked', false);
            $('#checkbox-can-delete').attr('disabled', 'disabled');
        }
    })

    let price_list_copy_from_source = [];
    price_list_copy_from_source.push(pk);
    $.fn.callAjax($('#form-update-price-list').attr('data-url-list'), 'GET').then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('price_list')) {
                data.price_list.map(function (item) {
                    if (item.price_list_type.value === 0) {
                        if (price_list_copy_from_source.includes(item.price_list_mapped) && item.auto_update === true)
                            price_list_copy_from_source.push(item.id);
                    }
                })
            }
        }
    }).then((resp) => {
        frm.submit(function (event) {
            console.log(price_list_copy_from_source);
            event.preventDefault();
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            let frm = new SetupFormSubmit($(this));
            frm.dataForm['currency'] = $('#select-box-currency').val();
            frm.dataForm['currency'].push($('#select-box-currency').find('option[data-primary="1"]').val())
            if (frm.dataForm['currency'].length === 0) {
                frm.dataForm['currency'] = null;
            }

            frm.dataMethod['price_list_child'] = price_list_copy_from_source;
            $.fn.callAjax(frm.dataUrl.replace(0, pk), frm.dataMethod, frm.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: "Successfully"}, 'success')
                            // $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                        }
                    },
                    (errs) => {
                        // $.fn.notifyPopup({description: errs.data.errors}, 'failure');
                    }
                )
        })
    })

    $('.btn-add-price').on('click', function () {
        let table = document.getElementById('datatable-item-list')
        if (table.rows[1].childNodes.length !== 1) {
            let index = table.rows[0].cells.length;
            let rows = table.getElementsByTagName("tr");
            let cell = rows[0].insertCell(index - 2);
            let text = document.createTextNode("Price abc");
            cell.appendChild(text);
            for (let i = 1; i < rows.length; i++) {
                let cell = rows[i].insertCell(index - 2);
                let input = document.createElement("input");
                input.type = "number";
                input.className = "form-control"
                cell.appendChild(input);
            }
        }
    })
})
