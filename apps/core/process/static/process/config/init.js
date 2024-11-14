class ProcessStage {
    static htmlToolHandle = `
            <div class="tool-item handle">
                <span class="tool-item-icon" data-bs-toggle="tooltip" title="${$.fn.gettext('Arrange')}">
                    <i class="fa-solid fa-arrows-up-down-left-right"></i>
                </span>
            </div>
        `;
    static htmlToolConfig = `
            <div class="tool-item" data-code="config" data-bs-toggle="tooltip" title="${$.fn.gettext('Configurate')}">
                <span class="tool-item-icon">
                    <i class="fa-solid fa-gear fa-lg"></i>
                </span>
            </div>
        `;
    static htmlToolRemove = `
            <div class="tool-item" data-code="remove" data-bs-toggle="tooltip" title="${$.fn.gettext('Delete')}">
                <span class="tool-item-icon">
                    <i class="fa-solid fa-trash"></i>
                </span>
            </div>
        `;
    static htmlToolAddNew = `
            <div class="tool-item" data-bs-toggle="tooltip" title="${$.fn.gettext('Toolbox')}">
                <span class="tool-item-icon" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fa-solid fa-square-plus fa-lg"></i>
                </span>
                <ul class="dropdown-menu" data-popper-placement="bottom-start">
                    <li class="dropdown-item tool-btn" data-code="new_function"><i class="fa-regular fa-square-caret-right"></i> ${$.fn.gettext('New item')}</li>
                    <li class="dropdown-item tool-btn" data-code="new_prev_line"><i class="fa-regular fa-square-caret-up"></i> ${$.fn.gettext('New previous stage')}</li>
                    <li class="dropdown-item tool-btn" data-code="new_next_line"><i class="fa-regular fa-square-caret-down"></i> ${$.fn.gettext('New next stage')}</li>
                </ul>
            </div>
        `;
    static htmlToolAddNewOnlyNewFunc = `
            <div class="tool-item tool-btn" data-code="new_function" data-bs-toggle="tooltip" title="${$.fn.gettext('New item')}">
                <i class="fa-regular fa-square-caret-right fa-lg"></i>
            </div>
        `;
    static htmlToolAddNewOnlyPrevLine = `
            <div class="tool-item tool-btn" data-code="new_prev_line" data-bs-toggle="tooltip" title="${$.fn.gettext('New previous stage')}">
                <i class="fa-regular fa-square-caret-up fa-lg"></i>
            </div>
        `;
    static htmlToolAddNewOnlyNextLine = `
            <div class="tool-item tool-btn" data-code="new_next_line" data-bs-toggle="tooltip" title="${$.fn.gettext('New next stage')}">
                <i class="fa-regular fa-square-caret-down fa-lg"></i>
            </div>
        `;

    static defaultConfig = [
        {
            is_system: true,
            system_code: 'start',
            head: {
                title: 'Start',
                enable_new_function: false,
                enable_new_prev_line: false,
                enable_new_next_line: true,
                enable_config: true,
                enable_remove: false,
            },
            contents: []
        }, {
            is_system: false,
            system_code: null,
            head: {
                title: $.fn.gettext('New Stage'),
                remark: '',
            },
            contents: [
                {
                    title: $.fn.gettext('Function'),
                    remark: '',
                    application: '',
                    skip: false,
                    repeat: false,
                    background_color: '#d9f7d8',
                    color: '#000',
                }
            ]
        }, {
            is_system: true,
            system_code: 'end',
            head: {
                title: 'End',
                remark: '',
                enable_new_function: false,
                enable_new_prev_line: true,
                enable_new_next_line: false,
                enable_config: true,
                enable_remove: false,
            },
            contents: []
        },
    ];

    static getHTMLToolAddNew(opts) {
        opts = {
            enable_new_function: true,
            enable_new_prev_line: true,
            enable_new_next_line: true, ...opts
        }
        if ([
            opts.enable_new_function, opts.enable_new_prev_line, opts.enable_new_next_line,
        ].filter(v => v === true).length === 1) {
            if (opts.enable_new_function === true) {
                return $(ProcessStage.htmlToolAddNewOnlyNewFunc);
            }
            if (opts.enable_new_prev_line === true) {
                return $(ProcessStage.htmlToolAddNewOnlyPrevLine);
            }
            if (opts.enable_new_next_line === true) {
                return $(ProcessStage.htmlToolAddNewOnlyNextLine);
            }
        }
        const html$ = $(ProcessStage.htmlToolAddNew);
        opts.enable_new_function === false ? html$.find('.tool-btn[data-code="new_function"]').addClass('disabled') : '';
        opts.enable_new_prev_line === false ? html$.find('.tool-btn[data-code="new_prev_line"]').addClass('disabled') : '';
        opts.enable_new_next_line === false ? html$.find('.tool-btn[data-code="new_next_line"]').addClass('disabled') : '';
        return html$;
    }

    getHTMLStageItem(opts) {
        const clsThis = this;
        opts = {
            title: '',
            remark: '',
            application: '',
            enable_config: true,
            enable_remove: true, ...opts
        }
        const html$ = $(`
                <div class="stage-item stage-data">
                    <div>
                        <div>
                            <p class="stage-item-label">${opts.title}</p>
                            ${opts.remark ? '<small class="stage-item-remark d-block">' + opts.remark + '</small>' : ''}
                            <div>
                                <span class="stage-item-application badge badge-primary no-transform">
                                </span>
                                <span class="stage-item-skip badge badge-success badge-outline badge-sm  no-transform">
                                    <i class="fa-solid fa-forward"></i>
                                </span>
                                <span class="stage-item-repeat badge badge-indigo badge-outline badge-sm no-transform">
                                    <i class="fa-solid fa-repeat"></i>
                                </span>
                            </span>
                        </div>
                        <div class="stage-tools"></div>
                    </div>
                </div>
            `);
        html$.find('.stage-tools').append(ProcessStage.htmlToolHandle);
        if (opts.enable_config === true) html$.find('.stage-tools').append($(ProcessStage.htmlToolConfig));
        if (opts.enable_remove === true) html$.find('.stage-tools').append($(ProcessStage.htmlToolRemove));

        html$.on('data.change', function () {
            const config = html$.data('processStageData');
            $(this).find('.stage-item-label').text(config.title || '');
            $(this).find('.stage-item-remark').text(config.remark || '');
            config.skip === true ? $(this).find('.stage-item-skip').show(0) : $(this).find('.stage-item-skip').hide(0);
            config.repeat === true ? $(this).find('.stage-item-repeat').show(0) : $(this).find('.stage-item-repeat').hide(0);
            if (config.application) {
                $(this).removeClass('stage-not-done');
                $(this).find('.stage-item-application').text(clsThis.getAppDetail(config.application, 'title')).show(0);
            } else {
                $(this).addClass('stage-not-done');
                $(this).find('.stage-item-application').text('').hide(0);
            }
            if (config.background_color) $(this).css('background-color', config.background_color);
            if (config.color) $(this).css('color', config.color);
        });
        html$.data('processStageData', opts);
        return html$;
    }

    addNewLine(stage$, after_or_before) {
        const clsThis = this;
        clsThis.changeState = true;
        const processStage$ = stage$.closest('.process-stage');
        const newStage$ = clsThis.generateStage(ProcessStage.defaultConfig[1]);
        newStage$.find('.stage-data').addClass('focusing');
        setTimeout(() => newStage$.find('.stage-data').removeClass('focusing'), 1000)
        switch (after_or_before) {
            case 'before':
                newStage$.insertBefore(processStage$);
                break
            case 'after':
            default:
                newStage$.insertAfter(processStage$);
                break
        }
    }

    generateHead(opts) {
        opts = {
            title: '',
            remark: '',
            enable_new_function: true,
            enable_new_prev_line: true,
            enable_new_next_line: true,
            enable_config: true,
            enable_remove: true, ...opts
        }
        const html$ = $(`
            <div class="stage-head stage-data">
                <div>
                    <p class="stage-label">${opts.title ? opts.title : ''}</p>
                    ${opts.remark ? '<small class="stage-remark d-block">' + opts.remark + '</small>' : ''}
                </div>
            </div>
        `);
        const tool$ = $(`<div class="stage-tools"></div>`);
        tool$.append(ProcessStage.htmlToolHandle);
        opts.enable_config ? tool$.append($(ProcessStage.htmlToolConfig)) : null;
        opts.enable_remove ? tool$.append($(ProcessStage.htmlToolRemove)) : null;
        tool$.append(ProcessStage.getHTMLToolAddNew(opts));
        html$.append(tool$);
        html$.data('processStageData', opts);
        html$.on('data.change', function () {
            const config = html$.data('processStageData');
            $(this).find('.stage-label').text(config.title || '');
            $(this).find('.stage-remark').text(config.remark || '');
        })
        return html$;
    }

    generateContent(contentData) {
        const content$ = $(`<div class="stage-content"></div>`);
        contentData.map(item => {
            content$.append(this.getHTMLStageItem(item));
        })
        content$.sortable({
            items: "div.stage-item:not(.fixed)",
            placeholder: 'stage-item dragging',
            handle: '.handle',
            start: (event, ui) => {
                $(ui.item).addClass('dragger-item');
            },
            stop: (event, ui) => {
                $(ui.item).removeClass('dragger-item');
            },
            connectWith: ".stage-content",
            cursor: "move",
            cursorAt: {left: 0},
        });
        content$.disableSelection();
        return content$;
    }

    generateStage(config) {
        config = {
            is_system: false,
            system_code: null, ...config
        };
        const stage$ = $(`<div class="process-stage"></div>`);
        if (config.is_system === true) {
            const systemConfig = config.system_code === 'start' ? {enable_new_next_line: true} : config.system_code === 'end' ? {enable_new_prev_line: true} : {};
            const head$ = this.generateHead({
                title: config.system_code === 'start' ? $.fn.gettext('Start') : config.system_code === 'end' ? $.fn.gettext('End') : '',
                enable_new_function: false,
                enable_new_prev_line: false,
                enable_new_next_line: false,
                enable_config: true,
                enable_remove: false, ...systemConfig,
            });
            stage$
                .append(head$)
                .addClass('process-stage-full fixed')
                .find('.stage-head').addClass('stage-system');
        } else {
            const head$ = this.generateHead(config.head);
            const content$ = this.generateContent(config?.contents || []);
            stage$.append(head$).append(content$).find('.stage-head').addClass('stage-added');
        }
        stage$.data('processStageData', config);
        return stage$;
    }

    constructor(target$) {
        this.target$ = target$;
        this.modalStageConfig$ = $('#modalStageConfig');
        this.modalItemConfig$ = $('#modalItemConfig');
        this.changeState = false;

        this.applicationData = [];
        this.applicationDict = null;
        this.inpApp$ = $('#inp-item-app');
    }

    getAppDetail(app_id, return_value = 'title') {
        if (!this.applicationDict) {
            this.applicationDict = {};
            this.applicationData.map(item => {
                this.applicationDict[item.id] = item;
            })
        }
        const data = this.applicationDict?.[app_id] || {};
        if (return_value) return data?.[return_value] || '';
        return data;
    }

    on_events() {
        const clsThis = this;
        this.target$.data('processStageCls', clsThis);
        this.target$.find('[data-bs-toggle="dropdown"]').dropdown();
        $(window).on('beforeunload', function (e) {
            if (clsThis.changeState === true) {
                e.preventDefault();
                e.returnValue = '';
            }
        });

        this.target$.sortable({
            items: "div.process-stage:not(.fixed)",
            placeholder: 'process-stage dragging',
            handle: '.handle',
            start: (event, ui) => {
                $(ui.item).addClass('dragger-line');
            },
            stop: (event, ui) => {
                $(ui.item).removeClass('dragger-line');
            },
        });
        this.target$.disableSelection();

        function getStageData$(event) {
            // support get stage-data object and get config of it.
            const stageData$ = $(event.target).closest('.stage-data');
            if (stageData$.length > 0) {
                const config = stageData$.data('processStageData');
                return [stageData$, config];
            }
            return [null, null];
        }

        this.target$.on('click', '.tool-item[data-code="config"]', function (event) {
            const [stage$, config] = getStageData$(event);
            if (stage$ && config) {
                if (stage$.hasClass('stage-head')) {
                    const config = stage$.data('processStageData');
                    clsThis.modalStageConfig$.find('input[name=title]').val(config.title || '');
                    clsThis.modalStageConfig$.find('input[name=remark]').val(config.remark || '');
                    clsThis.modalStageConfig$.data('processStageCurrent', stage$);
                    clsThis.modalStageConfig$.modal('show');
                } else if (stage$.hasClass('stage-item')) {
                    const config = stage$.data('processStageData');
                    clsThis.modalItemConfig$.find('input[name=title]').val(config.title || '');
                    clsThis.modalItemConfig$.find('input[name=remark]').val(config.remark || '');
                    clsThis.modalItemConfig$.find('select[name=application]').val(config.application || '').trigger('change');
                    clsThis.modalItemConfig$.find('input[name=skip]').prop('checked', !!config.skip);
                    clsThis.modalItemConfig$.find('input[name=repeat]').prop('checked', !!config.repeat);
                    clsThis.modalItemConfig$.find('input[name=background_color]').val(config.background_color);
                    clsThis.modalItemConfig$.find('input[name=color]').val(config.color);
                    clsThis.modalStageConfig$.data('processStageCurrent', stage$);
                    clsThis.modalItemConfig$.modal('show');
                }
            }
        });
        new SetupFormSubmit(clsThis.modalStageConfig$.find('form')).validate({
            submitHandler: (form, event) => {
                event.preventDefault();
                const stage$ = clsThis.modalStageConfig$.data('processStageCurrent');
                if (stage$ && stage$ instanceof jQuery) {
                    const frm = new SetupFormSubmit($(form));
                    const config = stage$.data('processStageData');
                    stage$.data('processStageData', {
                        ...config, ...frm.dataForm,
                    });
                    stage$.trigger('data.change');
                    clsThis.modalStageConfig$.modal('hide');
                    clsThis.changeState = true;
                }
            }
        });
        new SetupFormSubmit(clsThis.modalItemConfig$.find('form')).validate({
            submitHandler: (form, event) => {
                event.preventDefault();
                const stage$ = clsThis.modalStageConfig$.data('processStageCurrent');
                if (stage$ && stage$ instanceof jQuery) {
                    const frm = new SetupFormSubmit($(form));
                    const config = {
                        ...stage$.data('processStageData'), ...frm.dataForm,
                    };
                    stage$.data('processStageData', config);
                    stage$.trigger('data.change');
                    clsThis.modalItemConfig$.modal('hide');
                    clsThis.changeState = true;
                }
            }
        })

        function removeItem(title, callback) {
            Swal.fire({
                title: title,
                showCancelButton: true,
                confirmButtonText: $.fn.gettext('Yes, delete it'),
                cancelButtonText: $.fn.gettext('Cancel'),
                icon: 'question',
            }).then((result) => {
                if (result.isConfirmed) {
                    clsThis.changeState = true;
                    callback();
                }
            });
        }

        this.target$.on('click', '.tool-item[data-code="remove"]', function (event) {
            const [stage$, config] = getStageData$(event);
            if (stage$ && config) {
                if (stage$.hasClass('stage-head')) {
                    removeItem(`${$.fn.gettext('Destroy stage')} ${config.title || ''}`, function () {
                        stage$.closest('.process-stage').remove();
                    })
                } else if (stage$.hasClass('stage-item')) {
                    removeItem(`${$.fn.gettext('Destroy item')} ${config.title || ''}`, function () {
                        stage$.remove();
                    })
                }
            }
        });

        this.target$.on('click', '.tool-btn[data-code="new_function"]', function (event) {
            const [stage$, config] = getStageData$(event);
            if (stage$ && config) {
                if (stage$.hasClass('stage-head')) {
                    clsThis.changeState = true;
                    const processStage$ = stage$.closest('.process-stage');
                    const newItem$ = clsThis.getHTMLStageItem(ProcessStage.defaultConfig[1]['contents'][0]);
                    newItem$.addClass('focusing');
                    processStage$.find('.stage-content').append(newItem$);
                    setTimeout(() => {
                        newItem$.removeClass('focusing');
                    }, 1000)
                }
            }
        });

        this.target$.on('click', '.tool-btn[data-code="new_prev_line"]', function (event) {
            const [stage$, config] = getStageData$(event);
            if (stage$ && config) {
                if (stage$.hasClass('stage-head')) {
                    clsThis.addNewLine(stage$, 'before');
                }
            }
        });

        this.target$.on('click', '.tool-btn[data-code="new_next_line"]', function (event) {
            const [stage$, config] = getStageData$(event);
            if (stage$ && config) {
                if (stage$.hasClass('stage-head')) {
                    clsThis.addNewLine(stage$, 'after');
                }
            }
        });

        this.inpApp$.initSelect2({
            data: this.applicationData.sort(function (a, b) {
                return a.title.localeCompare(b.title)
            }),
        })

        this.target$.find('.stage-data').trigger('data.change');
    }

    init(data, opts) {
        opts = {
            removeAllTools: false,
            ...opts,
        }
        const clsThis = this;
        this.target$.empty();
        $.fn.callAjax2({
            url: this.inpApp$.attr('data-x-url') + '?' + $.param({
                'pageSize': -1,
            }),
            method: 'GET',
            isLoading: true,
        }).then(resp => {
            const dataResp = $.fn.switcherResp(resp);
            if (dataResp) {
                const apps = dataResp?.['tenant_application_list'];
                if (apps) {
                    clsThis.applicationData = apps;
                }
                data.map(config => {
                    const stage$ = clsThis.generateStage(config);
                    clsThis.target$.append(stage$);
                })
                clsThis.on_events();
                if (opts.removeAllTools === true) clsThis.removeAllTools();
            }
        },)
    }

    getData() {
        let results = [];
        this.target$.find('.process-stage').each(function () {
            const config = $(this).data('processStageData');
            const head$ = $(this).find('.stage-head');
            const headData = head$.data('processStageData');
            let contentData = [];
            $(this).find('.stage-content').find('.stage-item').each(function () {
                contentData.push($(this).data('processStageData'));
            });
            results.push({
                ...config,
                head: headData,
                contents: contentData,
            });
        });
        return results;
    }

    removeAllTools(){
        this.target$.find('.stage-tools').remove();
    }
}