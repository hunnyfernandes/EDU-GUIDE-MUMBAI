const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { promisePool } = require('../config/database');

// Initialize AI clients
let openai = null;
let gemini = null;
let geminiModel = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log('✅ OpenAI (ChatGPT) initialized');
}

if (process.env.GEMINI_API_KEY) {
  try {
    gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelName = process.env.GEMINI_MODEL || 'gemini-pro';
    geminiModel = gemini.getGenerativeModel({ model: modelName });
    console.log(`✅ Google Gemini (${modelName}) initialized`);
  } catch (error) {
    console.error('❌ Failed to initialize Gemini:', error.message);
  }
}

// Get active AI provider
const getActiveProvider = () => {
  const provider = (process.env.AI_PROVIDER || 'openai').toLowerCase();

  if (provider === 'gemini' && geminiModel) {
    return 'gemini';
  } else if (provider === 'openai' && openai) {
    return 'openai';
  } else if (geminiModel) {
    return 'gemini'; // Fallback to Gemini if OpenAI not available
  } else if (openai) {
    return 'openai'; // Fallback to OpenAI if Gemini not available
  }

  return null; // No provider available
};

/**
 * Search database for relevant information based on user query
 */
const searchDatabase = async (query, conversationHistory = []) => {
  const context = {
    colleges: [],
    courses: [],
    admission: [],
    placements: [],
    streams: [],
  };

  const searchTerm = query.toLowerCase();

  try {
    // Extract college names or course names from query and history
    const allQueries = [query, ...conversationHistory.map(msg => msg.content || '')].join(' ').toLowerCase();

    // Search colleges
    const [colleges] = await promisePool.query(
      `SELECT college_id, college_name, college_type, city, description, 
              average_rating, total_reviews, website, established_year, address
       FROM colleges 
       WHERE status = 'active' 
       AND (college_name LIKE ? OR description LIKE ? OR city LIKE ?)
       ORDER BY average_rating DESC, total_reviews DESC
       LIMIT 5`,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );

    context.colleges = colleges;

    // Search courses
    const [courses] = await promisePool.query(
      `SELECT c.course_name, c.course_code, c.degree_type, c.fees_per_year, 
              c.duration_years, c.eligibility, c.description,
              col.college_name, col.college_id, col.city, s.stream_name
       FROM courses c
       INNER JOIN colleges col ON c.college_id = col.college_id
       INNER JOIN streams s ON c.stream_id = s.stream_id
       WHERE c.status = 'active' AND col.status = 'active'
       AND (c.course_name LIKE ? OR s.stream_name LIKE ? OR c.description LIKE ? OR c.eligibility LIKE ?)
       ORDER BY col.average_rating DESC
       LIMIT 8`,
      [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
    );

    context.courses = courses;

    // Search streams
    const [streams] = await promisePool.query(
      `SELECT stream_id, stream_name, stream_code, description
       FROM streams
       WHERE stream_name LIKE ? OR description LIKE ?
       LIMIT 3`,
      [`%${query}%`, `%${query}%`]
    );

    context.streams = streams;

    // Search admission info
    if (searchTerm.includes('admission') || searchTerm.includes('apply') ||
      searchTerm.includes('cutoff') || searchTerm.includes('entrance') ||
      searchTerm.includes('eligibility') || searchTerm.includes('requirement')) {
      const [admission] = await promisePool.query(
        `SELECT ai.*, c.college_name, c.college_id, c.city
         FROM admission_info ai
         INNER JOIN colleges c ON ai.college_id = c.college_id
         WHERE c.status = 'active'
         ORDER BY c.average_rating DESC
         LIMIT 5`
      );

      context.admission = admission;
    }

    // Search placements
    if (searchTerm.includes('placement') || searchTerm.includes('salary') ||
      searchTerm.includes('package') || searchTerm.includes('recruiter') ||
      searchTerm.includes('company') || searchTerm.includes('job')) {
      const [placements] = await promisePool.query(
        `SELECT p.*, c.college_name, c.college_id, c.city
         FROM placements p
         INNER JOIN colleges c ON p.college_id = c.college_id
         WHERE c.status = 'active'
         ORDER BY p.academic_year DESC, p.average_package DESC
         LIMIT 5`
      );

      context.placements = placements;
    }

    // If we have college matches, get their detailed info
    if (colleges.length > 0) {
      const collegeIds = colleges.map(c => c.college_id);

      // Get admission info for matched colleges
      if (collegeIds.length > 0) {
        const placeholders = collegeIds.map(() => '?').join(',');
        const [admissionDetails] = await promisePool.query(
          `SELECT ai.*, c.college_name, c.college_id
           FROM admission_info ai
           INNER JOIN colleges c ON ai.college_id = c.college_id
           WHERE ai.college_id IN (${placeholders})`,
          collegeIds
        );
        context.admission = [...context.admission, ...admissionDetails];
      }

      // Get placement info for matched colleges
      if (collegeIds.length > 0) {
        const placeholders = collegeIds.map(() => '?').join(',');
        const [placementDetails] = await promisePool.query(
          `SELECT p.*, c.college_name, c.college_id
           FROM placements p
           INNER JOIN colleges c ON p.college_id = c.college_id
           WHERE p.college_id IN (${placeholders})
           ORDER BY p.academic_year DESC`,
          collegeIds
        );
        context.placements = [...context.placements, ...placementDetails];
      }
    }

  } catch (error) {
    console.error('Database search error:', error);
  }

  return context;
};

/**
 * Format context into a string for AI prompt
 */
const formatContext = (context) => {
  let contextText = '';

  if (context.colleges.length > 0) {
    contextText += '\n## Colleges Found:\n';
    context.colleges.forEach(college => {
      contextText += `- **${college.college_name}** (ID: ${college.college_id}): `;
      contextText += `${college.college_type} college in ${college.city || 'Mumbai'}. `;
      if (college.description) {
        contextText += `${college.description.substring(0, 250)}. `;
      }
      if (college.average_rating > 0) {
        contextText += `Rating: ${college.average_rating}/5 (${college.total_reviews} reviews). `;
      }
      if (college.established_year) contextText += `Established: ${college.established_year}. `;
      if (college.address) contextText += `Location: ${college.address.substring(0, 100)}. `;
      contextText += `\n`;
    });
  }

  if (context.courses.length > 0) {
    contextText += '\n## Courses Found:\n';
    context.courses.forEach(course => {
      contextText += `- **${course.course_name}** at ${course.college_name} (College ID: ${course.college_id}): `;
      contextText += `${course.degree_type} program in ${course.stream_name}. `;
      if (course.fees_per_year) contextText += `Fees: ₹${course.fees_per_year.toLocaleString('en-IN')}/year. `;
      if (course.duration_years) contextText += `Duration: ${course.duration_years} years. `;
      if (course.eligibility) contextText += `Eligibility: ${course.eligibility.substring(0, 200)}. `;
      if (course.description) contextText += `${course.description.substring(0, 150)}. `;
      contextText += `\n`;
    });
  }

  if (context.streams.length > 0) {
    contextText += '\n## Academic Streams:\n';
    context.streams.forEach(stream => {
      contextText += `- **${stream.stream_name}**: ${stream.description}\n`;
    });
  }

  if (context.admission.length > 0) {
    contextText += '\n## Admission Information:\n';
    context.admission.slice(0, 3).forEach(admission => {
      contextText += `- **${admission.college_name}** (College ID: ${admission.college_id}): `;
      if (admission.admission_process) {
        contextText += `Process: ${admission.admission_process.substring(0, 250)}. `;
      }
      if (admission.entrance_exam) contextText += `Entrance Exam: ${admission.entrance_exam}. `;
      if (admission.cutoff_info) contextText += `Cutoffs: ${admission.cutoff_info.substring(0, 200)}. `;
      if (admission.important_dates) contextText += `Important Dates: ${admission.important_dates.substring(0, 150)}. `;
      contextText += `\n`;
    });
  }

  if (context.placements.length > 0) {
    contextText += '\n## Placement Information:\n';
    context.placements.slice(0, 3).forEach(placement => {
      contextText += `- **${placement.college_name}** (College ID: ${placement.college_id}): `;
      if (placement.academic_year) contextText += `Year: ${placement.academic_year}. `;
      if (placement.placement_percentage) contextText += `Placement Rate: ${placement.placement_percentage}%. `;
      if (placement.average_package) contextText += `Avg Package: ₹${placement.average_package.toLocaleString('en-IN')}/year. `;
      if (placement.highest_package) contextText += `Highest: ₹${placement.highest_package.toLocaleString('en-IN')}/year. `;
      if (placement.top_recruiters) contextText += `Top Recruiters: ${placement.top_recruiters.substring(0, 200)}. `;
      contextText += `\n`;
    });
  }

  return contextText;
};

/**
 * Generate suggested follow-up questions based on query and context
 */
const generateSuggestedQuestions = (query, context) => {
  const suggestions = [];
  const lowerQuery = query.toLowerCase();

  if (context.colleges.length > 0) {
    const college = context.colleges[0];
    suggestions.push(`Tell me more about ${college.college_name}`);
    if (context.courses.length === 0) {
      suggestions.push(`What courses does ${college.college_name} offer?`);
    }
  }

  if (context.courses.length > 0 && !lowerQuery.includes('fee')) {
    suggestions.push(`What are the fees for ${context.courses[0].course_name}?`);
  }

  if (context.colleges.length === 0 && !lowerQuery.includes('college')) {
    suggestions.push(`Which colleges offer ${query.includes('engineering') ? 'engineering' : 'courses'}?`);
  }

  if (!lowerQuery.includes('admission') && context.admission.length === 0) {
    suggestions.push(`How do I apply to colleges?`);
  }

  if (!lowerQuery.includes('placement') && context.placements.length === 0 && context.colleges.length > 0) {
    suggestions.push(`What are the placement opportunities?`);
  }

  return suggestions.slice(0, 3);
};

/**
 * Generate AI response using OpenAI
 */
const generateOpenAIResponse = async (userQuery, context, conversationHistory = []) => {
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }

  const contextText = formatContext(context);
  const hasContext = context.colleges.length > 0 || context.courses.length > 0 ||
    context.admission.length > 0 || context.placements.length > 0;

  // Build conversation history for context
  const conversationContext = conversationHistory
    .slice(-6) // Last 6 messages for context
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');

  const systemPrompt = `You are an advanced AI assistant for Edu Guide Mumbai, a comprehensive college information platform in Mumbai, India.
Your role is to help students find detailed information about colleges, courses, admissions, placements, and make informed educational decisions.

**Guidelines:**
1. Be conversational, helpful, and empathetic - like ChatGPT
2. Use the provided database context when available, but don't mention it explicitly
3. Format responses in clear, well-structured markdown with proper headings, lists, and formatting
4. Use code blocks for structured data when helpful
5. Include specific details from the context (names, numbers, fees, ratings, etc.)
6. If information is incomplete, mention what you know and guide users to visit specific pages
7. Always include relevant website page links in markdown format: [Link Text](/path)
8. Use emojis sparingly and appropriately (1-2 per response max)
9. Be concise but comprehensive - aim for 200-400 words
10. If no relevant information is found, suggest browsing the website with helpful links

**Available Website Pages:**
- \`/colleges\` - Browse all colleges
- \`/colleges/:id\` - Specific college detail page (use college_id from context)
- \`/compare\` - Compare colleges side-by-side
- \`/dashboard\` - User dashboard (if logged in)

**Response Format:**
- Use markdown for formatting (headings, lists, bold, italic, code blocks)
- Use proper grammar and natural flow
- Structure information clearly with headings when discussing multiple topics
- Include specific links to college pages when mentioning colleges
- Use bullet points or numbered lists for multiple items`;

  const userPrompt = `${contextText || '\n**Note:** No specific information found in database for this query. Provide general guidance and suggest relevant website pages.'}

${conversationContext ? `\n**Previous conversation context:**\n${conversationContext}\n` : ''}

**User Question:** ${userQuery}

**Instructions:**
1. Provide a helpful, detailed response based on the context above
2. Use markdown formatting for clarity
3. Include relevant links to college pages or website sections
4. If information is partial, mention what you found and suggest visiting specific pages
5. Be conversational and helpful, similar to ChatGPT

Please provide your response:`;

  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};

/**
 * Generate AI response using Google Gemini
 */
const generateGeminiResponse = async (userQuery, context, conversationHistory = []) => {
  if (!geminiModel) {
    throw new Error('Gemini client not initialized');
  }

  const contextText = formatContext(context);
  const hasContext = context.colleges.length > 0 || context.courses.length > 0 ||
    context.admission.length > 0 || context.placements.length > 0;

  // Build conversation history for context
  const conversationParts = [];

  // Add conversation history
  conversationHistory.slice(-6).forEach(msg => {
    conversationParts.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    });
  });

  const systemInstruction = `You are an advanced AI assistant for Edu Guide Mumbai, a comprehensive college information platform in Mumbai, India.
Your role is to help students find detailed information about colleges, courses, admissions, placements, and make informed educational decisions.

**Guidelines:**
1. Be conversational, helpful, and empathetic - like ChatGPT
2. Use the provided database context when available, but don't mention it explicitly
3. Format responses in clear, well-structured markdown with proper headings, lists, and formatting
4. Use code blocks for structured data when helpful
5. Include specific details from the context (names, numbers, fees, ratings, etc.)
6. If information is incomplete, mention what you know and guide users to visit specific pages
7. Always include relevant website page links in markdown format: [Link Text](/path)
8. Use emojis sparingly and appropriately (1-2 per response max)
9. Be concise but comprehensive - aim for 200-400 words
10. If no relevant information is found, suggest browsing the website with helpful links

**Available Website Pages:**
- \`/colleges\` - Browse all colleges
- \`/colleges/:id\` - Specific college detail page (use college_id from context)
- \`/compare\` - Compare colleges side-by-side
- \`/dashboard\` - User dashboard (if logged in)

**Response Format:**
- Use markdown for formatting (headings, lists, bold, italic, code blocks)
- Use proper grammar and natural flow
- Structure information clearly with headings when discussing multiple topics
- Include specific links to college pages when mentioning colleges
- Use bullet points or numbered lists for multiple items`;

  const userPrompt = `${contextText || '\n**Note:** No specific information found in database for this query. Provide general guidance and suggest relevant website pages.'}

${conversationHistory.length > 0 ? `\n**Previous conversation context:**\n${conversationHistory.slice(-6).map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n')}\n` : ''}

**User Question:** ${userQuery}

**Instructions:**
1. Provide a helpful, detailed response based on the context above
2. Use markdown formatting for clarity
3. Include relevant links to college pages or website sections
4. If information is partial, mention what you found and suggest visiting specific pages
5. Be conversational and helpful, similar to ChatGPT

Please provide your response:`;

  try {
    // Build chat history if available
    const chat = geminiModel.startChat({
      history: conversationHistory.slice(-6).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
      systemInstruction: systemInstruction,
    });

    // Generate response
    const result = await chat.sendMessage(userPrompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
};

/**
 * Generate intelligent fallback response without AI provider
 * This provides conversational responses using database context and pattern matching
 */
const generateFallbackResponse = (userQuery, context, conversationHistory = []) => {
  const query = userQuery.toLowerCase().trim();
  const hasContext = context.colleges.length > 0 || context.courses.length > 0 ||
    context.admission.length > 0 || context.placements.length > 0;

  let response = '';
  let suggestedPages = [];
  let suggestions = [];

  // Greeting patterns
  if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|namaste)/i.test(query)) {
    response = `Hello! 👋 I'm your friendly AI assistant. I can help you with:
    
**Education & Colleges:**
- Mumbai colleges and their details
- Courses, fees, and admissions
- Placement information and career guidance

**General Questions:**
- Colleges and universities worldwide
- Study tips and career advice
- Any other questions you might have!

What would you like to know?`;
    suggestions = ['Best colleges in Mumbai', 'Best colleges in USA', 'Study tips for students'];
  }
  // General questions about colleges worldwide (USA, UK, etc.)
  else if ((query.includes('college') || query.includes('university') || query.includes('institution')) &&
    (query.includes('usa') || query.includes('america') || query.includes('us') ||
      query.includes('uk') || query.includes('britain') || query.includes('canada') ||
      query.includes('australia') || query.includes('world') || query.includes('abroad') ||
      query.includes('international') || query.includes('foreign'))) {

    // Extract country/region
    let region = 'internationally';
    if (query.includes('usa') || query.includes('america') || query.includes('us')) region = 'in the USA';
    else if (query.includes('uk') || query.includes('britain')) region = 'in the UK';
    else if (query.includes('canada')) region = 'in Canada';
    else if (query.includes('australia')) region = 'in Australia';

    response = `Great question! Here's information about top colleges ${region}:\n\n`;

    if (region === 'in the USA') {
      response += `**Top Universities in the USA:**\n\n`;
      response += `**Ivy League & Elite:**\n`;
      response += `1. **Harvard University** (Cambridge, MA) - World's most prestigious, strong in all fields\n`;
      response += `2. **Stanford University** (Stanford, CA) - Excellence in technology, business, and innovation\n`;
      response += `3. **MIT** (Cambridge, MA) - Best for engineering, technology, and sciences\n`;
      response += `4. **Yale University** (New Haven, CT) - Outstanding liberal arts and law programs\n`;
      response += `5. **Princeton University** (Princeton, NJ) - Strong undergraduate focus, excellent research\n\n`;

      response += `**Top Public Universities:**\n`;
      response += `- UC Berkeley - Top public university, excellent STEM programs\n`;
      response += `- UCLA - Strong in film, business, and sciences\n`;
      response += `- University of Michigan - Well-rounded excellence\n`;
      response += `- University of Virginia - Historic, strong liberal arts\n\n`;

      response += `**Specialized Excellence:**\n`;
      response += `- **Engineering:** MIT, Stanford, Caltech, Georgia Tech\n`;
      response += `- **Business:** Wharton (UPenn), Harvard, Stanford, MIT Sloan\n`;
      response += `- **Computer Science:** Stanford, MIT, CMU, UC Berkeley\n`;
      response += `- **Medicine:** Johns Hopkins, Harvard, Stanford\n\n`;

      response += `**Key Factors:**\n`;
      response += `- Tuition: $50,000-$80,000/year (private), $30,000-$50,000/year (public out-of-state)\n`;
      response += `- Admissions: Highly competitive (5-20% acceptance rates for top schools)\n`;
      response += `- Requirements: SAT/ACT scores, strong GPA, extracurriculars, essays\n`;
      response += `- Financial Aid: Many offer need-based scholarships for international students\n\n`;

      suggestions = ['How to apply to US universities?', 'SAT vs ACT exam', 'Scholarships for international students'];
    } else if (region === 'in the UK') {
      response += `**Top Universities in the UK:**\n\n`;
      response += `**Russell Group Elite:**\n`;
      response += `1. **University of Oxford** - World's oldest English-speaking university\n`;
      response += `2. **University of Cambridge** - Excellence in sciences and humanities\n`;
      response += `3. **Imperial College London** - Best for STEM fields\n`;
      response += `4. **London School of Economics (LSE)** - Top for economics and social sciences\n`;
      response += `5. **University College London (UCL)** - Strong research university\n\n`;

      response += `**Other Top Universities:**\n`;
      response += `- University of Edinburgh - Historic Scottish university\n`;
      response += `- King's College London - Medical and humanities excellence\n`;
      response += `- University of Manchester - Strong engineering programs\n`;
      response += `- University of Warwick - Business and economics\n\n`;

      response += `**Key Information:**\n`;
      response += `- Tuition: £10,000-£38,000/year for international students\n`;
      response += `- Duration: 3 years for undergraduate (vs 4 in USA)\n`;
      response += `- Admissions: Through UCAS system, A-levels or equivalent\n`;
      response += `- Specialization: Students choose major before applying\n\n`;

      suggestions = ['UCAS application process', 'A-levels vs IB', 'Student visa for UK'];
    } else if (region === 'in Canada') {
      response += `**Top Universities in Canada:**\n\n`;
      response += `1. **University of Toronto** - Canada's top research university\n`;
      response += `2. **McGill University** - Montreal's prestigious English university\n`;
      response += `3. **University of British Columbia** - Beautiful campus, strong research\n`;
      response += `4. **University of Waterloo** - Best for engineering and co-op programs\n`;
      response += `5. **McMaster University** - Excellent for health sciences\n\n`;

      response += `**Why Canada?**\n`;
      response += `- More affordable than USA/UK (CAD 15,000-35,000/year)\n`;
      response += `- Post-study work permits available\n`;
      response += `- Pathway to permanent residence\n`;
      response += `- High quality education, multicultural environment\n\n`;

      suggestions = ['Canada study permit process', 'Post-graduation work permit', 'Best cities for students in Canada'];
    } else if (region === 'in Australia') {
      response += `**Top Universities in Australia:**\n\n`;
      response += `**Group of Eight (Go8):**\n`;
      response += `1. **Australian National University (ANU)** - Top research university\n`;
      response += `2. **University of Melbourne** - Prestigious, strong in all fields\n`;
      response += `3. **University of Sydney** - Historic, excellent reputation\n`;
      response += `4. **University of Queensland** - Strong research focus\n`;
      response += `5. **UNSW Sydney** - Engineering and business excellence\n\n`;

      response += `**Key Information:**\n`;
      response += `- Tuition: AUD 20,000-45,000/year\n`;
      response += `- Duration: 3 years undergraduate\n`;
      response += `- Work rights: 20 hours/week during studies\n`;
      response += `- Post-study work visa: 2-4 years available\n\n`;

      suggestions = ['Australia student visa requirements', 'Part-time work in Australia', 'Best courses in Australia'];
    } else {
      response += `**Top Universities Worldwide:**\n\n`;
      response += `**United States:** Harvard, MIT, Stanford, Yale, Princeton\n`;
      response += `**United Kingdom:** Oxford, Cambridge, Imperial, LSE, UCL\n`;
      response += `**Canada:** Toronto, McGill, UBC, Waterloo\n`;
      response += `**Australia:** ANU, Melbourne, Sydney, UNSW\n`;
      response += `**Europe:** ETH Zurich, TU Munich, Sorbonne, Delft\n`;
      response += `**Asia:** NUS (Singapore), Tsinghua (China), Tokyo, KAIST (Korea)\n\n`;

      response += `**Choosing the Right Country:**\n`;
      response += `- **USA:** Best overall, expensive, competitive\n`;
      response += `- **UK:** Shorter programs, historic universities\n`;
      response += `- **Canada:** Affordable, immigration-friendly\n`;
      response += `- **Australia:** Great lifestyle, work opportunities\n`;
      response += `- **Europe:** Many free/low-cost options (Germany, Norway)\n\n`;

      suggestions = ['How to choose study destination?', 'Scholarships for international students', 'Compare USA vs UK universities'];
    }

    response += `\n💡 **Looking for colleges in Mumbai?** I can also help you explore [local colleges](/colleges) with detailed information about courses, fees, and placements!`;
    suggestedPages.push({ label: 'Browse Mumbai Colleges', path: '/colleges' });
  }
  // Study tips and academic advice
  else if (query.includes('study tip') || query.includes('how to study') || query.includes('study better') ||
    query.includes('improve grade') || query.includes('study technique') || query.includes('learning')) {
    response = `Here are proven study tips to help you succeed academically! 📚\n\n`;
    response += `**Effective Study Techniques:**\n\n`;
    response += `**1. Active Recall**\n`;
    response += `- Test yourself instead of just re-reading\n`;
    response += `- Use flashcards and practice questions\n`;
    response += `- Explain concepts in your own words\n\n`;

    response += `**2. Spaced Repetition**\n`;
    response += `- Review material at increasing intervals\n`;
    response += `- Don't cram - spread study sessions over time\n`;
    response += `- Use apps like Anki for spaced repetition\n\n`;

    response += `**3. Pomodoro Technique**\n`;
    response += `- Study for 25 minutes, break for 5 minutes\n`;
    response += `- After 4 sessions, take a longer 15-30 minute break\n`;
    response += `- Helps maintain focus and prevent burnout\n\n`;

    response += `**4. Environment & Habits**\n`;
    response += `- Create a dedicated study space\n`;
    response += `- Eliminate distractions (phone, social media)\n`;
    response += `- Study at your peak energy times\n`;
    response += `- Get enough sleep (7-9 hours)\n`;
    response += `- Stay hydrated and eat healthy\n\n`;

    response += `**5. Note-Taking Methods**\n`;
    response += `- Cornell Method: Divide notes into cues, notes, and summary\n`;
    response += `- Mind Mapping: Visual connections between concepts\n`;
    response += `- Outline Method: Hierarchical organization\n\n`;

    response += `**6. Practice & Application**\n`;
    response += `- Do practice problems regularly\n`;
    response += `- Apply concepts to real-world examples\n`;
    response += `- Teach others to reinforce learning\n\n`;

    suggestions = ['Time management for students', 'How to prepare for exams?', 'Dealing with exam stress'];
  }
  // College information queries
  else if (context.colleges.length > 0) {
    const college = context.colleges[0];
    const otherColleges = context.colleges.slice(1, 3);

    response = `Great! I found information about **${college.college_name}**. Here's what I know:\n\n`;

    if (college.description) {
      response += `**About ${college.college_name}:**\n${college.description.substring(0, 300)}${college.description.length > 300 ? '...' : ''}\n\n`;
    }

    response += `**Key Details:**\n`;
    response += `- **Type:** ${college.college_type} college\n`;
    if (college.city) response += `- **Location:** ${college.city}\n`;
    if (college.established_year) response += `- **Established:** ${college.established_year}\n`;
    if (college.average_rating > 0) {
      response += `- **Rating:** ⭐ ${college.average_rating}/5 (${college.total_reviews} reviews)\n`;
    }

    if (context.courses.length > 0) {
      const collegeCourses = context.courses.filter(c => c.college_id === college.college_id);
      if (collegeCourses.length > 0) {
        response += `\n**Popular Courses:**\n`;
        collegeCourses.slice(0, 3).forEach(course => {
          response += `- ${course.course_name} (${course.stream_name})`;
          if (course.fees_per_year) response += ` - ₹${course.fees_per_year.toLocaleString('en-IN')}/year`;
          response += `\n`;
        });
      }
    }

    if (otherColleges.length > 0) {
      response += `\n**Other related colleges:** ${otherColleges.map(c => c.college_name).join(', ')}\n`;
    }

    response += `\nWould you like to know more about [${college.college_name}](/colleges/${college.college_id})? You can also browse [all colleges](/colleges) or [compare colleges](/compare).`;

    suggestedPages.push({
      label: `View ${college.college_name}`,
      path: `/colleges/${college.college_id}`
    });
    if (otherColleges.length > 0) {
      otherColleges.forEach(c => {
        suggestedPages.push({
          label: `View ${c.college_name}`,
          path: `/colleges/${c.college_id}`
        });
      });
    }
    suggestedPages.push({ label: 'Browse All Colleges', path: '/colleges' });

    suggestions = [
      `What courses does ${college.college_name} offer?`,
      `What are the admission requirements for ${college.college_name}?`,
      `Tell me about placements at ${college.college_name}`
    ];
  }
  // Course queries
  else if (context.courses.length > 0) {
    const course = context.courses[0];

    response = `I found information about **${course.course_name}** at **${course.college_name}**. Here's what you need to know:\n\n`;
    response += `**Course Details:**\n`;
    response += `- **Program:** ${course.degree_type} in ${course.stream_name}\n`;
    if (course.duration_years) response += `- **Duration:** ${course.duration_years} years\n`;
    if (course.fees_per_year) response += `- **Fees:** ₹${course.fees_per_year.toLocaleString('en-IN')} per year\n`;
    if (course.eligibility) response += `- **Eligibility:** ${course.eligibility.substring(0, 200)}${course.eligibility.length > 200 ? '...' : ''}\n`;
    if (course.description) {
      response += `\n**About the Course:**\n${course.description.substring(0, 300)}${course.description.length > 300 ? '...' : ''}\n`;
    }

    response += `\nLearn more about [${course.college_name}](/colleges/${course.college_id}) or [browse all courses](/colleges).`;

    suggestedPages.push({
      label: `View ${course.college_name}`,
      path: `/colleges/${course.college_id}`
    });
    suggestedPages.push({ label: 'Browse All Colleges', path: '/colleges' });

    suggestions = [
      `What other courses does ${course.college_name} offer?`,
      `How do I apply for ${course.course_name}?`,
      `What are the career prospects after ${course.course_name}?`
    ];
  }
  // Admission queries
  else if (query.includes('admission') || query.includes('apply') || query.includes('how to apply')) {
    if (context.admission.length > 0) {
      const admission = context.admission[0];
      response = `I found admission information for **${admission.college_name}**. Here's the process:\n\n`;

      if (admission.admission_process) {
        response += `**Admission Process:**\n${admission.admission_process.substring(0, 400)}${admission.admission_process.length > 400 ? '...' : ''}\n\n`;
      }

      if (admission.entrance_exam) {
        response += `**Entrance Exam:** ${admission.entrance_exam}\n`;
      }

      if (admission.cutoff_info) {
        response += `**Cutoff Information:** ${admission.cutoff_info.substring(0, 200)}${admission.cutoff_info.length > 200 ? '...' : ''}\n`;
      }

      if (admission.important_dates) {
        response += `\n**Important Dates:** ${admission.important_dates.substring(0, 200)}${admission.important_dates.length > 200 ? '...' : ''}\n`;
      }

      response += `\nFor complete details, visit [${admission.college_name}](/colleges/${admission.college_id}).`;

      suggestedPages.push({
        label: `View ${admission.college_name}`,
        path: `/colleges/${admission.college_id}`
      });
    } else {
      response = `Here's general information about college admissions in Mumbai:\n\n`;
      response += `**General Admission Process:**\n`;
      response += `1. **Check Eligibility:** Review the eligibility criteria for your desired course\n`;
      response += `2. **Entrance Exams:** Many colleges require entrance exams (JEE, MH-CET, etc.)\n`;
      response += `3. **Application Forms:** Fill out application forms online or offline\n`;
      response += `4. **Merit Lists:** Colleges publish merit lists based on exam scores\n`;
      response += `5. **Document Verification:** Submit required documents for verification\n`;
      response += `6. **Admission Confirmation:** Pay fees and confirm admission\n\n`;
      response += `To find specific admission details, browse [colleges](/colleges) and check individual college pages.`;

      suggestedPages.push({ label: 'Browse All Colleges', path: '/colleges' });
      suggestions = ['Which entrance exams do I need?', 'What are the eligibility criteria?', 'Tell me about cutoff marks'];
    }
  }
  // Placement queries
  else if (query.includes('placement') || query.includes('salary') || query.includes('package') || query.includes('job')) {
    if (context.placements.length > 0) {
      const placement = context.placements[0];
      response = `Here's placement information for **${placement.college_name}**:\n\n`;

      if (placement.academic_year) response += `**Academic Year:** ${placement.academic_year}\n`;
      if (placement.placement_percentage) response += `**Placement Rate:** ${placement.placement_percentage}%\n`;
      if (placement.average_package) response += `**Average Package:** ₹${placement.average_package.toLocaleString('en-IN')} per year\n`;
      if (placement.highest_package) response += `**Highest Package:** ₹${placement.highest_package.toLocaleString('en-IN')} per year\n`;
      if (placement.top_recruiters) {
        response += `\n**Top Recruiters:**\n${placement.top_recruiters.substring(0, 300)}${placement.top_recruiters.length > 300 ? '...' : ''}\n`;
      }

      response += `\nCheck out [${placement.college_name}](/colleges/${placement.college_id}) for more placement details.`;

      suggestedPages.push({
        label: `View ${placement.college_name}`,
        path: `/colleges/${placement.college_id}`
      });
    } else {
      response = `Placement opportunities vary by college and course. Here's what you should know:\n\n`;
      response += `**Factors Affecting Placements:**\n`;
      response += `- College reputation and ranking\n`;
      response += `- Course relevance to industry needs\n`;
      response += `- Location (Mumbai has great opportunities!)\n`;
      response += `- Student performance and skills\n`;
      response += `- Industry connections and placement cell quality\n\n`;
      response += `To find specific placement statistics, browse [colleges](/colleges) and check their placement records.`;

      suggestedPages.push({ label: 'Browse All Colleges', path: '/colleges' });
      suggestions = ['Which colleges have best placements?', 'What is the average salary package?', 'Tell me about top recruiters'];
    }
  }
  // Career guidance queries
  else if (query.includes('career') || query.includes('future') || query.includes('scope') || query.includes('job opportunities')) {
    response = `Great question! Here's some career guidance based on different streams:\n\n`;
    response += `**Engineering:** High demand in IT, software, and tech companies. Excellent placement opportunities in Mumbai.\n\n`;
    response += `**Commerce:** Careers in banking, finance, accounting, and business management. Mumbai is a financial hub!\n\n`;
    response += `**Science:** Options in research, medical, teaching, or further studies. Great foundation for advanced degrees.\n\n`;
    response += `**Arts:** Careers in journalism, media, civil services, teaching, and creative fields.\n\n`;
    response += `**Management:** Opportunities in business, marketing, HR, and operations across industries.\n\n`;
    response += `To explore specific courses and colleges, check out our [college listings](/colleges). You can also [compare colleges](/compare) to make the best decision.`;

    suggestedPages.push({ label: 'Browse All Colleges', path: '/colleges' });
    suggestions = ['Which stream should I choose?', 'Tell me about engineering career prospects', 'What about commerce opportunities?'];
  }
  // Fee/financial queries
  else if (query.includes('fee') || query.includes('cost') || query.includes('price') || query.includes('expensive')) {
    if (context.courses.length > 0) {
      const coursesWithFees = context.courses.filter(c => c.fees_per_year);
      if (coursesWithFees.length > 0) {
        response = `Here's fee information for the courses I found:\n\n`;
        coursesWithFees.slice(0, 5).forEach(course => {
          response += `**${course.course_name}** at ${course.college_name}:\n`;
          response += `- Fee: ₹${course.fees_per_year.toLocaleString('en-IN')} per year\n`;
          if (course.duration_years) {
            const totalFee = course.fees_per_year * course.duration_years;
            response += `- Total (${course.duration_years} years): ₹${totalFee.toLocaleString('en-IN')}\n`;
          }
          response += `- [View Details](/colleges/${course.college_id})\n\n`;
        });
      }
    } else {
      response = `Fee structure varies by college, course, and college type:\n\n`;
      response += `**College Types & Fees:**\n`;
      response += `- **Government Colleges:** ₹10,000 - ₹50,000 per year (highly subsidized)\n`;
      response += `- **Aided Colleges:** ₹20,000 - ₹80,000 per year\n`;
      response += `- **Private Colleges:** ₹50,000 - ₹5,00,000+ per year\n`;
      response += `- **Autonomous Colleges:** ₹1,00,000 - ₹10,00,000+ per year\n\n`;
      response += `**Additional Costs:** Hostel fees, books, lab charges, etc.\n\n`;
      response += `Browse [colleges](/colleges) to see specific fee structures for each institution.`;

      suggestedPages.push({ label: 'Browse All Colleges', path: '/colleges' });
    }
  }
  // Stream/field queries
  else if (context.streams.length > 0) {
    const stream = context.streams[0];
    response = `I found information about **${stream.stream_name}**:\n\n`;
    response += `${stream.description || 'This is a popular academic stream with great opportunities.'}\n\n`;
    response += `Colleges offering ${stream.stream_name} courses have various specializations. You can browse [all colleges](/colleges) and filter by stream to find the best options for you.`;

    suggestedPages.push({ label: 'Browse Colleges', path: '/colleges' });
    suggestions = [`Which colleges offer ${stream.stream_name}?`, 'What courses are available?', 'Tell me about career prospects'];
  }
  // General help
  else if (query.includes('help') || query.includes('what can you') || query.includes('what do you')) {
    response = `I'm here to help you with everything about colleges in Mumbai! 🎓\n\n`;
    response += `**I can help you with:**\n`;
    response += `✅ Finding the right college\n`;
    response += `✅ Understanding different courses and streams\n`;
    response += `✅ Admission procedures and requirements\n`;
    response += `✅ Fee structures and costs\n`;
    response += `✅ Placement opportunities and packages\n`;
    response += `✅ Career guidance and advice\n`;
    response += `✅ Comparing colleges\n\n`;
    response += `Just ask me anything! For example:\n`;
    response += `- "Tell me about engineering colleges"\n`;
    response += `- "What are the best colleges for commerce?"\n`;
    response += `- "How do I apply for admission?"\n`;
    response += `- "Which colleges have the best placements?"\n\n`;
    response += `You can also [browse all colleges](/colleges) or [compare colleges](/compare) directly.`;

    suggestions = ['Which are the best colleges in Mumbai?', 'Tell me about admission process', 'What about placements?'];
  }
  // No specific match but has context
  else if (hasContext) {
    response = `I found some relevant information, but let me help you more specifically. `;

    if (context.colleges.length > 0) {
      response += `I found ${context.colleges.length} college(s) related to your query. `;
      response += `Would you like to know more about [${context.colleges[0].college_name}](/colleges/${context.colleges[0].college_id})? `;
    }

    if (context.courses.length > 0) {
      response += `I also found ${context.courses.length} course(s). `;
    }

    response += `You can [browse all colleges](/colleges) to explore more options.`;

    if (context.colleges.length > 0) {
      suggestedPages.push({
        label: `View ${context.colleges[0].college_name}`,
        path: `/colleges/${context.colleges[0].college_id}`
      });
    }
    suggestedPages.push({ label: 'Browse All Colleges', path: '/colleges' });
  }
  // Real-life problem solving queries
  else if (query.includes('problem') || query.includes('issue') || query.includes('difficulty') || query.includes('struggle') || query.includes('confused')) {
    response = `I understand you're facing some challenges. Let me help you! 😊\n\n`;
    response += `**Common Concerns Students Face:**\n\n`;
    response += `**1. Choosing the Right College/Course:**\n`;
    response += `- Consider your interests and strengths\n`;
    response += `- Research career prospects for different streams\n`;
    response += `- Compare colleges based on ratings, placements, and fees\n`;
    response += `- Talk to current students or alumni\n`;
    response += `- Use our [compare colleges](/compare) feature to make informed decisions\n\n`;
    response += `**2. Admission Process:**\n`;
    response += `- Prepare for entrance exams (JEE, MH-CET, etc.)\n`;
    response += `- Keep all documents ready\n`;
    response += `- Apply to multiple colleges as backup\n`;
    response += `- Check eligibility criteria carefully\n\n`;
    response += `**3. Financial Concerns:**\n`;
    response += `- Explore scholarship opportunities\n`;
    response += `- Consider government/aided colleges for lower fees\n`;
    response += `- Look into education loans\n`;
    response += `- Compare fee structures across colleges\n\n`;
    response += `**4. Career Uncertainty:**\n`;
    response += `- Research career prospects in your field of interest\n`;
    response += `- Consider future growth and demand\n`;
    response += `- Look at placement records\n`;
    response += `- Seek guidance from career counselors\n\n`;
    response += `I can help you find specific colleges, courses, or information to address your concerns. What specifically would you like help with?`;

    suggestedPages.push({ label: 'Browse All Colleges', path: '/colleges' });
    suggestedPages.push({ label: 'Compare Colleges', path: '/compare' });
    suggestions = ['Help me choose the right college', 'Tell me about admission process', 'What about fees and scholarships?'];
  }
  // Thank you responses
  else if (/^(thanks|thank you|thank|appreciate|grateful|helpful)/i.test(query)) {
    response = `You're very welcome! 😊 Happy to help!\n\n`;
    response += `If you have any more questions about colleges, courses, admissions, or anything else, feel free to ask. I'm here to help you make the best educational decisions!\n\n`;
    response += `You can also [browse colleges](/colleges) or [compare options](/compare) anytime.`;

    suggestions = ['Tell me about the best colleges', 'Help with admission process', 'What about placements?'];
  }
  // Motivation/encouragement queries
  else if (query.includes('motivate') || query.includes('encourage') || query.includes('depressed') || query.includes('sad') || query.includes('stressed')) {
    response = `I understand you might be feeling overwhelmed. You're not alone, and it's completely normal! 💪\n\n`;
    response += `**Remember:**\n`;
    response += `✅ Making educational decisions is a process - take your time\n`;
    response += `✅ Every student faces challenges - you're doing great!\n`;
    response += `✅ There's a college and course perfect for you\n`;
    response += `✅ Your journey is unique - don't compare yourself to others\n\n`;
    response += `**Tips to Stay Positive:**\n`;
    response += `- Break big decisions into smaller steps\n`;
    response += `- Research thoroughly but don't overthink\n`;
    response += `- Talk to counselors, teachers, or parents\n`;
    response += `- Focus on what you're good at and enjoy\n`;
    response += `- Remember: there are many paths to success\n\n`;
    response += `I'm here to help you navigate through this! What specific aspect would you like help with? We can explore [colleges](/colleges) together or discuss your options.`;

    suggestedPages.push({ label: 'Browse Colleges', path: '/colleges' });
    suggestions = ['Help me choose the right path', 'Tell me about good colleges', 'How do I stay motivated?'];
  }
  // Decision-making queries
  else if (query.includes('choose') || query.includes('decide') || query.includes('select') || query.includes('which one') || query.includes('better')) {
    response = `Great question! Making the right choice is important. Here's how to approach it: 🤔\n\n`;
    response += `**Decision-Making Framework:**\n\n`;
    response += `**1. Identify Your Priorities:**\n`;
    response += `- Academic quality and reputation\n`;
    response += `- Location and accessibility\n`;
    response += `- Fees and financial feasibility\n`;
    response += `- Placement opportunities\n`;
    response += `- Course content and specializations\n`;
    response += `- Campus facilities and environment\n\n`;
    response += `**2. Research Thoroughly:**\n`;
    response += `- Compare multiple colleges using our [compare feature](/compare)\n`;
    response += `- Read reviews and ratings\n`;
    response += `- Check placement statistics\n`;
    response += `- Visit college websites and social media\n`;
    response += `- Talk to current students or alumni\n\n`;
    response += `**3. Consider Your Goals:**\n`;
    response += `- Short-term: Get quality education\n`;
    response += `- Long-term: Career prospects and growth\n`;
    response += `- Personal: Interests, values, and lifestyle\n\n`;
    response += `**4. Make an Informed Decision:**\n`;
    response += `- List pros and cons\n`;
    response += `- Consider backup options\n`;
    response += `- Trust your research and instincts\n\n`;
    response += `I can help you [compare colleges](/compare) or [browse options](/colleges) to make the best decision. What specific aspect would you like help with?`;

    suggestedPages.push({ label: 'Compare Colleges', path: '/compare' });
    suggestedPages.push({ label: 'Browse All Colleges', path: '/colleges' });
    suggestions = ['Help me compare colleges', 'Which college is better?', 'Tell me about top colleges'];
  }
  // General fallback
  else {
    response = `I understand you're looking for information. Let me help you! 🤔\n\n`;
    response += `While I don't have specific information about that in our database right now, I can definitely help you with:\n\n`;
    response += `📚 **College Information** - Browse our extensive database of colleges in Mumbai\n`;
    response += `🎓 **Courses & Streams** - Explore different academic programs (Engineering, Commerce, Science, Arts, Management)\n`;
    response += `📝 **Admissions** - Get guidance on admission procedures, entrance exams, and requirements\n`;
    response += `💼 **Placements** - Learn about career opportunities and placement statistics\n`;
    response += `💰 **Fees** - Understand fee structures and financial planning\n`;
    response += `🎯 **Career Guidance** - Get advice on choosing the right path\n\n`;
    response += `**You can ask me things like:**\n`;
    response += `- "Tell me about engineering colleges in Mumbai"\n`;
    response += `- "What are the best commerce colleges?"\n`;
    response += `- "How do I apply for admission?"\n`;
    response += `- "Which colleges have good placements?"\n`;
    response += `- "What course should I choose?"\n`;
    response += `- "Help me with career guidance"\n\n`;
    response += `You can start by [browsing all colleges](/colleges) or [comparing colleges](/compare) to find the perfect match for you!`;

    suggestedPages.push({ label: 'Browse All Colleges', path: '/colleges' });
    suggestedPages.push({ label: 'Compare Colleges', path: '/compare' });
    suggestions = ['Which are the best colleges?', 'Tell me about admission', 'What about fees?'];
  }

  return {
    response: response.trim(),
    suggestedPages: suggestedPages.slice(0, 3),
    suggestions: suggestions.slice(0, 3),
    provider: 'fallback',
  };
};

/**
 * Generate AI response using selected provider
 */
const generateAIResponse = async (userQuery, context, conversationHistory = [], stream = false) => {
  const activeProvider = getActiveProvider();

  if (!activeProvider) {
    // Use intelligent fallback instead of technical error message
    console.log('⚠️  No AI provider configured - using intelligent fallback responses');
    return generateFallbackResponse(userQuery, context, conversationHistory);
  }

  const hasContext = context.colleges.length > 0 || context.courses.length > 0 ||
    context.admission.length > 0 || context.placements.length > 0;

  try {
    let aiResponse;

    if (activeProvider === 'gemini') {
      aiResponse = await generateGeminiResponse(userQuery, context, conversationHistory);
    } else {
      aiResponse = await generateOpenAIResponse(userQuery, context, conversationHistory);
    }

    // Extract suggested pages from response and context
    const suggestedPages = [];
    if (context.colleges.length > 0) {
      context.colleges.slice(0, 3).forEach(college => {
        suggestedPages.push({
          label: `View ${college.college_name}`,
          path: `/colleges/${college.college_id}`,
        });
      });
    }

    // Add general pages if context is limited
    if (!hasContext || context.colleges.length === 0) {
      suggestedPages.push({ label: 'Browse All Colleges', path: '/colleges' });
      suggestedPages.push({ label: 'Compare Colleges', path: '/compare' });
    }

    // Generate suggested follow-up questions
    const suggestions = generateSuggestedQuestions(userQuery, context);

    return {
      response: aiResponse,
      suggestedPages: suggestedPages.slice(0, 3),
      suggestions: suggestions.slice(0, 3),
      provider: activeProvider,
    };
  } catch (error) {
    console.error(`AI API error (${activeProvider}):`, error);

    // Try fallback provider if available
    const fallbackProvider = activeProvider === 'openai' ? 'gemini' : 'openai';
    const fallbackAvailable = fallbackProvider === 'gemini' ? geminiModel : openai;

    if (fallbackAvailable) {
      console.log(`Trying fallback provider: ${fallbackProvider}`);
      try {
        let aiResponse;
        if (fallbackProvider === 'gemini') {
          aiResponse = await generateGeminiResponse(userQuery, context, conversationHistory);
        } else {
          aiResponse = await generateOpenAIResponse(userQuery, context, conversationHistory);
        }

        const suggestedPages = context.colleges.length > 0
          ? context.colleges.slice(0, 3).map(c => ({
            label: `View ${c.college_name}`,
            path: `/colleges/${c.college_id}`,
          }))
          : [
            { label: 'Browse All Colleges', path: '/colleges' },
            { label: 'Compare Colleges', path: '/compare' },
          ];

        return {
          response: aiResponse,
          suggestedPages: suggestedPages.slice(0, 3),
          suggestions: generateSuggestedQuestions(userQuery, context).slice(0, 3),
          provider: fallbackProvider,
        };
      } catch (fallbackError) {
        console.error(`Fallback provider (${fallbackProvider}) also failed:`, fallbackError);
      }
    }

    // Use intelligent fallback instead of technical error
    console.log('⚠️  AI provider failed - using intelligent fallback responses');
    return generateFallbackResponse(userQuery, context, conversationHistory);
  }
};

/**
 * Process chat message - main entry point
 */
const processChatMessage = async (userQuery, userId = null, conversationHistory = [], stream = false) => {
  try {
    // Search database for relevant information
    const context = await searchDatabase(userQuery, conversationHistory);

    // Generate AI response
    const result = await generateAIResponse(userQuery, context, conversationHistory, stream);

    // Optionally log the chat (for analytics)
    if (userId && process.env.LOG_CHAT_ENABLED === 'true') {
      try {
        await promisePool.query(
          `INSERT INTO chat_logs (user_id, message, response, context_used, created_at) 
           VALUES (?, ?, ?, ?, NOW())`,
          [userId, userQuery, typeof result.response === 'string' ? result.response : '[Streaming response]', JSON.stringify(context)]
        );
      } catch (logError) {
        // Silently fail logging - don't affect user experience
        console.error('Chat log error:', logError);
      }
    }

    return {
      success: true,
      message: result.response,
      suggestedPages: result.suggestedPages || [],
      suggestions: result.suggestions || [],
      provider: result.provider || 'none',
      stream: result.stream || null,
    };
  } catch (error) {
    console.error('Chat processing error:', error);

    // Try to generate fallback response even on error
    try {
      const context = await searchDatabase(userQuery, conversationHistory);
      const fallbackResult = generateFallbackResponse(userQuery, context, conversationHistory);

      return {
        success: true,
        message: fallbackResult.response,
        suggestedPages: fallbackResult.suggestedPages || [
          { label: 'Browse All Colleges', path: '/colleges' },
          { label: 'Compare Colleges', path: '/compare' },
        ],
        suggestions: fallbackResult.suggestions || [],
        provider: 'fallback',
      };
    } catch (fallbackError) {
      console.error('Fallback response generation failed:', fallbackError);
      return {
        success: true,
        message: `I apologize for the technical issue. Let me help you in another way! 😊\n\nYou can:\n- [Browse all colleges](/colleges) to explore options\n- [Compare colleges](/compare) to make informed decisions\n- Ask me specific questions about colleges, courses, or admissions\n\nWhat would you like to know?`,
        suggestedPages: [
          { label: 'Browse All Colleges', path: '/colleges' },
          { label: 'Compare Colleges', path: '/compare' },
        ],
        suggestions: ['Tell me about engineering colleges', 'How do I apply?', 'What about fees?'],
        provider: 'fallback',
      };
    }
  }
};

/**
 * Get available AI providers
 */
const getAvailableProviders = () => {
  const providers = [];
  if (openai) providers.push({ name: 'openai', label: 'OpenAI (ChatGPT)', model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo' });
  if (geminiModel) providers.push({ name: 'gemini', label: 'Google Gemini', model: process.env.GEMINI_MODEL || 'gemini-pro' });
  return providers;
};

module.exports = {
  processChatMessage,
  searchDatabase,
  generateAIResponse,
  generateSuggestedQuestions,
  getActiveProvider,
  getAvailableProviders,
};
