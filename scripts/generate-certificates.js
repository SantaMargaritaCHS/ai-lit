#!/usr/bin/env node

/**
 * Certificate Generator Script
 * Uses Browserless API to render the ACTUAL certificate HTML template
 * and capture it as PNG images
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get API key from environment
const BROWSERLESS_API_KEY = process.env.BROWSERLESS_API_KEY;

if (!BROWSERLESS_API_KEY) {
  console.error('❌ BROWSERLESS_API_KEY not found. Please set it in environment.');
  console.error('   Run: source /home/runner/workspace/.secrets.local');
  process.exit(1);
}

// Module definitions with made-up student names
const modules = [
  { id: 'what-is-ai', name: 'What Is AI?', student: 'Emma Rodriguez' },
  { id: 'intro-to-gen-ai', name: 'Introduction to Generative AI', student: 'Marcus Chen' },
  { id: 'responsible-ethical-ai', name: 'Responsible & Ethical AI', student: 'Aisha Thompson' },
  { id: 'understanding-llms', name: 'Understanding Large Language Models', student: 'Jordan Williams' },
  { id: 'llm-limitations', name: 'LLM Limitations', student: 'Sofia Patel' },
  { id: 'privacy-data-rights', name: 'Privacy & Data Rights', student: 'Tyler Jackson' },
  { id: 'ai-environmental-impact', name: 'AI Environmental Impact', student: 'Maya Nguyen' },
  { id: 'introduction-to-prompting', name: 'Introduction to Prompting', student: 'Daniel Kim' },
  { id: 'ancient-compass-ai-ethics', name: 'Ancient Compass: AI Ethics', student: 'Olivia Martinez' }
];

// Generate a random verification code (same logic as Certificate.tsx)
function generateVerificationCode() {
  const chars = '0123456789ABCDEF';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}

// Get today's date formatted
function getFormattedDate() {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date().toLocaleDateString('en-US', options);
}

// Generate the EXACT certificate HTML from Certificate.tsx (lines 66-206)
function generateCertificateHTML(module) {
  const verificationCode = generateVerificationCode();
  const completionDate = getFormattedDate();
  const displayName = module.student;
  const courseName = module.name;

  // This is the EXACT template from Certificate.tsx downloadCertificate function
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      width: 800px;
      height: 600px;
    }
  </style>
</head>
<body>
  <div style="
    width: 800px;
    height: 600px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border: 16px solid #2563eb;
    padding: 50px 60px;
    box-sizing: border-box;
    text-align: center;
    font-family: system-ui, -apple-system, sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
  ">
    <!-- Verification Code Badge (Top Right) -->
    <div style="
      position: absolute;
      top: 20px;
      right: 20px;
      background: #1e40af;
      border: 2px solid #3b82f6;
      border-radius: 8px;
      padding: 8px 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    ">
      <div style="
        font-size: 9px;
        color: #93c5fd;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 2px;
      ">Verification Code</div>
      <div style="
        font-family: 'Courier New', monospace;
        font-size: 16px;
        font-weight: bold;
        color: #ffffff;
        letter-spacing: 2px;
      ">${verificationCode}</div>
    </div>

    <div>
      <h1 style="
        font-size: 38px;
        font-weight: bold;
        color: #2563eb;
        margin: 0 0 40px 0;
      ">Certificate of Completion</h1>
    </div>

    <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
      <p style="
        font-size: 16px;
        color: #374151;
        margin: 0 0 20px 0;
      ">This certifies that</p>

      <h2 style="
        font-size: 32px;
        font-weight: bold;
        color: #2563eb;
        margin: 0 0 20px 0;
      ">${displayName}</h2>

      <p style="
        font-size: 16px;
        color: #374151;
        margin: 0 0 20px 0;
      ">has successfully completed the</p>

      <h3 style="
        font-size: 24px;
        font-weight: bold;
        color: #2563eb;
        margin: 0 0 15px 0;
      ">${courseName}</h3>

      <p style="
        font-size: 16px;
        color: #374151;
        margin: 0;
      ">learning activity</p>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: flex-end;">
      <!-- Left: Date and Seal -->
      <div style="display: flex; flex-direction: column; align-items: flex-start; flex: 1;">
        <p style="
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 10px 0;
        ">Completed on ${completionDate}</p>

        <div style="
          width: 50px;
          height: 50px;
          background: #fbbf24;
          border: 3px solid #f59e0b;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#b45309" stroke="none">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
        </div>
      </div>

      <!-- Right: Verification Info -->
      <div style="
        text-align: right;
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.7);
        border-left: 3px solid #3b82f6;
        border-radius: 4px;
      ">
        <p style="
          font-size: 10px;
          color: #6b7280;
          margin: 0 0 4px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        ">Certificate ID</p>
        <p style="
          font-family: 'Courier New', monospace;
          font-size: 14px;
          font-weight: bold;
          color: #1e40af;
          margin: 0;
          letter-spacing: 1px;
        ">${verificationCode}</p>
        <p style="
          font-size: 9px;
          color: #9ca3af;
          margin: 4px 0 0 0;
        ">Unique certificate identifier</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

// Use Browserless API to render HTML to PNG
async function renderHTMLToPNG(html) {
  const response = await fetch(`https://chrome.browserless.io/screenshot?token=${BROWSERLESS_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      html: html,
      options: {
        type: 'png',
        fullPage: false,
        clip: {
          x: 0,
          y: 0,
          width: 800,
          height: 600
        }
      },
      viewport: {
        width: 800,
        height: 600
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Browserless API error: ${response.status} - ${errorText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function generateCertificates() {
  const outputDir = path.join(__dirname, '..', 'Images for Claude ultrathink');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🚀 Starting certificate generation using Browserless API...\n');

  for (const module of modules) {
    console.log(`📜 Generating certificate for: ${module.name}`);

    try {
      const html = generateCertificateHTML(module);
      const pngBuffer = await renderHTMLToPNG(html);

      const filename = `Certificate-${module.id}.png`;
      const filepath = path.join(outputDir, filename);

      fs.writeFileSync(filepath, pngBuffer);

      console.log(`   ✅ Saved: ${filename}`);
      console.log(`   👤 Student: ${module.student}\n`);
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}\n`);
    }
  }

  console.log('🎉 Certificate generation complete!');
  console.log(`📁 Output directory: ${outputDir}`);
}

// Run the generator
generateCertificates().catch(console.error);
