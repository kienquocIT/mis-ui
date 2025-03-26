$(document).ready( function(){
    const instance = new GroupOrderCommon()
    instance.init(true)
    instance.setUpFormSubmit(instance.$formSubmit)
    instance.fetchDetailData(instance.$formSubmit, false)
    instance.handleEvents(false)
})
