/**
 * StartupBenefits Deals Seeder
 * Run: node seeder.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Deal = require('./models/Deal');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Missing MONGO_URI in .env file');
  process.exit(1);
}
console.log('Using MONGO_URI:', MONGODB_URI);

// --------------------------------------------------
// CONNECT DB & SEED
// --------------------------------------------------

async function main() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected for seeding');
    await seedDatabase();
  } catch (err) {
    console.error('DB connection failed:', err);
    process.exit(1);
  }
}

// --------------------------------------------------
// DEAL DATA
// --------------------------------------------------

const deals = [
  {
    title: 'AWS Activate Credits',
    description:
      'Receive up to $5000 in AWS Activate credits to build and scale your startup infrastructure.',
    category: 'cloud',
    partnerName: 'Amazon Web Services',
    partnerLogo: 'https://logo.clearbit.com/aws.amazon.com',
    discountValue: '$5000 Credits',
    eligibilityRules: ['Early-stage startup', 'Valid website', 'Business email'],
    isLocked: true,
    maxClaims: 200,
  },

  {
    title: 'Notion Pro Workspace',
    description:
      'Get Notion Pro free for 6 months to manage documentation, tasks and startup knowledge base.',
    category: 'productivity',
    partnerName: 'Notion',
    partnerLogo: 'https://logo.clearbit.com/notion.so',
    discountValue: '6 Months Free',
    eligibilityRules: ['Team size under 10'],
    isLocked: false,
    maxClaims: 500,
  },

  {
    title: 'Stripe Payment Processing Discount',
    description:
      'Reduced transaction fees for startups processing online payments using Stripe.',
    category: 'development',
    partnerName: 'Stripe',
    partnerLogo: 'https://logo.clearbit.com/stripe.com',
    discountValue: '50% Fee Discount',
    eligibilityRules: ['New Stripe account required'],
    isLocked: true,
    maxClaims: 150,
  },

  {
    title: 'Figma Professional Plan',
    description:
      'Free Figma Professional plan for design teams working on startup UI/UX.',
    category: 'design',
    partnerName: 'Figma',
    partnerLogo: 'https://logo.clearbit.com/figma.com',
    discountValue: '3 Months Free',
    eligibilityRules: ['Startup team', 'Design usage'],
    isLocked: false,
    maxClaims: 300,
  },

  {
    title: 'Google Cloud Startup Credits',
    description:
      'Receive up to $3000 in Google Cloud credits for hosting, databases and APIs.',
    category: 'cloud',
    partnerName: 'Google Cloud',
    partnerLogo: 'https://logo.clearbit.com/cloud.google.com',
    discountValue: '$3000 Credits',
    eligibilityRules: ['Early startup', 'Business email required'],
    isLocked: true,
    maxClaims: 250,
  },

  {
    title: 'HubSpot Marketing Starter',
    description:
      'Access HubSpot marketing automation tools with special startup pricing.',
    category: 'marketing',
    partnerName: 'HubSpot',
    partnerLogo: 'https://logo.clearbit.com/hubspot.com',
    discountValue: '50% Off 6 Months',
    eligibilityRules: ['Marketing usage'],
    isLocked: false,
    maxClaims: 200,
  },

  {
    title: 'DigitalOcean Cloud Credits',
    description:
      'Free infrastructure credits for startups to deploy scalable applications.',
    category: 'cloud',
    partnerName: 'DigitalOcean',
    partnerLogo: 'https://logo.clearbit.com/digitalocean.com',
    discountValue: '$1000 Credits',
    eligibilityRules: ['Startup project'],
    isLocked: true,
    maxClaims: 300,
  },

  {
    title: 'Mixpanel Analytics Growth Plan',
    description:
      'Access Mixpanel advanced analytics tools to track user behavior and product metrics.',
    category: 'analytics',
    partnerName: 'Mixpanel',
    partnerLogo: 'https://logo.clearbit.com/mixpanel.com',
    discountValue: 'Free Growth Plan',
    eligibilityRules: ['Early product stage'],
    isLocked: false,
    maxClaims: 400,
  },

  {
    title: 'Canva Pro Team Plan',
    description:
      'Create stunning marketing visuals using Canva Pro team workspace.',
    category: 'design',
    partnerName: 'Canva',
    partnerLogo: 'https://logo.clearbit.com/canva.com',
    discountValue: '4 Months Free',
    eligibilityRules: ['Design and marketing usage'],
    isLocked: false,
    maxClaims: 350,
  },

  {
    title: 'SendGrid Email Credits',
    description:
      'Transactional email service credits for sending onboarding and notification emails.',
    category: 'development',
    partnerName: 'SendGrid',
    partnerLogo: 'https://logo.clearbit.com/sendgrid.com',
    discountValue: '100K Free Emails',
    eligibilityRules: ['Email verification required'],
    isLocked: true,
    maxClaims: 200,
  },
];

// --------------------------------------------------
// SEED FUNCTION
// --------------------------------------------------

async function seedDatabase() {
  try {
    console.log('Clearing old deals...');
    await Deal.deleteMany();

    console.log('Inserting new deals...');
    await Deal.insertMany(deals);

    console.log('Deals seeded successfully');
    process.exit();
  } catch (error) {
    if (error.name === 'ValidationError') {
      for (const field in error.errors) {
        console.error(`Validation error for ${field}:`, error.errors[field].message);
      }
    } else {
      console.error('Seeding failed:', error);
    }
    process.exit(1);
  }
}

main();
