$(function () {
    $(document).ready(function () {
        let $boxApp = $('#box-application');
        let $btnAdd = $('#btn-add-zone');
        let $btnEdit = $('#btn-edit-zone');
        let $btnCAdd = $('#btn-confirm-add');
        let $btnCEdit = $('#btn-confirm-edit');
        let $table = $('#datable-zone');

        let $eleTitle = $('#add-zone-title');
        let $eleRemark = $('#add-zone-remark');
        let $boxProp = $('#add-zone-box-prop');

        let $eleTitleEdit = $('#edit-zone-title');
        let $eleRemarkEdit = $('#edit-zone-remark');
        let $boxPropEdit = $('#edit-zone-box-prop');

        let $transFact = $('#app-trans-factory');
        let $urlFact = $('#app-url-factory');

        loadInitS2($boxApp);
        dataTableZone();

        // EVENTS
        $boxApp.on('change', function () {
            $btnAdd[0].removeAttribute('disabled');
        });

        $('#addZoneMdl').on('shown.bs.modal', function () {
            let $modal = $(this);
            loadInitS2($boxProp, [], {'application': $boxApp.val(), 'is_print': false, 'is_mail': false, 'is_sale_indicator': false}, $modal);
        });

        $btnCAdd.on('click', function () {
            if ($boxProp.val() && $boxProp.val().length > 0 && $eleTitle.val()) {
                $.fn.callAjax2({
                    url: $boxProp.attr('data-url'),
                    method: 'GET',
                    'data': {'id__in': $boxProp.val().join(',')},
                    isLoading: true,
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('application_property_list')) {
                            let dataAdd = {};
                            dataAdd['order'] = $table[0].querySelectorAll('.table-row-order').length + 1;
                            dataAdd['title'] = $eleTitle.val();
                            dataAdd['remark'] = $eleRemark.val();
                            dataAdd['property_list'] = data?.['application_property_list'];
                            $table.DataTable().row.add(dataAdd).draw().node();
                            $eleTitle.val('');
                            $eleRemark.val('');
                            $boxProp.empty();
                        }
                    }
                )
            } else {
                $.fn.notifyB({description: $transFact.attr('data-zone-required')}, 'failure');
                return false;
            }
        });

        $table.on('click', '.del-row', function () {
            deleteRowZone(this.closest('tr'), $table);
            reOrderSTTRow($table);
        });

        $table.on('click', '.edit-row', function () {
            let $modal = $('#editZoneMdl');
            let row = this.closest('tr');
            let rowOrder = row.querySelector('.table-row-order');
            let rowTitle = row.querySelector('.table-row-title');
            let rowRemark = row.querySelector('.table-row-remark');
            let rowPropList = row.querySelector('.table-row-property-list');
            if (rowOrder) {
                $btnCEdit.attr('data-order', rowOrder.innerHTML);
            }
            if (rowTitle) {
                $eleTitleEdit.val(rowTitle.innerHTML);
            }
            if (rowRemark) {
                $eleRemarkEdit.val(rowRemark.innerHTML);
            }
            if (rowPropList) {
                if (rowPropList.getAttribute('data-property-list')) {
                    let dataProp = JSON.parse(rowPropList.getAttribute('data-property-list'));
                    loadInitS2($boxPropEdit, dataProp, {'application': $boxApp.val(), 'is_print': false, 'is_mail': false, 'is_sale_indicator': false}, $modal);
                    let dataPropID = [];
                    for (let prop of dataProp) {
                        dataPropID.push(prop?.['id']);
                    }
                    $boxPropEdit.val(dataPropID);
                }
            }
            $btnEdit.click();
        });

        $btnCEdit.on('click', function () {
            if ($btnCEdit.attr('data-order')) {
                if ($boxPropEdit.val() && $boxPropEdit.val().length > 0 && $eleTitleEdit.val()) {
                    $.fn.callAjax2({
                        url: $boxPropEdit.attr('data-url'),
                        method: 'GET',
                        'data': {'id__in': $boxPropEdit.val().join(',')},
                        isLoading: true,
                    }).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data && resp.data.hasOwnProperty('application_property_list')) {
                                for (let eleOrder of $table[0].querySelectorAll('.table-row-order')) {
                                    if (eleOrder.innerHTML === $btnCEdit.attr('data-order')) {
                                        let row = eleOrder.closest('tr');
                                        let rowTitle = row.querySelector('.table-row-title');
                                        let rowRemark = row.querySelector('.table-row-remark');
                                        let rowPropList = row.querySelector('.table-row-property-list');
                                        if (rowTitle) {
                                            rowTitle.innerHTML = $eleTitleEdit.val();
                                        }
                                        if (rowRemark) {
                                            rowRemark.innerHTML = $eleRemarkEdit.val();
                                        }
                                        if (rowPropList) {
                                            $(rowPropList).empty();
                                            $(rowPropList).attr('data-property-list', JSON.stringify(data?.['application_property_list']));
                                            for (let prop of data?.['application_property_list']) {
                                                $(rowPropList).append(`<span class="badge badge-soft-green mr-1 mb-1">${prop?.['title']}</span>`);
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    )
                } else {
                    $.fn.notifyB({description: $transFact.attr('data-zone-required')}, 'failure');
                    return false;
                }
            }
        });

        // FUNCTIONS
        function loadInitS2($ele, data = [], dataParams = {}, $modal = null, isClear = false) {
            let opts = {'allowClear': isClear};
            $ele.empty();
            if (data.length > 0) {
                opts['data'] = data;
            }
            if (Object.keys(dataParams).length !== 0) {
                opts['dataParams'] = dataParams;
            }
            if ($modal) {
                opts['dropdownParent'] = $modal;
            }
            $ele.initSelect2(opts);
            return true;
        }

        function dataTableZone(data) {
            // init dataTable
            $table.DataTableDefault({
                data: data ? data : [],
                paging: false,
                info: false,
                searching: false,
                columns: [
                    {
                        targets: 0,
                        render: (data, type, row) => {
                            let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                            return `<span class="table-row-order ml-2" data-row="${dataRow}">${row?.['order']}</span>`;
                        }
                    },
                    {
                        targets: 1,
                        render: (data, type, row) => {
                            return `<p class="table-row-title">${row?.['title']}</p>`;
                        },
                    },
                    {
                        targets: 2,
                        render: (data, type, row) => {
                            return `<p class="table-row-remark">${row?.['remark']}</p>`;
                        }
                    },
                    {
                        targets: 3,
                        render: (data, type, row) => {
                            let listShow = ``;
                            for (let prop of row?.['property_list']) {
                                listShow += `<span class="badge badge-soft-green mr-1 mb-1">${prop?.['title']}</span>`;
                            }
                            return `<div class="table-row-property-list" data-property-list="${JSON.stringify(row?.['property_list']).replace(/"/g, "&quot;")}">${listShow}</div>`;
                        }
                    },
                    {
                        targets: 4,
                        render: () => {
                            return `<div class="d-flex">
                                        <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover edit-row mr-1"><span class="icon"><i class="far fa-edit"></i></span></button>
                                        <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row"><span class="icon"><i class="far fa-trash-alt"></i></span></button>
                                    </div>`;

                        }
                    },
                ],
                drawCallback: function () {
                    // add css to Dtb
                    loadCssToDtb('datable-zone');
                },
            });
        }

        function loadCssToDtb(tableID) {
            let tableIDWrapper = tableID + '_wrapper';
            let tableWrapper = document.getElementById(tableIDWrapper);
            if (tableWrapper) {
                let headerToolbar = tableWrapper.querySelector('.dtb-header-toolbar');
                if (headerToolbar) {
                    headerToolbar.classList.add('hidden');
                }
            }
        }

        function deleteRowZone(currentRow, table) {
            // Get the index of the current row within the DataTable
            let rowIndex = table.DataTable().row(currentRow).index();
            let row = table.DataTable().row(rowIndex);
            // Delete current row
            row.remove().draw();
        }

        function reOrderSTTRow(table) {
            let order = 1;
            let itemCount = table[0].querySelectorAll('.table-row-order').length;
            if (itemCount === 0) {
                table.DataTable().clear().draw();
            } else {
                for (let eleOrder of table[0].querySelectorAll('.table-row-order')) {
                    eleOrder.innerHTML = order;
                    order++
                    if (order > itemCount) {
                        break;
                    }
                }
            }
        }




    });
});