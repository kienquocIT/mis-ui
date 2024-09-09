const script_url = $('#script-url')
const script_trans = $('#script-trans')
const IAEle = $('#box-select-ia')
const IAItemTable = $('#dtbProductIA')
const NONETable = $('#select-detail-table-none')
const SNTable = $('#select-detail-table-sn')
const LOTTable = $('#select-detail-table-lot')
const done_none = $('#select-detail-table-none-done')
const done_sn = $('#select-detail-table-sn-done')
const done_lot = $('#select-detail-table-lot-done')
const detail_modal = $('#select-detail-modal')
let DetailBtn = null
let IS_DETAIL_PAGE = false

class GISLoadPage {
    static LoadDateCreated() {
        $("#date_created").daterangepicker({
            singleDatePicker: true,
            timepicker: false,
            showDropdowns: false,
            minYear: 2023,
            locale: {
                format: 'DD/MM/YYYY'
            },
            maxYear: parseInt(moment().format('YYYY'), 10),
            // drops: 'up',
            autoApply: true,
        })
    }
    static LoadIA(data) {
        IAEle.initSelect2({
            data: data,
            ajax: {
                url: IAEle.attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                let result = [];
                for (let i = 0; i < resp.data[keyResp].length; i++) {
                    result.push(resp.data[keyResp][i])
                }
                return result;
            },
            keyResp: 'inventory_adjustment_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {
            if (IAEle.val()) {
                let dataParam = {}
                let ia_list_ajax = $.fn.callAjax2({
                    url: `${script_url.attr('data-url-ia').replace('/0', `/${IAEle.val()}`)}`,
                    data: dataParam,
                    method: 'GET'
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && typeof data === 'object' && data.hasOwnProperty('inventory_adjustment_detail')) {
                            return data?.['inventory_adjustment_detail'];
                        }
                        return {};
                    },
                    (errs) => {
                        console.log(errs);
                    }
                )

                Promise.all([ia_list_ajax]).then(
                    (results) => {
                        let decrease_list = []
                        for (let i = 0; i < results[0]?.['inventory_adjustment_item_mapped'].length; i++) {
                            let ia_item = results[0]?.['inventory_adjustment_item_mapped'][i]
                            if (ia_item?.['action_type'] === 1) {
                                decrease_list.push(ia_item)
                            }
                        }
                        if (decrease_list.length === 0) {
                            $.fn.notifyB({description: 'Can not get Decrease items in this IA.'}, 'warning')
                        }
                        else {
                            GISLoadTab.DrawTableIAItems(decrease_list)
                        }
                    })
            }
        })
    }
}

class GISLoadTab {
    static DrawTableIAItems(data_list=[]) {
        IAItemTable.DataTable().clear().destroy()
        IAItemTable.DataTableDefault({
            dom: 't',
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            data: data_list,
            columns: [
                {
                    className: 'wrap-text',
                    render: () => {
                        return ``;
                    }
                },
                {
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="badge badge-light">${row?.['product_mapped']?.['code']}</span> ${row?.['product_mapped']?.['title']}`;
                    }
                },
                {
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<textarea disabled readonly class="form-control small" rows="2" cols="8">${row?.['product_mapped']?.['description']}</textarea>`;
                    }
                },
                {
                    className: 'wrap-text text-center',
                    render: (data, type, row) => {
                        return `${row?.['uom_mapped']?.['title']}`;
                    }
                },
                {
                    className: 'wrap-text text-center',
                    render: (data, type, row) => {
                        return `<span class="limit-quantity">${row?.['limit_quantity']}</span>`;
                    }
                },
                {
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="badge badge-sm badge-soft-primary">${row?.['warehouse_mapped']?.['code']}</span> ${row?.['warehouse_mapped']?.['title']}`;
                    }
                },
                {
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<div class="input-group">
                                    <input readonly disabled class="form-control selected-quantity" type="number" value="${row?.['quantity'] ? row?.['quantity'] : 0}">
                                    <button data-stock-quantity="${row?.['stock_quantity']}"
                                            data-difference="${row?.['limit_quantity']}"
                                            data-uom-title="${row?.['uom_mapped']?.['title']}"
                                            data-type="${row?.['product_mapped']?.['general_traceability_method']}"
                                            data-prd-wh-id="${row?.['product_warehouse_mapped_id']}"
                                            data-prd-id="${row?.['product_mapped']?.['id']}"
                                            data-wh-id="${row?.['warehouse_mapped']?.['id']}"
                                            data-uom-id="${row?.['uom_mapped']?.['id']}"
                                            data-ia-item-id="${row?.['id']}"
                                            data-bs-toggle="modal"
                                            data-bs-target="#select-detail-modal"
                                            type="button"
                                            class="btn btn-sm btn-outline-secondary select-detail">
                                        <i class="bi bi-list-check"></i>
                                    </button>
                                </div>
                                <script class="lot-data-script">${row?.['lot_data'] ? JSON.stringify(row?.['lot_data']) : JSON.stringify([])}</script>
                                <script class="sn-data-script">${row?.['sn_data'] ? JSON.stringify(row?.['sn_data']) : JSON.stringify([])}</script>
                        `;
                    }
                },
            ],
        })
    }
    static DrawTableIAItemsLOT(data_list=[], selected_list=[]) {
        LOTTable.DataTable().clear().destroy()
        LOTTable.DataTableDefault({
            dom: 't',
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: '100vh',
            scrollY: '50vh',
            scrollCollapse: true,
            data: data_list,
            columns: [
                {
                    className: 'wrap-text',
                    render: () => {
                        return ``;
                    }
                },
                {
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `${row?.['lot_number']}`;
                    }
                },
                {
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="limit-quantity">${row?.['quantity_import'] ? row?.['quantity_import'] : 0}</span>`;
                    }
                },
                {
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `${row?.['expire_date'] ? moment(row?.['expire_date'].split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY') : '--'}`;
                    }
                },
                {
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `${row?.['manufacture_date'] ? moment(row?.['manufacture_date'].split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY') : '--'}`;
                    }
                },
                {
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        let lot_selected_quantity = 0
                        for (let i = 0; i < selected_list.length; i++) {
                            if (selected_list[i]?.['lot_id'] === row?.['id']) {
                                lot_selected_quantity = selected_list[i]?.['quantity']
                            }
                        }
                        return `<input ${IS_DETAIL_PAGE ? 'disabled readonly' : ''} data-lot-id="${row?.['id']}" type="number" class="form-control lot-input" value="${lot_selected_quantity}">`;
                    }
                },
            ],
            initComplete: function () {
                $('.lot-input').trigger('change')
            }
        })
    }
    static DrawTableIAItemsSN(data_list=[], selected_list=[]) {
        SNTable.DataTable().clear().destroy()
        SNTable.DataTableDefault({
            dom: 't',
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollY: '50vh',
            scrollCollapse: true,
            data: data_list,
            columns: [
                {
                    className: 'wrap-text',
                    render: () => {
                        return ``;
                    }
                },
                {
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `${row?.['vendor_serial_number']}`;
                    }
                },
                {
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `${row?.['serial_number']}`;
                    }
                },
                {
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `${row?.['expire_date'] ? moment(row?.['expire_date'].split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY') : '--'}`;
                    }
                },
                {
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `${row?.['manufacture_date'] ? moment(row?.['manufacture_date'].split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY') : '--'}`;
                    }
                },
                {
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `${row?.['warranty_start'] ? moment(row?.['warranty_start'].split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY') : '--'}`;
                    }
                },
                {
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `${row?.['warranty_end'] ? moment(row?.['warranty_end'].split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY') : '--'}`;
                    }
                },
                {
                    className: 'wrap-text text-center',
                    render: (data, type, row) => {
                        let is_checked = selected_list.includes(row?.['id'])
                        return `<div class="form-check">
                                    <input ${is_checked ? 'checked': ''} data-sn-id="${row?.['id']}" type="checkbox" class="form-check-input sn-checkbox">
                                    <label class="form-check-label"></label>
                                </div>`;
                    }
                },
            ],
            initComplete: function () {
                $('.sn-checkbox').trigger('change')
            }
        })
    }
}

class GISAction {
    static DisabledDetailPage(option) {
        if (option === 'detail') {
            $('.form-control').prop('readonly', true);
            $('.form-select').prop('disabled', true);
            $('.select2').prop('disabled', true);
            $('input').prop('disabled', true);
        }
    }
}

class GISHandle {
    static LoadPage() {
        GISLoadPage.LoadDateCreated()
        GISLoadPage.LoadIA()
        GISLoadTab.DrawTableIAItemsLOT()
        GISLoadTab.DrawTableIAItemsSN()
    }
    static LoadGoodsIssueDetail(option) {
        let url_loaded = $('#frmDetail').attr('data-url');
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    data = data['goods_issue_detail'];
                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                    $.fn.compareStatusShowPageAction(data);
                    $x.fn.renderCodeBreadcrumb(data);
                    console.log(data)
                    IS_DETAIL_PAGE = option === 'detail'

                    $('#title').val(data?.['title'])
                    $('#date_created').val(moment(data?.['date_created'].split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY'))
                    $('#note').val(data?.['note'])

                    if (data?.['goods_issue_type'] === 0) {
                        $('#for-ia').prop('checked', true)
                        GISLoadPage.LoadIA(data?.['inventory_adjustment'])
                        $('#inventory-adjustment-select-space').prop('hidden', false)
                        GISLoadTab.DrawTableIAItems(data?.['detail_data_ia'])
                    }
                    else if (data?.['goods_issue_type'] === 1) {
                    }
                    else if (data?.['goods_issue_type'] === 2) {
                    }

                    GISAction.DisabledDetailPage(option);
                }
            })
    }
    static CombinesDataForIA(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = $('#title').val()
        if ($('#for-ia').prop('checked')) {
            frm.dataForm['goods_issue_type'] = 0
        }
        else if ($('#for-liquidation').prop('checked')) {
            frm.dataForm['goods_issue_type'] = 1
        }
        else if ($('#for-production').prop('checked')) {
            frm.dataForm['goods_issue_type'] = 2
        }
        frm.dataForm['inventory_adjustment_id'] = $('#box-select-ia').val()
        frm.dataForm['note'] = $('#note').val()

        let detail_data_ia = [];
        IAItemTable.find('tbody tr').each(function () {
            let row = $(this);
            detail_data_ia.push({
                'inventory_adjustment_item_id': row.find('.select-detail').attr('data-ia-item-id'),
                'product_warehouse_id': row.find('.select-detail').attr('data-prd-wh-id'),
                'product_id': row.find('.select-detail').attr('data-prd-id'),
                'warehouse_id': row.find('.select-detail').attr('data-wh-id'),
                'uom_id': row.find('.select-detail').attr('data-uom-id'),
                'limit_quantity': row.find('.limit-quantity').text(),
                'quantity': row.find('.selected-quantity').val(),
                'lot_data': row.find('.lot-data-script').text() ? JSON.parse(row.find('.lot-data-script').text()) : [],
                'sn_data': row.find('.sn-data-script').text() ? JSON.parse(row.find('.sn-data-script').text()) : []
            })
        })
        frm.dataForm['detail_data_ia'] = detail_data_ia;

        // console.log(frm)
        return frm
    }
}

$('input[name="issue-type"]').on('change', function () {
    if ($('#for-ia').prop('checked')) {
        $('#inventory-adjustment-select-space').prop('hidden', false)
        $('#production-order-select-space').prop('hidden', true)
    }
    else if ($('#for-production').prop('checked')) {
        $('#inventory-adjustment-select-space').prop('hidden', true)
        $('#production-order-select-space').prop('hidden', false)
    }
})

$(document).on("click", '.select-detail', function () {
    DetailBtn = $(this)
    if ($(this).attr('data-type') === '0') {
        let stock_quantity = $(this).attr('data-stock-quantity')
        $('#stock-quantity').val(stock_quantity)
        LOTTable.DataTable().clear().destroy()
        SNTable.DataTable().clear().destroy()
        NONETable.prop('hidden', false)
        SNTable.prop('hidden', true)
        LOTTable.prop('hidden', true)
        done_none.prop('hidden', false)
        done_sn.prop('hidden', true)
        done_lot.prop('hidden', true)
        $('#issue-quantity').val($(this).closest('tr').find('.selected-quantity').val())
    }
    else if ($(this).attr('data-type') === '1') {
        let dataParam = {
            'product_warehouse_id': $(this).attr('data-prd-wh-id')
        }
        let prd_wh_lot = $.fn.callAjax2({
            url: LOTTable.attr('data-lot-url'),
            data: dataParam,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('warehouse_lot_list')) {
                    return data?.['warehouse_lot_list'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([prd_wh_lot]).then(
            (results) => {
                NONETable.prop('hidden', true)
                SNTable.prop('hidden', true)
                LOTTable.prop('hidden', false)
                done_none.prop('hidden', true)
                done_sn.prop('hidden', true)
                done_lot.prop('hidden', false)
                $('#amount-balance-lot').text($(this).attr('data-difference') + ' ' + $(this).attr('data-uom-title')).attr('data-value', $(this).attr('data-difference'))
                SNTable.DataTable().clear().destroy()
                let filter_lot = []
                for (let i = 0; i < results[0].length; i++) {
                    if (results[0][i]?.['quantity_import'] > 0) {
                        filter_lot.push(results[0][i])
                    }
                }
                let selected_list = DetailBtn.closest('tr').find('.lot-data-script').text() ? JSON.parse(DetailBtn.closest('tr').find('.lot-data-script').text()) : []
                GISLoadTab.DrawTableIAItemsLOT(filter_lot, selected_list)
            })
    }
    else if ($(this).attr('data-type') === '2') {
        let dataParam = {
            'product_warehouse_id': $(this).attr('data-prd-wh-id'),
            'is_delete': false
        }
        let prd_wh_serial = $.fn.callAjax2({
            url: SNTable.attr('data-sn-url'),
            data: dataParam,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('warehouse_serial_list')) {
                    return data?.['warehouse_serial_list'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([prd_wh_serial]).then(
            (results) => {
                console.log(results[0])
                NONETable.prop('hidden', true)
                SNTable.prop('hidden', false)
                LOTTable.prop('hidden', true)
                done_none.prop('hidden', true)
                done_sn.prop('hidden', false)
                done_lot.prop('hidden', true)
                $('#amount-balance-sn').text($(this).attr('data-difference') + ' ' + $(this).attr('data-uom-title')).attr('data-value', $(this).attr('data-difference'))
                LOTTable.DataTable().clear().destroy()
                let selected_list = DetailBtn.closest('tr').find('.sn-data-script').text() ? JSON.parse(DetailBtn.closest('tr').find('.sn-data-script').text()) : []
                GISLoadTab.DrawTableIAItemsSN(results[0], selected_list)
            })
    }
})

$('#issue-quantity').on('change', function () {
    const limit = parseFloat(DetailBtn.closest('tr').find('.limit-quantity').text())
    let selected = parseFloat($(this).val())
    if (selected > limit) {
        $.fn.notifyB({description: "Issue quantity is invalid."}, 'warning')
        $(this).val(0)
    }
})

$(document).on("change", '.sn-checkbox', function () {
    const limit = parseFloat($('#amount-balance-sn').attr('data-value'))
    let selected = $('.sn-checkbox:checked').length
    $('#amount-selected-sn').text(selected)
    if (selected >= limit) {
        $('.sn-checkbox').prop('disabled', true)
        $('.sn-checkbox:checked').prop('disabled', IS_DETAIL_PAGE)
    }
    else {
        $('.sn-checkbox').prop('disabled', IS_DETAIL_PAGE)
    }
})

$(document).on("change", '.lot-input', function () {
    let old_value = parseInt($(this).val())
    const limit = parseFloat($('#amount-balance-lot').attr('data-value'))
    let selected = 0
    $('.lot-input').each(function () {
        selected += $(this).val() ? parseFloat($(this).val()) : 0
    })
    $('#amount-selected-lot').text(selected)
    if (selected > limit) {
        $.fn.notifyB({description: "Issue quantity is invalid."}, 'warning')
        $(this).val(0)
        $('#amount-selected-lot').text(selected - old_value)
    }
})

done_none.on('click', function () {
    let issue_quantity = parseFloat($('#issue-quantity').val())
    let stock_quantity = parseFloat($('#stock-quantity').val())
    let limit_quantity = parseFloat(DetailBtn.closest('tr').find('.limit-quantity').text())
    if (issue_quantity <= stock_quantity && issue_quantity <= limit_quantity) {
        DetailBtn.closest('tr').find('.selected-quantity').val(issue_quantity)
        detail_modal.modal('hide')
    }
    else {
        $.fn.notifyB({description: 'Issue quantity value is not valid.'}, 'failure')
    }
})

done_sn.on('click', function () {
    let issue_quantity = $('.sn-checkbox:checked').length
    let limit_quantity = parseFloat(DetailBtn.closest('tr').find('.limit-quantity').text())
    if (issue_quantity <= limit_quantity) {
        DetailBtn.closest('tr').find('.selected-quantity').val(issue_quantity)
        let sn_data = []
        $('.sn-checkbox:checked').each(function () {
            sn_data.push($(this).attr('data-sn-id'))
        })
        DetailBtn.closest('tr').find('.sn-data-script').text(JSON.stringify(sn_data))
        detail_modal.modal('hide')
    }
    else {
        $.fn.notifyB({description: 'Issue quantity value is not valid.'}, 'failure')
    }
})

done_lot.on('click', function () {
    let issue_quantity = 0
    $('.lot-input').each(function () {
        issue_quantity += $(this).val() ? parseFloat($(this).val()) : 0
    })
    let limit_quantity = parseFloat(DetailBtn.closest('tr').find('.limit-quantity').text())
    if (issue_quantity <= limit_quantity) {
        DetailBtn.closest('tr').find('.selected-quantity').val(issue_quantity)
        let lot_data = []
        $('.lot-input').each(function () {
            let quantity = $(this).val() ? parseFloat($(this).val()) : 0
            let old_quantity = $(this).closest('tr').find('.limit-quantity').text() ? parseFloat($(this).closest('tr').find('.limit-quantity').text()) : 0
            if (quantity > 0) {
                lot_data.push({
                    'lot_id': $(this).attr('data-lot-id'),
                    'old_quantity': old_quantity,
                    'quantity': quantity
                })
            }
        })
        DetailBtn.closest('tr').find('.lot-data-script').text(JSON.stringify(lot_data))
        detail_modal.modal('hide')
    }
    else {
        $.fn.notifyB({description: 'Issue quantity value is not valid.'}, 'failure')
    }
})
