class PrintControl {
    static getRatioUnit(pointUnit, ratio_of_inches=1){
        switch (pointUnit) {
            case "in":
                return ratio_of_inches;
            case "pt":
                // 1 inches = 82 pt
                return 72 * ratio_of_inches;
            case "px":
                // 1 inches = 96 pixel
                return 96 * ratio_of_inches;
            case "cm":
                // 1 inches = 2.54 cm
                return 2.54 * ratio_of_inches;
            case "mm":
                // 1 inches = 25.4 mm
                return 25.4 * ratio_of_inches;
            case _:
                throw Error('Unit point is not support!');
        }
        return 0;
    }

    constructor(opts={}) {
        this.modal$ = $('#printModal');
        this.iframe$ = this.modal$.find('iframe');

        this.opts = $.extend(
            true,
            {
                margin: 0.5,
                filename: 'my-file.pdf',
                image: {
                    type: 'jpeg',
                    quality: 0.98
                },
                html2canvas: {scale: 2, useCORS: true},
                jsPDF: {
                    unit: 'in',
                    format: 'a4',
                    orientation: 'landscape',  // 'landscape' | 'portrait'
                },
                pagebreak: { mode: 'css', before: '.page-break-here' },
            },
            opts
        );
        this.opts.margin = PrintControl.getRatioUnit(this.opts.jsPDF.unit, this.opts.margin);
        this.marginOfPageNumber = PrintControl.getRatioUnit(this.opts.jsPDF.unit, 0.2);

        this.doc = null;
        this.content = '';
    }

    _reset(){
        this.iframe$.empty();
        this.iframe$.removeAttr('src');
        this.modal$.removeAttr('data-loaded')
    }

    open_print_browser(){
        let resolveHTML = `
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8"/>
                <title>hihihi</title>
                <style>
                    div.myprint__page-break {page-break-after:always;page-break-inside:avoid}
                    img {width: 100px!important;}
                </style>
            </head>
            <body style="display: table;">
                <p>
                    <img src="https://as1.ftcdn.net/v2/jpg/01/23/29/10/1000_F_123291055_OyP0efCcPm3a38zJ9k4lGXK5IXFZlFVz.jpg" />
                    <img src="https://gamek.mediacdn.vn/133514250583805952/2021/12/30/photo-1-16408490443501506806346.png" />
                    <img src="https://i.pinimg.com/originals/60/06/79/600679e60e5d1a327033e672b8beb8fd.jpg" />
                </p>
                <p>ddsadsaddsad</p>
                
                <div class="myprint__page-break"></div>
                <img src="https://i.pinimg.com/originals/06/77/5a/06775a29b959832874527d6296503e30.jpg" />
                <img src="https://demoda.vn/wp-content/uploads/2022/01/anh-wibu.jpg" />
                <img src="https://haycafe.vn/wp-content/uploads/2022/07/anh-wibu-co-gai-toc-hong.jpg" />
                <p>dsaddddddd</p>
            </body>
            </html>
        `
        let htmlBlob = new Blob([resolveHTML], {type : 'text/html'});
        let htmlUrl = URL.createObjectURL(htmlBlob);
        let iframe = document.createElement('iframe');
        iframe.setAttribute("id", "ttt");
        iframe.src = htmlUrl;
        document.body.appendChild(iframe);
        document.getElementById('ttt').focus();
        document.getElementById('ttt').contentWindow.print();
    }

    on_events(){
        let clsThis = this;
        this.modal$.find('.modal-footer button[data-action="save-print"]').on('click', function () {
            clsThis.doc.save()
        });
        this.modal$.find('.modal-footer button[data-action="save-preview-new-tab"]').on('click', function () {
            clsThis.doc.output("dataurlnewwindow");
        });
    }

    on_render_pdf(){
        let clsThis = this;
        let currentWidth = $(clsThis.modal$).find('.modal-dialog').width();
        let orientation = clsThis.opts.jsPDF.orientation;
        let ratioHeight = orientation === 'landscape' ?  210 / 297 : orientation === 'portrait' ? 297 / 210 : 0;
        let widthTxt = `${currentWidth}px - 2rem`;

        clsThis.iframe$.css('width', `calc(${widthTxt})`).css('height', `calc((${widthTxt}) * ${ratioHeight})`);
        clsThis.doc.output('datauristring').then(function() {
            clsThis.iframe$.attr('src', this._result + '#toolbar=0');
        });
    }

    render(content='') {
        let clsThis = this;
        clsThis.content = content;
        // if (typeof html2pdf === 'function' && this.modal$.length > 0 && this.iframe$.length > 0){
        //     clsThis.iframe$.empty();
        //     clsThis.modal$.on('shown.bs.modal', function () {
        //         if (!clsThis.modal$.attr('data-loaded')) {
        //             clsThis.modal$.attr('data-loaded', true);
        //             clsThis.doc = html2pdf().set(clsThis.opts).from(content).toPdf().get('pdf').then(function (pdf) {
        //                 var totalPages = pdf.internal.getNumberOfPages();
        //                 for (let i = 1; i <= totalPages; i++) {
        //                     pdf.setPage(i);
        //                     pdf.setFontSize(10);
        //                     pdf.setTextColor(100);
        //                     pdf.text(
        //                         clsThis.modal$.attr('data-msg-page-of-total').replaceAll('__page__', i).replaceAll('__total_page__', totalPages),
        //                         (pdf.internal.pageSize.getWidth() / 2.1),
        //                         (pdf.internal.pageSize.getHeight() - clsThis.marginOfPageNumber)
        //                     );
        //                 }
        //                 clsThis.on_render_pdf();
        //                 clsThis.on_events();
        //             });
        //         }
        //     });
        //     clsThis.modal$.modal('show');
        // }
        clsThis.open_print_browser();
    }
}


function ParamGetData(data, key, configData) {
    // sample rules
    // data = {"abc": {"xyz": [{"123": "Tao nè"}]}}
    // code = abc__xyz___123
    // --- "type=2  key=  " is default!
    // start    ^   type=2  key=    data={"abc": {"xyz": [{"123": "Tao nè"}]}}
    // 0        a   type=2	key=a	data={"abc": {"xyz": [{"123": "Tao nè"}]}}
    // 1        b   type=2	key=ab	data={"abc": {"xyz": [{"123": "Tao nè"}]}}
    // 2        c   type=2	key=abc	data={"abc": {"xyz": [{"123": "Tao nè"}]}}
    // 3        _   SKIP
    // 4        _   type=2	key=	data={"xyz": [{"123": "Tao nè"}]}
    // 5        x   type=2	key=x	data=...
    // 6        y   type=2	key=xy	data=...
    // 7        z   type=2	key=xyz	data=...
    // 8        _   SKIP
    // 9        _   SKIP
    // 10       _   type=3	key=	data=[{"123": "Tao nè"}]
    // 11       1   type=3	key=1	data=...
    // 12       2   type=3	key=12	data=...
    // 13       3   type=3	key=123	data=...
    // end      $   type=2	key=	data=["Tao nè"]
    // ==> ["Tao nè"]

    let currentData = data;
    let currentKey = '';
    let splitType = 2;

    function getDataOfKey(){
        if (currentData && currentKey){
            if (Array.isArray(currentData)){
                return currentData.map(
                    (item) => {
                        if (item && typeof item === 'object' && item.hasOwnProperty(currentKey)){
                            return item[currentKey];
                        }
                        return null;
                    }
                )
            } else if (typeof currentData === 'object'){
                if (currentData.hasOwnProperty(currentKey)) return currentData[currentKey];
            }
        }
        return null;
    }

    function pointData(){
        if (splitType === 2) currentData = getDataOfKey();
        if (splitType === 3) currentData = getDataOfKey();
        currentKey = '';
    }

    if (key.startsWith('_')){
        // Key of bastion app --> use for all application!
        if (key === '_current_currency_title') currentData = configData?.['currency']?.['title'] || '';
        if (key === '_current_currency_code') currentData = configData?.['currency']?.['code'] || '';
        if (key === '_current_datetime') currentData = moment().format("DD/MM/YYYY HH:mm:ss");
        if (key === '_current_date') currentData = moment().format("DD/MM/YYYY");
        if (key === '_current_date_solemn') {
            let _momentNow = moment();
            currentData = `ngày ${_momentNow.get('date')} tháng ${_momentNow.get('month') + 1} năm ${_momentNow.get('year')}`
        }
    }
    else {
        for (let i = 0; i < key.length; i++) {
            if (!currentData) break;  // stop (break loop) when bastion data is blank|empty
            if (i === 0) {
                currentKey += key[i];
            } else if (i === key.length - 1) {
                currentKey += key[i];
                pointData();
                splitType = 2;
            } else {
                if (key[i] === '_') {
                    if (key[i + 1] !== '_') {
                        // Skip to last "_"
                        if (i >= 2 && key[i - 1] === '_' && key[i - 2] === '_') {
                            pointData();
                            splitType = 3;
                        } else if (i >= 1 && key[i - 1] === '_') {
                            pointData();
                            splitType = 2;
                        } else currentKey += key[i];
                    }
                } else currentKey += key[i];
            }
        }
    }

    function simpleReturn(_data){
        switch(typeof _data){
            case "number":
            case "bigint":
                return $x.fn.numberWithCommas(_data);
            case "string":
            case "boolean":
            case "symbol":
                return _data;
            case "undefined":
            case "object":
            case "function":
            default:
                return '';
        }
    }

    if (Array.isArray(currentData))
        return currentData.map(
            (item) => simpleReturn(item),
        )
    return simpleReturn(currentData);
}

function TemplateDOM(node, data, configData) {
    let nodeTable = null;
    let nodeParentTr = null;
    let nodeTr = null;

    let nodeParentCheck = node.parentNode;
    while (nodeParentCheck){
        if (nodeParentCheck.tagName === 'TR'){
            nodeTr = nodeParentCheck;
            nodeParentTr = nodeParentCheck.parentNode;
        } else if (nodeParentCheck.tagName === 'TABLE'){
            nodeTable = nodeParentCheck;
            break;
        }
        nodeParentCheck = nodeParentCheck.parentNode;
    }

    if (nodeTable && nodeTr) {
        let idsSkip = [];
        let maxLength = 0;
        let dataList = {};  // {"idx": "{data}"}

        // nodeTr.style.verticalAlign = "top";
        nodeTr.querySelectorAll(`span.params-data[data-code]`).forEach(
            nodeChild => {
                let key = nodeChild.getAttribute('data-code');
                if (key.indexOf('___') !== -1){
                    let idx = nodeChild.getAttribute('id');
                    let dataOfKey = ParamGetData(data, key, configData);
                    if (dataOfKey.length > maxLength) maxLength = dataOfKey.length;
                    dataList[idx] = dataOfKey;
                    idsSkip.push(idx);
                } else {
                    let idx = nodeChild.getAttribute('id');
                    idsSkip.push(idx);
                    let key = nodeChild.getAttribute('data-code');
                    nodeChild.innerText = ParamGetData(data, key, configData);
                    nodeChild.removeAttribute('style');
                }
            }
        )

        if (maxLength > 0){
            let lastInserted = nodeTr;
            for(let i = 0; i < maxLength ; i++){
                let nodeTrNew = nodeTr.cloneNode(true);
                for (let codeKey in dataList){
                    nodeTrNew.querySelectorAll(`#${codeKey}`).forEach(
                        nodeMatch => {
                            nodeMatch.removeAttribute('style');
                            nodeMatch.innerText = dataList[codeKey].length >= i ? dataList[codeKey][i] : '_';
                            // check if data is path of img element
                            let inner = dataList[codeKey].length >= i ? dataList[codeKey][i] : '_';
                            if (inner) {
                                if (inner.includes('/media')) {
                                    nodeMatch.innerHTML = `<div style="width: 100%; max-width: 200px; aspect-ratio: 1/1; background: #f8f9fa; display: flex; align-items: center; justify-content: center;">
                                                          <img src="${inner}" alt="img" style="width: 100%; height: 100%; object-fit: contain;">
                                                        </div>`;
                                }
                            }
                        }
                    )
                }
                // nodeParentTr.appendChild(nodeTrNew);
                // luôn insert sau nodeTrNew cuối cùng đã thêm
                if (lastInserted.nextSibling) {
                    nodeParentTr.insertBefore(nodeTrNew, lastInserted.nextSibling);
                } else {
                    nodeParentTr.appendChild(nodeTrNew);
                }
                lastInserted = nodeTrNew;
            }
            nodeTr.style.visibility = "hidden";
            nodeTr.style.display = "none";
            return idsSkip;
        }
    } else {
        let key = node.getAttribute('data-code');
        node.innerText = ParamGetData(data, key, configData);
        node.removeAttribute('style');
        return [];
    }
}

class PrintTinymceControl {
    constructor(opts={}) {
        this.modal$ = opts?.modal$ ? opts.modal$ : $('#printModal');
        this.textarea$ = opts?.textarea$ ? opts.textarea$ : this.modal$.find('textarea.printer-display-page');
        this.templateList$ = opts?.templateList$ ? opts.templateList$ : this.modal$.find('select.printer-template-list');

        // fill value into render()
        this.data = null;
        this.application_id = null;
        this.editor = null;
    }

    static init_tinymce_editable(textarea$, application_id, opts={}, content=''){
        function callTemplates(){
            let templateUrl = opts?.['templateUrl'] || null;
            if (templateUrl){
                templateUrl = templateUrl.replaceAll('__app_id__', application_id);
                return $.fn.callAjax2({ url: templateUrl, method: 'GET' }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        return data.templates || [];
                    },
                    (errs) => {
                        $.fn.switcherResp(errs);
                        return [];
                    }
                )
            }
            return new Promise((resolve, reject) => {
                resolve([]);
            });
        }

        if (typeof tinymce === 'object' && textarea$.length > 0){
            callTemplates().then(
                (templateResult) => {
                    let tinymceEditor = null;
                    textarea$.val(content);
                    let mentionCurrentPage = 1;
                    let mentionTotalPages = 1;
                    let lastQuery = '';

                    const defaultOptions = {
                        skin: 'oxide',
                        convert_urls: false,
                        branding: false,
                        readonly: 0,
                        menubar: true,
                        // height: 120,
                        plugins: [
                            'columns', 'mention', 'print', 'preview', 'paste', 'importcss', 'searchreplace',
                            'autolink', 'autosave', 'save', 'directionality', 'code', 'visualblocks',
                            'visualchars', 'fullscreen', 'image', 'link', 'media', 'template', 'codesample',
                            'table', 'charmap', 'hr', 'pagebreak', 'nonbreaking', 'anchor', 'toc',
                            'insertdatetime', 'advlist', 'lists', 'wordcount', 'textpattern', 'noneditable',
                            'help', 'quickbars', 'emoticons'
                        ],
                        toolbar: [
                            'undo redo | fontselect fontsizeselect formatselect | bold italic underline strikethrough | forecolor backcolor',
                            'alignleft aligncenter alignright alignjustify | bullist numlist checklist outdent indent',
                            'link image | removeformat | code | preview print'
                        ].join(' | '),
                        toolbar_groups: {
                            rarely_used: {
                                icon: 'more-drawer',
                                tooltip: 'Rarely Used',
                                items: 'ltr rtl | charmap emoticons | superscript subscript | nonbreaking anchor media | undo redo'
                            }
                        },
                        fontsize_formats: '8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 26pt 28pt 36pt 48pt 72pt',
                        pagebreak_split_block: true,
                        pagebreak_separator: '<span class="page-break-here"><!-- my page break --></span>',
                        nonbreaking_force_tab: true,
                        paste_data_images: true,
                        quickbars_insert_toolbar: 'link image | numlist bullist table twoColumn threeColumn | hr pagebreak | removeSelectionEle',
                        content_css: textarea$.attr('data-css-url-render'),
                        content_style: `
                            body { font-family: Times New Roman, Times, serif, sans-serif; font-size: 12pt; }
                            table tr { vertical-align: top; }
                            @media print {
                                .mce-visual-caret { display: none; }
                            }
                        `,
                        insertdatetime_formats: ['%d-%m-%Y %H:%M:%S', '%d-%m-%Y', '%H:%M:%S', '%I:%M:%S %p'],
                        templates: templateResult.map(item => ({ ...item, url: staticStart + item.url })),
                        default_link_target: '_blank',
                        link_assume_external_targets: true,
                        link_default_protocol: 'https',
                        mentions: {
                            queryBy: 'code',
                            items: 20,
                            delimiter: '#',
                            source: function(query, process, delimiter) {
                                if (delimiter === '#') {
                                    lastQuery = query || '';
                                    let params = $.param(
                                        $.extend(
                                            {
                                                'page': mentionCurrentPage,
                                                'pageSize': 20,
                                                'ordering': 'title',
                                                // 'application': application_id,
                                                'application__in': `${application_id},ba2ef9f1-63f4-4cfb-ae2f-9dee6a56da68`,
                                            },
                                            (query ? {'search': query} : {})
                                        )
                                    )
                                    $.fn.callAjax2({
                                        url: textarea$.attr('data-mentions') + '?' + params,
                                        cache: true,
                                    }).then(
                                        (resp) => {
                                            let data = $.fn.switcherResp(resp);
                                            if (data){
                                                let resource = (data?.['application_property_list'] || []).map(
                                                    (item) => {return UtilControl.flattenObject(item)}
                                                )

                                                // Tính total pages
                                                mentionTotalPages = Math.ceil(data['page_count'] / 20);

                                                // Thêm navigation items
                                                if (mentionCurrentPage > 1) {
                                                    resource.unshift({
                                                        code: '__prev_page__',
                                                        title: '← Trang trước',
                                                        action: 'prev'
                                                    });
                                                }

                                                if (mentionCurrentPage < mentionTotalPages) {
                                                    resource.push({
                                                        code: '__next_page__',
                                                        title: 'Trang sau →',
                                                        action: 'next'
                                                    });
                                                }

                                                process(resource);
                                            }
                                        },
                                        (errs) => $.fn.switcherResp(errs),
                                    )
                                }
                            },
                            insert: function (item) {
                                // zero with space: \u200B&nbsp; or \u200B
                                // return `<span id="idx-${$x.fn.randomStr(16)}" class="params-data" data-code="${item.code}" style="padding: 3px;background-color: #f1f1f1;">#${item.title}</span>\u200B`;
                                // Handle navigation
                                if (item.action === 'prev') {
                                    mentionCurrentPage--;

                                    tinymce.activeEditor.fire('reloadMentions', {
                                        query: lastQuery
                                    });

                                    return false;  // Không insert, trigger lại search
                                }
                                if (item.action === 'next') {
                                    mentionCurrentPage++;
                                    setTimeout(() => {
                                        tinymce.activeEditor.fire('reloadMentions', {
                                            query: lastQuery
                                        });
                                    }, 10);
                                    return false;
                                }

                                return `
                                        <span 
                                            id="idx-${$x.fn.randomStr(16)}"
                                            class="params-data badge badge-light border px-2 py-1 rounded-pill d-inline-block" 
                                            data-code="${item.code}" 
                                            style="background-color: #e0f3ff; color: #007bff; font-weight: 500;"
                                        >#${item.title}</span>&nbsp;
                                        `;
                            },
                            render: function(item) {
                                // return `
                                //     <li style="cursor: pointer;" class="d-flex align-items-center">
                                //         ${item.code.indexOf('___') !== -1 ? '<i class="fa-solid fa-table-list fa-2xs mr-1"></i>' : '<i class="fa-solid fa-paragraph fa-2xs mr-1"></i>'}
                                //         ${item.title}
                                //         <small style="margin-left: 5px;">${ item.remark ? ' - ' + item.remark : ''}</small>
                                //     </li>
                                // `
                                return `
                                    <li class="dropdown-item mention-item d-flex align-items-center px-2 py-1" 
                                        style="cursor: pointer; transition: background 0.2s;">
                                        ${item.code.includes('___') 
                                            ? '<i class="fa-solid fa-table-list fa-xs mr-2 text-secondary"></i>' 
                                            : '<i class="fa-solid fa-paragraph fa-xs mr-2 text-secondary"></i>'}
                                        <span class="font-weight-bold text-dark">${item.title}</span>
                                        ${item.remark 
                                            ? `<small class="ml-2 text-muted">${item.remark}</small>` 
                                            : ''}
                                    </li>
                                `;
                            },
                            renderDropdown: function() {
                                return `<div data-bs-spy="scroll" data-bs-smooth-scroll="true" `
                                    +`class="rte-autocomplete dropdown-menu mention-person-list w-300p h-250p position-fixed overflow-y-scroll" style="z-index: 10000;"></div>`;
                            },
                            matcher: function (item) {
                                return item;
                            },
                        },
                        setup: function(editor) {
                            tinymceEditor = editor;

                            editor.on('keydown', function(e) {
                                if (e.key === 'Backspace' || e.key === 'Delete') {
                                    const node = editor.selection.getNode();
                                    if (node.classList.contains('params-data') && node.getAttribute('data-code')) {
                                        e.preventDefault();
                                        node.remove();
                                        if (editor.getContent() === '') editor.setContent('<p>&nbsp;</p>');
                                        editor.fire('change');
                                    }
                                }
                            });
                            editor.on('init', function() {
                                document.addEventListener('focusin', (e) => {
                                    if (e.target.closest('.tox-tinymce-aux, .moxman-window, .tam-assetmanager-root')) {
                                        e.stopImmediatePropagation();
                                    }
                                });
                            });

                            // Custom event để reload mentions
                            editor.on('reloadMentions', function (e) {

                                const query = e.query || '';

                                // Xóa text hiện tại và chèn lại #
                                editor.selection.setContent('#' + query);

                                // Di chuyển cursor sau #
                                const range = editor.selection.getRng();
                                range.setStartAfter(editor.selection.getNode());
                                range.collapse(true);
                                editor.selection.setRng(range);

                                // Trigger mentions plugin
                                editor.fire('keyup', {key: query || ' '});
                            });
                        },
                        init_instance_callback: function(editor) {
                            let bookmark;
                            editor.on('BeforeExecCommand', function(e) {
                                if (e.command === 'mcePrint') {
                                    bookmark = editor.selection.getBookmark();
                                    editor.selection.setCursorLocation(editor.dom.select('div')[0]);
                                }
                            });
                            editor.on('ExecCommand', function(e) {
                                if (e.command === 'mcePrint') {
                                    editor.selection.moveToBookmark(bookmark);
                                }
                            });
                        }
                    };

                    const defaultSetup = defaultOptions?.['setup']
                    const optSetup = opts['setup'] || function () {}
                    const mergedSetup = function (editor) {
                        defaultSetup(editor)
                        optSetup(editor)
                    };

                    textarea$.tinymce(
                        $.extend(
                            defaultOptions,
                            opts,
                            { setup: mergedSetup }
                        )
                    )
                }
            )
        }
    }

    init_tinymce(content, tinymce_opts={}){
        let clsThis = this;
        if (clsThis.editor) clsThis.editor.remove();

        let idx = this.textarea$.attr('id');
        if (!idx) {
            idx = $x.fn.randomStr(32, true);
            this.textarea$.attr('id', idx);
        }

        let config = $.extend(
            {
                branding: false,
                selector: '#' + idx,
                readonly : 0,
                menubar: false,
                height: 440,
                plugins: 'hr print pagebreak preview visualblocks',
                toolbar: 'hr pagebreak | preview print | visualblocks',
                content_style: `
                    body { font-family: Arial, Helvetica, "Times New Roman", Times, serif, sans-serif; font-size: 11px; }
                    table tr { vertical-align: top; }
                `,
                setup: function(editor) {
                    clsThis.editor = editor;
                    editor.on('init', function (){
                        // https://www.tiny.cloud/blog/tinymce-and-modal-windows/
                        // Include the following JavaScript into your tiny.init script to prevent the Bootstrap dialog from blocking focus:
                        document.addEventListener('focusin', (e) => {
                            if (e.target.closest(".tox-tinymce-aux, .moxman-window, .tam-assetmanager-root") !== null) {
                                e.stopImmediatePropagation();
                            }
                        });
                    })

                    editor.on('BeforeExecCommand ', function (e) {
                        if (e.command === 'mcePrint' && e.target.hasVisual) {
                            document.activeElement.blur();
                            editor.execCommand('mceToggleVisualAid');
                        }
                    });
                    editor.on('ExecCommand', function (e) {
                        if (e.command === 'mcePrint' && e.target.hasVisual) {
                        }
                    });

                },
                // config of: link
                default_link_target: '_blank',
                link_assume_external_targets: true,
                link_default_protocol: 'https',
                // page break
                pagebreak_split_block: true,
                pagebreak_separator: '<div class="myprint__page-break"></div>',
            },
            tinymce_opts
        )

        this.textarea$.val(content);
        // this.textarea$.tinymce(config);
        tinymce.init(config);
    }

    on_template_change(){
        let clsThis = this;
        this.templateList$.on('change', function (){
            clsThis.call_template_detail($(this).val()).then(
                function (result){
                    if (result) clsThis.render_template_detail(result);
                }
            );
        })
    }

    call_template_detail(template_id){
        let url = '/printer/using/detail/' + template_id;
        return $.fn.callAjax2({
            url: url,
            method: 'GET',
            sweetAlertOpts: {'allowOutsideClick': true},
            onlyErrorCallback: true,
            isLoading: true,
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('template_detail')){
                    return data['template_detail'];
                }
                return {};
            },
            (errs) => {
                $.fn.switcherResp(errs, {
                    'isNotify': true,
                    'swalOpts': {
                        'allowOutsideClick': true,
                        title: $.fn.transEle.attr('data-msg-print-not-have-template'),
                    },
                });
                return null;
            }
        )
    }

    call_template_using(){
        let url = '/printer/using/default/' + this.application_id; // 'b9650500-aba7-44e3-b6e0-2542622702a3';
        return $.fn.callAjax2({
            url: url,
            method: 'GET',
            sweetAlertOpts: {'allowOutsideClick': true},
            onlyErrorCallback: true,
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('template_detail')){
                    let defaultTemplate = data.template_detail?.['default'] || null;
                    let defaultIdx = defaultTemplate ? defaultTemplate?.id : null;

                    let templateList = data.template_detail?.['template_list'] || null;
                    if (templateList && Array.isArray(templateList)){
                        if (!defaultIdx) this.templateList$.append(`<option value=""></option>`)
                        this.templateList$.initSelect2({
                            data: templateList.map(
                                (item) => {
                                    let hasDefault = item?.id && defaultIdx ? item.id === defaultIdx : false;
                                    item.hasDefault = hasDefault;
                                    item.selected = hasDefault
                                    return item;
                                }
                            ),
                            templateResult: function(state) {
                                function getRemarks(){
                                    let remarks = state?.data?.remarks || null;
                                    if (remarks) return remarks.length > 100 ? remarks.slice(0, 100) + '...' : remarks;
                                    return '';
                                }

                                function getStyleIsDefault(){
                                    let hasDefault = state?.data?.hasDefault || null;
                                    if (hasDefault === true) return 'font-weight: bold;';
                                    return '';
                                }

                                return $(`<p style="${getStyleIsDefault()}">${state.text}</p> <small>${getRemarks()}</small>`);
                            },
                        });
                        this.on_template_change();
                    }
                    if (templateList || defaultTemplate){
                        return [true, defaultTemplate ? defaultTemplate : {}];
                    }
                    return [false, {}]
                }
                return [false, {}]
            },
            (errs) => {
                $.fn.switcherResp(errs, {
                    'isNotify': true,
                    'swalOpts': {
                        'allowOutsideClick': true,
                        title: $.fn.transEle.attr('data-msg-print-not-have-template'),
                    },
                });
                return [false, {}];
            },
        )
    }

    fill_data(result){
        let data = this.data;
        return DocumentControl.getCompanyCurrencyFull().then(
            (configData) => {
                if (result && typeof result === 'object' && result.hasOwnProperty('contents')){
                    let contents = result['contents'];
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(contents, 'text/html');
                    let idxLooped = [];
                    doc.querySelectorAll(`span.params-data[data-code]`).forEach(node => {
                        let idxNode = node.getAttribute('id');
                        if (idxLooped.indexOf(idxNode) === -1){
                            idxLooped.push(idxNode);
                            let idRendered = TemplateDOM(node, data, configData);
                            idxLooped = idxLooped.concat(idRendered);
                        }
                    })
                    return doc.documentElement.outerHTML;
                } else {
                    // PrintTinymceControl.close_modal();
                    return null;
                }
            }
        )
    }

    render_template_detail(template_detail){
        let clsThis = this;
        clsThis.textarea$.val('');
        clsThis.fill_data(template_detail).then(
            (template) => {
                if (template) {
                    clsThis.textarea$.fadeIn('fast');
                    clsThis.init_tinymce(template);
                }
            }
        )
    }

    render(application_id, data, is_open=false){
        // fill data store
        this.data = data;
        this.application_id = application_id;

        if (application_id && data){
            let clsThis = this;
            if (typeof tinymce === 'object' && this.modal$.length > 0 && this.textarea$.length > 0){
                clsThis.modal$.on('shown.bs.modal', function () {
                    if (clsThis.modal$.attr('data-loaded') !== 'true'){
                        clsThis.modal$.attr('data-loaded', 'true');
                        clsThis.textarea$.val('');
                        clsThis.call_template_using(application_id).then(
                            function (result){
                                if (result && Array.isArray(result) && result.length === 2){
                                    if (result[0] === true) clsThis.render_template_detail(result[1]);
                                    else PrintTinymceControl.close_modal();
                                }
                            }
                        )
                    }
                });
                is_open === true ? clsThis.modal$.modal('show') : null;
            }
        }
    }

    static open_modal(){
        new PrintTinymceControl().modal$.modal('show');
    }

    static close_modal(){
        new PrintTinymceControl().modal$.modal('hide');
    }

    /**
     * Load template in
     * @param {string} application_id - id của application
     * @param {string} print_ajax_url - url đến API lấy data print
     * @param {string} response_key - field trả về
     * @param {Object} params - params
     * @returns {void}
     */
    static open_modal_and_render_templates({application_id, print_ajax_url, response_key, params={}}) {
        if (application_id && print_ajax_url && response_key) {
            WindowControl.showLoading();
            let print_ajax = $.fn.callAjax2({
                'url': print_ajax_url,
                'data': params,
                'method': 'GET',
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty(response_key)) {
                        return data?.[response_key] || {};
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )
            Promise.all([print_ajax]).then(
                (results) => {
                    const print_data = results[0] || {}
                    new PrintTinymceControl().render(application_id, print_data, false);
                    PrintTinymceControl.open_modal();
                    WindowControl.hideLoading();
                })
        }
        else {
            WindowControl.hideLoading();
            $.fn.notifyB({description: $.fn.gettext("Can not get print data!")}, 'warning');
        }
    }
}