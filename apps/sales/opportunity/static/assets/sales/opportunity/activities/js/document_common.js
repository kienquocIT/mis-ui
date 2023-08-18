function appendFileEle(file, data_documents, type) {
    let html = $('.document-hidden').html();
    let ele_doc = $('.document-content');
    ele_doc.append(html);
    let ele_sub_doc = ele_doc.find('.sub-document');
    let ele_last_doc = ele_sub_doc.last();
    let ele_button = ele_last_doc.find('button')
    ele_button.addClass('btn-file-upload');
    ele_button.attr('data-f-input-name', 'attachments' + ele_sub_doc.length.toString())
    ele_button.attr('data-f-name-ele-id', '#documentDisplay' + ele_sub_doc.length.toString());
    ele_last_doc.find('p').attr('id', 'documentDisplay' + ele_sub_doc.length.toString());
    if (type === 'create') {
        FileUtils.init(ele_button);
    } else {
        FileUtils.init(ele_button, file);
        let doc_detail = data_documents.find(item => item.attachment === file.media_file_id);
        ele_last_doc.find('textarea').val(doc_detail.description);
    }
}

class DocumentLoadPage {
    static opportunitySelectEle = $('#box-select-opportunity');
    static personSelectEle = $('#box-select-person-in-charge');

    static loadOpportunity(data) {
        this.opportunitySelectEle.initSelect2({
            data: data,
        })
    }

    static loadPersonInCharge(data) {
        this.personSelectEle.initSelect2({
            data: data,
        })
    }
}