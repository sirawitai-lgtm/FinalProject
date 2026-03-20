let products = []

window.onload = async () => {
    const session = requireAuth('../../')
    if (!session) return

    // แสดงข้อมูล user ใน sidebar
    const initials = session.displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    document.getElementById('user-avatar').textContent = initials
    document.getElementById('user-name').textContent   = session.displayName
    document.getElementById('user-role').textContent   = session.role === 'admin' ? '👑 Admin' : '👤 User'

    // Admin เห็นเมนูอื่นด้วย
    if (session.role === 'admin') {
        document.getElementById('nav-history').style.display = ''
        document.getElementById('nav-summary').style.display = ''
    }

    await loadInventory()
}

async function loadInventory() {
    try {
        const res = await api.Products.getAll()
        products = res.data
        renderTable(products)
        populateDropdown(products)
    } catch (err) {
        document.getElementById('inventory-table-body').innerHTML =
            '<tr><td colspan="5" style="text-align:center;color:red;">โหลดข้อมูลไม่สำเร็จ</td></tr>'
        console.error(err)
    }
}

function renderTable(data) {
    const tbody = document.getElementById('inventory-table-body')
    tbody.innerHTML = ''

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#888;">ไม่มีข้อมูลสินค้า</td></tr>'
        return
    }

    data.forEach(p => {
        const isLow = p.Quantity < p.Min_stock
        const status = isLow
            ? '<span class="badge badge-low">⚠ Low</span>'
            : '<span class="badge badge-ok">✔ OK</span>'

        tbody.innerHTML += `
        <tr class="${isLow ? 'row-low' : ''}">
            <td>${p.Products_id}</td>
            <td>${p.Product_name}</td>
            <td><strong>${p.Quantity}</strong></td>
            <td>${p.Min_stock}</td>
            <td>${status}</td>
        </tr>`
    })
}

function exportInventoryCSV() {
    if (!products || products.length === 0) { alert('ไม่มีข้อมูลสินค้า'); return }
    const rows = [['ID', 'Product Name', 'Stock', 'Min Stock', 'Status']]
    products.forEach(p => {
        rows.push([p.Products_id, p.Product_name, p.Quantity, p.Min_stock, p.Quantity < p.Min_stock ? 'Low' : 'OK'])
    })
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Inventory_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
}

function populateDropdown(data) {
    const select = document.getElementById('adj-product')
    select.innerHTML = '<option value="">-- Select Product --</option>'
    data.forEach(p => {
        select.innerHTML += `<option value="${p.Products_id}" data-qty="${p.Quantity}">${p.Product_name} (Stock: ${p.Quantity})</option>`
    })
}

async function adjustStock() {
    const productSelect = document.getElementById('adj-product')
    const productId = productSelect.value
    const type = document.getElementById('adj-type').value
    const amount = Number(document.getElementById('adj-amount').value)

    if (!productId) { alert('Please select a product'); return }
    if (!amount || amount <= 0) { alert('Please enter a valid amount'); return }

    if (type === 'OUT') {
        const selectedOption = productSelect.options[productSelect.selectedIndex]
        const currentStock = Number(selectedOption.dataset.qty)
        if (amount > currentStock) {
            alert(`ไม่สามารถ OUT ได้! สินค้าคงเหลือมีเพียง ${currentStock} ชิ้น`)
            return
        }
    }

    try {
        await api.Inventory.adjustStock({ productId: Number(productId), type, amount })
        document.getElementById('adj-product').value = ''
        document.getElementById('adj-amount').value = ''
        await loadInventory()
    } catch (err) {
        alert('ปรับ Stock ไม่สำเร็จ: ' + (err.response?.data?.message || err.message))
    }
}

function filterInventory() {
    const keyword = document.getElementById('search-input').value.toLowerCase()
    const filtered = products.filter(p =>
        p.Product_name.toLowerCase().includes(keyword)
    )
    renderTable(filtered)
}
