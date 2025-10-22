// performance-test.js
const puppeteer = require('puppeteer');

const fs = require('fs');

const frameworks = [
  { name: 'Angular Zonejs', url: 'http://localhost:4201' },
  { name: 'Angular Zoneless', url: 'http://localhost:4202' }, // Esempio di un secondo URL
  { name: 'React', url: 'http://localhost:4174' }, // Esempio di un secondo URL
  { name: 'Svelte', url: 'http://localhost:4173' }, // Esempio di un secondo URL

];
const url = 'http://localhost:4201';
async function runPerformanceTest() {
  const {default: lighthouse} = await import('lighthouse');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Abilita metriche di performance
  await page.evaluateOnNewDocument(() => {
    window.performanceMetrics = [];
  });
  
  await page.goto(url, { waitUntil: 'networkidle0' });
  
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
  //await page.waitForTimeout(1000);
  await new Promise(resolve => setTimeout(resolve, 1000));

  
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
  const { lhr } = await lighthouse(url, {
    port: new URL(browser.wsEndpoint()).port,
    output: 'json',
    onlyCategories: ['performance'],
  });
  
  console.log('\n📊 Lighthouse Performance Score:', lhr.categories.performance.score * 100);
  
  // Salva report
  fs.writeFileSync('lighthouse-report.json', JSON.stringify(lhr, null, 2));
  
  await browser.close();
}

runPerformanceTest().catch(console.error);