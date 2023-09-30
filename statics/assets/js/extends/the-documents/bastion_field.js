class BastionFieldControl {
    static getFeatureCode() {
        return new BastionFieldControl().mainDiv.data('current-feature');
    }

    mainDiv = $('#bastionFieldTheDocument');
    oppEle = $('#opportunity')
    prjEle = $('#project');
    empInheritEpe = $('#employee_inherit');

    updateParamsOfEmployee(data) {
        if (this.empInheritEpe instanceof jQuery && this.empInheritEpe.length === 1) {
            let paramData = JSON.parse(this.empInheritEpe.attr('data-params'));

            if (paramData.hasOwnProperty('opp_id')) delete paramData['opp_id'];
            if (paramData.hasOwnProperty('prj_id')) delete paramData['prj_id'];

            this.empInheritEpe.attr('data-params', JSON.stringify({...paramData, ...data}));
        }
    }

    initOppSelect(dataOnload) {
        if (this.oppEle instanceof jQuery && this.oppEle.length === 1) {
            // active events
            this.mainDiv.trigger('bastionField.preInit:opp');
            this.oppEle.trigger('bastionField.preInit:opp');

            let clsThis = this;
            let config = {
                'allowClear': true,
                cache: true,
            }
            if (dataOnload !== undefined && dataOnload !== null && dataOnload.length > 0) {
                this.oppEle.attr('data-onload', JSON.stringify(dataOnload));
            }

            this.oppEle.initSelect2(config).on('change', function () {
                // re-check inherit
                clsThis.updateParamsOfEmployee({
                    'id': 'e2666a9a-4c70-425d-b865-930bb9ca11ab',
                    'opp_id': $(this).val(),
                });
                clsThis.initInheritSelect();

                // re-check project
                let hasVal = !!$(this).val();
                clsThis.prjEle.prop('disabled', hasVal).prop('readonly', hasVal);
            });

            // active events
            this.mainDiv.trigger('bastionField.init:opp');
            this.oppEle.trigger('bastionField.init:opp');
        }
    }

    initPrjSelect(dataOnload) {
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
                allowClear: true,
                cache: true,
            }
            if (dataOnload !== undefined && dataOnload !== null && dataOnload.length > 0) {
                this.prjEle.attr('data-onload', JSON.stringify(dataOnload));
            }
            this.prjEle.initSelect2(config).on('change', function () {
                // re-check inherit
                clsThis.updateParamsOfEmployee({
                    'id': '7f410335-2942-40da-b6e9-78eea4e6f47f',
                    'prj_id': $(this).val(),
                });
                clsThis.initInheritSelect();

                // re-check project
                let hasVal = !!$(this).val();
                clsThis.oppEle.prop('disabled', hasVal).prop('readonly', hasVal);
            });

            // active events
            this.mainDiv.trigger('bastionField.init:prj');
            this.prjEle.trigger('bastionField.init:prj');
        }
    }

    initInheritSelect(dataOnload) {
        if (this.empInheritEpe instanceof jQuery && this.empInheritEpe.length === 1) {
            // active events
            this.mainDiv.trigger('bastionField.preInit:inherit');
            this.prjEle.trigger('bastionField.preInit:inherit');

            let clsThis = this;
            let config = {
                'allowClear': true,
                cache: true,
            }
            if (dataOnload !== undefined && dataOnload !== null && dataOnload.length > 0) {
                this.empInheritEpe.attr('data-onload', JSON.stringify(dataOnload));
            }
            if (this.empInheritEpe.hasClass("select2-hidden-accessible")) {
                this.empInheritEpe.val("").select2('destroy');
            }
            this.empInheritEpe.initSelect2(config).on('change', function () {

            })

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

    init(
        has_opp = true, has_prj = true, has_inherit = true,
        data_opp=[], data_prj=[], data_inherit=[],
    ) {
        this.mockupPrjData();
        if (this.mainDiv instanceof jQuery && this.mainDiv.length === 1) {
            this.mainDiv.trigger('bastionField.preInit');
            if (has_opp === true) this.initOppSelect(Array.isArray(data_opp) ? data_opp : []);
            if (has_prj === true) this.initPrjSelect(Array.isArray(data_prj) ? data_prj : []);
            if (has_inherit === true) this.initInheritSelect(Array.isArray(data_inherit) ? data_inherit : []);
            this.mainDiv.trigger('bastionField.init');
        }
    }
}
