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

// Auto increment questionNumber
questionSchema.pre("save", async function (next) {
     if (!this.isNew) return next();
     try {
          const lastDoc = await this.constructor.findOne({}, {}, { sort: { questionNumber: -1 } });
          this.questionNumber = lastDoc ? lastDoc.questionNumber + 1 : 1;
          next();
     } catch (err) {
          next(err);
     }
});

const Question = mongoose.model('questions', questionSchema);

// Image and Audio links from links.txt
const imageLinks = [
     'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b',
     'https://images.unsplash.com/photo-1606326608802-164e734c2fd9',
     'https://images.unsplash.com/photo-1606326608670-21cb955e5741',
     'https://images.unsplash.com/photo-1645290851823-205dc9d23ea0',
     'https://images.unsplash.com/photo-1434030216411-0b793f4b4173',
     'https://images.unsplash.com/photo-1509062522246-3755977927d7',
     'https://images.unsplash.com/photo-1510531704581-5b2870972060',
     'https://images.unsplash.com/photo-1524178232363-1fb2b075b655',
     'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
     'https://images.unsplash.com/photo-1568333261345-0918efdce2d9'
];

const audioLinks = [
     'https://res.cloudinary.com/dobcvvl12/video/upload/v1749580445/e64en5whxqtjkkjvjcb6.mp3',
     'https://res.cloudinary.com/dobcvvl12/video/upload/v1749580556/009_oosmtv.mp3',
     'https://res.cloudinary.com/dobcvvl12/video/upload/v1749580556/008_brysc1.mp3',
     'https://res.cloudinary.com/dobcvvl12/video/upload/v1749580556/007_svypam.mp3',
     'https://res.cloudinary.com/dobcvvl12/video/upload/v1749580556/006_kt29lr.mp3',
     'https://res.cloudinary.com/dobcvvl12/video/upload/v1749580556/004_jlb8zn.mp3',
     'https://res.cloudinary.com/dobcvvl12/video/upload/v1749580555/010_nyzboi.mp3',
     'https://res.cloudinary.com/dobcvvl12/video/upload/v1749580558/003_cv6ll4.mp3',
     'https://res.cloudinary.com/dobcvvl12/video/upload/v1749580558/005_rcophy.mp3',
     'https://res.cloudinary.com/dobcvvl12/video/upload/v1749580558/002_lxicqm.mp3'
];

// Sample questions data
const questionsData = [
     // IMAGE_DESCRIPTION (3 questions)
     {
          type: 'IMAGE_DESCRIPTION',
          question: 'What can you see in this image?',
          imageUrl: imageLinks[0],
          answers: [
               { answer: 'A busy office with people working', isCorrect: true },
               { answer: 'An empty restaurant', isCorrect: false },
               { answer: 'A school classroom', isCorrect: false },
               { answer: 'A hospital waiting room', isCorrect: false }
          ],
          explanation: 'The image shows a modern office environment with multiple people working at their desks.'
     },
     {
          type: 'IMAGE_DESCRIPTION',
          question: 'What is the main activity happening in this picture?',
          imageUrl: imageLinks[1],
          answers: [
               { answer: 'People are shopping', isCorrect: false },
               { answer: 'Students are studying', isCorrect: true },
               { answer: 'Workers are constructing', isCorrect: false },
               { answer: 'People are exercising', isCorrect: false }
          ],
          explanation: 'The image depicts students in a learning environment, focused on their studies.'
     },
     {
          type: 'IMAGE_DESCRIPTION',
          question: 'What type of location is shown in the image?',
          imageUrl: imageLinks[2],
          answers: [
               { answer: 'A public park', isCorrect: false },
               { answer: 'A business conference room', isCorrect: true },
               { answer: 'A home kitchen', isCorrect: false },
               { answer: 'A shopping mall', isCorrect: false }
          ],
          explanation: 'The image shows a professional meeting room with presentation equipment and business furniture.'
     },

     // ASK_AND_ANSWER (3 questions)
     {
          type: 'ASK_AND_ANSWER',
          question: 'What time does the store close?',
          audio: {
               name: 'store_hours.mp3',
               url: audioLinks[0]
          },
          answers: [
               { answer: '9:00 PM', isCorrect: true },
               { answer: '8:00 PM', isCorrect: false },
               { answer: '10:00 PM', isCorrect: false },
               { answer: '7:00 PM', isCorrect: false }
          ],
          subtitle: 'The store closes at 9:00 PM on weekdays and 10:00 PM on weekends.',
          explanation: 'The audio clearly states that the store closing time is 9:00 PM during weekdays.'
     },
     {
          type: 'ASK_AND_ANSWER',
          question: 'Where is the nearest subway station?',
          audio: {
               name: 'directions.mp3',
               url: audioLinks[1]
          },
          answers: [
               { answer: '2 blocks south', isCorrect: false },
               { answer: '3 blocks north', isCorrect: true },
               { answer: '1 block east', isCorrect: false },
               { answer: '4 blocks west', isCorrect: false }
          ],
          subtitle: 'The nearest subway station is 3 blocks north of here, next to the big shopping center.',
          explanation: 'According to the directions given, the subway station is located 3 blocks north.'
     },
     {
          type: 'ASK_AND_ANSWER',
          question: 'How much does the lunch special cost?',
          audio: {
               name: 'menu_prices.mp3',
               url: audioLinks[2]
          },
          answers: [
               { answer: '$12.99', isCorrect: true },
               { answer: '$15.99', isCorrect: false },
               { answer: '$10.99', isCorrect: false },
               { answer: '$14.99', isCorrect: false }
          ],
          subtitle: 'Our lunch special today is $12.99 and includes soup, main course, and dessert.',
          explanation: 'The lunch special is priced at $12.99 and includes a complete meal.'
     },

     // CONVERSATION_PIECE (3 questions with 2 sub-questions each)
     {
          type: 'CONVERSATION_PIECE',
          audio: {
               name: 'business_meeting.mp3',
               url: audioLinks[3]
          },
          questions: [
               {
                    question: 'What is the main topic of the meeting?',
                    answers: [
                         { answer: 'Budget planning', isCorrect: true },
                         { answer: 'Employee training', isCorrect: false },
                         { answer: 'Product launch', isCorrect: false },
                         { answer: 'Office relocation', isCorrect: false }
                    ]
               },
               {
                    question: 'When is the deadline for the project?',
                    answers: [
                         { answer: 'Next Friday', isCorrect: true },
                         { answer: 'Next Monday', isCorrect: false },
                         { answer: 'This Friday', isCorrect: false },
                         { answer: 'Next Wednesday', isCorrect: false }
                    ]
               }
          ],
          subtitle: 'A: We need to discuss the budget for next quarter. B: Yes, and the deadline is next Friday.',
          explanation: 'The conversation focuses on budget planning with a deadline of next Friday.'
     },
     {
          type: 'CONVERSATION_PIECE',
          audio: {
               name: 'restaurant_order.mp3',
               url: audioLinks[4]
          },
          questions: [
               {
                    question: 'What does the customer order?',
                    answers: [
                         { answer: 'Grilled chicken with salad', isCorrect: true },
                         { answer: 'Beef steak with fries', isCorrect: false },
                         { answer: 'Fish and chips', isCorrect: false },
                         { answer: 'Pasta with sauce', isCorrect: false }
                    ]
               },
               {
                    question: 'What drink does the customer choose?',
                    answers: [
                         { answer: 'Orange juice', isCorrect: false },
                         { answer: 'Coffee', isCorrect: false },
                         { answer: 'Iced tea', isCorrect: true },
                         { answer: 'Water', isCorrect: false }
                    ]
               }
          ],
          subtitle: 'Customer: I\'ll have the grilled chicken with salad. Waiter: And to drink? Customer: Iced tea, please.',
          explanation: 'The customer orders grilled chicken with salad and iced tea to drink.'
     },
     {
          type: 'CONVERSATION_PIECE',
          audio: {
               name: 'travel_booking.mp3',
               url: audioLinks[5]
          },
          questions: [
               {
                    question: 'What destination is the customer booking?',
                    answers: [
                         { answer: 'Tokyo', isCorrect: true },
                         { answer: 'Seoul', isCorrect: false },
                         { answer: 'Bangkok', isCorrect: false },
                         { answer: 'Singapore', isCorrect: false }
                    ]
               },
               {
                    question: 'How many nights will they stay?',
                    answers: [
                         { answer: '3 nights', isCorrect: false },
                         { answer: '5 nights', isCorrect: true },
                         { answer: '7 nights', isCorrect: false },
                         { answer: '4 nights', isCorrect: false }
                    ]
               }
          ],
          subtitle: 'Agent: Where would you like to go? Customer: Tokyo, for 5 nights please.',
          explanation: 'The customer is booking a 5-night trip to Tokyo.'
     },

     // SHORT_TALK (3 questions with 2 sub-questions each)
     {
          type: 'SHORT_TALK',
          audio: {
               name: 'weather_forecast.mp3',
               url: audioLinks[6]
          },
          questions: [
               {
                    question: 'What will the weather be like tomorrow?',
                    answers: [
                         { answer: 'Sunny and warm', isCorrect: true },
                         { answer: 'Rainy and cold', isCorrect: false },
                         { answer: 'Cloudy and cool', isCorrect: false },
                         { answer: 'Snowy and freezing', isCorrect: false }
                    ]
               },
               {
                    question: 'What is the expected temperature?',
                    answers: [
                         { answer: '25°C', isCorrect: true },
                         { answer: '18°C', isCorrect: false },
                         { answer: '30°C', isCorrect: false },
                         { answer: '22°C', isCorrect: false }
                    ]
               }
          ],
          subtitle: 'Tomorrow will be sunny and warm with temperatures reaching 25 degrees Celsius.',
          explanation: 'The weather forecast predicts sunny, warm weather with a temperature of 25°C.'
     },
     {
          type: 'SHORT_TALK',
          audio: {
               name: 'company_announcement.mp3',
               url: audioLinks[7]
          },
          questions: [
               {
                    question: 'What is the company announcing?',
                    answers: [
                         { answer: 'New office location', isCorrect: true },
                         { answer: 'Staff layoffs', isCorrect: false },
                         { answer: 'Product recall', isCorrect: false },
                         { answer: 'Merger with another company', isCorrect: false }
                    ]
               },
               {
                    question: 'When will the move take place?',
                    answers: [
                         { answer: 'Next month', isCorrect: true },
                         { answer: 'Next week', isCorrect: false },
                         { answer: 'In three months', isCorrect: false },
                         { answer: 'At the end of the year', isCorrect: false }
                    ]
               }
          ],
          subtitle: 'We are pleased to announce that our company will be moving to a new office location next month.',
          explanation: 'The company is announcing a move to a new office location scheduled for next month.'
     },
     {
          type: 'SHORT_TALK',
          audio: {
               name: 'safety_instructions.mp3',
               url: audioLinks[8]
          },
          questions: [
               {
                    question: 'What is the main safety rule mentioned?',
                    answers: [
                         { answer: 'Always wear protective equipment', isCorrect: true },
                         { answer: 'Never work alone', isCorrect: false },
                         { answer: 'Check equipment daily', isCorrect: false },
                         { answer: 'Report incidents immediately', isCorrect: false }
                    ]
               },
               {
                    question: 'What should you do in case of emergency?',
                    answers: [
                         { answer: 'Call the supervisor', isCorrect: false },
                         { answer: 'Use the emergency exits', isCorrect: true },
                         { answer: 'Wait for instructions', isCorrect: false },
                         { answer: 'Turn off all equipment', isCorrect: false }
                    ]
               }
          ],
          subtitle: 'Safety first: always wear protective equipment and know the location of emergency exits.',
          explanation: 'The safety instructions emphasize wearing protective equipment and knowing emergency exit locations.'
     },

     // FILL_IN_THE_BLANK_QUESTION (3 questions)
     {
          type: 'FILL_IN_THE_BLANK_QUESTION',
          question: 'I usually _____ coffee in the morning before work.',
          answers: [
               { answer: 'drink', isCorrect: true },
               { answer: 'drinks', isCorrect: false },
               { answer: 'drinking', isCorrect: false },
               { answer: 'drank', isCorrect: false }
          ],
          explanation: 'The correct form is "drink" because it\'s a simple present tense with the subject "I".'
     },
     {
          type: 'FILL_IN_THE_BLANK_QUESTION',
          question: 'She has been _____ English for three years.',
          answers: [
               { answer: 'studying', isCorrect: true },
               { answer: 'study', isCorrect: false },
               { answer: 'studied', isCorrect: false },
               { answer: 'studies', isCorrect: false }
          ],
          explanation: 'The present perfect continuous tense requires "studying" after "has been".'
     },
     {
          type: 'FILL_IN_THE_BLANK_QUESTION',
          question: 'The meeting will start _____ 2 PM sharp.',
          answers: [
               { answer: 'at', isCorrect: true },
               { answer: 'in', isCorrect: false },
               { answer: 'on', isCorrect: false },
               { answer: 'by', isCorrect: false }
          ],
          explanation: 'We use "at" with specific times like "2 PM".'
     },

     // FILL_IN_THE_PARAGRAPH (3 questions with 2 sub-questions each)
     {
          type: 'FILL_IN_THE_PARAGRAPH',
          question: 'Read the following paragraph and choose the best words to fill in the blanks:\n\nThe company _____ (1) a new product last month. Sales _____ (2) been increasing steadily since then.',
          questions: [
               {
                    question: 'Choose the best word for blank (1):',
                    answers: [
                         { answer: 'launched', isCorrect: true },
                         { answer: 'launch', isCorrect: false },
                         { answer: 'launching', isCorrect: false },
                         { answer: 'will launch', isCorrect: false }
                    ]
               },
               {
                    question: 'Choose the best word for blank (2):',
                    answers: [
                         { answer: 'have', isCorrect: true },
                         { answer: 'has', isCorrect: false },
                         { answer: 'had', isCorrect: false },
                         { answer: 'will have', isCorrect: false }
                    ]
               }
          ],
          explanation: 'The paragraph describes past and present perfect actions. "Launched" is past tense, and "have been" is present perfect continuous with plural subject "sales".'
     },
     {
          type: 'FILL_IN_THE_PARAGRAPH',
          question: 'Complete the paragraph:\n\nMany people _____ (1) working from home nowadays. This trend _____ (2) likely to continue in the future.',
          questions: [
               {
                    question: 'Choose the best word for blank (1):',
                    answers: [
                         { answer: 'are', isCorrect: true },
                         { answer: 'is', isCorrect: false },
                         { answer: 'was', isCorrect: false },
                         { answer: 'were', isCorrect: false }
                    ]
               },
               {
                    question: 'Choose the best word for blank (2):',
                    answers: [
                         { answer: 'is', isCorrect: true },
                         { answer: 'are', isCorrect: false },
                         { answer: 'was', isCorrect: false },
                         { answer: 'were', isCorrect: false }
                    ]
               }
          ],
          explanation: '"Many people" is plural so takes "are". "This trend" is singular so takes "is".'
     },
     {
          type: 'FILL_IN_THE_PARAGRAPH',
          question: 'Fill in the blanks:\n\nThe conference _____ (1) next week. All participants _____ (2) receive their materials in advance.',
          questions: [
               {
                    question: 'Choose the best word for blank (1):',
                    answers: [
                         { answer: 'will be held', isCorrect: true },
                         { answer: 'is held', isCorrect: false },
                         { answer: 'was held', isCorrect: false },
                         { answer: 'has been held', isCorrect: false }
                    ]
               },
               {
                    question: 'Choose the best word for blank (2):',
                    answers: [
                         { answer: 'will', isCorrect: true },
                         { answer: 'would', isCorrect: false },
                         { answer: 'can', isCorrect: false },
                         { answer: 'should', isCorrect: false }
                    ]
               }
          ],
          explanation: 'Future passive voice "will be held" for the conference, and "will" for future simple with participants.'
     },

     // READ_AND_UNDERSTAND (3 questions with 2 sub-questions each)
     {
          type: 'READ_AND_UNDERSTAND',
          question: 'Read the passage and answer the questions:\n\n"Global warming is one of the most pressing environmental issues of our time. Rising temperatures are causing ice caps to melt, sea levels to rise, and weather patterns to change dramatically. Scientists agree that immediate action is needed to reduce greenhouse gas emissions."',
          questions: [
               {
                    question: 'What is the main topic of the passage?',
                    answers: [
                         { answer: 'Global warming and its effects', isCorrect: true },
                         { answer: 'Weather forecasting methods', isCorrect: false },
                         { answer: 'Ocean pollution problems', isCorrect: false },
                         { answer: 'Wildlife conservation efforts', isCorrect: false }
                    ]
               },
               {
                    question: 'According to the passage, what do scientists recommend?',
                    answers: [
                         { answer: 'Reducing greenhouse gas emissions', isCorrect: true },
                         { answer: 'Building more weather stations', isCorrect: false },
                         { answer: 'Studying ice cap formation', isCorrect: false },
                         { answer: 'Monitoring sea level changes', isCorrect: false }
                    ]
               }
          ],
          explanation: 'The passage discusses global warming as the main topic and mentions that scientists recommend reducing greenhouse gas emissions.'
     },
     {
          type: 'READ_AND_UNDERSTAND',
          question: 'Read the text below:\n\n"The company reported record profits this quarter, with revenue increasing by 25% compared to the same period last year. The CEO attributed this success to innovative marketing strategies and improved customer service. Shareholders are optimistic about future growth prospects."',
          questions: [
               {
                    question: 'How much did revenue increase?',
                    answers: [
                         { answer: '25%', isCorrect: true },
                         { answer: '15%', isCorrect: false },
                         { answer: '35%', isCorrect: false },
                         { answer: '20%', isCorrect: false }
                    ]
               },
               {
                    question: 'What contributed to the company\'s success?',
                    answers: [
                         { answer: 'Marketing strategies and customer service', isCorrect: true },
                         { answer: 'New product launches', isCorrect: false },
                         { answer: 'Cost reduction measures', isCorrect: false },
                         { answer: 'Market expansion', isCorrect: false }
                    ]
               }
          ],
          explanation: 'The text states revenue increased by 25% and attributes success to innovative marketing strategies and improved customer service.'
     },
     {
          type: 'READ_AND_UNDERSTAND',
          question: 'Read the following information:\n\n"The museum is open Tuesday through Sunday from 10 AM to 6 PM. Admission is $15 for adults and $8 for children under 12. Group discounts are available for parties of 10 or more. The museum features both permanent and rotating exhibitions."',
          questions: [
               {
                    question: 'What day is the museum closed?',
                    answers: [
                         { answer: 'Monday', isCorrect: true },
                         { answer: 'Tuesday', isCorrect: false },
                         { answer: 'Sunday', isCorrect: false },
                         { answer: 'Saturday', isCorrect: false }
                    ]
               },
               {
                    question: 'How much is admission for children?',
                    answers: [
                         { answer: '$8', isCorrect: true },
                         { answer: '$15', isCorrect: false },
                         { answer: '$12', isCorrect: false },
                         { answer: '$10', isCorrect: false }
                    ]
               }
          ],
          explanation: 'The museum is open Tuesday through Sunday, so it\'s closed on Monday. Children\'s admission is $8.'
     }
];

// Function to create questions
const createQuestions = async () => {
     try {
          await connectDB();

          console.log('🚀 Starting to create questions...');

          const createdQuestions = [];

          for (const questionData of questionsData) {
               const question = new Question(questionData);
               const savedQuestion = await question.save();
               createdQuestions.push(savedQuestion);
               console.log(`✅ Created ${questionData.type} question #${savedQuestion.questionNumber}`);
          }

          console.log(`\n🎉 Successfully created ${createdQuestions.length} questions!`);
          console.log('\n📊 Summary:');

          // Count questions by type
          const summary = {};
          createdQuestions.forEach(q => {
               summary[q.type] = (summary[q.type] || 0) + 1;
          });

          Object.entries(summary).forEach(([type, count]) => {
               console.log(`   ${type}: ${count} questions`);
          });

          process.exit(0);
     } catch (error) {
          console.error('❌ Error creating questions:', error);
          process.exit(1);
     }
};

// Run the script
if (require.main === module) {
     createQuestions();
}

module.exports = { createQuestions, Question };