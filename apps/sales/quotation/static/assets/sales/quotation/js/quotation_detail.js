
$(function () {

    $(document).ready(function () {
        let $form = $('#frm_quotation_create');
        let eleDataDetail = $('#quotation-detail-data');

        // call ajax get info quotation detail
        $.fn.callAjax2({
            url: $form.data('url'),
            method: 'GET',
            isLoading: true,
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $x.fn.renderCodeBreadcrumb(data);
                    $.fn.compareStatusShowPageAction(data);
                    // store data detail
                    eleDataDetail.val(JSON.stringify(data));
                    QuotationLoadDataHandle.loadDetailQuotation(data);
                    if ($form.attr('data-method').toLowerCase() === 'get') {
                        QuotationLoadDataHandle.loadDataTablesAndDropDowns(data, true);
                    } else {
                        QuotationLoadDataHandle.loadDataTablesAndDropDowns(data, false);
                    }
                    // prepare for copy quotation to sale order
                    if (!$form.hasClass('sale-order')) { // QUOTATION PAGES
                        $('#data-copy-quotation-detail').val(JSON.stringify(data));
                    }
                    if ($form.attr('data-method').toLowerCase() === 'put') {
                        // Check config when begin edit
                        let check_config = QuotationCheckConfigHandle.checkConfig(true);
                        // load again total products if after check config the price change
                        if (check_config.hasOwnProperty('is_make_price_change')) {
                            if (check_config?.['is_make_price_change'] === false) {
                                QuotationLoadDataHandle.loadTotal(data, true, false, false);
                            }
                        }
                    }
                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                    // get WF initial zones for change
                    let appCode = 'quotation';
                    if ($form[0].classList.contains('sale-order')) {
                        appCode = 'saleorder';
                    }
                    WFRTControl.setWFInitialData(appCode, $form.attr('data-method'));

                    // delivery button
                    if (data?.['delivery_call'] === false) $('#btnDeliverySaleOrder').removeClass('hidden');
                    else $('#btnDeliverySaleOrder').addClass('hidden');

                    if ($form.attr('data-method').toLowerCase() === 'get') {
                        new PrintTinymceControl().render('b9650500-aba7-44e3-b6e0-2542622702a3', data, false);
                    }
                }
            }
        )
        // mask money
        $.fn.initMaskMoney2();















        function initJSPlumbs() {
            const instance = jsPlumb.getInstance({
                ConnectionOverlays: [
                    ["Arrow", {location: 1, id: "arrow", length: 10, width: 10, height: 10, foldback: 0.9}],
                ],
                Container: "flowchart_diagram",
            });

            instance.bind("ready", function () {
                // declare style connection type
                instance.registerConnectionTypes({
                    "pink-connection": {
                        paintStyle: {stroke: "#f3c6f2", strokeWidth: 4},
                        hoverPaintStyle: {stroke: "#efa6b6", strokeWidth: 4}
                    }
                })

                instance.connect({
                    source: 'control-' + '1',
                    target: 'control-' + '2',
                    overlays: [
                        ["Label",
                            {
                                label: '',
                                location: 0.5,
                                cssClass: "cssAssociateLabel",
                                events: {
                                    click: function (labelOverlay) {
                                        clickConnection(labelOverlay)
                                    }
                                },
                            },
                        ]
                    ],
                    anchors: ["RightMiddle", "LeftMiddle"],
                    endpoint: ["Dot", {radius: 4}],
                    endpointStyle: {fill: "#374986", opacity: ".8", left: "200px"},
                    paintStyle: {stroke: "#f3c6f2", strokeWidth: 4},
                    hoverPaintStyle: {stroke: "#efa6b6", strokeWidth: 4},
                    connectionType: "pink-connection",
                    connector: ["Flowchart", {cornerRadius: 5}],
                });
                jsPlumb.select({source: 'control-' + '1'}).addOverlay(
                    ["Label",
                        {
                            label: 'aLabel',
                            location: 0.5,
                            cssClass: "cssAssociateLabel",
                            events: {
                                click: function (labelOverlay) {
                                    clickConnection(labelOverlay)
                                }
                            },
                        },
                    ]
                );


            });
        }

        // initJSPlumbs();


        $('#btn-diagram').on('click', function () {
            if (window.location.href.includes('/detail/')) {
                // Split the URL by '/'
                let parts = window.location.href.split('/');
                let pk = parts[parts.length - 1];
                $.fn.callAjax2({
                        'url': $(this).attr('data-url'),
                        'method': $(this).attr('data-method'),
                        'data': {'app_code': 'saleorder.saleorder', 'doc_id': pk},
                        isLoading: true,
                    }
                ).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (data.hasOwnProperty('diagram_list') && Array.isArray(data.diagram_list)) {
                                if (data.diagram_list.length > 0) {
                                    let data_diagram = data.diagram_list[0];
                                    loadDiagram(data_diagram);
                                }
                            }
                        }
                    }
                )
            }
        })

        function loadDiagram(data_diagram) {
            let $chartDiagram = $('#flowchart_diagram');
            $chartDiagram.empty();
            let html = "";
            let sttTxt = JSON.parse($('#stt_sys').text());
            let diaTxt = JSON.parse($('#dia_app').text());
            let sttMapBadge = [
                "soft-light",
                "soft-primary",
                "soft-info",
                "soft-success",
                "soft-danger",
            ]
            // prefix
            let htmlPrefix = loadPrefixSuffix(data_diagram?.['prefix'], sttTxt, diaTxt, sttMapBadge);
            // main doc
            let docData = data_diagram?.['doc_data'];
            let htmlMain = `<div class="card">
                                <div class="card-header bg-primary">
                                    <h6 class="text-white">${diaTxt[data_diagram?.['app_code']]}</h6>
                                </div>
                                <div class="card-body bg-soft-success">
                                    <div class="card border-green clone" data-drag="1" title="card-1" id="control-1">
                                        <div class="card-header card-header-wth-text">
                                            <div>
                                                <div class="row"><small>${docData?.['title']}</small></div>
                                            </div>
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-5">
                                                <div class="row"><small>Mã: ${docData?.['code']}</small></div>
                                                <div class="row"><small>Số lượng: ${docData?.['quantity']}</small></div>
                                                <div class="row"><small>Giá trị: <span class="mask-money" data-init-money="${parseFloat(docData?.['total'] ? docData?.['total'] : '0')}"></span></small></div>
                                            </div>
                                        </div>
                                        <div class="card-footer text-muted d-flex justify-content-between">
                                            <small><span class="badge badge-${sttMapBadge[docData?.['system_status']]}">${sttTxt[docData?.['system_status']][1]}</span></small>
                                            <small>${moment(docData?.['date_created']).format('DD/MM/YYYY')}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
            // suffix
            let htmlSuffix = loadPrefixSuffix(data_diagram?.['suffix'], sttTxt, diaTxt, sttMapBadge);
            // result
            html += htmlPrefix;
            html += htmlMain;
            html += htmlSuffix;
            $chartDiagram.html(html);
            // mask money
            $.fn.initMaskMoney2();
        }

        function loadPrefixSuffix(data_pre_suf, sttTxt, diaTxt, sttMapBadge) {
            let htmlPreSuffix = "";
            for (let key in data_pre_suf) {
                let htmlChild = "";
                for (let data_record of data_pre_suf[key]) {
                    htmlChild += `<div class="card border-green clone" data-drag="1" title="card-1" id="control-1">
                                        <div class="card-header card-header-wth-text">
                                            <div>
                                                <div class="row"><small>${data_record?.['title']}</small></div>
                                            </div>
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-5">
                                                <div class="row"><small>Mã: ${data_record?.['code']}</small></div>
                                                <div class="row"><small>Số lượng: ${data_record?.['quantity']}</small></div>
                                                <div class="row"><small>Giá trị: <span class="mask-money" data-init-money="${parseFloat(data_record?.['total'] ? data_record?.['total'] : '0')}"></span></small></div>
                                            </div>
                                        </div>
                                        <div class="card-footer text-muted d-flex justify-content-between">
                                            <small><span class="badge badge-${sttMapBadge[data_record?.['system_status']]}">${sttTxt[data_record?.['system_status']][1]}</span></small>
                                            <small>${moment(data_record?.['date_created']).format('DD/MM/YYYY')}</small>
                                        </div>
                                    </div>`;
                }

                htmlPreSuffix += `<div class="card">
                                    <div class="card-header bg-primary">
                                        <h6 class="text-white">${diaTxt[key]}</h6>
                                    </div>
                                    <div class="card-body">
                                        ${htmlChild}
                                    </div>
                                </div>`;
            }
            return htmlPreSuffix;
        }


    });
});
