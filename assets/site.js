(function(){
  var imgs=document.querySelectorAll('img[data-zoom]');
  if(!imgs.length||!window.HTMLDialogElement)return;
  var d=document.createElement('dialog'),i=document.createElement('img'),b=document.createElement('button');
  b.textContent='×';b.setAttribute('aria-label','Close');
  d.append(b,i);document.body.append(d);
  imgs.forEach(function(m){m.addEventListener('click',function(){i.src=m.src;i.alt=m.alt;d.showModal();});});
  d.addEventListener('click',function(){d.close();});
})();
