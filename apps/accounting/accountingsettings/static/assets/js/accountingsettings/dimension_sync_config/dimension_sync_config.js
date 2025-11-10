$(document).ready(function () {
    const $dimensionSyncConfigDataTable = $('#datatable-config')
    // Initialize DataTable
    $dimensionSyncConfigDataTable.DataTableDefault({
        reloadCurrency: true,
        scrollCollapse: true,
        data: [{}],
        // useDataServer: true,
        // ajax: {
        //     url: $dimensionSyncConfigDataTable.attr('data-url'),
        //     type: "GET",
        //     dataSrc: 'data.dimension_sync_config_list',
        // },
        columns: [
            {
                targets: 0,
                render: (data, type, row) => {
                    const dimensionCode = row?.dimension?.code
                    return `<span>${dimensionCode || ''}</span>`;
                }
            },
            {
                targets: 1,
                render: (data, type, row) => {
                    const dimensionTitle = row?.dimension?.title
                    return `<span>${dimensionTitle || ''}</span>`;
                }
            },
            {
                targets: 2,
                render: (data, type, row) => {
                    const applicationTitle = row?.related_app?.title
                    return `<span>${applicationTitle || ''}</span>`;
                }
            },
            {
                targets: 3,
                render: (data, type, row) => {
                    return '';
                }
            },
            {
                targets: 4,
                render: (data, type, row) => {
                    const records = row?.record_number || 0
                    return records
                }
            },
            {
                targets: 5,
                render: (data, type, row) => {
                    return `
                        <div class="btn-group btn-group-sm" role="group">
                            <button type="button" class="btn btn-outline-primary btn-edit" 
                                    data-id="${row.id}" 
                                    data-bs-toggle="modal"
                                    data-bs-target="#modal-add-config" 
                                    title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button type="button" class="btn btn-outline-info btn-sync" 
                                    data-id="${row.id}" 
                                    data-bs-toggle="tooltip" 
                                    title="Sync Now">
                                <i class="fas fa-sync"></i>
                            </button>
                            <button type="button" class="btn btn-outline-danger btn-delete" 
                                    data-id="${row.id}" 
                                    data-bs-toggle="tooltip" 
                                    title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                }
            }
        ],
    });
});