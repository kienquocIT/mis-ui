const $urlEle = $("#url-factory")
const $transEle = $("#trans-factory")
const $rangeInputEle = $('#rangeInput')
const $checkInputRateEle = $('#check-input-rate')
const $inputRateEle = $('#input-rate')
const $opp_stage_pipeline = $('#opp-stage-pipeline')
const $form_Opp_Task = $('#formOpportunityTask')
const $input_open_date = $('#input-open-date')
const $input_close_date = $('#input-close-date')
const $check_agency_role = $('#check-agency-role')
const $input_budget = $('#input-budget')
const $opp_title = $('#opp_title')
const $goto_call_log = $('#goto-call-log')
const $goto_email = $('#goto-email')
const $goto_meeting = $('#goto-meeting')
const $input_decision_maker = $('#input-decision-maker')
const $check_lost_reason = $('#check-lost-reason')
// tabs
const $table_product = $('#table-product')
const $table_competitor = $('#table-competitors')
const $table_contact_role = $('#table-contact-role')
const $input_product_pretax_amount= $('#input-product-pretax-amount')
const $input_product_taxes = $('#input-product-taxes')
const $input_product_total= $('#input-product-total')
const $estimated_gross_profit_percent = $('#estimated-gross-profit-percent')
const $estimated_gross_profit_value = $('#estimated-gross-profit-value')
const $box_select_factor = $('#box-select-factor')
const $productCategorySelectEle = $('#select-box-product-category')
const $customerSelectEle = $('#select-box-customer')
const $endCustomerSelectEle = $('#select-box-end-customer')
const $salePersonSelectEle = $('#select-box-sale-person')
const $data_type_customer = $('#data_type_customer')
const $data_role_customer = $('#data_role_customer')
const $process_runtime_detail = $('#process-runtime-detail')

/**
 * Khai báo các biến sử dụng trong page
 */
class OpportunityPageVariables {
    constructor() {
        this.opp_detail_data = null
        this.opp_config_data = null
        this.opp_stage_data = null
        this.data_type_customer = $data_type_customer.text() ? JSON.parse($data_type_customer.text()) : []
        this.data_role_customer = $data_role_customer.text() ? JSON.parse($data_role_customer.text()) : [];
    }
}
const pageVariables = new OpportunityPageVariables()

/**
 * Các hàm load page và hàm hỗ trợ
 */
class OpportunityPageFunction {
    // stage pipeline
    static ParseHTMLOppStage() {
        let opp_stage_list = pageVariables.opp_detail_data?.['stage'] || []
        let [
            is_close_lost,
            is_delivery,
            is_deal_closed
        ] = [
            pageVariables.opp_detail_data?.['is_close_lost'],
            Object.keys((pageVariables.opp_detail_data?.['sale_order'] || {})?.['delivery'] || {}).length > 0,
            pageVariables.opp_detail_data?.['is_deal_closed']
        ]
        let stages_list_data = OpportunityPageFunction.SortOppStageByWinrate(pageVariables.opp_stage_data);

        $opp_stage_pipeline.html('')

        for (let i = 0; i < stages_list_data.length; i++) {
            let item = stages_list_data[i]
            if (item?.['is_closed_lost']) {
                $opp_stage_pipeline.append(`<li class="stage-child stage-lost2" data-id="${item?.['id']}">
                    <span title="${item?.['indicator']} (${item?.['win_rate']}%): $ {item?.['description']}">${item?.['indicator']} (${item?.['win_rate']}%)</span>
                </li>`)
            }
            else if (item?.['is_delivery']) {
                $opp_stage_pipeline.append(`<li class="stage-child stage-delivery2" data-id="${item?.['id']}">
                    <div class="dropdown dropend">
                        <a href="#" data-bs-toggle="dropdown"><span title="${item?.['indicator']} (${item?.['win_rate']}%): ${item?.['description']}">${item?.['indicator']} (${item?.['win_rate']}%)</span></a>
                        <div class="dropdown-menu position-absolute" style="z-index: 999;">
                            <a class="dropdown-item btn-go-to-stage" href="#">${$.fn.gettext('Go to stage')}</a>
                        </div>
                    </div>
                </li>`)
            }
            else if (item?.['is_deal_closed']) {
                $opp_stage_pipeline.append(`<li class="stage-child stage-close2" data-id="${item?.['id']}">
                    <div class="dropdown dropend">
                        <a href="#" data-bs-toggle="dropdown"><span class="text-uppercase" title="${item?.['indicator']} (${item?.['win_rate']}%): ${item?.['description']}">${item?.['indicator']}</span></a>
                        <div class="dropdown-menu position-absolute" style="z-index: 999;">
                            <div class="form-check form-switch">
                                <input type="checkbox" class="form-check-input" id="input-close-deal" ${is_deal_closed ? 'checked' : ''}>
                                <label for="input-close-deal" class="form-label">Close Deal</label>
                            </div>
                        </div>
                    </div>
                </li>`)
            }
            else {
                $opp_stage_pipeline.append(`<li class="stage-child" data-id="${item?.['id']}">
                    <div class="dropdown dropend">
                        <a href="#" data-bs-toggle="dropdown"><span title="${item?.['indicator']} (${item?.['win_rate']}%): ${item?.['description']}">${item?.['indicator']} (${item?.['win_rate']}%)</span></a>
                        <div class="dropdown-menu position-absolute" style="z-index: 999;">
                            <a class="dropdown-item btn-go-to-stage" href="#">${$.fn.gettext('Go to stage')}</a>
                        </div>
                    </div>
                </li>`)
            }
        }

        let min_stage = opp_stage_list.reduce((min, item) => (min === null || item?.['win_rate'] < min?.['win_rate']) ? item : min, null)
        let max_stage = opp_stage_list.reduce((max, item) => (max === null || item?.['win_rate'] > max?.['win_rate']) ? item : max, null)
        let passed_stages = stages_list_data.filter(item =>
            item?.['win_rate'] >= min_stage?.['win_rate'] &&
            item?.['win_rate'] <= max_stage?.['win_rate'] &&
            !item?.['is_closed_lost'] &&
            !item?.['is_delivery'] &&
            !item?.['is_deal_closed']
        )

        if (is_close_lost && !is_delivery) {
            passed_stages = passed_stages.concat(stages_list_data.filter(item =>
                item?.['is_closed_lost']
            ))
        }
        if (is_delivery) {
            passed_stages = passed_stages.concat(stages_list_data.filter(item =>
                item?.['is_delivery']
            ))
        }
        if (is_deal_closed) {
            passed_stages = passed_stages.concat(stages_list_data.filter(item =>
                item?.['is_deal_closed']
            ))
        }

        passed_stages.forEach(function (item, index) {
            setTimeout(function () {
                let ele_stage = $(`.stage-child[data-id="${item?.['id']}"]`);
                if (ele_stage.hasClass('stage-close2')) {
                    $('.page-content input, .page-content select, .page-content .btn').not($('#input-close-deal')).prop('disabled', true);
                }
                if (ele_stage.hasClass('stage-lost2')) {
                    ele_stage.addClass('lost stage-selected2')
                } else if (ele_stage.hasClass('stage-delivery2')) {
                    ele_stage.addClass('completed stage-selected2')
                } else if (ele_stage.hasClass('stage-close2')) {
                    ele_stage.addClass('cancel stage-selected2')
                } else {
                    ele_stage.addClass('completed stage-selected2')
                }

                if (index === passed_stages.length - 1) {
                    $opp_stage_pipeline.find('.stage-selected2').last().removeClass('lost completed cancel').addClass('active');
                }
            }, index * 250);
        })
    }
    // render tables functions
    static LoadTableActivityLogs() {
        let $table = $('#table-timeline');
        let pk = $.fn.getPkDetail();
        $table.DataTable().clear().destroy()
        $table.DataTableDefault({
            rowIdx: true,
            scrollX: true,
            scrollY: '58vh',
            scrollCollapse: true,
            ajax: {
                url: $table.attr('data-url-logs_list'),
                type: 'GET',
                data: {'opportunity': pk},
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('activity_logs_list')) {
                        return resp.data['activity_logs_list'] ? resp.data['activity_logs_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columnDefs: [],
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return ``
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        let appMapTrans = {
                            'quotation.quotation': $transEle.attr('data-trans-quotation'),
                            'saleorder.saleorder': $transEle.attr('data-trans-sale-order'),
                            'cashoutflow.advancepayment': $transEle.attr('data-trans-advance'),
                            'cashoutflow.payment': $transEle.attr('data-trans-payment'),
                            'cashoutflow.returnadvance': $transEle.attr('data-trans-return'),
                            'task.opportunitytask': $transEle.attr('data-trans-task'),
                            'production.bom': $transEle.attr('data-trans-bom'),
                            'bidding.bidding': $transEle.attr('data-trans-bidding'),
                            'consulting.consulting': $transEle.attr('data-trans-consulting'),
                            'leaseorder.leaseorder': $transEle.attr('data-trans-lease-order'),
                            'contract.contractapproval': $transEle.attr('data-trans-contract'),
                            'serviceorder.serviceorder': $transEle.attr('data-trans-service-order'),
                            'servicequotation.servicequotation': $transEle.attr('data-trans-service-quotation'),
                        }
                        let typeMapActivity = {
                            1: $transEle.attr('data-trans-task'),
                            2: $transEle.attr('data-trans-call'),
                            3: $transEle.attr('data-trans-email'),
                            4: $transEle.attr('data-trans-meeting'),
                        }
                        if ([0, 1].includes(row?.['log_type'])) {
                            if (row?.['app_code']) {
                                return `<span class="text-muted">${appMapTrans[row?.['app_code']]}</span>`;
                            }
                        } else {
                            let status = '';
                            if (row?.['call_log']['is_cancelled'] || row?.['meeting']['is_cancelled']) {
                                status = `<span class="badge badge-sm badge-icon-xs badge-soft-danger">${$transEle.attr('data-trans-activity-cancelled')}</i>`
                            }
                            return `<span class="fst-italic text-muted">${typeMapActivity[row?.['log_type']]}</span> ${status}`;
                        }
                        return ``;
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        if ([0, 1].includes(row?.['log_type'])) {
                            if (row?.['app_code'] && row?.['doc_data']?.['code']) {
                                return `<span class="fw-bold text-primary">${row?.['doc_data']?.['code']}</span>`;
                            }
                        }
                        return ``;
                    }
                },
                {
                    className: 'w-25',
                    render: (data, type, row) => {
                        let urlMapApp = {
                            'quotation.quotation': $urlEle.attr('data-url-quotation-detail'),
                            'saleorder.saleorder': $urlEle.attr('data-url-sale-order-detail'),
                            'cashoutflow.advancepayment': $urlEle.attr('data-url-advance-detail'),
                            'cashoutflow.payment': $urlEle.attr('data-url-payment-detail'),
                            'cashoutflow.returnadvance': $urlEle.attr('data-url-return-detail'),
                            'production.bom': $urlEle.attr('data-url-bom-detail'),
                            'bidding.bidding': $urlEle.attr('data-url-bidding-detail'),
                            'consulting.consulting': $urlEle.attr('data-url-consulting-detail'),
                            'leaseorder.leaseorder': $urlEle.attr('data-url-lease-order-detail'),
                            'contract.contractapproval': $urlEle.attr('data-url-contract-detail'),
                            'serviceorder.serviceorder': $urlEle.attr('data-url-service-order-detail'),
                            'servicequotation.servicequotation': $transEle.attr('data-url-service-quotation'),
                        }
                        let link = '';
                        let title = '';
                        if ([0, 1].includes(row?.['log_type'])) {
                            if (row?.['app_code'] && row?.['doc_data']?.['id'] && row?.['doc_data']?.['title']) {
                                if (urlMapApp[row?.['app_code']]) {
                                    link = urlMapApp[row?.['app_code']].format_url_with_uuid(row?.['doc_data']?.['id']);
                                }
                                let result = `<a href="${link}" target="_blank" class="link-primary underline_hover"><p>${row?.['doc_data']?.['title']}</p></a>`;
                                if (row?.['log_type'] === 1) {
                                    result = `<a href="#" target="" class="link-primary underline_hover"><p class="show-task-detail">${row?.['doc_data']?.['title']}</p></a>`;
                                }
                                return result;
                            } else {
                                return ``;
                            }
                        }
                        if (row?.['log_type'] === 1) {
                            title = row?.['task']?.['subject'];
                            return `<a href="#" class="show-task-detail" data-task-id="${row?.['task']['id']}"><p>${title}</p></a>`;
                        } else if (row?.['log_type'] === 2) {
                            title = row?.['call_log']?.['subject'];
                            return `<a href="#" data-bs-toggle="modal" data-bs-target="#offcanvas-call-log-detail" class="offcanvas-call-log-button-detail text-primary" data-id="${row?.['call_log']['id']}"><p>${title}</p></a>`;
                        } else if (row?.['log_type'] === 3) {
                            title = row?.['email']?.['subject'];
                            return `<a href="#" data-bs-toggle="modal" data-bs-target="#detail-send-email" class="detail-email-button text-primary" data-id="${row?.['email']['id']}"><p>${title}</p></a>`;
                        } else if (row?.['log_type'] === 4) {
                            title = row?.['meeting']?.['subject'];
                            return `<a href="#" data-bs-toggle="modal" data-bs-target="#detail-meeting" class="offcanvas-meeting-button text-primary" data-id="${row?.['meeting']['id']}"><p>${title}</p></a>`;
                        }
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        if (row?.['app_code'] && [0, 1].includes(row?.['log_type'])) {
                            if (row?.['log_type'] === 0 && (row?.['doc_data']?.['system_status'] || row?.['doc_data']?.['system_status'] === 0)) {
                                return WFRTControl.displayRuntimeStatus(row?.['doc_data']?.['system_status']);
                            }
                            if (row?.['log_type'] === 1 && row?.['doc_data']?.['task_status']) {
                                return `<span class="badge badge-soft-secondary">${row?.['doc_data']?.['task_status']}</span>`;
                            }
                        }
                        return ``;
                    }
                },
                {
                    className: 'w-20 text-right',
                    render: (data, type, row) => {
                        return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                    }
                }
            ],
            rowCallback: (row, data, index) => {
                $('.show-task-detail', row).on('click', function () {
                    const taskObj = data?.["doc_data"];
                    OpportunityPageFunction.DisplayTaskView($urlEle.attr("data-task_detail").format_url_with_uuid(taskObj.id))
                })
            },
            initComplete: function () {
                let wrapper$ = $table.closest('.dataTables_wrapper');
                const headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
                const textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
                headerToolbar$.prepend(textFilter$);
                if (textFilter$.length > 0) {
                    textFilter$.css('display', 'flex');
                    textFilter$.append(`
                        <button type="button" id="btn-refresh-activity" class="btn btn-rounded btn-soft-success btn-xs" title="${$.fn.gettext('Refresh')}"><i class="bi bi-arrow-repeat"></i></button>
                    `)
                }
            }
        });
    };
    static LoadTableProduct(data_list=[]) {
        if (!$.fn.DataTable.isDataTable('#table-product')) {
            $table_product.DataTableDefault({
                styleDom: 'hide-foot',
                rowIdx: true,
                reloadCurrency: true,
                paging: false,
                scrollX: true,
                scrollY: '58vh',
                scrollCollapse: true,
                data: data_list,
                columns: [
                    {
                        className: 'w-5',
                        render: () => {
                            return '';
                        }
                    },
                    {
                        className: 'w-25',
                        render: (data, type, row) => {
                            if (row?.['product']) {
                                return `<select class="form-select select-box-product" required></select>`
                            } else {
                                return `<textarea class="form-control input-product-name" required></textarea>`
                            }
                        }
                    },
                    {
                        className: 'w-20',
                        render: () => {
                            return `<select class="form-select box-select-product-category" required></select>`
                        }
                    },
                    {
                        className: 'w-10',
                        render: (data, type, row) => {
                            return `<input type="number" class="form-control input-quantity" value="${row?.['product_quantity'] || 0}" required/>`
                        }
                    },
                    {
                        className: 'w-10',
                        render: () => {
                            return `<select class="form-select box-select-uom" required></select>`
                        }
                    },
                    {
                        className: 'w-10',
                        render: (data, type, row) => {
                            return `<input class="form-control mask-money input-unit-price" value="${row?.['product_unit_price'] || 0}" required/>`
                        }
                    },
                    {
                        className: 'w-10',
                        render: () => {
                            return `<select class="form-select box-select-tax" required></select>`
                        }
                    },
                    {
                        className: 'w-10',
                        render: (data, type, row) => {
                            return `<input class="form-control mask-money input-subtotal" value="${row?.['product_subtotal_price'] || 0}" readonly disabled required>`
                        }
                    },
                    {
                        className: 'w-5 text-right',
                        render: () => {
                            return `<a class="btn btn-icon btn-del-item"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`
                        }
                    },
                ],
                initComplete: function () {
                    $table_product.find('tbody tr').each(function (index, ele) {
                        if (data_list[index]?.['product']) {
                            UsualLoadPageFunction.LoadProduct({
                                element: $(ele).find('.select-box-product'),
                                data: data_list[index]?.['product'],
                                data_url: `${$urlEle.data('url-product')}?general_product_category_id__in=${$productCategorySelectEle.val().join(',')}`
                            })
                            $(ele).find(`.box-select-product-category`).prop('disabled', true)
                        }
                        else {
                            $(ele).find('.input-product-name').val(data_list[index]?.['product_name'] || '')
                        }
                        UsualLoadPageFunction.LoadProductCategory({
                            element: $(ele).find('.box-select-product-category'),
                            data: data_list[index]?.['product_category'],
                            data_url: `${$urlEle.data('url-product-category')}?id__in=${$productCategorySelectEle.val().join(',')}`,
                        })
                        UsualLoadPageFunction.LoadUOM({
                            element: $(ele).find('.box-select-uom'),
                            data: data_list[index]?.['uom'],
                            data_url: $urlEle.data('url-uom')
                        })
                        UsualLoadPageFunction.LoadTax({
                            element: $(ele).find('.box-select-tax'),
                            data: data_list[index]?.['tax'],
                            data_url: $urlEle.data('url-tax')
                        })
                    })
                }
            });
        }
    }
    static LoadTableCompetitor(data_list=[]) {
        if (!$.fn.DataTable.isDataTable('#table-competitors')) {
            $table_competitor.DataTableDefault({
                rowIdx: true,
                data: data_list,
                paging: false,
                scrollX: true,
                scrollY: '58vh',
                scrollCollapse: true,
                columns: [
                    {
                        className: 'w-5',
                        render: () => {
                            return ``
                        }
                    },
                    {
                        className: 'w-25',
                        render: () => {
                            return `<select class="form-control box-select-competitor" required></select>`
                        }
                    },
                    {
                        className: 'w-50',
                        render: (data, type, row) => {
                            return `<textarea class="form-control input-strength mb-1" rows="1">${row?.['strength'] || ''}</textarea>
                                <textarea class="form-control input-weakness" rows="1">${row?.['weakness'] || ''}</textarea>`
                        }
                    },
                    {
                        className: 'w-15 text-center',
                        render: (data, type, row) => {
                            return `<div class="form-check"><input ${row?.['win_deal'] ? 'checked' : ''} type="checkbox" class="form-check-input input-win-deal"></div>`
                        }
                    },
                    {
                        className: 'w-5 text-right',
                        render: () => {
                            return `<a class="btn btn-icon btn-del-item"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`
                        }
                    },
                ],
                initComplete: function () {
                    $table_competitor.find('tbody tr').each(function (index, ele) {
                        UsualLoadPageFunction.LoadAccount({
                            element: $(ele).find('.box-select-competitor'),
                            data: data_list[index]?.['competitor'],
                            data_params: {
                                'opp_customer': $customerSelectEle.val(),
                                'opp_end_customer': $endCustomerSelectEle.val()
                            },
                            data_url: $urlEle.data('url-competitor')
                        })
                    })
                }
            });
        }
    }
    static LoadTableContactRole(data_list=[]) {
        if (!$.fn.DataTable.isDataTable('#table-contact-role')) {
            $table_contact_role.DataTableDefault({
                rowIdx: true,
                data: data_list,
                paging: false,
                scrollX: true,
                scrollY: '58vh',
                scrollCollapse: true,
                columns: [
                    {
                        className: 'w-5',
                        render: () => {
                            return ``
                        }
                    },
                    {
                        className: 'w-25',
                        render: () => {
                            return `<select class="form-select box-select-type-customer" required></select>`
                        }
                    },
                    {
                        className: 'w-25',
                        render: () => {
                            return `<select class="form-select box-select-contact" required></select>`
                        }
                    },
                    {
                        className: 'w-20',
                        render: (data, type, row) => {
                            return `<input type="text" class="form-control input-job-title" value="${row?.['job_title'] || ''}" readonly/>`
                        }
                    },
                    {
                        className: 'w-20',
                        render: () => {
                            return `<select class="form-select box-select-role" required></select>`
                        }
                    },
                    {
                        className: 'w-5 text-right',
                        render: () => {
                            return `<a class="btn btn-icon btn-del-item">
                                        <span class="btn-icon-wrap">
                                            <span class="feather-icon"><i data-feather="trash-2"></i></span>
                                        </span>
                                    </a>`
                        }
                    }
                ],
                initComplete: function () {
                    $table_contact_role.find('tbody tr').each(function (index, ele) {
                        UsualLoadPageFunction.LoadContact({
                            element: $(ele).find('.box-select-contact'),
                            data: data_list[index]?.['contact'],
                            data_params: {'account_name_id': $customerSelectEle.val()},
                            data_url: $urlEle.data('url-contact')
                        })
                        OpportunityPageFunction.ParseOptionCustomerType($(ele).find('.box-select-type-customer'), data_list[index]?.['type_customer'])
                        OpportunityPageFunction.ParseOptionCustomerRole($(ele).find('.box-select-role'), data_list[index]?.['role'])
                    })
                }
            });
        }
    }
    static LoadSaleTeamList(data, isEdit = true, employee_inherit = {}) {
        let employee_inherit_id = employee_inherit?.['id'] || null;
        let html = `
            <div class="member-item col-md-12 col-lg-6 col-xl-4">
               <div
                  class="card bg-gradient-light" data-manual-hide="false" data-footer-show="always"
                  data-id="__idx__"
                  >
                  <div class="card-header card-header-action">
                     <div class="hidden-md">__avatar__</div>
                     <div class="ml-1 card-main-title">
                        <p class="fw-bold">__full_name__</p>
                        <p class="small text-muted">__group_title__</p>
                        <p class="small text-primary"><a href="mailto:__email__">__email__</a></p>
                    </div>
                     <div class="card-action-wrap __is_edit__">
                        <button
                           class="btn btn-xs btn-icon btn-rounded btn-flush-dark flush-soft-hover card-action-edit"
                           type="button"
                        >
                            <span class="icon">
                                <span class="feather-icon">
                                    <i data-feather="edit-2"></i>
                                </span>
                            </span>
                        </button>
                        <a class="btn btn-xs btn-icon btn-rounded btn-flush-dark flush-soft-hover card-action card-action-close __is_delete__">
                            <span class="icon">
                                <span class="feather-icon">
                                    <i data-feather="x"></i>
                                </span>
                            </span>
                        </a>
                     </div>
                  </div>
                  <script type="application/json" class="card-permit-data">__permit_data__</script>
               </div>
            </div>
        `;

        let memberItemListEle = $('#member-item-list');
        let memberEditEle = $('#member-current-edit');
        let dataMember = [];
        let boxEditPermitEle = $('#box-edit-permit');
        let eleViewOppMember = $('#enable-view-opp-member');
        let eleAddOppMember = $('#enable-add-opp-member');

        memberItemListEle.children().each(function () {
            if ($(this).find('#btn-show-modal-add-member').length <= 0) $(this).remove();
        });
        data.reverse().map(function (item) {
            let itemHTML = html.replaceAll(
                "__idx__",
                item?.['id']
            ).replaceAll(
                "__full_name__",
                item?.['full_name'],
            ).replaceAll(
                "__group_title__",
                item?.['group']?.['title'] || '',
            ).replaceAll(
                "__email__",
                item?.['email'] || '',
            ).replaceAll(
                "__avatar__",
                $x.fn.renderAvatar(item, 'avatar-soft-light avatar-rounded'),
            ).replaceAll(
                "__permit_data__",
                JSON.stringify(item?.['permit_app'] || [])
            ).replaceAll(
                "__is_edit__",
                isEdit ? "" : "hidden"
            ).replaceAll(
                '__is_delete__',
                !!(employee_inherit_id && item?.['id'] === employee_inherit_id) ? "hidden" : ""
            );
            memberItemListEle.prepend(itemHTML);
            dataMember.push(item)
        });
        memberEditEle.initSelect2({
            data: dataMember,
            keyText: 'full_name',
        }).on('change', function () {
            OpportunityPageFunction.clickEditMember($(this).val(), memberEditEle, boxEditPermitEle, eleViewOppMember, eleAddOppMember, false)
        })
        memberItemListEle.on('click', '.card-action-edit', function () {
            let eleCard = $(this).closest('.card');
            OpportunityPageFunction.clickEditMember(eleCard.data('id'), memberEditEle, boxEditPermitEle, eleViewOppMember, eleAddOppMember)
        });

        $('#btnSavePermitMember').on('click', function () {
            WindowControl.showLoading({'loadingTitleAction': 'UPDATE'})
            let bodyData = {
                'permit_view_this_opp': eleViewOppMember.prop('checked'),
                'permit_add_member': eleAddOppMember.prop('checked'),
                'permission_by_configured': new HandlePlanAppNew().combinesPermissions(),
            };
            let urlData = boxEditPermitEle.data('url').replaceAll('__pk_member__', boxEditPermitEle.data('id'));
            $.fn.callAjax2({
                url: urlData,
                method: 'PUT',
                data: bodyData,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && data.hasOwnProperty('member')) {
                        $.fn.notifyB({
                            'description': $.fn.transEle.attr('data-success'),
                        }, 'success')
                        OpportunityPageFunction.clickEditMember(boxEditPermitEle.data('id'), memberEditEle, boxEditPermitEle, eleViewOppMember, eleAddOppMember);
                        WindowControl.hideLoading()
                        Swal.fire({
                            html:
                            `<h6 class="text-primary">${$transEle.attr('data-trans-notify-update-permission')}</h6>`,
                            customClass: {
                                confirmButton: 'btn btn-sm btn-primary',
                                actions: '',
                            },
                            buttonsStyling: false,
                        })
                    } else {
                        $.fn.notifyB({
                            'description': $.fn.transEle.attr('data-fail'),
                        }, 'failure')
                        WindowControl.hideLoading()
                    }
                },
                (errs) => {
                    $.fn.notifyB({
                            'description': $.fn.transEle.attr('data-fail'),
                        }, 'failure')
                    WindowControl.hideLoading()
                }
            )
        });

        $('.member-item').find('.card').on('card.action.close.confirm', function () {
            let eleCard = $(this).closest('.card');
            $.fn.callAjax2({
                url: boxEditPermitEle.data('url').replaceAll('__pk_member__', eleCard.data('id')),
                method: 'DELETE',
                'sweetAlertOpts': {
                    'allowOutsideClick': true
                }
            }).then(
                (resp) => {
                    $.fn.switcherResp(resp);
                    $.fn.notifyB({
                        'description': $.fn.transEle.data('success'),
                    }, 'success');
                    $(this).trigger('card.action.close.purge');
                },
                (errs) => {
                    $.fn.notifyB({
                        'description': $.fn.transEle.data('fail') + ": " + $transEle.attr('data-msg-deny-delete-member-owner'),
                    }, 'failure');
                    $(this).trigger('card.action.close.show');
                }
            )
        })
    }
    static LoadTableLeadMapped() {
        if (!$.fn.DataTable.isDataTable('#lead-list-table')) {
            let dtb = $('#lead-list-table');
            dtb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '58vh',
                scrollCollapse: true,
                ajax: {
                    url: dtb.attr('data-url') + `?opp_id=${$.fn.getPkDetail()}`,
                    type: 'GET',
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('lead_list')) {
                            return resp.data['lead_list'] ? resp.data['lead_list'] : [];
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: [
                    {
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        'render': (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['lead'].id);
                            return `<a href="${link}"><span class="badge badge-soft-primary w-70">${row?.['lead'].code}</span></a> ${$x.fn.buttonLinkBlank(link)}`;
                        }
                    },
                    {
                        'render': (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['lead'].id);
                            return `<a href="${link}">${row?.['lead']?.['title']}</a>`;
                        }
                    },
                    {
                        'render': (data, type, row) => {
                            return `<span class="badge badge-sm badge-primary">${row?.['lead']?.['source']}</span>`;
                        }
                    },
                    {
                        'render': (data, type, row) => {
                            return `${row?.['lead']?.['contact_name']}`;
                        }
                    },
                    {
                        className: 'text-right',
                        'render': (data, type, row) => {
                            return `${moment(row?.['lead']?.['date_created'].split(' ')[0]).format('DD/MM/YYYY')}`;
                        }
                    },
                ],
            });
        }
    }
    // check permission apps related functions
    static CheckPermissionCreateAppRelated() {
        $.notify($.fn.gettext('Checking create permission of related apps...'), {
            type: 'info',
            animate: {
                enter: 'animated lightSpeedIn',
                exit: 'animated lightSpeedOut'
            },
            allow_dismiss: false,
            showProgressbar: true,
            delay: 1000
        });

        const quotation_check_perm = $.fn.callAjax2({
            url: $urlEle.attr('data-url-opp-list'),
            data: {
                'list_from_app': 'quotation.quotation.create', 'id': $.fn.getPkDetail()
            },
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list) && data?.['opportunity_list'].length === 1) {
                        return data?.['opportunity_list'][0];
                    }
                    return null
                }
            },
            (errs) => {
                console.log(errs);
            }
        )
        const sale_order_check_perm = $.fn.callAjax2({
            url: $urlEle.attr('data-url-opp-list'),
            data: {
                'list_from_app': 'saleorder.saleorder.create', 'id': $.fn.getPkDetail()
            },
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list) && data?.['opportunity_list'].length === 1) {
                        return data?.['opportunity_list'][0];
                    }
                    return null
                }
            },
            (errs) => {
                console.log(errs);
            }
        )
        const advance_check_perm = $.fn.callAjax2({
            url: $urlEle.attr('data-url-opp-list'),
            data: {
                'list_from_app': 'cashoutflow.advancepayment.create', 'id': $.fn.getPkDetail()
            },
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list) && data?.['opportunity_list'].length === 1) {
                        return data?.['opportunity_list'][0];
                    }
                    return null
                }
            },
            (errs) => {
                console.log(errs);
            }
        )
        const payment_check_perm = $.fn.callAjax2({
            url: $urlEle.attr('data-url-opp-list'),
            data: {
                'list_from_app': 'cashoutflow.payment.create', 'id': $.fn.getPkDetail()
            },
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list) && data?.['opportunity_list'].length === 1) {
                        return data?.['opportunity_list'][0];
                    }
                    return null
                }
            },
            (errs) => {
                console.log(errs);
            }
        )
        const bom_check_perm = $.fn.callAjax2({
            url: $urlEle.attr('data-url-opp-list'),
            data: {
                'list_from_app': 'production.bom.create', 'id': $.fn.getPkDetail()
            },
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list) && data?.['opportunity_list'].length === 1) {
                        return data?.['opportunity_list'][0];
                    }
                    return null
                }
            },
            (errs) => {
                console.log(errs);
            }
        )
        const biding_check_perm = $.fn.callAjax2({
            url: $urlEle.attr('data-url-opp-list'),
            data: {
                'list_from_app': 'bidding.bidding.create', 'id': $.fn.getPkDetail()
            },
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list) && data?.['opportunity_list'].length === 1) {
                        return data?.['opportunity_list'][0];
                    }
                    return null
                }
            },
            (errs) => {
                console.log(errs);
            }
        )
        const consulting_check_perm = $.fn.callAjax2({
            url: $urlEle.attr('data-url-opp-list'),
            data: {
                'list_from_app': 'consulting.consulting.create', 'id': $.fn.getPkDetail()
            },
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list) && data?.['opportunity_list'].length === 1) {
                        return data?.['opportunity_list'][0];
                    }
                    return null
                }
            },
            (errs) => {
                console.log(errs);
            }
        )
        const lease_order_check_perm = $.fn.callAjax2({
            url: $urlEle.attr('data-url-opp-list'),
            data: {
                'list_from_app': 'leaseorder.leaseorder.create', 'id': $.fn.getPkDetail()
            },
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list) && data?.['opportunity_list'].length === 1) {
                        return data?.['opportunity_list'][0];
                    }
                    return null
                }
            },
            (errs) => {
                console.log(errs);
            }
        )
        const service_order_check_perm = $.fn.callAjax2({
            url: $urlEle.attr('data-url-opp-list'),
            data: {
                'list_from_app': 'serviceorder.serviceorder.create', 'id': $.fn.getPkDetail()
            },
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list) && data?.['opportunity_list'].length === 1) {
                        return data?.['opportunity_list'][0];
                    }
                    return null
                }
            },
            (errs) => {
                console.log(errs);
            }
        )
        const service_quotation_check_perm = $.fn.callAjax2({
            url: $urlEle.attr('data-url-opp-list'),
            data: {
                'list_from_app': 'servicequotation.servicequotation.create', 'id': $.fn.getPkDetail()
            },
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list) && data?.['opportunity_list'].length === 1) {
                        return data?.['opportunity_list'][0];
                    }
                    return null
                }
            },
            (errs) => {
                console.log(errs);
            }
        )
        let create_return_sc = $('#create-return-advance-shortcut')
        create_return_sc.attr('href', create_return_sc.attr('data-url'))

        Promise.all([
            quotation_check_perm,
            sale_order_check_perm,
            advance_check_perm,
            payment_check_perm,
            bom_check_perm,
            biding_check_perm,
            consulting_check_perm,
            lease_order_check_perm,
            service_order_check_perm,
            service_quotation_check_perm
        ]).then(
            (results_perm_app) => {
                if (results_perm_app[0]) {
                    let create_quotation_sc = $('#create-quotation-shortcut')
                    create_quotation_sc.removeClass('disabled');
                    create_quotation_sc.removeAttr('href');
                }
                if (results_perm_app[1]) {
                    let create_so_sc = $('#create-sale-order-shortcut')
                    create_so_sc.removeClass('disabled');
                    create_so_sc.removeAttr('href');
                }
                if (results_perm_app[2]) {
                    let create_ap_sc = $('#create-advance-payment-shortcut')
                    create_ap_sc.removeClass('disabled');
                    let param_url = UsualLoadPageFunction.Push_param_to_url(create_ap_sc.attr('data-url'), {
                        'opp_id': results_perm_app[2]?.['id'],
                        'opp_code': results_perm_app[2]?.['code'],
                        'opp_title': results_perm_app[2]?.['title'],
                        'quotation_object': encodeURIComponent(JSON.stringify(results_perm_app[2]?.['quotation'])),
                        'sale_order_object': encodeURIComponent(JSON.stringify(results_perm_app[2]?.['sale_order'])),
                    })
                    create_ap_sc.attr('href', param_url)
                }
                if (results_perm_app[3]) {
                    let create_payment_sc = $('#create-payment-shortcut')
                    create_payment_sc.removeClass('disabled');
                    let param_url = UsualLoadPageFunction.Push_param_to_url(create_payment_sc.attr('data-url'), {
                        'opp_id': results_perm_app[3]?.['id'],
                        'opp_code': results_perm_app[3]?.['code'],
                        'opp_title': results_perm_app[3]?.['title'],
                        'quotation_object': encodeURIComponent(JSON.stringify(results_perm_app[3]?.['quotation'])),
                        'sale_order_object': encodeURIComponent(JSON.stringify(results_perm_app[3]?.['sale_order'])),
                    })
                    create_payment_sc.attr('href', param_url)
                }
                if (results_perm_app[4]) {
                    let create_bom_sc = $('#create-project-bom-shortcut')
                    create_bom_sc.removeClass('disabled');
                    let param_url = UsualLoadPageFunction.Push_param_to_url(create_bom_sc.attr('data-url'), {
                        'opp_id': results_perm_app[4]?.['id'],
                        'opp_code': results_perm_app[4]?.['code'],
                        'opp_title': results_perm_app[4]?.['title'],
                        'inherit_id': results_perm_app[4]?.['sale_person']?.['id'],
                        'inherit_title': results_perm_app[4]?.['sale_person']?.['full_name'],
                    })
                    create_bom_sc.attr('href', param_url)
                }
                if (results_perm_app[5]) {
                    let create_bidding_sc = $('#create-bidding-shortcut')
                    create_bidding_sc.removeClass('disabled');
                    let param_url = UsualLoadPageFunction.Push_param_to_url(create_bidding_sc.attr('data-url'), {
                        'opp_id': results_perm_app[5]?.['id'],
                        'opp_code': results_perm_app[5]?.['code'],
                        'opp_title': results_perm_app[5]?.['title'],
                        'inherit_id': results_perm_app[5]?.['sale_person']?.['id'],
                        'inherit_title': results_perm_app[5]?.['sale_person']?.['full_name'],
                        'customer': encodeURIComponent(JSON.stringify(results_perm_app[5]?.['customer'])),
                    })
                    create_bidding_sc.attr('href', param_url)
                }
                if (results_perm_app[6]) {
                    let create_consulting_sc = $('#create-consulting-shortcut')
                    create_consulting_sc.removeClass('disabled');
                    let param_url = UsualLoadPageFunction.Push_param_to_url(create_consulting_sc.attr('data-url'), {
                        'opp_id': results_perm_app[6]?.['id'],
                        'opp_code': results_perm_app[6]?.['code'],
                        'opp_title': results_perm_app[6]?.['title'],
                        'inherit_id': results_perm_app[6]?.['sale_person']?.['id'],
                        'inherit_title': results_perm_app[6]?.['sale_person']?.['full_name'],
                        'customer': encodeURIComponent(JSON.stringify(results_perm_app[6]?.['customer'])),
                    })
                    create_consulting_sc.attr('href', param_url)
                }
                if (results_perm_app[7]) {
                    let create_lo_sc = $('#create-lease-order-shortcut')
                    create_lo_sc.removeClass('disabled');
                    create_lo_sc.removeAttr('href');
                }
                if (results_perm_app[8]) {
                    let create_svo_sc = $('#create-service-order-shortcut')
                    create_svo_sc.removeClass('disabled');
                    let param_url = UsualLoadPageFunction.Push_param_to_url(create_svo_sc.attr('data-url'), {
                        'opp_id': results_perm_app[8]?.['id'],
                        'opp_code': results_perm_app[8]?.['code'],
                        'opp_title': results_perm_app[8]?.['title'],
                        'inherit_id': results_perm_app[8]?.['sale_person']?.['id'],
                        'inherit_title': results_perm_app[8]?.['sale_person']?.['full_name'],
                        'customer_id': results_perm_app[8]?.['customer']?.['id'],
                        'customer_code': results_perm_app[8]?.['customer']?.['code'],
                        'customer_title': results_perm_app[8]?.['customer']?.['name'],
                        'customer': encodeURIComponent(JSON.stringify(results_perm_app[8]?.['customer'])),
                    })
                    create_svo_sc.attr('href', param_url)
                }
                if (results_perm_app[9]) {
                    let create_svo_sc = $('#create-service-quotation-shortcut')
                    create_svo_sc.removeClass('disabled');
                    let param_url = UsualLoadPageFunction.Push_param_to_url(create_svo_sc.attr('data-url'), {
                        'opp_id': results_perm_app[8]?.['id'],
                        'opp_code': results_perm_app[8]?.['code'],
                        'opp_title': results_perm_app[8]?.['title'],
                        'inherit_id': results_perm_app[8]?.['sale_person']?.['id'],
                        'inherit_title': results_perm_app[8]?.['sale_person']?.['full_name'],
                        'customer_id': results_perm_app[8]?.['customer']?.['id'],
                        'customer_code': results_perm_app[8]?.['customer']?.['code'],
                        'customer_title': results_perm_app[8]?.['customer']?.['name'],
                        'customer': encodeURIComponent(JSON.stringify(results_perm_app[8]?.['customer'])),
                    })
                    create_svo_sc.attr('href', param_url)
                }
                $('#btn-create-related-feature').attr('data-call-check-perm', 'true')
            })
    }
    static CheckPermissionDetailOrdersAppRelated(ele) {
        // check permission before redirect
        if ($(ele).attr('data-label') && pageVariables.opp_detail_data) {
            let label = $(ele).attr('data-label');
            let appMapPerm = {
                'quotation.quotation': 'quotation.quotation.create',
                'saleorder.saleorder': 'saleorder.saleorder.create',
                'leaseorder.leaseorder': 'leaseorder.leaseorder.create',
            };
            let appMapErr = {
                'quotation.quotation': $transEle.attr('data-cancel-quo'),
                'saleorder.saleorder': $transEle.attr('data-cancel-so'),
                'leaseorder.leaseorder': $transEle.attr('data-cancel-lo'),
            }
            if (appMapPerm?.[label] && pageVariables.opp_detail_data?.['id']) {
                let tableData = $('#table-timeline').DataTable().rows().data().toArray();
                $.fn.callAjax2({
                    'url': $urlEle.attr('data-url-opp-list'),
                    'method': 'GET',
                    'data': {'list_from_app': appMapPerm[label], 'id': pageVariables.opp_detail_data?.['id']},
                    isLoading: true,
                }
                ).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list)) {
                                if (data.opportunity_list.length === 1) {
                                    // Validate: check opp already has quotation/ sale order
                                    let listCheck = ['quotation.quotation', 'saleorder.saleorder', 'leaseorder.leaseorder'];
                                    if (listCheck.includes(label)) {
                                        for (let tData of tableData) {
                                            let tDataLabel = tData?.['app_code'];
                                            let tDataStatus = tData?.['doc_data']?.['system_status'];
                                            if (label === 'quotation.quotation') {
                                                if (tDataLabel === 'saleorder.saleorder' && [1, 2, 3].includes(tDataStatus)) {
                                                    $.fn.notifyB({description: $transEle.attr('data-cancel-so')}, 'failure');
                                                    return false;
                                                }
                                            }
                                            if (label === 'saleorder.saleorder') {
                                                if (tDataLabel === label && [1, 2, 3].includes(tDataStatus)) {
                                                    $.fn.notifyB({description: appMapErr?.[label]}, 'failure');
                                                    return false;
                                                }
                                            }
                                            if (label === 'leaseorder.leaseorder') {
                                                if (tDataLabel === label && [1, 2, 3].includes(tDataStatus)) {
                                                    $.fn.notifyB({description: appMapErr?.[label]}, 'failure');
                                                    return false;
                                                }
                                            }
                                        }
                                    }
                                    const paramData = $.param({
                                        'opp_id': pageVariables.opp_detail_data?.['id'],
                                        'opp_title': pageVariables.opp_detail_data?.['title'],
                                        'opp_code': pageVariables.opp_detail_data?.['code'],
                                    });
                                    let url = $(ele).data('url') + '?' + paramData;
                                    window.open(url, '_blank');
                                    return true;
                                }
                                $.fn.notifyB({description: $transEle.attr('data-forbidden')}, 'failure');
                                return false;
                            }
                        }
                    }
                )
            }
        }
        return true;
    }
    // tab contact role functions
    static ParseOptionCustomerType(ele, value=null) {
        ele.append('<option value=""></option>')
        pageVariables.data_type_customer.map(function (item) {
            ele.append(`<option value="${item?.['value']}" ${value === item?.['value'] ? 'selected' : ''}>${item?.['name']}</option>`);
        })
    }
    static ParseOptionCustomerRole(ele, value=null) {
        ele.append('<option value=""></option>')
        pageVariables.data_role_customer.map(function (item) {
            ele.append(`<option value="${item?.['value']}" ${value === item?.['value'] ? 'selected' : ''}>${item?.['name']}</option>`);
        })
    }
    static LoadFactor(ele, data) {
        ele.initSelect2({
            data: data,
        })
    }
    // sub others
    static CalculateSumPrice() {
        let tax_value = 0;
        let total_pretax = 0;
        $table_product.find('tbody tr').each(function () {
            let tax_obj = SelectDDControl.get_data_from_idx($(this).find('.box-select-tax'), $(this).find('.box-select-tax').val())
            let tax_rate = parseFloat(tax_obj?.['rate'] || 0)
            let sub_total = parseFloat($(this).find('.input-subtotal').attr('value') || 0)
            let tax_price = sub_total * (tax_rate / 100)
            total_pretax += sub_total
            tax_value += tax_price
        })
        $input_product_pretax_amount.attr('value', total_pretax);
        $input_product_taxes.attr('value', tax_value);
        $input_product_total.attr('value', total_pretax + tax_value);
        $estimated_gross_profit_value.attr('value', parseFloat($input_product_total.attr('value')) * parseFloat($estimated_gross_profit_percent.val()) / 100)
        $.fn.initMaskMoney2();
    }
    static CommonDeleteTableRow(ele) {
        let table = ele.closest(`table`)
        UsualLoadPageFunction.DeleteTableRow(table, parseInt(ele.closest('tr').find('td:first-child').text()))
        if (table.attr('id') === 'table-product') {
                OpportunityPageFunction.CalculateSumPrice()
        }
        else if (table.attr('id') ===  'table-contact-role') {
            if (table.find('tbody .box-select-role option[value="0"]:selected').length === 0) {
                $input_decision_maker.val('');
                $input_decision_maker.attr('data-id', '')
            }
        }
    }
    static async LoadMemberForDtb() {
        await OpportunityPageFunction.LoadTableSaleTeamMember();
        let card_member = $('#card-member .card');
        let table = $('#dtbMember');
        await new Promise(resolve => setTimeout(resolve, 500));
        table.find('tbody tr').removeClass('selected');
        table.find('tbody tr .input-select-member:not(:disabled)').prop('checked', false);
        card_member.map(function () {
            table.find(`.input-select-member[data-id="${$(this).attr('data-member-id')}"]`).prop('checked', true);
            table.find(`.input-select-member[data-id="${$(this).attr('data-member-id')}"]`).closest('tr').addClass('selected');
        })
    }
    static clickEditMember(memberIdx, memberEditEle, boxEditPermitEle, eleViewOppMember, eleAddOppMember, change_member_selected = true) {
        boxEditPermitEle.removeClass('hidden');
        memberEditEle.val(memberIdx);
        if (change_member_selected === true) memberEditEle.trigger('change');
        boxEditPermitEle.attr('data-id', memberIdx);

        let urlTmp = boxEditPermitEle.data('url').replaceAll('__pk_member__', memberIdx);
        $.fn.callAjax2({
            url: urlTmp,
            type: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('member')) {
                    let memData = data['member'];
                    eleViewOppMember.prop('checked', memData.permit_view_this_opp);
                    eleAddOppMember.prop('checked', memData.permit_add_member);

                    HandlePlanAppNew.editEnabled = true;
                    HandlePlanAppNew.hasSpaceChoice = false;
                    HandlePlanAppNew.rangeAllowOfApp = ["1", "4"];
                    HandlePlanAppNew.manual_app_list_and_not_plan_app = true;

                    HandlePlanAppNew.setPlanApp([], true) // opp not using plan_app -> get from storage
                    HandlePlanAppNew.setPermissionByConfigured(memData.permission_by_configured || [])

                    let clsNew = new HandlePlanAppNew();
                    clsNew.renderPermissionSelected(
                        memberIdx, {
                            'get_from': 'opportunity',
                            'opportunity': $.fn.getPkDetail(),
                        })
                }
                return {};
            },
            (errs) => {
            }
        )
    }
    static OnChangeContactRole(ele) {
        if (ele.val() === '0') {
            if ($table_contact_role.find('.box-select-role').not(ele).find('option[value="0"]:selected').length === 1) {
                ele.val('');
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: $transEle.data('trans-role-decision-maker'),
                })
            } else {
                let ele_contact = ele.closest('tr').find('.box-select-contact');
                let contact_data = SelectDDControl.get_data_from_idx(ele_contact, ele_contact.val());
                $input_decision_maker.val(contact_data?.['fullname'])
                $input_decision_maker.attr('data-id', contact_data?.['id'])
            }
        }

        if ($('.box-select-role option[value="0"]:selected').length === 0) {
            $input_decision_maker.val('')
            $input_decision_maker.attr('data-id', '')
        }
    }
    static CommonShowAlert(text) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: text,
        })
    }
    // opp activity
    static LoadLogWork(dataList) {
        let $table = $('#table_log-work')
        if ($table.hasClass('datatable'))
            $table.DataTable().clear().rows.add(dataList).draw();
        else
            $table.DataTable({
                searching: false,
                ordering: false,
                paginate: false,
                info: false,
                data: dataList,
                columns: [
                    {
                        data: 'employee_created',
                        targets: 0,
                        width: "35%",
                        render: (data, type, row) => {
                            let avClass = 'avatar-rounded avatar-xs avatar-' + $x.fn.randomColor()
                            return $x.fn.renderAvatar(data, avClass);
                        }
                    },
                    {
                        data: 'start_date',
                        targets: 1,
                        width: "35%",
                        render: (data, type, row) => {
                            let date = moment(data, 'YYYY-MM-DDThh:mm:ss').format('DD/MM/YYYY')
                            if (data !== row.end_date) {
                                date += ' ~ '
                                date += moment(row.end_date, 'YYYY-MM-DDThh:mm:ss').format('DD/MM/YYYY')
                            }
                            return date;
                        }
                    },
                    {
                        data: 'time_spent',
                        targets: 2,
                        width: "20%",
                        render: (data, type, row) => {
                            return data;
                        }
                    },
                    {
                        data: 'id',
                        targets: 3,
                        width: "10%",
                        render: (data, type, row) => {
                            return ''
                        }
                    }
                ]
            })
    }
    static LoadSubtask(taskID) {
        if (!taskID) return false
        const $wrap = $('.wrap-subtask')
        const url = $urlEle.attr('data-task_list')
        $.fn.callAjax(url, 'GET', {parent_n: taskID})
            .then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    for (let [key, item] of data?.['task_list'].entries()) {
                        const template = $(`<div class="d-flex justify-content-start align-items-center subtask_item">
                                    <p>${item?.['title']}</p>
                                    <button class="btn btn-flush-primary btn-icon btn-rounded ml-auto flush-soft-hover" disabled>
                                        <span><i class="fa-regular fa-trash-can fa-sm"></i></span>
                                    </button>
                                 </div>`);
                        $wrap.append(template);
                    }
                }
            })
    }
    static DisplayTaskView(url) {
        if (url)
            $.fn.callAjax2({
                url: url,
                method: 'GET'
            })
                .then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        // enable side panel
                        $('#offCanvasRightTask').offcanvas('show');
                        resetFormTask()
                        $('.title-create').addClass('hidden')
                        $('.title-detail').removeClass('hidden')
                        $('#inputTextTitle').val(data.title)
                        $form_Opp_Task.find(`input[name="id"]`).remove()
                        $form_Opp_Task.append(`<input type="hidden" name="id" value="${data.id}">`)
                        $('#inputTextCode').val(data.code)
                        $('#rangeValue').text(data['percent_completed'])
                        $('#percent_completed').val(data['percent_completed'])
                        $('#selectStatus').attr('data-onload', JSON.stringify(data.task_status)).append(
                            `<option value="${data.task_status.id}" selected>${data.task_status.title}</option>`
                        ).trigger('change')
                        $('#inputTextStartDate').val(
                            moment(data.start_date, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY')
                        )
                        $('#inputTextEndDate').val(
                            moment(data.end_date, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY')
                        )
                        $('#inputTextEstimate').val(data.estimate)
                        $('#selectPriority').val(data.priority).trigger('change')
                        // render label
                        let htmlElm = $('.label-mark')
                        htmlElm.html('')
                        for (let item of data.label)
                            htmlElm.append($(`<span class="item-tag"><span>${item}</span></span>`))
                        $('#inputAssigner').val(data.employee_created.full_name)
                            .attr('value', data.employee_created.id)

                        const runComponent = (elm, data) => {
                            data.selected = true;
                            elm.attr('data-onload', JSON.stringify(data))
                                .html(`<option value="${data.id}" selected>${data.title}</option>`)
                                .trigger('change')
                        }
                        if (data?.process && data?.['process']?.['id']){
                            runComponent($('#process_id'), data.process)
                        }
                        else if (data?.opportunity && data?.opportunity?.id){
                            runComponent($('#opportunity_id'), data.opportunity)
                        }
                        if (data?.employee_inherit.hasOwnProperty("id")){
                            data.employee_inherit.title = data.employee_inherit.full_name
                            runComponent($('#employee_inherit_id'), data.employee_inherit)
                        }
                        window.editor.setData(data.remark)
                        window.checklist.setDataList = data.checklist
                        window.checklist.render()
                        if (data?.['task_log_work'].length) OpportunityPageFunction.LoadLogWork(data['task_log_work'])
                        if (data?.['sub_task_list']) OpportunityPageFunction.LoadSubtask(data.id)
                        if (data.attach) {
                            const fileDetail = data.attach[0]?.['files']
                            FileUtils.init($(`[name="attach"]`).siblings('button'), fileDetail);
                        }
                        const $btnSub = $('.create-subtask')
                        if (Object.keys(data.parent_n).length > 0) $btnSub.addClass('hidden')
                        else $btnSub.removeClass('hidden')
                    }
                })
    }
    // load config and load stage
    static async LoadTableSaleTeamMember() {
        if (!$.fn.DataTable.isDataTable('#dtbMember')) {
            let dtb = $('#dtbMember');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                rowIdx: true,
                reloadCurrency: true,
                paging: false,
                scrollX: true,
                scrollY: '50vh',
                ajax: {
                    url: frm.dataUrl + '?get_all=1',
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('employee_list')) {
                            return resp.data['employee_list'] ? resp.data['employee_list'] : [];
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: [
                    {
                        className: 'w-5',
                        render: (data, type, row) => {
                            return '';
                        }
                    },
                    {
                        className: 'w-5',
                        data: 'is_checked_new',
                        render: (data, type, row) => {
                            if ($('.member-item .card[data-id="' + row.id + '"]').length > 0) {
                                return `<div class="form-check"><input data-id="${row.id}" type="checkbox" class="form-check-input input-select-member" checked readonly disabled /></span>`
                            }
                            return `<div class="form-check"><input data-id="${row.id}" type="checkbox" class="form-check-input input-select-member" ${data === true ? "checked" : ""}/></span>`
                        }
                    },
                    {
                        className: 'w-50',
                        render: (data, type, row) => {
                            return `<span class="badge badge-soft-primary mr-1">${row?.['code']}</span><span>${row?.['full_name']}</span>`
                        }
                    },
                    {
                        className: 'text-right w-40',
                        data: 'group',
                        render: (data) => {
                            return `<span>${data.title || ''}</span>`
                        }
                    },
                ],
                rowCallback: function (row, data) {
                    $(row).find('.input-select-member').on('change', function (){
                        let is_checked = $(this).prop('checked');
                        $x.fn.updateDataRow(this, function (clsThat, rowIdx, rowData) {
                            rowData['is_checked_new'] = is_checked
                            return {
                                ...rowData,
                                is_checked_new: is_checked,
                                idx: rowIdx + 1,
                            }
                        }, true);
                    })
                },
            });
        }
    }
    static SortOppStageByWinrate(list_stage) {
        let object_lost = null;
        let delivery = null;
        let object_close = null;
        let list_result = []

        for (let i = 0; i < list_stage.length; i++) {
            if (list_stage[i]?.['is_closed_lost']) {
                object_lost = list_stage[i];
            } else if (list_stage[i]?.['is_delivery']) {
                delivery = list_stage[i];
            } else if (list_stage[i]?.['is_deal_closed']) {
                object_close = list_stage[i];
            } else {
                list_result.push(list_stage[i]);
            }
        }

        list_result.sort(function (a, b) {
            return a.win_rate - b.win_rate;
        });
        list_result.push(object_lost);
        if (delivery) {
            list_result.push(delivery);
        }
        list_result.push(object_close);

        return list_result
    }
}

/**
 * Khai báo các hàm chính
 */
class OpportunityHandler {
    static GetDataForm() {
        let data_form= {}
        data_form['title'] = $opp_title.val()
        data_form['sale_person'] = $salePersonSelectEle.val() || null
        data_form['win_rate'] = parseFloat($inputRateEle.val() || 0)
        data_form['is_input_rate'] = $checkInputRateEle.prop('checked')
        data_form['customer'] = $customerSelectEle.val() || null
        data_form['end_customer'] = $endCustomerSelectEle.val() || null
        data_form['budget_value'] = parseFloat($input_budget.attr('value') || 0)
        data_form['decision_maker'] = $input_decision_maker.attr('data-id') || null

        data_form['open_date'] = moment($input_open_date.val(), "DD/MM/YYYY").format('YYYY-MM-DD')
        data_form['close_date'] = moment($input_close_date.val(), "DD/MM/YYYY").format('YYYY-MM-DD')

        data_form['product_category'] = $productCategorySelectEle.val() || null
        data_form['customer_decision_factor'] = $box_select_factor.val() || null

        // tab product
        let list_product_data = []
        if ($table_product.DataTable().data().length > 0) {
            $table_product.find('tbody tr').each(function () {
                let ele_product = $(this).find('.select-box-product');
                let product_id = ele_product.val();
                let product_name = ele_product.find('option:selected').text();
                if (ele_product.length === 0) {
                    product_id = null;
                    product_name = $(this).find('.input-product-name').val();
                }
                let data = {
                    'product': product_id,
                    'product_category': $(this).find('.box-select-product-category').val(),
                    'tax': $(this).find('.box-select-tax').val(),
                    'uom': $(this).find('.box-select-uom').val(),
                    'product_name': product_name,
                    'product_quantity': $(this).find('.input-quantity').val(),
                    'product_unit_price': $(this).find('.input-unit-price').attr('value'),
                    'product_subtotal_price': $(this).find('.input-subtotal').attr('value'),
                }
                if (!$(this).find('.box-select-tax').val()) {
                    delete data['tax']
                }
                list_product_data.push(data);
            })
        }
        data_form['opportunity_product_datas'] = list_product_data
        data_form['total_product'] = $input_product_total.valCurrency();
        data_form['total_product_pretax_amount'] = $input_product_pretax_amount.valCurrency();
        data_form['total_product_tax'] = $input_product_taxes.valCurrency();
        data_form['estimated_gross_profit_percent'] = $estimated_gross_profit_percent.val();
        data_form['estimated_gross_profit_value'] = $estimated_gross_profit_value.valCurrency();

        // tab competitor
        let list_competitor_data = []
        if ($table_competitor.DataTable().data().length > 0) {
            $table_competitor.find('tbody tr').each(function () {
                let win_deal = false;
                if ($(this).find('.input-win-deal').is(':checked')) {
                    win_deal = true;
                    data_form['is_close_lost'] = true;
                }
                let data = {
                    'competitor': $(this).find('.box-select-competitor').val(),
                    'strength': $(this).find('.input-strength').val(),
                    'weakness': $(this).find('.input-weakness').val(),
                    'win_deal': win_deal,
                }
                list_competitor_data.push(data);
            })
        }
        data_form['opportunity_competitors_datas'] = list_competitor_data

        // tab contact role
        let list_contact_role_data = []
        if ($table_contact_role.DataTable().data().length > 0) {
            $table_contact_role.find('tbody tr').each(function () {
                let data = {
                    'type_customer': $(this).find('.box-select-type-customer').val(),
                    'contact': $(this).find('.box-select-contact').val(),
                    'job_title': $(this).find('.input-job-title').val(),
                    'role': $(this).find('.box-select-role').val(),
                }
                list_contact_role_data.push(data);
            })
        }
        data_form['opportunity_contact_role_datas'] = list_contact_role_data

        // tab member
        let list_member = []
        $('#card-member .card').each(function () {
            list_member.push({'member': $(this).data('id')});
        })
        data_form['opportunity_sale_team_datas'] = list_member

        // stage
        let list_stage = []
        let ele_stage = $('.stage-selected2')
        ele_stage.not(':last').each(function () {
            list_stage.push({
                'stage': $(this).data('id'),
                'is_current': false,
            })
        })
        list_stage.push({
            'stage': ele_stage.last().data('id'),
            'is_current': true,
        })
        data_form['list_stage'] = list_stage

        data_form['is_deal_closed'] = $('#input-close-deal').prop('checked')

        data_form['lost_by_other_reason'] = $check_lost_reason.prop('checked')

        data_form['is_close_lost'] = $check_lost_reason.prop('checked')

        return data_form
    }
    static LoadDetailOppSub(option) {
        $.fn.compareStatusShowPageAction(pageVariables.opp_detail_data)
        $x.fn.renderCodeBreadcrumb(pageVariables.opp_detail_data)

        // 1. LOAD TITLE
        $opp_title.val(pageVariables.opp_detail_data?.['title'])
        // 2. LOAD PROCESS
        $('#btn-collapse-process-show').prop('hidden', pageVariables.opp_detail_data?.['process']?.['id'] === undefined)
        // 3. LOAD STAGE PIPELINE
        OpportunityPageFunction.ParseHTMLOppStage()
        if (pageVariables.opp_config_data?.['is_select_stage']) {
            $('#btn-auto-update-stage').hide();
        }
        // 4. LOAD GENERAL INFO
        // a. Load action button url
        let common_opp_params = {
            'opp_id': pageVariables.opp_detail_data?.['id'],
            'opp_title': pageVariables.opp_detail_data?.['title'],
            'opp_code': pageVariables.opp_detail_data?.['code'],
            'inherit_id': pageVariables.opp_detail_data?.['sale_person']?.['id'],
            'inherit_title': pageVariables.opp_detail_data?.['sale_person']?.['full_name'],
        }
        $goto_call_log.attr('href', UsualLoadPageFunction.Push_param_to_url($goto_call_log.attr('data-url'), common_opp_params))
        $goto_email.attr('href', UsualLoadPageFunction.Push_param_to_url($goto_email.attr('data-url'), common_opp_params))
        $goto_meeting.attr('href', UsualLoadPageFunction.Push_param_to_url($goto_meeting.attr('data-url'), common_opp_params))
        Task_in_opps.init(pageVariables.opp_detail_data)
        $('#startDateLogTime, #endDateLogTime').each(function() {
            $(this).daterangepicker({
                singleDatePicker: true,
                timepicker: false,
                showDropdowns: false,
                minYear: 2023,
                autoApply: true,
                locale: {
                    format: 'DD/MM/YYYY'
                },
                maxYear: parseInt(moment().format('YYYY'), 10),
            }).val("").trigger('change');
        })
        // b. Load winrate
        $rangeInputEle.val(pageVariables.opp_detail_data?.['win_rate'])
        $inputRateEle.val(pageVariables.opp_detail_data?.['win_rate'])
        $checkInputRateEle.prop('disabled', !pageVariables.opp_detail_data?.['is_input_rate']).prop('checked', pageVariables.opp_detail_data?.['is_input_rate']);
        if (pageVariables.opp_config_data?.['is_input_win_rate']) {
            // Nếu cấu hình cho check: mở ô check + check hay không tùy theo data
            $checkInputRateEle.prop('disabled', false).prop('checked', pageVariables.opp_detail_data?.['is_input_rate']);
            // Mở ô nhập nếu có check
            $inputRateEle.prop('readonly', !pageVariables.opp_detail_data?.['is_input_rate']);
        }
        else {
            // Nếu OPP có check
            if (pageVariables.opp_detail_data?.['is_input_rate']) {
                // Nếu data có check thì thông báo
                Swal.fire({
                    html:
                    `<h4 class="text-danger">${$.fn.gettext("The configuration that allows manually entering the win rate has been disabled. The current win rate will now be updated according to the current stage of this Opportunity.")}</h4>`,
                    customClass: {
                        confirmButton: 'btn text-primary',
                        container: 'custom-swal',
                        htmlContainer: 'text-start',
                        actions:'w-100'
                    },
                    allowOutsideClick: false, // không cho đóng khi click ra ngoài
                    allowEscapeKey: false,
                    showCancelButton: false,
                    buttonsStyling: false,
                    confirmButtonText: $.fn.gettext('Confirm'),
                    reverseButtons: true
                }).then((result) => {
                    if (result.value) {
                        // Sau đó disabled ô tự nhập và gán lại winrate theo stage hiện tại
                        $checkInputRateEle.prop('disabled', true).prop('checked', false);
                        $inputRateEle.prop('readonly', true).val(pageVariables.opp_detail_data?.['current_stage_data']?.['win_rate']);
                        $rangeInputEle.val(pageVariables.opp_detail_data?.['current_stage_data']?.['win_rate'])
                    }
                })
            }
        }
        // c. Load customer
        UsualLoadPageFunction.LoadCustomer({
            element: $customerSelectEle,
            data: pageVariables.opp_detail_data?.['customer'],
            data_params: {
                'employee__id': pageVariables.opp_detail_data?.['sale_person']?.['id'],
            },
            data_url: $urlEle.data('url-customer-list')
        })
        // d. Load end customer
        $check_agency_role.prop('checked', Object.keys(pageVariables.opp_detail_data?.['end_customer']).length !== 0)
        UsualLoadPageFunction.LoadCustomer({
            element: $endCustomerSelectEle,
            data: pageVariables.opp_detail_data?.['end_customer'],
            data_params: {
                'employee__id': pageVariables.opp_detail_data?.['sale_person']?.['id'],
            },
            data_url: $urlEle.data('url-customer-list')
        })
        // e. Load product category
        UsualLoadPageFunction.LoadProductCategory({
            element: $productCategorySelectEle,
            data: pageVariables.opp_detail_data?.['product_category'],
            data_url: $urlEle.data('url')
        })
        // f. Load sale person
        UsualLoadPageFunction.LoadEmployee({
            element: $salePersonSelectEle,
            data: pageVariables.opp_detail_data?.['sale_person'],
            data_url: $urlEle.data('url-employee-list')
        })
        // g. Load budget
        $input_budget.attr('value', pageVariables.opp_detail_data?.['budget_value'])
        // h. Load open/close date
        $input_open_date.val(pageVariables.opp_detail_data?.['open_date'] ? moment(pageVariables.opp_detail_data?.['open_date'].split(' ')[0], 'YYYY-MM-DD').format("DD/MM/YYYY") : '')
        $input_close_date.val(pageVariables.opp_detail_data?.['close_date'] ? moment(pageVariables.opp_detail_data?.['close_date'].split(' ')[0], 'YYYY-MM-DD').format("DD/MM/YYYY") : '')
        // i. Load decision maker
        $input_decision_maker.val(pageVariables.opp_detail_data?.['decision_maker']?.['name'] || '');
        $input_decision_maker.attr('data-id', pageVariables.opp_detail_data?.['decision_maker']?.['id'] || '')
        // k. Load lost by other reason
        $check_lost_reason.prop('checked', pageVariables.opp_detail_data?.['lost_by_other_reason'])
        // 5. LOAD SALE ACTIVITIES
        // a. Load button group related activities
        OpportunityPageFunction.CheckPermissionCreateAppRelated()
        if ($.fn.hasOwnProperties(pageVariables.opp_detail_data, ['sale_order'])) {
            let so_id = pageVariables.opp_detail_data?.['sale_order']?.['id'];
            let link = so_id !== undefined ? $urlEle.data('url-related-sale-order').format_url_with_uuid(so_id) : '#';
            $('#item-related-sale-order').attr('href', link)
        }
        if ($.fn.hasOwnProperties(pageVariables.opp_detail_data, ['quotation'])) {
            let quotation_id = pageVariables.opp_detail_data?.['quotation']?.['id'];
            let link = quotation_id !== undefined ? $urlEle.data('url-related-quotation').format_url_with_uuid(quotation_id) : '#';
            $('#item-related-quotation').attr('href', link)
        }
        // b. Load table activity logs
        OpportunityPageFunction.LoadTableActivityLogs()
        // 6. LOAD DETAIL TABS
        // a. Load tab product
        OpportunityPageFunction.LoadTableProduct(pageVariables.opp_detail_data?.['opportunity_product_datas'] || [])
        $input_product_pretax_amount.attr('value', pageVariables.opp_detail_data?.['total_product_pretax_amount'])
        $input_product_taxes.attr('value', pageVariables.opp_detail_data?.['total_product_tax'])
        $input_product_total.attr('value', pageVariables.opp_detail_data?.['total_product'])
        $estimated_gross_profit_percent.val(pageVariables.opp_detail_data?.['estimated_gross_profit_percent'])
        $estimated_gross_profit_value.attr('value', pageVariables.opp_detail_data?.['estimated_gross_profit_value'])
        // b. Load tab competitor
        OpportunityPageFunction.LoadTableCompetitor(pageVariables.opp_detail_data?.['opportunity_competitors_datas'] || [])
        // c. Load tab contact role
        OpportunityPageFunction.LoadTableContactRole(pageVariables.opp_detail_data?.['opportunity_contact_role_datas'] || [])
        OpportunityPageFunction.LoadFactor($box_select_factor, pageVariables.opp_detail_data?.['customer_decision_factor'])
        // d. Load tab sale team
        OpportunityPageFunction.LoadSaleTeamList(
            pageVariables.opp_detail_data?.['members'] || [],
            true,
            pageVariables.opp_detail_data?.['sale_person'] || {}
        );
        // e. Load tab lead
        OpportunityPageFunction.LoadTableLeadMapped()

        $.fn.initMaskMoney2();

        UsualLoadPageFunction.DisablePage(option==='detail', [
            '#btn-create-related-feature',
            '#btn-refresh-activity',
        ])
    }
    static LoadDetailOpportunity(option) {
        $.notify($.fn.gettext('Loading opportunity detail, opportunity config and opportunity stage...'), {
            type: 'info',
            animate: {
                enter: 'animated lightSpeedIn',
                exit: 'animated lightSpeedOut'
            },
            allow_dismiss: false,
            showProgressbar: true,
            delay: 1000
        });

        const pk = $.fn.getPkDetail();

        let ajax_opp_detail = $.fn.callAjax2({
            url: $('#frm-detail').data('url'),
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data?.['opportunity']) {
                    return data?.['opportunity'];
                }
                return {};
            },
            (errs) => {}
        );

        let ajax_opp_config = $.fn.callAjax2({
            url: $urlEle.data('url-config'),
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data?.['opportunity_config']) {
                    return data?.['opportunity_config'];
                }
                return {};
            },
            (errs) => {}
        );

        let ajax_opp_config_stage = $.fn.callAjax2({
            url: $opp_stage_pipeline.attr('data-url'),
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data?.['opportunity_config_stage']) {
                    return data?.['opportunity_config_stage'];
                }
                return [];
            },
            (errs) => {}
        );

        Promise.all([ajax_opp_detail, ajax_opp_config, ajax_opp_config_stage]).then(([opp_detail_data, opp_config_data, opp_stage_data]) => {
            if (opp_detail_data) {
                $('.page-content').prop('hidden', false);

                pageVariables.opp_detail_data = opp_detail_data;
                pageVariables.opp_config_data = opp_config_data;
                pageVariables.opp_stage_data = opp_stage_data;

                OpportunityHandler.LoadDetailOppSub(option)

                SetupFormSubmit.validate($('#frm-add-member'), {
                    submitHandler: function (form) {
                        let frm = new SetupFormSubmit($(form));
                        $.fn.callAjax2({
                            sweetAlertOpts: {'allowOutsideClick': true},
                            url: frm.dataUrl.replaceAll('__pk_opp__', pk),
                            method: frm.dataMethod,
                            data: {
                                'members': $('#dtbMember').DataTable().data().filter((item) => item?.['is_checked_new'] === true).map((item) => item?.['id']).toArray(),
                            },
                        }).then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data) {
                                    $.fn.notifyB({description: $('#base-trans-factory').data('success')}, 'success')
                                    setTimeout(
                                        () => {
                                            window.location.reload();
                                        },
                                        1000
                                    )
                                }
                                $x.fn.hideLoadingPage();
                            },
                            (errs) => {
                                $.fn.switcherResp(errs);
                                $x.fn.hideLoadingPage();
                            }
                        )
                    }
                })
            }
        })
    }
}

/**
 * Khai báo các Event
 */
class OpportunityEventHandler {
    static InitPageEven() {
        // process
        $('#btn-collapse-process-show').on('click', function () {
            if ($(this).attr('data-loaded') !== '1' && pageVariables.opp_detail_data) {
                $(this).attr('data-loaded', '1');
                $.fn.callAjax2({
                    url: $process_runtime_detail.data('url').replaceAll('__pk__', pageVariables.opp_detail_data?.['process']?.['id']),
                    method: 'GET',
                    isLoading: true,
                }).then(resp => {
                    const detailData = $.fn.switcherResp(resp);
                    if (detailData) {
                        const processDetail = detailData?.['process_runtime_detail'] || {};
                        const clsProcess = new ProcessStages($process_runtime_detail, processDetail, {
                            'debug': true,
                            'enableAppInfoShow': true,
                            'enableAppControl': true,
                            'enableStagesInfoShow': true,
                            'showCopyConfigData': false,
                        },);
                        clsProcess.init();
                    }
                });
            }
            $(this).toggleClass('collapsed-active');
            $process_runtime_detail.slideToggle('slow');
        });
        // even in timeline table
        $(document).on('click', '#btn-refresh-activity', function () {
            OpportunityPageFunction.LoadTableActivityLogs();
        });
        // even in tab product
        $('#btn-add-select-product').on('click', function () {
            UsualLoadPageFunction.AddTableRow($table_product, {'product': {}})
            let row_added = $table_product.find('tbody tr:last-child')
            row_added.find(`.box-select-product-category`).prop('disabled', true)
            UsualLoadPageFunction.LoadProduct({
                element: row_added.find('.select-box-product'),
                data_url: `${$urlEle.data('url-product')}?general_product_category_id__in=${$productCategorySelectEle.val().join(',')}`
            });
            UsualLoadPageFunction.LoadTax({
                element: row_added.find('.box-select-tax'),
                data_url: $urlEle.data('url-tax')
            })
        })
        $('#btn-add-input-product').on('click', function () {
            UsualLoadPageFunction.AddTableRow($table_product, {'product': null})
            let row_added = $table_product.find('tbody tr:last-child')
            UsualLoadPageFunction.LoadProductCategory({
                element: row_added.find('.box-select-product-category'),
                data_url: `${$urlEle.data('url-product-category')}?id__in=${$productCategorySelectEle.val().join(',')}`,
            });
            UsualLoadPageFunction.LoadUOM({
                element: row_added.find('.box-select-uom'),
                data_url: $urlEle.data('url-uom')
            })
            UsualLoadPageFunction.LoadTax({
                element: row_added.find('.box-select-tax'),
                data_url: $urlEle.data('url-tax')
            })
        })
        $(document).on('change', '.select-box-product', function () {
            let ele_tr = $(this).closest('tr')
            ele_tr.find(`.box-select-product-category`).empty()
            ele_tr.find(`.box-select-uom`).empty()
            ele_tr.find(`.box-select-tax`).empty()

            let product = SelectDDControl.get_data_from_idx($(this), $(this).val());
            UsualLoadPageFunction.LoadProductCategory({
                element: ele_tr.find(`.box-select-product-category`),
                data: product?.['general_information']?.['product_category'],
                data_url: `${$urlEle.data('url-product-category')}?id__in=${$productCategorySelectEle.val().join(',')}`,
            })
            UsualLoadPageFunction.LoadUOM({
                element: ele_tr.find(`.box-select-uom`),
                data: product?.['sale_information']?.['default_uom'],
                data_params: {'group_id': product?.['general_information']?.['uom_group']?.['id']},
                data_url: $urlEle.data('url-uom'),
            })
            UsualLoadPageFunction.LoadTax({
                element: ele_tr.find(`.box-select-tax`),
                data: product?.['sale_information']?.['tax_code'],
                data_url: $urlEle.data('url-tax')
            })
        })
        $(document).on('change', '.input-unit-price', function () {
            let price = $(this).valCurrency();
            let ele_parent = $(this).closest('tr');
            let quantity = ele_parent.find('.input-quantity').val();
            let subtotal = price * quantity;
            ele_parent.find('.input-subtotal').attr('value', subtotal);
            OpportunityPageFunction.CalculateSumPrice();
        })
        $(document).on('change', '.input-quantity', function () {
            let quantity = $(this).val();
            if (quantity < 0) {
                $.fn.notifyB({description: $transEle.data('trans-limit-quantity')}, 'failure');
                $(this).val(0);
                quantity = 0;
            }
            let ele_parent = $(this).closest('tr');
            let price = ele_parent.find('.input-unit-price').valCurrency();
            let subtotal = price * quantity;
            ele_parent.find('.input-subtotal').attr('value', subtotal);
            OpportunityPageFunction.CalculateSumPrice();
        })
        $(document).on('change', '.box-select-tax', function () {
            let ele_parent = $(this).closest('tr');
            let quantity = ele_parent.find('.input-quantity').val();
            let price = ele_parent.find('.input-unit-price').valCurrency();
            let subtotal = price * quantity;
            ele_parent.find('.input-subtotal').attr('value', subtotal);

            OpportunityPageFunction.CalculateSumPrice();
        })
        $estimated_gross_profit_percent.on('change', function () {
            if ($(this).val()) {
                let percent = parseFloat($(this).val() || 0)
                let value = parseFloat($input_product_pretax_amount.attr('value')) * percent / 100
                $estimated_gross_profit_value.attr('value', value)
            }
            else {
                $(this).val(0)
                $estimated_gross_profit_value.attr('value', 0)
            }
            $.fn.initMaskMoney2()
        })
        // event in tab competitor
        $('#btn-add-competitor').on('click', function () {
            UsualLoadPageFunction.AddTableRow($table_competitor)
            let row_added = $table_competitor.find('tbody tr:last-child')
            UsualLoadPageFunction.LoadAccount({
                element: row_added.find('.box-select-competitor'),
                data_params: {
                    'opp_customer': $customerSelectEle.val(),
                    'opp_end_customer': $endCustomerSelectEle.val()
                },
                data_url: $urlEle.data('url-competitor')
            })
        })
        // event in tab contact role
        $('#btn-add-contact').on('click', function () {
            UsualLoadPageFunction.AddTableRow($table_contact_role)
            let row_added = $table_contact_role.find('tbody tr:last-child')
            UsualLoadPageFunction.LoadContact({
                element: row_added.find('.box-select-contact'),
                data_params: {'account_name_id': $customerSelectEle.val()},
                data_url: $urlEle.data('url-contact')
            })
            OpportunityPageFunction.ParseOptionCustomerType(row_added.find('.box-select-type-customer'))
            OpportunityPageFunction.ParseOptionCustomerRole(row_added.find('.box-select-role'))
        })
        $(document).on('change', '#select-box-end-customer', function () {
            $table_contact_role.find('.box-select-type-customer option[value="1"]:selected').closest('tr').each(function () {
                $table_contact_role.DataTable().row($(this).index()).remove().draw();
            });
        })
        $(document).on('change', '#select-box-customer', function () {
            $table_contact_role.find('.box-select-type-customer option[value="0"]:selected').closest('tr').each(function () {
                $table_contact_role.DataTable().row($(this).index()).remove().draw();
            });
        })
        $(document).on('change', '.box-select-type-customer', function () {
            let box_select_contact = $(this).closest('tr').find('.box-select-contact')
            if ($(this).val() === '0') {
                UsualLoadPageFunction.LoadContact({
                    element: box_select_contact,
                    data_params: {'account_name_id': $customerSelectEle.val()},
                    data_url: $urlEle.data('url-contact')
                })
            } else {
                UsualLoadPageFunction.LoadContact({
                    element: box_select_contact,
                    data_params: {'account_name_id': $endCustomerSelectEle.val()},
                    data_url: $urlEle.data('url-contact')
                })
            }
            $(this).closest('tr').find('.input-job-title').val('')
        })
        $(document).on('change', '.box-select-contact', function () {
            let contact_data = SelectDDControl.get_data_from_idx($(this), $(this).val());
            $(this).closest('tr').find('.input-job-title').val(contact_data.job_title);
            OpportunityPageFunction.OnChangeContactRole($(this));
        })
        $(document).on('change', '.box-select-role', function () {
            OpportunityPageFunction.OnChangeContactRole($(this));
        })
        // event general
        $check_agency_role.on('change', function () {
            if ($(this).is(':checked')) {
                $endCustomerSelectEle.prop('disabled', false);
                $table_contact_role.find('.box-select-type-customer option[value="1"]').prop('disabled', false);
            } else {
                $endCustomerSelectEle.val(null).trigger('change');
                $endCustomerSelectEle.prop('disabled', true);
                $table_contact_role.find('.box-select-type-customer option[value="1"]:selected').closest('tr').remove();
                $table_contact_role.find('.box-select-type-customer option[value="1"]').prop('disabled', true);

            }
        })
        $checkInputRateEle.on('change', function () {
            if ($(this).is(':checked')) {
                $inputRateEle.prop('readonly', false);
            } else {
                $inputRateEle.prop('readonly', true);
            }
        })
        $inputRateEle.on('change', function () {
            let value = parseFloat($(this).val() || 0)
            if (value < 0 || value >= 100) {
                $.fn.notifyB({description: $.fn.gettext('Invalid value')}, 'failure')
                $(this).val(0)
            } else {
                $rangeInputEle.val($(this).val())
            }
        })
        $(document).on('click', '.btn-del-item', function () {
            OpportunityPageFunction.CommonDeleteTableRow($(this));
        })
        $(document).on('click', '.btn-add-document', function () {
            if (pageVariables.opp_detail_data) {
                let url = $(this).data('url') + "?opportunity={0}".format_by_idx(encodeURIComponent(JSON.stringify({
                    'id': pageVariables.opp_detail_data?.['id'],
                    'code': pageVariables.opp_detail_data?.['code'],
                    'title': pageVariables.opp_detail_data?.['title'],
                    'sale_person': pageVariables.opp_detail_data?.['sale_person'],
                })));
                window.open(url, '_blank');
            }
        })
        // event on click to create relate apps from opportunity (for cancel quotation - sale order)
        $('#dropdown-menu-relate-app').on('click', '.relate-app', function () {
            OpportunityPageFunction.CheckPermissionDetailOrdersAppRelated(this);
        })
        // tab add member for sale
        let eleFrmPermit = $('#permit-member');
        $('#btn-show-modal-add-member').on('click', async function () {
            await OpportunityPageFunction.LoadMemberForDtb().then();
        })
        $('.mask-money').on('change', function () {
            if ($(this).valCurrency() < 0) {
                $.fn.notifyB({description: $transEle.data('trans-limit-money')}, 'failure');
                $(this).attr('value', 0);
                $.fn.initMaskMoney2();
            }
        })
        $input_close_date.on('change', function () {
            let open_date = moment($input_open_date.val(), "DD/MM/YYYY").format('YYYY-MM-DD')
            let close_date = moment($input_close_date.val(), "DD/MM/YYYY").format('YYYY-MM-DD')
            if (close_date < open_date) {
                $.fn.notifyB({description: $('#limit-close-date').text()}, 'failure')
                $(this).val('')
            }
        })
        $input_open_date.on('change', function () {
            let open_date = moment($input_open_date.val(), "DD/MM/YYYY").format('YYYY-MM-DD')
            let close_date = moment($input_close_date.val(), "DD/MM/YYYY").format('YYYY-MM-DD')
            if (close_date < open_date) {
                $.fn.notifyB({description: $('#limit-close-date').text()}, 'failure')
                $(this).val('')
            }
        })
        $(document).on('click', '.btn-go-to-stage', function () {
            if (pageVariables.opp_detail_data?.['active_go_to_stage']) {
                WindowControl.showLoading({'loadingTitleAction': 'UPDATE'});
                let ajax_opp_detail = $.fn.callAjax2({
                    url: $('#frm-detail').data('url'),
                    data: {'current_stage_id_manual_update': $(this).closest('li').attr('data-id')},
                    method: 'GET'
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data?.['opportunity']) {
                            return data?.['opportunity'];
                        }
                        return {};
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                        WindowControl.hideLoading();
                    }
                );
                Promise.all([ajax_opp_detail]).then(([opp_detail_data]) => {
                    if (opp_detail_data) {
                        location.reload()
                    }
                })
            }
            else {
                Swal.fire({
                    html:
                        `<h4 class="text-danger">${$.fn.gettext("If you want to update the stage of this Opportunity manually, the company’s automatic stage transition settings for this opportunity will be disabled.")}</h4>`,
                    customClass: {
                        confirmButton: 'btn text-primary',
                        cancelButton: 'btn text-secondary',
                        container: 'custom-swal',
                        htmlContainer: 'text-start',
                        actions: 'w-100'
                    },
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: $.fn.gettext('Confirm'),
                    cancelButtonText: $.fn.gettext('Cancel'),
                    reverseButtons: true
                }).then((result) => {
                    if (result.value) {
                        WindowControl.showLoading({'loadingTitleAction': 'UPDATE'});
                        let ajax_opp_detail = $.fn.callAjax2({
                            url: $('#frm-detail').data('url'),
                            data: {'current_stage_id_manual_update': $(this).closest('li').attr('data-id')},
                            method: 'GET'
                        }).then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data?.['opportunity']) {
                                    return data?.['opportunity'];
                                }
                                return {};
                            },
                            (errs) => {
                                $.fn.notifyB({description: errs.data.errors}, 'failure');
                                WindowControl.hideLoading();
                            }
                        );
                        Promise.all([ajax_opp_detail]).then(([opp_detail_data]) => {
                            if (opp_detail_data) {
                                location.reload()
                            }
                        })
                    }
                })
            }
        })
        $(document).on('change', '#input-close-deal', function () {
            if ($(this).is(':checked')) {
                $(this).closest('.sub-stage').addClass('stage-selected');
                $('.page-content input, .page-content select, .page-content .btn').not($(this)).prop('disabled', true);
            } else {
                $(this).closest('.sub-stage').removeClass('stage-selected');
                $('.page-content input, .page-content select, .page-content .btn').not($(this)).prop('disabled', false);
                if ($check_agency_role.is(':checked')) {
                    $endCustomerSelectEle.prop('disabled', false);
                } else {
                    $endCustomerSelectEle.prop('disabled', true);
                }
            }
            if (!$checkInputRateEle.prop('checked')) {
                $inputRateEle.val(30);
                $rangeInputEle.val(30)
            }
        })
        $('.item-detail-related-feature').on('click', function () {
            if ($(this).attr('href') === '#') {
                $(this).removeAttr('target');
                OpportunityPageFunction.CommonShowAlert(`${$(this).text()} ${$transEle.data('trans-not-created')}`);
            }
        })
        $(document).on('click', '#btnOpenPermit', function () {
        eleFrmPermit.removeClass('hidden');
        document.getElementById('permit-member').scrollIntoView({
            behavior: 'smooth'
        });
    });
        // for task
        SetupFormSubmit.validate($form_Opp_Task, {
            errorClass: 'is-invalid cl-red',
            submitHandler: function () {
                TaskSubmitFuncOpps($form_Opp_Task, OpportunityPageFunction.LoadTableActivityLogs)
            }
        })
        $('#btn-auto-update-stage').on('click', function () {
            let dataForm = OpportunityHandler.GetDataForm()
            console.log(dataForm)
            let ajax_auto_update_stage = $.fn.callAjax2({
                url: $(this).attr('data-url') + `?opportunity_id=${$.fn.getPkDetail()}`,
                data: dataForm,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('opportunity_stage_checking')) {
                        return data?.['opportunity_stage_checking'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            Promise.all([ajax_auto_update_stage]).then(
                (results) => {
                    let data = results[0];
                    console.log(data)
                })
        })
        // contract summarize
        $('#btn-summarize-contract').on('click', function () {
            let url = $(this).attr('data-url') + '?opportunity_id=' + $.fn.getPkDetail()
            $(this).attr('href', url)
        })
    }
}
