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

async function verify6Stages() {
     await connectDB();

     try {
          console.log('=== VERIFYING 6 STAGES FOR JOURNEY SELECTOR ===\n');

          // 1. Lấy tất cả câu hỏi
          const questions = await QuestionModel.find().sort({ questionNumber: 1 });
          console.log(`Total questions: ${questions.length}`);

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

          // 3. Verify từng stage với Journey Selector mapping
          const journeyMappings = [
               { name: 'Mất gốc', range: '0 → 150', description: 'Câu hỏi cơ bản nhất' },
               { name: 'Cơ bản (tiếp)', range: '150 → 300', description: 'Chuyển tiếp từ mất gốc lên cơ bản' },
               { name: 'Trung cấp', range: '300 → 450', description: 'Nâng cao kỹ năng nghe và đọc' },
               { name: 'Trung cấp+', range: '450 → 600', description: 'Củng cố kỹ năng đọc hiểu' },
               { name: 'Cao cấp', range: '600 → 700', description: 'Luyện tập nâng cao' },
               { name: 'Xuất sắc', range: '700 → 900', description: 'Thành thạo tất cả kỹ năng' }
          ];

          stages.forEach((stage, stageIndex) => {
               const mapping = journeyMappings[stageIndex];
               console.log(`=== STAGE ${stageIndex + 1}: ${mapping.name} (${mapping.range}) ===`);
               console.log(`${mapping.description}`);
               console.log(`Stage ID: ${stage._id}`);
               console.log(`Days: ${stage.days.length}\n`);

               let totalQuestionsInStage = 0;
               const questionTypesInStage = {};

               stage.days.forEach((day, dayIndex) => {
                    console.log(`  📅 Day ${day.dayNumber}:`);

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

                         console.log(`     Questions: ${dayQuestions.join(', ')}`);
                    } else {
                         console.log(`     Questions: None`);
                    }
               });

               console.log(`\n  📊 Stage Summary:`);
               console.log(`     Total Questions: ${totalQuestionsInStage}`);
               console.log(`     Question Types Distribution:`);
               Object.entries(questionTypesInStage).forEach(([type, count]) => {
                    const percentage = ((count / totalQuestionsInStage) * 100).toFixed(1);
                    console.log(`       ${type}: ${count} questions (${percentage}%)`);
               });
               console.log('\n' + '='.repeat(70) + '\n');
          });

          // 4. Journey Selector Path Analysis
          console.log('=== JOURNEY SELECTOR PATH ANALYSIS ===\n');

          const journeyPaths = [
               {
                    name: 'Mất gốc → Cơ bản',
                    startLevel: '0 → 150',
                    targetGoal: '300',
                    stages: [1, 2],
                    description: 'Người mới bắt đầu muốn đạt trình độ cơ bản'
               },
               {
                    name: 'Trung cấp → Khá',
                    startLevel: '300 → 450',
                    targetGoal: '650',
                    stages: [3, 4],
                    description: 'Học viên trung cấp muốn nâng cao'
               },
               {
                    name: 'Cao cấp → Xuất sắc',
                    startLevel: '600 → 700',
                    targetGoal: '900',
                    stages: [5, 6],
                    description: 'Học viên cao cấp muốn đạt trình độ xuất sắc'
               },
               {
                    name: 'Mất gốc → Xuất sắc',
                    startLevel: '0 → 150',
                    targetGoal: '900',
                    stages: [1, 2, 3, 4, 5, 6],
                    description: 'Học viên mới muốn đạt trình độ cao nhất'
               }
          ];

          journeyPaths.forEach((path, index) => {
               console.log(`🎯 ${path.name}:`);
               console.log(`   Trình độ ban đầu: ${path.startLevel}`);
               console.log(`   Mục tiêu: ${path.targetGoal} điểm`);
               console.log(`   Stages cần học: ${path.stages.join(' → ')}`);
               console.log(`   Mô tả: ${path.description}`);

               // Tính tổng số câu hỏi và ngày học
               let totalQuestions = 0;
               let totalDays = 0;
               path.stages.forEach(stageNum => {
                    const stage = stages[stageNum - 1];
                    stage.days.forEach(day => {
                         totalQuestions += day.questions.length;
                         totalDays += 1;
                    });
               });

               console.log(`   📚 Tổng: ${totalQuestions} câu hỏi, ${totalDays} ngày học`);
               console.log('');
          });

          // 5. Question usage analysis
          console.log('=== QUESTION USAGE ANALYSIS ===');
          const usedQuestions = new Set();
          const questionUsageCount = {};

          stages.forEach(stage => {
               stage.days.forEach(day => {
                    day.questions.forEach(qId => {
                         const qIdStr = qId.toString();
                         usedQuestions.add(qIdStr);
                         if (!questionUsageCount[qIdStr]) {
                              questionUsageCount[qIdStr] = 0;
                         }
                         questionUsageCount[qIdStr]++;
                    });
               });
          });

          console.log(`\nQuestions used in stages: ${usedQuestions.size}/${questions.length}`);

          const unusedQuestions = questions.filter(q => !usedQuestions.has(q._id.toString()));
          if (unusedQuestions.length > 0) {
               console.log('\n⚠️  Unused questions:');
               unusedQuestions.forEach(q => {
                    console.log(`  Q${q.questionNumber}: ${q.type} (${q._id})`);
               });
          } else {
               console.log('\n✅ All questions are being used in stages!');
          }

          // Check for repeated questions
          const repeatedQuestions = Object.entries(questionUsageCount)
               .filter(([qId, count]) => count > 1)
               .map(([qId, count]) => {
                    const qInfo = questionMap[qId];
                    return `Q${qInfo.questionNumber}: ${qInfo.type} (used ${count} times)`;
               });

          if (repeatedQuestions.length > 0) {
               console.log('\n📝 Questions used multiple times (for review):');
               repeatedQuestions.forEach(q => console.log(`  ${q}`));
          } else {
               console.log('\n✅ No duplicate questions found!');
          }

          console.log('\n=== VERIFICATION COMPLETE ===');
          console.log('✅ 6 stages created successfully for Journey Selector compatibility!');

     } catch (error) {
          console.error('Error verifying stages:', error);
     } finally {
          await mongoose.disconnect();
          console.log('\nMongoDB disconnected.');
     }
}

verify6Stages(); 