/**
 * Khai báo các element trong page
 */
class TabShipmentElements {
    constructor() {
        // modal element
        this.$containerName = $('#container_name');
        this.$containerType = $('#container_type');
        this.$containerRef = $('#container_ref_number');
        this.$containerWeight = $('#container_weight');
        this.$containerDimension = $('#container_dimension');
        this.$containerNote = $('#container_note');
        this.$packageName = $('#package_name');
        this.$packageType = $('#package_type');
        this.$packageRef = $('#package_ref_number');
        this.$packageContainer = $('#package_container');
        this.$packageWeight = $('#package_weight');
        this.$packageDimension = $('#package_dimension');
        this.$packageNote = $('#package_note');
        this.$btnSaveContainer = $('#btn_apply_container');
        this.$btnSavePackage = $('#btn_apply_package');

        // shipment
        this.$tableShipment = $('#table_shipment');

        // modal
        this.$containerModal = $('#modal_container');
        this.$packageModal = $('#modal_package');
    }
}
const pageElements = new TabShipmentElements();

/**
 * Khai báo các biến sử dụng trong page
 */
class TabShipmentVariables {
    constructor() {
        this.shipmentData = [];
        this.editingContainerId = '';
        this.editingContainerRow = null;
        this.editingPackageId = '';
        this.editingPackageRow = null;
    }
}
const pageVariables = new TabShipmentVariables();

/**
 * Các hàm load page và hàm hỗ trợ
 */
class TabShipmentFunction {
    static initShipmentDataTable(data=[], option="create") {
        pageElements.$tableShipment.DataTable().destroy();
        pageElements.$tableShipment.DataTableDefault({
            styleDom: 'hide-foot',
            data: data,
            rowIdx: true,
            scrollX: true,
            scrollY: '70vh',
            scrollCollapse: true,
            reloadCurrency: true,
            paging: false,
            columns: [
                {
                    className: "w-5",
                    render: () => {
                        return '';
                    }
                },
                {
                    className: "w-15",
                    render: (data, type, row) => {
                        if (row?.containerName) {
                            return `
                                <button type="button" 
                                        class="btn btn-icon btn-rounded btn-flush-secondary flush-soft-hover btn-xs show-child" 
                                        id="ctn-idx-${row?.containerRefNumber}">
                                    <span class="icon"><i class="fa-solid fa-sort-down"></i></span>
                                </button>
                                <span>${row?.containerName}</span>
                                <button ${option === 'detail' ? 'disabled' : ''}
                                        data-bs-toggle="modal"
                                        data-bs-target="#modal_package"
                                        type="button" 
                                        class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover btn-xs btn-add-package"
                                        id="add-package-${row?.containerRefNumber}"
                                        data-container-ref="${row?.containerRefNumber}" title="Add Package">
                                    <span class="icon"><i class="far fa-plus-square"></i></span>
                                </button>
                            `;
                        } else {
                            // No add button and dropdown if package name field
                            return `
                                <div style="display: flex;">
                                    <div style="width: 4rem;"></div>
                                    <span class="ctn-idx-${row?.packageContainerRef}">${row?.packageName}</span>
                                </div>
                            `;
                        }
                    }
                },
                {
                    className: "w-20",
                    render: (data, type, row) => {
                        return `<span>${row?.containerType?.title || row?.packageType?.title || ''}</span>`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return row?.is_container ? `<span class="ctn-ref-span">${row?.containerRefNumber || ''}</span>` : `<span class="pkg-ref-span">${row?.packageRefNumber || ''}</span>`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<span>${row?.containerWeight || row?.packageWeight || ''}</span>`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<span>${row?.containerDimension || row?.packageDimension || ''}</span>`;
                    }
                },
                {
                    className: "w-20",
                    render: (data, type, row) => {
                        return `<span>${row?.containerNote || row?.packageNote || ''}</span>`;
                    }
                },
                {
                    className: "w-10 text-right",
                    render: (data, type, row) => {
                        const editBtn = `<button ${option === 'detail' ? 'disabled' : ''}
                                                type="button"  
                                                class="btn btn-icon btn-rounded btn-flush-right flush-soft-hover btn-edit-${row?.is_container ? 'container' : 'package'}"
                                                data-id="${row?.['id'] || ''}"
                                                data-container-ref="${row?.containerRefNumber || ''}"
                                                data-package-ref="${row?.packageRefNumber || ''}">
                                                <span class="icon"><i class="far fa-edit"></i></span>
                                        </button>`;
                        const deleteBtn = `<button ${option === 'detail' ? 'disabled' : ''}
                                                    type="button"
                                                    class="ml-1 btn btn-icon btn-rounded btn-flush-light flush-soft-hover ${row?.is_container ? 'btn-delete-container' : 'btn-delete-package'}"
                                                    data-id="${row?.['id'] || ''}"
                                                    data-container-ref="${row?.packageContainerRef || ''}"
                                                    data-package-ref="${row?.packageRefNumber || ''}">
                                                    <span class="icon"><i class="far fa-trash-alt"></i></span>
                                             </button>`;

                        return editBtn + deleteBtn
                    }
                }
            ],
            initComplete: function () {
                TabShipmentFunction.loadContainersToDropDown();
            }
        });
    }

    /**
     * Đẩy dữ liệu vào biến shipment_data (global) khi bắt đầu vào trang detail/update
     */
    static pushToShipmentData(data_shipment=[]) {
        // đổ lại dữ liệu vào shipment_data
        for (let i=0; i < data_shipment.length; i++) {
            let item = data_shipment[i]
            if (item?.['is_container']) {
                const row_data = {
                    ...item,
                    'id': item?.['id'] || Math.floor(10000 + Math.random() * 90000).toString(),
                    'is_container': true,
                    'packages': []
                };
                pageVariables.shipmentData.push(row_data)
            }
            else {
                const row_data = {
                    ...item,
                    'id': item?.['id'] || Math.floor(10000 + Math.random() * 90000).toString(),
                    'is_container': false,
                };
                pageVariables.shipmentData.push(row_data)
            }
        }
    }

    static loadContainersToDropDown() {
        pageElements.$packageContainer.html('')
        pageElements.$packageContainer.append('<option value=""></option>');
        pageElements.$tableShipment.find('tbody tr').each(function (index, ele) {
            let ctn_ref = $(ele).find('.ctn-ref-span').text()
            if (ctn_ref) {
                pageElements.$packageContainer.append(`<option value="${ctn_ref}">${ctn_ref}</option>`);
            }
        })
    }

    static LoadContainerType(data) {
        pageElements.$containerType.initSelect2({
            allowClear: true,
            ajax: {
                url: pageElements.$containerType.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'container_list',
            keyId: 'id',
            keyText: 'title',
        });
    }

    static LoadPackageType(data) {
        pageElements.$packageType.initSelect2({
            allowClear: true,
            ajax: {
                url: pageElements.$packageType.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'package_list',
            keyId: 'id',
            keyText: 'title',
        });
    }

    static combineShipmentData() {
        const serviceOrderShipmentData = [];
        pageVariables.shipmentData.forEach(row => {
            serviceOrderShipmentData.push(row?.is_container ? {
                id: row?.id,
                title: row?.containerName || '',
                container_type: row?.containerType || null,
                package_type: null,
                reference_number: row?.containerRefNumber || '',
                weight: row?.containerWeight || 0,
                dimension: row?.containerDimension || 0,
                description: row?.containerNote || '',
                reference_container: '',
                is_container: true
            } : {
                id: row?.id,
                title: row?.packageName || '',
                container_type: null,
                package_type: row?.packageType || null,
                reference_number: row?.packageRefNumber || '',
                weight: row?.packageWeight || 0,
                dimension: row?.packageDimension || 0,
                description: row?.packageNote || '',
                reference_container: row?.packageContainerRef || '',
                is_container: false
            });
        });
        return serviceOrderShipmentData;
    }
}

/**
 * Khai báo các Event
 */
class TabShipmentEventHandler {
    static InitPageEvent() {
        $('#btn_add_row_shipment').on('click', function () {
            pageElements.$containerModal.find(".modal-body input, select, textarea").val("").prop('disabled', false);
            pageElements.$containerType.empty();
            pageElements.$packageModal.find(".modal-body input, select, textarea").val("").prop('disabled', false);
            pageElements.$packageType.empty();
            pageVariables.editingContainerId = ''
            pageVariables.editingContainerRow = null
            pageVariables.editingPackageId = ''
            pageVariables.editingPackageRow = null
        })

        // save container event
        pageElements.$btnSaveContainer.on('click', function () {
            if (pageVariables.editingContainerId) {
                // update
                for (let i=0; i < pageVariables.shipmentData.length; i++) {
                    let item = pageVariables.shipmentData[i]
                    if (item?.['id'] === pageVariables.editingContainerId && item?.['is_container']) {
                        item['containerName'] = pageElements.$containerName.val() || ''
                        item['containerType'] = SelectDDControl.get_data_from_idx(pageElements.$containerType, pageElements.$containerType.val())
                        item['containerRefNumber'] = pageElements.$containerRef.val() || ''
                        item['containerWeight'] = pageElements.$containerWeight.val() || 0
                        item['containerDimension'] = pageElements.$containerDimension.val() || 0
                        item['containerNote'] = pageElements.$containerNote.val() || ''
                        pageVariables.editingContainerRow.find('td:eq(1) span:eq(1)').text(item?.['containerName'])
                        pageVariables.editingContainerRow.find('td:eq(2) span').text(item?.['containerType']?.['title'])
                        pageVariables.editingContainerRow.find('td:eq(3) span').text(item?.['containerRefNumber'])
                        pageVariables.editingContainerRow.find('td:eq(4) span').text(item?.['containerWeight'])
                        pageVariables.editingContainerRow.find('td:eq(5) span').text(item?.['containerDimension'])
                        pageVariables.editingContainerRow.find('td:eq(6) span').text(item?.['containerNote'])
                        break
                    }
                }
                pageElements.$containerModal.modal('hide');
            }
            else {
                // tạo
                const newContainer = {
                    'id': Math.floor(10000 + Math.random() * 90000).toString(),
                    'is_container': true,
                    'containerName': pageElements.$containerName.val() || '',
                    'containerType': SelectDDControl.get_data_from_idx(pageElements.$containerType, pageElements.$containerType.val()),
                    'containerRefNumber': pageElements.$containerRef.val() || '',
                    'containerWeight': pageElements.$containerWeight.val() || 0,
                    'containerDimension': pageElements.$containerDimension.val() || 0,
                    'containerNote': pageElements.$containerNote.val() || '',
                    'packages': []
                };
                pageVariables.shipmentData.push(newContainer)

                UsualLoadPageFunction.AddTableRow(pageElements.$tableShipment, newContainer);
                TabShipmentFunction.loadContainersToDropDown();

                pageElements.$containerModal.modal('hide');
            }
        })

        // save package event
        pageElements.$btnSavePackage.on('click', function () {
            if (pageVariables.editingPackageId) {
                // update
                for (let i=0; i < pageVariables.shipmentData.length; i++) {
                    let item = pageVariables.shipmentData[i]
                    if (item?.['id'] === pageVariables.editingPackageId && !item?.['is_container']) {
                        item['packageName'] = pageElements.$packageName.val() || ''
                        item['packageType'] = SelectDDControl.get_data_from_idx(pageElements.$packageType, pageElements.$packageType.val())
                        item['packageRefNumber'] = pageElements.$packageRef.val() || ''
                        item['packageWeight'] = pageElements.$packageWeight.val() || 0
                        item['packageDimension'] = pageElements.$packageDimension.val() || 0
                        item['packageNote'] = pageElements.$packageNote.val() || ''
                        pageVariables.editingPackageRow.find('td:eq(1) span').text(item?.['packageName'])
                        pageVariables.editingPackageRow.find('td:eq(2) span').text(item?.['packageType']?.['title'])
                        pageVariables.editingPackageRow.find('td:eq(3) span').text(item?.['packageRefNumber'])
                        pageVariables.editingPackageRow.find('td:eq(4) span').text(item?.['packageWeight'])
                        pageVariables.editingPackageRow.find('td:eq(5) span').text(item?.['packageDimension'])
                        pageVariables.editingPackageRow.find('td:eq(6) span').text(item?.['packageNote'])
                        break
                    }
                }
                pageElements.$packageModal.modal('hide');
            }
            else {
                // tạo
                if (!pageElements.$packageContainer.val()) {
                    $.fn.notifyB({description: "Container not found"}, 'failure');
                }
                else {
                    const newPackage = {
                        'id': Math.floor(10000 + Math.random() * 90000).toString(),
                        'is_container': false,
                        'packageName': pageElements.$packageName.val() || '',
                        'packageType': SelectDDControl.get_data_from_idx(pageElements.$packageType, pageElements.$packageType.val()),
                        'packageContainerRef': pageElements.$packageContainer.val(),
                        'packageRefNumber': pageElements.$packageRef.val() || '',
                        'packageWeight': pageElements.$packageWeight.val() || 0,
                        'packageDimension': pageElements.$packageDimension.val() || 0,
                        'packageNote': pageElements.$packageNote.val() || '',
                    };
                    pageVariables.shipmentData.push(newPackage)

                    let ctnRowEle = pageElements.$tableShipment.find(`tbody tr button[id="ctn-idx-${pageElements.$packageContainer.val()}"]`).closest('tr');
                    let index = pageElements.$tableShipment.DataTable().row(ctnRowEle).index() + 1;
                    UsualLoadPageFunction.AddTableRowAtIndex(
                        pageElements.$tableShipment,
                        newPackage,
                        index
                    );
                    pageElements.$packageModal.modal('hide');
                }
            }
        })

        // delete package row event
        pageElements.$tableShipment.on('click', '.btn-delete-package', function () {
            Swal.fire({
                html: `
                    <div class="mb-3"><i class="ri-delete-bin-6-line fs-5 text-danger"></i></div>
                    <h5 class="text-danger">${$.fn.gettext('Delete Package ?')}</h5>`,
                customClass: {
                    confirmButton: 'btn btn-outline-secondary text-danger',
                    cancelButton: 'btn btn-outline-secondary text-gray',
                    container: 'swal2-has-bg',
                    actions: 'w-100'
                },
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: $.fn.gettext('Yes'),
                cancelButtonText: $.fn.gettext('Cancel'),
                reverseButtons: true
            }).then((result) => {
                if (result.value) {
                    UsualLoadPageFunction.DeleteTableRow(
                        pageElements.$tableShipment,
                        parseInt($(this).closest('tr').find('td:first-child').text())
                    );
                    pageVariables.shipmentData = pageVariables.shipmentData.filter(
                        pkg => pkg?.packageContainerRef !== $(this).attr("data-container-ref")
                    );
                }
            })
        });

        // delete container row event
        pageElements.$tableShipment.on('click', '.btn-delete-container', function () {
            let currentRow = $(this).closest('tr');   // Get container reference number from current row

            Swal.fire({
                html: `
                    <div class="mb-3"><i class="ri-delete-bin-6-line fs-5 text-danger"></i></div>
                    <h5 class="text-danger">${$.fn.gettext('Delete Container ?')}</h5>
                    <p>${$.fn.gettext('This action will delete the container and all its packages')}</p>`,
                customClass: {
                    confirmButton: 'btn btn-outline-secondary text-danger',
                    cancelButton: 'btn btn-outline-secondary text-gray',
                    container: 'swal2-has-bg',
                    actions: 'w-100'
                },
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: $.fn.gettext('Yes'),
                cancelButtonText: $.fn.gettext('Cancel'),
                reverseButtons: true
            }).then((result) => {
                if (result.value) {
                    let containerRefNumber = currentRow.find('td:nth-child(4)').text().trim(); // Column contains ref number

                    // Find and delete all package rows of this container in DataTable
                    pageElements.$tableShipment.find(`tbody span[class="ctn-idx-${containerRefNumber}"]`).each(function () {
                        UsualLoadPageFunction.DeleteTableRow(
                            pageElements.$tableShipment,
                            parseInt($(this).closest('tr').find('td:first-child').text())
                        )
                    });

                    // Delete container row
                    UsualLoadPageFunction.DeleteTableRow(
                        pageElements.$tableShipment,
                        parseInt(currentRow.find('td:first-child').text())
                    );

                    // Update data in Shipment table
                    pageVariables.shipmentData = pageVariables.shipmentData.filter(
                        container => container?.containerRefNumber !== containerRefNumber
                    );
                    pageVariables.shipmentData = pageVariables.shipmentData.filter(
                        pkg => pkg?.packageContainerRef !== containerRefNumber
                    );

                    TabShipmentFunction.loadContainersToDropDown();
                }
            });
        });

        // show or hidden all packages
        $(document).on("click", '.show-child', function () {
            let containerID = $(this).attr('id');
            pageElements.$tableShipment.find(`tbody span[class="${containerID}"]`).each(function (index, ele) {
                let parent_row = $(ele).closest('tr');
                let is_show = parent_row.prop("hidden");
                parent_row.prop("hidden", !is_show);
            })
        });

        $(document).on("click", ".btn-add-package", function () {
            pageVariables.editingContainerId = ''
            pageVariables.editingContainerRow = null
            pageVariables.editingPackageId = ''
            pageVariables.editingPackageRow = null
            pageElements.$packageContainer.val($(this).closest('tr').find('td:eq(3) span').text()).prop('disabled', true);
        })

        $(document).on('click', '.btn-edit-container', function () {
            const rowData = pageVariables.shipmentData.filter(item => item?.id === $(this).attr("data-id"))[0];

            pageVariables.editingContainerRow = $(this).closest('tr');
            pageVariables.editingContainerId = $(this).attr('data-id') || '';

            // fill data to modal
            pageElements.$containerName.val(rowData?.containerName || '');
            TabShipmentFunction.LoadContainerType(rowData?.containerType || {});
            pageElements.$containerRef.val(rowData?.containerRefNumber || '').prop('disabled', true);
            pageElements.$containerWeight.val(rowData?.containerWeight || '');
            pageElements.$containerDimension.val(rowData?.containerDimension || '');
            pageElements.$containerNote.val(rowData?.containerNote || '');

            pageElements.$containerModal.modal('show');
        });

        $(document).on('click', '.btn-edit-package', function () {
            const rowData = pageVariables.shipmentData.filter(item => item?.id === $(this).attr("data-id"))[0];

            pageVariables.editingPackageRow = $(this).closest('tr');
            pageVariables.editingPackageId = $(this).attr('data-id') || '';

            // fill data to modal
            pageElements.$packageName.val(rowData?.packageName || '');
            TabShipmentFunction.LoadPackageType(rowData?.packageType || {});
            pageElements.$packageRef.val(rowData?.packageRefNumber || '');
            pageElements.$packageContainer.val(rowData?.packageContainerRef || '').prop('disabled', true);
            pageElements.$packageWeight.val(rowData?.packageWeight || '');
            pageElements.$packageDimension.val(rowData?.packageDimension || '');
            pageElements.$packageNote.val(rowData?.packageNote || '');

            pageElements.$packageModal.modal('show');
        });
    }
}
