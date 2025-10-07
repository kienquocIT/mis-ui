/**
 * Khai báo các element trong page
 */
class TabExpenseElements {
    constructor() {
        this.$tblExpense = $('#table_expense');     // table
        this.$btnAddExpense = $('#add_expense');    // button
        this.$urlEle = $('#script-url');            // url
        this.$preTaxAmount = $('#pretax-value');
        this.$taxEle = $('#taxes-value');
        this.$totalValueEle = $('#total-value');
    }
}
const tabExpenseElements = new TabExpenseElements();


/**
 * Các hàm load page và hàm hỗ trợ
 */
class TabExpenseFunction {
    static updateTotalValue() {
        let preTaxValue = 0;
        let taxValue = 0;
        tabExpenseElements.$tblExpense.find('tbody tr').each(function () {
            let row_quantity = Number($(this).find('.row-quantity').val() || 0);
            let row_expensePrice = Number($(this).find('.row-expense-price').attr('value') || 0);
            let row_subTotal = row_quantity * row_expensePrice;
            $(this).find('.row-subtotal').attr('value', row_subTotal);
            preTaxValue += row_subTotal;
            let row_taxData = SelectDDControl.get_data_from_idx($(this).find('.row-tax'), $(this).find('.row-tax').val());
            let row_taxRate = Number(row_taxData?.['rate'] || 0);
            let row_taxValue = row_subTotal * row_taxRate / 100;
            taxValue += row_taxValue;
        });
        tabExpenseElements.$preTaxAmount.attr('value', preTaxValue);
        tabExpenseElements.$taxEle.attr('value', taxValue);
        tabExpenseElements.$totalValueEle.attr('value', preTaxValue + taxValue);
        $.fn.initMaskMoney2()
    }

    static initExpenseTable(data = [], option = "create") {
        tabExpenseElements.$tblExpense.DataTable().destroy();
        tabExpenseElements.$tblExpense.DataTableDefault({
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
                    className: "w-20",
                    render: (data, type, row) => {
                        return `<input ${option === 'detail' ? 'disabled' : ''} type="text" class="form-control row-expense-title" required>`;
                    }
                },
                {
                    className: "w-20",
                    render: (data, type, row) => {
                        return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 row-expense-item"></select>`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 row-uom"></select>`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<input ${option === 'detail' ? 'disabled' : ''} type="number" class="form-control row-quantity" min='0'>`
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<input ${option === 'detail' ? 'disabled' : ''} class="form-control mask-money row-expense-price" value="0">`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 row-tax"></select>`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money row-subtotal" value="0" readonly>`;
                    }
                },
                {
                    className: "w-5 text-right",
                    render: () => {
                        return `
                          <button ${option === 'detail' ? 'disabled' : ''}
                               type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row">
                               <span class="icon"><i class="far fa-trash-alt"></i></span>
                          </button>`;
                    }
                },
            ],
            initComplete: function () {
                tabExpenseElements.$tblExpense.find('tbody tr').each(function (index, ele) {
                    $(ele).find('.row-expense-title').val(data[index]?.title || "")
                    UsualLoadPageFunction.LoadExpenseItem({
                        element: $(ele).find('.row-expense-item'),
                        data: data[index]?.expense_item_data || {},
                        data_url: tabExpenseElements.$urlEle.attr('data-expense-item-url')
                    })
                    UsualLoadPageFunction.LoadUOM({
                        element: $(ele).find('.row-uom'),
                        data: data[index]?.uom_data || {},
                        data_url: tabExpenseElements.$urlEle.attr('data-uom-url')
                    })
                    $(ele).find('.row-quantity').val(data[index]?.quantity || 0)
                    $(ele).find('.row-expense-price').attr('value', data[index]?.expense_price || 0)
                    UsualLoadPageFunction.LoadTax({
                        element: $(ele).find('.row-tax'),
                        data: data[index]?.tax_data || {},
                        data_url: tabExpenseElements.$urlEle.attr('data-tax-url')
                    })
                    $(ele).find('.row-subtotal').attr('value', data[index]?.subtotal_price || 0)
                })
            }
        })
    }

    static combineExpenseData() {
        const serviceOrderExpenseData = [];
        tabExpenseElements.$tblExpense.find('tbody tr').each(function () {
            let $tr = $(this);
            if ($tr.find(".row-expense-title").length !== 0) {
                let item = {
                    title: $tr.find(".row-expense-title").val(),
                    expense_item: $tr.find(".row-expense-item").val() || null,
                    uom: $tr.find(".row-uom").val() || null,
                    quantity: parseFloat($tr.find(".row-quantity").val() || 0),
                    expense_price: parseFloat($tr.find(".row-expense-price").attr('value') || 0),
                    tax: $tr.find(".row-tax").val() || null,
                };
                serviceOrderExpenseData.push(item);
            }
        });
        return serviceOrderExpenseData;
    }
}


/**
 * Khai báo các Event
 */
class TabExpenseEventHandler {
    static InitPageEvent() {
        // event when click button add
        tabExpenseElements.$btnAddExpense.on('click', function() {
            UsualLoadPageFunction.AddTableRow(tabExpenseElements.$tblExpense);
            let row_added = tabExpenseElements.$tblExpense.find('tbody tr:last-child');
            UsualLoadPageFunction.LoadExpenseItem({
                element: row_added.find('.row-expense-item'),
                data_url: tabExpenseElements.$urlEle.attr('data-expense-item-url')
            });
            UsualLoadPageFunction.LoadUOM({
                element: row_added.find('.row-uom'),
                data_url: tabExpenseElements.$urlEle.attr('data-uom-url')
            });
            UsualLoadPageFunction.LoadTax({
                element: row_added.find('.row-tax'),
                data_url: tabExpenseElements.$urlEle.attr('data-tax-url')
            })
        });

        // event to update subtotal
        tabExpenseElements.$tblExpense.on('change', '.row-quantity, .row-expense-price, .row-tax', function () {
            TabExpenseFunction.updateTotalValue();
        });

        // event for deleting row
        tabExpenseElements.$tblExpense.on('click', '.del-row', function() {
            UsualLoadPageFunction.DeleteTableRow(
                tabExpenseElements.$tblExpense,
                parseInt($(this).closest('tr').find('td:first-child').text())
            )
            TabExpenseFunction.updateTotalValue();
        })
    }
}
