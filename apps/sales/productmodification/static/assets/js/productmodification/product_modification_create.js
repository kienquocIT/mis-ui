$(document).ready(function () {
    ProductModificationEventHandler.InitPageEven()
    UsualLoadPageFunction.LoadDate({element: pageElements.$created_date, auto_load: true})
    ProductModificationPageFunction.LoadTableCurrentProductModified()
    ProductModificationPageFunction.LoadTableProductCurrentComponentList()
    ProductModificationPageFunction.LoadTableProductRemovedComponentList()
});
