function onLoadDropdownInfoInherit(eleInfo, eleInfoData, selectedData) {
    eleInfoData.find('.emp-info-detail-first-name').val(selectedData['first_name']);
    eleInfoData.find('.emp-info-detail-last-name').val(selectedData['last_name']);
    eleInfoData.find('.emp-info-detail-email').val(selectedData['email']);
    eleInfoData.find('.emp-info-detail-is-active').prop('checked', !!selectedData['is_active']);
    return eleInfo;
}

function onLoadDropdownInfoOpp(eleInfo, eleInfoData, selectedData) {
    eleInfoData.find('.opp-info-detail-title').val(selectedData['title']);
    eleInfoData.find('.opp-info-detail-code').val(selectedData['code']);
    return eleInfo;
}

function onLoadDropdownInfoProcess(eleInfo, eleInfoData, selectedData) {
    eleInfoData.find('.process-info-detail-title').val(selectedData['title']);
    eleInfoData.find('.process-info-detail-code').val(selectedData['code']);
    return eleInfo;
}

class BastionFieldControl {
    static defaultOpts = {
        // has_opp: false,
        // has_prj: false,
        // has_inherit: false,
        // has_process: false,

        // data_inherit: [
        //     {
        //         "id": "",
        //         "title": "",
        //         "first_name": "",
        //         "last_name": "",
        //         "email": "",
        //         "is_active": false,
        //         "selected": true,
        //     }
        // ],
        // data_opp: [
        //     {
        //         "id": "",
        //         "title": "",
        //         "code": "",
        //         "selected": true,
        //     }
        // ],
        // data_prj: [
        //     {
        //         "id": "",
        //         "title": "",
        //         "selected": true,
        //     }
        // ],
        // data_process: [
        //     {
        //         "id": "",
        //         "title": "",
        //         "selected": true,
        //     }
        // ],

        // not_change_opp: false,
        // not_change_process: false,

        // opp_call_trigger_change: false,
        // prj_call_trigger_change: false,
        // inherit_call_trigger_change: false,
        // process_call_trigger_change: false,
    }

    mainDiv = $('#bastionFieldTheDocument');
    oppEle = $('#opportunity_id')
    prjEle = $('#project_id');
    empInheritEle = $('#employee_inherit_id');
    processEle = $('#process_id');
    processStageAppEle$ = $('#process_stage_app_id');

    get getOppFlag() {
        let data = {
            'has': (this.mainDiv.data('has_opp') === '1' || this.mainDiv.data('has_opp') === 1),
            'disabled': (this.mainDiv.data('opp_disabled') === '1' || this.mainDiv.data('opp_disabled') === 1),
            'required': (this.mainDiv.data('opp_required') === '1' || this.mainDiv.data('opp_required') === 1),
            'readonly': (this.mainDiv.data('opp_readonly') === '1' || this.mainDiv.data('opp_readonly') === 1),
            'hidden': (this.mainDiv.data('opp_hidden') === '1' || this.mainDiv.data('opp_hidden') === 1),
            'title': this.mainDiv.data('opp_title'),
        };
        data['showing'] = data['has'] === true && data['hidden'] === false;
        return data;
    }

    get getPrjFlag() {
        let data = {
            'has': (this.mainDiv.data('has_prj') === '1' || this.mainDiv.data('has_prj') === 1),
            'disabled': (this.mainDiv.data('prj_disabled') === '1' || this.mainDiv.data('prj_disabled') === 1),
            'required': (this.mainDiv.data('prj_required') === '1' || this.mainDiv.data('prj_required') === 1),
            'readonly': (this.mainDiv.data('prj_readonly') === '1' || this.mainDiv.data('prj_readonly') === 1),
            'hidden': (this.mainDiv.data('prj_hidden') === '1' || this.mainDiv.data('prj_hidden') === 1),
            'title': this.mainDiv.data('prj_title'),
        };
        data['showing'] = data['has'] === true && data['hidden'] === false;
        return data;
    }

    get getInheritFlag() {
        let data = {
            'has': (this.mainDiv.data('has_inherit') === '1' || this.mainDiv.data('has_inherit') === 1),
            'disabled': (this.mainDiv.data('inherit_disabled') === '1' || this.mainDiv.data('inherit_disabled') === 1),
            'required': (this.mainDiv.data('inherit_required') === '1' || this.mainDiv.data('inherit_required') === 1),
            'readonly': (this.mainDiv.data('inherit_readonly') === '1' || this.mainDiv.data('inherit_readonly') === 1),
            'hidden': (this.mainDiv.data('inherit_hidden') === '1' || this.mainDiv.data('inherit_hidden') === 1),
            'title': this.mainDiv.data('inherit_title'),
            'data': this.empInheritEle.data('onload') || [],
        };
        data['showing'] = data['has'] === true && data['hidden'] === false;
        return data;
    }

    get getProcessFlag() {
        let data = {
            'has': (this.mainDiv.data('has_process') === '1' || this.mainDiv.data('has_process') === 1),
            'disabled': (this.mainDiv.data('process_disabled') === '1' || this.mainDiv.data('process_disabled') === 1),
            'required': (this.mainDiv.data('process_required') === '1' || this.mainDiv.data('process_required') === 1),
            'readonly': (this.mainDiv.data('process_readonly') === '1' || this.mainDiv.data('process_readonly') === 1),
            'hidden': (this.mainDiv.data('process_hidden') === '1' || this.mainDiv.data('process_hidden') === 1),
            'title': this.mainDiv.data('process_title'),
        };
        data['showing'] = data['has'] === true && data['hidden'] === false;
        data['not_change'] = data['disabled'] === true || data['readonly'] === true;
        return data;
    }

    static getFeatureCode() {
        return new BastionFieldControl().mainDiv.data('current-feature');
    }

    static getAppId() {
        return new BastionFieldControl().mainDiv.data('current-app-id');
    }

    static skipBastionChange = 'change_from_bastion_config';

    getStateDisabled(config) {
        let disable = config?.['disabled'] || false;
        let readonly = config?.['readonly'] || false;
        let not_change = config?.['not_change'] || false;
        return disable || readonly || not_change;
    }

    constructor(opts) {
        const allConfigDefault = {
            'has': false,
            'disabled': true,
            'required': false,
            'readonly': true,
            'hidden': true,
            'title': '',
            'data': [],
        }
        this.AllOppConfig = {...allConfigDefault, ...this.getOppFlag, ...opts?.['oppFlagData']};
        this.AllPrjConfig = {...allConfigDefault, ...this.getPrjFlag, ...opts?.['prjFlagData']};
        this.AllInheritConfig = {...allConfigDefault, ...this.getInheritFlag, ...opts?.['inheritFlagData']};
        this.AllProcessConfig = {...allConfigDefault, ...this.getProcessFlag, ...opts?.['processFlagData']};
        this.AllProcessStageAppConfig = {...allConfigDefault, ...this.getProcessFlag, ...opts?.['processStageAppFlagData']};

        this.has_opp = opts?.['has_opp'] || this.AllOppConfig['has'];
        this.has_prj = opts?.['has_prj'] || this.AllPrjConfig['has'];
        this.has_inherit = opts?.['has_inherit'] || this.AllInheritConfig['has'];
        this.has_process = opts?.['has_process'] || this.AllProcessConfig['has'];

        this.data_opp = opts?.['data_opp'] || this.AllOppConfig['data'];
        this.data_prj = opts?.['data_prj'] || this.AllPrjConfig['data'];
        this.data_inherit = opts?.['data_inherit'] || this.AllInheritConfig['data'];
        this.data_process = opts?.['data_process'] || this.AllProcessConfig['data'];
        this.data_process_stage_app = opts?.['data_process_stage_app'] || this.AllProcessStageAppConfig['data'];

        this.not_change_opp = opts?.['not_change_opp'] || this.AllOppConfig['not_change'];
        this.not_change_process = opts?.['not_change_process'] || this.AllProcessConfig['not_change'];

        this.opp_call_trigger_change = opts?.['opp_call_trigger_change'] || false;
        this.prj_call_trigger_change = opts?.['prj_call_trigger_change'] || false;
        this.inherit_call_trigger_change = opts?.['inherit_call_trigger_change'] || false;
        this.process_call_trigger_change = opts?.['process_call_trigger_change'] || false;

        this.realOppData = Array.isArray(this.data_opp) ? this.data_opp : [];
        this.realPrjData = Array.isArray(this.data_prj) ? this.data_prj : [];
        this.realProcessData = Array.isArray(this.data_process) ? this.data_process : [];
        this.realProcessStageAppData = Array.isArray(this.data_process_stage_app) ? this.data_process_stage_app : [];

        this.paramsInheritor = {'data': Array.isArray(this.data_inherit) ? this.data_inherit : []};
    }

    configOppSelect(opts) {
        return {
            'allowClear': true,
            'dataParams': {
                'list_from_app': this.mainDiv.data('current-feature').trim(),
                'is_deal_close': false
            },
            templateResult: function (state) {
                let titleHTML = `<span>${state.data?.title ? state.data.title : state.title ? state.title : "_"}</span>`
                let codeHTML = `<span class="badge badge-soft-primary mr-2">${state.text ? state.text : "_"}</span>`
                return $(`<span>${codeHTML} ${titleHTML}</span>`);
            },
            cache: true,
            ...opts,
            'disabled': this.getStateDisabled(this.AllOppConfig),
        }
    }

    initOppSelect(opts) {
        if (this.oppEle instanceof jQuery && this.oppEle.length === 1 && !this.oppEle.hasClass("select2-hidden-accessible")) {
            // active events
            this.mainDiv.trigger('bastionField.preInit:opp');
            this.oppEle.trigger('bastionField.preInit:opp');

            // not allow change opp | use for create new from Opp
            if (this.not_change_opp === true) this.oppEle.attr('readonly', 'readonly').closest('.form-group').css('cursor', 'not-allowed');

            // main
            let clsThis = this;
            this.oppEle.destroySelect2();
            this.oppEle.initSelect2(clsThis.configOppSelect(opts)).on('change', function (event, data) {
                if (data === BastionFieldControl.skipBastionChange) return;  // skip on first change from bastion config

                const oppIDSelected = $(this).val();
                let hasVal = !!oppIDSelected;

                clsThis.callLinkedData('opp');

                // re-check project
                if (clsThis.AllPrjConfig['showing'] === true && hasVal) {
                    if (clsThis.AllPrjConfig['disabled'] === false) clsThis.prjEle.prop('disabled', hasVal);
                    if (clsThis.AllPrjConfig['readonly'] === false) clsThis.prjEle.prop('readonly', hasVal);
                }
            });
            if (this.opp_call_trigger_change === true) this.oppEle.trigger('change', BastionFieldControl.skipBastionChange);

            // active events
            this.mainDiv.trigger('bastionField.init:opp');
            this.oppEle.trigger('bastionField.init:opp');
        }
    }

    initPrjSelect(opts) {
        if (this.prjEle instanceof jQuery && this.prjEle.length === 1 && !this.prjEle.hasClass("select2-hidden-accessible")) {
            let dataOnload = opts?.['data'] || [];
            // active events
            this.mainDiv.trigger('bastionField.preInit:prj');
            this.prjEle.trigger('bastionField.preInit:prj');

            let clsThis = this;
            let config = {
                'allowClear': true,
                'dataParams': {'list_from_app': this.mainDiv.data('current-feature').trim()},
                templateResult: function (state) {
                    let titleHTML = `<span>${state.data?.title ? state.data.title : "_"}</span>`
                    let codeHTML = `<span class="badge badge-soft-primary mr-2">${state.text ? state.text : "_"}</span>`
                    return $(`<span>${codeHTML} ${titleHTML}</span>`);
                },
                cache: true,
            }
            if (dataOnload !== undefined && dataOnload !== null && dataOnload.length > 0) {
                config['data'] = dataOnload;
            }
            this.prjEle.initSelect2(config).on('change', function (event, data) {
                if (data === BastionFieldControl.skipBastionChange) return;  // skip on first change from bastion config

                let PrjHasVal = !!$(this).val();

                // re-check inherit
                clsThis.initInheritSelect({
                    'data-params': PrjHasVal ? {
                        'list_from_prj': $(this).val(),
                    } : {}
                });

                // re-check project
                if (clsThis.AllOppConfig?.['showing'] === true && PrjHasVal) {
                    if (clsThis.AllOppConfig?.['disabled'] === false) clsThis.oppEle.prop('disabled', PrjHasVal);
                    if (clsThis.AllOppConfig?.['readonly'] === false) clsThis.oppEle.prop('readonly', PrjHasVal);
                }
            });
            if (this.prj_call_trigger_change === true) this.prjEle.trigger('change', BastionFieldControl.skipBastionChange);

            // active events
            this.mainDiv.trigger('bastionField.init:prj');
            this.prjEle.trigger('bastionField.init:prj');
        }
    }

    configInheritSelect(opts) {
        let paramData = opts?.['data-params'] || null;
        if (!(paramData && typeof paramData === 'object')) paramData = {};
        paramData['list_from_app'] = this.mainDiv.data('current-feature').trim();
        let paramDataBase = this.empInheritEle.attr('data-params');
        this.empInheritEle.removeAttr('data-onload');
        if (paramDataBase) {
            try {
                paramData = {...paramData, ...JSON.parse(paramDataBase)}
            } catch (e) {
            }
        }

        return {
            allowClear: true,
            cache: true,
            dataParams: paramData, ...opts,
            'disabled': this.getStateDisabled(this.AllInheritConfig),
        };
    }

    initInheritSelect(opts) {
        if (this.empInheritEle instanceof jQuery && this.empInheritEle.length === 1 && !this.empInheritEle.hasClass("select2-hidden-accessible")) {
            // active events
            this.mainDiv.trigger('bastionField.preInit:inherit');
            this.prjEle.trigger('bastionField.preInit:inherit');

            this.empInheritEle.initSelect2(this.configInheritSelect(opts)).on('change', function (event, data) {
                if (data === BastionFieldControl.skipBastionChange) return;  //
            });
            if (this.inherit_call_trigger_change) this.empInheritEle.trigger('change', BastionFieldControl.skipBastionChange);

            // active events
            this.mainDiv.trigger('bastionField.init:inherit');
            this.prjEle.trigger('bastionField.init:inherit');
        }
    }

    configProcessSelect(opts) {
        return {
            'allowClear': true,
            'dataParams': {
                'belong_to_me': '1',
            }, ...opts,
            'disabled': this.getStateDisabled(this.AllProcessConfig),
        }
    }

    initProcessSelect(opts) {
        const clsThis = this;
        if (this.processEle instanceof jQuery && this.processEle.length === 1) {
            // active events
            this.mainDiv.trigger('bastionField.preInit:process');
            this.processEle.trigger('bastionField.preInit:process');

            // not allow change opp | use for create new from Opp
            if (this.not_change_process === true) this.processEle.attr('readonly', 'readonly').closest('.form-group').css('cursor', 'not-allowed');

            // main
            this.processEle.initSelect2(clsThis.configProcessSelect(opts)).on('change', function (event, data) {
                if (data === BastionFieldControl.skipBastionChange) return;  // skip on first change from bastion config

                clsThis.callLinkedData('process');
            });
            if (this.process_call_trigger_change === true) this.processEle.trigger('change', BastionFieldControl.skipBastionChange);

            // active events
            this.mainDiv.trigger('bastionField.init:process');
            this.processEle.trigger('bastionField.init:process');
        }
    }

    configProcessStageAppSelect(opts) {
        const dataParams = opts?.['dataParams'] || {};
        let extParams = {'was_done': false};
        const appId = BastionFieldControl.getAppId();
        if (appId) extParams['application_id'] = appId;
        let ctx = {
            'allowClear': true,
            ...opts,
            'dataParams': {
                ...dataParams,
                ...extParams,
            },
            'disabled': this.getStateDisabled(this.AllProcessStageAppConfig),
        }
        return ctx;
    }

    initProcessStageAppSelect(opts) {
        // Keep init process before init stage app
        if (this.processStageAppEle$ instanceof jQuery && this.processStageAppEle$.length === 1 && !this.processStageAppEle$.hasClass("select2-hidden-accessible")) {
            const clsThis = this;
            // active events
            this.mainDiv.trigger('bastionField.preInit:processStageApp');
            this.processStageAppEle$.trigger('bastionField.preInit:processStageApp');

            // not allow change opp | use for create new from Opp
            if (this.not_change_process === true) this.processStageAppEle$.attr('readonly', 'readonly').closest('.form-group').css('cursor', 'not-allowed');

            // main
            let processStageAppParams = {};
            if (this.processEle.val()) processStageAppParams['process_id'] = this.processEle.val();
            this.processStageAppEle$.initSelect2({
                ...clsThis.configProcessStageAppSelect(opts),
                dataParams: processStageAppParams,
            }).on('change', function (event, data) {
                if (data === BastionFieldControl.skipBastionChange) return;  // skip on first change from bastion config

                clsThis.callLinkedData('process_stage_app');
            });
            if (this.process_call_trigger_change === true) this.processStageAppEle$.trigger('change', BastionFieldControl.skipBastionChange);

            // active events
            this.mainDiv.trigger('bastionField.init:processStageApp');
            this.processStageAppEle$.trigger('bastionField.init:processStageApp');
        }
    }

    getParamsInitOfInheritor() {
        let params = {};
        if (this.realOppData.length > 0) {
            let oppSelectedIdx = null;
            for (let idx in this.realOppData) {
                if (this.realOppData[idx].selected === true && $x.fn.checkUUID4(this.realOppData[idx].id)) {
                    oppSelectedIdx = this.realOppData[idx].id;
                    break;
                }
            }
            if (oppSelectedIdx) params['list_from_opp'] = oppSelectedIdx;
        } else if (this.realPrjData.length > 0) {
            let prjSelectedIdx = null;
            for (let idx in this.realPrjData) {
                if (this.realPrjData[idx].selected === true && $x.fn.checkUUID4(this.realPrjData[idx].id)) {
                    prjSelectedIdx = this.realPrjData[idx].id;
                }
            }
            if (prjSelectedIdx) params['list_from_prj'] = prjSelectedIdx;
        }
        this.paramsInheritor['data-params'] = params;
        return this.paramsInheritor;
    }

    init() {
        if (this.mainDiv instanceof jQuery && this.mainDiv.length === 1 && !this.processEle.hasClass("select2-hidden-accessible")) {
            this.mainDiv.trigger('bastionField.preInit');

            if (this.has_inherit === true) this.initInheritSelect(this.getParamsInitOfInheritor()); else this.empInheritEle.prop('disabled', true).attr('readonly', 'readonly');

            if (this.has_opp === true) this.initOppSelect({'data': this.realOppData}); else this.oppEle.prop('disabled', true).attr('readonly', 'readonly');

            if (this.has_prj === true) this.initPrjSelect({'data': this.realPrjData}); else this.prjEle.prop('disabled', true).attr('readonly', 'readonly');

            if (this.has_process === true) {
                this.initProcessSelect({'data': this.realProcessData});
                this.initProcessStageAppSelect({'data': this.realProcessStageAppData});
            } else {
                this.processEle.prop('disabled', true).attr('readonly', 'readonly');
                this.processStageAppEle$.prop('disable', true).attr('readonly', 'readonly');
            }

            this.mainDiv.trigger('bastionField.init');
        }
    }

    _callLinkedData(filterData) {
        const clsThis = this;
        $.fn.callAjax2({
            url: clsThis.processEle.data('url-data-match') + '?' + $.param({
                ...filterData,
                'app_id': BastionFieldControl.getAppId(),
            }),
            method: 'GET',
            isLoading: true,
            loadingOpts: {
                'html': $.fn.gettext('Retrieving Opportunity Data that has been linked to Process') + '...',
            },
        }).then(resp => {
            const data = $.fn.switcherResp(resp);
            if (data) {
                const linkedData = data?.['opp_process_stage_app'];
                clsThis.selectedFillAllData(linkedData);
            }
        })
    }

    callLinkedData(from_app) {
        const clsThis = this;
        let filterData = {
            'opp_id': clsThis.oppEle.val() ? clsThis.oppEle.val() : null,
            'process_id': clsThis.processEle.val() ? clsThis.processEle.val() : null,
            'process_stage_id': clsThis.processStageAppEle$.val() ? clsThis.processStageAppEle$.val() : null,
        };

        if (from_app === 'opp') {
            filterData['opp_id'] ? clsThis._callLinkedData({
                'opp_id': filterData['opp_id']
            }) : clsThis.selectedFillAllData({});
        } else if (from_app === 'process') {
            if (filterData['opp_id']) {
                if (filterData['process_id']) {
                    clsThis._callLinkedData({
                        'process_id': filterData['process_id']
                    });
                } else {
                    const oppSelectedData = SelectDDControl.get_data_from_idx(clsThis.oppEle, filterData['opp_id']);
                    clsThis.selectedFillAllData({
                        'opp': {
                            'id': filterData['opp_id'], ...oppSelectedData,
                        },
                    })
                }
            } else {
                filterData['opp_id'] = null;
                filterData['process_stage_id'] = null;
                clsThis._callLinkedData({
                    'process_id': filterData['process_id']
                });
            }
        } else if (from_app === 'process_stage_app') {
            if (filterData['process_stage_id'] && (!filterData['opp_id'] || !filterData['process_id'])) clsThis._callLinkedData({
                'process_stage_id': filterData['process_stage_id']
            });
        }
    }

    _selectedFillAllData(linkedData) {
        const clsThis = this;
        let resolveData = {
            'opp': {},
            'process': {},
            'process_stage_app': {}, ...linkedData
        };

        clsThis.oppEle.destroySelect2();
        clsThis.oppEle.empty().initSelect2(clsThis.configOppSelect({
            data: resolveData?.['opp'] ? [
                {
                    ...resolveData['opp'],
                    'selected': true,
                }
            ] : []
        }));

        // process
        clsThis.processEle.destroySelect2();
        clsThis.processEle.empty().initSelect2(clsThis.configProcessSelect({
            dataParams: {
                'belong_to_me': '1', ...(resolveData?.['opp']?.['id'] ? {'opp_id': resolveData?.['opp']?.['id']} : {}),
            },
            data: resolveData?.['process'] ? [
                {
                    ...resolveData['process'],
                    'selected': true,
                }
            ] : [],
        }));

        // stage app
        clsThis.processStageAppEle$.destroySelect2();
        const appId = BastionFieldControl.getAppId();
        clsThis.processStageAppEle$.initSelect2(clsThis.configProcessStageAppSelect({
            dataParams: resolveData?.['process'] ? {
                'process_id': resolveData['process']['id'], ...appId && $x.fn.checkUUID4(appId) ? {'application_id': appId} : {},
            } : {},
            data: resolveData?.['process_stage_app'] ? [
                {
                    ...resolveData['process_stage_app'],
                    'selected': true,
                }
            ] : [],
        }));

        // inherit
        const oppID = clsThis.oppEle.val();
        const processID = clsThis.processEle.val();
        let dataParams = {};
        if (oppID && $x.fn.checkUUID4(oppID)) dataParams['list_from_opp'] = oppID;
        if (processID && $x.fn.checkUUID4(processID)) dataParams['process_id'] = processID;
        clsThis.empInheritEle.destroySelect2();
        clsThis.empInheritEle.empty().initSelect2(clsThis.configInheritSelect({
            'data-params': dataParams,
        }));
    }

    selectedFillAllData(linkedData) {
        // linkedData = {
        //     'opp': {
        //         'id': '',
        //         'title': '',
        //         'code': '',
        //     },
        //     'process': {
        //         'id': '',
        //         'title': '',
        //         'remarks': '',
        //     },
        //     'process_stage_app': {
        //         'id': '',
        //         'title': '',
        //         'remarks': '',
        //     },
        // };
        setTimeout(
            () => this._selectedFillAllData(linkedData),
            100
        )
    }
}
