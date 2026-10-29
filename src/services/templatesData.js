// Curated Dual-Format Templates for PrismTeX
// Every template provides BOTH LaTeX code AND DOCX visual HTML!

export const TEMPLATES = [
  {
    id: 'ieee-paper',
    name: 'IEEE Conference Research Paper',
    category: 'Academic Papers',
    badge: 'Popular',
    description: 'Standard 2-column IEEE conference paper template with abstract, index terms, math equations, tables, and bibliography.',
    latexCode: `\\documentclass[conference,twocolumn]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath,amssymb,amsfonts}
\\usepackage{graphicx}
\\usepackage{hyperref}

\\title{Scalable Deep Representation Learning via Adaptive Sparse Transformers}
\\author{Alex M. Chen, Sarah K. Vance, and Rajesh Kumar\\\\Department of Computer Science, Stanford University\\\\Email: \\{achen, svance, rkumar\\}@cs.stanford.edu}
\\date{\\today}

\\begin{document}

\\maketitle

\\begin{abstract}
Transformer architectures have emerged as the foundational paradigm for modern generative foundation models. However, quadratic self-attention complexity imposes severe computational bottlenecks when scaling to long context horizons. In this paper, we propose \\textbf{Adaptive Sparse Attention (ASA)}, a dynamic routing mechanism that dynamically prunes redundant token correlations during inference. Empirical evaluations on standard language modeling benchmarks demonstrate a 3.4$\\times$ speedup while preserving 99.2\\% perplexity fidelity.
\\end{abstract}

\\section{Introduction}
Self-attention mechanisms calculate pairwise inner products across all input tokens in sequence $\\mathbf{X} \\in \\mathbb{R}^{N \\times D}$, incurring $\\mathcal{O}(N^2)$ memory and compute complexity:
\\begin{equation}
\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{QK^T}{\\sqrt{d_k}} \\right) V
\\end{equation}
Recent sparse transformer formulations enforce static sparsity patterns (e.g., local windows or strided blocks). In contrast, our approach learns dynamic routing masks at runtime.

\\section{Methodology}
\\subsection{Adaptive Routing Mechanics}
Let $H_l$ denote the hidden activation tensor at layer $l$. We compute token saliency weights $\\omega_i$ utilizing a lightweight gating projection:
\\begin{equation}
\\omega_i = \\sigma\\left( \\mathbf{W}_g H_{l, i} + b_g \\right)
\\end{equation}
Where $\\sigma(\\cdot)$ denotes the standard sigmoid activation function. Only tokens satisfying $\\omega_i > \\tau$ participate in full pairwise attention.

\\subsection{Empirical Complexity}
The overall computational overhead is bounded by $\\mathcal{O}(N \\log N)$, yielding significant speed improvements on high-throughput GPU clusters.

\\section{Experimental Results}
We evaluate our method on the WikiText-103 and PG-19 benchmark suites.

\\begin{table}[h]
\\centering
\\begin{tabular}{|l|c|c|c|}
\\hline
\\textbf{Model} & \\textbf{Context} & \\textbf{Throughput (tok/s)} & \\textbf{Perplexity} \\\\ \\hline
Dense Transformer & 4096 & 1,420 & 18.24 \\\\ \\hline
Longformer & 4096 & 2,890 & 19.45 \\\\ \\hline
\\textbf{Ours (ASA)} & 4096 & \\textbf{4,830} & \\textbf{18.31} \\\\ \\hline
\\end{tabular}
\\end{table}

\\section{Conclusion}
We introduced Adaptive Sparse Attention, resolving the quadratic context scaling trade-off in foundation transformers. Future work includes zero-shot multi-modal extension.

\\end{document}`,
    docxHtml: `<h1>Scalable Deep Representation Learning via Adaptive Sparse Transformers</h1>
<p><em>Alex M. Chen, Sarah K. Vance, and Rajesh Kumar &middot; Stanford University</em></p>

<blockquote><strong>Abstract:</strong> Transformer architectures have emerged as the foundational paradigm for modern generative foundation models. However, quadratic self-attention complexity imposes severe computational bottlenecks when scaling to long context horizons. In this paper, we propose <strong>Adaptive Sparse Attention (ASA)</strong>, a dynamic routing mechanism that dynamically prunes redundant token correlations during inference, achieving a 3.4&times; speedup while preserving 99.2% perplexity fidelity.</blockquote>

<h2>1. Introduction</h2>
<p>Self-attention mechanisms calculate pairwise inner products across all input tokens in sequence, incurring quadratic computational complexity. Recent sparse transformer formulations enforce static sparsity patterns. In contrast, our approach learns dynamic routing masks at runtime.</p>

<p style="font-family: monospace; background: #e0e7ff; color: #3730a3; padding: 6px 12px; border-radius: 4px;">Attention(Q, K, V) = softmax((Q K^T) / &radic;d_k) V</p>

<h2>2. Methodology</h2>
<h3>2.1 Adaptive Routing Mechanics</h3>
<p>We compute token saliency weights utilizing a lightweight gating projection. Only tokens exceeding threshold &tau; participate in full pairwise attention calculations.</p>

<h3>2.2 Empirical Complexity</h3>
<p>The overall computational overhead is bounded by O(N log N), yielding significant speed improvements on high-throughput GPU clusters.</p>

<h2>3. Experimental Results</h2>
<table style="width: 100%; border-collapse: collapse; margin: 12px 0;">
  <tr style="background: #f1f5f9;">
    <th style="border: 1px solid #cbd5e1; padding: 6px;">Model</th>
    <th style="border: 1px solid #cbd5e1; padding: 6px;">Context</th>
    <th style="border: 1px solid #cbd5e1; padding: 6px;">Throughput (tok/s)</th>
    <th style="border: 1px solid #cbd5e1; padding: 6px;">Perplexity</th>
  </tr>
  <tr>
    <td style="border: 1px solid #cbd5e1; padding: 6px;">Dense Transformer</td>
    <td style="border: 1px solid #cbd5e1; padding: 6px;">4096</td>
    <td style="border: 1px solid #cbd5e1; padding: 6px;">1,420</td>
    <td style="border: 1px solid #cbd5e1; padding: 6px;">18.24</td>
  </tr>
  <tr>
    <td style="border: 1px solid #cbd5e1; padding: 6px;"><strong>Ours (ASA)</strong></td>
    <td style="border: 1px solid #cbd5e1; padding: 6px;">4096</td>
    <td style="border: 1px solid #cbd5e1; padding: 6px;"><strong>4,830</strong></td>
    <td style="border: 1px solid #cbd5e1; padding: 6px;"><strong>18.31</strong></td>
  </tr>
</table>

<h2>4. Conclusion</h2>
<p>We introduced Adaptive Sparse Attention, resolving the quadratic scaling bottleneck with empirical validation across multiple benchmark suites.</p>`
  },
  {
    id: 'jakes-resume',
    name: "Jake's Modern Software Engineer Resume",
    category: 'Resumes & CVs',
    badge: 'Trending #1',
    description: 'The world-famous Jake’s Resume template in LaTeX & DOCX. Clean, single-column, ATS-optimized, high-conversion.',
    latexCode: `\\documentclass[letterpaper,10pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}

\\title{John Doe — Full Stack & AI Systems Engineer}
\\author{San Francisco, CA $\\cdot$ (555) 019-2834 $\\cdot$ john.doe@email.com $\\cdot$ linkedin.com/in/johndoe $\\cdot$ github.com/johndoe}
\\date{}

\\begin{document}

\\maketitle

\\section{Education}
\\textbf{University of California, Berkeley} \\hfill Berkeley, CA\\\\
Bachelor of Science in Computer Science; GPA: 3.91/4.0 \\hfill Aug 2021 -- May 2025\\\\
\\textit{Relevant Coursework: Distributed Systems, Operating Systems, Machine Learning, Algorithms}

\\section{Experience}
\\textbf{Senior Software Engineer Intern} $\\cdot$ Google \\hfill Mountain View, CA\\\\
\\textit{Infrastructure & Machine Learning Platforms} \\hfill May 2024 -- Aug 2024
\\begin{itemize}
  \\item Engineered distributed model serving pipeline processing over 120M daily inferencing requests using Go, gRPC, and Kubernetes, reducing p99 latency from 145ms to 24ms.
  \\item Implemented dynamic caching layer with Redis Cluster, slashing redundant backend database queries by 48\\%.
  \\item Partnered with 6 cross-functional engineering teams to roll out zero-downtime canary deployment framework.
\\end{itemize}

\\textbf{Software Engineering Intern} $\\cdot$ Stripe \\hfill San Francisco, CA\\\\
\\textit{Core Payments Infrastructure} \\hfill May 2023 -- Aug 2023
\\begin{itemize}
  \\item Built automated multi-currency settlement microservice processing \\$42M+ in daily transaction volume with 99.999\\% uptime.
  \\item Wrote 80+ unit and integration test suites increasing codebase test coverage from 72\\% to 94\\%.
\\end{itemize}

\\section{Projects}
\\textbf{PrismTeX AI Editor} $\\cdot$ \\textit{React, TypeScript, WebAssembly, KaTeX, TailwindCSS} \\hfill Jan 2025
\\begin{itemize}
  \\item Developed in-browser LaTeX and DOCX compiler with real-time PDF rendering and AI copilot integration.
  \\item Implemented client-side token parsing and live AST generation with sub-15ms recompile performance.
\\end{itemize}

\\section{Technical Skills}
\\begin{itemize}
  \\item \\textbf{Languages:} Python, Go, Rust, TypeScript, C++, Java, SQL, LaTeX
  \\item \\textbf{Frameworks \\& Tools:} React, Next.js, Node.js, Docker, Kubernetes, AWS, PostgreSQL, Redis, Git, PyTorch
\\end{itemize}

\\end{document}`,
    docxHtml: `<h1>John Doe &mdash; Full Stack & AI Systems Engineer</h1>
<p><strong>San Francisco, CA &middot; (555) 019-2834 &middot; john.doe@email.com &middot; github.com/johndoe</strong></p>

<h2>Education</h2>
<p><strong>University of California, Berkeley</strong> &mdash; <em>Bachelor of Science in Computer Science; GPA: 3.91/4.0</em> (2021 &ndash; 2025)</p>
<p><em>Coursework:</em> Distributed Systems, Operating Systems, Machine Learning, Algorithms, Database Design.</p>

<h2>Experience</h2>
<p><strong>Senior Software Engineer Intern &middot; Google</strong> <em>(May 2024 &ndash; Aug 2024)</em></p>
<ul>
  <li>Engineered distributed model serving pipeline processing over 120M daily inferencing requests using Go, gRPC, and Kubernetes, reducing p99 latency from 145ms to 24ms.</li>
  <li>Implemented dynamic caching layer with Redis Cluster, slashing redundant backend database queries by 48%.</li>
  <li>Partnered with 6 cross-functional engineering teams to roll out zero-downtime canary deployment framework.</li>
</ul>

<p><strong>Software Engineering Intern &middot; Stripe</strong> <em>(May 2023 &ndash; Aug 2023)</em></p>
<ul>
  <li>Built automated multi-currency settlement microservice processing $42M+ in daily transaction volume with 99.999% uptime.</li>
  <li>Wrote 80+ unit and integration test suites increasing codebase test coverage from 72% to 94%.</li>
</ul>

<h2>Projects</h2>
<p><strong>PrismTeX AI Editor</strong> &middot; <em>React, TypeScript, WebAssembly, KaTeX, TailwindCSS</em></p>
<ul>
  <li>Developed in-browser LaTeX and DOCX compiler with real-time PDF rendering and AI copilot integration.</li>
  <li>Implemented client-side token parsing and live AST generation with sub-15ms recompile performance.</li>
</ul>

<h2>Technical Skills</h2>
<ul>
  <li><strong>Languages:</strong> Python, Go, Rust, TypeScript, C++, Java, SQL, LaTeX</li>
  <li><strong>Tools & Platforms:</strong> React, Docker, Kubernetes, AWS, PostgreSQL, Redis, PyTorch, Git</li>
</ul>`
  },
  {
    id: 'acm-article',
    name: 'ACM Research Article',
    category: 'Academic Papers',
    badge: 'ACM Standard',
    description: 'Association for Computing Machinery journal template with structured sections, algorithms, and references.',
    latexCode: `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{hyperref}

\\title{On the Convergence Properties of Distributed Stochastic Gradient Descent}
\\author{Elena Rostova and Marcus Sterling\\\\Department of Applied Mathematics, MIT}
\\date{\\today}

\\begin{document}

\\maketitle

\\begin{abstract}
We establish non-asymptotic convergence bounds for asynchronous distributed SGD under non-convex objective landscapes. Our theoretical guarantees demonstrate linear speedup up to $P = \\mathcal{O}(\\epsilon^{-2})$ workers without bounded gradient assumptions.
\\end{abstract}

\\section{Introduction}
Distributed machine learning over decentralized nodes requires robust optimization techniques resilient to stragglers and communication latency.

\\section{Theoretical Framework}
Consider minimizing the empirical risk:
\\begin{equation}
\\min_{w \\in \\mathbb{R}^d} F(w) \\equiv \\frac{1}{n} \\sum_{i=1}^n f_i(w)
\\end{equation}
Under standard $L$-smoothness:
\\begin{equation}
\\|\\nabla F(u) - \\nabla F(v)\\| \\le L \\|u - v\\|, \\quad \\forall u, v \\in \\mathbb{R}^d
\\end{equation}

\\section{Conclusion}
Our unified analysis resolves open questions regarding step-size decay schedules in asynchronous gradient updates.

\\end{document}`,
    docxHtml: `<h1>On the Convergence Properties of Distributed Stochastic Gradient Descent</h1>
<p><em>Elena Rostova and Marcus Sterling &middot; Department of Applied Mathematics, MIT</em></p>

<blockquote><strong>Abstract:</strong> We establish non-asymptotic convergence bounds for asynchronous distributed SGD under non-convex objective landscapes. Our theoretical guarantees demonstrate linear speedup up to P = O(&epsilon;<sup>-2</sup>) workers without bounded gradient assumptions.</blockquote>

<h2>1. Introduction</h2>
<p>Distributed machine learning over decentralized nodes requires robust optimization techniques resilient to stragglers and communication latency.</p>

<h2>2. Theoretical Framework</h2>
<p>Consider minimizing empirical risk under standard L-smoothness assumptions. We derive unified convergence bounds under delayed asynchronous update schedules.</p>

<h2>3. Conclusion</h2>
<p>Our unified analysis resolves open theoretical questions regarding step-size decay schedules in asynchronous gradient updates.</p>`
  },
  {
    id: 'docx-report',
    name: 'DOCX Executive Business & Research Report',
    category: 'DOCX / Visual',
    badge: 'WYSIWYG',
    description: 'Designed specifically for non-LaTeX users with executive formatting, KPIs, tables, and callouts.',
    latexCode: `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath,hyperref}

\\title{Q4 Strategic Artificial Intelligence & Systems Report}
\\author{Research & Engineering Strategy Group}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Executive Summary}
Over the past fiscal quarter, enterprise adoption of generative AI systems and automated document intelligence platforms accelerated by \\textbf{185\\% year-over-year}.

\\section{Key Performance Metrics}
\\begin{table}[h]
\\centering
\\begin{tabular}{|l|c|c|}
\\hline
\\textbf{Initiative} & \\textbf{Target} & \\textbf{Achieved} \\\\ \\hline
Document Compilation Latency & 1.0s & \\textbf{0.015s} \\\\ \\hline
AI Assistant Adoption & 60\\% & \\textbf{84\\%} \\\\ \\hline
\\end{tabular}
\\end{table}

\\section{Core Recommendations}
\\begin{itemize}
  \\item \\textbf{Empower Dual Authoring:} Allow technical staff to write LaTeX while business stakeholders use DOCX visual mode.
  \\item \\textbf{Zero-Cost AI Pipelines:} Leverage high-throughput free API tiers.
\\end{itemize}

\\end{document}`,
    docxHtml: `<h1>Q4 Strategic Artificial Intelligence & Systems Report</h1>
<p><strong>Prepared for:</strong> Executive Leadership Team &middot; <strong>Date:</strong> October 2026 &middot; <strong>Author:</strong> Research & Engineering Strategy Group</p>

<h2>Executive Summary</h2>
<p>Over the past fiscal quarter, enterprise adoption of generative AI systems and automated document intelligence platforms accelerated by <strong>185% year-over-year</strong>. Organizations that adopted unified collaborative authoring platforms realized an average <strong>32% reduction in publication cycle times</strong>.</p>

<h2>Key Performance Metrics</h2>
<table style="width: 100%; border-collapse: collapse; margin: 12px 0;">
  <tr style="background: #f1f5f9;">
    <th style="border: 1px solid #cbd5e1; padding: 6px;">Initiative</th>
    <th style="border: 1px solid #cbd5e1; padding: 6px;">Target</th>
    <th style="border: 1px solid #cbd5e1; padding: 6px;">Status</th>
  </tr>
  <tr>
    <td style="border: 1px solid #cbd5e1; padding: 6px;">Document Compilation Latency</td>
    <td style="border: 1px solid #cbd5e1; padding: 6px;">1.0s</td>
    <td style="border: 1px solid #cbd5e1; padding: 6px;"><strong>0.015s (Instant)</strong></td>
  </tr>
  <tr>
    <td style="border: 1px solid #cbd5e1; padding: 6px;">AI Assistance Adoption</td>
    <td style="border: 1px solid #cbd5e1; padding: 6px;">60%</td>
    <td style="border: 1px solid #cbd5e1; padding: 6px;"><strong>84% Active</strong></td>
  </tr>
</table>

<h2>Core Recommendations</h2>
<ul>
  <li><strong>Empower Dual Authoring:</strong> Allow technical staff to write LaTeX while business stakeholders use the rich visual DOCX editor seamlessly.</li>
  <li><strong>Zero-Cost Model Pipelines:</strong> Leverage high-throughput free API tiers to ensure zero licensing expenditures.</li>
</ul>`
  }
];
