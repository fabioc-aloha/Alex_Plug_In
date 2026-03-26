const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const { FaLandmark, FaMountain, FaIndustry, FaUniversity, FaChartLine, FaStar, FaFlag, FaCoins } = require("react-icons/fa");

// Helper function to render icon as SVG
function renderIconSvg(IconComponent, color = "#000000", size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}

// Helper function to convert icon to base64 PNG
async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, color, size);
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

// Helper to create shadow objects (soft pastel shadow)
const makeShadow = () => ({
  type: "outer",
  blur: 8,
  offset: 2,
  angle: 135,
  color: "6639ba",  // Purple tint for pastel shadow
  opacity: 0.08
});

async function createPresentation() {
  let pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  pres.author = 'Alex Cognitive Architecture';
  pres.title = 'The History of Charlotte, North Carolina';

  // Color palette - "GitHub Pastel v2" (Alex's standard visual language)
  // Soft, accessible, high-contrast pastels designed for diagrams and presentations
  const colors = {
    // Primary: Blue/Sky — headers, titles, navigation
    primaryFill: "ddf4ff",     // Soft sky blue background
    primaryText: "0550ae",     // Deep blue text (high contrast)
    primaryBorder: "80ccff",   // Medium blue border
    
    // Secondary: Purple — section dividers, accent cards
    secondaryFill: "d8b9ff",   // Lavender background
    secondaryText: "6639ba",   // Deep purple text
    secondaryBorder: "bf8aff", // Medium purple border
    
    // Accent: Gold/Yellow — timeline, highlights, callouts
    accentFill: "fff8c5",      // Warm cream yellow
    accentText: "9a6700",      // Deep amber text
    accentBorder: "d4a72c",    // Golden border
    
    // Warm: Bronze/Peach — historical warmth, content cards
    warmFill: "fff1e5",        // Soft peach
    warmText: "953800",        // Deep terracotta
    warmBorder: "ffb77c",      // Coral border
    
    // Neutral: Silver/Gray — slide backgrounds
    neutralFill: "eaeef2",     // Light gray background
    neutralText: "24292f",     // Dark text (excellent readability)
    neutralBorder: "afb8c1",   // Medium gray
    
    // Success: Green/Mint — positive highlights
    successFill: "d3f5db",     // Soft mint
    successText: "1a7f37",     // Forest green
    successBorder: "6fdd8b",   // Bright green
    
    white: "FFFFFF"
  };

  // Pre-render icons (using accent gold for historical theme)
  const iconLandmark = await iconToBase64Png(FaLandmark, "#" + colors.accentText, 256);
  const iconMountain = await iconToBase64Png(FaMountain, "#" + colors.accentText, 256);
  const iconFlag = await iconToBase64Png(FaFlag, "#" + colors.warmText, 256);
  const iconCoins = await iconToBase64Png(FaCoins, "#" + colors.accentText, 256);
  const iconIndustry = await iconToBase64Png(FaIndustry, "#" + colors.primaryText, 256);
  const iconUniversity = await iconToBase64Png(FaUniversity, "#" + colors.secondaryText, 256);
  const iconChart = await iconToBase64Png(FaChartLine, "#" + colors.successText, 256);
  const iconStar = await iconToBase64Png(FaStar, "#" + colors.accentText, 256);

  // Slide 1: Title Slide (Blue/Sky primary)
  let slide1 = pres.addSlide();
  slide1.background = { color: colors.primaryFill };

  // Decorative top border
  slide1.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.15,
    fill: { color: colors.primaryBorder }
  });

  slide1.addText("The History of Charlotte", {
    x: 0.5, y: 1.8, w: 9, h: 0.8,
    fontSize: 48, bold: true, color: colors.primaryText,
    align: "center", fontFace: "Calibri"
  });

  slide1.addText("North Carolina", {
    x: 0.5, y: 2.7, w: 9, h: 0.5,
    fontSize: 32, color: colors.accentText,
    align: "center", fontFace: "Calibri"
  });

  slide1.addText("From Colonial Settlement to Modern Banking Capital", {
    x: 0.5, y: 3.5, w: 9, h: 0.4,
    fontSize: 18, color: colors.neutralText, italic: true,
    align: "center", fontFace: "Calibri"
  });

  // Decorative bottom border
  slide1.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.475, w: 10, h: 0.15,
    fill: { color: colors.primaryBorder }
  });

  // Slide 2: Indigenous Origins and Early Settlement
  let slide2 = pres.addSlide();
  slide2.background = { color: colors.neutralFill };

  slide2.addText("Indigenous Origins & Early Settlement", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 40, bold: true, color: colors.primaryText,
    fontFace: "Calibri", margin: 0
  });

  slide2.addImage({
    data: iconMountain,
    x: 0.6, y: 1.2, w: 0.5, h: 0.5
  });

  slide2.addText("The Catawba Nation", {
    x: 1.3, y: 1.25, w: 8, h: 0.4,
    fontSize: 24, bold: true, color: colors.neutralText,
    fontFace: "Calibri"
  });

  slide2.addText("For thousands of years, the Catawba Native American tribe inhabited the Piedmont region, including what would become Charlotte. They were skilled farmers, hunters, and traders who established a thriving civilization in the Carolina backcountry.", {
    x: 1.3, y: 1.7, w: 8, h: 1.0,
    fontSize: 14, color: colors.neutralText,
    fontFace: "Calibri"
  });

  // Warm peach card for historical content
  slide2.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 2.9, w: 8.8, h: 2.0,
    fill: { color: colors.warmFill },
    line: { color: colors.warmBorder, width: 1.5 },
    shadow: makeShadow()
  });

  slide2.addText("European Settlers Arrive", {
    x: 1.0, y: 3.1, w: 8, h: 0.4,
    fontSize: 20, bold: true, color: colors.warmText,
    fontFace: "Calibri"
  });

  slide2.addText([
    { text: "Mid-1700s: ", options: { bold: true } },
    { text: "Scots-Irish and German immigrants arrived seeking farmland", options: { breakLine: true } },
    { text: "1768: ", options: { bold: true } },
    { text: "Charlotte officially founded and named after Queen Charlotte of Mecklenburg-Strelitz", options: { breakLine: true } },
    { text: "Early Economy: ", options: { bold: true } },
    { text: "Agriculture and small-scale trade dominated the settlement" }
  ], {
    x: 1.0, y: 3.6, w: 8, h: 1.2,
    fontSize: 14, color: colors.neutralText,
    fontFace: "Calibri"
  });

  // Slide 3: Revolutionary Spirit
  let slide3 = pres.addSlide();
  slide3.background = { color: colors.neutralFill };

  slide3.addText("Revolutionary Spirit", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 40, bold: true, color: colors.primaryText,
    fontFace: "Calibri", margin: 0
  });

  slide3.addImage({
    data: iconFlag,
    x: 0.6, y: 1.2, w: 0.5, h: 0.5
  });

  // Left card: Warm peach
  slide3.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.0, w: 4.3, h: 3.5,
    fill: { color: colors.warmFill },
    line: { color: colors.warmBorder, width: 1.5 },
    shadow: makeShadow()
  });

  slide3.addText("The Mecklenburg Declaration", {
    x: 1.2, y: 1.2, w: 3.5, h: 0.5,
    fontSize: 20, bold: true, color: colors.warmText,
    fontFace: "Calibri"
  });

  slide3.addText("May 20, 1775", {
    x: 0.7, y: 1.8, w: 4.0, h: 0.4,
    fontSize: 24, bold: true, color: colors.accentText, italic: true,
    align: "center", fontFace: "Calibri"
  });

  slide3.addText("Charlotte claims to have declared independence from Britain over a year before the national declaration. While historians debate its authenticity, this date appears on both the North Carolina state flag and Charlotte's city seal.", {
    x: 0.7, y: 2.3, w: 4.0, h: 1.0,
    fontSize: 13, color: colors.neutralText,
    fontFace: "Calibri"
  });

  slide3.addText('"The Hornet\'s Nest"', {
    x: 0.7, y: 3.5, w: 4.0, h: 0.4,
    fontSize: 16, bold: true, color: colors.secondaryText, italic: true,
    align: "center", fontFace: "Calibri"
  });

  slide3.addText("British General Cornwallis gave Charlotte this nickname after fierce resistance during the Battle of Charlotte in 1780.", {
    x: 0.7, y: 3.9, w: 4.0, h: 0.5,
    fontSize: 11, color: colors.neutralText, italic: true,
    align: "center", fontFace: "Calibri"
  });

  // Right card: Purple/Lavender
  slide3.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.0, w: 4.3, h: 3.5,
    fill: { color: colors.secondaryFill },
    line: { color: colors.secondaryBorder, width: 1.5 },
    shadow: makeShadow()
  });

  slide3.addText("Revolutionary Legacy", {
    x: 5.4, y: 1.3, w: 3.9, h: 0.5,
    fontSize: 22, bold: true, color: colors.secondaryText,
    fontFace: "Calibri"
  });

  slide3.addText([
    { text: "Despite its royal name, Charlotte became known for fierce independence", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "Local militia resisted British occupation", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "This spirit of resistance continues to define the Queen City today" }
  ], {
    x: 5.5, y: 2.0, w: 3.8, h: 2.2,
    fontSize: 14, color: colors.neutralText,
    fontFace: "Calibri"
  });

  // Slide 4: The Gold Rush Era
  let slide4 = pres.addSlide();
  slide4.background = { color: colors.neutralFill };

  slide4.addText("The Gold Rush Era", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 40, bold: true, color: colors.primaryText,
    fontFace: "Calibri", margin: 0
  });

  slide4.addImage({
    data: iconCoins,
    x: 0.6, y: 1.2, w: 0.5, h: 0.5
  });

  slide4.addText("America's First Gold Rush", {
    x: 1.3, y: 1.25, w: 8, h: 0.4,
    fontSize: 24, bold: true, color: colors.neutralText,
    fontFace: "Calibri"
  });

  // Three timeline cards: Gold, Primary, Purple
  slide4.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.9, w: 2.8, h: 1.8,
    fill: { color: colors.accentFill },
    line: { color: colors.accentBorder, width: 2 },
    shadow: makeShadow()
  });

  slide4.addText("1799", {
    x: 0.5, y: 2.1, w: 2.8, h: 0.5,
    fontSize: 48, bold: true, color: colors.accentText,
    align: "center", fontFace: "Calibri"
  });

  slide4.addText("Conrad Reed discovers a 17-pound gold nugget", {
    x: 0.6, y: 2.7, w: 2.6, h: 0.8,
    fontSize: 13, color: colors.neutralText,
    align: "center", fontFace: "Calibri"
  });

  slide4.addShape(pres.shapes.RECTANGLE, {
    x: 3.6, y: 1.9, w: 2.8, h: 1.8,
    fill: { color: colors.primaryFill },
    line: { color: colors.primaryBorder, width: 2 },
    shadow: makeShadow()
  });

  slide4.addText("1830s", {
    x: 3.6, y: 2.1, w: 2.8, h: 0.5,
    fontSize: 48, bold: true, color: colors.primaryText,
    align: "center", fontFace: "Calibri"
  });

  slide4.addText("Charlotte becomes the center of gold production", {
    x: 3.7, y: 2.7, w: 2.6, h: 0.8,
    fontSize: 13, color: colors.neutralText,
    align: "center", fontFace: "Calibri"
  });

  slide4.addShape(pres.shapes.RECTANGLE, {
    x: 6.7, y: 1.9, w: 2.8, h: 1.8,
    fill: { color: colors.secondaryFill },
    line: { color: colors.secondaryBorder, width: 2 },
    shadow: makeShadow()
  });

  slide4.addText("1837", {
    x: 6.7, y: 2.1, w: 2.8, h: 0.5,
    fontSize: 48, bold: true, color: colors.secondaryText,
    align: "center", fontFace: "Calibri"
  });

  slide4.addText("U.S. Branch Mint established in Charlotte", {
    x: 6.8, y: 2.7, w: 2.6, h: 0.8,
    fontSize: 13, color: colors.neutralText,
    align: "center", fontFace: "Calibri"
  });

  // Economic impact card
  slide4.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.9, w: 9, h: 1.4,
    fill: { color: colors.white },
    line: { color: colors.neutralBorder, width: 1 },
    shadow: makeShadow()
  });

  slide4.addText("Economic Impact", {
    x: 0.7, y: 4.1, w: 8.6, h: 0.3,
    fontSize: 18, bold: true, color: colors.primaryText,
    fontFace: "Calibri"
  });

  slide4.addText("The gold rush transformed Charlotte from a small farming community into a commercial center. The U.S. Mint operated until the Civil War, establishing Charlotte's reputation as a hub for finance and commerce that continues today.", {
    x: 0.7, y: 4.5, w: 8.6, h: 0.7,
    fontSize: 14, color: colors.neutralText,
    fontFace: "Calibri"
  });

  // Slide 5: Civil War and Reconstruction
  let slide5 = pres.addSlide();
  slide5.background = { color: colors.neutralFill };

  slide5.addText("Civil War & Reconstruction", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 40, bold: true, color: colors.primaryText,
    fontFace: "Calibri", margin: 0
  });

  slide5.addImage({
    data: iconLandmark,
    x: 0.6, y: 1.2, w: 0.5, h: 0.5
  });

  slide5.addText("1861-1900", {
    x: 1.3, y: 1.3, w: 8, h: 0.4,
    fontSize: 20, bold: true, color: colors.accentText, italic: true,
    fontFace: "Calibri"
  });

  // Left: White card with warm border
  slide5.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.9, w: 4.4, h: 3.3,
    fill: { color: colors.white },
    line: { color: colors.warmBorder, width: 1.5 },
    shadow: makeShadow()
  });

  slide5.addText("During the Civil War", {
    x: 0.7, y: 2.1, w: 4.0, h: 0.4,
    fontSize: 20, bold: true, color: colors.warmText,
    fontFace: "Calibri"
  });

  slide5.addText([
    { text: "• Confederate naval yard and supply depot", options: { breakLine: true } },
    { text: "• Strategic manufacturing location", options: { breakLine: true } },
    { text: "• Surrendered to Union forces in 1865", options: { breakLine: true } },
    { text: "• Final meeting place of Confederate Cabinet" }
  ], {
    x: 0.7, y: 2.6, w: 4.0, h: 1.0,
    fontSize: 14, color: colors.neutralText,
    fontFace: "Calibri"
  });

  slide5.addText("Economic Transformation", {
    x: 0.7, y: 3.7, w: 4.0, h: 0.4,
    fontSize: 16, bold: true, color: colors.secondaryText,
    fontFace: "Calibri"
  });

  slide5.addText('After the war, Charlotte rebuilt around cotton trading and textile manufacturing, earning the nickname "The Cotton Town."', {
    x: 0.7, y: 4.1, w: 4.0, h: 0.9,
    fontSize: 13, color: colors.neutralText, italic: true,
    fontFace: "Calibri"
  });

  // Right: Blue card for stats
  slide5.addShape(pres.shapes.RECTANGLE, {
    x: 5.1, y: 1.9, w: 4.4, h: 3.3,
    fill: { color: colors.primaryFill },
    line: { color: colors.primaryBorder, width: 1.5 },
    shadow: makeShadow()
  });

  slide5.addText("Population Growth", {
    x: 5.3, y: 2.1, w: 4.0, h: 0.4,
    fontSize: 20, bold: true, color: colors.primaryText,
    fontFace: "Calibri"
  });

  slide5.addShape(pres.shapes.RECTANGLE, {
    x: 5.5, y: 2.7, w: 3.8, h: 0.08,
    fill: { color: colors.accentBorder }
  });

  slide5.addText("1870", {
    x: 5.3, y: 2.9, w: 1.8, h: 0.4,
    fontSize: 16, bold: true, color: colors.accentText,
    fontFace: "Calibri"
  });

  slide5.addText("~4,500", {
    x: 7.3, y: 2.9, w: 2.0, h: 0.4,
    fontSize: 24, bold: true, color: colors.primaryText,
    align: "right", fontFace: "Calibri"
  });

  slide5.addShape(pres.shapes.RECTANGLE, {
    x: 5.5, y: 3.5, w: 3.8, h: 0.08,
    fill: { color: colors.accentBorder }
  });

  slide5.addText("1900", {
    x: 5.3, y: 3.7, w: 1.8, h: 0.4,
    fontSize: 16, bold: true, color: colors.accentText,
    fontFace: "Calibri"
  });

  slide5.addText("18,000+", {
    x: 7.3, y: 3.7, w: 2.0, h: 0.4,
    fontSize: 24, bold: true, color: colors.primaryText,
    align: "right", fontFace: "Calibri"
  });

  slide5.addText("4x increase in 30 years", {
    x: 5.3, y: 4.3, w: 4.0, h: 0.5,
    fontSize: 14, color: colors.neutralText, italic: true,
    align: "center", fontFace: "Calibri"
  });

  // Slide 6: Textile and Railroad Hub
  let slide6 = pres.addSlide();
  slide6.background = { color: colors.neutralFill };

  slide6.addText("Textile & Railroad Hub", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 40, bold: true, color: colors.primaryText,
    fontFace: "Calibri", margin: 0
  });

  slide6.addImage({
    data: iconIndustry,
    x: 0.6, y: 1.2, w: 0.5, h: 0.5
  });

  slide6.addText("1900-1970: Industrial Powerhouse", {
    x: 1.3, y: 1.25, w: 8, h: 0.4,
    fontSize: 24, bold: true, color: colors.neutralText,
    fontFace: "Calibri"
  });

  slide6.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.9, w: 9, h: 1.5,
    fill: { color: colors.white },
    line: { color: colors.primaryBorder, width: 1.5 },
    shadow: makeShadow()
  });

  slide6.addText("The South's Leading Textile Manufacturing Center", {
    x: 0.7, y: 2.1, w: 8.6, h: 0.4,
    fontSize: 18, bold: true, color: colors.primaryText,
    fontFace: "Calibri"
  });

  slide6.addText("Mills dotted the landscape as Charlotte became a major railroad junction connecting the Southeast. This industrial growth attracted workers from across the region and transformed the city from a small town into a thriving industrial center.", {
    x: 0.7, y: 2.6, w: 8.6, h: 0.6,
    fontSize: 14, color: colors.neutralText,
    fontFace: "Calibri"
  });

  slide6.addImage({
    data: iconUniversity,
    x: 0.6, y: 3.6, w: 0.5, h: 0.5
  });

  slide6.addText("Civil Rights Movement", {
    x: 1.3, y: 3.65, w: 8, h: 0.4,
    fontSize: 20, bold: true, color: colors.neutralText,
    fontFace: "Calibri"
  });

  // Green/Mint success card for civil rights achievement
  slide6.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.2, w: 9, h: 1.0,
    fill: { color: colors.successFill },
    line: { color: colors.successBorder, width: 1.5 },
    shadow: makeShadow()
  });

  slide6.addText([
    { text: "Swann v. Charlotte-Mecklenburg Board of Education ", options: { bold: true, italic: true } },
    { text: "(1971): Landmark Supreme Court case establishing busing as a tool for school desegregation. Charlotte peacefully integrated its schools, setting an example for the nation." }
  ], {
    x: 0.7, y: 4.4, w: 8.6, h: 0.6,
    fontSize: 13, color: colors.successText,
    fontFace: "Calibri"
  });

  // Slide 7: Banking Capital
  let slide7 = pres.addSlide();
  slide7.background = { color: colors.neutralFill };

  slide7.addText("Banking Capital & Modern Growth", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 40, bold: true, color: colors.primaryText,
    fontFace: "Calibri", margin: 0
  });

  slide7.addImage({
    data: iconChart,
    x: 0.6, y: 1.2, w: 0.5, h: 0.5
  });

  slide7.addText("1970-Present: Financial Transformation", {
    x: 1.3, y: 1.25, w: 8, h: 0.4,
    fontSize: 24, bold: true, color: colors.neutralText,
    fontFace: "Calibri"
  });

  // Gold highlight card
  slide7.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.9, w: 4.4, h: 1.3,
    fill: { color: colors.accentFill },
    line: { color: colors.accentBorder, width: 2 },
    shadow: makeShadow()
  });

  slide7.addText("2nd Largest", {
    x: 0.5, y: 2.1, w: 4.4, h: 0.5,
    fontSize: 36, bold: true, color: colors.accentText,
    align: "center", fontFace: "Calibri"
  });

  slide7.addText("Banking Center in the U.S.", {
    x: 0.5, y: 2.7, w: 4.4, h: 0.4,
    fontSize: 16, color: colors.neutralText,
    align: "center", fontFace: "Calibri"
  });

  // Primary blue info card
  slide7.addShape(pres.shapes.RECTANGLE, {
    x: 5.1, y: 1.9, w: 4.4, h: 1.3,
    fill: { color: colors.primaryFill },
    line: { color: colors.primaryBorder, width: 1.5 },
    shadow: makeShadow()
  });

  slide7.addText([
    { text: "Bank of America", options: { bold: true, breakLine: true } },
    { text: "Corporate Headquarters", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "Wells Fargo", options: { bold: true, breakLine: true } },
    { text: "East Coast Operations" }
  ], {
    x: 5.1, y: 2.1, w: 4.4, h: 1.0,
    fontSize: 14, color: colors.primaryText,
    align: "center", fontFace: "Calibri"
  });

  slide7.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.4, w: 9, h: 1.7,
    fill: { color: colors.white },
    line: { color: colors.neutralBorder, width: 1 },
    shadow: makeShadow()
  });

  slide7.addText("Explosive Population Growth", {
    x: 0.7, y: 3.6, w: 8.6, h: 0.4,
    fontSize: 20, bold: true, color: colors.primaryText,
    fontFace: "Calibri"
  });

  slide7.addText([
    { text: "1970: ", options: { bold: true } },
    { text: "~240,000 residents", options: { breakLine: true } },
    { text: "Today: ", options: { bold: true } },
    { text: "900,000+ city population, 2.8 million metro area", options: { breakLine: true } },
    { text: "Economy: ", options: { bold: true } },
    { text: "Diversified beyond banking to include healthcare, technology, and energy" }
  ], {
    x: 0.7, y: 4.1, w: 8.6, h: 0.9,
    fontSize: 14, color: colors.neutralText,
    fontFace: "Calibri"
  });

  // Slide 8: Modern Charlotte
  let slide8 = pres.addSlide();
  slide8.background = { color: colors.neutralFill };

  slide8.addText("Modern Charlotte", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 40, bold: true, color: colors.primaryText,
    fontFace: "Calibri", margin: 0
  });

  slide8.addImage({
    data: iconStar,
    x: 0.6, y: 1.2, w: 0.5, h: 0.5
  });

  slide8.addText("One of America's Fastest-Growing Cities", {
    x: 1.3, y: 1.25, w: 8, h: 0.4,
    fontSize: 24, bold: true, color: colors.neutralText,
    fontFace: "Calibri"
  });

  // Three column layout with different pastel colors
  // Column 1: Gold
  slide8.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.9, w: 2.9, h: 3.0,
    fill: { color: colors.white },
    line: { color: colors.accentBorder, width: 1.5 },
    shadow: makeShadow()
  });

  slide8.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.9, w: 2.9, h: 0.12,
    fill: { color: colors.accentFill }
  });

  slide8.addText("Sports & Culture", {
    x: 0.6, y: 2.1, w: 2.7, h: 0.4,
    fontSize: 18, bold: true, color: colors.accentText,
    fontFace: "Calibri"
  });

  slide8.addText([
    { text: "• Carolina Panthers (NFL)", options: { breakLine: true } },
    { text: "• Charlotte Hornets (NBA)", options: { breakLine: true } },
    { text: "• NASCAR events at Charlotte Motor Speedway", options: { breakLine: true } },
    { text: "• Vibrant arts and music scene" }
  ], {
    x: 0.6, y: 2.6, w: 2.7, h: 1.5,
    fontSize: 13, color: colors.neutralText,
    fontFace: "Calibri"
  });

  // Column 2: Purple
  slide8.addShape(pres.shapes.RECTANGLE, {
    x: 3.55, y: 1.9, w: 2.9, h: 3.0,
    fill: { color: colors.white },
    line: { color: colors.secondaryBorder, width: 1.5 },
    shadow: makeShadow()
  });

  slide8.addShape(pres.shapes.RECTANGLE, {
    x: 3.55, y: 1.9, w: 2.9, h: 0.12,
    fill: { color: colors.secondaryFill }
  });

  slide8.addText("Economic Diversity", {
    x: 3.65, y: 2.1, w: 2.7, h: 0.4,
    fontSize: 18, bold: true, color: colors.secondaryText,
    fontFace: "Calibri"
  });

  slide8.addText([
    { text: "• Banking & finance", options: { breakLine: true } },
    { text: "• Healthcare & biotech", options: { breakLine: true } },
    { text: "• Technology sector", options: { breakLine: true } },
    { text: "• Energy companies" }
  ], {
    x: 3.65, y: 2.6, w: 2.7, h: 1.5,
    fontSize: 13, color: colors.neutralText,
    fontFace: "Calibri"
  });

  // Column 3: Blue
  slide8.addShape(pres.shapes.RECTANGLE, {
    x: 6.6, y: 1.9, w: 2.9, h: 3.0,
    fill: { color: colors.white },
    line: { color: colors.primaryBorder, width: 1.5 },
    shadow: makeShadow()
  });

  slide8.addShape(pres.shapes.RECTANGLE, {
    x: 6.6, y: 1.9, w: 2.9, h: 0.12,
    fill: { color: colors.primaryFill }
  });

  slide8.addText("Heritage Preserved", {
    x: 6.7, y: 2.1, w: 2.7, h: 0.4,
    fontSize: 18, bold: true, color: colors.primaryText,
    fontFace: "Calibri"
  });

  slide8.addText([
    { text: "• Fourth Ward historic district", options: { breakLine: true } },
    { text: "• Levine Museum of the New South", options: { breakLine: true } },
    { text: "• Original mint building preserved", options: { breakLine: true } },
    { text: "• \"Hornet's Nest\" legacy lives on" }
  ], {
    x: 6.7, y: 2.6, w: 2.7, h: 1.5,
    fontSize: 13, color: colors.neutralText,
    fontFace: "Calibri"
  });

  // Slide 9: Conclusion
  let slide9 = pres.addSlide();
  slide9.background = { color: colors.primaryFill };

  // Decorative top border
  slide9.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.15,
    fill: { color: colors.primaryBorder }
  });

  slide9.addText("The Queen City's Legacy", {
    x: 0.5, y: 1.5, w: 9, h: 0.7,
    fontSize: 42, bold: true, color: colors.primaryText,
    align: "center", fontFace: "Calibri"
  });

  slide9.addShape(pres.shapes.RECTANGLE, {
    x: 2.0, y: 2.5, w: 6.0, h: 0.06,
    fill: { color: colors.accentBorder }
  });

  slide9.addText('From revolutionary roots through gold rush prosperity, industrial dominance, and financial power, Charlotte has evolved into one of America\'s fastest-growing cities. The spirit of independence and innovation that earned it the "Hornet\'s Nest" nickname continues to drive the Queen City forward.', {
    x: 1.5, y: 3.0, w: 7.0, h: 1.5,
    fontSize: 16, color: colors.neutralText,
    align: "center", fontFace: "Calibri"
  });

  // Decorative bottom border
  slide9.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.475, w: 10, h: 0.15,
    fill: { color: colors.primaryBorder }
  });

  const outputPath = "./Charlotte History - GitHub Pastel.pptx";
  await pres.writeFile({ fileName: outputPath });
  console.log("✅ Presentation created: " + outputPath);
}

createPresentation().catch(console.error);
