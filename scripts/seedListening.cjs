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
          question: { type: String, sparse: true }, // Main question text or passage
          audio: {
               name: String,
               url: String,
          },
          imageUrl: String,
          answers: [AnswerSchema], // For single, direct questions
          questions: [SubQuestionSchema], // For passages with multiple related questions
          subtitle: String,
          explanation: String,
     },
     { timestamps: true }
);

const QuestionModel = mongoose.model('Question', QuestionSchema);

let questionDbIdCounter = 0;

const questionsData = [
     // Type: FILL_IN_THE_BLANK_QUESTION (6 questions)
     {
          type: LESSON_TYPE.FILL_IN_THE_BLANK_QUESTION,
          question: "Its............into Brazil has given Darrow Textiles Ltd. an advantage over much of its competition.",
          answers: [
               { answer: "A. expansion", isCorrect: true },
               { answer: "B. process", isCorrect: false },
               { answer: "C. creation", isCorrect: false },
               { answer: "D. action", isCorrect: false },
          ],
          explanation: "Đáp án A 'expansion' (sự mở rộng) là đúng vì câu nói về việc công ty mở rộng hoạt động kinh doanh vào Brazil, điều này mang lại lợi thế cạnh tranh. 'Expansion into' là cụm từ cố định có nghĩa là 'mở rộng vào'."
     },
     {
          type: LESSON_TYPE.FILL_IN_THE_BLANK_QUESTION,
          question: "Employees at NC media co., Ltd............donate to local charities by hosting Fund-raising parties.",
          answers: [
               { answer: "A. regularity", isCorrect: false },
               { answer: "B. regularize", isCorrect: false },
               { answer: "C. regularities", isCorrect: false },
               { answer: "D. regularly", isCorrect: true },
          ],
          explanation: "Đáp án D 'regularly' (thường xuyên) là đúng vì đây là trạng từ bổ nghĩa cho động từ 'donate'. Câu có nghĩa là nhân viên thường xuyên quyên góp cho tổ chức từ thiện địa phương bằng cách tổ chức các bữa tiệc gây quỹ."
     },
     {
          type: LESSON_TYPE.FILL_IN_THE_BLANK_QUESTION,
          question: "From winning an Olympic gold medal in 2000 to becoming an NBA champion in 2008, Kevin Garnet has shown............to be one of the most talented players.",
          answers: [
               { answer: "A. he", isCorrect: false },
               { answer: "B. him", isCorrect: false },
               { answer: "C. himself", isCorrect: true },
               { answer: "D. his", isCorrect: false },
          ],
          explanation: "Đáp án C 'himself' (bản thân anh ấy) là đúng. Đây là đại từ phản thân, được sử dụng khi chủ ngữ và tân ngữ là cùng một người. Kevin Garnet đã chứng minh bản thân mình là một trong những cầu thủ tài năng nhất."
     },
     {
          type: LESSON_TYPE.FILL_IN_THE_BLANK_QUESTION,
          question: "An accurate............of surveys is imperative to building a good understanding of customer needs.",
          answers: [
               { answer: "A. opportunity", isCorrect: false },
               { answer: "B. contract", isCorrect: false },
               { answer: "C. destination", isCorrect: false },
               { answer: "D. analysis", isCorrect: true },
          ],
          explanation: "Đáp án D 'analysis' (phân tích) là đúng. Cụm từ 'analysis of surveys' có nghĩa là phân tích các cuộc khảo sát, điều này là cần thiết để hiểu rõ nhu cầu của khách hàng. Các đáp án khác không phù hợp về mặt ngữ nghĩa."
     },
     {
          type: LESSON_TYPE.FILL_IN_THE_BLANK_QUESTION,
          question: "QIB will work............to maintain sustainable growth and expansion plans.",
          answers: [
               { answer: "A. Persisted", isCorrect: false },
               { answer: "B. Persistent", isCorrect: false },
               { answer: "C. Persistently", isCorrect: true },
               { answer: "D. Persistence", isCorrect: false },
          ],
          explanation: "Đáp án C 'Persistently' (một cách kiên trì) là đúng. Đây là trạng từ bổ nghĩa cho động từ 'work', chỉ cách thức làm việc. QIB sẽ làm việc một cách kiên trì để duy trì kế hoạch tăng trưởng và mở rộng bền vững."
     },
     {
          type: LESSON_TYPE.FILL_IN_THE_BLANK_QUESTION,
          question: "The president has just realized that the launch of our new product must be postponed owing to............conditions in the market.",
          answers: [
               { answer: "A. unwilling", isCorrect: false },
               { answer: "B. unfavorable", isCorrect: true },
               { answer: "C. opposing", isCorrect: false },
               { answer: "D. reluctant", isCorrect: false },
          ],
          explanation: "Đáp án B 'unfavorable' (không thuận lợi) là đúng. Cụm từ 'unfavorable conditions' có nghĩa là điều kiện không thuận lợi trên thị trường, đây là lý do hợp lý để hoãn ra mắt sản phẩm mới. Các tính từ khác không phù hợp để mô tả điều kiện thị trường."
     },

     // Type: FILL_IN_THE_PARAGRAPH (3 questions, each with multiple sub-questions)
     {
          type: LESSON_TYPE.FILL_IN_THE_PARAGRAPH,
          question: "A long time ago, this part of the town used to be a place where people came to relax and get away from their stress. Although this was ....(41)... a shelter for people to escape, it has now become a chaotic and noisy market area. Up until a few years ago, it wasn't as bad as it is now. Although it is true that some people in the neighborhood supported the expansion of the market a few years ago, now most of them....(42)... that it has gotten out of control and created many serious problems for the area. ....(43)...., it might have already gotten too far out of control. What we really need right now is not a mere intervention by civilians but strong action from the mayor's office.",
          explanation: "Đây là bài tập điền từ vào đoạn văn về sự thay đổi của một khu vực từ nơi nghỉ ngơi thành khu chợ ồn ào. Cần chú ý đến ngữ cảnh và mối liên hệ logic giữa các câu để chọn từ phù hợp.",
          questions: [
               {
                    question: "Select the best option for blank (41).",
                    answers: [
                         { answer: "(A) just", isCorrect: false },
                         { answer: "(B) once", isCorrect: true },
                         { answer: "(C) such", isCorrect: false },
                         { answer: "(D) likely", isCorrect: false },
                    ],
               },
               {
                    question: "Select the best option for blank (42).",
                    answers: [
                         { answer: "(A) would have agreed", isCorrect: false },
                         { answer: "(B) would agree", isCorrect: true },
                         { answer: "(C) has agree", isCorrect: false },
                         { answer: "(D) were agreeing", isCorrect: false },
                    ],
               },
               {
                    question: "Select the best option for blank (43).",
                    answers: [
                         { answer: "(A) In fact", isCorrect: true },
                         { answer: "(B) In spite of", isCorrect: false },
                         { answer: "(C) On the other hand", isCorrect: false },
                         { answer: "(D) Even though", isCorrect: false },
                    ],
               },
          ],
     },
     {
          type: LESSON_TYPE.FILL_IN_THE_PARAGRAPH,
          question: "Want to discover the latest trends in International Business? Sign up for our free workshops, to be held October 2-6. Register now online! Starting Sept. 1, employees will be able to access a new workshop registration system at www.employeetraining.com. To enter the site, a staff ID number and password are required. If you don't already have these, contact your immediate supervisor. Employees are encouraged to sign up early for workshops, as the number of participants is....(44).... to 50 per session. Provided that seats remain available, employees can easily register for sessions. If a session is ...(45)...., however, staff can request that they be contacted if a space opens up. The upcoming sessions......(46)..... on the 5th floor of the Stafford Suite building.",
          explanation: "Đây là thông báo về workshop kinh doanh quốc tế. Cần chú ý đến các cấu trúc ngữ pháp như bị động, từ hạn định và thì động từ phù hợp với ngữ cảnh.",
          questions: [
               {
                    question: "Select the best option for blank (44).",
                    answers: [
                         { answer: "(A) limiting", isCorrect: false },
                         { answer: "(B) limited", isCorrect: true },
                         { answer: "(C) limitedly", isCorrect: false },
                         { answer: "(D) limitation", isCorrect: false },
                    ],
               },
               {
                    question: "Select the best option for blank (45).",
                    answers: [
                         { answer: "(A) valid", isCorrect: false },
                         { answer: "(B) full", isCorrect: true },
                         { answer: "(C) finished", isCorrect: false },
                         { answer: "(D) over", isCorrect: false },
                    ],
               },
               {
                    question: "Select the best option for blank (46).",
                    answers: [
                         { answer: "(A) have been held", isCorrect: false },
                         { answer: "(B) will be held", isCorrect: true },
                         { answer: "(C) are being held", isCorrect: false },
                         { answer: "(D) were being held", isCorrect: false },
                    ],
               },
          ],
     },
     {
          type: LESSON_TYPE.FILL_IN_THE_PARAGRAPH,
          question: "Security Inc. is the most trusted name in the sales and service of financial equipment and automated teller machines. Offering a degree of personal yet professional service that is unrivaled in the financial industry today, all employees at Security Inc. are...(50)... to customer service and your complete satisfaction. We offer flexibility not found anywhere else in the financial services industry. Security Inc. can assemble a unique financial equipment package across multiple manufacturers' product lines or tailor a financial equipment service program to...(51)... your specific business needs. We offer the widest array of financial equipment products, services and supplies. This diversity in product and service offerings, combined with our unrivaled knowledge in the sale and service of automated teller machines, provides a ....(52).... edge and real value for our customers.",
          explanation: "Đây là bài giới thiệu về công ty Security Inc. chuyên về thiết bị tài chính. Cần chú ý đến các cấu trúc collocation và từ vựng chuyên ngành trong lĩnh vực dịch vụ tài chính.",
          questions: [
               {
                    question: "Select the best option for blank (50).",
                    answers: [
                         { answer: "(A) dedicated", isCorrect: true },
                         { answer: "(B) using", isCorrect: false },
                         { answer: "(C) instructed", isCorrect: false },
                         { answer: "(D) dependent", isCorrect: false },
                    ],
               },
               {
                    question: "Select the best option for blank (51).",
                    answers: [
                         { answer: "(A) hope", isCorrect: false },
                         { answer: "(B) tend", isCorrect: false },
                         { answer: "(C) make up", isCorrect: false },
                         { answer: "(D) meet", isCorrect: true },
                    ],
               },
               {
                    question: "Select the best option for blank (52).",
                    answers: [
                         { answer: "(A) excellent", isCorrect: false },
                         { answer: "(B) competitive", isCorrect: true },
                         { answer: "(C) comparable", isCorrect: false },
                         { answer: "(D) commensurate", isCorrect: false },
                    ],
               },
          ],
     },

     // Type: READ_AND_UNDERSTAND (5 questions)
     {
          type: LESSON_TYPE.READ_AND_UNDERSTAND,
          question: "RICH TO APPEAR AS THE FIRST GUEST ON THE RACHEL RATIGAN SHOW\nAdrienne Rich, who is an alumna of Jackson Madison High School will be appearing on the BBC's new talk show, The Rachel Ratigan Show, this Saturday night. The Rachel Ratigan Show is premiering this week and Rich is honored to be the first guest on the show. She will be interviewed about her second novel, A Woman Observed, which depicts a 35-year-old divorced woman living in a city as observed through the eyes of other characters. The book has hit No. 14 on the New York Times Bestseller List and has been praised by critics as the most commercially successful feminist novel this year. To watch the show, tune in to channel 4 at 9 P.M. this Saturday.",
          explanation: "Đây là thông báo về việc Adrienne Rich xuất hiện trên chương trình talk show mới. Cần đọc kỹ để nắm được mục đích của thông báo và thông tin về tác giả cũng như tác phẩm của bà.",
          questions: [
               {
                    question: "What is the purpose of the announcement?",
                    answers: [
                         { answer: "A. To criticize a feminist novel", isCorrect: false },
                         { answer: "B. To describe a guest of a television show", isCorrect: false },
                         { answer: "C. To introduce a newly launched television program", isCorrect: true },
                         { answer: "D. To raise sales of a novel", isCorrect: false },
                    ],
               },
               {
                    question: "What can be inferred about Adrienne Rich?",
                    answers: [
                         { answer: "A. She has written a Geography.", isCorrect: false },
                         { answer: "B. She hasn't yet graduated from high school.", isCorrect: false },
                         { answer: "C. Her writing is fictional.", isCorrect: true },
                         { answer: "D. Her book has been strictly criticized.", isCorrect: false },
                    ],
               },
          ],
     },
     {
          type: LESSON_TYPE.READ_AND_UNDERSTAND,
          question: "Beginning this year, Renaissance Strategy Inc. will provide financial aid to fulltime employees with children in school. Financial aid is available to candidates from elementary school to college, but homeschooling is not included. There are also certain requirements that you must meet in order to be eligible for financial aid. Eligible candidates must be enrolled as full-time students and maintain passing grades. Candidates must also submit a copy of proof of enrollment along with application forms which you can find at the front of the administration division. How much aid your child receives will depend on your financial need and on the amount of other aid you receive. Aid will be paid directly to the school on a yearly basis. If you need more information or have any questions about the program, please call 123-5656.",
          explanation: "Đây là thông báo về chương trình hỗ trợ tài chính cho con em nhân viên. Cần chú ý đến các điều kiện đủ điều kiện và quy trình đăng ký để trả lời chính xác các câu hỏi.",
          questions: [
               {
                    question: "What is the announcement intended for?",
                    answers: [
                         { answer: "A. Giving information on government financial aid", isCorrect: false },
                         { answer: "B. Motivating employees to pursue an academic career", isCorrect: false },
                         { answer: "C. Strengthening the scholarship eligibility requirements", isCorrect: false },
                         { answer: "D. Supporting the children of employees", isCorrect: true },
                    ],
               },
               {
                    question: "What is NOT indicated about applying for financial aid?",
                    answers: [
                         { answer: "A. The sum of financial support received is determined by a recipient's performance.", isCorrect: true },
                         { answer: "B. Candidates must be full-time students.", isCorrect: false },
                         { answer: "C. A certificate to show status of enrollment is essential.", isCorrect: false },
                         { answer: "D. Candidates who are homeschooled are not eligible.", isCorrect: false },
                    ],
               },
          ],
     },
     {
          type: LESSON_TYPE.READ_AND_UNDERSTAND,
          question: "Intersil Corp., manufacturer of high-performance wireless networking solutions, announced today that it will relocate its corporate headquarters from Irvine, Calif. to Milpitas, effective December 1, 2010. The company plans to accommodate the expanding operation with the relocation of the finance, human resources, IT and sales operations facilities. Intersil Corp. cited Milpitas' skilled work force, good access to an international airport, and the generous tax incentives offered by the state government and the cost-effective environment as the main reasons for choosing the city for its new head office. The move is expected to generate up to 90 new high-paying jobs for local residents. With an average annual salary of $10,000, Intersil's annual payroll for workers in Milpitas will surpass $4 million. This is good news for the city. \"Our attractiveness as a place to live and work, makes this city an excellent home for Intersil where they can prosper and grow well into the future. Also, Intersil's impressive salaries will significantly impact the local economy,\" said Mayor Ronald Lopez. Although the relocation will cost Intersil Corp. a significant amount of money, executives feel it is a worthwhile investment. \"We can continue to execute our plan towards profitability, while building our company for the future in the new site,\" CEO Adriana Cruz said in a press statement.",
          explanation: "Đây là bài báo về việc công ty Intersil Corp. chuyển trụ sở chính. Cần nắm được thông tin chính về lý do chuyển, tác động kinh tế và quan điểm của các bên liên quan.",
          questions: [
               {
                    question: "What is the article mainly about?",
                    answers: [
                         { answer: "A. The state of a city's local economy", isCorrect: false },
                         { answer: "B. The rise of the employment rate", isCorrect: false },
                         { answer: "C. The relocation of a company", isCorrect: true },
                         { answer: "D. The improvement of an existing tax law", isCorrect: false },
                    ],
               },
               {
                    question: "What is indicated about Intersil Corp?",
                    answers: [
                         { answer: "A. The existing headquarters is in Milpitas.", isCorrect: false },
                         { answer: "B. Its business is expanding.", isCorrect: true },
                         { answer: "C. It has a cost-effective environment.", isCorrect: false },
                         { answer: "D. It has highly skilled workers.", isCorrect: false },
                    ],
               },
               {
                    question: "The word \"surpass\" in paragraph 3, line 3, is closest in meaning to",
                    answers: [
                         { answer: "A. exceed", isCorrect: true },
                         { answer: "B. include", isCorrect: false },
                         { answer: "C. develop", isCorrect: false },
                         { answer: "D. accelerate", isCorrect: false },
                    ],
               },
               {
                    question: "How does the CEO feel about the company's plan?",
                    answers: [
                         { answer: "A. anxious", isCorrect: false },
                         { answer: "B. angry", isCorrect: false },
                         { answer: "C. depressed", isCorrect: false },
                         { answer: "D. confident", isCorrect: true },
                    ],
               },
          ],
     },
     {
          type: LESSON_TYPE.READ_AND_UNDERSTAND,
          question: "ANNOUNCEMENT:\nA month ago, you responded enthusiastically to the survey about the fitness center. Based on your recommendations, new changes will be planned. They will take effect on January 2. Finally, the employee fitness center will be open on extra three hours Monday through Thursday. Also, long-time members will be surely pleased to hear that the popular personal manager Tony Stumpo will be promoted to the manager of the fitness center. We encourage more employees to take advantage of what the center has to offer. Memberships will continue to be subsidized and remain at $20 per month. And for a limited time only, we offer a special rate for new members. Members who sign up before December 31 will be charged only $15 per month for their first year. Contact Tony Stumpo to sign up at this reduced rate.\n\nSCHEDULE: AGPSX EMPLOYEES FITNESS CENTER NEW SCHEDULE\nHours of Operation: Monday-Friday 6:00 A.M. - 9:00 P.M., Saturday & Sunday: CLOSED ALL DAY.\nGroup Classes:\nMonday: 12:00-1:00 P.M.\nTuesday: 6:00 - 7:00 P.M.\nWednesday: 12:00-1:00 P.M.\nThursday: 6:00 - 7:00 P.M.\nFriday: 7:00 - 8:30 A.M.\nSaturday: 9:00 - 10:30 A.M.\nReminders:\n1. Please do not use equipment for more than 30 minutes if other members are waiting to use it.\n2. Members may bring a guest per visit. Guests under 18 should be accompanied by a member at all times.\n3. Registration is not required for class but class size is limited to 10 participants. Please arrive early to secure a place. Coats and bags should be left in the locker room so that other participants have plenty of space.\n4. New members are required to complete an orientation class before they use equipment. Members must carry a membership card at all times while they are in the center.",
          explanation: "Đây là thông báo về các thay đổi tại trung tâm thể dục nhân viên. Bao gồm cả announcement và schedule chi tiết. Cần đọc kỹ cả hai phần để trả lời đúng các câu hỏi về giờ mở cửa, quy định và các thay đổi mới.",
          questions: [
               {
                    question: "What is the purpose of this message?",
                    answers: [
                         { answer: "A. To notify employees of the closure of the fitness center", isCorrect: false },
                         { answer: "B. To inform employees of current changes at a fitness center", isCorrect: true },
                         { answer: "C. To ask for suggestions about classes", isCorrect: false },
                         { answer: "D. To complain about a trainer", isCorrect: false },
                    ]
               },
               {
                    question: "What is TRUE: based on this e-mail?",
                    answers: [
                         { answer: "A. Tony Stumpo will be manager of the fitness center.", isCorrect: true },
                         { answer: "B. Sylvie Hamm is a new employee of the company.", isCorrect: false },
                         { answer: "C. AGPBX Corporation employees requested weekend hours for operation of the fitness center.", isCorrect: false },
                         { answer: "D. AGAPBX Corporation employees attend free fitness classes.", isCorrect: false },
                    ]
               },
               {
                    question: "What will happen from January 2?",
                    answers: [
                         { answer: "A. Employees can attend free fitness classes.", isCorrect: false },
                         { answer: "B. The new equipment will be delivered.", isCorrect: false },
                         { answer: "C. The fitness center will be open extra hours.", isCorrect: true },
                         { answer: "D. The fitness center will be closed for renovations.", isCorrect: false },
                    ]
               },
               {
                    question: "Who is asked NOT to use the equipment (under certain conditions)?",
                    answers: [
                         { answer: "A. People who need it for an hour (if others are waiting)", isCorrect: true },
                         { answer: "B. Women", isCorrect: false },
                         { answer: "C. People under 18 years old (unless accompanied)", isCorrect: false },
                         { answer: "D. Seniors", isCorrect: false },
                    ]
               },
               {
                    question: "What must a newcomer do to use this facility?",
                    answers: [
                         { answer: "A. See their doctor", isCorrect: false },
                         { answer: "B. Take the orientation session first", isCorrect: true },
                         { answer: "C. Register for fitness classes", isCorrect: false },
                         { answer: "D. Pay for one-year membership", isCorrect: false },
                    ]
               }
          ]
     },
     {
          type: LESSON_TYPE.READ_AND_UNDERSTAND,
          question: "CATALOG抜粋 (Fall Catalog p. 35 Business Fashions):\nMen's Dress Shirts. Solid color. Item #387. 100% combed cotton. Colors: white, cream, light blue, light green. Sizes S M L XL. $55.\nMen's Dress Shirts. Striped. Item #387A. Same as above, but with a thin stripe. Colors: red on white, blue on white, green on cream, brown on cream. Sizes S M L XL. $65.\nStriped Ties. Item #765. Imported silk. Colors: burgundy red/navy blue, moss green/navy blue, moss green/golden yellow, black/bright red. $30.\nCashmere Sweaters. Item #521. 100% genuine cashmere, V neck. Colors: burgundy red, charcoal gray, midnight black. $150.\n\nORDER FORM抜粋:\nDescription | Color | Size | Item No. | Quantity | Price\nmen's dress shirt-striped | blue/white | L | 387A | 2 | $110\nsilk tie | red/blue | - | 765 | 3 | $90\ncashmere sweater | black | L | 521 | 1 | $150\nSub total: $350\nPayment Method: Check (X)\nShipping Charges: up to $200: $12.50; up to $400: $20.00; over $400: no charge.\nPlease allow six weeks for delivery. *Cash and money orders not accepted.",
          explanation: "Đây là bài tập đọc hiểu về catalog thời trang và đơn đặt hàng. Cần so sánh thông tin giữa catalog và order form để tìm ra sai sót, tính toán chính xác số lượng và giá cả.",
          questions: [
               {
                    question: "Which item is available in only three colors?",
                    answers: [
                         { answer: "A. Solid color men's dress shirts", isCorrect: false },
                         { answer: "B. Striped men's dress shirts", isCorrect: false },
                         { answer: "C. Striped sweaters", isCorrect: false },
                         { answer: "D. Sweaters (Cashmere Sweaters)", isCorrect: true },
                    ]
               },
               {
                    question: "What mistake did Mr. Simpson make with his shirt order?",
                    answers: [
                         { answer: "A. He forgot to specify a size.", isCorrect: false },
                         { answer: "B. He didn't write the item number.", isCorrect: false },
                         { answer: "C. He ordered a color that isn't available.", isCorrect: false },
                         { answer: "D. He wrote the wrong price.", isCorrect: true },
                    ]
               },
               {
                    question: "How many ties did Mr. Simpson order?",
                    answers: [
                         { answer: "A. 1", isCorrect: false },
                         { answer: "B. 2", isCorrect: false },
                         { answer: "C. 3", isCorrect: true },
                         { answer: "D. 4", isCorrect: false },
                    ]
               },
               {
                    question: "How much should Mr. Simpson pay for shipping?",
                    answers: [
                         { answer: "A. $20", isCorrect: true },
                         { answer: "B. $12.50", isCorrect: false },
                         { answer: "C. $22.50", isCorrect: false },
                         { answer: "D. $0", isCorrect: false },
                    ]
               },
               {
                    question: "How will Mr. Simpson pay for his order?",
                    answers: [
                         { answer: "A. Check", isCorrect: true },
                         { answer: "B. Debit card", isCorrect: false },
                         { answer: "C. Money order", isCorrect: false },
                         { answer: "D. Cash", isCorrect: false },
                    ]
               }
          ]
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

async function seedQuestions() {
     await connectDB();

     try {
          // Clear existing questions before seeding
          await QuestionModel.deleteMany({});
          console.log('Cleared existing questions.');

          questionDbIdCounter = await getNextQuestionNumber();
          console.log(`Starting questionNumber from: ${questionDbIdCounter}`);

          const questionsToInsert = questionsData.map((q) => ({
               ...q,
               questionNumber: questionDbIdCounter++,
          }));

          await QuestionModel.insertMany(questionsToInsert);
          console.log(`${questionsToInsert.length} questions seeded successfully.`);
     } catch (error) {
          console.error('Error seeding questions:', error);
     } finally {
          await mongoose.disconnect();
          console.log('MongoDB disconnected.');
     }
}

seedQuestions(); 