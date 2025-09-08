class DetailDataHandle {
    static loadCustomerList(data) {
        ServiceOrder.pageElement.commonData.$customer.initSelect2({
            ajax: {
                url: ServiceOrder.pageElement.commonData.$customer.attr('data-url'),
                method: 'GET'
            },
            data: (data ? data : null),
            keyResp: 'account_dd_list',
            keyId: 'id',
            keyText: 'name'
        })
    }

    static loadDetailServiceOrder() {
        let $form = $('#form-detail-service-order');
        const data_url = $form.attr('data-url');
        $.fn.callAjax2({
            url: data_url,
            method: 'GET'
        }).then(
            (resp) => {
                const data = $.fn.switcherResp(resp);
                $x.fn.renderCodeBreadcrumb(data);
                $.fn.compareStatusShowPageAction(data);
                new $x.cls.file($('#attachment')).init({
                    name: 'attachment',
                    enable_edit: false,
                    enable_download: true,
                    data: data?.['attachment'],
                });

                const createdDate = data.date_created ? DateTimeControl.formatDateType(
                    "YYYY-MM-DD",
                    "DD/MM/YYYY",
                    data.date_created
                ) : '';

                const startDate = data.start_date ? DateTimeControl.formatDateType(
                    "YYYY-MM-DD",
                    "DD/MM/YYYY",
                    data.start_date
                ) : '';

                const endDate = data.end_date ? DateTimeControl.formatDateType(
                    "YYYY-MM-DD",
                    "DD/MM/YYYY",
                    data.end_date
                ) : '';

                // basic information fields
                ServiceOrder.pageElement.commonData.$titleEle.val(data?.title);
                ServiceOrder.pageElement.commonData.$createdDate.val(createdDate);
                DetailDataHandle.loadCustomerList(data.customer_data);
                ServiceOrder.pageElement.commonData.$startDate.val(startDate);
                ServiceOrder.pageElement.commonData.$endDate.val(endDate);

                // shipment

                WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                UsualLoadPageFunction.DisablePage(true, ['.modal-header button']);
            }
        )
    }
}

$(document).ready(function () {
    DetailDataHandle.loadDetailServiceOrder();
})