const pageElement = {
    commonData: {
        $createdDate: $('#so-created-date'),
        $startDate: $('#so-start-date'),
        $endDate: $('#so-end-date'),
        $customer: $('#so-customer'),
    }
}

function initSelect($ele, opts = {}) {
    if ($ele.hasClass("select2-hidden-accessible")) {
        $ele.select2('destroy')
    }
    $ele.empty()
    $ele.initSelect2({
        ...opts
    })
}

function initDateTime() {
    UsualLoadPageFunction.LoadDate({
        element: pageElement.commonData.$createdDate,
        empty: false
    })

    UsualLoadPageFunction.LoadDate({
        element: pageElement.commonData.$startDate,
        empty: false
    })

    UsualLoadPageFunction.LoadDate({
        element: pageElement.commonData.$endDate,
    })
}

function initPageSelect() {
    initSelect(pageElement.commonData.$customer, {
        dataParams: {
            account_types_mapped__account_type_order: 0
        }
    })
}
