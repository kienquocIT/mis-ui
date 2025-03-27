$(document).ready( function(){
    const instance = new GroupOrderCommon()
    instance.init()
    instance.handleEvents()
    instance.setUpFormSubmit(instance.$formSubmit)
})
