$(function () {

    $(document).ready(function () {

        // Elements Case PO
        let btnConfirmAdd = $('#btn-confirm-add-product');

        // Load init
        RecoveryLoadDataHandle.loadInit();

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
                $(this).val(picker.startDate.format('DD/MM/YYYY'));
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


        RecoveryLoadDataHandle.$form.on('change', '.validated-number', function () {
            RecoveryValidateHandle.validateNumber(this);
        });

        RecoveryLoadDataHandle.$boxLeaseOrder.on('change', function () {
            RecoveryDataTableHandle.$tableDelivery.DataTable().clear().draw();
            RecoveryDataTableHandle.$tableDeliveryProduct.DataTable().clear().draw();
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
                RecoveryLoadDataHandle.$modalMain.modal('show');
            }
            return true;
        });

        RecoveryDataTableHandle.$tableDelivery.on('click', '.table-row-checkbox', function () {
            RecoveryLoadDataHandle.loadCheckDelivery();
            return true;
        });

        RecoveryDataTableHandle.$tableDeliveryProduct.on('click', '.table-row-checkbox', function () {
            let warehouseArea = RecoveryLoadDataHandle.$modalMain[0].querySelector('.dtb-warehouse-area');
            if (warehouseArea) {
                RecoveryLoadDataHandle.loadCheckDeliveryProduct();

                warehouseArea.removeAttribute('hidden');
            }
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
            let check = RecoveryLoadDataHandle.loadQuantityRecovery();
            if (check === false) {
                $(this).val('0');
                return false;
            }

            let row = this.closest('tr');
            if (row) {
                let btnEle = row.querySelector('.btn-collapse-app-wf');
                if (btnEle) {
                    $(btnEle).trigger('click');
                }
            }

            RecoveryStoreDataHandle.storeData();
            return true;
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
                'goods_receipt_type',
                'title',
                'purchase_order_id',
                'purchase_order_data',
                'inventory_adjustment_id',
                'inventory_adjustment_data',
                'production_report_type',
                'production_order_id',
                'production_order_data',
                'work_order_id',
                'work_order_data',
                'supplier_id',
                'supplier_data',
                'purchase_requests',
                'production_reports_data',
                'remarks',
                'date_received',
                // tab product
                'gr_products_data',
                // total
                'total_pretax',
                'total_tax',
                'total',
                'total_revenue_before_tax',
                // attachment
                'attachment',
                // abstract
                'system_status',
                'next_node_collab_id',
                'is_change',
                'document_root_id',
                'document_change_order',
            ]
            if (_form.dataForm) {
                filterFieldList(submitFields, _form.dataForm);
            }
            WFRTControl.callWFSubmitForm(_form);
        }


    });
});
