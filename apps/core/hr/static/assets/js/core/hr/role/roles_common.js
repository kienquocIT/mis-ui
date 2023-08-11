class RoleLoadPage {
    static memberEle = $('#selectMembers');

    static loadMembers(memberDatas, opts) {
        RoleLoadPage.memberEle.initSelect2({
            allowClear: true,
            data: memberDatas,
            templateResult: function (state) {
                let groupHTML = `<span class="badge badge-soft-primary">${state.data?.group?.title ? state.data.group.title : "_"}</span>`
                let activeHTML = state.data?.is_active === true ? `<span class="badge badge-success badge-indicator"></span>` : `<span class="badge badge-light badge-indicator"></span>`;
                return $(`<span>${state.text} ${activeHTML} ${groupHTML}</span>`);
            },
        });
    }

    static combinesMembers() {
        return RoleLoadPage.memberEle.val();
    }
}

class RoleForm {
    static titleEle = $('#title');
    static codeEle = $('#abbreviation')

    constructor(props) {
        this.frm = props?.['form'];
    }

    static loadDetail(detailData, memberOpts) {
        RoleForm.titleEle.val(detailData?.title || '');
        RoleForm.codeEle.val(detailData?.abbreviation || '');
        RoleLoadPage.loadMembers(detailData?.holder || [], memberOpts || {});
        new HandlePlanApp().appendPlanAppOfEmployee(detailData?.plan_app || []);
    }

    combinesForm(isSubmit = false) {
        if (this.frm) {
            let frm = new SetupFormSubmit($(this.frm));
            frm.dataForm['employees'] = RoleLoadPage.combinesMembers();
            frm.dataForm['plan_app'] = new HandlePlanApp().combinesData();
            if (isSubmit === true) {
                $x.fn.showLoadingPage();
                return $.fn.callAjax2({
                    url: frm.dataUrl,
                    method: frm.dataMethod,
                    data: frm.dataForm,
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: $.fn.transEle.attr('data-success')}, 'success');
                            if ($(this.frm).attr('data-url-redirect')) {
                                $.fn.redirectUrl($(this.frm).attr('data-url-redirect'), 1000);
                            } else {
                                setTimeout(
                                    () => {
                                        window.location.reload()
                                    },
                                    1000
                                )
                            }
                        }
                        $x.fn.hideLoadingPage();
                    },
                    (errs) => {
                        $.fn.switcherResp(errs);
                        $x.fn.hideLoadingPage();
                    }
                )
            } else {
                return {
                    url: frm.dataUrl,
                    method: frm.dataMethod,
                    data: frm.dataForm,
                };
            }
        } else {
            throw Error('Form is not found');
        }
    }
}