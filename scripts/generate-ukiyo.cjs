const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

async function generateImage() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `Ukiyo-e Japanese woodblock print style illustration of a great wave crashing near a rocky coastline with a small fishing boat, Mount Fuji visible in the far background, bold dark outlines, flat color areas in indigo blue and white with accents of warm ochre and coral, traditional Japanese composition with dramatic perspective, high detail in the wave foam patterns`;

  console.log('Trying gemini-2.5-flash-image...');
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: prompt,
    config: {
      responseModalities: ['Text', 'Image'],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const imageData = part.inlineData.data;
      const outputPath = path.join('/home/runner/workspace/client/public/images/say-what-you-see', 'ukiyo-wave.png');
      fs.writeFileSync(outputPath, Buffer.from(imageData, 'base64'));
      console.log('Image saved to:', outputPath);
      return;
    }
    if (part.text) console.log('Text:', part.text);
  }
  
  console.log('No image in response');
}

generateImage().catch(console.error);
