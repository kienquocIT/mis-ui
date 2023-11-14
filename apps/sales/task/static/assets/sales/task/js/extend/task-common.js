$(document).ready(function(){
    // declare global scope variable
    const $AssignELm = $('#selectAssignTo')

    class assignToHandle {
        static loadData(data=null){
            if (Object.keys(data).length > 0){
                data = {...data, selected: true}
                $AssignELm.attr('data-onload', JSON.stringify(data))
            }
        }
        static init(){
            assignToHandle.loadData()
            $AssignELm.initSelect2()
            // to-do here
        }
    }
});