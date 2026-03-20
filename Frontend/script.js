let products = []
let currentRole = ''

window.onload = async () => {
    // ── ตรวจ session ─────────────────────────────────────
    const session = requireAuth('')
    if (!session) return   // requireAuth จะ redirect ไป login.html เอง

    currentRole = session.role

    // ── แสดงข้อมูล user ใน sidebar ───────────────────────
    const initials = session.displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    document.getElementById('user-avatar').textContent = initials
    document.getElementById('user-name').textContent   = session.displayName
    document.getElementById('user-role').textContent   = session.role === 'admin' ? '👑 Admin' : '👤 User'

    // ── แสดงเมนู + UI ตาม role ───────────────────────────
    if (session.role === 'admin') {
        document.getElementById('nav-inventory').style.display   = ''
        document.getElementById('nav-history').style.display     = ''
        document.getElementById('nav-summary').style.display     = ''
        document.getElementById('btn-daily-summary').style.display = ''
        document.getElementById('section-add-product').style.display = ''
        document.getElementById('th-actions').style.display      = ''
    }

    await loadDashboard()
}

async function loadDashboard() {
    try {
        const res = await api.Products.getAll()
        products = res.data
        renderTable(products)
        updateStats()
        checkLowStock()
    } catch (err) {
        console.error('โหลดข้อมูลไม่สำเร็จ:', err)
    }
}

function renderTable(data) {
    const table = document.getElementById('product-table-body')
    table.innerHTML = ''
    if (data.length === 0) {
        table.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#888;">ไม่มีข้อมูลสินค้า</td></tr>'
        return
    }
    data.forEach(p => {
        const isLow = p.Quantity < p.Min_stock
        const status = isLow
            ? '<span class="badge badge-low">⚠ Low</span>'
            : '<span class="badge badge-ok">✔ OK</span>'

        // ปุ่ม Edit และ Delete โชว์เฉพาะ Admin
        const actionCell = currentRole === 'admin'
            ? `<td>
                <button class="btn-edit" onclick="openEditModal(${p.Products_id}, '${p.Product_name.replace(/'/g, "\\'")}', ${p.Quantity}, ${p.Min_stock})"><i class="fas fa-pen"></i> Edit</button>
                <button class="btn-delete" onclick="deleteItem(${p.Products_id})">Delete</button>
               </td>`
            : '<td style="display:none"></td>'

        table.innerHTML += `
        <tr class="${isLow ? 'row-low' : ''}">
            <td>${p.Product_name}</td>
            <td><strong>${p.Quantity}</strong></td>
            <td>${p.Min_stock}</td>
            <td>${status}</td>
            ${actionCell}
        </tr>`
    })
}

function exportCSV() {
    if (!products || products.length === 0) { alert('ไม่มีข้อมูลสินค้า'); return }
    const rows = [['Product Name', 'Stock', 'Min Stock', 'Status']]
    products.forEach(p => {
        rows.push([
            p.Product_name,
            p.Quantity,
            p.Min_stock,
            p.Quantity < p.Min_stock ? 'Low' : 'OK'
        ])
    })
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `StockPro_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
}

async function addItem() {
    const name  = document.getElementById('p-name').value.trim()
    const stock = document.getElementById('p-qty').value
    const min   = document.getElementById('p-min').value
    if (!name || stock === '' || min === '') { alert('Please fill all fields'); return }
    try {
        await api.Products.create({ Product_name: name, Quantity: Number(stock), Min_stock: Number(min) })
        document.getElementById('p-name').value = ''
        document.getElementById('p-qty').value  = ''
        document.getElementById('p-min').value  = ''
        await loadDashboard()
    } catch (err) {
        alert('เพิ่มสินค้าไม่สำเร็จ: ' + (err.response?.data?.message || err.message))
    }
}

async function deleteItem(productId) {
    const result = await Swal.fire({
        title: 'ยืนยันการลบ?',
        text: 'เมื่อลบแล้วจะไม่สามารถกู้คืนข้อมูลได้!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'ใช่, ลบเลย!',
        cancelButtonText: 'ยกเลิก'
    })

    if (!result.isConfirmed) return

    try {
        await api.Products.remove(productId)
        await loadDashboard()
        await Swal.fire({
            title: 'ลบสำเร็จ!',
            text: 'ลบสินค้าออกจากระบบแล้ว',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        })
    } catch (err) {
        Swal.fire('เกิดข้อผิดพลาด!', err.response?.data?.message || err.message, 'error')
    }
}

function updateStats() {
    setTimeout(updateStatGhost, 50)
    document.getElementById('stat-total').innerText = products.length
    const low = products.filter(p => p.Quantity < p.Min_stock)
    document.getElementById('stat-low').innerText = low.length
}

function checkLowStock() {
    const low    = products.filter(p => p.Quantity < p.Min_stock)
    const banner = document.getElementById('low-stock-alert')
    if (low.length > 0) {
        banner.style.display = 'flex'
        banner.innerHTML = `<i class="fas fa-exclamation-circle"></i> Low Stock Warning! (${low.length} item${low.length > 1 ? 's' : ''})`
    } else {
        banner.style.display = 'none'
    }
}

function filterProducts() {
    const kw = document.getElementById('search-input').value.toLowerCase()
    renderTable(products.filter(p => p.Product_name.toLowerCase().includes(kw)))
}

async function showDailySummary() {
    try {
        await api.Inventory.saveDailySummary()
        window.location.href = '/Frontend/pages/DailySummary/index.html'
    } catch (err) {
        console.warn('Save snapshot failed (non-critical):', err.message)
        window.location.href = './Frontend/pages/DailySummary/index.html'
    }
}

// update ghost number on stat cards
function updateStatGhost() {
    const t = document.getElementById('card-total')
    const l = document.getElementById('card-low')
    if (t) t.dataset.num = document.getElementById('stat-total').innerText
    if (l) l.dataset.num = document.getElementById('stat-low').innerText
}

// ══════════════════════════════════════
//  EDIT PRODUCT MODAL
// ══════════════════════════════════════
function openEditModal(id, name, qty, min) {
    document.getElementById('edit-id').value   = id
    document.getElementById('edit-name').value = name
    document.getElementById('edit-qty').value  = qty
    document.getElementById('edit-min').value  = min
    document.getElementById('edit-modal').style.display = 'flex'
    setTimeout(() => document.getElementById('edit-name').focus(), 100)
}

function closeEditModal(e) {
    if (e && e.target !== document.getElementById('edit-modal')) return
    document.getElementById('edit-modal').style.display = 'none'
}

// ปิด modal ด้วย ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') document.getElementById('edit-modal').style.display = 'none'
})

async function saveEdit() {
    const id   = document.getElementById('edit-id').value
    const name = document.getElementById('edit-name').value.trim()
    const qty  = document.getElementById('edit-qty').value
    const min  = document.getElementById('edit-min').value

    if (!name || qty === '' || min === '') {
        Swal.fire({ icon: 'warning', title: 'กรอกข้อมูลไม่ครบ', text: 'กรุณากรอกข้อมูลให้ครบทุกช่อง', timer: 2000, showConfirmButton: false })
        return
    }
    if (Number(qty) < 0 || Number(min) < 0) {
        Swal.fire({ icon: 'warning', title: 'ค่าไม่ถูกต้อง', text: 'จำนวนสต็อกและสต็อกขั้นต่ำต้องไม่ติดลบ', timer: 2000, showConfirmButton: false })
        return
    }

    try {
        await api.Products.update(id, { Product_name: name, Quantity: Number(qty), Min_stock: Number(min) })
        document.getElementById('edit-modal').style.display = 'none'
        await loadDashboard()
        Swal.fire({ icon: 'success', title: 'แก้ไขสำเร็จ!', text: `อัปเดต "${name}" เรียบร้อยแล้ว`, timer: 1800, showConfirmButton: false })
    } catch (err) {
        Swal.fire('เกิดข้อผิดพลาด!', err.response?.data?.message || err.message, 'error')
    }
}
