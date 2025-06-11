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

async function analyzeAndUpdateStages() {
     await connectDB();

     try {
          // 1. Lấy tất cả câu hỏi hiện tại
          console.log('=== ANALYZING CURRENT QUESTIONS ===');
          const questions = await QuestionModel.find().sort({ questionNumber: 1 });
          console.log(`Total questions in database: ${questions.length}`);

          console.log('\nQuestions by type:');
          const questionsByType = {};
          questions.forEach(q => {
               if (!questionsByType[q.type]) {
                    questionsByType[q.type] = [];
               }
               questionsByType[q.type].push({
                    id: q._id,
                    questionNumber: q.questionNumber,
                    hasAudio: !!q.audio?.url,
                    hasImage: !!q.imageUrl,
                    hasSubQuestions: q.questions && q.questions.length > 0
               });
          });

          Object.entries(questionsByType).forEach(([type, qs]) => {
               console.log(`\n${type}: ${qs.length} questions`);
               qs.forEach(q => {
                    const features = [];
                    if (q.hasAudio) features.push('Audio');
                    if (q.hasImage) features.push('Image');
                    if (q.hasSubQuestions) features.push('SubQuestions');
                    console.log(`  - Q${q.questionNumber}: ${q.id} ${features.length > 0 ? `[${features.join(', ')}]` : ''}`);
               });
          });

          // 2. Lấy tất cả stage hiện tại
          console.log('\n=== ANALYZING CURRENT STAGES ===');
          const stages = await StageModel.find();
          console.log(`Total stages in database: ${stages.length}`);

          for (let i = 0; i < stages.length; i++) {
               const stage = stages[i];
               console.log(`\nStage ${i + 1} (${stage._id}):`);
               console.log(`  MinScore: ${stage.minScore}, TargetScore: ${stage.targetScore}`);
               console.log(`  Days: ${stage.days.length}`);

               for (let j = 0; j < stage.days.length; j++) {
                    const day = stage.days[j];
                    console.log(`    Day ${day.dayNumber}: ${day.questions.length} questions`);
                    console.log(`      Questions: ${day.questions.map(q => q.toString()).join(', ')}`);
               }
          }

          // 3. Đề xuất cập nhật stages
          console.log('\n=== PROPOSED STAGE UPDATES ===');

          // Chia câu hỏi theo độ khó và loại
          const beginnerQuestions = [
               ...questionsByType.FILL_IN_THE_BLANK_QUESTION || [],
               ...questionsByType.IMAGE_DESCRIPTION || [],
               ...questionsByType.ASK_AND_ANSWER || []
          ].map(q => q.id);

          const intermediateQuestions = [
               ...questionsByType.CONVERSATION_PIECE || [],
               ...questionsByType.SHORT_TALK || [],
               ...questionsByType.FILL_IN_THE_PARAGRAPH || []
          ].map(q => q.id);

          const advancedQuestions = [
               ...questionsByType.READ_AND_UNDERSTAND || []
          ].map(q => q.id);

          // Gợi ý cấu trúc stage mới
          const proposedStages = [
               {
                    name: "Beginner Stage",
                    minScore: 0,
                    targetScore: 300,
                    days: [
                         {
                              dayNumber: 1,
                              questions: beginnerQuestions.slice(0, 4),
                              exam: null
                         },
                         {
                              dayNumber: 2,
                              questions: beginnerQuestions.slice(4, 8),
                              exam: null
                         },
                         {
                              dayNumber: 3,
                              questions: beginnerQuestions.slice(8, 12),
                              exam: null
                         }
                    ]
               },
               {
                    name: "Intermediate Stage",
                    minScore: 300,
                    targetScore: 600,
                    days: [
                         {
                              dayNumber: 1,
                              questions: intermediateQuestions.slice(0, 3),
                              exam: null
                         },
                         {
                              dayNumber: 2,
                              questions: intermediateQuestions.slice(3, 6),
                              exam: null
                         },
                         {
                              dayNumber: 3,
                              questions: intermediateQuestions.slice(6, 9),
                              exam: null
                         }
                    ]
               },
               {
                    name: "Advanced Stage",
                    minScore: 600,
                    targetScore: 900,
                    days: [
                         {
                              dayNumber: 1,
                              questions: advancedQuestions.slice(0, 2),
                              exam: null
                         },
                         {
                              dayNumber: 2,
                              questions: advancedQuestions.slice(2, 4),
                              exam: null
                         },
                         {
                              dayNumber: 3,
                              questions: advancedQuestions.slice(4, 5),
                              exam: null
                         }
                    ]
               }
          ];

          proposedStages.forEach((stage, index) => {
               console.log(`\n${stage.name}:`);
               console.log(`  MinScore: ${stage.minScore}, TargetScore: ${stage.targetScore}`);
               stage.days.forEach(day => {
                    console.log(`    Day ${day.dayNumber}: ${day.questions.length} questions [${day.questions.join(', ')}]`);
               });
          });

          // 4. Hỏi có muốn cập nhật không
          console.log('\n=== UPDATE CONFIRMATION ===');
          console.log('Do you want to update the stages with the new question structure? (Y/N)');
          console.log('This will replace all existing stage configurations.');

          // Để demo, tôi sẽ tạo hàm update riêng
          console.log('\nTo proceed with the update, run: updateStagesWithNewQuestions()');

     } catch (error) {
          console.error('Error analyzing stages:', error);
     } finally {
          await mongoose.disconnect();
          console.log('MongoDB disconnected.');
     }
}

async function updateStagesWithNewQuestions() {
     await connectDB();

     try {
          console.log('=== UPDATING STAGES WITH NEW QUESTIONS ===');

          // Lấy câu hỏi theo type
          const questions = await QuestionModel.find().sort({ questionNumber: 1 });
          const questionsByType = {};
          questions.forEach(q => {
               if (!questionsByType[q.type]) {
                    questionsByType[q.type] = [];
               }
               questionsByType[q.type].push(q._id);
          });

          // Xóa tất cả stage cũ
          await StageModel.deleteMany({});
          console.log('Deleted all existing stages.');

          // Tạo stage mới
          const newStages = [
               {
                    minScore: 0,
                    targetScore: 300,
                    days: [
                         {
                              dayNumber: 1,
                              questions: [
                                   ...(questionsByType.FILL_IN_THE_BLANK_QUESTION || []).slice(0, 2),
                                   ...(questionsByType.IMAGE_DESCRIPTION || []).slice(0, 2)
                              ],
                              exam: null
                         },
                         {
                              dayNumber: 2,
                              questions: [
                                   ...(questionsByType.FILL_IN_THE_BLANK_QUESTION || []).slice(2, 4),
                                   ...(questionsByType.ASK_AND_ANSWER || []).slice(0, 2)
                              ],
                              exam: null
                         },
                         {
                              dayNumber: 3,
                              questions: [
                                   ...(questionsByType.FILL_IN_THE_BLANK_QUESTION || []).slice(4, 6),
                                   ...(questionsByType.IMAGE_DESCRIPTION || []).slice(2, 3),
                                   ...(questionsByType.ASK_AND_ANSWER || []).slice(2, 3)
                              ],
                              exam: null
                         }
                    ]
               },
               {
                    minScore: 300,
                    targetScore: 600,
                    days: [
                         {
                              dayNumber: 1,
                              questions: [
                                   ...(questionsByType.CONVERSATION_PIECE || []).slice(0, 2),
                                   ...(questionsByType.FILL_IN_THE_PARAGRAPH || []).slice(0, 1)
                              ],
                              exam: null
                         },
                         {
                              dayNumber: 2,
                              questions: [
                                   ...(questionsByType.SHORT_TALK || []).slice(0, 2),
                                   ...(questionsByType.FILL_IN_THE_PARAGRAPH || []).slice(1, 2)
                              ],
                              exam: null
                         },
                         {
                              dayNumber: 3,
                              questions: [
                                   ...(questionsByType.CONVERSATION_PIECE || []).slice(2, 3),
                                   ...(questionsByType.SHORT_TALK || []).slice(2, 3),
                                   ...(questionsByType.FILL_IN_THE_PARAGRAPH || []).slice(2, 3)
                              ],
                              exam: null
                         }
                    ]
               },
               {
                    minScore: 600,
                    targetScore: 900,
                    days: [
                         {
                              dayNumber: 1,
                              questions: [
                                   ...(questionsByType.READ_AND_UNDERSTAND || []).slice(0, 2)
                              ],
                              exam: null
                         },
                         {
                              dayNumber: 2,
                              questions: [
                                   ...(questionsByType.READ_AND_UNDERSTAND || []).slice(2, 4)
                              ],
                              exam: null
                         },
                         {
                              dayNumber: 3,
                              questions: [
                                   ...(questionsByType.READ_AND_UNDERSTAND || []).slice(4, 5)
                              ],
                              exam: null
                         }
                    ]
               }
          ];

          // Insert stages mới
          const insertedStages = await StageModel.insertMany(newStages);
          console.log(`Created ${insertedStages.length} new stages successfully.`);

          // Hiển thị kết quả
          insertedStages.forEach((stage, index) => {
               console.log(`\nStage ${index + 1} (${stage._id}):`);
               console.log(`  MinScore: ${stage.minScore}, TargetScore: ${stage.targetScore}`);
               stage.days.forEach(day => {
                    console.log(`    Day ${day.dayNumber}: ${day.questions.length} questions`);
               });
          });

     } catch (error) {
          console.error('Error updating stages:', error);
     } finally {
          await mongoose.disconnect();
          console.log('MongoDB disconnected.');
     }
}

// Uncomment để chạy function nào:
// analyzeAndUpdateStages();
updateStagesWithNewQuestions(); 