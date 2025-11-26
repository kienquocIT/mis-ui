$(document).ready(function() {
    let url_loaded = $('#script-url').attr('data-url-list');
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                data = data['allowed_app_auto_je_list'];

                // console.log(data)

                for (let i = 0; i < data.length; i++) {
                    let item = data[i]
                    $('#app-container').append(`
                        <div class="col-12 col-md-4 col-lg-3 mb-4 app-card-item">
                            <div class="card ${item?.['is_auto_je'] ? 'bg-success-light-5' : ''}">     
                                <div class="card-body">
                                    <div class="form-check form-switch">
                                        <input type="checkbox" data-app-id="${item?.['id']}" class="form-check-input is-active-app" ${item?.['is_auto_je'] ? 'checked' : ''}>
                                        <label for="is-active-app" class="form-check-label">${$.fn.gettext('Active')}</label>
                                    </div>
                                    <div class="mt-3 text-center">        
                                        <h3 class="${item?.['is_auto_je'] ? 'text-primary' : 'text-light'}">${item?.['app_code_parsed']}</h3>
                                    </div>
                                    <div class="mt-5 text-center">
                                        <button type="button" 
                                                ${item?.['is_auto_je'] ? '' : 'disabled'}
                                                class="btn btn-outline-primary btn-block config-app"
                                                data-app-code="${item?.['app_code']}"
                                                data-app-name="${item?.['app_code_parsed']}">
                                            ${$.fn.gettext('Click here to config')}
                                        </button>
                                    </div>
                                </div>
                            </div> 
                        </div>
                    `);
                }
                $.fn.initMaskMoney2();
            }
        }
    )

    $(document).on('change', '.is-active-app', function () {
        let data = {'is_auto_je': $(this).prop('checked')}
        let app_id = $(this).attr('data-app-id')
        Swal.fire({
            html:
            `<div class="d-flex align-items-center">
                <h4 class="text-blue">${$.fn.gettext('Are you sure you want to enable automatic journal entries for this transaction?')}</h4>
            </div>`,
            customClass: {
                confirmButton: 'btn btn-outline-secondary text-blue',
                cancelButton: 'btn btn-outline-secondary text-gray',
                container: 'swal2-has-bg',
                htmlContainer: 'bg-transparent text-start',
                actions:'w-100'
            },
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonText: $.fn.gettext('Confirm'),
            cancelButtonText: $.fn.gettext('Cancel'),
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                let ajax_update = $.fn.callAjax2({
                    url: $('#script-url').attr('data-url-detail').replace('/0', `/${app_id}`),
                    data: data,
                    method: 'PUT'
                }).then(
                    (resp) => {
                        $.fn.notifyB({description: 'Successfully'}, 'success');
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )

                Promise.all([ajax_update]).then(
                    (results) => {
                        location.reload()
                    }
                )
            }
        })
    })
})