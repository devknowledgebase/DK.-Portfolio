import fs from 'fs';

const stats = JSON.parse(fs.readFileSync('stats.html', 'utf8').match(/const\s+data\s*=\s*({.*?});/s)[1]);
const parts = stats.nodeParts || {};
const metas = stats.nodeMetas || {};

const results = [];
for (const meta of Object.values(metas)) {
  for (const [chunk, partUid] of Object.entries(meta.moduleParts || {})) {
    const part = parts[partUid];
    if (part) {
      results.push({
        id: meta.id,
        chunk,
        renderedLength: part.renderedLength,
        gzipLength: part.gzipLength,
      });
    }
  }
}

results.sort((a, b) => b.renderedLength - a.renderedLength);

console.log('--- TOP 25 LARGEST MODULES IN BUNDLE ---');
for (const r of results.slice(0, 25)) {
  const shortId = r.id.replace(/.*node_modules\//, 'node_modules/').replace(/.*portfolio\//, '');
  console.log(`${shortId.padEnd(60)} | ${r.chunk.padEnd(30)} | ${(r.renderedLength / 1024).toFixed(1)} KB (gzip: ${(r.gzipLength / 1024).toFixed(1)} KB)`);
}

console.log('\n--- MODULES IN index CHUNK ---');
const indexModules = results.filter(r => r.chunk.includes('index-'));
for (const r of indexModules.slice(0, 20)) {
  const shortId = r.id.replace(/.*node_modules\//, 'node_modules/').replace(/.*portfolio\//, '');
  console.log(`${shortId.padEnd(60)} | ${(r.renderedLength / 1024).toFixed(1)} KB (gzip: ${(r.gzipLength / 1024).toFixed(1)} KB)`);
}
