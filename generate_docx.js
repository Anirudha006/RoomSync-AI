const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, PageBreak } = require('docx');
const fs = require('fs');
const path = require('path');

// Colors matching the academic theme (MIT Mysore)
const COLOR_NAVY = "002D62";
const COLOR_BLUE = "4682B4";
const COLOR_TEXT = "333333";
const COLOR_GREY = "666666";
const COLOR_LIGHT_BLUE = "F0F4F8";

// Typography styling helpers
function createCenterHeading(text, size = 32, color = COLOR_NAVY, spacingAfter = 200) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 100, after: spacingAfter },
    children: [
      new TextRun({
        text: text,
        bold: true,
        font: "Segoe UI",
        size: size,
        color: color
      })
    ]
  });
}

function createCenterItalicSub(text, size = 22, spacingAfter = 200) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: spacingAfter },
    children: [
      new TextRun({
        text: text,
        italic: true,
        font: "Segoe UI",
        size: size,
        color: COLOR_BLUE
      })
    ]
  });
}

function createMainTitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 400, after: 150 },
    children: [
      new TextRun({
        text: text,
        bold: true,
        font: "Segoe UI",
        size: 38,
        color: COLOR_NAVY
      })
    ]
  });
}

function createSubTitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
    children: [
      new TextRun({
        text: text,
        bold: true,
        font: "Segoe UI",
        size: 24,
        color: COLOR_BLUE
      })
    ]
  });
}

function createSectionHeading(title, spacingBefore = 400) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: spacingBefore, after: 180 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        font: "Segoe UI",
        size: 28,
        color: COLOR_NAVY
      })
    ]
  });
}

function createSubSectionHeading(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 120 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        font: "Segoe UI",
        size: 24,
        color: COLOR_BLUE
      })
    ]
  });
}

function createBodyParagraph(text, isBoldText = "", boldPrefix = "") {
  const children = [];
  if (boldPrefix) {
    children.push(new TextRun({
      text: boldPrefix,
      bold: true,
      font: "Segoe UI",
      size: 22,
      color: COLOR_NAVY
    }));
  }
  children.push(new TextRun({
    text: text,
    font: "Segoe UI",
    size: 22,
    color: COLOR_TEXT
  }));
  
  return new Paragraph({
    spacing: { after: 160 },
    lineSpacing: { before: 0, after: 0, line: 276, lineRule: "auto" }, // 1.15 line spacing
    children: children
  });
}

function createBulletItem(boldPrefix, descText) {
  return new Paragraph({
    spacing: { after: 100 },
    bullet: {
      level: 0
    },
    children: [
      new TextRun({
        text: boldPrefix,
        bold: true,
        font: "Segoe UI",
        size: 22,
        color: COLOR_NAVY
      }),
      new TextRun({
        text: descText,
        font: "Segoe UI",
        size: 22,
        color: COLOR_TEXT
      })
    ]
  });
}

function createSpacer(lines = 1) {
  return new Paragraph({
    spacing: { after: 240 * lines }
  });
}

function createTableCell(text, isHeader = false, isKey = false) {
  return new TableCell({
    width: {
      size: 20,
      type: WidthType.PERCENTAGE
    },
    shading: {
      fill: isHeader ? COLOR_NAVY : (isKey ? "F2F2F2" : "FFFFFF")
    },
    children: [
      new Paragraph({
        alignment: isHeader ? AlignmentType.CENTER : AlignmentType.LEFT,
        children: [
          new TextRun({
            text: text,
            bold: isHeader || isKey,
            font: isKey ? "Consolas" : "Segoe UI",
            size: isHeader ? 22 : 20,
            color: isHeader ? "FFFFFF" : COLOR_TEXT
          })
        ]
      })
    ],
    margins: {
      top: 100,
      bottom: 100,
      left: 150,
      right: 150
    }
  });
}

// Build Document Sections
const sections = [];

// SECTION 1: TITLE PAGE
sections.push({
  properties: {},
  children: [
    createSpacer(1),
    createCenterHeading("MAHARAJA INSTITUTE OF TECHNOLOGY MYSORE", 32, COLOR_NAVY, 100),
    createCenterItalicSub("Department of Computer Science and Engineering (Artificial Intelligence)", 20, 100),
    createCenterItalicSub("Belawadi, Mandya District - 571477", 16, 800),
    
    createCenterHeading("PROJECT SYNOPSIS", 44, COLOR_BLUE, 200),
    createMainTitle("ROOMSYNC AI"),
    createSubTitle("Smart Hostel Roommate Matching System"),
    createSpacer(3),
    
    createCenterHeading("SUBMITTED BY:", 20, COLOR_GREY, 100),
    createCenterHeading("ANIRUDHA", 24, COLOR_NAVY, 80),
    createCenterItalicSub("USN: 4MH24AI006", 20, 800),
    
    createCenterHeading("GUIDED BY:", 20, COLOR_GREY, 100),
    createCenterHeading("CSE AI FACULTY COORDINATORS", 22, COLOR_NAVY, 80),
    createCenterItalicSub("Subject: Artificial Intelligence Lab (Semester IV)", 18, 400),
    
    new Paragraph({
      children: [new PageBreak()]
    })
  ]
});

// SECTION 2: SYNOPSIS CONTENT
const contentChildren = [
  createSectionHeading("1. Introduction & Project Background", 200),
  createBodyParagraph("RoomSync AI is a modern, data-driven web and mobile application designed to solve the roommate allocation challenge in student hostels. Typically, hostel rooms are assigned randomly, leading to lifestyle frictions, sleep interruptions, and compatibility clashes. By gathering student lifestyle profiles (sleep cycles, cleanliness, study habits, social preferences) and utilizing algorithm-based matching, RoomSync AI ensures matching compatibility score predictions prior to actual room finalization. This minimizes student stress and decreases Warden administrative workloads."),
  
  createSectionHeading("2. Problem Statement"),
  createBodyParagraph("Traditional roommate allocation processes are prone to mismatches because they exclude the students' personal habits. The key issues are:"),
  createBulletItem("Sleep Cycle Clashes: ", "Pairing a night owl with an early riser causes sleep disruptions and fatigue."),
  createBulletItem("Hygiene Mismatches: ", "Disagreements over room cleanliness lead to major roommate conflicts."),
  createBulletItem("Study Schedule Clashes: ", "Students requiring absolute silence paired with group study advocates."),
  createBulletItem("Social Personality Friction: ", "Introverts matched in highly active social rooms suffer social exhaustion."),
  
  createSectionHeading("3. Objectives & Scope"),
  createBodyParagraph("The primary objectives of this project include:"),
  createBulletItem("Weighted Preference Matrix: ", "Build a weighted compatibility algorithm focused on critical lifestyle inputs."),
  createBulletItem("Interest Overlap Indexing: ", "Apply Jaccard similarity index to evaluate student hobby intersections."),
  createBulletItem("Secure Database Portal: ", "Establish a cloud-connected database storing preference vectors safely."),
  createBulletItem("Admin Dashboard: ", "Equip Wardens with real-time KPI data, metrics, and room override functions."),
  createBodyParagraph("Scope Limits: The system handles profile registration, compatibility scoring, and zone recommendations. It excludes hostel fee financial transactions and electronic smart-lock room key distribution."),
  
  createSectionHeading("4. System Design & Technical Stack"),
  createBodyParagraph("The application is developed using a robust, decoupled serverless architecture:"),
  createBulletItem("Client-Side (Frontend): ", "Built using HTML5, CSS Variables, and ES6 JavaScript, compiled via Vite. Wrapped in a Capacitor JS bridge to run as a native Android APK."),
  createBulletItem("Vercel Serverless (Backend): ", "API endpoints written in PHP and deployed on Vercel Serverless Functions. Handles client requests, JSON mapping, and matching operations."),
  createBulletItem("Clever Cloud Database (Storage): ", "Clever Cloud hosting a MySQL database instances. Manages student profile storage and relation mapping."),
  createBodyParagraph("Below is the tech stack breakdown summary:"),
];

// Add Stack Table
const stackTable = new Table({
  width: {
    size: 100,
    type: WidthType.PERCENTAGE
  },
  rows: [
    new TableRow({
      children: [
        createTableCell("Architecture Tier", true),
        createTableCell("Technologies Used", true),
        createTableCell("Functional Role", true)
      ]
    }),
    new TableRow({
      children: [
        createTableCell("Frontend", false, true),
        createTableCell("HTML5 / CSS / Vanilla JS / Vite"),
        createTableCell("Renders glassmorphic UI; caches offline local state.")
      ]
    }),
    new TableRow({
      children: [
        createTableCell("Mobile Bridge", false, true),
        createTableCell("Capacitor JS / Gradle"),
        createTableCell("Compiles frontend assets into a deployable Android APK.")
      ]
    }),
    new TableRow({
      children: [
        createTableCell("Serverless API", false, true),
        createTableCell("PHP / Vercel Serverless API"),
        createTableCell("Handles JSON routing, matching logic, and query executions.")
      ]
    }),
    new TableRow({
      children: [
        createTableCell("Database", false, true),
        createTableCell("MySQL / Clever Cloud hosting"),
        createTableCell("Ensures relational schemas integrity and active queries.")
      ]
    })
  ]
});

contentChildren.push(stackTable);
contentChildren.push(createSpacer(1));

// Add Schema section
contentChildren.push(createSectionHeading("5. Relational Database Schema"));
contentChildren.push(createBodyParagraph("The Clever Cloud MySQL relational database contains four major tables with strict primary and foreign key integrity constraints. The schemas are mapped as follows:"));

// Database Tables Mapping Table
const dbTable = new Table({
  width: {
    size: 100,
    type: WidthType.PERCENTAGE
  },
  rows: [
    new TableRow({
      children: [
        createTableCell("Table Name", true),
        createTableCell("Field / Column", true),
        createTableCell("Data Type", true),
        createTableCell("Key / Attribute", true),
        createTableCell("Description", true)
      ]
    }),
    new TableRow({
      children: [
        createTableCell("students", false, true),
        createTableCell("student_id"),
        createTableCell("VARCHAR(50)"),
        createTableCell("PK"),
        createTableCell("Unique student account identifier.")
      ]
    }),
    new TableRow({
      children: [
        createTableCell("students", false, true),
        createTableCell("name, email, branch"),
        createTableCell("VARCHAR"),
        createTableCell("Required"),
        createTableCell("Academic details and credentials.")
      ]
    }),
    new TableRow({
      children: [
        createTableCell("preferences", false, true),
        createTableCell("pref_id"),
        createTableCell("INT"),
        createTableCell("PK (AI)"),
        createTableCell("Primary key for preference record.")
      ]
    }),
    new TableRow({
      children: [
        createTableCell("preferences", false, true),
        createTableCell("student_id"),
        createTableCell("VARCHAR(50)"),
        createTableCell("FK"),
        createTableCell("Foreign key linking back to student ID.")
      ]
    }),
    new TableRow({
      children: [
        createTableCell("preferences", false, true),
        createTableCell("sleep_schedule, cleanliness"),
        createTableCell("VARCHAR(50)"),
        createTableCell("Required"),
        createTableCell("Lifestyle survey rating levels.")
      ]
    }),
    new TableRow({
      children: [
        createTableCell("hobbies", false, true),
        createTableCell("hobby_id"),
        createTableCell("INT"),
        createTableCell("PK (AI)"),
        createTableCell("Unique hobby entry identifier.")
      ]
    }),
    new TableRow({
      children: [
        createTableCell("hobbies", false, true),
        createTableCell("student_id"),
        createTableCell("VARCHAR(50)"),
        createTableCell("FK"),
        createTableCell("Foreign key linking to student.")
      ]
    }),
    new TableRow({
      children: [
        createTableCell("hobbies", false, true),
        createTableCell("hobby_name"),
        createTableCell("VARCHAR(50)"),
        createTableCell("Required"),
        createTableCell("Categorical interest tags (e.g. Gaming).")
      ]
    }),
    new TableRow({
      children: [
        createTableCell("matches", false, true),
        createTableCell("match_id"),
        createTableCell("INT"),
        createTableCell("PK (AI)"),
        createTableCell("Unique compatibility index match record.")
      ]
    }),
    new TableRow({
      children: [
        createTableCell("matches", false, true),
        createTableCell("student_a_id, student_b_id"),
        createTableCell("VARCHAR(50)"),
        createTableCell("FK"),
        createTableCell("Matches student pairs together.")
      ]
    }),
    new TableRow({
      children: [
        createTableCell("matches", false, true),
        createTableCell("compatibility_score"),
        createTableCell("INT"),
        createTableCell("Required"),
        createTableCell("Calculated matching score percentage.")
      ]
    })
  ]
});

contentChildren.push(dbTable);
contentChildren.push(createSpacer(1));

// Add Matching Logic section
contentChildren.push(createSectionHeading("6. AI Matching Algorithms & Logic"));
contentChildren.push(createSubSectionHeading("6.1. Weighted Compatibility Score"));
contentChildren.push(createBodyParagraph("Lifestyle compatibility is calculated using configurable administrative weights. The standard linear matching score formula is defined as:"));
contentChildren.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 150 },
  children: [
    new TextRun({
      text: "Match Score = (0.25 × Sleep) + (0.25 × Cleanliness) + (0.20 × Study) + (0.15 × Social) + (0.15 × Hobbies)",
      bold: true,
      font: "Courier New",
      size: 20,
      color: COLOR_NAVY
    })
  ]
}));
contentChildren.push(createBodyParagraph("Sleep Schedule and Cleanliness are prioritized at 25% each because mismatch in sleep routines and room cleanliness are historically the most common causes of roommate friction. Hobbies matching aggregates interest tags using the Jaccard similarity model."));

contentChildren.push(createSubSectionHeading("6.2. Jaccard Similarity Index"));
contentChildren.push(createBodyParagraph("Hobbies and interests are multi-valued categorical parameters. To calculate interest overlaps, the platform implements the Jaccard similarity coefficient:"));
contentChildren.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 150 },
  children: [
    new TextRun({
      text: "J(A, B) = |A ∩ B| / |A ∪ B|",
      bold: true,
      font: "Courier New",
      size: 22,
      color: COLOR_NAVY
    })
  ]
}));
contentChildren.push(createBodyParagraph("Where Set A represents Student A's hobbies and Set B represents Student B's hobbies. The intersection |A ∩ B| calculates the count of shared interests, while the union |A ∪ B| represents the count of unique interests across both profiles. The resulting ratio (between 0.0 and 1.0) is normalized to a percentage."));

contentChildren.push(createSectionHeading("7. Advantages, Limitations & Future Scope"));
contentChildren.push(createBulletItem("Key Advantages: ", "Ensures roommate pairing harmony, reduces administrative room transfer requests, provides smooth offline sync with LocalStorage, and features high-fidelity, real-time KPI dashboards for Wardens."));
contentChildren.push(createBulletItem("System Limitations: ", "Requires honest self-survey reporting from students and database requests are constrained by Clever Cloud database connection limits on the free tier."));
contentChildren.push(createBulletItem("Future Scope: ", "Transitioning to machine learning unsupervised clustering (K-Means algorithm) for automatic multi-bed room suggestions, introducing secure anonymous in-app chats between matching candidate pairs, and adding a 3D WebGL room grid navigator."));

contentChildren.push(createSectionHeading("8. Project Resources & References"));
contentChildren.push(createBodyParagraph("Live Platform Portal: https://room-sync-ai-5m66.vercel.app/"));
contentChildren.push(createBodyParagraph("GitHub Source Repository: https://github.com/Anirudha006/RoomSync-AI"));
contentChildren.push(createBodyParagraph("References:\n[1] Jaccard, P. (1912). The Distribution of the Flora in the Alpine Zone. New Phytologist.\n[2] Vite.js Asset Bundling and Static Asset Compilation.\n[3] Vercel Serverless Functions Architecture Guides."));

sections.push({
  properties: {},
  children: contentChildren
});

// Create Document
const doc = new Document({
  sections: sections
});

// Output Document
const OUT_PATH = path.join("C:", "Users", "srini", "OneDrive", "Desktop", "RoomSync_AI_Synopsis.docx");

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(OUT_PATH, buffer);
  console.log(`SUCCESS: Word document created successfully!`);
  console.log(`Saved at: ${OUT_PATH}`);
}).catch(err => {
  console.error("ERROR: Failed to save Word Document:", err);
});
