$(document).ready(function () {
    class designFormUtils {
        // ----------------------------------------- //
        //
        //  Support all action that DnD need handle
        //
        // ----------------------------------------- //


        // template of row and item element
        rowData = '<div class="my-row row mb-1"><div class="utils-form absolute-top-over"><div class="util-form-control util-form-row"><i class="fas fa-times btn btn-xs util-form-control-btn util-row-remove "></i><i class="fas fa-caret-up btn btn-xs util-form-control-btn util-row-caret-up"></i><i class="fas fa-caret-down btn btn-xs util-form-control-btn util-row-caret-down"></i></div></div>{0}</div>';
        htmlChildItem = '<div class="util-child-group mb-3"><div class="utils-form"><div class="util-form-control util-form-cell"><i class="fas fa-times btn btn-xs util-form-control-btn util-cell-remove"></i><i class="fas fa-cog btn btn-xs util-form-control-btn util-cell-config"></i><i class="fas fa-caret-up btn btn-xs util-form-control-btn util-cell-caret-up"></i><i class="fas fa-caret-down btn btn-xs util-form-control-btn util-cell-caret-down"></i></div></div><div class="form-group">{0}</div></div>';

        static parseDesignForm() {
            // DnD design is success -> call this for get HTML designed!
            let designData = $("#drop-container").clone();
            designData.find('.utils-form').remove();
            return designData.html();
        }

        static getDesignFormText() {
            return $('<textarea></textarea>').val(this.parseDesignForm()).val().replaceAll('href="#', 'href="#preview_').replaceAll('id="', 'id="preview_');
        }

        static reloadPreview() {
            // call this for reload preview
            $('.design-preview').html(this.getDesignFormText());
        }

        static callbackInitElementAfterDropped() {
            // support call some action after drag component dropped.
            let elePreview = $('.design-preview');
            elePreview.find('.select2').select2();
            elePreview.find('table.table').map((idx, item) => {
                if (!$.fn.DataTable.isDataTable($(item))) $(item).DataTableDefault();
            });
        }

        static activeDropStop() {
            // call when callback "stop" of draggable is called.
            this.reloadPreview();
            this.callbackInitElementAfterDropped();
        }

        static getElementWhereIsDroppedRow(event) {
            const classFindRow = '.my-row';
            let dropPosition = {
                x: event.pageX,
                y: event.pageY
            };
            let placeInsert = 'after';
            let elementDrop = document.elementFromPoint(dropPosition.x, dropPosition.y);
            if (elementDrop) {
                let existTab = elementDrop.closest('.drop-content-dnd-tab');
                let parentX = elementDrop.closest(classFindRow);
                if (parentX) {
                    if (existTab) {
                        let tab_belong_parent = $(parentX).find('.drop-content-dnd-tab');
                        if (tab_belong_parent) {
                            parentX = elementDrop.closest('.drop-content-dnd');
                            placeInsert = 'append';
                        }
                    }
                } else {
                    parentX = elementDrop.closest('.drop-content-dnd');
                    placeInsert = 'append';
                }
                if (!parentX) {
                    console.log('[ROW] Parent is not value.', elementDrop, existTab, parentX);
                }
                return [parentX, (!!existTab), placeInsert]
            }
            console.log('[ROW] Element Drop is empty!');
            return [null, false, placeInsert]
        }

        static getElementWhereIsDroppedCell(event, realThis, elementDrop) {
            const classFindCell = '.util-child-group'
            let placeInsert = 'after';
            if (elementDrop) {
                let existTab = elementDrop.closest('.drop-content-dnd-tab');
                let parentX = elementDrop.closest(classFindCell);
                if (parentX) {
                    if (existTab) {
                        let tab_in_parent = $(parentX).find('.drop-content-dnd-tab');
                        if (tab_in_parent) {
                            parentX = elementDrop.closest('.my-col');
                            placeInsert = 'append';
                        }
                    }
                } else {
                    parentX = elementDrop.closest('.my-col');
                    placeInsert = 'append';
                }
                return [parentX, (!!existTab), placeInsert]
            }
            return [null, false, placeInsert]
        }

        static setComponentIDropped(realThis) {
            // set ID of component for get ID in droppable
            $(realThis).data("originalId", $(realThis).attr("id"))
        }

        static setComponentChildIDDropped(realThis) {
            // set ID of component for get ID in droppable
            $(realThis).data("originalId", $(realThis).attr("data-id"))
        }

        static getComponentIDDropped(ui) {
            // get ID in drop of droppable (data from setComponentIDDropped
            return ui.draggable.data("originalId");
        }

        static getComponentTextDropped(ui) {
            // get ID in drop of droppable (data from setComponentIDDropped
            return ui.draggable.text();
        }


        static hiddeDragAfterDrop(ui) {
            // when we want to hide drag component dropped.
            ui.draggable.hide();
        }

        getHtmlColumn(colCount) {
            let htmlTmp = '';
            let colNum = null;
            if (12 % colCount === 0) {
                colNum = 12 / colCount;
            }
            for (let i = 0; i < colCount; i++) {
                htmlTmp += colNum === null ? '<div class="draggable my-col col"></div>' : '<div class="my-col col-{0}"></div>'.format_by_idx(colNum);
            }
            return htmlTmp;
        }

        generateColumn(realThis, event, ui) {
            // generate row when drag LAYOUT dropped. return state (boolean) generate row.
            let [rowDrop, isTab, placeInsert] = designFormUtils.getElementWhereIsDroppedRow(event);
            if (rowDrop) {
                let textID = designFormUtils.getComponentIDDropped(ui);
                let colCount = parseInt(textID.split('-')[1]);
                if (colCount && 0 < colCount <= 12) {
                    if (isTab === true) {
                        switch (placeInsert) {
                            case 'append':
                                $(rowDrop).append(this.rowData.format_by_idx(this.getHtmlColumn(colCount)))
                                break
                            case 'after':
                                $(this.rowData.format_by_idx(this.getHtmlColumn(colCount))).insertAfter(rowDrop);
                                break
                        }
                    } else {
                        switch (placeInsert) {
                            case 'append':
                                $(rowDrop).append(this.rowData.format_by_idx(this.getHtmlColumn(colCount)))
                                break
                            case 'after':
                                $(this.rowData.format_by_idx(this.getHtmlColumn(colCount))).insertAfter(rowDrop);
                                break
                        }
                    }

                    // init drag for my-col
                    $(".my-col").droppable({
                        accept: '.drag-component-child',
                        drop: function (event, ui) {
                            // stop drag component!
                            event.stopPropagation();

                            // drag component copyright
                            let position = ui.helper.position();
                            ui.helper.remove();
                            let element = document.elementFromPoint(position.left, position.top);

                            // real target
                            if ($(element).closest($(event.target)).length > 0) {
                                if ($(element).children().length === 0) {
                                    console.log('True', element);
                                    new designFormUtils().generateItemCell(this, event, ui, element);
                                } else {
                                    $.fn.notifyB({
                                        'description': "Bạn chỉ có thể thả một phần tử vào một row"
                                    }, 'warning')
                                }
                            } else {
                                console.log('False location!');
                                // $(ui.draggable).draggable("cancel");
                                $(ui.draggable).draggable("option", "revert", true);
                                // Lưu trữ vị trí ban đầu của phần tử drag component
                                // var initialPos = ui.helper.data("initialPos");

                                // Thiết lập animation cho phần tử drag component
                                // ui.draggable.animate({ top: initialPos.top, left: initialPos.left }, 500);
                            }

                            // cal generate
                            // new designFormUtils().generateItemCell(this, event, ui, element);
                        }
                    });
                    return true
                }
                return false
            } else $.fn.notifyB({
                // 'description': "You must drop inside the cell or row -  don't drop the mouse too close to the partitions. Please try again."
                'description': "Bạn phải thả chuột vào bên trong ô hoặc hàng - không thả chuột quá gần các phân vùng. Vui lòng thử lại."
            }, 'warning')
        }

        generateItemCell(realThis, event, ui, elementAtDroppedArea) {
            let [childRowDrop, isTab, placeInsert] = designFormUtils.getElementWhereIsDroppedCell(event, realThis, elementAtDroppedArea);
            if (childRowDrop) {
                let componentId = designFormUtils.getComponentIDDropped(ui);
                let componentText = designFormUtils.getComponentTextDropped(ui);

                let dataAppend = this.htmlChildItem.format_by_idx(`<span class="text-primary text-function-child" data-id="${componentId}">${componentText}</span>`);
                if (isTab === true) {
                    switch (placeInsert) {
                        case 'append':
                            $(childRowDrop).append(this.rowData.format_by_idx(this.getHtmlColumn(childRowDrop)))
                            break
                        case 'after':
                            $(this.rowData.format_by_idx(this.getHtmlColumn(childRowDrop))).insertAfter(childRowDrop);
                            break
                    }
                } else {
                    switch (placeInsert) {
                        case 'append':
                            $(childRowDrop).append(dataAppend);
                            break
                        case 'after':
                            $(dataAppend).insertAfter(childRowDrop);
                            break
                    }
                    // childRowDrop ? $(dataAppend).insertAfter(childRowDrop) : $(realThis).append(dataAppend);
                }
            } else $.fn.notifyB({
                // 'description': "You must drop inside the cell or row -  don't drop the mouse too close to the partitions. Please try again."
                'description': "Bạn phải thả chuột vào bên  trong ô hoặc hàng - không thả chuột quá gần các phân vùng. Vui lòng thử lại."
            }, 'warning')
        }
    }

    function loadEvents() {
        // ----------------------------------------- //
        //
        //  Group all event handle in here
        //
        // ----------------------------------------- //


        // More drag components
        $('#all-drag-component').click(function (e) {
            e.preventDefault();
            $(this).addClass('hidden');
            $('.drag-component').removeClass('hidden');
        })

        // Row control
        $(document).on('click', '.util-row-remove', function (e) {
            e.preventDefault();
            $(this).closest('.my-row').remove();
            designFormUtils.activeDropStop();
        });
        $(document).on('click', '.util-row-config', function (e) {
            e.preventDefault();
            let parentEle = $(this).closest('.my-row');
            alert("Setting dialog is open! " + 'ROW');
        });
        $(document).on('click', '.util-row-caret-up', function (e) {
            e.preventDefault();
            let parentEle = $(this).closest('.my-row');
            let prevEle = parentEle.prev('.my-row');
            if (parentEle && prevEle) {
                parentEle.insertBefore(prevEle);
            }
            designFormUtils.activeDropStop();
        });
        $(document).on('click', '.util-row-caret-down', function (e) {
            e.preventDefault();
            let parentEle = $(this).closest('.my-row');
            let nextEle = parentEle.next('.my-row');
            if (parentEle && nextEle) {
                nextEle.insertBefore(parentEle);
            }
            designFormUtils.activeDropStop();
        });
        // Cell control
        $(document).on('click', '.util-cell-remove', function (e) {
            e.preventDefault();
            $(this).closest('.util-child-group').remove();
            designFormUtils.activeDropStop();
        });
        $(document).on('click', '.util-cell-config', function (e) {
            e.preventDefault();
            let parentEle = $(this).closest('.util-child-group');
            let functionEle = parentEle.find('.text-function-child');
            eventForProcess.showModalEditComponent(functionEle);
            // alert("Setting dialog is open! " + parentEle.find('input').val());
        });
        $(document).on('click', '.util-cell-caret-up', function (e) {
            e.preventDefault();
            let parentEle = $(this).closest('.util-child-group');
            let prevEle = parentEle.prev('.util-child-group');
            if (parentEle && prevEle) {
                parentEle.insertBefore(prevEle);
            }
            designFormUtils.activeDropStop();
        });
        $(document).on('click', '.util-cell-caret-down', function (e) {
            e.preventDefault();
            let parentEle = $(this).closest('.util-child-group');
            let nextEle = parentEle.next('.util-child-group');
            if (parentEle && nextEle) {
                nextEle.insertBefore(parentEle);
            }
            designFormUtils.activeDropStop();
        });

        $('#btnCopyDesignHtml').click(function (e) {
            // put HTML designed to clipboard
            e.preventDefault();
            navigator.clipboard.writeText(designFormUtils.getDesignFormText()).then().catch(err => console.error('Put data to clipboard raise errors:', err));
        });
        $('#btnExportDesignHtml').click(function (e) {
            // put HTML designed to clipboard
            e.preventDefault();
            const data = designFormUtils.getDesignFormText();
            const blob = new Blob([data], {type: "text/html"});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = "layout.html";
            link.click();
            URL.revokeObjectURL(url);
        });

        $(document).on('click', '#btn-save-subject-function', function () {
            let function_id = $('#id-function').val();
            let functionEle = $(`.text-function-child[data-id="${function_id}"]`);
            let content = $('#content-function').val();
            eventForProcess.hideModelEditComponent($(this));
            eventForProcess.saveEditComponent(functionEle, content);
        })

        const frmUpdateProcess = $('#frm-update-process');
        frmUpdateProcess.submit(function (event) {
            event.preventDefault();
            let list_process = [];
            let processEle = $('#drop-container .my-row');
            processEle.each(function () {
                list_process.push(eventForProcess.getChildRowProcess($(this), cnt));
            })
            console.log(list_process);
        })
    }

    class eventForProcess {
        getChildCol(realThis) {
            let list_col = [];
            $(realThis).each(function () {
                let childEle = $(this).find('.text-function-child');
                let subject = '';
                if (childEle.next().length > 0) {
                    subject = childEle.next().text();
                }
                let data = {
                    'id': childEle.data('id'),
                    'title': childEle.text(),
                    'subject': subject,
                }
                list_col.push(data)
            })
            return list_col
        }

        static showModalEditComponent(realThis) {
            let contentEle = realThis.next();
            $('#modal-subject-process').modal('show');
            $('#id-function').val(realThis.data('id'));
            if (contentEle.length > 0) {
                $('#content-function').val(contentEle.text());
            } else {
                $('#content-function').val('');
            }
        }

        static saveEditComponent(realThis, content) {
            $(`<script class="text-content" type="application/json">${content}</script>`).insertAfter(realThis);
        }

        static getChildRowProcess(realThis, cnt) {
            return {
                'num': cnt,
                'sub_process': new eventForProcess().getChildCol($(realThis).find('.my-col')),
            }
        }

        static hideModelEditComponent(realThis){
            $(realThis).closest('.modal').modal('hide');
        }
    }

    function loadDnD() {
        // ----------------------------------------- //
        //
        //  Group DnD handle in here
        //
        // ----------------------------------------- //

        $(".drag-component").draggable({
            cursor: "crosshair",
            cursorAt: {
                top: -5,
                left: -5
            },
            revert: "invalid",
            helper: "clone",
            start: function (event, ui) {
                designFormUtils.setComponentIDropped($(this))
            },
            stop: function (event, ui) {
                designFormUtils.activeDropStop();
            },
        });

        $('.drag-component-child').draggable({
            cursor: "crosshair",
            cursorAt: {
                top: 0,
                left: 0
            },
            revert: "invalid",
            helper: function () {
                return $(this).clone().appendTo("body").css({
                    "position": "absolute",
                    "z-index": 9999
                });
            },
            start: function (event, ui) {
                ui.helper.data("initialPos", ui.position);
                designFormUtils.setComponentChildIDDropped($(this))
            },
            stop: function (event, ui) {
                designFormUtils.activeDropStop()
            },
        });

        $('.drop-content-dnd').droppable({
            accept: ".drag-component",
            drop: function (event, ui) {
                // stop drag component!
                event.stopPropagation();

                let stateRow = new designFormUtils().generateColumn($(this), event, ui);
                // right negative float util row
                if (stateRow === true) $('.absolute-top-over').css('right', '-' + ($('.util-form-row').first().width() + 1.1 + 6) + 'px');
            }
        });
    }

    loadEvents();
    loadDnD();


    function loadFunctionInProcess(data) {
        let ele_list_function = $('.function-list');
        let ele_child = $('#function-child').children().first();
        ele_child.attr('data-id', data.id);
        ele_child.text(data.function.title);
        ele_list_function.append(ele_child);
    }

    function loadFunctionProcess() {
        if (!$.fn.DataTable.isDataTable('#datatable-function-process')) {
            let $table = $('#datatable-function-process')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                rowIdx: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('function_list')) {
                            if (resp.data['function_list']) {
                                resp.data['function_list'].map(function (item) {
                                    if (item.is_in_process) {
                                        loadFunctionInProcess(item);
                                    }
                                })
                                return resp.data['function_list']
                            } else {
                                return []
                            }
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: [
                    {
                        targets: 0,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return ``
                        }
                    },
                    {
                        data: 'function',
                        targets: 1,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<p>${data.title}</p>`
                        }
                    },
                    {
                        data: 'is_in_process',
                        targets: 2,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            if (data) {
                                return '<div class="form-check"><input class="form-check-input" type="checkbox" disabled checked>'
                            } else {
                                return '<div class="form-check"><input class="form-check-input" type="checkbox" disabled>'
                            }
                        }
                    },
                    {
                        data: 'is_free',
                        targets: 3,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            if (data) {
                                return '<div class="form-check"><input class="form-check-input" type="checkbox" disabled checked>'
                            } else {
                                return '<div class="form-check"><input class="form-check-input" type="checkbox" disabled>'
                            }
                        }
                    },
                    {
                        targets: 4,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<div><a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" `
                                + `data-bs-original-title="Delete" href="javascript:void(0)"`
                                + `data-method="DELETE"><span class="btn-icon-wrap"><span class="feather-icon">`
                                + `<i data-feather="trash-2"></i></span></span></a></div>`;
                        }
                    },
                ],
            });
        }
    }

    loadFunctionProcess();

})