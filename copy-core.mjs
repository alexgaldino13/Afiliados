import fs from "fs";
import path from "path";

const src = "D:\\PROJETOS\\Youtube\\_opensquad\\core";
const dst = "D:\\PROJETOS\\Afiliado\\_opensquad\\core";

function copyDir(s, d) {
  fs.mkdirSync(d, { recursive: true });
  let count = 0;
  for (const ent of fs.readdirSync(s, { withFileTypes: true })) {
    const sp = path.join(s, ent.name);
    const dp = path.join(d, ent.name);
    if (ent.isDirectory()) count += copyDir(sp, dp);
    else {
      fs.copyFileSync(sp, dp);
      count++;
    }
  }
  return count;
}

const total = copyDir(src, dst);
const runner = path.join(dst, "runner.pipeline.md");
const lines = fs.readFileSync(runner, "utf8").split(/\r?\n/).length;
console.log(JSON.stringify({ total, runnerLines: lines, gt500: lines > 500 }));
