/* Project videos: keep the player controls out of the way until they are wanted.
   Mouse: shown while the pointer is over the video. Touch: a tap shows them for a few seconds.
   Keyboard: shown while the video has keyboard focus. Fullscreen: always shown.
   Without JavaScript the native controls stay visible, as before. */
(function(){
  'use strict';
  function hoverControls(v){
    var timer=0,over=false;
    function show(){clearTimeout(timer);if(!v.controls)v.controls=true}
    function hide(){
      clearTimeout(timer);
      if(over||document.fullscreenElement===v||v.matches(':focus-visible'))return;
      v.controls=false;
    }
    function later(ms){clearTimeout(timer);timer=setTimeout(hide,ms)}
    v.controls=false;
    if(!v.hasAttribute('tabindex'))v.tabIndex=0;
    v.addEventListener('pointerenter',function(e){if(e.pointerType!=='touch'){over=true;show()}});
    v.addEventListener('pointermove',function(e){if(e.pointerType!=='touch'&&!over){over=true;show()}});
    v.addEventListener('pointerleave',function(e){if(e.pointerType!=='touch'){over=false;later(500)}});
    v.addEventListener('pointerdown',function(e){if(e.pointerType==='touch'){show();later(4000)}});
    v.addEventListener('focus',function(){if(v.matches(':focus-visible'))show()});
    v.addEventListener('blur',function(){later(500)});
    document.addEventListener('fullscreenchange',function(){if(document.fullscreenElement===v)show();else later(500)});
  }
  document.querySelectorAll('article.art video[controls]').forEach(hoverControls);
})();
