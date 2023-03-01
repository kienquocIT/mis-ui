function eventNodeClick(event, nodedata) {
    let $Elm = $(event.currentTarget)
    let data = NODE_LIST[$Elm.attr('data-drag')]
    let $modal = $('#exit-node')
    $modal.find('form').reset();
    let action_name = $('#wf_action').text()
    let html = ``;
    let templateAction = {
        1: `<input type="text" name="action_with_input">`,
        2: `<select>`
            +`<option value=""></option>`
            +`<option value="0">max-1-x</option>`
            +`<option value="1">else</option>`
            +`</select>`,
    }
    for (let item in data.action){
        let midd = templateAction[1]
        if (item > 0 && item < 4) midd = templateAction[2]
        let nexttext = 'Rejeact node' ? item === 2 : '1st node' ? item === 3 : 'Completed node' ? item >= 4 : ''
        html += `<tr>`
                + `<td>${action_name[item]}</td>`
                + `<td>${midd}</td>`
                + `<td>${nexttext}</td>`
                +`</tr>`;
    }
    $modal.find('table tbody').html(html);
    $modal.modal('show')
    console.log('node data', data);
    console.log('----end node click------')

    // call btn click action
    //     ....
}

let NODE_LIST = {
    1: {
        order: 1,
        title: "Node 001",
        remark: "lorem ipsum",
        action: [1, 2, 3],
        collaborators: {
            option: "in_workflow",
            total: 1,
        }
    },
    2: {
        order: 2,
        title: "Node 002",
        remark: "lorem ipsum",
        action: [4],
        collaborators: {
            option: "out_form",
            total: 3,
        }
    },
    3: {
        order: 3,
        title: "Node 003",
        remark: "lorem ipsum",
        action: [5],
        collaborators: {
            option: "in_form",
            total: 2,
        }
    },
};

class JSPlumbsHandle {
    constructor() {
        this.defaultNodeList = [];
        this.dataAssociateList = [];
    }

    set setNodeList(strData) {
        if (strData && typeof strData === 'string') {
            try {
                strData = JSON.parse(strData)
                NODE_LIST = strData.reduce((item, idx) =>{
                    return item[idx.key] = idx.val
                })
            } catch (e) {
                console.error('setNodeList parse data is errors: ', e)
                strData = []
            }
        }
        this.defaultNodeList = strData
    }

    get getAssociate() {
        return this.dataAssociateList
    }

    htmlDragRender() {
        this.defaultNodeList = [
            {
                order: 1,
                title: "Node 001",
                remark: "lorem ipsum",
                action: [1, 2, 3],
                collaborators: {
                    option: "in_workflow",
                    total: 1,
                }
            },
            {
                order: 2,
                title: "Node 002",
                remark: "lorem ipsum",
                action: [4],
                collaborators: {
                    option: "out_form",
                    total: 3,
                }
            },
            {
                order: 3,
                title: "Node 003",
                remark: "lorem ipsum",
                action: [5],
                collaborators: {
                    option: "in_form",
                    total: 2,
                }
            },
        ]
        let strHTMLDrapNode = '';
        if (this.defaultNodeList.length) {
            for (let item of this.defaultNodeList) {
                strHTMLDrapNode += `<div class="control" data-drag="${item.order}">`
                    + `<p class="drag-title" contentEditable="true" title="${item.remark}">${item.title}</p></div>`;
            }
        }
        // $('#node_dragbox').html(strHTMLDrapNode)
        $('#node_dragbox').html(strHTMLDrapNode)
    };


    renderAndRerenderDrag() {
        this.setNodeList = $('#datatable_node_list').val();
        this.htmlDragRender();
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
                    let html = $(`<div class="clone" data-drag="${$(this).attr('data-drag')}">`
                        + `${$(this).find('.drag-title').text()}</div>`);
                    return html;
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
                                        click: function (labelOverlay, originalEvent) {
                                            $(".change-txt").show();
                                            $("#label").value = labelOverlay.getLabel();
                                            if (document.getElementById("label").value == "")
                                                labelOverlay.setLabel("label");
                                            else
                                                labelOverlay.setLabel(document.getElementById("label").value);
                                            $('#label').val("");
                                        },
                                        dblclick: function (labelOverlay, originalEvent) {
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
                    $('#'+is_id).off().on("click", function(evt){
                        // console.log('click on event', evt)
                        eventNodeClick(evt)
                    }, )
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
        this.setNodeList = $('#datatable_node_list').val();
        this.htmlDragRender();
        this.initJSPlumbs();
    }
}