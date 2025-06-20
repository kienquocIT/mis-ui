// Declare elements in Page
class IncomingDocElements {
    constructor() {
        this.$titleEle = $('#txt_title')
        this.$attachFilesEle = $('#attachment')
        this.$descriptionEle = $('#textarea_remark')
        this.$senderEle = $('#sender')
        this.$docTypeEle = $('#select-box-doc_type')
        this.$contentGroupEle = $('#select-box-content_group')
        this.$effectiveDateEle = $('#kms_effective_date')
        this.$expiredDateEle = $('#kms_expired_date')
        this.$securityLevelEle = $('#kms_security_level')
        this.$folderEle = $('#kms_folder')
    }
}
const pageElements = new IncomingDocElements();

// Load data
class IncomingDocLoadDataHandle {
    static initPage() {
        // init selection
        FormElementControl.loadInitS2(pageElements.$docTypeEle);
        FormElementControl.loadInitS2(pageElements.$contentGroupEle);
        FormElementControl.loadInitS2(pageElements.$folderEle);

        // init date
        $('.date-picker').each(function () {
            DateTimeControl.initDatePicker(this);
        });
    }

    static extractFileInfo($li) {
        return $li.data('file-id');
    }

    static buildAttachedList() {
        const fileItems = [];
        pageElements.$attachFilesEle.find('.dm-uploader-result-list li').each(function () {
            const fileInfo = IncomingDocLoadDataHandle.extractFileInfo($(this));
            fileItems.push(fileInfo);
        });
        let parsedEffectiveDate = moment(pageElements.$effectiveDateEle.val(), "DD/MM/YYYY", true);
        let parsedExpiredDate = moment(pageElements.$expiredDateEle.val(), "DD/MM/YYYY", true);

        return [{
            sender: pageElements.$senderEle.val(),
            document_type: pageElements.$docTypeEle.val(),
            content_group: pageElements.$contentGroupEle.val(),
            effective_date: parsedEffectiveDate.isValid() ? parsedEffectiveDate.format('YYYY-MM-DD') : null,
            expired_date: parsedExpiredDate.isValid() ? parsedExpiredDate.format('YYYY-MM-DD') : null,
            security_level: pageElements.$securityLevelEle.val(),
            attachment: fileItems
        }]
    }

    static combineData(formEle) {
        let frm = new SetupFormSubmit($(formEle));
        frm.dataForm['title'] = pageElements.$titleEle.val();
        frm.dataForm['remark'] = pageElements.$descriptionEle.val() || null;
        frm.dataForm['attached_list'] = IncomingDocLoadDataHandle.buildAttachedList();
        return frm;
    }
}

// DataTable
class IncomingDocDtbHandle {

}

// Load Editor
class loadEditor {
    init() {
        const $textArea = $('#textarea_remark');
        $textArea.tinymce({
            height: 500,
            menubar: false,
            plugins: ['columns', 'print', 'preview', 'paste', 'importcss', 'searchreplace', 'autolink', 'autosave',
                'save', 'directionality', 'code', 'visualblocks', 'visualchars', 'fullscreen', 'image', 'link', 'media',
                'codesample', 'table', 'charmap', 'hr', 'pagebreak', 'nonbreaking', 'anchor', 'toc',
                'insertdatetime', 'advlist', 'lists', 'wordcount', 'imagetools', 'textpattern', 'noneditable',
                'help', 'charmap', 'quickbars', 'emoticons'],
            toolbar: 'bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist table twoColumn threeColumn | preview pagebreak removeformat print visualblocks',  // | rarely_used
            quickbars_insert_toolbar: 'link image | numlist bullist table twoColumn threeColumn | hr pagebreak',
            toolbar_groups: {
                rarely_used: {
                    icon: 'more-drawer',
                    tooltip: 'Rarely Used',
                    items: 'ltr rtl | charmap emoticons | superscript subscript | nonbreaking anchor media | undo redo | '
                }
            },
            font_formats: 'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Cambria=cambria,serif; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
            pagebreak_split_block: true,
            pagebreak_separator: '<span class="page-break-here"><!-- my page break --></span>',
            nonbreaking_force_tab: true,
            insertdatetime_formats: ['%d-%m-%Y %H:%M:%S', '%d-%m-%Y', '%H:%M:%S', '%I:%M:%S %p'],
            content_css: $textArea.attr('data-css-url-render'),
            content_style: `
                body { font-family: Cambria,sans-serif; font-size: 12pt; }
                @import url('/static/assets/fonts/cambria/Cambria.ttf');
                @media print {
                    .mce-visual-caret {
                        display: none;
                    }
                }
            `
        });
    }
}
