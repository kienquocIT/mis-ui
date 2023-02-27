class JSPlumbsHandle {
    constructor() {
        this.defaultNodeList = [];
    }

    set setNodeList(strData) {
        if (strData && typeof strData === 'string') {
            try {
                strData = JSON.parse(strData)
            } catch (e) {
                console.error('setNodeList parse data is errors: ', e)
                strData = []
            }
        }
        this.defaultNodeList = strData
    }

    htmlDragRender() {
        this.defaultNodeList = [
            {
                order: 1,
                title: 'Node 001',
                remark: 'lorem ipsum',
                action: [1, 2, 3],
                collaborators: {
                    option: 'in_workflow',
                    total: 1,
                }
            },
            {
                order: 2,
                title: 'Node 002',
                remark: 'lorem ipsum',
                action: [4],
                collaborators: {
                    option: 'out_form',
                    total: 3,
                }
            },
            {
                order: 3,
                title: 'Node 003',
                remark: 'lorem ipsum',
                action: [5],
                collaborators: {
                    option: 'in_form',
                    total: 2,
                }
            },
        ]
        let strHTMLDrapNode = '';
        if (this.defaultNodeList.length) {
            for (let item of this.defaultNodeList) {
                strHTMLDrapNode += `<div class="control" data-drag="${item.order}"><p class="drag-title" contentEditable="true">${item.title}</p><p class="remark">${item.remark}</p></div>`;
            }
        }
        $('#node_dragbox').html(strHTMLDrapNode)
    };

    renderAndRerenderDrag() {
        this.setNodeList = $('#datatable_node_list').val();
        this.htmlDragRender();
    };

    initJSPlumbs() {
        var instance = jsPlumb.getInstance({});

        $("#node_dragbox .control").each(function(){
            $(this).draggable();
        })
        // instance.makeTarget($("#node_dragbox"), {
        //     anchor: "Continuous"
        // });
        //
        // instance.makeSource($("#flowchart_workflow"), {
        //     anchor: "Continuous"
        // });
    }

    init() {
        this.setNodeList = $('#datatable_node_list').val();
        this.htmlDragRender();
        this.initJSPlumbs();
    }
}