$(function () {
    $(document).ready(function () {
        let eleContainer = $('#chart-container');
        let ajaxUrl = eleContainer.data('url');

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

        function parseParams(obj) {
            let data = $.param({
                'type': obj.type,
                'id': obj.id,
                'action': obj.action
            });
            if (data.length > 0) {
                return '?' + data;
            }
            return '';
        }

        function parseUrl(nodeData) {
            switch (nodeData?.['typeData']) {
                case 0:
                    return ajaxUrl + parseParams({
                        type: 0,
                        id: nodeData.id,
                        action: nodeData.action
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
                        action: nodeData.action
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

        $.fn.callAjax2({
            url: ajaxUrl,
            type: 'GET',
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                eleContainer.orgchart({
                    'data': data?.['org_chart'] || {},
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
                    'exportButtonName': $('#msgPrivate').data('msg-export-to-image'),
                    'exportButton': true,
                    'exportFilename': 'MyOrgChart',
                    'createNode': function ($node, data) {
                        $($node).addClass('data-type-' + data['typeData']);
                    }
                });
            },
            (errs) => {

            }
        )
    })
})