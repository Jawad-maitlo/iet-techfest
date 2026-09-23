/* ============================================================
   HERO NETWORK SVG — generated dynamically
============================================================ */
(function () {
  const ns = "http://www.w3.org/2000/svg";

  const nodes = [
    { cx: 260, cy: 220, r: 40, innerR: 26, label: "IBA", sub: "INTERCONNECT",  stroke: "rgba(124,58,237,0.6)",  fill: "rgba(124,58,237,0.15)",  dur: 4,   center: true },
    { cx: 120, cy: 100, r: 28, innerR: 0,  icon: "👥", label: "STUDENTS",     stroke: "rgba(56,189,248,0.7)",   fill: "rgba(37,99,235,0.15)",   dur: 5   },
    { cx: 400, cy: 100, r: 28, innerR: 0,  icon: "🧠", label: "AI & TECH",    stroke: "rgba(236,72,153,0.7)",   fill: "rgba(236,72,153,0.15)",  dur: 4.5 },
    { cx:  80, cy: 280, r: 26, innerR: 0,  icon: "💡", label: "IDEAS",        stroke: "rgba(251,191,36,0.6)",   fill: "rgba(251,191,36,0.12)",  dur: 6   },
    { cx: 440, cy: 280, r: 26, innerR: 0,  icon: "🚀", label: "TEAMS",        stroke: "rgba(124,58,237,0.7)",   fill: "rgba(124,58,237,0.15)",  dur: 5.5 },
    { cx: 200, cy: 370, r: 26, innerR: 0,  icon: "🏛️", label: "UNIVS",        stroke: "rgba(56,189,248,0.5)",   fill: "rgba(56,189,248,0.12)",  dur: 4.8 },
    { cx: 340, cy: 370, r: 26, innerR: 0,  icon: "⚡", label: "INNOVATE",     stroke: "rgba(236,72,153,0.5)",   fill: "rgba(236,72,153,0.12)",  dur: 5.2 },
  ];

  const lines = [
    { x1:260,y1:220,x2:120,y2:100, grad:"url(#lg1)", dotColor:"#a855f7", dur:3   },
    { x1:260,y1:220,x2:400,y2:100, grad:"url(#lg2)", dotColor:"#38bdf8", dur:3.5 },
    { x1:260,y1:220,x2: 80,y2:280, grad:"url(#lg3)", dotColor:"#ec4899", dur:2.8 },
    { x1:260,y1:220,x2:440,y2:280, grad:"url(#lg1)", dotColor:"#fbbf24", dur:4   },
    { x1:260,y1:220,x2:200,y2:370, grad:"url(#lg2)", dotColor:"#a855f7", dur:3.2 },
    { x1:260,y1:220,x2:340,y2:370, grad:"url(#lg3)", dotColor:"#38bdf8", dur:2.6 },
  ];

  function el(tag, attrs = {}) {
    const e = document.createElementNS(ns, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    return e;
  }
  function animate(e, attr, values, dur, begin = "0s") {
    const a = el("animate", { attributeName: attr, values, dur: dur + "s", repeatCount: "indefinite", begin });
    e.appendChild(a);
    return e;
  }

  const svg = el("svg", { viewBox: "0 0 520 440", xmlns: ns });

  /* Defs */
  const defs = el("defs");
  const gradDefs = [
    ["lg1","#7c3aed","0.8","#38bdf8","0.4"],
    ["lg2","#ec4899","0.7","#7c3aed","0.4"],
    ["lg3","#38bdf8","0.7","#ec4899","0.4"],
  ];
  gradDefs.forEach(([id, c1, o1, c2, o2]) => {
    const g = el("linearGradient", { id, x1:"0%", y1:"0%", x2:"100%", y2:"100%" });
    const s1 = el("stop", { offset:"0%",   "stop-color":c1, "stop-opacity":o1 });
    const s2 = el("stop", { offset:"100%", "stop-color":c2, "stop-opacity":o2 });
    g.appendChild(s1); g.appendChild(s2); defs.appendChild(g);
  });

  // glow filters
  ["node-glow","line-glow"].forEach((id, i) => {
    const f = el("filter", { id });
    const gb = el("feGaussianBlur", { stdDeviation: i === 0 ? "4" : "2", result:"coloredBlur" });
    const m  = el("feMerge");
    const m1 = el("feMergeNode", { in:"coloredBlur" });
    const m2 = el("feMergeNode", { in:"SourceGraphic" });
    m.appendChild(m1); m.appendChild(m2);
    f.appendChild(gb); f.appendChild(m); defs.appendChild(f);
  });

  // bg radial
  const rg = el("radialGradient", { id:"rg-center", cx:"50%", cy:"50%", r:"50%" });
  const rs1 = el("stop", { offset:"0%",   "stop-color":"#7c3aed","stop-opacity":"0.3" });
  const rs2 = el("stop", { offset:"100%", "stop-color":"#7c3aed","stop-opacity":"0" });
  rg.appendChild(rs1); rg.appendChild(rs2); defs.appendChild(rg);
  svg.appendChild(defs);

  // bg ellipse
  svg.appendChild(el("ellipse", { cx:"260",cy:"220",rx:"200",ry:"160",fill:"url(#rg-center)" }));

  /* Lines */
  const lineGroup = el("g", { filter:"url(#line-glow)", opacity:"0.7" });
  lines.forEach(({ x1,y1,x2,y2,grad,dotColor,dur }) => {
    const ln = el("line", { x1,y1,x2,y2, stroke:grad, "stroke-width":"1.5" });
    animate(ln, "opacity", "0.4;1;0.4", dur);
    lineGroup.appendChild(ln);

    // traveling dot
    const dot = el("circle", { r:"3", fill:dotColor, opacity:"0.9" });
    const am = document.createElementNS(ns, "animateMotion");
    am.setAttribute("dur", dur + "s");
    am.setAttribute("repeatCount", "indefinite");
    am.setAttribute("path", `M${x1},${y1} L${x2},${y2}`);
    dot.appendChild(am);
    svg.appendChild(dot);
  });
  svg.appendChild(lineGroup);

  /* Nodes */
  nodes.forEach(n => {
    const g = el("g", { filter:"url(#node-glow)" });
    const outer = el("circle", { cx:n.cx, cy:n.cy, r:n.r, fill:n.fill, stroke:n.stroke, "stroke-width":"1.5" });
    animate(outer, "r", `${n.r - 2};${n.r + 2};${n.r - 2}`, n.dur);
    g.appendChild(outer);

    if (n.center) {
      const inner = el("circle", { cx:n.cx, cy:n.cy, r:n.innerR, fill:"rgba(124,58,237,0.25)", stroke:"rgba(168,85,247,0.8)", "stroke-width":"1.5" });
      g.appendChild(inner);
      const t1 = el("text", { x:n.cx, y:n.cy - 4, "text-anchor":"middle", fill:"white", "font-size":"16", "font-family":"Outfit,sans-serif", "font-weight":"800" });
      t1.textContent = n.label;
      const t2 = el("text", { x:n.cx, y:n.cy + 12, "text-anchor":"middle", fill:"rgba(168,85,247,0.9)", "font-size":"8", "font-family":"Outfit,sans-serif", "font-weight":"600" });
      t2.textContent = n.sub;
      g.appendChild(t1); g.appendChild(t2);
    } else {
      const icon = el("text", { x:n.cx, y:n.cy - 4, "text-anchor":"middle", fill:n.stroke, "font-size":"13" });
      icon.textContent = n.icon;
      const lbl  = el("text", { x:n.cx, y:n.cy + 14, "text-anchor":"middle", fill:"white", "font-size":"8", "font-family":"Outfit,sans-serif", "font-weight":"600" });
      lbl.textContent = n.label;
      g.appendChild(icon); g.appendChild(lbl);
    }
    svg.appendChild(g);
  });

  document.getElementById("network-container").appendChild(svg);
})();
