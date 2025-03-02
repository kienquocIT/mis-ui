$(function () {

    $(document).ready(function () {

        // run datetimepicker
        $('.date-picker').each(function () {
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
                $(this).val(picker.startDate.format('DD/MM/YYYY')).trigger('change');
            });
            $(this).val('').trigger('change');
        });

        // file
        if (RecoveryLoadDataHandle.$form.attr('data-method').toLowerCase() === 'post') {
            new $x.cls.file($('#attachment')).init({
                name: 'attachment',
                enable_edit: true,
            });
        }

        // collapse
        $('#btn-collapse').click(function () {
            $(this.querySelector('.collapse-icon')).toggleClass('fa-angle-double-up fa-angle-double-down');
        });

        // workflow init
        WFRTControl.setWFInitialData("goodsrecovery");

        // Load init
        RecoveryLoadDataHandle.loadInit();

        RecoveryLoadDataHandle.$boxLeaseOrder.on('change', function () {
            RecoveryDataTableHandle.$tableDelivery.DataTable().clear().draw();
            RecoveryDataTableHandle.$tableProductNew.DataTable().clear().draw();
            if (RecoveryLoadDataHandle.$boxLeaseOrder.val()) {
                let data = SelectDDControl.get_data_from_idx(RecoveryLoadDataHandle.$boxLeaseOrder, RecoveryLoadDataHandle.$boxLeaseOrder.val());
                if (data) {
                    WindowControl.showLoading();
                    $.fn.callAjax2({
                            'url': RecoveryLoadDataHandle.urlEle.attr('data-delivery'),
                            'method': 'GET',
                            'data': {'order_delivery__lease_order_id': RecoveryLoadDataHandle.$boxLeaseOrder.val()},
                        }
                    ).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                if (data.hasOwnProperty('delivery_for_recovery_list') && Array.isArray(data.delivery_for_recovery_list)) {
                                    RecoveryDataTableHandle.$tableDelivery.DataTable().rows.add(data.delivery_for_recovery_list).draw();
                                    WindowControl.hideLoading();
                                }
                            }
                        }
                    )
                }
                RecoveryLoadDataHandle.loadEventRadio(RecoveryLoadDataHandle.$scrollProduct);
                RecoveryLoadDataHandle.$canvasMain.offcanvas('show');
            }
            return true;
        });

        RecoveryDataTableHandle.$tableDelivery.on('click', '.table-row-checkbox', function () {
            RecoveryLoadDataHandle.loadCheckDelivery();
            return true;
        });

        RecoveryDataTableHandle.$tableDeliveryProduct.on('click', '.table-row-checkbox', function () {
            RecoveryLoadDataHandle.$scrollProduct.removeClass('hidden');
            RecoveryLoadDataHandle.loadCheckDeliveryProduct();
        });

        RecoveryDataTableHandle.$tableProductNew.on('click', '.table-row-checkbox', function () {
            RecoveryLoadDataHandle.loadCheckNewLeasedProduct();
            return true;
        });

        RecoveryDataTableHandle.$tableProductLeased.on('click', '.table-row-checkbox', function () {
            RecoveryLoadDataHandle.loadCheckNewLeasedProduct();
            return true;
        });

        // EVENT CLICK TO COLLAPSE IN LINE APP LIST
        //      ACTION: INSERT TABLE WORKFLOW LIST TO NEXT ROW (OF APP LIST)
        RecoveryDataTableHandle.$tableWarehouse.on('click', '.btn-collapse-app-wf', function (event) {
            event.preventDefault();
            RecoveryLoadDataHandle.loadGenerateLease(this);
        });

        RecoveryDataTableHandle.$tableWarehouse.on('input', '.table-row-quantity-recovery', function () {
            let row = this.closest('tr');
            if (row) {
                let btnEle = row.querySelector('.btn-collapse-app-wf');
                if (btnEle) {
                    if (btnEle.querySelector('.fa-caret-down')) {
                        $(btnEle).trigger('click');
                    }
                }
            }
        });

        RecoveryDataTableHandle.$tableWarehouse.on('change', '.table-row-quantity-recovery', function () {
            let row = this.closest('tr');
            if (row) {
                RecoveryStoreDataHandle.storeData();
                let check = RecoveryLoadDataHandle.loadCheckExceedQuantity();
                if (check === false) {
                    let rowIndex = RecoveryDataTableHandle.$tableWarehouse.DataTable().row(row).index();
                    let $row = RecoveryDataTableHandle.$tableWarehouse.DataTable().row(rowIndex);
                    let rowData = $row.data();
                    rowData['quantity_recovery'] = 0;
                    RecoveryDataTableHandle.$tableWarehouse.DataTable().row(rowIndex).data(rowData);
                    RecoveryStoreDataHandle.storeData();
                }

                let btnEle = row.querySelector('.btn-collapse-app-wf');
                if (btnEle) {
                    $(btnEle).trigger('click');
                }
            }

        });

        RecoveryLoadDataHandle.$btnSaveProduct.on('click', function () {
            RecoveryLoadDataHandle.loadLineDetail();
            RecoveryCalculateHandle.calculateTable(RecoveryDataTableHandle.$tableProduct);
        });

        RecoveryDataTableHandle.$tableProduct.on('change', '.table-row-tax', function () {
            let row = this.closest('tr');
            if (row) {
                RecoveryCalculateHandle.calculateMain(RecoveryDataTableHandle.$tableProduct, row);
            }
        });

        RecoveryDataTableHandle.$tableProduct.on('click', '.btn-depreciation-detail', function () {
            RecoveryLoadDataHandle.loadShowDepreciation(this);
        });

        RecoveryLoadDataHandle.$depreciationModal.on('change', '.depreciation-method, .depreciation-start-date, .depreciation-end-date, .depreciation-adjustment, .lease-start-date, .lease-end-date', function () {
            if (this.classList.contains('depreciation-method')) {
                let $adjustEle = $('#depreciation_adjustment');
                if ($adjustEle.length > 0) {
                    $adjustEle.attr('readonly', 'true');
                    if ($(this).val() === '1') {
                        $adjustEle.removeAttr('readonly');
                    }
                }
            }

            RecoveryLoadDataHandle.loadDataTableDepreciation();
        });

        RecoveryLoadDataHandle.$btnSaveDepreciation.on('click', function () {
            RecoveryLoadDataHandle.loadSaveDepreciation();
            RecoveryCalculateHandle.calculateTable(RecoveryDataTableHandle.$tableProduct);
        });









// SUBMIT FORM
        SetupFormSubmit.validate(RecoveryLoadDataHandle.$form, {
            rules: {
                title: {
                    required: true,
                    maxlength: 100,
                },
            },
            errorClass: 'is-invalid cl-red',
            submitHandler: submitHandlerFunc
        });

        function submitHandlerFunc() {
            let _form = new SetupFormSubmit(RecoveryLoadDataHandle.$form);
            let result = RecoverySubmitHandle.setupDataSubmit(_form);
            if (result === false) {
                return false;
            }
            let submitFields = [
                'title',
                'code',
                'date_recovery',
                'status_recovery',
                'customer_id',
                'customer_data',
                'lease_order_id',
                'lease_order_data',
                'remark',
                'recovery_delivery_data',
                // total
                'total_pretax',
                'total_tax',
                'total',
                'total_revenue_before_tax',
                // attachment
                // 'attachment',
                // abstract
                'system_status',
                'next_node_collab_id',
                'is_change',
                'document_root_id',
                'document_change_order',
            ]
            if (_form.dataForm) {
                RecoveryCommonHandle.filterFieldList(submitFields, _form.dataForm);
            }
            WFRTControl.callWFSubmitForm(_form);
        }


    });
});
