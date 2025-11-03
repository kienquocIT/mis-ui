$(document).ready(async function() {
    function handleDetailEvents(){
        // Read-only specific handlers
        ServiceOrder.pageElement.workOrder.$table.on('click', '.btn-open-task', function() {
            TaskExtend.openAddTaskFromTblRow(this, ServiceOrder.pageElement.workOrder.$table);
        });

        ServiceOrder.pageElement.workOrder.$table.on('click', '.btn-list-task', function() {
            TaskExtend.openListTaskFromTblRow(this, ServiceOrder.pageElement.workOrder.$table);
        });

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
    await ServiceOrderPageHandler.loadServiceOrderData($('#form-detail-service-order').attr('data-url'), true);
    WindowControl.hideLoading()
    UsualLoadPageFunction.DisablePage(true, [
        '.btn-close', '.modal-header button', '#view-dashboard',
        '#btn-open-exchange-modal', '.btn-list-task',
        '.btn-open-service-delivery', '.btn-open-work-order-cost',
        '.btn-open-contribution-package', '.btn-open-product-attribute', '#version-select', '.btn-open-payment-detail',
        '.btn-open-reconcile'
    ]);
    handleDetailEvents()
    handleClickIndicator()
});