$(document).ready(function () {
    new AccountHandle().load();

    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    const industry_id = urlParams.get('industry_id');
    const industry_title = urlParams.get('industry_title');
    const total_employees = urlParams.get('total_employees');
    const revenue = urlParams.get('revenue');

    if (urlParams.size > 0) {
        $('#inp-account-name').val(name)
        loadIndustry({'id': industry_id, 'title': industry_title})
        $('#select-box-industry')
        $('#select-box-total-emp').val(total_employees)
        $('#select-box-annual-revenue').val(revenue)
    }

    let frm = $('#form-create-account')
    frm.submit(function (event) {
        event.preventDefault();
        let combinesData = new AccountHandle().combinesData($(this));
        // console.log(combinesData)
        if (combinesData) {
            WindowControl.showLoading({'loadingTitleAction': 'CREATE'});
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            setTimeout(() => {
                                window.location.replace($(this).attr('data-url-redirect').format_url_with_uuid(data.id));
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
});
