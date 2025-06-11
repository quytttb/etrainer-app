const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://touyen:touyen@danentang.ilfodv9.mongodb.net/etrainer';

const QuestionSchema = new mongoose.Schema(
     {
          questionNumber: { type: Number, required: true, unique: true },
          type: { type: String, required: true },
          question: { type: String, sparse: true },
          audio: {
               name: String,
               url: String,
          },
          imageUrl: String,
          answers: Array,
          questions: Array,
          subtitle: String,
          explanation: String,
     },
     { timestamps: true }
);

const QuestionModel = mongoose.model('Question', QuestionSchema);

async function connectDB() {
     if (mongoose.connection.readyState >= 1) {
          return;
     }
     try {
          await mongoose.connect(MONGODB_URI);
          console.log('MongoDB connected successfully.');
     } catch (error) {
          console.error('MongoDB connection error:', error);
          process.exit(1);
     }
}

async function checkAudio() {
     await connectDB();

     try {
          console.log('=== CHECKING AUDIO IN QUESTIONS ===\n');

          const questions = await QuestionModel.find().sort({ questionNumber: 1 });
          console.log(`Total questions: ${questions.length}\n`);

          const questionsWithAudio = questions.filter(q => q.audio && q.audio.url);
          console.log(`Questions with audio: ${questionsWithAudio.length}\n`);

          console.log('=== AUDIO DETAILS ===');
          questionsWithAudio.forEach(q => {
               console.log(`Q${q.questionNumber} (${q.type}):`);
               console.log(`  Audio name: ${q.audio.name}`);
               console.log(`  Audio URL: ${q.audio.url}`);
               console.log(`  ID: ${q._id}`);
               console.log('');
          });

          // Group by audio URL to see which ones are using the same URL
          const audioUrls = {};
          questionsWithAudio.forEach(q => {
               const url = q.audio.url;
               if (!audioUrls[url]) {
                    audioUrls[url] = [];
               }
               audioUrls[url].push(`Q${q.questionNumber}(${q.type})`);
          });

          console.log('=== AUDIO URL USAGE ===');
          Object.entries(audioUrls).forEach(([url, questions]) => {
               console.log(`URL: ${url}`);
               console.log(`Used by: ${questions.join(', ')}`);
               console.log(`Count: ${questions.length} questions\n`);
          });

     } catch (error) {
          console.error('Error checking audio:', error);
     } finally {
          await mongoose.disconnect();
          console.log('MongoDB disconnected.');
     }
}

checkAudio(); 