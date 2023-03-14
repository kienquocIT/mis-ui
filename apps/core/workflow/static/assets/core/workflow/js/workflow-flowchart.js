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
        if (item <= 1 && data.collaborators.option < 2 || item >= 4)
            midd = `<input class="form-control formula-input" type="text" `
                + `value="${item >= 4 ? data.collaborators.total_config : 1}" readonly>`;
        else if (item <= 1 && data.collaborators.option === 2)
            // else node type is approved/create and collab option is in workflow
            midd = `<input class="form-control formula-input" type="number" min="1" value="1" `
                + `max="${data.collaborators.total_config}">`;
        else if (item > 1 && item < 4) {
            let num = data.collaborators.total_config + 1 - 1;
            midd = `<select class="form-select">`
                + `<option value=""></option>`
                + `<option class="formular_opt" value="${num}">${num}</option>`
                + `<option class="formular_opt_else" value="else">else</option>`
                + `</select>`;
        }
        let next_text = item === 2 ? 'Reject node' : item === 3 ? '1st node' : item >= 4 ? 'Completed node' : '';
        html += `<tr>`
            + `<td>${action_name[item]}<input type="hidden" name="node-action_${item}" value="${item}"></td>`
            + `<td>${midd}</td>`
            + `<td>${next_text}</td>`
            + `</tr>`;
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
            if ($(this).find('.formula-input').length)
                temp = $(this).find('.formula-input').val()
            condition.push({
                action: parseInt($(this).find('[name*="node-action_"]').val()),
                min_collaborator: temp,
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
function extendDropSpace(){
    let target_elm = $('#flowchart_workflow')
    let default_h = target_elm.height();
    let default_w = target_elm.width();
    $('.btn-extend_space').off().on('click', function (e){
        e.preventDefault();
        e.stopPropagation();
        let current_h = target_elm.height();
        let current_w = target_elm.width();
        if ($(this).attr('data-btn-type') === 'plus'){
            // plus space
            target_elm.css({
                'height': current_h + 300,
                'width': current_w + 300
            })
        }
        else{
            // minus space
            if (!(current_h - 300) < default_w || !(current_h - 300) < default_h){
                target_elm.css({
                    "height": current_h - 300,
                    "width": current_w - 300
                })
            }
        }

    })
}

class JSPlumbsHandle {

    set setNodeList(strData) {
        let temp = {}
        if (strData) {
            for (let item of strData) {
                temp[item.order] = item
            }
            DEFAULT_NODE_LIST = temp
        }
    };

    htmlDragRender() {
        let strHTMLDragNode = '';
        if (Object.keys(DEFAULT_NODE_LIST).length > 0) {
            for (let val in DEFAULT_NODE_LIST) {
                let item = DEFAULT_NODE_LIST[val];
                strHTMLDragNode += `<div class="control" data-drag="${item.order}" title="${item.title}">`
                    + `<p class="drag-title" contentEditable="true" title="${item.remark}">${item.title}</p></div>`;
            }
        }
        $('#node_dragbox').html(strHTMLDragNode)
    };


    initJSPlumbs() {
        const instance = jsPlumb.getInstance({
            ConnectionOverlays: [
                ["Arrow", {location: 1, id: "arrow", length: 10, width: 10, height: 10, foldback: 0.9}],
            ],
            Container: "flowchart_workflow"
        });

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
                        +`title="${$(this).find('.drag-title').text()}">`
                        + `<p class="drag-title">${$(this).find('.drag-title').text()}</p></div>`;
                },
                appendTo: "#flowchart_workflow",
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
                    for (let idx in DEFAULT_NODE_LIST){
                        let item = DEFAULT_NODE_LIST[idx]
                        if (item.order === parseInt(ui.draggable.attr('data-drag'))){
                            if (item.hasOwnProperty('code_node_system'))
                                sys_code = item.code_node_system.toLowerCase()
                            break;
                        }
                    }
                    if (sys_code !== 'completed')
                        instance.addEndpoint(is_id, {
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
                            endpoint: ["Dot", {radius: 4}],
                            endpointStyle:{ fill: "#374986" },
                            HoverPaintStyle: {strokeStyle: "#1e8151", lineWidth: 4},
                            anchor: ["Bottom", "BottomRight", "BottomLeft"],
                            isSource: true,
                            connectionType: "pink-connection",
                            connector: ["Bezier", {curviness: 100}],
                            // connector: ["Flowchart", {cornerRadius: 5}],
                        });
                    //
                    if (sys_code !== 'initial')
                        instance.addEndpoint(is_id, {
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
                            endpoint: ["Rectangle", {width: 8, height: 8}],
                            endpointStyle:{ fill: "#374986" },
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
                            top: event.pageY + "px",
                            left: event.pageX + "px"
                        });
                }
            })

            // declare event on click for context menu
            $("body").on("click", ".delete-connect", function () {
                instance.deleteConnection(window.selectedConnection)
                $(this).parent('.custom-menu').remove();
            });

        });
    };

    init() {
        this.setNodeList = setupDataNode();
        this.htmlDragRender();
        this.initJSPlumbs();
        extendDropSpace()
    }
}
