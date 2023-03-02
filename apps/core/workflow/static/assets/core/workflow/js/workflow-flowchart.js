/***
 * list of node user has declare and default system node
 * ***/
let DEFAULT_NODE_LIST = {};
let COMMIT_NODE_LIST = []
let RED_FLAG = false
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
        // set if node type is in-form/out-form max user is 1
        let midd = `<input class="form-control formula-input" type="text" value="1" readonly>`;
        if (data.collaborators.option === "in_workflow") // else in workflow min user 1 and max user is total in node
            midd = `<input class="form-control formula-input" type="text" minlength="1" value="1" `
                + `maxlength="${data.collaborators.total_config}">`;

        if (item > 0 && item < 4) midd = `<select class="form-select">`
            + `<option value=""></option>`
            + `<option value="0">max+1-x</option>`
            + `<option value="1">else</option>`
            + `</select>`;
        let nexttext = item === 2 ? 'Reject node' : item === 3 ? '1st node' : item >= 4 ? 'Completed node' : '';
        html += `<tr>`
            + `<td>${action_name[item]}<input type="hidden" name="node-${item}" value="${item}"></td>`
            + `<td>${midd}</td>`
            + `<td>${nexttext}</td>`
            + `</tr>`;
    }
    $modal.find('table tbody').html(html);
    $modal.modal('show');
    // call btn click action
    $('#btn-save-exit-node').off().on("click", () => {
        let condition = []
        $modal.find('table tbody tr').each(function () {
            let temp = $(this).find('select option:selected').val()
            if ($(this).find('.formula-input').length)
                temp = $(this).find('.formula-input').val()
            condition.push({
                node: parseInt($(this).find('[name*="node-"]').val()),
                formula: temp,
            })
        });
        COMMIT_NODE_LIST[data.order] = condition
        $modal.modal('hide');
    })
}

class JSPlumbsHandle {

    set setNodeList(strData) {
        if (strData)
            DEFAULT_NODE_LIST = strData
    };

    htmlDragRender() {
        let strHTMLDrapNode = '';
        if (DEFAULT_NODE_LIST.length) {
            for (let item of DEFAULT_NODE_LIST) {
                strHTMLDrapNode += `<div class="control" data-drag="${item.order}">`
                    + `<p class="drag-title" contentEditable="true" title="${item.remark}">${item.title}</p></div>`;
            }
        }
        $('#node_dragbox').html(strHTMLDrapNode)
    };


    renderAndRerenderDrag() {
        // function 'setupDataNode' has call form workflow-create.js
        this.setNodeList = setupDataNode()
        this.htmlDragRender();
        if (!RED_FLAG){
            this.initJSPlumbs();
            RED_FLAG = !RED_FLAG
        }
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
                    return `<div class="clone" data-drag="${$(this).attr('data-drag')}">`
                        + `${$(this).find('.drag-title').text()}</div>`;
                },
                containment: "body",
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

                    instance.addEndpoint(is_id, {
                        connectorOverlays: [
                            [
                                "Label",
                                {
                                    location: 0.5,
                                    cssClass: "cssAssociateLabel",
                                    events: {
                                        click: function (labelOverlay) {
                                            $(".change-txt").show();
                                            $("#label").value = labelOverlay.getLabel();
                                            if (document.getElementById("label").value === "")
                                                labelOverlay.setLabel("label");
                                            else
                                                labelOverlay.setLabel(document.getElementById("label").value);
                                            $('#label').val("");
                                        },
                                        dblclick: function (labelOverlay) {
                                            labelOverlay.setLabel("");
                                        }
                                    },
                                },
                            ],
                        ],
                        maxConnections: -1,
                        connectionsDetachable: true,
                        endpoint: ["Dot", {radius: 4}],
                        HoverPaintStyle: {strokeStyle: "#1e8151", lineWidth: 4},
                        anchor: ["TopRight", "BottomRight", "BottomLeft", "TopLeft"],
                        isSource: true,
                        connectionType: "pink-connection",
                        connector: ["Flowchart", {cornerRadius: 5}],
                    });
                    //
                    instance.addEndpoint(is_id, {
                        endpoint: ["Rectangle", {width: 8, height: 8}],
                        anchor: ["Top", "Right", "Bottom", "Left"],
                        isTarget: true,
                        connectionType: "pink-connection",
                    });

                    // handle event on click node
                    $('#' + is_id).off().on("click", function (evt) {
                        eventNodeClick(evt)
                    })
                    // $('#' + is_id).off().on("mousedown", function (evt) {
                    //     // console.log('click on event', evt)
                    //     window.addEventListener("mousemove", drag);
                    //     window.addEventListener("mouseup", lift);
                    //     var didDrag = false;
                    //     function drag() {
                    //         didDrag = true;
                    //     }
                    //     function lift() {
                    //         if (!didDrag) eventNodeClick(evt)
                    //         window.removeEventListener("mousemove", drag)
                    //         window.removeEventListener("mouseup", this)
                    //     }
                    //
                    // },)
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
    }
}