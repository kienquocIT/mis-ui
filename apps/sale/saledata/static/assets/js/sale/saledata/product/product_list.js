$(document).ready(function () {
    function loadDefaultData() {
        "use strict";
        $(function () {

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
                    'data': 'code', render: (data, type, row, meta) => {
                        return `<a class="badge badge-outline badge-soft-success" style="min-width: max-content; width: 70%" href="#"><center><span><b>` + row.code + `</b></span></center></a>`
                        // return `<a href=""><span><b>` + row.fullname + `</b></span></a>`
                    }
                }, {
                    'data': 'title', render: (data, type, row, meta) => {
                        return `<a href="#"><span><b>` + row.title +`</b></span></a>`
                    }
                }, {
                    'data': 'product_type', 'render': (data, type, row, meta) => {
                        if (row.general_information.product_type) {
                            return `<span class="badge badge-soft-danger badge-pill" style="min-width: max-content; width: 50%">` + row.general_information.product_type.title + `</span>`
                        }
                        else {
                            return `<span></span>`
                        }
                    }
                }, {
                    'data': 'product_category', 'render': (data, type, row, meta) => {
                        if (row.general_information.product_category) {
                            return `<span class="badge badge-soft-indigo badge-pill" style="min-width: max-content; width: 50%">` + row.general_information.product_category.title + `</span>`
                        }
                        else {
                            return `<span></span>`
                        }
                    }
                }, {
                    'className': 'action-center', 'render': (data, type, row, meta) => {
                        // let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href="/saledata/contact/update/` + row.id + `"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                        // let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                        return '';
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


            const table = $('#datatable_product_list')
            $.fn.callAjax(table.attr('data-url'), table.attr('data-method')).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    console.log(data)
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('product_list')) {
                        config['data'] = resp.data.product_list;
                    }
                    initDataTable(config, '#datatable_product_list');
                }
            }, (errs) => {
                initDataTable(config, '#datatable_product_list');
            },)
        });
    }
    loadDefaultData();
})