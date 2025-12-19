$(document).ready(() => {
    const assetHandler = new AssetHandler()
    assetHandler.init()
    assetHandler.loadDetailData()
    UsualLoadPageFunction.DisablePage(true, ['#load-depreciation-btn', '.btn-close'])
});