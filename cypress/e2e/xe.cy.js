/// <reference types="cypress" />


Cypress.on('uncaught:exception', (err, runnable) => {
  // sadece belirli hatayı yoksay, bu siteye özgu react kaynaklı bir hata
  if (err.message.includes('Minified React error #418')) {
    return false
  }
})

describe('Home page tests for xe.com website', () => {
  beforeEach(() => {
    // Fetch isteklerini tamamen gizlemek için intercept
    cy.intercept('**', { log: false });

    cy.intercept('POST', 'https://api.amplitude.com/**', { statusCode: 204, log: false }).as('blockAmplitude');
    cy.intercept('POST', 'https://www.google-analytics.com/j/collect?**', { statusCode: 204, log: false }).as('blockGoogleAnalytics');
    cy.intercept('GET', 'https://www.googletagmanager.com/gtm.js?**', { statusCode: 204, log: false }).as('blockGTM');
    cy.intercept('POST', '**/collect?**', { statusCode: 204, log: false }).as('blockCollect');


    cy.viewport(1600, 900);
    cy.visit('/');
    cy.get('.lkKYXJ').click() // Accept cookies
    cy.url().should('include', 'xe.com')
  })


  it('Convertint money eur to usd', () => {
    let usdValue;

    // Changing-converting currency type
    cy.get('button[type="button"]').eq(0).click();
    // Type 100
    cy.get('#amount').clear().type('100');
    // Click to the convert button
    cy.get('.order-1').click();
    // Wait for the result
    cy.wait(3000);
    // Verify the result
    cy.get('p').eq(4).then(($el) => {
      usdValue = parseFloat(parseFloat($el.text().substring(0, 6)).toFixed(4));
    });
    cy.get('p').eq(5).then(($el) => {
      const eurUnitValue = parseFloat(parseFloat($el.text().substring(7, 14)).toFixed(4));
      expect(usdValue).to.be.closeTo(eurUnitValue * 100, 0.0001);
    });
  })


  it('Adding new curreny to live exchange table', () => {
    // locate the "add currency" button and click it
    cy.get('#pugsnax').click();
    // wait for the modal to appear
    cy.wait(2000);
    // choose TRY currency from the list
    cy.get('input').filter('[placeholder="Type to search..."]').eq(2).should('be.visible').type('TRY').wait(1000);
    cy.get('div.listbox-item-description').contains('TRY Turkish Lira').click();
    // check if the currency is added to the live exchange table
    cy.get('#dashboard-top-row').should('contain', 'Turkish Lira');
  })



  it('Changing page for business operations on mobie view', () => {
    // change the viewport to mobile size
    cy.viewport('iphone-x');
    // select the "Business" menu item
    cy.contains('button', 'Toggle menu').click();
    cy.contains('a', 'Business').click().wait(1000);
    // verify that the URL contains "/business/"
    cy.url().should('include', '/eu-business/');

  })



  /*
  // site didnt provide a valid API key, so this test is commented out
  
  it('APi testing', () => {
    cy.request({
      method: 'GET',
      url: 'https://xecdapi.xe.com/v1/convert_from',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': Cypress.env('XE_API_KEY')
      },
      qs: { 
        from: 'USD',
        to: 'CAD',
        amount: '1.34',
        obsolete: true,
        interval: 'minutely'
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      console.log(response.body);
    });
  })*/


  it('Sign-in with my account', () => {
    // Click on the Login
    cy.contains('a', 'Login').click();

    // Change the focus of cypress to the new url
    cy.origin('https://account.xe.com', () => {
      // type email and password
      cy.get('[data-testid="signin-email"]').type(Cypress.env('email')).wait(2000);
      cy.get('[data-testid="signin-password"]').type(Cypress.env('password')).wait(2000);
      // and click continue button
      cy.contains('button', 'Continue').click();

      // verify that the user is asked for 2FA code or captcha with iframe

      cy.get('body').then(($body) => {
        if ($body.find('iframe').length > 0) {
          // if there is an iframe, then it is a captcha
          cy.get('iframe[src*="hcaptcha"]').should('be.visible');
        } else {
          // if there is no iframe, then it is a 2FA code
          cy.url().should('include', '/2fa');;
        }

      });

    });
  });

  it('should get a valid quote for the "Send Money" flow and proceed to login', () => {
    // Click on the "Send Money" button on the header
    cy.contains('a', 'Send money').click();

    // Click on the "Compare exchange rates" button
    cy.contains('span', 'Compare exchange rates').click();

    // Type the amaount
    cy.get('#amount').clear().type('2500'); // 1000 EUR

    // From
    cy.get('input[placeholder="Type to search..."]').first().click().should('be.visible').type('NZD');
    cy.contains('New Zealand Dollar').click();
    cy.wait(1000);
    // To 

    cy.get('input[placeholder="Type to search..."]').last().click().should('be.visible').type('USD');
    cy.contains('USD US Dollar').click();
    cy.wait(1000);

    // Click on the "Send now" button
    cy.contains('span', 'Send now').click();

    // Verify that the user is redirected to the create an account page

    cy.origin('https://account.xe.com', () => {
      cy.url().should('include', '/signup');
      cy.get('h1', { timeout: 2000 }).should('contain', 'Create a Personal Account');
    })

  });

});



