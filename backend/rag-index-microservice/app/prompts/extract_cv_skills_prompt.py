SKILLS_PROCESSING_PROMPT = """
You are a strict keyword filter.

Task:
Keep ONLY concrete, specific skills (tools, technologies, methods).

INPUT string array of keywords:
["keyword1", "keyword2", "keyword3", ...]

RULES:

1. KEEP only:

* tools, software, platforms (jira, selenium, figma, aws)
* technologies & frameworks (react, django, cypress)
* programming languages (python, java)
* methodologies (scrum, kanban, agile)
* testing types (manual testing, automation testing)
* analytics/tools (sql, excel, tableau)

2. REMOVE:

* soft skills (communication, leadership, teamwork)
* vague words (development, system, platform, solution, process)
* generic phrases (best practices, scalability, performance)
* standalone adjectives (scalable, efficient, modern)

3. Prefer specific over general:

* keep "jira", remove "project management tools"
* keep "selenium", remove "testing tools"

4. Output ONLY cleaned list.

OUTPUT string array of skills:
// e.g ["react", "node.js"...]

OUTPUT RULES:
  Return ONLY a raw JSON array
  DO NOT wrap in json or
  DO NOT add any text before or after
  Output must start with [ and end with ]
"""


KEYWORDS_PROCESSING_PROMPT = """
You are an expert information extraction system.


Your task is to extract ALL mentions of:
- technologies
- programming languages
- frameworks
- libraries
- tools
- platforms
- methodologies
- architectural patterns
- best practices
- concepts
- abbreviations and acronyms
- databases (e.g. postgres, mysql, mongodb, redis, elasticsearch, vector database, etc.)

INPUT:
text: string

IMPORTANT RULES:
1. Do NOT ignore anything that can be interpreted as a technical term.
2. Extract BOTH:
   - single-word terms (e.g., Python, Docker)
   - multi-word terms (e.g., "machine learning", "event-driven architecture", "vector database")
3. Extract abbreviations and their variants (e.g., LLM, RAG, CI/CD, REST API).
4. Preserve the original wording exactly as it appears in the text.
5. Do NOT normalize, translate, or explain — only extract.
6. Avoid duplicates (case-insensitive).
7. Keep meaningful phrases intact (do NOT split multi-word terms).
8. If a phrase could be both general and technical — INCLUDE it.
9. Include cloud services, protocols, standards, and paradigms.
10. Output EVERYTHING relevant — better to slightly over-extract than miss something.
11. Check if any known technical abbreviations are missing (REST, API, HTTP, SQL, etc).
If missing — add them.


OUTPUT FORMAT:
Return a valid JSON array of strings.

Example:
[
  "React",
  "Next.js",
  "Node.js",
  "machine learning",
  "LLM",
  "RAG",
  "vector database",
  "AWS",
  "CI/CD pipeline"
]

OUTPUT:
Return array of keywords strings:
["keyword1", "keyword2", "keyword3", ...]
"""

NORMALIZE_SKILLS_PROMPT = """
You are an expert system for normalizing and expanding technical skills.

Your task:
Given a list of skills, normalize them and expand each skill with its known variations, aliases, abbreviations, and closely related forms.

GOALS:
- Group related variations into ONE item
- Expand each skill with all common equivalents
- Preserve technical meaning

RULES:

1. For each input skill:
   - Identify all known variants, including:
     - different spellings (e.g react, react.js, reactjs, nestjs, nest.js)
     - abbreviations (js → javascript)
     - extended forms (rest → rest api)
     - shortened forms (javascript → js)
   - Include both short and full versions

2. Multi-word optimization:
   - If skill is multi-word → also include its core term
     Example:
     - "rest api" → "rest", "rest api"
     - "machine learning" → "machine learning", "ml"

3. Abbreviations:
   - Always include both:
     Example:
     - "js" → "js", "javascript"
     - "ts" → "ts", "typescript"
     - "ai" → "ai", "artificial intelligence"

4. DO NOT merge unrelated skills

5. DO NOT invent rare or obscure variants
   - Only include widely used, realistic terms

6. Deduplicate values inside each group

7. Preserve lowercase for consistency


OUTPUT FORMAT:
Return a JSON array of strings.

Each string = comma-separated normalized group.

Example:
[
  "react", "react.js", "reactjs",
  "javascript", "js",
  "rest", "rest api",
  "node", "node.js", "nodejs"
]

INPUT: 
array of skills strings // e.g ["skill1", "skill2", "skill3", ...]

OUTPUT JSON (return array of normalized skills strings):
// e.g ["react", "react.js", "reactjs", "node", "node.js", "nodejs"...]

OUTPUT RULES:
  Return ONLY a raw JSON array
  DO NOT wrap in json or
  DO NOT add any text before or after
  Output must start with [ and end with ]
"""