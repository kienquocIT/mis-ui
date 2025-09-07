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

    static initExpenseTable(data = []) {
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
                    targets: 0,
                    width: "3%",
                    render: () => {
                        return '';
                    }
                },
                {
                    targets: 1,
                    width: "20%",
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control row-expense-title" required>`;
                    }
                },
                {
                    targets: 2,
                    width: "20%",
                    render: (data, type, row) => {
                        return `<select class="form-select select2 row-expense-item"></select>`;
                    }
                },
                {
                    targets: 3,
                    width: "9%",
                    render: (data, type, row) => {
                        return `<select class="form-select select2 row-uom"></select>`;
                    }
                },
                {
                    targets: 4,
                    width: "10%",
                    render: (data, type, row) => {
                        return `<input type="number" class="form-control text-end row-quantity" min='0'>`
                    }
                },
                {
                    targets: 5,
                    width: "16%",
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money row-expense-price" value="0">`;
                    }
                },
                {
                    targets: 6,
                    width: "6%",
                    render: (data, type, row) => {
                        return `<select class="form-select select2 row-tax"></select>`;
                    }
                },
                {
                    targets: 7,
                    width: "13%",
                    render: (data, type, row) => {
                         return `<input class="form-control mask-money row-subtotal" value="0" readonly>`;
                    }
                },
                {
                    targets: 8,
                    width: "3%",
                    className: 'text-right',
                    render: () => {
                        return `
                          <button type="button" 
                                  class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row">
                            <span class="icon">
                              <i class="far fa-trash-alt"></i>
                            </span>
                          </button>
                        `;
                    }
                },
            ]
        })
    }

    static combineExpenseData() {
        const serviceOrderExpenseData = [];
        tabExpenseElements.$tblExpense.find('tbody tr').each(function () {
            let $tr = $(this);
            let item = {
                expense_name: $tr.find(".row-expense-title").val(),
                expense_item: $tr.find(".row-expense-item").val() || null,
                uom: $tr.find(".row-uom").val() || null,
                quantity: parseFloat($tr.find(".row-quantity").val() || 0),
                expense_price: parseFloat($tr.find(".row-expense-price").attr('value') || 0),
                tax: $tr.find(".row-tax").val() || null,
                subtotal: parseFloat($tr.find(".row-subtotal").attr('value') || 0),
            };
            serviceOrderExpenseData.push(item);
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
