let editorTmp = null;

$.fn.updateDesignWeb = function (opts) {
    return new Promise(function (resolve, reject) {
        // Setup then Call Ajax
        let url = opts?.['url'] || null;
        let data = opts?.['data'] || null;
        let method = opts?.['type'] || null;
        if (url && data && data['csrfmiddlewaretoken'] && method) {
            let ctx = {
                success: function (rest, textStatus, jqXHR) {
                    window.location.reload();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log('error: ', jqXHR, textStatus, errorThrown);
                },
                url: url,
                type: method,
                contentType: "application/json",
                processData: true,
                data: JSON.stringify(data),
                headers: {
                    "X-CSRFToken": data['csrfmiddlewaretoken'] || '',
                },
            };
            return $.ajax(ctx);
        }
        throw Error('Ajax must be url setup before send');
    });
}


$(function () {
    function _resolve_url_image(url) {
        if (url.startsWith('http')) {
            return url;
        } else {
            return window.location.origin + url;
        }
    }

    function addAndBeatifyTooltips(pn) {
        let optionsList = [
            ['sw-visibility', transEle.attr('data-msg-show-border')], ['preview', transEle.attr('data-msg-preview')], ['fullscreen', transEle.attr('data-msg-fullscreen')], ['export-template', transEle.attr('data-msg-export')], ['undo', transEle.attr('data-msg-undo')], ['redo', transEle.attr('data-msg-redo')], ['gjs-open-import-webpage', transEle.attr('data-msg-import')], ['canvas-clear', transEle.attr('data-msg-clear-canvas')]
        ];
        optionsList.forEach(function (item) {
            pn.getButton('options', item[0]).set('attributes', {
                title: item[1],
                'data-tooltip-pos': 'bottom'
            });
        });
        let viewsList = [['open-sm', 'Style Manager'], ['open-layers', 'Layers'], ['open-blocks', 'Blocks']];
        viewsList.forEach(function (item) {
            pn.getButton('views', item[0]).set('attributes', {
                title: item[1],
                'data-tooltip-pos': 'bottom'
            });
        });
        let titles = document.querySelectorAll('*[title]');
        for (let i = 0; i < titles.length; i++) {
            let el = titles[i];
            let title = el.getAttribute('title');
            title = title ? title.trim() : '';
            if (!title) break;
            el.setAttribute('data-tooltip', title);
            el.setAttribute('title', '');
        }
    }

    function buttonAndCommandSave(cmdm, pn) {
        cmdm.add('save-to-api', function () {
            let frmEle = $('#frm-save');
            frmEle.find('input[name="page_html"]').val(editor.getHtml({cleanId: false}));
            frmEle.find('input[name="page_css"]').val(editor.getCss({keepUnusedStyles: true}));
            frmEle.find('input[name="page_js"]').val(editor.getJs());
            frmEle.find('input[name="project_data"]').val(JSON.stringify(editor.getProjectData()));
            let data = frmEle.serializeArray().reduce((o, kv) => ({
                ...o,
                [kv.name]: kv.value
            }), {});

            if (confirm(transEle.attr('data-msg-sure-save-it')) === true) {
                $.fn.updateDesignWeb({
                    url: frmEle.attr('data-url'),
                    type: 'PUT',
                    data: data,
                }).then((resp) => {
                    localStorage.clear();
                }, (errs) => {
                    console.log('Errors:', errs);
                })
            } else {
                console.log("You canceled!");
            }
        })

        pn.addButton('options', {
            id: 'save-to-api',
            label: '<i class="fa fa-floppy-o" aria-hidden="true"></i>',
            command: function () {
                editor.runCommand('save-to-api')
            },
            attributes: {
                'title': transEle.attr('data-msg-save'),
                'data-tooltip-pos': 'bottom',
            },
        });
    }

    function buttonAndCommandLoadStoreDataWhenDropEditor(cmdm, pn, editor) {
        cmdm.add('load-last-store', async function () {
            let data = await editorTmp.Storage.load();
            if (data) {
                if (confirm(transEle.attr('data-msg-load-last-store')) === true) {
                    editor.loadProjectData(data);
                }
            }
        })

        pn.addButton('options', {
            id: 'load-last-store',
            label: '<i class="fa fa-hdd-o" aria-hidden="true"></i>',
            command: function () {
                editor.runCommand('load-last-store')
            },
            attributes: {
                'title': transEle.attr('data-msg-load-last-store'),
                'data-tooltip-pos': 'bottom',
            },
        });
    }

    function buttonBackToPageList(cmdm, pn, editor) {
        cmdm.add('back-to-home', async function () {
            let state = confirm(transEle.attr('data-msg-back-to-home') + '. ' + transEle.attr('data-msg-are-u-sure'))
            if (state) {
                window.location.href = transEle.attr('data-url-back-to-home');
            }
        })

        pn.addButton('options', {
            id: 'back-to-home',
            label: '<i class="fa-solid fa-house"></i>',
            command: function () {
                editor.runCommand('back-to-home')
            },
            attributes: {
                'title': transEle.attr('data-msg-back-to-home'),
                'data-tooltip-pos': 'bottom',
            },
        });
    }

    function templateList(cmdm, pn, editor) {
        editor.Panels.addButton('options', {
            id: 'templates-list',
            label: '<i class="fa fa-clock-o" aria-hidden="true"></i>',
            command: function (editor) {
                editor.runCommand('templates-list');
            },
            attributes: {
                'title': 'Templates',
                'data-tooltip-pos': 'bottom',
            },
        });
    }

    function clearCanvas(cmdm) {
        cmdm.add('canvas-clear', function () {
            Swal.fire({
                title: transEle.attr('data-msg-sure-clear-canvas'),
                showCancelButton: true,
                confirmButtonText: "Save",
            }).then((result) => {
                if (result.isConfirmed) {
                    editor.runCommand('core:canvas-clear')
                    setTimeout(function () {
                        localStorage.clear()
                    }, 0);
                }
            })
        });
    }

    function storeAndLoadEvents(editor) {
        editor.on('storage:load', function (e) {
        });
        editor.on('storage:store', function (e) {
        });
        editor.on('storage:start', function (e) {
        })
    }

    function assetListener(editor) {
        // open modal asset
        editor.on('asset:open', () => {
            function resolve_item_page(data) {
                let pageCount = data.page_count;
                let pageSize = data.page_size;

                let pagePrev = data.page_previous;
                let pageNext = data.page_next;

                let loadedSize = 0;
                if (pageNext === 0 && pagePrev === 0) {
                    loadedSize = pageCount;
                } else if (pageNext === 0 && pagePrev > 0) {
                    loadedSize = pageCount;
                } else if (pageNext > 0 && pagePrev === 0) {
                    loadedSize = (pageNext - 1) * pageSize;
                } else if (pageNext - 1 === pagePrev + 1) {
                    loadedSize = (pagePrev + 1) * pageSize
                }

                return {
                    count: pageCount,
                    size: pageSize,
                    prev: pagePrev,
                    next: pageNext,
                    loaded: loadedSize,
                }
            }

            function call_cloud_img(data, widget) {
                let eleSyncState = $(widget).find('.sync-state');
                $.ajax({
                    url: transEle.attr('data-url-image-cloud'),
                    type: 'GET',
                    contentType: "application/json",
                    data: data,
                    success: function (rest, textStatus, jqXHR) {
                        let data = rest?.['data'] || {};
                        if (data) {
                            let fileList = data?.['file_list'] || null;
                            if (fileList && Array.isArray(fileList)) {
                                let pageUtil = resolve_item_page(data);

                                eleSyncState.text(`${pageUtil.loaded}/${pageUtil.count}`);

                                $(widget).attr('data-page-next', pageUtil.loaded >= pageUtil.count ? 1 : pageUtil.next);

                                editor.AssetManager.add(fileList.map((item) => {
                                    return {
                                        'src': item.url,
                                        width: 100,
                                    }
                                }), {'at': editor.AssetManager.getAllVisible().length - 1})
                                setTimeout(() => {
                                    $(widget).prop('disabled', false);
                                    $(widget).find('.sync-icon').removeClass('swing');
                                }, 1000)
                            }
                        }

                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log('error: ', jqXHR, textStatus, errorThrown);
                    },
                })
            }

            let mdlContent = $('.gjs-mdl-content');
            let assetHeaderEle = $('.gjs-am-assets-header');
            let assetItemEle = $('.gjs-am-assets');

            if (!assetHeaderEle.attr('data-cloud-loaded')) {
                assetHeaderEle.attr('data-cloud-loaded', true);

                let eleCallImgBtn = $(`
                    <button data-page-next="1">
                        Cloud image
                        <i class="sync-state"></i>
                        <i class="sync-icon fa-solid fa-arrows-rotate"></i>
                    </button>
                `);
                let eleClearBtn = $(`<button>Clear asset storage</button>`);
                let eleGroup = $(`<div class="cloud-toolbox"></div>`).append(eleCallImgBtn).append(eleClearBtn);
                mdlContent.prepend(eleGroup);

                eleCallImgBtn.on('click', function (event) {
                    let widget = this;
                    $(this).prop('disabled', true);
                    $(this).find('.sync-icon').addClass('swing');

                    let paramNext = Number.parseInt($(widget).attr('data-page-next'));

                    call_cloud_img({
                        'page': paramNext > 0 ? paramNext : 1,
                        'pageSize': 5,
                    }, widget)
                })
                eleClearBtn.on('click', function (event) {
                    let state = confirm(transEle.attr('data-msg-are-u-sure'));
                    if (state) {
                        editor.AssetManager.getAll().models
                            .map(item => item.id)
                            .map((itemID) => {
                                editor.AssetManager.remove(itemID)
                            })
                    }
                })
            }
        })

        // The upload is started
        editor.on('asset:upload:start', () => {
            console.log('asset:upload:start');
        });

        // The upload is ended (completed or not)
        editor.on('asset:upload:end', () => {
            console.log('asset:upload:end');
        });

        // Error handling
        editor.on('asset:upload:error', (err) => {
            alert('Upload was return errors');
        });

        // Do something on response
        editor.on('asset:upload:response', (response) => {
            let url = response?.['data']?.['file_detail']?.['url'];
            if (url) {
                editor.AssetManager.add([
                    {src: _resolve_url_image(url)}
                ])
            } else {
                alert("Server error due to possible deployment of incorrect or exceeded path for this function (default is 5GB).");
            }
        });
    }

    function addPanelAddFonts(pn) {
        pn.addPanel({
            id: "basic-actions",
            el: ".panel__basic-actions",
            buttons: [
                {
                    id: "create-button",
                    label: "Open font dialog",
                    command(editor) {
                        editor.runCommand("open-fonts");
                    }
                }
            ]
        });
    }

    function addPanelCustomCss(cmdm, pn, modal, editor) {
        pn.addButton('options', {
            id: 'custom-css',
            label: '<i class="fa-brands fa-css3-alt"></i>',
            command: function (editor) {
                editor.runCommand('customize-css');
            },
            attributes: {
                'title': 'Customize CSS',
                'data-tooltip-pos': 'bottom',
            },
        });

        cmdm.add('customize-css', function () {
            modal.open({
                title: 'Customize CSS',
                content: `
                <textarea>
                    <style>
                        ${editor.getCss()}
                    </style>
                </textarea>
            `,
                attributes: {
                    class: 'my-small-modal',
                },
            });
        })
    }

    const languageAllowed = ['vi', 'en'];
    const transEle = $('#trans-ele');
    const globeLanguage = transEle.data('language');
    const projectId = 'b-flow';

    let editor = grapesjs.init({
        height: '100%',
        container: '#gjs',
        fromElement: true,
        showOffsets: true, // storageManager: false,
        storageManager: {
            type: 'local', // Storage type. Available: local | remote
            autosave: true, // Store data automatically
            autoload: false, // Autoload stored data on init
            stepsBeforeSave: 1, // If autosave is enabled, indicates how many changes are necessary before the store method is triggered
            // recovery: true,
            recovery: (accept, cancel, editor) => {
                console.log('recovery active!');
                confirm('Recover data?') ? accept() : cancel();
            },
            options: {
                local: {
                    key: `gjsProject-${projectId}`,
                    checkLocal: true,
                }
            },
        },
        assetManager: {
            upload: transEle.attr('data-url-upload'),
            uploadName: 'files',
            headers: {
                'X-CSRFToken': $('input[name="csrfmiddlewaretoken"]').val()
            },
            autoAdd: 0,

            embedAsBase64: false,
            assets: [],
            openAssetsOnDrop: false,
        },
        selectorManager: {componentFirst: true},
        styleManager: {
            sectors: [
                {
                    name: 'General',
                    properties: [
                        {
                            extend: 'float',
                            type: 'radio',
                            default: 'none',
                            options: [
                                {
                                    value: 'none',
                                    className: 'fa fa-times'
                                }, {
                                    value: 'left',
                                    className: 'fa fa-align-left'
                                }, {
                                    value: 'right',
                                    className: 'fa fa-align-right'
                                }
                            ],
                        }, 'display', {
                            extend: 'position',
                            type: 'select'
                        }, 'top', 'right', 'left', 'bottom',
                    ],
                }, {
                    name: 'Dimension',
                    open: false,
                    properties: [
                        'width', {
                            id: 'flex-width',
                            type: 'integer',
                            name: 'Width',
                            units: ['px', '%'],
                            property: 'flex-basis',
                            toRequire: 1,
                        }, 'height', 'max-width', 'min-width', 'max-height', 'min-height', 'margin', 'padding'
                    ],
                }, {
                    name: 'Typography',
                    open: false,
                    properties: [
                        'font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', {
                            extend: 'text-align',
                            options: [
                                {
                                    id: 'left',
                                    label: 'Left',
                                    className: 'fa fa-align-left'
                                }, {
                                    id: 'center',
                                    label: 'Center',
                                    className: 'fa fa-align-center'
                                }, {
                                    id: 'right',
                                    label: 'Right',
                                    className: 'fa fa-align-right'
                                }, {
                                    id: 'justify',
                                    label: 'Justify',
                                    className: 'fa fa-align-justify'
                                }
                            ],
                        }, {
                            property: 'text-decoration',
                            type: 'radio',
                            default: 'none',
                            options: [
                                {
                                    id: 'none',
                                    label: 'None',
                                    className: 'fa fa-times'
                                }, {
                                    id: 'underline',
                                    label: 'underline',
                                    className: 'fa fa-underline'
                                }, {
                                    id: 'line-through',
                                    label: 'Line-through',
                                    className: 'fa fa-strikethrough'
                                }
                            ],
                        }, 'text-shadow'
                    ],
                }, {
                    name: 'Decorations',
                    open: false,
                    properties: [
                        'opacity', 'border-radius', 'border', 'box-shadow', {
                            extend: 'background',
                            name: 'Background Advance'
                        }, {
                            id: 'background-bg',
                            property: 'background-color',
                            type: 'color'
                        },
                    ],
                }, {
                    name: 'Extra',
                    open: false,
                    buildProps: [
                        'transition', 'perspective', 'transform'
                    ],
                    properties: [
                        {extend: 'filter'}, {
                            extend: 'filter',
                            property: 'backdrop-filter'
                        },
                    ],
                }, {
                    name: 'Flex',
                    open: false,
                    properties: [
                        {
                            name: 'Flex Container',
                            property: 'display',
                            type: 'select',
                            defaults: 'block',
                            list: [
                                {
                                    value: 'block',
                                    name: 'Disable'
                                }, {
                                    value: 'flex',
                                    name: 'Enable'
                                }
                            ],
                        }, {
                            name: 'Flex Parent',
                            property: 'label-parent-flex',
                            type: 'integer',
                        }, {
                            name: 'Direction',
                            property: 'flex-direction',
                            type: 'radio',
                            defaults: 'row',
                            list: [
                                {
                                    value: 'row',
                                    name: 'Row',
                                    className: 'icons-flex icon-dir-row',
                                    title: 'Row',
                                }, {
                                    value: 'row-reverse',
                                    name: 'Row reverse',
                                    className: 'icons-flex icon-dir-row-rev',
                                    title: 'Row reverse',
                                }, {
                                    value: 'column',
                                    name: 'Column',
                                    title: 'Column',
                                    className: 'icons-flex icon-dir-col',
                                }, {
                                    value: 'column-reverse',
                                    name: 'Column reverse',
                                    title: 'Column reverse',
                                    className: 'icons-flex icon-dir-col-rev',
                                }
                            ],
                        }, {
                            name: 'Justify',
                            property: 'justify-content',
                            type: 'radio',
                            defaults: 'flex-start',
                            list: [
                                {
                                    value: 'flex-start',
                                    className: 'icons-flex icon-just-start',
                                    title: 'Start',
                                }, {
                                    value: 'flex-end',
                                    title: 'End',
                                    className: 'icons-flex icon-just-end',
                                }, {
                                    value: 'space-between',
                                    title: 'Space between',
                                    className: 'icons-flex icon-just-sp-bet',
                                }, {
                                    value: 'space-around',
                                    title: 'Space around',
                                    className: 'icons-flex icon-just-sp-ar',
                                }, {
                                    value: 'center',
                                    title: 'Center',
                                    className: 'icons-flex icon-just-sp-cent',
                                }
                            ],
                        }, {
                            name: 'Align',
                            property: 'align-items',
                            type: 'radio',
                            defaults: 'center',
                            list: [
                                {
                                    value: 'flex-start',
                                    title: 'Start',
                                    className: 'icons-flex icon-al-start',
                                }, {
                                    value: 'flex-end',
                                    title: 'End',
                                    className: 'icons-flex icon-al-end',
                                }, {
                                    value: 'stretch',
                                    title: 'Stretch',
                                    className: 'icons-flex icon-al-str',
                                }, {
                                    value: 'center',
                                    title: 'Center',
                                    className: 'icons-flex icon-al-center',
                                }
                            ],
                        }, {
                            name: 'Flex Children',
                            property: 'label-parent-flex',
                            type: 'integer',
                        }, {
                            name: 'Order',
                            property: 'order',
                            type: 'integer',
                            defaults: 0,
                            min: 0
                        }, {
                            name: 'Flex',
                            property: 'flex',
                            type: 'composite',
                            properties: [
                                {
                                    name: 'Grow',
                                    property: 'flex-grow',
                                    type: 'integer',
                                    defaults: 0,
                                    min: 0
                                }, {
                                    name: 'Shrink',
                                    property: 'flex-shrink',
                                    type: 'integer',
                                    defaults: 0,
                                    min: 0
                                }, {
                                    name: 'Basis',
                                    property: 'flex-basis',
                                    type: 'integer',
                                    units: ['px', '%', ''],
                                    unit: '',
                                    defaults: 'auto',
                                }
                            ],
                        }, {
                            name: 'Align',
                            property: 'align-self',
                            type: 'radio',
                            defaults: 'auto',
                            list: [
                                {
                                    value: 'auto',
                                    name: 'Auto',
                                }, {
                                    value: 'flex-start',
                                    title: 'Start',
                                    className: 'icons-flex icon-al-start',
                                }, {
                                    value: 'flex-end',
                                    title: 'End',
                                    className: 'icons-flex icon-al-end',
                                }, {
                                    value: 'stretch',
                                    title: 'Stretch',
                                    className: 'icons-flex icon-al-str',
                                }, {
                                    value: 'center',
                                    title: 'Center',
                                    className: 'icons-flex icon-al-center',
                                }
                            ],
                        }
                    ]
                }
            ],
        },
        plugins: [
            'gjs-blocks-basic', 'grapesjs-preset-webpage', 'grapesjs-plugin-forms', 'grapesjs-component-countdown', 'grapesjs-plugin-export', 'grapesjs-tabs', 'grapesjs-custom-code', 'grapesjs-touch', 'grapesjs-parser-postcss', 'grapesjs-tooltip', 'grapesjs-tui-image-editor', 'grapesjs-typed', 'grapesjs-style-bg', 'grapesjs-style-filter', 'grapesjs-style-bg', 'grapesjs-plugin-bootstrap-carousel', 'grapesjs-plugin-bootstrap-navbar', 'grapesjs-plugin-my-products', 'grapesjs-plugin-bootstrap-breadcrumb', 'grapesjs-plugin-bootstrap-layout', 'grapesjs-plugin-page-template', 'grapesjs-parser-postcss', 'grapesjs-ui-suggest-classes', "@silexlabs/grapesjs-fonts",
        ],
        pluginsOpts: {
            'grapesjs-plugin-page-template': {
                urlTemplateList: '/site-config/templates',
                urlTemplateDetail: '/site-config/template/{pk}',
            },
            'grapesjs-plugin-bootstrap-breadcrumb': {
                'linkType': 'link-advance',
                category: {
                    label: 'Breadcrumb',
                    order: -5,
                    open: false,
                }
            },
            'grapesjs-plugin-my-products': {
                'productData': {
                    url: '/site/api/products',
                    method: 'GET',
                    linkDetail: '/site/product/{id}',
                    linkAPIDetail: '/site/api/product/{id}',
                },
                category: {
                    label: 'Data Visions',
                    order: -4,
                    open: false,
                },
            },
            'grapesjs-plugin-bootstrap-layout': {
                category: {
                    label: "Layouts",
                    order: -3,
                    open: true,
                }
            },
            'grapesjs-plugin-bootstrap-navbar': {
                menus: JSON.parse($('#idx-menus-data').text()),
                prefixPath: '/site',
                category: {
                    label: 'Navigation Bar',
                    order: -2,
                    open: false,
                },
            },
            'grapesjs-plugin-bootstrap-carousel': {
                category: {
                    label: 'Slideshow',
                    order: -1,
                    open: false,
                }
            },
            'gjs-blocks-basic': {
                flexGrid: true,
                category: {
                    label: "Basic",
                    order: 100,
                    open: false,
                },
                styleImage: {
                    color: 'black',
                    width: '100%',
                }
            },
            'grapesjs-plugin-forms': {
                category: 'Basic',
            },
            'grapesjs-component-countdown': {
                block: {
                    category: 'Basic',
                },
            },
            'grapesjs-tui-image-editor': {
                script: [
                    // 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/1.6.7/fabric.min.js',
                    transEle.attr('data-static-tui-image-editor-js-1'), transEle.attr('data-static-tui-image-editor-js-2'), transEle.attr('data-static-tui-image-editor-js-3'),
                ],
                style: [
                    transEle.attr('data-static-tui-image-editor-css-1'), transEle.attr('data-static-tui-image-editor-css-2'),
                ],
            },
            'grapesjs-tabs': {
                tabsBlock: {
                    category: 'Basic',
                },
            },
            'grapesjs-typed': {
                block: {
                    category: 'Basic',
                    content: {
                        type: 'typed',
                        'type-speed': 40,
                        strings: [
                            'Text row one', 'Text row two', 'Text row three',
                        ],
                    }
                }
            },
            'grapesjs-custom-code': {
                blockCustomCode: {
                    category: 'Basic'
                },
            },
            'grapesjs-tooltip': {
                blockTooltip: {
                    category: 'Basic',
                }
            },
            'grapesjs-style-bg': { /* options */},
            'grapesjs-preset-webpage': {
                modalImportTitle: 'Import Template',
                modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
                modalImportContent: function (editor) {
                    return editor.getHtml() + '<style>' + editor.getCss() + '</style>'; // + `<script>${editor.getJs()}</script>`;
                },
            },
            'grapesjs-ui-suggest-classes': {},
            "@silexlabs/grapesjs-fonts": {
                api_key: "AIzaSyBhWpuBLyO9kK1iCRzRZljUeVfpePWKmxI",
            },
        },
        i18n: {
            locale: languageAllowed.indexOf(globeLanguage) !== -1 ? globeLanguage : "en",
            detectLocale: false,
            messages: {
                vi: localeVi,
                en: localeEn,
            }
        },
        canvas: {
            scripts: [
                'https://code.jquery.com/jquery-3.3.1.min.js', 'https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js', 'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js',

                // carousel
                'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js',

                // slick
                'https://cdnjs.cloudflare.com/ajax/libs/jquery-migrate/3.3.1/jquery-migrate.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js',
            ],
            styles: [
                'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css',

                // carousel
                'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css',

                // Slick
                'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css', 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css',
            ],
        },
    });

    editorTmp = editor;

    let pn = editor.Panels;
    let modal = editor.Modal;
    let cmdm = editor.Commands;

    // custom css
    addPanelCustomCss(cmdm, pn, modal, editor);

    // Update canvas-clear command
    clearCanvas(cmdm);

    // Add template list
    templateList(cmdm, pn, editor);

    // Add save to api command
    buttonAndCommandSave(cmdm, pn);

    // Add load last store api command
    buttonAndCommandLoadStoreDataWhenDropEditor(cmdm, pn, editor);

    // Add back to page list
    buttonBackToPageList(cmdm, pn, editor);

    // Add and beautify tooltips
    addAndBeatifyTooltips(pn);

    // Store and load events
    storeAndLoadEvents(editor);

    // asset
    assetListener(editor)

    // Do stuff on load
    editor.on('load', function () {
        // Show borders by default
        pn.getButton('options', 'sw-visibility').set('active', 1);

        // Load and show settings and style manager
        let openTmBtn = pn.getButton('views', 'open-tm');
        openTmBtn && openTmBtn.set('active', 1);
        let openSm = pn.getButton('views', 'open-sm');
        openSm && openSm.set('active', 1);

        // Open block manager
        let openBlocksBtn = editor.Panels.getButton('views', 'open-blocks');
        openBlocksBtn && openBlocksBtn.set('active', 1);

        // load data
        editor.loadProjectData(JSON.parse($('#idx-project_data').text()));

        // fonts
        addPanelAddFonts(pn);
    });
})