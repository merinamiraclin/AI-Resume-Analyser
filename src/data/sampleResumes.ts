export interface SampleResumeData {
  id: string;
  candidateName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  fileName: string;
  fileSize: string;
  experienceYears: number;
  degree: string;
  hasCertification: boolean;
  resumeText: string;
}

export const sampleBatchResumes: SampleResumeData[] = [
  {
    id: 'batch-1-jordan-lee',
    candidateName: 'Jordan Lee',
    title: 'Lead Business Intelligence & Data Analyst',
    email: 'jordan.lee.analytics@proton.me',
    phone: '+1 (415) 555-2981',
    location: 'San Francisco, CA',
    fileName: 'jordan_lee_data_analyst_resume.pdf',
    fileSize: '412 KB',
    experienceYears: 4.5,
    degree: 'Bachelor of Science in Data Analytics, UC Davis',
    hasCertification: true,
    resumeText: `Jordan Lee
San Francisco, CA | jordan.lee.analytics@proton.me | github.com/jordanlee-analytics | portfolio: jordanlee-bi.dev

PROFESSIONAL SUMMARY
Results-oriented Data Analyst with 4.5 years of experience delivering end-to-end data analytics solutions across fintech and retail sectors. Expert in advanced SQL optimization, complex Power BI dashboard architectures, automated Python data workflows, and predictive statistical modeling.

WORK EXPERIENCE
FinPeak Analytics — Senior Data Analyst | 2022 - Present (2.5 years)
- Architected enterprise Power BI workspace with 24 certified semantic models and DAX measures serving 350+ corporate stakeholders.
- Authored advanced SQL queries and window functions in PostgreSQL and Snowflake, reducing analytical latency by 45%.
- Implemented Python automation scripts (Pandas, NumPy) parsing transaction files and loading structured data warehouse tables.
- Conducted regular hypothesis testing and ANOVA statistical experiments to measure marketing campaign impact.

RetailMetrics Co. — Data Analyst | 2020 - 2022 (2 years)
- Developed automated Excel financial modeling templates using advanced index/match, dynamic arrays, and VBA macros.
- Extracted and transformed inventory datasets using SQL and built interactive Power BI operational dashboards.
- Mentored junior analysts on reproducible SQL best practices and data visualization hygiene.

PROJECTS & GITHUB
- Customer Lifetime Value Predictor (github.com/jordanlee-analytics/clv-powerbi-sql): End-to-end cohort CLV pipeline with SQL queries, Python data cleaning, and custom Power BI executive visual report.
- Automated ETL Pipeline for Transaction Streams: Python package transforming daily banking statements into normalized Snowflake schemas.

EDUCATION & CERTIFICATIONS
- B.S. in Data Analytics, UC Davis (2020, GPA 3.78)
- Microsoft Certified: Power BI Data Analyst Associate (PL-300)
- Advanced SQL for Data Scientists Certification (DataCamp)`
  },
  {
    id: 'batch-2-amanda-white',
    candidateName: 'Amanda White',
    title: 'Operations Data Analyst',
    email: 'amanda.white.ops@gmail.com',
    phone: '+1 (312) 555-8120',
    location: 'Chicago, IL',
    fileName: 'amanda_white_operations_analyst.pdf',
    fileSize: '320 KB',
    experienceYears: 2.5,
    degree: "Master of Science in Information Systems, Northwestern University",
    hasCertification: true,
    resumeText: `Amanda White
Chicago, IL | amanda.white.ops@gmail.com | linkedin.com/in/amandawhite-ops

SUMMARY
Detail-driven Operations Data Analyst with strong foundations in Excel financial modeling, intermediate statistics, and database querying. Skilled in translating messy operational logs into clean executive decision matrices and automated monthly KPI scorecards.

WORK EXPERIENCE
Apex Supply Chain Solutions — Operations Analyst | 2023 - Present (1.5 years)
- Built comprehensive Excel financial forecast models with dynamic scenario managers and XLOOKUP models for warehouse budgeting.
- Formulated basic SQL queries to retrieve shipment logs from Microsoft SQL Server.
- Performed descriptive statistics, standard deviation outlier analyses, and quarterly regression tests in Excel and Python.

LogiTech Logistics — Junior Analyst | 2022 - 2023 (1 year)
- Managed weekly supply chain variance spreadsheets in Excel with pivot tables and automated conditional formatting.
- Created preliminary Power BI reports visualizing on-time fleet arrival frequencies.

EDUCATION & CERTIFICATIONS
- M.S. in Information Systems, Northwestern University (2022)
- B.A. in Economics, University of Illinois (2020)
- Microsoft Office Specialist: Excel Expert Certification (MO-201)

SKILLS
Excel (Advanced), SQL (Intermediate), Statistics (Intermediate), Power BI (Intermediate), Python (Basic).`
  },
  {
    id: 'batch-3-kevin-zhang',
    candidateName: 'Kevin Zhang',
    title: 'Data & Quantitative Analyst',
    email: 'kevin.zhang.quant@outlook.com',
    phone: '+1 (206) 555-7341',
    location: 'Seattle, WA',
    fileName: 'kevin_zhang_quant_analyst.pdf',
    fileSize: '495 KB',
    experienceYears: 3.0,
    degree: 'Master of Science in Statistics, University of Washington',
    hasCertification: false,
    resumeText: `Kevin Zhang
Seattle, WA | kevin.zhang.quant@outlook.com | github.com/kevinzhang-stats

PROFESSIONAL SUMMARY
Quantitative Data Analyst with rigorous academic background in mathematical statistics and 3 years industry experience. Proven ability in writing high-performance SQL, statistical inference, and machine learning pipelines in Python.

WORK EXPERIENCE
Beacon Analytics — Quantitative Analyst | 2023 - Present (2 years)
- Engineered complex SQL transformations across 100M+ event tables for financial risk simulation models.
- Built Python predictive pipelines utilizing statsmodels, SciPy, and Pandas with automated unit tests.
- Designed exploratory A/B test sample size calculators and sequential testing frameworks.

Pacific Data Labs — Data Analyst Intern & Associate | 2022 - 2023 (1 year)
- Extracted SQL cohorts and analyzed user retention metrics.
- Developed basic Power BI dashboards to display statistical confidence intervals for executive reviewers.
- Applied advanced Excel statistical formulas for interim reporting.

PROJECTS
- Bayesian Regression Modeling Engine (github.com/kevinzhang-stats/bayes-risk): Statistical Python library for financial volatility estimation.

EDUCATION
- M.S. in Statistics, University of Washington (2022, GPA 3.91)
- B.S. in Applied Mathematics, UW (2020)

SKILLS
SQL (Advanced), Python (Advanced), Statistics (Advanced), Excel (Intermediate), Power BI (Basic).`
  },
  {
    id: 'batch-4-rachel-green',
    candidateName: 'Rachel Green',
    title: 'Junior Data Analyst',
    email: 'rachel.green.data@webmail.com',
    phone: '+1 (617) 555-9012',
    location: 'Boston, MA',
    fileName: 'rachel_green_analyst_cv.pdf',
    fileSize: '280 KB',
    experienceYears: 1.0,
    degree: 'Bachelor of Arts in Communications, Boston University',
    hasCertification: false,
    resumeText: `Rachel Green
Boston, MA | rachel.green.data@webmail.com | github.com/rachelgreen-data

PROFILE
Enthusiastic and self-motivated career switcher transitioning into Data Analytics. Completed comprehensive online bootcamp coursework in SQL, Python, Excel, and Power BI. Eager to contribute strong communication and analytical skills.

WORK EXPERIENCE
BrightPath Marketing — Marketing Coordinator & Reporting Assistant | 2023 - Present (1 year)
- Maintained weekly social media performance reports in Excel using SUMIFS and basic pivot tables.
- Connected Google Analytics exports into basic Power BI visual charts.
- Extracted preliminary newsletter subscriber lists using straightforward SELECT/WHERE SQL queries.

COURSES & BOOTCAMP
- The Complete SQL Bootcamp, Udemy (2023)
- Google Data Analytics Professional Certificate (In Progress)
- Python for Data Science Crash Course (2023)

SKILLS
SQL (Intermediate Claimed), Excel (Intermediate), Power BI (Basic Claimed), Python (Basic), Statistics (Basic).`
  }
];
