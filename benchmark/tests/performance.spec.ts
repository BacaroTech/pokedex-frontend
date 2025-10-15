import {
  expect,
  test,
} from '@playwright/test';

// Definiamo i framework da testare in un array per rendere lo script scalabile
const frameworks = [
    
  {
    name: 'Svelte',
    url: 'http://localhost:4173/table-test',
  },
  {
    name: 'SvelteDev',
    url: 'http://localhost:5173/table-test',
  },
  // {
  //   name: 'React (Next.js)',
  //   url: 'http://localhost:3000/table-test',
  // },
  // {
  //   name: 'Angular',
  //   url: 'http://localhost:4200/table-test',
  // },

];

// Il numero di righe che ci aspettiamo vengano create
const ROW_COUNT = 1000;

// Creiamo un ciclo per eseguire lo stesso test su ogni framework
for (const framework of frameworks) {

  // Definiamo un test suite per ogni framework
  test.describe(`Performance Test: ${framework.name}`, () => {
    
    test('should measure table rendering time', async ({ page }) => {
      // 1. Creiamo una Promise che si risolverà quando riceveremo 
      //    il log 'console.timeEnd' dal browser.
      const performancePromise = new Promise<number>((resolve) => {
        page.on('console', async (msg) => {
          const text = msg.text();
          // Cerchiamo il messaggio specifico che contiene il tempo di rendering
          if (text.includes('Rendering Time:')) {
            // Estraiamo il valore numerico del tempo (es. "123.45ms" -> 123.45)
            const time = parseFloat(text.split(':')[1]);
            resolve(time);
          }
        });
      });

      // 2. Navighiamo alla pagina di test del framework
      await page.goto(framework.url);

      // 3. Troviamo il pulsante per creare le righe e ci clicchiamo.
      //    Usiamo un selettore che si basa sul testo per essere più robusti.
      const createButton = page.locator(`button:has-text("Crea ${ROW_COUNT} Righe")`);
      await createButton.click();
      
      // 4. Attendiamo che la Promise si risolva, ottenendo il tempo di rendering
      const renderingTime = await performancePromise;

      // 5. Stampiamo il risultato nel terminale per un report chiaro
      console.log(`[${framework.name}] Rendering Time: ${renderingTime.toFixed(2)} ms`);

      // 6. Aggiungiamo un'asserzione per validare il test:
      //    Ci assicuriamo che la tabella abbia effettivamente il numero di righe atteso.
      const tableRows = page.locator('tbody tr');
      await expect(tableRows).toHaveCount(ROW_COUNT);

      // E che il tempo misurato sia un numero valido
      expect(renderingTime).toBeGreaterThan(0);
    });

  });
}
