import path from "path"
import fs from "fs"
import os from "os"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { compile } from "node-tectonic"

function parseTectonicErrors(rawOutput) {
  if (!rawOutput) return [];
  const lines = rawOutput.split(/\r?\n/);
  const errors = [];
  let currentError = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("! ")) {
      if (currentError) errors.push(currentError);
      currentError = {
        message: line.substring(2).trim(),
        line: null,
        context: ""
      };
      continue;
    }

    const lineMatch = line.match(/^l\.(\d+)\s*(.*)$/);
    if (lineMatch && currentError) {
      currentError.line = parseInt(lineMatch[1], 10);
      currentError.context = lineMatch[2].trim();
      continue;
    }

    if (line.startsWith("error: ")) {
      const msg = line.substring(7).trim();
      if (!msg.includes("halted on fatal error")) {
        if (currentError) errors.push(currentError);
        currentError = {
          message: msg,
          line: null,
          context: ""
        };
      }
      continue;
    }

    if (currentError && !currentError.context && line.trim().startsWith("\\")) {
      currentError.context = line.trim();
    }
  }

  if (currentError) errors.push(currentError);
  return errors;
}

function localLatexCompilerPlugin() {
  return {
    name: "local-latex-compiler",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method === "POST" && (req.url === "/api/compile" || req.url === "/api/compile/")) {
          let body = "";
          req.on("data", chunk => { body += chunk; });
          req.on("end", async () => {
            try {
              const data = JSON.parse(body || "{}");
              const mainFile = data.mainFile || "resume.tex";
              let code = data.code || "";
              const files = data.files || [];

              // Compatibility: protect pdfgentounicode and glyphtounicode for standard engines
              if (code.includes("\\input{glyphtounicode}") && !code.includes("\\ifdefined\\pdfglyphtounicode")) {
                code = code.replace("\\input{glyphtounicode}", "\\ifdefined\\pdfglyphtounicode\\input{glyphtounicode}\\fi");
              }
              if (code.includes("\\pdfgentounicode=1") && !code.includes("\\ifdefined\\pdfgentounicode")) {
                code = code.replace("\\pdfgentounicode=1", "\\ifdefined\\pdfgentounicode\\pdfgentounicode=1\\fi");
              }

              // Create temporary build workspace
              const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "tectonic-project-"));
              try {
                // Write auxiliary project files (education.tex, settings.sty, etc.)
                for (const f of files) {
                  if (!f || !f.name) continue;
                  if (f.name === mainFile) continue;

                  // Write to folder if defined
                  if (f.folder) {
                    const folderPath = path.join(tempDir, f.folder, f.name);
                    fs.mkdirSync(path.dirname(folderPath), { recursive: true });
                    fs.writeFileSync(folderPath, f.content || "");
                  }

                  // Also write directly in root so both \input{sections/education} and \input{education} work
                  const rootPath = path.join(tempDir, f.name);
                  fs.mkdirSync(path.dirname(rootPath), { recursive: true });
                  fs.writeFileSync(rootPath, f.content || "");
                }

                // Write main entry file
                const mainBase = path.basename(mainFile);
                const mainPath = path.join(tempDir, mainBase);
                fs.writeFileSync(mainPath, code, "utf8");
                if (mainFile !== mainBase) {
                  const subMainPath = path.join(tempDir, mainFile);
                  fs.mkdirSync(path.dirname(subMainPath), { recursive: true });
                  fs.writeFileSync(subMainPath, code, "utf8");
                }

                // Run native local compiler
                const result = await compile({
                  texFile: mainPath,
                  cwd: tempDir,
                  returnBuffer: true
                });

                if (result.success && result.pdfBuffer) {
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({
                    success: true,
                    pdfBase64: result.pdfBuffer.toString("base64"),
                    log: result.stdout || result.stderr || "Compiled successfully"
                  }));
                } else {
                  const rawLog = `${result.stderr || ""}\n${result.stdout || ""}`.trim();
                  const parsedErrors = parseTectonicErrors(rawLog);

                  let formattedError = "";
                  if (parsedErrors.length > 0) {
                    formattedError = parsedErrors.map(e => {
                      const prefix = e.line ? `Line ${e.line}: ` : "";
                      const ctx = e.context ? ` [near: ${e.context}]` : "";
                      return `${prefix}${e.message}${ctx}`;
                    }).join("\n");
                  } else if (rawLog.includes("bundle isn't cached")) {
                    formattedError = "LaTeX resource bundle or package is not cached locally. Please ensure network is accessible on first use.";
                  } else if (result.failure?.message && result.failure.message !== "Tectonic exited with code 1.") {
                    formattedError = result.failure.message;
                  } else {
                    const cleanStderr = (result.stderr || "").split("\n")
                      .filter(l => !l.includes("RUST_BACKTRACE") && !l.includes("thread 'main' panicked"))
                      .join("\n").trim();
                    formattedError = cleanStderr || result.failure?.message || "LaTeX compilation failed";
                  }

                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({
                    success: false,
                    error: formattedError,
                    errors: parsedErrors,
                    log: rawLog || result.failure?.message || "Compilation failed"
                  }));
                }
              } finally {
                try {
                  fs.rmSync(tempDir, { recursive: true, force: true });
                } catch(e) {}
              }
            } catch (err) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), localLatexCompilerPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
