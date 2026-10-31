'use strict';
// The hero and geometry controls are schematics; videos show actual model outputs.
const svgNS = 'http://www.w3.org/2000/svg';
const planes = document.querySelector('#world-planes');
function svgElement(tag, attributes) {
  const element = document.createElementNS(svgNS, tag);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}
[{x:190,y:300,opacity:.4},{x:285,y:267,opacity:1},{x:387,y:222,opacity:.5}].forEach(({x,y,opacity}, index) => {
  const group = svgElement('g', {transform:`translate(${x} ${y}) matrix(1 -.22 .65 .65 0 0)`, opacity, filter:'url(#plane-shadow)'});
  group.append(svgElement('rect', {x:-90,y:-90,width:180,height:180,fill:'url(#plane-fill)',stroke:index === 1 ? '#3a939b' : '#9ab9cc','stroke-width':1.5}));
  for (let i=-70;i<90;i+=20) {
    group.append(svgElement('path', {d:`M${i} -90V90M-90 ${i}H90`,fill:'none',stroke:'#a9cbd5','stroke-width':.65}));
  }
  group.append(svgElement('path', {d:'M0 0L-46 -72Q0 -98 46 -72Z',fill:'#28999c','fill-opacity':.2}));
  group.append(svgElement('path', {d:'M0 -13L8 11L0 6L-8 11Z',fill:'#1e526e'}));
  planes.append(group);
});
const angle = document.querySelector('#camera-angle');
angle.addEventListener('input', () => {
  document.querySelector('#angle-output').value = `${angle.value}°`;
  document.querySelector('#camera-fov').setAttribute('transform',`translate(190 126) rotate(${angle.value})`);
});
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
function activateTab(tab, focus = false) {
  tabs.forEach(button => {
    const selected = button === tab;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    panel.hidden = !selected;
    const video = panel.querySelector('video');
    if (!selected) video.pause();
    else if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) video.play().catch(() => {});
  });
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', event => {
    const keys = {ArrowRight:(index + 1) % tabs.length,ArrowLeft:(index - 1 + tabs.length) % tabs.length,Home:0,End:tabs.length - 1};
    if (Object.hasOwn(keys,event.key)) {event.preventDefault();activateTab(tabs[keys[event.key]],true);}
  });
});
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const videos = Array.from(document.querySelectorAll('video'));
const visibility = new IntersectionObserver(entries => {
  entries.forEach(({target,isIntersecting}) => {
    if (!isIntersecting) target.pause();
    else if (!reduceMotion.matches && !target.closest('[hidden]')) target.play().catch(() => {});
  });
}, {threshold:.25});
videos.forEach(video => {if (reduceMotion.matches) {video.autoplay=false;video.pause();}visibility.observe(video);});
const sections = new IntersectionObserver(entries => {
  entries.forEach(entry => {if (entry.isIntersecting) document.querySelectorAll('nav a').forEach(link => link.classList.toggle('active',link.hash === `#${entry.target.id}`));});
}, {rootMargin:'-20% 0px -60% 0px'});
document.querySelectorAll('main section[id]').forEach(section => sections.observe(section));
