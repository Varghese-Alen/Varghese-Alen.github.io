/* Four wing study: theme media, plus muted autoplay while the motion is on screen. */
(function(){
  'use strict';
  var root=document.documentElement,queued=false;
  function apply(){
    queued=false;
    var theme=root.getAttribute('data-theme')==='light'?'light':'dark';
    document.querySelectorAll('img[data-fw-light]').forEach(function(im){
      var src=im.getAttribute('data-fw-'+theme),set=im.getAttribute('data-fw-'+theme+'-srcset');
      if(set&&im.getAttribute('srcset')!==set)im.setAttribute('srcset',set);
      if(src&&im.getAttribute('src')!==src)im.setAttribute('src',src);
    });
    document.querySelectorAll('img:not([data-fw-light])').forEach(function(im){
      var src=im.getAttribute('src')||'';
      if(/assets\/four-wing-flapping-robot\/card-(light|dark)\.webp$/.test(src)){
        var next=src.replace(/card-(light|dark)\.webp$/,'card-'+theme+'.webp');
        if(src!==next)im.setAttribute('src',next);
      }
    });
    document.querySelectorAll('[data-fw-light-href]').forEach(function(a){a.setAttribute('href',a.getAttribute('data-fw-'+theme+'-href'))});
    document.querySelectorAll('video[data-fw-light]').forEach(function(v){
      var src=v.getAttribute('data-fw-'+theme),source=v.querySelector('source');
      v.poster=v.getAttribute('data-fw-'+theme+'-poster');
      if(source.getAttribute('src')===src)return;
      var playing=!v.paused&&!v.ended,time=v.currentTime||0,version=(v._themeVersion||0)+1;v._themeVersion=version;
      v._fwSwap=true;v.pause();v._fwSwap=false;source.setAttribute('src',src);
      v.addEventListener('loadedmetadata',function(){
        if(v._themeVersion!==version)return;
        v.currentTime=Math.min(time,Math.max(0,v.duration-.01));
        if(playing&&v.closest('.art.open')&&!document.hidden){var p=v.play();if(p&&p.catch)p.catch(function(){})}
      },{once:true});
      v.load();
    });
  }
  function schedule(){if(!queued){queued=true;requestAnimationFrame(apply)}}
  new MutationObserver(schedule).observe(root,{attributes:true,attributeFilter:['data-theme']});
  new MutationObserver(function(changes){if(changes.some(function(c){return c.addedNodes.length}))schedule()}).observe(document.body,{childList:true,subtree:true});
  document.addEventListener('visibilitychange',function(){if(document.hidden)document.querySelectorAll('#art-four-wing-flapping-robot video').forEach(function(v){v.pause()})});
  apply();
})();
/* Autoplay the linkage motion, muted and looping, while at least half of it is on screen.
   It never autoplays for visitors who prefer reduced motion, and once a visitor pauses,
   or plays it themselves, it stays under their control. */
(function(){
  'use strict';
  var video=document.querySelector('#art-four-wing-flapping-robot video');
  if(!video)return;
  var article=video.closest('article');
  var reduced=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
  var enough=false,blocked=false,userControl=false,ours=0;
  video.muted=true;video.loop=true;video.playsInline=true;
  function open(){return !!article&&article.classList.contains('open')&&!document.hidden}
  function play(){
    if(!video.paused)return;
    ours++;
    try{var p=video.play();if(p&&typeof p.catch==='function')p.catch(function(){ours=Math.max(0,ours-1);blocked=true})}
    catch(e){ours=Math.max(0,ours-1);blocked=true}
  }
  function update(){
    if(!open()||!enough||reduced.matches){if(!video.paused&&!userControl){video._fwSwap=true;video.pause();video._fwSwap=false}return}
    if(!userControl&&!blocked&&video.paused)play();
  }
  video.addEventListener('play',function(){if(ours>0){ours--;return}userControl=true});
  video.addEventListener('pause',function(){
    /* pauses from leaving the page, switching tabs, theme swaps or scrolling away are not the visitor's choice */
    if(video._fwSwap||!open()||!enough)return;
    userControl=true;
  });
  if(window.IntersectionObserver){
    new IntersectionObserver(function(entries){enough=entries[entries.length-1].intersectionRatio>=0.5;update()},{threshold:[0,0.5,0.75,1]}).observe(video);
  }else{
    var measure=function(){var r=video.getBoundingClientRect(),h=Math.min(r.bottom,window.innerHeight)-Math.max(r.top,0);enough=r.width>0&&h>=r.height/2;update()};
    window.addEventListener('scroll',measure,{passive:true});window.addEventListener('resize',measure);measure();
  }
  if(article)new MutationObserver(update).observe(article,{attributes:true,attributeFilter:['class']});
  document.addEventListener('visibilitychange',update);
  video.addEventListener('loadedmetadata',update);
  if(reduced.addEventListener)reduced.addEventListener('change',update);else if(reduced.addListener)reduced.addListener(update);
})();
