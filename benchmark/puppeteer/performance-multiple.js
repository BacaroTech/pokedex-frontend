// performance-test.js
const puppeteer = require('puppeteer');

const fs = require('fs');

const frameworks = [
  { name: 'Angular Zonejs', url: 'http://localhost:4201' },
  { name: 'Angular Zoneless', url: 'http://localhost:4202' }, // Esempio di un secondo URL
  { name: 'React', url: 'http://localhost:4174' }, // Esempio di un secondo URL
  { name: 'Svelte', url: 'http://localhost:4173' }, // Esempio di un secondo URL

];

/**
 * Esegue i test di performance (creazione, swap, Lighthouse) per un singolo URL.
 */
async function runSingleTest(browser, lighthouse, framework) {
  const page = await browser.newPage();
  
  // Abilita metriche di performance
  await page.evaluateOnNewDocument(() => {
    window.performanceMetrics = [];
  });
  
  await page.goto(framework.url, { waitUntil: 'networkidle0' });
  
  // Test 1: Caricamento iniziale
  const createButton = await page.$('#create');
  
  await page.evaluate(() => {
    performance.mark('create-start');
  });
  
  await createButton.click();
  
  // Aspetta che la tabella sia renderizzata
  await page.waitForSelector('tbody tr', { timeout: 30000 });
  
  const createTime = await page.evaluate(() => {
    performance.mark('create-end');
    performance.measure('create-rows', 'create-start', 'create-end');
    const measure = performance.getEntriesByName('create-rows')[0];
    return measure.duration;
  });
  
  console.log(`✅ Tempo creazione righe: ${createTime.toFixed(2)}ms`);
  
  // Test 2: Swap
  await new Promise(resolve => setTimeout(resolve, 1000)); // Attesa
  
  const swapButton = await page.$('#swap');
  
  await page.evaluate(() => {
    performance.mark('swap-start');
  });
  
  await swapButton.click();
  
  const swapTime = await page.evaluate(() => {
    performance.mark('swap-end');
    performance.measure('swap-rows', 'swap-start', 'swap-end');
    const measure = performance.getEntriesByName('swap-rows')[0];
    return measure.duration;
  });
  
  console.log(`✅ Tempo swap: ${swapTime.toFixed(2)}ms`);
  
  // Lighthouse audit
  const { lhr } = await lighthouse(framework.url, {
    port: new URL(browser.wsEndpoint()).port,
    output: 'json',
    onlyCategories: ['performance'],
  });
  
  const lighthouseScore = lhr.categories.performance.score * 100;
  console.log(`📊 Lighthouse Performance Score: ${lighthouseScore}`);
  
  // Salva report con nome univoco
  const reportPath = `lighthouse-report-${framework.name}.json`;
  fs.writeFileSync(reportPath, JSON.stringify(lhr, null, 2));
  console.log(`Report salvato in: ${reportPath}`);
  
  await page.close(); // Chiudi la pagina, non il browser
  
  return {
    name: framework.name,
    createTime: createTime,
    swapTime: swapTime,
    lighthouseScore: lighthouseScore
  };
}

/**
 * Funzione principale che orchestra l'esecuzione dei test su tutti i framework.
 */
async function runAllTests() {
  const { default: lighthouse } = await import('lighthouse');
  
  // 2. Avvia il browser UNA SOLA VOLTA
  const browser = await puppeteer.launch({
    headless: false, // O 'true' per eseguire in background
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const allResults = [];

  // 3. Cicla su ogni framework e esegui il test
  for (const framework of frameworks) {
    console.log(`\n--- 🚀 Inizio test per: ${framework.name} (${framework.url}) ---`);
    try {
      const results = await runSingleTest(browser, lighthouse, framework);
      allResults.push(results);
      console.log(`--- ✅ Test completato per: ${framework.name} ---`);
    } catch (error) {
      console.error(`--- ❌ Errore durante il test di ${framework.name}: ${error.message} ---`);
    }
  }

  // 4. Chiudi il browser ALLA FINE
  await browser.close();

  // 5. Stampa un riepilogo
  console.log('\n\n--- 🏆 Riepilogo Completo 🏆 ---');
  console.table(allResults.map(r => ({
    Framework: r.name,
    'Creazione (ms)': r.createTime.toFixed(2),
    'Swap (ms)': r.swapTime.toFixed(2),
    'Lighthouse Score': r.lighthouseScore.toFixed(0)
  })));
  
  // Salva un riepilogo JSON
  fs.writeFileSync('performance-summary.json', JSON.stringify(allResults, null, 2));
  console.log('\nRiepilogo finale salvato in performance-summary.json');
}

// Avvia l'intera suite di test
runAllTests().catch(console.error);