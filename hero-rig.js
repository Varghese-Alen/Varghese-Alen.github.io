/* =========================================================
   Hero workbench scene: robotic monitor arms
   - On load the arms bring both monitors down and turn the screens to face you.
   - Scrolling down folds them up and back; scrolling up brings them back.
   - Respects prefers-reduced-motion (monitors simply stay facing forward).
   Load at the end of <body> (or with defer), after the scene markup.
   ========================================================= */
(function(){
  var svg=document.querySelector('#top .scene svg');if(!svg)return;
  var hero=document.querySelector('#top .hero');
  // home is showing when the #top section is visible (works for one page and multi page sites)
  function isHome(){var t=document.getElementById('top');return !!t&&t.getClientRects().length>0}
  var L1=84,L2=84,SY=258,MY0=187,MY1=94,W=172,H=126,T=11;
  var glows=[].slice.call(svg.querySelectorAll('.mglow'));
  function q(g,c){return g.querySelector(c)}
  var rigs=[].slice.call(svg.querySelectorAll('.rig')).map(function(g){
    return{g:g,bx:+g.getAttribute('data-bx'),side:+g.getAttribute('data-side'),arm:q(g,'.arm'),mnt:q(g,'.mnt'),
      fr:q(g,'.mfront'),bk:q(g,'.mback'),edge:[].slice.call(g.querySelectorAll('.edge')),
      l1:q(g,'.l1'),l1p:q(g,'.l1p'),l2:q(g,'.l2'),l2p:q(g,'.l2p'),cab:q(g,'.cab'),pb:q(g,'.pb'),pr:q(g,'.pr'),pa:q(g,'.pa'),pc:q(g,'.ppin'),
      bo:[].slice.call(g.querySelectorAll('.bo')),jE:[].slice.call(g.querySelectorAll('.jE')),jW:[].slice.call(g.querySelectorAll('.jW')),
      wb:[].slice.call(g.querySelectorAll('.wb')),armTop:null}});
  function cl(x,a,b){return x<a?a:x>b?b:x}
  function ez(x){x=cl(x,0,1);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2}
  function f(n){return Math.round(n*100)/100}
  function cap(ax,ay,bx,by,w){var dx=bx-ax,dy=by-ay,l=Math.hypot(dx,dy)||1,r=w/2,nx=-dy/l*r,ny=dx/l*r;
    return 'M'+f(ax+nx)+','+f(ay+ny)+' L'+f(bx+nx)+','+f(by+ny)+' A'+r+','+r+' 0 0 0 '+f(bx-nx)+','+f(by-ny)+' L'+f(ax-nx)+','+f(ay-ny)+' A'+r+','+r+' 0 0 0 '+f(ax+nx)+','+f(ay+ny)+'Z'}
  function setC(c,x,y){c.setAttribute('cx',f(x));c.setAttribute('cy',f(y))}
  function draw(p){
    var lift=ez(p/.9),turn=ez((p-.18)/.6),depth=ez((p-.08)/.92);
    var th=Math.PI*turn,c=Math.cos(th),sn=Math.abs(Math.sin(th)),s=1-.38*depth;
    glows.forEach(function(e){e.style.opacity=f(1-.85*lift)});
    rigs.forEach(function(r){
      var my=MY0+(MY1-MY0)*lift,sw=Math.sin(Math.PI*lift)*10*r.side;
      var w=W*s*Math.abs(c),t=T*s*sn,tot=w+t,mx=r.bx+sw,left=mx-tot/2,es=-r.side,fx,ex;
      if(es>0){fx=left+w/2;ex=left+w}else{ex=left;fx=left+t+w/2}
      var hh=H*s/2,ed=t>.2?'M'+f(ex)+','+f(my-hh+2*s)+' H'+f(ex+t)+' V'+f(my+hh-2*s)+' H'+f(ex)+'Z':'';
      r.edge.forEach(function(e){e.setAttribute('d',ed)});
      var front=c>0;
      r.fr.style.display=front?'':'none';r.bk.style.display=front?'none':'';
      var tf='translate('+f(fx)+' '+f(my)+') scale('+f(Math.max(s*Math.abs(c),.001))+' '+f(s)+')';
      r.fr.setAttribute('transform',tf);r.bk.setAttribute('transform',tf);
      // two link arm: shoulder S, elbow E, wrist on the back of the display
      var sx=r.bx,sy=SY,wx=fx,wy=my,dx=wx-sx,dy=wy-sy,d=Math.hypot(dx,dy);
      d=cl(d,Math.abs(L1-L2)+.5,L1+L2-.5);
      var ux=dx/Math.hypot(dx,dy),uy=dy/Math.hypot(dx,dy),aa=(L1*L1-L2*L2+d*d)/(2*d),h=Math.sqrt(Math.max(L1*L1-aa*aa,0));
      var px=sx+ux*aa,py=sy+uy*aa,e1x=px-uy*h,e1y=py+ux*h,e2x=px+uy*h,e2y=py-ux*h;
      var ex2=(e1x-sx)*r.side>(e2x-sx)*r.side?e1x:e2x,ey2=ex2===e1x?e1y:e2y;
      wx=sx+ux*d;wy=sy+uy*d;
      function lp(x0,y0,x1,y1,t){return[x0+(x1-x0)*t,y0+(y1-y0)*t]}
      r.l1.setAttribute('d',cap(sx,sy,ex2,ey2,14));r.l2.setAttribute('d',cap(ex2,ey2,wx,wy,11));
      var a1=lp(sx,sy,ex2,ey2,.24),b1=lp(sx,sy,ex2,ey2,.76),a2=lp(ex2,ey2,wx,wy,.26),b2=lp(ex2,ey2,wx,wy,.72);
      r.l1p.setAttribute('d',cap(a1[0],a1[1],b1[0],b1[1],6));r.l2p.setAttribute('d',cap(a2[0],a2[1],b2[0],b2[1],4.6));
      [lp(sx,sy,ex2,ey2,.15),lp(sx,sy,ex2,ey2,.85),lp(ex2,ey2,wx,wy,.17),lp(ex2,ey2,wx,wy,.82)].forEach(function(pt,i){setC(r.bo[i],pt[0],pt[1])});
      // hydraulic ram from the turret lug to the middle of the lower link
      var ax=r.bx+r.side*15,ay=266,cc=lp(sx,sy,ex2,ey2,.5),cdx=cc[0]-ax,cdy=cc[1]-ay,cd=Math.hypot(cdx,cdy)||1,bl=Math.min(26,cd*.62);
      var bex=ax+cdx/cd*bl,bey=ay+cdy/cd*bl;
      r.pb.setAttribute('d',cap(ax,ay,bex,bey,7));r.pr.setAttribute('d','M'+f(bex)+','+f(bey)+' L'+f(cc[0])+','+f(cc[1]));
      setC(r.pa,ax,ay);setC(r.pc,cc[0],cc[1]);
      // hose runs along the far side of both links
      var n1x=-(ey2-sy)/L1,n1y=(ex2-sx)/L1,n2x=-(wy-ey2)/L2,n2y=(wx-ex2)/L2,o=-r.side*9;
      if(n1x*r.side>0){n1x=-n1x;n1y=-n1y}if(n2x*r.side>0){n2x=-n2x;n2y=-n2y}
      r.cab.setAttribute('d','M'+f(sx+n1x*6)+','+f(sy+n1y*6)+' Q'+f((sx+ex2)/2+n1x*11)+','+f((sy+ey2)/2+n1y*11)+' '+f(ex2+n1x*10)+','+f(ey2+n1y*10)+' Q'+f((ex2+wx)/2+n2x*9)+','+f((ey2+wy)/2+n2y*9)+' '+f(wx+n2x*5)+','+f(wy+n2y*5));
      r.jE.forEach(function(c){setC(c,ex2,ey2)});r.jW.forEach(function(c){setC(c,wx,wy)});
      var ux2=(ex2-wx)/L2,uy2=(ey2-wy)/L2,qx=-uy2*5,qy=ux2*5,tx=wx+ux2*10,ty=wy+uy2*10;
      var wbd='M'+f(wx+qx)+','+f(wy+qy)+' L'+f(tx+qx)+','+f(ty+qy)+' L'+f(tx-qx)+','+f(ty-qy)+' L'+f(wx-qx)+','+f(wy-qy)+'Z';
      r.wb.forEach(function(e){e.setAttribute('d',wbd)});
      // whichever faces the viewer is drawn last
      var top=front?'m':'a';
      if(r.armTop!==top){r.armTop=top;if(front)r.g.appendChild(r.mnt);else r.g.appendChild(r.arm)}
    });
  }
  var rm=window.matchMedia?matchMedia('(prefers-reduced-motion:reduce)'):{matches:false};
  var p=0,v=0,intro=0,raf=0,last=0;
  function scrollP(){var hh=hero?hero.getBoundingClientRect().height:0;if(!hh||!isHome())return 0;return cl((window.scrollY-12)/(hh*.45),0,1)}
  function target(){return Math.max(intro,scrollP())}
  function tick(ts){
    var dt=last?Math.min((ts-last)/1000,.05):.016;last=ts;
    var tg=target(),k=14,cdamp=7.6;
    v+=(k*(tg-p)-cdamp*v)*dt;p+=v*dt;
    if(Math.abs(tg-p)<.0006&&Math.abs(v)<.001){p=tg;v=0;draw(p);raf=0;last=0;return}
    draw(cl(p,0,1));raf=requestAnimationFrame(tick)}
  function kick(){if(rm.matches){draw(0);return}if(!raf){last=0;raf=requestAnimationFrame(tick)}}
  function playIntro(){
    if(rm.matches){p=0;draw(0);return}
    intro=1;p=1;v=0;draw(1);
    setTimeout(function(){intro=0;kick()},450)}
  window.addEventListener('scroll',kick,{passive:true});
  window.addEventListener('resize',kick);
  window.addEventListener('hashchange',function(){if(isHome())playIntro()});
  if(rm.addEventListener)rm.addEventListener('change',function(){p=0;v=0;intro=0;draw(0)});
  if(isHome())playIntro();else draw(0);
})();
