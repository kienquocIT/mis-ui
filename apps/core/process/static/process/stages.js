class ProcessStages {
    static htmlBaseStages = `
        <div class="stages-all">
            <div class="stages-all-head">
                <div class="stages-all-head-items"></div>
            </div>
            <div class="stages-all-body d-none"></div>
        </div>
    `;
    static htmlBaseItem = `
        <div class="stages-item">
            <div class="stages-head">
                <div class="stages-head-sub">
                    <div class="head-sub"></div>
                    <div class="head-decor"></div>
                </div>
            </div>
            <div class="stages-body">
                <div class="stages-body-sub">
                    <div class="body-sub-text">
                        <div class="body-text"></div>
                        <div class="body-apps"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    static htmlBaseAppItem = `
        <div class="app-item">
            <div class="app-item-text">
                <div class="app-item-list">
                    <div class="app-text-app"></div>
                    <div class="app-text-title"></div>
                </div>
            </div>
            <div class="app-item-tools">
                <div class="item-tools-item app-control-item" data-code="amount" data-bs-toggle="tooltip" title="${$.fn.gettext("Number of documents created")} / ${$.fn.gettext("Number of documents approved")}"></div>
                <a href="#" class="item-tools-item app-control-item" data-code="add" style="display: none;" data-bs-toggle="tooltip" title="${$.fn.gettext("Click to create more documents")}">
                    <i class="fa-solid fa-plus"></i>
                </a>
                <div class="item-tools-item app-control-item" data-code="confirm_complete" style="display: none;" data-bs-toggle="tooltip" title="${$.fn.gettext("Click to confirm complete")}">
                    <i class="fa-solid fa-flag-checkered"></i>
                </div>
            </div>
        </div>
    `;

    static htmlStagesItemControl = `
        <div class="stages-item-control">
            <div class="item-control-btn control-stages" data-code="move">
                <i class="fa-solid fa-arrows-up-down-left-right fa-lg"></i>
            </div>
            <div class="item-control-btn control-stages" data-code="setting">
                <i class="fa-solid fa-gear fa-lg"></i>
            </div>
            <div class="item-control-btn control-stages" data-code="delete">
                <i class="fa-solid fa-trash fa-lg"></i>
            </div>
            <div>
                <div class="item-control-btn" data-bs-toggle="dropdown">
                    <i class="fa-regular fa-square-plus fa-lg"></i>
                </div>
                <div class="dropdown-menu">
                    <a class="dropdown-item control-stages" data-code="stages_add_prev" href="#">${$.fn.gettext('Add new previous stages')}</a>
                    <a class="dropdown-item control-stages" data-code="stages_add_next" href="#">${$.fn.gettext('Add new next stages')}</a>
                    <a class="dropdown-item control-stages" data-code="stages_add_app" href="#">${$.fn.gettext('Add new application')}</a>
                </div>
            </div>
        </div>
    `;
    static htmlItemAppControl = `
        <div class="app-item-control">
            <div class="item-control-item control-apps" data-code="move">
                <i class="fa-solid fa-arrows-up-down-left-right"></i>
            </div>
            <div class="item-control-item control-apps" data-code="setting">
                <i class="fa-solid fa-gear"></i>
            </div>
            <div class="item-control-item control-apps" data-code="delete">
                <i class="fa-solid fa-trash"></i>
            </div>
        </div>
    `;

    static htmlModalStageConfig = `
        <div class="modal fade" id="modalStageConfig" tabindex="-1" role="dialog" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <form>
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <span class="modal-title-doc"></span>
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="form-group">
                                <label for="inp-stage-config-title" class="form-label required">${$.fn.gettext('Title')}</label>
                                <input type="text" class="form-control" name="title" id="inp-stage-config-title" required maxlength="100" />
                            </div>
                            <div class="form-group">
                                <label for="inp-stage-config-remark" class="form-label">${$.fn.gettext('Remarks')}</label>
                                <textarea class="form-control" name="remark" id="inp-stage-config-remark"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${$.fn.gettext('Close')}</button>
                            <button type="submit" class="btn btn-primary">${$.fn.gettext('Save')}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    static htmlModalAppConfig = `
        <div class="modal fade" id="modalAppConfig" tabindex="-1" role="dialog" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <form>
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <span class="modal-text-app"></span>
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="form-group">
                                <label for="inp-app-config-title" class="form-label required">${$.fn.gettext("Title")}</label>
                                <input type="text" class="form-control" name="title" id="inp-app-config-title" required maxlength="100" />
                            </div>
                            <div class="form-group">
                                <label for="inp-app-config-remark" class="form-label">${$.fn.gettext("Remarks")}</label>
                                <input type="text" class="form-control" name="remark" id="inp-app-config-remark" />
                            </div>
                            <div class="form-group">
                                <label for="inp-app-config-application" class="form-label required">${$.fn.gettext("Application")}</label>
                                <select name="application" id="inp-app-config-application" class="form-select" required></select>
                            </div>
                            <div class="d-flex" style="gap: 10px;">
                                <div class="form-group" style="width: 50%;">
                                    <label class="form-label required" for="inp-app-config-min">${$.fn.gettext('The minimum number of documents created')}</label>
                                    <select name="min" id="inp-app-config-min" class="form-select" required>
                                        <option value="0">0</option>
                                        <option value="1" selected>1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                </div>
                                <div class="form-group" style="width: 50%;">
                                    <label class="form-label required" for="inp-app-config-max">${$.fn.gettext('The maximum number of documents created')}</label>
                                    <select name="max" id="inp-app-config-max" class="form-select" required>
                                        <option value="1" selected>1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="n">n</option>
                                    </select>
                                </div>
                            </div>
                            <div class="w-100">
                                <button id="app-btn-rule-min-max" class="btn btn-outline-primary no-transform" type="button">${$.fn.gettext("Rules")}</button>
                                <ul style="list-style: circle; display: none;">
                                    <li class="text-danger">${$.fn.gettext("Min=0 and Max=0 : Incorrect configuration")}</li>
                                    <li class="text-danger">${$.fn.gettext("Min > Max : Incorrect configuration")}</li>
                                    <li>
                                        <p class="text-primary">${$.fn.gettext("Min = Max = x : Always have x documents")}</p>
                                        <i class="text-success">${$.fn.gettext("Auto-complete once the amount is sufficient.")}</i>
                                    </li>
                                    <li>
                                        <p class="text-primary">${$.fn.gettext("Min=0 and Max > 0 : May or may not have a documents")}</p>
                                        <i class="text-success">${$.fn.gettext("The 'Complete' action always shown and can confirm complete, and reaching the maximum document quantity will trigger auto-completion")}</i>
                                    </li>
                                    <li>
                                        <p class="text-primary">${$.fn.gettext("Min=1 and Max > 1 : At least one document is required, and multiple document can be created")}</p>
                                        <i class="text-success">${$.fn.gettext("When the document quantity is 1, the 'Complete' action will be shown and can confirm complete, and reaching the maximum document quantity will trigger auto-completion")}</i>
                                    </li>
                                    <li>
                                        <p class="text-primary">${$.fn.gettext("Max = n : The maximum quantity is unlimited, subject to the system's limits")}</p>
                                        <i class="text-success">${$.fn.gettext("The 'Complete' action always appear, and completion confirmation is manual")}</i>
                                    </li>
                                    <li>
                                        <i class="text-success">${$.fn.gettext("Until the maximum quantity is reached, additional documents can still be created — even if the feature has belong to the passed phase")}</i>
                                    </li>
                                    <li>
                                        <i class="text-warning">${$.fn.gettext("Only when all features of a phase are completed will that phase be marked as complete and move to the next phase")}</i>
                                    </li>
                                    <li>
                                        <i class="text-warning">${$.fn.gettext("If the documents has a process applied, the documents status is Approved or Completed to be counted in the number of completed conditions")}</i>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${$.fn.gettext('Close')}</button>
                            <button type="submit" class="btn btn-primary">${$.fn.gettext('Save')}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    static htmlModalDocList = `
        <div class="modal fade" tabindex="-1" role="dialog" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <table class="table table-bordered nowrap w-100">
                            <thead class="thead-primary">
                                <tr>
                                    <th class="no-transform">${$.fn.gettext('Title')}</th>
                                    <th class="no-transform">${$.fn.gettext('Creator')}</th>
                                    <th class="no-transform">${$.fn.gettext('Date created')}</th>
                                    <th class="no-transform">${$.fn.gettext('Status')}</th>
                                    <th class="no-transform">${$.fn.gettext('Timeline')}</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;

    static defaultProcessData = {
        'title': 'Process',
        'remark': '',
        'stages': [
            {
                'title': $.fn.gettext('Start'),
                'application': [],
                'is_system': true,
                'system_code': 'start',
            },
            {
                'title': $.fn.gettext('Stages 1'),
                'application': [],
            },
            {
                'title': $.fn.gettext('End'),
                'application': [],
                'is_system': true,
                'system_code': 'end',
            },
        ],
    }

    setApplicationDict(){
        if (Array.isArray(this.applicationList)){
            this.applicationDict = this.applicationList.reduce(
                (obj, item) => Object.assign(obj, {[item.id]: item}), {}
            );
        }
    }

    reloadNewAppToSelect(){
        const clsThis = this;
        const application$ = clsThis.modalAppConfig$.find('select[name=application]');
        application$.empty();
        application$.initSelect2({
            data: this.applicationList.sort((a, b) => a['title_i18n'].localeCompare(b['title_i18n'])),
        })
    }

    checkExistDataWithApplication(){
        const clsThis = this;
        let application = [];
        clsThis.target$.find('.' + clsThis.appClsName).each(function () {
            application.push(
                {
                    'data': $(this).data(clsThis.appNameData),
                    'element': $(this),
                }
            )
        })
        const errors = [];
        application.map(
            item => {
                const app_id = item.data?.['application'];
                if (app_id && !clsThis.applicationDict.hasOwnProperty(app_id)){
                    const txtApp = $(item.element).find('.app-item-list .app-text-app').text();
                    const txtTitle = $(item.element).find('.app-item-list .app-text-title').text();
                    errors.push(`${$.fn.gettext('Application is not supported')}: ${txtApp} - ${txtTitle}`);
                    return false;
                }
            }
        )
        errors.map(
            msg => {
                $.fn.notifyB({
                    'description': msg
                }, 'failure');
            }
        )
        return errors.length === 0;
    }

    static matchStatusCode(status_code, returnHTML=true){
        let txt = '';
        let clsName = '';
        switch(status_code){
            case 0:
                txt = $.fn.gettext('Draft');
                clsName = 'text-secondary';
                break
            case 1:
                txt = $.fn.gettext('Created');
                clsName = 'text-primary';
                break
            case 2:
                txt = $.fn.gettext('Approved');
                clsName = 'text-success';
                break
            case 3:
                txt = $.fn.gettext('Finished');
                clsName = 'text-indigo';
                break
            case 4:
                txt = $.fn.gettext('Canceled');
                clsName = 'text-light';
                break
        }
        if (returnHTML === true) return `<span class="${clsName}">${txt}</span>`;
        return txt;
    }

    constructor(target$, data = {}, config = {}) {
        this.target$ = target$;
        this.target$.empty().append(ProcessStages.htmlBaseStages);
        this.stagesAllHead$ = target$.find('.stages-all-head-items');
        this.data = {
            'id': '',
            'title': '',
            'remark': '',
            'stages': [],
            ...data,
        }
        this.config = {
            'debug': false,
            'enableEdit': false,
            'enableAppControl': false,
            'enableAppInfoShow': false,
            'enableStagesInfoShow': false,
            'urlApplicationList': '/base/tenant-application/api',
            'urlAppData': '/process/runtime/app/__pk__/api',
            'redirectMaskUrl': '/gateway/reverse-url/create/__plan__/__app__',
            'applicationList': null,

            ...config,
        }
        this.debug = !!this.config.debug;
        this.enableEdit = !!this.config['enableEdit'];
        this.enableAppControl = !!this.config['enableAppControl'];
        this.enableAppInfoShow = !!this.config['enableAppInfoShow'];
        this.enableStagesInfoShow = !!this.config['enableStagesInfoShow'];
        this.urlApplicationList = this.config['urlApplicationList'];
        this.redirectMaskUrl = this.config['redirectMaskUrl'];
        this.urlAppData = this.config['urlAppData'];
        if (
            !this.redirectMaskUrl || (
                this.redirectMaskUrl && (
                    this.redirectMaskUrl.indexOf('__plan__') === -1 ||
                    this.redirectMaskUrl.indexOf('__app__') === -1
                )
            )
        ) {
            this.redirectMaskUrl = null;
            if (this.debug) console.log('The redirect gateway of application is incorrect! Must keep argument of url: plan=__plan__, app=__app__');
        }
        this.applicationList = this.config.applicationList;
        this.applicationDict = {};

        this.modalStageConfig$ = $(ProcessStages.htmlModalStageConfig);
        this.modalAppConfig$ = $(ProcessStages.htmlModalAppConfig);
        this.modalDocList$ = $(ProcessStages.htmlModalDocList);
        this.modalDocListDataTable = null;

        this.setApplicationDict();
    }

    itemClsName = 'stages-item';
    itemNameData = 'processStage';
    itemModalCurrentData = 'processStageItemCurrent';
    appClsName = 'app-item';
    appNameData = 'processStageApp';
    appModalCurrentData = 'processStageAppCurrent';

    _init_(){
        const clsThis = this;

        (this.data?.['stages'] || []).map(
            (item, idx) => {
                const ele$ = clsThis.initItem(item, idx);
                clsThis.stagesAllHead$.append(ele$);
            }
        )
        clsThis.initModalConfig();

        clsThis.target$.sortable({
            'placeholder': 'stages-item stages-item-dragging',
            'items': '.stages-item:not(.fixed)',
            'handle': '.control-stages[data-code=move]',
            'revert': true,
            tolerance: 'pointer', // Đặt tolerance thành 'pointer' để tăng độ nhạy khi chiếm chỗ
            delay: 0 // Đặt delay về 0 để việc kéo diễn ra ngay lập tức
        });
        clsThis.target$.disableSelection();

        // tooltip
        clsThis.target$.find('[data-bs-toggle="tooltip"]').tooltip();
    }

    init() {
        const clsThis = this;

        if (Array.isArray(clsThis.applicationList)){
            clsThis._init_();
        } else {
            $.fn.callAjax2({
                url: clsThis.urlApplicationList + '?' + $.param({
                    'pageSize': '-1',
                    'allow_process': true
                }),
                method: 'GET',
                isLoading: true,
                loadingOpts: {
                    'html': $.fn.gettext('Applications loading...'),
                },
            }).then(
                resp => {
                    const appData = $.fn.switcherResp(resp);
                    if (appData && appData.hasOwnProperty('tenant_application_list')) {
                        clsThis.applicationList = appData['tenant_application_list'];
                        clsThis.setApplicationDict();
                        clsThis._init_();
                    } else {
                        if (clsThis.debug) console.log('Get application list failed!');
                    }
                },
                errs => $.fn.switcherResp(errs),
            )
        }
    }

    load_stagesData(stagesData, enableEdit=true){
        const clsThis = this;
        clsThis.modalStageConfig$.find('.modal-title .modal-title-doc').text(stagesData?.['title'] || '');
        const title$ = clsThis.modalStageConfig$.find(':input[name=title]');
        const remark$ = clsThis.modalStageConfig$.find(':input[name=remark]');
        title$.val(stagesData?.['title'] || '').prop('disabled', !enableEdit === true);
        remark$.val(stagesData?.['remark'] || '').prop('disabled', !enableEdit === true);

        const foot$ = clsThis.modalStageConfig$.find('.modal-footer');
        if (enableEdit === true) foot$.show(0);
        else foot$.hide(0);
    }

    load_appData(appData, enableEdit=true){
        const clsThis = this;

        clsThis.modalAppConfig$.find('.modal-text-app').text(
            appData?.['title'] || ''
        )

        const appData_application = clsThis.applicationDict?.[appData['application']] || {};
        clsThis.modalAppConfig$
            .find('.modal-title .modal-title-app')
            .text(appData?.['title'] || '')
            .prop('disabled', !enableEdit === true);
        clsThis.modalAppConfig$
            .find(':input[name=title]')
            .val(appData?.['title'] || '')
            .prop('disabled', !enableEdit === true);
        clsThis.modalAppConfig$
            .find(':input[name=remark]')
            .val(appData?.['remark'] || '')
            .prop('disabled', !enableEdit === true);
        clsThis.modalAppConfig$
            .find(':input[name=application]')
            .val(appData_application?.['id'] || '')
            .trigger('change')
            .prop('disabled', !enableEdit === true);
        clsThis.modalAppConfig$
            .find(':input[name=min]')
            .val(appData?.['min'] || '')
            .trigger('change')
            .prop('disabled', !enableEdit === true);
        clsThis.modalAppConfig$
            .find(':input[name=max]')
            .val(appData?.['max'] || '')
            .trigger('change')
            .prop('disabled', !enableEdit === true);

        const foot$ = clsThis.modalAppConfig$.find('.modal-footer');
        if (enableEdit === true) foot$.show(0);
        else foot$.hide(0);
    }

    load_docData(itemData, appData, appData_application){
        const clsThis = this;
        this.modalDocList$.find('.modal-title').text(`${itemData.title}: ${appData_application.title} - ${appData.title}`);
        const urlAppDataDocs = this.urlAppData.replaceAll('__pk__', appData.id);
        $.fn.callAjax2({
            url: urlAppDataDocs,
            method: 'GET',
        }).then(
            resp => {
                const data = $.fn.switcherResp(resp);
                if (data && data.hasOwnProperty('stages_app_detail')){
                    const sAppDetail = data['stages_app_detail'];
                    if (sAppDetail){
                        clsThis.modalDocListDataTable.clear();
                        clsThis.modalDocListDataTable.rows.add(sAppDetail?.['doc_list'] || []);
                        clsThis.modalDocListDataTable.draw();
                    }
                }
            },
            errs => $.fn.switcherResp(errs),
        )
    }

    initItem(itemData, index = 0) {
        const clsThis = this;
        itemData = {
            'title': '',
            'application': [],
            'is_system': false,
            'system_code': null,
            'state': null, // DONE, CURRENT, COMING
            ...itemData,
        }
        const stagesItem$ = $(ProcessStages.htmlBaseItem)
            .addClass(this.itemClsName)
            .data(this.itemNameData, itemData);

        switch (itemData.state) {
            case 'DONE':
                stagesItem$.addClass('stages-item-done');
                break
            case 'CURRENT':
                stagesItem$.addClass('stages-item-current');
                break
            case 'COMING':
                stagesItem$.addClass('stages-item-coming');
                break
        }

        stagesItem$.find('.head-sub').text(itemData.title);
        stagesItem$.css('--order-num', this.enableEdit === true ? "" : `"${index + 1}"`);
        (itemData?.['application'] || []).map(
            (app, idx) => {
                const app$ = this.initApp(app, itemData);
                stagesItem$.find('.body-apps').append(app$);
            }
        )

        let controlStagesExclude = [];
        let addClsName = '';
        if (itemData.is_system === true) {
            addClsName = 'fixed';
            controlStagesExclude.push('[data-code="setting"]');
            if (itemData.system_code === 'start') {
                controlStagesExclude.push('[data-code="stages_add_next"]');
            } else if (itemData.system_code === 'end') {
                controlStagesExclude.push('[data-code="stages_add_prev"]');
            }
        } else {
            // sortable available with stages is not system.
            stagesItem$.find('.body-apps').sortable({
                'placeholder': 'app-item app-item-dragging',
                'items': '.app-item:not(.fixed)',
                'handle': '.control-apps[data-code=move]',
                'revert': true,
                connectWith: ".body-apps",
                tolerance: 'pointer', // Đặt tolerance thành 'pointer' để tăng độ nhạy khi chiếm chỗ
                delay: 0 // Đặt delay về 0 để việc kéo diễn ra ngay lập tức
            });
            stagesItem$.find('.body-apps').disableSelection();
        }

        if (clsThis.enableStagesInfoShow === true) {
            stagesItem$.find('.head-sub').on('click', function (event) {
                event.preventDefault();
                const processStageData = stagesItem$.data(clsThis.itemNameData);
                clsThis.load_stagesData(processStageData, false);
                clsThis.modalStageConfig$.modal('show');
            })
        }

        if (this.enableEdit === true) {
            const control$ = $(ProcessStages.htmlStagesItemControl);
            if (controlStagesExclude.length > 0) control$.find('.control-stages').not(controlStagesExclude.join(",")).remove();
            stagesItem$.addClass(addClsName).append(control$);
            // on event click
            stagesItem$.find('.control-stages[data-code]').on('click', function (event) {
                event.preventDefault();
                switch ($(this).data('code')) {
                    case 'move':
                        break
                    case 'setting':
                        const headItem$ = $(stagesItem$).find('.stages-head');
                        if (headItem$.length > 0) {
                            const processStageData = stagesItem$.data(clsThis.itemNameData);
                            clsThis.load_stagesData(processStageData);
                            clsThis.modalStageConfig$.data(clsThis.itemModalCurrentData, stagesItem$);
                            clsThis.modalStageConfig$.modal('show');
                            if (clsThis.debug) console.log('Stage item open config:', $(headItem$)[0]);
                        }
                        break
                    case 'delete':
                        Swal.fire({
                            title: $.fn.gettext("Are you sure remove it?"),
                            html: `<b class="text-primary mb-3">${itemData?.['title'] || ''}</b>`,
                            icon: "question",
                            showCancelButton: true,
                            cancelButtonText: $.fn.gettext('Cancel'),
                            confirmButtonText: $.fn.gettext('Yes')
                        }).then((result) => {
                            if (result.isConfirmed) {
                                stagesItem$.remove();
                            }
                        })
                        break
                    case 'stages_add_prev':
                        clsThis.initItem(ProcessStages.defaultProcessData.stages[1]).insertBefore(stagesItem$);
                        break
                    case 'stages_add_next':
                        clsThis.initItem(ProcessStages.defaultProcessData.stages[1]).insertAfter(stagesItem$);
                        break
                    case 'stages_add_app':
                        const app$ = clsThis.initApp({
                            'title': $.fn.gettext('Application'),
                            'application': null,
                        });
                        stagesItem$.find('.body-apps').append(app$);
                        break
                }

            })
            // on event data
            stagesItem$.on('data.change.item', function () {
                const itemDataNew = stagesItem$.data(clsThis.itemNameData);
                $(this).find('.head-sub').text(itemDataNew?.['title'] || '');
                $(this).find('.body-text').text(itemDataNew?.['remark'] || '');
                // force to variable data
                itemData = {...itemData, ...itemDataNew};
            });
        }

        return stagesItem$;
    }

    initApp(appData, itemData = {}) {
        const clsThis = this;
        appData = {
            'id': '',
            'title': '',
            'application': null,
            'app_label': '',
            'mode_code': '',
            'min': "0",
            'max': "1",
            'amount': 0,
            'amount_approved': 0,
            'was_done': false,
            ...appData,
        }
        const appData_application = appData.application ? clsThis.applicationDict?.[appData['application']] || {} : {};
        const app$ = $(ProcessStages.htmlBaseAppItem)
            .addClass(clsThis.appClsName)
            .data(clsThis.appNameData, appData);

        function renderAmountAndApproved(amount, amount_approved){
            return `${amount} / ${amount_approved}`;
        }

        function removeControlComplete(){
            app$.find('.app-control-item[data-code=confirm_complete]').remove();
        }

        function removeControlAdd(){
            app$.find('.app-control-item[data-code=add]').remove();
        }

        function getUrlAdd(){
            const urlResolved = clsThis.redirectMaskUrl.replaceAll('__plan__', appData.app_label).replaceAll('__app__', appData.mode_code);
            const paramData = $.param({
                'redirect': true,
                'create_open': true,
                'process_id': clsThis.data?.['id'] || '',
                'process_title': clsThis.data?.['title'] || '',
                ...(
                    clsThis.data?.['opp'] ? {
                        'opp_id': clsThis.data['opp']?.['id'] || '',
                        'opp_title': clsThis.data['opp']?.['title'] || '',
                        'opp_code': clsThis.data['opp']?.['code'] || '',
                    } : {}
                ),
                ... (
                    $x.fn.getEmployeeCurrent('id') ? {
                        'inherit_id': $x.fn.getEmployeeCurrent('id'),
                        'inherit_title': $x.fn.getEmployeeCurrent('full_name'),
                    } : {}
                ),
            });
            return urlResolved + '?' + paramData;
        }

        function confirmUrlAndSetAttr(){
            app$.find('.app-control-item[data-code=add]').attr('href', appData.app_label && appData.mode_code ? getUrlAdd() : '#');
        }

        app$.find('.app-item-text .app-text-title').text(appData?.['title'] || '');
        app$.find('.app-item-text .app-text-app').text(appData_application?.['title_i18n'] || '');
        app$.find('.app-control-item[data-code=amount]').text(
            renderAmountAndApproved(appData?.['amount'] || '0', appData?.['amount_approved'] || '0')
        );
        confirmUrlAndSetAttr();

        if (clsThis.enableEdit === true) {
            const controlApp$ = $(ProcessStages.htmlItemAppControl);
            app$.append(controlApp$);

            app$.find('.control-apps[data-code]').on('click', function (event) {
                event.preventDefault();
                switch ($(this).data('code')) {
                    case 'move':
                        break
                    case 'setting':
                        if (clsThis.debug) console.log('App item open config:', app$[0]);
                        const appDataCurrent = app$.data(clsThis.appNameData);
                        clsThis.load_appData(appDataCurrent, true);
                        clsThis.modalAppConfig$.data(clsThis.appModalCurrentData, app$);
                        clsThis.modalAppConfig$.modal('show');
                        break
                    case 'delete':
                        Swal.fire({
                            title: $.fn.gettext("Are you sure remove it?"),
                            html: `<b class="text-primary mb-3">${appData?.['title'] || ''}</b>`,
                            icon: "question",
                            showCancelButton: true,
                            cancelButtonText: $.fn.gettext('Cancel'),
                            confirmButtonText: $.fn.gettext('Yes')
                        }).then((result) => {
                            if (result.isConfirmed) {
                                app$.remove();
                            }
                        })
                        break
                }
            })

            app$.on('data.change', function () {
                const appDataNew = $(this).data(clsThis.appNameData);
                const appData_application = clsThis.applicationDict?.[appDataNew['application']] || {};
                $(this).find('.app-item-text .app-text-title').text(appDataNew?.['title'] || '');
                $(this).find('.app-item-text .app-text-app').text(appData_application?.['title_i18n'] || '');
                $(this).find('.app-control-item[data-code=amount]').text(
                    renderAmountAndApproved(appDataNew?.['amount'] || '0', appDataNew?.['amount_approved'] || '0')
                );
                confirmUrlAndSetAttr();
                // force to variable data
                appData = {...appData, ...appDataNew};
            });
        }

        if (clsThis.enableAppInfoShow === true) {
            app$.find('.app-item-text').on('click', function (event) {
                event.preventDefault();
                clsThis.load_appData(app$.data(clsThis.appNameData), false);
                clsThis.modalAppConfig$.modal('show');
            });
        }

        if (clsThis.enableAppControl === true){
            // button complete
            if (appData.was_done === false) {
                if (itemData.state === 'CURRENT'){
                    try {
                        const appMin = Number.parseInt(appData.min);
                        if (appData.amount_approved >= appMin){
                            app$.find('.app-control-item[data-code=confirm_complete]').show().on('click', function (event) {
                                event.preventDefault();
                                Swal.fire({
                                    title: $.fn.gettext('Are you sure you have confirmed its completion?'),
                                    html: `
                                        <b class="text-primary mb-3">${itemData?.['title'] || ''}</b>
                                        <br/>
                                        <br/>
                                        <b class="text-primary">${appData?.['title'] + ' - ' || ''} ${appData_application?.['title'] || ''}</b>
                                    `,
                                    icon: "question",
                                    showCancelButton: true,
                                    cancelButtonColor: "#d33",
                                    cancelButtonText: $.fn.gettext('Cancel'),
                                    confirmButtonColor: "#3085d6",
                                    confirmButtonText: $.fn.gettext('Yes')
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        const urlComplete = clsThis.urlAppData.replaceAll('__pk__', appData.id);
                                        $.fn.callAjax2({
                                            url: urlComplete,
                                            method: 'PUT',
                                            data: {
                                                'was_done': true,
                                            }
                                        }).then(
                                            resp => {
                                                const data = $.fn.switcherResp(resp);
                                                if (data){
                                                    $.fn.notifyB({
                                                        'description': $.fn.gettext('Successful')
                                                    }, 'success');
                                                    setTimeout(() => {
                                                        window.location.reload();
                                                    }, 1000);
                                                }
                                            },
                                            errs => $.fn.switcherResp(errs),
                                        )
                                    }
                                });
                            });
                        } else removeControlComplete();
                    } catch (e) {
                        removeControlComplete();
                    }
                } else removeControlComplete();
            } else {
                app$.addClass('stages-item-done');
                removeControlComplete();
            }

            const state = itemData?.['state'];

            // button add
            let isShowAdd = false;
            try {
                if (state === 'DONE' || state === 'CURRENT') {
                    if (appData.max === 'n') {
                        isShowAdd = true;
                    } else {
                        const appMax = Number.parseInt(appData.max);
                        if (appData.amount < appMax) {
                            isShowAdd = true;
                        }
                    }
                }
            } catch (e) {
                removeControlAdd();
            }
            if (isShowAdd === true){
                if (clsThis.redirectMaskUrl) {
                    app$.find('.app-control-item[data-code=add]').show().on('click', function (event) {
                        event.preventDefault();
                        const reLink = getUrlAdd();
                        Swal.fire({
                            title: $.fn.gettext('You are being redirected to the feature creation page.'),
                            html: `
                            <p class="mb-3">${appData_application.title || ''}</p>
                            <a href="${reLink}">
                                ${$.fn.gettext("Or link to here")}
                            </a>
                        `,
                            icon: "warning",
                            timer: 2500,
                            timerProgressBar: true,
                            showCancelButton: true,
                            cancelButtonText: $.fn.gettext('Cancel'),
                            showConfirmButton: true,
                            confirmButtonText: $.fn.gettext('Redirect now'),
                        }).then((result) => {
                            if (result.dismiss === Swal.DismissReason.timer || result.value) {
                                window.location.href = reLink;
                            }
                        })
                    });
                }
            } else removeControlAdd();
            // button amount
            app$.find('.app-control-item[data-code=amount]').show().on('click', function (event) {
                event.preventDefault();
                if (state === 'DONE' || state === 'CURRENT') {
                    // alert(`app: ${appData.application} - ${appData.app_label} - ${appData.mode_code}`);
                    clsThis.load_docData(itemData, appData, appData_application);
                    clsThis.modalDocList$.modal('show');
                }
            });
        }
        return app$
    }

    initModalConfig() {
        const clsThis = this;

        clsThis.modalAppConfig$.find('#app-btn-rule-min-max').on('click', function (event){
            event.preventDefault();
            $(this).siblings('ul').slideToggle('slow');
        })

        const application$ = clsThis.modalAppConfig$.find('select[name=application]');
        application$.initSelect2({
            keyText: 'title_i18n',
            data: this.applicationList.sort((a, b) => a.title_i18n.localeCompare(b.title_i18n)),
        })

        if (this.enableEdit === true) {
            $('body').append(clsThis.modalStageConfig$).append(clsThis.modalAppConfig$);
            const itemValidator = SetupFormSubmit.validate(
                clsThis.modalStageConfig$.find('form'),
                {
                    submitHandler: (form, event) => {
                        event.preventDefault();
                        const frm = new SetupFormSubmit($(form));
                        if (clsThis.debug) console.log('Stage item update:', frm.dataForm);
                        const stagesItem$ = clsThis.modalStageConfig$.data(clsThis.itemModalCurrentData);
                        if (stagesItem$.length > 0) {
                            const processStageData = stagesItem$.data(clsThis.itemNameData);
                            stagesItem$.data(clsThis.itemNameData, {
                                ...processStageData,
                                ...frm.dataForm,
                            }).trigger('data.change.item');
                        }
                        clsThis.modalStageConfig$.modal('hide');
                    }
                }
            );
            clsThis.modalStageConfig$.data('validator', itemValidator);

            const min$ = clsThis.modalAppConfig$.find('form').find(":input[name=min]");
            const max$ = clsThis.modalAppConfig$.find('form').find(":input[name=max]");
            min$.on('change', function (){
                if (max$.val() !== 'n'){
                    const tmpMax = Number.parseInt(max$.val());
                    const tmpMin = Number.parseInt(min$.val());
                    if (tmpMin > tmpMax) {
                        max$.val("");
                    }
                }
            })
            max$.on('change', function (){
                if (max$.val() !== 'n') {
                    const tmpMax = Number.parseInt(max$.val());
                    const tmpMin = Number.parseInt(min$.val());
                    if (tmpMin > tmpMax) {
                        min$.val("");
                    }
                }
            })
            const appValidator = SetupFormSubmit.validate(
                clsThis.modalAppConfig$.find('form'),
                {
                    submitHandler: (form, event) => {
                        event.preventDefault();

                        const app$ = clsThis.modalAppConfig$.data(clsThis.appModalCurrentData);
                        if (app$ && app$.length > 0) {
                            const frm = new SetupFormSubmit($(form));
                            if (clsThis.debug) console.log('App item update:', frm.dataForm);
                            const appConfigData = app$.data(clsThis.appNameData);
                            app$.data(clsThis.appNameData, {
                                ...appConfigData,
                                ...frm.dataForm,
                            }).trigger('data.change');
                            clsThis.modalAppConfig$.modal('hide');
                        }
                    }
                }
            )
            clsThis.modalAppConfig$.data('validator', appValidator);
        }

        if (this.enableAppControl){
            this.modalDocListDataTable = this.modalDocList$.find('table').DataTableDefault({
                styleDom: 'small',
                data: [],
                autoWidth: false,
                rowCallback: function (row, data) {
                    $(row).find('.txt-more').off('click').on('click', function(){
                        $(this).hide(0);
                        $(this).prev('.txt-point').hide(0);
                        $(this).next('.txt-ext').show(0);
                    })
                },
                columns: [
                    {
                        width: '25%',
                        data: 'title',
                        render: data => {
                            if (data){
                                const maxLength = 30;
                                return data.length <= maxLength ? data : `
                                    <span class="txt-min">${data.slice(0, maxLength)}</span>
                                    <span class="txt-point">...</span>
                                    <span class="txt-more" style="color: #006b40;cursor:pointer;">${$.fn.gettext('read more')}</span>
                                    <span class="txt-ext" style="display: none;">${data.slice(maxLength)}</span>
                                `
                            }
                            return '';
                        },
                    },
                    {
                        width: '20%',
                        data: 'employee_created',
                        render: data => {
                            if (data){
                                let avatar_html = '';
                                if (data.avatar_img){
                                    avatar_html = `
                                        <div class="avatar avatar-xs avatar-primary avatar-rounded" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${data?.full_name || ''}">
                                            <img src="${data.avatar_img}" alt="" class="avatar-img">
                                        </div>
                                    `;
                                }
                                return avatar_html + `<span>${data?.['full_name'] || ''}</span>`;
                            }
                            return '';
                        },
                    },
                    {
                        width: '20%',
                        data: 'date_created',
                        render: data => $x.fn.displayRelativeTime(data),
                    },
                    {
                        width: '10%',
                        data: 'system_status',
                        render: data => {
                            return ProcessStages.matchStatusCode(data);
                        },
                    },
                    {
                        width: '25%',
                        data: 'date_status',
                        render: data => {
                            const ele$ = $(`<div></div>`);
                            if (Array.isArray(data)){
                                data.map(
                                    item => {
                                        const status = ProcessStages.matchStatusCode(item?.['status'] || '');
                                        const dtData = item?.['datetime'] || '';
                                        ele$.append(`
                                            <div style="border: 1px solid #f1f1f1;overflow: hidden;padding: 3px;">
                                                <small>${status}</small>
                                                <small>${dtData}</small>
                                            </div>  
                                        `)
                                    }
                                )
                            }
                            return ele$.prop('outerHTML');
                        }
                    }
                ]
            })
        }
    }

    getFullStages() {
        const clsThis = this;

        const stateAppSupport = clsThis.checkExistDataWithApplication();
        if (stateAppSupport){
            let errors = [];
            let stages = [];
            clsThis.target$.find('.' + clsThis.itemClsName).each(function () {
                let application = [];
                $(this).find('.' + clsThis.appClsName).each(function () {
                    application.push(
                        $(this).data(clsThis.appNameData)
                    )
                })

                let itemData = $(this).data(clsThis.itemNameData);
                const stagesData = {
                    ...itemData,
                    'application': application
                }
                const errorData = clsThis.validateStages(stagesData);
                errors = errors.concat(errorData)

                stages.push(stagesData)

            })
            if (stages.length < 3){
                errors.push($.fn.gettext("Process requires at least 1 stage (except system stage)"))
            }

            if (errors.length > 0){
                errors.map(
                    msg => $.fn.notifyB({
                        'description': msg
                    }, 'failure')
                )
                return null;
            }
            return stages
        }
        return null;
    }

    validateStages(stagesData){
        let errors = [];
        const title = stagesData?.['title'] || false;
        const is_system = stagesData?.['is_system'] || false;
        const application = stagesData?.['application'] || [];
        if (is_system === false) {
            if (application && Array.isArray(application) && application.length > 0){
                stagesData['application'].map(
                    appData => {
                        const applicationID = appData?.['application'];
                        if (!$x.fn.checkUUID4(applicationID)) errors.push(
                            $.fn.gettext('Need to select application for all functions')
                        )
                        let minNum = appData?.['min'];
                        let maxNum = appData?.['max'];
                        if (maxNum !== "n"){
                            try {
                                minNum = Number.parseInt(minNum);
                                maxNum = Number.parseInt(maxNum);
                                if (maxNum < minNum) errors.push(
                                    $.fn.gettext('The values of Min and Max are incorrect')
                                )
                            } catch(e) {
                                errors.push(
                                    $.fn.gettext('The values of Min and Max are incorrect')
                                )
                            }
                        }
                    }
                )
            } else {
                errors.push($.fn.gettext('The {stages_name} stages requires at least 1 application').replaceAll('{stages_name}', title));
            }
        }
        return errors;
    }

}