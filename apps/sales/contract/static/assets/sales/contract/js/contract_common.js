// Load data
class ContractLoadDataHandle {
    static $btnAddDoc = $('#btn-add-doc');
    static $fileArea = $('#file-area');
    static $remark = $('#contract-doc-remark');
    static $attachment = $('#attachment');
    static $trans = $('#app-trans-factory');

    static loadAddDoc() {
        let TotalOrder = ContractDataTableHandle.$tableDocument[0].querySelectorAll('.table-row-order').length;
        let order = TotalOrder + 1;
        let dataAdd = {
            "title": "",
            "order": order,
        }
        ContractDataTableHandle.$tableDocument.DataTable().row.add(dataAdd).draw().node();
        return true;
    };

    static loadOpenAttachFile(ele) {
        ContractDataTableHandle.$tableDocument.DataTable().rows().every(function () {
            let row = this.node();
            $(row).css('background-color', '');
        });
        $(ele.closest('tr')).css('background-color', '#ebfcf5');
        ContractLoadDataHandle.$fileArea[0].classList.remove('bg-light');
        ContractLoadDataHandle.$remark[0].removeAttribute('disabled');
        ContractLoadDataHandle.$attachment[0].removeAttribute('hidden');
        return true;
    };
}

// DataTable
class ContractDataTableHandle {
    static $tableDocument = $('#datable-contract-document');
    static $tableFile = $('#datable-contract-file');

    static dataTableDocument(data) {
        ContractDataTableHandle.$tableDocument.DataTableDefault({
            data: data ? data : [],
            ordering: false,
            paging: false,
            info: false,
            columns: [
                {
                    targets: 0,
                    width: '1%',
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="table-row-order" data-row="${dataRow}">${row?.['order'] ? row?.['order'] : 0}</span>`;
                    }
                },
                {
                    targets: 1,
                    width: '60%',
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control table-row-title" value="${row?.['remark'] ? row?.['remark'] : ''}" required>`;
                    }
                },
                {
                    targets: 2,
                    class: 'text-center',
                    width: '10%',
                    render: (data, type, row) => {
                        return `<div class="d-flex">
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover attach-file" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${ContractLoadDataHandle.$trans.attr('data-attach-file')}"><span class="icon"><i class="fas fa-paperclip"></i></span></button>
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover view-file" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${ContractLoadDataHandle.$trans.attr('data-view-file')}"><span class="icon"><i class="far fa-eye"></i></span></button>
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${ContractLoadDataHandle.$trans.attr('data-delete')}"><span class="icon"><i class="far fa-trash-alt"></i></span></button>
                                </div>`;
                    }
                },
            ],
            drawCallback: function () {
            },
        });
    };

    static dataTableFile(data) {
        ContractDataTableHandle.$tableFile.DataTableDefault({
            data: data ? data : [],
            ordering: false,
            paging: false,
            info: false,
            columns: [
                {
                    targets: 0,
                    width: '40%',
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="table-row-title" data-row="${dataRow}">${row?.['title'] ? row?.['title'] : ''}</span>`;
                    }
                },
                {
                    targets: 1,
                    width: '20%',
                    render: (data, type, row) => {
                        return `<span class="table-row-version">${row?.['version'] ? row?.['version'] : ''}</span>`;
                    }
                },
                {
                    targets: 2,
                    width: '20%',
                    render: (data, type, row) => {
                        return `<span class="table-row-version">${row?.['date_created'] ? row?.['date_created'] : ''}</span>`;
                    }
                },
                {
                    targets: 3,
                    width: '5%',
                    render: (data, type, row) => {
                        if (row?.['is_current'] === true) {
                            return `<i class="fas fa-check text-green ml-2"></i>`;
                        }
                        return `<div class="d-flex">
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover set-current" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${ContractLoadDataHandle.$trans.attr('data-set-current')}"><span class="icon"><i class="fas fa-retweet"></i></span></button>
                                </div>`;
                    }
                },
            ],
            drawCallback: function () {
            },
        });
    };
}

// Common
class ContractCommonHandle {
    static commonDeleteRow(currentRow, $table) {
        ContractCommonHandle.deleteRowContract(currentRow, $table);
        ContractCommonHandle.reOrderTbl($table);
        return true;
    };

    static reOrderTbl($table) {
        let itemCount = $table[0].querySelectorAll('.table-row-order').length;
        if (itemCount === 0) {
            $table.DataTable().clear().draw();
        } else {
            let order = 1;
            for (let eleOrder of $table[0].querySelectorAll('.table-row-order')) {
                eleOrder.innerHTML = order;
                order++
                if (order > itemCount) {
                    break;
                }
            }
        }
        return true;
    };

    static deleteRowContract(currentRow, $table) {
        let rowIdx = $table.DataTable().row(currentRow).index();
        let row = $table.DataTable().row(rowIdx);
        row.remove().draw();
        return true;
    };

    static getCurrentDate() {
        let currentDate = new Date();
        let day = String(currentDate.getDate()).padStart(2, '0');
        let month = String(currentDate.getMonth() + 1).padStart(2, '0');
        let year = currentDate.getFullYear();
        return `${day}/${month}/${year}`;
    }

}