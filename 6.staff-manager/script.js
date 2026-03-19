// Clase StaffMember 
class StaffMember {
    constructor(id, firstName, lastName, email, phone, salary, birthdate, photo = '') {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.salary = salary;
        this.birthdate = birthdate;
        this.photo = photo || 'https://ui-avatars.com/api/?name=' + firstName + '+' + lastName + '&size=200&background=2a5298&color=fff&bold=true';
    }
    
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    
    get formattedSalary() {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(this.salary);
    }
    
    get formattedBirthdate() {
        const date = new Date(this.birthdate);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    get age() {
        const today = new Date();
        const birth = new Date(this.birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }
}

// StaffManager 
class StaffManager {
    constructor() {
        this.staff = this.loadFromStorage();
    }
    
    generateId() {
        return this.staff.length > 0 ? Math.max(...this.staff.map(s => s.id)) + 1 : 1;
    }
    
    addStaff(member) {
        this.staff.push(member);
        this.saveToStorage();
    }
    
    removeStaff(id) {
        this.staff = this.staff.filter(s => s.id !== id);
        this.saveToStorage();
    }
    
    getAll() {
        return this.staff;
    }
    
    getTotalCount() {
        return this.staff.length;
    }
    
    saveToStorage() {
        localStorage.setItem('staffManager', JSON.stringify(this.staff));
    }
    
    loadFromStorage() {
        const data = localStorage.getItem('staffManager');
        if (data) {
            const parsed = JSON.parse(data);
            return parsed.map(s => new StaffMember(
                s.id, s.firstName, s.lastName, s.email, s.phone, s.salary, s.birthdate, s.photo
            ));
        }
        
        // Datos de ejemplo
        return [
            new StaffMember(1, 'Ana', 'García', 'ana.garcia@email.com', '+34 612 345 678', 45000, '1992-03-15', 'https://randomuser.me/api/portraits/women/44.jpg'),
            new StaffMember(2, 'Carlos', 'Rodríguez', 'carlos.rodriguez@email.com', '+34 623 456 789', 38000, '1988-07-22', 'https://randomuser.me/api/portraits/men/32.jpg'),
            new StaffMember(3, 'Laura', 'Martínez', 'laura.martinez@email.com', '+34 634 567 890', 52000, '1995-11-05', ''),
            new StaffMember(4, 'David', 'Sánchez', 'david.sanchez@email.com', '+34 645 678 901', 41000, '1991-09-12', 'https://randomuser.me/api/portraits/men/75.jpg')
        ];
    }
}

// Inicialización
const manager = new StaffManager();
const employeesGrid = document.getElementById('employeesGrid');
const totalEmployeesSpan = document.getElementById('totalEmployees');
const employeeForm = document.getElementById('employeeForm');

// Elementos del formulario
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const salaryInput = document.getElementById('salary');
const birthdateInput = document.getElementById('birthdate');
const photoInput = document.getElementById('photo');

//  Funciones de renderizado
function updateTotalCount() {
    totalEmployeesSpan.textContent = manager.getTotalCount();
}

function renderStaffGrid() {
    const staff = manager.getAll();
    
    if (staff.length === 0) {
        employeesGrid.innerHTML = '<div class="no-employees">✨ No hay empleados registrados. ¡Agrega el primero!</div>';
        return;
    }
    
    let html = '';
    staff.forEach(member => {
        html += `
            <div class="employee-card" data-id="${member.id}">
                <div class="employee-photo-container">
                    <img class="employee-photo" src="${member.photo}" alt="${member.fullName}" 
                         onerror="this.src='https://ui-avatars.com/api/?name=${member.firstName}+${member.lastName}&size=200&background=2a5298&color=fff&bold=true'">
                </div>
                <div class="employee-info">
                    <div class="employee-name">${member.fullName}</div>
                    <div class="employee-detail">
                        <span class="emoji">📧</span>
                        <span>${member.email}</span>
                    </div>
                    <div class="employee-detail">
                        <span class="emoji">📞</span>
                        <span>${member.phone}</span>
                    </div>
                    <div class="employee-detail">
                        <span class="emoji">💰</span>
                        <span>${member.formattedSalary}</span>
                    </div>
                    <div class="employee-detail">
                        <span class="emoji">🎂</span>
                        <span>${member.formattedBirthdate} (${member.age} años)</span>
                    </div>
                </div>
                <div class="employee-actions">
                    <button class="delete-btn" onclick="removeStaffMember(${member.id})">
                        <span class="emoji">🗑️</span> Eliminar
                    </button>
                </div>
            </div>
        `;
    });
    
    employeesGrid.innerHTML = html;
    updateTotalCount();
}

// Funciones CRUD
function addStaffMember(event) {
    event.preventDefault();
    
    // Validaciones
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const salary = parseFloat(salaryInput.value);
    const birthdate = birthdateInput.value;
    const photo = photoInput.value.trim();
    
    if (!firstName || !lastName || !email || !phone || isNaN(salary) || !birthdate) {
        alert('❌ Por favor, completa todos los campos obligatorios.');
        return;
    }
    
    // Validar email
    if (!email.includes('@') || !email.includes('.')) {
        alert('❌ Por favor, ingresa un email válido.');
        return;
    }
    
    // Validar teléfono (mínimo 8 dígitos)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 8) {
        alert('❌ Por favor, ingresa un teléfono válido (mínimo 8 dígitos).');
        return;
    }
    
    // Crear nuevo miembro
    const newId = manager.generateId();
    const newMember = new StaffMember(
        newId, firstName, lastName, email, phone, salary, birthdate, photo
    );
    
    manager.addStaff(newMember);
    
    // Limpiar formulario
    employeeForm.reset();
    
    // Actualizar vista
    renderStaffGrid();
    
    // Mensaje de éxito (opcional)
    alert(`✅ Empleado ${firstName} ${lastName} agregado correctamente.`);
}

function removeStaffMember(id) {
    if (confirm('¿Estás seguro de eliminar este empleado?')) {
        manager.removeStaff(id);
        renderStaffGrid();
    }
}

// Hacer accesible la función eliminar
window.removeStaffMember = removeStaffMember;

// Eventos
employeeForm.addEventListener('submit', addStaffMember);

// Inicializar vista 
renderStaffGrid();