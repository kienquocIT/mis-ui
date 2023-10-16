class BastionFieldControl {
    static getFeatureCode() {
        return new BastionFieldControl().mainDiv.data('current-feature');
    }

    getOppFlag(key = null) {
        let data = {
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
        let data = {
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
        let data = {
            'has': (this.mainDiv.data('has_inherit') === '1' || this.mainDiv.data('has_inherit') === 1),
            'disabled': (this.mainDiv.data('inherit_disabled') === '1' || this.mainDiv.data('inherit_disabled') === 1),
            'required': (this.mainDiv.data('inherit_required') === '1' || this.mainDiv.data('inherit_required') === 1),
            'readonly': (this.mainDiv.data('inherit_readonly') === '1' || this.mainDiv.data('inherit_readonly') === 1),
            'hidden': (this.mainDiv.data('inherit_hidden') === '1' || this.mainDiv.data('inherit_hidden') === 1),
            'title': this.mainDiv.data('inherit_title'),
        };
        data['showing'] = data['has'] === true && data['hidden'] === false;
        if (key) return data[key];
        return data;
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
                'dataParams': {'list_from_app': this.mainDiv.data('current-feature').trim()},
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
                if (clsThis.getPrjFlag('showing') === true) {
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
                ajax: {
                    url: '/project/list/api',
                    type: 'GET',
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && data.hasOwnProperty('project_list')) {
                            return data['project_list'];
                        }
                        return [];
                    }
                },
                'dataParams': {'list_from_app': this.mainDiv.data('current-feature').trim()},
                'allowClear': true,
                cache: true,
            }
            if (dataOnload !== undefined && dataOnload !== null && dataOnload.length > 0) {
                this.prjEle.attr('data-onload', JSON.stringify(dataOnload));
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
                if (clsThis.getOppFlag('showing') === true) {
                    if (clsThis.getOppFlag('disabled') === false) clsThis.oppEle.prop('disabled', hasVal);
                    if (clsThis.getOppFlag('readonly') === false) clsThis.oppEle.prop('readonly', hasVal);
                }
            }).trigger('change');

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
                this.empInheritEle.attr('data-onload', JSON.stringify(dataOnload));
                // config['data'] = dataOnload;
            }

            this.empInheritEle.initSelect2(config).on('change', function () {});
            if (this.inherit_call_trigger_change) this.empInheritEle.trigger('change');

            // active events
            this.mainDiv.trigger('bastionField.init:inherit');
            this.prjEle.trigger('bastionField.init:inherit');
        }
    }

    mockupPrjData() {
        $.mockjax({
            url: "/project/list/api",
            contentType: "application/json",
            responseText: {
                data: {
                    'project_list': [
                        {
                            'id': '1',
                            'title': 'Prj 1'
                        }, {
                            'id': '2',
                            'title': 'Prj 2'
                        }, {
                            'id': '3',
                            'title': 'Prj 3'
                        },
                    ]
                }
            }
        });
    }

    mainDiv = $('#bastionFieldTheDocument');
    oppEle = $('#opportunity_id')
    prjEle = $('#project_id');
    empInheritEle = $('#employee_inherit_id');

    constructor(opts) {
        this.has_opp = $x.fn.popKey(opts, 'has_opp', false, true);
        this.has_prj = $x.fn.popKey(opts, 'has_prj', false, true);
        this.has_inherit = $x.fn.popKey(opts, 'has_inherit', false, true);
        this.data_opp = $x.fn.popKey(opts, 'data_opp', [], true);
        this.data_prj = $x.fn.popKey(opts, 'data_prj', [], true);
        this.data_inherit = $x.fn.popKey(opts, 'data_inherit', [], true);
        this.not_change_opp = $x.fn.popKey(opts, 'not_change_opp', false, true);

        this.opp_call_trigger_change = $x.fn.popKey(opts, 'opp_call_trigger_change', false, true);
        this.prj_call_trigger_change = $x.fn.popKey(opts, 'prj_call_trigger_change', false, true);
        this.inherit_call_trigger_change = $x.fn.popKey(opts, 'inherit_call_trigger_change', false, true);
        // data_*: [{"id": "XXXX", "title": "XXXXX", "selected": true}]
    }

    init() {
        this.mockupPrjData();
        if (this.mainDiv instanceof jQuery && this.mainDiv.length === 1) {
            this.mainDiv.trigger('bastionField.preInit');

            if (this.has_inherit === true) this.initInheritSelect({'data-onload': Array.isArray(this.data_inherit) ? this.data_inherit : []});
            else this.empInheritEle.prop('disabled', true).attr('readonly', 'readonly');

            if (this.has_opp === true) this.initOppSelect({'data-onload': Array.isArray(this.data_opp) ? this.data_opp : []});
            else this.oppEle.prop('disabled', true).attr('readonly', 'readonly');

            if (this.has_prj === true) this.initPrjSelect({'data-onload': Array.isArray(this.data_prj) ? this.data_prj : []});
            else this.prjEle.prop('disabled', true).attr('readonly', 'readonly');

            this.mainDiv.trigger('bastionField.init');
        }
    }
}
