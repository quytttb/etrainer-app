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

async function deleteStageFinalTestQuestions() {
     await connectDB();

     try {
          // Tìm và hiển thị các câu hỏi STAGE_FINAL_TEST trước khi xóa
          const stageFinalTestQuestions = await QuestionModel.find({ type: 'STAGE_FINAL_TEST' });

          console.log(`Found ${stageFinalTestQuestions.length} STAGE_FINAL_TEST questions:`);
          stageFinalTestQuestions.forEach(q => {
               console.log(`- Question ${q.questionNumber}: ${q.type}`);
          });

          if (stageFinalTestQuestions.length > 0) {
               // Xóa các câu hỏi STAGE_FINAL_TEST
               const deleteResult = await QuestionModel.deleteMany({ type: 'STAGE_FINAL_TEST' });
               console.log(`\nDeleted ${deleteResult.deletedCount} STAGE_FINAL_TEST questions successfully.`);

               // Hiển thị tổng số câu hỏi còn lại
               const remainingCount = await QuestionModel.countDocuments();
               console.log(`Total remaining questions: ${remainingCount}`);

               // Hiển thị breakdown theo type
               const typeBreakdown = await QuestionModel.aggregate([
                    { $group: { _id: '$type', count: { $sum: 1 } } },
                    { $sort: { _id: 1 } }
               ]);

               console.log('\nRemaining questions by type:');
               typeBreakdown.forEach(item => {
                    console.log(`${item._id}: ${item.count} questions`);
               });
          } else {
               console.log('No STAGE_FINAL_TEST questions found to delete.');
          }

     } catch (error) {
          console.error('Error deleting STAGE_FINAL_TEST questions:', error);
     } finally {
          await mongoose.disconnect();
          console.log('MongoDB disconnected.');
     }
}

deleteStageFinalTestQuestions(); 