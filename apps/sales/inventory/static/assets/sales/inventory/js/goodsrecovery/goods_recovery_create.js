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
        WFRTControl.setWFInitialData("goodsreceipt");


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
            }
            return true;
        });

        RecoveryDataTableHandle.$tableDelivery.on('click', '.table-row-checkbox', function () {
            RecoveryDataTableHandle.$tableDeliveryProduct.DataTable().clear().draw();
            let row = this.closest('tr');
            if (row) {
                let rowIndex = RecoveryDataTableHandle.$tableDelivery.DataTable().row(row).index();
                let $row = RecoveryDataTableHandle.$tableDelivery.DataTable().row(rowIndex);
                let rowData = $row.data();
                RecoveryDataTableHandle.$tableDeliveryProduct.DataTable().rows.add(rowData?.['delivery_product']).draw();
            }
            return true;
        });

        // EVENT CHANGE IN LINE APP LIST
        $(document).on('change', '.mode-workflow', function (event) {
            event.preventDefault();
            let valId = $(this).val();
            let state = confirm($('#idxSpanMsgGroup').attr('data-make-sure') + ' "' + $(this).find('option[value="' + valId + '"]').text() + '"');
            let previousValue = $(this).data("previousValue");
            if (!state) {
                $(this).prop("selectedIndex", -1);
                if (previousValue) $(this).val(previousValue);
            } else {
                let rowData = DTBControl.getRowData($(this));
                if (rowData.id) {
                    WindowControl.showLoading();
                    let urlBase = $('#url-factory').attr('data-url-app-workflow-detail');
                    let urlData = SetupFormSubmit.getUrlDetailWithID(urlBase, rowData.id);
                    $.fn.callAjax(urlData, 'PUT', {'mode': valId}, $("input[name=csrfmiddlewaretoken]").val(),).then((resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data?.status === 200) {
                            $.fn.notifyB({
                                'description': $('#base-trans-factory').attr('data-success')
                            }, 'success');
                        }
                        setTimeout(() => {
                            WindowControl.hideLoading();
                        }, 1000,)
                    }, (errs) => {
                        if (previousValue) $(this).val(previousValue);
                        WindowControl.hideLoading();
                    })

                }
            }
        });
        $(document).on('change', '.select-workflow-current', function (event) {
            event.preventDefault();
            let valId = $(this).val();
            let state = confirm($('#idxSpanMsgGroup').attr('data-make-sure') + ' "' + $(this).find('option[value="' + valId + '"]').text() + '"');
            if (!state) {
                let previousValue = $(this).data("previousValue");
                $(this).prop("selectedIndex", -1);
                if (previousValue) $(this).val(previousValue);
            } else {
                let rowData = DTBControl.getRowData($(this));
                if (rowData.id) {
                    WindowControl.showLoading();
                    let urlBase = $('#url-factory').attr('data-url-app-workflow-detail');
                    let urlData = SetupFormSubmit.getUrlDetailWithID(urlBase, rowData.id);
                    $.fn.callAjax(urlData, 'PUT', {'workflow_currently': valId}, $("input[name=csrfmiddlewaretoken]").val(),).then((resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data?.status === 200) {
                            $.fn.notifyB({
                                'description': $('#base-trans-factory').attr('data-success')
                            }, 'success');
                        }
                        setTimeout(() => {
                            WindowControl.hideLoading();
                        }, 1000,)
                    }, (errs) => {
                        WindowControl.hideLoading();
                    })

                }
            }
        });

        // EVENT CLICK TO COLLAPSE IN LINE APP LIST
        //      ACTION: INSERT TABLE WORKFLOW LIST TO NEXT ROW (OF APP LIST)
        $(document).on('click', '.btn-collapse-app-wf', function (event) {
            event.preventDefault();

            let idTbl = UtilControl.generateRandomString(12);
            let trEle = $(this).closest('tr');
            let iconEle = $(this).find('.icon-collapse-app-wf');

            iconEle.toggleClass('fa-caret-right').toggleClass('fa-caret-down');

            if (iconEle.hasClass('fa-caret-right')) {
                trEle.removeClass('bg-grey-light-5');
                iconEle.removeClass('text-dark').addClass('text-secondary');
                trEle.next().find('.child-workflow-group').slideToggle({
                    complete: function () {
                        trEle.next().addClass('hidden');
                    }
                });
            }

            if (iconEle.hasClass('fa-caret-down')) {
                trEle.addClass('bg-grey-light-5');
                iconEle.removeClass('text-secondary').addClass('text-dark');

                if (!trEle.next().hasClass('child-workflow-list')) {
                    let dtlSub = `<table id="${idTbl}" class="table table-child nowrap w-100 mb-5"><thead></thead><tbody></tbody></table>`
                    $(this).closest('tr').after(
                        `<tr class="child-workflow-list"><td colspan="4"><div class="child-workflow-group pt-3 pb-3 ml-3 pl-5 pr-5 hidden-simple">${dtlSub}</div></td></tr>`
                    );

                    let placeGetData = $('#url-factory');
                    let urlWorkflowDetail = placeGetData.attr('data-url-workflow-detail');
                    $('#' + idTbl).DataTableDefault({
                        "url-detail": urlWorkflowDetail,
                        data: [
                            {'lease_code': 'LEASE1', 'serial': '', 'remark': '',},
                            {'lease_code': 'LEASE2', 'serial': '', 'remark': '',},
                            {'lease_code': 'LEASE3', 'serial': '', 'remark': '',},
                        ],
                        paging: false,
                        info: false,
                        columns: [
                            {
                                title: 'Lease number',
                                render: (data, type, row) => {
                                    return `${row?.['lease_code']}`;
                                }
                            },
                            {
                                title: 'Serial',
                                render: (data, type, row) => {
                                    return `${row?.['serial']}`;
                                }
                            },
                            {
                                title: 'Note',
                                render: (data, type, row) => {
                                    return `${row?.['remark']}`;
                                }
                            },
                            {
                                title: 'Get',
                                render: (data, type, row) => {
                                    return ``;
                                }
                            },
                        ],
                        drawCallback: function () {
                            // add css to Dtb
                            RecoveryLoadDataHandle.loadCssToDtb(idTbl);
                        },
                    });
                } else {
                    let $child = trEle.next();
                    if ($child.length > 0) {
                        let tblChild = $child[0].querySelector('.table-child');
                    if (tblChild) {
                        $(tblChild).DataTable().clear().draw();
                        $(tblChild).DataTable().rows.add([
                            {'lease_code': 'LEASE1', 'serial': '', 'remark': '',},
                            {'lease_code': 'LEASE2', 'serial': '', 'remark': '',},
                            {'lease_code': 'LEASE3', 'serial': '', 'remark': '',},
                        ]).draw();
                    }
                    }

                }
                trEle.next().removeClass('hidden').find('.child-workflow-group').slideToggle();
            }
        });







        // Action on change dropdown PO
        RecoveryLoadDataHandle.POSelectEle.on('change', function () {
            RecoveryLoadDataHandle.loadChangePO($(this));
            RecoveryLoadDataHandle.loadClearModal();
            RecoveryLoadDataHandle.loadCallAjaxProduct();
            $('#btn-edit-product-good-receipt').click();
        });

        btnConfirmAdd.on('click', function () {
            RecoveryStoreDataHandle.storeDataProduct();
            RecoveryLoadDataHandle.loadLineDetail();
        });

        RecoveryDataTableHandle.tablePOProduct.on('click', '.table-row-checkbox', function () {
            RecoveryLoadDataHandle.loadCheckPOProduct(this);
        });

        RecoveryDataTableHandle.tablePOProduct.on('change', '.table-row-import', function () {
            let remain = parseFloat(this.closest('tr').querySelector('.table-row-gr-remain').innerHTML);
            let valid_import = RecoveryValidateHandle.validateImportProductNotInventory(this, remain);
            let eleCheck = this?.closest('tr')?.querySelector('.table-row-checkbox');
            if (eleCheck) {
                eleCheck.checked = valid_import;
            }
        });

        RecoveryDataTableHandle.tableWH.on('click', '.table-row-checkbox', function () {
            RecoveryLoadDataHandle.loadCheckWH(this);
        });

        RecoveryDataTableHandle.tableWH.on('change', '.table-row-import', function () {
            if (this.closest('tr').querySelector('.table-row-checkbox').checked === false) {
                $(this.closest('tr').querySelector('.table-row-checkbox')).click();
            }
            let result = RecoveryLoadDataHandle.loadQuantityImport();
            if (result === false) {
                this.value = 0;
                RecoveryLoadDataHandle.loadQuantityImport();
            }
            RecoveryStoreDataHandle.storeDataProduct();
        });

        RecoveryDataTableHandle.tableWH.on('click', '.table-row-checkbox-additional', function () {
            RecoveryLoadDataHandle.loadCheckIsAdditional(this);
        });

        RecoveryLoadDataHandle.btnAddLot.on('click', function () {
            RecoveryLoadDataHandle.loadAddRowLot();
        });

        RecoveryDataTableHandle.tableLot.on('click', '.dropdown-item-lot', function () {
            let row = this.closest('tr');
            RecoveryLoadDataHandle.loadUnCheckLotDDItem(row);
            RecoveryLoadDataHandle.loadCheckLotDDItem(this, row);
        });

        RecoveryDataTableHandle.tableLot.on('change', '.table-row-lot-number', function () {
            RecoveryLoadDataHandle.loadCheckApplyLot(this);
        });

        RecoveryDataTableHandle.tableLot.on('change', '.table-row-import', function () {
            let result = RecoveryLoadDataHandle.loadQuantityImport();
            if (result === false) {
                let rowIndex = RecoveryDataTableHandle.tableLot.DataTable().row(this.closest('tr')).index();
                let row = RecoveryDataTableHandle.tableLot.DataTable().row(rowIndex);
                row.remove().draw();
                RecoveryLoadDataHandle.loadQuantityImport();
            }
            RecoveryStoreDataHandle.storeDataProduct();
        });

        RecoveryDataTableHandle.tableLot.on('change', '.table-row-expire-date, .table-row-manufacture-date', function () {
            let row = this.closest('tr');
            RecoveryLoadDataHandle.loadDataIfChangeDateLotRow(row);
        });

        RecoveryLoadDataHandle.btnAddSerial.on('click', function () {
            RecoveryLoadDataHandle.loadAddRowSerial();
        });

        RecoveryDataTableHandle.tableSerial.on('change', '.table-row-serial-number', function () {
            RecoveryLoadDataHandle.loadCheckApplySerial(this);
        });

        RecoveryDataTableHandle.$tableProduct.on('change', '.table-row-price, .table-row-tax', function () {
            let row = this.closest('tr');
            GRCalculateHandle.calculateMain(RecoveryDataTableHandle.$tableProduct, row);
        });

        RecoveryDataTableHandle.$tableProduct.on('click', '.del-row', function () {
            deleteRowGR(this.closest('tr'), RecoveryDataTableHandle.$tableProduct);
            reOrderRowTable(RecoveryDataTableHandle.$tableProduct);
            GRCalculateHandle.calculateTable(RecoveryDataTableHandle.$tableProduct);
        });

        RecoveryDataTableHandle.tableLot.on('click', '.del-row', function () {
            deleteRowGR(this.closest('tr'), RecoveryDataTableHandle.tableLot);
        });

        RecoveryDataTableHandle.tableSerial.on('click', '.del-row', function () {
            deleteRowGR(this.closest('tr'), RecoveryDataTableHandle.tableSerial);
        });

        $('#productModalCenter').on('change', '.validated-number', function () {
            RecoveryValidateHandle.validateNumber(this);
        });

        $('#productIAModalCenter').on('change', '.validated-number', function () {
            RecoveryValidateHandle.validateNumber(this);
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
