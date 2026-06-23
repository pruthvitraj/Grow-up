// seed.js — Run with: node seed.js
// Clears all Users, FounderProfiles, InvestorProfiles
// and re-inserts rich dummy data with ALL fields filled.

'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const User           = require('./models/User');
const FounderProfile = require('./models/FounderProfile');
const InvestorProfile = require('./models/InvestorProfile');

// ─────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────
const hash = (pw) => bcrypt.hashSync(pw, 10);

// ─────────────────────────────────────────────────────
// FOUNDERS — User rows
// ─────────────────────────────────────────────────────
const founderUsers = [
    {
        name: 'Arjun Mehta',
        email: 'arjun.mehta@agrotech.in',
        password: hash('Founder@123'),
        role: 'founder',
        status: 'approved',
        isProfileComplete: true,
        meetingLink: 'https://meet.google.com/arjun-agrotech',
    },
    {
        name: 'Priya Sharma',
        email: 'priya.sharma@healthbridge.io',
        password: hash('Founder@123'),
        role: 'founder',
        status: 'approved',
        isProfileComplete: true,
        meetingLink: 'https://meet.google.com/priya-healthbridge',
    },
    {
        name: 'Rohit Verma',
        email: 'rohit.verma@eduvision.co.in',
        password: hash('Founder@123'),
        role: 'founder',
        status: 'approved',
        isProfileComplete: true,
        meetingLink: 'https://meet.google.com/rohit-eduvision',
    },
    {
        name: 'Sneha Patil',
        email: 'sneha.patil@finwave.in',
        password: hash('Founder@123'),
        role: 'founder',
        status: 'approved',
        isProfileComplete: true,
        meetingLink: 'https://meet.google.com/sneha-finwave',
    },
    {
        name: 'Karan Singh',
        email: 'karan.singh@logixai.tech',
        password: hash('Founder@123'),
        role: 'founder',
        status: 'approved',
        isProfileComplete: true,
        meetingLink: 'https://meet.google.com/karan-logixai',
    },
    {
        name: 'Divya Nair',
        email: 'divya.nair@greenloop.in',
        password: hash('Founder@123'),
        role: 'founder',
        status: 'approved',
        isProfileComplete: true,
        meetingLink: 'https://meet.google.com/divya-greenloop',
    },
];

// ─────────────────────────────────────────────────────
// INVESTORS — User rows
// ─────────────────────────────────────────────────────
const investorUsers = [
    {
        name: 'Vikram Bahl',
        email: 'vikram.bahl@nexusventures.in',
        password: hash('Investor@123'),
        role: 'investor',
        status: 'approved',
        isProfileComplete: true,
        meetingLink: 'https://meet.google.com/vikram-nexus',
    },
    {
        name: 'Ananya Kapoor',
        email: 'ananya.kapoor@bluehill.vc',
        password: hash('Investor@123'),
        role: 'investor',
        status: 'approved',
        isProfileComplete: true,
        meetingLink: 'https://meet.google.com/ananya-bluehill',
    },
    {
        name: 'Rajesh Iyer',
        email: 'rajesh.iyer@growthspark.co.in',
        password: hash('Investor@123'),
        role: 'investor',
        status: 'approved',
        isProfileComplete: true,
        meetingLink: 'https://meet.google.com/rajesh-growthspark',
    },
    {
        name: 'Meera Pillai',
        email: 'meera.pillai@sunrisefund.in',
        password: hash('Investor@123'),
        role: 'investor',
        status: 'approved',
        isProfileComplete: true,
        meetingLink: 'https://meet.google.com/meera-sunrise',
    },
    {
        name: 'Aman Gupta',
        email: 'aman.gupta@scalecap.vc',
        password: hash('Investor@123'),
        role: 'investor',
        status: 'approved',
        isProfileComplete: true,
        meetingLink: 'https://meet.google.com/aman-scalecap',
    },
    {
        name: 'Lakshmi Rajan',
        email: 'lakshmi.rajan@innovatefund.in',
        password: hash('Investor@123'),
        role: 'investor',
        status: 'approved',
        isProfileComplete: true,
        meetingLink: 'https://meet.google.com/lakshmi-innovate',
    },
];

// ─────────────────────────────────────────────────────
// BUILD FounderProfile data given a user _id
// ─────────────────────────────────────────────────────
function buildFounderProfiles(userDocs) {
    const profiles = [
        // ── Arjun Mehta — AgroTech ──
        {
            user: userDocs[0]._id,
            startupName: 'AgroTech Solutions',
            startupImage: 'startup-images/agrotech-cover.jpg',
            tagline: 'Empowering Indian Farmers with AI & IoT',
            industry: 'AgriTech',
            startupDescription:
                'AgroTech Solutions uses AI-driven soil analysis and IoT sensors to help small and marginal farmers double their crop yield while reducing water usage by 40%. Our platform delivers real-time crop health alerts, weather-based irrigation advice, and connects farmers directly with buyers — eliminating middlemen.',
            problemStatement:
                'Over 60% of Indian farmers rely on outdated farming methods, resulting in poor yield, high water wastage, and low income. There are no affordable precision farming tools for small landholding farmers.',
            solutionOverview:
                'A mobile-first platform with low-cost IoT sensor kits that monitor soil moisture, temperature, and pH. Our AI engine provides actionable advice in the local language. A built-in marketplace connects farmers directly to FPOs and urban retailers.',
            targetMarket:
                'India has 146 million smallholder farms. We target Maharashtra, Karnataka, and Punjab in Phase 1, covering ~12 million farmers. TAM is estimated at ₹18,000 Cr.',
            founderLinkedin: 'https://linkedin.com/in/arjunmehta-agrotech',
            foundedYear: '2022-06-15',
            startupLocation: 'Pune, Maharashtra',
            valuation: 15000000,
            fundingRequirement: 5000000,
            equityOffer: 12,
            fundingType: ['Equity', 'Grant'],
            existingInvestors: 'Yes',
            businessModel:
                'Hardware-as-a-service (₹499/month subscription for IoT kit). SaaS platform fee: ₹199/month per farm. 2% transaction fee on marketplace sales.',
            useOfFunds:
                '40% Product R&D, 30% Sales & Marketing across 3 new states, 20% Operations, 10% Working Capital',
            pitchDeckUrl: 'pitch-decks/agrotech-pitch-deck.pdf',
            pitchVideoUrl: 'https://youtube.com/watch?v=agrotech-demo',
            productImageUrl: 'product-images/agrotech-app-screenshot.jpeg',
            teamSize: 18,
            coFounders: 'Rahul Desai (CTO, ex-Infosys IoT), Sunita Rao (COO, ex-ITC Agri)',
            experienceBackground:
                '12 years in AgriTech & IoT. Former product head at Fasal. Published researcher at ICAR. MBA IIM Ahmedabad.',
            gstNumber: '27ABCDE1234F1Z5',
            firmRegistration: 'registration-docs/agrotech-cin.pdf',
            patentDetails: 'patent-docs/agrotech-soil-sensor-patent.pdf',
        },

        // ── Priya Sharma — HealthBridge ──
        {
            user: userDocs[1]._id,
            startupName: 'HealthBridge',
            startupImage: 'startup-images/healthbridge-cover.jpg',
            tagline: 'AI-Powered Diagnostics for Tier-2 India',
            industry: 'HealthTech',
            startupDescription:
                'HealthBridge builds affordable AI diagnostic kits and a telemedicine platform that brings specialist healthcare to Tier-2 and Tier-3 cities. Our handheld diagnostic device connects to a smartphone and performs 25+ lab tests in under 5 minutes. Results are reviewed by our AI and triaged to empanelled specialist doctors within 2 hours.',
            problemStatement:
                'India has only 1 doctor per 1,445 citizens (WHO recommends 1:1000). 600+ million people in Tier-2/3 cities have no access to specialist care. Over 70% of preventable deaths occur due to late or no diagnosis.',
            solutionOverview:
                'Portable diagnostic device (₹3,500 MRP) + HealthBridge mobile app offering tele-consultation for ₹99. AI triages urgency, pre-diagnoses from test results, and prescribes using clinical decision support. Hospital referral module for severe cases.',
            targetMarket:
                'Primary: Tier-2/3 India — 550 million people. Secondary: South-East Asia diaspora markets. SAM: 80M unserved patients. SOM Y3: 5M patients. Currently serving 40,000 patients/month in Rajasthan and UP.',
            founderLinkedin: 'https://linkedin.com/in/priyasharma-healthbridge',
            foundedYear: '2021-03-10',
            startupLocation: 'Jaipur, Rajasthan',
            valuation: 25000000,
            fundingRequirement: 8000000,
            equityOffer: 15,
            fundingType: ['Equity', 'Debt'],
            existingInvestors: 'Yes',
            businessModel:
                'Device sale + SaaS subscription ₹499/month (clinics). Telemedicine consultation revenue-share 30%. B2B: Govt. health scheme empanelment target in 2025.',
            useOfFunds:
                '35% Clinical trial & CDSCO regulatory clearance, 25% Expansion to 5 new states, 25% Tech R&D (AI model improvement), 15% Team hiring',
            pitchDeckUrl: 'pitch-decks/healthbridge-pitch-deck.pdf',
            pitchVideoUrl: 'https://youtube.com/watch?v=healthbridge-demo',
            productImageUrl: 'product-images/healthbridge-device.jpeg',
            teamSize: 32,
            coFounders: 'Dr. Anil Kumar (CMO, AIIMS alumnus), Prateek Shah (CTO, ex-Philips Healthcare)',
            experienceBackground:
                '8 years in digital health. Ex-Apollo Telemedicine. Medical devices background. MS Biomedical Engineering, IIT Bombay.',
            gstNumber: '08ABCDE5678G2Z3',
            firmRegistration: 'registration-docs/healthbridge-cin.pdf',
            patentDetails: 'patent-docs/healthbridge-diagnostic-patent.pdf',
        },

        // ── Rohit Verma — EduVision ──
        {
            user: userDocs[2]._id,
            startupName: 'EduVision',
            startupImage: 'startup-images/eduvision-cover.jpg',
            tagline: 'Personalised Learning for Every Bharat Student',
            industry: 'EdTech',
            startupDescription:
                'EduVision is an AI-powered adaptive learning platform that curates personalised study plans for students of Class 6-12 in vernacular languages. Our platform analyses each student\'s learning style, weak zones, and exam patterns to generate custom quizzes, micro-lectures, and revision schedules. Integrated with NCERT & State Board curriculum.',
            problemStatement:
                'Only 29% of students in Tier-3 towns can afford quality coaching. Generic online platforms have 85% dropout rates because curriculum is not personalised. There is zero vernacular support on major platforms.',
            solutionOverview:
                'AI learning engine in 8 Indian languages, adaptive question bank of 5 lakh questions, real-time dashboards for parents and teachers, live doubt-clearing sessions with verified teachers for ₹29/session.',
            targetMarket:
                'India — 250 million school students. EdTech TAM by 2026: ₹2 lakh Cr. Initial: CBSE + Maharashtra Board. 80,000 active students in Y1.',
            founderLinkedin: 'https://linkedin.com/in/rohitverma-eduvision',
            foundedYear: '2023-01-20',
            startupLocation: 'Nagpur, Maharashtra',
            valuation: 10000000,
            fundingRequirement: 3000000,
            equityOffer: 18,
            fundingType: ['Equity'],
            existingInvestors: 'No',
            businessModel:
                'Freemium: Basic access free. Premium: ₹399/month per student. School B2B: ₹75,000/year per school for 500 students. Teacher marketplace: 20% revenue share.',
            useOfFunds:
                '45% AI & content development, 25% Marketing & student acquisition, 20% Vernacular language expansion, 10% Infrastructure',
            pitchDeckUrl: 'pitch-decks/eduvision-pitch-deck.pdf',
            pitchVideoUrl: 'https://youtube.com/watch?v=eduvision-demo',
            productImageUrl: 'product-images/eduvision-app.jpeg',
            teamSize: 14,
            coFounders: 'Anjali Tiwari (CPO, ex-BYJU\'S), Saurabh Joshi (CTO, ex-Toppr)',
            experienceBackground:
                '10 years in EdTech. Led product at Unacademy for 3 years. Ph.D. Computer Science — NLP & AI, IIT Delhi.',
            gstNumber: '27MNOPQ9012H3Z8',
            firmRegistration: 'registration-docs/eduvision-cin.pdf',
            patentDetails: 'patent-docs/eduvision-adaptive-ai-patent.pdf',
        },

        // ── Sneha Patil — FinWave ──
        {
            user: userDocs[3]._id,
            startupName: 'FinWave',
            startupImage: 'startup-images/finwave-cover.jpg',
            tagline: 'Credit Access for the Missing Middle',
            industry: 'FinTech',
            startupDescription:
                'FinWave is a neo-lending platform offering instant working capital loans of ₹50K–₹25L to micro and small businesses using alternate data — GST returns, transaction history, and social signals — that traditional banks ignore. Fully digital. Loan disbursed in 4 hours. NPA rate below 2.5%.',
            problemStatement:
                '63 million MSMEs in India face a collective credit gap of ₹25 lakh crore. Traditional banks reject 80% of MSME loan applications due to lack of collateral and credit history. This kills business growth at the earliest stage.',
            solutionOverview:
                'AI credit scoring using 200+ alternate data points. Digital KYC and e-NACH for zero-documentation loans. Embedded in accounting tools like Tally and Zoho Books. Repayment linked to daily UPI settlement.',
            targetMarket:
                'India: 63 million MSMEs. TAM: ₹25 lakh crore credit gap. Initial focus: retail and F&B MSMEs in Maharashtra and Gujarat.',
            founderLinkedin: 'https://linkedin.com/in/snehapatil-finwave',
            foundedYear: '2022-09-01',
            startupLocation: 'Mumbai, Maharashtra',
            valuation: 50000000,
            fundingRequirement: 15000000,
            equityOffer: 10,
            fundingType: ['Equity', 'Debt'],
            existingInvestors: 'Yes',
            businessModel:
                'Processing fee: 1.5% of loan amount. Interest income: 18–24% p.a. (pass-through to NBFC partner). SaaS fee for embedded lending partners: ₹5,000/month.',
            useOfFunds:
                '40% Loan book expansion (NBFC partnership), 25% AI & risk model improvement, 20% Regulatory (RBI NBFC-AA license cost), 15% New verticals (healthcare MSME)',
            pitchDeckUrl: 'pitch-decks/finwave-pitch-deck.pdf',
            pitchVideoUrl: 'https://youtube.com/watch?v=finwave-demo',
            productImageUrl: 'product-images/finwave-dashboard.jpeg',
            teamSize: 27,
            coFounders: 'Ashwin Deshmukh (CFO, ex-HDFC Bank), Tanvi Kulkarni (CPO, ex-Razorpay)',
            experienceBackground:
                '15 years in FinTech and NBFC lending. Ex-CreditMantri, MBA Finance from IIM Calcutta. Built ₹300Cr loan book in previous role.',
            gstNumber: '27RSTUW3456I4Z6',
            firmRegistration: 'registration-docs/finwave-cin.pdf',
            patentDetails: 'patent-docs/finwave-credit-model-patent.pdf',
        },

        // ── Karan Singh — LogixAI ──
        {
            user: userDocs[4]._id,
            startupName: 'LogixAI',
            startupImage: 'startup-images/logixai-cover.jpg',
            tagline: 'Autonomous Supply Chain Intelligence',
            industry: 'Logistics & Supply Chain',
            startupDescription:
                'LogixAI uses machine learning to predict demand, optimize inventory, and automate last-mile logistics for D2C brands and e-commerce sellers. Integrated with Shopify, Amazon, and Meesho. Reduces supply chain costs by 30% and out-of-stock events by 60%.',
            problemStatement:
                'Indian e-commerce brands lose ₹40,000 Cr/year due to poor demand forecasting, overstocking, and last-mile inefficiencies. Manual logistics planning is reactive, expensive, and fragmented across 7+ carriers.',
            solutionOverview:
                'One dashboard — connects to all sales channels and 15+ courier partners. AI forecasts demand 30 days ahead. Auto-creates purchase orders. Smart routing engine picks cheapest + fastest carrier per pin code.',
            targetMarket:
                'India: 1.5 lakh D2C brands, 5 million e-commerce sellers. TAM: ₹4.7 lakh crore logistics market. Targeting brands doing ₹50L–₹10Cr GMV annually.',
            founderLinkedin: 'https://linkedin.com/in/karansingh-logixai',
            foundedYear: '2023-07-11',
            startupLocation: 'Bengaluru, Karnataka',
            valuation: 20000000,
            fundingRequirement: 6000000,
            equityOffer: 14,
            fundingType: ['Equity'],
            existingInvestors: 'No',
            businessModel:
                'SaaS: ₹2,999–₹9,999/month based on order volume. Carrier integration fee: ₹0.5 per shipment. Premium analytics tier: ₹14,999/month.',
            useOfFunds:
                '35% AI model development, 30% Sales & BD (target 500 brands by Q4), 20% Carrier integrations, 15% Cloud infra scaling',
            pitchDeckUrl: 'pitch-decks/logixai-pitch-deck.pdf',
            pitchVideoUrl: 'https://youtube.com/watch?v=logixai-demo',
            productImageUrl: 'product-images/logixai-platform.jpeg',
            teamSize: 11,
            coFounders: 'Nishant Bose (CTO, ex-Delhivery ML), Pooja Anand (VP Sales, ex-Unicommerce)',
            experienceBackground:
                '9 years in logistics tech. Former data scientist at Flipkart supply chain. B.Tech + M.Tech IIT Kanpur, specialization in Operations Research.',
            gstNumber: '29XYZAB7890J5Z1',
            firmRegistration: 'registration-docs/logixai-cin.pdf',
            patentDetails: '',
        },

        // ── Divya Nair — GreenLoop ──
        {
            user: userDocs[5]._id,
            startupName: 'GreenLoop',
            startupImage: 'startup-images/greenloop-cover.jpg',
            tagline: 'Circular Economy for Indian Plastics',
            industry: 'CleanTech',
            startupDescription:
                'GreenLoop is a B2B reverse-logistics platform that collects post-consumer plastic waste from brand partners, sorts it using AI-powered optical scanners, and sells certified recycled pellets back to FMCG and packaging companies. Our EPR (Extended Producer Responsibility) compliance dashboard helps brands meet CPCB mandates.',
            problemStatement:
                'India generates 3.5 million tonnes of plastic waste annually. Only 30% is recycled — the rest goes to landfills or water bodies. Brands have mandatory EPR targets but no reliable, scalable compliance partner. Informal recyclers are unorganised and incapable of providing audit trails.',
            solutionOverview:
                'Scheduled B2B waste pick-up → AI sorting centre → certified recycling facility → supply of recycled pellets. EPR compliance dashboard with real-time CPCB-ready reports. Carbon credit generation for brands.',
            targetMarket:
                'India: 35,000 FMCG & packaging companies with EPR mandates. TAM: ₹12,000 Cr recycled plastics market by 2027. Starting: Maharashtra, Karnataka, Tamil Nadu.',
            founderLinkedin: 'https://linkedin.com/in/divyanair-greenloop',
            foundedYear: '2022-11-05',
            startupLocation: 'Chennai, Tamil Nadu',
            valuation: 12000000,
            fundingRequirement: 4000000,
            equityOffer: 16,
            fundingType: ['Equity', 'Grant'],
            existingInvestors: 'Yes',
            businessModel:
                'Recurring B2B contract: ₹12–₹18/kg of plastic collected. Recycled pellet premium pricing: ₹55–₹80/kg. EPR SaaS dashboard: ₹8,000/month per brand.',
            useOfFunds:
                '40% Sorting centre capacity expansion (3 new cities), 25% AI scanner R&D, 20% Sales & brand partnerships, 15% Regulatory & certification costs',
            pitchDeckUrl: 'pitch-decks/greenloop-pitch-deck.pdf',
            pitchVideoUrl: 'https://youtube.com/watch?v=greenloop-demo',
            productImageUrl: 'product-images/greenloop-facility.jpeg',
            teamSize: 23,
            coFounders: 'Rajan Nair (COO, ex-Recykal), Dr. Kavitha Menon (CSO, ex-TERI)',
            experienceBackground:
                '11 years in sustainability and circular economy. Founded two sustainability consulting firms. MBA Sustainability, XLRI Jamshedpur.',
            gstNumber: '33CDEFG2345K6Z9',
            firmRegistration: 'registration-docs/greenloop-cin.pdf',
            patentDetails: 'patent-docs/greenloop-optical-sorter-patent.pdf',
        },
    ];
    return profiles;
}

// ─────────────────────────────────────────────────────
// BUILD InvestorProfile data given a user _id
// ─────────────────────────────────────────────────────
function buildInvestorProfiles(userDocs) {
    const profiles = [
        // ── Vikram Bahl — Nexus Ventures ──
        {
            user: userDocs[0]._id,
            investorprofilePhoto: 'avatars/vikram-bahl-nexus.jpg',
            jobStatus: 'Managing Partner, Nexus Ventures India',
            investmentRange: '₹50L-5Cr',
            investmentActiveness: 'Very Active',
            investmentInterest: 'AgriTech, CleanTech, B2B SaaS',
            investorLocation: 'Mumbai, Maharashtra',
            investmentType: ['Equity', 'Grant'],
            pan: 'ABCPV1234D',
            investorLinkedin: 'https://linkedin.com/in/vikrambahl-nexus',
            proofOfFunds: 'investor-docs/vikram-proof-of-funds.pdf',
            kycId: 'investor-docs/vikram-kyc-aadhaar.pdf',
            notificationPreference: 'email',
            communicationPreference: 'webMeeting',
            acceptTerms: true,
        },

        // ── Ananya Kapoor — Bluehill VC ──
        {
            user: userDocs[1]._id,
            investorprofilePhoto: 'avatars/ananya-kapoor-bluehill.jpg',
            jobStatus: 'General Partner, Bluehill Ventures',
            investmentRange: '₹25L-2Cr',
            investmentActiveness: 'Active',
            investmentInterest: 'HealthTech, EdTech, Consumer Tech',
            investorLocation: 'Bengaluru, Karnataka',
            investmentType: ['Equity'],
            pan: 'BCQAK5678E',
            investorLinkedin: 'https://linkedin.com/in/ananyakapoor-bluehill',
            proofOfFunds: 'investor-docs/ananya-proof-of-funds.pdf',
            kycId: 'investor-docs/ananya-kyc-pan.pdf',
            notificationPreference: 'email',
            communicationPreference: 'webMeeting',
            acceptTerms: true,
        },

        // ── Rajesh Iyer — GrowthSpark ──
        {
            user: userDocs[2]._id,
            investorprofilePhoto: 'avatars/rajesh-iyer-growthspark.jpg',
            jobStatus: 'Angel Investor & Mentor, GrowthSpark Network',
            investmentRange: '₹10L-50L',
            investmentActiveness: 'Active',
            investmentInterest: 'EdTech, Logistics, D2C Brands',
            investorLocation: 'Hyderabad, Telangana',
            investmentType: ['Equity', 'Convertible Note'],
            pan: 'CDRJI9012F',
            investorLinkedin: 'https://linkedin.com/in/rajeshiyer-growthspark',
            proofOfFunds: 'investor-docs/rajesh-proof-of-funds.pdf',
            kycId: 'investor-docs/rajesh-kyc-driving-license.pdf',
            notificationPreference: 'sms',
            communicationPreference: 'chatbox',
            acceptTerms: true,
        },

        // ── Meera Pillai — Sunrise Fund ──
        {
            user: userDocs[3]._id,
            investorprofilePhoto: 'avatars/meera-pillai-sunrise.jpg',
            jobStatus: 'Founder & Managing Director, Sunrise Impact Fund',
            investmentRange: '₹50L-5Cr',
            investmentActiveness: 'Very Active',
            investmentInterest: 'FinTech, CleanTech, Social Impact',
            investorLocation: 'Chennai, Tamil Nadu',
            investmentType: ['Equity', 'Debt', 'Grant'],
            pan: 'DESMP3456G',
            investorLinkedin: 'https://linkedin.com/in/meerapillai-sunrise',
            proofOfFunds: 'investor-docs/meera-proof-of-funds.pdf',
            kycId: 'investor-docs/meera-kyc-passport.pdf',
            notificationPreference: 'email',
            communicationPreference: 'webMeeting',
            acceptTerms: true,
        },

        // ── Aman Gupta — ScaleCap ──
        {
            user: userDocs[4]._id,
            investorprofilePhoto: 'avatars/aman-gupta-scalecap.jpg',
            jobStatus: 'Partner, ScaleCap Ventures',
            investmentRange: '₹1Cr-10Cr',
            investmentActiveness: 'Moderate',
            investmentInterest: 'FinTech, B2B SaaS, Logistics',
            investorLocation: 'Gurugram, Haryana',
            investmentType: ['Equity'],
            pan: 'EFTAG7890H',
            investorLinkedin: 'https://linkedin.com/in/amangupta-scalecap',
            proofOfFunds: 'investor-docs/aman-proof-of-funds.pdf',
            kycId: 'investor-docs/aman-kyc-aadhaar.pdf',
            notificationPreference: 'email',
            communicationPreference: 'webMeeting',
            acceptTerms: true,
        },

        // ── Lakshmi Rajan — Innovate Fund ──
        {
            user: userDocs[5]._id,
            investorprofilePhoto: 'avatars/lakshmi-rajan-innovate.jpg',
            jobStatus: 'CIO & Angel Investor, Innovate Fund',
            investmentRange: '₹10L-1Cr',
            investmentActiveness: 'Active',
            investmentInterest: 'AgriTech, HealthTech, Rural Tech',
            investorLocation: 'Pune, Maharashtra',
            investmentType: ['Equity', 'Grant'],
            pan: 'FGULR2345I',
            investorLinkedin: 'https://linkedin.com/in/lakshmirajan-innovate',
            proofOfFunds: 'investor-docs/lakshmi-proof-of-funds.pdf',
            kycId: 'investor-docs/lakshmi-kyc-pan.pdf',
            notificationPreference: 'sms',
            communicationPreference: 'chatbox',
            acceptTerms: true,
        },
    ];
    return profiles;
}

// ─────────────────────────────────────────────────────
// MAIN SEED FUNCTION
// ─────────────────────────────────────────────────────
async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`\n✅  Connected to MongoDB: ${mongoose.connection.name}\n`);

    // ── 1. Drop existing data ──
    console.log('🗑️  Clearing FounderProfile, InvestorProfile, and seed User records...');
    await FounderProfile.deleteMany({});
    await InvestorProfile.deleteMany({});

    // Delete only seed emails to avoid wiping real admin / other users
    const allSeedEmails = [
        ...founderUsers.map(u => u.email),
        ...investorUsers.map(u => u.email),
    ];
    await User.deleteMany({ email: { $in: allSeedEmails } });
    console.log('   Done.\n');

    // ── 2. Insert founder Users ──
    console.log('👤  Inserting 6 Founder users...');
    const insertedFounderUsers = await User.insertMany(founderUsers);
    console.log(`   Inserted: ${insertedFounderUsers.map(u => u.name).join(', ')}\n`);

    // ── 3. Insert investor Users ──
    console.log('💼  Inserting 6 Investor users...');
    const insertedInvestorUsers = await User.insertMany(investorUsers);
    console.log(`   Inserted: ${insertedInvestorUsers.map(u => u.name).join(', ')}\n`);

    // ── 4. Insert FounderProfiles ──
    console.log('🚀  Inserting 6 FounderProfiles...');
    const founderProfiles = buildFounderProfiles(insertedFounderUsers);
    await FounderProfile.insertMany(founderProfiles);
    console.log('   Done.\n');

    // ── 5. Insert InvestorProfiles ──
    console.log('📈  Inserting 6 InvestorProfiles...');
    const investorProfiles = buildInvestorProfiles(insertedInvestorUsers);
    await InvestorProfile.insertMany(investorProfiles);
    console.log('   Done.\n');

    // ── 6. Summary ──
    const fCount = await FounderProfile.countDocuments();
    const iCount = await InvestorProfile.countDocuments();
    const uCount = await User.countDocuments();

    console.log('══════════════════════════════════════════════');
    console.log(`✅  Seed complete!`);
    console.log(`   Users total       : ${uCount}`);
    console.log(`   FounderProfiles   : ${fCount}`);
    console.log(`   InvestorProfiles  : ${iCount}`);
    console.log('══════════════════════════════════════════════\n');

    console.log('🔐  Login credentials for all seeded accounts: password = Founder@123 / Investor@123\n');
    console.log('   FOUNDER EMAILS:');
    founderUsers.forEach(u => console.log(`    ${u.email}`));
    console.log('\n   INVESTOR EMAILS:');
    investorUsers.forEach(u => console.log(`    ${u.email}`));
    console.log('');

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(err => {
    console.error('❌  Seed failed:', err);
    process.exit(1);
});
