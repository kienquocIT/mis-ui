$(document).ready(function () {
    ProductModificationEventHandler.InitPageEven()
    UsualLoadPageFunction.LoadDate({element: pageElements.$created_date, auto_load: true, empty: false})
    ProductModificationPageFunction.LoadTableCurrentProductModified()
    ProductModificationPageFunction.LoadTableProductCurrentComponentList()
    ProductModificationPageFunction.LoadTableProductRemovedComponentList()
});
