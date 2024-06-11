const dateEle = $('#date')
const saleOrderEle = $('#sale-order')
const salePersonEle = $('#sale-person')
const tab_line_detail_datatable = $('#tab_line_detail_datatable')

function LoadDate() {
    dateEle.daterangepicker({
        singleDatePicker: true,
        timePicker: false,
        showDropdowns: true,
        minYear: parseInt(moment().format('YYYY')),
        minDate: new Date(parseInt(moment().format('YYYY')), parseInt(moment().format('MM'))-1, parseInt(moment().format('DD'))),
        locale: {
            format: 'YYYY-MM-DD'
        },
        cancelClass: "btn-secondary",
        maxYear: parseInt(moment().format('YYYY')) + 50,
    })
}

function LoadSaleOrder(data) {
    saleOrderEle.initSelect2({
        data: data,
        keyId: 'id',
        keyText: 'title',
    })
}

function LoadSalePerson(data) {
    salePersonEle.initSelect2({
        data: data,
        keyId: 'id',
        keyText: 'fullname',
    })
}

function LoadLineDetailTable(data) {
    console.log(data)
    for (const row of data) {
        let product = row?.['so_item']?.['product']
        let uom = row?.['so_item']?.['uom']
        let total_order = row?.['so_item']?.['total_order']
        let registered_quantity = row?.['registered_quantity']
        tab_line_detail_datatable.find('tbody').append(`
        <tr>
            <td><span class="badge badge-sm badge-soft-indigo">${product?.['code']}</span> <b>${product?.['title']}</b></td>
            <td><span>${uom?.['title']}</span></td>
            <td class="text-primary fw-bold">${total_order}</td>
            <td class="text-primary fw-bold">${registered_quantity}</td>
        </tr>
        `)
    }
}

class GoodsRegistrationHandle {
    combinesData(frmEle, for_update=false) {
        let frm = new SetupFormSubmit($(frmEle))

        frm.dataForm['title'] = $('#title').val()

        return frm
    }
}

function Disable(option) {
    if (option === 'detail') {
        $('.form-control').prop('disabled', true).css({color: 'black'});
        $('.form-select').prop('disabled', true).css({color: 'black'});
        $('.select2').prop('disabled', true);
    }
}

function LoadDetailGoodsRegistration(option) {
    let url_loaded = $('#frm_goods_registration_detail').attr('data-url')
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                data = data['good_registration_detail'];
                $x.fn.renderCodeBreadcrumb(data);

                $('#title').val(data?.['title'])
                LoadDate()
                LoadSaleOrder(data?.['sale_order'])
                LoadSalePerson(data?.['sale_order']?.['sale_person'])
                LoadLineDetailTable(data?.['data_line_detail'])

                Disable(option);
            }
        })
}
