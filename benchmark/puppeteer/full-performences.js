const puppeteer = require('puppeteer');
const fs = require('fs');

// Array dei framework da testare (dal tuo script)
const frameworks = [
  { name: 'Angular', url: 'http://localhost:4200' },
  { name: 'Next', url: 'http://localhost:3000' },
  { name: 'Svelte', url: 'http://localhost:4173' },
];

// Selettori CSS/XPath comuni basati sui tuoi file HTML/JS
const SELECTORS = {
  LOADING_TEXT: "xpath/ //div[contains(., 'LOADING...')]",
  SEARCH_INPUT: 'input[placeholder="SEARCH BY NAME OR NUMBER..."]',
  SEARCH_CLEAR_BUTTON: 'input[placeholder*="SEARCH"] + button', // Il bottone 'X' dopo l'input
  POKEMON_GRID: 'div.grid',
  FIRST_POKEMON_CARD: 'div.grid > button:first-child',
  FIRST_POKEMON_NAME_GRID: 'div.grid > button:first-child .text-sm.uppercase',
  DETAIL_BACK_BUTTON: "xpath/ //button[contains(., 'BACK')]",
  DETAIL_NAME_HEADER: 'h1.text-3xl',
  NO_RESULTS_TEXT: "xpath/ //div[contains(., 'NO POKÉMON FOUND')]",
};

/**
 * Funzione helper per misurare il tempo tra due performance mark.
 */
async function measurePerformance(page, measureName, startMark, endMark) {
  try {
    await page.evaluate((start, end, measure) => {
      performance.mark(end);
      performance.measure(measure, start, end);
    }, startMark, endMark, measureName);
    
    const measureData = await page.evaluate((name) => 
      JSON.stringify(performance.getEntriesByName(name)[0]), measureName
    );
    
    // Pulisce i mark per la prossima misurazione
    await page.evaluate((name, start, end) => {
        performance.clearMeasures(name);
        performance.clearMarks(start);
        performance.clearMarks(end);
    }, measureName, startMark, endMark);

    return JSON.parse(measureData).duration;
  } catch (e) {
    console.warn(`Attenzione: Misurazione ${measureName} fallita.`, e.message);
    return 0;
  }
}

/**
 * Esegue la suite di test per un singolo framework.
 */
async function runTestForFramework(browser, framework) {
  let page;
  try {
    console.log(`\n--- 🚀 Inizio test per: ${framework.name} (${framework.url}) ---`);
    page = await browser.newPage();
    
    // Abilita la raccolta di performance
    await page.evaluateOnNewDocument(() => {
      window.performanceMetrics = [];
    });

    // --- Test 1: Caricamento Iniziale ---
    await page.evaluate(() => performance.mark('load-start'));
    await page.goto(framework.url, { waitUntil: 'domcontentloaded' });
    
    // Attende la fine del caricamento e la comparsa della griglia
    await page.waitForSelector(SELECTORS.LOADING_TEXT, { visible: true, timeout: 5000 });
    await page.waitForSelector(SELECTORS.LOADING_TEXT, { hidden: true, timeout: 30000 });
    await page.waitForSelector(SELECTORS.SEARCH_INPUT, { visible: true });
    await page.waitForSelector(SELECTORS.POKEMON_GRID, { visible: true });
    
    const loadTime = await measurePerformance(page, 'initial-load', 'load-start', 'load-end');
    console.log(`✅ Tempo caricamento iniziale: ${loadTime.toFixed(2)}ms`);

    // --- Test 2: Ricerca per Nome ---
    const searchTerm = 'Pikachu';
    await page.evaluate(() => performance.mark('search-start'));
    
    await page.type(SELECTORS.SEARCH_INPUT, searchTerm);
    
    // Attende che la griglia si aggiorni (es. che ci sia un solo risultato)
    await page.waitForFunction(
      (gridSelector, nameSelector, term) => {
        const cards = document.querySelectorAll(gridSelector);
        if (cards.length === 1) {
          const name = cards[0].querySelector(nameSelector)?.textContent.trim();
          return name.toLowerCase() === term.toLowerCase();
        }
        return false;
      }, 
      { timeout: 5000 }, 
      SELECTORS.FIRST_POKEMON_CARD, 
      SELECTORS.FIRST_POKEMON_NAME_GRID, 
      searchTerm
    );

    const searchTime = await measurePerformance(page, 'search-filter', 'search-start', 'search-end');
    console.log(`✅ Tempo filtro ricerca (nome): ${searchTime.toFixed(2)}ms`);

    // --- Test 3: Pulizia Ricerca ---
    const clearButton = await page.$(SELECTORS.SEARCH_CLEAR_BUTTON);
    if (!clearButton) throw new Error("Bottone 'Clear' non trovato");

    await page.evaluate(() => performance.mark('clear-start'));
    await clearButton.click();

    // Attende che la griglia torni a più di 1 elemento
    await page.waitForFunction(
      (gridSelector) => document.querySelectorAll(gridSelector).length > 1,
      { timeout: 5000 },
      SELECTORS.FIRST_POKEMON_CARD
    );
    
    const clearTime = await measurePerformance(page, 'search-clear', 'clear-start', 'clear-end');
    console.log(`✅ Tempo pulizia ricerca: ${clearTime.toFixed(2)}ms`);
    
    // --- Test 4: Navigazione Pagina Dettaglio ---
    const firstPokemonName = await page.$eval(SELECTORS.FIRST_POKEMON_NAME_GRID, el => el.textContent.trim());
    const firstPokemonCard = await page.$(SELECTORS.FIRST_POKEMON_CARD);
    
    await page.evaluate(() => performance.mark('detail-nav-start'));
    await firstPokemonCard.click();

    // Attende la pagina di dettaglio
    await page.waitForSelector(SELECTORS.DETAIL_BACK_BUTTON, { visible: true });
    const detailName = await page.$eval(SELECTORS.DETAIL_NAME_HEADER, el => el.textContent.trim());

    const detailNavTime = await measurePerformance(page, 'detail-navigation', 'detail-nav-start', 'detail-nav-end');
    console.log(`✅ Tempo apertura dettaglio: ${detailNavTime.toFixed(2)}ms`);
    if (detailName.toLowerCase() === firstPokemonName.toLowerCase()) {
      console.log(`   -> Verifica nome: OK (${detailName})`);
    } else {
      console.warn(`   -> ⚠️ Verifica nome: FALLITA (Atteso: ${firstPokemonName}, Trovato: ${detailName})`);
    }

    // --- Test 5: Ritorno alla Lista ---
    const backButton = await page.waitForSelector(SELECTORS.DETAIL_BACK_BUTTON);
    
    await page.evaluate(() => performance.mark('back-nav-start'));
    await backButton.click();

    // Attende il ritorno alla pagina principale (griglia)
    await page.waitForSelector(SELECTORS.SEARCH_INPUT, { visible: true });
    await page.waitForSelector(SELECTORS.POKEMON_GRID, { visible: true });

    const backNavTime = await measurePerformance(page, 'back-navigation', 'back-nav-start', 'back-nav-end');
    console.log(`✅ Tempo ritorno alla lista: ${backNavTime.toFixed(2)}ms`);

    // --- Audit Lighthouse ---
    console.log(`\n📊 Avvio audit Lighthouse per ${framework.name}...`);
    const { default: lighthouse } = await import('lighthouse');
    const { lhr } = await lighthouse(framework.url, {
      port: new URL(browser.wsEndpoint()).port,
      output: 'json',
      onlyCategories: ['performance'],
      logLevel: 'info',
    });

    const performanceScore = lhr.categories.performance.score * 100;
    console.log(`📊 Lighthouse Performance Score: ${performanceScore.toFixed(0)}`);
    
    // Salva report
    const reportPath = `lighthouse-report-${framework.name.toLowerCase().replace(' ', '-')}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(lhr, null, 2));
    console.log(`   -> Report salvato in: ${reportPath}`);


  } catch (error) {
    console.error(`❌ Test fallito per ${framework.name}:`, error.message);
  } finally {
    if (page) {
      await page.close();
    }
    console.log(`--- ✅ Fine test per: ${framework.name} ---`);
  }
}


/**
 * Funzione Main per avviare i test.
 */
async function runAllTests() {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new", // "new" è il nuovo standard per headless
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--incognito']
    });

    for (const framework of frameworks) {
      // Usa un nuovo contesto "incognito" per ogni framework per evitare cache
      const context = await browser.createIncognitoBrowserContext();
      await runTestForFramework(context, framework);
      await context.close();
    }

  } catch (error) {
    console.error('Errore catastrofico durante l\'esecuzione dei test:', error);
  } finally {
    if (browser) {
      await browser.close();
      console.log("\n--- Browser chiuso. Tutti i test sono completati. ---");
    }
  }
}

runAllTests().catch(console.error);