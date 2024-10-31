$(document).ready(function () {
    let formSubmit = $('#frm_bidding_create');

    $('#bid-date').each(function () {
        $(this).daterangepicker({
            singleDatePicker: true,
            timepicker: false,
            showDropdowns: false,
            minYear: 2023,
            locale: {
                format: 'DD/MM/YYYY',
            },
            maxYear: parseInt(moment().format('YYYY'), 10),
            autoApply: true,
            autoUpdateInput: false,
        }).on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format('YYYY-MM-DD'));
        });
        $(this).val('').trigger('change');
    })

    WFRTControl.setWFInitialData('bidding');

    //init data only for create page
    if (formSubmit.attr('data-method').toLowerCase() === 'post') {
        new $x.cls.file($('#attachment')).init({
            name: 'attachment',
            enable_edit: true,
        });
        BiddingDataTableHandle.dataTableDocument({}, false);
        BiddingDataTableHandle.dataTableVenture({}, false);
        BiddingDataTableHandle.dataTableFile();
        BiddingDataTableHandle.dataTableDocumentModal();
        BiddingTinymceHandle.initTinymce()
        BiddingDataTableHandle.$tableDocument.on('click', '.attach-file', function () {
            BiddingStoreHandle.storeAttachment();
            BiddingLoadDataHandle.loadOpenAttachFile(this);
        });
    }

    BiddingDataTableHandle.dataTableVentureModal();

    BiddingLoadDataHandle.$opportunitySelectEle.on('change', function () {
        BiddingLoadDataHandle.loadDataByOpportunity();
    });

    BiddingLoadDataHandle.$btnAddVenture.on('click', function (e) {
        data = []
        $("#venture-modal-table .form-check-checkbox:checked").each(function (e) {
            let selectedRow = $(this).closest("tr");
            let id = $(this).data('id');
            data.push({
                "partner_account": id,
                "code": selectedRow.find(".table-row-code").text(),
                "title": selectedRow.find(".table-row-title").text(),
            })
        })
        BiddingLoadDataHandle.loadAddVenture(data)
    })

    BiddingDataTableHandle.$tableVenture.on('click', '.del-row', function () {
        let row = $(this).closest('tr');

        let rowData = BiddingDataTableHandle.$tableVenture.DataTable().row(row).data();

        let checkbox = BiddingDataTableHandle.$tableVentureModal.find(`input[type="checkbox"][data-id="${rowData.partner_account}"]`);
        if (checkbox.length) {
            checkbox.prop('checked', false);
        }

        BiddingCommonHandle.commonDeleteRow(row, BiddingDataTableHandle.$tableVenture);

    });

    BiddingDataTableHandle.$tableDocument.on('click', '.del-row', function () {
        Swal.fire({
            html: `<div class="mb-3">
                        <i class="fas fa-trash-alt text-danger"></i>
                   </div>
                   <h6 class="text-danger">
                        ${BiddingLoadDataHandle.$transScript.attr('data-trans-confirm-delete')}
                   </h6>`,
            customClass: {
                confirmButton: 'btn btn-outline-secondary text-danger',
                cancelButton: 'btn btn-outline-secondary text-gray',
                container: 'swal2-has-bg'
            },
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonText: BiddingLoadDataHandle.$transScript.attr('data-trans-delete'),
            cancelButtonText: BiddingLoadDataHandle.$transScript.attr('data-trans-cancel'),
            reverseButtons: true,
        }).then((result) => {
            if (result.value) {
                let row = $(this).closest('tr');
                let rowData = BiddingDataTableHandle.$tableDocument.DataTable().row(row).data();
                if (rowData.isManual) {
                    let checkbox = BiddingDataTableHandle.$tableDocumentModalManual.find(`input[type="checkbox"][data-id="${rowData.document_type}"]`);
                    if (checkbox.length) {
                        checkbox.prop('checked', false);
                    }
                } else {
                    let checkbox = BiddingDataTableHandle.$tableDocumentModal.find(`input[type="checkbox"][data-id="${rowData.document_type}"]`);
                    if (checkbox.length) {
                        checkbox.prop('checked', false);
                    }
                }
                BiddingCommonHandle.commonDeleteRow(row, BiddingDataTableHandle.$tableDocument);
            }
        })
    });

    BiddingLoadDataHandle.$btnAddDoc.on('click', function () {
        data = []
        $("#document-modal-table .form-check-checkbox:checked").each(function (e) {
            let selectedRow = $(this).closest("tr");
            let document_type = $(this).data('id');
            data.push({
                "document_type": document_type,
                "title": selectedRow.find(".table-row-title").text(),
                "attachment_data": [],
                "isManual": false
            })
        })
        $("#document-modal-table-manual .form-check-checkbox:checked").each(function (e) {
            let selectedRow = $(this).closest("tr");
            let document_type = $(this).data('id');
            data.push({
                "document_type": document_type,
                "title": selectedRow.find(".table-row-title").val(),
                "attachment_data": [],
                "isManual": true
            })
        })
        BiddingLoadDataHandle.loadAddDocument(data);
    })

    BiddingLoadDataHandle.$btnAddDocManual.on('click', function () {
        BiddingLoadDataHandle.loadAddDocumentManual();
    })

    let validator = SetupFormSubmit.call_validate(formSubmit, {
        onsubmit: true,
        submitHandler: function (form, event) {
            let _form = new SetupFormSubmit(formSubmit);
            BiddingSubmitHandle.setupDataSubmit(_form)
            let submitFields = [
                'title',
                'attachment',
                'opportunity',
                'document_data',
                'venture_partner',
                'bid_value' ,
                'bid_date',
                'employee_inherit_id',
                'tinymce_content'
            ]
            if (_form.dataForm) {
                BiddingCommonHandle.filterFieldList(submitFields, _form.dataForm);
            }
            $.fn.callAjax2(
                {
                    'url': formSubmit.attr('data-url'),
                    'method': 'POST',
                    'data': _form.dataForm,
                    'isLoading': true
                }
            ).then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && (data['status'] === 201 || data['status'] === 200)) {
                        $.fn.notifyB({description: data.message}, 'success');
                        setTimeout(() => {
                            window.location.replace(_form.dataUrlRedirect);
                        }, 3000);
                    }
                }, (err) => {
                    $.fn.switcherResp(err);
                    validator.showErrors(err?.data?.errors || {});
                }
            )
        }
    })
})