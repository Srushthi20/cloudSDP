(function(){
  var root=document.documentElement;
  function safe(fn){try{return fn()}catch(e){return null}}
  var saved=safe(function(){return localStorage.getItem('theme')});
  if(saved==='dark'||saved==='light'){root.setAttribute('data-theme',saved)}
  document.getElementById('themeBtn').addEventListener('click',function(){
    var cur=root.getAttribute('data-theme');
    if(!cur){cur=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}
    var next=cur==='dark'?'light':'dark';
    root.setAttribute('data-theme',next);
    safe(function(){localStorage.setItem('theme',next)});
  });
  var copyBtn=document.getElementById('copyBtn'), mail=document.getElementById('mailText');
  copyBtn.addEventListener('click',function(){
    var reset=function(t){setTimeout(function(){copyBtn.textContent='Copy email'},t)};
    var fallback=function(){
      var r=document.createRange();r.selectNodeContents(mail);
      var s=window.getSelection();s.removeAllRanges();s.addRange(r);
      copyBtn.textContent='Press Ctrl+C';reset(2500);
    };
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(mail.textContent).then(function(){copyBtn.textContent='Copied';reset(1800)},fallback);
    }else{fallback()}
  });

  /* Query Lab: four illustrative queries with sample rows */
  var K=function(s){return '<span class="k">'+s+'</span>'}, F=function(s){return '<span class="f">'+s+'</span>'}, C=function(s){return '<span class="c">'+s+'</span>'};
  var queries=[
    {sql:C('-- window function: rank within each genre')+'\n'+K('SELECT')+' title, genre, rating,\n  '+F('RANK')+'() '+K('OVER')+' (\n    '+K('PARTITION BY')+' genre\n    '+K('ORDER BY')+' rating '+K('DESC')+'\n  ) '+K('AS')+' genre_rank\n'+K('FROM')+' movies;',
     cols:['title','genre','rating','genre_rank'],
     rows:[['Sample Title A','Drama','9.1','1'],['Sample Title B','Drama','8.4','2'],['Sample Title C','Comedy','8.8','1'],['Sample Title D','Comedy','7.9','2'],['Sample Title E','Thriller','8.2','1']]},
    {sql:C('-- complex join: movie to lead artist')+'\n'+K('SELECT')+' m.title, a.name '+K('AS')+' lead_artist\n'+K('FROM')+' movies m\n'+K('JOIN')+' movie_cast c '+K('ON')+' c.movie_id = m.id\n'+K('JOIN')+' artists a '+K('ON')+' a.id = c.artist_id\n'+K('WHERE')+' c.billing = 1;',
     cols:['title','lead_artist'],
     rows:[['Sample Title A','Artist One'],['Sample Title B','Artist Two'],['Sample Title C','Artist Three'],['Sample Title D','Artist One']]},
    {sql:C('-- CTE: average rating per genre')+'\n'+K('WITH')+' genre_avg '+K('AS')+' (\n  '+K('SELECT')+' genre, '+F('AVG')+'(rating) '+K('AS')+' avg_rating\n  '+K('FROM')+' movies '+K('GROUP BY')+' genre\n)\n'+K('SELECT')+' * '+K('FROM')+' genre_avg\n'+K('ORDER BY')+' avg_rating '+K('DESC')+';',
     cols:['genre','avg_rating'],
     rows:[['Drama','8.75'],['Comedy','8.35'],['Thriller','8.20']]},
    {sql:C('-- aggregate: titles per streaming platform')+'\n'+K('SELECT')+' platform, '+F('COUNT')+'(*) '+K('AS')+' titles\n'+K('FROM')+' streaming_catalog\n'+K('GROUP BY')+' platform\n'+K('ORDER BY')+' titles '+K('DESC')+';',
     cols:['platform','titles'],
     rows:[['Platform X','42'],['Platform Y','31'],['Platform Z','18']]}
  ];
  var cur=0, timer=null;
  var sqlEl=document.getElementById('labSql'), headEl=document.getElementById('labHead'), bodyEl=document.getElementById('labBody'), noteEl=document.getElementById('runNote');
  function cell(tag,text,last){var e=document.createElement(tag);e.textContent=text;return e}
  function showHead(q){
    headEl.innerHTML=''; var tr=document.createElement('tr');
    q.cols.forEach(function(c){tr.appendChild(cell('th',c))}); headEl.appendChild(tr);
  }
  function showRows(q,animate){
    bodyEl.innerHTML=''; clearTimeout(timer);
    var i=0;
    function add(){
      var tr=document.createElement('tr'); if(animate) tr.className='in';
      q.rows[i].forEach(function(v){tr.appendChild(cell('td',v))}); bodyEl.appendChild(tr);
      i++; if(i<q.rows.length){ if(animate){timer=setTimeout(add,140)} else {add()} }
      else { noteEl.textContent=q.rows.length+' rows returned'; }
    }
    add();
  }
  function select(n){
    cur=n; var q=queries[n];
    document.querySelectorAll('.chip').forEach(function(c){c.setAttribute('aria-selected',String(+c.getAttribute('data-q')===n))});
    sqlEl.innerHTML=q.sql; showHead(q); showRows(q,false);
  }
  document.querySelectorAll('.chip').forEach(function(c){
    c.addEventListener('click',function(){select(+c.getAttribute('data-q'))});
  });
  document.getElementById('runBtn').addEventListener('click',function(){
    var q=queries[cur]; noteEl.textContent='Running…'; bodyEl.innerHTML=''; clearTimeout(timer);
    timer=setTimeout(function(){showRows(q,true)},350);
  });
  select(0);

  /* Background effects and scroll reveal */
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var cv=document.getElementById('fxTokens'), cctx=cv&&cv.getContext?cv.getContext('2d'):null;
  if(cctx){
    var words=['SELECT','JOIN','WHERE','GROUP BY','3NF','CTE','RANK()','INDEX','PRIMARY KEY','COUNT(*)','0','1','{ }','=>','O(n)','HAVING','UNION','FOREIGN KEY'];
    var parts=[], W=0, H=0, col='#000', frame=0;
    var readCol=function(){col=getComputedStyle(root).getPropertyValue('--fg').trim()||'#000'};
    var resize=function(){
      var dpr=Math.min(window.devicePixelRatio||1,2); W=window.innerWidth; H=window.innerHeight;
      cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr); cctx.setTransform(dpr,0,0,dpr,0,0);
      var n=Math.round(Math.min(34,Math.max(14,W*H/40000))); parts=[];
      for(var i=0;i<n;i++){parts.push({t:words[Math.floor(Math.random()*words.length)],x:Math.random()*W,y:Math.random()*H,v:.15+Math.random()*.3,s:11+Math.random()*7,a:.35+Math.random()*.65,ph:Math.random()*6.28})}
    };
    var draw=function(move){
      cctx.clearRect(0,0,W,H); cctx.fillStyle=col;
      for(var i=0;i<parts.length;i++){
        var p=parts[i];
        if(move){p.y-=p.v; if(p.y<-24){p.y=H+24; p.x=Math.random()*W}}
        cctx.globalAlpha=p.a*.2; cctx.font='500 '+p.s+'px "DM Mono", monospace';
        cctx.fillText(p.t,p.x+Math.sin(frame/90+p.ph)*8,p.y);
      }
    };
    var tick=function(){frame++; if(frame%90===0) readCol(); draw(true); requestAnimationFrame(tick)};
    resize(); readCol();
    if(reduce){draw(false)}else{requestAnimationFrame(tick)}
    var rt; window.addEventListener('resize',function(){clearTimeout(rt); rt=setTimeout(function(){resize(); if(reduce) draw(false)},150)});
    new MutationObserver(function(){readCol(); if(reduce) draw(false)}).observe(root,{attributes:true,attributeFilter:['data-theme']});
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(){setTimeout(function(){readCol(); if(reduce) draw(false)},50)});
  }

  var glow=document.getElementById('fxGlow');
  if(glow && !reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches){
    var tx=0, ty=0, px=0, py=0, running=false;
    var follow=function(){
      px+=(tx-px)*.12; py+=(ty-py)*.12;
      glow.style.setProperty('--gx',px+'px'); glow.style.setProperty('--gy',py+'px');
      if(Math.abs(tx-px)+Math.abs(ty-py)>.5){requestAnimationFrame(follow)}else{running=false}
    };
    window.addEventListener('pointermove',function(e){
      tx=e.clientX; ty=e.clientY; glow.classList.add('on');
      if(!running){running=true; requestAnimationFrame(follow)}
    },{passive:true});
    document.documentElement.addEventListener('pointerleave',function(){glow.classList.remove('on')});
  }

  if(!reduce && 'IntersectionObserver' in window){
    var groups=['.sec-head','.proj > div','.stats .stat','.arch .tier','.skills > div','.two > div','.tl li','.contact > *'];
    var els=[];
    var settle=function(el){setTimeout(function(){el.classList.remove('rv','in'); el.style.transitionDelay=''},1200)};
    var show=function(el){if(!el.classList.contains('in')){el.classList.add('in'); settle(el)}};
    groups.forEach(function(g){
      document.querySelectorAll(g).forEach(function(el,i){el.classList.add('rv'); el.style.transitionDelay=(i%4*70)+'ms'; els.push(el)});
    });
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){if(e.isIntersecting){show(e.target); io.unobserve(e.target)}});
    },{threshold:0.12,rootMargin:'0px 0px -6% 0px'});
    els.forEach(function(el){
      if(el.getBoundingClientRect().top<window.innerHeight){show(el)}else{io.observe(el)}
    });
    root.classList.add('rv-ready');
    setTimeout(function(){els.forEach(show)},3000);
  }
})();
