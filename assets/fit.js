/* 하단 큰 글씨(DARAE.DAEJEON)를 화면 폭에 딱 맞게 */
(function(){
  function fit(){document.querySelectorAll('.bigmark').forEach(function(el){
    el.style.fontSize='100px';var w=el.scrollWidth,box=el.parentNode.clientWidth;
    if(w)el.style.fontSize=(100*box*0.98/w)+'px';});}
  fit();window.addEventListener('load',fit);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
  var t;window.addEventListener('resize',function(){clearTimeout(t);t=setTimeout(fit,150);});
})();
