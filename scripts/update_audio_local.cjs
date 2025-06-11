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

async function updateAudioUrls() {
     await connectDB();

     try {
          console.log('=== UPDATING AUDIO URLs ===\n');

          // Tìm tất cả câu hỏi có audio
          const questionsWithAudio = await QuestionModel.find({
               'audio.url': { $exists: true, $ne: null }
          }).sort({ questionNumber: 1 });

          console.log(`Found ${questionsWithAudio.length} questions with audio\n`);

          // URL audio mới - sử dụng file local trong assets
          const newAudioUrl = '/assets/cinematic-rythmline-152267.mp3';

          // Hoặc có thể sử dụng URL public khác
          // const newAudioUrl = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3';

          console.log(`New audio URL: ${newAudioUrl}\n`);

          // Cập nhật từng câu hỏi
          for (let i = 0; i < questionsWithAudio.length; i++) {
               const question = questionsWithAudio[i];
               const oldUrl = question.audio.url;

               // Cập nhật URL mới
               question.audio.url = newAudioUrl;

               // Cập nhật name file tương ứng với loại câu hỏi
               let newAudioName;
               switch (question.type) {
                    case 'IMAGE_DESCRIPTION':
                         newAudioName = `image_description_${question.questionNumber - 14}.mp3`;
                         break;
                    case 'ASK_AND_ANSWER':
                         newAudioName = `question_response_${question.questionNumber - 17}.mp3`;
                         break;
                    case 'CONVERSATION_PIECE':
                         newAudioName = `conversation_${question.questionNumber - 20}.mp3`;
                         break;
                    case 'SHORT_TALK':
                         newAudioName = `short_talk_${question.questionNumber - 23}.mp3`;
                         break;
                    default:
                         newAudioName = `audio_${question.questionNumber}.mp3`;
               }

               question.audio.name = newAudioName;

               // Lưu cập nhật
               await question.save();

               console.log(`✅ Updated Q${question.questionNumber} (${question.type}):`);
               console.log(`   Old URL: ${oldUrl}`);
               console.log(`   New URL: ${newAudioUrl}`);
               console.log(`   New Name: ${newAudioName}\n`);
          }

          console.log('=== UPDATE SUMMARY ===');
          console.log(`✅ Successfully updated ${questionsWithAudio.length} questions`);
          console.log(`🎵 All questions now use: ${newAudioUrl}`);

          // Verify cập nhật
          console.log('\n=== VERIFICATION ===');
          const updatedQuestions = await QuestionModel.find({
               'audio.url': newAudioUrl
          }).sort({ questionNumber: 1 });

          console.log(`Verified: ${updatedQuestions.length} questions now have the new audio URL`);

          updatedQuestions.forEach(q => {
               console.log(`  Q${q.questionNumber} (${q.type}): ${q.audio.name} -> ${q.audio.url}`);
          });

     } catch (error) {
          console.error('Error updating audio URLs:', error);
     } finally {
          await mongoose.disconnect();
          console.log('\nMongoDB disconnected.');
     }
}

updateAudioUrls(); 