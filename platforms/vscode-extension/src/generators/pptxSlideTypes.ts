/**
 * PPTX Slide Type Builders
 *
 * Extracted from pptxGenerator.ts for maintainability.
 * Contains individual slide type rendering functions.
 */

import pptxgen from "pptxgenjs";
import * as fs from "fs-extra";
import * as path from "path";
import {
  getIcon,
  getStockIllustration,
  svgToDataUri,
} from "./illustrationIcons";
import {
  fileToBase64DataUri,
} from "../services/logoService";
import {
  getIconifyUrl,
  getDiceBearUrl,
  parseIconifyValue,
} from "../services/illustrationService";
import type {
  SlideContent,
  ChartData,
  TableData,
  ImageData,
  IllustrationSlideData,
  TwoColumnData,
} from "./pptxGenerator";
import { ALEX_COLORS, CHART_COLORS, FONT } from "./pptxGenerator";

export function addTitleSlide(pres: pptxgen, content: SlideContent): void {
  const slide = pres.addSlide({ masterName: "ALEX_TITLE" });

  // Main title
  slide.addText(content.title || "Untitled Presentation", {
    x: 0.5,
    y: 1.2,
    w: 9,
    h: 1.2,
    fontSize: 40,
    fontFace: FONT.heading,
    bold: true,
    color: ALEX_COLORS.blue.text,
    align: "center",
    valign: "bottom",
  });

  // Centered accent underline
  slide.addText("", {
    x: 4.0,
    y: 2.5,
    w: 2.0,
    h: 0.035,
    fill: { color: ALEX_COLORS.gold.border },
  });

  // Subtitle
  if (content.subtitle) {
    slide.addText(content.subtitle, {
      x: 0.5,
      y: 2.75,
      w: 9,
      h: 0.6,
      fontSize: 20,
      fontFace: FONT.body,
      color: "57606a",
      align: "center",
    });
  }

  // Speaker notes
  if (content.notes) {
    slide.addNotes(content.notes);
  }
}

export function addContentSlide(pres: pptxgen, content: SlideContent): void {
  const slide = pres.addSlide({ masterName: "ALEX_CONTENT" });
  const hasTitle = !!content.title;

  // Title
  if (hasTitle) {
    slide.addText(content.title!, {
      x: 0.6,
      y: 0.2,
      w: 8.8,
      h: 0.55,
      fontSize: 26,
      fontFace: FONT.heading,
      bold: true,
      color: ALEX_COLORS.blue.text,
    });
    // Accent underline
    slide.addText("", {
      x: 0.6,
      y: 0.8,
      w: 1.5,
      h: 0.025,
      fill: { color: ALEX_COLORS.blue.border },
    });
  }

  // Bullets as paragraph group
  if (content.bullets && content.bullets.length > 0) {
    const yStart = hasTitle ? 1.05 : 0.25;
    slide.addText(
      content.bullets.map((bullet) => ({
        text: bullet,
        options: {
          fontSize: 18,
          fontFace: FONT.body,
          color: ALEX_COLORS.gray.text,
          bullet: { type: "bullet" as const },
          paraSpaceBefore: 4,
          paraSpaceAfter: 6,
        },
      })),
      { x: 0.8, y: yStart, w: 8.4, h: 5.1 - yStart, valign: "top" },
    );
  }

  // Speaker notes
  if (content.notes) {
    slide.addNotes(content.notes);
  }
}

export function addSectionSlide(pres: pptxgen, content: SlideContent): void {
  const slide = pres.addSlide({ masterName: "ALEX_SECTION" });

  // Section title
  slide.addText(content.title || "Section", {
    x: 0.8,
    y: 1.6,
    w: 6.5,
    h: 1.0,
    fontSize: 38,
    fontFace: FONT.heading,
    bold: true,
    color: "FFFFFF",
    align: "left",
    valign: "bottom",
  });

  // Subtitle
  if (content.subtitle) {
    slide.addText(content.subtitle, {
      x: 0.8,
      y: 3.8,
      w: 6.5,
      h: 0.5,
      fontSize: 18,
      fontFace: FONT.body,
      color: "c0d0e8",
      align: "left",
    });
  }
}

export function addChartSlide(pres: pptxgen, content: SlideContent): void {
  const slide = pres.addSlide({ masterName: "ALEX_CHART" });
  const chartData = content.data as ChartData;

  // Title
  if (content.title) {
    slide.addText(content.title, {
      x: 0.6,
      y: 0.2,
      w: 8.8,
      h: 0.55,
      fontSize: 24,
      fontFace: FONT.heading,
      bold: true,
      color: ALEX_COLORS.blue.text,
    });
  }

  if (!chartData || !chartData.series) {
    return;
  }

  // Map chart type
  const chartTypeMap: Record<string, pptxgen.CHART_NAME> = {
    bar: pres.ChartType.bar,
    line: pres.ChartType.line,
    pie: pres.ChartType.pie,
    doughnut: pres.ChartType.doughnut,
    area: pres.ChartType.area,
    scatter: pres.ChartType.scatter,
  };

  const chartType = chartTypeMap[chartData.chartType] || pres.ChartType.bar;

  slide.addChart(chartType, chartData.series, {
    x: 0.5,
    y: 1.0,
    w: 9,
    h: 4.0,
    chartColors: CHART_COLORS,
    showTitle: !!chartData.title,
    title: chartData.title,
    showValue: chartData.chartType !== "pie",
    showPercent:
      chartData.chartType === "pie" || chartData.chartType === "doughnut",
    showLegend: chartData.series.length > 1,
    legendPos: "b",
  });

  if (content.notes) {
    slide.addNotes(content.notes);
  }
}

export function addTableSlide(pres: pptxgen, content: SlideContent): void {
  const slide = pres.addSlide({ masterName: "ALEX_CONTENT" });
  const tableData = content.data as TableData;

  // Title
  if (content.title) {
    slide.addText(content.title, {
      x: 0.6,
      y: 0.2,
      w: 8.8,
      h: 0.55,
      fontSize: 24,
      fontFace: FONT.heading,
      bold: true,
      color: ALEX_COLORS.blue.text,
    });
  }

  if (!tableData || !tableData.headers || !tableData.rows) {
    return;
  }

  // Build table rows
  const rows: pptxgen.TableRow[] = [];

  // Header row
  rows.push(
    tableData.headers.map((h) => ({
      text: h,
      options: {
        bold: true,
        fill: { color: ALEX_COLORS.blue.text },
        color: "FFFFFF",
        fontSize: 13,
        fontFace: FONT.body,
      },
    })),
  );

  // Data rows with zebra striping
  tableData.rows.forEach((row, rowIdx) => {
    const isLastRow = rowIdx === tableData.rows.length - 1;
    const shouldHighlight = isLastRow && tableData.highlightLastRow;
    const zebraColor = rowIdx % 2 === 0 ? "FFFFFF" : "f6f8fa";

    rows.push(
      row.map((cell) => ({
        text: cell,
        options: {
          fill: { color: shouldHighlight ? ALEX_COLORS.gray.fill : zebraColor },
          bold: shouldHighlight,
          fontSize: 12,
          color: ALEX_COLORS.gray.text,
        },
      })),
    );
  });

  // Calculate column widths
  const colCount = tableData.headers.length;
  const tableWidth = 9;
  const colW = Array(colCount).fill(tableWidth / colCount);

  slide.addTable(rows, {
    x: 0.5,
    y: 1.0,
    w: tableWidth,
    colW,
    border: { type: "solid", pt: 0.5, color: ALEX_COLORS.gray.border },
    fontFace: FONT.body,
    autoPage: true,
    autoPageRepeatHeader: true,
  });

  if (content.notes) {
    slide.addNotes(content.notes);
  }
}

export function addImageSlide(pres: pptxgen, content: SlideContent): void {
  const slide = pres.addSlide({ masterName: "ALEX_CONTENT" });
  const imageData = content.data as ImageData;

  // Title
  if (content.title) {
    slide.addText(content.title, {
      x: 0.6,
      y: 0.2,
      w: 8.8,
      h: 0.55,
      fontSize: 24,
      fontFace: FONT.heading,
      bold: true,
      color: ALEX_COLORS.blue.text,
    });
  }

  if (!imageData) {
    return;
  }

  const imgOpts: pptxgen.ImageProps = {
    x: 1,
    y: 1.0,
    w: imageData.width || 8,
    h: imageData.height || 3.8,
  };

  if (imageData.base64) {
    imgOpts.data = imageData.base64;
  } else if (imageData.path) {
    imgOpts.path = imageData.path;
  }

  slide.addImage(imgOpts);

  // Caption
  if (imageData.caption) {
    slide.addText(imageData.caption, {
      x: 0.5,
      y: 5.0,
      w: 9,
      h: 0.3,
      fontSize: 10,
      fontFace: FONT.body,
      italic: true,
      color: "57606a",
      align: "center",
    });
  }

  if (content.notes) {
    slide.addNotes(content.notes);
  }
}

/**
 * Add an illustration slide (icon, stock, SVG, or image)
 */
export function addIllustrationSlide(
  pres: pptxgen,
  content: SlideContent,
  workspacePath?: string,
): void {
  const slide = pres.addSlide({ masterName: "ALEX_CONTENT" });
  const illustrationData = content.data as IllustrationSlideData;

  // Title
  if (content.title) {
    slide.addText(content.title, {
      x: 0.6,
      y: 0.2,
      w: 8.8,
      h: 0.55,
      fontSize: 24,
      fontFace: FONT.heading,
      bold: true,
      color: ALEX_COLORS.blue.text,
    });
  }

  if (!illustrationData?.illustration) {
    return;
  }

  const illustration = illustrationData.illustration;
  const imgOpts: pptxgen.ImageProps = {
    x:
      illustration.position === "left"
        ? 0.5
        : illustration.position === "right"
          ? 6.5
          : 2.5,
    y: 1.0,
    w: illustration.width || 5,
    h: illustration.height || 3.5,
  };

  // Resolve illustration to image data
  let resolvedImageData: string | undefined;

  switch (illustration.type) {
    case "icon":
      const iconSvg = getIcon(illustration.value);
      if (iconSvg) {
        resolvedImageData = svgToDataUri(iconSvg, illustration.color);
      }
      break;

    case "iconify":
      // Iconify API icons (150K+ icons from 100+ sets)
      // Format: prefix/name (e.g., mdi/chart-bar, heroicons/users)
      const iconifyParsed = parseIconifyValue(illustration.value);
      if (iconifyParsed) {
        const [prefix, name] = iconifyParsed;
        const iconifyUrl = getIconifyUrl(prefix, name, {
          color: illustration.color,
          width: 256,
          height: 256,
        });
        imgOpts.path = iconifyUrl;
      }
      break;

    case "avatar":
      // DiceBear generative avatars
      // Format: seed or seed with style in color field
      const avatarStyle = illustration.color || "open-peeps";
      const avatarUrl = getDiceBearUrl(illustration.value, avatarStyle, {
        size: 256,
      });
      imgOpts.path = avatarUrl;
      break;

    case "stock":
      const stockSvg = getStockIllustration(illustration.value);
      if (stockSvg) {
        resolvedImageData = svgToDataUri(stockSvg);
      }
      break;

    case "svg":
      // User-provided SVG file (explicit path)
      let svgPath = illustration.value;
      if (!path.isAbsolute(svgPath) && workspacePath) {
        svgPath = path.join(workspacePath, svgPath);
      }
      if (fs.existsSync(svgPath)) {
        const fileContent = fs.readFileSync(svgPath, "utf8");
        resolvedImageData = svgToDataUri(fileContent);
      }
      break;

    case "image":
      // Local image file (PNG, JPG, etc.) - explicit path only
      if (workspacePath) {
        let imgPath = illustration.value;
        if (!path.isAbsolute(imgPath)) {
          imgPath = path.join(workspacePath, imgPath);
        }
        if (fs.existsSync(imgPath)) {
          resolvedImageData = fileToBase64DataUri(imgPath) || undefined;
        }
      }
      break;

    case "mermaid":
      // Mermaid needs external conversion - placeholder for now
      // TODO: Integrate with mermaid-cli or renderMermaidDiagram tool
      break;
  }

  // Add image if we have data or URL
  if (resolvedImageData) {
    imgOpts.data = resolvedImageData;
    slide.addImage(imgOpts);
  } else if (imgOpts.path) {
    slide.addImage(imgOpts);
  }

  // Description below illustration
  if (illustrationData.description) {
    slide.addText(illustrationData.description, {
      x: 0.5,
      y: 4.5,
      w: 9,
      h: 0.6,
      fontSize: 14,
      fontFace: FONT.body,
      color: ALEX_COLORS.gray.text,
      align: "center",
    });
  }

  // Caption
  if (illustration.caption) {
    slide.addText(illustration.caption, {
      x: 0.5,
      y: 5.1,
      w: 9,
      h: 0.3,
      fontSize: 10,
      fontFace: FONT.body,
      italic: true,
      color: "57606a",
      align: "center",
    });
  }

  if (content.notes) {
    slide.addNotes(content.notes);
  }
}

export function addTwoColumnSlide(pres: pptxgen, content: SlideContent): void {
  const slide = pres.addSlide({ masterName: "ALEX_CONTENT" });
  const colData = content.data as TwoColumnData;

  // Main title
  if (content.title) {
    slide.addText(content.title, {
      x: 0.6,
      y: 0.2,
      w: 8.8,
      h: 0.55,
      fontSize: 24,
      fontFace: FONT.heading,
      bold: true,
      color: ALEX_COLORS.blue.text,
    });
  }

  if (!colData) {
    return;
  }

  // Left column
  if (colData.left) {
    if (colData.left.title) {
      slide.addText(colData.left.title, {
        x: 0.5,
        y: 1.0,
        w: 4.3,
        h: 0.4,
        fontSize: 16,
        fontFace: FONT.heading,
        bold: true,
        color: ALEX_COLORS.blue.text,
      });
    }
    if (colData.left.bullets && colData.left.bullets.length > 0) {
      slide.addText(
        colData.left.bullets.map((bullet) => ({
          text: bullet,
          options: {
            fontSize: 14,
            fontFace: FONT.body,
            color: ALEX_COLORS.gray.text,
            bullet: { type: "bullet" as const },
            paraSpaceBefore: 2,
            paraSpaceAfter: 4,
          },
        })),
        { x: 0.6, y: 1.5, w: 4.1, h: 3.5, valign: "top" },
      );
    }
  }

  // Column divider
  slide.addText("", {
    x: 4.95,
    y: 1.0,
    w: 0.01,
    h: 4.0,
    fill: { color: ALEX_COLORS.gray.border },
  });

  // Right column
  if (colData.right) {
    if (colData.right.title) {
      slide.addText(colData.right.title, {
        x: 5.2,
        y: 1.0,
        w: 4.3,
        h: 0.4,
        fontSize: 16,
        fontFace: FONT.heading,
        bold: true,
        color: ALEX_COLORS.green.text,
      });
    }
    if (colData.right.bullets && colData.right.bullets.length > 0) {
      slide.addText(
        colData.right.bullets.map((bullet) => ({
          text: bullet,
          options: {
            fontSize: 14,
            fontFace: FONT.body,
            color: ALEX_COLORS.gray.text,
            bullet: { type: "bullet" as const },
            paraSpaceBefore: 2,
            paraSpaceAfter: 4,
          },
        })),
        { x: 5.3, y: 1.5, w: 4.1, h: 3.5, valign: "top" },
      );
    }
  }

  if (content.notes) {
    slide.addNotes(content.notes);
  }
}
