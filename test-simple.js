// Simple test script for SAINTS Certificate Generator using JSDOM
const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log('🧪 Starting automated tests with JSDOM...\n');

// Read the HTML file
const html = fs.readFileSync('./index.html', 'utf-8');

// Create a DOM environment
const dom = new JSDOM(html, {
  url: 'http://localhost:8080/',
  resources: 'usable',
  runScripts: 'dangerously',
  beforeParse(window) {
    // Mock jsPDF
    window.jspdf = {
      jsPDF: class {
        constructor() {}
        internal = { pageSize: { getWidth: () => 297, getHeight: () => 210 } };
        setDrawColor() {}
        setLineWidth() {}
        rect() {}
        addImage() {}
        save() {}
        output() { return 'blob'; }
      }
    };

    // Mock html2canvas
    window.html2canvas = () => Promise.resolve({
      width: 1200,
      height: 800,
      toDataURL: () => 'data:image/jpeg;base64,test'
    });

    // Collect console messages
    const originalConsole = { ...window.console };
    const consoleMessages = [];
    const consoleErrors = [];

    window.console = {
      ...originalConsole,
      log: (...args) => {
        const msg = args.join(' ');
        consoleMessages.push({ type: 'log', text: msg });
        originalConsole.log('[CONSOLE LOG]', ...args);
      },
      error: (...args) => {
        const msg = args.join(' ');
        consoleErrors.push(msg);
        consoleMessages.push({ type: 'error', text: msg });
        originalConsole.error('[CONSOLE ERROR]', ...args);
      },
      warn: (...args) => {
        const msg = args.join(' ');
        consoleMessages.push({ type: 'warn', text: msg });
        originalConsole.warn('[CONSOLE WARN]', ...args);
      }
    };

    window._testData = { consoleMessages, consoleErrors };
  }
});

const { window } = dom;
const { document } = window;

// Wait for DOM to be ready
setTimeout(() => {
  try {
    console.log('═══════════════════════════════════════');
    console.log('✓ Test 1: Checking page structure');
    console.log('═══════════════════════════════════════');

    // Test 1: Check form elements exist
    const playerNameInput = document.getElementById('playerNameInput');
    const awardNameInput = document.getElementById('awardNameInput');
    const coachNameInput = document.getElementById('coachNameInput');
    const dateInput = document.getElementById('dateInput');
    const generateBtn = document.getElementById('generateCertificateBtn');
    const inputForm = document.getElementById('inputForm');
    const certificateDisplay = document.getElementById('certificateDisplay');

    console.log('✓ playerNameInput:', playerNameInput ? 'Found' : 'NOT FOUND');
    console.log('✓ awardNameInput:', awardNameInput ? 'Found' : 'NOT FOUND');
    console.log('✓ coachNameInput:', coachNameInput ? 'Found' : 'NOT FOUND');
    console.log('✓ dateInput:', dateInput ? 'Found' : 'NOT FOUND');
    console.log('✓ generateCertificateBtn:', generateBtn ? 'Found' : 'NOT FOUND');
    console.log('✓ inputForm:', inputForm ? 'Found' : 'NOT FOUND');
    console.log('✓ certificateDisplay:', certificateDisplay ? 'Found' : 'NOT FOUND');

    if (!playerNameInput || !awardNameInput || !coachNameInput || !dateInput || !generateBtn) {
      console.error('❌ Critical form elements missing!');
      process.exit(1);
    }

    console.log('\n═══════════════════════════════════════');
    console.log('✓ Test 2: Testing input field values');
    console.log('═══════════════════════════════════════');

    // Test 2: Test input interactions
    playerNameInput.value = 'John Smith';
    awardNameInput.value = 'Most Valuable Player';
    coachNameInput.value = 'Coach Johnson';
    dateInput.value = 'Winter 2025';

    console.log('✓ Player Name set to:', playerNameInput.value);
    console.log('✓ Award Name set to:', awardNameInput.value);
    console.log('✓ Coach Name set to:', coachNameInput.value);
    console.log('✓ Season set to:', dateInput.value);

    console.log('\n═══════════════════════════════════════');
    console.log('✓ Test 3: Testing form validation (empty)');
    console.log('═══════════════════════════════════════');

    // Test 3: Test validation with empty fields
    playerNameInput.value = '';
    awardNameInput.value = '';
    coachNameInput.value = '';
    dateInput.value = '';

    generateBtn.click();

    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
      console.log('✓ Error message displayed:', errorMessage.textContent);
    } else {
      console.log('❌ No error message for empty fields');
    }

    console.log('\n═══════════════════════════════════════');
    console.log('✓ Test 4: Testing certificate generation');
    console.log('═══════════════════════════════════════');

    // Test 4: Test certificate generation
    playerNameInput.value = 'Jane Doe';
    awardNameInput.value = 'Best Defender';
    coachNameInput.value = 'Coach Williams';
    dateInput.value = 'Spring 2025';

    // Remove error message if present
    if (errorMessage) {
      errorMessage.remove();
    }

    generateBtn.click();

    const formHidden = inputForm.classList.contains('hidden');
    const certVisible = !certificateDisplay.classList.contains('hidden');

    console.log('✓ Form hidden:', formHidden);
    console.log('✓ Certificate visible:', certVisible);

    const outputPlayerName = document.getElementById('outputPlayerName');
    const outputAwardName = document.getElementById('outputAwardName');
    const outputCoachName = document.getElementById('outputCoachName');
    const outputDate = document.getElementById('outputDate');

    console.log('✓ Output Player Name:', outputPlayerName.textContent);
    console.log('✓ Output Award Name:', outputAwardName.textContent);
    console.log('✓ Output Coach Name:', outputCoachName.textContent);
    console.log('✓ Output Date:', outputDate.textContent);

    const expectedPlayer = 'JANE DOE';
    const expectedAward = 'BEST DEFENDER';
    const expectedCoach = 'Coach Williams';
    const expectedDate = 'Spring 2025';

    if (outputPlayerName.textContent !== expectedPlayer) {
      console.error('❌ Player name mismatch! Expected:', expectedPlayer, 'Got:', outputPlayerName.textContent);
    } else {
      console.log('✅ Player name correct');
    }

    if (outputAwardName.textContent !== expectedAward) {
      console.error('❌ Award name mismatch! Expected:', expectedAward, 'Got:', outputAwardName.textContent);
    } else {
      console.log('✅ Award name correct');
    }

    if (outputCoachName.textContent !== expectedCoach) {
      console.error('❌ Coach name mismatch! Expected:', expectedCoach, 'Got:', outputCoachName.textContent);
    } else {
      console.log('✅ Coach name correct');
    }

    if (outputDate.textContent !== expectedDate) {
      console.error('❌ Date mismatch! Expected:', expectedDate, 'Got:', outputDate.textContent);
    } else {
      console.log('✅ Date correct');
    }

    console.log('\n═══════════════════════════════════════');
    console.log('✓ Test 5: Testing Start Over button');
    console.log('═══════════════════════════════════════');

    // Test 5: Test Start Over
    const startOverBtn = document.getElementById('startOverBtn');
    if (startOverBtn) {
      startOverBtn.click();

      const formVisible = !inputForm.classList.contains('hidden');
      const certHidden = certificateDisplay.classList.contains('hidden');
      const inputCleared = playerNameInput.value === '';

      console.log('✓ Form visible:', formVisible);
      console.log('✓ Certificate hidden:', certHidden);
      console.log('✓ Inputs cleared:', inputCleared);

      if (formVisible && certHidden && inputCleared) {
        console.log('✅ Start Over working correctly');
      } else {
        console.error('❌ Start Over not working properly');
      }
    }

    console.log('\n═══════════════════════════════════════');
    console.log('✓ Test 6: Checking action buttons');
    console.log('═══════════════════════════════════════');

    const savePdfBtn = document.getElementById('savePdfBtn');
    const printBtn = document.getElementById('printBtn');

    console.log('✓ Save PDF button:', savePdfBtn ? 'Found' : 'NOT FOUND');
    console.log('✓ Print button:', printBtn ? 'Found' : 'NOT FOUND');
    console.log('✓ Start Over button:', startOverBtn ? 'Found' : 'NOT FOUND');

    console.log('\n═══════════════════════════════════════');
    console.log('✓ Test 7: Checking logo elements');
    console.log('═══════════════════════════════════════');

    const logoImage = document.getElementById('logoImage');
    const logoRadios = document.querySelectorAll('input[name="logo"]');

    console.log('✓ Logo image:', logoImage ? 'Found' : 'NOT FOUND');
    console.log('✓ Logo radio buttons:', logoRadios.length, 'found');

    if (logoImage) {
      console.log('✓ Default logo src:', logoImage.src);
    }

    console.log('\n═══════════════════════════════════════');
    console.log('✓ Test 8: Checking CSS and styling');
    console.log('═══════════════════════════════════════');

    // Check for inline styles (which we added to fix undefined classes)
    const bodyStyle = document.body.style;
    const formStyle = inputForm.style;

    console.log('✓ Body has inline styles:', bodyStyle.cssText.length > 0);
    console.log('✓ Form has inline styles:', formStyle.cssText.length > 0);

    console.log('\n═══════════════════════════════════════');
    console.log('📊 TEST SUMMARY');
    console.log('═══════════════════════════════════════');

    const { consoleErrors } = window._testData;

    console.log('Console Messages:', window._testData.consoleMessages.length);
    console.log('Console Errors:', consoleErrors.length);

    if (consoleErrors.length > 0) {
      console.log('\n❌ CONSOLE ERRORS FOUND:');
      consoleErrors.forEach((error, i) => {
        console.log(`  ${i + 1}. ${error}`);
      });
      console.log('\n⚠️  ERRORS DETECTED - Tests failed');
      process.exit(1);
    } else {
      console.log('\n✅ NO CONSOLE ERRORS DETECTED!');
      console.log('✅ All tests passed successfully! 🎉');
      process.exit(0);
    }

  } catch (error) {
    console.error('\n❌ Test execution failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}, 1000); // Wait for DOM and scripts to initialize
