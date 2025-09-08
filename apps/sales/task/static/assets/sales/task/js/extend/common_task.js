class labelHandle {
    deleteLabel(elm) {
        elm.find('.tag-delete').on('click', function (e) {
            const $taskLabelElm = $('#inputLabel')
            e.stopPropagation();
            const selfTxt = $(this).prev().text();
            elm.remove();
            let labelList = JSON.parse($taskLabelElm.val())
            const idx = labelList.indexOf(selfTxt)
            if (idx > -1) labelList.splice(idx, 1)
            $taskLabelElm.attr('value', JSON.stringify(labelList))
        })
    }

    renderLabel(list) {
        // reset empty
        let htmlElm = $('.label-mark')
        htmlElm.html('')
        for (let item of list) {
            const labelHTML = $(`<span class="item-tag"><span>${item}</span><span class="tag-delete">x</span></span>`)
            htmlElm.append(labelHTML)
            this.deleteLabel(labelHTML)
        }
    }

    // on click add label
    addLabel() {
        const $taskLabelElm = $('#inputLabel')
        const _this = this
        $('.form-tags-input-wrap .btn-add-tag').on('click', function () {
            const $elmInputLabel = $('#inputLabelName')
            const newTxt = $elmInputLabel.val()
            let labelList = $taskLabelElm.attr('value')
            if (labelList !== undefined && labelList !== '') labelList = JSON.parse(labelList)
            else labelList = []
            labelList.push(newTxt)
            $taskLabelElm.attr('value', JSON.stringify(labelList))
            const labelHTML = $(`<span class="item-tag"><span>${newTxt}</span><span class="tag-delete">x</span></span>`)
            $('.label-mark').append(labelHTML)
            $elmInputLabel.val('')
            _this.deleteLabel(labelHTML)
        })
    }

    showDropdown() {
        $('.label-mark').off().on('click', function () {
            const isParent = $(this).parent('.dropdown')
            isParent.children().toggleClass('show')
            $('input', isParent).focus()
        });
        $('.form-tags-input-wrap .btn-close-tag').on('click', function () {
            $(this).parents('.dropdown').children().removeClass('show')
        })
    }

    init() {
        this.showDropdown()
        this.addLabel()
    }
}

class checklistHandle {
    datalist = []

    set setDataList(data) {
        this.datalist = data;
    }

    render() {
        let $elm = $('.wrap-checklist')
        $elm.html('')
        for (const item of this.datalist) {
            let html = $($('.check-item-template').html())
            // html.find
            html.find('label').text(item.name)
            html.find('input').prop('checked', item.done)
            $elm.append(html)
            html.find('label').focus()
            this.delete(html)
        }
    }

    delete(elm) {
        elm.find('button').off().on('click', () => elm.remove())
    }

    get() {
        let checklist = []
        $('.wrap-checklist .checklist_item').each(function () {
            checklist.push({
                'name': $(this).find('label').text(),
                'done': $(this).find('input').prop('checked')
            })
        })
        return checklist
    }

    add() {
        const _this = this;
        $('.create-checklist').off().on('click', function () {
            let html = $($('.check-item-template').html())
            // html.find
            $('.wrap-checklist').append(html)
            html.find('label').focus(function () {
                $(this).select();
            });
            _this.delete(html)
        });
    }

    init() {
        this.add()
    }
}

function logworkSubmit() {
    $('#save-logtime').off().on('click', function () {
        const startDate = $('#startDateLogTime').val()
        const endDate = $('#endDateLogTime').val()
        const est = $('#EstLogtime').val()
        const taskID = $('#logtime_task_id').val()
        if (!startDate || !endDate || !est) {
            $.fn.notifyB({description: $('#form_valid').attr('data-logtime-valid')}, 'failure')
            return false
        }
        const data = {
            'start_date': startDate,
            'end_date': endDate,
            'time_spent': est,
        }
        // if has task id => log time
        if (taskID && taskID.valid_uuid4()) {
            data.task = taskID
            let url = $('#url-factory').attr('data-logtime')
            $.fn.callAjax2({
                'url': url,
                'method': 'POST',
                'data': data
            })
                .then(
                    (req) => {
                        let data = $.fn.switcherResp(req);
                        if (data?.['status'] === 200) {
                            $.fn.notifyB({description: data.message}, 'success')
                        }
                    },
                    (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
                )
        } else {
            $('[name="log_time"]').attr('value', JSON.stringify(data))
        }
        $('#logWorkModal').modal('hide')
    });
}

// logic of task extend to other apps
class TaskExtend {

    static openTaskFromTbl(ele, $table) {
        let $canvasEle = $('#offCanvasRightTask');
        let row = ele.closest('tr');
        let rowIndex = $table.DataTable().row(row).index();
        $canvasEle.attr('data-tbl-id', $table[0].id);
        $canvasEle.attr('data-row-idx', rowIndex);
        let taskIDEle = row.querySelector('.table-row-task-id');
        if (taskIDEle) {
            if (!$(taskIDEle).val()) {
                $canvasEle.offcanvas('show');
            }
            if ($(taskIDEle).val()) {
                let $kbScrollEle = $('#kb_scroll');
                if ($kbScrollEle.length > 0) {
                    let titleEle = $kbScrollEle[0].querySelector(`.card-title[data-task-id="${$(taskIDEle).val()}"]`);
                    if (titleEle) {
                        $(titleEle).trigger('click');
                    }
                }
            }
        }
        return true;
    };

    static storeData(formData) {
        let $canvasEle = $('#offCanvasRightTask');
        let $cusAssigneeEle = $('#custom_assignee');

        let $table = $(`#${$canvasEle.attr('data-tbl-id')}`);
        let rowIdx = $canvasEle.attr('data-row-idx');
        let rowApi = $table.DataTable().row(rowIdx);
        let row = rowApi.node();
        let taskIDEle = row.querySelector('.table-row-task-id');
        let taskDataEle = row.querySelector('.table-row-task-data');
        let assigneeNameEle = row.querySelector('.assignee-name');
        let assigneeCharEle = row.querySelector('.assignee-char');
        if (taskIDEle) {
            $(taskIDEle).val(formData?.['id']);
        }
        if (taskDataEle) {
            $(taskDataEle).val(JSON.stringify(formData));
        }
        let assigneeData = SelectDDControl.get_data_from_idx($cusAssigneeEle, formData?.['employee_inherit_id']);
        if (assigneeNameEle) {
            $(assigneeNameEle).attr('title', assigneeData?.['full_name']);
        }
        if (assigneeCharEle) {
            $(assigneeCharEle).html(assigneeData?.['first_name'].charAt(0).toUpperCase());
        }
        return true;
    };

    static delTaskFromDelRow(ele) {
        let row = ele.closest('tr');
        let taskIDEle = row.querySelector('.table-row-task-id');
        if (taskIDEle) {
            if ($(taskIDEle).val()) {
                let $kbScrollEle = $('#kb_scroll');
                if ($kbScrollEle.length > 0) {
                    let titleEle = $kbScrollEle[0].querySelector(`.card-title[data-task-id="${$(taskIDEle).val()}"]`);
                    if (titleEle) {
                        let taskListEle = titleEle.closest('.tasklist');
                        if (taskListEle) {
                            let delEle = taskListEle.querySelector('.del-task-act');
                            if (delEle) {
                                $(delEle).trigger('click');
                            }
                        }
                    }
                }
            }
        }
        return true;
    };
}