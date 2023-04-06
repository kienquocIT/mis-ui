/***
 * list of node user has declare and default system node
 * ***/
let DEFAULT_NODE_LIST = {};
let _MOUSE_POSITION = 0;
let is_node_changed = true;

/***
 * function handle user on click into Node
 * @param event: element of Node
 * @action on save: get data of modal and store data to NODE_LIST
 */
function eventNodeClick(event) {
    let $Elm = $(event.currentTarget);
    let data = DEFAULT_NODE_LIST[$Elm.attr('data-drag')]
    let $modal = $('#exit-node')
    let action_name = JSON.parse($('#wf_action').text())
    let html = ``;
    // check it user right-click
    const isRClick = event.button;
    if (isRClick === 2) return true
    for (let item of data.action) {
        let midd = ``
        // set if node type is approved/create and collab option is in-form/out-form
        if (item <= 1 && data.collaborators.option < 2 || item >= 4)
            midd = `<input class="form-control formula-input" type="text" `
                + `value="${item >= 4 ? data.collaborators.total_config : 1}" readonly>`;
        else if (item <= 1 && data.collaborators.option === 2)
            // else node type is approved/create and collab option is in workflow
            midd = `<input class="form-control formula-input" type="number" min="1" value="1" `
                + `max="${data.collaborators.total_config}">`;
        else if (item > 1 && item < 4) {
            let num = data.collaborators.total_config + 1 - 1;
            midd = `<select class="form-select"><option value=""></option>`
                + `<option class="formular_opt" value="${num}">${num}</option>`
                + `<option class="formular_opt_else" value="else">else</option></select>`;
        }
        let next_text = item === 2 ? 'Reject node' : item === 3 ? '1st node' : item >= 4 ? 'Completed node' : '';
        html += `<tr>` + `<td>${action_name[item]}<input type="hidden" name="node-action_${item}" value="${item}"></td>`
            + `<td>${midd}</td><td>${next_text}</td></tr>`;
    }
    $modal.find('table tbody').html(html);
    $modal.modal('show');

    // input form on change
    $modal.find('.formula-input').off().on('change', function () {
        let _val = parseInt(this.value);
        let calc = data.collaborators.total_config + 1 - _val;
        $modal.find('.form-select .formular_opt').val(calc).text(calc);
    })
    // select option on change
    $modal.find('.form-select').off().on('change', function (event) {
        let $this_elm = $(event.currentTarget)
        let is_class = this.value === 'else' ? '.formular_opt' : '.formular_opt_else'
        let is_index = $this_elm.parents('tr').index() === 1 ? 3 : 2;

        $this_elm.parents('table').find('tr').eq(is_index).find('.form-select ' + is_class).prop('selected', true)
    });
    // call btn click action
    $('#btn-save-exit-node').off().on("click", () => {
        let condition = []
        $modal.find('table tbody tr').each(function () {
            let temp = $(this).find('select option:selected').val()
            if ($(this).find('.formula-input').length) temp = $(this).find('.formula-input').val()
            condition.push({
                action: parseInt($(this).find('[name*="node-action_"]').val()), min_collaborator: temp,
            })
        });
        let temp = FlowJsP.getCommitNode;
        temp[data.order]['condition'] = condition;
        FlowJsP.setCommitNodeList = temp;
        $modal.modal('hide');
    })

}

/***
 * on click in connection of JSPlumbs open modal config associate
 */
function clickConnection(connect) {
    let node_in = parseInt(connect.component.source.dataset.drag);
    let node_out = parseInt(connect.component.target.dataset.drag);
    $("#next-node-association .formsets").html('')
    $('#form-create-condition [name="node_in"]').val(node_in)
    $('#form-create-condition [name="node_out"]').val(node_out)
    $("#next-node-association").modal('show');

    // render modal popup of connection
    let data_cond = FlowJsP.getAssociate
    condition.loadCondition($formset_cond, data_cond)
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
    set setNodeList(strData) {
        let temp = {};
        for (let item of strData) {
            temp[item.order] = item
        }
        // check if temp and data node list is the same data
        let lst_compare_temp = JSON.stringify(temp)
        let lst_compare_default = JSON.stringify(DEFAULT_NODE_LIST)
        // if compare two data is difference enable flag true
        if (lst_compare_default !== lst_compare_temp) is_node_changed = true;
        DEFAULT_NODE_LIST = temp;
        this.nodeData = temp;
    };

    set setAssociateList(strData) {
        strData = strData ? JSON.parse(strData) : []
        this._ASSOCIATION = strData.reverse();
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
        let temp =  [];
        let assoc = this._ASSOCIATION
        for (let a of assoc){
            temp.push(a.node_in.order, a.node_out.order)
        }
        return [...new Set(temp)]
    }

    htmlDragRender(target_elm) {
        let strHTMLDragNode = '';
        if (Object.keys(DEFAULT_NODE_LIST).length > 0) {
            for (let val in DEFAULT_NODE_LIST) {
                let item = DEFAULT_NODE_LIST[val];
                strHTMLDragNode += `<div class="control" id="drag-${item.order}" data-drag="${item.order}" `
                    + `title="${item.title}">` + `<p class="drag-title" contentEditable="true" `
                    + `title="${item.remark}">${item.title}</p></div>`;
            }
        }
        if (!target_elm) $('#node_dragbox').html(strHTMLDragNode)
        else if (target_elm) target_elm.html(strHTMLDragNode)
    };

    renderToFlowchart() {
        this.setAssociateList = $('#node-associate').val();
        let $wrapWF = $('#flowchart_workflow');
        let wrap_w = $wrapWF.width(),
            wrap_h = $wrapWF.height(),
            top_coord = 0,
            left_coord = 0;
        // loop in DEFAULT_NODE_LIST and render to chart
        let HTML_temp = '';
        let assoc = this.convertAssociateToOrder();
        for (let val in DEFAULT_NODE_LIST) {
            let item = DEFAULT_NODE_LIST[val];
            const coordinates = item.coordinates
            if (coordinates)
                // check if node has coordinates
                if (coordinates.hasOwnProperty("top") && coordinates.hasOwnProperty("left")){
                    top_coord = coordinates.top,
                    left_coord = coordinates.left;
                }
            if (assoc.includes(item.order)){

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
                HTML_temp += `<div class="clone" data-drag="${val}" title="${item.title}" id="control-${val}" `
                    + `style="left:${left_coord}px;top:${top_coord}px"><p class="drag-title">${item.title}</p></div>`;

                // get and set commit code to list in case detail page
                let NodeListTemp = this.getCommitNode
                NodeListTemp[item.order] = item
                this.setCommitNodeList = NodeListTemp
            } // end loop default node list
        }
        $wrapWF.html(HTML_temp)
    }

    initJSPlumbs() {
        const instance = jsPlumb.getInstance({
            ConnectionOverlays: [
                ["Arrow", {location: 1, id: "arrow", length: 10, width: 10, height: 10, foldback: 0.9}],
            ],
            Container: "flowchart_workflow",
        });
        let that_cls = this; // save this - using for callback instance (because inside callback this was overridden)

        instance.bind("ready", function () {
            // declare style connection type
            instance.registerConnectionTypes({
                "pink-connection": {
                    paintStyle: {stroke: "#f3c6f2", strokeWidth: 4},
                    hoverPaintStyle: {stroke: "#efa6b6", strokeWidth: 4}
                }
            })
            // init drag node
            $('#node_dragbox .control').draggable({
                helper: function () {
                    return `<div class="clone" data-drag="${$(this).attr('data-drag')}" `
                        + `title="${$(this).find('.drag-title').text()}">`
                        + `<p class="drag-title">${$(this).find('.drag-title').text()}</p></div>`;
                },
                appendTo: "#flowchart_workflow",
            });
            // init drop node
            $('#flowchart_workflow').droppable({
                drop: function (event, ui) {
                    // when user drag to space clone and disable main node
                    const clone = $(ui.helper).clone(true);
                    const numID = ui.draggable.attr('data-drag')
                    let is_id = 'control-' + numID
                    clone.attr("id", is_id)
                    clone.appendTo(this);
                    let $this_elm = ui.draggable;
                    $this_elm.draggable("disable");
                    instance.draggable(is_id, {containment: true})
                    let sys_code = "";
                    // check default system node
                    for (let idx in DEFAULT_NODE_LIST) {
                        let item = DEFAULT_NODE_LIST[idx]
                        if (item.order === parseInt(ui.draggable.attr('data-drag'))) {
                            if (item.hasOwnProperty('code_node_system')) sys_code = item.code_node_system.toLowerCase()
                            break;
                        }
                    }
                    if (sys_code !== 'completed')
                        instance.addEndpoint(is_id, {
                            endpoint: ["Dot", {radius: 4}],
                            anchor: ["Bottom", "BottomRight", "BottomLeft"],
                            isSource: true,
                            connectorOverlays: [
                                ["Label",
                                    {
                                        label: '',
                                        location: 0.5,
                                        cssClass: "cssAssociateLabel",
                                        events: {
                                            click: function (labelOverlay) {
                                                clickConnection(labelOverlay)
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
                            connector: ["Flowchart", {cornerRadius: 5}],
                        });
                    //
                    if (sys_code !== 'initial')
                        instance.addEndpoint(is_id, {
                            endpoint: ["Rectangle", {width: 8, height: 8}],
                            anchor: ["Top", "Right", "TopRight", "TopLeft", "Left"],
                            isTarget: true,
                            connectorOverlays: [
                                ["Label",
                                    {
                                        label: '',
                                        location: 0.5,
                                        cssClass: "cssAssociateLabel",
                                        events: {
                                            click: function (labelOverlay) {
                                                clickConnection(labelOverlay)
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
                            connector: ["Flowchart", {cornerRadius: 5}],
                        });

                    // add drop node to commit node list

                    let temp = that_cls.getCommitNode
                    temp[numID] = DEFAULT_NODE_LIST[numID]
                    that_cls.setCommitNodeList = temp

                    // handle event on click node
                    $('#' + is_id).off().on("mousedown", function (evt) {
                        _MOUSE_POSITION = evt.pageX + evt.pageY
                    }).on("mouseup", function (evt) {
                        let temp = evt.pageX + evt.pageY;
                        if (_MOUSE_POSITION === temp) eventNodeClick(evt)
                    })
                }

            });

            // check if workflow detail or edit page show flowchart
            if ($('#form-detail_workflow').length) {
                instance.doWhileSuspended(function () {
                    $('#flowchart_workflow .clone').each(function () {
                        let is_id = $(this).attr('id')
                        instance.draggable(is_id, {containment: true})

                        let sys_code = DEFAULT_NODE_LIST[$(this).data('drag')].code_node_system
                        if (sys_code !== 'completed')
                            instance.addEndpoint(is_id, {
                                endpoint: ["Dot", {radius: 4}],
                                anchor: ["Bottom", "BottomRight", "BottomLeft"],
                                isSource: true,
                                connectorOverlays: [
                                    ["Label",
                                        {
                                            label: '',
                                            location: 0.5,
                                            cssClass: "cssAssociateLabel",
                                            events: {
                                                click: function (labelOverlay) {
                                                    clickConnection(labelOverlay)
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
                                connector: ["Flowchart", {cornerRadius: 5}],
                            });
                        //
                        if (sys_code !== 'initial')
                            instance.addEndpoint(is_id, {
                                endpoint: ["Rectangle", {width: 8, height: 8}],
                                anchor: ["Top", "Right", "TopRight", "TopLeft", "Left"],
                                // anchor: "Perimeter",
                                isTarget: true,
                                connectorOverlays: [
                                    ["Label",
                                        {
                                            label: '',
                                            location: 0.5,
                                            cssClass: "cssAssociateLabel",
                                            events: {
                                                click: function (labelOverlay) {
                                                    clickConnection(labelOverlay)
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
                                connector: ["Flowchart", {cornerRadius: 5}],
                            });

                        let numID = $('#node_dragbox').find(`[data-drag="${$(this).data('drag')}"]`)

                        // disable node drag in left side
                        numID.draggable("disable");
                        // add event click for node of right side
                        $('#' + is_id).off().on("mousedown", function (evt) {
                            _MOUSE_POSITION = evt.pageX + evt.pageY
                        }).on("mouseup", function (evt) {
                            let temp = evt.pageX + evt.pageY;
                            if (_MOUSE_POSITION === temp) eventNodeClick(evt)
                        })
                    })
                }) // end do while suspended

                for (let assoc of that_cls._ASSOCIATION) {
                    instance.connect({
                        source: 'control-' + assoc.node_in.order,
                        target: 'control-' + assoc.node_out.order,
                        overlays: [
                            ["Label",
                                {
                                    label: '',
                                    location: 0.5,
                                    cssClass: "cssAssociateLabel",
                                    events: {
                                        click: function (labelOverlay) {
                                            clickConnection(labelOverlay)
                                        }
                                    },
                                },
                            ]
                        ],
                        anchors: ["Bottom", "Top"],
                        endpoint: ["Dot", {radius: 4}],
                        endpointStyle: {fill: "#374986", opacity: ".8"},
                        paintStyle: {stroke: "#f3c6f2", strokeWidth: 4},
                        hoverPaintStyle: {stroke: "#efa6b6", strokeWidth: 4},
                        connectionType: "pink-connection",
                        connector: ["Flowchart", {cornerRadius: 5}],
                    });
                    jsPlumb.select({source: 'control-' + assoc.node_in.order}).addOverlay(
                        ["Label",
                            {
                                label: 'aLabel',
                                location: 0.5,
                                cssClass: "cssAssociateLabel",
                                events: {
                                    click: function (labelOverlay) {
                                        clickConnection(labelOverlay)
                                    }
                                },
                            },
                        ]
                    );
                }
            }

            // append context menu for R-Click
            instance.bind("contextmenu", function (component, event) {
                if (component.hasClass("jtk-connector")) {
                    event.preventDefault()
                    window.selectedConnection = component;
                    $(`<div class="custom-menu"><a href="#" class="delete-connect">${$('#translate-factory').data('context_delete')}</a></div>`)
                        .appendTo("body")
                        .css({
                            top: event.pageY + "px", left: event.pageX + "px"
                        });
                }
            })

            // update association data when connect 2 nodes, LHPHUC
            instance.bind("connection", function (connection) {
                // add value connection to global variable.
                // change condition value by key: {nodeIN}_{nodeOut}
                let elm_focus = $('#node-associate');
                let before_data = elm_focus.val();
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
                    if (before_data) {
                        before_data = JSON.parse(before_data);
                        before_data[key] = end_result;
                        end_result = before_data
                    } else {
                        let temp = {}
                        temp[key] = end_result;
                        end_result = temp
                    }
                    elm_focus.val(JSON.stringify(end_result))
                }
            })

            instance.bind('beforeDrop', function (info) {
                // Check rule connection two node.
                // Allow: return true
                // Deny: return false
                let node_in = info.connection.source.dataset.drag;
                let node_out = info.connection.target.dataset.drag;
                // return checkConnection(node_in, node_out, true);
                return that_cls.clsManage.addConnection(node_in, node_out, true);
            });

            // update association data when disconnect 2 nodes, LHPHUC
            instance.bind("connectionDetached", function (connection) {
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
                            elm_focus.val(JSON.stringify(current_data))
                        }
                    }
                }
            });

            instance.bind("beforeDetach", function (conn) {
                return that_cls.clsManage.removeConnection(
                    conn.source.dataset.drag,
                    conn.target.dataset.drag
                )
            });


            // declare event on click for context menu
            $("body").on("click", ".delete-connect", function () {
                instance.deleteConnection(window.selectedConnection)
                $(this).parent('.custom-menu').remove();
            });
        });

        // set flag is false after run chart
        is_node_changed = false
    };

    init() {
        // get node list from func node
        this.setNodeList = setupDataNode();
        this.setNodeState = this.nodeData;
        // check first time load detail page and data list node is changed
        if (is_node_changed) {
            $('#node_dragbox').empty();
            $('#flowchart_workflow').empty();
            if ($('#form-detail_workflow').length) this.renderToFlowchart();
            this.htmlDragRender();
            this.initJSPlumbs();
        }
        extendDropSpace();
    }

    set setNodeState(nodeData) {
        this.clsManage.setNodeState = nodeData;
    }

    set setAssociation(transData) {
        // load association config in here (case load exist config)
        this.associationData = transData;
        this.clsManage.setAssociationList = transData;
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
                    case 'completed':
                        this.nodeState[key] = 'right';
                        this.systemNode['right'] = key;
                        break;
                    case 'approved':
                        this.nodeState[key] = 'middle';
                        this.systemNode['middle'] = key;
                        break;
                    default:
                        console.log('Code:', nodeData[key]['code_node_system'], "don't supported.")
                }
            } else this.nodeState[key] = null;
        });
    }

    set setAssociationList(associationData) {
        this.associationList = associationData;
        this.allNodeInOut = this.parseInOut(this.associationList);
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
            case 'null|right':
                this.replaceGroup(node_input, 'right');
                state = true;
                break;
            case 'null|middle':
                this.replaceGroup(node_input, 'left');
                state = true;
                break;
            case 'middle|null':
                this.replaceGroup(node_output, 'right');
                state = true;
                break;
            case 'middle|left':
                //
                // return false;
                msgFailed = "Approved Node can't connect to Node that connected Initial Node"
                break;
            case 'middle|right':
                state = true;
                break;
            case 'middle|middle':
                // can't exist two middle node
                // return false;
                msgFailed = "Can't exist two Middle Node"
                break;
            case 'left|null':
                this.replaceGroup(node_output, 'left');
                state = true;
                break;
            case 'left|left':
                state = true;
                break;
            case 'left|right':
                //
                // return false;
                msgFailed = "Node connected Initial Node can't connect to Node connect Completed Node";
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
                msgFailed = "Node connected Initial Node can't connect to Node connect Completed Node";
                break;
            case 'right|right':
                state = true;
                break;
            case 'right|middle':
                //
                // return false;
                msgFailed = "Node connected Completed Node can't connect to Approved Node"
                break;
            default:
                console.log('Over case with data:', combinedValue);
                // return false;
                msgFailed = "Create connection is failure";
                break;
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

