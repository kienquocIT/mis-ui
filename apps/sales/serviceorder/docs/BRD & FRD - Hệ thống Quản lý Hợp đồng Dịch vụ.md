# BRD & FRD - Hệ thống Quản lý Hợp đồng Dịch vụ

## 1. TỔNG QUAN NGHIỆP VỤ (Business Overview)

### 1.1. Bối cảnh kinh doanh
Hệ thống quản lý hợp đồng dịch vụ được thiết kế để quản lý toàn diện quy trình từ ký kết hợp đồng, triển khai thực hiện, theo dõi tiến độ, thanh toán và hoàn tất. Đặc biệt phù hợp cho các doanh nghiệp cung cấp dịch vụ logistics, vận tải, hoặc các dịch vụ phức tạp cần theo dõi nhiều công đoạn.

### 1.2. Mục tiêu nghiệp vụ
- **Quản lý tập trung**: Thông tin hợp đồng, dịch vụ, công việc trong một hệ thống
- **Theo dõi tiến độ**: Real-time tracking tiến độ thực hiện qua work orders và tasks
- **Kiểm soát tài chính**: Quản lý thanh toán theo mốc, chi phí phát sinh, đối soát công nợ
- **Tối ưu quy trình**: Tự động hóa phân công việc, tính toán tiến độ, cảnh báo deadline

### 1.3. Phạm vi chức năng
1. Thiết lập thông tin hàng hoá dịch vụ cung cấp cho khách hàng theo Hợp đồng (Product/service items)
2. Thiết lập các Công việc chính (Work order) để thực hiện Hợp đồng, giúp theo dõi tiến trình công việc, chi phí phát sinh
3. Lập các đợt thanh toán theo Hợp đồng
4. Quản lý lô hàng vận chuyển (cho logistics)
5. Phân công và giám sát tasks

## 2. YÊU CẦU NGHIỆP VỤ CHI TIẾT (Detailed Business Requirements)

### 2.1. Quy trình nghiệp vụ chính

```mermaid
graph LR
    A[Khởi tạo HĐ] --> B[Khai báo dịch vụ]
    B --> C[Lập Work Orders]
    C --> D[Phân công Tasks]
    D --> E[Thực hiện]
    E --> F[Giao hàng/Bàn giao]
    F --> G[Thanh toán]
    G --> H[Hoàn tất HĐ]
```

### 2.2. Ma trận trạng thái

| Entity | Trạng thái | Điều kiện chuyển |
|--------|------------|------------------|
| Contract | Open → In Progress | Có ít nhất 1 work order |
| Contract | In Progress → Completed | Tất cả work orders completed |
| Work Order | Pending → In Progress | Task được assign và bắt đầu |
| Work Order | In Progress → Completed | Tất cả tasks hoàn thành |
| Task | To do → In Progress | User bắt đầu thực hiện |
| Task | In Progress → Completed | User xác nhận hoàn thành |

### 2.3. Vai trò và phân quyền

| Vai trò | Quyền hạn |
|---------|-----------|
| Sales Manager | Tạo/sửa hợp đồng, dịch vụ, payment milestones |
| Operation Manager | Tạo/sửa work orders, assign tasks, update shipment |
| Accountant | View all, update payment status, export invoices |
| Worker | View assigned tasks, update task status |

## 3. YÊU CẦU CHỨC NĂNG (Functional Requirements)

### 3.1. Quản lý Hợp đồng (Contract Management)

#### 3.1.1. Tạo/Sửa hợp đồng
**Input:**
- Thông tin khách hàng (dropdown từ master data)
- Mô tả hợp đồng (text)
- Thời hạn hợp đồng (date range picker)
- Trạng thái (auto set = "Open" khi tạo mới)

**Process:**
- Generate mã hợp đồng tự động: Format "SO" + YYMM + 3 số sequence
- Validate thời hạn: end_date >= start_date
- Lưu created_date = system date

**Output:**
- Contract record với status = "Open"
- Redirect đến màn hình chi tiết để khai báo services

#### 3.1.2. Khai báo dịch vụ (Service Detail Tab)

**UI Components:**
```typescript
interface ServiceDetailGrid {
  columns: [
    { field: 'code', header: 'Code', width: '10%', editable: false },
    { field: 'name', header: 'Name', width: '20%', editable: false },
    { field: 'description', header: 'Description', width: '25%', editable: true },
    { field: 'quantity', header: 'Quantity', width: '10%', editable: true, type: 'number' },
    { field: 'unit', header: 'Unit', width: '8%', editable: false },
    { field: 'price', header: 'Price', width: '12%', editable: true, type: 'currency' },
    { field: 'tax', header: 'Tax', width: '8%', editable: true, type: 'percentage' },
    { field: 'totalAmount', header: 'Total amount', width: '15%', editable: false, calculated: true },
    { field: 'actions', header: '', width: '5%', type: 'actions', actions: ['delete'] }
  ]
}
```

**Add Service Popup:**
- Load danh sách từ `ServiceOrProduct WHERE item_type = 'service' AND ownership = 'internal'`
- Multi-select với checkbox
- Search/filter by code hoặc name
- Pagination nếu > 20 records

**Business Rules:**
- Khi chọn service: auto fill code, name, unit, default price
- Cho phép sửa price, quantity, tax sau khi add
- Total amount = quantity × price × (1 + tax/100)
- Tự động tính lại total khi thay đổi quantity/price/tax

### 3.2. Quản lý Work Orders

#### 3.2.1. Tạo Work Order

**Menu Options:**
1. **Item**: Chọn từ danh mục `ServiceOrProduct`
2. **Non-Item**: Nhập tự do text

**Form Fields:**
```typescript
interface WorkOrderForm {
  // Basic info
  code: string;              // Auto hoặc manual input
  description: string;       // Required
  assignee: {               // Employee dropdown
    id: number;
    name: string;
    avatar: string;
  };
  
  // Planning
  startDate: Date;          // >= Contract.startDate
  endDate: Date;            // <= Contract.endDate
  quantity: number;         // Default = 1
  
  // Service delivery
  isServiceDelivery: boolean;
  deliveryConfig?: {
    services: Array<{
      serviceId: number;
      serviceName: string;
      contribution: number;  // 0-100%
      deliveryQuantity?: number;
    }>;
  };
  
  // Cost
  unitCost: number;         // Calculated từ cost details
  costDetails: Array<{
    description: string;
    quantity: number;
    unitCost: number;
    currency: string;      // Default = 'VND'
    taxRate: number;       // Default = 0
    totalAmount: number;   // = quantity × unitCost × (1 + taxRate/100)
    totalAmountVND: number; // Quy đổi về VND
    note: string;
  }>;
}
```

#### 3.2.2. Service Contribution Configuration

**Validation:**
```javascript
// Tổng contribution của tất cả WO cho 1 service không được > 100%
function validateContribution(serviceId, allWorkOrders, currentContribution) {
  const totalExisting = allWorkOrders
    .filter(wo => wo.id !== currentWorkOrder.id)
    .reduce((sum, wo) => {
      const contrib = wo.contributions.find(c => c.serviceId === serviceId);
      return sum + (contrib?.percentage || 0);
    }, 0);
  
  if (totalExisting + currentContribution > 100) {
    throw new Error(`Tổng contribution không được vượt quá 100%. Đã sử dụng: ${totalExisting}%`);
  }
}
```

#### 3.2.3. Work Order Cost Details

**Multi-currency Support:**
- Cho phép nhập chi phí bằng nhiều loại tiền
- Sử dụng Exchange Rate từ bảng tỷ giá để quy đổi
- Hiển thị tổng bằng VND (primary currency)

**Popup Structure:**
```typescript
interface CostDetailPopup {
  header: 'Chi phí phát sinh cho công việc (Work order cost)';
  grid: {
    columns: ['Description', 'Quantity', 'Unit cost', 'Currency', 'Tax', 'Total Amount', 'Note'];
    addRow: boolean;
    deleteRow: boolean;
  };
  footer: {
    totalInVND: number; // Sum of all rows converted to VND
  };
}
```

### 3.3. Task Management

#### 3.3.1. Tạo Task từ Work Order

**Trigger:** Click "..." ở cột Assignee của Work Order

**Auto-fill Data:**
- Description = Work Order description
- Service Order Code = Contract code
- Work Order = Current WO name
- Task Code = Auto generate (format: TSK + number)
- Status = "To do"
- Start Day = Work Order start date
- Assigner = Current user

**Additional Fields:**
- Assign To: Employee dropdown (required)
- Priority: High/Medium/Low
- Estimate: Duration in hours
- Sale/Project Code: Optional reference
- Label: Tags for categorization

#### 3.3.2. Task Tracking (Task Tab)

**View Modes:**

1. **List View:**
   - Table format với columns: Task name, Status, Assignee, Due date, Work order
   - Inline status update
   - Filter by status, assignee, date range

2. **Kanban View:**
   - Columns: To do, In progress, Completed, Pending
   - Drag & drop để chuyển status
   - Card info: Title, Assignee avatar, Progress (subtasks), Due date
   - Quick add task button trên mỗi column

### 3.4. Shipment Management (Logistics Module)

#### 3.4.1. Container Management

**Add Container Form:**
```typescript
interface ContainerForm {
  description: string;      // e.g., "Container 1"
  type: string;            // Dropdown: '40ft', '20ft', 'LCL'
  referenceNumber: string; // e.g., "CONT1"
  weight: number;          // Tấn
  dimension: string;       // e.g., "40ft" hoặc "12x2.5x2.5m"
  note: string;
}
```

#### 3.4.2. Package Management

**Add Package - phải chọn Container trước:**
```typescript
interface PackageForm {
  description: string;      // e.g., "Kiện số 1 - Container 1"
  type: string;            // Dropdown: 'Carton', 'Pallet', 'Wood', 'Bulk'
  container: string;       // Dropdown các containers đã tạo
  referenceNumber: string; // e.g., "PKG001"
  weight: number;          // Kg
  dimension: string;       // e.g., "2m³"
  note: string;
}
```

**Display Structure:**
- Tree view với Container là node cha
- Packages là node con
- Expand/Collapse functionality
- Icon phân biệt Container vs Package

#### 3.4.3. Link Package với Work Order

**Business Rule:** Chỉ link được khi Work Order có `is_service_delivery = true`

**Select Transported Items Popup:**
- Hiển thị tree structure của Container/Package
- Checkbox multi-select
- Chỉ được chọn Package, không chọn Container level
- Show selected count ở footer

### 3.5. Payment Management

#### 3.5.1. Payment Milestone Structure

**Installment Types:**
1. **Advance Payment:** Tạm ứng trước khi thực hiện
2. **Payment:** Thanh toán theo tiến độ/hoàn thành

**Form Fields:**
```typescript
interface PaymentMilestone {
  installment: string;      // e.g., "Đợt 1", "Đợt 2"
  description: string;      // e.g., "Tạm ứng 30% HĐ"
  paymentType: 'advance' | 'payment';
  isInvoiced: boolean;      // Có xuất hóa đơn không
  dueDate: Date;
  
  // Payment value calculation
  paymentValue: number;     // Trước thuế
  vatAmount: number;        // Thuế VAT
  reconcileValue: number;   // Cấn trừ tạm ứng
  receivableValue: number;  // = paymentValue + vatAmount - reconcileValue
}
```

#### 3.5.2. Payment Detail Configuration

**Case 1: Không xuất hóa đơn (Non-invoiced)**
```typescript
interface NonInvoicedPaymentDetail {
  services: Array<{
    serviceId: number;
    serviceName: string;
    totalBeforeTax: number;
    percentage?: number;    // Nhập % hoặc value
    value?: number;         // Tự tính nếu nhập %
  }>;
}
```

**Case 2: Có xuất hóa đơn (Invoiced)**
```typescript
interface InvoicedPaymentDetail {
  services: Array<{
    serviceId: number;
    serviceName: string;
    totalBeforeTax: number;
    issuedInvoice: number;  // Đã xuất HĐ trước đó
    balance: number;        // Còn lại chưa xuất
    thisTimePercent?: number;
    thisTimeValue?: number;
    vatType: string;        // 'VAT 0', 'VAT 5', 'VAT 10'
    vatAmount: number;      // Auto calculate
  }>;
}
```

#### 3.5.3. Advance Payment Reconciliation

**Find Available Advances:**
```sql
SELECT * FROM PaymentMilestone 
WHERE contract_id = :contractId 
  AND payment_type = 'advance' 
  AND is_invoiced = false
  AND payment_date < :currentPaymentDate
  AND (payment_value - reconciled_amount) > 0
```

**Reconciliation Rules:**
- Chỉ reconcile với advance chưa xuất hóa đơn
- Tổng reconcile không vượt quá số dư advance
- Update số dư advance sau khi reconcile
- Track reconciliation history

### 3.6. Exchange Rate Management

**Exchange Rate Popup:**
```typescript
interface ExchangeRateManager {
  autoUpdate: boolean;      // Toggle auto fetch rates
  rates: Array<{
    code: string;           // 'USD', 'EUR', 'JPY'
    name: string;           // 'US Dollar', 'EURO'
    selling: number;        // Tỷ giá bán
    editable: boolean;      // Allow manual edit
  }>;
  
  actions: {
    save: () => void;       // Save to database
    close: () => void;
  };
}
```

**Usage:**
- Work Order costs với multi-currency
- Payment calculations
- Report tổng hợp

## 4. DATABASE SCHEMA

### 4.1. Core Tables

```sql
-- Hợp đồng dịch vụ
CREATE TABLE Contract (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contract_code VARCHAR(20) UNIQUE NOT NULL, -- Format: SOYYMMNNN
  description TEXT,
  customer_id INT NOT NULL,
  customer_name VARCHAR(255), -- Denormalized for performance
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('Open', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Open',
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  updated_date TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by INT,
  FOREIGN KEY (customer_id) REFERENCES Customer(id),
  INDEX idx_status (status),
  INDEX idx_dates (start_date, end_date)
);

-- Chi tiết dịch vụ trong hợp đồng
CREATE TABLE ContractServiceItem (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contract_id INT NOT NULL,
  service_or_product_id INT NOT NULL,
  code VARCHAR(20),
  name VARCHAR(255),
  description TEXT,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit VARCHAR(50),
  price DECIMAL(18,2) NOT NULL,
  vat_rate INT DEFAULT 10, -- Percentage
  total_amount DECIMAL(18,2) GENERATED ALWAYS AS (quantity * price * (1 + vat_rate/100)) STORED,
  display_order INT DEFAULT 0,
  FOREIGN KEY (contract_id) REFERENCES Contract(id) ON DELETE CASCADE,
  FOREIGN KEY (service_or_product_id) REFERENCES ServiceOrProduct(id),
  INDEX idx_contract (contract_id)
);

-- Work Orders
CREATE TABLE ContractWorkOrder (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contract_id INT NOT NULL,
  code VARCHAR(20),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  assignee_id INT,
  is_delivery_point BOOLEAN DEFAULT FALSE,
  quantity DECIMAL(10,2) DEFAULT 1,
  unit_cost DECIMAL(18,2) DEFAULT 0, -- Calculated từ costs
  total_amount DECIMAL(18,2) DEFAULT 0,
  status ENUM('Pending', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Pending',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contract_id) REFERENCES Contract(id) ON DELETE CASCADE,
  FOREIGN KEY (assignee_id) REFERENCES Employee(id),
  INDEX idx_status (status),
  INDEX idx_assignee (assignee_id)
);

-- Work Order đóng góp vào Service
CREATE TABLE WorkOrderContribution (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contract_work_order_id INT NOT NULL,
  contract_service_item_id INT NOT NULL,
  percentage INT NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  delivery_quantity DECIMAL(10,2),
  total_balance DECIMAL(18,2),
  FOREIGN KEY (contract_work_order_id) REFERENCES ContractWorkOrder(id) ON DELETE CASCADE,
  FOREIGN KEY (contract_service_item_id) REFERENCES ContractServiceItem(id) ON DELETE CASCADE,
  UNIQUE KEY unique_wo_service (contract_work_order_id, contract_service_item_id)
);

-- Chi phí Work Order
CREATE TABLE WorkOrderCost (
  id INT PRIMARY KEY AUTO_INCREMENT,
  work_order_id INT NOT NULL,
  description VARCHAR(255) NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 1,
  unit_cost DECIMAL(18,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'VND',
  tax_rate INT DEFAULT 0,
  tax_amount DECIMAL(18,2) GENERATED ALWAYS AS (quantity * unit_cost * tax_rate/100) STORED,
  total_amount DECIMAL(18,2) GENERATED ALWAYS AS (quantity * unit_cost * (1 + tax_rate/100)) STORED,
  exchange_rate DECIMAL(10,4) DEFAULT 1,
  total_amount_vnd DECIMAL(18,2),
  note TEXT,
  FOREIGN KEY (work_order_id) REFERENCES ContractWorkOrder(id) ON DELETE CASCADE
);
```

### 4.2. Task Management Tables

```sql
-- Task assignments
CREATE TABLE TaskAssignment (
  id INT PRIMARY KEY AUTO_INCREMENT,
  task_code VARCHAR(20) UNIQUE NOT NULL,
  work_order_id INT NOT NULL,
  contract_id INT NOT NULL,
  description TEXT,
  assigner_id INT NOT NULL,
  assignee_id INT NOT NULL,
  status ENUM('To do', 'In progress', 'Completed', 'Pending') DEFAULT 'To do',
  priority ENUM('High', 'Medium', 'Low') DEFAULT 'Medium',
  start_date DATETIME,
  end_date DATE,
  estimate_hours DECIMAL(5,2),
  actual_hours DECIMAL(5,2),
  project_code VARCHAR(50),
  labels JSON, -- Array of label strings
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_date TIMESTAMP NULL,
  FOREIGN KEY (work_order_id) REFERENCES ContractWorkOrder(id),
  FOREIGN KEY (contract_id) REFERENCES Contract(id),
  FOREIGN KEY (assigner_id) REFERENCES Employee(id),
  FOREIGN KEY (assignee_id) REFERENCES Employee(id),
  INDEX idx_assignee_status (assignee_id, status),
  INDEX idx_work_order (work_order_id)
);

-- Task subtasks
CREATE TABLE TaskSubtask (
  id INT PRIMARY KEY AUTO_INCREMENT,
  task_id INT NOT NULL,
  description VARCHAR(255),
  is_completed BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  FOREIGN KEY (task_id) REFERENCES TaskAssignment(id) ON DELETE CASCADE
);
```

### 4.3. Payment Tables

```sql
-- Payment milestones
CREATE TABLE PaymentMilestone (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contract_id INT NOT NULL,
  installment_code VARCHAR(50) NOT NULL,
  description TEXT,
  payment_type ENUM('advance', 'payment') DEFAULT 'payment',
  is_invoiced BOOLEAN DEFAULT FALSE,
  payment_value DECIMAL(18,2) NOT NULL,
  vat_amount DECIMAL(18,2) DEFAULT 0,
  reconcile_value DECIMAL(18,2) DEFAULT 0,
  receivable_value DECIMAL(18,2) GENERATED ALWAYS AS (payment_value + vat_amount - reconcile_value) STORED,
  due_date DATE,
  payment_date DATE,
  status ENUM('Pending', 'Partial', 'Paid', 'Overdue') DEFAULT 'Pending',
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contract_id) REFERENCES Contract(id) ON DELETE CASCADE,
  INDEX idx_contract_type (contract_id, payment_type),
  INDEX idx_due_date (due_date)
);

-- Payment details theo service
CREATE TABLE PaymentServiceDetail (
  id INT PRIMARY KEY AUTO_INCREMENT,
  payment_milestone_id INT NOT NULL,
  contract_service_item_id INT NOT NULL,
  percentage DECIMAL(5,2),
  value DECIMAL(18,2),
  invoiced_amount DECIMAL(18,2),
  vat_type VARCHAR(20),
  vat_amount DECIMAL(18,2),
  FOREIGN KEY (payment_milestone_id) REFERENCES PaymentMilestone(id) ON DELETE CASCADE,
  FOREIGN KEY (contract_service_item_id) REFERENCES ContractServiceItem(id)
);

-- Reconciliation details
CREATE TABLE PaymentReconciliation (
  id INT PRIMARY KEY AUTO_INCREMENT,
  payment_milestone_id INT NOT NULL, -- Payment being reconciled
  advance_payment_id INT NOT NULL,    -- Advance payment to reconcile from
  reconcile_amount DECIMAL(18,2) NOT NULL,
  reconcile_date DATE NOT NULL,
  note TEXT,
  FOREIGN KEY (payment_milestone_id) REFERENCES PaymentMilestone(id),
  FOREIGN KEY (advance_payment_id) REFERENCES PaymentMilestone(id)
);
```

### 4.4. Shipment Tables (Logistics)

```sql
-- Containers
CREATE TABLE Container (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contract_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50), -- '40ft', '20ft', 'LCL'
  reference_number VARCHAR(100) UNIQUE,
  weight DECIMAL(10,2), -- Tấn
  dimension VARCHAR(100),
  note TEXT,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contract_id) REFERENCES Contract(id) ON DELETE CASCADE
);

-- Transported items (both containers and packages)
CREATE TABLE TransportedItem (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contract_id INT NOT NULL,
  container_id INT, -- NULL for container level items
  item_type ENUM('Container', 'Package') NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50), -- 'Carton', 'Pallet', 'Wood', 'Bulk'
  package_ref VARCHAR(100),
  weight DECIMAL(10,2),
  dimensions VARCHAR(100),
  status ENUM('at_port', 'in_transit', 'delivered', 'damaged', 'rejected') DEFAULT 'at_port',
  note TEXT,
  FOREIGN KEY (contract_id) REFERENCES Contract(id),
  FOREIGN KEY (container_id) REFERENCES Container(id) ON DELETE CASCADE,
  INDEX idx_container (container_id),
  INDEX idx_status (status)
);

-- Link transported items to work orders
CREATE TABLE WorkOrderTransportedItem (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contract_work_order_id INT NOT NULL,
  transported_item_id INT NOT NULL,
  quantity_assigned INT DEFAULT 1,
  assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contract_work_order_id) REFERENCES ContractWorkOrder(id),
  FOREIGN KEY (transported_item_id) REFERENCES TransportedItem(id),
  UNIQUE KEY unique_wo_item (contract_work_order_id, transported_item_id)
);
```

### 4.5. Supporting Tables

```sql
-- Exchange rates
CREATE TABLE ExchangeRate (
  id INT PRIMARY KEY AUTO_INCREMENT,
  currency_code VARCHAR(10) NOT NULL,
  currency_name VARCHAR(50),
  selling_rate DECIMAL(10,4) NOT NULL,
  buying_rate DECIMAL(10,4),
  effective_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_currency_date (currency_code, effective_date)
);

-- File attachments
CREATE TABLE ContractAttachment (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contract_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500),
  file_size INT,
  file_type VARCHAR(50),
  uploaded_by INT,
  uploaded_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contract_id) REFERENCES Contract(id) ON DELETE CASCADE
);

-- Expense tracking
CREATE TABLE ContractExpense (
  id INT PRIMARY KEY AUTO_INCREMENT,
  contract_id INT NOT NULL,
  expense_date DATE NOT NULL,
  description VARCHAR(255),
  amount DECIMAL(18,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'VND',
  category VARCHAR(50),
  reference_number VARCHAR(50),
  note TEXT,
  created_by INT,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contract_id) REFERENCES Contract(id) ON DELETE CASCADE
);
```

## 5. API SPECIFICATIONS

### 5.1. Contract APIs

```typescript
// Get contract detail with all related data
GET /api/contracts/{id}
Response: {
  contract: Contract,
  serviceItems: ContractServiceItem[],
  workOrders: ContractWorkOrder[],
  payments: PaymentMilestone[],
  tasks: TaskAssignment[],
  containers?: Container[],
  expenses?: ContractExpense[],
  attachments?: ContractAttachment[]
}

// Create/Update contract
POST /api/contracts
PUT /api/contracts/{id}
Body: {
  description: string,
  customerId: number,
  startDate: string,
  endDate: string,
  serviceItems: [{
    serviceId: number,
    quantity: number,
    price: number,
    vatRate: number,
    description?: string
  }]
}

// Update contract status
PATCH /api/contracts/{id}/status
Body: {
  status: 'In Progress' | 'Completed' | 'Cancelled',
  reason?: string
}
```

### 5.2. Work Order APIs

```typescript
// Create work order with costs and contributions
POST /api/contracts/{contractId}/work-orders
Body: {
  code?: string,
  name: string,
  description?: string,
  assigneeId?: number,
  isDeliveryPoint: boolean,
  startDate: string,
  endDate: string,
  contributions: [{
    serviceItemId: number,
    percentage: number,
    deliveryQuantity?: number
  }],
  costs: [{
    description: string,
    quantity: number,
    unitCost: number,
    currency: string,
    taxRate: number,
    note?: string
  }]
}

// Update work order status
PATCH /api/work-orders/{id}/status
Body: {
  status: 'In Progress' | 'Completed' | 'Cancelled'
}

// Link transported items
POST /api/work-orders/{id}/transported-items
Body: {
  itemIds: number[]
}
```

### 5.3. Task APIs

```typescript
// Create task from work order
POST /api/work-orders/{workOrderId}/tasks
Body: {
  assigneeId: number,
  priority: 'High' | 'Medium' | 'Low',
  endDate: string,
  estimateHours?: number,
  projectCode?: string,
  labels?: string[]
}

// Update task status
PATCH /api/tasks/{id}/status
Body: {
  status: 'In progress' | 'Completed' | 'Pending'
}

// Get tasks by view
GET /api/contracts/{contractId}/tasks?view=list|kanban
```

### 5.4. Payment APIs

```typescript
// Create payment milestone
POST /api/contracts/{contractId}/payments
Body: {
  installmentCode: string,
  description: string,
  paymentType: 'advance' | 'payment',
  isInvoiced: boolean,
  dueDate: string,
  serviceDetails: [{
    serviceItemId: number,
    percentage?: number,
    value?: number,
    vatType?: string
  }],
  reconciliations?: [{
    advancePaymentId: number,
    amount: number
  }]
}

// Get available advance payments for reconciliation
GET /api/contracts/{contractId}/advance-payments?available=true
```

## 6. BUSINESS RULES & VALIDATIONS

### 6.1. Contract Level Rules

```javascript
const contractValidations = {
  // Rule 1: Date validation
  dateRange: (contract) => {
    if (contract.endDate < contract.startDate) {
      throw new Error('End date must be after start date');
    }
  },

  // Rule 2: Status transition
  statusTransition: (currentStatus, newStatus) => {
    const allowed = {
      'Open': ['In Progress', 'Cancelled'],
      'In Progress': ['Completed', 'Cancelled'],
      'Completed': [],
      'Cancelled': []
    };
    
    if (!allowed[currentStatus].includes(newStatus)) {
      throw new Error(`Cannot change status from ${currentStatus} to ${newStatus}`);
    }
  },

  // Rule 3: Completion check
  canComplete: (contract) => {
    const incompleteWOs = contract.workOrders.filter(wo => 
      wo.status !== 'Completed' && wo.status !== 'Cancelled'
    );
    
    if (incompleteWOs.length > 0) {
      throw new Error('All work orders must be completed before completing contract');
    }
  }
};
```

### 6.2. Work Order Rules

```javascript
const workOrderValidations = {
  // Rule 1: Date within contract range
  dateRange: (workOrder, contract) => {
    if (workOrder.startDate < contract.startDate || 
        workOrder.endDate > contract.endDate) {
      throw new Error('Work order dates must be within contract period');
    }
  },

  // Rule 2: Service contribution total
  contributionTotal: (serviceId, allWorkOrders) => {
    const total = allWorkOrders
      .flatMap(wo => wo.contributions)
      .filter(c => c.serviceItemId === serviceId)
      .reduce((sum, c) => sum + c.percentage, 0);
    
    if (total > 100) {
      throw new Error(`Total contribution for service ${serviceId} exceeds 100%`);
    }
  },

  // Rule 3: Delivery point validation
  deliveryValidation: (workOrder) => {
    if (workOrder.isDeliveryPoint && 
        (!workOrder.contributions || workOrder.contributions.length === 0)) {
      throw new Error('Delivery work order must have service contributions');
    }
  }
};
```

### 6.3. Payment Rules

```javascript
const paymentValidations = {
  // Rule 1: Total payment check
  totalPaymentValue: (payments, contractValue) => {
    const total = payments.reduce((sum, p) => sum + p.paymentValue, 0);
    if (total > contractValue * 1.1) { // Allow 10% variance
      throw new Error('Total payment exceeds contract value by more than 10%');
    }
  },

  // Rule 2: Reconciliation validation
  reconciliationCheck: (reconcileItems, advancePayments) => {
    reconcileItems.forEach(item => {
      const advance = advancePayments.find(p => p.id === item.advancePaymentId);
      if (!advance) {
        throw new Error('Invalid advance payment for reconciliation');
      }
      if (advance.isInvoiced) {
        throw new Error('Cannot reconcile invoiced advance payment');
      }
      const available = advance.paymentValue - advance.reconciledAmount;
      if (item.amount > available) {
        throw new Error(`Reconcile amount exceeds available balance`);
      }
    });
  },

  // Rule 3: Invoice requirement
  invoiceCheck: (payment) => {
    if (payment.paymentType === 'payment' && !payment.isInvoiced) {
      console.warn('Regular payment should typically have invoice');
    }
  }
};
```

### 6.4. Task Management Rules

```javascript
const taskValidations = {
  // Rule 1: Task completion affects work order
  onTaskComplete: async (task) => {
    const workOrder = await getWorkOrder(task.workOrderId);
    const allTasks = await getWorkOrderTasks(task.workOrderId);
    
    if (allTasks.every(t => t.status === 'Completed')) {
      await updateWorkOrderStatus(task.workOrderId, 'Completed');
    }
  },

  // Rule 2: Assignment validation
  assignmentCheck: (task) => {
    if (!task.assigneeId) {
      throw new Error('Task must be assigned to someone');
    }
    if (task.endDate < new Date()) {
      console.warn('Task end date is in the past');
    }
  }
};
```

## 7. UI/UX SPECIFICATIONS

### 7.1. Grid Components

```typescript
// Reusable grid configuration
interface GridConfig {
  columns: ColumnDef[];
  data: any[];
  editable: boolean;
  pagination: {
    enabled: boolean;
    pageSize: number;
    pageSizeOptions: number[];
  };
  selection: {
    mode: 'single' | 'multiple' | 'none';
    showCheckbox: boolean;
  };
  actions: {
    add: boolean;
    edit: boolean;
    delete: boolean;
    custom?: CustomAction[];
  };
  features: {
    sorting: boolean;
    filtering: boolean;
    grouping: boolean;
    export: boolean;
  };
}

// Column definition
interface ColumnDef {
  field: string;
  header: string;
  type: 'string' | 'number' | 'date' | 'currency' | 'percentage' | 'boolean' | 'actions';
  width?: string;
  editable?: boolean;
  required?: boolean;
  format?: string; // For date/number formatting
  validate?: (value: any, row: any) => string | null;
  cellRenderer?: (value: any, row: any) => string | ReactElement;
}
```

### 7.2. Form Components

```typescript
// Dynamic form builder
interface FormConfig {
  layout: 'vertical' | 'horizontal' | 'grid';
  columns?: number; // For grid layout
  sections: FormSection[];
  validation: 'onBlur' | 'onChange' | 'onSubmit';
  actions: {
    submit: {
      label: string;
      icon?: string;
      variant: 'primary' | 'secondary';
    };
    cancel: {
      label: string;
      action: () => void;
    };
    custom?: FormAction[];
  };
}

interface FormSection {
  title?: string;
  collapsible?: boolean;
  fields: FormField[];
}

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'textarea';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: SelectOption[]; // For select/multiselect
  validation?: ValidationRule[];
  dependsOn?: {
    field: string;
    condition: (value: any) => boolean;
  };
}
```

### 7.3. Modal/Popup Specifications

```typescript
interface ModalConfig {
  title: string;
  size: 'small' | 'medium' | 'large' | 'fullscreen';
  closeOnEscape: boolean;
  closeOnOverlayClick: boolean;
  showCloseButton: boolean;
  content: {
    type: 'form' | 'grid' | 'custom';
    config: FormConfig | GridConfig | ReactElement;
  };
  footer: {
    align: 'left' | 'center' | 'right';
    actions: ModalAction[];
  };
}
```

## 8. SAMPLE DATA & TEST SCENARIOS

### 8.1. Sample Contract Creation

```json
{
  "testScenario": "Create logistics service contract",
  "input": {
    "contract": {
      "description": "Vận chuyển lô hàng 2cont Rotterdam-Cát Lái",
      "customerId": 123,
      "customerName": "Công ty CP đầu tư ABC",
      "startDate": "2025-04-28",
      "endDate": "2025-05-05"
    },
    "services": [
      {
        "serviceId": 1,
        "code": "LS01",
        "name": "Dịch vụ logistic đường biển",
        "quantity": 1,
        "unit": "Gói",
        "price": 50000000,
        "vatRate": 10,
        "description": "Chuyển 2 cont từ Rotterdam về Cát Lái"
      },
      {
        "serviceId": 4,
        "code": "LS04",
        "name": "Dịch vụ lưu kho",
        "quantity": 1,
        "unit": "Gói",
        "price": 6000000,
        "vatRate": 10,
        "description": "KH lưu kho 4 kiện thuộc container 2"
      }
    ]
  },
  "expectedOutput": {
    "contractCode": "SO250401",
    "status": "Open",
    "totalValue": 61600000
  }
}
```

### 8.2. Work Order with Multi-currency Cost

```json
{
  "testScenario": "Create work order with USD costs",
  "input": {
    "workOrder": {
      "contractId": 1,
      "name": "Thủ tục hải quan Rotterdam",
      "assigneeId": 5,
      "isDeliveryPoint": false,
      "startDate": "2025-04-28",
      "endDate": "2025-04-30"
    },
    "contributions": [
      {
        "serviceItemId": 1,
        "percentage": 30
      }
    ],
    "costs": [
      {
        "description": "Chi phí hải quan Rotterdam",
        "quantity": 1,
        "unitCost": 200,
        "currency": "USD",
        "taxRate": 0
      },
      {
        "description": "Chi phí bốc container lên tàu",
        "quantity": 1,
        "unitCost": 300,
        "currency": "USD",
        "taxRate": 0
      }
    ]
  },
  "exchangeRate": {
    "USD": 25960
  },
  "expectedOutput": {
    "totalCostVND": 12980000,
    "workOrderStatus": "Pending"
  }
}
```

### 8.3. Payment with Reconciliation

```json
{
  "testScenario": "Create payment with advance reconciliation",
  "setup": {
    "existingAdvancePayment": {
      "id": 1,
      "installmentCode": "Đợt 1",
      "paymentType": "advance",
      "isInvoiced": false,
      "paymentValue": 16800000,
      "reconciledAmount": 0
    }
  },
  "input": {
    "payment": {
      "contractId": 1,
      "installmentCode": "Đợt 2",
      "description": "Thanh toán vận chuyển",
      "paymentType": "payment",
      "isInvoiced": true,
      "dueDate": "2025-10-15",
      "paymentValue": 35000000,
      "vatAmount": 3500000
    },
    "reconciliations": [
      {
        "advancePaymentId": 1,
        "amount": 15000000
      }
    ]
  },
  "expectedOutput": {
    "receivableValue": 23500000,
    "advanceRemainingBalance": 1800000
  }
}
```

## 9. ERROR HANDLING & MESSAGES

### 9.1. Validation Messages

```typescript
const ValidationMessages = {
  // Required fields
  required: (field: string) => `${field} là bắt buộc`,
  
  // Date validations
  dateRange: {
    invalid: 'Ngày kết thúc phải sau ngày bắt đầu',
    outsideContract: 'Ngày phải nằm trong khoảng thời gian hợp đồng',
    pastDue: 'Ngày đã quá hạn'
  },
  
  // Business rules
  contribution: {
    exceeds100: (current: number) => `Tổng contribution vượt quá 100%. Hiện tại: ${current}%`,
    noService: 'Phải chọn ít nhất 1 dịch vụ để đóng góp'
  },
  
  payment: {
    exceedsContract: 'Tổng thanh toán vượt quá giá trị hợp đồng',
    invalidReconcile: 'Số tiền cấn trừ vượt quá số dư tạm ứng',
    noInvoice: 'Thanh toán chính thức cần có hóa đơn'
  },
  
  status: {
    invalidTransition: (from: string, to: string) => 
      `Không thể chuyển trạng thái từ ${from} sang ${to}`,
    hasIncomplete: 'Còn công việc chưa hoàn thành'
  }
};
```

### 9.2. API Error Responses

```typescript
interface APIError {
  code: string;
  message: string;
  field?: string;
  details?: any;
}

const ErrorCodes = {
  // Validation errors (400)
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_DATE_RANGE: 'INVALID_DATE_RANGE',
  EXCEEDS_LIMIT: 'EXCEEDS_LIMIT',
  
  // Business logic errors (422)
  INVALID_STATUS_TRANSITION: 'INVALID_STATUS_TRANSITION',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  
  // System errors (500)
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR'
};
```

## 10. PERFORMANCE REQUIREMENTS

### 10.1. Response Time Requirements

| Operation | Target Time |
|-----------|-------------|
| Load contract detail | < 2 seconds |
| Save contract/work order | < 3 seconds |
| Search/filter in grid | < 1 second |
| Generate report | < 5 seconds |

### 10.2. Data Volume Expectations

- Contracts per year: ~5,000
- Work orders per contract: 5-20
- Tasks per work order: 1-5
- Concurrent users: 50-100

### 10.3. Optimization Strategies

1. **Database:**
   - Proper indexing on foreign keys and search fields
   - Denormalize frequently accessed data (e.g., customer_name in Contract)
   - Use database views for complex queries

2. **API:**
   - Implement pagination for all list endpoints
   - Use field selection to reduce payload size
   - Cache exchange rates and master data

3. **UI:**
   - Lazy load tabs content
   - Virtual scrolling for large grids
   - Debounce search inputs

## 11. SECURITY REQUIREMENTS

### 11.1. Authentication & Authorization

```typescript
interface UserPermissions {
  contract: {
    create: boolean;
    edit: boolean;
    delete: boolean;
    view: boolean;
  };
  workOrder: {
    create: boolean;
    edit: boolean;
    assignTask: boolean;
  };
  payment: {
    create: boolean;
    approve: boolean;
    reconcile: boolean;
  };
}
```

### 11.2. Data Security

- Encrypt sensitive data (payment info)
- Audit trail for all modifications
- Role-based access control (RBAC)
- API rate limiting

## 12. DEPLOYMENT CONSIDERATIONS

### 12.1. Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=contract_management
DB_USER=app_user
DB_PASSWORD=encrypted_password

# API
API_BASE_URL=https://api.example.com
API_TIMEOUT=30000

# Exchange Rate Service
EXCHANGE_RATE_API_URL=https://api.exchangerate.com
EXCHANGE_RATE_API_KEY=your_api_key

# File Storage
UPLOAD_PATH=/var/uploads
MAX_FILE_SIZE=10485760
```

### 12.2. Monitoring & Logging

- Log all API requests/responses
- Monitor database query performance
- Track user actions for audit
- Alert on system errors

---

**Document Version:** 1.0  
**Last Updated:** January 2025  
**Status:** Ready for Development