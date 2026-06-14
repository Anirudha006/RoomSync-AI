const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

let pptx = new pptxgen();

// Set widescreen layout (13.3 x 7.5 inches)
pptx.layout = 'LAYOUT_WIDE';

// Set presentation metadata
pptx.title = 'RoomSync AI – Smart Hostel Roommate Matcher';
pptx.subject = 'AI-Based Roommate Matching System';
pptx.author = 'Anirudh';

// Design Tokens (Colors in Hex format without # for pptxgenjs)
const COLOR_BG = '0B1020';      // Midnight Blue
const COLOR_CARD = '12182F';    // Glassmorphism Card base
const COLOR_CYAN = '00E5FF';    // Neon Cyan
const COLOR_PURPLE = '6D5DFC';  // Royal Purple
const COLOR_WHITE = 'F3F4F6';   // Off-white text
const COLOR_MUTED = '9CA3AF';   // Muted gray text
const COLOR_EMERALD = '22C55E'; // Success green

// Paths to Desktop screenshots
const DESKTOP_PATH = 'C:/Users/srini/OneDrive/Desktop';
const IMG_LANDING_DESKTOP = path.join(DESKTOP_PATH, 'roomsync_landing_desktop.png');
const IMG_LANDING_MOBILE = path.join(DESKTOP_PATH, 'roomsync_landing_mobile.png');
const IMG_REGISTER = path.join(DESKTOP_PATH, 'roomsync_register_desktop.png');
const IMG_ADMIN = path.join(DESKTOP_PATH, 'roomsync_admin_desktop.png');
const IMG_DATABASE = path.join(DESKTOP_PATH, 'roomsync_database_desktop.png');

// Helper to create a standard styled slide with title and top banner
function createStandardSlide(title, subtitle) {
  let slide = pptx.addSlide();
  slide.background = { color: COLOR_BG };

  // Top header text
  slide.addText(title, {
    x: 0.8,
    y: 0.4,
    w: 11.7,
    h: 0.5,
    fontSize: 26,
    bold: true,
    color: COLOR_CYAN,
    fontFace: 'Segoe UI'
  });

  // Subtitle
  slide.addText(subtitle, {
    x: 0.8,
    y: 0.9,
    w: 11.7,
    h: 0.4,
    fontSize: 15,
    color: COLOR_MUTED,
    fontFace: 'Segoe UI',
    italic: true
  });

  // Glowing divider line
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8,
    y: 1.4,
    w: 11.7,
    h: 0.03,
    fill: { color: COLOR_PURPLE }
  });

  // Footer text
  slide.addText('RoomSync AI — Intelligent Matching', {
    x: 0.8,
    y: 7.1,
    w: 5.0,
    h: 0.3,
    fontSize: 10,
    color: COLOR_MUTED,
    fontFace: 'Segoe UI'
  });

  return slide;
}

// ----------------------------------------------------
// SLIDE 1: Title Slide (Showcase layout)
// ----------------------------------------------------
let slide1 = pptx.addSlide();
slide1.background = { color: COLOR_BG };

// Left Column: Branding Content
slide1.addText('RoomSync AI', {
  x: 0.8,
  y: 2.0,
  w: 6.0,
  h: 1.0,
  fontSize: 48,
  bold: true,
  color: COLOR_CYAN,
  fontFace: 'Segoe UI'
});

slide1.addText('Smart Hostel Roommate Matcher', {
  x: 0.8,
  y: 3.1,
  w: 6.0,
  h: 0.5,
  fontSize: 22,
  bold: true,
  color: COLOR_PURPLE,
  fontFace: 'Segoe UI'
});

slide1.addText('Redefining hostel roommate allocation with data-driven lifestyle profiles, Jaccard interest overlaps, and compatibility score weighting.', {
  x: 0.8,
  y: 3.8,
  w: 5.5,
  h: 1.5,
  fontSize: 14,
  color: COLOR_WHITE,
  fontFace: 'Segoe UI',
  lineSpacing: 20
});

// Accent detail
slide1.addShape(pptx.shapes.RECTANGLE, {
  x: 0.8,
  y: 5.5,
  w: 2.0,
  h: 0.05,
  fill: { color: COLOR_CYAN }
});

// Right Column: Landing Page Mockup Showcase
if (fs.existsSync(IMG_LANDING_DESKTOP)) {
  // Add a card background frame representing a monitor screen
  slide1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.6,
    y: 1.5,
    w: 5.9,
    h: 4.5,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_PURPLE, width: 2 }
  });
  
  slide1.addImage({
    path: IMG_LANDING_DESKTOP,
    x: 6.8,
    y: 1.7,
    w: 5.5,
    h: 4.1
  });
}

// ----------------------------------------------------
// SLIDE 2: The Problem (Fixed layout to prevent overlap)
// ----------------------------------------------------
let slide2 = createStandardSlide('The Hostel Roommate Dilemma', 'Why Random Allocation Fails');

let problemBullets = [
  { text: '• Lifestyle Frictions: ', options: { bold: true, color: COLOR_CYAN, fontSize: 14 } },
  { text: 'Night owls paired with early risers, causing sleep disruptions and academic fatigue.\n\n', options: { color: COLOR_WHITE, fontSize: 12 } },
  
  { text: '• Standard Conflicts: ', options: { bold: true, color: COLOR_CYAN, fontSize: 14 } },
  { text: 'Mismatched hygiene and cleanliness standards leading to common area disputes.\n\n', options: { color: COLOR_WHITE, fontSize: 12 } },
  
  { text: '• Study Interruptions: ', options: { bold: true, color: COLOR_CYAN, fontSize: 14 } },
  { text: 'Students requiring absolute silence paired with group study or music advocates.\n\n', options: { color: COLOR_WHITE, fontSize: 12 } },
  
  { text: '• Personality Clashes: ', options: { bold: true, color: COLOR_CYAN, fontSize: 14 } },
  { text: 'Introverts placed in highly active social rooms, leading to social exhaustion.', options: { color: COLOR_WHITE, fontSize: 12 } }
];

slide2.addText(problemBullets, {
  x: 0.8,
  y: 1.8,
  w: 7.4,
  h: 5.0,
  fontFace: 'Segoe UI',
  lineSpacing: 18
});

// Embed Mobile APK Simulation mockup
if (fs.existsSync(IMG_LANDING_MOBILE)) {
  // Mobile phone device bezel simulation
  slide2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 8.6,
    y: 1.7,
    w: 2.7,
    h: 5.2,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_CYAN, width: 3 }
  });

  slide2.addImage({
    path: IMG_LANDING_MOBILE,
    x: 8.7,
    y: 1.8,
    w: 2.5,
    h: 5.0
  });
}

// ----------------------------------------------------
// SLIDE 3: The Solution (Fixed layout to prevent overlap)
// ----------------------------------------------------
let slide3 = createStandardSlide('RoomSync AI Matching Engine', 'A Data-Driven Approach to Coexistence');

let solutionBullets = [
  { text: '• Survey-Based Profiling: ', options: { bold: true, color: COLOR_CYAN, fontSize: 14 } },
  { text: 'Captures sleep cycles, cleanliness levels, study schedules, and social environments.\n\n', options: { color: COLOR_WHITE, fontSize: 12 } },
  
  { text: '• Interest Alignment: ', options: { bold: true, color: COLOR_CYAN, fontSize: 14 } },
  { text: 'Uses Jaccard similarity index to calculate intersections of hobbies, ensuring common ground.\n\n', options: { color: COLOR_WHITE, fontSize: 12 } },
  
  { text: '• Weighted Matching: ', options: { bold: true, color: COLOR_CYAN, fontSize: 14 } },
  { text: 'Applies prioritized weights (Sleep & Cleanliness) to minimize high-friction pairings.\n\n', options: { color: COLOR_WHITE, fontSize: 12 } },
  
  { text: '• Strategic Room Suggestions: ', options: { bold: true, color: COLOR_CYAN, fontSize: 14 } },
  { text: 'Recommends matching room locations (Quiet vs. Social zones) to support student well-being.', options: { color: COLOR_WHITE, fontSize: 12 } }
];

slide3.addText(solutionBullets, {
  x: 0.8,
  y: 1.8,
  w: 6.4,
  h: 5.0,
  fontFace: 'Segoe UI',
  lineSpacing: 18
});

if (fs.existsSync(IMG_REGISTER)) {
  slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 7.5,
    y: 2.0,
    w: 5.0,
    h: 4.2,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_PURPLE, width: 2 }
  });

  slide3.addImage({
    path: IMG_REGISTER,
    x: 7.6,
    y: 2.1,
    w: 4.8,
    h: 4.0
  });
}

// ----------------------------------------------------
// SLIDE 4: How it Works (Algorithm - Fixed layout to prevent overlap)
// ----------------------------------------------------
let slide4 = createStandardSlide('Behind the AI Match Index', 'The Weighted Compatibility Formula');

// Formula display box (Glassmorphic look)
slide4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8,
  y: 1.7,
  w: 11.7,
  h: 1.1,
  fill: { color: COLOR_CARD },
  line: { color: COLOR_CYAN, width: 1.5 }
});

slide4.addText('Match Score = (0.25 × Sleep) + (0.25 × Cleanliness) + (0.20 × Study) + (0.15 × Social) + (0.15 × Hobbies)', {
  x: 1.0,
  y: 2.0,
  w: 11.3,
  h: 0.5,
  fontSize: 16,
  bold: true,
  color: COLOR_CYAN,
  fontFace: 'Courier New',
  align: 'center'
});

let algoBullets = [
  { text: '• Sleep Schedule (25%) & Cleanliness (25%): ', options: { bold: true, color: COLOR_CYAN, fontSize: 14 } },
  { text: 'Weighted highest because sleep disruptions and hygiene are the top-reported causes of student conflict.\n\n', options: { color: COLOR_WHITE, fontSize: 12 } },
  
  { text: '• Study Habits (20%): ', options: { bold: true, color: COLOR_CYAN, fontSize: 14 } },
  { text: 'Ensures study routines match, placing collaborative students together and quiet-seekers in silent zones.\n\n', options: { color: COLOR_WHITE, fontSize: 12 } },
  
  { text: '• Social Interaction (15%) & Hobbies (15%): ', options: { bold: true, color: COLOR_CYAN, fontSize: 14 } },
  { text: 'Hobbies match uses a Jaccard Similarity Index (shared hobbies / total combined hobbies) to find genuine common interests.', options: { color: COLOR_WHITE, fontSize: 12 } }
];

slide4.addText(algoBullets, {
  x: 0.8,
  y: 3.1,
  w: 11.7,
  h: 3.5,
  fontFace: 'Segoe UI',
  lineSpacing: 18
});

// ----------------------------------------------------
// SLIDE 5: Technical Architecture (Fixed layout to prevent overlap)
// ----------------------------------------------------
let slide5 = createStandardSlide('Full-Stack System Architecture', 'Robust, Scalable, and Offline-Resilient');

let archBullets = [
  { text: '• Responsive Frontend SPA: ', options: { bold: true, color: COLOR_CYAN, fontSize: 14 } },
  { text: 'Built using HTML5, CSS Variables, and ES6 JavaScript, compiled using Vite for production assets.\n\n', options: { color: COLOR_WHITE, fontSize: 12 } },
  
  { text: '• Serverless PHP Backend API: ', options: { bold: true, color: COLOR_CYAN, fontSize: 14 } },
  { text: 'PHP REST API endpoints hosted on Vercel Serverless Functions, routing requests dynamically.\n\n', options: { color: COLOR_WHITE, fontSize: 12 } },
  
  { text: '• Cloud Relational Database: ', options: { bold: true, color: COLOR_CYAN, fontSize: 14 } },
  { text: 'Clever Cloud MySQL instance hosted in Paris, France, managing multi-table data relationships.\n\n', options: { color: COLOR_WHITE, fontSize: 12 } },
  
  { text: '• Android APK & Caching: ', options: { bold: true, color: COLOR_CYAN, fontSize: 14 } },
  { text: 'Capacitor mobile wrappers compile the app to Android APK. LocalStorage handles database state if offline.', options: { color: COLOR_WHITE, fontSize: 12 } }
];

slide5.addText(archBullets, {
  x: 0.8,
  y: 1.8,
  w: 7.0,
  h: 5.0,
  fontFace: 'Segoe UI',
  lineSpacing: 18
});

// Draw a beautiful flowchart on the right
slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 8.1, y: 2.0, w: 4.1, h: 0.9, fill: { color: COLOR_CARD }, line: { color: COLOR_CYAN, width: 2 } });
slide5.addText('Client App (Web / Android APK)\n(HTML5 / CSS / Vanilla JS)', { x: 8.2, y: 2.15, w: 3.9, h: 0.6, fontSize: 12, bold: true, color: COLOR_WHITE, fontFace: 'Segoe UI', align: 'center' });

// Arrow 1
slide5.addShape(pptx.shapes.DOWN_ARROW, { x: 10.0, y: 3.0, w: 0.3, h: 0.5, fill: { color: COLOR_PURPLE } });

slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 8.1, y: 3.6, w: 4.1, h: 0.9, fill: { color: COLOR_CARD }, line: { color: COLOR_CYAN, width: 2 } });
slide5.addText('Vercel Serverless Functions\n(PHP API Gateway Router)', { x: 8.2, y: 3.75, w: 3.9, h: 0.6, fontSize: 12, bold: true, color: COLOR_WHITE, fontFace: 'Segoe UI', align: 'center' });

// Arrow 2
slide5.addShape(pptx.shapes.DOWN_ARROW, { x: 10.0, y: 4.6, w: 0.3, h: 0.5, fill: { color: COLOR_PURPLE } });

slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 8.1, y: 5.2, w: 4.1, h: 0.9, fill: { color: COLOR_CARD }, line: { color: COLOR_CYAN, width: 2 } });
slide5.addText('Clever Cloud MySQL\n(Relational Database Server)', { x: 8.2, y: 5.35, w: 3.9, h: 0.6, fontSize: 12, bold: true, color: COLOR_WHITE, fontFace: 'Segoe UI', align: 'center' });

// ----------------------------------------------------
// SLIDE 6: Database & Data Schema (Fixed layout to prevent overlap)
// ----------------------------------------------------
let slide6 = createStandardSlide('Relational Database Schema', 'Streamlined Entity-Relationship Model');

let dbBullets = [
  { text: '• students Table: ', options: { bold: true, color: COLOR_CYAN, fontSize: 14 } },
  { text: 'Stores student accounts with name, gender, branch, year, and email.\n\n', options: { color: COLOR_WHITE, fontSize: 12 } },
  
  { text: '• preferences Table: ', options: { bold: true, color: COLOR_CYAN, fontSize: 14 } },
  { text: 'Lifestyle choices (Sleep, Study, Cleanliness, Social, Environment) linked via student_id.\n\n', options: { color: COLOR_WHITE, fontSize: 12 } },
  
  { text: '• hobbies Table: ', options: { bold: true, color: COLOR_CYAN, fontSize: 14 } },
  { text: 'Maps multi-valued interests (Gaming, Reading, Coding, etc.) in a 1-to-many relationship.\n\n', options: { color: COLOR_WHITE, fontSize: 12 } },
  
  { text: '• matches Table: ', options: { bold: true, color: COLOR_CYAN, fontSize: 14 } },
  { text: 'Stores cross-calculated match scores and timestamps between student pairs.', options: { color: COLOR_WHITE, fontSize: 12 } }
];

slide6.addText(dbBullets, {
  x: 0.8,
  y: 1.8,
  w: 6.2,
  h: 5.0,
  fontFace: 'Segoe UI',
  lineSpacing: 18
});

if (fs.existsSync(IMG_DATABASE)) {
  slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 7.3,
    y: 2.0,
    w: 5.2,
    h: 4.2,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_PURPLE, width: 2 }
  });

  slide6.addImage({
    path: IMG_DATABASE,
    x: 7.4,
    y: 2.1,
    w: 5.0,
    h: 4.0
  });
}

// ----------------------------------------------------
// SLIDE 7: Admin Panel (Fixed layout to prevent overlap)
// ----------------------------------------------------
let slide7 = createStandardSlide('Hostel Administration Board', 'Real-time KPI Tracking & Allocation Oversight');

let adminBullets = [
  { text: '• Hostel KPI Metrics: ', options: { bold: true, color: COLOR_CYAN, fontSize: 14 } },
  { text: 'Tracks total registrations, roommate matches computed, allocated rooms, and average system compatibility.\n\n', options: { color: COLOR_WHITE, fontSize: 12 } },
  
  { text: '• Lifestyle Distribution: ', options: { bold: true, color: COLOR_CYAN, fontSize: 14 } },
  { text: 'Visualizes sleep schedules, cleanliness ratings, and social profiles via custom animated SVG charts.\n\n', options: { color: COLOR_WHITE, fontSize: 12 } },
  
  { text: '• Interests Analysis: ', options: { bold: true, color: COLOR_CYAN, fontSize: 14 } },
  { text: 'Tallies student hobby frequencies dynamically to help plan recreational groups and club assignments.\n\n', options: { color: COLOR_WHITE, fontSize: 12 } },
  
  { text: '• Warden Oversight: ', options: { bold: true, color: COLOR_CYAN, fontSize: 14 } },
  { text: 'Allows administrators to inspect individual student records and override room assignments.', options: { color: COLOR_WHITE, fontSize: 12 } }
];

slide7.addText(adminBullets, {
  x: 0.8,
  y: 1.8,
  w: 6.2,
  h: 5.0,
  fontFace: 'Segoe UI',
  lineSpacing: 18
});

if (fs.existsSync(IMG_ADMIN)) {
  slide7.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 7.3,
    y: 2.0,
    w: 5.2,
    h: 4.2,
    fill: { color: COLOR_CARD },
    line: { color: COLOR_CYAN, width: 2 }
  });

  slide7.addImage({
    path: IMG_ADMIN,
    x: 7.4,
    y: 2.1,
    w: 5.0,
    h: 4.0
  });
}

// ----------------------------------------------------
// SLIDE 8: Future Roadmap & ML Scope (Fixed layout to prevent overlap)
// ----------------------------------------------------
let slide8 = createStandardSlide('Project Roadmap & Future Scope', 'Platform Expansion and Advanced Matching');

let roadmap1 = [
  { text: '1. Machine Learning Integration:\n', options: { bold: true, color: COLOR_CYAN, fontSize: 14 } },
  { text: 'Transitioning the static weighted scoring model to unsupervised ML clustering (K-Means) to group students into rooms of 2, 3, or 4 dynamically.\n\n', options: { color: COLOR_WHITE, fontSize: 12 } },
  
  { text: '2. Anonymous In-App Chat:\n', options: { bold: true, color: COLOR_CYAN, fontSize: 14 } },
  { text: 'A secure, anonymous connection channel allowing top compatibility matches to chat privately, verifying alignment before final room submission.', options: { color: COLOR_WHITE, fontSize: 12 } }
];

let roadmap2 = [
  { text: '3. 3D Room Grid Navigator:\n', options: { bold: true, color: COLOR_PURPLE, fontSize: 14 } },
  { text: 'An interactive 3D WebGL map of the hostel building, allowing students to browse room options and view neighbor compatibility.\n\n', options: { color: COLOR_WHITE, fontSize: 12 } },
  
  { text: '4. Enterprise Multi-Hostel SaaS:\n', options: { bold: true, color: COLOR_PURPLE, fontSize: 14 } },
  { text: 'Expanding the database schema to support campus-wide deployments with multi-branch tenant isolation, serving multiple colleges simultaneously.', options: { color: COLOR_WHITE, fontSize: 12 } }
];

slide8.addText(roadmap1, {
  x: 0.8,
  y: 1.8,
  w: 5.6,
  h: 5.0,
  fontFace: 'Segoe UI',
  lineSpacing: 16
});

slide8.addText(roadmap2, {
  x: 6.8,
  y: 1.8,
  w: 5.7,
  h: 5.0,
  fontFace: 'Segoe UI',
  lineSpacing: 16
});

// ----------------------------------------------------
// SLIDE 9: Conclusion (Fixed layout to prevent overlap)
// ----------------------------------------------------
let slide9 = pptx.addSlide();
slide9.background = { color: COLOR_BG };

slide9.addText('RoomSync AI', {
  x: 0.8,
  y: 1.3,
  w: 11.7,
  h: 0.8,
  fontSize: 42,
  bold: true,
  color: COLOR_CYAN,
  fontFace: 'Segoe UI',
  align: 'center'
});

slide9.addText('Roommate Selection Made Smart', {
  x: 0.8,
  y: 2.1,
  w: 11.7,
  h: 0.5,
  fontSize: 20,
  bold: true,
  color: COLOR_PURPLE,
  fontFace: 'Segoe UI',
  align: 'center'
});

let concBullets = [
  { text: '• Eliminates lifestyle frictions and conflicts before they happen.\n', options: { color: COLOR_WHITE, fontSize: 14 } },
  { text: '• Enhances student well-being and fosters better study conditions.\n', options: { color: COLOR_WHITE, fontSize: 14 } },
  { text: '• Reduces heavy administration workload and room-transfer requests.\n', options: { color: COLOR_WHITE, fontSize: 14 } },
  { text: '• Provides a robust, cloud-connected architecture with instant mobile availability.', options: { color: COLOR_WHITE, fontSize: 14 } }
];

slide9.addText(concBullets, {
  x: 2.0,
  y: 3.0,
  w: 9.3,
  h: 2.2,
  fontFace: 'Segoe UI',
  lineSpacing: 18
});

slide9.addText('THANK YOU', {
  x: 0.8,
  y: 5.6,
  w: 11.7,
  h: 0.5,
  fontSize: 24,
  bold: true,
  color: COLOR_CYAN,
  fontFace: 'Segoe UI',
  align: 'center'
});

slide9.addText('Live Site: https://room-sync-ai-5m66.vercel.app', {
  x: 0.8,
  y: 6.2,
  w: 11.7,
  h: 0.4,
  fontSize: 13,
  color: COLOR_MUTED,
  fontFace: 'Segoe UI',
  align: 'center'
});


// Save the PowerPoint presentation directly to Desktop
const OUT_PPT_PATH = path.join(DESKTOP_PATH, 'RoomSync_AI_Presentation_v3.pptx');
pptx.write({ outputType: 'nodebuffer' })
  .then(buffer => {
    fs.writeFileSync(OUT_PPT_PATH, buffer);
    console.log(`SUCCESS: PowerPoint presentation created successfully!`);
    console.log(`Saved at: ${OUT_PPT_PATH}`);
  })
  .catch(err => {
    console.error(`ERROR: Failed to save PowerPoint:`, err);
  });
