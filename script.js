// ============ DỮ LIỆU MẪU ============
var SAMPLES = {
  high: { label:'🔴 Rủi ro cao — Cọc trọ gấp', type:'datcoc', amount:'2000000', receiver:'Chủ trọ (Facebook lạ)',
    content:'Phòng trọ giá rẻ bất thường chỉ 1,2 triệu/tháng gần trường, giá này rẻ nhất khu vực! Em chuyển cọc ngay trong 10 phút 2.000.000đ vào STK cá nhân của anh kẻo hết phòng, nhiều người đang hỏi lắm. Không cần xem phòng trước đâu, ảnh anh gửi là thật 100%. Chốt ngay nhé em, chậm là người khác cọc mất.' },
  mid: { label:'🟡 Cần xác minh — Mua điện thoại cũ', type:'docu', amount:'4500000', receiver:'Người bán trên nhóm chợ đồ cũ',
    content:'Bán iPhone 12 cũ còn đẹp, pin 89%, giá 4.500.000đ. Bạn chuyển trước 50% để mình giữ máy, mai mình ship qua giao hàng. Mình ở tỉnh khác nên không gặp trực tiếp được. Bạn yên tâm, mình bán lâu rồi.' },
  low: { label:'🟢 Tương đối rõ — Đóng phí CLB', type:'phi', amount:'150000', receiver:'Thủ quỹ CLB — có thông báo chính thức',
    content:'Thông báo từ Ban Chủ nhiệm CLB Kỹ Năng: Mỗi thành viên đóng phí sinh hoạt học kỳ 150.000đ trước ngày 30/11, chuyển cho thủ quỹ của CLB theo STK công bố trên fanpage chính thức. Sau khi chuyển, bạn giữ biên nhận và điền form xác nhận của CLB để được cộng điểm rèn luyện. Mọi thắc mắc liên hệ fanpage CLB.' },
  lacking: { label:'⚪ Thiếu dữ liệu — Nội dung quá ngắn', type:'dichvu', amount:'', receiver:'',
    content:'Bạn ơi chuyển tiền cho mình nhé, như đã nói hôm trước.' },
  tro: { label:'Đặt cọc thuê trọ', type:'datcoc', amount:'1500000', receiver:'',
    content:'Phòng còn trống, bạn cọc trước 1.500.000đ để giữ phòng nhé. Xem phòng vào cuối tuần này, nếu không ưng thì trao đổi lại về tiền cọc sau.' },
  docu: { label:'Mua bán đồ cũ', type:'docu', amount:'800000', receiver:'',
    content:'Mình bán lại laptop cũ giá 8.000.000đ, còn bảo hành 3 tháng. Bạn có thể qua xem máy trực tiếp, test thoải mái rồi mới quyết định có mua hay không.' },
  online: { label:'Mua hàng trực tuyến', type:'online', amount:'350000', receiver:'',
    content:'Shop sale áo khoác chỉ 350.000đ, freeship hôm nay. Thanh toán khi nhận hàng (COD), được kiểm tra hàng trước khi trả tiền, đổi size trong 7 ngày.' },
  phi: { label:'Đóng phí hoạt động', type:'phi', amount:'200000', receiver:'',
    content:'Lớp mình thu 200.000đ tiền quỹ hoạt động ngoại khóa, hạn chót thứ Sáu tuần này, lớp trưởng sẽ công khai danh sách đã đóng trên nhóm lớp.' },
  stranger: { label:'Chuyển tiền cho người lạ', type:'dichvu', amount:'500000', receiver:'Người lạ nhắn qua mạng xã hội',
    content:'Chào bạn, bạn trúng thưởng chương trình tri ân! Bạn đóng phí xác nhận 500.000đ ngay hôm nay để nhận quà 5 triệu. Gửi kèm mã OTP vừa nhận được để hệ thống xác thực tài khoản nhé.' }
};
var SCENARIOS = [
  {key:'tro', icon:'🏠', title:'Đặt cọc thuê trọ', desc:'Kiểm tra yêu cầu cọc, phí phát sinh và điều kiện hoàn cọc.'},
  {key:'docu', icon:'📱', title:'Mua bán đồ cũ', desc:'Đối chiếu giá, tình trạng máy và yêu cầu chuyển tiền trước.'},
  {key:'online', icon:'🛒', title:'Mua hàng trực tuyến', desc:'Phân tích quảng cáo, thanh toán và chính sách giao hàng.'},
  {key:'phi', icon:'🎟️', title:'Phí hoạt động / khóa học', desc:'Kiểm tra khoản phí gửi qua tin nhắn có khớp thông báo chính thức.'},
  {key:'stranger', icon:'👤', title:'Người chưa quen biết', desc:'Nhận diện yêu cầu chuyển tiền từ người lạ, “phí trúng thưởng”.'}
];

// ============ QUY TẮC PHÂN TÍCH (minh bạch, sửa/thêm tại đây) ============
var RULES = [
  {id:'otp', kw:['mã otp',' otp','otp ','mật khẩu','password','mã xác thực ngân hàng'], score:60, title:'Yêu cầu cung cấp OTP / mật khẩu / mã xác thực', reason:'Không ngân hàng, ví điện tử hay cơ quan nào yêu cầu bạn gửi OTP/mật khẩu cho người khác. Đây là dấu hiệu rủi ro đặc biệt nghiêm trọng — tuyệt đối không cung cấp.'},
  {id:'urgent', kw:['ngay trong','trong 10 phút','trong 15 phút','trong 30 phút','chuyển ngay','cọc ngay','gấp','kẻo hết','chốt ngay','nhanh kẻo','chậm là','hết phòng','hết hàng','chỉ còn hôm nay'], score:25, title:'Hối thúc chuyển tiền gấp / tạo áp lực thời gian', reason:'Nội dung tạo áp lực phải chuyển tiền rất nhanh, khiến bạn không còn thời gian kiểm chứng thông tin và điều kiện giao dịch.'},
  {id:'cheap', kw:['rẻ bất thường','rẻ nhất','giá sốc','thanh lý gấp','sale 70%','sale 80%','giá này không có lần hai'], score:20, title:'Giá rẻ bất thường so với mặt bằng', reason:'Mức giá thấp bất thường thường được dùng để thu hút và thúc đẩy chuyển tiền nhanh. Cần đối chiếu giá thị trường và kiểm chứng hàng/phòng thật.'},
  {id:'noview', kw:['không cần xem','không cho xem','không xem phòng','không gặp trực tiếp','không cần gặp','ở tỉnh khác'], score:20, title:'Không thể kiểm chứng trực tiếp', reason:'Bạn chưa được xem phòng / xem hàng trực tiếp hoặc gặp người bán, nên chưa có căn cứ xác thực đối tượng giao dịch có thật.'},
  {id:'prepay', kw:['chuyển trước 50%','chuyển trước 100%','cọc 100%','đóng phí trước','phí xác nhận','phí để nhận'], score:18, title:'Yêu cầu đóng / chuyển tiền trước với tỷ lệ cao', reason:'Yêu cầu trả trước một phần lớn khi chưa nhận hàng/dịch vụ và chưa rõ cơ chế bảo đảm khiến rủi ro mất tiền cao hơn.'},
  {id:'personal', kw:['stk cá nhân','tài khoản cá nhân','số tài khoản cá nhân'], score:12, title:'Chuyển vào tài khoản cá nhân chưa rõ danh tính', reason:'Thông tin người nhận là tài khoản cá nhân, chưa đối chiếu được với chủ phòng / shop / đơn vị tổ chức được nhắc tới.'},
  {id:'prize', kw:['trúng thưởng','nhận quà','tri ân khách hàng trúng'], score:22, title:'Chiêu “trúng thưởng — đóng phí để nhận quà”', reason:'Các chương trình uy tín không yêu cầu người trúng thưởng đóng phí trước bằng chuyển khoản cá nhân để nhận quà.'}
];
var POSITIVE = [
  {kw:['cod','thanh toán khi nhận hàng','kiểm tra hàng trước'], text:'Có thanh toán khi nhận hàng / được kiểm tra hàng trước'},
  {kw:['biên nhận','form xác nhận','công khai danh sách'], text:'Có biên nhận / cơ chế xác nhận, công khai minh bạch'},
  {kw:['fanpage chính thức','thông báo chính thức','ban chủ nhiệm'], text:'Có kênh thông báo chính thức để đối chiếu'},
  {kw:['xem máy trực tiếp','xem phòng','qua xem','test thoải mái'], text:'Cho phép xem / kiểm tra trực tiếp trước khi quyết định'},
  {kw:['đổi size','đổi trả','bảo hành'], text:'Có nhắc chính sách đổi trả / bảo hành'}
];
var TYPE_LABEL = {datcoc:'Đặt cọc thuê trọ', online:'Mua hàng online', docu:'Mua đồ cũ', phi:'Đóng phí hoạt động / khóa học', dichvu:'Dịch vụ / chuyển tiền khác'};
var QUESTIONS = {
  datcoc:['Phòng có xem trực tiếp hoặc video call trực tiếp được không? Địa chỉ cụ thể ở đâu?','Tiền cọc được hoàn trong trường hợp nào, ghi ở đâu (hợp đồng / giấy biên nhận)?','Chủ nhà có giấy tờ chứng minh quyền cho thuê không? Tổng phí tháng đầu gồm những khoản nào?'],
  docu:['Có gặp trực tiếp để kiểm tra máy/hàng được không? Nếu ship thì ai chịu rủi ro mất hàng?','Máy còn bảo hành không, có giấy tờ / hộp / hóa đơn mua ban đầu không?','Vì sao bán, tình trạng lỗi (nếu có) là gì? Có cam kết hoàn tiền nếu sai mô tả không?'],
  online:['Shop có địa chỉ, kênh bán chính thức và đánh giá từ người mua trước không?','Có COD / kiểm tra hàng trước khi thanh toán không? Phí ship và đổi trả tính thế nào?','Tổng tiền cuối cùng là bao nhiêu, có phát sinh phí gì thêm không?'],
  phi:['Khoản phí này có trong thông báo chính thức nào (fanpage / email trường / văn bản)?','Người thu có đúng là thủ quỹ / ban tổ chức đã công bố không? Có biên nhận sau khi đóng không?','Hạn chót và mức phí có khớp với thông báo gốc không?'],
  dichvu:['Bạn là ai, thuộc đơn vị nào? Tôi đối chiếu thông tin này ở kênh chính thức nào?','Khoản tiền này dùng để làm gì, có văn bản / thông báo gốc đi kèm không?','Nếu tôi chưa chuyển ngay thì có mất quyền lợi gì không — vì sao lại gấp như vậy?']
};

var history = [];
function fmtMoney(n){ if(!n) return '—'; return Number(n).toLocaleString('vi-VN')+'đ'; }
function extractAmount(text){
  var m = text.replace(/\./g,'').match(/(\d{4,9})\s*(đ|dong|vnd)?/i);
  if(m) return parseInt(m[1],10);
  var k = text.match(/(\d+(?:[.,]\d+)?)\s*(triệu|tr)/i); if(k) return Math.round(parseFloat(k[1].replace(',','.'))*1000000);
  var kk = text.match(/(\d+)\s*k\b/i); if(kk) return parseInt(kk[1],10)*1000;
  return null;
}
function extractDeadline(text){
  var m = text.match(/(trong \d+ phút|hôm nay|tối nay|trước \d{1,2}h|ngày \d{1,2}\/\d{1,2}|thứ [a-zà-ỹ]+ tuần này|cuối tuần này)/i);
  return m ? m[1] : null;
}
function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function analyzeData(type, amountInput, receiver, content){
  var lower = (' '+content.toLowerCase()+' ');
  var findings = [], score = 0;
  RULES.forEach(function(r){
    var hit = r.kw.filter(function(k){ return lower.indexOf(k) >= 0; });
    if(hit.length){ score += r.score; findings.push({title:r.title, reason:r.reason, quote:hit.join('”, “'), score:r.score}); }
  });
  var hasRefund = /(hoàn cọc|hoàn tiền|trả lại cọc|đổi trả|hoàn lại)/i.test(content);
  if((type==='datcoc' || /cọc/.test(content)) && !hasRefund){ score += 15; findings.push({title:'Chưa rõ điều kiện hoàn cọc / hoàn tiền', reason:'Nội dung không nhắc trường hợp nào được hoàn lại tiền. Đây là thông tin bắt buộc phải làm rõ trước khi đặt cọc.', quote:'Không tìm thấy cụm “hoàn cọc / hoàn tiền” trong nội dung', score:15}); }
  var amountInText = extractAmount(content);
  var amount = amountInput ? parseInt(String(amountInput).replace(/[^\d]/g,''),10) : amountInText;
  if(content.trim().length < 60){ score += 20; findings.push({title:'Nội dung quá thiếu thông tin', reason:'Nội dung bạn cung cấp rất ngắn, chưa rõ số tiền, mục đích, thời hạn và điều kiện — chưa đủ căn cứ để quyết định chuyển tiền.', quote:'Độ dài nội dung: '+content.trim().length+' ký tự', score:20}); }
  if(!amount){ score += 10; findings.push({title:'Chưa xác định được số tiền', reason:'Cả form và nội dung đều không nêu rõ số tiền. Hãy hỏi lại con số chính xác và tổng chi phí cuối cùng.', quote:'Không trích xuất được số tiền', score:10}); }
  if(!receiver && type!=='phi'){ score += 5; findings.push({title:'Chưa rõ thông tin người nhận', reason:'Bạn chưa cung cấp tên / danh tính người nhận để đối chiếu với thông tin trong tin nhắn.', quote:'Ô người nhận đang để trống', score:5}); }
  var positives = POSITIVE.filter(function(p){ return p.kw.some(function(k){ return lower.indexOf(k)>=0; }); }).map(function(p){return p.text;});
  score -= positives.length * 6;
  if(score < 0) score = 0; if(score > 100) score = 100;
  var level = score >= 45 ? 'high' : (score >= 18 ? 'mid' : 'low');
  return {type:type, amount:amount, receiver:receiver, deadline:extractDeadline(content), findings:findings, positives:positives, score:score, level:level, content:content};
}
function levelInfo(level){
  if(level==='high') return {cls:'level-high', color:'var(--red)', title:'🔴 Có dấu hiệu rủi ro cao', desc:'Khoan chuyển tiền. Hãy xác minh kỹ theo danh sách bên dưới, ưu tiên gặp trực tiếp / đối chiếu kênh chính thức.'};
  if(level==='mid') return {cls:'level-mid', color:'var(--yellow)', title:'🟡 Cần xác minh thêm', desc:'Thông tin chưa đủ rõ để yên tâm chuyển tiền. Hãy hỏi thêm các câu ở mục gợi ý trước khi quyết định.'};
  return {cls:'level-low', color:'var(--green)', title:'🟢 Thông tin tương đối rõ', desc:'Chưa phát hiện dấu hiệu bất thường nổi bật trong nội dung đã cung cấp. Vẫn nên giữ biên nhận và đối chiếu lại trước khi chuyển.'};
}
function renderResult(r){
  var li = levelInfo(r.level);
  var h = '<div class="level '+li.cls+'" style="color:'+li.color+'"><h3>'+li.title+'</h3><div style="color:var(--ink);font-size:14px">'+li.desc+'</div><div class="scorebar"><i style="width:'+Math.max(r.score,4)+'%"></i></div><div style="color:var(--ink);font-size:13px;margin-top:6px">Điểm rủi ro: <strong>'+r.score+'/100</strong> — điểm càng cao càng cần thận trọng.</div></div>';
  h += '<h3 style="margin:16px 0 8px">📌 Tóm tắt đã trích xuất</h3><dl class="kv"><dt>Loại giao dịch</dt><dd>'+esc(TYPE_LABEL[r.type])+'</dd><dt>Số tiền</dt><dd>'+fmtMoney(r.amount)+'</dd><dt>Người nhận</dt><dd>'+esc(r.receiver||'Chưa cung cấp')+'</dd><dt>Thời hạn</dt><dd>'+esc(r.deadline||'Không nhắc trong nội dung')+'</dd></dl>';
  h += '<h3 style="margin:18px 0 8px">⚠️ Dấu hiệu cần xác minh ('+r.findings.length+')</h3>';
  if(!r.findings.length) h += '<p style="color:var(--muted)">Không phát hiện dấu hiệu bất thường theo bộ quy tắc hiện tại.</p>';
  r.findings.forEach(function(f){ h += '<div class="finding"><b>'+esc(f.title)+' <span style="color:var(--red);font-size:12px">+'+f.score+' điểm</span></b><p>'+esc(f.reason)+'</p><div class="quote">Căn cứ trong nội dung: “'+esc(f.quote)+'”</div></div>'; });
  if(r.positives.length){ h += '<h3 style="margin:18px 0 8px">✅ Điểm tích cực ghi nhận</h3><ul class="check">'+r.positives.map(function(p){return '<li>'+esc(p)+'</li>';}).join('')+'</ul>'; }
  var qs = QUESTIONS[r.type] || QUESTIONS.dichvu;
  h += '<h3 style="margin:18px 0 8px">💬 Câu hỏi nên hỏi bên nhận tiền</h3><ul class="check">'+qs.map(function(q){return '<li>'+esc(q)+'</li>';}).join('')+'<li>Yêu cầu xác nhận lại tổng tiền và nội dung chuyển khoản bằng văn bản trước khi chuyển.</li><li>Giữ lại toàn bộ tin nhắn, biên nhận và thông tin giao dịch sau khi chuyển.</li></ul>';
  h += '<p style="font-size:13px;color:var(--muted);background:#F8F5FA;border-radius:12px;padding:12px">Lưu ý: kết quả chỉ là gợi ý tham khảo dựa trên nội dung bạn cung cấp — công cụ không xác minh danh tính người nhận, không bảo đảm giao dịch an toàn tuyệt đối và không kết luận bất kỳ ai lừa đảo khi chưa có xác minh.</p>';
  h += '<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-primary" id="dlBtn">⬇️ Tải báo cáo (.txt)</button></div><p style="font-size:13px;color:var(--muted)">Mẹo: mở file .txt vừa tải bằng Word/Google Docs rồi xuất PDF nếu muốn chia sẻ cho người thân cùng xem.</p>';
  document.getElementById('resultEmpty').style.display='none';
  var box = document.getElementById('resultContent'); box.style.display='block'; box.innerHTML=h;
  document.getElementById('dlBtn').addEventListener('click', function(){ downloadReport(r); });
}
function reportText(r){
  var li = levelInfo(r.level);
  var lines = ['MoMo SafeMate — BÁO CÁO KIỂM TRA GIAO DỊCH','Người bạn đồng hành bảo vệ an toàn giao dịch','Thời gian: '+new Date().toLocaleString('vi-VN'),'','Kết luận: '+li.title.replace(/^[^\s]+\s/,'')+' (điểm rủi ro '+r.score+'/100)','Loại giao dịch: '+TYPE_LABEL[r.type],'Số tiền: '+fmtMoney(r.amount),'Người nhận: '+(r.receiver||'Chưa cung cấp'),'Thời hạn: '+(r.deadline||'Không nhắc'),'','DẤU HIỆU CẦN XÁC MINH:'];
  r.findings.forEach(function(f,i){ lines.push((i+1)+'. '+f.title+' — '+f.reason+' [Căn cứ: '+f.quote+']'); });
  if(!r.findings.length) lines.push('(Không phát hiện dấu hiệu bất thường theo bộ quy tắc hiện tại)');
  lines.push('','CÂU HỎI NÊN HỎI:'); (QUESTIONS[r.type]||[]).forEach(function(q,i){ lines.push((i+1)+'. '+q); });
  lines.push('','Lưu ý: Công cụ hỗ trợ tham khảo, không xác minh danh tính, không bảo đảm giao dịch an toàn tuyệt đối.','Nội dung gốc: '+r.content);
  return lines.join('\n');
}
function downloadReport(r){
  var blob = new Blob([reportText(r)], {type:'text/plain;charset=utf-8'});
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'bao-cao-safemate.txt'; a.click(); setTimeout(function(){URL.revokeObjectURL(a.href);}, 1000);
}
function loadSample(key){
  var s = SAMPLES[key]; if(!s) return;
  document.getElementById('fType').value = s.type;
  document.getElementById('fAmount').value = s.amount || '';
  document.getElementById('fReceiver').value = s.receiver || '';
  document.getElementById('fContent').value = s.content || '';
  checkOtp();
  document.getElementById('kiem-tra').scrollIntoView({behavior:'smooth'});
}
function checkOtp(){
  var v = document.getElementById('fContent').value.toLowerCase();
  var box = document.getElementById('otpAlert');
  if(/otp|mật khẩu|password/.test(v)){ box.className='alert-box show alert-otp'; box.innerHTML='🚨 <strong>Cảnh báo đặc biệt:</strong> Nội dung có nhắc tới OTP / mật khẩu. <strong>Tuyệt đối không gửi mã OTP hay mật khẩu cho bất kỳ ai</strong> — kể cả người tự xưng là ngân hàng, MoMo hay ban tổ chức. Nếu bạn đã lỡ cung cấp, hãy liên hệ ngay kênh hỗ trợ chính thức của ngân hàng / ví để khóa tài khoản.'; }
  else { box.className='alert-box'; box.innerHTML=''; }
}
// Khởi tạo thẻ tình huống + chip mẫu
var sg = document.getElementById('scenarioGrid');
SCENARIOS.forEach(function(s){ var b=document.createElement('button'); b.className='card scenario'; b.innerHTML='<div class="icon">'+s.icon+'</div><h3>'+s.title+'</h3><p>'+s.desc+'</p><small>Thử tình huống này →</small>'; b.addEventListener('click', function(){ loadSample(s.key); }); sg.appendChild(b); });
var chips = document.getElementById('sampleChips');
[['high',''],['mid',''],['low','safe'],['lacking','']].forEach(function(pair){ var s=SAMPLES[pair[0]]; var b=document.createElement('button'); b.type='button'; b.className='chip '+pair[1]; b.textContent=s.label; b.addEventListener('click', function(){ loadSample(pair[0]); }); chips.appendChild(b); });
document.getElementById('fContent').addEventListener('input', checkOtp);
document.getElementById('clearBtn').addEventListener('click', function(){ document.getElementById('checkForm').reset(); checkOtp(); });
document.getElementById('checkForm').addEventListener('submit', function(e){
  e.preventDefault();
  var type=document.getElementById('fType').value, amount=document.getElementById('fAmount').value, receiver=document.getElementById('fReceiver').value.trim(), content=document.getElementById('fContent').value.trim();
  if(!content){ return; }
  var r = analyzeData(type, amount, receiver, content);
  renderResult(r);
  history.unshift(r); renderHistory();
  document.getElementById('resultSide').scrollIntoView({behavior:'smooth', block:'nearest'});
});
function renderHistory(){
  var list=document.getElementById('historyList'); document.getElementById('historyEmpty').style.display = history.length ? 'none':'block';
  list.innerHTML='';
  history.forEach(function(r, idx){ var li=levelInfo(r.level); var b=document.createElement('button'); b.className='history-item'; b.innerHTML='<strong>'+esc(TYPE_LABEL[r.type])+' — '+fmtMoney(r.amount)+'</strong> &nbsp;<span class="pill '+(r.level==='high'?'pill-red':r.level==='mid'?'pill-yellow':'pill-green')+'">'+li.title+'</span><div style="color:var(--muted);font-size:13px">Điểm rủi ro '+r.score+'/100 • Bấm để xem lại báo cáo</div>'; b.addEventListener('click', function(){ renderResult(r); }); list.appendChild(b); });
}
document.getElementById('clearHistory').addEventListener('click', function(){ history=[]; renderHistory(); });
