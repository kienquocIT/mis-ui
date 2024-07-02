$(function () {
    $(document).ready(function () {
        let $form = $('#frm_app_zones');

        let $boxApp = $('#box-application');
        let $btnCAdd = $('#btn-confirm-add');
        let $btnCEdit = $('#btn-confirm-edit');
        let $table = $('#table_zones_list');

        let $eleTitle = $('#add-zone-title');
        let $eleRemark = $('#add-zone-remark');
        let $boxProp = $('#add-zone-box-prop');

        let $eleTitleEdit = $('#edit-zone-title');
        let $eleRemarkEdit = $('#edit-zone-remark');
        let $boxPropEdit = $('#edit-zone-box-prop');

        let $transFact = $('#app-trans-factory');
        let $urlFact = $('#app-url-factory');


        // EVENTS
        $('#addZoneMdl').on('shown.bs.modal', function () {
            let $modal = $(this);
            if ($btnCAdd.attr('data-row')) {
                let dataRow = JSON.parse($btnCAdd.attr('data-row'));
                loadInitS2($boxProp, [], {
                    'application': dataRow?.['id'],
                    'is_print': false,
                    'is_mail': false,
                    'is_sale_indicator': false
                }, $modal);
            }
        });

        $btnCAdd.on('click', function () {
            if ($btnCAdd.attr('data-table-id')) {
                let $tableZone = $(`#${$btnCAdd.attr('data-table-id')}`);
                if ($boxProp.val() && $boxProp.val().length > 0 && $eleTitle.val()) {
                    $.fn.callAjax2({
                        url: $boxProp.attr('data-url'),
                        method: 'GET',
                        'data': {'id__in': $boxProp.val().join(',')},
                        isLoading: false,
                    }).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data && resp.data.hasOwnProperty('application_property_list')) {
                                let dataAdd = {};
                                dataAdd['order'] = $tableZone[0].querySelectorAll('.table-row-order').length + 1;
                                dataAdd['title'] = $eleTitle.val();
                                dataAdd['remark'] = $eleRemark.val();
                                dataAdd['properties_data'] = data?.['application_property_list'];
                                $tableZone.DataTable().row.add(dataAdd).draw().node();
                                submitZone($btnCAdd);
                            }
                        }
                    )
                } else {
                    $.fn.notifyB({description: $transFact.attr('data-zone-required')}, 'failure');
                    return false;
                }
            }
        });

        $table.on('click', '.del-row', function () {
            let zonesArea = this.closest('.zones-area');
            if (zonesArea) {
                let tableZone = zonesArea.querySelector('.table-zones');
                if (tableZone) {
                    $(this).attr('data-table-id', tableZone.id);
                    $(this).attr('data-row', $(zonesArea).attr('data-row'));
                    deleteRowZone(this.closest('tr'), $(tableZone));
                    reOrderSTTRow($(tableZone));
                    submitZone($(this));
                }
            }
        });

        $table.on('click', '.edit-row', function () {
            let $modal = $('#editZoneMdl');
            let row = this.closest('tr');
            let rowOrder = row.querySelector('.table-row-order');
            let rowTitle = row.querySelector('.table-row-title');
            let rowRemark = row.querySelector('.table-row-remark');
            let rowPropList = row.querySelector('.table-row-property-list');
            let zonesArea = this.closest('.zones-area');
            if (zonesArea) {
                let tableZone = zonesArea.querySelector('.table-zones');
                if (tableZone) {
                    $btnCEdit.attr('data-table-id', tableZone.id);
                    $btnCEdit.attr('data-row', $(zonesArea).attr('data-row'));
                }
                let btnEdit = zonesArea.querySelector('.btn-edit-zone');
                if (btnEdit) {
                    $(btnEdit).click();
                }
            }

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
                if (rowPropList.getAttribute('data-properties') && $btnCEdit.attr('data-row')) {
                    let dataProp = JSON.parse(rowPropList.getAttribute('data-properties'));
                    let dataRow = JSON.parse($btnCEdit.attr('data-row'));
                    loadInitS2($boxPropEdit, dataProp, {
                        'application': dataRow?.['id'],
                        'is_print': false,
                        'is_mail': false,
                        'is_sale_indicator': false
                    }, $modal);
                    let dataPropID = [];
                    for (let prop of dataProp) {
                        dataPropID.push(prop?.['id']);
                    }
                    $boxPropEdit.val(dataPropID);
                }
            }
        });

        $btnCEdit.on('click', function () {
            if ($btnCEdit.attr('data-order') && $btnCEdit.attr('data-table-id')) {
                let $tableZone = $(`#${$btnCEdit.attr('data-table-id')}`);
                if ($boxPropEdit.val() && $boxPropEdit.val().length > 0 && $eleTitleEdit.val()) {
                    $.fn.callAjax2({
                        url: $boxPropEdit.attr('data-url'),
                        method: 'GET',
                        'data': {'id__in': $boxPropEdit.val().join(',')},
                        isLoading: false,
                    }).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data && resp.data.hasOwnProperty('application_property_list')) {
                                for (let eleOrder of $tableZone[0].querySelectorAll('.table-row-order')) {
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
                                            $(rowPropList).attr('data-properties', JSON.stringify(data?.['application_property_list']));
                                            for (let prop of data?.['application_property_list']) {
                                                $(rowPropList).append(`<span class="badge badge-soft-green mr-1 mb-1">${prop?.['title']}</span>`);
                                            }
                                        }
                                        submitZone($btnCEdit);
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

        $table.on('click', '.btn-add-zone', function () {
            let zonesArea = this.closest('.zones-area');
            if (zonesArea) {
                let tableZone = zonesArea.querySelector('.table-zones');
                if (tableZone) {
                    $btnCAdd.attr('data-table-id', tableZone.id);
                    $btnCAdd.attr('data-row', $(zonesArea).attr('data-row'));
                }
            }
        });

        $table.on('click', '.btn-save-zone', function () {
            let zonesArea = this.closest('.zones-area');
            if (zonesArea) {
                if ($(zonesArea).attr('data-row')) {
                    let dataRow = JSON.parse(($(zonesArea).attr('data-row')));
                    let dataSubmit = {'application': dataRow?.['id']};
                    let zones_data = [];
                    let tableZone = zonesArea.querySelector('.table-zones');
                    if (tableZone) {
                        $(tableZone).DataTable().rows().every(function () {
                            let row = this.node();
                            let zone_data = {};
                            let rowOrder = row.querySelector('.table-row-order');
                            let rowTitle = row.querySelector('.table-row-title');
                            let rowRemark = row.querySelector('.table-row-remark');
                            let rowPropList = row.querySelector('.table-row-property-list');
                            if (rowOrder) {
                                zone_data['order'] = parseInt(rowOrder.innerHTML);
                            }
                            if (rowTitle) {
                                zone_data['title'] = rowTitle.innerHTML;
                            }
                            if (rowRemark) {
                                zone_data['remark'] = rowRemark.innerHTML;
                            }
                            if (rowPropList) {
                                if ($(rowPropList).attr('data-properties')) {
                                    let propIDList = [];
                                    let propListData = JSON.parse($(rowPropList).attr('data-properties'));
                                    for (let propData of propListData) {
                                        propIDList.push(propData?.['id']);
                                    }
                                    zone_data['properties_data'] = propIDList;
                                }
                            }
                            zones_data.push(zone_data);
                        });
                        dataSubmit['zones_data'] = zones_data;
                        WindowControl.showLoading();
                        $.fn.callAjax2(
                            {
                                'url': $urlFact.attr('data-url-zones'),
                                'method': "POST",
                                'data': dataSubmit,
                            }
                        ).then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data && (data['status'] === 201 || data['status'] === 200)) {
                                    $.fn.notifyB({description: data.message}, 'success');
                                    loadZones($(tableZone), dataRow);
                                    setTimeout(() => {
                                        WindowControl.hideLoading();
                                    }, 1000)
                                }
                            }, (err) => {
                                setTimeout(() => {
                                    WindowControl.hideLoading();
                                }, 1000)
                                $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
                            }
                        )
                    }
                }
            }
        });


        // INIT DATATABLE APP LIST
        $table.DataTableDefault({
            useDataServer: true,
            ajax: {
                url: $table.attr('data-url'),
                type: $table.attr('data-method'),
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('tenant_application_list')) {
                        return resp.data['tenant_application_list'] ? resp.data['tenant_application_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            pageLength: 50,
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<div class="d-flex justify-content-start">
                                <button class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-collapse-app-wf mr-1" data-row="${dataRow}"><span class="icon"><i class="icon-collapse-app-wf fas fa-caret-right text-secondary"></i></span></button>
                                <p class="table-row-application mt-2">${row?.['title']}</p>
                            </div>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<p></p>`;
                    }
                },
            ]
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
                iconEle.removeClass('text-dark').addClass('text-secondary');
                trEle.next().find('.child-workflow-group').slideToggle({
                    complete: function () {
                        trEle.next().addClass('hidden');
                    }
                });
            }

            if (iconEle.hasClass('fa-caret-down')) {
                iconEle.removeClass('text-secondary').addClass('text-dark');

                if (!trEle.next().hasClass('child-workflow-list')) {
                    if ($(this).attr('data-row')) {
                        let dataRow = JSON.parse(($(this).attr('data-row')));
                        let dtlSub = `<div class="zones-area" data-row="${JSON.stringify(dataRow).replace(/"/g, "&quot;")}">
                                    <h5>Zones detail</h5>
                                    <table
                                            id="${idTbl}"
                                            class="table nowrap w-100 mb-5 table-zones"
                                    >
                                        <thead>
                                        <tr class="bg-light">
                                            <th class="w-5"></th>
                                            <th class="w-20">Name</th>
                                            <th class="w-30">Description</th>
                                            <th class="w-40">Properties</th>
                                            <th class="w-5"></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        </tbody>
                                    </table>
                                    <div class="d-flex justify-content-between">
                                        <button type="button" class="btn btn-outline-primary btn-sm btn-add-zone" data-bs-toggle="modal" data-bs-target="#addZoneMdl">
                                            <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>New</span></span>
                                        </button>
                                        <button type="button" class="btn btn-outline-primary btn-save-zone" hidden>
                                            <span><span class="icon"><i class="fa-regular fa-floppy-disk"></i></span><span>Save</span></span>
                                        </button>
                                        <button type="button" class="btn btn-outline-primary btn-edit-zone" data-bs-toggle="modal" data-bs-target="#editZoneMdl" hidden>
                                            <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>{% trans 'New' %}</span></span>
                                        </button>
                                    </div>
                                </div>`;
                        $(this).closest('tr').after(
                            `<tr class="child-workflow-list"><td colspan="2"><div class="child-workflow-group pt-3 pb-3 ml-3 pl-5 pr-5 border-left hidden-simple">${dtlSub}</div></td></tr>`
                        );
                        let $table = $(`#${idTbl}`);
                        loadZones($table, dataRow);
                    }
                }
                trEle.next().removeClass('hidden').find('.child-workflow-group').slideToggle();
            }
        });

        // EVENT IN LINE WORKFLOW LIST
        $(document).on('click', '.btn-delete-wf', function (event) {
            event.preventDefault();
            let rowData = DTBControl.getRowData($(this));
            alert('Delete WF: ' + rowData?.['title']);
        });
        $(document).on('click', '.btn-change-wf-doc', function (event) {
            event.preventDefault();
            let rowData = DTBControl.getRowData($(this));
            alert('Change WF of doc: ' + rowData?.['title']);
        });

        // EVENT CLICK TO COLLAPSE IN LINE WORKFLOW LIST
        //      ACTION: INSERT RUNTIME OBJ LIST TO NEXT ROW (OF WORKFLOW LIST)
        $(document).on('click', '.btn-collapse-doc-wf', function (event) {
            event.preventDefault();
            let idTbl = UtilControl.generateRandomString(12);
            let trEle = $(this).closest('tr');
            let iconEle = $(this).find('.icon-collapse-doc-wf');
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
                    let dtlSub = `<table id="${idTbl}" class="table nowrap w-100 mb-5"><thead></thead><tbody></tbody></table>`
                    $(this).closest('tr').after(
                        `<tr class="child-workflow-list"><td colspan="6"><div class="child-workflow-group pt-3 pb-3 ml-3 pl-5 pr-5 hidden-simple">${dtlSub}</div></td></tr>`
                    )

                    let rowData = DTBControl.getRowData($(this));
                    let urlRuntimeList = $('#url-factory').attr('data-url-workflow-runtime-list');
                    $('#' + idTbl).DataTableDefault({
                        ajax: {
                            url: SetupFormSubmit.getUrlDetailWithID(urlRuntimeList, rowData.id),
                            type: 'GET',
                            dataSrc: function (resp) {
                                let data = $.fn.switcherResp(resp);
                                if (data) {
                                    console.log(data)
                                    return resp.data['runtime_list'] ? resp.data['runtime_list'] : [];
                                }
                                return [];
                            },
                        },
                        columns: [
                            {
                                title: "#",
                                render: () => {
                                    return '';
                                }
                            },
                            {
                                data: 'doc_title',
                                title: "Title",
                                render: (data, type, row) => {
                                    return data ? data : '';
                                }
                            },
                            {
                                data: 'doc_employee_created',
                                title: "Creator",
                                render: (data, type, row) => {
                                    if (data && $.fn.hasOwnProperties(data, ['id', 'full_name', 'is_active'])) {
                                        if (data['is_active'] === true) return data['full_name'] + ` <span class="badge badge-success badge-indicator"></span>`;
                                        return data['full_name'] + `<span class="badge badge-secondary badge-indicator"></span>`;
                                    }
                                    return '_';
                                }
                            },
                            {
                                data: "date_created",
                                title: "Posting date",
                                render: (data, type, row) => {
                                    return $x.fn.displayRelativeTime(data);
                                }
                            },
                            {
                                data: 'stage_currents',
                                title: "Node currently",
                                render: (data, type, row) => {
                                    if (typeof data === 'object' && $.fn.hasOwnProperties(data, ['id', 'title', 'code'])) {
                                        if (data['code']) {
                                            return `<span class="badge badge-warning badge-outline">${data['code']}</span>`;
                                        } else {
                                            return `<span class="badge badge-success badge-outline">${data['title']}</span>`;
                                        }
                                    }
                                    return '_';
                                }
                            },
                            {
                                data: "state",
                                title: "Status",
                                render: (data, type, row, meta) => {
                                    if (data && Number.isFinite(data)) {
                                        if (txt_state_wf_doc.hasOwnProperty(data)) {
                                            return `<span class="badge ${txt_state_wf_doc[data][1]}">${txt_state_wf_doc[data][0]}</span>`;
                                        }
                                    }
                                    return `<span class="badge badge-soft-success">OK</span>`;
                                }
                            },
                            {
                                title: "Action",
                                render: (data, type, row) => {
                                    if (!(row.state === 2 || row.state === 3 || row.status === 1)) {
                                        return `<button class="btn btn-icon btn-rounded bg-dark-hover mr-1"><span class="icon"><i class="far fa-paper-plane"></i></span></button>`;
                                    }
                                    return '_';
                                }
                            },
                        ]
                    });
                }
                trEle.next().removeClass('hidden').find('.child-workflow-group').slideToggle();
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

        function loadZones($table, dataRow) {
            $.fn.callAjax2({
                    'url': $urlFact.attr('data-url-zones'),
                    'method': 'GET',
                    'data': {'application_id': dataRow?.['id']},
                    isLoading: false,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('zones_list') && Array.isArray(data.zones_list)) {
                            $table.DataTable().clear().destroy();
                            dataTableZone($table);
                            $table.DataTable().rows.add(data?.['zones_list']).draw();
                        }
                    }
                }
            )
        }
        
        function dataTableZone($table, data) {
            // init dataTable
            $table.DataTableDefault({
                data: data ? data : [],
                paging: false,
                info: false,
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
                            for (let prop of row?.['properties_data']) {
                                listShow += `<span class="badge badge-soft-green mr-1 mb-1">${prop?.['title']}</span>`;
                            }
                            return `<div class="table-row-property-list" data-properties="${JSON.stringify(row?.['properties_data']).replace(/"/g, "&quot;")}">${listShow}</div>`;
                        }
                    },
                    {
                        targets: 4,
                        render: () => {
                            return `<div class="d-flex">
                                        <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover edit-row mr-1" data-bs-toggle="modal" data-bs-target="#editZoneMdl"><span class="icon"><i class="far fa-edit"></i></span></button>
                                        <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row"><span class="icon"><i class="far fa-trash-alt"></i></span></button>
                                    </div>`;

                        }
                    },
                ],
                drawCallback: function () {
                    // add css to Dtb
                    loadCssToDtb($table[0].id);
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

        function submitZone($btnConfirm) {
            if ($btnConfirm.attr('data-table-id') && $btnConfirm.attr('data-row')) {
                let $tableZone = $(`#${$btnConfirm.attr('data-table-id')}`);
                let dataRow = JSON.parse(($btnConfirm.attr('data-row')));
                let dataSubmit = {'application': dataRow?.['id']};
                let zones_data = [];
                $tableZone.DataTable().rows().every(function () {
                    let row = this.node();
                    let zone_data = {};
                    let rowOrder = row.querySelector('.table-row-order');
                    let rowTitle = row.querySelector('.table-row-title');
                    let rowRemark = row.querySelector('.table-row-remark');
                    let rowPropList = row.querySelector('.table-row-property-list');
                    if (rowOrder) {
                        zone_data['order'] = parseInt(rowOrder.innerHTML);
                    }
                    if (rowTitle) {
                        zone_data['title'] = rowTitle.innerHTML;
                    }
                    if (rowRemark) {
                        zone_data['remark'] = rowRemark.innerHTML;
                    }
                    if (rowPropList) {
                        if ($(rowPropList).attr('data-properties')) {
                            let propIDList = [];
                            let propListData = JSON.parse($(rowPropList).attr('data-properties'));
                            for (let propData of propListData) {
                                propIDList.push(propData?.['id']);
                            }
                            zone_data['properties_data'] = propIDList;
                        }
                    }
                    zones_data.push(zone_data);
                });
                dataSubmit['zones_data'] = zones_data;
                WindowControl.showLoading();
                $.fn.callAjax2(
                    {
                        'url': $urlFact.attr('data-url-zones'),
                        'method': "POST",
                        'data': dataSubmit,
                    }
                ).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && (data['status'] === 201 || data['status'] === 200)) {
                            $.fn.notifyB({description: data.message}, 'success');
                            loadZones($tableZone, dataRow);
                            $eleTitle.val('');
                            $eleRemark.val('');
                            $boxProp.empty();
                            $btnConfirm.attr('data-table-id', '');
                            $btnConfirm.attr('data-row', '');
                            setTimeout(() => {
                                WindowControl.hideLoading();
                            }, 1000)
                        }
                    }, (err) => {
                        setTimeout(() => {
                            WindowControl.hideLoading();
                        }, 1000)
                        $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
                    }
                )
            }
        }


    });
});