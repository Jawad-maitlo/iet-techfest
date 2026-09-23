/* ============================================================
   TEAM — renders from SITE_DATA.team
============================================================ */
(function () {
  const grid = document.getElementById("team-grid");
  if (!grid) return;

  SITE_DATA.team.forEach((member, i) => {
    const card = document.createElement("article");
    card.className = `team-card reveal reveal-delay-${(i % 3) + 1}`;
    const avatar = document.createElement("div");
    avatar.className = "team-avatar";
    avatar.textContent = member.initials;
    if (member.photo) {
      const photo = document.createElement("img");
      photo.src = member.photo;
      photo.alt = member.name;
      photo.loading = "lazy";
      photo.width = 112;
      photo.height = 112;
      photo.addEventListener("error", () => avatar.replaceChildren(document.createTextNode(member.initials)), { once: true });
      avatar.replaceChildren(photo);
    }
    card.append(avatar);
    for (const [tag, className, text] of [["h3", "team-name", member.name], ["div", "team-role", member.role], ["p", "team-desc", member.desc]]) {
      const element = document.createElement(tag);
      element.className = className;
      element.textContent = text;
      card.append(element);
    }
    let hasLinkedIn = false;
    if (member.showLinkedIn !== false && member.linkedin) {
      try {
        const url = new URL(member.linkedin);
        if (url.protocol === "https:" && ["linkedin.com", "www.linkedin.com"].includes(url.hostname) && url.pathname.startsWith("/in/")) {
          const link = document.createElement("a");
          link.className = "team-linkedin";
          link.href = url.href;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.setAttribute("aria-label", `${member.name} on LinkedIn (opens in a new tab)`);
          const icon = document.createElement("img");
          icon.src = "images/linkedinLogo.png";
          icon.alt = "";
          icon.width = 20;
          icon.height = 20;
          icon.className = "team-linkedin-icon";
          link.append(icon, document.createTextNode("LinkedIn ↗"));
          card.append(link);
          hasLinkedIn = true;
        }
      } catch { /* Keep the card usable when a profile URL is incomplete. */ }
    }
    if (!hasLinkedIn && member.showLinkedIn !== false) {
      const placeholder = document.createElement("span");
      placeholder.className = "team-linkedin team-linkedin-placeholder";
      placeholder.textContent = "LinkedIn · Coming soon";
      card.append(placeholder);
    }
    grid.append(card);
  });
})();
