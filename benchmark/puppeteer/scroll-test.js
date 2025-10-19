import fs
  from 'fs'; // We'll use the Node.js file system module to save our report
import { startFlow } from 'lighthouse';
// Import the necessary libraries
import puppeteer from 'puppeteer';
import {setTimeout} from "node:timers/promises";

// The URL of the page you want to test
const TEST_URL = 'http://localhost:4173/'; // ⚠️ Change this to your app's URL!

/**
 * Main function to run the performance test
 */
async function runScrollTest() {
    console.log('🚀 Starting performance test...');

    // 1. Launch a new headless browser instance with Puppeteer
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // 2. Start a Lighthouse User Flow
    const flow = await startFlow(page, { name: 'Virtualized Table Scroll' });

    // --- Start of the User Flow Steps ---

    // STEP 1: Navigate to the page (This is the "cold load" part)
    console.log(`Navigating to ${TEST_URL}...`);
    await flow.navigate(TEST_URL, {
        stepName: 'Initial Page Load',
    });
    console.log('✅ Navigation complete.');

    console.log('Wait virtual scroll container');
    await page.waitForSelector('#virtual-scroll-container');

    // STEP 2: Measure the scroll interaction
    console.log('Starting scroll measurement...');
    await flow.startTimespan({ stepName: 'Scroll to bottom of the table' });


    const scrollPageToBottom = async () => {
        const newHeight = await page.evaluate(() => {
            const scrollableElement = document.querySelector('#virtual-scroll-container');
            if (!scrollableElement) return -1; // Elemento non trovato

            // Scrolla l'elemento fino in fondo
            scrollableElement.scrollTo(0, scrollableElement.scrollHeight);

            // Ritorna la sua altezza totale
            return scrollableElement.scrollHeight;
        });

        console.log("in newheight", newHeight)
        //await page.waitForTimeout(1000); // Adjust timeout as needed
        return newHeight;
        
    };


    let previousHeight = 0;
    let countScroll = 0;

    while (countScroll < 4) {
        await scrollPageToBottom();
        const newHeight = await page.evaluate(() => {
            const scrollableElement = document.querySelector('#virtual-scroll-container');
             if (!scrollableElement) return -1; // Elemento non trovato
             return scrollableElement.scrollHeight;
        });
        console.log("newheight", newHeight)

        previousHeight = newHeight;
        countScroll++;
    }


    await flow.endTimespan();
    console.log('✅ Scroll measurement complete.');

    // --- End of the User Flow Steps ---

    // 3. Generate the Lighthouse report for the entire flow
    console.log('Generating report...');
    const report = await flow.generateReport();

    // 4. Save the report to an HTML file
    const reportPath = 'flow-report.html';
    fs.writeFileSync(reportPath, report);
    console.log(`\n🎉 Report saved to ${reportPath}`);
    console.log('Open it in your browser to see the results.');

    // 5. Close the browser
    await browser.close();
}

// Run the main function and catch any errors
runScrollTest().catch(console.error);