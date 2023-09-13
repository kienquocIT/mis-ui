class PermitSummaryHandle {
    static renderAppShowing(appData) {
        return `<span class="badge badge-light mr-1 mb-1">${appData.title}</span>`;
    }

    constructor(tbl = null, appOfSelf = null, permit_self = []) {
        this.tblSummary = $('#tbl-summary-permissions');
        this.tbl = tbl ? tbl : $('#dtb-apps-using');
        this.appOfSelf = appOfSelf ? appOfSelf : $('#appOfSelf');
        this.permit_self = permit_self;
        this.tbl.on('click', '.btnShowMore', function () {
            if ($(this).hasClass('show-less-active')) {
                $(this).removeClass('show-less-active');
                $(this).addClass('show-more-active');
                $(this).text(
                    __renderTextBtnMore(
                        $(this),
                        $.fn.transEle.data('msg-show-less'),
                    )
                );
            } else {
                $(this).addClass('show-less-active');
                $(this).removeClass('show-more-active');
                $(this).text(
                    __renderTextBtnMore(
                        $(this),
                        $.fn.transEle.data('msg-show-more'),
                    )
                );
            }
            $(this).parent().find('.blockMoreData').toggleClass('hidden');
        });

        this.appSelectEle = $('#newRowRange');
    }

    renderAppOfUser(plan_app, updateEleExist = true) {
        let htmlArr = [];
        if (Array.isArray(plan_app) && plan_app.length > 0) {
            plan_app.map(
                (item) => {
                    let applicationList = item['application'] || [];
                    if (Array.isArray(applicationList) && applicationList.length > 0) {
                        let idxHeading = $x.fn.randomStr(32);
                        let idxCollapse = $x.fn.randomStr(32);
                        let appHtml = [];
                        applicationList.map(
                            (item2) => {
                                appHtml.push(PermitSummaryHandle.renderAppShowing(item2));
                            }
                        )
                        htmlArr.push(`
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="panelsStayOpen-${idxHeading}">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-${idxCollapse}" aria-expanded="false" aria-controls="panelsStayOpen-${idxCollapse}">
                                        <span class="text-${$x.cls.doc.classOfPlan(item.code)}" data-id="${item.id}">
                                            ${item.title}
                                            (${appHtml.length})
                                        </span>
                                    </button>
                                </h2>
                                <div id="panelsStayOpen-${idxCollapse}" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-${idxHeading}">
                                    <div class="accordion-body">
                                        ${appHtml.join("")}
                                    </div>
                                </div>
                            </div>
                        `);
                    }
                }
            )
        }
        let finalHTML = `<div class="accordion accordion-soft accordion-card accordion-card-shadow" id="accordionPanelsStayOpenExample">${htmlArr.join("")}</div>`;
        if (updateEleExist === true) this.appOfSelf.html(finalHTML);
        return finalHTML;
    }

    renderAllPermit(planAppOfRole) {
        let clsThis = this;

        let allPermit = this.permit_self.map(
            (item) => {
                return {
                    ...item,
                    'belong_to': {},
                }
            }
        );
        planAppOfRole.map(
            (item) => {
                // permitRole = permitRole.concat(item.permission_by_configured)
                (item?.['permission_by_configured'] || []).map(
                    (item2) => {
                        allPermit.push({
                            ...item2,
                            'belong_to': {
                                'id': item.id,
                                'title': item.title,
                                'code': item.code
                            }
                        })
                    }
                )
                return item;
            }
        )

        allPermit = allPermit.sort(
            (a, b) => {
                let txt1 = `${a.plan_data.title} - ${a.app_data.id}`.toLowerCase();
                let txt2 = `${b.plan_data.title} - ${b.app_data.id}`.toLowerCase();
                return txt1.localeCompare(txt2);
            }
        );

        this.tblSummary.DataTableDefault({
            // stateFullTableTools: false,
            rowIdx: true,
            data: allPermit,
            columns: [
                {
                    render: (data, type, row) => {
                        return '';
                    }
                },
                {
                    data: 'belong_to',
                    render: (data, type, row) => {
                        let dataBelongTo = row['belong_to'] || '_';
                        if (dataBelongTo.hasOwnProperty('id')) {
                            return `<span class="badge badge-primary">${dataBelongTo['title']}</span>`
                        }
                        return '';
                    }
                },
                {
                    data: 'app_data',
                    render: (data, type, row) => {
                        let app_data = row['app_data'];
                        let plan_data = row['plan_data'];
                        return `
                            <span class="badge badge-${DocumentControl.classOfPlan(plan_data.code)}">${plan_data.title} - ${app_data.title}</span>
                            <input 
                                type="text" 
                                name="permission-app" 
                                class="hidden" 
                                data-plan-id="${plan_data.id}" 
                                data-app-id="${app_data.id}" 
                                value="${app_data.id}" 
                            >
                        `;
                    }
                },
                {
                    data: 'view',
                    render: (data, type, row) => {
                        return `
                                <span class="hidden">${data}</span>
                                <div class="form-check form-switch mb-1">
                                    <input type="checkbox" class="form-check-input" ${data === true ? 'checked' : ''} disabled readonly>
                                </div>
                            `;
                    }
                },
                {
                    data: 'create',
                    render: (data, type, row) => {
                        return `
                                <div class="form-check form-switch mb-1">
                                    <input type="checkbox" class="form-check-input" ${data === true ? 'checked' : ''} disabled readonly>
                                </div>
                            `;
                    }
                },
                {
                    data: 'edit',
                    render: (data, type, row) => {
                        return `
                                <div class="form-check form-switch mb-1">
                                    <input type="checkbox" class="form-check-input" ${data === true ? 'checked' : ''} disabled readonly>
                                </div>
                            `;
                    }
                },
                {
                    data: 'delete',
                    render: (data, type, row) => {
                        return `
                                <div class="form-check form-switch mb-1">
                                    <input type="checkbox" class="form-check-input" ${data === true ? 'checked' : ''} disabled readonly>
                                </div>
                            `;
                    }
                },
                {
                    data: 'range',
                    render: (data, type, row) => {
                        return clsThis.appSelectEle.find(`option[value="${data}"]`).text();
                    }
                },
            ],
        });
    }

    callRoleDetail(urlBase, itemData) {
        let _id = itemData['id'];
        return $.fn.callAjax2({
            url: urlBase.replaceAll('__pk__', _id),
            type: 'GET',
        }).then(
            (resp) => {
                let respData = $.fn.switcherResp(resp);
                if (respData && resp.data.hasOwnProperty('role')) {
                    return resp.data['role'] ? resp.data['role'] : [];
                }
                throw Error('Call data raise errors.')
            }
        )
    }

    renderRoleAppTable(role_datas) {
        let clsThis = this;
        if (Array.isArray(role_datas) && role_datas.length > 0) {
            let urlBase = this.tbl.data('url');
            let promiseData = [];
            role_datas.map(
                (item) => {
                    promiseData.push(
                        clsThis.callRoleDetail(urlBase, item)
                    )
                }
            )

            Promise.all(promiseData).then(
                (dataAll) => {
                    let bigResult = [];
                    dataAll.map(
                        (item) => {
                            bigResult = bigResult.concat(item)
                        }
                    )
                    clsThis.renderAllPermit(dataAll);
                    clsThis.tbl.DataTableDefault({
                        stateFullTableTools: false,
                        rowIdx: true,
                        data: dataAll,
                        autoWidth: false,
                        columns: [
                            {
                                width: "10%",
                                render: (data, type, row) => {
                                    return '';
                                }
                            },
                            {
                                width: "30%",
                                data: 'title',
                                render: (data, type, row) => {
                                    return data ? `<span class="badge badge-primary">${data}</span>` : '';
                                },
                            },
                            {
                                width: "60%",
                                data: 'plan_app',
                                render: (data, type, row) => {
                                    if (Array.isArray(data) && data.length > 0) return new PermitSummaryHandle().renderAppOfUser(data, false);
                                    return '';
                                }
                            }
                        ]
                    });
                }
            )
        }
    }
}
