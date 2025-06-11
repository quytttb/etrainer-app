const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://touyen:touyen@danentang.ilfodv9.mongodb.net/etrainer';

// Enum based on the markdown file
const LESSON_TYPE = {
     IMAGE_DESCRIPTION: "IMAGE_DESCRIPTION",
     ASK_AND_ANSWER: "ASK_AND_ANSWER",
     CONVERSATION_PIECE: "CONVERSATION_PIECE",
     SHORT_TALK: "SHORT_TALK",
     FILL_IN_THE_BLANK_QUESTION: "FILL_IN_THE_BLANK_QUESTION",
     FILL_IN_THE_PARAGRAPH: "FILL_IN_THE_PARAGRAPH",
     READ_AND_UNDERSTAND: "READ_AND_UNDERSTAND",
     STAGE_FINAL_TEST: "STAGE_FINAL_TEST"
};

const AnswerSchema = new mongoose.Schema({
     answer: { type: String, required: true },
     isCorrect: { type: Boolean, required: true },
});

const SubQuestionSchema = new mongoose.Schema({
     question: { type: String, required: true },
     answers: [AnswerSchema],
});

const QuestionSchema = new mongoose.Schema(
     {
          questionNumber: { type: Number, required: true, unique: true },
          type: { type: String, required: true, enum: Object.values(LESSON_TYPE) },
          question: { type: String, sparse: true },
          audio: {
               name: String,
               url: String,
          },
          imageUrl: String,
          answers: [AnswerSchema],
          questions: [SubQuestionSchema],
          subtitle: String,
          explanation: String,
     },
     { timestamps: true }
);

const QuestionModel = mongoose.model('Question', QuestionSchema);

let questionDbIdCounter = 0;

const newQuestionsData = [
     // Type: IMAGE_DESCRIPTION (3 questions)
     {
          type: LESSON_TYPE.IMAGE_DESCRIPTION,
          question: null,
          imageUrl: "/assets/images/books.png",
          audio: {
               name: "image_description_1.mp3",
               url: "https://file-examples.com/storage/fe3e7fc7fe68462a19ac6ae/2017/11/file_example_MP3_700KB.mp3"
          },
          answers: [
               { answer: "A. There are several books stacked on a table.", isCorrect: true },
               { answer: "B. A woman is reading a magazine.", isCorrect: false },
               { answer: "C. The library is closed for renovation.", isCorrect: false },
               { answer: "D. Students are studying in the classroom.", isCorrect: false },
          ],
          explanation: "Hình ảnh cho thấy các cuốn sách được xếp chồng lên nhau trên bàn. Đây là dạng câu hỏi IMAGE_DESCRIPTION trong TOEIC Part 1, yêu cầu mô tả chính xác những gì nhìn thấy trong hình."
     },
     {
          type: LESSON_TYPE.IMAGE_DESCRIPTION,
          question: null,
          imageUrl: "/assets/images/cup.png",
          audio: {
               name: "image_description_2.mp3",
               url: "https://file-examples.com/storage/fe3e7fc7fe68462a19ac6ae/2017/11/file_example_MP3_700KB.mp3"
          },
          answers: [
               { answer: "A. A person is washing dishes in the kitchen.", isCorrect: false },
               { answer: "B. A cup is placed on the surface.", isCorrect: true },
               { answer: "C. Coffee is being poured into a mug.", isCorrect: false },
               { answer: "D. Someone is drinking from a glass.", isCorrect: false },
          ],
          explanation: "Hình ảnh đơn giản hiển thị một chiếc cốc được đặt trên bề mặt. Cần chọn câu mô tả chính xác nhất về vị trí và trạng thái của đồ vật trong hình."
     },
     {
          type: LESSON_TYPE.IMAGE_DESCRIPTION,
          question: null,
          imageUrl: "/assets/images/headphones.png",
          audio: {
               name: "image_description_3.mp3",
               url: "https://file-examples.com/storage/fe3e7fc7fe68462a19ac6ae/2017/11/file_example_MP3_700KB.mp3"
          },
          answers: [
               { answer: "A. Music is playing loudly in the room.", isCorrect: false },
               { answer: "B. A person is talking on the phone.", isCorrect: false },
               { answer: "C. Headphones are displayed or positioned.", isCorrect: true },
               { answer: "D. Someone is listening to a podcast.", isCorrect: false },
          ],
          explanation: "Hình ảnh hiển thị tai nghe. Cần tránh suy đoán hành động không thể nhìn thấy và chỉ mô tả những gì có thể quan sát được trực tiếp."
     },

     // Type: ASK_AND_ANSWER (3 questions)
     {
          type: LESSON_TYPE.ASK_AND_ANSWER,
          question: "When does the meeting start?",
          audio: {
               name: "question_response_1.mp3",
               url: "https://file-examples.com/storage/fe3e7fc7fe68462a19ac6ae/2017/11/file_example_MP3_700KB.mp3"
          },
          answers: [
               { answer: "A. In the conference room.", isCorrect: false },
               { answer: "B. At 3 o'clock this afternoon.", isCorrect: true },
               { answer: "C. With the sales team.", isCorrect: false },
               { answer: "D. Yes, I'll be there.", isCorrect: false },
          ],
          explanation: "Câu hỏi về thời gian (When) cần được trả lời bằng thông tin về thời gian. 'At 3 o'clock this afternoon' là câu trả lời trực tiếp cho câu hỏi về thời gian bắt đầu cuộc họp."
     },
     {
          type: LESSON_TYPE.ASK_AND_ANSWER,
          question: "Where did you put the project files?",
          audio: {
               name: "question_response_2.mp3",
               url: "https://file-examples.com/storage/fe3e7fc7fe68462a19ac6ae/2017/11/file_example_MP3_700KB.mp3"
          },
          answers: [
               { answer: "A. They're on my desk.", isCorrect: true },
               { answer: "B. Last Friday morning.", isCorrect: false },
               { answer: "C. The blue folder is mine.", isCorrect: false },
               { answer: "D. I need them for the presentation.", isCorrect: false },
          ],
          explanation: "Câu hỏi về địa điểm (Where) cần được trả lời bằng thông tin về vị trí. 'They're on my desk' là câu trả lời phù hợp nhất cho câu hỏi về vị trí của các file dự án."
     },
     {
          type: LESSON_TYPE.ASK_AND_ANSWER,
          question: "Would you like some coffee?",
          audio: {
               name: "question_response_3.mp3",
               url: "https://file-examples.com/storage/fe3e7fc7fe68462a19ac6ae/2017/11/file_example_MP3_700KB.mp3"
          },
          answers: [
               { answer: "A. It's in the kitchen.", isCorrect: false },
               { answer: "B. Every morning at 8.", isCorrect: false },
               { answer: "C. Yes, that would be great.", isCorrect: true },
               { answer: "D. The coffee shop is closed.", isCorrect: false },
          ],
          explanation: "Câu hỏi lịch sự mời (Would you like) cần được trả lời bằng cách chấp nhận hoặc từ chối. 'Yes, that would be great' là cách trả lời lịch sự và phù hợp."
     },

     // Type: CONVERSATION_PIECE (3 questions)
     {
          type: LESSON_TYPE.CONVERSATION_PIECE,
          question: "You will hear a conversation between two colleagues discussing a project deadline.",
          audio: {
               name: "conversation_1.mp3",
               url: "https://file-examples.com/storage/fe3e7fc7fe68462a19ac6ae/2017/11/file_example_MP3_700KB.mp3"
          },
          subtitle: "A: The deadline for the marketing report is next Friday, isn't it?\nB: Actually, it's been moved up to Wednesday. The client wants to review it earlier.\nA: Oh no! That means we only have three days left. We'll need to work overtime.\nB: Don't worry, I can help you with the data analysis section.",
          questions: [
               {
                    question: "What is the original deadline for the report?",
                    answers: [
                         { answer: "A. Monday", isCorrect: false },
                         { answer: "B. Wednesday", isCorrect: false },
                         { answer: "C. Friday", isCorrect: true },
                         { answer: "D. Next week", isCorrect: false },
                    ],
               },
               {
                    question: "Why was the deadline changed?",
                    answers: [
                         { answer: "A. The team needed more time", isCorrect: false },
                         { answer: "B. The client wants to review it earlier", isCorrect: true },
                         { answer: "C. There was a scheduling conflict", isCorrect: false },
                         { answer: "D. The project was cancelled", isCorrect: false },
                    ],
               },
          ],
          explanation: "Đây là đoạn hội thoại về việc thay đổi deadline dự án. Cần nghe kỹ để nắm bắt thông tin chi tiết về thời gian và lý do thay đổi."
     },
     {
          type: LESSON_TYPE.CONVERSATION_PIECE,
          question: "You will hear a conversation between a customer and a store employee.",
          audio: {
               name: "conversation_2.mp3",
               url: "https://file-examples.com/storage/fe3e7fc7fe68462a19ac6ae/2017/11/file_example_MP3_700KB.mp3"
          },
          subtitle: "Customer: Excuse me, do you have this shirt in a medium size?\nEmployee: Let me check for you. I'm sorry, we're out of medium, but we have small and large available.\nCustomer: What about in a different color?\nEmployee: We have the same style in blue and black, both in medium size.",
          questions: [
               {
                    question: "What size is the customer looking for?",
                    answers: [
                         { answer: "A. Small", isCorrect: false },
                         { answer: "B. Medium", isCorrect: true },
                         { answer: "C. Large", isCorrect: false },
                         { answer: "D. Extra large", isCorrect: false },
                    ],
               },
               {
                    question: "What alternative does the employee offer?",
                    answers: [
                         { answer: "A. A discount on the shirt", isCorrect: false },
                         { answer: "B. The same shirt in different colors", isCorrect: true },
                         { answer: "C. A similar style from another brand", isCorrect: false },
                         { answer: "D. Ordering the shirt online", isCorrect: false },
                    ],
               },
          ],
          explanation: "Đây là cuộc trò chuyện mua sắm thông thường. Cần chú ý đến thông tin về size, màu sắc và các gợi ý thay thế từ nhân viên bán hàng."
     },
     {
          type: LESSON_TYPE.CONVERSATION_PIECE,
          question: "You will hear a conversation between two office workers about a lunch meeting.",
          audio: {
               name: "conversation_3.mp3",
               url: "https://file-examples.com/storage/fe3e7fc7fe68462a19ac6ae/2017/11/file_example_MP3_700KB.mp3"
          },
          subtitle: "A: Are you free for lunch tomorrow? I'd like to discuss the new marketing strategy.\nB: Tomorrow is a bit difficult for me. How about Wednesday?\nA: Wednesday works perfectly. Should we meet at the Italian restaurant downtown?\nB: That sounds great. What time should we meet?",
          questions: [
               {
                    question: "What do they want to discuss?",
                    answers: [
                         { answer: "A. A new marketing strategy", isCorrect: true },
                         { answer: "B. The lunch menu", isCorrect: false },
                         { answer: "C. Office policies", isCorrect: false },
                         { answer: "D. Weekend plans", isCorrect: false },
                    ],
               },
               {
                    question: "When did they finally agree to meet?",
                    answers: [
                         { answer: "A. Today", isCorrect: false },
                         { answer: "B. Tomorrow", isCorrect: false },
                         { answer: "C. Wednesday", isCorrect: true },
                         { answer: "D. Next week", isCorrect: false },
                    ],
               },
          ],
          explanation: "Cuộc hội thoại về việc sắp xếp lịch ăn trưa để thảo luận công việc. Cần lưu ý đến việc thay đổi thời gian và địa điểm gặp mặt."
     },

     // Type: SHORT_TALK (3 questions)
     {
          type: LESSON_TYPE.SHORT_TALK,
          question: "You will hear an announcement about office building maintenance.",
          audio: {
               name: "short_talk_1.mp3",
               url: "https://file-examples.com/storage/fe3e7fc7fe68462a19ac6ae/2017/11/file_example_MP3_700KB.mp3"
          },
          subtitle: "Attention all building tenants. Please be advised that elevator maintenance will be conducted this Saturday from 9 AM to 4 PM. During this time, elevators will be out of service. We recommend using the stairs or planning your visits accordingly. The building management apologizes for any inconvenience this may cause. Emergency contacts will be available at the front desk throughout the maintenance period.",
          questions: [
               {
                    question: "When will the elevator maintenance take place?",
                    answers: [
                         { answer: "A. This Friday", isCorrect: false },
                         { answer: "B. This Saturday", isCorrect: true },
                         { answer: "C. Next Monday", isCorrect: false },
                         { answer: "D. Next weekend", isCorrect: false },
                    ],
               },
               {
                    question: "How long will the maintenance last?",
                    answers: [
                         { answer: "A. 4 hours", isCorrect: false },
                         { answer: "B. 6 hours", isCorrect: false },
                         { answer: "C. 7 hours", isCorrect: true },
                         { answer: "D. 8 hours", isCorrect: false },
                    ],
               },
               {
                    question: "What alternative is suggested?",
                    answers: [
                         { answer: "A. Wait until Monday", isCorrect: false },
                         { answer: "B. Use the stairs", isCorrect: true },
                         { answer: "C. Come back later", isCorrect: false },
                         { answer: "D. Contact building management", isCorrect: false },
                    ],
               },
          ],
          explanation: "Đây là thông báo về bảo trì thang máy. Cần chú ý đến thời gian cụ thể, thời lượng và các gợi ý thay thế được đưa ra."
     },
     {
          type: LESSON_TYPE.SHORT_TALK,
          question: "You will hear a weather forecast for the upcoming week.",
          audio: {
               name: "short_talk_2.mp3",
               url: "https://file-examples.com/storage/fe3e7fc7fe68462a19ac6ae/2017/11/file_example_MP3_700KB.mp3"
          },
          subtitle: "Good morning. Here's your 5-day weather forecast. Today will be partly cloudy with a high of 25 degrees. Tomorrow, expect scattered showers in the afternoon with temperatures dropping to 22 degrees. Wednesday through Friday will see clear skies and warming temperatures, reaching a high of 28 degrees by Friday. Perfect weather for outdoor activities this weekend. Don't forget your umbrella for tomorrow's afternoon showers.",
          questions: [
               {
                    question: "What is today's weather like?",
                    answers: [
                         { answer: "A. Rainy", isCorrect: false },
                         { answer: "B. Partly cloudy", isCorrect: true },
                         { answer: "C. Clear skies", isCorrect: false },
                         { answer: "D. Very windy", isCorrect: false },
                    ],
               },
               {
                    question: "When will it rain?",
                    answers: [
                         { answer: "A. This afternoon", isCorrect: false },
                         { answer: "B. Tomorrow morning", isCorrect: false },
                         { answer: "C. Tomorrow afternoon", isCorrect: true },
                         { answer: "D. Wednesday", isCorrect: false },
                    ],
               },
               {
                    question: "What is the highest temperature mentioned?",
                    answers: [
                         { answer: "A. 22 degrees", isCorrect: false },
                         { answer: "B. 25 degrees", isCorrect: false },
                         { answer: "C. 26 degrees", isCorrect: false },
                         { answer: "D. 28 degrees", isCorrect: true },
                    ],
               },
          ],
          explanation: "Đây là bản tin dự báo thời tiết 5 ngày. Cần nghe kỹ các thông tin về nhiệt độ, điều kiện thời tiết cho từng ngày cụ thể."
     },
     {
          type: LESSON_TYPE.SHORT_TALK,
          question: "You will hear an announcement about a special promotion at a department store.",
          audio: {
               name: "short_talk_3.mp3",
               url: "https://file-examples.com/storage/fe3e7fc7fe68462a19ac6ae/2017/11/file_example_MP3_700KB.mp3"
          },
          subtitle: "Attention shoppers! This weekend only, we're offering 30% off all winter clothing on the second floor. This includes coats, sweaters, and boots. The sale starts Saturday morning at 9 AM and ends Sunday at 6 PM. Additionally, customers spending over $200 will receive a free gift with purchase. Don't miss this limited-time offer to update your winter wardrobe at great prices.",
          questions: [
               {
                    question: "What percentage discount is being offered?",
                    answers: [
                         { answer: "A. 20%", isCorrect: false },
                         { answer: "B. 25%", isCorrect: false },
                         { answer: "C. 30%", isCorrect: true },
                         { answer: "D. 40%", isCorrect: false },
                    ],
               },
               {
                    question: "Where can you find the sale items?",
                    answers: [
                         { answer: "A. First floor", isCorrect: false },
                         { answer: "B. Second floor", isCorrect: true },
                         { answer: "C. Third floor", isCorrect: false },
                         { answer: "D. All floors", isCorrect: false },
                    ],
               },
               {
                    question: "What additional benefit is offered?",
                    answers: [
                         { answer: "A. Free parking", isCorrect: false },
                         { answer: "B. Free gift with purchase over $200", isCorrect: true },
                         { answer: "C. Extended store hours", isCorrect: false },
                         { answer: "D. Free alterations", isCorrect: false },
                    ],
               },
          ],
          explanation: "Đây là thông báo khuyến mãi tại cửa hàng bách hóa. Cần chú ý đến tỷ lệ giảm giá, vị trí hàng hóa, thời gian khuyến mãi và các ưu đãi bổ sung."
     },

     // Type: STAGE_FINAL_TEST (3 questions - mix of different types)
     {
          type: LESSON_TYPE.STAGE_FINAL_TEST,
          question: "Complete the sentence: The company's profits have .............. significantly this quarter.",
          answers: [
               { answer: "A. increase", isCorrect: false },
               { answer: "B. increased", isCorrect: true },
               { answer: "C. increasing", isCorrect: false },
               { answer: "D. increases", isCorrect: false },
          ],
          explanation: "Đây là câu hỏi trong bài test tổng kết giai đoạn. Cần sử dụng thì hiện tại hoàn thành với 'have + past participle'. 'Have increased' là đáp án đúng."
     },
     {
          type: LESSON_TYPE.STAGE_FINAL_TEST,
          question: "Listen to the short announcement and answer the question that follows.",
          audio: {
               name: "final_test_2.mp3",
               url: "https://file-examples.com/storage/fe3e7fc7fe68462a19ac6ae/2017/11/file_example_MP3_700KB.mp3"
          },
          subtitle: "The library will be closed for inventory from December 20th to 25th. All books must be returned by December 19th.",
          questions: [
               {
                    question: "When must books be returned?",
                    answers: [
                         { answer: "A. December 19th", isCorrect: true },
                         { answer: "B. December 20th", isCorrect: false },
                         { answer: "C. December 25th", isCorrect: false },
                         { answer: "D. December 26th", isCorrect: false },
                    ],
               },
          ],
          explanation: "Đây là câu hỏi nghe hiểu trong bài test cuối giai đoạn. Thông báo nói rõ sách phải được trả trước ngày đóng cửa, tức là ngày 19 tháng 12."
     },
     {
          type: LESSON_TYPE.STAGE_FINAL_TEST,
          question: "Read the following notice and answer the questions.",
          imageUrl: "/assets/images/form.png",
          questions: [
               {
                    question: "What type of document is this?",
                    answers: [
                         { answer: "A. An application form", isCorrect: true },
                         { answer: "B. A survey questionnaire", isCorrect: false },
                         { answer: "C. A registration card", isCorrect: false },
                         { answer: "D. An identification document", isCorrect: false },
                    ],
               },
               {
                    question: "What is required to complete this?",
                    answers: [
                         { answer: "A. Personal information", isCorrect: true },
                         { answer: "B. Payment details", isCorrect: false },
                         { answer: "C. Work experience", isCorrect: false },
                         { answer: "D. Educational background", isCorrect: false },
                    ],
               },
          ],
          explanation: "Đây là câu hỏi đọc hiểu kết hợp với hình ảnh trong bài test tổng kết. Cần quan sát hình ảnh form và trả lời các câu hỏi về loại tài liệu và thông tin cần thiết."
     },
];

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

async function getNextQuestionNumber() {
     const lastQuestion = await QuestionModel.findOne().sort({ questionNumber: -1 });
     return lastQuestion ? lastQuestion.questionNumber + 1 : 1;
}

async function seedNewQuestions() {
     await connectDB();

     try {
          questionDbIdCounter = await getNextQuestionNumber();
          console.log(`Starting questionNumber from: ${questionDbIdCounter}`);

          const questionsToInsert = newQuestionsData.map((q) => ({
               ...q,
               questionNumber: questionDbIdCounter++,
          }));

          await QuestionModel.insertMany(questionsToInsert);
          console.log(`${questionsToInsert.length} new questions seeded successfully.`);

          // Show summary of added questions by type
          const summary = {};
          questionsToInsert.forEach(q => {
               summary[q.type] = (summary[q.type] || 0) + 1;
          });

          console.log('\nSummary of added questions:');
          Object.entries(summary).forEach(([type, count]) => {
               console.log(`${type}: ${count} questions`);
          });

     } catch (error) {
          console.error('Error seeding new questions:', error);
     } finally {
          await mongoose.disconnect();
          console.log('MongoDB disconnected.');
     }
}

seedNewQuestions(); 