let promotionClass = new promotionHandle();
let shippingClass = new shippingHandle();
let finalRevenueBeforeTax = document.getElementById('quotation-final-revenue-before-tax');

// Load data
class QuotationLoadDataHandle {
    static opportunitySelectEle = $('#select-box-quotation-create-opportunity');
    static customerSelectEle = $('#select-box-quotation-create-customer');
    static contactSelectEle = $('#select-box-quotation-create-contact');
    static paymentSelectEle = $('#select-box-quotation-create-payment-term');
    static salePersonSelectEle = $('#select-box-quotation-create-sale-person');

    static loadBoxQuotationOpportunity(dataOpp = {}, sale_person = null, is_load_detail = false, is_copy = false) {
        let ele = QuotationLoadDataHandle.opportunitySelectEle;
        let data_filter = {}
        if ($('#data-init-quotation-create-request-employee').val()) {
            let data_filter = {
                'sale_person_id': sale_person,
                'is_close_lost': false,
                'is_deal_close': false,
            };
            if ($('#frm_quotation_create')[0].classList.contains('sale-order')) {
                data_filter['sale_order__isnull'] = true;
            } else {
                data_filter['quotation__isnull'] = true;
            }
        }
        ele.initSelect2({
            data: dataOpp,
            dataParams: data_filter,
            disabled: !(ele.attr('data-url')),
        });


        // if (!sale_person) {
        //     sale_person = $('#select-box-quotation-create-sale-person').val(); // filter by sale_person
        // }
        // if (sale_person) {
        //     let data_filter = {
        //         'sale_person_id': sale_person,
        //         'is_close_lost': false,
        //         'is_deal_close': false,
        //     };
        //     if ($('#frm_quotation_create')[0].classList.contains('sale-order')) {
        //         data_filter['sale_order__isnull'] = true;
        //     } else {
        //         data_filter['quotation__isnull'] = true;
        //     }
        //     if (!ele[0].innerHTML || Object.keys(valueToSelect).length !== 0) {
        //         $.fn.callAjax2({
        //                 'url': url,
        //                 'method': method,
        //                 'data': data_filter,
        //                 'isDropdown': true,
        //             }
        //         ).then(
        //             (resp) => {
        //                 let data = $.fn.switcherResp(resp);
        //                 if (data) {
        //                     if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list)) {
        //                         ele.empty();
        //                         if (Object.keys(valueToSelect).length !== 0) {
        //                             data.opportunity_list.push(valueToSelect);
        //                             // check opp has sale order or closed => disabled button copy to (Only for page quotation detail)
        //                             if (is_load_detail === true) {
        //                                 if (!$('#frm_quotation_create')[0].classList.contains('sale-order')) {
        //                                     if (valueToSelect.is_close_lost === true || valueToSelect.is_deal_close === true || valueToSelect.sale_order_id !== null) {
        //                                         let btnCopy = document.getElementById('btn-copy-quotation');
        //                                         let eleTooltipBtnCopy = document.getElementById('tooltip-btn-copy');
        //                                         btnCopy.setAttribute('disabled', 'true');
        //                                         eleTooltipBtnCopy.removeAttribute('data-bs-original-title');
        //                                         eleTooltipBtnCopy.setAttribute('data-bs-placement', 'top');
        //                                         eleTooltipBtnCopy.setAttribute('title', $.fn.transEle.attr('data-valid-btn-copy'));
        //                                     }
        //                                 }
        //                             }
        //                         }
        //                         let eleHTML = ``;
        //                         data.opportunity_list.map(function (item) {
        //                             if (item.id) {
        //                                 let dataStr = JSON.stringify({
        //                                     'id': item.id,
        //                                     'title': item.title,
        //                                     'code': item.code,
        //                                     'customer': item.customer?.title
        //                                 }).replace(/"/g, "&quot;");
        //                                 let opportunity_data = JSON.stringify(item).replace(/"/g, "&quot;");
        //                                 let data_show = `${item.code}` + ` - ` + `${item.title}`;
        //                                 eleHTML += `<option value="${item.id}">
        //                                                 <span class="opp-title">${data_show}</span>
        //                                                 <input type="hidden" class="data-default" value="${opportunity_data}">
        //                                                 <input type="hidden" class="data-info" value="${dataStr}">
        //                                             </option>`
        //                                 if (valueToSelect && valueToSelect.id === item.id) {
        //                                     eleHTML += `<option value="${item.id}" selected>
        //                                                     <span class="opp-title">${data_show}</span>
        //                                                     <input type="hidden" class="data-default" value="${opportunity_data}">
        //                                                     <input type="hidden" class="data-info" value="${dataStr}">
        //                                                 </option>`
        //                                 }
        //                             }})
        //                         ele.append(`<option value=""></option>`);
        //                         ele.append(eleHTML);
        //                         self.loadInformationSelectBox(ele);
        //                     }
        //                 }
        //                 // ReCheck Config when change Opportunity (If not load detail or is copy)
        //                 if (is_load_detail === false || is_copy === true) {
        //                     configClass.checkConfig(true, null, false, false, is_copy);
        //                 }
        //             }
        //         )
        //     }
        // } else {
        //     ele.append(`<option value=""></option>`);
        //     // ReCheck Config when change Opportunity (If not load detail or is copy)
        //     if (is_load_detail === false || is_copy === true) {
        //         configClass.checkConfig(true, null, false, false, is_copy);
        //     }
        // }
    };

    static loadBoxQuotationCustomer(dataCustomer = {}, sale_person = null, is_load_detail = false) {
        let ele = QuotationLoadDataHandle.customerSelectEle;
        ele.initSelect2({
            data: dataCustomer,
            // dataParams: data_filter,
            disabled: !(ele.attr('data-url')),
            callbackTextDisplay: function (item) {
                return item?.['name'] || '';
            },
        });


        // if (!sale_person) {
        //     sale_person = $('#select-box-quotation-create-sale-person').val(); // filter by sale_person
        // }
        // if (sale_person) {
        //     let data_filter = {'employee__id': sale_person}
        //     if (!ele[0].innerHTML || valueToSelect) {
        //         $.fn.callAjax2({
        //                 'url': url,
        //                 'method': method,
        //                 'data': data_filter,
        //                 'isDropdown': true,
        //             }
        //         ).then(
        //             (resp) => {
        //                 let data = $.fn.switcherResp(resp);
        //                 if (data) {
        //                     if (data.hasOwnProperty('account_sale_list') && Array.isArray(data.account_sale_list)) {
        //                         self.loadShippingBillingCustomer();
        //                         ele.empty();
        //                         let dataAppend = ``;
        //                         let dataSelected = ``;
        //                         data.account_sale_list.map(function (item) {
        //                             let ownerName = "";
        //                             if (item.owner) {
        //                                 ownerName = item.owner.fullname;
        //                             }
        //                             let dataStr = JSON.stringify({
        //                                 'id': item.id,
        //                                 'Name': item.name,
        //                                 'Owner name': ownerName,
        //                             }).replace(/"/g, "&quot;");
        //                             let customer_data = JSON.stringify(item).replace(/"/g, "&quot;");
        //                             dataAppend += `<option value="${item.id}">
        //                                                 <span class="account-title">${item.name}</span>
        //                                                 <input type="hidden" class="data-default" value="${customer_data}">
        //                                                 <input type="hidden" class="data-info" value="${dataStr}">
        //                                             </option>`;
        //                             if (item.id === valueToSelect) {
        //                                 dataSelected = `<option value="${item.id}" selected>
        //                                                 <span class="account-title">${item.name}</span>
        //                                                 <input type="hidden" class="data-default" value="${customer_data}">
        //                                                 <input type="hidden" class="data-info" value="${dataStr}">
        //                                             </option>`;
        //                                 // load Shipping & Billing by Customer
        //                                 self.loadShippingBillingCustomer(item);
        //                                 // load Contact by Customer
        //                                 if (item.id && item.owner) {
        //                                     self.loadBoxQuotationContact(item.owner.id, item.id);
        //                                 }
        //                                 // load Payment Term by Customer
        //                                 self.loadBoxQuotationPaymentTerm(item.payment_term_mapped.id);
        //                                 // Store Account Price List
        //                                 document.getElementById('customer-price-list').value = item.price_list_mapped.id;
        //                                 // load again price of product by customer price list then Re Calculate
        //                                 if (is_load_detail === false) {
        //                                     self.loadDataProductAll();
        //                                 }
        //                             }
        //                         })
        //                         ele.append(`<option value=""></option>`);
        //                         if (dataSelected) { // if Value to select
        //                             if ($('#select-box-quotation-create-opportunity').val()) { // if page has Opp
        //                                 ele.append(dataSelected);
        //                             } else { // if page no Opp
        //                                 ele.append(dataSelected);
        //                                 ele.append(dataAppend);
        //                             }
        //                         } else { // if no Value to select
        //                             if (!valueToSelect) {
        //                                 ele.append(dataAppend);
        //                             }
        //                             // load Contact no Customer
        //                             self.loadBoxQuotationContact();
        //                             // load Payment Term no Customer
        //                             self.loadBoxQuotationPaymentTerm();
        //                             // Store Account Price List
        //                             document.getElementById('customer-price-list').value = "";
        //                             // load again price of product by customer price list then Re Calculate
        //                             self.loadDataProductAll();
        //
        //                         }
        //                         self.loadInformationSelectBox(ele);
        //                     }
        //                 }
        //             }
        //         )
        //     }
        // } else {
        //     ele.append(`<option value=""></option>`);
        // }
    };

    static loadBoxQuotationContact(dataContact = {}, customerID = null) {
        let ele = QuotationLoadDataHandle.contactSelectEle;
        ele.initSelect2({
            data: dataContact,
            // dataParams: data_filter,
            disabled: !(ele.attr('data-url')),
            callbackTextDisplay: function (item) {
                return item?.['fullname'] || '';
            },
        });


        // let url = ele.attr('data-url');
        // let method = ele.attr('data-method');
        // if (customerID) {
        //     $.fn.callAjax2({
        //             'url': url,
        //             'method': method,
        //             'data': {'account_name_id': customerID},
        //             'isDropdown': true,
        //         }
        //     ).then(
        //         (resp) => {
        //             let data = $.fn.switcherResp(resp);
        //             if (data) {
        //                 if (data.hasOwnProperty('contact_list') && Array.isArray(data.contact_list)) {
        //                     ele.empty();
        //                     ele.append(`<option value=""></option>`);
        //                     data.contact_list.map(function (item) {
        //                         let dataStr = JSON.stringify({
        //                             'id': item.id,
        //                             'Name': item.fullname,
        //                             'Job title': item.job_title,
        //                             'Mobile': item.mobile,
        //                             'Email': item.email
        //                         }).replace(/"/g, "&quot;");
        //                         let dataAppend = `<option value="${item.id}">
        //                                         <span class="contact-title">${item.fullname}</span>
        //                                         <input type="hidden" class="data-info" value="${dataStr}">
        //                                     </option>`
        //                         if (item.id === valueToSelect) {
        //                             dataAppend = `<option value="${item.id}" selected>
        //                                         <span class="contact-title">${item.fullname}</span>
        //                                         <input type="hidden" class="data-info" value="${dataStr}">
        //                                     </option>`;
        //                         }
        //                         ele.append(dataAppend);
        //                     })
        //                     self.loadInformationSelectBox(ele);
        //                 }
        //             }
        //         }
        //     )
        // } else {
        //     ele.empty();
        //     ele.append(`<option value=""></option>`);
        // }
    }

    static loadBoxQuotationPaymentTerm(dataPayment = null) {
        let ele = QuotationLoadDataHandle.paymentSelectEle;
        ele.initSelect2({
            data: dataPayment,
            // dataParams: data_filter,
            disabled: !(ele.attr('data-url')),
        });



        // if (!ele[0].innerHTML || valueToSelect) {
        //     $.fn.callAjax2({
        //             'url': url,
        //             'method': method,
        //             'isDropdown': true,
        //         }
        //     ).then(
        //         (resp) => {
        //             let data = $.fn.switcherResp(resp);
        //             if (data) {
        //                 if (data.hasOwnProperty('payment_terms_list') && Array.isArray(data.payment_terms_list)) {
        //                     ele.empty();
        //                     ele.append(`<option value=""></option>`);
        //                     data.payment_terms_list.map(function (item) {
        //                         let dataStr = JSON.stringify(item).replace(/"/g, "&quot;");
        //                         let option = `<option value="${item.id}">
        //                                     <span class="opp-title">${item.title}</span>
        //                                     <input type="hidden" class="data-info" value="${dataStr}">
        //                                 </option>`
        //                         if (valueToSelect && valueToSelect === item.id) {
        //                             option = `<option value="${item.id}" selected>
        //                                         <span class="opp-title">${item.title}</span>
        //                                         <input type="hidden" class="data-info" value="${dataStr}">
        //                                     </option>`;
        //                         }
        //                         ele.append(option);
        //                     });
        //                     self.loadInformationSelectBox(ele);
        //                 }
        //             }
        //         }
        //     )
        // }
    }

    static loadBoxQuotationSalePerson(dataSalePerson = {}, is_load_init = false) {
        let ele = QuotationLoadDataHandle.salePersonSelectEle;
        ele.initSelect2({
            data: dataSalePerson,
            disabled: !(ele.attr('data-url')),
            callbackTextDisplay: function (item) {
                return item?.['full_name'] || '';
            },
        });


        // $.fn.callAjax2({
        //         'url': url,
        //         'method': method,
        //         'isDropdown': true,
        //     }
        // ).then(
        //     (resp) => {
        //         let data = $.fn.switcherResp(resp);
        //         if (data) {
        //             if (data.hasOwnProperty('employee_list') && Array.isArray(data.employee_list)) {
        //                 let initEmployee = $('#data-init-quotation-create-request-employee-id');
        //                 if (initEmployee.val() && is_load_init === true) {
        //                     valueToSelect = initEmployee.val();
        //                 }
        //                 let optionSelected = ``;
        //                 ele.empty();
        //                 ele.append(`<option value=""></option>`);
        //                 data.employee_list.map(function (item) {
        //                     let group = '';
        //                     if (item.group) {
        //                         group = item.group.title
        //                     }
        //                     let dataStr = JSON.stringify({
        //                         'id': item.id,
        //                         'Name': item.full_name,
        //                         'Code': item.code,
        //                         'Group': group
        //                     }).replace(/"/g, "&quot;");
        //                     if (valueToSelect && valueToSelect === item.id) {
        //                         optionSelected = `<option value="${item.id}" selected>
        //                                                 <span class="employee-title">${item.full_name}</span>
        //                                                 <input type="hidden" class="data-info" value="${dataStr}">
        //                                             </option>`;
        //                         ele.append(optionSelected);
        //                     } else {
        //                         ele.append(`<option value="${item.id}">
        //                                         <span class="employee-title">${item.full_name}</span>
        //                                         <input type="hidden" class="data-info" value="${dataStr}">
        //                                     </option>`);
        //                     }
        //                 });
        //                 if (is_load_init === false && valueToSelect) {
        //                     ele.empty();
        //                     ele.append(optionSelected);
        //                 }
        //                 self.loadInformationSelectBox(ele);
        //             }
        //         }
        //     }
        // )
    }

    static loadBoxQuotationPrice() {
        let ele = $('#select-box-quotation-create-price-list');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax2({
                'url': url,
                'method': method,
                'isDropdown': true,
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('price_list') && Array.isArray(data.price_list)) {
                        ele.append(`<option value=""></option>`);
                        data.price_list.map(function (item) {
                            let dataStr = JSON.stringify(item).replace(/"/g, "&quot;");
                            ele.append(`<option value="${item.id}">
                                        <span class="opp-title">${item.title}</span>
                                        <input type="hidden" class="data-info" value="${dataStr}">
                                    </option>`)
                        })
                    }
                }
            }
        )
    }

    static loadInitQuotationProduct() {
        let ele = $('#data-init-quotation-create-tables-product');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax2({
                'url': url,
                'method': method,
                'isDropdown': true,
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('product_sale_list') && Array.isArray(data.product_sale_list)) {
                        ele.val(JSON.stringify(data.product_sale_list))
                    }
                }
            }
        )
    }

    static loadBoxQuotationProduct(box_id, valueToSelect = null) {
        let self = this;
        let ele = document.getElementById('data-init-quotation-create-tables-product');
        let jqueryId = '#' + box_id;
        let eleBox = $(jqueryId);
        if (ele && eleBox) {
            let linkDetail = ele.getAttribute('data-link-detail');
            eleBox.attr('data-link-detail', linkDetail);
            let data = JSON.parse(ele.value);
            eleBox.empty();
            eleBox.append(`<option value=""></option>`);
            for (let i = 0; i < data.length; i++) {
                let uom_title = "";
                let default_uom = {};
                let uom_group = {};
                let tax_code = {};
                if (Object.keys(data[i].sale_information).length !== 0) {
                    if (Object.keys(data[i].sale_information.default_uom).length !== 0) {
                        uom_title = data[i].sale_information.default_uom.title
                    }
                    default_uom = data[i].sale_information.default_uom;
                    tax_code = data[i].sale_information.tax_code;
                }
                if (Object.keys(data[i].general_information).length !== 0) {
                    uom_group = data[i].general_information.uom_group;
                }
                let dataStr = JSON.stringify({
                    'id': data[i].id,
                    'title': data[i].title,
                    'code': data[i].code,
                    'unit of measure': uom_title,
                }).replace(/"/g, "&quot;");
                let product_data = JSON.stringify({
                    'id': data[i].id,
                    'title': data[i].title,
                    'code': data[i].code,
                    'unit_of_measure': default_uom,
                    'uom_group': uom_group,
                    'price_list': data[i].price_list,
                    'cost_price': data[i].cost_price,
                    'tax': tax_code,
                }).replace(/"/g, "&quot;");
                let option = `<option value="${data[i].id}">
                                <span class="product-title">${data[i].title}</span>
                                <input type="hidden" class="data-default" value="${product_data}">
                                <input type="hidden" class="data-info" value="${dataStr}">
                            </option>`
                if (valueToSelect && valueToSelect === data[i].id) {
                    option = `<option value="${data[i].id}" selected>
                                <span class="product-title">${data[i].title}</span>
                                <input type="hidden" class="data-default" value="${product_data}">
                                <input type="hidden" class="data-info" value="${dataStr}">
                            </option>`
                }
                eleBox.append(option);
            }
            // load data information
            self.loadInformationSelectBox(eleBox);
        }
    }

    static loadInitQuotationUOM() {
        let ele = $('#data-init-quotation-create-tables-uom');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax2({
                'url': url,
                'method': method,
                'isDropdown': true,
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('unit_of_measure') && Array.isArray(data.unit_of_measure)) {
                        ele.val(JSON.stringify(data.unit_of_measure))
                    }
                }
            }
        )
    }

    static loadBoxQuotationUOM(box_id, valueToSelect = null, uom_group = null) {
        let ele = document.getElementById('data-init-quotation-create-tables-uom');
        let jqueryId = '#' + box_id;
        let eleBox = $(jqueryId);
        if (ele && eleBox && uom_group) {
            let data = JSON.parse(ele.value);
            let optionSelected = ``;
            eleBox.empty();
            eleBox.append(`<option value=""></option>`);
            for (let i = 0; i < data.length; i++) {
                // check uom_group with product
                if (data[i].group.id === uom_group) {
                    let dataStr = JSON.stringify({
                        'id': data[i].id,
                        'title': data[i].title,
                        'code': data[i].code,
                    }).replace(/"/g, "&quot;");
                    let option = `<option value="${data[i].id}">
                                    <span class="uom-title">${data[i].title}</span>
                                    <input type="hidden" class="data-info" value="${dataStr}">
                                </option>`
                    if (valueToSelect && valueToSelect === data[i].id) {
                        // optionSelected = `<option value="${data[i].id}" selected>
                        //             <span class="uom-title">${data[i].title}</span>
                        //             <input type="hidden" class="data-info" value="${dataStr}">
                        //         </option>`
                        option = `<option value="${data[i].id}" selected>
                                    <span class="uom-title">${data[i].title}</span>
                                    <input type="hidden" class="data-info" value="${dataStr}">
                                </option>`
                    }
                    eleBox.append(option);
                }
            }
            // check if option selected
            // if (optionSelected) {
            //     eleBox.empty();
            //     eleBox.append(`<option value=""></option>`);
            //     eleBox.append(optionSelected);
            // }
        }
    }

    static loadInitQuotationTax() {
        let ele = $('#data-init-quotation-create-tables-tax');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax2({
                'url': url,
                'method': method,
                'isDropdown': true,
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('tax_list') && Array.isArray(data.tax_list)) {
                        ele.val(JSON.stringify(data.tax_list))
                    }
                }
            }
        )
    }

    static loadBoxQuotationTax(box_id, valueToSelect = null) {
        let ele = document.getElementById('data-init-quotation-create-tables-tax');
        let jqueryId = '#' + box_id;
        let eleBox = $(jqueryId);
        if (ele && eleBox) {
            let data = JSON.parse(ele.value);
            eleBox.empty();
            eleBox.append(`<option value="" data-value="0">0 %</option>`);
            for (let i = 0; i < data.length; i++) {
                let dataStr = JSON.stringify({
                    'id': data[i].id,
                    'title': data[i].title,
                    'value': data[i].rate,
                }).replace(/"/g, "&quot;");
                let option = `<option value="${data[i].id}" data-value="${data[i].rate}">
                                <span class="tax-title">${data[i].rate} %</span>
                                <input type="hidden" class="data-info" value="${dataStr}">
                            </option>`
                if (valueToSelect && valueToSelect === data[i].id) {
                    option = `<option value="${data[i].id}" data-value="${data[i].rate}" selected>
                                <span class="tax-title">${data[i].rate} %</span>
                                <input type="hidden" class="data-info" value="${dataStr}">
                            </option>`
                }
                eleBox.append(option)
            }
        }
    }

    static loadInitQuotationExpense() {
        let ele = $('#data-init-quotation-create-tables-expense');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax2({
                'url': url,
                'method': method,
                'isDropdown': true,
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('expense_sale_list') && Array.isArray(data.expense_sale_list)) {
                        ele.val(JSON.stringify(data.expense_sale_list))
                    }
                }
            }
        )
    }

    static loadBoxQuotationExpense(box_id, valueToSelect = null) {
        let self = this;
        let ele = document.getElementById('data-init-quotation-create-tables-expense');
        let jqueryId = '#' + box_id;
        let eleBox = $(jqueryId);
        if (ele && eleBox) {
            let linkDetail = ele.getAttribute('data-link-detail');
            eleBox.attr('data-link-detail', linkDetail);
            let data = JSON.parse(ele.value);
            eleBox.empty();
            for (let i = 0; i < data.length; i++) {
                let uom_title = "";
                let expense_type_title = "";
                let expense_type = {};
                let default_uom = {};
                let uom_group = {};
                let tax_code = {};
                let price_list = [];
                if (Object.keys(data[i].uom).length !== 0) {
                    uom_title = data[i].uom.title
                }
                if (Object.keys(data[i].expense_type).length !== 0) {
                    expense_type = data[i].expense_type;
                    expense_type_title = data[i].expense_type.title;
                }
                default_uom = data[i].uom;
                tax_code = data[i].tax_code;
                price_list = data[i].price_list;
                uom_group = data[i].uom_group;
                let dataStr = JSON.stringify({
                    'id': data[i].id,
                    'title': data[i].title,
                    'code': data[i].code,
                    'unit of measure': uom_title,
                    'expense type': expense_type_title,
                    'is_product': false,
                }).replace(/"/g, "&quot;");
                let expense_data = JSON.stringify({
                    'id': data[i].id,
                    'title': data[i].title,
                    'code': data[i].code,
                    'expense_type': expense_type,
                    'unit_of_measure': default_uom,
                    'uom_group': uom_group,
                    'price_list': price_list,
                    'tax': tax_code,
                }).replace(/"/g, "&quot;");
                let option = `<button type="button" class="btn btn-white dropdown-item table-row-expense-option" data-value="${data[i].id}">
                                <div class="float-left"><span class="expense-title">${data[i].title}</span></div>
                                <input type="hidden" class="data-default" value="${expense_data}">
                                <input type="hidden" class="data-info" value="${dataStr}">
                            </button>`
                if (valueToSelect && valueToSelect === data[i].id) {
                    option = `<button type="button" class="btn btn-white dropdown-item table-row-expense-option option-btn-checked" data-value="${data[i].id}">
                                <div class="float-left"><span class="expense-title">${data[i].title}</span></div>
                                <input type="hidden" class="data-default" value="${expense_data}">
                                <input type="hidden" class="data-info" value="${dataStr}">
                            </button>`
                }
                eleBox.append(option);
            }
            // load data information
            self.loadInformationSelectBox(eleBox, true);
        }
    }

    static loadBoxQuotationProductPurchasing(box_id, valueToSelect = null) {
        let self = this;
        let ele = document.getElementById('data-init-quotation-create-tables-product');
        let jqueryId = '#' + box_id;
        let eleBox = $(jqueryId);
        if (ele && eleBox) {
            let linkDetail = ele.getAttribute('data-link-detail');
            eleBox.attr('data-link-detail', linkDetail);
            let data = JSON.parse(ele.value);
            for (let i = 0; i < data.length; i++) {
                if (Array.isArray(data[i].product_choice)) {
                    if (data[i].product_choice.includes(2)) {
                        let uom_title = "";
                        let default_uom = {};
                        let uom_group = {};
                        let tax_code = {};
                        if (Object.keys(data[i].sale_information).length !== 0) {
                            if (Object.keys(data[i].sale_information.default_uom).length !== 0) {
                                uom_title = data[i].sale_information.default_uom.title
                            }
                            default_uom = data[i].sale_information.default_uom;
                            tax_code = data[i].sale_information.tax_code;
                        }
                        if (Object.keys(data[i].general_information).length !== 0) {
                            uom_group = data[i].general_information.uom_group;
                        }
                        let dataStr = JSON.stringify({
                            'id': data[i].id,
                            'title': data[i].title,
                            'code': data[i].code,
                            'unit of measure': uom_title,
                            'is_product': true,
                        }).replace(/"/g, "&quot;");
                        let product_data = JSON.stringify({
                            'id': data[i].id,
                            'title': data[i].title,
                            'code': data[i].code,
                            'unit_of_measure': default_uom,
                            'uom_group': uom_group,
                            'price_list': data[i].price_list,
                            'cost_price': data[i].cost_price,
                            'tax': tax_code,
                        }).replace(/"/g, "&quot;");
                        let option = `<button type="button" class="btn btn-white dropdown-item table-row-expense-option" data-value="${data[i].id}">
                                        <div class="float-left"><span class="expense-title">${data[i].title}</span></div>
                                        <input type="hidden" class="data-default" value="${product_data}">
                                        <input type="hidden" class="data-info" value="${dataStr}">
                                    </button>`
                        if (valueToSelect && valueToSelect === data[i].id) {
                            option = `<button type="button" class="btn btn-white dropdown-item table-row-expense-option option-btn-checked" data-value="${data[i].id}">
                                        <div class="float-left"><span class="expense-title">${data[i].title}</span></div>
                                        <input type="hidden" class="data-default" value="${product_data}">
                                        <input type="hidden" class="data-info" value="${dataStr}">
                                    </button>`
                        }
                        eleBox.append(option);
                    }
                }
            }
            // load data information
            self.loadInformationSelectBox(eleBox, true);
        }
    }

    static loadDataProductSelect(ele, is_change_item = true, is_expense = false) {
        let self = this;
        let optionSelected = null;
        if (is_expense === false) { // PRODUCT
            optionSelected = ele[0].options[ele[0].selectedIndex];
        } else { // EXPENSE
            optionSelected = ele[0].querySelector('.option-btn-checked');
        }
        let productData = optionSelected.querySelector('.data-default');
        if (productData) {
            let data = JSON.parse(productData.value);
            let uom = ele[0].closest('tr').querySelector('.table-row-uom');
            let price = ele[0].closest('tr').querySelector('.table-row-price');
            let priceList = ele[0].closest('tr').querySelector('.table-row-price-list');
            let tax = ele[0].closest('tr').querySelector('.table-row-tax');
            // load UOM
            if (uom && Object.keys(data.unit_of_measure).length !== 0 && Object.keys(data.uom_group).length !== 0) {
                self.loadBoxQuotationUOM(uom.id, data.unit_of_measure.id, data.uom_group.id);
            } else {
                self.loadBoxQuotationUOM(uom.id);
            }
            // load PRICE
            if (price && priceList) {
                loadPriceProduct(ele[0], is_change_item, is_expense);
            }
            // load TAX
            if (tax && data.tax) {
                self.loadBoxQuotationTax(tax.id, data.tax.id);
            } else {
                self.loadBoxQuotationTax(tax.id);
            }
            // load modal more information
            self.loadInformationSelectBox(ele, is_expense);
        }
        $.fn.initMaskMoney2();
    }

    static loadInformationSelectBox(ele, is_expense = false) {
        let optionSelected = null;
        let dropdownContent = null;
        let eleInfo = null;
        if (is_expense === false) { // Normal dropdown
            optionSelected = ele[0].options[ele[0].selectedIndex];
            eleInfo = ele[0].closest('.input-affix-wrapper').querySelector('.fa-info-circle');
            let inputWrapper = ele[0].closest('.input-affix-wrapper');
            dropdownContent = inputWrapper.querySelector('.dropdown-menu');
        } else { // Expense dropdown
            optionSelected = ele[0].querySelector('.option-btn-checked');
            eleInfo = ele[0].closest('.dropdown-expense').querySelector('.fa-info-circle');
            dropdownContent = ele[0].closest('.dropdown-expense').querySelector('.expense-more-info');
        }
        dropdownContent.innerHTML = ``;
        eleInfo.setAttribute('disabled', true);
        let link = "";
        if (optionSelected) {
            let eleData = optionSelected.querySelector('.data-info');
            if (eleData) {
                // remove attr disabled
                if (eleInfo) {
                    eleInfo.removeAttribute('disabled');
                }
                // end
                let data = JSON.parse(eleData.value);
                let info = ``;
                info += `<h6 class="dropdown-header header-wth-bg">${$.fn.transEle.attr('data-more-information')}</h6>`;
                for (let key in data) {
                    if (key === 'id') {
                        let linkDetail = ele.data('link-detail');
                        if (linkDetail) {
                            link = linkDetail.format_url_with_uuid(data[key]);
                        }
                    } else {
                        info += `<div class="row mb-1"><h6><i>${key}</i></h6><p>${data[key]}</p></div>`;
                    }
                }
                info += `<div class="dropdown-divider"></div>
                    <div class="row float-right">
                        <a href="${link}" target="_blank" class="link-primary underline_hover">
                            <span><span>${$.fn.transEle.attr('data-view-detail-info')}</span><span class="icon ml-1"><span class="feather-icon"><i class="fas fa-arrow-circle-right"></i></span></span></span>
                        </a>
                    </div>`;
                dropdownContent.innerHTML = info;
            }
        }
    }

    static loadShippingBillingCustomer(item = null) {
        let modalShippingContent = $('#quotation-create-modal-shipping-body')[0].querySelector('.modal-body');
        if (modalShippingContent) {
            $(modalShippingContent).empty();
            if (item) {
                for (let i = 0; i < item.shipping_address.length; i++) {
                    let shipping = item.shipping_address[i];
                    $(modalShippingContent).append(`<div class="row ml-1 shipping-group">
                                                    <div class="row mb-1">
                                                        <textarea class="form-control show-not-edit shipping-content disabled-custom-show" rows="3" cols="50" id="${shipping.id}" disabled>${shipping.full_address}</textarea>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-5"></div>
                                                        <div class="col-4"></div>
                                                        <div class="col-3 float-right">
                                                            <button type="button" class="btn btn-primary choose-shipping" data-bs-dismiss="modal" id="${shipping.id}" data-address="${shipping.full_address}">${$.fn.transEle.attr('data-select-address')}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <br>`)
                }
            }
        }
        let modalBillingContent = $('#quotation-create-modal-billing-body')[0].querySelector('.modal-body');
        if (modalBillingContent) {
            $(modalBillingContent).empty();
            if (item) {
                for (let i = 0; i < item.billing_address.length; i++) {
                    let billing = item.billing_address[i];
                    $(modalBillingContent).append(`<div class="row ml-1 billing-group">
                                                    <div class="row mb-1">
                                                        <textarea class="form-control show-not-edit billing-content disabled-custom-show" rows="3" cols="50" id="${billing.id}" disabled>${billing.full_address}</textarea>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-5"></div>
                                                        <div class="col-4"></div>
                                                        <div class="col-3">
                                                            <button type="button" class="btn btn-primary choose-billing" data-bs-dismiss="modal" id="${billing.id}" data-address="${billing.full_address}">${$.fn.transEle.attr('data-select-address')}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <br>`)
                }
            }
        }
    }

    static loadBoxSaleOrderQuotation(quotation_id, valueToSelect = null, opp_id = null, sale_person_id = null) {
        let self = this;
        let jqueryId = '#' + quotation_id;
        let ele = $(jqueryId);
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        if (sale_person_id) {
            let data_filter = {'sale_person': sale_person_id};
            if (opp_id) {
                data_filter = {
                    'sale_person': sale_person_id,
                    'opportunity': opp_id
                }
            }
            $.fn.callAjax(url, method, data_filter).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        ele.empty();
                        if (data.hasOwnProperty('quotation_list') && Array.isArray(data.quotation_list)) {
                            ele.append(`<option value=""></option>`);
                            data.quotation_list.map(function (item) {
                                let dataStr = JSON.stringify({
                                    'id': item.id,
                                    'title': item.title,
                                    'code': item.code,
                                }).replace(/"/g, "&quot;");
                                let option = `<option value="${item.id}">
                                            <span class="quotation-title">${item.title}</span>
                                            <input type="hidden" class="data-info" value="${dataStr}">
                                        </option>`
                                if (valueToSelect && valueToSelect === item.id) {
                                    option = `<option value="${item.id}" selected>
                                            <span class="quotation-title">${item.title}</span>
                                            <input type="hidden" class="data-info" value="${dataStr}">
                                        </option>`
                                }
                                ele.append(option)
                            });
                            self.loadInformationSelectBox(ele);
                        }
                    }
                }
            )
        }
    }

    static loadAPIDetailQuotation(quotation_id, select_id) {
        let jqueryId = '#' + quotation_id;
        let ele = $(jqueryId);
        let url = ele.attr('data-url-detail').format_url_with_uuid(select_id);
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $('#data-copy-quotation-detail').val(JSON.stringify(data))
                }
            }
        )
    }

    static loadTotal(data, is_product, is_cost, is_expense) {
        let pretax = null;
        let tax = null;
        let total = null;
        let discount = null;
        let pretaxRaw = null;
        let taxRaw = null;
        let totalRaw = null;
        let discountRaw = null;
        if (is_product === true) {
            pretax = document.getElementById('quotation-create-product-pretax-amount');
            tax = document.getElementById('quotation-create-product-taxes');
            total = document.getElementById('quotation-create-product-total');
            discount = document.getElementById('quotation-create-product-discount-amount');
            pretaxRaw = document.getElementById('quotation-create-product-pretax-amount-raw');
            taxRaw = document.getElementById('quotation-create-product-taxes-raw');
            totalRaw = document.getElementById('quotation-create-product-total-raw');
            discountRaw = document.getElementById('quotation-create-product-discount-amount-raw');
        } else if (is_cost === true) {
            pretax = document.getElementById('quotation-create-cost-pretax-amount');
            tax = document.getElementById('quotation-create-cost-taxes');
            total = document.getElementById('quotation-create-cost-total');
            pretaxRaw = document.getElementById('quotation-create-cost-pretax-amount-raw');
            taxRaw = document.getElementById('quotation-create-cost-taxes-raw');
            totalRaw = document.getElementById('quotation-create-cost-total-raw');
        } else if (is_expense === true) {
            pretax = document.getElementById('quotation-create-expense-pretax-amount');
            tax = document.getElementById('quotation-create-expense-taxes');
            total = document.getElementById('quotation-create-expense-total');
            pretaxRaw = document.getElementById('quotation-create-expense-pretax-amount-raw');
            taxRaw = document.getElementById('quotation-create-expense-taxes-raw');
            totalRaw = document.getElementById('quotation-create-expense-total-raw');
        }
        if (pretax && tax && total) {
            if (is_product === true) {
                $(pretax).attr('data-init-money', String(data.total_product_pretax_amount));
                pretaxRaw.value = data.total_product_pretax_amount
            } else if (is_cost === true) {
                $(pretax).attr('data-init-money', String(data.total_cost_pretax_amount));
                pretaxRaw.value = data.total_cost_pretax_amount
            } else if (is_expense === true) {
                $(pretax).attr('data-init-money', String(data.total_expense_pretax_amount));
                pretaxRaw.value = data.total_expense_pretax_amount
            }
            let discountRate = document.getElementById('quotation-create-product-discount');
            if (discount && discountRate) {
                $(discount).attr('data-init-money', String(data.total_product_discount));
                discountRaw.value = data.total_product_discount;
                discountRate.value = data.total_product_discount_rate
            }
            if (is_product === true) {
                $(tax).attr('data-init-money', String(data.total_product_tax));
                taxRaw.value = data.total_product_tax
            } else if (is_cost === true) {
                $(tax).attr('data-init-money', String(data.total_cost_tax));
                taxRaw.value = data.total_cost_tax
            } else if (is_expense === true) {
                $(tax).attr('data-init-money', String(data.total_expense_tax));
                taxRaw.value = data.total_expense_tax
            }
            if (is_product === true) {
                $(total).attr('data-init-money', String(data.total_product));
                totalRaw.value = data.total_product
            } else if (is_cost === true) {
                $(total).attr('data-init-money', String(data.total_cost));
                totalRaw.value = data.total_cost
            } else if (is_expense === true) {
                $(total).attr('data-init-money', String(data.total_expense));
                totalRaw.value = data.total_expense
            }
            // load total revenue before tax for tab product
            finalRevenueBeforeTax.value = data.total_product_revenue_before_tax;
        }
    }

    static loadDetailQuotation(data, is_copy = false) {
        let self = this;
        if (data.title && is_copy === false) {
            document.getElementById('quotation-create-title').value = data.title;
        }
        if (data.code) {
            if ($('#quotation-create-code').length) {
                document.getElementById('quotation-create-code').value = data.code;
            }
        }
        if (data.opportunity) {
            if (data.sale_person) {
                self.loadBoxQuotationOpportunity(data.opportunity, data.sale_person.id, true, is_copy);
            } else {
                self.loadBoxQuotationOpportunity(data.opportunity, null, true, is_copy);
            }
        }
        if (data.customer) {
            if (data.sale_person) {
                self.loadBoxQuotationCustomer(data.customer.id, data.sale_person.id, true);
            } else {
                self.loadBoxQuotationCustomer(data.customer.id, null, true);
            }
        }
        // if (data.contact) {
        //     self.loadBoxQuotationContact(data.contact.id, data.customer.id)
        // }
        if (data.sale_person) {
            self.loadBoxQuotationSalePerson(data.sale_person.id)
        }
        // if (data.payment_term) {
        //     self.loadBoxQuotationPaymentTerm(data.payment_term.id)
        // }
        if (data.quotation && data.sale_person) {
            self.loadBoxSaleOrderQuotation('select-box-quotation', data.quotation.id, null, data.sale_person.id)
        }
        if (data.date_created) {
            $('#quotation-create-date-created').val(moment(data.date_created).format('MM/DD/YYYY'));
        }
        if (data.is_customer_confirm && is_copy === false) {
            $('#quotation-customer-confirm')[0].checked = data.is_customer_confirm;
        }
        if (data.system_status) {
            let data_status = {
                'Draft': 0,
                'Created': 1,
                'Added': 2,
                'Finish': 3,
                'Cancel': 4,
            }
            let css_status = {
                'Draft': 'status-draft',
                'Created': 'status-created',
                'Added': 'status-added',
                'Finish': 'status-finish',
                'Cancel': 'status-cancel',
            }
            let eleStatus = $('#quotation-create-status');
            eleStatus.val(data.system_status);
            eleStatus[0].setAttribute('data-value', data_status[data.system_status]);
            eleStatus[0].className = '';
            eleStatus[0].classList.add('form-control');
            eleStatus[0].classList.add(css_status[data.system_status]);
        }
        if (is_copy === true) {
            let boxQuotation = $('#select-box-quotation');
            let dataStr = JSON.stringify({
                'id': data.id,
                'title': data.title,
                'code': data.code,
            }).replace(/"/g, "&quot;");
            boxQuotation.append(`<option value="${data.id}" selected>
                                    <span class="quotation-title">${data.title}</span>
                                    <input type="hidden" class="data-info" value="${dataStr}">
                                </option>`)
            self.loadInformationSelectBox(boxQuotation);
        }
        if (data.quotation_logistic_data) {
            document.getElementById('quotation-create-shipping-address').value = data.quotation_logistic_data.shipping_address;
            document.getElementById('quotation-create-billing-address').value = data.quotation_logistic_data.billing_address;
        } else if (data.sale_order_logistic_data) {
            document.getElementById('quotation-create-shipping-address').value = data.sale_order_logistic_data.shipping_address;
            document.getElementById('quotation-create-billing-address').value = data.sale_order_logistic_data.billing_address;
        }
        $('#quotation-create-customer-shipping').val(data.customer_shipping_id);
        $('#quotation-create-customer-billing').val(data.customer_billing_id);
        // product totals
        self.loadTotal(data, true, false, false);
        self.loadTotal(data, false, true, false);
        self.loadTotal(data, false, false, true);
    }

    static loadDataProductAll() {
        let table = document.getElementById('datable-quotation-create-product');
        for (let i = 0; i < table.tBodies[0].rows.length; i++) {
            let row = table.tBodies[0].rows[i];
            let eleItem = row.querySelector('.table-row-item');
            if (eleItem) {
                loadPriceProduct(eleItem);
                // Re Calculate all data of rows & total
                QuotationCalculateCaseHandle.commonCalculate($(table), row, true, false, false);
            }
        }
    }

    static loadInitQuotationConfig(config_id, page_method) {
        let jqueryId = '#' + config_id;
        let ele = $(jqueryId);
        if (ele.hasClass('quotation-config')) {
            let url = ele.attr('data-url');
            let method = ele.attr('data-method');
            $.fn.callAjax(url, method).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        ele.val(JSON.stringify(data));
                        // check config first time
                        if (page_method === "POST" && !$('#data-init-quotation-copy-to').val()) {
                            configClass.checkConfig(true, null, true);
                        }
                    }
                }
            )
        }
    }

    static loadDataTablesAndDropDowns(data) {
        let self = this;
        self.loadDataTables(data);
        self.loadDropDowns();
        return true;
    };

    static loadDataTables(data, is_detail = false) {
        let self = this;
        let tableProduct = $('#datable-quotation-create-product');
        let tableCost = $('#datable-quotation-create-cost');
        let tableExpense = $('#datable-quotation-create-expense');
        let products_data = data.quotation_products_data;
        let costs_data = data.quotation_costs_data;
        let expenses_data = data.quotation_expenses_data;
        if (data.hasOwnProperty('sale_order_products_data') && data.hasOwnProperty('sale_order_costs_data') && data.hasOwnProperty('sale_order_expenses_data')) {
            products_data = data.sale_order_products_data;
            costs_data = data.sale_order_costs_data;
            expenses_data = data.sale_order_expenses_data;
        }
        tableProduct.DataTable().clear().destroy();
        tableCost.DataTable().clear().destroy();
        tableExpense.DataTable().clear().destroy();
        QuotationDataTableHandle.dataTableProduct();
        QuotationDataTableHandle.dataTableCost();
        QuotationDataTableHandle.dataTableExpense();
        tableProduct.DataTable().rows.add(products_data).draw();
        tableCost.DataTable().rows.add(costs_data).draw();
        tableExpense.DataTable().rows.add(expenses_data).draw();
        //
        if (is_detail === true) {
            self.loadTableDisabled(tableProduct);
            self.loadTableDisabled(tableCost);
            self.loadTableDisabled(tableExpense);
            // mask money
            $.fn.initMaskMoney2();
        }
    };

    static loadDropDowns() {
        let self = this;
        let tableProduct = $('#datable-quotation-create-product');
        let tableCost = $('#datable-quotation-create-cost');
        let tableExpense = $('#datable-quotation-create-expense');
        for (let i = 0; i < tableProduct[0].tBodies[0].rows.length; i++) {
            let row = tableProduct[0].tBodies[0].rows[i];
            if (row.querySelector('.table-row-item')) {
                self.loadBoxQuotationProduct(row.querySelector('.table-row-item').id, row.querySelector('.table-row-item').value);
                // check expense selected to get uom group filter uom data
                let optionSelected = row.querySelector('.table-row-item').options[row.querySelector('.table-row-item').selectedIndex];
                if (optionSelected) {
                    if (optionSelected.querySelector('.data-default')) {
                        let product_data_json = JSON.parse(optionSelected.querySelector('.data-default').value);
                        self.loadBoxQuotationUOM(row.querySelector('.table-row-uom').id, row.querySelector('.table-row-uom').value, product_data_json.uom_group.id);
                    }
                }
                self.loadBoxQuotationTax(row.querySelector('.table-row-tax').id, row.querySelector('.table-row-tax').value);
            }
        }
        for (let i = 0; i < tableCost[0].tBodies[0].rows.length; i++) {
            let row = tableCost[0].tBodies[0].rows[i];
            if (row.querySelector('.table-row-item')) {
                self.loadBoxQuotationProduct(row.querySelector('.table-row-item').id, row.querySelector('.table-row-item').value);
                // check expense selected to get uom group filter uom data
                let optionSelected = row.querySelector('.table-row-item').options[row.querySelector('.table-row-item').selectedIndex];
                if (optionSelected) {
                    if (optionSelected.querySelector('.data-default')) {
                        let product_data_json = JSON.parse(optionSelected.querySelector('.data-default').value);
                        self.loadBoxQuotationUOM(row.querySelector('.table-row-uom').id, row.querySelector('.table-row-uom').value, product_data_json.uom_group.id);
                    }
                }
                self.loadBoxQuotationTax(row.querySelector('.table-row-tax').id, row.querySelector('.table-row-tax').value);
            }
        }
        for (let i = 0; i < tableExpense[0].tBodies[0].rows.length; i++) {
            let row = tableExpense[0].tBodies[0].rows[i];
            if (row.querySelector('.table-row-item')) {
                self.loadBoxQuotationExpense(row.querySelector('.expense-option-list').id, row.querySelector('.table-row-item').getAttribute('data-value'));
                self.loadBoxQuotationProductPurchasing(row.querySelector('.expense-option-list').id, row.querySelector('.table-row-item').getAttribute('data-value'));
                // check expense selected to get uom group filter uom data
                let optionSelected = row.querySelector('.expense-option-list').querySelector('.option-btn-checked');
                if (optionSelected) {
                    if (optionSelected.querySelector('.data-default')) {
                        let product_data_json = JSON.parse(optionSelected.querySelector('.data-default').value);
                        self.loadBoxQuotationUOM(row.querySelector('.table-row-uom').id, row.querySelector('.table-row-uom').value, product_data_json.uom_group.id);
                    }
                }
                self.loadBoxQuotationTax(row.querySelector('.table-row-tax').id, row.querySelector('.table-row-tax').value);
            }
        }
    };

    static loadTableDisabled(table) {
        for (let ele of table[0].querySelectorAll('.table-row-item')) {
            ele.setAttribute('disabled', 'true');
            ele.classList.add('disabled-but-edit');
        }
        for (let ele of table[0].querySelectorAll('.table-row-description')) {
            ele.setAttribute('disabled', 'true');
            ele.classList.add('disabled-but-edit');
        }
        for (let ele of table[0].querySelectorAll('.table-row-uom')) {
            ele.setAttribute('disabled', 'true');
            ele.classList.add('disabled-but-edit');
        }
        for (let ele of table[0].querySelectorAll('.table-row-quantity')) {
            ele.setAttribute('disabled', 'true');
            ele.classList.add('disabled-but-edit');
        }
        for (let ele of table[0].querySelectorAll('.table-row-price')) {
            ele.setAttribute('disabled', 'true');
            ele.classList.add('disabled-but-edit');
        }
        for (let ele of table[0].querySelectorAll('.table-row-tax')) {
            ele.setAttribute('disabled', 'true');
            ele.classList.add('disabled-but-edit');
        }
    };
}

// DataTable
class QuotationDataTableHandle {
    static productInitEle = $('#data-init-quotation-create-tables-product');

    static dataTableProduct(data, is_load_detail = false) {
        // init dataTable
        let $tables = $('#datable-quotation-create-product');
        $tables.DataTableDefault({
            data: data ? data : [],
            searching: false,
            paging: false,
            ordering: false,
            info: false,
            columnDefs: [],
            drawCallback: function (row, data) {
                // render icon after table callback
                feather.replace();
                $.fn.initMaskMoney2();
            },
            rowCallback: function (row, data, index) {
                // $.fn.initMaskMoney2();
            },
            columns: [
                {
                    targets: 0,
                    width: "3%",
                    render: (data, type, row) => {
                        return `<span class="table-row-order">${row.order}</span>`
                    }
                },
                {
                    targets: 1,
                    width: "20%",
                    render: (data, type, row) => {
                        if (!row.hasOwnProperty('is_promotion') && !row.hasOwnProperty('is_shipping')) {
                            if (is_load_detail === false) {
                                let selectProductID = 'quotation-create-product-box-product-' + String(row.order);
                                return `<div class="row">
                                <div class="input-group">
                                    <span class="input-affix-wrapper">
                                        <span class="input-prefix">
                                            <div class="btn-group dropstart">
                                                <i
                                                    class="fas fa-info-circle"
                                                    data-bs-toggle="dropdown"
                                                    data-dropdown-animation
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                    disabled
                                                >
                                                </i>
                                                <div class="dropdown-menu w-210p mt-4"></div>
                                            </div>
                                        </span>
                                        <select 
                                        class="form-select table-row-item" 
                                        id="${selectProductID}"
                                        data-url="${QuotationDataTableHandle.productInitEle.attr('data-url')}"
                                        data-link-detail="${QuotationDataTableHandle.productInitEle.attr('data-link-detail')}"
                                        data-method="${QuotationDataTableHandle.productInitEle.attr('data-method')}"
                                        data-keyResp="product_sale_list"
                                        required>
                                            <option value="${row.product.id}">${row.product.title}</option>
                                        </select>
                                    </span>
                                </div>
                            </div>`;
                            } else {
                                let selectProductID = 'quotation-create-product-box-product-' + String(row.order);
                                return `<div class="row">
                                <div class="input-group">
                                    <span class="input-affix-wrapper">
                                        <span class="input-prefix">
                                            <div class="btn-group dropstart">
                                                <i
                                                    class="fas fa-info-circle"
                                                    data-bs-toggle="dropdown"
                                                    data-dropdown-animation
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                    disabled
                                                >
                                                </i>
                                                <div class="dropdown-menu w-210p mt-4"></div>
                                            </div>
                                        </span>
                                        <select 
                                        class="form-select table-row-item disabled-but-edit" 
                                        id="${selectProductID}"
                                        required
                                        disabled>
                                            <option value="${row.product.id}">${row.product.title}</option>
                                        </select>
                                    </span>
                                </div>
                            </div>`;
                            }
                        } else if (row.hasOwnProperty('is_promotion')) {
                            let link = "";
                            let linkDetail = $('#data-init-quotation-create-promotion').data('link-detail');
                            if (linkDetail) {
                                link = linkDetail.format_url_with_uuid(row.promotion.id);
                            }
                            return `<div class="row">
                                    <div class="input-group">
                                    <span class="input-affix-wrapper">
                                        <span class="input-prefix">
                                            <a href="${link}" target="_blank">
                                                <i class="fas fa-gift"></i>
                                            </a>
                                        </span>
                                        <input type="text" class="form-control table-row-promotion disabled-custom-show" value="${row.product_title}" data-id="${row.promotion.id}" data-is-promotion-on-row="${row.is_promotion_on_row}" data-id-product="${row.product.id}" data-bs-toggle="tooltip" title="${row.product_title}" disabled>
                                    </span>
                                </div>
                                </div>`;
                        } else if (row.hasOwnProperty('is_shipping')) {
                            let link = "";
                            let linkDetail = $('#data-init-quotation-create-shipping').data('link-detail');
                            if (linkDetail) {
                                link = linkDetail.format_url_with_uuid(row.shipping.id);
                            }
                            let price_margin = "0";
                            if (row.shipping.hasOwnProperty('shipping_price_margin')) {
                                price_margin = row.shipping.shipping_price_margin;
                            }
                            return `<div class="row">
                                    <div class="input-group">
                                    <span class="input-affix-wrapper">
                                        <span class="input-prefix">
                                            <a href="${link}" target="_blank">
                                                <i class="fas fa-shipping-fast"></i>
                                            </a>
                                        </span>
                                        <input type="text" class="form-control table-row-shipping disabled-custom-show" value="${row.product_title}" data-id="${row.shipping.id}" data-shipping-price-margin="${price_margin}" data-bs-toggle="tooltip" title="${row.product_title}" disabled>
                                    </span>
                                </div>
                                </div>`;
                        }
                    }
                },
                {
                    targets: 2,
                    width: "11%",
                    render: (data, type, row) => {
                        if (!row.hasOwnProperty('is_promotion') && !row.hasOwnProperty('is_shipping')) {
                            if (is_load_detail === false) {
                                return `<div class="row">
                                <input type="text" class="form-control table-row-description" value="${row.product_description}">
                            </div>`;
                            } else {
                                return `<div class="row">
                                <input type="text" class="form-control table-row-description disabled-but-edit" value="${row.product_description}" disabled>
                            </div>`;
                            }
                        } else {
                            return `<div class="row">
                                        <input type="text" class="form-control table-row-description disabled-custom-show" value="${row.product_description}" data-bs-toggle="tooltip" title="${row.product_description}" disabled>
                                    </div>`;
                        }
                    }
                },
                {
                    targets: 3,
                    width: "5%",
                    render: (data, type, row) => {
                        if (!row.hasOwnProperty('is_promotion') && !row.hasOwnProperty('is_shipping')) {
                            if (is_load_detail === false) {
                                let selectUOMID = 'quotation-create-product-box-uom-' + String(row.order);
                                return `<div class="row">
                                        <select class="form-select table-row-uom" id="${selectUOMID}" required>
                                            <option value="${row.unit_of_measure.id}">${row.unit_of_measure.title}</option>
                                        </select>
                                    </div>`;
                            } else {
                                let selectUOMID = 'quotation-create-product-box-uom-' + String(row.order);
                                return `<div class="row">
                                        <select class="form-select table-row-uom disabled-but-edit" id="${selectUOMID}" required disabled>
                                            <option value="${row.unit_of_measure.id}">${row.unit_of_measure.title}</option>
                                        </select>
                                    </div>`;
                            }
                        } else {
                            return `<div class="row">
                                        <select class="form-select table-row-uom disabled-custom-show" required disabled>
                                            <option value="${row.unit_of_measure.id}">${row.product_uom_title}</option>
                                        </select>
                                    </div>`;
                        }

                    },
                },
                {
                    targets: 4,
                    width: "5%",
                    render: (data, type, row) => {
                        if (!row.hasOwnProperty('is_promotion') && !row.hasOwnProperty('is_shipping')) {
                            if (is_load_detail === false) {
                                return `<div class="row">
                                <input type="text" class="form-control table-row-quantity validated-number" value="${row.product_quantity}" required>
                            </div>`;
                            } else {
                                return `<div class="row">
                                <input type="text" class="form-control table-row-quantity validated-number disabled-but-edit" value="${row.product_quantity}" required disabled>
                            </div>`;
                            }
                        } else {
                            return `<div class="row">
                                <input type="text" class="form-control table-row-quantity validated-number disabled-custom-show" value="${row.product_quantity}" disabled>
                            </div>`;
                        }
                    }
                },
                {
                    targets: 5,
                    width: "18%",
                    render: (data, type, row) => {
                        if (!row.hasOwnProperty('is_promotion') && !row.hasOwnProperty('is_shipping')) {
                            if (is_load_detail === false) {
                                return `<div class="row">
                                <div class="dropdown">
                                    <div class="input-group dropdown-action" aria-expanded="false" data-bs-toggle="dropdown">
                                    <span class="input-affix-wrapper">
                                        <input 
                                            type="text" 
                                            class="form-control mask-money table-row-price" 
                                            value="${row.product_unit_price}"
                                            data-return-type="number"
                                        >
                                        <span class="input-suffix table-row-btn-dropdown-price-list"><i class="fas fa-angle-down"></i></span>
                                    </span>
                                    </div>
                                    <div role="menu" class="dropdown-menu table-row-price-list w-460p">
                                    <a class="dropdown-item" data-value=""></a>
                                    </div>
                                </div>
                            </div>`;
                            } else {
                                return `<div class="row">
                                <div class="dropdown">
                                    <div class="input-group dropdown-action disabled-but-edit" aria-expanded="false" data-bs-toggle="dropdown" disabled>
                                    <span class="input-affix-wrapper">
                                        <input 
                                            type="text" 
                                            class="form-control mask-money table-row-price disabled-but-edit" 
                                            value="${row.product_unit_price}"
                                            data-return-type="number"
                                            disabled
                                        >
                                        <span class="input-suffix table-row-btn-dropdown-price-list"><i class="fas fa-angle-down"></i></span>
                                    </span>
                                    </div>
                                    <div role="menu" class="dropdown-menu table-row-price-list w-460p">
                                    <a class="dropdown-item" data-value=""></a>
                                    </div>
                                </div>
                            </div>`;
                            }
                        } else {
                            return `<div class="row">
                                <div class="dropdown">
                                    <div class="input-group" aria-expanded="false" data-bs-toggle="dropdown">
                                    <span class="input-affix-wrapper">
                                        <input 
                                            type="text" 
                                            class="form-control mask-money table-row-price disabled-custom-show" 
                                            value="${row.product_unit_price}"
                                            data-return-type="number"
                                            disabled
                                        >
                                        <span class="input-suffix"><i class="fas fa-angle-down"></i></span>
                                    </span>
                                    </div>
                                    <div role="menu" class="dropdown-menu table-row-price-list w-460p">
                                    <a class="dropdown-item" data-value=""></a>
                                    </div>
                                </div>
                            </div>`;
                        }
                    }
                },
                {
                    targets: 6,
                    width: "10%",
                    render: (data, type, row) => {
                        if (!row.hasOwnProperty('is_promotion') && !row.hasOwnProperty('is_shipping')) {
                            if (is_load_detail === false) {
                                return `<div class="row">
                                <div class="input-group">
                                    <span class="input-affix-wrapper">
                                        <input type="text" class="form-control table-row-discount validated-number" value="${row.product_discount_value}">
                                        <span class="input-suffix">%</span>
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    class="form-control mask-money table-row-discount-amount"
                                    data-return-type="number"
                                    hidden
                                >
                            </div>`;
                            } else {
                                return `<div class="row">
                                <div class="input-group">
                                    <span class="input-affix-wrapper">
                                        <input type="text" class="form-control table-row-discount validated-number disabled-but-edit" value="${row.product_discount_value}" disabled>
                                        <span class="input-suffix">%</span>
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    class="form-control mask-money table-row-discount-amount"
                                    data-return-type="number"
                                    hidden
                                >
                            </div>`;
                            }
                        } else {
                            return `<div class="row">
                                <div class="input-group">
                                    <span class="input-affix-wrapper">
                                        <input type="text" class="form-control table-row-discount validated-number disabled-custom-show" value="${row.product_discount_value}" disabled>
                                        <span class="input-suffix">%</span>
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    class="form-control mask-money table-row-discount-amount"
                                    data-return-type="number"
                                    hidden
                                >
                            </div>`;
                        }
                    }
                },
                {
                    targets: 7,
                    width: "10%",
                    render: (data, type, row) => {
                        let selectTaxID = 'quotation-create-product-box-tax-' + String(row.order);
                        let taxID = "";
                        let taxRate = "0";
                        if (row.tax) {
                            taxID = row.tax.id;
                            taxRate = row.tax.value;
                        }
                        if (!row.hasOwnProperty('is_promotion') && !row.hasOwnProperty('is_shipping')) {
                            if (is_load_detail === false) {
                                return `<div class="row">
                                <select class="form-select table-row-tax" id="${selectTaxID}">
                                    <option value="${taxID}" data-value="${taxRate}">${taxRate} %</option>
                                </select>
                                <input
                                    type="text"
                                    class="form-control mask-money table-row-tax-amount"
                                    value="${row.product_tax_amount}"
                                    data-return-type="number"
                                    hidden
                                >
                                <input
                                    type="text"
                                    class="form-control table-row-tax-amount-raw"
                                    value="${row.product_tax_amount}"
                                    hidden
                                >
                            </div>`;
                            } else { // PROMOTION & SHIPPING
                                return `<div class="row">
                                <select class="form-select table-row-tax disabled-but-edit" id="${selectTaxID}" disabled>
                                    <option value="${taxID}" data-value="${taxRate}">${taxRate} %</option>
                                </select>
                                <input
                                    type="text"
                                    class="form-control mask-money table-row-tax-amount"
                                    value="${row.product_tax_amount}"
                                    data-return-type="number"
                                    hidden
                                >
                                <input
                                    type="text"
                                    class="form-control table-row-tax-amount-raw"
                                    value="${row.product_tax_amount}"
                                    hidden
                                >
                            </div>`;
                            }
                        } else {
                            return `<div class="row">
                                <select class="form-select table-row-tax disabled-custom-show" id="${selectTaxID}" disabled>
                                    <option value="${taxID}" data-value="${taxRate}">${taxRate} %</option>
                                </select>
                                <input
                                    type="text"
                                    class="form-control mask-money table-row-tax-amount"
                                    value="${row.product_tax_amount}"
                                    data-return-type="number"
                                    hidden
                                >
                                <input
                                    type="text"
                                    class="form-control table-row-tax-amount-raw"
                                    value="${row.product_tax_amount}"
                                    hidden
                                >
                            </div>`;
                        }
                    }
                },
                {
                    targets: 8,
                    width: "15%",
                    render: (data, type, row) => {
                        return `<div class="row">
                                <span class="mask-money table-row-subtotal" data-init-money="${parseFloat(row.product_subtotal_price)}"></span>
                                <input
                                    type="text"
                                    class="form-control table-row-subtotal-raw"
                                    value="${row.product_subtotal_price}"
                                    hidden
                                >
                            </div>`;
                    }
                },
                {
                    targets: 9,
                    width: "3%",
                    render: () => {
                        if (is_load_detail === false) {
                            return `<button type="button" class="btn btn-icon btn-rounded flush-soft-hover del-row"><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`
                        } else {
                            return `<button type="button" class="btn btn-icon btn-rounded flush-soft-hover del-row disabled-but-edit" disabled><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`
                        }
                    }
                },
            ],
        });

    }

    static dataTableCost(data, is_load_detail = false) {
        // init dataTable
        let $tables = $('#datable-quotation-create-cost');
        $tables.DataTableDefault({
            data: data ? data : [],
            searching: false,
            paging: false,
            ordering: false,
            info: false,
            columnDefs: [],
            drawCallback: function (row, data) {
                // render icon after table callback
                feather.replace();
                $.fn.initMaskMoney2();
            },
            rowCallback: function (row, data) {
                // $.fn.initMaskMoney2();
            },
            columns: [
                {
                    targets: 0,
                    width: "5%",
                    render: (data, type, row) => {
                        return `<span class="table-row-order">${row.order}</span>`
                    }
                },
                {
                    targets: 1,
                    width: "25%",
                    render: (data, type, row) => {
                        if (!row.hasOwnProperty('is_shipping')) {
                            let selectProductID = 'quotation-create-cost-box-product-' + String(row.order);
                        return `<div class="row">
                                <div class="input-group">
                                    <span class="input-affix-wrapper">
                                        <span class="input-prefix">
                                            <div class="btn-group dropstart">
                                                <i
                                                    class="fas fa-info-circle"
                                                    data-bs-toggle="dropdown"
                                                    data-dropdown-animation
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                    disabled
                                                >
                                                </i>
                                                <div class="dropdown-menu w-210p mt-4"></div>
                                            </div>
                                        </span>
                                        <select class="form-select table-row-item disabled-custom-show" id="${selectProductID}" disabled>
                                            <option value="${row.product.id}">${row.product.title}</option>
                                        </select>
                                    </span>
                                </div>
                            </div>`;
                        } else {
                            let link = "";
                            let linkDetail = $('#data-init-quotation-create-shipping').data('link-detail');
                            if (linkDetail) {
                                link = linkDetail.format_url_with_uuid(row.shipping.id);
                            }
                            return `<div class="row">
                                    <div class="input-group">
                                    <span class="input-affix-wrapper">
                                        <span class="input-prefix">
                                            <a href="${link}" target="_blank">
                                                <i class="fas fa-shipping-fast"></i>
                                            </a>
                                        </span>
                                        <input type="text" class="form-control table-row-shipping disabled-custom-show" value="${row.product_title}" data-id="${row.shipping.id}" data-bs-toggle="tooltip" title="${row.product_title}" disabled>
                                    </span>
                                </div>
                                </div>`;
                        }
                    }
                },
                {
                    targets: 2,
                    width: "5%",
                    render: (data, type, row) => {
                        let selectUOMID = 'quotation-create-cost-box-uom-' + String(row.order);
                        return `<div class="row">
                                <select class="form-select table-row-uom disabled-custom-show" id="${selectUOMID}" disabled>
                                    <option value="${row.unit_of_measure.id}">${row.unit_of_measure.title}</option>
                                </select>
                            </div>`;
                    },
                },
                {
                    targets: 3,
                    width: "10%",
                    render: (data, type, row) => {
                        return `<div class="row">
                                <input type="text" class="form-control table-row-quantity disabled-custom-show" value="${row.product_quantity}" disabled>
                            </div>`;
                    }
                },
                {
                    targets: 4,
                    width: "20%",
                    render: (data, type, row) => {
                        if (is_load_detail === false) {
                            return `<div class="row">
                                <input 
                                    type="text" 
                                    class="form-control mask-money table-row-price" 
                                    data-return-type="number"
                                    value="${row.product_cost_price}"
                                    required
                                >
                            </div>`;
                        } else {
                            return `<div class="row">
                                <input 
                                    type="text" 
                                    class="form-control mask-money table-row-price disabled-but-edit" 
                                    data-return-type="number"
                                    value="${row.product_cost_price}"
                                    required
                                    disabled
                                >
                            </div>`;
                        }
                    }
                },
                {
                    targets: 5,
                    width: "10%",
                    render: (data, type, row) => {
                        if (is_load_detail === false) {
                            let selectTaxID = 'quotation-create-cost-box-tax-' + String(row.order);
                            let taxID = "";
                            let taxRate = "";
                            if (row.tax) {
                                taxID = row.tax.id;
                                taxRate = row.tax.value;
                            }
                            return `<div class="row">
                                <select class="form-select table-row-tax" id="${selectTaxID}">
                                    <option value="${taxID}" data-value="${taxRate}">${taxRate} %</option>
                                </select>
                                <input
                                    type="text"
                                    class="form-control mask-money table-row-tax-amount"
                                    value="${row.product_tax_amount}"
                                    data-return-type="number"
                                    hidden
                                >
                                <input
                                    type="text"
                                    class="form-control table-row-tax-amount-raw"
                                    value="${row.product_tax_amount}"
                                    hidden
                                >
                            </div>`;
                        } else {
                            let selectTaxID = 'quotation-create-cost-box-tax-' + String(row.order);
                            let taxID = "";
                            let taxRate = "";
                            if (row.tax) {
                                taxID = row.tax.id;
                                taxRate = row.tax.value;
                            }
                            return `<div class="row">
                                <select class="form-select table-row-tax disabled-but-edit" id="${selectTaxID}" disabled>
                                    <option value="${taxID}" data-value="${taxRate}">${taxRate} %</option>
                                </select>
                                <input
                                    type="text"
                                    class="form-control mask-money table-row-tax-amount"
                                    value="${row.product_tax_amount}"
                                    data-return-type="number"
                                    hidden
                                >
                                <input
                                    type="text"
                                    class="form-control table-row-tax-amount-raw"
                                    value="${row.product_tax_amount}"
                                    hidden
                                >
                            </div>`;
                        }
                    }
                },
                {
                    targets: 6,
                    width: "20%",
                    render: (data, type, row) => {
                        return `<div class="row">
                                <span class="mask-money table-row-subtotal" data-init-money="${parseFloat(row.product_subtotal_price)}"></span>
                                <input
                                    type="text"
                                    class="form-control table-row-subtotal-raw"
                                    value="${row.product_subtotal_price}"
                                    hidden
                                >
                            </div>`;
                    }
                },
                {
                    targets: 7,
                    width: "5%",
                    render: () => {
                        let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-row" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><i class="fa-regular fa-trash-can"></i></span></a>`;
                        return `${bt3}`
                    }
                },
            ],
        });
    }

    static dataTableExpense(data, is_load_detail = false) {
        // init dataTable
        let $tables = $('#datable-quotation-create-expense');
        $tables.DataTableDefault({
            data: data ? data : [],
            searching: false,
            paging: false,
            ordering: false,
            info: false,
            columnDefs: [],
            drawCallback: function (row, data) {
                // render icon after table callback
                feather.replace();
                $.fn.initMaskMoney2();
            },
            rowCallback: function (row, data) {
                // $.fn.initMaskMoney2();
            },
            columns: [
                {
                    targets: 0,
                    width: "5%",
                    render: (data, type, row) => {
                        return `<span class="table-row-order">${row.order}</span>`
                    }
                },
                {
                    targets: 1,
                    width: "25%",
                    render: (data, type, row) => {
                        let selectExpenseID = 'quotation-create-expense-box-expense-' + String(row.order);
                        let checkboxExpenseItemID = 'check-box-expense-item-' + String(row.order);
                        let checkboxPurchaseItemID = 'check-box-purchase-item-' + String(row.order);
                        let data_title = row.expense.title;
                        let data_id = row.expense.id;
                        if (row.is_product === true) {
                            data_title = row.product.title;
                            data_id = row.product.id;
                        }
                        if (is_load_detail === false) {
                            return `<div class="row dropdown-expense">
                                        <div class="input-group">
                                            <span class="input-affix-wrapper">
                                                <span class="input-prefix">
                                                    <div class="btn-group dropdown">
                                                        <i
                                                            class="fas fa-info-circle"
                                                            data-bs-toggle="dropdown"
                                                            data-dropdown-animation
                                                            aria-haspopup="true"
                                                            aria-expanded="false"
                                                            disabled
                                                        >
                                                        </i>
                                                        <div class="dropdown-menu w-210p mt-2 ml-3 expense-more-info"></div>
                                                    </div>
                                                </span>
                                                <div class="dropdown">
                                                    <div class="input-group" aria-expanded="false" data-bs-toggle="dropdown">
                                                        <span class="input-affix-wrapper">
                                                            <input 
                                                                type="text" 
                                                                class="form-control table-row-item disabled-show-normal" 
                                                                value="${data_title}"
                                                                data-value="${data_id}"
                                                                style="padding-left: 38px"
                                                                disabled
                                                            >
                                                            <span class="input-suffix">
                                                                <i class="fas fa-angle-down"></i>
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div role="menu" class="dropdown-menu table-row-item-expense w-360p">
                                                        <div class="row mb-2">
                                                            <div class="col-6">
                                                                <div class="form-check">
                                                                    <input type="checkbox" class="form-check-input checkbox-expense-item" id="${checkboxExpenseItemID}" checked>
                                                                    <label class="form-check-label" for="${checkboxExpenseItemID}">Expense items</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6">
                                                                <div class="form-check">
                                                                    <input type="checkbox" class="form-check-input checkbox-purchasing-item" id="${checkboxPurchaseItemID}" checked>
                                                                    <label class="form-check-label" for="${checkboxPurchaseItemID}">Purchasing items</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div data-bs-spy="scroll" data-bs-smooth-scroll="true" class="h-250p position-relative overflow-y-scroll expense-option-list" id="${selectExpenseID}"></div>
                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                </div>`;
                        } else {
                            return `<div class="row dropdown-expense">
                                        <div class="input-group">
                                            <span class="input-affix-wrapper">
                                                <span class="input-prefix">
                                                    <div class="btn-group dropdown">
                                                        <i
                                                            class="fas fa-info-circle"
                                                            data-bs-toggle="dropdown"
                                                            data-dropdown-animation
                                                            aria-haspopup="true"
                                                            aria-expanded="false"
                                                            disabled
                                                        >
                                                        </i>
                                                        <div class="dropdown-menu w-210p mt-2 ml-3 expense-more-info"></div>
                                                    </div>
                                                </span>
                                                <div class="dropdown">
                                                    <div class="input-group disabled-but-edit" aria-expanded="false" data-bs-toggle="dropdown" disabled>
                                                        <span class="input-affix-wrapper">
                                                            <input 
                                                                type="text" 
                                                                class="form-control table-row-item disabled-show-normal" 
                                                                value="${data_title}"
                                                                data-value="${data_id}"
                                                                style="padding-left: 38px"
                                                                disabled
                                                            >
                                                            <span class="input-suffix">
                                                                <i class="fas fa-angle-down"></i>
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div role="menu" class="dropdown-menu table-row-item-expense w-360p">
                                                        <div class="row mb-2">
                                                            <div class="col-6">
                                                                <div class="form-check">
                                                                    <input type="checkbox" class="form-check-input" id="${checkboxExpenseItemID}" checked>
                                                                    <label class="form-check-label" for="${checkboxExpenseItemID}">Expense items</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6">
                                                                <div class="form-check">
                                                                    <input type="checkbox" class="form-check-input" id="${checkboxPurchaseItemID}" checked>
                                                                    <label class="form-check-label" for="${checkboxPurchaseItemID}">Purchasing items</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div data-bs-spy="scroll" data-bs-smooth-scroll="true" class="h-250p position-relative overflow-y-scroll expense-option-list" id="${selectExpenseID}"></div>
                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                </div>`;
                        }
                    }
                },
                {
                    targets: 2,
                    width: "5%",
                    render: (data, type, row) => {
                        if (is_load_detail === false) {
                            let selectUOMID = 'quotation-create-expense-box-uom-' + String(row.order);
                            return `<div class="row">
                                <select class="form-select table-row-uom" id="${selectUOMID}" required>
                                    <option value="${row.unit_of_measure.id}">${row.unit_of_measure.title}</option>
                                </select>
                            </div>`;
                        } else {
                            let selectUOMID = 'quotation-create-expense-box-uom-' + String(row.order);
                            return `<div class="row">
                                <select class="form-select table-row-uom disabled-but-edit" id="${selectUOMID}" required disabled>
                                    <option value="${row.unit_of_measure.id}">${row.unit_of_measure.title}</option>
                                </select>
                            </div>`;
                        }
                    },
                },
                {
                    targets: 3,
                    width: "10%",
                    render: (data, type, row) => {
                        if (is_load_detail === false) {
                            return `<div class="row">
                                <input type="text" class="form-control table-row-quantity validated-number" value="${row.expense_quantity}" required>
                            </div>`;
                        } else {
                            return `<div class="row">
                                <input type="text" class="form-control table-row-quantity validated-number disabled-but-edit" value="${row.expense_quantity}" required disabled>
                            </div>`;
                        }
                    }
                },
                {
                    targets: 4,
                    width: "20%",
                    render: (data, type, row) => {
                        if (is_load_detail === false) {
                            return `<div class="row">
                                <div class="dropdown">
                                    <div class="input-group dropdown-action" aria-expanded="false" data-bs-toggle="dropdown">
                                    <span class="input-affix-wrapper">
                                        <input 
                                            type="text" 
                                            class="form-control mask-money table-row-price" 
                                            value="${row.expense_price}"
                                            data-return-type="number"
                                        >
                                        <span class="input-suffix table-row-btn-dropdown-price-list"><i class="fas fa-angle-down"></i></span>
                                    </span>
                                    </div>
                                    <div role="menu" class="dropdown-menu table-row-price-list w-460p">
                                    <a class="dropdown-item" data-value=""></a>
                                    </div>
                                </div>
                            </div>`;
                        } else {
                            return `<div class="row">
                                <div class="dropdown">
                                    <div class="input-group dropdown-action" aria-expanded="false" data-bs-toggle="dropdown">
                                    <span class="input-affix-wrapper">
                                        <input 
                                            type="text" 
                                            class="form-control mask-money table-row-price disabled-but-edit" 
                                            value="${row.expense_price}"
                                            data-return-type="number"
                                            disabled
                                        >
                                        <span class="input-suffix table-row-btn-dropdown-price-list"><i class="fas fa-angle-down"></i></span>
                                    </span>
                                    </div>
                                    <div role="menu" class="dropdown-menu table-row-price-list w-460p">
                                    <a class="dropdown-item" data-value=""></a>
                                    </div>
                                </div>
                            </div>`;
                        }
                    }
                },
                {
                    targets: 5,
                    width: "10%",
                    render: (data, type, row) => {
                        if (is_load_detail === false) {
                            let selectTaxID = 'quotation-create-expense-box-tax-' + String(row.order);
                            let taxID = "";
                            let taxRate = "";
                            if (row.tax) {
                                taxID = row.tax.id;
                                taxRate = row.tax.value
                            }
                            return `<div class="row">
                                <select class="form-select table-row-tax" id="${selectTaxID}">
                                    <option value="${taxID}" data-value="${taxRate}">${taxRate} %</option>
                                </select>
                                <input
                                    type="text"
                                    class="form-control mask-money table-row-tax-amount"
                                    value="${row.expense_tax_amount}"
                                    data-return-type="number"
                                    hidden
                                >
                                <input
                                    type="text"
                                    class="form-control table-row-tax-amount-raw"
                                    value="${row.expense_tax_amount}"
                                    hidden
                                >
                            </div>`;
                        } else {
                            let selectTaxID = 'quotation-create-expense-box-tax-' + String(row.order);
                            let taxID = "";
                            let taxRate = "";
                            if (row.tax) {
                                taxID = row.tax.id;
                                taxRate = row.tax.value
                            }
                            return `<div class="row">
                                <select class="form-select table-row-tax disabled-but-edit" id="${selectTaxID}" disabled>
                                    <option value="${taxID}" data-value="${taxRate}">${taxRate} %</option>
                                </select>
                                <input
                                    type="text"
                                    class="form-control mask-money table-row-tax-amount"
                                    value="${row.expense_tax_amount}"
                                    data-return-type="number"
                                    hidden
                                >
                                <input
                                    type="text"
                                    class="form-control table-row-tax-amount-raw"
                                    value="${row.expense_tax_amount}"
                                    hidden
                                >
                            </div>`;
                        }
                    }
                },
                {
                    targets: 6,
                    width: "20%",
                    render: (data, type, row) => {
                        return `<div class="row">
                                <span class="mask-money table-row-subtotal" data-init-money="${parseFloat(row.expense_subtotal_price)}"></span>
                                <input
                                    type="text"
                                    class="form-control table-row-subtotal-raw"
                                    value="${row.expense_subtotal_price}"
                                    hidden
                                >
                            </div>`;
                    }
                },
                {
                    targets: 7,
                    width: "5%",
                    render: () => {
                        if (is_load_detail === false) {
                            return `<button type="button" class="btn btn-icon btn-rounded flush-soft-hover del-row"><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`
                        } else {
                            return `<button type="button" class="btn btn-icon btn-rounded flush-soft-hover del-row disabled-but-edit" disabled><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`
                        }
                    }
                },
            ],
        });
    }

    static dataTablePromotion(data) {
        // init dataTable
        let $tables = $('#datable-quotation-create-promotion');
        $tables.DataTableDefault({
            data: data ? data : [],
            searching: false,
            paging: false,
            ordering: false,
            info: false,
            columnDefs: [],
            drawCallback: function (row, data) {
                // render icon after table callback
                feather.replace();
            },
            rowCallback: function (row, data) {
            },
            columns: [
                {
                    targets: 0,
                    render: (data, type, row, meta) => {
                        return `<span class="table-row-order">${(meta.row + 1)}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-title">${row.title}</span>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        if (row.is_pass === true) {
                            return `<button type="button" class="btn btn-primary apply-promotion" data-promotion-condition="${JSON.stringify(row.condition).replace(/"/g, "&quot;")}" data-promotion-id="${row.id}" data-bs-dismiss="modal">${$.fn.transEle.attr('data-apply')}</button>`;
                        } else {
                            return `<button type="button" class="btn btn-primary apply-promotion" disabled>${$.fn.transEle.attr('data-apply')}</button>`;
                        }
                    },
                }
            ],
        });
    }

    static loadTableQuotationPromotion(promotion_id, customer_id = null, is_submit_check = false) {
        let self = this;
        let jqueryId = '#' + promotion_id;
        let ele = $(jqueryId);
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        let passList = [];
        let failList = [];
        let checkList = [];
        if (customer_id) {
            let data_filter = {
                'customer_type': 0,
                'customers_map_promotion__id': customer_id
            };
            $.fn.callAjax2({
                    'url': url,
                    'method': method,
                    'data': data_filter,
                    'isDropdown': true,
                }
                // url, method, data_filter
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('promotion_check_list') && Array.isArray(data.promotion_check_list)) {
                            $('#datable-quotation-create-promotion').DataTable().destroy();
                            data.promotion_check_list.map(function (item) {
                                if (!checkList.includes(item.id)) {
                                    let check = promotionClass.checkAvailablePromotion(item, customer_id);
                                    if (check.is_pass === true) {
                                        item['is_pass'] = true;
                                        item['condition'] = check.condition;
                                        passList.push(item);
                                    } else {
                                        item['is_pass'] = false;
                                        failList.push(item);
                                        if (is_submit_check === true) { // check again promotion limit when submit
                                            let tableProduct = document.getElementById('datable-quotation-create-product');
                                            let rowPromotion = tableProduct.querySelector('.table-row-promotion');
                                            if (rowPromotion) {
                                                if (item.id === rowPromotion.getAttribute('data-id')) {
                                                    // Delete Promotion Row & ReCalculate Total
                                                    deletePromotionRows($(tableProduct), true, false);
                                                    QuotationCalculateCaseHandle.updateTotal(tableProduct[0], true, false, false);
                                                    return true
                                                } else {
                                                    return true
                                                }
                                            } else {
                                                return true
                                            }
                                        }
                                    }
                                    checkList.push(item.id)
                                }
                            })
                            passList = passList.concat(failList);
                            self.dataTablePromotion(passList);
                        }
                    }
                }
            )
        }
        return true
    }

    static dataTableCopyQuotation(data) {
        // init dataTable
        let $tables = $('#datable-copy-quotation');
        $tables.DataTableDefault({
            data: data ? data : [],
            searching: false,
            paging: false,
            ordering: false,
            info: false,
            columnDefs: [],
            drawCallback: function (row, data) {
                // render icon after table callback
                feather.replace();
            },
            rowCallback: function (row, data) {
            },
            columns: [
                {
                    targets: 0,
                    render: (data, type, row, meta) => {
                        return `<div class="form-check">
                                    <input 
                                        type="checkbox"
                                        class="form-check-input table-row-check"
                                        data-id="${row.id}"
                                    >
                                </div>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-title">${row.title}</span>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-code">${row.code}</span>`
                    },
                }
            ],
        });
    }

    static loadTableCopyQuotation(opp_id = null, sale_person_id = null) {
        let self = this;
        let ele = $('#data-init-copy-quotation');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $('#datable-copy-quotation').DataTable().destroy();
        if (sale_person_id) {
            let data_filter = {'sale_person': sale_person_id};
            if (opp_id) {
                data_filter['opportunity'] = opp_id;
                data_filter['opportunity__sale_order__isnull'] = true;
                data_filter['opportunity__is_close_lost'] = false;
                data_filter['opportunity__is_deal_close'] = false;
            } else {
                data_filter['opportunity__isnull'] = true;
            }
            $.fn.callAjax2({
                    'url': url,
                    'method': method,
                    'data': data_filter,
                    'isDropdown': true,
                }
                // url, method, data_filter
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('quotation_list') && Array.isArray(data.quotation_list)) {
                            self.dataTableCopyQuotation(data.quotation_list);
                        }
                    }
                }
            )
        } else {
            self.dataTableCopyQuotation();
        }
    }

    static dataTableCopyQuotationProduct(data) {
        // init dataTable
        let $tables = $('#datable-copy-quotation-product');
        $tables.DataTableDefault({
            data: data ? data : [],
            searching: false,
            paging: false,
            ordering: false,
            info: false,
            columnDefs: [],
            drawCallback: function (row, data) {
                // render icon after table callback
                feather.replace();
            },
            rowCallback: function (row, data) {
            },
            columns: [
                {
                    targets: 0,
                    render: (data, type, row, meta) => {
                        return `<span class="table-row-order">${(meta.row + 1)}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row, meta) => {
                        return `<div class="form-check">
                                    <input 
                                        type="checkbox"
                                        class="form-check-input table-row-check-product"
                                        data-id="${row.product.id}"
                                    >
                                </div>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-title">${row.product_title}</span>`
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity">${row.product_quantity}</span>`
                    },
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control table-row-quantity-input" value="${row.product_quantity}">`
                    },
                }
            ],
        });
    }

    static dataTableShipping(data) {
        // init dataTable
        let $tables = $('#datable-quotation-create-shipping');
        $tables.DataTableDefault({
            data: data ? data : [],
            searching: false,
            paging: false,
            ordering: false,
            info: false,
            columnDefs: [],
            drawCallback: function (row, data) {
                // render icon after table callback
                feather.replace();
                $.fn.initMaskMoney2();
            },
            rowCallback: function (row, data) {
            },
            columns: [
                {
                    targets: 0,
                    render: (data, type, row, meta) => {
                        return `<span class="table-row-order">${(meta.row + 1)}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-title">${row.title}</span>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        if (row.is_pass === true) {
                            return `<button type="button" class="btn btn-primary apply-shipping" data-shipping-price="${row.final_shipping_price}" data-shipping-price-margin="${row.margin_shipping_price}" data-shipping-id="${row.id}" data-shipping="${JSON.stringify(row.data_shipping).replace(/"/g, "&quot;")}" data-bs-dismiss="modal">Apply</button>`;
                        } else {
                            return `<button type="button" class="btn btn-primary apply-shipping" disabled>Apply</button>`;
                        }
                    },
                }
            ],
        });
    }

    static loadTableQuotationShipping(shipping_id) {
        let self = this;
        let jqueryId = '#' + shipping_id;
        let ele = $(jqueryId);
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        let passList = [];
        let failList = [];
        let checkList = [];
        $.fn.callAjax2({
                'url': url,
                'method': method,
                'isDropdown': true,
            }
            // url, method
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('shipping_check_list') && Array.isArray(data.shipping_check_list)) {
                        $('#datable-quotation-create-shipping').DataTable().destroy();
                        let shippingAddress = $('#quotation-create-shipping-address').val();
                        if (shippingAddress) {
                            data.shipping_check_list.map(function (item) {
                                if (!checkList.includes(item.id)) {
                                    let check = shippingClass.checkAvailableShipping(item, shippingAddress)
                                    if (check.is_pass === true) {
                                        item['is_pass'] = true;
                                        item['final_shipping_price'] = check.final_shipping_price;
                                        item['margin_shipping_price'] = check.margin_shipping_price;
                                        item['data_shipping'] = check.data_shipping;
                                        passList.push(item)
                                    } else {
                                        item['is_pass'] = false;
                                        failList.push(item)
                                    }
                                    checkList.push(item.id)
                                }
                            })
                            passList = passList.concat(failList);
                            self.dataTableShipping(passList);
                        } else {
                            self.dataTableShipping(passList);
                            $.fn.notifyB({description: $.fn.transEle.attr('data-check-if-shipping-address')}, 'failure');
                        }
                    }
                }
            }
        )
    }
}

// Calculate
class QuotationCalculateCaseHandle {
    static updateTotal(table, is_product, is_cost, is_expense) {
        let pretaxAmount = 0;
        let discountAmount = 0;
        let taxAmount = 0;
        let elePretaxAmount = null;
        let eleTaxes = null;
        let eleTotal = null;
        let eleDiscount = null;
        let elePretaxAmountRaw = null;
        let eleTaxesRaw = null;
        let eleTotalRaw = null;
        let eleDiscountRaw = null;
        if (is_product === true) {
            elePretaxAmount = document.getElementById('quotation-create-product-pretax-amount');
            eleTaxes = document.getElementById('quotation-create-product-taxes');
            eleTotal = document.getElementById('quotation-create-product-total');
            eleDiscount = document.getElementById('quotation-create-product-discount-amount');
            elePretaxAmountRaw = document.getElementById('quotation-create-product-pretax-amount-raw');
            eleTaxesRaw = document.getElementById('quotation-create-product-taxes-raw');
            eleTotalRaw = document.getElementById('quotation-create-product-total-raw');
            eleDiscountRaw = document.getElementById('quotation-create-product-discount-amount-raw');
        } else if (is_cost === true) {
            elePretaxAmount = document.getElementById('quotation-create-cost-pretax-amount');
            eleTaxes = document.getElementById('quotation-create-cost-taxes');
            eleTotal = document.getElementById('quotation-create-cost-total');
            elePretaxAmountRaw = document.getElementById('quotation-create-cost-pretax-amount-raw');
            eleTaxesRaw = document.getElementById('quotation-create-cost-taxes-raw');
            eleTotalRaw = document.getElementById('quotation-create-cost-total-raw');
        } else if (is_expense === true) {
            elePretaxAmount = document.getElementById('quotation-create-expense-pretax-amount');
            eleTaxes = document.getElementById('quotation-create-expense-taxes');
            eleTotal = document.getElementById('quotation-create-expense-total');
            elePretaxAmountRaw = document.getElementById('quotation-create-expense-pretax-amount-raw');
            eleTaxesRaw = document.getElementById('quotation-create-expense-taxes-raw');
            eleTotalRaw = document.getElementById('quotation-create-expense-total-raw');
        }
        if (elePretaxAmount && eleTaxes && eleTotal) {
            let shippingFee = 0;
            let tableLen = table.tBodies[0].rows.length;
            for (let i = 0; i < tableLen; i++) {
                let row = table.tBodies[0].rows[i];
                let is_promotion = false;
                if (row.querySelector('.table-row-promotion')) {
                    is_promotion = true
                }
                // calculate Pretax Amount
                let subtotalRaw = row.querySelector('.table-row-subtotal-raw');
                if (subtotalRaw) {
                    if (subtotalRaw.value) {
                        // check if not promotion then plus else minus
                        if (is_promotion === false) { // not promotion
                            pretaxAmount += parseFloat(subtotalRaw.value)
                        } else { // promotion
                            if (row.querySelector('.table-row-promotion').getAttribute('data-is-promotion-on-row') === "true") {
                                pretaxAmount -= parseFloat(subtotalRaw.value)
                            }
                        }
                        // get shipping fee to minus on discount total
                        if (row.querySelector('.table-row-shipping')) {
                            shippingFee = parseFloat(subtotalRaw.value);
                        }
                    }
                }
                // calculate Tax Amount
                let subTaxAmountRaw = row.querySelector('.table-row-tax-amount-raw');
                if (subTaxAmountRaw) {
                    if (subTaxAmountRaw.value) {
                        // check if not promotion then plus else minus
                        if (is_promotion === false) { // not promotion
                            taxAmount += parseFloat(subTaxAmountRaw.value)
                        } else { // promotion
                            if (row.querySelector('.table-row-promotion').getAttribute('data-is-promotion-on-row') === "true") {
                                taxAmount -= parseFloat(subTaxAmountRaw.value)
                            }
                        }
                    }
                }
            }
            let discount_on_total = 0;
            let discountTotalRate = $('#quotation-create-product-discount').val();
            if (discountTotalRate && eleDiscount) {
                discount_on_total = parseFloat(discountTotalRate);
                discountAmount = ((pretaxAmount * discount_on_total) / 100)
                // check if shipping fee then minus before calculate discount
                if (shippingFee > 0) {
                    discountAmount = (((pretaxAmount - shippingFee) * discount_on_total) / 100)
                }
            }
            let totalFinal = (pretaxAmount - discountAmount + taxAmount);

            $(elePretaxAmount).attr('data-init-money', String(pretaxAmount));
            elePretaxAmountRaw.value = pretaxAmount;
            if (is_product === true) {
                finalRevenueBeforeTax.value = pretaxAmount;
            }
            if (eleDiscount) {
                $(eleDiscount).attr('data-init-money', String(discountAmount));
                eleDiscountRaw.value = discountAmount;
                finalRevenueBeforeTax.value = (pretaxAmount - discountAmount);
            }
            $(eleTaxes).attr('data-init-money', String(taxAmount));
            eleTaxesRaw.value = taxAmount;
            $(eleTotal).attr('data-init-money', String(totalFinal));
            eleTotalRaw.value = totalFinal;
        }
        $.fn.initMaskMoney2();
    }

    static calculate(row) {
        let price = 0;
        let quantity = 0;
        let elePrice = row.querySelector('.table-row-price');
        if (elePrice) {
            price = $(elePrice).valCurrency();
        }
        let eleQuantity = row.querySelector('.table-row-quantity');
        if (eleQuantity) {
            if (eleQuantity.value) {
                quantity = parseFloat(eleQuantity.value)
            } else if (!eleQuantity.value || eleQuantity.value === "0") {
                quantity = 0
            }
        }
        let tax = 0;
        let discount = 0;
        let subtotal = (price * quantity);
        let subtotalPlus = 0;
        let eleTax = row.querySelector('.table-row-tax');
        if (eleTax) {
            let optionSelected = eleTax.options[eleTax.selectedIndex];
            if (optionSelected) {
                tax = parseInt(optionSelected.getAttribute('data-value'));
            }
        }
        let eleTaxAmount = row.querySelector('.table-row-tax-amount');
        let eleTaxAmountRaw = row.querySelector('.table-row-tax-amount-raw');
        // calculate discount + tax
        let eleDiscount = row.querySelector('.table-row-discount');
        let eleDiscountAmount = row.querySelector('.table-row-discount-amount');
        if (eleDiscount && eleDiscountAmount) {
            if (eleDiscount.value) {
                discount = parseFloat(eleDiscount.value)
            } else if (!eleDiscount.value || eleDiscount.value === "0") {
                discount = 0
            }
            let discount_on_total = 0;
            let discountTotalRate = $('#quotation-create-product-discount').val();
            if (discountTotalRate) {
                discount_on_total = parseFloat(discountTotalRate);
            }

            let discountAmount = ((price * discount) / 100);
            let priceDiscountOnRow = (price - discountAmount);
            subtotal = (priceDiscountOnRow * quantity);

            let discountAmountOnTotal = ((priceDiscountOnRow * discount_on_total) / 100);
            subtotalPlus = ((priceDiscountOnRow - discountAmountOnTotal) * quantity);
            // calculate tax
            if (eleTaxAmount) {
                let taxAmount = ((subtotalPlus * tax) / 100);
                $(eleTaxAmount).attr('value', String(taxAmount));
                eleTaxAmountRaw.value = taxAmount;
            }
            // eleDiscountAmount.value = discountAmountOnTotal;
            $(eleDiscountAmount).attr('value', String(discountAmountOnTotal));
        } else {
            // calculate tax no discount on total
            if (eleTaxAmount) {
                let taxAmount = ((subtotal * tax) / 100);
                $(eleTaxAmount).attr('value', String(taxAmount));
                eleTaxAmountRaw.value = taxAmount;
            }
        }
        // set subtotal value
        let eleSubtotal = row.querySelector('.table-row-subtotal');
        let eleSubtotalRaw = row.querySelector('.table-row-subtotal-raw');
        if (eleSubtotal) {
            $(eleSubtotal).attr('data-init-money', String(subtotal));
            eleSubtotalRaw.value = subtotal;
        }
        $.fn.initMaskMoney2();
    }

    static commonCalculate(table, row, is_product = false, is_cost = false, is_expense = false) {
        let self = this;
        self.calculate(row);
        // calculate total
        if (is_product === true) {
            self.updateTotal(table[0], true, false, false)
        } else if (is_cost === true) {
            self.updateTotal(table[0], false, true, false)
        } else if (is_expense === true) {
            self.updateTotal(table[0], false, false, true)
        }

    }

}

// Config
class checkConfigHandle {
    checkConfig(is_change_opp = false, new_row = null, is_first_time = false, is_has_opp_detail = false, is_copy = false) {
        let self = this;
        let configRaw = $('#quotation-config-data').val();
        if (configRaw) {
            let opportunity = $('#select-box-quotation-create-opportunity').val();
            let config = JSON.parse(configRaw);
            let tableProduct = document.getElementById('datable-quotation-create-product');
            let empty_list = ["", null];
            let is_make_price_change = false;
            if ((!opportunity || empty_list.includes(opportunity)) && is_has_opp_detail === false) { // short sale
                if (is_change_opp === true) {
                    // ReCheck Table Product
                    if (is_first_time === false) {
                        if (!tableProduct.querySelector('.dataTables_empty')) {
                            for (let i = 0; i < tableProduct.tBodies[0].rows.length; i++) {
                                let row = tableProduct.tBodies[0].rows[i];
                                is_make_price_change = self.reCheckTable(config, row, true, false, is_make_price_change);
                                // Re Calculate all data of rows & total
                                if (is_copy === false) {
                                    QuotationCalculateCaseHandle.commonCalculate($(tableProduct), row, true, false, false);
                                }
                            }
                        }
                    }
                    let eleDiscountTotal = document.getElementById('quotation-create-product-discount');
                    if (config.short_sale_config.is_discount_on_total === false) {
                        eleDiscountTotal.setAttribute('disabled', 'true');
                        eleDiscountTotal.classList.add('disabled-custom-show');
                        eleDiscountTotal.value = "0";
                        is_make_price_change = true;
                    } else {
                        if (eleDiscountTotal.hasAttribute('disabled')) {
                            eleDiscountTotal.removeAttribute('disabled');
                            eleDiscountTotal.classList.remove('disabled-custom-show');
                        }
                    }
                    // ReCalculate Total
                    if (is_first_time === false && is_copy === false) {
                        QuotationCalculateCaseHandle.updateTotal(tableProduct, true, false, false);
                    }
                } else {
                    if (new_row) {
                        is_make_price_change = self.reCheckTable(config, new_row, true, false, is_make_price_change);
                    }
                }
                $.fn.initMaskMoney2();
                // check if config make price change then remove promotion & shipping
                if (is_make_price_change === true) {
                    deletePromotionRows($(tableProduct), true, false);
                    deletePromotionRows($(tableProduct), false, true);
                }
                return {
                    'is_short_sale': true,
                    'is_long_sale': false,
                    'short_sale_config': config.short_sale_config,
                    'is_make_price_change': is_make_price_change,
                }
            } else { // long sale
                if (is_change_opp === true) {
                    // ReCheck Table Product
                    if (is_first_time === false) {
                        if (!tableProduct.querySelector('.dataTables_empty')) {
                            for (let i = 0; i < tableProduct.tBodies[0].rows.length; i++) {
                                let row = tableProduct.tBodies[0].rows[i];
                                is_make_price_change = self.reCheckTable(config, row, false, true, is_make_price_change);
                                // Re Calculate all data of rows & total
                                if (is_copy === false) {
                                    QuotationCalculateCaseHandle.commonCalculate($(tableProduct), row, true, false, false);
                                }
                            }
                        }
                    }
                    let eleDiscountTotal = document.getElementById('quotation-create-product-discount');
                    if (config.long_sale_config.is_not_discount_on_total === false) {
                        if (eleDiscountTotal.hasAttribute('disabled')) {
                            eleDiscountTotal.removeAttribute('disabled');
                            eleDiscountTotal.classList.remove('disabled-custom-show');
                        }
                    } else {
                        eleDiscountTotal.setAttribute('disabled', 'true');
                        eleDiscountTotal.classList.add('disabled-custom-show');
                        eleDiscountTotal.value = "0";
                        is_make_price_change = true;
                    }
                    // ReCalculate Total
                    if (is_first_time === false && is_copy === false) {
                        QuotationCalculateCaseHandle.updateTotal(tableProduct, true, false, false);
                    }
                } else {
                    if (new_row) {
                        is_make_price_change = self.reCheckTable(config, new_row, false, true, is_make_price_change);
                    }
                }
                $.fn.initMaskMoney2();
                // check if config make price change then remove promotion & shipping
                if (is_make_price_change === true) {
                    deletePromotionRows($(tableProduct), true, false);
                    deletePromotionRows($(tableProduct), false, true);
                }
                return {
                    'is_short_sale': false,
                    'is_long_sale': true,
                    'short_sale_config': config.long_sale_config,
                    'is_make_price_change': is_make_price_change,
                }
            }
        }
        return {
            'is_short_sale': false,
            'is_long_sale': false,
        }
    }

    reCheckTable(config, row, is_short_sale = false, is_long_sale = false, is_make_price_change = false) {
        if (row) {
            let eleProduct = row.querySelector('.table-row-item');
            if (eleProduct) {
                let elePriceList = row.querySelector('.dropdown-action');
                let elePrice = row.querySelector('.table-row-price');
                let eleDiscount = row.querySelector('.table-row-discount');
                if (is_short_sale === true) {
                    if (config.short_sale_config.is_choose_price_list === false) {
                        if (elePriceList.hasAttribute('data-bs-toggle')) {
                            elePriceList.removeAttribute('data-bs-toggle');
                            loadPriceProduct(eleProduct);
                        }
                    } else {
                        if (!elePriceList.hasAttribute('data-bs-toggle')) {
                            elePriceList.setAttribute('data-bs-toggle', 'dropdown')
                        }
                    }
                    if (config.short_sale_config.is_input_price === false) {
                        elePrice.setAttribute('disabled', 'true');
                        elePrice.classList.add('disabled-custom-show');
                        loadPriceProduct(eleProduct);
                    } else {
                        if (elePrice.hasAttribute('disabled')) {
                            elePrice.removeAttribute('disabled');
                            elePrice.classList.remove('disabled-custom-show');
                        }
                    }
                    if (eleDiscount) {
                        if (config.short_sale_config.is_discount_on_product === false) {
                            eleDiscount.setAttribute('disabled', 'true');
                            eleDiscount.classList.add('disabled-custom-show');
                            eleDiscount.value = "0";
                            is_make_price_change = true;
                        } else {
                            if (eleDiscount.hasAttribute('disabled')) {
                                eleDiscount.removeAttribute('disabled');
                                eleDiscount.classList.remove('disabled-custom-show');
                            }
                        }
                    }
                } else if (is_long_sale === true) {
                    if (!elePriceList.hasAttribute('data-bs-toggle')) {
                        elePriceList.setAttribute('data-bs-toggle', 'dropdown');
                    }
                    if (config.long_sale_config.is_not_input_price === false) {
                        if (elePrice.hasAttribute('disabled')) {
                            elePrice.removeAttribute('disabled');
                            elePrice.classList.remove('disabled-custom-show');
                        }
                    } else {
                        elePrice.setAttribute('disabled', 'true');
                        elePrice.classList.add('disabled-custom-show');
                        loadPriceProduct(eleProduct);
                    }
                    if (eleDiscount) {
                        if (config.long_sale_config.is_not_discount_on_product === false) {
                            if (eleDiscount.hasAttribute('disabled')) {
                                eleDiscount.removeAttribute('disabled');
                                eleDiscount.classList.remove('disabled-custom-show');
                            }
                        } else {
                            eleDiscount.setAttribute('disabled', 'true');
                            eleDiscount.classList.add('disabled-custom-show');
                            eleDiscount.value = "0";
                            is_make_price_change = true;
                        }
                    }
                }
            }
        }
        return is_make_price_change
    }

}

let configClass = new checkConfigHandle();

// Indicator
class indicatorHandle {
    loadQuotationIndicator(indicator_id, is_load_init_indicator = false) {
        let jqueryId = '#' + indicator_id;
        let ele = $(jqueryId);
        if (!ele.val()) {
            let url = ele.attr('data-url');
            let method = ele.attr('data-method');
            $.fn.callAjax2({
                    'url': url,
                    'method': method,
                    'isDropdown': true,
                }
                // url, method
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('quotation_indicator_list') && Array.isArray(data.quotation_indicator_list)) {
                            ele.val(JSON.stringify(data.quotation_indicator_list));
                            if (is_load_init_indicator === false) {
                                calculateIndicator(data.quotation_indicator_list);
                            }
                        }
                    }
                }
            )
        } else {
            if (is_load_init_indicator === false) {
                let data_list = JSON.parse(ele.val());
                calculateIndicator(data_list);
            }
        }

    }
}

let indicatorClass = new indicatorHandle();

// Submit Form
class QuotationSubmitHandle {
    static setupDataProduct() {
        let result = [];
        let table = document.getElementById('datable-quotation-create-product');
        let tableEmpty = table.querySelector('.dataTables_empty');
        if (tableEmpty) {
            return []
        }
        let tableBody = table.tBodies[0];
        for (let i = 0; i < tableBody.rows.length; i++) {
            let rowData = {};
            let row = tableBody.rows[i];
            let eleProduct = row.querySelector('.table-row-item');
            let elePromotion = row.querySelector('.table-row-promotion');
            let eleShipping = row.querySelector('.table-row-shipping');
            if (eleProduct) { // PRODUCT
                let optionSelected = eleProduct.options[eleProduct.selectedIndex];
                if (optionSelected) {
                    if (optionSelected.querySelector('.data-info')) {
                        let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                        rowData['product'] = dataInfo.id;
                        rowData['product_title'] = dataInfo.title;
                        rowData['product_code'] = dataInfo.code;
                    }
                }
                let eleUOM = row.querySelector('.table-row-uom');
                if (eleUOM) {
                    let optionSelected = eleUOM.options[eleUOM.selectedIndex];
                    if (optionSelected) {
                        if (optionSelected.querySelector('.data-info')) {
                            let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                            rowData['unit_of_measure'] = dataInfo.id;
                            rowData['product_uom_title'] = dataInfo.title;
                            rowData['product_uom_code'] = dataInfo.code;
                        }
                    }
                }
                let eleTax = row.querySelector('.table-row-tax');
                if (eleTax) {
                    let optionSelected = eleTax.options[eleTax.selectedIndex];
                    if (optionSelected) {
                        if (optionSelected.querySelector('.data-info')) {
                            let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                            rowData['tax'] = dataInfo.id;
                            rowData['product_tax_title'] = dataInfo.title;
                            rowData['product_tax_value'] = dataInfo.value;
                        } else {
                            rowData['product_tax_value'] = 0;
                        }
                    }
                }
                let eleTaxAmount = row.querySelector('.table-row-tax-amount-raw');
                if (eleTaxAmount) {
                    rowData['product_tax_amount'] = parseFloat(eleTaxAmount.value);
                }
                let eleDescription = row.querySelector('.table-row-description');
                if (eleDescription) {
                    rowData['product_description'] = eleDescription.value;
                }
                let eleQuantity = row.querySelector('.table-row-quantity');
                if (eleQuantity) {
                    rowData['product_quantity'] = parseFloat(eleQuantity.value);
                }
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    rowData['product_unit_price'] = $(elePrice).valCurrency();
                }
                let eleDiscount = row.querySelector('.table-row-discount');
                if (eleDiscount) {
                    if (eleDiscount.value || eleDiscount.value === "0") {
                        rowData['product_discount_value'] = parseFloat(eleDiscount.value);
                    } else {
                        rowData['product_discount_value'] = 0;
                    }
                }
                let eleDiscountAmount = row.querySelector('.table-row-discount-amount');
                if (eleDiscountAmount) {
                    rowData['product_discount_amount'] = $(eleDiscountAmount).valCurrency();
                }
                let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
                if (eleSubtotal) {
                    rowData['product_subtotal_price'] = parseFloat(eleSubtotal.value);
                }
                if (rowData.hasOwnProperty('product_subtotal_price') && rowData.hasOwnProperty('product_tax_amount')) {
                    rowData['product_subtotal_price_after_tax'] = rowData['product_subtotal_price'] + rowData['product_tax_amount']
                }
                let eleOrder = row.querySelector('.table-row-order');
                if (eleOrder) {
                    rowData['order'] = parseInt(eleOrder.innerHTML);
                }
                rowData['promotion'] = null;
                rowData['shipping'] = null;
            } else if (elePromotion) { // PROMOTION
                let check_none_blank_list = ['', "", null, "undefined"];
                rowData['is_promotion'] = true;
                rowData['product'] = null;
                if (elePromotion.getAttribute('data-id-product') && !check_none_blank_list.includes(elePromotion.getAttribute('data-id-product'))) {
                   rowData['product'] = elePromotion.getAttribute('data-id-product');
                }
                rowData['promotion'] = elePromotion.getAttribute('data-id');
                rowData['shipping'] = null;
                rowData['product_title'] = elePromotion.value;
                rowData['product_code'] = elePromotion.value;
                rowData['unit_of_measure'] = null;
                rowData['product_uom_title'] = "";
                rowData['product_uom_code'] = "";
                let uomData = getDataByProductID(elePromotion.getAttribute('data-id-product'));
                if (uomData && Object.keys(uomData).length > 0) {
                    rowData['unit_of_measure'] = uomData.id;
                    rowData['product_uom_title'] = uomData.title;
                    rowData['product_uom_code'] = uomData.code;
                }
                let eleTax = row.querySelector('.table-row-tax');
                if (eleTax) {
                    let optionSelected = eleTax.options[eleTax.selectedIndex];
                    if (optionSelected) {
                        if (optionSelected.querySelector('.data-info')) {
                            let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                            rowData['tax'] = dataInfo.id;
                            rowData['product_tax_title'] = dataInfo.title;
                            rowData['product_tax_value'] = dataInfo.value;
                        } else {
                            rowData['product_tax_value'] = 0;
                        }
                    }
                }
                let eleTaxAmount = row.querySelector('.table-row-tax-amount-raw');
                if (eleTaxAmount) {
                    rowData['product_tax_amount'] = parseFloat(eleTaxAmount.value);
                }
                let eleDescription = row.querySelector('.table-row-description');
                if (eleDescription) {
                    rowData['product_description'] = eleDescription.value;
                }
                let eleQuantity = row.querySelector('.table-row-quantity');
                if (eleQuantity) {
                    rowData['product_quantity'] = parseFloat(eleQuantity.value);
                }
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    rowData['product_unit_price'] = $(elePrice).valCurrency();
                }
                rowData['product_discount_value'] = 0;
                rowData['product_discount_amount'] = 0;
                let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
                if (eleSubtotal) {
                    rowData['product_subtotal_price'] = parseFloat(eleSubtotal.value);
                }
                let eleOrder = row.querySelector('.table-row-order');
                if (eleOrder) {
                    rowData['order'] = parseInt(eleOrder.innerHTML);
                }
            } else if (eleShipping) { // SHIPPING
                rowData['is_shipping'] = true;
                rowData['product'] = null;
                rowData['shipping'] = eleShipping.getAttribute('data-id');
                rowData['promotion'] = null;
                rowData['product_title'] = eleShipping.value;
                rowData['product_code'] = eleShipping.value;
                rowData['unit_of_measure'] = null;
                rowData['product_uom_title'] = "";
                rowData['product_uom_code'] = "";
                let eleTax = row.querySelector('.table-row-tax');
                if (eleTax) {
                    let optionSelected = eleTax.options[eleTax.selectedIndex];
                    if (optionSelected) {
                        if (optionSelected.querySelector('.data-info')) {
                            let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                            rowData['tax'] = dataInfo.id;
                            rowData['product_tax_title'] = dataInfo.title;
                            rowData['product_tax_value'] = dataInfo.value;
                        } else {
                            rowData['product_tax_value'] = 0;
                        }
                    }
                }
                let eleTaxAmount = row.querySelector('.table-row-tax-amount-raw');
                if (eleTaxAmount) {
                    rowData['product_tax_amount'] = parseFloat(eleTaxAmount.value);
                }
                let eleDescription = row.querySelector('.table-row-description');
                if (eleDescription) {
                    rowData['product_description'] = eleDescription.value;
                }
                let eleQuantity = row.querySelector('.table-row-quantity');
                if (eleQuantity) {
                    rowData['product_quantity'] = parseFloat(eleQuantity.value);
                }
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    rowData['product_unit_price'] = $(elePrice).valCurrency();
                }
                rowData['product_discount_value'] = 0;
                rowData['product_discount_amount'] = 0;
                let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
                if (eleSubtotal) {
                    rowData['product_subtotal_price'] = parseFloat(eleSubtotal.value);
                }
                let eleOrder = row.querySelector('.table-row-order');
                if (eleOrder) {
                    rowData['order'] = parseInt(eleOrder.innerHTML);
                }
            }
            result.push(rowData);
        }
        return result
    }

    static setupDataCost() {
        let result = [];
        let table = document.getElementById('datable-quotation-create-cost');
        let tableEmpty = table.querySelector('.dataTables_empty');
        if (tableEmpty) {
            return []
        }
        let tableBody = table.tBodies[0];
        for (let i = 0; i < tableBody.rows.length; i++) {
            let rowData = {};
            let row = tableBody.rows[i];
            let eleProduct = row.querySelector('.table-row-item');
            let eleShipping = row.querySelector('.table-row-shipping');
            if (eleProduct) { // PRODUCT
                let optionSelected = eleProduct.options[eleProduct.selectedIndex];
                if (optionSelected) {
                    if (optionSelected.querySelector('.data-info')) {
                        let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                        rowData['product'] = dataInfo.id;
                        rowData['product_title'] = dataInfo.title;
                        rowData['product_code'] = dataInfo.code;
                    }
                }
                let eleUOM = row.querySelector('.table-row-uom');
                if (eleUOM) {
                    let optionSelected = eleUOM.options[eleUOM.selectedIndex];
                    if (optionSelected) {
                        if (optionSelected.querySelector('.data-info')) {
                            let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                            rowData['unit_of_measure'] = dataInfo.id;
                            rowData['product_uom_title'] = dataInfo.title;
                            rowData['product_uom_code'] = dataInfo.code;
                        }
                    }

                }
                let eleTax = row.querySelector('.table-row-tax');
                if (eleTax) {
                    let optionSelected = eleTax.options[eleTax.selectedIndex];
                    if (optionSelected) {
                        if (optionSelected.querySelector('.data-info')) {
                            let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                            rowData['tax'] = dataInfo.id;
                            rowData['product_tax_title'] = dataInfo.title;
                            rowData['product_tax_value'] = dataInfo.value;
                        } else {
                            rowData['product_tax_value'] = 0;
                        }
                    }

                }
                let eleTaxAmount = row.querySelector('.table-row-tax-amount-raw');
                if (eleTaxAmount) {
                    rowData['product_tax_amount'] = parseFloat(eleTaxAmount.value)
                }
                let eleQuantity = row.querySelector('.table-row-quantity');
                if (eleQuantity) {
                    rowData['product_quantity'] = parseFloat(eleQuantity.value);
                }
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    rowData['product_cost_price'] = $(elePrice).valCurrency();
                }
                let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
                if (eleSubtotal) {
                    rowData['product_subtotal_price'] = parseFloat(eleSubtotal.value);
                }
                if (rowData.hasOwnProperty('product_subtotal_price') && rowData.hasOwnProperty('product_tax_amount')) {
                    rowData['product_subtotal_price_after_tax'] = rowData['product_subtotal_price'] + rowData['product_tax_amount']
                }
                let eleOrder = row.querySelector('.table-row-order');
                if (eleOrder) {
                    rowData['order'] = parseInt(eleOrder.innerHTML);
                }
                rowData['shipping'] = null;
            } else if (eleShipping) { // SHIPPING
                rowData['is_shipping'] = true;
                rowData['product'] = null;
                rowData['shipping'] = eleShipping.getAttribute('data-id');
                rowData['promotion'] = null;
                rowData['product_title'] = eleShipping.value;
                rowData['product_code'] = eleShipping.value;
                rowData['unit_of_measure'] = null;
                rowData['product_uom_title'] = "";
                rowData['product_uom_code'] = "";
                let eleTax = row.querySelector('.table-row-tax');
                if (eleTax) {
                    let optionSelected = eleTax.options[eleTax.selectedIndex];
                    if (optionSelected) {
                        if (optionSelected.querySelector('.data-info')) {
                            let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                            rowData['tax'] = dataInfo.id;
                            rowData['product_tax_title'] = dataInfo.title;
                            rowData['product_tax_value'] = dataInfo.value;
                        } else {
                            rowData['product_tax_value'] = 0;
                        }
                    }
                }
                let eleTaxAmount = row.querySelector('.table-row-tax-amount-raw');
                if (eleTaxAmount) {
                    rowData['product_tax_amount'] = parseFloat(eleTaxAmount.value);
                }
                let eleQuantity = row.querySelector('.table-row-quantity');
                if (eleQuantity) {
                    rowData['product_quantity'] = parseFloat(eleQuantity.value);
                }
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    rowData['product_cost_price'] = $(elePrice).valCurrency();
                }
                let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
                if (eleSubtotal) {
                    rowData['product_subtotal_price'] = parseFloat(eleSubtotal.value);
                }
                let eleOrder = row.querySelector('.table-row-order');
                if (eleOrder) {
                    rowData['order'] = parseInt(eleOrder.innerHTML);
                }
            }
            result.push(rowData);
        }
        return result
    }

    static setupDataExpense() {
        let result = [];
        let table = document.getElementById('datable-quotation-create-expense');
        let tableEmpty = table.querySelector('.dataTables_empty');
        if (tableEmpty) {
            return []
        }
        let tableBody = table.tBodies[0];
        for (let i = 0; i < tableBody.rows.length; i++) {
            let rowData = {};
            let row = tableBody.rows[i];
            let eleExpense = row.querySelector('.table-row-item');
            if (eleExpense) {
                // let optionSelected = eleExpense.options[eleExpense.selectedIndex];
                let optionSelected = eleExpense.closest('tr').querySelector('.expense-option-list').querySelector('.option-btn-checked');
                if (optionSelected) {
                    if (optionSelected.querySelector('.data-info')) {
                        let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                        if (dataInfo.is_product === false) {
                            rowData['expense'] = dataInfo.id;
                            rowData['product'] = null;
                            rowData['expense_title'] = dataInfo.title;
                            rowData['expense_code'] = dataInfo.code;
                            rowData['expense_type_title'] = dataInfo['expense type'];
                            rowData['is_product'] = false;
                        } else {
                            rowData['product'] = dataInfo.id;
                            rowData['expense'] = null;
                            rowData['product_title'] = dataInfo.title;
                            rowData['product_code'] = dataInfo.code;
                            rowData['is_product'] = true;
                        }
                    }
                }
            }
            let eleUOM = row.querySelector('.table-row-uom');
            if (eleUOM) {
                let optionSelected = eleUOM.options[eleUOM.selectedIndex];
                if (optionSelected) {
                    if (optionSelected.querySelector('.data-info')) {
                        let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                        rowData['unit_of_measure'] = dataInfo.id;
                        rowData['expense_uom_title'] = dataInfo.title;
                        rowData['expense_uom_code'] = dataInfo.code;
                    }
                }

            }
            let eleTax = row.querySelector('.table-row-tax');
            if (eleTax) {
                let optionSelected = eleTax.options[eleTax.selectedIndex];
                if (optionSelected) {
                    if (optionSelected.querySelector('.data-info')) {
                        let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                        rowData['tax'] = dataInfo.id;
                        rowData['expense_tax_title'] = dataInfo.title;
                        rowData['expense_tax_value'] = dataInfo.value;
                    } else {
                        rowData['expense_tax_value'] = 0;
                    }
                }

            }
            let eleTaxAmount = row.querySelector('.table-row-tax-amount-raw');
            if (eleTaxAmount) {
                rowData['expense_tax_amount'] = parseFloat(eleTaxAmount.value)
            }
            let eleQuantity = row.querySelector('.table-row-quantity');
            if (eleQuantity) {
                rowData['expense_quantity'] = parseFloat(eleQuantity.value);
            }
            let elePrice = row.querySelector('.table-row-price');
            if (elePrice) {
                rowData['expense_price'] = $(elePrice).valCurrency();
            }
            let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
            if (eleSubtotal) {
                rowData['expense_subtotal_price'] = parseFloat(eleSubtotal.value)
            }
            if (rowData.hasOwnProperty('expense_subtotal_price') && rowData.hasOwnProperty('expense_tax_amount')) {
                rowData['expense_subtotal_price_after_tax'] = rowData['expense_subtotal_price'] + rowData['expense_tax_amount']
            }
            let eleOrder = row.querySelector('.table-row-order');
            if (eleOrder) {
                rowData['order'] = parseInt(eleOrder.innerHTML);
            }
            if (rowData.hasOwnProperty('expense') && rowData.hasOwnProperty('unit_of_measure')) {
                result.push(rowData);
            }
        }
        return result
    }

    static setupDataLogistic() {
        return {
            'shipping_address': $('#quotation-create-shipping-address').val(),
            'billing_address': $('#quotation-create-billing-address').val(),
        }
    }

    static setupDataIndicator() {
        let result = [];
        let tableIndicator = document.getElementById('datable-quotation-create-indicator');
        let tableEmpty = tableIndicator.querySelector('.dataTables_empty');
        if (!tableEmpty) {
            for (let i = 0; i < tableIndicator.tBodies[0].rows.length; i++) {
                let row = tableIndicator.tBodies[0].rows[i];
                let indicator = row.querySelector('.table-row-title').getAttribute('data-id');
                let indicator_value = row.querySelector('.table-row-value').getAttribute('data-value');
                let indicator_rate = row.querySelector('.table-row-rate').getAttribute('data-value');
                let order = row.querySelector('.table-row-order').getAttribute('data-value');
                if (!$(tableIndicator).hasClass('sale-order')) { // QUOTATION INDICATOR
                    result.push({
                        'indicator': indicator,
                        'indicator_value': parseFloat(indicator_value),
                        'indicator_rate': parseFloat(indicator_rate),
                        'order': parseInt(order),
                    })
                } else { // SALE ORDER INDICATOR
                    let quotation_indicator_value = row.querySelector('.table-row-quotation-value').getAttribute('data-value');
                    let difference_indicator_rate = row.querySelector('.table-row-difference-value').getAttribute('data-value');
                    result.push({
                        'quotation_indicator': indicator,
                        'indicator_value': parseFloat(indicator_value),
                        'indicator_rate': parseFloat(indicator_rate),
                        'quotation_indicator_value': parseFloat(quotation_indicator_value),
                        'difference_indicator_value': parseFloat(difference_indicator_rate),
                        'order': parseInt(order),
                    })
                }
            }
        }
        return result
    }

    static setupDataSubmit(_form, is_sale_order = false) {
        let self = this;
        let quotation_products_data = 'quotation_products_data';
        let quotation_costs_data = 'quotation_costs_data';
        let quotation_expenses_data = 'quotation_expenses_data';
        let quotation_logistic_data = 'quotation_logistic_data';
        let quotation_indicators_data = 'quotation_indicators_data';
        if (is_sale_order === true) {
            quotation_products_data = 'sale_order_products_data';
            quotation_costs_data = 'sale_order_costs_data';
            quotation_expenses_data = 'sale_order_expenses_data';
            quotation_logistic_data = 'sale_order_logistic_data';
            quotation_indicators_data = 'sale_order_indicators_data';

            let eleQuotation = $('#select-box-quotation');
            if (eleQuotation) {
                if (eleQuotation.val()) {
                    _form.dataForm['quotation'] = eleQuotation.val()
                }
            }
        }
        let dateCreatedVal = $('#quotation-create-date-created').val();
        if (dateCreatedVal) {
            _form.dataForm['date_created'] = moment(dateCreatedVal).format('YYYY-MM-DD HH:mm:ss')
        }
        _form.dataForm['status'] = $('#quotation-create-status').val();
        _form.dataForm['total_product_pretax_amount'] = parseFloat($('#quotation-create-product-pretax-amount-raw').val());
        let totalProductDiscountRate = $('#quotation-create-product-discount').val();
        if (totalProductDiscountRate) {
            _form.dataForm['total_product_discount_rate'] = parseFloat(totalProductDiscountRate);
        } else {
            _form.dataForm['total_product_discount_rate'] = 0;
        }
        _form.dataForm['total_product_discount'] = parseFloat($('#quotation-create-product-discount-amount-raw').val());
        _form.dataForm['total_product_tax'] = parseFloat($('#quotation-create-product-taxes-raw').val());
        _form.dataForm['total_product'] = parseFloat($('#quotation-create-product-total-raw').val());
        _form.dataForm['total_product_revenue_before_tax'] = parseFloat(finalRevenueBeforeTax.value);
        _form.dataForm['total_cost_pretax_amount'] = parseFloat($('#quotation-create-cost-pretax-amount-raw').val());
        _form.dataForm['total_cost_tax'] = parseFloat($('#quotation-create-cost-taxes-raw').val());
        _form.dataForm['total_cost'] = parseFloat($('#quotation-create-cost-total-raw').val());
        _form.dataForm['total_expense_pretax_amount'] = parseFloat($('#quotation-create-expense-pretax-amount-raw').val());
        _form.dataForm['total_expense_tax'] = parseFloat($('#quotation-create-expense-taxes-raw').val());
        _form.dataForm['total_expense'] = parseFloat($('#quotation-create-expense-total-raw').val());

        if (is_sale_order === false) {
            _form.dataForm['is_customer_confirm'] = $('#quotation-customer-confirm')[0].checked;
        }

        let quotation_products_data_setup = self.setupDataProduct();
        if (quotation_products_data_setup.length > 0) {
            _form.dataForm[quotation_products_data] = quotation_products_data_setup
        }
        let quotation_costs_data_setup = self.setupDataCost();
        if (quotation_costs_data_setup.length > 0) {
            _form.dataForm[quotation_costs_data] = quotation_costs_data_setup
        }
        let quotation_expenses_data_setup = self.setupDataExpense();
        if (quotation_expenses_data_setup.length > 0) {
            _form.dataForm[quotation_expenses_data] = quotation_expenses_data_setup
        }

        _form.dataForm[quotation_logistic_data] = self.setupDataLogistic();

        let customer_shipping = $('#quotation-create-customer-shipping');
        if (customer_shipping.val()) {
            _form.dataForm['customer_shipping'] = customer_shipping.val();
        }
        let customer_billing = $('#quotation-create-customer-billing');
        if (customer_billing.val()) {
            _form.dataForm['customer_billing'] = customer_billing.val();
        }

        let quotation_indicators_data_setup = self.setupDataIndicator();
        if (quotation_indicators_data_setup.length > 0) {
            _form.dataForm[quotation_indicators_data] = quotation_indicators_data_setup
        }
        // system fields
        if (_form.dataMethod === "POST") {
            _form.dataForm['system_status'] = 1;
        }
    }
}

// *** COMMON FUNCTIONS ***
function deleteRow(currentRow, tableBody, table) {
    // Get the index of the current row within the DataTable
    let rowIndex = table.DataTable().row(currentRow).index();
    let row = table.DataTable().row(rowIndex);
    // Delete current row
    row.remove().draw();
    // ReOrder STT
    reOrderSTT(tableBody, table);
}

function reOrderSTT(tableBody, table) {
    let order = 0;
    if (tableBody.rows.length === 0) {
        table.DataTable().clear();
    } else {
        for (let idx = 0; idx < tableBody.rows.length; idx++) {
            order++;
            let productOrder = tableBody.rows[idx].querySelector('.table-row-order');
            if (productOrder) {
                productOrder.innerHTML = order;
            }
        }
    }
}

function deletePromotionRows(table, is_promotion = false, is_shipping = false) {
    for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
        let row = table[0].tBodies[0].rows[i];
        if (row.querySelector('.table-row-promotion') && is_promotion === true) {
            deleteRow($(row), row.closest('tbody'), table)
        } else if (row.querySelector('.table-row-shipping') && is_shipping === true) {
            deleteRow($(row), row.closest('tbody'), table)
        }
    }
}

function filterDataProductNotPromotion(data_products) {
    let finalList = [];
    let order = 0;
    for (let i = 0; i < data_products.length; i++) {
        let dataProd = data_products[i];
        if (!dataProd.hasOwnProperty('is_promotion') && !dataProd.hasOwnProperty('is_shipping')) {
            order++;
            dataProd['order'] = order;
            finalList.push(dataProd)
        }
    }
    return finalList
}

function loadPriceProduct(eleProduct, is_change_item = true, is_expense = false) {
        let optionSelected = null;
        if (is_expense === false) { // PRODUCT
            optionSelected = eleProduct.options[eleProduct.selectedIndex];
        } else { // EXPENSE
            optionSelected = eleProduct.closest('tr').querySelector('.expense-option-list').querySelector('.option-btn-checked');
        }
        let productData = optionSelected.querySelector('.data-default');
        let is_change_price = false;
        if (productData) {
            let data = JSON.parse(productData.value);
            let price = eleProduct.closest('tr').querySelector('.table-row-price');
            let priceList = eleProduct.closest('tr').querySelector('.table-row-price-list');
            // load PRICE
            if (price && priceList) {
                let account_price_id = document.getElementById('customer-price-list').value;
                let general_price_id = null;
                let general_price = 0;
                let customer_price = null;
                let current_price_checked = price.getAttribute('value');
                $(priceList).empty();
                if (Array.isArray(data.price_list) && data.price_list.length > 0) {
                    for (let i = 0; i < data.price_list.length; i++) {
                        if (data.price_list[i].price_type === 0) { // PRICE TYPE IS PRODUCT (SALE)
                            if (data.price_list[i].is_default === true) { // check & append GENERAL_PRICE_LIST
                                general_price_id = data.price_list[i].id;
                                general_price = parseFloat(data.price_list[i].value);
                                $(priceList).append(`<button type="button" class="btn btn-white dropdown-item table-row-price-option" data-value="${parseFloat(data.price_list[i].value)}">
                                                    <div class="row">
                                                        <div class="col-5"><span>${data.price_list[i].title}</span></div>
                                                        <div class="col-5"><span class="mask-money" data-init-money="${parseFloat(data.price_list[i].value)}"></span></div>
                                                        <div class="col-2"><span class="valid-price">${data.price_list[i].price_status}</span></div>
                                                    </div>
                                                </button>`);
                            }
                            if (data.price_list[i].id === account_price_id && general_price_id !== account_price_id) { // check & append CUSTOMER_PRICE_LIST
                                if (!["Expired", "Invalid"].includes(data.price_list[i].price_status)) { // Customer price valid
                                    customer_price = parseFloat(data.price_list[i].value);
                                    $(priceList).empty();
                                    $(priceList).append(`<button type="button" class="btn btn-white dropdown-item table-row-price-option option-btn-checked" data-value="${parseFloat(data.price_list[i].value)}">
                                                        <div class="row">
                                                            <div class="col-5"><span>${data.price_list[i].title}</span></div>
                                                            <div class="col-5"><span class="mask-money" data-init-money="${parseFloat(data.price_list[i].value)}"></span></div>
                                                            <div class="col-2"><span class="valid-price">${data.price_list[i].price_status}</span></div>
                                                        </div>
                                                    </button>`);
                                } else { // Customer price invalid, expired
                                    $(priceList).append(`<button type="button" class="btn btn-white dropdown-item table-row-price-option option-btn-checked" data-value="${parseFloat(data.price_list[i].value)}" disabled>
                                                        <div class="row">
                                                            <div class="col-5"><span>${data.price_list[i].title}</span></div>
                                                            <div class="col-5"><span class="mask-money" data-init-money="${parseFloat(data.price_list[i].value)}"></span></div>
                                                            <div class="col-2"><span class="expired-price">${data.price_list[i].price_status}</span></div>
                                                        </div>
                                                    </button>`);
                                }
                            }
                        } else if (data.price_list[i].price_type === 2) { // PRICE TYPE IS EXPENSE
                            general_price = parseFloat(data.price_list[i].value);
                            $(priceList).append(`<button type="button" class="btn btn-white dropdown-item table-row-price-option" data-value="${parseFloat(data.price_list[i].value)}">
                                                    <div class="row">
                                                        <div class="col-5"><span>${data.price_list[i].title}</span></div>
                                                        <div class="col-5"><span class="mask-money" data-init-money="${parseFloat(data.price_list[i].value)}"></span></div>
                                                        <div class="col-2"><span class="valid-price">${data.price_list[i].price_status}</span></div>
                                                    </div>
                                                </button>`);
                        }
                    }
                }
                // get Price to display
                if (is_change_item === true) {
                    if (customer_price) {
                        $(price).attr('value', String(customer_price));
                    } else {
                        $(price).attr('value', String(general_price));
                    }
                }
                if (current_price_checked !== price.getAttribute('value')) {
                    is_change_price = true;
                }
            }
        }
        $.fn.initMaskMoney2();
        // If change price then remove promotion & shipping
        if (is_change_price === true) {
            let tableProduct = document.getElementById('datable-quotation-create-product');
            deletePromotionRows($(tableProduct), true, false);
            deletePromotionRows($(tableProduct), false, true);
        }
    }

function getDataByProductID(product_id) {
    let uom_data = {};
    let eleDataList = document.getElementById('data-init-quotation-create-tables-product');
    let dataList = JSON.parse(eleDataList.value);
    for (let i = 0; i < dataList.length; i++) {
        let data = dataList[i];
        if (data.id === product_id) {
            if (data.sale_information) {
                uom_data = data.sale_information.default_uom;
                break
            }
        }
    }
    return uom_data
}