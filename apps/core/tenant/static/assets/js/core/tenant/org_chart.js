$(function () {
    $(document).ready(function () {
        let eleContainer = $('#chart-container');
        let ajaxUrl = eleContainer.data('url');
        let progressAll = $('#idxProgressLoadAll');
        let progressAllNum = $('#idxProgressLoadAllNum');
        let percentAll = 0;
        let percentOfEachGroup = 0;
        let maxLevel = 0;

        let sourceActionEle = $('#idx-source-action');
        $('#idx-btn-show').on('click', function (){
            let ele = null;
            switch (sourceActionEle.val()) {
                case 'tenant':
                    ele = eleContainer.find('.data-type-0');
                    break
                case 'company':
                    ele = eleContainer.find('.data-type-1');
                    break
                case 'department':
                    ele = eleContainer.find('.data-type-2');
                    break
                case 'employee':
                    ele = eleContainer.find('.data-type-3');

                    break
            }
            if (ele !== null && ele.length > 0){
                ele.closest('.hierarchy').removeClass('hidden').closest('.nodes').prev('.node').removeClass('hidden-pseudo')
            }
        });
        $('#idx-btn-hide').on('click', function (){
            let ele = null;
            switch (sourceActionEle.val()) {
                case 'tenant':
                    ele = eleContainer.find('.data-type-0');
                    break
                case 'company':
                    ele = eleContainer.find('.data-type-1');
                    break
                case 'department':
                    ele = eleContainer.find('.data-type-2');
                    break
                case 'employee':
                    ele = eleContainer.find('.data-type-3');

                    break
            }
            if (ele !== null && ele.length > 0){
                ele.closest('.hierarchy').addClass('hidden').closest('.nodes').prev('.node').addClass('hidden-pseudo')
            }
        });


        $.fn.OrgChart.prototype.loadNodes = function (rel, url, $edge) {
            let that = this;
            let opts = this.options;
            $.ajax({
                'url': url,
                'dataType': 'json'
            }).done(function (data) {
                let parsedData = data?.['data']?.['org_chart'] || {};
                if (that.$chart.data('inAjax')) {
                    if (rel === 'parent') {
                        if (!$.isEmptyObject(parsedData)) {
                            that.addParent($edge.parent(), parsedData);
                        }
                    } else if (rel === 'children') {
                        if (parsedData.children.length) {
                            that.addChildren($edge.parent(), parsedData[rel]);
                        }
                    } else {
                        that.addSiblings($edge.parent(), parsedData.siblings ? parsedData.siblings : parsedData);
                    }
                    that.triggerLoadEvent($edge.parent(), rel);
                }
            }).fail(function () {
                console.log('Failed to get ' + rel + ' data');
            }).always(function () {
                that.endLoading($edge);
            });
        }
        $.fn.OrgChart.prototype.attachExportButton = function () {
            // allow button custom export is main export
            let that = this;
            let btnExportEle = $('.oc-export-btn');
            if (btnExportEle.length > 0) {
                if (btnExportEle.attr('data-was-regis-click') !== '1') {
                    // don't regis click again when reload data.
                    btnExportEle.attr('data-was-regis-click', '1');
                    btnExportEle.on('click', function (e) {
                        e.preventDefault();
                        that.export();
                    })
                }
            } else {
                let $exportBtn = $('<button>', {
                    'class': 'btn btn-primary oc-export-btn',
                    'text': this.options.exportButtonName,
                    'click': function (e) {
                        e.preventDefault();
                        that.export();
                    }
                });
                this.$chartContainer.after($exportBtn);
            }
        }

        function parseParams(obj) {
            let dataParams = $.param(obj);
            if (dataParams.length > 0) {
                return '?' + dataParams;
            }
            return '';
        }

        function parseUrl(nodeData) {
            // 0: parent
            // 1: children
            // 2: sibling
            // 3: families
            switch (nodeData?.['typeData']) {
                case 0:
                    return ajaxUrl + parseParams({
                        type: 0,
                        id: nodeData.id,
                        action: nodeData.action,
                    });
                case 1:
                    return ajaxUrl + parseParams({
                        type: 1,
                        id: nodeData.id,
                        action: nodeData.action
                    });
                case 2:
                    return ajaxUrl + parseParams({
                        type: 2,
                        id: nodeData.id,
                        action: nodeData.action,
                    });
                case 3:
                    return ajaxUrl + parseParams({
                        type: 3,
                        id: nodeData.id,
                        action: nodeData.action
                    });
            }
        }

        const typeNodeData = {
            0: 'tenant',
            1: 'company',
            2: 'department',
            3: 'employee',
        }
        const typeAction = {
            0: 'parent',
            1: 'children',
            2: 'sibling',
            3: 'families',
        }

        let orgChartCls = null;
        let orgChartGetFirst = null;
        let orgChartGetAll = null;

        function renderOrgChart(data = null) {
            if (orgChartCls === null) {
                orgChartCls = eleContainer.html("").orgchart({
                    'data': data ? data : orgChartGetFirst || {},
                    'ajaxURL': {
                        'parent': function (nodeData) {
                            return parseUrl({
                                ...nodeData,
                                action: 0,
                            })
                        },
                        'children': function (nodeData) {
                            return parseUrl({
                                ...nodeData,
                                action: 1,
                            })
                        },
                        'siblings': function (nodeData) {
                            return parseUrl({
                                ...nodeData,
                                action: 2,
                            })
                        },
                        'families': function (nodeData) {
                            return parseUrl({
                                ...nodeData,
                                action: 3,
                            })
                        }
                    },
                    'nodeContent': 'title',
                    'nodeId': 'id',
                    'exportButtonName': 'Export',
                    'exportButton': true,
                    'exportFilename': 'MyOrgChart',
                    'createNode': function ($node, data) {
                        $($node).addClass('data-type-' + data['typeData']).attr('data-level-offset', data?.['levelOffset'] || '');
                        if (data?.['group_level']) {
                            $($node).find('.title').append(`<span class="badge badge-light badge-sm ml-2" style="font-size: unset;">Lv.${data['group_level']}</span>`)
                        }
                        let levelOffset = data?.['levelOffset'] || -1;
                        if (Number.isInteger(levelOffset) && levelOffset >= 0) {
                            $node.css({
                                'margin-top': (levelOffset * 110) + 'px',
                                '--top': (-11 - levelOffset * 110) + 'px',
                                '--height': (9 + levelOffset * 110) + 'px',
                                '--top-cross-point': (-13 - levelOffset * 70) + 'px',
                                '--height-cross-point': (11 + levelOffset * 70) + 'px'
                            });
                        }
                    }
                });
            } else {
                orgChartCls.init({
                    'data': data ? data : orgChartGetFirst || {},
                })
            }

        }

        function resetPercentProgress(is_hide = null) {
            if (is_hide === true) progressAll.addClass('hidden');
            if (is_hide === false) progressAll.removeClass('hidden');
            progressAllNum.alterClass('w-*').addClass('w-0');
            progressAllNum.attr('aria-valuenow', 0);
            percentAll = 0;
            percentOfEachGroup = 0;
        }

        function pushPercentProgress() {
            if (percentAll % 5 !== 0) percentAll = percentAll - (percentAll % 5) + 5;
            if (percentAll > 100) percentAll = 100;

            progressAllNum.alterClass('w-*').addClass('w-' + percentAll.toString());
            progressAllNum.attr('aria-valuenow', percentAll);

            if (percentAll >= 100) {
                setTimeout(
                    () => {
                        resetPercentProgress(true);
                    },
                    1000
                )
            }
        }

        function calculatePercentProgressAll(groupCount, has_first = true, has_group_done = false) {
            if (has_first === true) {
                percentAll += 10;
                pushPercentProgress();
                if (Number.isInteger(groupCount)) {
                    percentOfEachGroup = Math.floor(90 / groupCount);
                }
            } else if (has_group_done === true) {
                percentAll += percentOfEachGroup;
                pushPercentProgress();
            }
        }

        function setupCallGroup(groupData, groupLevel) {
            $.fn.callAjax2({
                url: ajaxUrl,
                data: {
                    'get_all': '1',
                    'get_all_option': '2',
                    'get_all__group_id': groupData.id,
                },
                type: 'GET',
            }).then(
                (resp) => {
                    calculatePercentProgressAll(null, null, true);
                    let data = $.fn.switcherResp(resp);
                    let levelAllowed = groupLevel + 1;
                    groupData['children'] = (data?.['org_chart'] || []).map(
                        (orgChartChild) => {
                            let typeDataTmp = orgChartChild?.['typeData'] || null;
                            if (typeDataTmp === '3' || typeDataTmp === 3){ // employee
                                let minusTmp = maxLevel - groupLevel;
                                if (minusTmp > 0){
                                    orgChartChild['levelOffset'] = minusTmp;
                                } else {
                                    orgChartChild['levelOffset'] = minusTmp;
                                }
                            } else if (typeDataTmp === '2' || typeDataTmp === 2){ // group
                                orgChartChild['levelOffset'] = orgChartChild?.['group_level'] - levelAllowed;
                            }
                            return orgChartChild;
                        }
                    );
                    renderOrgChart(orgChartGetAll);

                    groupData['children'].map(
                        (maybeGroupOrEmployee) => {
                            let typeDataTmp = maybeGroupOrEmployee?.['typeData'] || null;
                            if (typeDataTmp !== null && (typeDataTmp === '2' || typeDataTmp === 2)) {
                                setupCallGroup(maybeGroupOrEmployee, maybeGroupOrEmployee?.['group_level'] || 1);
                            }
                        }
                    )
                },
            );
        }

        function loopCallGroup() {
            if (Array.isArray(orgChartGetAll?.['children'])) {
                orgChartGetAll['children'].map(
                    (item) => {
                        let levelAllowed = 1;
                        if (item.is_current === true) {
                            $.fn.callAjax2({
                                url: ajaxUrl,
                                data: {
                                    'get_all': '1',
                                    'get_all_option': '1',
                                },
                                type: 'GET',
                            }).then(
                                (resp) => {
                                    let data = $.fn.switcherResp(resp);
                                    item['children'] = (data?.['org_chart'] || []).map(
                                        (groupData)=>{
                                            groupData['levelOffset'] = groupData?.['group_level'] - levelAllowed
                                            return groupData
                                        }
                                    );
                                    renderOrgChart(orgChartGetAll);

                                    item['children'].map(
                                        (groupData) => {
                                            setupCallGroup(groupData, groupData?.['group_level'] || 1);
                                        }
                                    )
                                }
                            )
                        }
                        else {
                            item['relationship'] = '000';
                        }
                        return item;
                    }
                )
            }
        }

        $('.oc-get-all-btn').on('click', function (e) {
            e.preventDefault();
            resetPercentProgress(false);
            percentOfEachGroup = 0;
            $.fn.callAjax2({
                url: ajaxUrl,
                data: {
                    'get_all': '1',
                    'get_all_option': '0',
                },
                type: 'GET',
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    orgChartGetAll = data?.['org_chart'] || {};
                    maxLevel = orgChartGetAll?.['max_level'] || 0;
                    calculatePercentProgressAll(orgChartGetAll?.['group_count'], true);
                    renderOrgChart(orgChartGetAll);
                    loopCallGroup();
                },
                (errs) => {

                }
            )
        });

        $('.oc-reset-first-btn').on('click', function (e) {
            e.preventDefault();
            renderOrgChart();
        })

        $.fn.callAjax2({
            url: ajaxUrl,
            type: 'GET',
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                orgChartGetFirst = data?.['org_chart'] || {};
                renderOrgChart(orgChartGetFirst);
            },
            (errs) => {

            }
        )
    })
})