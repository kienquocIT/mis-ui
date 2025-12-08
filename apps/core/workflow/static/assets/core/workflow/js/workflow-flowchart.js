/***
 * list of node user has declare and default system node
 * ***/
let DEFAULT_NODE_LIST = {};
let has_edited = false;
let nodeChanged = false
/***
 * on click in connection of JSPlumbs open modal config associate
 */
class FlowChartLoadDataHandle {
    static $modal = $('#conditionModal');
    static $btnSave = $('#btn-save-condition');
    static $transEle = $('#node-trans-factory');
    static dataOperatorAndOr = [
        {'id': "AND", 'title': FlowChartLoadDataHandle.$transEle.attr('data-and')},
        {'id': "OR", 'title': FlowChartLoadDataHandle.$transEle.attr('data-or')},
    ];
    static dataOperatorMath = [
        {"id": "=", "title": "="},
        {"id": "!=", "title": "≠"},
        {"id": ">", "title": ">"},
        {"id": "<", "title": "<"},
        {"id": ">=", "title": "≥"},
        {"id": "<=", "title": "≤"},
        {"id": "is", "title": FlowChartLoadDataHandle.$transEle.attr('data-is')},
        {"id": "contains", "title": FlowChartLoadDataHandle.$transEle.attr('data-contains')},
        {"id": "not_contain", "title": FlowChartLoadDataHandle.$transEle.attr('data-not-contain')},
    ]

    static loadInitS2($ele, data = [], dataParams = {}, $modal = null, isClear = false, customRes = {}) {
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
    };

    static clickConnection(connect) {
        let node_in = parseInt(connect.component.source.dataset.drag);
        let node_out = parseInt(connect.component.target.dataset.drag);
        let targetID = node_in + '_' + node_out;
        FlowChartLoadDataHandle.$btnSave.attr('data-node-in', node_in);
        FlowChartLoadDataHandle.$btnSave.attr('data-node-out', node_out);

        let data_cond = [];
        let $eleAssociate = $('#node-associate');
        if ($eleAssociate.val()) {
            let associate_data_json = JSON.parse($eleAssociate.val());
            if (associate_data_json?.[targetID]) {
                data_cond = associate_data_json?.[targetID];
            }
        }
        let associateData = FlowJsP.getAssociate;
        if (associateData) {
            if (associateData?.[targetID]) {
                data_cond = associateData?.[targetID];
            }
        }

        FlowChartLoadDataHandle.loadRenderCondition(data_cond?.['condition']);
        FlowChartLoadDataHandle.loadConditionData(data_cond?.['condition']);
        let $tabProperty = $('#tab_formula_property');
        $tabProperty.addClass('show');
        $tabProperty.addClass('active');

        FlowChartLoadDataHandle.$modal.modal('show');
    };

    static loadRenderCondition(conditions) {
        let modalBodyCondEle = FlowChartLoadDataHandle.$modal[0].querySelector('.modal-body-cond');
        if (modalBodyCondEle) {
            if (conditions.length === 0) {
                conditions = [[{"left_show": "", "left_cond": [], "right_show": "", "right_cond": []}, "AND"], "AND"];
            }
            let htmlBody = FlowChartLoadDataHandle.loadConditionHTML(conditions);
            $(modalBodyCondEle).empty();
            $(modalBodyCondEle).append(`<div data-bs-spy="scroll" data-bs-target="#scrollspy_demo_h" data-bs-smooth-scroll="true" class="h-500p position-relative overflow-y-scroll scroll-cond">${htmlBody}</div>`)
        }
    };

    static loadConditionHTML(conditions) {
        let htmlBody = ``;
        let htmlAndOr = ``;
        let htmlCond = ``;
        let order = 0;
        for (let condition of conditions) {
            order++;
            if (Array.isArray(condition)) {
                htmlAndOr = ``;
                let orderChild = 0;
                for (let cond of condition) {
                    orderChild++;
                    if (typeof cond === 'object' && cond !== null && !Array.isArray(cond)) {
                        htmlCond += `<div class="row param-child">
                                    <div class="col-12 col-md-5 col-lg-5">
                                        <div class="d-flex align-items-center">
                                            <textarea class="form-control left-param left-param-${order}-${orderChild}" rows="2" readonly></textarea>
                                            <button
                                                type="button"
                                                class="btn btn-icon btn-rounded btn-soft-light btn-sm btn-cond"
                                                data-bs-toggle="offcanvas"
                                                data-bs-target="#formulaCanvas"
                                                data-cls-target="left-param-${order}-${orderChild}"
                                            ><i class="fas fa-edit"></i>
                                            </button>      
                                        </div>
                                    </div>
                                    <div class="col-12 col-md-2 col-lg-2">
                                        <select class="form-select operator-math operator-math-${order}-${orderChild}"></select>
                                    </div>
                                    <div class="col-12 col-md-5 col-lg-5">
                                        <div class="d-flex align-items-center">
                                            <textarea class="form-control right-param right-param-${order}-${orderChild}" rows="2" readonly></textarea>
                                            <button
                                                type="button"
                                                class="btn btn-icon btn-rounded btn-soft-light btn-sm btn-cond"
                                                data-bs-toggle="offcanvas"
                                                data-bs-target="#formulaCanvas"
                                                data-cls-target="right-param-${order}-${orderChild}"
                                            ><i class="fas fa-edit"></i>
                                            </button>      
                                        </div>
                                    </div>
                                </div>`;
                    }
                    if (typeof cond === 'string') {
                        let clsMain = "";
                        let disabled = "";
                        let hiddenDel = "";
                        if (orderChild <= 2) {
                            clsMain = "operator-and-or-child-main";
                            hiddenDel = "hidden";
                        }
                        if (orderChild > 2) {
                            disabled = "disabled";
                        }
                        htmlCond += `<div class="row">
                                        <div class="col-12 col-md-1 col-lg-1">
                                            <select class="form-select operator-and-or-child ${clsMain} operator-and-or-${order}-${orderChild}" ${disabled}></select>
                                        </div>
                                        <div class="col-12 col-md-11 col-lg-11">
                                            <div class="d-flex justify-content-end">
                                                <button class="btn btn-icon btn-rounded btn-flush-secondary flush-soft-hover btn-sm mr-4 btn-del-block-cond-child" data-idx="${order}-${orderChild}" ${hiddenDel}><span class="icon"><i class="fas fa-trash-alt"></i></span></button>
                                            </div>
                                        </div>
                                    </div><br>`;
                    }
                }
            }
            if (typeof condition === 'string') {
                let clsMain = "";
                let disabled = "";
                if (order <= 2) {
                    clsMain = "operator-and-or-main";
                }
                if (order > 2) {
                    disabled = "disabled";
                }
                htmlAndOr = `<select class="form-select operator-and-or ${clsMain} operator-and-or-${order}" ${disabled}></select>`;

                htmlBody += `<hr><div class="row block-cond">
                                    <div class="col-12 col-md-1 col-lg-1">${htmlAndOr}</div>
                                    <div class="col-12 col-md-11 col-lg-11 block-cond-child">
                                        ${htmlCond}
                                        <div class="d-flex justify-content-between">
                                            <button type="button" class="btn btn-primary btn-add-block-cond-child" data-idx="${order-1}">
                                                <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${FlowChartLoadDataHandle.$transEle.attr('data-add')}</span></span>
                                            </button>
                                            <button type="button" class="btn btn-outline-secondary btn-del-block-cond mr-5" data-idx="${order}">
                                                <span><span class="icon"><i class="fas fa-trash-alt"></i></span><span>${FlowChartLoadDataHandle.$transEle.attr('data-delete-block')}</span></span>
                                            </button>
                                        </div>
                                    </div>
                                </div>`;
                htmlCond = ``;
            }
        }
        return htmlBody;
    };

    static loadConditionData(conditions) {
        let modalBodyCondEle = FlowChartLoadDataHandle.$modal[0].querySelector('.modal-body-cond');
        if (modalBodyCondEle) {
            if (conditions.length === 0) {
                conditions = [[{"left_show": "", "left_cond": [], "right_show": "", "right_cond": []}, "AND"], "AND"];
            }
            let order = 0;
            for (let condition of conditions) {
                order++;
                if (Array.isArray(condition)) {
                    let orderChild = 0;
                    for (let cond of condition) {
                        orderChild++;
                        if (typeof cond === 'object' && cond !== null && !Array.isArray(cond)) {
                            let leftEle = modalBodyCondEle.querySelector(`.left-param-${order}-${orderChild}`);
                            let mathEle = modalBodyCondEle.querySelector(`.operator-math-${order}-${orderChild}`);
                            let rightEle = modalBodyCondEle.querySelector(`.right-param-${order}-${orderChild}`);
                            if (leftEle && mathEle && rightEle) {
                                if (cond?.['left_show'] && cond?.['left_cond']) {
                                    $(leftEle).val(cond?.['left_show']);
                                    $(leftEle).attr('data-formula', JSON.stringify(cond?.['left_cond']));
                                }
                                FlowChartLoadDataHandle.loadInitS2($(mathEle), FlowChartLoadDataHandle.dataOperatorMath);
                                $(mathEle).val("=").trigger('change');
                                if (cond?.['operator']) {
                                    $(mathEle).val(cond?.['operator']).trigger('change');
                                }
                                if (cond?.['right_show'] && cond?.['right_cond']) {
                                    $(rightEle).val(cond?.['right_show']);
                                    $(rightEle).attr('data-formula', JSON.stringify(cond?.['right_cond']));
                                }
                            }
                        }
                        let operatorAndOrEle = modalBodyCondEle.querySelector(`.operator-and-or-${order}-${orderChild}`);
                        if (operatorAndOrEle) {
                            FlowChartLoadDataHandle.loadInitS2($(operatorAndOrEle), FlowChartLoadDataHandle.dataOperatorAndOr);
                            $(operatorAndOrEle).val(condition).trigger('change');
                        }
                    }
                }
                if (typeof condition === 'string') {
                    let operatorAndOrEle = modalBodyCondEle.querySelector(`.operator-and-or-${order}`);
                    if (operatorAndOrEle) {
                        FlowChartLoadDataHandle.loadInitS2($(operatorAndOrEle), FlowChartLoadDataHandle.dataOperatorAndOr);
                        $(operatorAndOrEle).val(condition).trigger('change');
                    }
                }
            }
        }
    };

    static loadAddBlockCond() {
        let operatorAndOrMainEle = FlowChartLoadDataHandle.$modal[0].querySelector('.operator-and-or-main');
        if (operatorAndOrMainEle) {
            if ($(operatorAndOrMainEle).val()) {
                let dataCondition = FlowChartLoadDataHandle.loadSetupCondition();
                dataCondition.push([{
                    "left_show": "",
                    "left_cond": [],
                    "right_show": "",
                    "right_cond": []
                }, "AND"], $(operatorAndOrMainEle).val());
                FlowChartLoadDataHandle.loadRenderCondition(dataCondition);
                FlowChartLoadDataHandle.loadConditionData(dataCondition);
            }
        }
    };

    static loadAddBlockCondChild(ele) {
        let blockCondChildEle = ele.closest('.block-cond-child');
        if (blockCondChildEle) {
            let operatorAndOrChildMainEle = blockCondChildEle.querySelector('.operator-and-or-child-main');
            if (operatorAndOrChildMainEle) {
                if ($(operatorAndOrChildMainEle).val() && $(ele).attr('data-idx')) {
                    let idx = parseInt($(ele).attr('data-idx'));
                    let dataCondition = FlowChartLoadDataHandle.loadSetupCondition();
                    let count = 0;
                    for (let dataCond of dataCondition) {
                        count++;
                        if (count === idx) {
                            dataCond.push({
                                "left_show": "",
                                "left_cond": [],
                                "right_show": "",
                                "right_cond": []
                            })
                            dataCond.push($(operatorAndOrChildMainEle).val());
                            break;
                        }
                    }
                    FlowChartLoadDataHandle.loadRenderCondition(dataCondition);
                    FlowChartLoadDataHandle.loadConditionData(dataCondition);
                }
            }
        }
    };

    static loadDeleteBlockCond(ele) {
        if ($(ele).attr('data-idx')) {
            let idx = parseInt($(ele).attr('data-idx'));
            let dataCondition = FlowChartLoadDataHandle.loadSetupCondition();
            let count = 0;
            for (let dataCond of dataCondition) {
                count++;
                if (count === idx) {
                    dataCondition.splice(count - 1, 1);
                    dataCondition.splice(count - 2, 1);
                    break;
                }
            }
            FlowChartLoadDataHandle.loadRenderCondition(dataCondition);
            FlowChartLoadDataHandle.loadConditionData(dataCondition);
        }
        return true;
    };

    static loadDeleteBlockCondChild(ele) {
        if ($(ele).attr('data-idx')) {
            let parts = $(ele).attr('data-idx').split("-");
            let idx = parseInt(parts[0]);
            let idxChild = parseInt(parts[1]);
            let dataCondition = FlowChartLoadDataHandle.loadSetupCondition();
            let count = 0;
            for (let dataCond of dataCondition) {
                count++;
                if (count === idx) {
                    let countChild = 0;
                    for (let data of dataCond) {
                        countChild++;
                        if (countChild === idxChild) {
                            dataCond.splice(countChild - 1, 1);
                            dataCond.splice(countChild - 2, 1);
                            break;
                        }
                    }
                    break;
                }
            }
            FlowChartLoadDataHandle.loadRenderCondition(dataCondition);
            FlowChartLoadDataHandle.loadConditionData(dataCondition);
        }
        return true;
    };

    static loadSaveCondition() {
        if (FlowChartLoadDataHandle.$btnSave.attr('data-node-in') && FlowChartLoadDataHandle.$btnSave.attr('data-node-out')) {
            let target = FlowChartLoadDataHandle.$btnSave.attr('data-node-in') + "_" + FlowChartLoadDataHandle.$btnSave.attr('data-node-out');
            let nodeIn = parseInt(FlowChartLoadDataHandle.$btnSave.attr('data-node-in'));
            let nodeOut = parseInt(FlowChartLoadDataHandle.$btnSave.attr('data-node-out'));
            let dataCondition = FlowChartLoadDataHandle.loadSetupCondition();
            // add new association to flowchart class
            let getAssoc = FlowJsP.getAssociate
            getAssoc[target] = {
                "node_in": nodeIn, "node_out": nodeOut, "condition": dataCondition
            }
            FlowJsP.setAssociateList = getAssoc;
            $('#node-associate').val(JSON.stringify(getAssoc));
        }
        return true;
    };

    static loadSetupCondition() {
        let result = [];
        for (let blockCondEle of FlowChartLoadDataHandle.$modal[0].querySelectorAll('.block-cond')) {
            let dataCondChild = [];
            let dataChildParam = [];
            let dataChildOperator = [];
            let blockCondChildEle = blockCondEle.querySelector('.block-cond-child');
            if (blockCondChildEle) {
                for (let paramChildEle of blockCondChildEle.querySelectorAll('.param-child')) {
                    let params = {};
                    let leftEle = paramChildEle.querySelector('.left-param');
                    let mathEle = paramChildEle.querySelector('.operator-math');
                    let rightEle = paramChildEle.querySelector('.right-param');
                    if (leftEle && mathEle && rightEle) {
                        if ($(leftEle).val() && $(leftEle).attr('data-formula')) {
                            params['left_show'] = $(leftEle).val();
                            params['left_cond'] = JSON.parse($(leftEle).attr('data-formula'));
                        }
                        if ($(mathEle).val()) {
                            params['operator'] = $(mathEle).val();
                        }
                        if ($(rightEle).val() && $(rightEle).attr('data-formula')) {
                            params['right_show'] = $(rightEle).val();
                            params['right_cond'] = JSON.parse($(rightEle).attr('data-formula'));
                        }
                    }
                    dataChildParam.push(params);
                }
                for (let operatorAndOrChildEle of blockCondChildEle.querySelectorAll('.operator-and-or-child')) {
                    if ($(operatorAndOrChildEle).val()) {
                        dataChildOperator.push($(operatorAndOrChildEle).val())
                    }
                }
                //
                if (dataChildParam.length === dataChildOperator.length) {
                    let i = 0;
                    for (let item of dataChildParam) {
                        dataCondChild.push(item);
                        dataCondChild.push(dataChildOperator[i]);
                    }
                }
                result.push(dataCondChild);
            }
            let operatorAndOrEle = blockCondEle.querySelector('.operator-and-or');
            if (operatorAndOrEle) {
                if ($(operatorAndOrEle).val()) {
                    result.push($(operatorAndOrEle).val());
                }
            }
        }
        return result;
    };


}





/*** plus/minus button increase/decrease size of drop space
 * if size of space is less than default size -> do nothing
 */
function extendDropSpace() {
    let target_elm = $('#flowchart_workflow')
    let default_h = target_elm.height();
    let default_w = target_elm.width();
    $('.btn-extend_space').off().on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        let current_h = target_elm.height();
        let current_w = target_elm.width();
        if ($(this).attr('data-btn-type') === 'plus') {
            // plus space
            target_elm.css({
                'height': current_h + 300, 'width': current_w + 300
            })
        } else {
            // minus space
            if (!((current_h - 300) < default_h) || !((current_w - 300) < default_w)) {
                target_elm.css({
                    "height": current_h - 300, "width": current_w - 300
                })
            }
        }

    })
}

class JSPlumbsHandle {
    nodeData = {};  // storage all node with {"id_node": "Object config node"}
    associationData = []; // storage association Data // [{'node_in': '', 'node_out': ''},]
    clsManage = new NodeHandler(this.nodeData, this.associationData); // class to check for connection the validation
    _commitNodeList = {};
    _ASSOCIATION = [];
    static $flowChart = $('#flowchart_workflow');
    static $trans = $('#node-trans-factory');

    static instance = jsPlumb.getInstance({
        ConnectionOverlays: [
            ["Arrow", {location: 1, id: "arrow", length: 12, width: 12, height: 13, foldback: 1}],
        ],
        Container: "flowchart_workflow",
    });

    static initDragFromNodeBox(ele) {
        let clsSys = '';
        let bg = '';
        let color = 'text-white';
        let clsModal = "modal";
        let disabled = "";
        let hidden = "";
        let endPointsHTML = `<div class="drag-handle jsplumb-handle"></div>
                            <div class="drop-target jsplumb-handle"></div>`;
        if (ele.classList.contains('control-system')) {
            clsSys = 'clone-system';
            bg = 'bg-white';
            color = '';
        }
        if ($(ele).attr("data-code") === "initial") {
            endPointsHTML = `<div class="drag-handle jsplumb-handle"></div>`;
            hidden = "hidden";
        }
        if ($(ele).attr("data-code") === "approved") {
            disabled = "disabled";
            endPointsHTML = `<div class="drop-target jsplumb-handle"></div>`;
        }
        // if ($(ele).attr("data-code") === "completed") {
        //     disabled = "disabled";
        //     endPointsHTML = `<div class="drop-target jsplumb-handle"></div>`;
        // }
        return `<div class="btn-group dropdown">
                    <div class="clone ${clsSys} ${bg}" data-drag="${$(ele).attr('data-drag')}" title="${$(ele).find('.drag-title').text()}" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ${disabled}>
                        <p class="drag-title ${color}">${$(ele).find('.drag-title').text()}</p>
                        ${endPointsHTML}
                    </div>
                    <div class="dropdown-menu dropdown-bordered w-160p">
                        <a class="dropdown-item config-node" data-bs-toggle="${clsModal}" data-bs-target="#nodeModal"><i class="dropdown-icon fas fa-cog"></i><span>${JSPlumbsHandle.$trans.attr('data-config')}</span></a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item del-node ${hidden}"><i class="dropdown-icon fas fa-trash-alt"></i><span>${JSPlumbsHandle.$trans.attr('data-delete')}</span></a>
                    </div>
                </div>`;
    };

    static handleNodeDrop(ui, that_cls, top_coord = null, left_coord = null) {
        // when user drag to space clone and disable main node
        let clone = $(ui.helper).clone(true);
        let numID = ui.draggable.attr('data-drag');
        let is_id = 'control-' + numID;
        clone.find('.clone').attr("id", is_id);
        if (top_coord && left_coord) {
            clone.css({top: top_coord, left: left_coord, position: 'absolute'});
        }
        clone.appendTo(JSPlumbsHandle.$flowChart[0]);
        let $this_elm = ui.draggable;
        if ($this_elm.hasClass("ui-draggable")) {
            $this_elm.draggable("disable");
        }
        JSPlumbsHandle.instance.draggable(is_id);
        let sys_code = "";
        // check default system node
        for (let idx in DEFAULT_NODE_LIST) {
            let item = DEFAULT_NODE_LIST[idx];
            if (item.order === parseInt(ui.draggable.attr('data-drag'))) {
                if (item.hasOwnProperty('code_node_system')) {
                    if (item?.['code_node_system'] !== null) {
                        sys_code = item.code_node_system.toLowerCase();
                    }
                }
                break;
            }
        }
        JSPlumbsHandle.makeSourceTarget(is_id, sys_code);
        // add drop node to commit node list
        let temp = that_cls.getCommitNode;
        temp[numID] = DEFAULT_NODE_LIST[numID];
        that_cls.setCommitNodeList = temp;
    };

    static makeSourceTarget(is_id, sys_code) {
        const element = document.getElementById(is_id);
        if (!element) {
            return false;
        }
        if (sys_code === 'initial' || sys_code === "") {
            JSPlumbsHandle.instance.makeSource(element, {
                filter: ".drag-handle",
                endpoint: ["Dot", {radius: 4}],
                // anchor: ["Bottom", "BottomRight", "BottomLeft"],
                anchor: "BottomCenter",
                isSource: true,
                connectorOverlays: [
                    ["Label",
                        {
                            label: '',
                            location: 0.5,
                            cssClass: "cssAssociateLabel",
                            events: {
                                click: function (labelOverlay) {
                                    FlowChartLoadDataHandle.clickConnection(labelOverlay)
                                }
                            },
                        },
                    ]
                ],
                maxConnections: -1,
                connectionsDetachable: true,
                endpointStyle: {fill: "#374986", opacity: ".8"},
                HoverPaintStyle: {strokeStyle: "#1e8151", lineWidth: 4},
                connectionType: "pink-connection",
                // connector: ["Flowchart", {cornerRadius: 5}],
                connector: ["Bezier", { curviness: 70 }],
            });
        }
        if (sys_code === 'approved' || sys_code === "") {
            JSPlumbsHandle.instance.makeTarget(element, {
                filter: ".drop-target",
                endpoint: ["Rectangle", {width: 9, height: 9}],
                // anchor: ["Top", "Right", "TopRight", "TopLeft", "Left"],
                anchor: "TopCenter",
                isTarget: true,
                connectorOverlays: [
                    ["Label",
                        {
                            label: '',
                            location: 0.5,
                            cssClass: "cssAssociateLabel",
                            events: {
                                click: function (labelOverlay) {
                                    FlowChartLoadDataHandle.clickConnection(labelOverlay)
                                }
                            },
                        },
                    ]
                ],
                maxConnections: -1,
                connectionsDetachable: true,
                endpointStyle: {fill: "#374986", opacity: ".8"},
                HoverPaintStyle: {strokeStyle: "#1e8151", lineWidth: 4},
                connectionType: "pink-connection",
                // connector: ["Flowchart", {cornerRadius: 5}],
                connector: ["Bezier", { curviness: 70 }],
            });
        }
    };

    set setNodeList(strData) {
        let temp = {};
        for (let item of strData) {
            temp[item.order] = item
        }
        // check if temp and data node list is the same data
        let lst_compare_temp = JSON.stringify(temp)
        let lst_compare_default = JSON.stringify(DEFAULT_NODE_LIST)
        // if compare two data is difference enable flag true
        if (lst_compare_default !== '{}'
            && lst_compare_default !== lst_compare_temp) nodeChanged = true
        if (lst_compare_default !== lst_compare_temp) has_edited = false;
        DEFAULT_NODE_LIST = temp;
        this.nodeData = temp;
    };

    set setAssociateList(strData) {
        if (typeof strData == 'string')
            strData = strData ? JSON.parse(strData) : []
        this._ASSOCIATION = strData;
    };

    set setCommitNodeList(data) {
        this._commitNodeList = data
    }

    get getCommitNode() {
        return this._commitNodeList
    }

    get getAssociate(){
        return this._ASSOCIATION
    }
    convertAssociateToOrder(){
        let temp = [];
        let assoc = this._ASSOCIATION
        for (let a in assoc){
            a = a.split('_')
            temp.push(parseInt(a[0]), parseInt(a[1]))
        }
        return [...new Set(temp)]
    }

    htmlDragRender(target_elm) {
        let strHTMLDragNode = '';
        if (Object.keys(DEFAULT_NODE_LIST).length > 0) {
            for (let val in DEFAULT_NODE_LIST) {
                let item = DEFAULT_NODE_LIST[val];
                let clsSys = '';
                let bg = '';
                let color = 'text-white';
                let clsModal = "modal";
                let disabled = "";
                let hidden = "";
                if (item?.['is_system'] === true) {
                    clsSys = 'control-system';
                    bg = 'bg-white';
                    color = '';
                    if (["initial"].includes(item?.['code'])) {
                        hidden = "hidden";
                    }
                    if (["approved", "completed"].includes(item?.['code'])) {
                        clsModal = "";
                        disabled = "disabled";
                    }
                }
                strHTMLDragNode += `<div class="btn-group dropdown">
                                        <div class="control ${clsSys} ${bg}" id="drag-${item?.['order']}" data-code="${item?.['code']}" data-drag="${item?.['order']}" title="${item?.['title']}" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ${disabled}>
                                            <p class="drag-title ${color}" contentEditable="true" title="${item?.['remark']}">${item?.['title']}</p>
                                        </div>
                                        <div class="dropdown-menu dropdown-bordered w-160p">
                                            <a class="dropdown-item config-node" data-bs-toggle="${clsModal}" data-bs-target="#nodeModal"><i class="dropdown-icon fas fa-cog"></i><span>${JSPlumbsHandle.$trans.attr('data-config')}</span></a>
                                            <div class="dropdown-divider"></div>
                                            <a class="dropdown-item del-node ${hidden}"><i class="dropdown-icon fas fa-trash-alt"></i><span>${JSPlumbsHandle.$trans.attr('data-delete')}</span></a>
                                        </div>
                                    </div>`;
            }
        }
        if (!target_elm) $('#node_dragbox').html(strHTMLDragNode)
        else if (target_elm) target_elm.html(strHTMLDragNode)
    };

    renderClones() {
        let assocEle = $('#node-associate').val();
        if (assocEle){
            let assocData = JSON.parse(assocEle);
            let _assoc_object = {};
            if (Array.isArray(assocData)) {
                for (let a of assocData) {
                    let key = a.node_in.order + '_' + a.node_out.order
                    _assoc_object[key] = {node_in: a.node_in.order, node_out: a.node_out.order, condition: a.condition}
                }
            } else {
                _assoc_object = assocData;
            }
            this.setAssociateList = _assoc_object
            $('#node-associate').val(JSON.stringify(_assoc_object));
        }
        let $wrapWF = $('#flowchart_workflow');
        let wrap_w = $wrapWF.width(),
            wrap_h = $wrapWF.height(),
            top_coord = 0,
            left_coord = 0;
        // loop in DEFAULT_NODE_LIST and render to chart
        let assoc = this.convertAssociateToOrder();
        for (let val in DEFAULT_NODE_LIST) {
            let item = DEFAULT_NODE_LIST[val];
            let coordinates = item?.['coordinates']
            if (coordinates)
                // check if node has coordinates
                if (coordinates.hasOwnProperty("top") && coordinates.hasOwnProperty("left")){
                    top_coord = coordinates?.['top']
                    left_coord = coordinates?.['left'];
                }
            if (assoc.includes(item?.['order'])){

                // check if node coord larger than wrap workflow node
                if ((top_coord + 90) > wrap_h) {
                    wrap_h = wrap_h + 300
                    $wrapWF.css("height", wrap_h);
                    $wrapWF.css("height", wrap_h);
                }
                if ((left_coord + 90) > wrap_w) {
                    wrap_w = wrap_w + 300
                    $wrapWF.css("width", wrap_w);
                }
                let $nodeDragBoxEle = $('#node_dragbox');
                let controlEle = $nodeDragBoxEle[0].querySelector(`.control[data-drag="${val}"]`);
                if (controlEle) {
                    // simulate the drag helper
                    const $helper = $(JSPlumbsHandle.initDragFromNodeBox(controlEle));
                    const $draggable = $(controlEle);

                    // simulate the UI object
                    const ui = {
                        helper: $helper,
                        draggable: $draggable
                    };

                    // now trigger the drop handling manually
                    JSPlumbsHandle.handleNodeDrop(ui, this, top_coord, left_coord);
                }
                // get and set commit code to list in case detail page
                let NodeListTemp = this.getCommitNode
                NodeListTemp[item?.['order']] = item
                this.setCommitNodeList = NodeListTemp
            } // end loop default node list
            if (item?.['code_node_system'] === 'approved') {
                break;
            }
        }
    }

    renderAssociation() {
        for (let assoc in this._ASSOCIATION) {
            assoc = this._ASSOCIATION[assoc];
            JSPlumbsHandle.instance.connect({
                source: 'control-' + assoc?.['node_in'],
                target: 'control-' + assoc?.['node_out'],
                overlays: [
                    ["Label",
                        {
                            label: '',
                            location: 0.5,
                            cssClass: "cssAssociateLabel",
                            events: {
                                click: function (labelOverlay) {
                                    FlowChartLoadDataHandle.clickConnection(labelOverlay)
                                }
                            },
                        },
                    ]
                ],
                anchors: ["Bottom", "Top"],
                endpoint: ["Dot", {radius: 4}],
                endpointStyle: {fill: "#374986", opacity: ".8"},
                paintStyle: {stroke: "#6f6f6f", strokeWidth: 1.5},
                hoverPaintStyle: {stroke: "#efa6b6", strokeWidth: 4},
                connectionType: "pink-connection",
                // connector: ["Flowchart", {cornerRadius: 5}],
                connector: ["Bezier", { curviness: 70 }],
            });
            jsPlumb.select({source: 'control-' + assoc.node_in}).addOverlay(
                ["Label",
                    {
                        label: 'aLabel',
                        location: 0.5,
                        cssClass: "cssAssociateLabel",
                        events: {
                            click: function (labelOverlay) {
                                FlowChartLoadDataHandle.clickConnection(labelOverlay)
                            }
                        },
                    },
                ]
            );
        }
    }

    initJSPlumbs() {
        // const instance = jsPlumb.getInstance({
        //     ConnectionOverlays: [
        //         ["Arrow", {location: 1, id: "arrow", length: 12, width: 12, height: 13, foldback: 1}],
        //     ],
        //     Container: "flowchart_workflow",
        // });
        let that_cls = this; // save this - using for callback instance (because inside callback this was overridden)
        JSPlumbsHandle.instance.deleteEveryEndpoint();

        JSPlumbsHandle.instance.bind("ready", function () {
            // declare style connection type
            JSPlumbsHandle.instance.registerConnectionTypes({
                "pink-connection": {
                    paintStyle: {stroke: "#6f6f6f", strokeWidth: 1.5},
                    hoverPaintStyle: {stroke: "#efa6b6", strokeWidth: 4}
                }
            })
            // init drag node
            $('#node_dragbox .control').draggable({
                helper: function () {
                    return JSPlumbsHandle.initDragFromNodeBox(this);
                },
                appendTo: "#flowchart_workflow",
            });
            // init drop node
            $('#flowchart_workflow').droppable({
                drop: function (event, ui) {
                    JSPlumbsHandle.handleNodeDrop(ui, that_cls);
                }
            });

            // append context menu for R-Click
            JSPlumbsHandle.instance.bind("contextmenu", function (component, event) {
                if (component.hasClass("jtk-connector")) {
                    event.preventDefault();
                    window.selectedConnection = component;
                    Swal.fire({
                        title: FlowChartLoadDataHandle.$transEle.attr('data-confirm-delete-associate'),
                        text: $.fn.transEle.attr('data-warning-can-not-undo'),
                        icon: "warning",
                        allowOutsideClick: false,
                        showConfirmButton: true,
                        confirmButtonText: $.fn.transEle.attr('data-confirm'),
                        showCancelButton: true,
                        cancelButtonText: $.fn.transEle.attr('data-cancel'),
                    }).then((result) => {
                        if (result.isConfirmed) {
                            JSPlumbsHandle.instance.deleteConnection(window.selectedConnection);
                        }
                    })
                }
            })

            JSPlumbsHandle.instance.bind('beforeDrop', function (info) {
                // Check rule connection two node.
                // Allow: return true
                // Deny: return false
                let node_in = info.connection.source.dataset.drag;
                let node_out = info.connection.target.dataset.drag;
                // return checkConnection(node_in, node_out, true);
                return that_cls.clsManage.addConnection(node_in, node_out, true);
            });

            // update association data when connect 2 nodes
            JSPlumbsHandle.instance.bind("connection", function (connection) {
                // add value connection to global variable.
                // change condition value by key: {nodeIN}_{nodeOut}
                let elm_focus = $('#node-associate');
                let current_data = {};
                if (elm_focus.val()) {
                    current_data = JSON.parse(elm_focus.val());
                }
                let end_result = {
                    'node_in': '',
                    'node_out': '',
                    'condition': [],
                    'anchor': {},
                }
                let key = "";
                let connect = connection;
                let node_in = connect.source.dataset.drag;
                let node_out = connect.target.dataset.drag;
                if (node_in && node_out) {
                    end_result['node_in'] = parseInt(node_in);
                    end_result['node_out'] = parseInt(node_out);
                    key = node_in + "_" + node_out;
                }
                if (key) {
                    if (!current_data.hasOwnProperty(key)) {
                        current_data[key] = end_result;
                    }
                    FlowJsP.setAssociateList = current_data;
                    elm_focus.val(JSON.stringify(current_data));
                }
            })

            // update association data when disconnect 2 nodes
            JSPlumbsHandle.instance.bind("connectionDetached", function (connection) {
                // remove value connection to global variable.
                // change condition value by key: {nodeIN}_{nodeOut}
                let key = "";
                let connect = connection;
                let node_in = connect.source.dataset.drag;
                let node_out = connect.target.dataset.drag;
                let elm_focus = $('#node-associate');
                let current_data = elm_focus.val();
                if (node_in && node_out) {
                    key = node_in + "_" + node_out;
                    if (current_data && key) {
                        current_data = JSON.parse(current_data)
                        if (current_data.hasOwnProperty(key)) {
                            delete current_data[key];
                            FlowJsP.setAssociateList = current_data;
                            elm_focus.val(JSON.stringify(current_data))
                        }
                    }
                }
            });

            JSPlumbsHandle.instance.bind("beforeDetach", function (conn) {
                return that_cls.clsManage.removeConnection(
                    conn.source.dataset.drag,
                    conn.target.dataset.drag
                )
            });

        });
    };

    init(isClear = false) {
        // get node list from func node
        this.setNodeList = NodeSubmitHandle.setupDataFlowChart();
        this.setNodeState = this.nodeData;
        let $form = $('#form-create_workflow');

        $('#node_dragbox').empty();
        $('#flowchart_workflow').empty();
        this.htmlDragRender();
        this.initJSPlumbs();
        if (['get', 'put'].includes($form.attr('data-method').toLowerCase()) && isClear === false) {
            // detail and update page
            this.renderClones();
            this.renderAssociation();
        }
        if (!has_edited) {
            has_edited = true;
        }
        extendDropSpace();
    }

    set setNodeState(nodeData) {
        this.clsManage.setNodeState = nodeData;
    }

}

// # left=INIT, right=COMPLETE, middle=APPROVED, null="NO CONNECTION TO SYSTEM"
// {
//      "init": "left",
//      "2": "left",
//      "3": "left",
//      "appr": "middle",
//      "5": null,
//      "6": null,
//      "comp": "right",
// }
//
// [
//      (2, 3, init),
//      (...),
// ]
// #################################################################################
// | INPUT      OUTPUT	    ALLOW	ACTION THEN ALLOWED		                       |
// |###############################################################################|
// | NULL		NULL	 	?		...                                            |
// | NULL		LEFT	 	?	 	REPLACE NULL TO LEFT		                   |
// | NULL		RIGHT	 	?	 	REPLACE NULL TO RIGHT		                   |
// | NULL		MIDDLE	 	?		REPLACE NULL TO LEFT		                   |
// |-------------------------------------------------------------------------------|
// | MIDDLE	    NULL		?		REPLACE NULL TO RIGHT		                   |
// | MIDDLE	    LEFT		?		...				                               |
// | MIDDLE	    RIGHT		?		...				                               |
// | MIDDLE	    MIDDLE		?		... (ONLY ONE MIDDLE NODE)	                   |
// |-------------------------------------------------------------------------------|
// | LEFT		NULL		?		REPLACE NULL TO LEFT		                   |
// | LEFT		LEFT		?		...				                               |
// | LEFT		RIGHT		?		...				                               |
// | LEFT		MIDDLE		?		...				                               |
// |-------------------------------------------------------------------------------|
// | RIGHT		NULL		?		REPLACE NULL TO RIGHT		                   |
// | RIGHT		LEFT		?		...				                               |
// | RIGHT		RIGHT		?		...				                               |
// | RIGHT		MIDDLE		?		...				                               |
// #################################################################################
// DESTROY CONNECTION
// One group:
// --------------------------------------------------
// Node	IN	OUT	GROUP
// 1	{}	{2}	G1
// 2	{1}	{3}	G1
// 3	{2}	{4}	G1
// 4 	{3}	{5}	G1
// 5	{4}	{6}	G1
// 6	{5}	{}	G1
// --------------------------------------------------
// Del 3-4: => 3 del OUT=4 && 4 del IN=3
// --------------------------------------------------
// Node	IN	OUT	GROUP
// 1	{}	{2}	G1.1
// 2	{1}	{3}	G1.1
// 3	{2}	{}	G1.1
// 4 	{}	{5}	G1.2
// 5	{4}	{6}	G1.2
// 6	{5}	{}	G1.2
// --------------------------------------------------
// G1: {1,2,3} && {4,5,6}
// {1,2,3} <> {4,5,6} === (EMPTY) ✔
// 	=> SPLIT G1 => G1.1: {1,2,3} & G1.2: {4,5,6}
//
// 3 del OUT=4
// 3 => {2}
//      2 => {1,3}
//          1 => {2} : EXIST
//          3 : EXIST
//  {1,2,3}
//
class NodeHandler {
    set setNodeState(nodeData) {
        Object.keys(nodeData).map((key) => {
            if (nodeData[key]['is_system'] === true) {
                switch (nodeData[key]['code_node_system']) {
                    case 'initial':
                        this.nodeState[key] = 'left';
                        this.systemNode['left'] = key;
                        break;
                    // case 'completed':
                    //     this.nodeState[key] = 'right';
                    //     this.systemNode['right'] = key;
                    //     break;
                    case 'approved':
                        this.nodeState[key] = 'right';
                        this.systemNode['right'] = key;
                        break;
                    default:
                        console.log('Code:', nodeData[key]['code_node_system'], "don't supported.")
                }
            } else this.nodeState[key] = null;
        });
    }

    getAllNodeOfGroup(node_idx_from, all_data) {
        all_data = Array.isArray(all_data) ? all_data : [];
        if (node_idx_from !== this.systemNode['middle']) {
            all_data.push(node_idx_from);
            let data = this.allNodeInOut[node_idx_from];
            if (data !== undefined && typeof data === "object" && (data.in.length > 0 || data.out.length > 0)) {
                [...data['in'], ...data['out']].map((idx) => {
                    if (idx !== this.systemNode['middle'] && !all_data.includes(idx)) this.getAllNodeOfGroup(idx, all_data);
                });
            }
        }
        return all_data;
    }

    parseInOut(data) {
        // data = [{"node_in": 1, "node_out": 2}, {"node_in": 2, "node_out": 3"}]
        // => {
        //      1: {"in": [], "out": [2]},
        //      2: {"in": [1], "out": [3]},
        //      3: {"in": [2], "out": []},
        // }
        let result = {};
        data.map((item) => {
            let id_in = item['node_in'];
            let id_out = item['node_out'];
            if (result[id_in]) result[id_in]['out'].push(id_out); else result[id_in] = {'in': [], 'out': [id_out]};
            if (result[id_out]) result[id_out]['in'].push(id_in); else result[id_out] = {'in': [id_in], 'out': []};
        });
        return result;
    }

    crossArray(array1, array2) {
        for (let item of array1) if (array2.includes(item)) return true;
        return false;
    }

    getGroup(code_node) {
        let tmp = this.nodeState[code_node];
        return (tmp) ? tmp : null;
    }

    appendArrayToGroupNull(arrayNodeInput, arrayNodeOutput) {
        arrayNodeInput = Array.isArray(arrayNodeInput) ? arrayNodeInput : [];
        arrayNodeOutput = Array.isArray(arrayNodeOutput) ? arrayNodeOutput : [];

        let sumArray = arrayNodeInput.concat(arrayNodeOutput);
        if (sumArray.length > 0) {
            let newNullNode = [];
            for (let idx = 0; idx < this.nullNode.length; idx++) {
                for (let key in sumArray) {
                    if (!this.nullNode[idx].includes(key)) {
                        newNullNode.push(this.nullNode[idx]);
                        break;
                    }
                }
            }
            if (arrayNodeInput.length > 0) newNullNode.push(arrayNodeInput);
            if (arrayNodeOutput.length > 0) newNullNode.push(arrayNodeOutput);
            this.nullNode = newNullNode;
        }
    }

    appendGroupNull(node_input, node_output) {
        if (this.nodeState[node_input] == null && this.nodeState[node_output] == null) {
            let [idx_input, idx_output] = [null, null];
            for (let idx = 0; idx < this.nullNode.length; idx++) {
                if (this.nullNode[idx].includes(node_input) === true) idx_input = idx;
                if (this.nullNode[idx].includes(node_output) === true) idx_output = idx;
            }

            if (idx_input == null && idx_output == null) this.nullNode.push([node_input, node_output]);
            else if (idx_input == null) {
                this.nullNode[idx_output].push(node_input)
            } else if (idx_output == null) {
                this.nullNode[idx_input].push(node_output)
            } else if (idx_input === idx_output) {
            } else if (idx_input < idx_output) {
                let data_output = this.nullNode[idx_output];
                this.nullNode[idx_input] = this.nullNode[idx_input].concat(data_output);
                this.nullNode.splice(idx_output, 1);
            } else if (idx_input > idx_output) {
                let data_input = this.nullNode[idx_input];
                this.nullNode[idx_output] = this.nullNode[idx_output].concat(data_input);
                this.nullNode.splice(idx_input, 1);
            } else console.log('Unbelievable!!!');
            return true;
        }
        return false;
    }

    replaceGroup(code_node, to_code) {
        let newNullNode = [];
        let node_in_group = [];

        for (let idx = 0; idx < this.nullNode.length; idx++) {
            if (this.nullNode[idx].includes(code_node)) {
                node_in_group = node_in_group.concat(this.nullNode[idx]);
            } else {
                newNullNode.push(this.nullNode[idx]);
            }
        }

        this.nullNode = newNullNode;

        if (node_in_group.includes(code_node)) {
            node_in_group.map((node) => {
                this.nodeState[node] = to_code;
            });
        } else {
            this.nodeState[code_node] = to_code;
        }
        return true;
    }

    constructor(nodeData, associationList) {
        this.systemNode = {'left': null, 'right': null, 'middle': null};
        this.nodeState = {};
        this.setNodeState = nodeData;
        this.nullNode = [];
        this.associationList = associationList;
        this.allNodeInOut = this.parseInOut(this.associationList);
    }

    addConnection(node_input, node_output, enable_notify_failure) {
        let state = false;
        let msgFailed = null;
        let combinedValue = this.getGroup(node_input) + '|' + this.getGroup(node_output);
        switch (combinedValue) {
            case 'null|null':
                this.appendGroupNull(node_input, node_output);
                state = true;
                break;
            case 'null|left':
                this.replaceGroup(node_input, 'left');
                state = true;
                break;
            // case 'null|right':
            //     //
            //     // return false;
            //     msgFailed = JSPlumbsHandle.$trans.attr('data-validate-association-1');
            //     break;
            case 'null|right':
                this.replaceGroup(node_input, 'left');
                state = true;
                break;
            case 'null|middle':
                this.replaceGroup(node_input, 'left');
                state = true;
                break;
            case 'middle|null':
                //
                // return false;
                msgFailed = JSPlumbsHandle.$trans.attr('data-validate-association-3');
                break;
            case 'middle|left':
                //
                // return false;
                msgFailed = JSPlumbsHandle.$trans.attr('data-validate-association-3');
                break;
            case 'middle|right':
                state = true;
                break;
            case 'middle|middle':
                // can't exist two middle node
                // return false;
                msgFailed = JSPlumbsHandle.$trans.attr('data-validate-association-4');
                break;
            case 'left|null':
                this.replaceGroup(node_output, 'left');
                state = true;
                break;
            case 'left|left':
                state = true;
                break;
            // case 'left|right':
            //     //
            //     // return false;
            //     msgFailed = JSPlumbsHandle.$trans.attr('data-validate-association-1');
            //     break;
            case 'left|right':
                state = true;
                break;
            case 'left|middle':
                state = true;
                break;
            case 'right|null':
                this.replaceGroup(node_output, 'right');
                state = true;
                break;
            case 'right|left':
                //
                // return false;
                msgFailed = JSPlumbsHandle.$trans.attr('data-validate-association-1');
                break;
            case 'right|right':
                state = true;
                break;
            case 'right|middle':
                //
                // return false;
                msgFailed = JSPlumbsHandle.$trans.attr('data-validate-association-1');
                break;
            default:
                console.log('Over case with data:', combinedValue);
                // return false;
                msgFailed = "Create connection is failure";
                break;
        }
        // Check same node
        if (node_input === node_output) {
            state = false;
            msgFailed = JSPlumbsHandle.$trans.attr('data-validate-association-4');
        }
        // Check connected before
        let elm_focus = $('#node-associate');
        if (elm_focus.length > 0) {
            if (elm_focus.val()) {
                let current_data = JSON.parse(elm_focus.val());
                let key = node_input + "_" + node_output;
                if (current_data.hasOwnProperty(key)) {
                    state = false;
                    msgFailed = JSPlumbsHandle.$trans.attr('data-validate-association-2');
                }
            }
        }
        // Check node collab type
        let dataNodeIn = FlowJsP.nodeData[node_input];
        let dataNodeOut = FlowJsP.nodeData[node_output];
        if (dataNodeOut?.['collaborators']?.['option'] === 1) {
            if (dataNodeIn?.['collaborators']?.['total_in_runtime'] > 1) {
                state = false;
                msgFailed = $('#node-trans-factory').attr('data-validate-next-node');
            }
        }

        if (state === true) {
            this.addInOut(node_input, node_output);
        } else if (enable_notify_failure === true) {
            $.fn.notifyB({
                'description': msgFailed ? msgFailed : "Don't allow connection.."
            }, 'failure');
        }
        return state;
    }

    removeConnection(node_in, node_out) {
        if (this.allNodeInOut[node_in] && this.allNodeInOut[node_in]['out'].includes(node_out)) {
            this.allNodeInOut[node_in]['out'] = this.allNodeInOut[node_in]['out'].filter((item) => item !== node_out);
        }
        if (this.allNodeInOut[node_out] && this.allNodeInOut[node_out]['in'].includes(node_in)) {
            this.allNodeInOut[node_out]['in'] = this.allNodeInOut[node_out]['in'].filter((item) => item !== node_in);
        }
        let groupIn = [...new Set(this.getAllNodeOfGroup(node_in))];
        let groupOut = [...new Set(this.getAllNodeOfGroup(node_out))];

        if (this.crossArray(groupIn, groupOut)) {
            console.log('Groups are cross item.');
        } else {
            let appendGroupIn = false;
            let appendGroupOut = false;
            if (groupIn.includes(this.systemNode['left'])) groupIn.map((node) => this.replaceGroup(node, 'left'))
            else if (groupIn.includes(this.systemNode['right'])) groupIn.map((node) => this.replaceGroup(node, 'right'))
            else {
                groupIn.map((node) => this.replaceGroup(node, null));
                appendGroupIn = true;
            }

            if (groupOut.includes(this.systemNode['left'])) groupOut.map((node) => this.replaceGroup(node, 'left'))
            else if (groupOut.includes(this.systemNode['right'])) groupOut.map((node) => this.replaceGroup(node, 'right'))
            else {
                groupOut.map((node) => this.replaceGroup(node, null));
                appendGroupOut = true;
            }
            this.appendArrayToGroupNull(appendGroupIn === true ? groupIn : [], appendGroupOut ? groupOut : []);
        }
        return true;
    }

    addInOut(node_in, node_out) {
        if (this.allNodeInOut[node_in]) {
            if (!this.allNodeInOut[node_in]['out'].includes(node_out)) this.allNodeInOut[node_in]['out'].push(node_out);
        } else this.allNodeInOut[node_in] = {'in': [], 'out': [node_out]};
        if (this.allNodeInOut[node_out]) {
            if (!this.allNodeInOut[node_out]['in'].includes(node_in)) this.allNodeInOut[node_out]['in'].push(node_in);
        } else this.allNodeInOut[node_out] = {'in': [node_in], 'out': []};
    }
}

/***
 * declare global variable class FlowChart
 * @type {JSPlumbsHandle} class
 * @using {wf_common.js, wf_detail.js}
 */
let FlowJsP = new JSPlumbsHandle();

