// (temp) - remove after building model
const CONTAINER_TYPE = {
    1: "10ft",
    2: "15ft",
    3: "20ft",
    4: "40ft"
}
const PACKAGE_TYPE = {
    1: "Carton",
    2: "Pallet",
    3: "Box",
    4: "Tank"
}


/**
 * Khai báo các element trong page
 */
class TabShipmentElements {
    constructor() {
        // modal
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
    static initShipmentDataTable(data = []) {
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
                    targets: 0,
                    width: "1%",
                    render: () => {
                        return '';
                    }
                },
                {
                    targets: 1,
                    width: '27%',
                    render: (data, type, row) => {
                        if (row.containerName) {
                            return `
                                <a href="#" class="text-primary show-child" id="ctn-idx-${row.containerRefNumber}">
                                    <i class="fa-solid fa-sort-down"></i>
                                </a> 
                                <span>${row.containerName}</span>
                                <button type="button" class="btn btn-outline-primary btn-sm ms-2 btn-add-package" 
                                        id="add-package-${row.containerRefNumber}"
                                        data-container-ref="${row.containerRefNumber}" 
                                        title="Add Package">
                                    <i class="fas fa-plus-circle"></i>
                                </button>
                            `;
                        } else {
                            // No add button and dropdown if package name field
                            return `<span class="ctn-idx-${row.packageContainerRef}">${row.packageName}</span>`;
                        }
                    }
                },
                {
                    targets: 2,
                    width: '10%',
                    render: (data, type, row) => {
                        return CONTAINER_TYPE?.[row.containerType] || PACKAGE_TYPE?.[row.packageType] || '';
                    }
                },
                {
                    targets: 3,
                    width: '15%',
                    render: (data, type, row) => {
                        return row.containerRefNumber || row.packageRefNumber || '';
                    }
                },
                {
                    targets: 4,
                    width: '15%',
                    render: (data, type, row) => {
                        return row.containerWeight || row.packageWeight || '';
                    }
                },
                {
                    targets: 5,
                    width: '15%',
                    render: (data, type, row) => {
                        return row.containerDimension || row.packageDimension || '';
                    }
                },
                {
                    targets: 6,
                    width: '14%',
                    render: (data, type, row) => {
                        return row.containerNote || row.packageNote || '';
                    }
                },
                {
                    targets: 7,
                    width: '3%',
                    render: (data, type, row) => {
                        return row.isContainer ? `<button type="button" 
                                                class="btn btn-light btn-sm rounded-circle btn-delete-container">
                                                <i class="far fa-trash-alt"></i>
                                         </button>` : `<button type="button" 
                                                class="btn btn-light btn-sm rounded-circle btn-delete-package">
                                                <i class="far fa-trash-alt"></i>
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
}


/**
 * Khai báo các Event
 */
class TabShipmentEventHandler {
    static InitPageEvent() {
        // save container event
        pageElements.$btnSaveContainer.on('click', function () {
            const newContainer = {
                isContainer: true,
                containerName: pageElements.$containerName.val() || '',
                containerType: pageElements.$containerType.val() || '',
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

            const newPackage = {
                isContainer: false,
                packageName: pageElements.$packageName.val() || '',
                packageType: pageElements.$packageType.val() || '',
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
                .find(`tbody tr a[id="ctn-idx-${selectedContainerRef}"]`)
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
                    <h5 class="text-danger">Delete Package ?</h5>
                    <p>Deleting package row</p>`,
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
                    <h5 class="text-danger">Delete Container ?</h5>
                    <p>Deleting container and all its packages</p>`,
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

        // event for add package in add button in container row
        $(document).on("click", '.btn-add-package', function () {
            $('#modal_package').modal('show');
            TabShipmentFunction.loadContainersToDropDown();

            const containerRef = $(this).data('container-ref');
            pageElements.$packageContainer.val(containerRef);
            pageElements.$packageContainer.prop('disabled', true); // disable dropdown package_container
        })

        // event when click Package from dropdown Add
        $('a[data-bs-target="#modal_package"]').on('click', function () {
            // Load containers to dropdown
            TabShipmentFunction.loadContainersToDropDown();

            // reset
            pageElements.$packageContainer.prop('disabled', false);
            pageElements.$packageContainer.removeClass('bg-light');
            pageElements.$packageContainer.val('');
        });
    }
}



