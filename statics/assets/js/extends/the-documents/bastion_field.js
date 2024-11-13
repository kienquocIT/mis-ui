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

    getOppFlag(key = null) {
        let data = Object.keys(this.getOppFlagData).length > 0 ? this.getOppFlagData : {
            'has': (this.mainDiv.data('has_opp') === '1' || this.mainDiv.data('has_opp') === 1),
            'disabled': (this.mainDiv.data('opp_disabled') === '1' || this.mainDiv.data('opp_disabled') === 1),
            'required': (this.mainDiv.data('opp_required') === '1' || this.mainDiv.data('opp_required') === 1),
            'readonly': (this.mainDiv.data('opp_readonly') === '1' || this.mainDiv.data('opp_readonly') === 1),
            'hidden': (this.mainDiv.data('opp_hidden') === '1' || this.mainDiv.data('opp_hidden') === 1),
            'title': this.mainDiv.data('opp_title'),
        };
        data['showing'] = data['has'] === true && data['hidden'] === false;
        if (key) return data[key];
        return data;
    }

    getPrjFlag(key = null) {
        let data = Object.keys(this.getPrjFlagData).length > 0 ? this.getPrjFlagData : {
            'has': (this.mainDiv.data('has_prj') === '1' || this.mainDiv.data('has_prj') === 1),
            'disabled': (this.mainDiv.data('prj_disabled') === '1' || this.mainDiv.data('prj_disabled') === 1),
            'required': (this.mainDiv.data('prj_required') === '1' || this.mainDiv.data('prj_required') === 1),
            'readonly': (this.mainDiv.data('prj_readonly') === '1' || this.mainDiv.data('prj_readonly') === 1),
            'hidden': (this.mainDiv.data('prj_hidden') === '1' || this.mainDiv.data('prj_hidden') === 1),
            'title': this.mainDiv.data('prj_title'),
        };
        data['showing'] = data['has'] === true && data['hidden'] === false;
        if (key) return data[key];
        return data;
    }

    getInheritFlag(key = null) {
        let data = Object.keys(this.getInheritFlagData).length > 0 ? this.getInheritFlagData : {
            'has': (this.mainDiv.data('has_inherit') === '1' || this.mainDiv.data('has_inherit') === 1),
            'disabled': (this.mainDiv.data('inherit_disabled') === '1' || this.mainDiv.data('inherit_disabled') === 1),
            'required': (this.mainDiv.data('inherit_required') === '1' || this.mainDiv.data('inherit_required') === 1),
            'readonly': (this.mainDiv.data('inherit_readonly') === '1' || this.mainDiv.data('inherit_readonly') === 1),
            'hidden': (this.mainDiv.data('inherit_hidden') === '1' || this.mainDiv.data('inherit_hidden') === 1),
            'title': this.mainDiv.data('inherit_title'),
            'data': this.empInheritEle.data('onload') || [],
        };
        data['showing'] = data['has'] === true && data['hidden'] === false;
        if (key) return data[key];
        return data;
    }

    getProcessFlag(key = null) {
        let data = Object.keys(this.getProcessFlagData).length > 0 ? this.getProcessFlagData : {
            'has': (this.mainDiv.data('has_process') === '1' || this.mainDiv.data('has_process') === 1),
            'disabled': (this.mainDiv.data('process_disabled') === '1' || this.mainDiv.data('process_disabled') === 1),
            'required': (this.mainDiv.data('process_required') === '1' || this.mainDiv.data('process_required') === 1),
            'readonly': (this.mainDiv.data('process_readonly') === '1' || this.mainDiv.data('process_readonly') === 1),
            'hidden': (this.mainDiv.data('process_hidden') === '1' || this.mainDiv.data('process_hidden') === 1),
            'title': this.mainDiv.data('process_title'),
        };
        data['showing'] = data['has'] === true && data['hidden'] === false;
        data['not_change'] = data['disabled'] === true || data['readonly'] === true;
        if (key) return data[key];
        return data;
    }

    static getFeatureCode() {
        return new BastionFieldControl().mainDiv.data('current-feature');
    }

    constructor(opts) {
        this.getOppFlagData = {};
        this.getPrjFlagData = {};
        this.getInheritFlagData = {};
        this.getProcessFlagData = {};

        this.getPrjFlag();
        this.getOppFlag();
        this.getInheritFlag();
        this.getProcessFlag();

        this.has_opp = $x.fn.popKey(opts, 'has_opp', this.getOppFlag('has'), true);
        this.has_prj = $x.fn.popKey(opts, 'has_prj', this.getProcessFlag('has'), true);
        this.has_inherit = $x.fn.popKey(opts, 'has_inherit', this.getInheritFlag('has'), true);
        this.has_process = $x.fn.popKey(opts, 'has_process', this.getProcessFlag('has'), true);

        this.data_opp = $x.fn.popKey(opts, 'data_opp', [], true);
        this.data_prj = $x.fn.popKey(opts, 'data_prj', [], true);
        this.data_inherit = $x.fn.popKey(opts, 'data_inherit', this.getInheritFlag('data'), true);
        this.data_process = $x.fn.popKey(opts, 'data_process', [], true);

        this.not_change_opp = $x.fn.popKey(opts, 'not_change_opp', this.getOppFlag('not_change'), true);
        this.not_change_process = $x.fn.popKey(opts, 'not_change_process', this.getProcessFlag('not_change'), true);

        this.opp_call_trigger_change = $x.fn.popKey(opts, 'opp_call_trigger_change', false, true);
        this.prj_call_trigger_change = $x.fn.popKey(opts, 'prj_call_trigger_change', false, true);
        this.inherit_call_trigger_change = $x.fn.popKey(opts, 'inherit_call_trigger_change', false, true);
        this.process_call_trigger_change = $x.fn.popKey(opts, 'process_call_trigger_change', false, true);

        // data_*: [{"id": "XXXX", "title": "XXXXX", "selected": true}]

        this.realOppData = Array.isArray(this.data_opp) ? this.data_opp : [];
        this.realPrjData = Array.isArray(this.data_prj) ? this.data_prj : [];
        this.realProcessData = Array.isArray(this.data_process) ? this.data_process : [];

        this.paramsInheritor = {'data-onload': Array.isArray(this.data_inherit) ? this.data_inherit : []};
    }

    initOppSelect(opts) {
        let dataOnload = opts?.['data-onload'] || [];
        if (this.oppEle instanceof jQuery && this.oppEle.length === 1) {
            // active events
            this.mainDiv.trigger('bastionField.preInit:opp');
            this.oppEle.trigger('bastionField.preInit:opp');

            // not allow change opp | use for create new from Opp
            if (this.not_change_opp === true) this.oppEle.attr('readonly', 'readonly').closest('.form-group').css('cursor', 'not-allowed');

            // main
            let clsThis = this;
            let config = {
                'allowClear': true,
                'dataParams': {
                    'list_from_app': this.mainDiv.data('current-feature').trim(),
                    'is_deal_close': false
                },
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
            this.oppEle.initSelect2(config).on('change', function () {
                let hasVal = !!$(this).val();

                // re-check inherit
                clsThis.initInheritSelect({
                    'data-params': hasVal ? {
                        'list_from_opp': $(this).val(),
                    } : {},
                });

                // re-check project
                if (clsThis.getPrjFlag('showing') === true && hasVal) {
                    if (clsThis.getPrjFlag('disabled') === false) clsThis.prjEle.prop('disabled', hasVal);
                    if (clsThis.getPrjFlag('readonly') === false) clsThis.prjEle.prop('readonly', hasVal);
                }
            });
            if (this.opp_call_trigger_change === true) this.oppEle.trigger('change');

            // active events
            this.mainDiv.trigger('bastionField.init:opp');
            this.oppEle.trigger('bastionField.init:opp');
        }
    }

    initPrjSelect(opts) {
        let dataOnload = opts?.['data-onload'] || [];
        if (this.prjEle instanceof jQuery && this.prjEle.length === 1) {
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
                // this.prjEle.attr('data-onload', JSON.stringify(dataOnload));
                config['data'] = dataOnload;
            }
            this.prjEle.initSelect2(config).on('change', function () {
                let hasVal = !!$(this).val();

                // re-check inherit
                clsThis.initInheritSelect({
                    'data-params': hasVal ? {
                        'list_from_prj': $(this).val(),
                    } : {}
                });

                // re-check project
                if (clsThis.getOppFlag('showing') === true && hasVal) {
                    if (clsThis.getOppFlag('disabled') === false) clsThis.oppEle.prop('disabled', hasVal);
                    if (clsThis.getOppFlag('readonly') === false) clsThis.oppEle.prop('readonly', hasVal);
                }
            });
            if (this.prj_call_trigger_change === true) this.prjEle.trigger('change');

            // active events
            this.mainDiv.trigger('bastionField.init:prj');
            this.prjEle.trigger('bastionField.init:prj');
        }
    }

    initInheritSelect(opts) {
        if (this.empInheritEle instanceof jQuery && this.empInheritEle.length === 1) {
            // active events
            this.mainDiv.trigger('bastionField.preInit:inherit');
            this.prjEle.trigger('bastionField.preInit:inherit');

            // init input value
            let dataOnload = opts?.['data-onload'] || null;

            let paramData = opts?.['data-params'] || null;
            if (!(paramData && typeof paramData === 'object')) paramData = {};
            paramData['list_from_app'] = this.mainDiv.data('current-feature').trim();
            let paramDataBase = this.empInheritEle.attr('data-params');
            if (paramDataBase) {
                try {
                    paramData = {...paramData, ...JSON.parse(paramDataBase)}
                } catch (e) {
                }
            }

            let stateHasSelect2 = this.empInheritEle.destroySelect2();
            if (stateHasSelect2 === true) this.empInheritEle.removeAttr('data-onload');

            let config = {
                allowClear: true,
                cache: true,
                dataParams: paramData
            };
            if (dataOnload !== undefined && dataOnload !== null && dataOnload.length > 0) {
                config['data'] = dataOnload;
            }

            this.empInheritEle.initSelect2(config).on('change', function () {
            });
            if (this.inherit_call_trigger_change) this.empInheritEle.trigger('change');

            // active events
            this.mainDiv.trigger('bastionField.init:inherit');
            this.prjEle.trigger('bastionField.init:inherit');
        }
    }

    initProcessSelect(opts) {
        let dataOnload = opts?.['data-onload'] || [];
        if (this.processEle instanceof jQuery && this.processEle.length === 1) {
            // active events
            this.mainDiv.trigger('bastionField.preInit:process');
            this.processEle.trigger('bastionField.preInit:process');

            // not allow change opp | use for create new from Opp
            if (this.not_change_process === true) this.processEle.attr('readonly', 'readonly').closest('.form-group').css('cursor', 'not-allowed');

            // main
            let config = {
                'allowClear': true,
                'dataParams': {
                    'belong_to_me': '1',
                },
                cache: true,
            }
            if (dataOnload !== undefined && dataOnload !== null && dataOnload.length > 0) {
                config['data'] = dataOnload;
            }
            this.processEle.initSelect2(config);
            if (this.process_call_trigger_change === true) this.processEle.trigger('change');

            // active events
            this.mainDiv.trigger('bastionField.init:opp');
            this.oppEle.trigger('bastionField.init:opp');
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
        if (this.mainDiv instanceof jQuery && this.mainDiv.length === 1) {
            this.mainDiv.trigger('bastionField.preInit');

            if (this.has_inherit === true) this.initInheritSelect(this.getParamsInitOfInheritor()); else this.empInheritEle.prop('disabled', true).attr('readonly', 'readonly');

            if (this.has_opp === true) this.initOppSelect({'data-onload': this.realOppData}); else this.oppEle.prop('disabled', true).attr('readonly', 'readonly');

            if (this.has_prj === true) this.initPrjSelect({'data-onload': this.realPrjData}); else this.prjEle.prop('disabled', true).attr('readonly', 'readonly');

            if (this.has_process === true) this.initProcessSelect({'data-onload': this.realProcessData}); else this.processEle.prop('disabled', true).attr('readonly', 'readonly');

            this.mainDiv.trigger('bastionField.init');
        }
    }
}
