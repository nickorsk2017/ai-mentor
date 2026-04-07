EXTRACT_VACANCY_FIELDS = """
- title (string) // IMPORTANT: if not present, set value to empty string
- seniority_score (string) // ONLY THIS VALUES: junior/mid/senior/lead
- years_of_experience (string) // IMPORTANT: if not present, set value to empty string
- role (string) // ONLY THIS VALUES: frontend/backend/fullstack/devops/ai/pm/
- is_remote (true/false) // IMPORTANT: if not present, set  value to false
- is_full_time (true/false) // IMPORTANT: if not present, set value to true
- is_part_time (true/false) // IMPORTANT: if not present, set  value to false
- is_contract (true/false) // IMPORTANT: if not present, set  value to false
- salary_range (string) // IMPORTANT: if not present, set value to empty string.
- benefits (array of benefits)
- field (string) e.g. healhcare, education, etc. // IMPORTANT: if not present, set value to empty string
- company_size (string) small/medium/large/enterprise // IMPORTANT: if not present, set value to empty string
- company_type (string) // IMPORTANT: if not present, set value as "other"
- company_industry // IMPORTANT: if not present, set value to empty string
- company_location (string) // IMPORTANT: if not present, set value to empty string
- company_website (string) // IMPORTANT: if not present, set value to empty string
- location (string)
- summary (string) // IMPORTANT: IT MUST BE FILLED; SPLIT PARAGRAPHS WITH 2 NEW LINES AFTER EACH PARAGRAPH
"""


EXTRACT__DATA_VACANCY_PROMPT = """
Extract structured information from this job description.

Return JSON with the following fields:
{FIELDS}

IMPORTANT:
- ALL FIELDS MUST BE FILLED! RETURN VALID JSON PYTHON!
- LOCATION FIELD MUST BE FILLED WITH FOLLOWING VALUES: "city name" or "remote" or empty string
- IS_FULL_TIME FIELD MUST BE FILLED IF NOT DEFINED, VALUE TO TRUE!
- SUMMARY MUST DESCRIBE ABOUT COMPANY, TEAM, RESPONSIBILITIES, BENEFITS, APPROACHES, WHAT IS IMPORTANT.
SUMMARY SHOULD BE 8-15 SENTENCES.
- SALARY_RANGE SHOULD BE IN FORMAT "1000-2000 USD" OR "30 / hr" OR "150000 USD / year".
- COMPANY_SIZE SHOULD BE IN FORMAT small/medium/large/enterprise.
- COMPANY_TYPE SHOULD BE IN FORMAT "startup" OR "enterprise" OR "government" OR "non-profit" OR "other".
- COMPANY_INDUSTRY SHOULD BE IN FORMAT "Healthcare" OR "Finance" OR "EdTech" OR "FinTech" OR "Crypto" OR "other".
- COMPANY_LOCATION SHOULD BE IN FORMAT "New York" OR "London" OR "Paris" OR "other".
- COMPANY_WEBSITE SHOULD BE IN FORMAT "https://www.company.com" OR "https://company.com
- BENEFITS SHOULD BE ARRAY OF STRINGS.
- COMPANY_TYPE SHOULD BE IN FORMAT "startup" OR "enterprise" OR "government" OR "non-profit" OR "outsourcing" OR "other".
"""

EXTRACT_CV_FIELDS_RULES = """

{
  "summary": string,
  "years_experience": number
}


SUMMARY FIELD RULES (REQUIRED):
- 4-6 sentences
- Written in third person or neutral tone (no "I")
- Must include:
  - Key roles and seniority_score (e.g. Senior Backend Engineer, CTO)
  - Core tech stack
  - Main achievements or impact (metrics if available)
- Avoid generic phrases like "hardworking" or "team player"
- Be concise and factual
- Avoid filler words, marketing language, and repetition
- sentense should be short and concise

YEARS_EXPERIENCE FIELD RULES (REQUIRED):
- Total professional experience in years (float, e.g. 5.5)
- Calculate based on work history dates
- Handle overlapping roles correctly (do not double count)
- If unclear, estimate conservatively
- Use 0 ONLY if no information is available

Output rules:
- Return ONLY valid JSON
- No explanations, no extra text
- All fields are required
"""


EXTRACT_DATA_CV_PROMPT = """
You extract structured fields from a CV or resume.

Return JSON with exactly these fields:
{FIELDS}

Rules:
- SUMMARY must be non-empty whenever the document contains any employment or project history; synthesize from the text.
- years_expereance: infer from dates and stated experience; if ranges conflict, choose a adviceable single number.
"""
