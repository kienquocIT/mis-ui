class TabMerchandiseElements {
    constructor() {
        this.$tableMerchandise = $('#tbl_merchandise');
        this.$btnAddMerchandise = $('#add_tab_merchandise');
        this.$modalMerchandiseDetail = $('#merchandise_detail_modal');
    }
}

const tabMerchandiseElements = new TabMerchandiseElements();

/**
 * Các hàm load page và hàm hỗ trợ
 */
class TabMerchandiseFunction {
    static initMerchandiseTable(data = [], option='create') {
        tabMerchandiseElements.$tableMerchandise.DataTable().destroy();
        tabMerchandiseElements.$tableMerchandise.DataTableDefault({
            data: data,
            styleDom: 'hide-foot',
            rowIdx: true,
            scrollX: true,
            scrollY: '70vh',
            scrollCollapse: true,
            reloadCurrency: true,
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
                        return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 row-merchandise">
                            <option value=""></option>
                            <option value="151">${$.fn.gettext('151 - Goods in transit')}</option>
                            <option value="152">${$.fn.gettext('152 - Raw materials')}</option>
                            <option value="153">${$.fn.gettext('153 - Tools and supplies')}</option>
                            <option value="154">${$.fn.gettext('154 - Work in progress')}</option>
                            <option value="155">${$.fn.gettext('155 - Finished goods')}</option>
                            <option value="156">${$.fn.gettext('156 - Merchandise inventory')}</option>
                            <option value="157">${$.fn.gettext('157 - Goods on consignment')}</option>
                        </select>`;
                    }
                },
                {
                    className: "w-20",
                    render: (data, type, row) => {
                    return  `
                        <div class="d-flex align-items-center gap-2">
                            <input type="text" ${option === 'detail' ? 'disabled' : ''}
                                class="form-control row-detail-merchandise" 
                                placeholder="Click icon to add detail..."/>
                            <button type="button" ${option === 'detail' ? 'disabled' : ''}
                                class="btn btn-primary btn-sm add-detail-btn">
                                <i class="fas fa-info"></i>
                            </button>
                        </div>
                    `;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control row-account-code-merchandise" disabled>`;
                    }
                },
                {
                    className: "w-15",
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control row-account-name-merchandise" disabled>`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<input ${option === 'detail' ? 'disabled' : ''} 
                                class="form-control mask-money row-amount-merchandise">`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money row-debit-merchandise" readonly>`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money row-credit-merchandise" readonly>`;
                    }
                },
                {
                    className: "w-5 text-right",
                    render: () => {
                        return `<button ${option === 'detail' ? 'disabled' : ''}
                               type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-merchandise-row">
                               <span class="icon"><i class="far fa-trash-alt"></i></span>
                          </button>`;
                    }
                },
            ],
            initComplete: function() {

            }
        });
    }
}

/**
 * Khai báo các Event
 */
class TabMerchandiseEventHandler {
    static InitPageEvent() {
        // event when click button add
        tabMerchandiseElements.$btnAddMerchandise.on('click', function() {
            UsualLoadPageFunction.AddTableRow(tabMerchandiseElements.$tableMerchandise);
        });

        // event for deleting row
        tabMerchandiseElements.$tableMerchandise.on('click', '.del-merchandise-row', function() {
            UsualLoadPageFunction.DeleteTableRow(
                tabMerchandiseElements.$tableMerchandise,
                parseInt($(this).closest('tr').find('td:first-child').text())
            );
        });

        // parse account code and account name when merchandise selected
        $(document).on('change', '.row-merchandise', function() {
            const $row = $(this).closest('tr');
            const fullText = $(this).find('option:selected').text();
            const accountName = fullText.split(' - ')[1] || '';
            const accountCode = $(this).val();

            $row.find('.row-account-code-merchandise').val(accountCode);
            $row.find('.row-account-name-merchandise').val(accountName);
        });

        // event for opening detail modal
        tabMerchandiseElements.$tableMerchandise.on('click', '.add-detail-btn', function() {
            tabMerchandiseElements.$modalMerchandiseDetail.modal('show');
        })
    }
}
