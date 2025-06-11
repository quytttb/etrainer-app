const mongoose = require('mongoose');

// MongoDB connection
const connectDB = async () => {
     try {
          await mongoose.connect('mongodb+srv://touyen:touyen@danentang.ilfodv9.mongodb.net/etrainer');
          console.log('✅ Connected to MongoDB Atlas');
     } catch (error) {
          console.error('❌ MongoDB connection error:', error);
          process.exit(1);
     }
};

// Question Schema (based on the model structure)
const questionSchema = new mongoose.Schema({
     questionNumber: {
          type: Number,
          unique: true,
     },
     type: {
          type: String,
          required: true,
          enum: [
               'IMAGE_DESCRIPTION',
               'ASK_AND_ANSWER',
               'CONVERSATION_PIECE',
               'SHORT_TALK',
               'FILL_IN_THE_BLANK_QUESTION',
               'FILL_IN_THE_PARAGRAPH',
               'READ_AND_UNDERSTAND'
          ],
     },
     question: {
          type: String,
          default: null,
     },
     audio: {
          name: {
               type: String,
               default: null,
          },
          url: {
               type: String,
               default: null,
          },
     },
     imageUrl: {
          type: String,
          default: null,
     },
     answers: {
          type: [
               {
                    answer: {
                         type: String,
                         required: true,
                    },
                    isCorrect: {
                         type: Boolean,
                         default: false,
                    },
               },
          ],
          default: null,
     },
     questions: {
          type: [
               {
                    question: {
                         type: String,
                         required: true,
                    },
                    answers: [
                         {
                              answer: {
                                   type: String,
                                   required: true,
                              },
                              isCorrect: {
                                   type: Boolean,
                                   default: false,
                              },
                         },
                    ],
               },
          ],
          default: null,
     },
     subtitle: {
          type: String,
          default: null,
     },
     explanation: {
          type: String,
          default: null,
     },
}, { timestamps: true });

const Question = mongoose.model('questions', questionSchema);

// Function to clear all questions
const clearAllQuestions = async () => {
     try {
          await connectDB();

          console.log('🗑️  Starting to clear all questions...');

          // Count existing questions first
          const existingCount = await Question.countDocuments();
          console.log(`📊 Found ${existingCount} questions in database`);

          if (existingCount === 0) {
               console.log('ℹ️  Database is already empty - no questions to delete');
               process.exit(0);
          }

          // Ask for confirmation (in production, you might want to add a confirmation prompt)
          console.log('⚠️  WARNING: This will delete ALL questions in the database!');

          // Delete all questions
          const result = await Question.deleteMany({});

          console.log(`✅ Successfully deleted ${result.deletedCount} questions`);
          console.log('🧹 Database has been cleared of all questions');

          // Verify deletion
          const remainingCount = await Question.countDocuments();
          if (remainingCount === 0) {
               console.log('✅ Verification: Database is now empty');
          } else {
               console.log(`⚠️  Warning: ${remainingCount} questions still remain`);
          }

          process.exit(0);
     } catch (error) {
          console.error('❌ Error clearing questions:', error);
          process.exit(1);
     }
};

// Run the script
if (require.main === module) {
     clearAllQuestions();
}

module.exports = { clearAllQuestions, Question }; 