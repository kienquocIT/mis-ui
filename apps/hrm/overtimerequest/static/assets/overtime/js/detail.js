function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function runCalendar(data = []) {
    let curYear = moment().format('YYYY');
    let curMonth = moment().format('MM');
    const DateListSet = new Map();
    data.date_list.forEach(item => {
        DateListSet.set(item.date, item);
    });

    const calendar = new FullCalendar.Calendar($('#calendar')[0], {
        initialView: 'dayGridMonth',
        initialDate: curYear + '-' + curMonth + '-07',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: ''
        },
        themeSystem: 'bootstrap',
        height: 'parent',
        dayCellDidMount: function (arg) {
            if (arg.el.classList.contains('fc-day-past')) return true
            let dateStr = moment(arg.date).format('YYYY-MM-DD');
            if (DateListSet.has(dateStr)){
                let checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'day-checkbox';
                checkbox.style.position = 'absolute';
                checkbox.style.top = '5px';
                checkbox.style.right = '5px';
                checkbox.style.zIndex = '10';
                checkbox.setAttribute('arial-label', `day in month ${arg}`)
                checkbox.id = `day_${arg.date.getTime()}`

                checkbox.setAttribute('data-date', dateStr);
                checkbox.checked = true

                arg.el.style.position = 'relative';
                arg.el.appendChild(checkbox);
            }

        },
    });

    setTimeout(function () {
        $('.fc-prev-button,.fc-next-button').addClass('btn-icon btn-flush-dark btn-rounded flush-soft-hover').find('.fa').addClass('icon');
    }, 100);

    calendar.render();

    const event = [];
    for (let item of data['date_list']) {
        const shift = item?.['shift']
        if (shift && Object.keys(shift).length)
            event.push({
                title: shift.title,
                start: item.date,
                extendedProps: {
                    shiftData: shift,
                    toHtml: 'convert'
                }
            });
    }
    calendar.addEventSource(event);
};

$(document).ready(function () {
    const $formElm = $('#overtime_request_form')
    // get detail request info
    $.fn.callAjax2({
        'url': $formElm.attr('data-url-detail'),
        'method': 'GET',
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp)
            WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id'])
            $x.fn.renderCodeBreadcrumb(data);
            $.fn.compareStatusShowPageAction(data);
            $('#ipt_title').val(data.title)
            $('#start_time').val(data.start_time)
            $('#end_time').val(data.end_time)
            $('#reason').val(data.reason)

            const data_employee = data?.['employee_list_data'].length ? data?.['employee_list_data'] : [data.employee_inherit]

            $('#table_employee').DataTableDefault({
                data: data_employee,
                ordering: false,
                info: false,
                columns: [
                    {
                        data: 'id',
                        width: '70%',
                        render: (row, type, data) => {
                            return `<div class="form-check form-check-lg d-flex align-items-center">`
                                + `<input type="checkbox" id="check_employee_${row}" class="form-check-input" data-group-id="${data?.['group']?.['id']}" checked>`
                                + `<label class="form-check-label" for="check_employee_${row}">${data?.['full_name']}</label></div>`;
                        }
                    },
                    {
                        data: 'code',
                        width: '30%',
                        render: (row) => {
                            return `<span class="form-check-label">${row ? row : '--'}</span>`;
                        }
                    }
                ]
            })

            $('#table_group').DataTableDefault({
                data: data_employee ? data_employee.sort((a, b) => {
                    const codeA = a.group?.code?.toUpperCase() || '';
                    const codeB = b.group?.code?.toUpperCase() || '';
                    return codeA.localeCompare(codeB);
                }) : [],
                ordering: false,
                info: false,
                columns: [
                    {
                        name: $.fn.gettext('Group'),
                        data: 'id',
                        width: '70%',
                        render: (row, type, data) => {
                            return `<div class="form-check form-check-lg d-flex align-items-center ml-4">`
                                + `<input type="checkbox" id="child_employee_${row}" class="form-check-input" checked>`
                                + `<label class="form-check-label" for="check_employee_${row}">${data.full_name}</label>`
                                + `<p class="ml-auto mr-sm-3 mr-md-5">${data?.code ? data.code : '--'}</p></div>`;
                        }
                    },
                    {
                        data: 'group',
                        render: (row) => {
                            return `<span>${row?.['title']}</span>`
                        }
                    }
                ],
                columnDefs: [
                    {
                        targets: [1],    // hidden group column
                        visible: false
                    }
                ],
                rowGroup: {
                    dataSrc: 'group.title', // grouped by field group.title
                    startRender: function (rows, groupTitle) {
                        const id = `${rows.data()[0]?.group?.id}`;
                        return $(`<div class="d-flex justify-content-between align-items-center">`
                            + `<p><button type="button" class="btn btn-icon btn-rounded mr-1 btn-soft-secondary"><span class="icon"><i class="fas fa-caret-down"></i></span></button>${groupTitle}</p>`
                            + `<div class="form-check form-check-lg"><input type="checkbox" id="id_${id}" aria-label="${groupTitle}" class="form-check-input" checked></div></div>`);
                    }
                },
            });

            runCalendar(data)
        },
        (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
    )
});