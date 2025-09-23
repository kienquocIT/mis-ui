class ProductAttribute {
    static renderProductAttributeButton(){
        return `<div class="d-flex align-items-center justify-content-between">
                    <button 
                        type="button" 
                        class="btn btn-icon btn-rounded btn-soft-primary btn-xs btn-open-product-attribute"
                        data-bs-toggle="tooltip" data-bs-placement="bottom" title="Add attributes"
                    >
                        <span class="icon"><i class="fa-solid fa-plus"></i></span>
                    </button>
                    <input type="text" class="form-control table-row-task-data hidden">
                    <div class="d-flex align-items-center">
                        <div class="avatar-group avatar-group-overlapped avatar-group-task"></div>
                        <button 
                            type="button" 
                            class="btn btn-icon btn-rounded btn-soft-secondary btn-xs btn-list-task"
                            data-bs-toggle="tooltip" data-bs-placement="bottom" title="Task assigned list"
                        >
                            <span class="icon"><i class="fas fa-ellipsis-h"></i></span>
                        </button>
                    </div>
                </div>`
    }
}