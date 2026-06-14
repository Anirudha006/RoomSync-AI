const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, PageOrientation, HeightRule } = require('docx');
const fs = require('fs');
const path = require('path');

// Colors matching the digital poster (High-end Dark theme)
const COLOR_NAVY = "002D62";     // MIT Navy
const COLOR_BLUE = "4682B4";     // Steel Blue
const COLOR_BG = "080B15";       // Dark BG
const COLOR_CARD = "0F162A";     // Glassmorphism Card
const COLOR_CYAN = "00E5FF";     // Neon Cyan
const COLOR_PURPLE = "6D5DFC";   // Royal Purple
const COLOR_WHITE = "F3F4F6";    // Text white
const COLOR_MUTED = "9CA3AF";    // Text muted
const COLOR_BORDER = "1E293B";   // Card borders

// Custom paragraph helpers for the poster cells
function createCardTitle(num, title) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({
        text: num + "  ",
        bold: true,
        font: "Segoe UI",
        size: 24,
        color: COLOR_PURPLE
      }),
      new TextRun({
        text: title,
        bold: true,
        font: "Segoe UI",
        size: 24,
        color: COLOR_CYAN
      })
    ]
  });
}

function createCardParagraph(text, prefix = "", boldColor = COLOR_CYAN) {
  const children = [];
  if (prefix) {
    children.push(new TextRun({
      text: prefix,
      bold: true,
      font: "Segoe UI",
      size: 18,
      color: boldColor
    }));
  }
  children.push(new TextRun({
    text: text,
    font: "Segoe UI",
    size: 18,
    color: COLOR_WHITE
  }));
  
  return new Paragraph({
    spacing: { after: 100 },
    children: children
  });
}

function createCardBullet(boldPrefix, descText) {
  return new Paragraph({
    spacing: { after: 80 },
    bullet: {
      level: 0
    },
    children: [
      new TextRun({
        text: boldPrefix,
        bold: true,
        font: "Segoe UI",
        size: 17,
        color: COLOR_PURPLE
      }),
      new TextRun({
        text: descText,
        font: "Segoe UI",
        size: 17,
        color: COLOR_WHITE
      })
    ]
  });
}

function createSpacer(lines = 1) {
  return new Paragraph({
    spacing: { after: 240 * lines }
  });
}

function createCardSpacer() {
  return new Paragraph({
    spacing: { after: 120 }
  });
}

function createPosterCell(childrenList) {
  return new TableCell({
    width: {
      size: 33.3,
      type: WidthType.PERCENTAGE
    },
    shading: {
      fill: COLOR_CARD
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 16, color: COLOR_BORDER },
      bottom: { style: BorderStyle.SINGLE, size: 16, color: COLOR_BORDER },
      left: { style: BorderStyle.SINGLE, size: 16, color: COLOR_BORDER },
      right: { style: BorderStyle.SINGLE, size: 16, color: COLOR_BORDER }
    },
    margins: {
      top: 240,
      bottom: 240,
      left: 300,
      right: 300
    },
    children: childrenList
  });
}

// Build Header Banner Table Cell (single full-width row)
function createHeaderBanner() {
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE
    },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.SINGLE, size: 12, color: COLOR_PURPLE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: COLOR_CARD },
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({ text: "Maharaja Institute of Technology\n", bold: true, size: 22, color: COLOR_CYAN, font: "Segoe UI" }),
                  new TextRun({ text: "Mysore, Karnataka", size: 16, color: COLOR_MUTED, font: "Segoe UI" })
                ]
              })
            ],
            margins: { left: 200, top: 150, bottom: 150 }
          }),
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            shading: { fill: COLOR_CARD },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "ROOMSYNC AI\n", bold: true, size: 36, color: COLOR_WHITE, font: "Segoe UI" }),
                  new TextRun({ text: "SMART HOSTEL ROOMMATE MATCHER", bold: true, size: 18, color: COLOR_PURPLE, font: "Segoe UI" })
                ]
              })
            ],
            margins: { top: 150, bottom: 150 }
          }),
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: COLOR_CARD },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: "Department of CSE\n", bold: true, size: 22, color: COLOR_CYAN, font: "Segoe UI" }),
                  new TextRun({ text: "Artificial Intelligence (2025-26)", size: 16, color: COLOR_MUTED, font: "Segoe UI" })
                ]
              })
            ],
            margins: { right: 200, top: 150, bottom: 150 }
          })
        ]
      })
    ]
  });
}

// Build Project Info Banner (Horizontal meta info row)
function createInfoBanner() {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 33.3, type: WidthType.PERCENTAGE },
            shading: { fill: COLOR_BG },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Guided By: CSE AI Faculty Coordinators", bold: true, size: 18, color: COLOR_WHITE, font: "Segoe UI" })]
              })
            ],
            margins: { top: 100, bottom: 100 }
          }),
          new TableCell({
            width: { size: 33.3, type: WidthType.PERCENTAGE },
            shading: { fill: COLOR_BG },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Subject: Artificial Intelligence Lab (Sem IV)", bold: true, size: 18, color: COLOR_WHITE, font: "Segoe UI" })]
              })
            ],
            margins: { top: 100, bottom: 100 }
          }),
          new TableCell({
            width: { size: 33.3, type: WidthType.PERCENTAGE },
            shading: { fill: COLOR_BG },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Institution: Maharaja Institute of Technology Mysore", bold: true, size: 18, color: COLOR_WHITE, font: "Segoe UI" })]
              })
            ],
            margins: { top: 100, bottom: 100 }
          })
        ]
      })
    ]
  });
}

// Compile the Cards content
// Column 1 Row 1: Card 1 (Visual Infographics & Pipeline)
const card1Content = [
  createCardTitle("01", "Visual Infographics"),
  createCardParagraph("RoomSync AI calculates matches based on lifestyle compatibility scores. The system processes vectors and hobby lists dynamically:"),
  createCardBullet("Lifestyle Alignment: ", "Matches sleep schedules and cleanliness index."),
  createCardBullet("Interest Overlap: ", "Calculates hobby intersections via Jaccard index."),
  createCardBullet("Dynamic Allocation: ", "Suggests optimal rooms automatically in Quiet/Social zones."),
  createCardSpacer(),
  new Paragraph({ children: [new TextRun({ text: "AI Allocation Pipeline:", bold: true, color: COLOR_CYAN, size: 18, font: "Segoe UI" })] }),
  createCardParagraph("1. Profile Survey Registration -> 2. Habit Vector Extraction -> 3. Weighted Index & Jaccard Computations -> 4. Room Allocation Recommendation.")
];

// Column 2 Row 1: Card 2 (Database Schema ER Layout)
const card2Content = [
  createCardTitle("02", "Relational Database Schema"),
  createCardParagraph("The Clever Cloud hosted database enforces relational schemas with foreign key integrity. Mapped data entities:"),
  createCardBullet("students: ", "student_id (PK), name, email, branch, year"),
  createCardBullet("preferences: ", "pref_id (PK), student_id (FK), sleep_schedule, study_style, cleanliness, social_pref, room_environment"),
  createCardBullet("hobbies: ", "hobby_id (PK), student_id (FK), hobby_name"),
  createCardBullet("matches: ", "match_id (PK), student_a_id (FK), student_b_id (FK), compatibility_score, match_date"),
  createCardSpacer(),
  createCardParagraph("Maintains schema integrity with connection pools mapped to Vercel backend routers.")
];

// Column 3 Row 1: Card 3 (Reflection & Scope)
const card3Content = [
  createCardTitle("03", "Reflection & Scope"),
  createCardBullet("Key Advantages: ", "Pre-allocation conflict mitigation. Objective match metrics. Offline LocalStorage caching capability."),
  createCardBullet("System Limitations: ", "Relies on honest student profiles. SQL concurrency caps on free Clever Cloud instance."),
  createCardBullet("Future Scope: ", "Unsupervised K-Means clustering for multi-bed configurations. Secure anonymous peer chats before selection."),
  createCardBullet("System Integration: ", "Designed with modular APIs to easily import student databases and connect to warden management panels.")
];

// Column 1 Row 2: Card 4 (Weighted Matching Index)
const card4Content = [
  createCardTitle("04", "Weighted Matching Index"),
  createCardParagraph("Lifestyle attributes are weighted dynamically using normalized combinations. Critical categories are weighted higher:"),
  createCardParagraph("Match Score = (0.25 × Sleep) + (0.25 × Clean) + (0.20 × Study) + (0.15 × Social) + (0.15 × Hobbies)", "", COLOR_CYAN),
  createCardSpacer(),
  createCardParagraph("Weighting sleep schedules and hygiene highest (25% each) directly resolves the most common roommates dispute patterns reported in hostels.")
];

// Column 2 Row 2: Card 5 (Jaccard Similarity Index)
const card5Content = [
  createCardTitle("05", "Jaccard Similarity Index"),
  createCardParagraph("Hobby overlaps represent set similarity index ratios, calculated as:"),
  createCardParagraph("J(A, B) = |A ∩ B| / |A ∪ B|", "", COLOR_CYAN),
  createCardSpacer(),
  createCardBullet("Set Intersection |A ∩ B|: ", "Counts matching hobbies (e.g. Coding shared in common)."),
  createCardBullet("Set Union |A ∪ B|: ", "Counts total unique hobbies between Student A and Student B."),
  createCardParagraph("Yields a similarity ratio between 0.0 and 1.0, normalized to matching score percentages.")
];

// Column 3 Row 2: Card 6 (Serverless Stack & URL)
const card6Content = [
  createCardTitle("06", "Serverless Full-Stack Architecture"),
  createCardParagraph("A modern three-tier serverless system with offline local caches:"),
  createCardBullet("Frontend: ", "Vite SPA (HTML5/CSS/Vanilla JS) wrapped in Capacitor Android APK."),
  createCardBullet("Backend: ", "Vercel Serverless Function PHP REST API Router."),
  createCardBullet("Database: ", "Paris-hosted Clever Cloud MySQL database instance."),
  createCardSpacer(),
  createCardParagraph("Live Access Portal URL: ", "room-sync-ai-5m66.vercel.app", COLOR_CYAN),
  createCardParagraph("GitHub Repository: ", "github.com/Anirudha006/RoomSync-AI", COLOR_PURPLE)
];

// Assemble Poster Table Grid
const posterGridTable = new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({
      height: { value: 6400, rule: HeightRule.EXACT },
      children: [
        createPosterCell(card1Content),
        createPosterCell(card2Content),
        createPosterCell(card3Content)
      ]
    }),
    new TableRow({
      height: { value: 4800, rule: HeightRule.EXACT },
      children: [
        createPosterCell(card4Content),
        createPosterCell(card5Content),
        createPosterCell(card6Content)
      ]
    })
  ]
});

// Build Footer references
function createFooterRow() {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 12, color: COLOR_PURPLE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            shading: { fill: COLOR_CARD },
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [new TextRun({ text: "Key References: [1] Jaccard Similarity (1912).  [2] Vite.js Production Bundling.  [3] Vercel Serverless PHP Gateway.", size: 14, color: COLOR_MUTED, font: "Segoe UI" })]
              })
            ],
            margins: { left: 200, top: 120, bottom: 120 }
          }),
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            shading: { fill: COLOR_CARD },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: "Dept. of CSE (Artificial Intelligence), MIT Mysore  |  Exhibition Poster", size: 14, color: COLOR_MUTED, font: "Segoe UI" })]
              })
            ],
            margins: { right: 200, top: 120, bottom: 120 }
          })
        ]
      })
    ]
  });
}

// Assemble Document
const doc = new Document({
  sections: [
    {
      properties: {
        page: {
          size: {
            width: 23818, // A3 landscape width in twips
            height: 16834 // A3 landscape height in twips
          },
          orientation: PageOrientation.LANDSCAPE
        },
        margins: {
          top: 360,
          bottom: 360,
          left: 360,
          right: 360
        }
      },
      children: [
        createHeaderBanner(),
        createSpacer(1),
        createInfoBanner(),
        createSpacer(1),
        posterGridTable,
        createSpacer(1),
        createFooterRow()
      ]
    }
  ]
});

// Write file
const OUT_PATH = path.join("C:", "Users", "srini", "OneDrive", "Desktop", "RoomSync_AI_A3_Word_Poster.docx");

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(OUT_PATH, buffer);
  console.log(`SUCCESS: Word poster created successfully!`);
  console.log(`Saved at: ${OUT_PATH}`);
}).catch(err => {
  console.error("ERROR: Failed to save Word Poster:", err);
});
