let allLogs = []

window.onload = async () => {
    // ── Admin เท่านั้น ────────────────────────────────────
    const session = requireAdmin('../../')
    if (!session) return

    // แสดงข้อมูล user ใน sidebar
    const initials = session.displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    document.getElementById('user-avatar').textContent = initials
    document.getElementById('user-name').textContent   = session.displayName
    document.getElementById('user-role').textContent   = '👑 Admin'

    await loadHistory()
}

async function loadHistory() {
    try {
        const res = await api.Inventory.getAllLogs()
        allLogs = res.data
        renderLogs(allLogs)
    } catch (err) {
        document.getElementById('history-table-body').innerHTML =
            '<tr><td colspan="4" style="text-align:center;color:red;">โหลดข้อมูลไม่สำเร็จ</td></tr>'
        console.error(err)
    }
}


function renderLogs(data) {
    const tbody = document.getElementById('history-table-body')
    tbody.innerHTML = ''

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#888;">ไม่มีข้อมูล</td></tr>'
        return
    }

    data.forEach(log => {
        const typeCls = log.Action_type === 'IN' ? 'badge badge-ok' : 'badge badge-low'

        // server แปลง UTC+7 มาแล้วใน SQL — แสดงตรงๆ ได้เลย
        const dateStr = log.Created_at || '-'

        tbody.innerHTML += `
        <tr>
            <td>${dateStr}</td>
            <td>${log.Product_name || '-'}</td>
            <td><span class="${typeCls}">${log.Action_type}</span></td>
            <td>${log.Amount}</td>
        </tr>`
    })
}

function filterLogs() {
    const keyword = document.getElementById('search-input').value.toLowerCase()
    renderLogs(allLogs.filter(l => (l.Product_name || '').toLowerCase().includes(keyword)))
}
