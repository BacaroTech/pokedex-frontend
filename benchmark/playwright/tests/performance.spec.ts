import {
  expect,
  Page,
  test,
} from '@playwright/test';

// Definiamo i framework da testare in un array per rendere lo script scalabile
const frameworks = [

  // {
  //   name: 'Svelte',
  //   url: 'http://localhost:4173/table-test',
  // },
  // {
  //   name: 'SvelteDev',
  //   url: 'http://localhost:5173/table-test',
  // },
  // {
  //   name: 'React (Next.js)',
  //   url: 'http://localhost:3000/table-test',
  // },
  // {
  //   name: 'Angular',
  //   url: 'http://localhost:4200/table-test',
  // },

  {
    name: 'Angular Zonejs',
    url: 'http://localhost:4201/'
  },
  // {
  //   name: 'Angular Zoneless',
  //   url: 'http://localhost:4202/'
  // },
  {
    name: 'Svelte',
    url: 'http://localhost:5173/'
  },
  // {
  //   name: 'React',
  //   url: 'http://localhost:4174/'
  // }
];

// Il numero di righe che ci aspettiamo vengano create
const ROW_COUNT = 1000;

// Creiamo un ciclo per eseguire lo stesso test su ogni framework
for (const framework of frameworks) {

  test.describe(`TableFullActions Component Performance and Functionality. Framework: ${framework.name}`, () => {
    const componentUrl = framework.url;
    let page: Page;

    // Prima di ogni test, naviga alla pagina del componente
    test.beforeEach(async ({ browser }) => {
      page = await browser.newPage();
      await page.goto(componentUrl);
    });

    test.afterEach(async () => {
      await page.close();
    });

    test('dovrebbe visualizzare lo stato iniziale senza righe nella tabella', async () => {
      // Verifica che il titolo sia presente
      await expect(page.getByRole('heading', { name: /Performance Test/i })).toBeVisible();

      // Verifica che i pulsanti di azione siano visibili
      await expect(page.getByRole('button', { name: /Crea \d+ Righe/i })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Pulisci Tabella' })).toBeVisible();

      // Verifica che il corpo della tabella sia inizialmente vuoto
      await expect(page.locator('tbody tr')).toHaveCount(0);
    });

    // test('dovrebbe creare 1000 righe e misurare il tempo di rendering', async () => {
    //   const expectedRows = 1000;

    //   // Prepara un listener per catturare il messaggio specifico dalla console
    //   const consoleMessagePromise = new Promise<string>(resolve => {
    //     page.on('console', msg => {
    //       const text = msg.text();
    //       if (text.includes('Rendering Time')) {
    //         resolve(text);
    //       }
    //     });
    //   });

    //   // Clicca sul pulsante per creare le righe
    //   await page.getByRole('button', { name: `Crea ${expectedRows} Righe` }).click();

    //   // Attendi che il messaggio di console.timeEnd venga registrato
    //   const consoleMessage = await consoleMessagePromise;

    //   // Stampa il messaggio catturato per il debug (opzionale)
    //   console.log(`Messaggio di performance catturato: ${consoleMessage}`);

    //   // Verifica che il messaggio di performance sia stato loggato
    //   expect(consoleMessage).toContain('Rendering Time');

    //   // Verifica che il numero corretto di righe sia stato renderizzato nella tabella
    //   await expect(page.locator('tbody tr')).toHaveCount(expectedRows);

    //   // Verifica il contenuto della prima e dell'ultima riga per assicurarsi che i dati siano corretti
    //   const firstRow = page.locator('tbody tr').first();
    //   const lastRow = page.locator('tbody tr').last();

    //   await expect(firstRow.locator('td').first()).toHaveText('1');
    //   await expect(lastRow.locator('td').first()).toHaveText(String(expectedRows));
    // });


    test('dovrebbe scambiare le righe correttamente', async () => {
      const expectedRows = 1000;

      // Prepara un listener per catturare il messaggio specifico dalla console
      const consoleMessagePromise = new Promise<string>(resolve => {
        page.on('console', msg => {
          const text = msg.text();
          if (text.includes('Rendering Time')) {
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
      expect(consoleMessage).toContain('Rendering Time');

      // Verifica che il numero corretto di righe sia stato renderizzato nella tabella
      await expect(page.locator('tbody tr')).toHaveCount(expectedRows);

      // Verifica il contenuto della prima e dell'ultima riga per assicurarsi che i dati siano corretti
      const firstRow = page.locator('tbody tr').first();
      const secondRow = page.locator('tbody tr').nth(1);
      const lastRow = page.locator('tbody tr').last();
      const secondlastRow = page.locator('tbody tr').nth(expectedRows - 2);

      // Verifica i valori iniziali per sicurezza       
      await expect(firstRow.locator('td').first()).toHaveText('1');
      await expect(secondRow.locator('td').first()).toHaveText('2');
      await expect(lastRow.locator('td').first()).toHaveText(String(expectedRows));
      await expect(secondlastRow.locator('td').first()).toHaveText(String(expectedRows - 1));
      console.log(`Verifiche pre`);
      // Fase 3: Esegui lo scambio
 
      await page.getByRole('button', { name: 'Swap' }).click();
        console.log(`Click Button`);
      const consoleMessagePromiseScambio = new Promise<string>(resolve => {
        page.on('console', msg => {
          console.log("msg0", msg)
          const text = msg.text();
          if (text.includes('Swap Time')) {
            resolve(text);
          }
        });
      });
      // Attendi che il messaggio di console.timeEnd venga registrato
      const consoleMessageSwap = await consoleMessagePromiseScambio;
      console.log("consoleMessageSwap", consoleMessageSwap)

      // console.log(`Messaggio di performance catturato: ${consoleMessageSwap}`);
      // expect(consoleMessageSwap).toContain('Swap Time');
       await expect(page.locator('tbody tr')).toHaveCount(expectedRows);

      const firstRowLocatorAfterSwap = page.locator('tbody tr').first();
      const lastRowLocatorAfterSwap = page.locator('tbody tr').last();
      const secondRowLocatorAfterSwap = page.locator('tbody tr').nth(1);
      const secondToLastRowLocatorAfterSwap = page.locator('tbody tr').nth(expectedRows - 2);
      // Fase 4: Verifica che i valori siano stati scambiati
      // Playwright attende automaticamente che gli elementi si aggiornino
      await expect(firstRowLocatorAfterSwap.locator('td').first()).toHaveText(String(expectedRows));
      await expect(secondRowLocatorAfterSwap.locator('td').first()).toHaveText(String(expectedRows - 1));
      await expect(lastRowLocatorAfterSwap.locator('td').first()).toHaveText('1');      
      await expect(secondToLastRowLocatorAfterSwap.locator('td').first()).toHaveText('2');
    });
  });

}
