import { JobPosting, CandidateRecord, CompanyProfile } from '../types';
import { verifyAllCandidateSkills } from '../lib/evidenceEngine';

export const initialCompanyProfile: CompanyProfile = {
  name: 'Acuity Analytics & Fintech',
  tagline: 'Empowering real-time financial intelligence with verified talent.',
  industry: 'Fintech & Enterprise Analytics',
  size: '150-500 employees',
  website: 'https://acuityanalytics.io',
  location: 'San Francisco, CA (Hybrid)',
  about: 'Acuity Analytics builds predictive decision platforms for enterprise treasury and banking teams. We believe in high-integrity, evidence-backed hiring.',
  recruiterName: 'Jessica Miller',
  recruiterEmail: 'jessica.m@acuityanalytics.io'
};

export const sampleDataAnalystJob: JobPosting = {
  id: 'job-da-101',
  title: 'Senior Data Analyst (Fintech)',
  department: 'Data Intelligence',
  location: 'San Francisco, CA / Remote',
  type: 'Full-time',
  experienceRequiredYears: 3,
  salaryRange: '$125,000 - $155,000',
  description: `We are looking for an analytical powerhouse to turn complex transaction and market data into actionable business recommendations. You will design automated dashboards, lead A/B experiment evaluations, write high-performance SQL transformations, and present insights to executive leaders.

Requirements:
- Advanced SQL and relational database query optimization
- Advanced Python for exploratory data analysis (Pandas, NumPy, Scikit-learn)
- Business Intelligence visualization expertise (Tableau or Power BI)
- Solid foundation in Statistical Modeling & A/B testing
- Experience with modern cloud data warehouses (Snowflake, BigQuery, or Redshift)
- Proven portfolio of real-world data projects with measurable business impact`,
  requiredSkills: [
    { id: 'rs-1', skillName: 'SQL', requiredLevel: 'Advanced', importance: 'Critical' },
    { id: 'rs-2', skillName: 'Python', requiredLevel: 'Advanced', importance: 'Critical' },
    { id: 'rs-3', skillName: 'Tableau', requiredLevel: 'Intermediate', importance: 'High' },
    { id: 'rs-4', skillName: 'Statistical Modeling', requiredLevel: 'Intermediate', importance: 'High' },
    { id: 'rs-5', skillName: 'Snowflake', requiredLevel: 'Intermediate', importance: 'Medium' },
    { id: 'rs-6', skillName: 'A/B Testing', requiredLevel: 'Intermediate', importance: 'Medium' }
  ],
  createdAt: '2026-09-01',
  active: true,
  totalApplicants: 5
};

export const sampleJobs: JobPosting[] = [
  sampleDataAnalystJob,
  {
    id: 'job-swe-102',
    title: 'Full Stack Software Engineer',
    department: 'Core Engineering',
    location: 'Remote',
    type: 'Full-time',
    experienceRequiredYears: 3,
    salaryRange: '$135,000 - $165,000',
    description: 'Build robust, scalable web services and reactive user interfaces using TypeScript, React, Node.js, and PostgreSQL.',
    requiredSkills: [
      { id: 'rs-swe-1', skillName: 'TypeScript', requiredLevel: 'Advanced', importance: 'Critical' },
      { id: 'rs-swe-2', skillName: 'React', requiredLevel: 'Advanced', importance: 'Critical' },
      { id: 'rs-swe-3', skillName: 'Node.js', requiredLevel: 'Intermediate', importance: 'High' },
      { id: 'rs-swe-4', skillName: 'PostgreSQL', requiredLevel: 'Intermediate', importance: 'High' },
      { id: 'rs-swe-5', skillName: 'Docker', requiredLevel: 'Intermediate', importance: 'Medium' }
    ],
    createdAt: '2026-09-04',
    active: true,
    totalApplicants: 3
  }
];

export const sampleCandidates: CandidateRecord[] = [
  {
    id: 'cand-sarah-chen',
    jobId: 'job-da-101',
    appliedDate: '2026-09-02',
    hiringStatus: 'Shortlisted',
    shortlisted: true,
    candidateProfile: {
      id: 'cand-sarah-chen',
      name: 'Sarah Chen',
      email: 'sarah.chen@analytics-pro.dev',
      phone: '+1 (415) 892-4119',
      location: 'San Francisco, CA',
      title: 'Senior Data Analyst | Product & Growth',
      summary: 'Data analyst with 4+ years converting transaction volumes into product growth strategies. Proven track record optimizing ETL pipelines in Snowflake and driving $1.8M ARR expansion through cohort analysis.',
      githubUrl: 'https://github.com/sarahchen-data',
      portfolioUrl: 'https://sarahchen.me',
      codingProfiles: [
        { platform: 'Kaggle', url: 'https://kaggle.com/sarahchen', score: 'Top 8% Contributor' }
      ],
      education: [
        {
          degree: 'Bachelor of Science',
          field: 'Applied Mathematics & Statistics',
          institution: 'UC Berkeley',
          year: '2022',
          gpa: '3.82'
        }
      ],
      experience: [
        {
          role: 'Data Analyst II',
          company: 'LendVantage Inc.',
          duration: '2022 - Present (2.5 yrs)',
          years: 2.5,
          description: [
            'Architected 18 core Looker and Tableau dashboards tracking loan origination funnel.',
            'Authored SQL queries against 40M+ transaction tables in Snowflake with sub-second response times.'
          ],
          highlights: [
            'Decreased fraud underwriting evaluation time by 34% through automated logistic regression scoring.',
            'Mentored 3 junior business analysts on SQL optimization and reproducible research.'
          ]
        },
        {
          role: 'Junior Business Intelligence Analyst',
          company: 'FinMetrics Corp',
          duration: '2021 - 2022 (1 yr)',
          years: 1.0,
          description: [
            'Built automated data quality validation tests in Python and scheduled with dbt.',
            'Collaborated with marketing stakeholders to analyze multi-touch attribution models.'
          ],
          highlights: [
            'Automated weekly investor reporting decks saving 9 hours of manual entry per cycle.'
          ]
        }
      ],
      internships: [
        {
          role: 'Data Science Intern',
          company: 'Square Labs',
          duration: 'Summer 2021 (3 mos)',
          projects: ['Merchant Churn Prediction pipeline with XGBoost']
        }
      ],
      projects: [
        {
          name: 'OpenFin A/B Testing Evaluator',
          description: 'Bayesian and frequentist A/B testing calculator package written in Python with interactive Streamlit visualization.',
          technologies: ['Python', 'Streamlit', 'SciPy', 'Docker'],
          link: 'https://github.com/sarahchen-data/openfin-ab-test',
          impact: 'Used by 220+ monthly data practitioners; 380 GitHub stars'
        },
        {
          name: 'Real-time Credit Card Anomaly Detection',
          description: 'Production Kafka + Snowflake data streaming pipeline detecting anomalous transactions with 94.2% precision.',
          technologies: ['Python', 'SQL', 'Snowflake', 'Tableau'],
          link: 'https://github.com/sarahchen-data/credit-anomaly-stream',
          impact: 'Showcased at PyData SF 2023'
        }
      ],
      certifications: [
        {
          name: 'AWS Certified Data Analytics - Specialty',
          issuer: 'Amazon Web Services',
          date: '2023',
          credentialId: 'AWS-DA-882194'
        },
        {
          name: 'Tableau Desktop Certified Professional',
          issuer: 'Tableau Software',
          date: '2022'
        }
      ],
      achievements: [
        'Winner, UC Berkeley FinTech Datathon 2022',
        'Published case study on automated cohort retention modeling'
      ],
      allExtractedSkills: ['SQL', 'Python', 'Tableau', 'Statistical Modeling', 'Snowflake', 'A/B Testing', 'Pandas', 'NumPy', 'dbt', 'Git', 'AWS']
    },
    analysis: {
      candidateId: 'cand-sarah-chen',
      jobId: 'job-da-101',
      analyzedAt: '2026-09-02T14:20:00Z',
      scores: {
        overallScore: 89,
        jobFitScore: 92,
        verifiedSkillsScore: 88,
        experienceScore: 85,
        projectsScore: 92,
        educationScore: 85,
        certificationsScore: 95,
        resumeQualityScore: 90,
        evidenceStrengthScore: 87,
        atsScore: 94
      },
      scoreExplanation: 'Deterministic assessment: Job Fit (92/100 @ 30%) + Verified Skills (88/100 @ 25%) + Experience (85/100 @ 15%) + Projects (92/100 @ 10%) + Certifications (95/100 @ 5%) + Evidence Strength (87/100 @ 5%) = 89/100 overall score.',
      skillVerifications: [
        {
          skillName: 'SQL',
          claimedLevel: 'Advanced',
          estimatedLevel: 'Advanced',
          evidenceStrength: 94,
          verificationStatus: 'Verified',
          evidenceItems: [
            { id: 'ev-1', type: 'Work experience', title: 'Snowflake Query Optimization', source: 'LendVantage Inc.', description: 'Managed queries on 40M+ rows with sub-second performance', relevanceScore: 95 },
            { id: 'ev-2', type: 'Project', title: 'Real-time Credit Card Anomaly Pipeline', source: 'GitHub Repo', description: 'Wrote advanced analytical window functions and CTEs', relevanceScore: 92 },
            { id: 'ev-3', type: 'Certification', title: 'AWS Certified Data Analytics', source: 'AWS', description: 'Validated complex query engine and warehouse schemas', relevanceScore: 90 }
          ]
        },
        {
          skillName: 'Python',
          claimedLevel: 'Advanced',
          estimatedLevel: 'Advanced',
          evidenceStrength: 90,
          verificationStatus: 'Verified',
          evidenceItems: [
            { id: 'ev-4', type: 'GitHub', title: 'OpenFin A/B Testing Evaluator (380 stars)', source: 'github.com/sarahchen-data', description: 'Full package with SciPy, Pandas, automated test suites', relevanceScore: 95 },
            { id: 'ev-5', type: 'Internship', title: 'Merchant Churn XGBoost', source: 'Square Labs', description: 'Production model pipeline with scikit-learn & pandas', relevanceScore: 88 }
          ]
        },
        {
          skillName: 'Tableau',
          claimedLevel: 'Advanced',
          estimatedLevel: 'Advanced',
          evidenceStrength: 92,
          verificationStatus: 'Verified',
          evidenceItems: [
            { id: 'ev-6', type: 'Certification', title: 'Tableau Desktop Certified Professional', source: 'Tableau Software', description: 'Official pro certification credential', relevanceScore: 96 },
            { id: 'ev-7', type: 'Work experience', title: '18 Core Executive Dashboards', source: 'LendVantage Inc.', description: 'Used daily by C-level executives for loan origination funnel', relevanceScore: 90 }
          ]
        },
        {
          skillName: 'Statistical Modeling',
          claimedLevel: 'Advanced',
          estimatedLevel: 'Intermediate',
          evidenceStrength: 78,
          verificationStatus: 'Partially Verified',
          evidenceItems: [
            { id: 'ev-8', type: 'Work experience', title: 'Logistic Regression Fraud Model', source: 'LendVantage Inc.', description: 'Reduced underwriting evaluation time by 34%', relevanceScore: 82 },
            { id: 'ev-9', type: 'Course', title: 'Applied Math & Statistics Degree', source: 'UC Berkeley', description: 'Coursework in probability theory and regression analysis', relevanceScore: 75 }
          ],
          missingProofNote: 'Claimed Advanced but production ML models were supervised by senior lead. Strong intermediate evidence.'
        },
        {
          skillName: 'Snowflake',
          claimedLevel: 'Intermediate',
          estimatedLevel: 'Intermediate',
          evidenceStrength: 82,
          verificationStatus: 'Verified',
          evidenceItems: [
            { id: 'ev-10', type: 'Work experience', title: 'LendVantage Warehouse Management', source: 'LendVantage Inc.', description: '2.5 years managing daily warehouse clustering and queries', relevanceScore: 85 }
          ]
        },
        {
          skillName: 'A/B Testing',
          claimedLevel: 'Advanced',
          estimatedLevel: 'Intermediate',
          evidenceStrength: 85,
          verificationStatus: 'Verified',
          evidenceItems: [
            { id: 'ev-11', type: 'Project', title: 'OpenFin A/B Testing Evaluator', source: 'GitHub Repo', description: 'Implemented sample size calculations, hypothesis tests, p-value adjustments', relevanceScore: 90 }
          ]
        }
      ],
      matchedSkills: ['SQL', 'Python', 'Tableau', 'Statistical Modeling', 'Snowflake', 'A/B Testing'],
      missingSkills: [],
      recommendedSkillsToLearn: [
        {
          skill: 'dbt (data build tool)',
          importance: 'High',
          estimatedTimeToLearn: '2 weeks',
          suggestedProofProject: 'Build a modular dbt transformation repo testing finance data models with automated schema tests.'
        },
        {
          skill: 'Apache Airflow',
          importance: 'Medium',
          estimatedTimeToLearn: '3 weeks',
          suggestedProofProject: 'Author a DAG orchestrating daily pipeline ingestion into Snowflake.'
        }
      ],
      alternativeJobRoles: [
        {
          roleTitle: 'Product Growth Analyst',
          matchScore: 94,
          rationale: 'Deep background in funnel analysis, A/B testing packages, and business stakeholder dashboards.',
          keyStrengths: ['A/B Testing', 'Cohort Analysis', 'Tableau']
        },
        {
          roleTitle: 'Analytics Engineer',
          matchScore: 88,
          rationale: 'Strong SQL query tuning and Snowflake data modeling experience with Python automation.',
          keyStrengths: ['Snowflake', 'SQL', 'Data Quality Testing']
        }
      ],
      resumeImprovements: [
        {
          category: 'Impact Metrics',
          title: 'Quantify FinMetrics Business Impact',
          feedback: 'Junior BI analyst bullets focus on tasks rather than financial or performance outcome numbers.',
          example: 'Transformed 14 manual workflows into automated dbt models, reducing pipeline refresh lag from 4 hours to 12 minutes.'
        },
        {
          category: 'Proof',
          title: 'Link Published Datathon Solution',
          feedback: 'You mention winning UC Berkeley FinTech Datathon 2022; include a GitHub or Devpost URL for verification.',
          example: 'Add direct URL: devpost.com/software/ucb-fintech-2022'
        }
      ],
      missingSections: ['Public Speaking / Publications Section'],
      unsupportedClaims: [
        {
          claim: 'Expert in end-to-end Machine Learning deployment',
          issueType: 'Inflated Level',
          explanation: 'Evidence indicates scikit-learn and XGBoost model prototyping, but containerized CI/CD MLOps deployment is unevidenced.',
          howToFix: 'Adjust wording to "Experienced in developing and validating predictive statistical models in Python".'
        }
      ],
      aiContentReview: {
        possibleAIContentIndicator: false,
        aiContentLabel: 'Unlikely AI-generated',
        aiConfidenceNote: 'Resume contains highly specific project metrics, custom GitHub repo commits, and natural varied phrasing.',
        possibleSimilarityIndicator: false,
        similarityLabel: 'Original structure detected',
        similarityNote: 'Project details and bullet points reflect authentic proprietary work experience.',
        manualReviewFlags: []
      }
    },
    hrNotes: [
      {
        id: 'hrn-1',
        author: 'Jessica Miller',
        text: 'Top candidate. Strong code samples in GitHub and verified Snowflake experience. Fast-track to hiring manager screen.',
        createdAt: '2026-09-02T16:00:00Z'
      }
    ]
  },
  {
    id: 'cand-priya-sharma',
    jobId: 'job-da-101',
    appliedDate: '2026-09-03',
    hiringStatus: 'Shortlisted',
    shortlisted: true,
    candidateProfile: {
      id: 'cand-priya-sharma',
      name: 'Priya Sharma',
      email: 'priya.sharma@datacraft.io',
      phone: '+1 (650) 412-9092',
      location: 'San Jose, CA',
      title: 'Lead BI & Analytics Specialist',
      summary: '5+ years specializing in executive dashboard design, customer retention analytics, and predictive modeling. Managed BI roadmaps for retail and fintech clients.',
      githubUrl: 'https://github.com/priyasharma-bi',
      portfolioUrl: 'https://priyasharma.viz',
      education: [
        {
          degree: 'Master of Science',
          field: 'Business Analytics & Data Science',
          institution: 'Carnegie Mellon University',
          year: '2021',
          gpa: '3.91'
        },
        {
          degree: 'Bachelor of Technology',
          field: 'Computer Science',
          institution: 'NIT Trichy',
          year: '2019'
        }
      ],
      experience: [
        {
          role: 'Senior Analytics Consultant',
          company: 'Deloitte Analytics',
          duration: '2021 - Present (3 yrs)',
          years: 3.0,
          description: [
            'Led analytics workstream for Tier-1 investment bank, delivering 12 executive dashboards.',
            'Formulated statistical cohort models reducing customer churn by 4.2% within 6 months.'
          ],
          highlights: [
            'Recognized with Deloitte National Analytics Excellence Award 2023.'
          ]
        }
      ],
      internships: [
        {
          role: 'Business Analytics Intern',
          company: 'Intuit',
          duration: 'Summer 2020',
          projects: ['QuickBooks user onboarding funnel drop-off analysis']
        }
      ],
      projects: [
        {
          name: 'Tableau Public Featured Visualizations',
          description: 'Curated gallery of 14 public financial dashboards viewed over 45,000 times.',
          technologies: ['Tableau', 'SQL', 'Python', 'Figma'],
          link: 'https://public.tableau.com/app/profile/priyasharma',
          impact: 'Tableau Featured Author 2023'
        },
        {
          name: 'FinBench: Bank Default Risk Predictor',
          description: 'Comprehensive risk scoring engine utilizing logistic regression, Random Forests, and Shapley feature attribution.',
          technologies: ['Python', 'Pandas', 'Scikit-learn', 'SHAP'],
          link: 'https://github.com/priyasharma-bi/finbench-risk',
          impact: 'Ranked in top 5% of Kaggle Financial Risk competition'
        }
      ],
      certifications: [
        {
          name: 'Tableau Certified Data Analyst',
          issuer: 'Tableau',
          date: '2022'
        },
        {
          name: 'Snowflake SnowPro Core Certified',
          issuer: 'Snowflake',
          date: '2023',
          credentialId: 'SNOW-66219'
        }
      ],
      achievements: [
        'Tableau Public Featured Author',
        'Carnegie Mellon Academic Merit Fellow'
      ],
      allExtractedSkills: ['Tableau', 'SQL', 'Python', 'Statistical Modeling', 'Snowflake', 'A/B Testing', 'Power BI', 'SHAP', 'Excel', 'R']
    },
    analysis: {
      candidateId: 'cand-priya-sharma',
      jobId: 'job-da-101',
      analyzedAt: '2026-09-03T11:00:00Z',
      scores: {
        overallScore: 92,
        jobFitScore: 95,
        verifiedSkillsScore: 91,
        experienceScore: 89,
        projectsScore: 90,
        educationScore: 95,
        certificationsScore: 95,
        resumeQualityScore: 95,
        evidenceStrengthScore: 90,
        atsScore: 96
      },
      scoreExplanation: 'Deterministic assessment: Job Fit (95/100 @ 30%) + Verified Skills (91/100 @ 25%) + Experience (89/100 @ 15%) + Education (95/100 @ 5%) + Certifications (95/100 @ 5%) = 92/100 overall score.',
      skillVerifications: [
        {
          skillName: 'SQL',
          claimedLevel: 'Advanced',
          estimatedLevel: 'Advanced',
          evidenceStrength: 91,
          verificationStatus: 'Verified',
          evidenceItems: [
            { id: 'pse-1', type: 'Work experience', title: 'Tier-1 Banking Analytics Data Models', source: 'Deloitte Analytics', description: 'Optimized heavy analytical queries on Snowflake', relevanceScore: 93 },
            { id: 'pse-2', type: 'Certification', title: 'Snowflake SnowPro Core', source: 'Snowflake', description: 'Official database administration and querying certification', relevanceScore: 92 }
          ]
        },
        {
          skillName: 'Tableau',
          claimedLevel: 'Expert',
          estimatedLevel: 'Expert',
          evidenceStrength: 98,
          verificationStatus: 'Verified',
          evidenceItems: [
            { id: 'pse-3', type: 'Portfolio', title: 'Tableau Featured Author Gallery (45k views)', source: 'Tableau Public', description: '14 published dashboards with bespoke design and calculations', relevanceScore: 99 },
            { id: 'pse-4', type: 'Certification', title: 'Tableau Certified Data Analyst', source: 'Tableau', description: 'Verified credential', relevanceScore: 96 }
          ]
        },
        {
          skillName: 'Statistical Modeling',
          claimedLevel: 'Advanced',
          estimatedLevel: 'Advanced',
          evidenceStrength: 92,
          verificationStatus: 'Verified',
          evidenceItems: [
            { id: 'pse-5', type: 'Project', title: 'FinBench Risk Predictor + SHAP', source: 'GitHub / Kaggle', description: 'Top 5% finish in Kaggle Financial Default competition with interpretable SHAP models', relevanceScore: 94 },
            { id: 'pse-6', type: 'Course', title: 'Carnegie Mellon MS Data Science', source: 'CMU', description: 'Formal graduate training in statistical inference', relevanceScore: 90 }
          ]
        },
        {
          skillName: 'Python',
          claimedLevel: 'Advanced',
          estimatedLevel: 'Advanced',
          evidenceStrength: 88,
          verificationStatus: 'Verified',
          evidenceItems: [
            { id: 'pse-7', type: 'Project', title: 'FinBench Risk Engine Repo', source: 'GitHub', description: 'Clean Pythonic repository with unit tests and modular data transformations', relevanceScore: 89 }
          ]
        },
        {
          skillName: 'Snowflake',
          claimedLevel: 'Intermediate',
          estimatedLevel: 'Advanced',
          evidenceStrength: 93,
          verificationStatus: 'Verified',
          evidenceItems: [
            { id: 'pse-8', type: 'Certification', title: 'Snowflake SnowPro Core Certified', source: 'Snowflake', description: 'Demonstrated deep proficiency in warehouse architecture', relevanceScore: 95 }
          ]
        },
        {
          skillName: 'A/B Testing',
          claimedLevel: 'Intermediate',
          estimatedLevel: 'Intermediate',
          evidenceStrength: 84,
          verificationStatus: 'Verified',
          evidenceItems: [
            { id: 'pse-9', type: 'Internship', title: 'QuickBooks Onboarding Funnel', source: 'Intuit', description: 'Evaluated multivariate A/B test variations with statistical significance testing', relevanceScore: 85 }
          ]
        }
      ],
      matchedSkills: ['Tableau', 'SQL', 'Statistical Modeling', 'Python', 'Snowflake', 'A/B Testing'],
      missingSkills: [],
      recommendedSkillsToLearn: [
        {
          skill: 'PySpark / Big Data Engines',
          importance: 'Medium',
          estimatedTimeToLearn: '3 weeks',
          suggestedProofProject: 'Process 100GB+ clickstream dataset using PySpark on Databricks Community Edition.'
        }
      ],
      alternativeJobRoles: [
        {
          roleTitle: 'Lead BI Architect',
          matchScore: 96,
          rationale: 'Exceptional visual storytelling and certified enterprise dashboard architecture.',
          keyStrengths: ['Tableau', 'Snowflake', 'Stakeholder Management']
        },
        {
          roleTitle: 'Quantitative Risk Analyst',
          matchScore: 90,
          rationale: 'Strong graduate statistics background and Kaggle default risk competition record.',
          keyStrengths: ['Statistical Modeling', 'Python', 'Risk Analysis']
        }
      ],
      resumeImprovements: [
        {
          category: 'Content',
          title: 'Highlight specific cloud infrastructure',
          feedback: 'Mention cloud providers (AWS/GCP/Azure) used in tandem with Snowflake.',
          example: 'Snowflake on AWS with S3 external stages.'
        }
      ],
      missingSections: [],
      unsupportedClaims: [],
      aiContentReview: {
        possibleAIContentIndicator: false,
        aiContentLabel: 'Unlikely AI-generated',
        aiConfidenceNote: 'Contains verified Tableau Public portfolio URLs and specific academic thesis citations.',
        possibleSimilarityIndicator: false,
        similarityLabel: 'Original structure detected',
        similarityNote: 'Authentic project descriptions and client engagements.',
        manualReviewFlags: []
      }
    },
    hrNotes: [
      {
        id: 'hrn-2',
        author: 'Jessica Miller',
        text: 'Exceptional visual evidence and Master degree from CMU. Scheduled for final round.',
        createdAt: '2026-09-03T15:30:00Z'
      }
    ]
  },
  {
    id: 'cand-marcus-vance',
    jobId: 'job-da-101',
    appliedDate: '2026-09-05',
    hiringStatus: 'Under Review',
    shortlisted: false,
    candidateProfile: {
      id: 'cand-marcus-vance',
      name: 'Marcus Vance',
      email: 'marcus.vance@inboxmail.com',
      phone: '+1 (312) 555-0199',
      location: 'Chicago, IL',
      title: 'Data Analyst & ML Practitioner',
      summary: 'Passionate and results-driven data enthusiast experienced in advanced Python scripting, SQL database extraction, deep neural networks, and modern enterprise business analytics.',
      githubUrl: 'https://github.com/marcusv-code',
      portfolioUrl: '',
      education: [
        {
          degree: 'Bachelor of Arts',
          field: 'Economics',
          institution: 'University of Illinois',
          year: '2023',
          gpa: '3.40'
        }
      ],
      experience: [
        {
          role: 'Junior Operations Analyst',
          company: 'Midwest Logistics Partners',
          duration: '2023 - Present (1.2 yrs)',
          years: 1.2,
          description: [
            'Maintained daily inventory spreadsheets in Excel and executed basic SQL queries.',
            'Prepared weekly shipment volume summaries for operational supervisors.'
          ],
          highlights: [
            'Reduced spreadsheet report preparation time by 15% using Excel VLOOKUP and pivot tables.'
          ]
        }
      ],
      internships: [],
      projects: [
        {
          name: 'Predictive Stock Price Forecaster',
          description: 'Implemented LSTM Recurrent Neural Network in Python to forecast S&P 500 stock swings with high precision.',
          technologies: ['Python', 'TensorFlow', 'Keras'],
          link: 'https://github.com/marcusv-code/stock-lstm',
          impact: 'Completed as personal exploration project'
        }
      ],
      certifications: [
        {
          name: 'Google Data Analytics Certificate',
          issuer: 'Coursera / Google',
          date: '2023'
        }
      ],
      achievements: [],
      allExtractedSkills: ['Python', 'SQL', 'Excel', 'TensorFlow', 'Tableau', 'Machine Learning']
    },
    analysis: {
      candidateId: 'cand-marcus-vance',
      jobId: 'job-da-101',
      analyzedAt: '2026-09-05T09:40:00Z',
      scores: {
        overallScore: 68,
        jobFitScore: 64,
        verifiedSkillsScore: 62,
        experienceScore: 58,
        projectsScore: 60,
        educationScore: 75,
        certificationsScore: 70,
        resumeQualityScore: 72,
        evidenceStrengthScore: 56,
        atsScore: 78
      },
      scoreExplanation: 'Deterministic assessment: Job Fit (64/100 @ 30%) + Verified Skills (62/100 @ 25%) + Experience (58/100 @ 15%) + Evidence Strength (56/100 @ 5%) = 68/100 overall score. Claimed Advanced skills lack verifiable production artifacts.',
      skillVerifications: [
        {
          skillName: 'Python',
          claimedLevel: 'Advanced',
          estimatedLevel: 'Intermediate',
          evidenceStrength: 58,
          verificationStatus: 'Partially Verified',
          evidenceItems: [
            { id: 'mve-1', type: 'Project', title: 'Stock LSTM Script', source: 'GitHub', description: 'Single notebook implementation using standard tutorial dataset', relevanceScore: 60 },
            { id: 'mve-2', type: 'Course', title: 'Google Data Analytics Certificate', source: 'Coursera', description: 'Introductory Python / R modules completed', relevanceScore: 55 }
          ],
          missingProofNote: 'Claimed Advanced: Lacks production unit tests, modular packaging, or multi-year commercial deployment. Re-rated to Intermediate.'
        },
        {
          skillName: 'SQL',
          claimedLevel: 'Advanced',
          estimatedLevel: 'Intermediate',
          evidenceStrength: 60,
          verificationStatus: 'Partially Verified',
          evidenceItems: [
            { id: 'mve-3', type: 'Work experience', title: 'Junior Operations Analyst Queries', source: 'Midwest Logistics', description: 'Basic SELECT, JOIN, and GROUP BY statements for inventory summaries', relevanceScore: 62 }
          ],
          missingProofNote: 'Insufficient evidence for window functions, query plan profiling, or partition optimization. Manual assessment recommended.'
        },
        {
          skillName: 'Tableau',
          claimedLevel: 'Intermediate',
          estimatedLevel: 'Insufficient Evidence',
          evidenceStrength: 35,
          verificationStatus: 'Insufficient Evidence',
          evidenceItems: [
            { id: 'mve-4', type: 'Course', title: 'Coursera Visualization Module', source: 'Coursera', description: 'Completed classroom dashboard exercise', relevanceScore: 35 }
          ],
          missingProofNote: 'Insufficient evidence — manual verification recommended. No public dashboards or portfolio provided.'
        },
        {
          skillName: 'Statistical Modeling',
          claimedLevel: 'Intermediate',
          estimatedLevel: 'Beginner',
          evidenceStrength: 45,
          verificationStatus: 'Partially Verified',
          evidenceItems: [
            { id: 'mve-5', type: 'Course', title: 'Undergraduate Econometrics', source: 'Univ of Illinois', description: 'Academic introductory statistics coursework', relevanceScore: 50 }
          ]
        },
        {
          skillName: 'Snowflake',
          claimedLevel: 'Beginner',
          estimatedLevel: 'Insufficient Evidence',
          evidenceStrength: 20,
          verificationStatus: 'Insufficient Evidence',
          evidenceItems: [],
          missingProofNote: 'Insufficient evidence — manual verification recommended. Skill listed in keywords without any practical reference.'
        },
        {
          skillName: 'A/B Testing',
          claimedLevel: 'Beginner',
          estimatedLevel: 'Insufficient Evidence',
          evidenceStrength: 25,
          verificationStatus: 'Insufficient Evidence',
          evidenceItems: [],
          missingProofNote: 'Insufficient evidence — manual verification recommended.'
        }
      ],
      matchedSkills: ['Python', 'SQL'],
      missingSkills: ['Snowflake', 'A/B Testing', 'Production Tableau'],
      recommendedSkillsToLearn: [
        {
          skill: 'Advanced SQL Query Tuning',
          importance: 'Critical',
          estimatedTimeToLearn: '3 weeks',
          suggestedProofProject: 'Solve LeetCode Database Hard queries and post solution walk-throughs on GitHub.'
        },
        {
          skill: 'Public Tableau Portfolio',
          importance: 'High',
          estimatedTimeToLearn: '2 weeks',
          suggestedProofProject: 'Build 2 interactive dashboards using public Open Data and publish to Tableau Public.'
        }
      ],
      alternativeJobRoles: [
        {
          roleTitle: 'Junior Operations Analyst',
          matchScore: 82,
          rationale: 'Current experience matches operational Excel reporting and baseline database extraction.',
          keyStrengths: ['Excel', 'Basic SQL', 'Inventory Reporting']
        },
        {
          roleTitle: 'Business Systems Coordinator',
          matchScore: 74,
          rationale: 'Good communication and entry-level technical aptitude.',
          keyStrengths: ['Spreadsheets', 'Documentation']
        }
      ],
      resumeImprovements: [
        {
          category: 'Proof',
          title: 'Evidence Claimed Advanced Python',
          feedback: 'Tutorial projects like stock price forecasting are common in bootcamps; build an original data engineering project.',
          example: 'Deploy an automated web scraper feeding a SQLite database with daily data quality unit tests.'
        },
        {
          category: 'Content',
          title: 'Replace generic adjectives with measured metrics',
          feedback: 'Phrases like "Passionate and results-driven data enthusiast" dilute technical credibility.',
          example: 'Replace summary with: "Data Analyst with 1.2 years experience automating logistics reports and writing relational SQL queries."'
        }
      ],
      missingSections: ['Internships', 'Quantified Achievements'],
      unsupportedClaims: [
        {
          claim: 'Advanced Deep Neural Network practitioner',
          issueType: 'Inflated Level',
          explanation: 'Only a single tutorial LSTM script is present on GitHub with default parameters; no training validation logs or ablation study.',
          howToFix: 'Reframe as: "Familiarity with neural network architectures (LSTM, CNN) through experimental course projects."'
        }
      ],
      aiContentReview: {
        possibleAIContentIndicator: true,
        aiContentLabel: 'Possible AI-generated content',
        aiConfidenceNote: 'Summary section contains formulaic AI phrasing ("passionate and results-driven enthusiast experienced in modern enterprise business analytics"). Needs manual review.',
        possibleSimilarityIndicator: true,
        similarityLabel: 'Possible similarity',
        similarityNote: 'Stock prediction project closely follows standard Kaggle notebook templates. Needs manual review.',
        manualReviewFlags: [
          'Summary statement exhibits high perplexity uniformity typical of conversational AI templates.',
          'Stock price forecast project repo matches common tutorial boilerplate.'
        ]
      }
    },
    hrNotes: [
      {
        id: 'hrn-3',
        author: 'Jessica Miller',
        text: 'Claimed Advanced Python & ML, but evidence only shows basic tutorial coursework. Recommended for entry-level role instead.',
        createdAt: '2026-09-05T12:15:00Z'
      }
    ]
  },
  {
    id: 'cand-alex-rivera',
    jobId: 'job-da-101',
    appliedDate: '2026-09-06',
    hiringStatus: 'Under Review',
    shortlisted: false,
    candidateProfile: {
      id: 'cand-alex-rivera',
      name: 'Alex Rivera',
      email: 'alex.rivera.analytics@proton.me',
      phone: '+1 (206) 881-3041',
      location: 'Seattle, WA',
      title: 'Senior Big Data & Analytics Specialist',
      summary: 'Accomplished data strategist adept at leveraging Apache Spark, Google BigQuery, Snowflake, and advanced machine learning models to maximize profitability across cross-functional enterprise matrixes.',
      githubUrl: 'https://github.com/alexrivera-eng',
      portfolioUrl: '',
      education: [
        {
          degree: 'Bachelor of Science',
          field: 'Information Systems',
          institution: 'University of Washington',
          year: '2022'
        }
      ],
      experience: [
        {
          role: 'Data Reporting Specialist',
          company: 'Northwest Media Group',
          duration: '2022 - Present (2 yrs)',
          years: 2.0,
          description: [
            'Created weekly audience traffic reports in Google Looker Studio.',
            'Collaborated with editorial team to extract advertising click counts from BigQuery tables.'
          ],
          highlights: [
            'Organized digital marketing campaign performance metrics for 35 client accounts.'
          ]
        }
      ],
      internships: [],
      projects: [],
      certifications: [],
      achievements: [
        'Employee of the Month (June 2023)'
      ],
      allExtractedSkills: ['BigQuery', 'SQL', 'Looker Studio', 'Python', 'Spark', 'Snowflake']
    },
    analysis: {
      candidateId: 'cand-alex-rivera',
      jobId: 'job-da-101',
      analyzedAt: '2026-09-06T13:10:00Z',
      scores: {
        overallScore: 64,
        jobFitScore: 61,
        verifiedSkillsScore: 58,
        experienceScore: 70,
        projectsScore: 40,
        educationScore: 85,
        certificationsScore: 30,
        resumeQualityScore: 68,
        evidenceStrengthScore: 48,
        atsScore: 82
      },
      scoreExplanation: 'Deterministic assessment: Job Fit (61/100 @ 30%) + Verified Skills (58/100 @ 25%) + Experience (70/100 @ 15%) + Projects (40/100 @ 10%) + Evidence Strength (48/100 @ 5%) = 64/100 overall score. High ATS keyword formatting, but weak evidence for Spark/Snowflake claims.',
      skillVerifications: [
        {
          skillName: 'SQL',
          claimedLevel: 'Advanced',
          estimatedLevel: 'Intermediate',
          evidenceStrength: 70,
          verificationStatus: 'Partially Verified',
          evidenceItems: [
            { id: 'are-1', type: 'Work experience', title: 'BigQuery Advertising Click Extraction', source: 'Northwest Media Group', description: 'Extracted click counts and campaign aggregates', relevanceScore: 72 }
          ]
        },
        {
          skillName: 'Python',
          claimedLevel: 'Advanced',
          estimatedLevel: 'Insufficient Evidence',
          evidenceStrength: 35,
          verificationStatus: 'Insufficient Evidence',
          evidenceItems: [],
          missingProofNote: 'Insufficient evidence — manual verification recommended. No code repositories, projects, or work deliverables cited.'
        },
        {
          skillName: 'Tableau',
          claimedLevel: 'Intermediate',
          estimatedLevel: 'Intermediate',
          evidenceStrength: 65,
          verificationStatus: 'Partially Verified',
          evidenceItems: [
            { id: 'are-2', type: 'Work experience', title: 'Looker Studio & BI Reporting', source: 'Northwest Media Group', description: 'Designed audience traffic dashboards for 35 client accounts', relevanceScore: 68 }
          ]
        },
        {
          skillName: 'Snowflake',
          claimedLevel: 'Advanced',
          estimatedLevel: 'Insufficient Evidence',
          evidenceStrength: 25,
          verificationStatus: 'Insufficient Evidence',
          evidenceItems: [],
          missingProofNote: 'Insufficient evidence — manual verification recommended. Listed in header summary but absent from work experience.'
        },
        {
          skillName: 'Statistical Modeling',
          claimedLevel: 'Intermediate',
          estimatedLevel: 'Insufficient Evidence',
          evidenceStrength: 20,
          verificationStatus: 'Insufficient Evidence',
          evidenceItems: [],
          missingProofNote: 'Insufficient evidence — manual verification recommended.'
        },
        {
          skillName: 'A/B Testing',
          claimedLevel: 'Intermediate',
          estimatedLevel: 'Insufficient Evidence',
          evidenceStrength: 30,
          verificationStatus: 'Insufficient Evidence',
          evidenceItems: [],
          missingProofNote: 'Insufficient evidence — manual verification recommended.'
        }
      ],
      matchedSkills: ['SQL', 'Looker Studio'],
      missingSkills: ['Verified Python', 'Snowflake', 'Statistical Modeling', 'A/B Testing'],
      recommendedSkillsToLearn: [
        {
          skill: 'Python for Data Analysis (Pandas/NumPy)',
          importance: 'Critical',
          estimatedTimeToLearn: '4 weeks',
          suggestedProofProject: 'Create a data extraction and automated cleaning script connecting to an external API.'
        },
        {
          skill: 'A/B Testing Experimentation',
          importance: 'High',
          estimatedTimeToLearn: '2 weeks',
          suggestedProofProject: 'Author an experimentation framework evaluating conversion lift for e-commerce checkouts.'
        }
      ],
      alternativeJobRoles: [
        {
          roleTitle: 'Digital Marketing Data Specialist',
          matchScore: 86,
          rationale: 'Strong alignment with Looker Studio advertising reporting and digital agency analytics.',
          keyStrengths: ['Looker Studio', 'Ad Performance', 'Client Reporting']
        },
        {
          roleTitle: 'Business Intelligence Reporting Associate',
          matchScore: 78,
          rationale: 'Good foundation in operational metrics and client dashboard delivery.',
          keyStrengths: ['SQL', 'Spreadsheets', 'Reporting']
        }
      ],
      resumeImprovements: [
        {
          category: 'Proof',
          title: 'Provide Evidence for Spark & Snowflake',
          feedback: 'Skills highlighted in your executive summary do not appear in any project or work bullets.',
          example: 'Detail which Spark jobs you developed, cluster configurations used, or remove the keyword until project evidence is ready.'
        },
        {
          category: 'Formatting',
          title: 'Add a Projects Section',
          feedback: 'Your resume lacks a Dedicated Projects section to showcase hands-on technical architecture.',
          example: 'Add 2 technical projects with GitHub repo links demonstrating SQL & Python.'
        }
      ],
      missingSections: ['Projects Section', 'Certifications Section', 'GitHub Repository Links'],
      unsupportedClaims: [
        {
          claim: 'Adept at leveraging Apache Spark and Snowflake',
          issueType: 'Missing Proof',
          explanation: 'No work description, repository, or credential references Spark or Snowflake usage.',
          howToFix: 'Add a specific project with code samples or rephrase summary to emphasize BigQuery and Looker Studio.'
        }
      ],
      aiContentReview: {
        possibleAIContentIndicator: true,
        aiContentLabel: 'Possible AI-generated content',
        aiConfidenceNote: 'Heavy use of corporate buzzwords ("enterprise matrixes", "cross-functional maximize profitability"). Needs manual review.',
        possibleSimilarityIndicator: false,
        similarityLabel: 'Original structure detected',
        similarityNote: 'Standard chronological resume format.',
        manualReviewFlags: [
          'High density of vague managerial verbs with zero quantitative technical metrics.',
          'Summary lists buzzwords not supported in body text.'
        ]
      }
    },
    hrNotes: [
      {
        id: 'hrn-4',
        author: 'Jessica Miller',
        text: 'High resume ATS formatting, but weak evidence for Spark/BigQuery claims. Insufficient evidence — manual verification recommended.',
        createdAt: '2026-09-06T15:00:00Z'
      }
    ]
  },
  {
    id: 'cand-elena-rostova',
    jobId: 'job-da-101',
    appliedDate: '2026-09-07',
    hiringStatus: 'Interview Scheduled',
    shortlisted: true,
    interviewDate: '2026-09-15T10:00:00Z',
    candidateProfile: {
      id: 'cand-elena-rostova',
      name: 'Elena Rostova',
      email: 'elena.rostova.data@outlook.com',
      phone: '+1 (512) 671-8840',
      location: 'Austin, TX',
      title: 'Analytics Engineer / BI Specialist',
      summary: 'Analytics Engineer with 3 years building reliable data models, automated dbt tests, and operational Power BI dashboards for SaaS companies.',
      githubUrl: 'https://github.com/elena-rostova',
      portfolioUrl: 'https://elenarostova.dev',
      education: [
        {
          degree: 'Bachelor of Science',
          field: 'Computer Engineering',
          institution: 'UT Austin',
          year: '2022'
        }
      ],
      experience: [
        {
          role: 'Analytics Engineer',
          company: 'CloudScale SaaS',
          duration: '2022 - Present (2.3 yrs)',
          years: 2.3,
          description: [
            'Built and maintained 45 dbt data models on Snowflake transforming raw stripe events into ARR metric tables.',
            'Created executive Power BI dashboards with row-level security.'
          ],
          highlights: [
            'Reduced broken data report tickets by 72% via automated dbt schema tests.'
          ]
        }
      ],
      internships: [
        {
          role: 'Data Engineering Intern',
          company: 'Atlassian',
          duration: 'Summer 2021',
          projects: ['Internal telemetry analytics dashboard']
        }
      ],
      projects: [
        {
          name: 'SaaS Metric Engine in dbt',
          description: 'Open-source dbt package for calculating MRR expansion, churn, and LTV cohorts from payment webhooks.',
          technologies: ['dbt', 'SQL', 'Snowflake', 'Python'],
          link: 'https://github.com/elena-rostova/dbt-saas-metrics',
          impact: 'Adopted by 8 early-stage startups'
        }
      ],
      certifications: [
        {
          name: 'dbt Certified Developer',
          issuer: 'dbt Labs',
          date: '2023',
          credentialId: 'DBT-CERT-4190'
        },
        {
          name: 'Microsoft Certified: Power BI Data Analyst Associate',
          issuer: 'Microsoft',
          date: '2023'
        }
      ],
      achievements: [
        'Speaker at Austin dbt Meetup 2023'
      ],
      allExtractedSkills: ['SQL', 'dbt', 'Snowflake', 'Power BI', 'Python', 'A/B Testing', 'Git']
    },
    analysis: {
      candidateId: 'cand-elena-rostova',
      jobId: 'job-da-101',
      analyzedAt: '2026-09-07T16:00:00Z',
      scores: {
        overallScore: 82,
        jobFitScore: 84,
        verifiedSkillsScore: 83,
        experienceScore: 78,
        projectsScore: 85,
        educationScore: 85,
        certificationsScore: 90,
        resumeQualityScore: 88,
        evidenceStrengthScore: 84,
        atsScore: 91
      },
      scoreExplanation: 'Deterministic assessment: Job Fit (84/100 @ 30%) + Verified Skills (83/100 @ 25%) + Experience (78/100 @ 15%) + Projects (85/100 @ 10%) + Certifications (90/100 @ 5%) = 82/100 overall score. Strong practical dbt & Snowflake pipeline artifacts.',
      skillVerifications: [
        {
          skillName: 'SQL',
          claimedLevel: 'Advanced',
          estimatedLevel: 'Advanced',
          evidenceStrength: 92,
          verificationStatus: 'Verified',
          evidenceItems: [
            { id: 'ere-1', type: 'Work experience', title: '45 Production dbt Models', source: 'CloudScale SaaS', description: 'Transformed raw event logs into ARR metric tables on Snowflake', relevanceScore: 94 },
            { id: 'ere-2', type: 'Certification', title: 'dbt Certified Developer', source: 'dbt Labs', description: 'Official credential validating advanced modular SQL modeling', relevanceScore: 95 }
          ]
        },
        {
          skillName: 'Snowflake',
          claimedLevel: 'Advanced',
          estimatedLevel: 'Advanced',
          evidenceStrength: 88,
          verificationStatus: 'Verified',
          evidenceItems: [
            { id: 'ere-3', type: 'Work experience', title: 'Snowflake Pipeline Architecture', source: 'CloudScale SaaS', description: '2.3 years handling warehouse scaling, streams, and role RBAC', relevanceScore: 90 }
          ]
        },
        {
          skillName: 'Python',
          claimedLevel: 'Intermediate',
          estimatedLevel: 'Intermediate',
          evidenceStrength: 80,
          verificationStatus: 'Verified',
          evidenceItems: [
            { id: 'ere-4', type: 'Project', title: 'SaaS Metric Engine Repo', source: 'GitHub', description: 'Python scripts for automated test data generation and fixtures', relevanceScore: 82 }
          ]
        },
        {
          skillName: 'Tableau',
          claimedLevel: 'Intermediate',
          estimatedLevel: 'Intermediate',
          evidenceStrength: 85,
          verificationStatus: 'Verified',
          evidenceItems: [
            { id: 'ere-5', type: 'Certification', title: 'Microsoft Power BI Associate', source: 'Microsoft', description: 'Transferable enterprise BI certification; demonstrated row-level security', relevanceScore: 86 }
          ],
          missingProofNote: 'Primary evidence is Power BI rather than Tableau, but BI visualization principles are strongly evidenced.'
        },
        {
          skillName: 'Statistical Modeling',
          claimedLevel: 'Intermediate',
          estimatedLevel: 'Intermediate',
          evidenceStrength: 72,
          verificationStatus: 'Partially Verified',
          evidenceItems: [
            { id: 'ere-6', type: 'Course', title: 'UT Austin Computer Engineering', source: 'UT Austin', description: 'Probability, statistics, and discrete mathematics coursework', relevanceScore: 75 }
          ]
        },
        {
          skillName: 'A/B Testing',
          claimedLevel: 'Intermediate',
          estimatedLevel: 'Intermediate',
          evidenceStrength: 76,
          verificationStatus: 'Verified',
          evidenceItems: [
            { id: 'ere-7', type: 'Work experience', title: 'CloudScale SaaS Feature Rollouts', source: 'CloudScale SaaS', description: 'Evaluated conversion impact across feature toggle experiments', relevanceScore: 78 }
          ]
        }
      ],
      matchedSkills: ['SQL', 'Snowflake', 'Python', 'Power BI (Tableau)', 'A/B Testing', 'Statistical Modeling'],
      missingSkills: [],
      recommendedSkillsToLearn: [
        {
          skill: 'Tableau Desktop Proficiency',
          importance: 'Medium',
          estimatedTimeToLearn: '1 week',
          suggestedProofProject: 'Recreate your top Power BI dashboard in Tableau to show multi-platform BI flexibility.'
        }
      ],
      alternativeJobRoles: [
        {
          roleTitle: 'Analytics Engineer',
          matchScore: 95,
          rationale: 'Near-perfect alignment with dbt, Snowflake, and automated data testing workflows.',
          keyStrengths: ['dbt', 'Snowflake', 'Data Modeling']
        },
        {
          roleTitle: 'Business Intelligence Developer',
          matchScore: 88,
          rationale: 'Deep background in semantic layer modeling and enterprise dashboard delivery.',
          keyStrengths: ['Power BI', 'SQL', 'Semantic Layers']
        }
      ],
      resumeImprovements: [
        {
          category: 'Content',
          title: 'Directly address Tableau in relation to Power BI',
          feedback: 'Highlight your ability to translate DAX and Power BI patterns into Tableau calculated fields.',
          example: 'Proficient in both Power BI and Tableau visualization workflows.'
        }
      ],
      missingSections: [],
      unsupportedClaims: [],
      aiContentReview: {
        possibleAIContentIndicator: false,
        aiContentLabel: 'Unlikely AI-generated',
        aiConfidenceNote: 'Authentic developer profile with verified open-source dbt package commits.',
        possibleSimilarityIndicator: false,
        similarityLabel: 'Original structure detected',
        similarityNote: 'Distinct engineering phrasing with real project links.',
        manualReviewFlags: []
      }
    },
    hrNotes: [
      {
        id: 'hrn-5',
        author: 'Jessica Miller',
        text: 'Solid candidate for analytics engineering overlap. Interview scheduled for Tuesday.',
        createdAt: '2026-09-08T09:15:00Z'
      }
    ]
  }
];

export const sampleCandidateResumeTexts: { title: string; text: string }[] = [
  {
    title: 'Senior Data Analyst (Sarah Chen)',
    text: `Sarah Chen
San Francisco, CA | (415) 892-4119 | sarah.chen@analytics-pro.dev | github.com/sarahchen-data | linkedin.com/in/sarahchen-data

PROFESSIONAL SUMMARY
Data Analyst with 4+ years of experience converting high-volume transactional data into revenue-generating business strategies. Extensive track record architecting Snowflake warehouses, designing executive Tableau dashboards, and conducting statistically rigorous A/B experiments.

WORK EXPERIENCE
LendVantage Inc., San Francisco, CA
Data Analyst II | 2022 - Present
- Architected and maintained 18 core Looker and Tableau dashboards tracking customer loan origination funnel used by C-suite.
- Authored high-performance SQL transformations against 40M+ transaction tables in Snowflake with sub-second response times.
- Decreased underwriting evaluation time by 34% by designing and deploying an automated logistic regression scoring model.
- Mentored 3 junior business analysts on SQL query optimization and reproducible analysis methods.

FinMetrics Corp, Oakland, CA
Junior Business Intelligence Analyst | 2021 - 2022
- Automated data quality validation tests in Python and scheduled with dbt.
- Collaborated with marketing stakeholders to analyze multi-touch attribution models.
- Automated weekly investor reporting decks saving 9 hours of manual entry per cycle.

INTERNSHIP
Square Labs | Data Science Intern | Summer 2021
- Developed a merchant churn prediction pipeline using XGBoost and scikit-learn.

PROJECTS
OpenFin A/B Testing Evaluator (github.com/sarahchen-data/openfin-ab-test)
- Built Bayesian and frequentist A/B testing calculator in Python with interactive Streamlit UI; over 380 GitHub stars.

Real-time Credit Card Anomaly Detection (github.com/sarahchen-data/credit-anomaly-stream)
- Streamed transaction data via Kafka to Snowflake, using Python for automated anomaly identification.

EDUCATION & CERTIFICATIONS
- B.S. in Applied Mathematics & Statistics, UC Berkeley (2022, GPA 3.82)
- AWS Certified Data Analytics - Specialty (2023, Credential ID: AWS-DA-882194)
- Tableau Desktop Certified Professional (2022)

SKILLS
SQL (Advanced), Python (Advanced), Tableau (Advanced), Snowflake (Intermediate), Statistical Modeling (Intermediate), A/B Testing (Advanced), dbt, Git, AWS.`
  },
  {
    title: 'Entry-Level Analyst with Unverified Claims (Marcus Vance)',
    text: `Marcus Vance
Chicago, IL | (312) 555-0199 | marcus.vance@inboxmail.com | github.com/marcusv-code

EXECUTIVE SUMMARY
Passionate, visionary, and results-driven data enthusiast experienced in advanced Python scripting, SQL database extraction, deep neural networks, and modern enterprise business analytics.

EXPERIENCE
Midwest Logistics Partners | Junior Operations Analyst | 2023 - Present
- Maintained daily inventory spreadsheets in Excel and executed basic SQL queries.
- Prepared weekly shipment volume summaries for operational supervisors.
- Reduced spreadsheet report preparation time by 15% using Excel VLOOKUP and pivot tables.

PROJECTS
Predictive Stock Price Forecaster (github.com/marcusv-code/stock-lstm)
- Implemented an advanced LSTM deep neural network in Python to predict stock prices with high accuracy.

EDUCATION & CERTIFICATIONS
- B.A. in Economics, University of Illinois (2023)
- Google Data Analytics Certificate, Coursera (2023)

SKILLS
Python (Advanced), Machine Learning (Advanced), SQL (Advanced), Tableau (Intermediate), Snowflake (Beginner), A/B Testing (Beginner), Excel (Advanced).`
  }
];

// Enrich all sample candidates with the deterministic Evidence-Based Skill Verification Engine
sampleCandidates.forEach((cand) => {
  cand.analysis.skillVerifications = verifyAllCandidateSkills(
    cand.candidateProfile,
    cand.analysis.skillVerifications
  );
});
