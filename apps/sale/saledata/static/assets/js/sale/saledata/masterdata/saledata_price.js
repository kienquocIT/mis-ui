$(document).ready(function () {
    //Switch view table
    $("#tab-select-table a").on("click", function () {
        let btn_create = $('#btn-show-modal-create')
        btn_create.show();
        $('#btn-save-payment').hide();
        $('#btn-back-payment').hide();
        let section = $(this).attr('data-collapse')
        $(".lookup-data").hide()
        let id_tag = `#` + section
        $(id_tag).show();
        if (section === 'section-payment-terms') {
            btn_create.removeAttr('data-bs-target');
            btn_create.removeAttr('data-bs-toggle');
        } else {
            btn_create.attr('data-bs-toggle', 'modal');
            btn_create.attr('data-bs-target', '#modal-' + section);
        }
    })

    $('#btn-show-modal-create').on('click', function () {
        if (!$(this).attr('data-bs-target')) {
            $(".lookup-data").hide();
            $('#section-create-payment-terms').show();
            $(this).hide();
            $('#btn-save-payment').show();
            $('#btn-back-payment').show();
        }
    })

    $('#btn-back-payment').on('click', function () {
        $('#btn-save-payment').hide();
        $(this).hide();
        $('#section-payment-terms').show();
        $('#section-create-payment-terms').hide();
        $('#btn-show-modal-create').show();
    })

    let config_tax_category = {
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
                return `<a href="#"><span><b>` + row.title + `</b></span></a>`
            }
        }, {
            'data': 'description', 'render': (data, type, row, meta) => {
                return `<span>` + row.description + `</span>`
            }
        }, {
            'className': 'action-center', 'render': (data, type, row, meta) => {
                // let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-type="interest" data-id="` + row.id + `" data-bs-toggle="modal" data-bs-target="#modal-update-data" data-bs-placement="top" title="" data-bs-original-title="Edit"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                // let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                return '';
            }
        },]
    }

    //submit form create tax
    // let form_create_tax = $('#form-create-tax')
    // form_create_tax.submit(function (event) {
    //     event.preventDefault();
    //     let csr = $("input[name=csrfmiddlewaretoken]").val();
    //     let frm = new SetupFormSubmit($(this));
    // })

    //submit form create tax category
    let form_create_tax_category = $('#form-create-tax-category')
    form_create_tax_category.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Successfully"}, 'success')
                        $('#modal-section-tax-category').hide();
                    }
                },
                (errs) => {
                }
            ).then(
            (rep) => {// reload dataTable after create
                console.log(123);
            })
    })
})
