/**
 * Test di Performance Puppeteer + Lighthouse
 * Confronto tra Angular Zoneless (Signals) vs Angular ZoneJS
 * 
 * Focus: operazione di SWAP complessa (scambio prime 10 righe con ultime 10)
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;

// Configurazione
const CONFIG = {
  zonelessUrl: 'http://localhost:4200', // URL app Angular Zoneless + Signals
  zonejsUrl: 'http://localhost:4201',   // URL app Angular ZoneJS tradizionale
  rows: 1000,
  cols: 20,
  iterations: 5, // Numero di iterazioni per ottenere media
  lighthouseConfig: {
    extends: 'lighthouse:default',
    settings: {
      onlyCategories: ['performance'],
      throttlingMethod: 'simulate',
      throttling: {
        rttMs: 40,
        throughputKbps: 10240,
        cpuSlowdownMultiplier: 1
      }
    }
  }
};

/**
 * Misura i tempi di rendering dell'append async con Puppeteer
 */
async function measureAppendAsyncPerformance(url, testName) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const results = [];

  try {
    console.log(`\n🧪 Testing ${testName} - Append Async...`);
    await page.goto(url, { waitUntil: 'networkidle2' });

    for (let i = 0; i < CONFIG.iterations; i++) {
      console.log(`  Iteration ${i + 1}/${CONFIG.iterations}`);

      // 1. Crea le righe iniziali (1000)
      await page.click('#create');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 2. Misura l'APPEND ASYNC (aggiunge altre 1000 righe interlacciate)
      const appendMetrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          performance.clearMarks();
          performance.clearMeasures();

          performance.mark('append-start');

          // Triggera l'append async
          document.querySelector('#apidata').click();

          // Aspetta che il setTimeout interno completi e il rendering avvenga
          setTimeout(() => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                performance.mark('append-end');
                performance.measure('append-operation', 'append-start', 'append-end');

                const measure = performance.getEntriesByName('append-operation')[0];
                
                resolve({
                  appendDuration: measure.duration
                });
              });
            });
          }, 100); // Tempo per l'operazione asincrona + rendering
        });
      });

      // 3. Misura le metriche del DOM dopo l'append
      const domMetrics = await page.evaluate(() => {
        const table = document.querySelector('table tbody');
        const rows = table ? table.querySelectorAll('tr') : [];
        
        return {
          totalRows: rows.length,
          domNodes: document.querySelectorAll('*').length,
          tableSize: table ? table.offsetHeight : 0
        };
      });

      const performanceMetrics = await page.metrics();

      results.push({
        iteration: i + 1,
        appendMetrics,
        domMetrics,
        performanceMetrics
      });

      // Pulisci per la prossima iterazione
      await page.evaluate(() => {
        const clearBtn = Array.from(document.querySelectorAll('button'))
          .find(btn => btn.textContent.includes('Pulisci'));
        if (clearBtn) clearBtn.click();
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

  } catch (error) {
    console.error(`❌ Error in ${testName}:`, error);
  } finally {
    await browser.close();
  }

  return results;
}

/**
 * Misura i tempi di rendering dello swap con Puppeteer
 */
async function measureSwapPerformance(url, testName) {
  const browser = await puppeteer.launch({
    headless: false, // Metti true per headless
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const results = [];

  try {
    console.log(`\n🧪 Testing ${testName}...`);
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Abilita le metriche di performance
    await page.evaluateOnNewDocument(() => {
      window.performanceMetrics = [];
    });

    for (let i = 0; i < CONFIG.iterations; i++) {
      console.log(`  Iteration ${i + 1}/${CONFIG.iterations}`);

      // 1. Crea le righe iniziali
      await page.click('#create');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Attendi il rendering

      // 2. Misura lo SWAP
      const swapMetrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          // Pulisci le metriche precedenti
          performance.clearMarks();
          performance.clearMeasures();

          // Marca l'inizio
          performance.mark('swap-start');

          // Triggera lo swap
          document.querySelector('#swap').click();

          // Usa requestAnimationFrame per catturare il rendering
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              performance.mark('swap-end');
              performance.measure('swap-operation', 'swap-start', 'swap-end');

              const measure = performance.getEntriesByName('swap-operation')[0];
              
              // Cattura anche le metriche di paint
              const paintEntries = performance.getEntriesByType('paint');
              const firstPaint = paintEntries.find(e => e.name === 'first-paint');
              const firstContentfulPaint = paintEntries.find(e => e.name === 'first-contentful-paint');

              resolve({
                swapDuration: measure.duration,
                firstPaint: firstPaint ? firstPaint.startTime : null,
                firstContentfulPaint: firstContentfulPaint ? firstContentfulPaint.startTime : null
              });
            });
          });
        });
      });

      // 3. Cattura i tempi dalla console (console.time)
      const consoleLogs = [];
      page.on('console', msg => {
        const text = msg.text();
        if (text.includes('Swap Time') || text.includes('Rendering Time')) {
          consoleLogs.push(text);
        }
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      // 4. Misura le metriche del DOM
      const domMetrics = await page.evaluate(() => {
        const table = document.querySelector('table tbody');
        const rows = table ? table.querySelectorAll('tr') : [];
        
        return {
          totalRows: rows.length,
          domNodes: document.querySelectorAll('*').length,
          tableSize: table ? table.offsetHeight : 0
        };
      });

      // 5. Cattura Performance Observer metriche
      const performanceMetrics = await page.metrics();

      results.push({
        iteration: i + 1,
        swapMetrics,
        domMetrics,
        performanceMetrics,
        consoleLogs
      });

      // Pulisci per la prossima iterazione
      await page.evaluate(() => {
        const clearBtn = Array.from(document.querySelectorAll('button'))
          .find(btn => btn.textContent.includes('Pulisci'));
        if (clearBtn) clearBtn.click();
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

  } catch (error) {
    console.error(`❌ Error in ${testName}:`, error);
  } finally {
    await browser.close();
  }

  return results;
}

/**
 * Esegue Lighthouse audit
 */
async function runLighthouseAudit(url, testName) {
  console.log(`\n🔦 Running Lighthouse for ${testName}...`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // Import dinamico di Lighthouse (ESM)
    const { default: lighthouse } = await import('lighthouse');
    
    const { port } = new URL(browser.wsEndpoint());
    
    // Esegui Lighthouse
    const runnerResult = await lighthouse(url, {
      port: port,
      output: 'json',
      logLevel: 'error'
    }, CONFIG.lighthouseConfig);

    const reportJson = runnerResult.lhr;

    return {
      performanceScore: reportJson.categories.performance.score * 100,
      metrics: {
        firstContentfulPaint: reportJson.audits['first-contentful-paint'].numericValue,
        speedIndex: reportJson.audits['speed-index'].numericValue,
        largestContentfulPaint: reportJson.audits['largest-contentful-paint'].numericValue,
        timeToInteractive: reportJson.audits['interactive'].numericValue,
        totalBlockingTime: reportJson.audits['total-blocking-time'].numericValue,
        cumulativeLayoutShift: reportJson.audits['cumulative-layout-shift'].numericValue
      }
    };
  } finally {
    await browser.close();
  }
}

/**
 * Calcola statistiche aggregate
 */
function calculateStats(results, metricType = 'swap') {
  const durations = results.map(r => 
    metricType === 'swap' ? r.swapMetrics.swapDuration : r.appendMetrics.appendDuration
  );
  const domNodeCounts = results.map(r => r.domMetrics.domNodes);
  const totalRows = results.map(r => r.domMetrics.totalRows);
  
  const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
  const min = arr => Math.min(...arr);
  const max = arr => Math.max(...arr);
  const median = arr => {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  };

  return {
    duration: {
      avg: avg(durations).toFixed(2),
      min: min(durations).toFixed(2),
      max: max(durations).toFixed(2),
      median: median(durations).toFixed(2)
    },
    domNodes: {
      avg: avg(domNodeCounts).toFixed(0),
      min: min(domNodeCounts),
      max: max(domNodeCounts)
    },
    totalRows: {
      avg: avg(totalRows).toFixed(0),
      min: min(totalRows),
      max: max(totalRows)
    }
  };
}

/**
 * Genera report comparativo
 */
function generateReport(zonelessSwap, zonejsSwap, zonelessAppend, zonejsAppend, zonelessLH, zonejsLH) {
  const zonelessSwapStats = calculateStats(zonelessSwap, 'swap');
  const zonejsSwapStats = calculateStats(zonejsSwap, 'swap');
  const zonelessAppendStats = calculateStats(zonelessAppend, 'append');
  const zonejsAppendStats = calculateStats(zonejsAppend, 'append');

  const swapImprovement = (
    ((parseFloat(zonejsSwapStats.duration.avg) - parseFloat(zonelessSwapStats.duration.avg)) 
    / parseFloat(zonejsSwapStats.duration.avg)) * 100
  ).toFixed(2);

  const appendImprovement = (
    ((parseFloat(zonejsAppendStats.duration.avg) - parseFloat(zonelessAppendStats.duration.avg)) 
    / parseFloat(zonejsAppendStats.duration.avg)) * 100
  ).toFixed(2);

  return {
    timestamp: new Date().toISOString(),
    configuration: CONFIG,
    results: {
      zoneless: {
        swap: {
          puppeteer: zonelessSwapStats,
          rawData: zonelessSwap
        },
        append: {
          puppeteer: zonelessAppendStats,
          rawData: zonelessAppend
        },
        lighthouse: zonelessLH
      },
      zonejs: {
        swap: {
          puppeteer: zonejsSwapStats,
          rawData: zonejsSwap
        },
        append: {
          puppeteer: zonejsAppendStats,
          rawData: zonejsAppend
        },
        lighthouse: zonejsLH
      }
    },
    comparison: {
      swap: {
        improvement: `${swapImprovement}%`,
        winner: swapImprovement > 0 ? 'Zoneless (Signals)' : 'ZoneJS'
      },
      append: {
        improvement: `${appendImprovement}%`,
        winner: appendImprovement > 0 ? 'Zoneless (Signals)' : 'ZoneJS'
      },
      lighthouseScoreDiff: (zonelessLH.performanceScore - zonejsLH.performanceScore).toFixed(2)
    }
  };
}

/**
 * Formatta output per console
 */
function printReport(report) {
  console.log('\n' + '='.repeat(80));
  console.log('📊 PERFORMANCE TEST RESULTS');
  console.log('='.repeat(80));
  
  console.log('\n🔵 ANGULAR ZONELESS (SIGNALS)');
  console.log('  📌 Swap Duration:');
  console.log(`    Average: ${report.results.zoneless.swap.puppeteer.duration.avg}ms`);
  console.log(`    Median:  ${report.results.zoneless.swap.puppeteer.duration.median}ms`);
  console.log(`    Min:     ${report.results.zoneless.swap.puppeteer.duration.min}ms`);
  console.log(`    Max:     ${report.results.zoneless.swap.puppeteer.duration.max}ms`);
  
  console.log('  📌 Append Async Duration (1000→2000 rows interleaved):');
  console.log(`    Average: ${report.results.zoneless.append.puppeteer.duration.avg}ms`);
  console.log(`    Median:  ${report.results.zoneless.append.puppeteer.duration.median}ms`);
  console.log(`    Min:     ${report.results.zoneless.append.puppeteer.duration.min}ms`);
  console.log(`    Max:     ${report.results.zoneless.append.puppeteer.duration.max}ms`);
  console.log(`    Final Rows: ${report.results.zoneless.append.puppeteer.totalRows.avg}`);
  
  console.log(`  🔦 Lighthouse Score: ${report.results.zoneless.lighthouse.performanceScore.toFixed(0)}/100`);
  console.log(`  FCP: ${report.results.zoneless.lighthouse.metrics.firstContentfulPaint.toFixed(0)}ms`);
  console.log(`  LCP: ${report.results.zoneless.lighthouse.metrics.largestContentfulPaint.toFixed(0)}ms`);
  
  console.log('\n🟠 ANGULAR ZONEJS (TRADITIONAL)');
  console.log('  📌 Swap Duration:');
  console.log(`    Average: ${report.results.zonejs.swap.puppeteer.duration.avg}ms`);
  console.log(`    Median:  ${report.results.zonejs.swap.puppeteer.duration.median}ms`);
  console.log(`    Min:     ${report.results.zonejs.swap.puppeteer.duration.min}ms`);
  console.log(`    Max:     ${report.results.zonejs.swap.puppeteer.duration.max}ms`);
  
  console.log('  📌 Append Async Duration (1000→2000 rows interleaved):');
  console.log(`    Average: ${report.results.zonejs.append.puppeteer.duration.avg}ms`);
  console.log(`    Median:  ${report.results.zonejs.append.puppeteer.duration.median}ms`);
  console.log(`    Min:     ${report.results.zonejs.append.puppeteer.duration.min}ms`);
  console.log(`    Max:     ${report.results.zonejs.append.puppeteer.duration.max}ms`);
  console.log(`    Final Rows: ${report.results.zonejs.append.puppeteer.totalRows.avg}`);
  
  console.log(`  🔦 Lighthouse Score: ${report.results.zonejs.lighthouse.performanceScore.toFixed(0)}/100`);
  console.log(`  FCP: ${report.results.zonejs.lighthouse.metrics.firstContentfulPaint.toFixed(0)}ms`);
  console.log(`  LCP: ${report.results.zonejs.lighthouse.metrics.largestContentfulPaint.toFixed(0)}ms`);
  
  console.log('\n🏆 COMPARISON');
  console.log(`  Swap Winner: ${report.comparison.swap.winner}`);
  console.log(`  Swap Performance Improvement: ${report.comparison.swap.improvement}`);
  console.log(`  Append Winner: ${report.comparison.append.winner}`);
  console.log(`  Append Performance Improvement: ${report.comparison.append.improvement}`);
  console.log(`  Lighthouse Score Difference: ${report.comparison.lighthouseScoreDiff} points`);
  
  console.log('\n' + '='.repeat(80));
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🚀 Starting Performance Comparison Test...');
    console.log(`   Configuration: ${CONFIG.rows} rows x ${CONFIG.cols} cols`);
    console.log(`   Iterations: ${CONFIG.iterations}`);
    console.log(`   Tests: Swap + Append Async\n`);

    // Test Zoneless (Signals) - SWAP
    const zonelessSwap = await measureSwapPerformance(
      CONFIG.zonelessUrl, 
      'Angular Zoneless (Signals) - Swap'
    );
    
    // Test Zoneless (Signals) - APPEND
    const zonelessAppend = await measureAppendAsyncPerformance(
      CONFIG.zonelessUrl, 
      'Angular Zoneless (Signals) - Append'
    );
    
    const zonelessLH = await runLighthouseAudit(
      CONFIG.zonelessUrl, 
      'Angular Zoneless (Signals)'
    );

    // Test ZoneJS - SWAP
    const zonejsSwap = await measureSwapPerformance(
      CONFIG.zonejsUrl, 
      'Angular ZoneJS (Traditional) - Swap'
    );
    
    // Test ZoneJS - APPEND
    const zonejsAppend = await measureAppendAsyncPerformance(
      CONFIG.zonejsUrl, 
      'Angular ZoneJS (Traditional) - Append'
    );
    
    const zonejsLH = await runLighthouseAudit(
      CONFIG.zonejsUrl, 
      'Angular ZoneJS (Traditional)'
    );

    // Genera e stampa report
    const report = generateReport(
      zonelessSwap, 
      zonejsSwap, 
      zonelessAppend, 
      zonejsAppend, 
      zonelessLH, 
      zonejsLH
    );
    printReport(report);

    // Salva report JSON
    await fs.writeFile(
      'performance-report.json',
      JSON.stringify(report, null, 2)
    );
    console.log('\n✅ Report saved to performance-report.json');

    // Genera HTML report
    await generateHTMLReport(report);
    console.log('✅ HTML report saved to performance-report.html');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

/**
 * Genera report HTML visuale
 */
async function generateHTMLReport(report) {
  const html = `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Performance Report - Angular Zoneless vs ZoneJS</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 30px;
    }
    .card {
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    .winner {
      background: #4ade80;
      color: white;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .chart-container {
      position: relative;
      height: 350px;
      margin: 20px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background: #f8f9fa;
      font-weight: 600;
    }
    .zoneless { color: #3b82f6; font-weight: bold; }
    .zonejs { color: #f97316; font-weight: bold; }
    .improvement { color: #10b981; font-weight: bold; }
    @media (max-width: 768px) {
      .grid-2 {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>⚡ Performance Comparison Report</h1>
    <p>Angular Zoneless (Signals) vs Angular ZoneJS</p>
    <p>Tests: Swap Operation + Append Async (Interleaved)</p>
    <p>${report.configuration.rows} rows × ${report.configuration.cols} cols | ${report.configuration.iterations} iterations</p>
    <p>Date: ${new Date(report.timestamp).toLocaleString('it-IT')}</p>
  </div>

  <div class="grid-2">
    <div class="winner">
      🏆 Swap Winner<br>
      ${report.comparison.swap.winner}
      <br>
      <small style="font-size: 16px; font-weight: normal;">
        Improvement: ${report.comparison.swap.improvement}
      </small>
    </div>
    
    <div class="winner" style="background: #06b6d4;">
      🚀 Append Winner<br>
      ${report.comparison.append.winner}
      <br>
      <small style="font-size: 16px; font-weight: normal;">
        Improvement: ${report.comparison.append.improvement}
      </small>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <h2>🔄 Swap Operation Duration</h2>
      <div class="chart-container">
        <canvas id="swapChart"></canvas>
      </div>
    </div>

    <div class="card">
      <h2>➕ Append Async Duration (1000→2000 rows)</h2>
      <div class="chart-container">
        <canvas id="appendChart"></canvas>
      </div>
    </div>
  </div>

  <div class="card">
    <h2>🔦 Lighthouse Metrics</h2>
    <div class="chart-container">
      <canvas id="lighthouseChart"></canvas>
    </div>
  </div>

  <div class="card">
    <h2>📈 Detailed Comparison</h2>
    <h3 style="margin-top: 20px;">🔄 Swap Operation</h3>
    <table>
      <tr>
        <th>Metric</th>
        <th class="zoneless">Zoneless (Signals)</th>
        <th class="zonejs">ZoneJS</th>
        <th>Improvement</th>
      </tr>
      <tr>
        <td>Swap Duration (avg)</td>
        <td class="zoneless">${report.results.zoneless.swap.puppeteer.duration.avg}ms</td>
        <td class="zonejs">${report.results.zonejs.swap.puppeteer.duration.avg}ms</td>
        <td class="improvement">${report.comparison.swap.improvement}</td>
      </tr>
      <tr>
        <td>Swap Duration (median)</td>
        <td class="zoneless">${report.results.zoneless.swap.puppeteer.duration.median}ms</td>
        <td class="zonejs">${report.results.zonejs.swap.puppeteer.duration.median}ms</td>
        <td>-</td>
      </tr>
      <tr>
        <td>Swap Duration (min)</td>
        <td class="zoneless">${report.results.zoneless.swap.puppeteer.duration.min}ms</td>
        <td class="zonejs">${report.results.zonejs.swap.puppeteer.duration.min}ms</td>
        <td>-</td>
      </tr>
      <tr>
        <td>Swap Duration (max)</td>
        <td class="zoneless">${report.results.zoneless.swap.puppeteer.duration.max}ms</td>
        <td class="zonejs">${report.results.zonejs.swap.puppeteer.duration.max}ms</td>
        <td>-</td>
      </tr>
    </table>

    <h3 style="margin-top: 30px;">➕ Append Async Operation</h3>
    <table>
      <tr>
        <th>Metric</th>
        <th class="zoneless">Zoneless (Signals)</th>
        <th class="zonejs">ZoneJS</th>
        <th>Improvement</th>
      </tr>
      <tr>
        <td>Append Duration (avg)</td>
        <td class="zoneless">${report.results.zoneless.append.puppeteer.duration.avg}ms</td>
        <td class="zonejs">${report.results.zonejs.append.puppeteer.duration.avg}ms</td>
        <td class="improvement">${report.comparison.append.improvement}</td>
      </tr>
      <tr>
        <td>Append Duration (median)</td>
        <td class="zoneless">${report.results.zoneless.append.puppeteer.duration.median}ms</td>
        <td class="zonejs">${report.results.zonejs.append.puppeteer.duration.median}ms</td>
        <td>-</td>
      </tr>
      <tr>
        <td>Final Rows After Append</td>
        <td class="zoneless">${report.results.zoneless.append.puppeteer.totalRows.avg}</td>
        <td class="zonejs">${report.results.zonejs.append.puppeteer.totalRows.avg}</td>
        <td>-</td>
      </tr>
      <tr>
        <td>DOM Nodes (avg)</td>
        <td class="zoneless">${report.results.zoneless.append.puppeteer.domNodes.avg}</td>
        <td class="zonejs">${report.results.zonejs.append.puppeteer.domNodes.avg}</td>
        <td>-</td>
      </tr>
    </table>

    <h3 style="margin-top: 30px;">🔦 Lighthouse Metrics</h3>
    <table>
      <tr>
        <th>Metric</th>
        <th class="zoneless">Zoneless (Signals)</th>
        <th class="zonejs">ZoneJS</th>
        <th>Difference</th>
      </tr>
      <tr>
        <td>Performance Score</td>
        <td class="zoneless">${report.results.zoneless.lighthouse.performanceScore.toFixed(0)}/100</td>
        <td class="zonejs">${report.results.zonejs.lighthouse.performanceScore.toFixed(0)}/100</td>
        <td class="improvement">${report.comparison.lighthouseScoreDiff} pts</td>
      </tr>
      <tr>
        <td>First Contentful Paint</td>
        <td class="zoneless">${report.results.zoneless.lighthouse.metrics.firstContentfulPaint.toFixed(0)}ms</td>
        <td class="zonejs">${report.results.zonejs.lighthouse.metrics.firstContentfulPaint.toFixed(0)}ms</td>
        <td>${(report.results.zonejs.lighthouse.metrics.firstContentfulPaint - report.results.zoneless.lighthouse.metrics.firstContentfulPaint).toFixed(0)}ms</td>
      </tr>
      <tr>
        <td>Largest Contentful Paint</td>
        <td class="zoneless">${report.results.zoneless.lighthouse.metrics.largestContentfulPaint.toFixed(0)}ms</td>
        <td class="zonejs">${report.results.zonejs.lighthouse.metrics.largestContentfulPaint.toFixed(0)}ms</td>
        <td>${(report.results.zonejs.lighthouse.metrics.largestContentfulPaint - report.results.zoneless.lighthouse.metrics.largestContentfulPaint).toFixed(0)}ms</td>
      </tr>
      <tr>
        <td>Total Blocking Time</td>
        <td class="zoneless">${report.results.zoneless.lighthouse.metrics.totalBlockingTime.toFixed(0)}ms</td>
        <td class="zonejs">${report.results.zonejs.lighthouse.metrics.totalBlockingTime.toFixed(0)}ms</td>
        <td>${(report.results.zonejs.lighthouse.metrics.totalBlockingTime - report.results.zoneless.lighthouse.metrics.totalBlockingTime).toFixed(0)}ms</td>
      </tr>
    </table>
  </div>

  <script>
    // Swap Duration Chart
    new Chart(document.getElementById('swapChart'), {
      type: 'bar',
      data: {
        labels: ['Average', 'Median', 'Min', 'Max'],
        datasets: [{
          label: 'Zoneless (Signals)',
          data: [
            ${report.results.zoneless.swap.puppeteer.duration.avg},
            ${report.results.zoneless.swap.puppeteer.duration.median},
            ${report.results.zoneless.swap.puppeteer.duration.min},
            ${report.results.zoneless.swap.puppeteer.duration.max}
          ],
          backgroundColor: 'rgba(59, 130, 246, 0.8)'
        }, {
          label: 'ZoneJS',
          data: [
            ${report.results.zonejs.swap.puppeteer.duration.avg},
            ${report.results.zonejs.swap.puppeteer.duration.median},
            ${report.results.zonejs.swap.puppeteer.duration.min},
            ${report.results.zonejs.swap.puppeteer.duration.max}
          ],
          backgroundColor: 'rgba(249, 115, 22, 0.8)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Swap Duration (ms) - Lower is Better'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Duration (ms)'
            }
          }
        }
      }
    });

    // Append Duration Chart
    new Chart(document.getElementById('appendChart'), {
      type: 'bar',
      data: {
        labels: ['Average', 'Median', 'Min', 'Max'],
        datasets: [{
          label: 'Zoneless (Signals)',
          data: [
            ${report.results.zoneless.append.puppeteer.duration.avg},
            ${report.results.zoneless.append.puppeteer.duration.median},
            ${report.results.zoneless.append.puppeteer.duration.min},
            ${report.results.zoneless.append.puppeteer.duration.max}
          ],
          backgroundColor: 'rgba(6, 182, 212, 0.8)'
        }, {
          label: 'ZoneJS',
          data: [
            ${report.results.zonejs.append.puppeteer.duration.avg},
            ${report.results.zonejs.append.puppeteer.duration.median},
            ${report.results.zonejs.append.puppeteer.duration.min},
            ${report.results.zonejs.append.puppeteer.duration.max}
          ],
          backgroundColor: 'rgba(251, 146, 60, 0.8)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Append Async Duration (ms) - Lower is Better'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Duration (ms)'
            }
          }
        }
      }
    });

    // Lighthouse Chart
    new Chart(document.getElementById('lighthouseChart'), {
      type: 'radar',
      data: {
        labels: ['Performance Score', 'FCP', 'LCP', 'Speed Index', 'TBT'],
        datasets: [{
          label: 'Zoneless (Signals)',
          data: [
            ${report.results.zoneless.lighthouse.performanceScore},
            ${100 - (report.results.zoneless.lighthouse.metrics.firstContentfulPaint / 30)},
            ${100 - (report.results.zoneless.lighthouse.metrics.largestContentfulPaint / 40)},
            ${100 - (report.results.zoneless.lighthouse.metrics.speedIndex / 50)},
            ${100 - (report.results.zoneless.lighthouse.metrics.totalBlockingTime / 5)}
          ],
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.2)'
        }, {
          label: 'ZoneJS',
          data: [
            ${report.results.zonejs.lighthouse.performanceScore},
            ${100 - (report.results.zonejs.lighthouse.metrics.firstContentfulPaint / 30)},
            ${100 - (report.results.zonejs.lighthouse.metrics.largestContentfulPaint / 40)},
            ${100 - (report.results.zonejs.lighthouse.metrics.speedIndex / 50)},
            ${100 - (report.results.zonejs.lighthouse.metrics.totalBlockingTime / 5)}
          ],
          borderColor: 'rgba(249, 115, 22, 1)',
          backgroundColor: 'rgba(249, 115, 22, 0.2)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Lighthouse Metrics Comparison (Normalized)'
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  </script>
</body>
</html>
  `;

  await fs.writeFile('performance-report.html', html);
}

// Run the tests
main();