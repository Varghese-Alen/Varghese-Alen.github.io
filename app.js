(function(){
  var pages=document.querySelectorAll('main.page'),arts=document.querySelectorAll('article.art');
  var navs=document.querySelectorAll('.menu a[data-nav]');
  var baseTitle=document.title;
  function route(){
    var h=location.hash||'#/';
    var tgt=document.getElementById(h.replace('#',''));
    var study=tgt&&tgt.closest('#art-four-wing-flapping-robot');
    if(study){pages.forEach(function(p){p.classList.remove('open')});arts.forEach(function(a){a.classList.toggle('open',a===study)});document.body.classList.remove('is-home','is-contact');navs.forEach(function(a){a.classList.toggle('on',a.dataset.nav==='projects')});document.title='Four wing flapping robot · '+baseTitle;requestAnimationFrame(function(){tgt.focus({preventScroll:true});tgt.scrollIntoView()});return;}
    if(tgt&&tgt.closest('article.art.open')){tgt.scrollIntoView();return;}
    var name='home',slug=null;
    if(h.indexOf('#/project/')===0){slug=h.slice(10);name='projects';}
    else if(h.length>2){name=h.slice(2).replace(/\/$/,'');}
    var sub=null;if(!slug&&name.indexOf('/')>0){sub=name.split('/')[1];name=name.split('/')[0];}
    var known=['home','projects','blogs','about','contact'];
    if(known.indexOf(name)<0)name='home';
    pages.forEach(function(p){p.classList.toggle('open',!slug&&p.dataset.page===name)});
    document.body.classList.toggle('is-home',!slug&&name==='home');
    document.body.classList.toggle('is-contact',!slug&&name==='contact');
    if(name==='projects'&&!slug&&sub){var fb=document.querySelector('.pfilter button[data-f="'+sub+'"]');if(fb)fb.click();}
    arts.forEach(function(a){a.classList.toggle('open',!!slug&&a.dataset.slug===slug)});
    navs.forEach(function(a){a.classList.toggle('on',a.dataset.nav===name)});
    window.scrollTo(0,0);
    /* a tab title for every page: the project name on project pages, the page name elsewhere */
    var pageTitles={projects:'Projects',blogs:'Blogs',about:'About',contact:'Contact'};
    if(slug){var heading=document.querySelector('article.art[data-slug="'+slug+'"] h1');document.title=(heading?heading.textContent.trim()+' · ':'')+baseTitle;}
    else document.title=pageTitles[name]?pageTitles[name]+' · '+baseTitle:baseTitle;
    document.querySelectorAll('.flapper-study video').forEach(function(v){if(!v.closest('.art.open'))v.pause()});
    if(slug==='four-wing-flapping-robot'){document.title='Four wing flapping robot · '+baseTitle;var title=document.getElementById('flapper-title');if(title)title.focus({preventScroll:true});}
  }
  var REL=[{k:"2026-11-21",d:"21 Nov 2026",t:"Four wing flapping robot",kind:"Log",h:"#/project/four-wing-flapping-robot"}];
  REL.push({k:'2026-10-19',d:'19 Oct 2026',t:'Sheet metal PC case',kind:'Log',h:'#/project/sheet-metal-pc-case'});
  /* home glimpses: an index of the latest projects; pointing at a row swaps the picture above it */
  (function(){
    function el(tag,cls,t){var e=document.createElement(tag);if(cls)e.className=cls;if(t!=null)e.textContent=t;return e}
    function pad(n){return(n<10?'0':'')+n}
    var cards=[].slice.call(document.querySelectorAll('.pgrid .pc')).map(function(c){var tm=c.querySelector('time'),im=c.querySelector('img');
      return{h:c.getAttribute('href'),k:tm?tm.getAttribute('datetime'):'',d:tm?tm.textContent:'',t:(c.querySelector('.pc-t')||{}).textContent||'',img:im?im.getAttribute('src'):'',alt:im?im.getAttribute('alt'):''}})
      .sort(function(x,y){return x.k<y.k?1:-1});
    var cnt=document.querySelector('[data-gl="count"]');if(cnt)cnt.textContent=cards.length+(cards.length===1?' build log':' build logs');
    function row(n,t,d,href){var li=el('li'),a=el('a');a.href=href;a.appendChild(el('span','ix-n',pad(n)));a.appendChild(el('span','ix-t',t));a.appendChild(el('span','ix-d',d));a.appendChild(el('i','','→'));li.appendChild(a);return li}
    var list=document.querySelector('[data-gl="projects"]'),pv=document.querySelector('[data-gl="preview"]'),top=cards.slice(0,3),cur=0;
    if(list&&pv&&top.length){
      var pvc=pv.querySelector('.gl-pvc'),imgs=top.map(function(c){var im=el('img');im.src=c.img;im.alt='';im.decoding='async';pv.appendChild(im);return im});
      var links=top.map(function(c,i){var li=row(i+1,c.t,c.d,c.h);list.appendChild(li);return li.firstChild});
      function act(i){cur=i;imgs.forEach(function(m,j){m.classList.toggle('on',j===i)});links.forEach(function(a,j){a.classList.toggle('on',j===i)});pvc.textContent=pad(i+1)+' / '+pad(top.length)}
      links.forEach(function(a,i){a.addEventListener('pointerenter',function(){act(i)});a.addEventListener('focus',function(){act(i)})});
      pv.addEventListener('click',function(){location.hash=top[cur].h});
      act(0);
    }else if(pv)pv.style.display='none';
    var bl=document.querySelector('[data-gl="blogs"]');
    if(bl){var posts=REL.filter(function(r){return r.kind==='Blog'}).sort(function(x,y){return x.k<y.k?1:-1}).slice(0,3);
      if(!posts.length){var li=el('li','gl-empty');li.appendChild(el('span','',bl.getAttribute('data-empty')));bl.appendChild(li)}
      posts.forEach(function(r,i){bl.appendChild(row(i+1,r.t,r.d,r.h))})}
  })();
  /* Home shows the About intro, then a link to the full About page */
  (function(){
    var src=document.querySelector('main[data-page="about"]'),home=document.querySelector('[data-story-home]');if(!src||!home)return;
    [].slice.call(src.querySelectorAll('[data-teaser]')).forEach(function(p){var c=p.cloneNode(true);c.removeAttribute('data-teaser');home.appendChild(c)});
    var l=document.createElement('a');l.className='more-btn';l.href='#/about';l.innerHTML='<span>Keep reading</span><i aria-hidden="true">→</i>';home.appendChild(l);
  })();
  /* About: chapters you switch between (tabs). Arrow keys, Home and End move between them. */
  (function(){
    var list=document.querySelector('.abt-list');if(!list)return;
    var tabs=[].slice.call(list.querySelectorAll('[role="tab"]')).filter(function(t){return !t.hidden});
    function pick(t,focus){tabs.forEach(function(x){var on=x===t,p=document.getElementById(x.getAttribute('aria-controls'));
      x.classList.toggle('on',on);x.setAttribute('aria-selected',on?'true':'false');x.tabIndex=on?0:-1;if(p)p.hidden=!on});
      if(focus)t.focus();if(window.innerWidth<=900)t.scrollIntoView({block:'nearest',inline:'nearest'})}
    tabs.forEach(function(t,i){t.addEventListener('click',function(){pick(t)});
      t.addEventListener('keydown',function(e){var k=e.key,j=-1;
        if(k==='ArrowDown'||k==='ArrowRight')j=(i+1)%tabs.length;else if(k==='ArrowUp'||k==='ArrowLeft')j=(i-1+tabs.length)%tabs.length;
        else if(k==='Home')j=0;else if(k==='End')j=tabs.length-1;
        if(j>-1){e.preventDefault();pick(tabs[j],true)}})});
  })();
  (function(){var bs=document.querySelectorAll('.pfilter button'),cs=document.querySelectorAll('.pc'),ct=document.getElementById('pcount');
    function pick(b){var f=b.dataset.f,n=0;
      bs.forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b?'true':'false')});
      cs.forEach(function(c){var show=c.dataset.tags.split(' ').indexOf(f)>-1;c.classList.toggle('hide',!show);if(show)n++});
      if(ct)ct.textContent=n+(n===1?' project':' projects')}
    bs.forEach(function(b){b.addEventListener('click',function(){pick(b)})});
    if(bs.length)pick(bs[0])})();
  (function(){
    var btn=document.querySelector('.menu-btn'),menu=document.getElementById('site-menu'),hdr=document.querySelector('.topbar'),root=document.documentElement;
    if(!btn||!menu)return;
    var isOpen=false,page=document.querySelectorAll('main,footer,article.art,.gt');
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
      REL.filter(function(x){return x.kind==='Blog'}).sort(function(x,y){return x.k<y.k?1:-1}).slice(0,2).forEach(function(x){var r=document.createElement('div');r.className='pv-row';r.appendChild(txt('i','',x.d));r.appendChild(txt('b','',x.t));b.appendChild(r)});
      var ab=mk('about','04 · About');
      var sp=document.querySelectorAll('main[data-page="about"] [data-teaser]');
      if(sp[0]){var r=document.createElement('div');r.className='pv-row';r.appendChild(txt('b','',sp[0].textContent||''));ab.appendChild(r)}
      if(sp[1])ab.appendChild(txt('p','pv-t',sp[1].textContent||''));
      var c=mk('contact','05 · Contact');
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
  /* light and dark: opens in light for every new visitor, then remembers the visitor's own choice */
  (function(){
    var root=document.documentElement,btn=document.querySelector('.theme-btn'),meta=document.querySelector('meta[name="theme-color"]');
    var rm=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
    function apply(t){root.setAttribute('data-theme',t);if(meta)meta.setAttribute('content',t==='light'?'#F2EADC':'#101211');
      if(btn){var nx=t==='light'?'dark':'light';btn.setAttribute('aria-label','Switch to '+nx+' theme')}}
    apply(root.getAttribute('data-theme')==='light'?'light':'dark');
    if(!btn)return;
    btn.addEventListener('click',function(){
      var nx=root.getAttribute('data-theme')==='light'?'dark':'light';
      try{localStorage.setItem('theme',nx)}catch(e){}
      if(!document.startViewTransition||rm.matches){apply(nx);return}
      var r=btn.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,rad=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
      var vt=document.startViewTransition(function(){apply(nx)});
      vt.ready.then(function(){root.animate({clipPath:['circle(0px at '+x+'px '+y+'px)','circle('+rad+'px at '+x+'px '+y+'px)']},{duration:700,easing:'cubic-bezier(.76,0,.24,1)',pseudoElement:'::view-transition-new(root)'})}).catch(function(){});
    });
  })();
  window.addEventListener('hashchange',route);
  route();
})();
