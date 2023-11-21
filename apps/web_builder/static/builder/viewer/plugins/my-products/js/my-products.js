$(function () {
    $(document).ready(function () {
        class myProductClass {
            static urlProductsList = '/site/api/products';
            static urlProductsDetail = '/site/product/{idx}';
            static findStrProductItem = 'div[data-x-id="my-products-item"]';
            static clsProductItemColBlock = 'col-sm-12 col-md-6 col-lg-4';
            static clsProductItemColList = 'col-12';

            static frameDisplayCol = 'input[name="display-col-product"]';
            static frameSearchProduct = 'input[data-x-id="my-products-search"]';
            static frameSortProduct = 'select[data-x-id="my-products-sort"]';

            static activeFrameEvent() {
                $(myProductClass.frameDisplayCol).on('change', function () {
                    if ($(this).val() === 'block') {
                        $(myProductClass.findStrProductItem).each(function () {
                            let parentEle = $(this);
                            parentEle.find('div[data-x-id="my-products-item__body"]').removeClass('row');
                            parentEle.alterClass('col-*').addClass(myProductClass.clsProductItemColBlock);
                            parentEle.find('div[data-x-id="my-products-item-group-picture"]').alterClass('col-*');
                            parentEle.find('div[data-x-id="my-products-item-group-info"]').alterClass('col-*');
                        })
                    } else if ($(this).val() === 'list') {
                        $(myProductClass.findStrProductItem).each(function () {
                            let parentEle = $(this);
                            parentEle.find('div[data-x-id="my-products-item__body"]').addClass('row');
                            parentEle.alterClass('col-*').addClass(myProductClass.clsProductItemColList);
                            parentEle.find('div[data-x-id="my-products-item-group-picture"]').alterClass('col-*').addClass('col-4');
                            parentEle.find('div[data-x-id="my-products-item-group-info"]').alterClass('col-*').addClass('col-8');
                        })
                    }
                });
            }

            static activeFrameEventOnetime(){
                $(myProductClass.frameSearchProduct).on('change', function (){
                    myProductClass.callGetProducts();
                });

                $(myProductClass.frameSortProduct).on('change', function (){
                    myProductClass.callGetProducts();
                })
            }

            static loadProductData(myProductPatternEle, productData) {
                productData.map(
                    (itemData) => {
                        let clonePattern = myProductPatternEle.clone();
                        clonePattern.attr('data-x-is-default', 'false');
                        let myProductCls = new myProductClass({myProductItemEle: clonePattern});

                        // load link
                        let dataId = itemData?.['id'] || null;
                        myProductCls.loadLink(dataId);

                        // load banner
                        let bannerData = itemData?.['banner'] || '';
                        myProductCls.loadBanner(bannerData);

                        // load picture
                        let pictureData = itemData?.['avatar'] || '';
                        myProductCls.loadPicture(pictureData)

                        // load title
                        myProductCls.loadTitle(itemData?.['title'] || '');

                        // load price
                        let priceData = itemData?.['sale_price'] || '';
                        myProductCls.loadPrices(priceData, 'VND');
                        myProductCls.loadPricesBefore("200.000 đ", {'is_hidden': true});
                        myProductCls.loadPercentOff("-40.5%", {'is_hidden': true});

                        // load remarks
                        myProductCls.loadRemarks(itemData?.['description'] || '');

                        // load sold
                        myProductCls.loadSole("387", {'is_hidden': true});

                        // load voted star
                        myProductCls.loadVoteStar(3.4, {'is_hidden': true});

                        // load warehouse available
                        myProductCls.loadWareHouseTitle([], {'is_hidden': false});

                        // append to main
                        clonePattern.removeClass('d-none').css('height', '100%').insertAfter(myProductPatternEle);

                        // active event
                        myProductClass.activeFrameEvent();
                    }
                )
            }

            constructor(props) {
                this.myProductItemEle = props.myProductItemEle;
            }

            loadLink(dataId){
                if (dataId) this.myProductItemEle.find('a[data-x-id="my-products-link"]').attr('href', myProductClass.urlProductsDetail.replaceAll("{idx}", dataId));
            }

            loadBanner(data, opts = {}) {
                let is_hidden = opts?.['is_hidden'] || false;
                if (data && is_hidden === false) return this.myProductItemEle.find('[data-x-id="my-products-item-banner-hot"]').find('.banner-value').text(data);
                else return this.myProductItemEle.find('[data-x-id="my-products-item-banner-hot"]').addClass('d-none');
            }

            loadPicture(data, opts = {}) {
                let is_hidden = opts?.['is_hidden'] || false;
                let imageEle = this.myProductItemEle.find('img[data-x-id="my-products-item-picture"]');
                if (data && is_hidden === false) imageEle.attr('src', data);
                // else imageEle.addClass('d-none');
            }

            loadTitle(data) {
                this.myProductItemEle.find('[data-x-id="my-products-item-title"]').text(data);
            }

            loadPrices(data, currencyCode) {
                let valueEle = this.myProductItemEle.find('[data-x-id="my-products-item-price__value"]');
                let currencyEle = this.myProductItemEle.find('[data-x-id="my-products-item-price__currency"]');
                if (data && currencyCode){
                    valueEle.text($.fn.convertThousand(data.toString()));
                    currencyEle.text(currencyCode);
                } else {
                    valueEle.addClass('d-none');
                    currencyEle.text('d-none');
                }
            }

            loadPricesBefore(data, opts = {}) {
                let is_hidden = opts?.['is_hidden'] || false;
                if (is_hidden === false) this.myProductItemEle.find('[data-x-id="my-products-item-price-before"]').text(data);
                else this.myProductItemEle.find('[data-x-id="my-products-item-price-before"]').addClass('d-none');
            }

            loadPercentOff(data, opts = {}) {
                let is_hidden = opts?.['is_hidden'] || false;
                if (is_hidden === false) this.myProductItemEle.find('[data-x-id="my-products-item-percent-off"]').text(data);
                else this.myProductItemEle.find('[data-x-id="my-products-item-percent-off"]').addClass('d-none');
            }

            loadRemarks(data) {
                this.myProductItemEle.find('[data-x-id="my-products-item-remarks"]').text(data);
            }

            loadSole(data, opts = {}) {
                let is_hidden = opts?.['is_hidden'] || false;
                if (is_hidden === false) this.myProductItemEle.find('div[data-x-id="my-products-item-sold"]').find('.sold-value').text(data);
                else this.myProductItemEle.find('div[data-x-id="my-products-item-sold"]').addClass('d-none');
            }

            loadVoteStar(data, opts = {}) {
                let is_hidden = opts?.['is_hidden'] || false;
                let voteStartEle = this.myProductItemEle.find('div[data-x-id="my-products-item-vote-start"]');
                if (is_hidden === false){
                    voteStartEle.find('.start-1').alterClass('vote-*').addClass('vote-star vote-100');
                    voteStartEle.find('.start-2').alterClass('vote-*').addClass('vote-star vote-100');
                    voteStartEle.find('.start-3').alterClass('vote-*').addClass('vote-star vote-100');
                    voteStartEle.find('.start-4').alterClass('vote-*').addClass('vote-star vote-40');
                    voteStartEle.find('.start-5').alterClass('vote-*').addClass('vote-star vote-0');
                } else {
                    voteStartEle.addClass('d-none');
                }
            }

            loadWareHouseTitle(data, opts = {}) {
                let is_hidden = opts?.['is_hidden'] || false;
                if (is_hidden === false) {
                    let baseEle = this.myProductItemEle.find('div[data-x-id="my-products-item-warehouse-title"]').addClass('d-none');
                    if (Array.isArray(data)){
                        data.map(
                            (item) => {
                                let patternEle = baseEle.clone().removeClass('d-none').find(".warehouse-title").text(item);
                                patternEle.insertAfter(baseEle);
                            }
                        )
                    }

                } else {
                    this.myProductItemEle.find('div[data-x-id="my-products-item-warehouse-title"]').addClass('d-none');
                }
            }

            static callGetProducts() {
                let pluginProductList = $('div[data-x-id="my-products-list"]');
                let myProductPatternEle = $(myProductClass.findStrProductItem + '[data-x-is-default="true"]');
                myProductPatternEle.addClass('d-none');
                if (pluginProductList.length === 1){
                    // init call listen search, sort + delete was rendered
                    let wasRendered = $(myProductClass.findStrProductItem + '[data-x-is-default="false"]');
                    if (wasRendered.length === 0) myProductClass.activeFrameEventOnetime();
                    wasRendered.remove();

                    // convert filter data
                    let filterData = {
                        'page': 1,
                        'pageSize': 12,
                    };
                    if ($(myProductClass.frameSearchProduct).val()){
                        filterData['search'] = $(myProductClass.frameSearchProduct).val();
                    }
                    if ($(myProductClass.frameSortProduct).val()){
                        let sortDT = $(myProductClass.frameSortProduct).val();
                        if (sortDT === 'price-a-z'){
                            filterData['ordering'] = '-sale_price';
                        } else if (sortDT === 'price-z-a') {
                            filterData['ordering'] = 'sale_price';
                        }
                    }
                    filterData = $.param(filterData)
                    $.fn.callAjaxPublic({
                        url: myProductClass.urlProductsList + (filterData ? "?" + filterData : ""),
                        method: 'GET',
                    }).then(
                        (resp) => {
                            myProductClass.loadProductData(myProductPatternEle, resp.data);
                        },
                        (errs) => {
                            console.log('errs:', errs);
                        }
                    )
                }
            }

        }
        myProductClass.callGetProducts();
    })
})