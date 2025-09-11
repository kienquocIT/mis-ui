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
    }
}
const pageVariables = new TabShipmentVariables();


/**
 * Các hàm load page và hàm hỗ trợ
 */
class TabShipmentFunction {
    static initShipmentDataTable(data = [], option="create") {
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
                    className: "w-20",
                    render: (data, type, row) => {
                        if (row?.containerName) {
                            return `
                                <button type="button" 
                                        class="btn btn-icon btn-rounded btn-flush-secondary flush-soft-hover btn-xs show-child" 
                                        id="ctn-idx-${row?.containerRefNumber}">
                                    <span class="icon"><i class="fa-solid fa-sort-down"></i></span>
                                </button>
                                <span>${row?.containerName}</span>
                                <button  ${option === 'detail' ? 'disabled' : ''} type="button" 
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
                        return row?.containerType?.title || row?.packageType?.title || '';
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return row?.containerRefNumber || row?.packageRefNumber || '';
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return row?.containerWeight || row?.packageWeight || '';
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return row?.containerDimension || row?.packageDimension || '';
                    }
                },
                {
                    className: "w-20",
                    render: (data, type, row) => {
                        return row?.containerNote || row?.packageNote || '';
                    }
                },
                {
                    className: "w-5 text-right",
                    render: (data, type, row) => {
                        return row?.isContainer ? `<button ${option === 'detail' ? 'disabled' : ''} type="button"  
                                                class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-delete-container">
                                                <span class="icon"><i class="far fa-trash-alt"></i></span>
                                         </button>` : `<button ${option === 'detail' ? 'disabled' : ''} type="button" 
                                                class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-delete-package">
                                                <span class="icon"><i class="far fa-trash-alt"></i></span>
                                        </button>`;
                    }
                },
            ],
        });
    }

    static loadContainersToDropDown() {
        pageElements.$packageContainer.empty().append('<option value=""></option>');
        if (pageVariables.shipmentData && pageVariables.shipmentData.length > 0) {
            pageVariables.shipmentData.forEach(function (item) {
                if (item.isContainer) {
                        pageElements.$packageContainer.append(`
                        <option value="${item.containerRefNumber}">
                            ${item.containerRefNumber}
                        </option>
                    `);
                }
            });
        }
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
        const table = pageElements.$tableShipment.DataTable();
        const tableData = table.data().toArray();
        const serviceOrderShipmentData = [];

        tableData.forEach(row => {
            let shipmentData = {};
            if (row?.isContainer || row ?.is_container) {
                shipmentData = {
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
                };
            } else {
               shipmentData = {
                    id: row?.id,
                    title: row?.packageName || '',
                    container_type: null,
                    package_type: row?.packageType || null,
                    reference_number: row?.packageRefNumber || '',
                    weight: row?.packageWeight || 0,
                    dimension:  row?.packageDimension || 0,
                    description:  row?.packageNote || '',
                    reference_container: row?.packageContainerRef || '',
                    is_container: false
                };
            }
            serviceOrderShipmentData.push(shipmentData);
        });
        return serviceOrderShipmentData;
    }
}


/**
 * Khai báo các Event
 */
class TabShipmentEventHandler {
    static InitPageEvent() {
        // clear all data when initialize modal
        pageElements.$containerModal.on('show.bs.modal', function () {
            pageElements.$containerModal.find('input, select').val('');
            pageElements.$containerModal.find('select').trigger('change');
        });

        pageElements.$packageModal.on('show.bs.modal', function () {
            pageElements.$packageModal.find('input, select').val('');
            pageElements.$packageModal.find('select').trigger('change');
        });

        // save container event
        pageElements.$btnSaveContainer.on('click', function () {
            const uniqueStr = Math.random().toString(36).slice(2)
            const newContainer = {
                id: uniqueStr,
                isContainer: true,
                containerName: pageElements.$containerName.val() || '',
                containerType: SelectDDControl.get_data_from_idx(pageElements.$containerType, pageElements.$containerType.val()),
                containerRefNumber: pageElements.$containerRef.val() || '',
                containerWeight: pageElements.$containerWeight.val() || '',
                containerDimension: pageElements.$containerDimension.val() || '',
                containerNote: pageElements.$containerNote.val() || '',
                packages: []
            };

            // map field to error message
            const requiredFields = {
                containerName: "Container name is empty",
                containerRefNumber: "Container reference number is empty"
            };

            for (const [field, msg] of Object.entries(requiredFields)) {
                if (!newContainer[field]) {
                    $.fn.notifyB({description: msg}, 'failure');
                    return;
                }
            }

            // validate duplicate containerRefNumber
            const isDuplicate = pageVariables.shipmentData.some(
                c => c.containerRefNumber === newContainer.containerRefNumber
            );
            if (isDuplicate) {
                $.fn.notifyB({description: "Container reference number already exists"}, 'failure');
                return;
            }

            // update global variable
            pageVariables.shipmentData.push(newContainer);

            // update Datatable
            UsualLoadPageFunction.AddTableRow(pageElements.$tableShipment, newContainer);

            // remove data after saving
            pageElements.$containerName.val('');
            pageElements.$containerType.val('');
            pageElements.$containerRef.val('');
            pageElements.$containerWeight.val('');
            pageElements.$containerDimension.val('');
            pageElements.$containerNote.val('');
        });

        // save package event
        pageElements.$btnSavePackage.on('click', function () {
            const selectedContainerRef = pageElements.$packageContainer.val() || '';

            const uniqueStr = Math.random().toString(36).slice(2)

            const newPackage = {
                id: uniqueStr,
                isContainer: false,
                packageName: pageElements.$packageName.val() || '',
                packageType: SelectDDControl.get_data_from_idx(pageElements.$packageType, pageElements.$packageType.val()),
                packageRefNumber: pageElements.$packageRef.val() || '',
                packageWeight: pageElements.$packageWeight.val() || '',
                packageDimension: pageElements.$packageDimension.val() || '',
                packageNote: pageElements.$packageNote.val() || '',
                packageContainerRef: selectedContainerRef
            };

            // update global variable shipment
            pageVariables.shipmentData = pageVariables.shipmentData.map(container => {
                if (container.containerRefNumber === selectedContainerRef) {
                    container.packages.push(newPackage);
                }
                return container;
            });

            // update DataTable
            let ctnRowEle = pageElements.$tableShipment
                .find(`tbody tr button[id="ctn-idx-${selectedContainerRef}"]`)
                .closest('tr')  // find root row
            let index = pageElements.$tableShipment.DataTable().row(ctnRowEle).index() + 1;
            UsualLoadPageFunction.AddTableRowAtIndex(
                pageElements.$tableShipment,
                newPackage,
                index
            )

            // reset
            pageElements.$packageName.val('');
            pageElements.$packageType.val('');
            pageElements.$packageRef.val('');
            pageElements.$packageContainer.val('');
            pageElements.$packageWeight.val('');
            pageElements.$packageDimension.val('');
            pageElements.$packageNote.val('');
        });

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
                }
            })
        });

        // delete container row event
        pageElements.$tableShipment.on('click', '.btn-delete-container', function () {
            let currentRow = $(this).closest('tr');   // Get container reference number from current row
            let containerRefNumber = currentRow.find('td:nth-child(4)').text().trim(); // Column contains ref number

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
                    // Find and delete all package rows of this container in DataTable
                    let packageRows = [];
                    pageElements.$tableShipment.find(`tbody span[class="ctn-idx-${containerRefNumber}"]`).each(function () {
                        let packageRow = $(this).closest('tr');
                        let rowIndex = parseInt(packageRow.find('td:first-child').text());
                        packageRows.push(rowIndex);
                    });

                    // Delete all package rows
                    packageRows.sort((a, b) => b - a).forEach(rowIndex => {
                        UsualLoadPageFunction.DeleteTableRow(
                            pageElements.$tableShipment,
                            rowIndex
                        );
                    });

                    // Delete container row
                    UsualLoadPageFunction.DeleteTableRow(
                        pageElements.$tableShipment,
                        parseInt(currentRow.find('td:first-child').text())
                    );

                    // Update data in Shipment table
                    pageVariables.shipmentData = pageVariables.shipmentData.filter(
                        container => container.containerRefNumber !== containerRefNumber
                    );
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
            $('#modal_package').modal('show');
            let $row = $(this).closest("tr");
            const containerRef = $row.find("td:eq(3)").text().trim();
            if (pageElements.$packageContainer.find("option[value='" + containerRef + "']").length === 0) {
                let newOption = new Option(containerRef, containerRef, true, true);
                pageElements.$packageContainer.append(newOption).trigger("change");
            } else {
                pageElements.$packageContainer.val(containerRef).trigger("change");
            }
            pageElements.$packageContainer.prop('disabled', true); // disable dropdown package_container
        })

        // event when click Package from dropdown Add
        $('a[data-bs-target="#modal_package"]').on('click', function () {
            let tblData = pageElements.$tableShipment.DataTable().data().toArray();
            pageVariables.shipmentData = tblData;

            // Load containers to dropdown
            TabShipmentFunction.loadContainersToDropDown();

            // reset
            pageElements.$packageContainer.prop('disabled', false);
            pageElements.$packageContainer.removeClass('bg-light');
            pageElements.$packageContainer.val('');
        });
    }
}
