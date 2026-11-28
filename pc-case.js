/* Sheet Metal PC Case: theme images and video, and visitor-respecting looping playback */
(function(){
  'use strict';
  var root=document.documentElement,queued=false,videoTheme=null;
  function apply(){
    queued=false;
    var theme=root.getAttribute('data-theme')==='light'?'light':'dark';
    document.querySelectorAll('img[data-pcc-light]').forEach(function(im){
      var src=im.getAttribute('data-pcc-'+theme),set=im.getAttribute('data-pcc-'+theme+'-srcset');
      if(set&&im.getAttribute('srcset')!==set)im.setAttribute('srcset',set);
      if(src&&im.getAttribute('src')!==src)im.setAttribute('src',src);
    });
    /* The existing Home preview copies the card source rather than its attributes. */
    document.querySelectorAll('img:not([data-pcc-light])').forEach(function(im){
      var src=im.getAttribute('src')||'';
      if(/(?:^|\/)card-sheet-metal-pc-case-(light|dark)\.webp(?:\?|$)/.test(src)){
        var next=src.replace(/card-sheet-metal-pc-case-(light|dark)\.webp/,'card-sheet-metal-pc-case-'+theme+'.webp');
        if(src!==next)im.setAttribute('src',next);
      }
    });
    if(videoTheme)videoTheme(theme);
  }
  function schedule(){if(!queued){queued=true;requestAnimationFrame(apply)}}
  new MutationObserver(schedule).observe(root,{attributes:true,attributeFilter:['data-theme']});
  new MutationObserver(function(changes){if(changes.some(function(c){return c.addedNodes.length}))schedule()}).observe(document.body,{childList:true,subtree:true});
  apply();
  var video=document.querySelector('#art-sheet-metal-pc-case video');
  if(!video)return;
  var article=video.closest('article');
  var reduced=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
  var enough=false,blocked=false,ended=false,userPaused=false,userPlayed=false,autoActive=false,expectedPlays=0,expectedPauses=0;
  video.muted=true;video.loop=true;video.playsInline=true;
  function pause(){if(video.paused)return;expectedPauses++;autoActive=false;video.pause()}
  function play(){
    if(!video.paused)return;
    expectedPlays++;autoActive=true;
    try{
      var p=video.play();
      if(p&&typeof p.catch==='function')p.catch(function(e){expectedPlays=Math.max(0,expectedPlays-1);autoActive=false;if(!e||e.name!=='AbortError')blocked=true});
    }catch(e){expectedPlays=Math.max(0,expectedPlays-1);autoActive=false;if(!e||e.name!=='AbortError')blocked=true}
  }
  video.addEventListener('play',function(){if(expectedPlays>0){expectedPlays--;return}autoActive=false;userPlayed=true;userPaused=false});
  video.addEventListener('pause',function(){if(video._pccSwap)return;if(expectedPauses>0){expectedPauses--;return}autoActive=false;userPaused=true});
  /* a loop restart (end of clip straight back to the start) is not the visitor scrubbing */
  var lastTime=0;
  video.addEventListener('timeupdate',function(){lastTime=video.currentTime});
  video.addEventListener('seeking',function(){
    if(video._pccSeek)return;
    if(video.loop&&video.currentTime<0.5&&video.duration&&lastTime>video.duration-1)return;
    autoActive=false;userPlayed=true;userPaused=false;
  });
  video.addEventListener('seeked',function(){video._pccSeek=false});
  video.addEventListener('ended',function(){ended=true;autoActive=false});
  function canAuto(){
    return !!article&&article.classList.contains('open')&&!document.hidden&&enough&&!reduced.matches&&!blocked&&!ended&&!userPaused&&!userPlayed;
  }
  function update(){
    if(!article||!article.classList.contains('open')||document.hidden||!enough){pause();return}
    if(reduced.matches){if(autoActive)pause();return}
    if(canAuto()&&video.paused)play();
  }
  if(window.IntersectionObserver){
    new IntersectionObserver(function(entries){enough=entries[entries.length-1].intersectionRatio>=0.5;update()},{threshold:[0,0.5,0.75,1]}).observe(video);
  }else{
    function measure(){var r=video.getBoundingClientRect(),h=Math.min(r.bottom,window.innerHeight)-Math.max(r.top,0);enough=r.width>0&&h>=r.height/2;update()}
    window.addEventListener('scroll',measure,{passive:true});window.addEventListener('resize',measure);measure();
  }
  if(article)new MutationObserver(update).observe(article,{attributes:true,attributeFilter:['class']});
  /* Light and dark versions of the animation follow the site theme, keeping the position and play state. */
  videoTheme=function(theme){
    var src=video.getAttribute('data-pcc-'+theme),poster=video.getAttribute('data-pcc-'+theme+'-poster'),source=video.querySelector('source');
    if(poster&&video.getAttribute('poster')!==poster)video.setAttribute('poster',poster);
    if(!src||!source||source.getAttribute('src')===src)return;
    var wasPlaying=!video.paused&&!video.ended,wasAuto=autoActive,started=video.readyState>0||wasPlaying,time=video.currentTime||0;
    var version=(video._pccTheme||0)+1;video._pccTheme=version;
    if(wasPlaying){video._pccSwap=true;autoActive=false;video.pause()}
    source.setAttribute('src',src);
    var link=video.querySelector('a');if(link)link.setAttribute('href',src);
    if(!started){video.load();video._pccSwap=false;return}
    video.preload='metadata';
    video.addEventListener('loadedmetadata',function(){
      if(video._pccTheme!==version)return;
      video._pccSwap=false;
      if(time){video._pccSeek=true;video.currentTime=Math.min(time,Math.max(0,video.duration-.01))}
      if(wasPlaying){if(wasAuto)update();else{expectedPlays++;var p=video.play();if(p&&p.catch)p.catch(function(){expectedPlays=Math.max(0,expectedPlays-1)})}}
    },{once:true});
    video.load();
  };
  videoTheme(root.getAttribute('data-theme')==='light'?'light':'dark');
  document.addEventListener('visibilitychange',function(){if(document.hidden)pause();else update()});
  function onPreference(){update()}
  if(reduced.addEventListener)reduced.addEventListener('change',onPreference);
  else if(reduced.addListener)reduced.addListener(onPreference);
})();
