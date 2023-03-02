$(document).ready(function () {
    // load Data
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
                        return `<a href="#">
                                        <span><b>` + row.code + `</b></span>
                                    </a>`
                    }
                }, {
                    'data': 'title', render: (data, type, row, meta) => {
                        return `<span><b>` + row.title + `</b></span>`
                    }
                }, {
                    'data': 'description', 'render': (data, type, row, meta) => {
                        return `<span><b>` + row.description + `</b></span>`
                    }
                }, {
                    'className': 'action-center', 'render': (data, type, row, meta) => {
                        let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                        let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                        return bt2 + bt3;
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


            let tb_account_type = $('#datatable-account-type-list');
            $.fn.callAjax(tb_account_type.attr('data-url'), tb_account_type.attr('data-method')).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('account_type_list')) {
                        config['data'] = resp.data.account_type_list;
                    }
                    initDataTable(config, '#datatable-account-type-list');
                }
            }, (errs) => {
                initDataTable(config, '#datatable-account-type-list');
            },)


            let tb_industry = $('#datatable-industry-list');
            $.fn.callAjax(tb_industry.attr('data-url'), tb_industry.attr('data-method')).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('industry_list')) {
                        config['data'] = resp.data.industry_list;
                    }
                    initDataTable(config, '#datatable-industry-list');
                }
            }, (errs) => {
                initDataTable(config, '#datatable-industry-list');
            },)
        });
    }

    loadDefaultData();

    //Switch view table
    $("#tab-select-table a").on("click", function () {
        let section = $(this).attr('data-collapse')
        $(".lookup-data").hide()
        let id_tag = `#` + section

        let lookup = section.split('-').pop()
        $('#modal-lookup-data h5').text(lookup.charAt(0).toUpperCase() + lookup.slice(1));
        $('#form-create-lookup').attr('data-lookup', lookup)
        $(id_tag).show();
    })

    // submit form create lookup data
    let frm = $('#form-create-lookup');
    frm.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        let frm_data = frm.dataForm;
        let lookup = $('#form-create-lookup').attr('data-lookup');
        let data_url = ''
        if (lookup == 'account_type'){
            data_url = $('#form-create-lookup').attr('data-url-account-type');
        }
        else if (lookup == 'industry'){
            data_url = $('#form-create-lookup').attr('data-url-industry');
        }
        $.fn.callAjax(data_url, frm.dataMethod, frm_data, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Đang tạo mới"}, 'success')
                        $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                        $.fn.notifyPopup({description: errs.detail}, 'failure');
                    }
                },
                (errs) => {
                }
            )
    })

})

// Select checkbox in table
function selectAllCheckBox(id_table) {
    $(document).on('click', id_table + ` .check-select`, function () {
        if ($(this).is(":checked")) {
            $(this).closest('tr').addClass('selected');
        } else {
            $(this).closest('tr').removeClass('selected');
            $(id_table + ` .check-select-all`).prop('checked', false);
        }
    });

    $(document).on('click', id_table + ` .check-select-all`, function () {
        $(id_table + ` .check-select`).attr('checked', true);
        let table = $(id_table).DataTable();
        let indexList = table.rows().indexes();
        if ($(this).is(":checked")) {
            for (let idx = 0; idx < indexList.length; idx++) {
                let rowNode = table.rows(indexList[idx]).nodes()[0];
                rowNode.classList.add('selected');
                rowNode.firstElementChild.children[0].firstElementChild.checked = true;
            }
            $(id_table + ` .check-select`).prop('checked', true);
        } else {
            for (let idx = 0; idx < indexList.length; idx++) {
                let rowNode = table.rows(indexList[idx]).nodes()[0];
                rowNode.classList.remove("selected");
                rowNode.firstElementChild.children[0].firstElementChild.checked = false;
            }
            $(id_table + ` .check-select`).prop('checked', false);
        }
    });
}

selectAllCheckBox('#datatable-account-type-list');
selectAllCheckBox('#datatable-industry-list');


