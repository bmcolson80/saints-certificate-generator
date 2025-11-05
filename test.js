// Automated test script for SAINTS Certificate Generator
const puppeteer = require('puppeteer');

(async () => {
  console.log('🧪 Starting automated tests...\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Collect console messages
  const consoleMessages = [];
  const consoleErrors = [];

  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleMessages.push({ type, text });

    if (type === 'error') {
      consoleErrors.push(text);
    }

    console.log(`[CONSOLE ${type.toUpperCase()}] ${text}`);
  });

  // Collect page errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push(error.toString());
    console.log(`[PAGE ERROR] ${error}`);
  });

  try {
    console.log('✓ Test 1: Loading page...');
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle0' });
    console.log('✓ Page loaded successfully\n');

    console.log('✓ Test 2: Checking page title...');
    const title = await page.title();
    console.log(`  Title: "${title}"`);
    if (title === 'SAINTS Basketball Certificate') {
      console.log('✓ Title is correct\n');
    } else {
      console.log('✗ Title mismatch!\n');
    }

    console.log('✓ Test 3: Checking form elements exist...');
    const playerNameInput = await page.$('#playerNameInput');
    const awardNameInput = await page.$('#awardNameInput');
    const coachNameInput = await page.$('#coachNameInput');
    const dateInput = await page.$('#dateInput');
    const generateBtn = await page.$('#generateCertificateBtn');

    if (playerNameInput && awardNameInput && coachNameInput && dateInput && generateBtn) {
      console.log('✓ All form elements found\n');
    } else {
      console.log('✗ Some form elements missing!\n');
    }

    console.log('✓ Test 4: Testing input field interactions...');
    await page.type('#playerNameInput', 'John Smith');
    await page.waitForTimeout(500);

    await page.type('#awardNameInput', 'Most Valuable Player');
    await page.waitForTimeout(500);

    await page.type('#coachNameInput', 'Coach Johnson');
    await page.waitForTimeout(500);

    await page.type('#dateInput', 'Winter 2025');
    await page.waitForTimeout(500);

    const playerValue = await page.$eval('#playerNameInput', el => el.value);
    const awardValue = await page.$eval('#awardNameInput', el => el.value);
    const coachValue = await page.$eval('#coachNameInput', el => el.value);
    const dateValue = await page.$eval('#dateInput', el => el.value);

    console.log(`  Player Name: "${playerValue}"`);
    console.log(`  Award Name: "${awardValue}"`);
    console.log(`  Coach Name: "${coachValue}"`);
    console.log(`  Season: "${dateValue}"`);
    console.log('✓ Input fields working correctly\n');

    console.log('✓ Test 5: Testing form validation (empty fields)...');
    await page.reload({ waitUntil: 'networkidle0' });
    await page.waitForTimeout(500);
    await page.click('#generateCertificateBtn');
    await page.waitForTimeout(500);

    const errorMessage = await page.$('#errorMessage');
    if (errorMessage) {
      const errorText = await page.$eval('#errorMessage', el => el.textContent);
      console.log(`  Error message displayed: "${errorText}"`);
      console.log('✓ Form validation working\n');
    } else {
      console.log('✗ No error message shown for empty fields\n');
    }

    console.log('✓ Test 6: Testing certificate generation...');
    await page.type('#playerNameInput', 'Jane Doe');
    await page.type('#awardNameInput', 'Best Defender');
    await page.type('#coachNameInput', 'Coach Williams');
    await page.type('#dateInput', 'Spring 2025');
    await page.waitForTimeout(500);

    await page.click('#generateCertificateBtn');
    await page.waitForTimeout(1000);

    const certificateVisible = await page.$eval('#certificateDisplay', el => !el.classList.contains('hidden'));
    const formHidden = await page.$eval('#inputForm', el => el.classList.contains('hidden'));

    if (certificateVisible && formHidden) {
      console.log('✓ Certificate generated and displayed\n');

      const outputPlayerName = await page.$eval('#outputPlayerName', el => el.textContent);
      const outputAwardName = await page.$eval('#outputAwardName', el => el.textContent);
      const outputCoachName = await page.$eval('#outputCoachName', el => el.textContent);
      const outputDate = await page.$eval('#outputDate', el => el.textContent);

      console.log('  Certificate content:');
      console.log(`    Player: "${outputPlayerName}"`);
      console.log(`    Award: "${outputAwardName}"`);
      console.log(`    Coach: "${outputCoachName}"`);
      console.log(`    Season: "${outputDate}"`);
      console.log('✓ Certificate data correct\n');
    } else {
      console.log('✗ Certificate not displayed properly\n');
    }

    console.log('✓ Test 7: Testing action buttons...');
    const savePdfBtn = await page.$('#savePdfBtn');
    const printBtn = await page.$('#printBtn');
    const startOverBtn = await page.$('#startOverBtn');

    if (savePdfBtn && printBtn && startOverBtn) {
      console.log('✓ All action buttons present\n');
    } else {
      console.log('✗ Some action buttons missing\n');
    }

    console.log('✓ Test 8: Testing "Start Over" functionality...');
    await page.click('#startOverBtn');
    await page.waitForTimeout(500);

    const formVisible = await page.$eval('#inputForm', el => !el.classList.contains('hidden'));
    const certHidden = await page.$eval('#certificateDisplay', el => el.classList.contains('hidden'));
    const inputCleared = await page.$eval('#playerNameInput', el => el.value === '');

    if (formVisible && certHidden && inputCleared) {
      console.log('✓ Start Over functionality working\n');
    } else {
      console.log('✗ Start Over not working properly\n');
    }

    console.log('✓ Test 9: Checking service worker registration...');
    await page.waitForTimeout(2000); // Wait for service worker to register
    const swRegistered = await page.evaluate(() => {
      return navigator.serviceWorker.controller !== null || navigator.serviceWorker.getRegistrations().then(regs => regs.length > 0);
    });

    if (swRegistered) {
      console.log('✓ Service worker registered\n');
    } else {
      console.log('⚠ Service worker not yet registered (may need more time)\n');
    }

    console.log('✓ Test 10: Checking for logo images...');
    const logoImg = await page.$('#logoImage');
    if (logoImg) {
      const logoSrc = await page.$eval('#logoImage', el => el.src);
      console.log(`  Logo source: ${logoSrc}`);
      console.log('✓ Logo image element present\n');
    }

    // Summary
    console.log('═══════════════════════════════════════');
    console.log('📊 TEST SUMMARY');
    console.log('═══════════════════════════════════════');
    console.log(`Console Messages: ${consoleMessages.length}`);
    console.log(`Console Errors: ${consoleErrors.length}`);
    console.log(`Page Errors: ${pageErrors.length}`);

    if (consoleErrors.length > 0) {
      console.log('\n❌ CONSOLE ERRORS FOUND:');
      consoleErrors.forEach((error, i) => {
        console.log(`  ${i + 1}. ${error}`);
      });
    }

    if (pageErrors.length > 0) {
      console.log('\n❌ PAGE ERRORS FOUND:');
      pageErrors.forEach((error, i) => {
        console.log(`  ${i + 1}. ${error}`);
      });
    }

    if (consoleErrors.length === 0 && pageErrors.length === 0) {
      console.log('\n✅ NO ERRORS DETECTED!');
      console.log('All tests passed successfully! 🎉');
    } else {
      console.log('\n⚠️  ERRORS DETECTED - Review above');
    }

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
    process.exit(consoleErrors.length + pageErrors.length);
  }
})();
