const track = document.getElementById('track');
  const cards = track.querySelectorAll('.project-card');
  const dotsEl = document.getElementById('dots');
  const total = cards.length;
  const visible = window.innerWidth <= 480 ? 1 : 2;
  const steps = total - visible;
  let current = 0;

  dotsEl.innerHTML = '';
  for(let i = 0; i <= steps; i++){
    const d = document.createElement('div');
    d.className = 'dot-ind' + (i===0?' active':'');
    dotsEl.appendChild(d);
  }

  function goTo(n){
    current = Math.max(0, Math.min(n, steps));
    const cardW = cards[0].offsetWidth + 10;
    track.style.transform = `translateX(-${current * cardW}px)`;
    dotsEl.querySelectorAll('.dot-ind').forEach((d,i)=>{
      d.classList.toggle('active', i===current);
    });
  }

  document.getElementById('prev').addEventListener('click', ()=> goTo(current-1));
  document.getElementById('next').addEventListener('click', ()=> goTo(current+1));