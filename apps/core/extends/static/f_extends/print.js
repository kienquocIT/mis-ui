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
                }
            },
            opts
        );
        this.opts.margin = PrintControl.getRatioUnit(this.opts.jsPDF.unit, this.opts.margin);
        this.marginOfPageNumber = PrintControl.getRatioUnit(this.opts.jsPDF.unit, 0.2);

        this.doc = null;

    }

    _reset(){
        this.iframe$.empty();
        this.iframe$.removeAttr('src');
        this.modal$.removeAttr('data-loaded')
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
        if (typeof html2pdf === 'function' && this.modal$.length > 0 && this.iframe$.length > 0){
            clsThis.iframe$.empty();
            clsThis.modal$.on('shown.bs.modal', function () {
                if (!clsThis.modal$.attr('data-loaded')) {
                    clsThis.modal$.attr('data-loaded', true);
                    clsThis.doc = html2pdf().set(clsThis.opts).from(content).toPdf().get('pdf').then(function (pdf) {
                        var totalPages = pdf.internal.getNumberOfPages();
                        for (let i = 1; i <= totalPages; i++) {
                            pdf.setPage(i);
                            pdf.setFontSize(10);
                            pdf.setTextColor(100);
                            pdf.text(
                                clsThis.modal$.attr('data-msg-page-of-total').replaceAll('__page__', i).replaceAll('__total_page__', totalPages),
                                (pdf.internal.pageSize.getWidth() / 2.1),
                                (pdf.internal.pageSize.getHeight() - clsThis.marginOfPageNumber)
                            );
                        }
                        clsThis.on_render_pdf();
                        clsThis.on_events();
                    });
                }
            });
            clsThis.modal$.modal('show');
        }
    }
}