$(document).ready(function () {
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
                            style="min-width: max-content; width: 70%" href="#"><center><span><b>` + row.code + `</b></span></center></a>`
            }
        }, {
            'data': 'title', render: (data, type, row, meta) => {
                return `<a class="btn-detail" href="#" data-id="` + row.id + `">
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

    let frm = $('#form-update-price')
    let pk = window.location.pathname.split('/').pop();
    $.fn.callAjax(frm.attr('data-url').replace(0, pk), 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (data.hasOwnProperty('price')) {
                    config['data'] = data.price.products_mapped;
                    initDataTable(config, '#datatable-item-list');
                    loadCurrency(data.price.currency);
                    $('#select-box-type').val(data.price.price_list_type);
                    $('#inp-factor').val(data.price.factor);
                    if (data.price.auto_update === true) {
                        $('#checkbox-update-auto').prop('checked', true);
                    }
                    if (data.price.can_delete === true) {
                        $('#checkbox-can-delete').prop('checked', true);
                    }
                    loadSourcePriceList(data.price.price_list_mapped);
                }
            }
        })

    $('#btn-add-price').on('click', function () {
        let table = document.getElementById('datatable-item-list')
        let index = table.rows[0].cells.length;
        let rows = table.getElementsByTagName("tr");
        let cell = rows[0].insertCell(index-2);
        let text = document.createTextNode("Price abc");
        cell.appendChild(text);
        for (let i = 1; i < rows.length; i++) {
            let cell = rows[i].insertCell(index-2);
            let input = document.createElement("input");
            input.type = "text";
            input.className = "form-control"
            input.value = "New Column";
            cell.appendChild(input);
            // rows[i].appendChild(cell);
        }
    })
})
