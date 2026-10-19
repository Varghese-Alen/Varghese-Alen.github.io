(function(){
  var pages=document.querySelectorAll('main.page'),arts=document.querySelectorAll('article.art');
  var navs=document.querySelectorAll('.menu a[data-nav]');
  function route(){
    var h=location.hash||'#/';
    var tgt=document.getElementById(h.replace('#',''));
    if(tgt&&tgt.closest('article.art.open')){tgt.scrollIntoView();return;}
    var name='home',slug=null;
    if(h.indexOf('#/project/')===0){slug=h.slice(10);name='projects';}
    else if(h.length>2){name=h.slice(2).replace(/\/$/,'');}
    var known=['home','projects','blogs','contact'];
    if(known.indexOf(name)<0)name='home';
    pages.forEach(function(p){p.classList.toggle('open',!slug&&p.dataset.page===name)});
    document.body.classList.toggle('is-home',!slug&&name==='home');
    arts.forEach(function(a){a.classList.toggle('open',!!slug&&a.dataset.slug===slug)});
    navs.forEach(function(a){a.classList.toggle('on',a.dataset.nav===name)});
    window.scrollTo(0,0);
  }
  document.querySelectorAll('.gal').forEach(function(g){
    var figs=g.querySelectorAll('.gal-plates .fig'),caps=JSON.parse(g.querySelector('script').textContent),i=0;
    var cap=g.querySelector('.gal-cap'),n=g.querySelector('.gal-n');
    function show(k){i=(k+figs.length)%figs.length;figs.forEach(function(f,j){f.classList.toggle('off',j!==i)});cap.textContent=caps[i];n.textContent=(i+1)+' / '+figs.length;}
    g.querySelector('.gal-prev').addEventListener('click',function(){show(i-1)});
    g.querySelector('.gal-next').addEventListener('click',function(){show(i+1)});
    show(0);
  });
  var REL=[
    {k:'2026-10-19',d:'19 Oct 2026',t:'Sheet metal PC case',kind:'Log',h:'#/project/sheet-metal-pc-case'},
    {k:'2026-10-12',d:'12 Oct 2026',t:'Automatic rubber-tapping machine',kind:'Log',h:'#/project/rubber-tapping-machine'}
  ];
  (function(){
    document.querySelectorAll('.rel').forEach(function(ul){var kind=ul.getAttribute('data-kind');ul.textContent='';
      REL.filter(function(r){return r.kind===kind}).sort(function(x,y){return x.k<y.k?1:-1}).slice(0,2).forEach(function(r){
        var li=document.createElement('li'),a=document.createElement('a');a.href=r.h;
        [['rd',r.d],['rt',r.t]].forEach(function(p){var sp=document.createElement('span');sp.className=p[0];sp.textContent=p[1];a.appendChild(sp)});
        li.appendChild(a);ul.appendChild(li)})})
  })();
  (function(){var bs=document.querySelectorAll('.pfilter button'),cs=document.querySelectorAll('.pc'),ct=document.getElementById('pcount');
    function pick(b){var f=b.dataset.f,n=0;
      bs.forEach(function(x){x.classList.toggle('on',x===b)});
      cs.forEach(function(c){var show=c.dataset.tags.split(' ').indexOf(f)>-1;c.classList.toggle('hide',!show);if(show)n++});
      if(ct)ct.textContent=n+(n===1?' project':' projects')}
    bs.forEach(function(b){b.addEventListener('click',function(){pick(b)})});
    if(bs.length)pick(bs[0])})();
  (function(){
    var btn=document.querySelector('.menu-btn'),menu=document.getElementById('site-menu'),hdr=document.querySelector('.topbar'),root=document.documentElement;
    if(!btn||!menu)return;
    var isOpen=false,page=document.querySelectorAll('main,footer');
    function place(){var r=btn.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,rad=Math.ceil(Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y)))+8;
      menu.style.setProperty('--mx',x+'px');menu.style.setProperty('--my',y+'px');menu.style.setProperty('--mr',rad+'px')}
    var set=function(v){isOpen=v;place();menu.classList.toggle('open',v);btn.classList.toggle('open',v);
      btn.setAttribute('aria-expanded',v?'true':'false');btn.setAttribute('aria-label',v?'Close menu':'Open menu');menu.setAttribute('aria-hidden',v?'false':'true');
      page.forEach(function(e){if(v)e.setAttribute('inert','');else e.removeAttribute('inert')});
      if(v){menu.removeAttribute('inert');root.classList.add('menu-open');setTimeout(function(){if(isOpen){var a=menu.querySelector('a.on')||menu.querySelector('a');if(a)a.focus({preventScroll:true})}},380)}
      else{menu.setAttribute('inert','');root.classList.remove('menu-open')}};
    btn.addEventListener('click',function(){set(!isOpen)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&isOpen){set(false);btn.focus({preventScroll:true})}});
    menu.addEventListener('click',function(e){if(e.target===menu||e.target.tagName==='NAV'||(e.target.classList&&e.target.classList.contains('mi'))||e.target.closest('a'))set(false)});
    var br=document.querySelector('.topbar .brand');if(br)br.addEventListener('click',function(){if(isOpen)set(false)});
    window.addEventListener('hashchange',function(){if(isOpen)set(false)});
    window.addEventListener('resize',function(){if(isOpen)place()});
    function sc(){hdr.classList.toggle('scrolled',window.scrollY>8)}window.addEventListener('scroll',sc,{passive:true});sc();
    var panel=menu.querySelector('.pv-panel'),links=[].slice.call(menu.querySelectorAll('nav a')),panes={};
    function mk(key,label){var d=document.createElement('div');d.className='pv pv-'+key;var k=document.createElement('div');k.className='pv-k';k.textContent=label;d.appendChild(k);panel.appendChild(d);panes[key]=d;return d}
    function txt(tag,cls,t){var e=document.createElement(tag);if(cls)e.className=cls;e.textContent=t;return e}
    (function build(){
      var p=mk('projects','02 · Projects');
      [].slice.call(document.querySelectorAll('.pgrid .pc')).slice(0,2).forEach(function(c){
        var row=document.createElement('div');row.className='pv-card';var im=c.querySelector('img');if(im){var i2=im.cloneNode(true);row.appendChild(i2)}
        var box=document.createElement('div');box.appendChild(txt('b','',(c.querySelector('.pc-t')||{}).textContent||''));
        box.appendChild(txt('span','',[].slice.call(c.querySelectorAll('.pc-top time, .pc-top span')).map(function(x){return x.textContent}).join(' · ')));row.appendChild(box);p.appendChild(row)});
      var b=mk('blogs','03 · Blogs');
      [].slice.call(document.querySelectorAll('.rel[data-kind="Blog"] li')).slice(0,2).forEach(function(li){var r=document.createElement('div');r.className='pv-row';r.appendChild(txt('i','',(li.querySelector('.rd')||{}).textContent||''));r.appendChild(txt('b','',(li.querySelector('.rt')||{}).textContent||''));b.appendChild(r)});
      var c=mk('contact','04 · Contact');
      [].slice.call(document.querySelectorAll('main[data-page="contact"] .ct-mail, main[data-page="contact"] .links li a')).forEach(function(l){var r=document.createElement('div');r.className='pv-row sm';r.appendChild(txt('b','',l.textContent||''));c.appendChild(r)});
    })();
    var curKey='home';
    function show(key){curKey=key;panel.classList.toggle('none',!panes[key]);Object.keys(panes).forEach(function(k){panes[k].classList.toggle('on',k===key)});
      var l=links.filter(function(a){return a.getAttribute('data-nav')===key})[0];panel.setAttribute('data-href',l?l.getAttribute('href'):'#/')}
    links.forEach(function(a){['pointerenter','focus'].forEach(function(ev){a.addEventListener(ev,function(){if(ev==='focus'&&!a.matches(':focus-visible'))return;show(a.getAttribute('data-nav'))})})});
    panel.addEventListener('click',function(){var h=panel.getAttribute('data-href');if(h){set(false);if(location.hash!==h)location.hash=h}});
    var openSet=set;
    var rdy;
    set=function(v){if(v){var act=menu.querySelector('nav a.on');show(act?act.getAttribute('data-nav'):'home')}openSet(v);clearTimeout(rdy);menu.classList.remove('ready');if(v)rdy=setTimeout(function(){menu.classList.add('ready')},1300)};
    show('home');
    menu.setAttribute('inert','');
  })();
  (function(){var b=document.querySelector('.fup');if(!b)return;
    b.addEventListener('click',function(){var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;window.scrollTo({top:0,behavior:rm?'auto':'smooth'})})})();
  (function(){
    var root=document.querySelector('.ct-in');if(!root)return;
    var email=root.getAttribute('data-email'),mail=root.querySelector('.ct-mail'),copy=root.querySelector('.ct-copy'),lab=copy.querySelector('span'),send=root.querySelector('.ct-send'),
        msg=root.querySelector('textarea'),nm=root.querySelector('input'),chips=[].slice.call(root.querySelectorAll('.ct-chips button')),subj='',t;
    mail.textContent=email;mail.href='mailto:'+email;
    function build(){var m=msg.value.trim(),n=nm.value.trim();
      send.href='mailto:'+email+'?subject='+encodeURIComponent(subj||'Hello from your site')+'&body='+encodeURIComponent(m+(n?'\n\n'+String.fromCharCode(8212)+' '+n:''));
      send.setAttribute('aria-disabled',m.length>=3?'false':'true')}
    chips.forEach(function(c){c.addEventListener('click',function(){var was=c.getAttribute('aria-pressed')==='true';
      chips.forEach(function(x){x.setAttribute('aria-pressed','false')});
      if(!was){c.setAttribute('aria-pressed','true');subj=c.getAttribute('data-s');if(!msg.value)msg.focus()}else subj='';build()})});
    msg.addEventListener('input',build);nm.addEventListener('input',build);
    send.addEventListener('click',function(e){if(send.getAttribute('aria-disabled')==='true'){e.preventDefault();msg.focus();send.classList.remove('nudge');void send.offsetWidth;send.classList.add('nudge')}});
    function done(){copy.classList.add('copied');lab.textContent='Copied';clearTimeout(t);t=setTimeout(function(){copy.classList.remove('copied');lab.textContent='Copy'},1900)}
    function fallback(){var ta=document.createElement('textarea');ta.value=email;ta.setAttribute('readonly','');ta.style.cssText='position:fixed;left:-9999px;top:0;opacity:0';document.body.appendChild(ta);ta.select();try{if(document.execCommand('copy'))done()}catch(e){}document.body.removeChild(ta)}
    copy.addEventListener('click',function(){if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(email).then(done,fallback)}else fallback()});
    build();
  })();
  window.addEventListener('hashchange',route);
  route();
})();
