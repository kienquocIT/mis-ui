$(document).ready(function() {
    const $accountingPeriod = $('#accountingPeriod');

    UsualLoadPageFunction.LoadPeriod({
        element: $accountingPeriod,
        data_url: $accountingPeriod.attr('data-url'),
        apply_default_on_change: true
    });

    function CombinesData(frmEle) {
        let dataForm = {
            "period_mapped": $accountingPeriod.val()
        };
        if (dataForm) {
            let frm = new SetupFormSubmit($(frmEle));
            return {
                url: frm.dataUrl,
                method: frm.dataMethod,
                data: dataForm,
                urlRedirect: frm?.['urlRedirect'],
            };
        }
        return false;
    }

    $('#form-create-initial-balance').submit(function (event) {
        event.preventDefault();
        let combinesData = CombinesData($(this), false);
        if (combinesData) {
            WindowControl.showLoading({'loadingTitleAction': 'CREATE'});
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            setTimeout(() => {
                                window.location.replace($(this).attr('data-url-redirect').replace('0', data?.id));
                                location.reload.bind(location);
                            }, 1000);
                        }
                    },
                    (errs) => {
                        setTimeout(
                            () => {
                                WindowControl.hideLoading();
                            },
                            1000
                        )
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
        }
    });

    let url_loaded = $('#script-url').attr('data-url-list');
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                data = data['initial_balance_list'];

                // console.log(data)

                for (let i = 0; i < data.length; i++) {
                    let item = data[i]
                    let tab_html = ``
                    for (let j = 0; j < item?.['tab_account_balance_data'].length; j++) {
                        tab_html += `<div class="col-12 col-md-3 col-lg-2 mb-2">
                                        <div class="media">
                                            <div class="media-body">
                                                <div class="text-muted">${item?.['tab_account_balance_data'][j]?.['tab_name']}</div>
                                                <div><span class="fw-bold mask-money" data-init-money="${item?.['tab_account_balance_data'][j]?.['tab_value']}"></span></div>
                                            </div>
                                        </div>
                                    </div>`
                    }
                    $('#initial-balance-list-container').append(`
                        <div class="col-12 mb-3">
                            <div class="bflow-mirrow-card">
                                <div class="row mb-5">
                                    <div class="col-10">
                                        <span class="badge badge-primary badge-pill mb-2">${item?.['code']}</span>
                                        <span><a title="${item?.['title']}" href="${$('#script-url').attr('data-url-detail').replace('0', item?.['id'])}" class="link-primary underline_hover h4">${item?.['title']}</a></span>
                                    </div>
                                    <div class="col-2 text-right">
                                        <button type="button" class="btn btn-rounded text-danger bflow-mirrow-btn delete-ib">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="row">
                                    ${tab_html}
                                </div>
                            </div>
                        </div>
                    `);
                }

                $.fn.initMaskMoney2();
            }
        }
    )

    $(document).on('click', '.delete-ib', function () {
        $.fn.notifyB({description: "Deleting initial balance is not allowed."}, 'failure')
    })
});
