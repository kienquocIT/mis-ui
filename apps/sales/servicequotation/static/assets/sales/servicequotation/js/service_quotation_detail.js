$(document).ready(async function() {
    function handleDetailEvents(){
        ServiceOrder.adjustTableSizeWhenChangeTab();
        ServiceOrder.handleClickOpenServiceDelivery();
        ServiceOrder.handleClickOpenWorkOrderCost();
        ServiceOrder.handleOpenPaymentDetail();
        ServiceOrder.handleOpenModalReconcile();
        ServiceOrder.handleOpenModalPackage();
        ServiceOrder.handleTogglePackageChildren();

        ServiceOrderPageHandler.setupDashboardLink();
    }

    function handleClickIndicator(){
        IndicatorControl.$openCanvas.on('click', function () {
            IndicatorControl.$canvas.offcanvas('show');
        });
    }
    WindowControl.showLoading()
    await ServiceOrderPageHandler.initializeCommonData();
    await ServiceOrderPageHandler.loadServiceOrderData($('#form-detail-service-quotation').attr('data-url'), true, false)
    WindowControl.hideLoading()
    UsualLoadPageFunction.DisablePage(true, [
        '.btn-close', '.modal-header button', '#view-dashboard',
        '#btn-open-exchange-modal', '.btn-list-task',
        '.btn-open-service-delivery', '.btn-open-work-order-cost',
        '.btn-open-contribution-package', '.btn-open-product-attribute'
    ]);
    handleDetailEvents()
    handleClickIndicator()
});