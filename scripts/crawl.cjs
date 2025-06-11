const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Base URL of the page to crawl
const url = 'https://www.examenglish.com/TOEIC/TOEIC_listening_part1.htm';

// Output directory for downloaded files
const outputDir = './toeic_resources';
if (!fs.existsSync(outputDir)) {
     fs.mkdirSync(outputDir);
}

// Function to download a file from a URL
async function downloadFile(url, outputPath) {
     try {
          const response = await axios({
               url,
               method: 'GET',
               responseType: 'stream',
          });
          const writer = fs.createWriteStream(outputPath);
          response.data.pipe(writer);
          return new Promise((resolve, reject) => {
               writer.on('finish', resolve);
               writer.on('error', reject);
          });
     } catch (error) {
          console.error(`Error downloading ${url}:`, error.message);
     }
}

(async () => {
     // Launch Puppeteer browser
     const browser = await puppeteer.launch({ headless: true });
     const page = await browser.newPage();

     try {
          // Navigate to the page
          await page.goto(url, { waitUntil: 'networkidle2' });

          // Extract resources
          const resources = await page.evaluate(() => {
               const results = [];

               // Select all question containers (adjust selector based on page structure)
               const questionElements = document.querySelectorAll('.question'); // Hypothetical selector

               questionElements.forEach((element, index) => {
                    const questionData = {};

                    // Extract image
                    const imgElement = element.querySelector('img');
                    questionData.imageUrl = imgElement ? imgElement.src : null;

                    // Extract audio
                    const audioElement = element.querySelector('audio source');
                    questionData.audioUrl = audioElement ? audioElement.src : null;

                    // Extract text (instructions or answer choices)
                    const textElements = element.querySelectorAll('p, .answer-option, .instructions');
                    questionData.text = Array.from(textElements)
                         .map(el => el.innerText.trim())
                         .filter(text => text.length > 0)
                         .join('\n');

                    results.push(questionData);
               });

               return results;
          });

          // Download and save resources
          for (let i = 0; i < resources.length; i++) {
               const resource = resources[i];
               const questionDir = path.join(outputDir, `question_${i + 1}`);
               if (!fs.existsSync(questionDir)) {
                    fs.mkdirSync(questionDir);
               }

               // Save text
               if (resource.text) {
                    fs.writeFileSync(
                         path.join(questionDir, 'text.txt'),
                         resource.text,
                         'utf8'
                    );
                    console.log(`Saved text for question ${i + 1}`);
               }

               // Download image
               if (resource.imageUrl) {
                    const imageExt = path.extname(new URL(resource.imageUrl).pathname) || '.jpg';
                    const imagePath = path.join(questionDir, `image${imageExt}`);
                    await downloadFile(resource.imageUrl, imagePath);
                    console.log(`Downloaded image for question ${i + 1}`);
               }

               // Download audio
               if (resource.audioUrl) {
                    const audioExt = path.extname(new URL(resource.audioUrl).pathname) || '.mp3';
                    const audioPath = path.join(questionDir, `audio${audioExt}`);
                    await downloadFile(resource.audioUrl, audioPath);
                    console.log(`Downloaded audio for question ${i + 1}`);
               }
          }

          console.log('Crawling completed! Resources saved in:', outputDir);
     } catch (error) {
          console.error('Error during crawling:', error.message);
     } finally {
          await browser.close();
     }
})();