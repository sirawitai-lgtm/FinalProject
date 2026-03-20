const BASE_URL = 'http://localhost:8500';

// ─── Thai helpers ───────────────────────────────────────────
const MONTHS = ['','ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.',
                'ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];

// แปลง Date เป็น Thai timezone (UTC+7) เสมอ
function parseMySQLDatetime(dtStr) {
    if (!dtStr) return new Date();
    const clean = dtStr.replace(' ', 'T');
    const hasTimezone = clean.includes('Z') || clean.includes('+');
    if (hasTimezone) {
        const utcDate = new Date(clean);
        return new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
    } else {
        // MySQL ส่งมาไม่มี timezone → บอก browser ว่าเป็น UTC ด้วย Z
        const utcDate = new Date(clean + 'Z');
        return new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
    }
}
function thaiDate(dateStr) {
    // ใช้ parseMySQLDatetime ที่คุณเขียนไว้ เพื่อแปลงให้เป็นเวลาไทยก่อน
    const d = parseMySQLDatetime(dateStr); 
    return `${d.getDate()} ${MONTHS[d.getMonth()+1]} ${d.getFullYear()+543}`;
}

// แก้ thaiDateTime ให้ใช้ parseMySQLDatetime แทน new Date()
function thaiDateTime(dtStr) {
    const d    = parseMySQLDatetime(dtStr);  // <-- เปลี่ยนตรงนี้
    const date = `${d.getDate()} ${MONTHS[d.getMonth()+1]} ${d.getFullYear()+543}`;
    const hh   = String(d.getHours()).padStart(2, '0');
    const mm   = String(d.getMinutes()).padStart(2, '0');
    return `${date} เวลา ${hh}:${mm} น.`;
}

// แก้ todayKey ให้ใช้ timezone ไทยจริงๆ
function todayKey() {
    const now = new Date();
    return now.toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
    // คืนค่า "YYYY-MM-DD" ตาม timezone ไทย
}

// ─── Toggle detail table ────────────────────────────────────
function toggleDetail(id) {
    const wrap  = document.getElementById(`detail-${id}`);
    const label = document.getElementById(`label-${id}`);
    const icon  = document.getElementById(`icon-${id}`);
    const open  = wrap.classList.toggle('open');
    icon.className  = open ? 'fas fa-chevron-up' : 'fas fa-table';
    label.textContent = open ? 'ซ่อนรายละเอียด' : `ดูรายละเอียดสินค้า (${wrap.dataset.count} รายการ)`;
}

// ─── Render one snapshot card ───────────────────────────────
function renderSnapCard(snap) {
    const detail   = typeof snap.detail_json === 'string'
                     ? JSON.parse(snap.detail_json)
                     : (snap.detail_json || []);
    const net      = parseInt(snap.net_change);
    const netSign  = net >= 0 ? '+' : '';
    const netClass = net >= 0 ? 'net' : 'net neg';
    const lowItems = detail.filter(p => p.is_low);

    // stat pills
    const lowPill = snap.low_count > 0
        ? `<div class="stat-pill low">
               <span class="num">${snap.low_count}</span>
               <span class="lbl"><i class="fas fa-triangle-exclamation"></i> Low Stock</span>
           </div>` : '';

    // low alert bar
    const lowBar = lowItems.length > 0
        ? `<div class="low-alert-bar">
               <i class="fas fa-triangle-exclamation"></i>
               <div><strong>สินค้าสต็อกต่ำ:</strong> ${lowItems.map(p => p.name).join(', ')}</div>
           </div>` : '';

    // product detail table rows
    const rows = detail.map(p => {
        const pNet     = parseInt(p.net ?? 0);
        const pNetSign = pNet >= 0 ? '+' : '';
        const pNetCls  = pNet >= 0 ? 'c-pos' : 'c-neg';
        return `
        <tr class="${p.is_low ? 'low-row' : ''}">
            <td>${p.name}</td>
            <td class="tc">${p.qty}</td>
            <td class="tc" style="color:var(--text-muted)">${p.min}</td>
            <td class="tc c-in">+${p.in}</td>
            <td class="tc c-out">-${p.out}</td>
            <td class="tc ${pNetCls}">${pNetSign}${pNet}</td>
            <td class="tc">${p.is_low
                ? '<span class="badge-low">⚠ Low</span>'
                : '<span class="badge-ok">✔ OK</span>'}</td>
        </tr>`;
    }).join('');

    const detailSection = detail.length > 0 ? `
        <div class="snap-detail-toggle">
            <button class="btn-toggle" onclick="toggleDetail(${snap.id})">
                <i id="icon-${snap.id}" class="fas fa-table"></i>
                <span id="label-${snap.id}">ดูรายละเอียดสินค้า (${detail.length} รายการ)</span>
            </button>
        </div>
        <div class="detail-table-wrap" id="detail-${snap.id}" data-count="${detail.length}">
            <table class="detail-table">
                <thead>
                    <tr>
                        <th>ชื่อสินค้า</th>
                        <th class="tc">สต็อก</th>
                        <th class="tc">Min</th>
                        <th class="tc">IN</th>
                        <th class="tc">OUT</th>
                        <th class="tc">Net</th>
                        <th class="tc">สถานะ</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>` : '';

    return `
    <div class="snap-card">
        <div class="snap-header">
            <span class="snap-time">
                <i class="fas fa-clock"></i>
                ${thaiDateTime(snap.snapshot_at)}
            </span>
            <span class="snap-id">#${snap.id}</span>
        </div>
        <div class="snap-stats">
            <div class="stat-pill in">
                <span class="num">${snap.total_in}</span>
                <span class="lbl"><i class="fas fa-arrow-down"></i> Stock IN</span>
            </div>
            <div class="stat-pill out">
                <span class="num">${snap.total_out}</span>
                <span class="lbl"><i class="fas fa-arrow-up"></i> Stock OUT</span>
            </div>
            <div class="stat-pill ${netClass}">
                <span class="num">${netSign}${net}</span>
                <span class="lbl">Net Change</span>
            </div>
            ${lowPill}
        </div>
        ${lowBar}
        ${detailSection}
    </div>`;
}

// ─── Render all groups ──────────────────────────────────────
function renderTimeline(history) {
    if (history.length === 0) {
        return `<div class="card state-box">
            <i class="fas fa-clipboard-list"></i>
            <p class="title">ยังไม่มีข้อมูลสรุปรายวัน</p>
            <p>กลับหน้าหลักแล้วกดปุ่ม "Daily Summary" เพื่อบันทึกข้อมูลครั้งแรก</p>
        </div>`;
        
    }

    // จัดกลุ่มตาม summary_date
    const grouped = {};
    history.forEach(snap => {
        // --- แก้ไขตรงนี้ ---
        // แปลง summary_date ให้เป็น Date Object ของไทยก่อน แล้วค่อยดึง YYYY-MM-DD
        const dateObj = parseMySQLDatetime(snap.summary_date);
        const key = dateObj.toLocaleDateString('en-CA'); // จะได้ "2026-03-18" เสมอ
        
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(snap);
    });

    const today = todayKey();

    return Object.entries(grouped).map(([date, snaps]) => {
        const isToday  = date === today;
        const badgeExtra = isToday ? '<i class="fas fa-star" style="font-size:9px"></i>' : '';
        const todaySuffix = isToday ? ' (วันนี้)' : '';

        const cards = snaps.map(renderSnapCard).join('');

        return `
        <div class="date-group">
            <div class="date-group-header">
                <span class="date-badge ${isToday ? 'today' : ''}">
                    ${badgeExtra}
                    ${thaiDate(date)}${todaySuffix}
                </span>
                <div class="date-line"></div>
                <span class="snap-count">${snaps.length} ครั้ง</span>
            </div>
            <div class="snapshots-wrap">
                ${cards}
            </div>
        </div>`;
    }).join('');
}

// ─── Load data ──────────────────────────────────────────────
async function loadHistory() {
    const content = document.getElementById('content');
    try {
        const res     = await axios.get(`${BASE_URL}/inventory/summary/history`);
        const history = res.data;
        content.innerHTML = renderTimeline(history);
    } catch (err) {
        content.innerHTML = `
        <div class="error-box">
            <i class="fas fa-triangle-exclamation" style="font-size:18px"></i>
            <div>
                <strong>ไม่สามารถดึงข้อมูลได้</strong><br>
                <span style="font-size:13px">กรุณาตรวจสอบว่า Server กำลังรันอยู่ที่ ${BASE_URL}</span>
            </div>
        </div>`;
        console.error(err);
    }
}

window.onload = () => {
    // ── Admin เท่านั้น ────────────────────────────────────
    const session = requireAdmin('../../')
    if (!session) return

    // แสดงข้อมูล user ใน sidebar
    const initials = session.displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    document.getElementById('user-avatar').textContent = initials
    document.getElementById('user-name').textContent   = session.displayName
    document.getElementById('user-role').textContent   = '👑 Admin'

    loadHistory()
}