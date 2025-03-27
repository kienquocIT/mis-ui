$(document).ready( function(){
    const instance = new GroupOrderCommon()
    instance.init(true)
    instance.fetchDetailData(instance.$formSubmit, true)
    instance.handleEvents(true)
})
