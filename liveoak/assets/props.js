/* Property cards and property pages, driven by data/properties.json and data/past.json.
   To add a home, add an object like this to data/properties.json:
   { "slug":"1234-sample-dr", "address":"1234 Sample Dr", "city":"Austin, TX 78746", "status":"Private Exclusive",
     "price":"$4,250,000", "sqft":"6,200", "beds":5, "baths":"5.5", "acres":"1.1", "mls":"",
     "neighborhood":"westlake", "hero":"media/1234-hero.jpg", "images":["..."],
     "residence":["Paragraph one","Paragraph two"], "film":"https://www.youtube.com/embed/...", "walkthrough":"https://my.matterport.com/show/?m=...",
     "spec":{"Year built":"2026","Garage":"3 car"}, "amenities":["Pool","Wine room"],
     "build":[{"title":"Builder","line":"...","img":"..."}], "agent":{"name":"Gabe Jeudy-Lally","phone":"(737) 600-5101","email":"gabe@victoryformationventures.com"} } */
const esc_ = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function propCard(p) {
  const facts = [p.price, p.sqft && p.sqft + ' Sq Ft', p.mls && 'MLS # ' + p.mls].filter(Boolean).map(f => `<span>${esc_(f)}</span>`).join('');
  const inner = `<img src="${esc_(p.hero || 'media/hilllake.jpg')}" alt="" loading="lazy" /><span class="prop__status">${esc_(p.sold ? (p.status || 'Sold') : (p.status || 'Active'))}</span>
    <div class="prop__body"><h3 class="prop__addr">${esc_(p.address)}<br>${esc_(p.city || '')}</h3><div class="prop__facts">${facts}</div></div>`;
  return p.sold ? `<div class="prop reveal">${inner}</div>` : `<a class="prop reveal" href="property.html?p=${encodeURIComponent(p.slug)}">${inner}</a>`;
}
function propPage(p) {
  const sec = (t, body) => body ? `<section class="p-sec"><div class="wrap"><h2 class="display reveal">${t}</h2>${body}</div></section>` : '';
  const spec = Object.assign({}, p.price && { Price: p.price }, p.beds && { Bedrooms: p.beds }, p.baths && { Baths: p.baths }, p.sqft && { 'Square feet': p.sqft }, p.acres && { Acres: p.acres }, p.mls && { 'MLS #': p.mls }, p.spec || {});
  const a = p.agent || { name: 'Gabe Jeudy-Lally', phone: '(737) 600-5101', email: 'gabe@victoryformationventures.com' };
  return `
  <section class="banner" style="min-height:92vh"><div class="bg" style="background-image:url('${esc_(p.hero || 'media/hilllake.jpg')}')"></div>
    <div class="inner reveal"><div class="cap eyebrow">${esc_(p.status || 'Active')}</div><h1 class="display">${esc_(p.address)}<br>${esc_(p.city || '')}</h1><p>${[p.price, p.sqft && p.sqft + ' Sq Ft', p.mls && 'MLS # ' + p.mls].filter(Boolean).map(esc_).join(' &nbsp;·&nbsp; ')}</p></div></section>
  ${sec('The home', (p.residence || []).map(x => `<p class="reveal" style="color:var(--t2);max-width:860px;font-size:16px">${esc_(x)}</p>`).join(''))}
  ${p.film ? sec('The film', `<div class="reveal" style="aspect-ratio:16/9"><iframe src="${esc_(p.film)}" style="width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe></div>`) : ''}
  ${p.images && p.images.length ? sec('Gallery', `<div class="gallery">${p.images.map(i => `<img class="reveal" src="${esc_(i)}" alt="" loading="lazy" />`).join('')}</div>`) : ''}
  ${p.walkthrough ? sec('Tour', `<a class="btn reveal" href="${esc_(p.walkthrough)}" target="_blank" rel="noopener">Take the tour</a>`) : ''}
  ${sec('Details', `<div class="spec">${Object.entries(spec).map(([k, v]) => `<div class="reveal"><div class="cap k">${esc_(k)}</div><div class="v">${esc_(v)}</div></div>`).join('')}</div>`)}
  ${p.amenities && p.amenities.length ? sec('Features', `<div class="qa">${p.amenities.map(x => `<div class="reveal"><p>${esc_(x)}</p></div>`).join('')}</div>`) : ''}
  ${p.build && p.build.length ? sec('The build team', `<div class="points">${p.build.map(b => `<div class="reveal"><h3>${esc_(b.title)}</h3><p>${esc_(b.line)}</p></div>`).join('')}</div>`) : ''}
  ${p.neighborhood ? sec('The neighborhood', `<p class="reveal"><a class="cap linkline" href="neighborhood.html?n=${encodeURIComponent(p.neighborhood)}">Explore the area</a> &nbsp; <a class="cap linkline" href="neighborhoods.html">All neighborhoods</a></p>`) : ''}
  ${sec('Your contact', `<div class="agent reveal"><div class="av"></div><div><div class="display" style="font-size:16px;letter-spacing:.22em">${esc_(a.name)}</div><div class="member__contact" style="margin-top:10px"><a href="tel:${esc_(a.phone)}">${esc_(a.phone)}</a><a href="mailto:${esc_(a.email)}">${esc_(a.email)}</a></div></div></div>`)}
  ${sec('Ask about this home', `<form class="form js-lead reveal" data-source="property" data-ref="${esc_(p.address)}">
      <div><label class="cap">Name</label><input name="name" required /></div><div><label class="cap">Email</label><input name="email" type="email" required /></div>
      <div><label class="cap">Phone</label><input name="phone" type="tel" /></div><div></div>
      <div class="full"><label class="cap">Message</label><textarea name="message">I would like to know more about ${esc_(p.address)}.</textarea></div>
      <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" />
      <div class="full row-end"><button class="btn" type="submit">Send</button><span class="fine js-note" style="margin:0"></span></div></form>`)}`;
}
