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
                    console.log('success: ', rest, textStatus, jqXHR);
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
            frmEle.find('input[name="page_html"]').val(editor.getHtml({
                'cleanId': true,
            }));
            frmEle.find('input[name="page_css"]').val(editor.getCss());
            frmEle.find('input[name="page_js"]').val(editor.getJs());
            let data = frmEle.serializeArray().reduce((o, kv) => ({
                ...o,
                [kv.name]: kv.value
            }), {});

            if (confirm(transEle.attr('data-msg-sure-save-it')) === true) {
                $.fn.updateDesignWeb({
                    url: frmEle.attr('data-url'),
                    type: 'PUT',
                    data: data,
                }).then(
                    (resp) => {
                        console.log(resp);
                    },
                    (errs) => {
                        console.log(errs);
                    }
                )
            } else {
                console.log("You canceled!");
            }
        })

        pn.addButton('options', {
            id: 'save-to-api',
            className: 'fa-solid fa-floppy-disk',
            command: function () {
                editor.runCommand('save-to-api')
            },
            attributes: {
                'title': transEle.attr('data-msg-save'),
                'data-tooltip-pos': 'bottom',
            },
        });
    }

    function clearCanvas(cmdm) {
        cmdm.add('canvas-clear', function () {
            if (confirm(transEle.attr('data-msg-sure-clear-canvas'))) {
                editor.runCommand('core:canvas-clear')
                setTimeout(function () {
                    localStorage.clear()
                }, 0)
            }
        });
    }

    function storeAndLoadEvents(editor) {
        editor.on('storage:load', function (e) {
        });
        editor.on('storage:store', function (e) {
        });
        editor.on('storage:start', function (e){
            console.log('storage:start: ', e);
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
        showOffsets: true,
        // storageManager: false,
        storageManager: {
            type: 'local', // Storage type. Available: local | remote
            autosave: true, // Store data automatically
            autoload: true, // Autoload stored data on init
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
            embedAsBase64: true,
            assets: []
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
                        }, 'height', 'max-width', 'min-height', 'margin', 'padding'
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
                        'opacity', 'border-radius', 'border', 'box-shadow', 'background', // { id: 'background-bg', property: 'background', type: 'bg' }
                    ],
                }, {
                    name: 'Extra',
                    open: false,
                    buildProps: [
                        'transition', 'perspective', 'transform'
                    ],
                    properties: [
                        {extend: 'filter'},
                        {
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
            'gjs-blocks-basic',
            'grapesjs-plugin-forms',
            'grapesjs-component-countdown',
            'grapesjs-plugin-export',
            'grapesjs-tabs',
            'grapesjs-custom-code',
            'grapesjs-touch',
            'grapesjs-parser-postcss',
            'grapesjs-tooltip',
            'grapesjs-tui-image-editor',
            'grapesjs-typed',
            'grapesjs-style-bg',
            'grapesjs-preset-webpage',
            'grapesjs-navbar',
            'grapesjs-style-filter',
            'grapesjs-style-bg',
            'my-products',
            'grapesjs-plugin-bootstrap-carousel',
            'grapesjs-plugin-bootstrap-navbar',
        ],
        pluginsOpts: {
            'grapesjs-plugin-bootstrap-carousel': {},
            'grapesjs-plugin-bootstrap-navbar': {
                menus: JSON.parse($('#idx-menus-data').text()),
            },
            'my-products': {
                tabsBlock: {category: 'Extra'},
            },
            'gjs-blocks-basic': {flexGrid: true},
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
                tabsBlock: {category: 'Extra'}
            },
            'grapesjs-navbar': {
                tabsBlock: {category: 'Extra'}
            },
            'grapesjs-typed': {
                block: {
                    category: 'Extra',
                    content: {
                        type: 'typed',
                        'type-speed': 40,
                        strings: [
                            'Text row one', 'Text row two', 'Text row three',
                        ],
                    }
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
        },
        i18n: {
            locale: languageAllowed.indexOf(globeLanguage) !== -1 ? globeLanguage : "en",
            detectLocale: false,
            messages: {
                vi: localeVi,
                en: localeEn,
            }
        },
        style: '.vote-star::before{color:#ffc107;display:inline-block;overflow:hidden;width:100%}.vote-10::before{width:10%}.vote-20::before{width:20%}.vote-30::before{width:30%}.vote-40::before{width:40%}.vote-50::before{width:50%}.vote-60::before{width:60%}.vote-70::before{width:70%}.vote-80::before{width:80%}.vote-90::before{width:90%}.vote-100::before{width:100%}',
        canvas: {
            scripts: [
                'https://code.jquery.com/jquery-3.3.1.slim.min.js',
                'https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js',
                'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js',

                // carousel
                'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js',
            ],
            styles: [
                'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css',
                'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css',

                // carousel
                'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css',
            ],
        },
    });

    editorTmp = editor;

    let pn = editor.Panels;
    let modal = editor.Modal;
    let cmdm = editor.Commands;

    // Update canvas-clear command
    clearCanvas(cmdm);

    // Add save to api command
    buttonAndCommandSave(cmdm, pn);

    // Add and beautify tooltips
    addAndBeatifyTooltips(pn);

    // Store and load events
    storeAndLoadEvents(editor);


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
    });
})