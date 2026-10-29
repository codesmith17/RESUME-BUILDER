export const RESUME_LATEX_SOURCE = `\\documentclass[letterpaper,10pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\ifdefined\\pdfglyphtounicode
  \\input{glyphtounicode}
\\fi

% Font options
\\usepackage[sfdefault]{roboto}  % Sans-serif font

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins - Reduce Left Space
\\usepackage[left=0.4in, right=0.2in, top=0.1in, bottom=0.1in]{geometry}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Section formatting
\\titleformat{\\section}{\\Large\\bfseries\\raggedright}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{*0.1}{*0.05} % Compact section spacing to keep the resume on one page

% Ensure PDF is machine readable
\\ifdefined\\pdfgentounicode
  \\pdfgentounicode=1
\\fi

% Custom commands
\\newcommand{\\resumeItem}[1]{\\item\\small{#1}}
\\newcommand{\\resumeBullet}[1]{\\item\\small{#1}}
\\newcommand{\\resumeBulletListStart}{\\begin{itemize}[leftmargin=0.17in, label=\\textbullet, itemsep=0pt, topsep=0pt, parsep=0pt, partopsep=0pt]}
\\newcommand{\\resumeBulletListEnd}{\\end{itemize}}
\\newcommand{\\resumeSubheading}[4]{
\\vspace{0pt}\\item
  \\noindent\\textbf{#1}\\hfill #2\\par
  \\noindent\\textit{#3}\\hfill\\textit{#4}\\par\\vspace{-4pt}
}
\\newcommand{\\resumePromotedSubheading}[6]{
\\vspace{0pt}\\item
  \\noindent\\textbf{#1}\\hfill #2\\par
  \\noindent\\textbf{#3}\\hfill\\textit{#4}\\par
  \\noindent\\textit{#5}\\hfill\\textit{#6}\\par\\vspace{-4pt}
}
\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
\\newcommand{\\resumeSubHeadingList}{\\begin{itemize}[leftmargin=0in, label={}, itemsep=0pt, topsep=0pt, parsep=0pt, partopsep=0pt]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}

\\begin{document}

\\begin{center}
  \\Huge Krishna Tripathi \\\\
  \\small +91 70160 50711   $|$   \\href{mailto:kanchanlatakrishna@gmail.com}{\\textcolor{blue}{kanchanlatakrishna@gmail.com}} $|$  
\\href{https://www.linkedin.com/in/krishnatripathi-/}{\\textcolor{blue}{LinkedIn}} $|$  
\\href{https://github.com/codesmith17}{\\textcolor{blue}{GitHub}} $|$  
\\href{https://leetcode.com/u/codesmith17/}{\\textcolor{blue}{LeetCode}} $|$  
\\href{https://krishna-tripathi.vercel.app/}{\\textcolor{blue}{Portfolio}}
\\end{center}

\\vspace{-1pt}

% Modular Sections from 'sections/' folder
\\input{sections/education}

\\input{sections/skills}

\\section{Professional Experience}
\\vspace{1pt}
\\resumeSubHeadingList
  \\resumeSubheading
      {Yugabyte}{Bengaluru, India}
      {\\textbf{Software Engineer I}}{September 2025 to Present}
      
      \\vspace{2pt}

      \\resumeBulletListStart
          \\setlength{\\itemsep}{0pt}
          \\resumeBullet{\\textbf{Replaced polling-based file ingestion with event-driven processing} using AWS S3 \\textbf{ObjectCreated events}, \\textbf{SQS}, and \\textbf{Lambda}; implemented presigned S3 uploads across 3 services with file-size, type, and spoofing guardrails.}
          \\resumeBullet{\\textbf{Configured Meko's React, Go, Python, and Nginx environment}, API routing, and Langfuse observability; built reusable React UI components and wrote \\textbf{100+ UI/backend unit tests} with Cypress and Echo (Labstack) for Go handlers, middleware, and endpoints.}
          \\resumeBullet{\\textbf{Built retrieval observability and context-promotion workflows} across memory and knowledge-base sources, replacing full conversation replay and reducing input-token usage by \\textbf{35\\%} in marketing and lead-generation workflows.}
          \\resumeBullet{\\textbf{Implemented and optimized AWS Cognito authentication across 3 identity providers}: Google, LinkedIn, and GitHub; streamlined federated identity linking, profile completion, and invite/logout flows, reducing signup time by \\textbf{23\\%}.}
          \\resumeBullet{\\textbf{Built Python-based RAG retrieval for YugabyteDB} through a \\texttt{PgDistRagRetriever} for \\href{https://docs.yugabyte.com/stable/develop/ai/distributed-rag/}{\\textcolor{blue}{pg\\_dist\\_rag}}, implementing metadata filtering, hybrid search, and integration tests; developed Java-based embedding-store and chat-memory integrations for LangChain4j, contributing code and \\href{https://docs.langchain4j.dev/integrations/embedding-stores/yugabytedb}{\\textcolor{blue}{documentation}} upstream in a merged \\href{https://github.com/langchain4j/langchain4j-community/commit/90c2f0fae2f71b786c96d246de220a7529dc88fc}{\\textcolor{blue}{commit}}.}
          \\resumeBullet{\\textbf{Improved disaster-recovery workflows with Go backend services and a React frontend}, reducing node-selection latency from \\textbf{450 ms to 120 ms}; surfaced C++ replication-lag metrics through Prometheus.}
          \\resumeBullet{\\textbf{Developed a database migration validator across 5+ repositories}, checking schema versions and dirty state to detect invalid migrations before merge and provide actionable error feedback.}
          \\resumeBullet{\\textbf{Strengthened YugabyteDB's open-source developer ecosystem} with JavaScript driver logging, ORM load-balancing examples, integration guidance, and JUnit tests for Yugabyted UI backend services.}
      \\resumeBulletListEnd

      \\vspace{1pt}
      \\noindent\\textit{\\textbf{Software Engineer Intern}}\\hfill\\textit{September 2024 to August 2025}\\par
      \\vspace{2pt}
      \\resumeBulletListStart
          \\setlength{\\itemsep}{0pt}
          \\resumeBullet{\\textbf{Recreated the YB Voyager workflow in Yugabyted UI with UX designers using Figma} across 4 migration stages; added status and progress analytics and redesigned the \\href{https://docs.yugabyte.com/stable/yugabyte-voyager/migrate/assess-migration/}{\\textcolor{blue}{migration assessment}} UX. (\\href{https://github.com/yugabyte/yb-voyager/pull/2564}{\\textcolor{blue}{PR \\#2564}} $|$ \\href{https://github.com/yugabyte/yugabyte-db/commit/fb98232528554da4b56e8f4dcf2f8347af681935}{\\textcolor{blue}{implementation}})}
          \\resumeBullet{\\textbf{Built Go backend APIs and integration workflows across 5 external systems}: Scarf, GCS, BigQuery, MadKudu, and Salesforce, supporting centralized growth metrics, lead scoring, and CRM synchronization.}
          \\resumeBullet{\\textbf{Streamlined yb-voyager developer tooling across 3 workflows}: added Homebrew install tracking, fixed Go/Docker setup in Jenkins helpers, standardized build-script versioning, corrected assessment HTML, and moved stable-version tests to Jenkins. (\\href{https://github.com/yugabyte/yb-voyager/pull/2652}{\\textcolor{blue}{PR \\#2652}} $|$ \\href{https://github.com/yugabyte/yb-voyager/pull/2779}{\\textcolor{blue}{PR \\#2779}})}
          \\resumeBullet{\\textbf{Improved YugabyteDB onboarding} by documenting \\href{https://docs.yugabyte.com/stable/develop/drivers-orms/nodejs/typeorm/}{\\textcolor{blue}{TypeORM smart-driver setup}} and fixing \\href{https://docs.yugabyte.com/stable/quick-start/linux/}{\\textcolor{blue}{Linux/RHEL quick-start links}}. (\\href{https://github.com/yugabyte/yugabyte-db/pull/28250}{\\textcolor{blue}{PR \\#28250}} $|$ \\href{https://github.com/yugabyte/yugabyte-db/pull/28418}{\\textcolor{blue}{PR \\#28418}})}
      \\resumeBulletListEnd
\\vspace{-1pt}
  \\resumeSubheading
      {Zluri}{Bengaluru, India}
      {\\textbf{Software Engineer Intern}}{August 2024 to September 2024}

      \\vspace{1pt}
      \\resumeBulletListStart
          \\resumeBullet{\\textbf{Resolved 13+ production bugs} in JavaScript/Node.js and MongoDB; built QA dashboards and a testing framework, increasing test coverage by \\textbf{20\\%} and improving query performance by \\textbf{30\\%}.}
      \\resumeBulletListEnd
\\resumeSubHeadingListEnd

\\section{Projects}
\\vspace{1pt}
\\resumeSubHeadingList
  \\resumeSubheading
     {EternalAgni: Solar Timing \\& Reminder App}{July 2026 to Present}
     {C++17, Android NDK, CMake, JavaScript, Capacitor, PWA}{\\textbf{\\href{https://agnihotra-eternal-agni.vercel.app/}{\\textcolor{blue}{WEB}}} $|$ \\textbf{\\href{https://play.google.com/store/apps/details?id=com.eternalagni.app}{\\textcolor{blue}{GOOGLE PLAY}}}}

      \\vspace{2pt}
      \\resumeBulletListStart
          \\setlength{\\itemsep}{0pt}
          \\resumeBullet{\\textbf{Engineered a native C++17 astronomical timing engine} using Android NDK and CMake, generating sunrise and sunset schedules with $\\pm$1-second precision (tested against source) and supporting 92 days of offline operation.}
          \\resumeBullet{\\textbf{Built reliable cross-platform scheduling} across Android and PWA, implementing exact alarms, boot-time recovery, service-worker caching, duplicate suppression, and protection against late or missed reminders.}
          \\resumeBullet{\\textbf{Optimized native Android deployment} with architecture-specific shared libraries, 16 KB ELF page-size alignment, and R8 code shrinking and obfuscation for modern Android compatibility.}
      \\resumeBulletListEnd

  \\vspace{1pt}

  \\resumeSubheading
     {YB Voyager Copilot: AI-Powered Database Migration Assistant}{January 2025 to Present} 
     {LangGraph, FastAPI, Next.js, Python, MCP, Docker, YugabyteDB, RAG}{\\textbf{\\href{https://hub.docker.com/u/krishnatripathi17?page=1\\&search=yb-voyager-}{\\textcolor{blue}{DOCKER HUB}}} $|$ \\textbf{\\href{https://peach-doreen-11.tiiny.site/}{\\textcolor{blue}{ARCHITECTURE}}} $|$ \\textbf{\\href{https://drive.google.com/file/d/1FeDoy3duOXkC9bDFbx8XYkm08n5Khysf/view?usp=sharing}{\\textcolor{blue}{DEMO}}}}
      
      \\vspace{2pt}
      \\resumeBulletListStart
          \\setlength{\\itemsep}{0pt}
          \\resumeBullet{\\textbf{Architected a 3-agent LangGraph and MCP workflow} spanning all 4 migration stages and grounded in product documentation.}
          \\resumeBullet{\\textbf{Built a 3-tier RAG backend and containerized 5 services} with FastAPI, pgvector, YugabyteDB, and Docker; automated image publishing through GitHub Actions and generated Playwright PDF assessments with production-sizing recommendations.}
      \\resumeBulletListEnd

\\resumeSubHeadingListEnd

\\section{Achievements}
\\vspace{1pt}
\\resumeBulletListStart

    \\resumeBullet{Received \\textbf{Best Use of AI} recognition for YB Voyager Copilot at the YugabyteDB internal hackathon.}
    \\resumeBullet{Earned \\textbf{\\href{https://lnkd.in/p/gssUKaqM}{\\textcolor{blue}{Guardian status with a maximum rating of 2145}}} on LeetCode. Reached \\textbf{4-star status with a 1944 rating} on CodeChef and \\textbf{Specialist status with a maximum rating of 1484} on Codeforces.}
    \\resumeBullet{Secured \\textbf{\\href{https://www.linkedin.com/posts/rashmi-mantri_excited-to-share-that-my-team-codesmiths-activity-7122517715239485441-0FJF?utm_source=share\\&utm_medium=member_desktop\\&rcm=ACoAAD7lKOMBYLQAiLV7kSgMy5wKnQMMlyx81TU}{\\textcolor{blue}{3rd place}}} in Algorithmia at Tantrafiesta 2023.}
\\resumeBulletListEnd
\\end{document}
`;
