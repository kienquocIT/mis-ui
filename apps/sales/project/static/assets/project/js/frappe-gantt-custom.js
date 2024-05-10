
class fGanttCustom {
    static setup_left_header(title_list){
        // return HTML
        const parentElm = document.querySelector('.gantt-left')
        let left_header = document.createElement('div')
        left_header.classList.add('gantt-wrap-title');
        let stringHTML = '';
        let total_w = 0
        for (let item of title_list['left_list']){
            total_w += item.width
            stringHTML += (`<div style="width: ${item.width}px;"><p>${item.name}</p></div>`)
        }
        left_header.innerHTML = stringHTML
        parentElm.innerHTML = ''
        parentElm.appendChild(left_header)
        parentElm.style.width = total_w

    }

    static convert_data(groups, works){
        let WSttList = [
            $.fn.gettext('To do'),
            $.fn.gettext('In progress'),
            $.fn.gettext('Completed'),
            $.fn.gettext('Pending')
        ]

        let new_groups = groups.map(function(item){
            return {
                id: item.id,
                name: item.title,
                start: moment(item.date_from, 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD'),
                end: moment(item.date_end, 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD'),
                progress: item.progress,
                weight: item.weight,
                is_group: true,
                is_toggle: true,
                order: item.order
            }
        });
        let new_works = works.map(function(item){
            return {
                id: item.id,
                name: item.title,
                start: moment(item.date_from, 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD'),
                end: moment(item.date_end, 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD'),
                progress: item.progress,
                weight: item.weight,
                child_of_group: !!item.group,
                child_group_id: item.group,
                is_show: true,
                relationships_type: item.relationships_type,
                order: item.order,
                work_status: WSttList[item.work_status],
                dependencies: item['dependencies_parent']
            }
        });
        // sort ds của works và group
        let dataList = [...new_groups, ...new_works];
        let detailIdx = 0
        dataList.sort((a, b) => a.order - b.order);
        if (dataList.length)
            detailIdx = dataList[dataList.length - 1]['order']
        $('.gantt-wrap').data('detail-index', detailIdx)
        return dataList
    }

    static setup_init_create(){
        $('.btn-gaw-group').on('click', function(){
            fGanttCustom.addGroup();
        });
        $('.btn-gaw-work').on('click', function(){
            fGanttCustom.addWork();
        })
        if ($('.gantt-left-outerwrap').children('.btn-save-sort-idx').length === 0){
            $('.gantt-left-outerwrap').append(`<button class="btn hidden btn-save-sort-idx btn-outline-primary btn-sm ml-2" type="button">${$.fn.gettext('Save')}</button>`)
            $('.btn-save-sort-idx').on('click', function(e) {
                e.preventDefault();
                let work_lst = [], group_lst = [];
                $('.gantt-left-container .grid-row').each(function () {
                    const temp = {
                        id: $(this).attr('data-id'),
                        order: $(this).index() + 1
                    }
                    if ($(this).attr('data-group') === undefined)
                        group_lst.push(temp)
                    else
                        work_lst.push(temp)
                });
                $.fn.callAjax2({
                    url: $('#url-factory').attr('data-update-order'),
                    method: 'put',
                    data: {
                        list_update: {
                            work: work_lst,
                            group: group_lst
                        }
                    },
                    sweetAlertOpts: {'allowOutsideClick': true},
                }).then(
                    (resp) => {
                        let res = $.fn.switcherResp(resp);
                        if (res) {
                            $.fn.notifyB({description: res.message}, 'success')
                            location.reload()
                        }
                    },
                    (err) => {
                        $.fn.notifyB({description: err.data.errors}, 'failure')
                    }
                )
            });
        }
    }

    static addGroup(){
        $('#groupTitle, #groupStartDate, #groupEndDate, #groupWeight, #groupRate').val('');
        $('#btn-group-add').text($.fn.gettext('Add'))
        $('#group_modal').modal('show');
    }

    static addWork(){
        $('#workTitle, #workStartDate, #workEndDate, #workWeight, #workRate, #select_project_group, #select_relationships_type, #select_project_work').val('');
        $('#btn-work-add').text($.fn.gettext('Add'))
        $('#work_modal').modal('show');
    }

    static load_detail_group(group_ID){
        const $pjElm = $('#id');
        if (!$pjElm.val())
            return false
        $.fn.callAjax2({
            'url': $('#url-factory').attr('data-group-detail').format_url_with_uuid(group_ID),
            'method': 'get',
            'data': {"project": $pjElm.val()},
            'sweetAlertOpts': {'allowOutsideClick': true},
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && (data['status'] === 201 || data['status'] === 200)) {
                    $('#groupTitle').val(data.title)
                    $('#groupStartDate').val(moment(data.gr_start_date, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY'))
                    $('#groupEndDate').val(moment(data.gr_end_date, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY'))
                    let $gID = $('<input id="group_id" type="hidden"/>')
                    $gID.val(data.id)
                    $('#groupWeight').val(data.gr_weight)
                    $('#groupRate').val(data.gr_rate)
                    $('#group_modal').modal('show')
                    $('#group_modal .modal-body').append($gID)
                    $('#group_modal #btn-group-add').text($.fn.gettext('Save'))
                }
            },
            (err) => {
                $.fn.notifyB({description: err.data.errors}, 'failure')
            }
        )
    }

    static load_detail_work(work_ID){
        $.fn.callAjax2({
            'url': $('#url-factory').attr('data-work-detail').format_url_with_uuid(work_ID),
            'method': 'get',
            'sweetAlertOpts': {'allowOutsideClick': true},
        }).then(
            (resp) => {
                let res = $.fn.switcherResp(resp);
                if (res && (res['status'] === 201 || res['status'] === 200)) {
                    $('#workTitle').val(res.title)
                    $('#workStartDate').val(moment(res.w_start_date, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY'))
                    $('#workEndDate').val(moment(res.w_end_date, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY'))
                    let $wID = $('<input id="work_id" type="hidden"/>')
                    $wID.val(res.id)
                    $('#workWeight').val(res.w_weight)
                    $('#workRate').val(res.w_rate)
                    $('#work_modal .modal-body').append($wID)
                    $('#work_modal #btn-work-add').text($.fn.gettext('Save'))
                    if (res.group.hasOwnProperty('id'))
                        $('#select_project_group').attr('data-onload', JSON.stringify(res.group))
                            .append(`<option value="${res.group.id}">${res.group.title}</option>`)
                            .val(res.group.id).trigger('change')
                    if (res.work_dependencies_type !== null)
                        $('#select_relationships_type').val(res.work_dependencies_type).trigger('change')
                    if (res.work_dependencies_parent.hasOwnProperty('id'))
                        $('#select_project_work').attr('data-onload', JSON.stringify(res.work_dependencies_parent))
                            .append(`<option value="${res.work_dependencies_parent.id}">${res.work_dependencies_parent.title}</option>`)
                            .val(res.work_dependencies_parent.id).trigger('change')
                    $('#work_modal').modal('show')
                }
            },
            (err) => {
                $.fn.notifyB({description: err.data.errors}, 'failure')
            }
        )
    }

    static delete_row(row){
        const $urlFactory = $('#url-factory')
        let url = $urlFactory.attr('data-group-detail').format_url_with_uuid(row.id)
        if (!row.is_group) url = $urlFactory.attr('data-work-detail').format_url_with_uuid(row.id)

        $.fn.callAjax2({
            'url': url,
            'method': 'delete',
            'sweetAlertOpts': {'allowOutsideClick': true},
        }).then(
            (resp) => {
                let res = $.fn.switcherResp(resp);
                if (res) $.fn.notifyB({description: res.message}, 'success')
            },
            (err) => {
                $.fn.notifyB({description: err.data.errors}, 'failure')
            })

    }
}
