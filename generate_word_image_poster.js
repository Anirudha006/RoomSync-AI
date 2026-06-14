const { Document, Packer, Paragraph, ImageRun, PageOrientation } = require('docx');
const fs = require('fs');
const path = require('path');

// Target paths
const DESKTOP_PATH = 'C:/Users/srini/OneDrive/Desktop';
const IMG_PATH = path.join(DESKTOP_PATH, 'RoomSync_AI_4K_Digital_Poster.png');
const OUT_PATH = path.join(DESKTOP_PATH, 'RoomSync_AI_Poster_Word.docx');

if (!fs.existsSync(IMG_PATH)) {
  console.error(`ERROR: High-resolution image not found at ${IMG_PATH}`);
  process.exit(1);
}

// Read image buffer
const imgBuffer = fs.readFileSync(IMG_PATH);

// Dimensions for A3 landscape in pixels at 96 DPI
// A3 is 16.54 x 11.69 inches. 16.54 * 96 = ~1588px, 11.69 * 96 = ~1122px
// To fit the 16:9 aspect ratio of the 4K poster (3840x2160) inside A3 landscape:
// Aspect ratio of poster: 1.777
// If we set width to 1584px (which is divisible by 8), height is 1584 / 1.777 = 891px.
// Centering this image on the page will render a perfectly proportioned poster.

const doc = new Document({
  sections: [
    {
      properties: {
        page: {
          size: {
            width: 23818,  // A3 landscape width in twips
            height: 16834  // A3 landscape height in twips
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
        new Paragraph({
          alignment: "center",
          children: [
            new ImageRun({
              data: imgBuffer,
              transformation: {
                width: 1440, // Width in pixels (equivalent to 15 inches at 96 DPI)
                height: 810  // Height in pixels (equivalent to 8.44 inches at 96 DPI, maintaining 16:9 ratio)
              }
            })
          ]
        })
      ]
    }
  ]
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(OUT_PATH, buffer);
  console.log(`SUCCESS: Word Image Poster created successfully!`);
  console.log(`Saved at: ${OUT_PATH}`);
}).catch(err => {
  console.error("ERROR: Failed to save Word Image Poster:", err);
});
