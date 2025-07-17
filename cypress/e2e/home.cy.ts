describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays the main heading', () => {
    cy.contains('h1', 'Sapunoa').should('be.visible')
  })

  it('displays the feature cards', () => {
    cy.contains('検査結果をアップロード').should('be.visible')
    cy.contains('AIが分析').should('be.visible')
    cy.contains('最適なサプリをご提案').should('be.visible')
  })

  it('navigates to upload page when clicking start button', () => {
    cy.contains('今すぐ始める').click()
    cy.url().should('include', '/upload')
  })

  it('navigates to about page when clicking learn more', () => {
    cy.contains('詳しく見る').click()
    cy.url().should('include', '/about')
  })
})