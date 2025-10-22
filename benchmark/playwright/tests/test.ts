import {
  expect,
  Page,
  test,
} from '@playwright/test';

// Assumiamo che il componente sia renderizzato alla radice dell'applicazione.
// Modifica l'URL se il componente si trova su una rotta specifica (es. '/performance-test').
const componentUrl = '/';

test.describe('TableFullActions Component Performance and Functionality', () => {
  let page: Page;

  // Prima di ogni test, naviga alla pagina del componente
  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(componentUrl);
  });

  // Dopo ogni test, chiudi la pagina
  test.afterEach(async () => {
    await page.close();
  });

  test('dovrebbe visualizzare lo stato iniziale senza righe nella tabella', async () => {
    // Verifica che il titolo sia presente
    await expect(page.getByRole('heading', { name: 'Angular (Zoneless + Signals) Performance Test' })).toBeVisible();

    // Verifica che i pulsanti di azione siano visibili
    await expect(page.getByRole('button', { name: /Crea \d+ Righe/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Pulisci Tabella' })).toBeVisible();

    // Verifica che il corpo della tabella sia inizialmente vuoto
    await expect(page.locator('tbody tr')).toHaveCount(0);
  });

  test('dovrebbe creare 1000 righe e misurare il tempo di rendering', async () => {
    const expectedRows = 1000;

    // Prepara un listener per catturare il messaggio specifico dalla console
    const consoleMessagePromise = new Promise<string>(resolve => {
      page.on('console', msg => {
        const text = msg.text();
        if (text.includes('Angular-Zoneless Rendering Time')) {
          resolve(text);
        }
      });
    });

    // Clicca sul pulsante per creare le righe
    await page.getByRole('button', { name: `Crea ${expectedRows} Righe` }).click();

    // Attendi che il messaggio di console.timeEnd venga registrato
    const consoleMessage = await consoleMessagePromise;

    // Stampa il messaggio catturato per il debug (opzionale)
    console.log(`Messaggio di performance catturato: ${consoleMessage}`);

    // Verifica che il messaggio di performance sia stato loggato
    expect(consoleMessage).toContain('Angular-Zoneless Rendering Time');

    // Verifica che il numero corretto di righe sia stato renderizzato nella tabella
    await expect(page.locator('tbody tr')).toHaveCount(expectedRows);

    // Verifica il contenuto della prima e dell'ultima riga per assicurarsi che i dati siano corretti
    const firstRow = page.locator('tbody tr').first();
    const lastRow = page.locator('tbody tr').last();

    await expect(firstRow.locator('td').first()).toHaveText('1');
    await expect(lastRow.locator('td').first()).toHaveText(String(expectedRows));
  });

  test('dovrebbe pulire la tabella dopo aver creato le righe', async () => {
    const expectedRows = 1000;

    // Fase 1: Crea le righe
    await page.getByRole('button', { name: `Crea ${expectedRows} Righe` }).click();

    // Attendi che le righe appaiano e verifica che siano state create
    await expect(page.locator('tbody tr')).toHaveCount(expectedRows);

    // Fase 2: Pulisci le righe
    await page.getByRole('button', { name: 'Pulisci Tabella' }).click();

    // Verifica che il corpo della tabella sia di nuovo vuoto
    await expect(page.locator('tbody tr')).toHaveCount(0);
  });
});