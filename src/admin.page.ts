export const adminPage = String.raw`<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tools — Admin</title>
  <style>
    :root{--ink:#162b25;--muted:#74817b;--green:#216b4e;--border:#e6ebe7;--bg:#f6f8f5}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}button,input,select{font:inherit}button{cursor:pointer}button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid #7bc7a0;outline-offset:3px}button{border:0}aside{width:240px;background:white;border-right:1px solid var(--border);position:fixed;inset:0 auto 0 0;padding:32px 20px;display:flex;flex-direction:column}.brand{display:flex;align-items:center;gap:12px;font-size:24px;font-weight:750;letter-spacing:-1px;padding:0 14px 36px}.logo{background:var(--green);color:#fff;border-radius:12px;width:38px;height:38px;display:grid;place-items:center;font-size:21px}.eyebrow{font-size:10px;font-weight:700;color:var(--muted);letter-spacing:1.8px;text-transform:uppercase}nav .eyebrow{padding:0 14px;margin-bottom:12px}.nav{width:100%;padding:13px 15px;display:flex;align-items:center;gap:12px;background:transparent;color:var(--muted);text-align:left;border-radius:9px;margin:5px 0}.nav.active{background:#edf5ef;color:var(--green);font-weight:650}.nav svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.7}.count{margin-left:auto;background:#dcecdf;padding:1px 7px;border-radius:5px;font-size:11px}.workspace{margin-top:auto;border:1px solid var(--border);padding:14px;border-radius:10px;font-size:12px}.workspace strong{display:block;margin:6px 0}.online{width:6px;height:6px;display:inline-block;border-radius:50%;background:#42946b;margin-right:5px}.shell{margin-left:240px}header{height:82px;border-bottom:1px solid var(--border);background:white;display:flex;align-items:center;justify-content:space-between;padding:0 40px}.breadcrumb{color:var(--muted);font-size:12px}.breadcrumb span{color:var(--ink);margin-left:14px}.profile{display:flex;align-items:center;gap:11px}.avatar{display:grid;place-items:center;width:36px;height:36px;border-radius:50%;background:#eaf0e7;color:#4d7058;font-weight:650;font-size:12px}.profile small{display:block;font-size:10px;color:var(--muted)}main{padding:36px 40px;max-width:1500px;margin:auto}.heading{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:30px}h1{font-size:30px;letter-spacing:-1px;margin:5px 0 7px;font-weight:650}p{margin:0;color:var(--muted)}.date{padding:9px 13px;background:white;border:1px solid var(--border);border-radius:7px;color:var(--muted);font-size:12px}.demo{background:#edf3e8;color:#536849;border:1px solid #e0e9d7;border-radius:8px;padding:11px 15px;margin-bottom:24px;font-size:12px;display:flex;align-items:center;gap:9px}.demo b{color:#375c35}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-bottom:28px}.stat{background:white;border:1px solid var(--border);border-radius:12px;padding:22px}.stat-top{display:flex;justify-content:space-between;color:var(--muted);font-size:12px}.stat-icon{color:var(--green);background:#f0f5ee;border-radius:7px;padding:3px 8px}.value{font-size:30px;letter-spacing:-1px;font-weight:650;margin:12px 0 7px}.stat-foot{font-size:11px;color:var(--muted)}.stat-foot b{color:var(--green);font-weight:500}.panel{background:white;border:1px solid var(--border);border-radius:12px;overflow:hidden}.panel-heading{display:flex;align-items:center;justify-content:space-between;padding:24px 26px;border-bottom:1px solid var(--border);gap:12px}h2{font-size:17px;letter-spacing:-.4px;margin:0 0 4px;font-weight:650}.panel-heading p{font-size:12px}.primary{padding:10px 16px;background:var(--green);color:white;border-radius:7px;font-size:12px;font-weight:600;white-space:nowrap}.primary:hover{background:#19573e}.toolbar{display:flex;justify-content:space-between;gap:12px;padding:18px 26px}.search{max-width:350px;position:relative;width:100%}.search svg{position:absolute;left:12px;top:11px;width:16px;stroke:var(--muted);fill:none;stroke-width:2}input,select{border:1px solid var(--border);border-radius:7px;padding:10px 12px;background:white;color:var(--ink)}.search input{padding-left:36px;width:100%;font-size:12px}select{font-size:12px}.table-wrap{overflow:auto}table{border-collapse:collapse;width:100%;text-align:left;white-space:nowrap}th{background:#fafbf9;color:var(--muted);font-size:10px;text-transform:uppercase;letter-spacing:.8px;font-weight:600;padding:13px 26px;border-block:1px solid var(--border)}td{padding:17px 26px;border-bottom:1px solid #f0f2ee;font-size:12px}.person{display:flex;align-items:center;gap:11px}.person strong{display:block;font-weight:600}.person small{display:block;color:var(--muted);font-size:11px}.badge{border-radius:5px;padding:4px 8px;font-size:10px;background:#edf5ee;color:#3e8059}.badge.pending{background:#fff6e4;color:#a78336}.role{color:#69756f}.remove{background:transparent;color:#89968c;padding:5px 9px;border-radius:5px}.remove:hover{color:#a33d38;background:#fff0ec}.table-footer{padding:18px 26px;color:var(--muted);font-size:11px;display:flex;justify-content:space-between;gap:12px}.bottom{margin-top:22px;display:flex;justify-content:space-between;font-size:10px;color:#98a29b;letter-spacing:.4px}.hidden{display:none!important}.empty{text-align:center;padding:40px;color:var(--muted)}dialog{border:1px solid var(--border);border-radius:14px;padding:28px;width:min(440px,calc(100% - 32px));color:var(--ink);box-shadow:0 30px 80px #142e2525}dialog::backdrop{background:#132e2555}form label{display:block;margin:17px 0 6px;font-size:12px}form input,form select{width:100%}.actions{display:flex;justify-content:flex-end;gap:10px;margin-top:24px}.secondary{border:1px solid var(--border);background:white;padding:10px 16px;border-radius:7px;font-size:12px}.mobile-menu{display:none}.toast{position:fixed;bottom:25px;right:25px;background:var(--ink);color:white;padding:13px 20px;border-radius:8px;box-shadow:0 4px 24px #0002;z-index:5}footer a{color:var(--green)}@media(min-width:1500px){main{padding-top:48px}}@media(max-width:1100px){aside{width:200px}.shell{margin-left:200px}main{padding:28px 24px}header{padding:0 24px}.stats{gap:12px}.stat{padding:17px}.stat-top{font-size:11px}td,th{padding-inline:18px}}@media(max-width:760px){aside{transform:translateX(-100%);z-index:10;box-shadow:8px 0 40px #0002;width:240px;transition:transform .2s}aside.open{transform:translateX(0)}.shell{margin-left:0}.mobile-menu{display:block;background:transparent;font-size:22px;color:var(--ink);padding:6px;margin-right:10px}header{height:68px;padding:0 18px}.header-left{display:flex;align-items:center}.profile-info{display:none}main{padding:26px 18px}.stats{grid-template-columns:repeat(2,1fr)}h1{font-size:25px}.heading{align-items:flex-start}.date{font-size:10px;padding:8px}.panel-heading,.toolbar{padding:18px}.panel-heading{align-items:flex-start}.toolbar{flex-wrap:wrap}.search{max-width:none;flex:1;min-width:180px}.demo{align-items:flex-start}.table-footer{padding:16px 18px}.bottom{font-size:9px}.nav{padding-block:15px}}
  </style>
</head>
<body>
  <aside id="sidebar" aria-label="Menu quản trị">
    <div class="brand"><span class="logo">t.</span>tools<span style="font-size:10px;color:#8b988e;letter-spacing:0;margin-top:8px">ADMIN</span></div>
    <nav><div class="eyebrow">Không gian quản lý</div>
      <button class="nav active" data-view="overview"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>Tổng quan</button>
      <button class="nav" data-view="users"><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M17 15a5 5 0 0 1 4 5"/></svg>Người dùng<span class="count" id="nav-count">6</span></button>
      <button class="nav" data-view="roles"><span aria-hidden="true">◇</span>Vai trò &amp; phân quyền</button>
      <button class="nav" data-view="files"><span aria-hidden="true">▤</span>Thư viện tệp</button>
      <button class="nav" data-view="settings"><span aria-hidden="true">⚙</span>Cài đặt</button>
    </nav>
    <div class="workspace"><div class="eyebrow">Workspace</div><strong id="workspace-name">Tools workspace ↗</strong><span class="online"></span>Giao diện demo</div>
  </aside>
  <div class="shell">
    <header><div class="header-left"><button class="mobile-menu" id="menu-toggle" aria-label="Mở menu" aria-expanded="false">☰</button><div class="breadcrumb">Workspace <span>/ &nbsp; <b id="breadcrumb">Tổng quan</b></span></div></div><div class="profile"><span class="avatar">AD</span><div class="profile-info"><strong style="font-size:12px">Administrator</strong><small>Tài khoản mẫu</small></div></div></header>
    <main>
      <div class="heading"><div><div class="eyebrow">Tools administration</div><h1 id="page-title">Tổng quan workspace</h1><p id="page-description">Chào mừng trở lại. Đây là hoạt động của workspace hôm nay.</p></div><div class="date" id="today"></div></div>
      <div class="demo"><span>◉</span><span><b>Đang xem dữ liệu mẫu.</b> Các thay đổi chỉ có hiệu lực trong phiên hiện tại; chưa kết nối API Lumina CMS.</span></div>
      <section class="stats" id="stats" aria-label="Thống kê mẫu">
        <div class="stat"><div class="stat-top">Tổng người dùng<span class="stat-icon">♧</span></div><div class="value" id="total-count">6</div><div class="stat-foot"><b>Danh sách demo</b> · trong workspace</div></div>
        <div class="stat"><div class="stat-top">Đang hoạt động<span class="stat-icon">↗</span></div><div class="value" id="active-count">4</div><div class="stat-foot"><b id="active-percent">67%</b> tổng người dùng</div></div>
        <div class="stat"><div class="stat-top">Chờ kích hoạt<span class="stat-icon">◷</span></div><div class="value" id="pending-count">2</div><div class="stat-foot">Cần xác nhận tài khoản</div></div>
        <div class="stat"><div class="stat-top">Quản trị viên<span class="stat-icon">◇</span></div><div class="value" id="admin-count">2</div><div class="stat-foot">Quyền quản lý workspace</div></div>
      </section>
      <section class="panel" id="users-panel" aria-labelledby="users-title">
        <div class="panel-heading"><div><h2 id="users-title">Người dùng workspace</h2><p>Quản lý thành viên và quyền truy cập của bạn.</p></div><button class="primary" id="add-user">＋ &nbsp; Thêm người dùng</button></div>
        <div class="toolbar"><div class="search"><svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></svg><input id="search" aria-label="Tìm người dùng" placeholder="Tìm theo tên hoặc email…" type="search"></div><select id="status-filter" aria-label="Lọc trạng thái"><option value="all">Tất cả trạng thái</option><option value="active">Đang hoạt động</option><option value="pending">Chờ kích hoạt</option></select></div>
        <div class="table-wrap"><table><thead><tr><th>Người dùng</th><th>Vai trò</th><th>Trạng thái</th><th>Ngày tham gia</th><th>Thao tác</th></tr></thead><tbody id="users"></tbody></table></div>
        <div class="table-footer"><span id="result-count" role="status"></span><span>Dữ liệu mẫu · phiên hiện tại</span></div>
      </section>
      <section class="panel hidden" id="roles-panel" aria-labelledby="roles-title">
        <div class="panel-heading"><div><h2 id="roles-title">Vai trò &amp; phân quyền</h2><p>Các nhóm quyền cơ bản theo Lumina CMS.</p></div></div>
        <div class="table-wrap"><table><thead><tr><th>Vai trò</th><th>Quyền truy cập mẫu</th><th>Thành viên</th></tr></thead><tbody id="roles-list"></tbody></table></div>
      </section>
      <section class="panel hidden" id="files-panel" aria-labelledby="files-title">
        <div class="panel-heading"><div><h2 id="files-title">Thư viện tệp</h2><p>Danh sách tệp mẫu và tệp bạn chọn trong phiên.</p></div><button class="primary" id="upload-file">＋ Thêm tệp</button><input type="file" id="file-input" multiple hidden></div>
        <div class="table-wrap"><table><thead><tr><th>Tên tệp</th><th>Loại</th><th>Kích thước</th><th>Thao tác</th></tr></thead><tbody id="files-list"></tbody></table></div>
        <div class="table-footer"><span id="file-count" role="status"></span><span>Tệp chỉ được đọc trên thiết bị, chưa tải lên máy chủ.</span></div>
      </section>
      <section class="panel hidden" id="settings-panel" aria-labelledby="settings-title">
        <div class="panel-heading"><div><h2 id="settings-title">Cài đặt chung</h2><p>Thông tin cơ bản của workspace.</p></div></div>
        <form id="settings-form" style="padding:0 26px 26px;max-width:600px"><label for="site-name">Tên workspace</label><input id="site-name" required maxlength="80" value="Tools workspace"><label for="site-description">Mô tả</label><input id="site-description" maxlength="200" value="Workspace của bạn, trong tầm tay."><div class="actions"><button class="primary" type="submit">Lưu cài đặt mẫu</button></div></form>
      </section>
      <footer class="bottom"><span>© <span id="year"></span> Tools. <span id="workspace-description">Workspace của bạn, trong tầm tay.</span></span><span>ADMIN / v1.0</span></footer>
    </main>
  </div>
  <dialog id="user-dialog" aria-labelledby="dialog-title"><form id="user-form"><h2 id="dialog-title">Thêm người dùng</h2><p style="font-size:12px">Tạo thành viên mẫu cho workspace.</p><label for="name">Họ và tên</label><input id="name" name="name" required maxlength="80" autocomplete="name"><label for="email">Email</label><input id="email" name="email" type="email" required maxlength="120" autocomplete="email"><label for="role">Vai trò</label><select id="role" name="role"><option value="member">Thành viên</option><option value="admin">Quản trị viên</option></select><div class="actions"><button type="button" class="secondary" id="cancel">Hủy</button><button type="submit" class="primary">Thêm người dùng</button></div></form></dialog>
  <div class="toast hidden" id="toast" role="status"></div>
  <script>
    const people = [
      {id:1,name:'Nguyễn Minh Anh',email:'minhanh@example.com',role:'admin',status:'active',date:'2026-09-20'},
      {id:2,name:'Trần Hoàng Phúc',email:'hoangphuc@example.com',role:'admin',status:'active',date:'2026-09-21'},
      {id:3,name:'Lê Thảo Nguyên',email:'thaonguyen@example.com',role:'member',status:'active',date:'2026-09-24'},
      {id:4,name:'Phạm Gia Huy',email:'giahuy@example.com',role:'member',status:'pending',date:'2026-09-28'},
      {id:5,name:'Võ Thanh Hà',email:'thanhha@example.com',role:'member',status:'active',date:'2026-10-01'},
      {id:6,name:'Đặng Bảo Linh',email:'baolinh@example.com',role:'member',status:'pending',date:'2026-10-02'}
    ];
    const $ = (id) => document.getElementById(id);
    const dateFormat = new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'});
    $('today').textContent = dateFormat.format(new Date());
    $('year').textContent = new Date().getFullYear();
    let toastTimer;
    function notify(message){$('toast').textContent=message;$('toast').classList.remove('hidden');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.add('hidden'),3000);}
    function cell(text,className){const td=document.createElement('td');td.textContent=text;if(className)td.className=className;return td;}
    function render(){
      const query=$('search').value.trim().toLocaleLowerCase('vi');const status=$('status-filter').value;
      const filtered=people.filter(p=>(p.name+' '+p.email).toLocaleLowerCase('vi').includes(query)&&(status==='all'||p.status===status));
      $('users').replaceChildren();
      filtered.forEach(p=>{
        const row=document.createElement('tr');const td=document.createElement('td');const person=document.createElement('div');person.className='person';
        const avatar=document.createElement('span');avatar.className='avatar';avatar.textContent=p.name.split(/\s+/).slice(-2).map(n=>n[0]).join('');
        const details=document.createElement('div');const name=document.createElement('strong');name.textContent=p.name;const email=document.createElement('small');email.textContent=p.email;details.append(name,email);person.append(avatar,details);td.append(person);row.append(td,cell(p.role==='admin'?'Quản trị viên':'Thành viên','role'));
        const state=document.createElement('td');const badge=document.createElement('span');badge.className='badge'+(p.status==='pending'?' pending':'');badge.textContent=p.status==='active'?'● Đang hoạt động':'● Chờ kích hoạt';state.append(badge);row.append(state,cell(dateFormat.format(new Date(p.date+'T12:00:00+07:00')),'role'));
        const action=document.createElement('td');const remove=document.createElement('button');remove.className='remove';remove.textContent='Xóa';remove.setAttribute('aria-label','Xóa '+p.name);remove.addEventListener('click',()=>{if(confirm('Xóa người dùng mẫu '+p.name+'?')){people.splice(people.findIndex(item=>item.id===p.id),1);render();notify('Đã xóa người dùng mẫu.');}});action.append(remove);row.append(action);$('users').append(row);
      });
      if(!filtered.length){const row=document.createElement('tr');const empty=cell('Không tìm thấy người dùng.','empty');empty.colSpan=5;row.append(empty);$('users').append(row);}
      const active=people.filter(p=>p.status==='active').length;
      $('total-count').textContent=people.length;$('nav-count').textContent=people.length;$('active-count').textContent=active;$('pending-count').textContent=people.length-active;$('admin-count').textContent=people.filter(p=>p.role==='admin').length;$('active-percent').textContent=(people.length?Math.round(active/people.length*100):0)+'%';$('result-count').textContent='Hiển thị '+filtered.length+' / '+people.length+' người dùng';
    }
    $('search').addEventListener('input',render);$('status-filter').addEventListener('change',render);
    const dialog=$('user-dialog');$('add-user').addEventListener('click',()=>{$('user-form').reset();$('name').setCustomValidity('');$('email').setCustomValidity('');dialog.showModal();});$('cancel').addEventListener('click',()=>dialog.close());$('email').addEventListener('input',()=>$('email').setCustomValidity(''));
    $('user-form').addEventListener('submit',event=>{event.preventDefault();const name=$('name').value.trim();const email=$('email').value.trim().toLowerCase();if(!name){$('name').setCustomValidity('Vui lòng nhập họ và tên.');$('name').reportValidity();return;}if(people.some(p=>p.email.toLowerCase()===email)){$('email').setCustomValidity('Email này đã có trong danh sách.');$('email').reportValidity();return;}people.push({id:Date.now(),name,email,role:$('role').value,status:'pending',date:new Date().toLocaleDateString('sv-SE',{timeZone:'Asia/Ho_Chi_Minh'})});dialog.close();render();notify('Đã thêm người dùng mẫu.');});$('name').addEventListener('input',()=>$('name').setCustomValidity(''));
    const files = [
      {name:'brand-guidelines.pdf',type:'PDF',size:245760},
      {name:'logo-lumina.svg',type:'SVG',size:4096},
      {name:'homepage-banner.webp',type:'WEBP',size:184320}
    ];
    function renderRoles(){
      $('roles-list').replaceChildren();
      [['admin','Quản trị viên','Quản lý tài khoản, vai trò, tệp và cài đặt'],['member','Thành viên','Xem nội dung và thư viện tệp']].forEach(([key,label,permissions])=>{
        const row=document.createElement('tr');row.append(cell(label),cell(permissions),cell(String(people.filter(p=>p.role===key).length)));$('roles-list').append(row);
      });
    }
    function renderFiles(){
      $('files-list').replaceChildren();
      files.forEach((file,index)=>{
        const row=document.createElement('tr');row.append(cell(file.name),cell(file.type),cell(file.size<1048576?(file.size/1024).toFixed(1)+' KB':(file.size/1048576).toFixed(1)+' MB'));
        const action=document.createElement('td');const remove=document.createElement('button');remove.className='remove';remove.textContent='Xóa';remove.setAttribute('aria-label','Xóa '+file.name);remove.addEventListener('click',()=>{if(confirm('Xóa tệp mẫu '+file.name+'?')){files.splice(index,1);renderFiles();notify('Đã xóa tệp khỏi danh sách mẫu.');}});action.append(remove);row.append(action);$('files-list').append(row);
      });
      if(!files.length){const row=document.createElement('tr');const empty=cell('Chưa có tệp.','empty');empty.colSpan=4;row.append(empty);$('files-list').append(row);}
      $('file-count').textContent=files.length+' tệp';
    }
    $('upload-file').addEventListener('click',()=>$('file-input').click());
    $('file-input').addEventListener('change',()=>{
      Array.from($('file-input').files).forEach(file=>files.push({name:file.name,type:file.name.includes('.')?file.name.split('.').pop().toUpperCase():'Tệp',size:file.size}));
      renderFiles();notify('Đã thêm tệp vào danh sách mẫu.');$('file-input').value='';
    });
    $('settings-form').addEventListener('submit',event=>{
      event.preventDefault();const name=$('site-name').value.trim();
      if(!name){$('site-name').setCustomValidity('Vui lòng nhập tên workspace.');$('site-name').reportValidity();return;}
      $('workspace-name').textContent=name+' ↗';$('workspace-description').textContent=$('site-description').value.trim();notify('Đã lưu cài đặt trong phiên hiện tại.');
    });
    $('site-name').addEventListener('input',()=>$('site-name').setCustomValidity(''));
    const views={overview:['Tổng quan','Tổng quan workspace','Chào mừng trở lại. Đây là hoạt động của workspace hôm nay.'],users:['Người dùng','Quản lý người dùng','Tất cả thành viên trong workspace của bạn.'],roles:['Vai trò & phân quyền','Vai trò & phân quyền','Các nhóm quyền truy cập cơ bản của workspace.'],files:['Thư viện tệp','Thư viện tệp','Quản lý tài liệu và tài nguyên của workspace.'],settings:['Cài đặt','Cài đặt workspace','Thiết lập thông tin chung cho workspace của bạn.']};
    document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{
      const view=button.dataset.view;
      document.querySelectorAll('[data-view]').forEach(item=>{item.classList.toggle('active',item===button);if(item===button)item.setAttribute('aria-current','page');else item.removeAttribute('aria-current');});
      $('stats').classList.toggle('hidden',view!=='overview');
      $('users-panel').classList.toggle('hidden',view!=='overview'&&view!=='users');
      ['roles','files','settings'].forEach(key=>$(key+'-panel').classList.toggle('hidden',view!==key));
      const [label,title,description]=views[view];$('page-title').textContent=title;$('page-description').textContent=description;$('breadcrumb').textContent=label;
      document.title='Tools — '+label;renderRoles();renderFiles();
      $('sidebar').classList.remove('open');$('menu-toggle').setAttribute('aria-expanded','false');
    }));
    document.querySelector('[data-view="overview"]').setAttribute('aria-current','page');
    $('menu-toggle').addEventListener('click',()=>{const open=$('sidebar').classList.toggle('open');$('menu-toggle').setAttribute('aria-expanded',String(open));});document.addEventListener('click',event=>{if(!$('sidebar').contains(event.target)&&!$('menu-toggle').contains(event.target)){$('sidebar').classList.remove('open');$('menu-toggle').setAttribute('aria-expanded','false');}});document.addEventListener('keydown',event=>{if(event.key==='Escape'){$('sidebar').classList.remove('open');$('menu-toggle').setAttribute('aria-expanded','false');}});
    render();
  </script>
</body>
</html>`;
