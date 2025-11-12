$(document).ready(function () {
    WindowControl.showLoading()

    const $script_url = $('#script-url')
    const {service_order_id} = $x.fn.getManyUrlParameters(['service_order_id'])
    let ajax_detail_service_order = $.fn.callAjax2({
        url: $script_url.attr('data-url-service-order-detail-for-dashboard').replace('0', service_order_id),
        data: {},
        method: 'GET'
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data && typeof data === 'object' && data.hasOwnProperty('service_order_detail_dashboard')) {
                return data?.['service_order_detail_dashboard'];
            }
            return {};
        },
        (errs) => {
            console.log(errs);
        }
    )

    function ParseServiceOrderDetailHTML(data_list=[]) {
        let sum_contract_value_done = 0

        let waiting_svo = 0
        let completed_svo = 0
        let progressing_svo = 0

        let waiting_wo = 0
        let completed_wo = 0
        let progressing_wo = 0

        let waiting_task = 0
        let completed_task = 0
        let progressing_task = 0

        let service_detail_list_html = ''
        let avg_svo_detail_percent_completed = 0

        for (let i=0; i < data_list.length; i++) {
            let item = data_list[i]
            let avg_wo_percent_completed = 0
            let wo_contribute_html = ''
            for (let j=0; j < (item?.['work_order_contribute_list'] || []).length; j++) {
                let wo_ctb_item = item?.['work_order_contribute_list'][j]
                let task_percent_completed = []
                let task_list_html = ''
                for (let k=0; k < (wo_ctb_item['work_order_data']?.['task_data_list'] || []).length; k++) {
                    let task_item = wo_ctb_item['work_order_data']?.['task_data_list'][k]
                    if (task_item?.['percent_completed'] === 0) {
                        waiting_task += 1
                    }
                    else if (task_item?.['percent_completed'] === 100) {
                        completed_task += 1
                    }
                    else {
                        progressing_task += 1
                    }
                    task_percent_completed.push(task_item?.['percent_completed'])
                    task_list_html += `<li class="advance-list-item">
                                            <div class="d-flex align-items-center justify-content-between">
                                                <div class="d-flex align-items-center">
                                                    <div class="form-check" hidden>
                                                        <input type="checkbox" class="form-check-input" id="${task_item?.['code']}" ${task_item?.['percent_completed'] === 100 ? 'checked' : ''} disabled>
                                                    </div>
                                                    <span class="badge badge-pill badge-light me-2 task-code">${task_item?.['code']}</span>
                                                    <span class="me-2 task-name">${task_item?.['percent_completed'] === 100 ? `<s>${task_item?.['title']}</s>` : `${task_item?.['title']}`}</span>
                                                </div>
                                                <div class="d-flex align-items-center">
                                                    <span class="text-muted small me-2 d-md-inline-block d-none task-percent-completed">${task_item?.['percent_completed']}% ${$.fn.gettext('completed')}</span>
                                                    <span class="badge badge-light badge-indicator me-2"></span>
                                                    <span class="text-muted small me-2 d-md-inline-block d-none task-inherit"> ${task_item?.['assignee_data']?.['full_name']}</span>
                                                    <span class="badge badge-light badge-indicator me-2"></span>
                                                    <button class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover" disabled>
                                                        <span class="icon">
                                                            <span class="feather-icon"><i class="bi bi-three-dots-vertical"></i></span>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                            ${task_item?.['remark'] ? `<span class="small text-muted task-remark">${task_item?.['remark']}</span>` : ''}
                                        </li>`
                }
                let wo_status_html = ''
                let avg_task_percent_completed = task_percent_completed.length !== 0 ? (task_percent_completed.reduce((a, b) => a + b, 0) / task_percent_completed.length) : 0
                avg_wo_percent_completed += avg_task_percent_completed * wo_ctb_item?.['contribution_percent'] / 100
                if (avg_task_percent_completed === 0) {
                    wo_status_html = `<span class="badge badge-orange me-2"><i class="far fa-clock"></i> ${$.fn.gettext('WAITING')} (${avg_task_percent_completed}%)</span>`
                    waiting_wo += 1
                }
                else if (avg_task_percent_completed === 100) {
                    wo_status_html = `<span class="badge badge-success me-2"><i class="bi bi-check-circle-fill"></i> ${$.fn.gettext('COMPLETED')} (${avg_task_percent_completed}%)</span>`
                    completed_wo += 1
                }
                else {
                    wo_status_html = `<span class="badge badge-blue me-2"><i class="bi bi-hourglass-split"></i> ${$.fn.gettext('PROCESSING')} (${avg_task_percent_completed}%)</span>`
                    progressing_wo += 1
                }

                wo_contribute_html += `<li class="advance-list-item">
                                            <div class="d-flex align-items-center justify-content-between">
                                                <div class="d-flex align-items-center">
                                                    <span class="me-2 h5 wo-name">${wo_ctb_item?.['work_order_data']?.['title']}</span>
                                                </div>
                                                <div class="d-flex align-items-center">
                                                    <span class="badge badge-light badge-outline me-2 d-md-inline-block d-none wo-contribution">${wo_ctb_item?.['contribution_percent']}% ${$.fn.gettext('contribution')}</span>
                                                    <span class="badge badge-light badge-indicator me-2"></span>
                                                    <span class="text-muted wo-date me-2">${moment(wo_ctb_item?.['work_order_data']?.['start_date']).format('DD/MM/YYYY')} - ${moment(wo_ctb_item?.['work_order_data']?.['end_date']).format('DD/MM/YYYY')}</span>
                                                    <span class="badge badge-light badge-indicator me-2"></span>
                                                    ${wo_status_html}
                                                    <span class="badge badge-light badge-indicator me-2"></span>
                                                    <button class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover" data-bs-toggle="collapse" href="#collapse${wo_ctb_item?.['id']}">
                                                        <span class="icon">
                                                            <span class="feather-icon"><i class="far fa-eye"></i></span>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="collapse my-3" id="collapse${wo_ctb_item?.['id']}">
                                                <h6 class="fw-bold text-muted mt-3"> ${$.fn.gettext('Task list')}:</h6>
                                                <ul class="advance-list task-list">
                                                    ${task_list_html}
                                                </ul>
                                            </div>
                                        </li>`
            }

            avg_svo_detail_percent_completed += avg_wo_percent_completed * item?.['service_percent'] / 100
            if (avg_wo_percent_completed === 0) {
                waiting_svo += 1
            }
            else if (avg_wo_percent_completed === 100) {
                completed_svo += 1
            }
            else {
                progressing_svo += 1
            }

            service_detail_list_html += `<div class="col-12 mb-3">
                                            <div class="bflow-mirrow-card service-card">
                                                <div class="row">
                                                    <div class="col-12 col-md-9 col-lg-9">
                                                        <h5><span class="badge badge-primary badge-pill service-code">${item?.['product_data']?.['code'] || ''}</span> <span class="service-name text-primary">${item?.['product_data']?.['title'] || ''}</span></h5><br>
                                                        <span class="bflow-mirrow-btn">${$.fn.gettext('Service value')}: <span class="service-value mask-money" data-init-money="${item?.['total_value'] || 0}"></span></span> 
                                                        <span class="badge badge-dark badge-indicator mx-2"></span>
                                                        <span class="bflow-mirrow-btn">${$.fn.gettext('Weight')}: <span class="service-weight">${item?.['service_percent'] || '--'}%</span></span>
                                                    </div>
                                                    <div class="col-12 col-md-3 col-lg-3 text-right">
                                                        <span class="bflow-mirrow-btn text-blue fw-bold h3">${avg_wo_percent_completed}%</span>
                                                    </div>
                                                    <div class="col-12 mt-3">
                                                        <ul class="advance-list wo-list mt-3">
                                                            ${wo_contribute_html}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`

            sum_contract_value_done += avg_wo_percent_completed * parseFloat(item?.['total_value'] || 0) / 100
        }
        $('#service-detail-list').html(service_detail_list_html)
        $('#service-order-progress').append(`
            <div class="progress progress-modern">
                <div class="progress-bar-modern" role="progressbar" 
                     style="width: ${avg_svo_detail_percent_completed}%">
                    <span class="progress-tooltip-modern">${avg_svo_detail_percent_completed}%</span>
                </div>
            </div>
        `)
        // Load summary info total task
        $('#total-tasks').text(waiting_task + completed_task + progressing_task)
        $('#task-waiting').text(waiting_task)
        $('#task-completed').text(completed_task)
        $('#task-progressing').text(progressing_task)

        // Load summary info total work
        $('#total-work-orders').text(waiting_wo + completed_wo + progressing_wo)
        $('#wo-waiting').text(waiting_wo)
        $('#wo-completed').text(completed_wo)
        $('#wo-progressing').text(progressing_wo)

        // Load summary info total service
        $('#total-services').text(waiting_svo + completed_svo + progressing_svo)
        $('#svo-waiting').text(waiting_svo)
        $('#svo-completed').text(completed_svo)
        $('#svo-progressing').text(progressing_svo)

        return sum_contract_value_done
    }

    Promise.all([ajax_detail_service_order]).then(
        (results) => {
            let svo_detail_data = results[0]
            // Load title
            $('#service-order-title').text(svo_detail_data?.['title'] || '--')
            // Load customer
            $('#service-order-customer').text(svo_detail_data?.['customer_data']?.['name'] || '--')
            // Load time
            $('#service-order-time').text(`${moment(svo_detail_data?.['start_date']).format('DD/MM/YYYY')} - ${moment(svo_detail_data?.['end_date']).format('DD/MM/YYYY')}`)
            // Load summary info contract value
            $('#contract-value').attr('data-init-money', svo_detail_data?.['contract_value'] || 0)
            // Load service detail
            let sum_contract_value_done = ParseServiceOrderDetailHTML(svo_detail_data?.['service_order_detail_list'] || [])
            // UPDATE contract value des
            $('#contract-value-delivered').attr('data-init-money', sum_contract_value_done || 0)
            $('#contract-value-delivered-percent').text((svo_detail_data?.['contract_value'] ? ((sum_contract_value_done || 0) * 100 / svo_detail_data?.['contract_value']) : 0).toFixed(2))

            $.fn.initMaskMoney2()
        }).then(function () {
            WindowControl.hideLoading()
    })
})