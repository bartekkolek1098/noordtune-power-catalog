import assert from "node:assert/strict";
import {existsSync, readdirSync, readFileSync} from "node:fs";
import {dirname, join, relative, resolve} from "node:path";
import ts from "typescript";

const sourceRoot = resolve("src");
const canonical = resolve("src/data/catalog.ts");
const runtime = resolve("src/lib/rdw-tuning-estimate.ts");
function sourceFiles(directory: string): string[] {
  return readdirSync(directory,{withFileTypes:true}).flatMap(entry => entry.isDirectory()
    ? sourceFiles(join(directory,entry.name)) : /\.tsx?$/.test(entry.name) ? [join(directory,entry.name)] : []);
}
function resolveModule(file: string, specifier: string) {
  const target = specifier.startsWith("@/") ? resolve(sourceRoot,specifier.slice(2))
    : specifier.startsWith(".") ? resolve(dirname(file),specifier) : undefined;
  return target && [target,`${target}.ts`,`${target}.tsx`,join(target,"index.ts"),join(target,"index.tsx")].find(candidate => existsSync(candidate) && /\.tsx?$/.test(candidate));
}
function valueImports(file: string) {
  const ast = ts.createSourceFile(file,readFileSync(file,"utf8"),ts.ScriptTarget.Latest,true);
  const specifiers: string[] = [];
  function visit(node: ts.Node) {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const clause = node.importClause;
      const onlyNamedTypes = clause?.namedBindings && ts.isNamedImports(clause.namedBindings)
        && !clause.name && clause.namedBindings.elements.every(item => item.isTypeOnly);
      if (!clause?.isTypeOnly && !onlyNamedTypes) specifiers.push(node.moduleSpecifier.text);
    } else if (ts.isExportDeclaration(node) && !node.isTypeOnly && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      const onlyTypes = node.exportClause && ts.isNamedExports(node.exportClause) && node.exportClause.elements.every(item => item.isTypeOnly);
      if (!onlyTypes) specifiers.push(node.moduleSpecifier.text);
    } else if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword || ts.isIdentifier(node.expression) && node.expression.text === "require") && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) {
      specifiers.push(node.arguments[0].text);
    }
    ts.forEachChild(node,visit);
  }
  visit(ast);
  return specifiers.flatMap(specifier => {const target=resolveModule(file,specifier);return target ? [target] : [];});
}
const graph = new Map(sourceFiles(sourceRoot).map(file => [file,valueImports(file)]));
const clients = [...graph.keys()].filter(file => /^\s*["']use client["'];/.test(readFileSync(file,"utf8")));
const leaks: string[][] = [];
for (const client of clients) {
  const visited = new Set<string>();
  function follow(file: string, chain: string[]) {
    if (visited.has(file)) return;
    visited.add(file);
    if (file === canonical || file === runtime) {leaks.push([...chain,file].map(path=>relative(process.cwd(),path)));return;}
    for (const dependency of graph.get(file) ?? []) follow(dependency,[...chain,file]);
  }
  follow(client,[]);
}
assert.deepEqual(leaks,[],"Value imports from any client component must never reach the canonical catalog/runtime resolver");
console.log(`CLIENT_IMPORTS_SERVER_CATALOG: ${leaks.length}; ${clients.length} client roots checked transitively through ${graph.size} source modules (type-only imports excluded).`);
