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
                        if (typeof item === 'object' && item.hasOwnProperty(currentKey)){
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
    } else {
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
            for(let i = 0; i < maxLength ; i++){
                let nodeTrNew = nodeTr.cloneNode(true);
                for (let codeKey in dataList){
                    nodeTrNew.querySelectorAll(`#${codeKey}`).forEach(
                        nodeMatch => {
                            if (codeKey === 'idx-koyaCV0MplKSSC2Y') console.log('nodeMatch:', codeKey, nodeMatch, dataList[codeKey]);
                            nodeMatch.removeAttribute('style');
                            nodeMatch.innerText = dataList[codeKey].length >= i ? dataList[codeKey][i] : '_';
                        }
                    )
                }
                nodeParentTr.appendChild(nodeTrNew);
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
        this.textarea$ = opts?.textarea$ ? opts.textarea$ : this.modal$.find('textarea');
        this.doc = null;
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
                    textarea$.tinymce(
                        $.extend(
                            {
                                branding: false,
                                readonly : 0,
                                menubar: false,
                                height: 120,
                                // plugins: 'quickbars columns advlist autolink lists insertdatetime hr emoticons table mention link media image preview tabfocus visualchars visualblocks wordcount pagebreak print preview',
                                // toolbar: 'undo redo | styleselect | bold italic strikethrough sizeselect fontselect fontsizeselect | centerHeight centerWidth | forecolor backcolor | numlist bullist table twoColumn threeColumn | pagebreak preview print | link image media emoticons | outdent indent hr insertdatetime | visualblocks visualchars wordcount removeformat',
                                plugins: 'columns mention print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
                                toolbar: 'bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist table twoColumn threeColumn removeColumnsSplit cleanColumnItem | forecolor backcolor removeformat removeSelectionEle | image template link hr pagebreak| preview print visualblocks | rarely_used',
                                quickbars_insert_toolbar: 'link image | numlist bullist table twoColumn threeColumn | hr pagebreak | removeSelectionEle',
                                toolbar_groups: {
                                    rarely_used: {
                                      icon: 'more-drawer',
                                      tooltip: 'Rarely Used',
                                      items: 'ltr rtl | charmap emoticons | superscript subscript | nonbreaking anchor media | undo redo | '
                                    }
                                  },
                                fontsize_formats: "8px 9px 10px 11px 12px 14px 16px 18px 20px 22px 24px 26px 28px 36px 48px 72px",
                                pagebreak_split_block: true,
                                pagebreak_separator: '<span class="page-break-here"><!-- my page break --></span>',
                                nonbreaking_force_tab: true,
                                templates : templateResult.map(
                                    (item) => {
                                        item['url'] = staticStart + item['url'];
                                        return item;
                                    }
                                ),
                                insertdatetime_formats: ['%d-%m-%Y %H:%M:%S', '%d-%m-%Y', '%H:%M:%S', '%I:%M:%S %p'],
                                content_css: textarea$.attr('data-css-url-render'),
                                content_style: `
                                    body { font-family: Arial, Helvetica, "Times New Roman", Times, serif, sans-serif; font-size: 11px; }
                                    table tr { vertical-align: top; }
                                `,
                                mentions: {
                                    queryBy: 'code',
                                    items: 10,
                                    delimiter: '#',
                                    source: function (query, process, delimiter) {
                                        // Do your ajax call
                                        // When using multiple delimiters you can alter the query depending on the delimiter used
                                        if (delimiter === '#') {
                                            let params = $.param(
                                                $.extend(
                                                    {
                                                        'page': 1,
                                                        'pageSize': 10,
                                                        'ordering': 'title',
                                                        // 'application': application_id,
                                                        'application__in': `${application_id},ba2ef9f1-63f4-4cfb-ae2f-9dee6a56da68`,
                                                        'is_print': true,
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
                                                        process(resource);
                                                    }
                                                },
                                                (errs) => $.fn.switcherResp(errs),
                                            )
                                        }
                                    },
                                    insert: function (item) {
                                        return `<span
                                            id="idx-${$x.fn.randomStr(16)}" 
                                            class="params-data" 
                                            data-code="${item.code}" 
                                            style="padding: 3px;background-color: #f1f1f1;"
                                        >#${item.title}</span>\u200B&nbsp;`
                                    },
                                    render: function(item) {
                                        return `
                                            <li style="cursor: pointer;" class="d-flex align-items-center">
                                                ${item.code.indexOf('___') !== -1 ? '<i class="fa-solid fa-table-list fa-2xs mr-1"></i>' : '<i class="fa-solid fa-paragraph fa-2xs mr-1"></i>'}
                                                ${item.title} <small>${ item.remark ? '- ' + item.remark : ''}</small>
                                            </li>
                                        `
                                    },
                                    renderDropdown: function() {
                                        return '<ul class="rte-autocomplete dropdown-menu mention-person-list"></ul>';
                                    }
                                },
                                setup: function(editor) {
                                    tinymceEditor = editor;
                                    editor.on('keydown', function(e) {
                                        if (e.key === 'Backspace' || e.key === 'Delete') {
                                            let node = editor.selection.getNode();
                                            if (node.getAttribute("data-mention") === "true") {
                                                e.preventDefault();
                                                node.remove();
                                                if (editor.getContent() === '') editor.setContent('<p>&nbsp;</p>');
                                                editor.fire('change');
                                            }
                                        }
                                    });
                                    editor.on('init', function (){
                                        // https://www.tiny.cloud/blog/tinymce-and-modal-windows/
                                        // Include the following JavaScript into your tiny.init script to prevent the Bootstrap dialog from blocking focus:
                                        document.addEventListener('focusin', (e) => {
                                            if (e.target.closest(".tox-tinymce-aux, .moxman-window, .tam-assetmanager-root") !== null) {
                                                e.stopImmediatePropagation();
                                            }
                                        })
                                    })
                                },
                                // config of: link
                                default_link_target: '_blank',
                                link_assume_external_targets: true,
                                link_default_protocol: 'https',
                            },
                            opts
                        )
                    )
                }
            )
        }
    }

    init_tinymce(content, tinymce_opts={}){
        let idx = this.textarea$.attr('id');
        if (!idx) {
            idx = $x.fn.randomStr(32, true);
            this.textarea$.attr('id', idx);
        }

        let config = $.extend(
            {
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
                    editor.on('init', function (){
                        // https://www.tiny.cloud/blog/tinymce-and-modal-windows/
                        // Include the following JavaScript into your tiny.init script to prevent the Bootstrap dialog from blocking focus:
                        document.addEventListener('focusin', (e) => {
                            if (e.target.closest(".tox-tinymce-aux, .moxman-window, .tam-assetmanager-root") !== null) {
                                e.stopImmediatePropagation();
                            }
                        })
                    })
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

    on_events() {
        let clsThis = this;
        this.modal$.find('button[data-action="save-print"]').on('click', function (){
            clsThis.textarea$.tinymce().focus(true);  // skip focus before call print | keep focus style don't include
            clsThis.textarea$.tinymce().execCommand('mcePrint');
        })
    }

    call_template_using(application_id){
        let url = '/printer/using/' + application_id; // 'b9650500-aba7-44e3-b6e0-2542622702a3';
        return $.fn.callAjax2({
            url: url,
            sweetAlertOpts: {'allowOutsideClick': true},
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('template_detail')){
                    return data['template_detail'];
                }
                return {}
            },
            (errs) => {
                $.fn.notifyB({
                    'description': $.fn.transEle.attr('data-msg-print-not-have-template'),
                }, 'failure')
            },
        )
    }

    fill_data(application_id, data){
        return this.call_template_using(application_id).then(
            function (result){
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
                            PrintTinymceControl.close_modal();
                            return null;
                        }
                    }
                )
            }
        )
    }

    render(application_id, data, is_open=false){
        if (application_id && data){
            let clsThis = this;
            if (typeof tinymce === 'object' && this.modal$.length > 0 && this.textarea$.length > 0){
                clsThis.textarea$.val('');
                clsThis.modal$.on('shown.bs.modal', function () {
                    clsThis.modal$.attr('data-loaded', true);
                    clsThis.fill_data(application_id, data).then(
                        (template) => {
                            if (template) {
                                clsThis.init_tinymce(template);
                                clsThis.on_events();
                            }
                        }
                    );
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
}