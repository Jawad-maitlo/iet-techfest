/**
 * ============================================================
 * DATA.JS — EDIT THIS FILE TO UPDATE ALL SITE CONTENT
 * ============================================================
 */

const SITE_DATA = {

  /* ── SITE CONFIG ── */
  site: {
    name: "Interconnect University Hackathon",
    tagline: "Think. Build. Connect.",
    organizer: "Batch 24",
    venue: "IBA — Institute of Emerging Technologies, Khairpur",
    venueMapUrl: "https://maps.google.com/?q=IBA+Institute+of+Emerging+Technologies+Khairpur",
    date: "01 October 2026",
    dateShort: "Oct 01, 2026",
    logo: "images/logo.png",       // ← Replace with your real logo path
  },

  /* ── REGISTRATION ── */
  registration: {
    // Live Google Form for hackathon registration
    formUrl: "https://forms.gle/fJYBbCeMTUFbqWQm9",

    // Set to true once registration is open, false to show "Coming Soon"
    isOpen: true,

    // Last date to register
    deadline: "27 September 2026 (Sunday)",

    // QR code: auto-generated from formUrl above (no image needed)
    // If you have a custom QR image, set: qrImage: "images/qr-code.png"
    qrImage: "",
  },

  /* ── CONTACT ── */
  contact: {
    // Event email and WhatsApp number
    email:      "iettechfest.hackathon@gmail.com",
    whatsapp:   "923063394955",   // international format, no + or spaces
    whatsappLabel: "WhatsApp",
  },

  /* ── PRICING ── */
  pricing: [
    { icon: "🏆", type: "Trio Team",  members: "3 members", price: "1,200", popular: true  },
    { icon: "⚡", type: "Duo Team",   members: "2 members", price: "1,000", popular: false },
    { icon: "🎯", type: "Solo",       members: "1 member",  price: "600",   popular: false },
  ],

  /* ── STATS ── */
  stats: [
    { num: "4+",  label: "Universities" },
    { num: "XX+", label: "Participants" },
    { num: "XX+", label: "Teams"        },
    { num: "XX+", label: "Projects"     },
  ],

  /* ── FEATURES ── */
  features: [
    {
      icon: "💡", num: "01", title: "Learn & Practice",
      desc: "Work on real-world problems and sharpen your technical and creative skills in ways no classroom can replicate.",
      accentColor: "linear-gradient(90deg,#38bdf8,#7c3aed)",
      iconBg: "rgba(37,99,235,0.15)", iconBorder: "rgba(56,189,248,0.25)",
    },
    {
      icon: "🤝", num: "02", title: "Meet Amazing People",
      desc: "Collaborate with talented students from different universities and forge connections that last a lifetime.",
      accentColor: "linear-gradient(90deg,#a855f7,#38bdf8)",
      iconBg: "rgba(124,58,237,0.15)", iconBorder: "rgba(168,85,247,0.25)",
    },
    {
      icon: "🧠", num: "03", title: "Get Mentored",
      desc: "Learn directly from industry experts, faculty, and experienced mentors who guide you through the challenge.",
      accentColor: "linear-gradient(90deg,#ec4899,#7c3aed)",
      iconBg: "rgba(236,72,153,0.15)", iconBorder: "rgba(236,72,153,0.25)",
    },
    {
      icon: "🚀", num: "04", title: "Showcase Your Talent",
      desc: "Turn your ideas into impactful solutions and gain recognition from universities, industry leaders, and beyond.",
      accentColor: "linear-gradient(90deg,#fbbf24,#ec4899)",
      iconBg: "rgba(251,191,36,0.12)", iconBorder: "rgba(251,191,36,0.2)",
    },
    {
      icon: "🌐", num: "05", title: "Expand Your Network",
      desc: "Connect with peers, professionals, and potential employers who share your drive to build and innovate.",
      accentColor: "linear-gradient(90deg,#38bdf8,#ec4899)",
      iconBg: "rgba(37,99,235,0.15)", iconBorder: "rgba(56,189,248,0.25)",
    },
    {
      icon: "🏆", num: "06", title: "Win Exciting Prizes",
      desc: "Stand a chance to win amazing rewards, recognition, and opportunities that can change the trajectory of your career.",
      accentColor: "linear-gradient(90deg,#a855f7,#38bdf8)",
      iconBg: "rgba(124,58,237,0.15)", iconBorder: "rgba(168,85,247,0.25)",
    },
  ],

  /* ── TIMELINE ── */
  timeline: [
    {
      num: "01", label: "STAGE ONE", title: "Discover",
      desc: "Explore problem statements, understand challenge domains, and identify where your skills fit best.",
      bg: "linear-gradient(135deg,#7c3aed,#2563eb,#ec4899)",
    },
    {
      num: "02", label: "STAGE TWO", title: "Connect",
      desc: "Form cross-university teams, meet mentors, and build the collaborative foundation your project needs.",
      bg: "linear-gradient(135deg,#2563eb,#38bdf8)",
    },
    {
      num: "03", label: "STAGE THREE", title: "Collaborate",
      desc: "Designers, developers, strategists — each bringing unique skills to create something extraordinary.",
      bg: "linear-gradient(135deg,#ec4899,#7c3aed)",
    },
    {
      num: "04", label: "STAGE FOUR", title: "Build",
      desc: "Execute with intensity. Code, design, test, and iterate under real-world hackathon conditions.",
      bg: "linear-gradient(135deg,#fbbf24,#ec4899)",
    },
    {
      num: "05", label: "STAGE FIVE", title: "Innovate",
      desc: "Present your solution to judges, collect prizes, and launch your journey as a real-world innovator.",
      bg: "linear-gradient(135deg,#38bdf8,#7c3aed,#ec4899)",
    },
  ],

  /* ── HACKATHON CARDS ── */
  hackathonCards: [
    { icon: "💡", title: "Innovation",    desc: "Push boundaries and create solutions that challenge the status quo." },
    { icon: "🤝", title: "Collaboration", desc: "Different skills, same goal. Build alongside the best from across universities." },
    { icon: "⚡", title: "Technology",    desc: "Leverage AI, web, app, and emerging tech to build something extraordinary." },
    { icon: "🌍", title: "Impact",        desc: "Create real-world solutions that matter — your skills + our platform = bigger impact." },
  ],

  /* ── SKILL TRACKS ── */
  tracks: [
    { icon: "💻", title: "Coding",              desc: "Frontend, backend, full-stack — build the engine that powers your team's vision.",                  bg: "rgba(56,189,248,0.12)",  border: "rgba(56,189,248,0.25)"  },
    { icon: "🎨", title: "Design",              desc: "UI/UX, graphics, and branding — make it beautiful and make it work.",                               bg: "rgba(236,72,153,0.12)",  border: "rgba(236,72,153,0.25)"  },
    { icon: "🧠", title: "AI & ML",             desc: "Bring intelligence to your project with machine learning and AI-powered features.",                  bg: "rgba(124,58,237,0.12)",  border: "rgba(124,58,237,0.25)"  },
    { icon: "🌐", title: "Web & App",           desc: "Web apps, mobile apps, cross-platform — build solutions that people actually use.",                  bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.2)"   },
    { icon: "🗄️", title: "Database & Systems",  desc: "Architecture, databases, and systems thinking — build the solid foundation everything runs on.",    bg: "rgba(37,99,235,0.12)",   border: "rgba(37,99,235,0.25)"   },
    { icon: "📈", title: "Strategy & Impact",   desc: "Problem framing, pitching, and business thinking — every great product needs a great story.",       bg: "rgba(168,85,247,0.12)",  border: "rgba(168,85,247,0.25)"  },
  ],

  /* ── TECHNOLOGIES ── */
  technologies: [
    { name: "React",          color: "#61DAFB" },
    { name: "Node.js",        color: "#68A063" },
    { name: "Python",         color: "#3776AB" },
    { name: "MongoDB",        color: "#47A248" },
    { name: "AI / ML",        color: "#a855f7" },
    { name: "REST APIs",      color: "#38bdf8" },
    { name: "Git",            color: "#F05032" },
    { name: "Docker",         color: "#2496ED" },
    { name: "Cloud Services", color: "#FF9900" },
    { name: "Figma / Design", color: "#ec4899" },
    { name: "Firebase",       color: "#fbbf24" },
    { name: "Next.js / Vue",  color: "#764ABC" },
  ],

  /* ── TEAM ── */
  /* 
   * photo: path to image in images/people/.
   * If no photo, leave as "" and initials will show instead.
   * linkedin: full LinkedIn profile URL; leave empty until supplied.
   * showLinkedIn: false hides both the link and placeholder.
   */
  team: [
    {
      initials: "MA", photo: "images/people/mureed.jpeg", linkedin: "https://www.linkedin.com/in/mureed-abbas-qazi-963a432a2/",
      name: "Mureed Abbas", role: "President",
      desc: "Visionary behind Interconnect, driving the event's strategy and execution from day one.",
    },
    {
      initials: "MZ", photo: "images/people/zaid.png", linkedin: "https://www.linkedin.com/in/muhammad-zaid-memon-437a7635b/",
      name: "Muhammad Zaid", role: "Lead Organizer",
      desc: "Coordinating the organizing team and event activities to bring Interconnect together.",
    },
    {
      initials: "JA", photo: "images/people/jawad.png", linkedin: "https://www.linkedin.com/in/jawad-ali-b50525325/",
      name: "Jawad Ali", role: "Technical Head",
      desc: "Overseeing all technical challenges, platform setup, and hackathon problem statements.",
    },
    {
      initials: "MF", photo: "images/people/farhan.jpeg", linkedin: "https://www.linkedin.com/in/muhammad-farhan-ali-b76809387/",
      name: "Muhammad Farhan Ali", role: "Co-Technical Head",
      desc: "Supporting the technical team with platform development and event technical coordination.",
    },
    {
      initials: "MS", photo: "images/people/marzia.jpeg", linkedin: "https://www.linkedin.com/in/marzia-syeda-2b450b38b/",
      name: "Marzia Syeda", role: "Design Lead",
      desc: "Crafting the visual identity, branding, and creative direction of the entire event.",
    },
    {
      initials: "SH", photo: "images/people/shahzad.jpeg", linkedin: "https://www.linkedin.com/in/shahzad-hussain-bhatti/",
      name: "Shahzad Hussain", role: "Outreach & Partnerships",
      desc: "Building bridges between universities, sponsors, and the broader innovation community.",
    },
    {
      initials: "BG", photo: "images/people/bilawal.png", linkedin: "", showLinkedIn: false,
      name: "Bilawal Gul", role: "Finance Head",
      desc: "Managing the event budget and coordinating finances for Interconnect.",
    },
  ],
};
