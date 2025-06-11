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

async function updateStagesForJourneySelector() {
     await connectDB();

     try {
          console.log('=== UPDATING STAGES FOR JOURNEY SELECTOR ===');

          // Lấy câu hỏi theo type
          const questions = await QuestionModel.find().sort({ questionNumber: 1 });
          const questionsByType = {};
          questions.forEach(q => {
               if (!questionsByType[q.type]) {
                    questionsByType[q.type] = [];
               }
               questionsByType[q.type].push(q._id);
          });

          console.log('Questions by type:');
          Object.entries(questionsByType).forEach(([type, qs]) => {
               console.log(`  ${type}: ${qs.length} questions`);
          });

          // Xóa tất cả stage cũ
          await StageModel.deleteMany({});
          console.log('\nDeleted all existing stages.');

          // Tạo 6 stages theo Journey Selector:
          // 1. 0 → 150 (Mất gốc)
          // 2. 150 → 300 (Cơ bản) 
          // 3. 300 → 450 (Trung cấp)
          // 4. 450 → 600 (Trung cấp nâng cao)
          // 5. 600 → 700 (Cao cấp)
          // 6. 700 → 900 (Xuất sắc)

          const newStages = [
               // Stage 1: 0 → 150 (Mất gốc) - Easy questions
               {
                    minScore: 0,
                    targetScore: 150,
                    days: [
                         {
                              dayNumber: 1,
                              questions: [
                                   ...(questionsByType.FILL_IN_THE_BLANK_QUESTION || []).slice(0, 2),
                                   ...(questionsByType.IMAGE_DESCRIPTION || []).slice(0, 1)
                              ],
                              exam: null
                         },
                         {
                              dayNumber: 2,
                              questions: [
                                   ...(questionsByType.FILL_IN_THE_BLANK_QUESTION || []).slice(2, 4),
                                   ...(questionsByType.ASK_AND_ANSWER || []).slice(0, 1)
                              ],
                              exam: null
                         },
                         {
                              dayNumber: 3,
                              questions: [
                                   ...(questionsByType.FILL_IN_THE_BLANK_QUESTION || []).slice(4, 6),
                                   ...(questionsByType.IMAGE_DESCRIPTION || []).slice(1, 2)
                              ],
                              exam: null
                         }
                    ]
               },

               // Stage 2: 150 → 300 (Cơ bản) - Easy to medium questions
               {
                    minScore: 150,
                    targetScore: 300,
                    days: [
                         {
                              dayNumber: 1,
                              questions: [
                                   ...(questionsByType.IMAGE_DESCRIPTION || []).slice(2, 3),
                                   ...(questionsByType.ASK_AND_ANSWER || []).slice(1, 3)
                              ],
                              exam: null
                         },
                         {
                              dayNumber: 2,
                              questions: [
                                   ...(questionsByType.FILL_IN_THE_PARAGRAPH || []).slice(0, 1),
                                   ...(questionsByType.CONVERSATION_PIECE || []).slice(0, 1)
                              ],
                              exam: null
                         },
                         {
                              dayNumber: 3,
                              questions: [
                                   ...(questionsByType.FILL_IN_THE_PARAGRAPH || []).slice(1, 2),
                                   ...(questionsByType.SHORT_TALK || []).slice(0, 1)
                              ],
                              exam: null
                         }
                    ]
               },

               // Stage 3: 300 → 450 (Trung cấp) - Medium questions
               {
                    minScore: 300,
                    targetScore: 450,
                    days: [
                         {
                              dayNumber: 1,
                              questions: [
                                   ...(questionsByType.CONVERSATION_PIECE || []).slice(1, 2),
                                   ...(questionsByType.SHORT_TALK || []).slice(1, 2)
                              ],
                              exam: null
                         },
                         {
                              dayNumber: 2,
                              questions: [
                                   ...(questionsByType.FILL_IN_THE_PARAGRAPH || []).slice(2, 3),
                                   ...(questionsByType.CONVERSATION_PIECE || []).slice(2, 3)
                              ],
                              exam: null
                         },
                         {
                              dayNumber: 3,
                              questions: [
                                   ...(questionsByType.SHORT_TALK || []).slice(2, 3),
                                   ...(questionsByType.READ_AND_UNDERSTAND || []).slice(0, 1)
                              ],
                              exam: null
                         }
                    ]
               },

               // Stage 4: 450 → 600 (Trung cấp nâng cao) - Medium to hard questions
               {
                    minScore: 450,
                    targetScore: 600,
                    days: [
                         {
                              dayNumber: 1,
                              questions: [
                                   ...(questionsByType.READ_AND_UNDERSTAND || []).slice(1, 2)
                              ],
                              exam: null
                         },
                         {
                              dayNumber: 2,
                              questions: [
                                   ...(questionsByType.READ_AND_UNDERSTAND || []).slice(2, 3)
                              ],
                              exam: null
                         },
                         {
                              dayNumber: 3,
                              questions: [
                                   ...(questionsByType.READ_AND_UNDERSTAND || []).slice(3, 4)
                              ],
                              exam: null
                         }
                    ]
               },

               // Stage 5: 600 → 700 (Cao cấp) - Hard questions
               {
                    minScore: 600,
                    targetScore: 700,
                    days: [
                         {
                              dayNumber: 1,
                              questions: [
                                   ...(questionsByType.READ_AND_UNDERSTAND || []).slice(4, 5)
                              ],
                              exam: null
                         },
                         {
                              dayNumber: 2,
                              questions: [
                                   // Mix of advanced questions
                                   ...(questionsByType.CONVERSATION_PIECE || []).slice(0, 1),
                                   ...(questionsByType.SHORT_TALK || []).slice(0, 1)
                              ],
                              exam: null
                         },
                         {
                              dayNumber: 3,
                              questions: [
                                   // Review questions
                                   ...(questionsByType.FILL_IN_THE_PARAGRAPH || []).slice(0, 1),
                                   ...(questionsByType.READ_AND_UNDERSTAND || []).slice(0, 1)
                              ],
                              exam: null
                         }
                    ]
               },

               // Stage 6: 700 → 900 (Xuất sắc) - Expert level
               {
                    minScore: 700,
                    targetScore: 900,
                    days: [
                         {
                              dayNumber: 1,
                              questions: [
                                   // Advanced mix
                                   ...(questionsByType.CONVERSATION_PIECE || []).slice(1, 2),
                                   ...(questionsByType.READ_AND_UNDERSTAND || []).slice(1, 2)
                              ],
                              exam: null
                         },
                         {
                              dayNumber: 2,
                              questions: [
                                   ...(questionsByType.SHORT_TALK || []).slice(1, 2),
                                   ...(questionsByType.READ_AND_UNDERSTAND || []).slice(2, 3)
                              ],
                              exam: null
                         },
                         {
                              dayNumber: 3,
                              questions: [
                                   // Master level
                                   ...(questionsByType.CONVERSATION_PIECE || []).slice(2, 3),
                                   ...(questionsByType.SHORT_TALK || []).slice(2, 3),
                                   ...(questionsByType.READ_AND_UNDERSTAND || []).slice(3, 5)
                              ],
                              exam: null
                         }
                    ]
               }
          ];

          // Insert stages mới
          const insertedStages = await StageModel.insertMany(newStages);
          console.log(`\nCreated ${insertedStages.length} new stages successfully.`);

          // Hiển thị kết quả
          insertedStages.forEach((stage, index) => {
               console.log(`\nStage ${index + 1} (${stage.minScore} → ${stage.targetScore}):`);
               console.log(`  Stage ID: ${stage._id}`);
               console.log(`  Days: ${stage.days.length}`);

               let totalQuestions = 0;
               stage.days.forEach(day => {
                    totalQuestions += day.questions.length;
                    console.log(`    Day ${day.dayNumber}: ${day.questions.length} questions`);
               });
               console.log(`  Total Questions: ${totalQuestions}`);
          });

          // Summary theo Journey Selector ranges
          console.log('\n=== JOURNEY SELECTOR COMPATIBILITY ===');
          console.log('✅ Trình độ ban đầu:');
          console.log('   - 0 → 150 (Mất gốc): Stage 1');
          console.log('   - 300 → 450 (Trung cấp): Stage 3');
          console.log('   - 600 → 700 (Cao cấp): Stage 5');

          console.log('\n✅ Mục tiêu:');
          console.log('   - 300 (Cơ bản): Stage 1+2');
          console.log('   - 650 (Khá): Stage 1+2+3+4');
          console.log('   - 900 (Xuất sắc): All 6 stages');

     } catch (error) {
          console.error('Error updating stages:', error);
     } finally {
          await mongoose.disconnect();
          console.log('\nMongoDB disconnected.');
     }
}

updateStagesForJourneySelector(); 