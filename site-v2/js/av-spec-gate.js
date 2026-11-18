(function(){
  var KEY='av-spec-unlock';
  function unlocked(){
    try{return sessionStorage.getItem(KEY)==='1';}catch(e){return false;}
  }
  function setUnlocked(){
    try{sessionStorage.setItem(KEY,'1');}catch(e){}
  }
  function langIsZh(){
    return (document.documentElement.lang||'').toLowerCase().indexOf('zh')===0;
  }
  var copy = langIsZh() ? {
    title:'下载规格书',
    lead:'留下邮箱或 WhatsApp，即可下载该产品规格书 PDF。我们仅用于发送资料，不会公开您的信息。',
    email:'邮箱',
    wa:'WhatsApp',
    or:'或',
    submit:'获取 PDF',
    cancel:'取消',
    err:'请填写邮箱或 WhatsApp',
    note:'留下邮箱或 WhatsApp 后即可下载'
  } : {
    title:'Download the specification',
    lead:'Enter your email or WhatsApp to get this product specification PDF. We use the details only to send the file and follow up if you have questions.',
    email:'Email',
    wa:'WhatsApp',
    or:'or',
    submit:'Get the PDF',
    cancel:'Cancel',
    err:'Please enter an email or WhatsApp number',
    note:'Enter your email or WhatsApp to download'
  };

  function productName(){
    var t=document.querySelector('h1');
    return t?t.textContent.trim():document.title;
  }

  var pendingHref='';
  var pendingDownload=false;

  function ensureOverlay(){
    var el=document.getElementById('specGateOverlay');
    if(el) return el;
    el=document.createElement('div');
    el.id='specGateOverlay';
    el.className='spec-gate-overlay';
    el.innerHTML='<div class="spec-gate-box" role="dialog" aria-modal="true" aria-labelledby="specGateTitle">'
      +'<button type="button" class="spec-gate-close" data-gate-close aria-label="Close">&times;</button>'
      +'<h3 id="specGateTitle"></h3>'
      +'<p data-gate-lead></p>'
      +'<form id="specGateForm" name="spec-download" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/contact">'
      +'<input type="hidden" name="form-name" value="spec-download">'
      +'<p style="display:none"><label>Do not fill this out: <input name="bot-field"></label></p>'
      +'<input type="hidden" name="product" id="specGateProduct">'
      +'<input type="hidden" name="file" id="specGateFile">'
      +'<label for="specGateEmail"></label>'
      +'<input type="email" name="email" id="specGateEmail" autocomplete="email">'
      +'<div class="spec-gate-or"></div>'
      +'<label for="specGateWa"></label>'
      +'<input type="tel" name="whatsapp" id="specGateWa" autocomplete="tel" placeholder="+">'
      +'<div class="spec-gate-err" id="specGateErr"></div>'
      +'<div class="spec-gate-actions">'
      +'<button type="submit" class="ui-btn ui-btn--primary" id="specGateSubmit"></button>'
      +'<button type="button" class="ui-btn ui-btn--secondary" data-gate-close></button>'
      +'</div></form></div>';
    document.body.appendChild(el);
    el.querySelector('#specGateTitle').textContent=copy.title;
    el.querySelector('[data-gate-lead]').textContent=copy.lead;
    el.querySelector('label[for="specGateEmail"]').textContent=copy.email;
    el.querySelector('label[for="specGateWa"]').textContent=copy.wa;
    el.querySelector('.spec-gate-or').textContent=copy.or;
    el.querySelector('#specGateSubmit').textContent=copy.submit;
    el.querySelectorAll('[data-gate-close]')[1].textContent=copy.cancel;
    el.querySelector('#specGateErr').textContent=copy.err;
    el.addEventListener('click', function(e){
      if(e.target===el || e.target.getAttribute('data-gate-close')!==null) closeGate();
    });
    el.querySelector('#specGateForm').addEventListener('submit', onSubmit);
    return el;
  }

  function openGate(href, asDownload){
    pendingHref=href;
    pendingDownload=!!asDownload;
    var el=ensureOverlay();
    el.querySelector('#specGateProduct').value=productName();
    el.querySelector('#specGateFile').value=href;
    el.querySelector('#specGateErr').style.display='none';
    el.classList.add('is-open');
    var email=el.querySelector('#specGateEmail');
    if(email) email.focus();
  }
  function closeGate(){
    var el=document.getElementById('specGateOverlay');
    if(el) el.classList.remove('is-open');
  }

  function revealCards(){
    document.querySelectorAll('.spec-dl-card').forEach(function(card){
      card.classList.remove('is-gated');
      var note=card.querySelector('.spec-dl-locked-note');
      if(note) note.remove();
    });
  }

  function onSubmit(e){
    e.preventDefault();
    var form=e.target;
    var email=(form.email.value||'').trim();
    var wa=(form.whatsapp.value||'').trim();
    var err=document.getElementById('specGateErr');
    if(!email && !wa){
      err.style.display='block';
      return;
    }
    try{
      var body=new URLSearchParams(new FormData(form)).toString();
      fetch(form.getAttribute('action')||'/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:body,keepalive:true}).catch(function(){});
    }catch(err2){}
    if(typeof fbq!=='undefined') fbq('track','Lead');
    if(typeof gtag!=='undefined') gtag('event','generate_lead',{event_category:'conversion',event_label:'spec-download'});
    if(wa){
      var lines=['Spec sheet request from asiavisionled.com','','WhatsApp: '+wa];
      if(email) lines.push('Email: '+email);
      lines.push('Product: '+((form.product&&form.product.value)||productName()));
      lines.push('File: '+((form.file&&form.file.value)||pendingHref));
      window.open('https://wa.me/8617276665558?text='+encodeURIComponent(lines.join('\n')),'_blank','noopener');
    }
    setUnlocked();
    revealCards();
    closeGate();
    if(pendingHref){
      if(pendingDownload){
        var a=document.createElement('a');
        a.href=pendingHref;
        a.setAttribute('download','');
        document.body.appendChild(a);
        a.click();
        a.remove();
      }else{
        window.open(pendingHref,'_blank','noopener');
      }
    }
  }

  function bind(){
    var cards=document.querySelectorAll('.spec-dl-card');
    if(!cards.length) return;
    if(unlocked()) return;
    cards.forEach(function(card){
      card.classList.add('is-gated');
      if(!card.querySelector('.spec-dl-locked-note')){
        var note=document.createElement('p');
        note.className='spec-dl-locked-note';
        note.textContent=copy.note;
        var body=card.querySelector('.spec-dl-body')||card;
        body.appendChild(note);
      }
      card.addEventListener('click', function(e){
        if(unlocked()) return;
        var a=e.target.closest('a');
        if(!a) return;
        var href=a.getAttribute('href')||'';
        if(href.indexOf('/downloads/specs/')===-1) return;
        e.preventDefault();
        openGate(href, a.hasAttribute('download'));
      }, true);
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();
})();
