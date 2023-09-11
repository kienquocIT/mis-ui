let [urlEle, dataExpenseEle] = [$('#url-factory'), $('#expense-list')]
const urlDetail = urlEle.data('url-detail')
let [codeEle, titleEle, desEle, activeEle, parentSelectEle, colId] = [$('#col-code'), $('#col-title'), $('#col-description'), $('#col-active'), $('#select-box-expense-parent-detail'), $('#col-id')]
const columns =
    [
        {
            data: 'code',
            className: 'wrap-text w-15',
            render: (data, type, row, meta) => {
                return `<a href="#" class="btn-detail" data-id="{0}" data-bs-toggle="modal" data-bs-target="#modalDetail"><span class="badge badge-soft-primary">{1}</span></a>`.format_by_idx(
                    row.id, data
                )
            }
        },
        {
            data: 'is_parent',
            className: 'wrap-text w-5',
            render: (data, type, row, meta) => {
                if (data)
                    return `<button class="btn-collapse-expense-child btn btn-icon btn-rounded mr-1" data-id="${row.id}"><span class="icon"><i class="icon-collapse-expense-child fas fa-caret-right text-secondary"></i></span></button>`;
                else
                    return ''
            }
        },
        {
            data: 'title',
            className: 'wrap-text w-30',
            render: (data, type, row, meta) => {
                return `<span>{0}</span></a>`.format_by_idx(
                    data
                )
            }
        },
        {
            data: 'description',
            className: 'wrap-text w-40',
            render: (data, type, row, meta) => {
                return `<span>{0}</span></a>`.format_by_idx(
                    data,
                )
            }
        },
        {
            data: 'is_active',
            className: 'wrap-text w-10',
            render: (data, type, row, meta) => {
                if (data)
                    return `<div class="form-check form-switch"><input type="checkbox" class="form-check-input" checked name="is_active"></div>`
                else
                    return `<div class="form-check form-switch"><input type="checkbox" class="form-check-input" name="is_active"></div>`

            }
        },
    ]

class ExpenseItemLoadPage {
    static loadMainDtbList() {
        if (!$.fn.DataTable.isDataTable('#dtbExpense')) {
            let dtb = $('#dtbExpense');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                useDataServer: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            let result = resp.data['expense_item_list'] ? resp.data['expense_item_list'] : []
                            dataExpenseEle.text(JSON.stringify(result));
                            return result.filter(obj => obj.level === 0);
                        }
                        return [];
                    },
                },
                columns: columns,
            });
        }
    }

    loadChildDtbList(dtb_id, data) {
        if (!$.fn.DataTable.isDataTable(dtb_id)) {
            let dtb = $(dtb_id)
            dtb.DataTableDefault({
                dom:'',
                data: data,
                columns: columns,
            });
        }
    }

    static loadParentSelectEle(ele) {
        ele.initSelect2()
    }

    static loadParentSelectEleDetail(ele, data, expense_detail) {
        let expense_detail_id = null
        if($.fn.hasOwnProperties(expense_detail?.['expense_parent'] , ['id'])){
            expense_detail_id = expense_detail?.['expense_parent'].id
        }
        ele.initSelect2({
            data: data,
            callbackDataResp(resp, keyResp) {
                let list_result = []
                resp.data[keyResp].map(function (item) {
                    if (expense_detail.level === item.level && expense_detail.id !== item.id && expense_detail_id === item?.['expense_parent']) {
                        list_result.push(item)
                    }
                })
                return list_result
            }
        })

    }

    getDataExpenseChild(parent_id) {
        let data = JSON.parse(dataExpenseEle.text());
        return data.filter(obj => obj?.['expense_parent'] === parent_id)
    }

    static hiddenColChild(trEle, iconEle) {
        trEle.removeClass('bg-grey-light-5');
        iconEle.removeClass('text-dark').addClass('text-secondary');
        trEle.next().find('.child-expense-group').slideToggle({
            complete: function () {
                trEle.next().addClass('hidden');
            }
        });
    }

    generateDtbExpenseChild(btn) {
        let theadTable = $('#dtbExpense').html();
        let idTbl = UtilControl.generateRandomString(12);
        let dtbSub = `<table id="${idTbl}" class="table nowrap w-100 mb-5">${theadTable}</table>`;
        btn.closest('tr').after(
            `<tr class="child-expense-item-list"><td colspan="6"><div class="child-expense-group pt-3 pb-3 ml-3 pl-5 pr-5 hidden-simple">${dtbSub}</div></td></tr>`
        );
        let expense_child_data = this.getDataExpenseChild(btn.data('id'));
        this.loadChildDtbList(`#${idTbl}`, expense_child_data)
    }

    static showColChild(btn, trEle, iconEle) {
        let expenseLoadClass = new ExpenseItemLoadPage();
        trEle.addClass('bg-grey-light-5');
        iconEle.removeClass('text-secondary').addClass('text-dark');

        if (!trEle.next().hasClass('child-expense-item-list')) {
            expenseLoadClass.generateDtbExpenseChild(btn)
        }
        trEle.next().removeClass('hidden').find('.child-expense-group').slideToggle();
    }

    static loadDetail(pk) {
        $.fn.callAjax2({
            'url': urlDetail.format_url_with_uuid(pk),
            'method': 'GET',
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('expense_item')) {
                    let expense_detail = resp.data?.['expense_item'];
                    codeEle.val(expense_detail.code);
                    titleEle.val(expense_detail.title);
                    desEle.val(expense_detail.description);
                    this.loadParentSelectEleDetail(parentSelectEle, expense_detail?.['expense_parent'], expense_detail);
                    activeEle.prop('checked', expense_detail.is_active);
                    colId.val(expense_detail.id);
                }
            }
        })
    }

    static getDataUpdate(){
        let data = {}
        if(codeEle.hasClass('tag-changed')){
            data['code'] = codeEle.val()
        }
        if(titleEle.hasClass('tag-changed')){
            data['title'] = titleEle.val()
        }
        console.log(desEle.hasClass('tag-changed'))
        if(desEle.hasClass('tag-changed')){
            data['description'] = desEle.val()
        }
        if(parentSelectEle.hasClass('tag-changed')){
            data['expense_parent'] = parentSelectEle.val()
        }
        if(activeEle.hasClass('tag-changed')){
            data['is_active'] = activeEle.is(':checked');
        }
        return data
    }

}