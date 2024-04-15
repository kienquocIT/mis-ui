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

        let new_groups = groups.map(function(item){
            let temp = {
                id: item.id,
                name: item.title,
                start: moment(item.date_from).format('YYYY-MM-DD'),
                end: moment(item.date_to).format('YYYY-MM-DD'),
                progress: item.progress,
            }
            return {...temp,
                is_group: true,
                is_toggle: true,
                objData: temp
            }
        });
        let new_work = works.map(function(item){
            let temp = {
                id: item.id,
                name: item.title,
                start: moment(item.date_from).format('YYYY-MM-DD'),
                end: moment(item.date_to).format('YYYY-MM-DD'),
                progress: item.progress,
            }
            return {...temp,
                is_group: true,
                is_toggle: true,
                objData: temp
            }
        });
        // sort ds của works và group
        let dataList = [...new_groups, ...works];
        let detailIdx = 1
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
        });
    }

    static addGroup(){
        const $tit = $('#groupTitle'), $startD = $('#groupStartDate'), $startE = $('#groupEndDate'),
            $gModal = $('#group_modal');
        $tit.val('')
        $startD.val('')
        $startE.val('')
        $gModal.modal('show')
        $('#btn-group-add').off().on('click', function(){
            if (!$tit.val()){
                $.fn.notifyB({description: $.fn.gettext('Title is required')}, 'failure');
                return false
            }
            const data = {
                'project': $('#id').val(),
                'title': $tit.val(),
                'employee_inherit': $('#selectEmployeeInherit').val(),
                'gr_weight': 0,
                'gr_rate': 0,
                'gr_start_date': moment($startD.val()).format('YYYY-MM-DD'),
                'gr_end_date': moment($startE.val()).format('YYYY-MM-DD'),
                'order': parseInt($('.gantt-wrap').data('detail-index')) + 1
            }
            $.fn.callAjax2({
                'url': $('#url-factory').attr('data-group'),
                'method': 'post',
                'data': data
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && (data['status'] === 201 || data['status'] === 200)){
                        $.fn.notifyB({description: data.message}, 'success');
                        $gModal.modal('hide')
                        let crtIdx = $('.gantt-wrap').data('detail-index')
                        $('.gantt-wrap').data('detail-index', crtIdx + 1)
                    }
                },
                (err) => {
                    $.fn.notifyB({description: err.data.errors}, 'failure')
                }
            )
        });
    }

    static addWork(){
        const $tit = $('#workTitle'), $startD = $('#workStartDate'), $startE = $('#workEndDate'),
            $gModal = $('#work_modal'), $pjGroup = $('#select_project_group');
        $tit.val('')
        $startD.val('')
        $startE.val('')
        $gModal.modal('show')
        $('#btn-work-add').off().on('click', function(){
            if (!$tit.val()){
                $.fn.notifyB({description: $.fn.gettext('Title is required')}, 'failure');
                return false
            }
            const data = {
                'project': $('#id').val(),
                'title': $tit.val(),
                'employee_inherit': $('#selectEmployeeInherit').val(),
                'w_weight': 0,
                'w_rate': 0,
                'w_start_date': moment($startD.val()).format('YYYY-MM-DD'),
                'w_end_date': moment($startE.val()).format('YYYY-MM-DD'),
                'order': parseInt($('.gantt-wrap').data('detail-index')) + 1
            }
            if ($pjGroup.val())
                data.group = $pjGroup.val()
            $.fn.callAjax2({
                'url': $('#url-factory').attr('data-work'),
                'method': 'post',
                'data': data
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && (data['status'] === 201 || data['status'] === 200)){
                        $.fn.notifyB({description: data.message}, 'success');
                        let crtIdx = parseInt($('.gantt-wrap').data('detail-index'))
                        $('.gantt-wrap').data('detail-index', crtIdx + 1)
                        $gModal.modal('hide')
                    }
                },
                (err) => {
                    $.fn.notifyB({description: err.data.errors}, 'failure')
                }
            )
        });
    }
}