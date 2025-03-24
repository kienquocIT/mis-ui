$(function () {

    $(document).ready(function () {
        let $form = $('#frm_lease_order_config');
        let $btnEdit = $('#btn_edit');
        let $btnSave = $('#btn_save');
        let $assetTypeEle = $('#asset_type_id');
        let $assetGMEle = $('#asset_group_manage_id');
        let $assetGSEle = $('#asset_group_using_id');
        let $toolTypeEle = $('#tool_type_id');
        let $toolGMEle = $('#tool_group_manage_id');
        let $toolGSEle = $('#tool_group_using_id');

        loadDetail();

        function loadInitS2($ele, data = [], dataParams = {}, $modal = null, isClear = false, customRes = {}) {
            let opts = {'allowClear': isClear};
            $ele.empty();
            if (data.length > 0) {
                opts['data'] = data;
            }
            if (Object.keys(dataParams).length !== 0) {
                opts['dataParams'] = dataParams;
            }
            if ($modal) {
                opts['dropdownParent'] = $modal;
            }
            if (Object.keys(customRes).length !== 0) {
                opts['templateResult'] = function (state) {
                    let res1 = ``;
                    let res2 = ``;
                    if (customRes?.['res1']) {
                        res1 = `<span class="badge badge-soft-light mr-2">${state.data?.[customRes['res1']] ? state.data?.[customRes['res1']] : "--"}</span>`;
                    }
                    if (customRes?.['res2']) {
                        res2 = `<span>${state.data?.[customRes['res2']] ? state.data?.[customRes['res2']] : "--"}</span>`;
                    }
                    return $(`<span>${res1} ${res2}</span>`);
                }
            }
            $ele.initSelect2(opts);
            return true;
        }

        // Submit form
        $form.submit(function (e) {
            e.preventDefault()
            let _form = new SetupFormSubmit($(this));
            if ($assetTypeEle.val()) {
                _form.dataForm['asset_type_data'] = SelectDDControl.get_data_from_idx($assetTypeEle, $assetTypeEle.val());
            }
            if ($assetGMEle.val()) {
                _form.dataForm['asset_group_manage_data'] = SelectDDControl.get_data_from_idx($assetGMEle, $assetGMEle.val());
            }
            if ($toolTypeEle.val()) {
                _form.dataForm['tool_type_data'] = SelectDDControl.get_data_from_idx($toolTypeEle, $toolTypeEle.val());
            }
            if ($toolGMEle.val()) {
                _form.dataForm['tool_group_manage_data'] = SelectDDControl.get_data_from_idx($toolGMEle, $toolGMEle.val());
            }
            let asset_gs_data = [];
            for (let gsID of $assetGSEle.val()) {
                asset_gs_data.push(SelectDDControl.get_data_from_idx($assetGSEle, gsID));
            }
            let tool_gs_data = [];
            for (let gsID of $toolGSEle.val()) {
                tool_gs_data.push(SelectDDControl.get_data_from_idx($toolGSEle, gsID));
            }
            _form.dataForm['asset_group_using_data'] = asset_gs_data;
            _form.dataForm['tool_group_using_data'] = tool_gs_data;
            let submitFields = [
                'asset_type_id',
                'asset_type_data',
                'asset_group_manage_id',
                'asset_group_manage_data',
                'asset_group_using_data',
                'tool_type_id',
                'tool_type_data',
                'tool_group_manage_id',
                'tool_group_manage_data',
                'tool_group_using_data',
            ]
            if (_form.dataForm) {
                for (let key in _form.dataForm) {
                    if (!submitFields.includes(key)) delete _form.dataForm[key]
                }
            }
            WindowControl.showLoading();
            $.fn.callAjax2(
                {
                    'url': _form.dataUrl,
                    'method': _form.dataMethod,
                    'data': _form.dataForm,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && (data['status'] === 201 || data['status'] === 200)) {
                        $.fn.notifyB({description: data.message}, 'success');
                        setTimeout(() => {
                            window.location.replace(_form.dataUrlRedirect);
                        }, 2000);
                    }
                }, (err) => {
                    setTimeout(() => {
                        WindowControl.hideLoading();
                    }, 1000)
                    $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
                }
            )
        });

        function loadDetail() {

            loadInitS2($assetTypeEle);
            loadInitS2($assetGMEle);
            loadInitS2($assetGSEle);
            loadInitS2($toolTypeEle);
            loadInitS2($toolGMEle);
            loadInitS2($toolGSEle);

            WindowControl.showLoading();
            $.fn.callAjax2({
                    'url': $form.attr('data-url'),
                    'method': 'GET',
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        loadInitS2($assetTypeEle, [data?.['asset_type_data']]);
                        loadInitS2($assetGMEle, [data?.['asset_group_manage_data']]);
                        loadInitS2($assetGSEle, data?.['asset_group_using_data']);
                        loadInitS2($toolTypeEle, [data?.['tool_type_data']]);
                        loadInitS2($toolGMEle, [data?.['asset_group_manage_data']]);
                        loadInitS2($toolGSEle, data?.['tool_group_using_data']);

                        WindowControl.hideLoading();
                    }
                }
            )

        }

        $btnEdit.on('click', function () {
            $btnEdit[0].setAttribute('hidden', 'true');
            $btnSave[0].removeAttribute('hidden');
        });


    });
});
