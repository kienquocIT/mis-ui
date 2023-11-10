### Các biến môi trường lấy từ editor

```javascript
let editor = grapesjs.init({...});
let pn = editor.Panels;
let modal = editor.Modal;
let cmdm = editor.Commands;
```

---

### Hiển thị logo

```html

<div style="display: none" class="d-none">
    <div class="gjs-logo-cont">
        <a href="https://grapesjs.com"><img class="gjs-logo" src="#"></a>
        <div class="gjs-logo-version"></div>
    </div>
</div>
```

```javascript
editor.on('load', function () {
    // Show logo with the version
    var logoCont = document.querySelector('.gjs-logo-cont');
    document.querySelector('.gjs-logo-version').innerHTML = 'v' + grapesjs.version;
    var logoPanel = document.querySelector('.gjs-pn-commands');
    logoPanel.appendChild(logoCont);
})
```

---

### Thêm nút và hành động cho nút

```javascript
cmdm.add('save-to-api', function () {
    alert('Call to save-to-api!');
})

pn.addButton('options', {
    id: 'save-to-api',
    className: 'fa-solid fa-floppy-disk',
    command: function () {
        editor.runCommand('save-to-api')
    },
    attributes: {
        'title': 'Save',
        'data-tooltip-pos': 'bottom',
    },
});

```

---

### Hiển thị khung viền vẽ các component

```javascript
pn.getButton('options', 'sw-visibility').set('active', 1);
```

---

### Xoá lưu trữ HTML để làm lại

```javascript
// Update canvas-clear command
cmdm.add('canvas-clear', function () {
    if (confirm('Are you sure to clean the canvas?')) {
        editor.runCommand('core:canvas-clear')
        setTimeout(function () {
            localStorage.clear()
        }, 0)
    }
});
```

---

### Thêm tooltip cho các options và views

```javascript
// Add and beautify tooltips
[
    ['sw-visibility', 'Show Borders'], ['preview', 'Preview'], ['fullscreen', 'Fullscreen'],
    ['export-template', 'Export'], ['undo', 'Undo'], ['redo', 'Redo'],
    ['gjs-open-import-webpage', 'Import'], ['canvas-clear', 'Clear canvas']
]
    .forEach(function (item) {
        pn.getButton('options', item[0]).set('attributes', {
            title: item[1],
            'data-tooltip-pos': 'bottom'
        });
    });
[['open-sm', 'Style Manager'], ['open-layers', 'Layers'], ['open-blocks', 'Blocks']]
    .forEach(function (item) {
        pn.getButton('views', item[0]).set('attributes', {
            title: item[1],
            'data-tooltip-pos': 'bottom'
        });
    });
var titles = document.querySelectorAll('*[title]');

for (var i = 0; i < titles.length; i++) {
    var el = titles[i];
    var title = el.getAttribute('title');
    title = title ? title.trim() : '';
    if (!title)
        break;
    el.setAttribute('data-tooltip', title);
    el.setAttribute('title', '');
}
```

---

### Làm mẫu

```html
{% load i18n static %}

<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>GrapesJS Demo - Free Open Source Website Page Builder</title>
    <meta content="Best Free Open Source Responsive Websites Builder" name="description">

    <link rel="stylesheet" href="{% static 'vendors/font-awesome/6.4.0/css/all.min.css' %}">

    <link rel="stylesheet" href="{% static 'builder/dist/stylesheets/toastr.min.css' %}">
    <link rel="stylesheet" href="{% static 'builder/dist/stylesheets/grapes.min.css' %}">
    <link rel="stylesheet" href="{% static 'builder/dist/stylesheets/grapesjs-preset-webpage.min.css' %}">
    <link rel="stylesheet" href="{% static 'builder/dist/stylesheets/tooltip.css' %}">
    <link rel="stylesheet" href="{% static 'builder/dist/stylesheets/demos.css' %}">
    <link href="{% static 'builder/dist/cdn_download/grapick_dist_grapick.min.css' %}" rel="stylesheet">

    <script src="{% static 'builder/dist/cdn_download/jquery_3.3.1_jquery.js' %}"></script>
    <script src="{% static 'builder/dist/js/toastr.min.js' %}"></script>
    <script src="{% static 'builder/dist/js/grapes.min.js' %}"></script>
    <script src="{% static 'builder/dist/cdn_download/grapesjs-preset-webpage@1.0.2.js' %}"></script>
    <script src="{% static 'builder/dist/cdn_download/grapesjs-blocks-basic@1.0.1.js' %}"></script>
    <script src="{% static 'builder/dist/cdn_download/grapesjs-plugin-forms@2.0.5.js' %}"></script>
    <script src="{% static 'builder/dist/cdn_download/grapesjs-component-countdown@1.0.1.js' %}"></script>
    <script src="{% static 'builder/dist/cdn_download/grapesjs-plugin-export@1.0.11.js' %}"></script>
    <script src="{% static 'builder/dist/cdn_download/grapesjs-tabs@1.0.6.js' %}"></script>
    <script src="{% static 'builder/dist/cdn_download/grapesjs-custom-code@1.0.1.js' %}"></script>
    <script src="{% static 'builder/dist/cdn_download/grapesjs-touch@0.1.1.js' %}"></script>
    <script src="{% static 'builder/dist/cdn_download/grapesjs-parser-postcss@1.0.1.js' %}"></script>
    <script src="{% static 'builder/dist/cdn_download/grapesjs-tooltip@0.1.7.js' %}"></script>
    <script src="{% static 'builder/dist/cdn_download/grapesjs-tui-image-editor@0.1.3.js' %}"></script>
    <script src="{% static 'builder/dist/cdn_download/grapesjs-typed@1.0.5.js' %}"></script>
    <script src="{% static 'builder/dist/cdn_download/grapesjs-style-bg@2.0.1.js' %}"></script>

    <style type="text/css">
        .icons-flex {
            background-size: 70% 65% !important;
            height: 15px;
            width: 17px;
            opacity: 0.9;
        }

        .icon-dir-row {
            background: url("{% static 'builder/dist/img/flex-dir-row.png' %}") no-repeat center;
        }

        .icon-dir-row-rev {
            background: url("{% static 'builder/dist/img/flex-dir-row-rev.png' %}") no-repeat center;
        }

        .icon-dir-col {
            background: url("{% static 'builder/dist/img/flex-dir-col.png' %}") no-repeat center;
        }

        .icon-dir-col-rev {
            background: url("{% static 'builder/dist/img/flex-dir-col-rev.png' %}") no-repeat center;
        }

        .icon-just-start {
            background: url("{% static 'builder/dist/img/flex-just-start.png' %}") no-repeat center;
        }

        .icon-just-end {
            background: url("{% static 'builder/dist/img/flex-just-end.png' %}") no-repeat center;
        }

        .icon-just-sp-bet {
            background: url("{% static 'builder/dist/img/flex-just-sp-bet.png' %}") no-repeat center;
        }

        .icon-just-sp-ar {
            background: url("{% static 'builder/dist/img/flex-just-sp-ar.png' %}") no-repeat center;
        }

        .icon-just-sp-cent {
            background: url("{% static 'builder/dist/img/flex-just-sp-cent.png' %}") no-repeat center;
        }

        .icon-al-start {
            background: url("{% static 'builder/dist/img/flex-al-start.png' %}") no-repeat center;
        }

        .icon-al-end {
            background: url("{% static 'builder/dist/img/flex-al-end.png' %}") no-repeat center;
        }

        .icon-al-str {
            background: url("{% static 'builder/dist/img/flex-al-str.png' %}") no-repeat center;
        }

        .icon-al-center {
            background: url("{% static 'builder/dist/img/flex-al-center.png' %}") no-repeat center;
        }

        [data-tooltip]::after {
            background: rgba(51, 51, 51, 0.9);
        }

        .gjs-pn-commands {
            min-height: 40px;
        }

        #gjs-sm-float {
            display: none;
        }

        .gjs-logo-version {
            background-color: #756467;
        }

        .gjs-pn-btn.gjs-pn-active {
            box-shadow: none;
        }

        .CodeMirror {
            min-height: 450px;
            margin-bottom: 8px;
        }

        .grp-handler-close {
            background-color: transparent;
            color: #ddd;
        }

        .grp-handler-cp-wrap {
            border-color: transparent;
        }
    </style>
    <style>
        .gjs-pn-panel#gjs-pn-views-container, .gjs-pn-panel.gjs-pn-views-container {
            height: 100%;
        }
    </style>
</head>
<body>

<div id="gjs" style="height:0; overflow:hidden"></div>

<script type="text/javascript">
    let editor = grapesjs.init({
        height: '100%',
        container: '#gjs',
        fromElement: true,
        showOffsets: true,
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
                                },
                                {
                                    value: 'left',
                                    className: 'fa fa-align-left'
                                },
                                {
                                    value: 'right',
                                    className: 'fa fa-align-right'
                                }
                            ],
                        },
                        'display',
                        {
                            extend: 'position',
                            type: 'select'
                        },
                        'top',
                        'right',
                        'left',
                        'bottom',
                    ],
                }, {
                    name: 'Dimension',
                    open: false,
                    properties: [
                        'width',
                        {
                            id: 'flex-width',
                            type: 'integer',
                            name: 'Width',
                            units: ['px', '%'],
                            property: 'flex-basis',
                            toRequire: 1,
                        },
                        'height',
                        'max-width',
                        'min-height',
                        'margin',
                        'padding'
                    ],
                }, {
                    name: 'Typography',
                    open: false,
                    properties: [
                        'font-family',
                        'font-size',
                        'font-weight',
                        'letter-spacing',
                        'color',
                        'line-height',
                        {
                            extend: 'text-align',
                            options: [
                                {
                                    id: 'left',
                                    label: 'Left',
                                    className: 'fa fa-align-left'
                                },
                                {
                                    id: 'center',
                                    label: 'Center',
                                    className: 'fa fa-align-center'
                                },
                                {
                                    id: 'right',
                                    label: 'Right',
                                    className: 'fa fa-align-right'
                                },
                                {
                                    id: 'justify',
                                    label: 'Justify',
                                    className: 'fa fa-align-justify'
                                }
                            ],
                        },
                        {
                            property: 'text-decoration',
                            type: 'radio',
                            default: 'none',
                            options: [
                                {
                                    id: 'none',
                                    label: 'None',
                                    className: 'fa fa-times'
                                },
                                {
                                    id: 'underline',
                                    label: 'underline',
                                    className: 'fa fa-underline'
                                },
                                {
                                    id: 'line-through',
                                    label: 'Line-through',
                                    className: 'fa fa-strikethrough'
                                }
                            ],
                        },
                        'text-shadow'
                    ],
                }, {
                    name: 'Decorations',
                    open: false,
                    properties: [
                        'opacity',
                        'border-radius',
                        'border',
                        'box-shadow',
                        'background', // { id: 'background-bg', property: 'background', type: 'bg' }
                    ],
                }, {
                    name: 'Extra',
                    open: false,
                    buildProps: [
                        'transition',
                        'perspective',
                        'transform'
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
                                },
                                {
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
        ],
        pluginsOpts: {
            'gjs-blocks-basic': {flexGrid: true},
            'grapesjs-tui-image-editor': {
                script: [
                    // 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/1.6.7/fabric.min.js',
                    "{% static 'builder/dist/cdn_download/plugins/grapesjs-tui-image-editor/js/tui-code-snippet.min.js' %}",
                    "{% static 'builder/dist/cdn_download/plugins/grapesjs-tui-image-editor/js/tui-color-picker.min.js' %}",
                    "{% static 'builder/dist/cdn_download/plugins/grapesjs-tui-image-editor/js/tui-image-editor.min.js' %}",
                ],
                style: [
                    "{% static 'builder/dist/cdn_download/plugins/grapesjs-tui-image-editor/css/tui-color-picker.min.css' %}",
                    "{% static 'builder/dist/cdn_download/plugins/grapesjs-tui-image-editor/css/tui-image-editor.min.css' %}",
                ],
            },
            'grapesjs-tabs': {
                tabsBlock: {category: 'Extra'}
            },
            'grapesjs-typed': {
                block: {
                    category: 'Extra',
                    content: {
                        type: 'typed',
                        'type-speed': 40,
                        strings: [
                            'Text row one',
                            'Text row two',
                            'Text row three',
                        ],
                    }
                }
            },
            'grapesjs-preset-webpage': {
                modalImportTitle: 'Import Template',
                modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
                modalImportContent: function (editor) {
                    return editor.getHtml() + '<style>' + editor.getCss() + '</style>'
                },
            },
        },
    });

    editor.I18n.addMessages({
        en: {
            styleManager: {
                properties: {
                    'background-repeat': 'Repeat',
                    'background-position': 'Position',
                    'background-attachment': 'Attachment',
                    'background-size': 'Size',
                }
            },
        }
    });

    var pn = editor.Panels;
    var modal = editor.Modal;
    var cmdm = editor.Commands;

    // Update canvas-clear command
    cmdm.add('canvas-clear', function () {
        if (confirm('Are you sure to clean the canvas?')) {
            editor.runCommand('core:canvas-clear')
            setTimeout(function () {
                localStorage.clear()
            }, 0)
        }
    });

    // Add save to api command
    cmdm.add('save-to-api', function () {
        alert('Call to save-to-api!');
    })

    pn.addButton('options', {
        id: 'save-to-api',
        className: 'fa-solid fa-floppy-disk',
        command: function () {
            editor.runCommand('save-to-api')
        },
        attributes: {
            'title': 'Save',
            'data-tooltip-pos': 'bottom',
        },
    });


    // Simple warn notifier
    var origWarn = console.warn;
    toastr.options = {
        closeButton: true,
        preventDuplicates: true,
        showDuration: 250,
        hideDuration: 150
    };
    console.warn = function (msg) {
        if (msg.indexOf('[undefined]') == -1) {
            toastr.warning(msg);
        }
        origWarn(msg);
    };


    // Add and beautify tooltips
    [
        ['sw-visibility', 'Show Borders'], ['preview', 'Preview'], ['fullscreen', 'Fullscreen'],
        ['export-template', 'Export'], ['undo', 'Undo'], ['redo', 'Redo'],
        ['gjs-open-import-webpage', 'Import'], ['canvas-clear', 'Clear canvas']
    ]
            .forEach(function (item) {
                pn.getButton('options', item[0]).set('attributes', {
                    title: item[1],
                    'data-tooltip-pos': 'bottom'
                });
            });
    [['open-sm', 'Style Manager'], ['open-layers', 'Layers'], ['open-blocks', 'Blocks']]
            .forEach(function (item) {
                pn.getButton('views', item[0]).set('attributes', {
                    title: item[1],
                    'data-tooltip-pos': 'bottom'
                });
            });
    var titles = document.querySelectorAll('*[title]');

    for (var i = 0; i < titles.length; i++) {
        var el = titles[i];
        var title = el.getAttribute('title');
        title = title ? title.trim() : '';
        if (!title)
            break;
        el.setAttribute('data-tooltip', title);
        el.setAttribute('title', '');
    }


    // Store and load events
    editor.on('storage:load', function (e) {
        console.log('Loaded ', e)
    });
    editor.on('storage:store', function (e) {
        console.log('Stored ', e)
    });


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
</script>
</body>
</html>
```
