// Workshops and faculty development programs, oldest first.
// Add a row here and the counts on the site update automatically.
// TODO: add workshops from 2026 onwards

export interface Workshop {
  year: number
  dates: string
  topic: string
  venue: string
}

export const workshops: Workshop[] = [
  { year: 2023, dates: '3 Oct – 5 Oct', topic: 'Python Data Analysis', venue: 'AIT, Pune' },
  { year: 2023, dates: '30 Oct – 31 Oct', topic: 'Deep Learning Labs', venue: 'JSPM, Wagholi, Pune' },
  { year: 2023, dates: '3 Nov – 4 Nov', topic: 'MySQL', venue: 'PCCOE, Pune' },
  { year: 2023, dates: '4 Dec – 9 Dec', topic: 'Data Science', venue: 'IMCC, Pune' },
  { year: 2023, dates: '19 Dec – 23 Dec', topic: 'Dart and Flutter for IoT', venue: 'SGGSIET, Nanded' },
  { year: 2024, dates: '18 Jan – 19 Jan', topic: 'Data Analytics and Visualization', venue: 'AIT, Pune' },
  { year: 2024, dates: '23 Jan – 24 Jan', topic: 'Python Programming and Data Science Basics', venue: 'DACOE, Karad' },
  { year: 2024, dates: '31 Jan', topic: 'Python for Data', venue: 'AISSMS, Pune' },
  { year: 2024, dates: '5 Feb – 10 Feb', topic: 'Data Science and Machine Learning', venue: 'WCE, Sangli' },
  { year: 2024, dates: '12 Feb – 17 Feb', topic: 'Python and Data Science', venue: 'Sandeep Foundation, Nasik' },
  { year: 2024, dates: '19 Feb – 24 Feb', topic: 'Python and Data Science', venue: 'Sandeep Foundation, Nasik' },
  { year: 2024, dates: '26 Feb – 28 Feb', topic: 'Data Science and Machine Learning', venue: 'PICT, Pune' },
  { year: 2024, dates: '29 Feb – 1 Mar', topic: 'Data Science and Machine Learning', venue: 'PCCOER, Pune' },
  { year: 2024, dates: '14 Mar – 15 Mar', topic: 'Prompt Engineering', venue: 'SSGMCE, Shegaon' },
  { year: 2024, dates: '4 Apr – 5 Apr', topic: 'Deep Learning', venue: 'AISSMS (IOIT), Pune' },
  { year: 2024, dates: '10 Apr – 14 Apr', topic: 'Data Science', venue: 'AIT, Pune' },
  { year: 2024, dates: '16 Apr', topic: 'Data Visualization', venue: 'Keystone School of Engineering, Pune' },
  { year: 2024, dates: '17 Apr – 21 Apr', topic: 'Data Science', venue: 'AIT, Pune' },
  { year: 2024, dates: '23 Apr', topic: 'Machine Learning', venue: 'Keystone School of Engineering, Pune' },
  { year: 2024, dates: '16 May – 17 May', topic: 'Data Analytics', venue: 'MGM, Nanded' },
  { year: 2024, dates: '3 Jul – 5 Jul', topic: 'Deep Learning (ANN, CNN, RNN)', venue: 'MIT, Sambhaji Nagar' },
  { year: 2024, dates: '22 Jul – 30 Jul', topic: 'Machine Learning', venue: 'MET, Nashik' },
  { year: 2024, dates: '12 Aug – 14 Aug', topic: 'Deep Learning', venue: 'DVVP, Ahmednagar' },
  { year: 2024, dates: '19 Aug – 20 Aug', topic: 'Data Science', venue: 'AIT, Dighi' },
  { year: 2024, dates: '26 Aug – 28 Aug', topic: 'Tableau', venue: 'SSBF, Lavale' },
  { year: 2024, dates: '29 Aug – 31 Aug', topic: 'Power BI', venue: 'SSBF, Lavale' },
  { year: 2024, dates: '2 Sep – 5 Sep', topic: 'Python for Data Analysis', venue: 'DYPIEMR, Ravet' },
  { year: 2024, dates: '9 Sep – 10 Sep', topic: 'Python', venue: 'Samarth, Belhe' },
  { year: 2024, dates: '16 Sep – 20 Sep', topic: 'AI and ML', venue: 'DYPIEMR, Ravet' },
  { year: 2024, dates: '23 Sep – 27 Sep', topic: 'Python for AI/ML', venue: 'DYPIEMR, Ravet' },
  { year: 2024, dates: '9 Oct – 11 Oct', topic: 'Applications of AI Tools', venue: 'Sinhgad Academy of Engineering, Kondhwa' },
  { year: 2024, dates: '19 Nov', topic: 'Python and MongoDB', venue: 'IIMS' },
  { year: 2024, dates: '16 Dec – 27 Dec', topic: 'MLOps Essentials: From Models to Deployment', venue: 'MITADT, Loni' },
  { year: 2024, dates: '19 Dec – 20 Dec', topic: 'Applications of Clustering Models', venue: 'JSPM' },
  { year: 2025, dates: '13 Jan – 15 Jan', topic: 'Data Viz Tools', venue: 'MITWPU' },
  { year: 2025, dates: '20 Jan – 30 Jan', topic: 'Data Science', venue: 'Ajeenkya DYPU' },
  { year: 2025, dates: '3 Feb – 7 Feb', topic: 'Power BI', venue: 'IMS, Ahilyanagar' },
  { year: 2025, dates: '10 Feb', topic: 'Data Viz', venue: 'AIT, Dighi' },
  { year: 2025, dates: '24 Feb – 2 Mar', topic: 'Power BI and Tableau', venue: 'IMCC' },
  { year: 2025, dates: '8 Apr – 11 Apr', topic: 'Data Analysis and ML', venue: 'MGM, Nanded' },
  { year: 2025, dates: '17 Apr – 21 Apr', topic: 'Data Science', venue: 'AIT, Dighi' },
  { year: 2025, dates: '16 Jun – 20 Jun', topic: 'Generative AI', venue: 'DKTE, Ichalkaranji' },
  { year: 2025, dates: '7 Jul – 10 Jul', topic: 'Python, Statistics and Data Analysis', venue: 'MITADT, Loni' },
  { year: 2025, dates: '21 Jul – 26 Jul', topic: 'AI/ML', venue: 'PCP' },
  { year: 2025, dates: '28 Jul', topic: 'ML', venue: 'GHR Raisoni' },
  { year: 2025, dates: '4 Aug – 6 Aug', topic: 'Campus Enhancement', venue: 'I2IT' },
  { year: 2025, dates: '7 Aug – 9 Aug', topic: 'Power BI', venue: 'PCP IT' },
  { year: 2025, dates: '11 Aug – 12 Aug', topic: 'LLM', venue: 'PCCOE' },
  { year: 2025, dates: '18 Aug – 20 Aug', topic: 'Power BI', venue: 'PCP IT' },
  { year: 2025, dates: '22 Aug – 23 Aug', topic: 'Python Programming', venue: 'DKTE, Ichalkaranji' },
  { year: 2025, dates: '28 Aug – 30 Aug', topic: 'Tableau', venue: 'SSBF, Lavale' },
  { year: 2025, dates: '1 Sep – 2 Sep', topic: 'Power BI', venue: 'SSBF, Lavale' },
  { year: 2025, dates: '3 Sep – 5 Sep', topic: 'Power BI', venue: 'SVKM, Dhule' },
  { year: 2025, dates: '10 Sep – 11 Sep', topic: 'Python Programming', venue: 'DKTE, Ichalkaranji' },
  { year: 2025, dates: '15 Sep – 20 Sep', topic: 'Power BI', venue: 'SVKM, DKTE' },
  { year: 2025, dates: '23 Sep – 27 Sep', topic: 'AI/ML', venue: 'PCP' },
  { year: 2025, dates: '6 Oct – 7 Oct', topic: 'Data Analysis', venue: 'Samarth, Belhe' },
  { year: 2025, dates: '8 Oct – 9 Oct', topic: 'Generative AI', venue: 'AISSMS IOIT' },
  { year: 2025, dates: '10 Oct', topic: 'Power BI', venue: 'AIT, Dighi' },
  { year: 2025, dates: '3 Nov – 4 Nov', topic: 'Python Programming', venue: 'DKTE, Ichalkaranji' },
  { year: 2025, dates: '8 Dec – 12 Dec', topic: 'Databases and SQL', venue: 'SAKEC, Mumbai' },
]

// Distinct institutions, ignoring the campus/city part after the comma
const institutions = new Set(
  workshops.map((w) => w.venue.split(',')[0].trim().toUpperCase()),
)

const years = workshops.map((w) => w.year)

// Rounded down to the nearest ten so the "+" stays honest as rows are added
const roundDown = (n: number) => `${Math.floor(n / 10) * 10}+`

export const teachingStats = {
  workshops: roundDown(workshops.length),
  institutions: roundDown(institutions.size),
  from: Math.min(...years),
  to: Math.max(...years),
}
