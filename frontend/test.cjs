const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:5173/register');
    await page.type('#reg-name', 'Anshu');
    await page.type('#reg-email', 'anshu@test.com');
    await page.type('#reg-password', 'password');
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('requestfailed', request => {
        console.log('REQ FAILED:', request.url(), request.failure().errorText);
    });
    
    // override alert so it doesn't block
    page.on('dialog', async dialog => {
        console.log('DIALOG:', dialog.message());
        await dialog.accept();
    });

    await page.click('button[type="submit"]');
    
    // wait a bit for network requests
    await new Promise(r => setTimeout(r, 2000));
    console.log('Registration complete.');
    await browser.close();
})();
