/**
 * Chatbot service – supports OpenAI, Google Gemini, or rule-based fallback.
 * Always returns a response – never throws to the caller.
 */

const getAvailableProviders = () => {
    const providers = [];
    if (process.env.OPENAI_API_KEY) providers.push('openai');
    if (process.env.GEMINI_API_KEY) providers.push('gemini');
    return providers;
};

const getActiveProvider = () => {
    const preferred = (process.env.AI_PROVIDER || '').toLowerCase();
    const available = getAvailableProviders();
    if (available.length === 0) return null;
    if (preferred && available.includes(preferred)) return preferred;
    return available[0];
};

const SYSTEM_PROMPT = `You are EduBot, a helpful assistant for EDU-GUIDE Mumbai – a platform 
that helps students find and compare colleges in Mumbai and Maharashtra.
Help with: finding colleges by stream, comparing colleges, admissions, scholarships, and career guidance.
Keep responses concise, friendly, and informative. Use bullet points and formatting where helpful.
If you don't know something specific, suggest the user browse the college listings on the platform.`;

/* ───── OpenAI Provider ───── */
const processWithOpenAI = async (message, history) => {
    const { OpenAI } = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history,
        { role: 'user', content: message },
    ];
    const res = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages,
        max_tokens: 500,
        temperature: 0.7,
    });
    return res.choices[0].message.content;
};

/* ───── Gemini Provider ───── */
const processWithGemini = async (message, history) => {
    let GoogleGenerativeAI;
    try {
        ({ GoogleGenerativeAI } = require('@google/generative-ai'));
    } catch (err) {
        console.error('❌ @google/generative-ai package not installed. Run: npm install @google/generative-ai');
        throw new Error('Gemini SDK not installed');
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw new Error('Invalid or missing GEMINI_API_KEY');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const model = genAI.getGenerativeModel({ model: modelName });

    const historyText = history
        .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n');
    const prompt = `${SYSTEM_PROMPT}\n\n${historyText ? historyText + '\n' : ''}User: ${message}\nAssistant:`;

    console.log(`🤖 Calling Gemini API with model: ${modelName}`);

    // 15-second timeout – first cold-start calls can be slow
    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API timeout after 15s')), 15000)
    );

    const result = await Promise.race([
        model.generateContent(prompt),
        timeoutPromise,
    ]);

    // Handle both old & new SDK response shapes
    let text;
    if (result.response) {
        text = typeof result.response.text === 'function'
            ? result.response.text()
            : result.response.text;
    } else if (typeof result.text === 'function') {
        text = result.text();
    } else if (typeof result.text === 'string') {
        text = result.text;
    }

    if (!text) {
        throw new Error('Empty response from Gemini API');
    }

    return text;
};

/* ───── Rule-based Fallback ───── */
const fallbackResponse = (message) => {
    const lower = message.toLowerCase();

    // Greetings
    if (/\b(hello|hi|hey|namaste|good\s*(morning|afternoon|evening))\b/.test(lower)) {
        return "Hello! 👋 I'm EduBot, your college advisor for Mumbai & Maharashtra. I can help you with:\n\n• 🏫 Finding colleges by stream\n• 💰 Fees & scholarship info\n• 📋 Admission processes\n• 📊 Comparing colleges\n• 🎯 Career guidance\n\nWhat would you like to know?";
    }

    // Thanks / bye
    if (/\b(thanks|thank\s*you|bye|goodbye)\b/.test(lower)) {
        return "You're welcome! 😊 Feel free to come back anytime you need help with colleges or admissions. Good luck with your academic journey! 🎓";
    }

    // Engineering
    if (/\b(engineer|btech|b\.tech|b\s*tech|iit|vjti|mechanical|computer|it\s*engineer|cse)\b/.test(lower)) {
        return "🏗️ **Top Engineering Colleges in Mumbai:**\n\n• **IIT Bombay** – Premier institute, JEE Advanced required\n• **VJTI** – Govt. college, strong placements via MHT-CET\n• **DJ Sanghvi** – Private, known for CS & IT branches\n• **SPCE (Sardar Patel)** – Well-regarded, good campus\n• **Thadomal Shahani** – Strong industry connections\n\n📌 **Admission:** JEE Main / MHT-CET scores\n💰 **Fees:** Govt: ₹5K-30K/yr | Private: ₹1-3L/yr\n\nWant details on cutoffs, placements, or a specific college?";
    }

    // Medical
    if (/\b(medical|mbbs|doctor|neet|kem|grant|bms|pharma|nursing)\b/.test(lower)) {
        return "🏥 **Top Medical Colleges in Mumbai:**\n\n• **KEM Hospital (Seth GS Medical College)** – Top govt. medical college\n• **Grant Medical College (JJ Hospital)** – Prestigious govt. college\n• **Lokmanya Tilak Municipal Medical College (Sion)** – Well-known\n• **BYL Nair Charitable Hospital** – Reputed govt. institution\n• **TNMC (Topiwala National Medical College)** – Strong academics\n\n📌 **Admission:** NEET UG score required\n💰 **Fees:** Govt: ₹15K-50K/yr | Private: ₹5-20L/yr\n\nWould you like info on cutoffs or specific specializations?";
    }

    // Commerce
    if (/\b(commerce|bcom|b\.com|ca|accounting|chartered|finance)\b/.test(lower)) {
        return "📊 **Top Commerce Colleges in Mumbai:**\n\n• **Sydenham College** – One of India's oldest commerce colleges\n• **HR College (Hazarimal Somani)** – Excellent placements\n• **Jai Hind College** – Strong academics & extracurriculars\n• **NM College** – Great reputation for B.Com\n• **Narsee Monjee College** – Well-known for finance courses\n\n📌 **Admission:** Based on HSC merit / entrance exams\n💰 **Fees:** ₹10K-1L/yr depending on college type\n\nNeed info about specific courses like BBA, BMS, or CA foundation?";
    }

    // Arts / Humanities
    if (/\b(arts|humanities|ba\b|literature|history|psychology|sociology|mass\s*media)\b/.test(lower)) {
        return "🎨 **Top Arts & Humanities Colleges in Mumbai:**\n\n• **St. Xavier's College** – Highly prestigious, strong in liberal arts\n• **Elphinstone College** – Historic institution with excellent faculty\n• **Sophia College** – Top women's college, great for humanities\n• **Wilson College** – Well-known for arts programs\n• **KC College** – Good for Mass Media & Psychology\n\n📌 **Admission:** Based on HSC merit\n💰 **Fees:** ₹5K-50K/yr\n\nInterested in a specific field like psychology, mass media, or literature?";
    }

    // Science
    if (/\b(science|bsc|b\.sc|physics|chemistry|biology|biotech|microbiology)\b/.test(lower)) {
        return "🔬 **Top Science Colleges in Mumbai:**\n\n• **St. Xavier's College** – Excellent for pure sciences\n• **Ruia College** – Top autonomous govt. college\n• **KC College** – Great for life sciences\n• **ICT (Institute of Chemical Technology)** – Premier for chemistry/biotech\n• **Wilson College** – Good labs and faculty\n\n📌 **Admission:** HSC merit / entrance exams for some\n💰 **Fees:** Govt: ₹5K-15K/yr | Private: ₹20K-1L/yr\n\nWhich branch of science interests you?";
    }

    // Fees
    if (/\b(fee|fees|cost|expensive|cheap|afford|budget|scholarship)\b/.test(lower)) {
        return "💰 **College Fees Overview in Mumbai:**\n\n• **Government Colleges:** ₹5,000 – ₹30,000/year\n• **Aided Colleges:** ₹10,000 – ₹60,000/year\n• **Private Colleges:** ₹50,000 – ₹3,00,000/year\n• **Deemed Universities:** ₹1,00,000 – ₹5,00,000/year\n\n🎓 **Scholarships Available:**\n• Government of Maharashtra Freeship/Scholarship\n• Post-Matric Scholarship for SC/ST/OBC\n• Merit-based scholarships at individual colleges\n• EWS quota fee concessions\n\nWant help finding colleges in a specific budget range?";
    }

    // Admission
    if (/\b(admission|apply|entrance|exam|cutoff|cut[\s-]off|mht[\s-]?cet|jee|neet|registration|process)\b/.test(lower)) {
        return "📋 **Admission Processes in Maharashtra:**\n\n• **Engineering:** JEE Main / MHT-CET → CAP rounds → Document verification\n• **Medical:** NEET UG → State counseling → CAP rounds\n• **Arts/Commerce/Science:** HSC merit → College-level admission\n• **Law:** CLAT / MH-CET Law → Centralized allotment\n• **Management:** CAT / CET / CMAT → GD/PI rounds\n\n📅 **Key Timeline:**\n• MHT-CET: Usually May-June\n• CAP Rounds: July-August\n• College admissions open: June-July\n\nNeed help with a specific entrance exam or admission timeline?";
    }

    // Placements
    if (/\b(placement|job|salary|package|recruit|hire|career|intern)\b/.test(lower)) {
        return "💼 **Placement & Career Info:**\n\n• **Engineering (Top colleges):** ₹4-20 LPA average\n• **Management (MBA):** ₹6-25 LPA average\n• **Commerce (B.Com/BMS):** ₹3-8 LPA average\n• **Arts/Humanities:** ₹2-6 LPA average\n\n🏢 **Top Recruiters in Mumbai:** TCS, Infosys, Wipro, JP Morgan, Deloitte, HDFC Bank, L&T, Reliance\n\nWant placement details for a specific college?";
    }

    // Hostel / accommodation
    if (/\b(hostel|accommodation|stay|living|dorm|pg|paying\s*guest)\b/.test(lower)) {
        return "🏠 **Accommodation Options near Mumbai Colleges:**\n\n• **College Hostels:** ₹20K-60K/year (limited seats, apply early!)\n• **PG Accommodation:** ₹5K-15K/month\n• **Shared Flat:** ₹8K-20K/month per person\n\n📌 Many government colleges offer hostels. Apply during admission itself!\n\nNeed info about hostels for a specific college?";
    }

    // Compare
    if (/\b(compare|versus|vs|better|difference|which\s*(is|one|college))\b/.test(lower)) {
        return "📊 You can compare colleges side-by-side on our platform! Just head to the **Compare Colleges** page.\n\nYou can compare based on:\n• Fees & expenses\n• Placement records\n• Rankings\n• Infrastructure\n• Course offerings\n\nOr tell me which two colleges you'd like to compare, and I'll share what I know!";
    }

    // Default
    return "I can help you with a lot of things! Here's what you can ask me about:\n\n• 🏫 **College recommendations** by stream (Engineering, Medical, Commerce, Arts, Science)\n• 💰 **Fees & scholarships** information\n• 📋 **Admission processes** & entrance exams\n• 📊 **Compare colleges** side by side\n• 💼 **Placements & career** guidance\n• 🏠 **Hostel & accommodation** info\n\nJust type your question and I'll do my best to help! 😊";
};

/* ───── Suggested Pages ───── */
const getSuggestedPages = (message) => {
    const lower = message.toLowerCase();
    const pages = [];
    if (/\b(college|search|find|look|browse)\b/.test(lower)) {
        pages.push({ label: 'Search Colleges', path: '/colleges' });
    }
    if (/\b(compare|versus|vs)\b/.test(lower)) {
        pages.push({ label: 'Compare Colleges', path: '/compare' });
    }
    if (/\b(admission|apply|entrance)\b/.test(lower)) {
        pages.push({ label: 'Browse Colleges', path: '/colleges' });
    }
    return pages;
};

/* ───── Quick Suggestions (follow-up prompts) ───── */
const getQuickSuggestions = (message) => {
    const lower = message.toLowerCase();
    if (/\b(engineer|btech|cse)\b/.test(lower)) {
        return ['What are MHT-CET cutoffs?', 'Compare VJTI vs DJ Sanghvi', 'Engineering college fees'];
    }
    if (/\b(medical|mbbs|neet)\b/.test(lower)) {
        return ['NEET cutoff for Mumbai', 'Medical college fees', 'Best hospital for internship'];
    }
    if (/\b(commerce|bcom|ca)\b/.test(lower)) {
        return ['Best college for CA prep?', 'BMS vs B.Com', 'Commerce college placements'];
    }
    if (/\b(fee|scholarship|budget)\b/.test(lower)) {
        return ['Government college list', 'How to apply for scholarships?', 'Cheapest engineering colleges'];
    }
    if (/\b(hello|hi|hey)\b/.test(lower)) {
        return ['Best engineering colleges?', 'How do admissions work?', 'Compare two colleges'];
    }
    return [];
};

/* ───── Main Processing Function ───── */
const processChatMessage = async (message, userId = null, conversationHistory = []) => {
    const provider = getActiveProvider();
    console.log(`🤖 Active provider: ${provider || 'fallback (no API keys configured)'}`);

    try {
        let responseText;

        if (provider === 'openai') {
            responseText = await processWithOpenAI(message, conversationHistory);
        } else if (provider === 'gemini') {
            responseText = await processWithGemini(message, conversationHistory);
        } else {
            console.log('ℹ️  No AI provider configured – using rule-based fallback');
            responseText = fallbackResponse(message);
        }

        return {
            success: true,
            message: responseText,
            provider: provider || 'fallback',
            suggestedPages: getSuggestedPages(message),
            suggestions: getQuickSuggestions(message),
        };
    } catch (error) {
        console.error(`❌ Chatbot error (${provider}):`, error.message);

        // Always fallback to rule-based response on error – never fail
        return {
            success: true,
            message: fallbackResponse(message),
            provider: 'fallback',
            suggestedPages: getSuggestedPages(message),
            suggestions: getQuickSuggestions(message),
        };
    }
};

module.exports = { processChatMessage, getAvailableProviders, getActiveProvider };
