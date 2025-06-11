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

const StageSchema = new mongoose.Schema(
     {
          minScore: Number,
          targetScore: Number,
          days: [
               {
                    dayNumber: Number,
                    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
                    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
                    _id: mongoose.Schema.Types.ObjectId
               }
          ],
     },
     { timestamps: true }
);

const QuestionModel = mongoose.model('Question', QuestionSchema);
const StageModel = mongoose.model('Stage', StageSchema);

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

async function verifyUpdatedStages() {
     await connectDB();

     try {
          console.log('=== VERIFYING UPDATED STAGES ===');

          // 1. Lấy tất cả câu hỏi
          const questions = await QuestionModel.find().sort({ questionNumber: 1 });
          console.log(`\nTotal questions: ${questions.length}`);

          // Tạo map từ ObjectId sang questionNumber
          const questionMap = {};
          questions.forEach(q => {
               questionMap[q._id.toString()] = {
                    questionNumber: q.questionNumber,
                    type: q.type
               };
          });

          // 2. Lấy tất cả stage
          const stages = await StageModel.find().sort({ minScore: 1 });
          console.log(`Total stages: ${stages.length}\n`);

          // 3. Verify từng stage
          stages.forEach((stage, stageIndex) => {
               console.log(`=== STAGE ${stageIndex + 1} ===`);
               console.log(`MinScore: ${stage.minScore}, TargetScore: ${stage.targetScore}`);
               console.log(`Stage ID: ${stage._id}`);
               console.log(`Days: ${stage.days.length}\n`);

               let totalQuestionsInStage = 0;
               const questionTypesInStage = {};

               stage.days.forEach((day, dayIndex) => {
                    console.log(`  Day ${day.dayNumber}:`);
                    console.log(`    Questions: ${day.questions.length}`);

                    if (day.questions.length > 0) {
                         const dayQuestions = day.questions.map(qId => {
                              const qInfo = questionMap[qId.toString()];
                              if (qInfo) {
                                   // Count question types
                                   if (!questionTypesInStage[qInfo.type]) {
                                        questionTypesInStage[qInfo.type] = 0;
                                   }
                                   questionTypesInStage[qInfo.type]++;
                                   totalQuestionsInStage++;

                                   return `Q${qInfo.questionNumber}(${qInfo.type})`;
                              } else {
                                   return `UNKNOWN_ID(${qId})`;
                              }
                         });

                         console.log(`    Details: ${dayQuestions.join(', ')}`);
                    }
                    console.log('');
               });

               console.log(`  Stage Summary:`);
               console.log(`    Total Questions: ${totalQuestionsInStage}`);
               console.log(`    Question Types:`);
               Object.entries(questionTypesInStage).forEach(([type, count]) => {
                    console.log(`      ${type}: ${count} questions`);
               });
               console.log('\n' + '='.repeat(50) + '\n');
          });

          // 4. Kiểm tra coverage của câu hỏi
          console.log('=== QUESTION COVERAGE ANALYSIS ===');
          const usedQuestions = new Set();
          stages.forEach(stage => {
               stage.days.forEach(day => {
                    day.questions.forEach(qId => {
                         usedQuestions.add(qId.toString());
                    });
               });
          });

          console.log(`Questions used in stages: ${usedQuestions.size}/${questions.length}`);

          const unusedQuestions = questions.filter(q => !usedQuestions.has(q._id.toString()));
          if (unusedQuestions.length > 0) {
               console.log('\nUnused questions:');
               unusedQuestions.forEach(q => {
                    console.log(`  Q${q.questionNumber}: ${q.type} (${q._id})`);
               });
          } else {
               console.log('\n✅ All questions are being used in stages!');
          }

          // 5. Kiểm tra duplicate questions
          const questionUsageCount = {};
          stages.forEach(stage => {
               stage.days.forEach(day => {
                    day.questions.forEach(qId => {
                         const qIdStr = qId.toString();
                         if (!questionUsageCount[qIdStr]) {
                              questionUsageCount[qIdStr] = 0;
                         }
                         questionUsageCount[qIdStr]++;
                    });
               });
          });

          const duplicateQuestions = Object.entries(questionUsageCount)
               .filter(([qId, count]) => count > 1)
               .map(([qId, count]) => {
                    const qInfo = questionMap[qId];
                    return `Q${qInfo.questionNumber}: ${qInfo.type} (used ${count} times)`;
               });

          if (duplicateQuestions.length > 0) {
               console.log('\n⚠️  Duplicate questions found:');
               duplicateQuestions.forEach(q => console.log(`  ${q}`));
          } else {
               console.log('\n✅ No duplicate questions found!');
          }

          console.log('\n=== VERIFICATION COMPLETE ===');

     } catch (error) {
          console.error('Error verifying stages:', error);
     } finally {
          await mongoose.disconnect();
          console.log('MongoDB disconnected.');
     }
}

verifyUpdatedStages(); 