EXTRACT_VACANCY_PROMPT = """
You are a skill extraction engine for job vacancies.

Task:
Extract ONLY relevant skills from the vacancy text.

INPUT:
vacancy_text: string

WHAT TO EXTRACT:

* Programming languages
* Frameworks and libraries
* Tools and platforms
* Databases
* Cloud providers
* DevOps tools
* AI/ML tools
* APIs and protocols
* Methods and methodologies
* Architecture patterns
* Technical requirements

INCLUDE:

* Explicitly mentioned technologies
* Implicit technical skills

IGNORE:

* Responsibilities (e.g. "develop", "collaborate")
* Soft skills (e.g. "team player", "communication")
* Job titles and roles
* Company names
* Benefits and perks
* Location, salary, conditions

RULES:

* Keep only concrete, meaningful skills

* Normalize to short canonical forms when possible
  (e.g. "node.js", "react", "postgresql", "aws")

* Split combined skills:
  "React/Redux" → ["react", "redux"]
  "Node + Express" → ["node.js", "express"]

* Deduplicate results

* Output lowercase

OUTPUT:
Return JSON array of strings:
["skill1", "skill2", ...]

OUTPUT RULES:
  Return ONLY a raw JSON array
  DO NOT wrap in json or
  DO NOT add any text before or after
  Output must start with [ and end with ]
"""

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