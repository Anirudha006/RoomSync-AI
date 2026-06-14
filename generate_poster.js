const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

let pptx = new pptxgen();

// Set widescreen layout (13.3 x 7.5 inches)
pptx.layout = 'LAYOUT_WIDE';

// Set presentation metadata
pptx.title = 'RoomSync AI Project Exhibition Poster';
pptx.subject = 'Project Exhibition Poster - MIT Mysore';
pptx.author = 'Anirudh';

// Colors matching college theme
const COLOR_NAVY = '002D62';     // Dark College Navy
const COLOR_BLUE = '4682B4';     // Steel Blue
const COLOR_BG_BLUE = 'E1ECF4';  // Light card header blue
const COLOR_TITLE_BG = 'EBF2FA'; // Title banner blue
const COLOR_WHITE = 'FFFFFF';
const COLOR_TEXT = '333333';
const COLOR_BORDER = 'B0C4DE';   // Thin border color
const COLOR_GRAY = '666666';

// Paths to Desktop assets
const DESKTOP_PATH = 'C:/Users/srini/OneDrive/Desktop';
const IMG_LOGO_LEFT = path.join(DESKTOP_PATH, 'roomsync_poster_logo_left.jpg');
const IMG_LOGO_RIGHT = path.join(DESKTOP_PATH, 'roomsync_poster_logo_right.jpg');
const IMG_QR_CODE = path.join(DESKTOP_PATH, 'roomsync_qrcode.png');
const IMG_LANDING_DESKTOP = path.join(DESKTOP_PATH, 'roomsync_landing_desktop.png');
const IMG_LANDING_MOBILE = path.join(DESKTOP_PATH, 'roomsync_landing_mobile.png');
const IMG_ADMIN = path.join(DESKTOP_PATH, 'roomsync_admin_desktop.png');
const IMG_DATABASE = path.join(DESKTOP_PATH, 'roomsync_database_desktop.png');

// Add slide
let slide = pptx.addSlide();
slide.background = { color: COLOR_WHITE };

// ----------------------------------------------------
// 1. TOP HEADER BANNER
// ----------------------------------------------------

// MIT Mysore Logo (Left)
if (fs.existsSync(IMG_LOGO_LEFT)) {
  slide.addImage({
    path: IMG_LOGO_LEFT,
    x: 0.4,
    y: 0.25,
    w: 0.8,
    h: 0.8
  });
} else {
  // Circular logo placeholder
  slide.addShape(pptx.shapes.OVAL, {
    x: 0.4,
    y: 0.25,
    w: 0.8,
    h: 0.8,
    fill: { color: COLOR_NAVY }
  });
  slide.addText('MIT', {
    x: 0.4,
    y: 0.5,
    w: 0.8,
    h: 0.3,
    fontSize: 10,
    bold: true,
    color: COLOR_WHITE,
    fontFace: 'Segoe UI',
    align: 'center'
  });
}

// College Header Text (Center)
slide.addText('MAHARAJA INSTITUTE OF TECHNOLOGY MYSORE', {
  x: 1.4,
  y: 0.2,
  w: 10.53,
  h: 0.35,
  fontSize: 15,
  bold: true,
  color: COLOR_NAVY,
  fontFace: 'Segoe UI',
  align: 'center'
});

slide.addText('Department of Computer Science and Engineering (Artificial Intelligence)', {
  x: 1.4,
  y: 0.50,
  w: 10.53,
  h: 0.25,
  fontSize: 10,
  color: COLOR_BLUE,
  fontFace: 'Segoe UI',
  italic: true,
  align: 'center'
});

slide.addText('Belawadi, Naguvanahally Post, S.R. Patna Taluk, Mandya District 571477', {
  x: 1.4,
  y: 0.72,
  w: 10.53,
  h: 0.2,
  fontSize: 8,
  color: COLOR_GRAY,
  fontFace: 'Segoe UI',
  align: 'center'
});

// Department AI Logo (Right)
if (fs.existsSync(IMG_LOGO_RIGHT)) {
  slide.addImage({
    path: IMG_LOGO_RIGHT,
    x: 12.13,
    y: 0.25,
    w: 0.8,
    h: 0.8
  });
} else {
  // Since we don't have the exact AI logo file, we use a custom themed circular layout representing Artificial Intelligence
  slide.addShape(pptx.shapes.OVAL, {
    x: 12.13,
    y: 0.25,
    w: 0.8,
    h: 0.8,
    fill: { color: COLOR_NAVY }
  });
  slide.addShape(pptx.shapes.OVAL, {
    x: 12.23,
    y: 0.35,
    w: 0.6,
    h: 0.6,
    fill: { color: COLOR_BLUE }
  });
  slide.addText('AI', {
    x: 12.13,
    y: 0.45,
    w: 0.8,
    h: 0.4,
    fontSize: 13,
    bold: true,
    color: COLOR_WHITE,
    fontFace: 'Segoe UI',
    align: 'center'
  });
}

// ----------------------------------------------------
// 2. PROJECT TITLE BOX
// ----------------------------------------------------
slide.addShape(pptx.shapes.RECTANGLE, {
  x: 0.4,
  y: 1.1,
  w: 12.53,
  h: 0.75,
  fill: { color: COLOR_TITLE_BG },
  line: { color: COLOR_BORDER, width: 1 }
});

slide.addText('ROOMSYNC AI – SMART HOSTEL ROOMMATE MATCHER', {
  x: 0.5,
  y: 1.15,
  w: 12.33,
  h: 0.35,
  fontSize: 18,
  bold: true,
  color: COLOR_NAVY,
  fontFace: 'Segoe UI',
  align: 'center'
});

slide.addText('ASSIGNMENT PROJECT EXHIBITION   •   ACADEMIC YEAR 2025-26', {
  x: 0.5,
  y: 1.50,
  w: 12.33,
  h: 0.25,
  fontSize: 9,
  bold: true,
  color: COLOR_BLUE,
  fontFace: 'Segoe UI',
  align: 'center'
});

// ----------------------------------------------------
// 3. TEAM & SUBJECT BAR
// ----------------------------------------------------
slide.addShape(pptx.shapes.RECTANGLE, {
  x: 0.4,
  y: 1.95,
  w: 12.53,
  h: 0.35,
  fill: { color: COLOR_WHITE },
  line: { color: COLOR_GRAY, width: 0.5 }
});

slide.addText('Subject: Artificial Intelligence / Sem 4    |    Guided By: CSE AI Faculty Coordinators', {
  x: 0.5,
  y: 2.00,
  w: 12.33,
  h: 0.25,
  fontSize: 9,
  color: COLOR_TEXT,
  fontFace: 'Segoe UI',
  align: 'center'
});

// ----------------------------------------------------
// 4. SIX CARDS GRID LAYOUT
// ----------------------------------------------------

// Card coordinates helpers
const cardW = 4.05;
const cardH = 2.15;
const colX = [0.4, 4.64, 8.88];
const rowY = [2.45, 4.70];

// Helper to draw a card shell with a header
function drawCardShell(x, y, numTitle) {
  // Outer border with 100% transparent fill
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: x,
    y: y,
    w: cardW,
    h: cardH,
    fill: { color: COLOR_WHITE, transparency: 100 },
    line: { color: COLOR_BORDER, width: 1.5 }
  });
  
  // Header background block
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: x + 0.01,
    y: y + 0.01,
    w: cardW - 0.02,
    h: 0.35,
    fill: { color: COLOR_BG_BLUE }
  });
  
  // Header text
  slide.addText(numTitle, {
    x: x + 0.1,
    y: y + 0.05,
    w: cardW - 0.2,
    h: 0.25,
    fontSize: 10.5,
    bold: true,
    color: COLOR_NAVY,
    fontFace: 'Segoe UI'
  });
}

// --- CARD 1: Introduction (Top Left) ---
drawCardShell(colX[0], rowY[0], '❶  Introduction');
let introBullets = [
  { text: '• The Problem: ', options: { bold: true, color: COLOR_NAVY, fontSize: 9.5 } },
  { text: 'Roommate allocation in student hostels is traditionally done randomly or alphabetically, causing severe lifestyle frictions, study habit clashes, and sleep disruptions.\n\n', options: { color: COLOR_TEXT, fontSize: 9 } },
  { text: '• Why We Chose It: ', options: { bold: true, color: COLOR_NAVY, fontSize: 9.5 } },
  { text: 'Roommate conflicts are a primary cause of student stress and academic decline. A data-driven system enhances student harmony and administration oversight.', options: { color: COLOR_TEXT, fontSize: 9 } }
];
slide.addText(introBullets, {
  x: colX[0] + 0.1,
  y: rowY[0] + 0.42,
  w: cardW - 0.2,
  h: 0.8,
  fontFace: 'Segoe UI',
  lineSpacing: 13
});

// Context Image (Desktop screenshot)
if (fs.existsSync(IMG_LANDING_DESKTOP)) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: colX[0] + 1.15,
    y: rowY[0] + 1.35,
    w: 1.8,
    h: 0.7,
    fill: { color: COLOR_TITLE_BG },
    line: { color: COLOR_BORDER, width: 0.5 }
  });
  slide.addImage({
    path: IMG_LANDING_DESKTOP,
    x: colX[0] + 1.18,
    y: rowY[0] + 1.38,
    w: 1.74,
    h: 0.64
  });
}

// --- CARD 2: Objectives and Scope (Bottom Left) ---
drawCardShell(colX[0], rowY[1], '❷  Objectives and Scope');
let objBullets = [
  { text: '• Objective 1: ', options: { bold: true, color: COLOR_NAVY, fontSize: 9 } },
  { text: 'Build a weighted compatibility matcher based on sleep, cleanliness, and hobby alignment.\n', options: { color: COLOR_TEXT, fontSize: 8.5 } },
  { text: '• Objective 2: ', options: { bold: true, color: COLOR_NAVY, fontSize: 9 } },
  { text: 'Establish a secure, cloud-connected database to store preference records.\n', options: { color: COLOR_TEXT, fontSize: 8.5 } },
  { text: '• Objective 3: ', options: { bold: true, color: COLOR_NAVY, fontSize: 9 } },
  { text: 'Create an admin dashboard showing sleep, study, and interest KPI spreads.\n', options: { color: COLOR_TEXT, fontSize: 8.5 } },
  { text: '• Scope: ', options: { bold: true, color: COLOR_NAVY, fontSize: 9 } },
  { text: 'Focuses on roommate selection recommendations. Excludes hostel fee transactions and automated smart-lock room key distribution.', options: { color: COLOR_TEXT, fontSize: 8.5 } }
];
slide.addText(objBullets, {
  x: colX[0] + 0.1,
  y: rowY[1] + 0.42,
  w: cardW - 0.2,
  h: 1.6,
  fontFace: 'Segoe UI',
  lineSpacing: 13
});

// --- CARD 3: System Design (Top Middle) ---
drawCardShell(colX[1], rowY[0], '❸  System Design');
let designBullets = [
  { text: '• Technologies Used: ', options: { bold: true, color: COLOR_NAVY, fontSize: 9.5 } },
  { text: 'HTML5, CSS Variables, ES6 JavaScript, Vite build tool, Vercel Serverless PHP REST API, Clever Cloud MySQL, Capacitor Mobile Wrapper (Android APK).', options: { color: COLOR_TEXT, fontSize: 9 } }
];
slide.addText(designBullets, {
  x: colX[1] + 0.1,
  y: rowY[0] + 0.42,
  w: cardW - 0.2,
  h: 0.55,
  fontFace: 'Segoe UI',
  lineSpacing: 13
});

// Architecture image (ERD Database view)
if (fs.existsSync(IMG_DATABASE)) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: colX[1] + 0.9,
    y: rowY[0] + 1.05,
    w: 2.3,
    h: 1.0,
    fill: { color: COLOR_TITLE_BG },
    line: { color: COLOR_BORDER, width: 0.5 }
  });
  slide.addImage({
    path: IMG_DATABASE,
    x: colX[1] + 0.93,
    y: rowY[0] + 1.08,
    w: 2.24,
    h: 0.94
  });
}

// --- CARD 4: Results (Bottom Middle) ---
drawCardShell(colX[1], rowY[1], '❹  Results');
let resultsBullets = [
  { text: '• Outcome: ', options: { bold: true, color: COLOR_NAVY, fontSize: 9.5 } },
  { text: 'The engine successfully aligns student profiles with high-accuracy scores. Interactive charts visualize student habit metrics in real time.', options: { color: COLOR_TEXT, fontSize: 9 } }
];
slide.addText(resultsBullets, {
  x: colX[1] + 0.1,
  y: rowY[1] + 0.42,
  w: cardW - 0.2,
  h: 0.55,
  fontFace: 'Segoe UI',
  lineSpacing: 13
});

// Side-by-side screenshots inside Card 4
if (fs.existsSync(IMG_LANDING_MOBILE)) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: colX[1] + 0.4,
    y: rowY[1] + 1.05,
    w: 1.4,
    h: 1.0,
    fill: { color: COLOR_TITLE_BG },
    line: { color: COLOR_BORDER, width: 0.5 }
  });
  slide.addImage({
    path: IMG_LANDING_MOBILE,
    x: colX[1] + 0.43,
    y: rowY[1] + 1.08,
    w: 1.34,
    h: 0.94
  });
}
if (fs.existsSync(IMG_ADMIN)) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: colX[1] + 2.2,
    y: rowY[1] + 1.05,
    w: 1.4,
    h: 1.0,
    fill: { color: COLOR_TITLE_BG },
    line: { color: COLOR_BORDER, width: 0.5 }
  });
  slide.addImage({
    path: IMG_ADMIN,
    x: colX[1] + 2.23,
    y: rowY[1] + 1.08,
    w: 1.34,
    h: 0.94
  });
}

// --- CARD 5: Reflection (Top Right) ---
drawCardShell(colX[2], rowY[0], '❺  Reflection');
let reflectBullets = [
  { text: '• Advantages: ', options: { bold: true, color: COLOR_NAVY, fontSize: 8.5 } },
  { text: 'Objective compatibility metrics; minimizes high-friction pairings; offline local caching.\n', options: { color: COLOR_TEXT, fontSize: 8 } },
  { text: '• Limitations: ', options: { bold: true, color: COLOR_NAVY, fontSize: 8.5 } },
  { text: 'Relies on honest self-reporting; database connections are limited on free cloud tiers.\n', options: { color: COLOR_TEXT, fontSize: 8 } },
  { text: '• Future Work: ', options: { bold: true, color: COLOR_NAVY, fontSize: 8.5 } },
  { text: 'Clustering ML (K-Means) for multi-bed rooms; peer anonymous chat verification.\n', options: { color: COLOR_TEXT, fontSize: 8 } },
  { text: '• Key Learnings: ', options: { bold: true, color: COLOR_NAVY, fontSize: 8.5 } },
  { text: 'Gained skills in serverless PHP deployment, relational SQL design, and hybrid mobile wrappers.', options: { color: COLOR_TEXT, fontSize: 8 } }
];
slide.addText(reflectBullets, {
  x: colX[2] + 0.1,
  y: rowY[0] + 0.42,
  w: cardW - 0.2,
  h: 1.6,
  fontFace: 'Segoe UI',
  lineSpacing: 12
});

// --- CARD 6: GitHub Repository (Bottom Right) ---
drawCardShell(colX[2], rowY[1], '❻  GitHub Repository');
let gitBullets = [
  { text: '• Repository Link: ', options: { bold: true, color: COLOR_NAVY, fontSize: 9 } },
  { text: 'https://github.com/Anirudha006/RoomSync-AI\n\n', options: { color: COLOR_BLUE, fontSize: 8.5 } },
  { text: '• Repo Contents: ', options: { bold: true, color: COLOR_NAVY, fontSize: 9 } },
  { text: 'Vite build scripts, Capacitor mobile configs, MySQL database SQL schemas, REST API PHP code, and clean source templates with installation guides.', options: { color: COLOR_TEXT, fontSize: 8.5 } }
];
slide.addText(gitBullets, {
  x: colX[2] + 0.1,
  y: rowY[1] + 0.42,
  w: 2.6,
  h: 1.6,
  fontFace: 'Segoe UI',
  lineSpacing: 13
});

// QR Code Image inside Card 6 (Right aligned)
if (fs.existsSync(IMG_QR_CODE)) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: colX[2] + 2.85,
    y: rowY[1] + 0.52,
    w: 1.1,
    h: 1.1,
    fill: { color: COLOR_WHITE },
    line: { color: COLOR_BORDER, width: 0.5 }
  });
  slide.addImage({
    path: IMG_QR_CODE,
    x: colX[2] + 2.90,
    y: rowY[1] + 0.57,
    w: 1.0,
    h: 1.0
  });
  slide.addText('Scan Code', {
    x: colX[2] + 2.8,
    y: rowY[1] + 1.7,
    w: 1.2,
    h: 0.3,
    fontSize: 8.5,
    bold: true,
    color: COLOR_NAVY,
    fontFace: 'Segoe UI',
    align: 'center'
  });
}

// ----------------------------------------------------
// 5. FOOTER SECTION
// ----------------------------------------------------

// Divider Line
slide.addShape(pptx.shapes.RECTANGLE, {
  x: 0.4,
  y: 6.95,
  w: 12.53,
  h: 0.02,
  fill: { color: COLOR_NAVY }
});

// Key References (Bottom Left)
slide.addText('Key References: [1] Jaccard Similarity Coefficient for Binary Sets (1912).   [2] Vite Build System and Production Assets Bundling.   [3] Vercel Serverless Functions Architecture and API PHP Router.', {
  x: 0.4,
  y: 7.03,
  w: 7.5,
  h: 0.3,
  fontSize: 7.5,
  color: COLOR_GRAY,
  fontFace: 'Segoe UI'
});

// Department & College Stamp (Bottom Right)
slide.addText('Dept. of CSE (Artificial Intelligence), MIT Mysore  |  Assignment Project Exhibition . 2025-26', {
  x: 7.9,
  y: 7.03,
  w: 5.0,
  h: 0.3,
  fontSize: 7.5,
  color: COLOR_GRAY,
  fontFace: 'Segoe UI',
  align: 'right'
});

// ----------------------------------------------------
// SAVE POSTER PRESENTATION
// ----------------------------------------------------
const OUT_POSTER_PATH = path.join(DESKTOP_PATH, 'RoomSync_AI_Poster_v2.pptx');
pptx.write({ outputType: 'nodebuffer' })
  .then(buffer => {
    fs.writeFileSync(OUT_POSTER_PATH, buffer);
    console.log(`SUCCESS: Project Exhibition Poster created successfully!`);
    console.log(`Saved at: ${OUT_POSTER_PATH}`);
  })
  .catch(err => {
    console.error(`ERROR: Failed to save Poster:`, err);
  });
