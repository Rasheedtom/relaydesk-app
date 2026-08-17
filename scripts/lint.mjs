import fs from "node:fs";import path from "node:path";
const root=new URL("../src/",import.meta.url);let failures=[];
function walk(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,ent.name);if(ent.isDirectory())walk(p);else if(/\.(js|jsx)$/.test(ent.name)){const text=fs.readFileSync(p,"utf8");if(/console\.(log|debug)\(/.test(text))failures.push(`${p}: debug console call`);if(/dangerouslySetInnerHTML/.test(text))failures.push(`${p}: unsafe HTML API`);if(/\bvar\s/.test(text))failures.push(`${p}: var declaration`)}}}
walk(root.pathname);if(failures.length){console.error(failures.join("\n"));process.exit(1)}console.log("Source hygiene checks passed.");
