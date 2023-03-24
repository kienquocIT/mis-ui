/***
 * list of node user has declare and default system node
 * ***/
let DEFAULT_NODE_LIST = {};
let COMMIT_NODE_LIST = []
let _MOUSE_POSITION = 0

/***
 * function handle user on click into Node
 * @param event: element of Node
 * @action on save: get data of modal and store data to MODE_LIST
 */
function eventNodeClick(event) {
    let $Elm = $(event.currentTarget)
    let data = DEFAULT_NODE_LIST[$Elm.attr('data-drag')]
    let $modal = $('#exit-node')
    let action_name = JSON.parse($('#wf_action').text())
    let html = ``;

    for (let item of data.action) {
        let midd = ``
        // set if node type is approved/create and collab option is in-form/out-form
        if (item <= 1 && data.collaborators.option < 2 || item >= 4) midd = `<input class="form-control formula-input" type="text" ` + `value="${item >= 4 ? data.collaborators.total_config : 1}" readonly>`; else if (item <= 1 && data.collaborators.option === 2)
            // else node type is approved/create and collab option is in workflow
            midd = `<input class="form-control formula-input" type="number" min="1" value="1" ` + `max="${data.collaborators.total_config}">`; else if (item > 1 && item < 4) {
            let num = data.collaborators.total_config + 1 - 1;
            midd = `<select class="form-select">` + `<option value=""></option>` + `<option class="formular_opt" value="${num}">${num}</option>` + `<option class="formular_opt_else" value="else">else</option>` + `</select>`;
        }
        let next_text = item === 2 ? 'Reject node' : item === 3 ? '1st node' : item >= 4 ? 'Completed node' : '';
        html += `<tr>` + `<td>${action_name[item]}<input type="hidden" name="node-action_${item}" value="${item}"></td>` + `<td>${midd}</td>` + `<td>${next_text}</td>` + `</tr>`;
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
        COMMIT_NODE_LIST[data.order] = condition
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
            if (!(current_h - 300) < default_w || !(current_h - 300) < default_h) {
                target_elm.css({
                    "height": current_h - 300, "width": current_w - 300
                })
            }
        }

    })
}

class JSPlumbsHandle {
    nodeData = {};  // storage all node with {"id_node": "Object config node"}
    nodeState = {}; // storage group of node, contain ['left', 'middle', 'right']
    clsManage = new NodeHandler(this.nodeState); // class to check for connection the validation

    set setNodeList(strData) {
        let temp = {}
        if (strData) {
            for (let item of strData) {
                temp[item.order] = item
            }
            DEFAULT_NODE_LIST = temp;
            this.nodeData = temp;
        }
    };

    htmlDragRender() {
        let strHTMLDragNode = '';
        if (Object.keys(DEFAULT_NODE_LIST).length > 0) {
            for (let val in DEFAULT_NODE_LIST) {
                let item = DEFAULT_NODE_LIST[val];
                strHTMLDragNode += `<div class="control" data-drag="${item.order}" title="${item.title}">` + `<p class="drag-title" contentEditable="true" title="${item.remark}">${item.title}</p></div>`;
            }
        }
        $('#node_dragbox').html(strHTMLDragNode)
    };


    initJSPlumbs() {
        const instance = jsPlumb.getInstance({
            ConnectionOverlays: [["Arrow", {
                location: 1, id: "arrow", length: 10, width: 10, height: 10, foldback: 0.9
            }],], Container: "flowchart_workflow"
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
                    return `<div class="clone" data-drag="${$(this).attr('data-drag')}" ` + `title="${$(this).find('.drag-title').text()}">` + `<p class="drag-title">${$(this).find('.drag-title').text()}</p></div>`;
                }, appendTo: "#flowchart_workflow",
            });
            // init drop node

            $('#flowchart_workflow').droppable({
                drop: function (event, ui) {
                    // when user drag to space clone and disable main node
                    const clone = $(ui.helper).clone(true);
                    let is_id = 'control-' + ui.draggable.attr('data-drag')
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
                    if (sys_code !== 'completed') instance.addEndpoint(is_id, {
                        connectorOverlays: [["Label", {
                            label: '', location: 0.5, cssClass: "cssAssociateLabel", events: {
                                click: function (labelOverlay) {
                                    clickConnection(labelOverlay)
                                }
                            },
                        },]],
                        maxConnections: -1,
                        connectionsDetachable: true,
                        endpoint: ["Dot", {radius: 4}],
                        endpointStyle: {fill: "#374986"},
                        HoverPaintStyle: {strokeStyle: "#1e8151", lineWidth: 4},
                        anchor: ["Bottom", "BottomRight", "BottomLeft"],
                        isSource: true,
                        connectionType: "pink-connection",
                        connector: ["Bezier", {curviness: 100}], // connector: ["Flowchart", {cornerRadius: 5}],
                    });
                    //
                    if (sys_code !== 'initial') instance.addEndpoint(is_id, {
                        connectorOverlays: [["Label", {
                            label: '', location: 0.5, cssClass: "cssAssociateLabel", events: {
                                click: function (labelOverlay) {
                                    clickConnection(labelOverlay)
                                }
                            },
                        },]],
                        maxConnections: -1,
                        connectionsDetachable: true,
                        endpoint: ["Rectangle", {width: 8, height: 8}],
                        endpointStyle: {fill: "#374986"},
                        HoverPaintStyle: {strokeStyle: "#1e8151", lineWidth: 4},
                        anchor: ["Top", "Right", "TopRight", "TopLeft", "Left"],
                        isTarget: true,
                        connectionType: "pink-connection",
                        connector: ["Bezier", {curviness: 100}]
                        // connector: ["Flowchart", {cornerRadius: 5}]
                    });
                    // handle event on click node
                    $('#' + is_id).off().on("mousedown", function (evt) {
                        _MOUSE_POSITION = evt.pageX + evt.pageY
                    }).on("mouseup", function (evt) {
                        let temp = evt.pageX + evt.pageY;
                        if (_MOUSE_POSITION === temp) eventNodeClick(evt)
                    })
                }

            });

            // append context menu for R-Click
            instance.bind("contextmenu", function (component, event) {
                if (component.hasClass("jtk-connector")) {
                    event.preventDefault()
                    window.selectedConnection = component;
                    $('<div class="custom-menu"><a href="#" class="delete-connect">delete associate</a></div>')
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
                let data_node = DEFAULT_NODE_LIST;
                let elm_focus = $('#node-associate');
                let before_data = elm_focus.val();
                let end_result = {
                    'node_in': '', 'node_out': '', 'condition': [],
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
                return that_cls.clsManage.activeState(node_in, node_out, true);
            });

            // update association data when disconnect 2 nodes, LHPHUC
            instance.bind("connectionDetached", function (connection) {
                // remove value connection to global variable.
                // change condition value by key: {nodeIN}_{nodeOut}
                let key = "";
                let data_node = DEFAULT_NODE_LIST;
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


            // declare event on click for context menu
            $("body").on("click", ".delete-connect", function () {
                instance.deleteConnection(window.selectedConnection)
                $(this).parent('.custom-menu').remove();
            });
        });
    };

    init() {
        this.setNodeList = setupDataNode();
        this.setNodeState = this.nodeData;
        this.htmlDragRender();
        this.initJSPlumbs();
        extendDropSpace();
    }

    set setNodeState(nodeData) {
        if (nodeData) {
            Object.keys(nodeData).map((key) => {
                if (nodeData[key]['is_system'] === true) {
                    switch (nodeData[key]['code_node_system']) {
                        case 'initial':
                            this.nodeState[key] = 'left';
                            break
                        case 'completed':
                            this.nodeState[key] = 'right';
                            break
                        case 'approved':
                            this.nodeState[key] = 'middle';
                            break
                        default:
                            console.log('Code:', nodeData[key]['code_node_system'], "don't supported.")
                    }
                } else this.nodeState[key] = null;
            })
        }
        this.clsManage.setNodeState = this.nodeState;
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
// | NULL		NULL	 	✔		...                                            |
// | NULL		LEFT	 	✔	 	REPLACE NULL TO LEFT		                   |
// | NULL		RIGHT	 	✔	 	REPLACE NULL TO RIGHT		                   |
// | NULL		MIDDLE	 	✔		REPLACE NULL TO LEFT		                   |
// |-------------------------------------------------------------------------------|
// | MIDDLE	    NULL		✔		REPLACE NULL TO RIGHT		                   |
// | MIDDLE	    LEFT		❌		...				                               |
// | MIDDLE	    RIGHT		✔		...				                               |
// | MIDDLE	    MIDDLE		❌		... (ONLY ONE MIDDLE NODE)	                   |
// |-------------------------------------------------------------------------------|
// | LEFT		NULL		✔		REPLACE NULL TO LEFT		                   |
// | LEFT		LEFT		✔		...				                               |
// | LEFT		RIGHT		❌		...				                               |
// | LEFT		MIDDLE		✔		...				                               |
// |-------------------------------------------------------------------------------|
// | RIGHT		NULL		✔		REPLACE NULL TO RIGHT		                   |
// | RIGHT		LEFT		❌		...				                               |
// | RIGHT		RIGHT		✔		...				                               |
// | RIGHT		MIDDLE		❌		...				                               |
// #################################################################################
class NodeHandler {
    constructor(nodeState) {
        this.nodeState = nodeState;
        this.nullNode = [];
    }

    set setNodeState(nodeState) {
        this.nodeState = nodeState;
    }

    getGroup(code_node) {
        let tmp = this.nodeState[code_node];
        return (tmp) ? tmp : null;
    }

    appendGroupNull(node_input, node_output) {
        if (this.nodeState[node_input] == null && this.nodeState[node_output] == null) {
            let [idx_input, idx_output] = [null, null];
            for (let idx = 0; idx < this.nullNode.length; idx++) {
                if (this.nullNode[idx].includes(node_input) === true) idx_input = idx;
                if (this.nullNode[idx].includes(node_output) === true) idx_output = idx;
            }

            if (idx_input == null && idx_output == null) this.nullNode.push([node_input, node_output]);
            else if (idx_input == null) this.nullNode[idx_output].push(node_input);
            else if (idx_output == null) this.nullNode[idx_input].push(node_output);
            else if (idx_input === idx_output) {
            } else if (idx_input < idx_output) {
                let data_output = this.nullNode[idx_output];
                this.nullNode.slice(idx_output, 1);
                this.nullNode[idx_input] = this.nullNode[idx_input].concat(data_output);
            } else if (idx_input > idx_output) {
                let data_input = this.nullNode[idx_input];
                this.nullNode.slice(idx_input, 1);
                this.nullNode[idx_output] = this.nullNode[idx_output].concat(data_input);
            } else console.log('Unbelievable!!!');
            return true;
        }
        return false;
    }

    replaceGroup(code_node, to_code) {
        let idx_need_destroy = [];
        let node_in_group = [];
        for (let idx = 0; idx < this.nullNode.length; idx++) {
            if (this.nullNode[idx].includes(code_node)) {
                idx_need_destroy.push(idx);
                node_in_group = node_in_group.concat(this.nullNode[idx]);
            }
        }

        idx_need_destroy.map((idx) => {
            this.nullNode.splice(idx, 1);
        });
        if (node_in_group.includes(code_node)) node_in_group.map(
            (node) => {
                this.nodeState[node] = to_code;
            });
        else this.nodeState[code_node] = to_code;
        return true;
    }

    activeState(node_input, node_output, enable_notify_failure) {
        let msgFailed = null;
        let combinedValue = this.getGroup(node_input) + '|' + this.getGroup(node_output);
        console.log(combinedValue, '\nnodeState:', this.nodeState, '\nnullNode: ', this.nullNode);
        switch (combinedValue) {
            case 'null|null':
                this.appendGroupNull(node_input, node_output);
                return true;
            case 'null|left':
                this.replaceGroup(node_input, 'left')
                return true
            case 'null|right':
                this.replaceGroup(node_input, 'right')
                return true;
            case 'null|middle':
                this.replaceGroup(node_input, 'left');
                return true;
            case 'middle|null':
                this.replaceGroup(node_output, 'right');
                return true;
            case 'middle|left':
                //
                // return false;
                msgFailed = "Approved Node can't connect to Node that connected Initial Node"
                break;
            case 'middle|right':
                return true;
            case 'middle|middle':
                // can't exist two middle node
                // return false;
                msgFailed = "Can't exist two Middle Node"
                break;
            case 'left|null':
                this.replaceGroup(node_output, 'left');
                return true;
            case 'left|left':
                return true;
            case 'left|right':
                //
                // return false;
                msgFailed = "Node connected Initial Node can't connect to Node connect Completed Node";
                break;
            case 'left|middle':
                return true
            case 'right|null':
                this.replaceGroup(node_output, 'right');
                return true;
            case 'right|left':
                //
                // return false;
                msgFailed = "Node connected Initial Node can't connect to Node connect Completed Node";
                break;
            case 'right|right':
                return true;
            case 'right|middle':
                //
                // return false;
                msgFailed = "Node connected Completed Node can't connect to Approved Node"
                break;
            default:
                console.log('Over case with data:', combinedValue);
                // return false;
                msgFailed = "Over case with data: " + combinedValue;
                break;
        }
        if (enable_notify_failure === true) {
            $.fn.notifyB({
                'description': msgFailed ? msgFailed : "Don't allow connection..."
            }, 'failure');
        }
    }
}



