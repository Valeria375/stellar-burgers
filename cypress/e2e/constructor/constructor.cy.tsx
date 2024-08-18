describe('Страница конструктора бургера', () => {
  const testUrl = 'http://localhost:4000';
  const modalSelector = '[data-cy="modal"]';

  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json',
    }).as('getIngredients');
    cy.intercept('GET', 'api/auth/user', {
      fixture: 'user.json'
    });
    cy.intercept('POST', 'api/orders', { 
      fixture: 'order.json'
    }).as('postOrder');

    // подставляем моковые токены
    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken')
    );
    cy.setCookie('accessToken', 'test-accessToken');
    cy.viewport(1300, 800);
    cy.visit(testUrl);
  });

  afterEach(function () {
    // очистка хранлищ после выполнения теста 
    cy.clearLocalStorage();
    cy.clearCookies();
  });
  
  it('показывать прелоадер во время загрузки ингредиентов', () => {
    cy.visit(testUrl);
    cy.wait('@getIngredients');
    cy.get('main').should('contain', 'Соберите бургер');
    cy.get('h1').should('contain', 'Соберите бургер');
  });
  
  it('показывать ошибку при неудачном получении ингредиентов', () => {
    cy.visit(testUrl);
    cy.wait('@getIngredients');
  });

  it('тестировать добавление булок и начинок в конструктор', () => {
    cy.visit(testUrl);
    cy.wait('@getIngredients');
    // Добавление булки
    cy.get('[data-ing="ingredient-item-bun"]').contains('Добавить').click();
    cy.get('[data-cy="constructor-bun-1"]').should('exist');
    cy.get('[data-cy="constructor-bun-2"]').should('exist');

    // Добавление начинки
    cy.get('[data-ing="ingredient-item-main"]').contains('Добавить').click();
    cy.get('[data-cy="constructor-topping"]').should('exist');

    cy.get('[data-ing="ingredient-item-sauce"]').contains('Добавить').click();
    cy.get('[data-cy="constructor-topping"]').should('exist');
  });

  it('открывать и закрывать модальное окно ингредиента', () => {
    cy.visit(testUrl);
    cy.wait('@getIngredients');
          
    //Кликнуть на ингредиент для открытия модального окна
    cy.get('[data-cy="ingredient-item-1"]').click();
    cy.get(modalSelector).should('be.visible');
          
    // Закрыть модальное окно по клику на крестик
    cy.get('[data-cy="modal-close-btn"]').click();
    cy.get(modalSelector).should('not.exist');
  });

  it('закрывать модальное окно ингредиента по клику на оверлей', () => {
    cy.visit(testUrl);
    cy.wait('@getIngredients');
          
    //Кликнуть на ингредиент для открытия модального окна
    cy.get('[data-cy="ingredient-item-2"]').click();
    cy.get(modalSelector).should('be.visible');

    // Закрыть модальное окно по клику на оверлей
    cy.get('[data-cy="modal-overlay"]').click('topRight', { force: true });
    cy.get(modalSelector).should('not.exist');
  });

  it('создание заказа', () => {
    //собираем бургер
    cy.visit(testUrl);
    cy.wait('@getIngredients');
    cy.get('[data-ing="ingredient-item-bun"]').contains('Добавить').click();
    cy.get('[data-ing="ingredient-item-main"]').contains('Добавить').click();
    cy.get('[data-ing="ingredient-item-sauce"]').contains('Добавить').click();

    //Вызывается клик по кнопке «Оформить заказ».
    cy.get('[data-cy=order-summ] button').click();

    //Проверяется, что модальное окно открылось и номер заказа верный.
    cy.get(modalSelector).contains('44330').should('exist');

    //Закрывается модальное окно и проверяется успешность закрытия.
    cy.get('[data-cy="modal-close-btn"]').click();
    cy.get(modalSelector).should('not.exist');

    //Проверяется, что конструктор пуст.
    cy.get('[data-cy=constructor]')
      .contains('Ингредиент 1')
      .should('not.exist');
    cy.get('[data-cy=constructor]')
      .contains('Ингредиент 3')
      .should('not.exist');
    cy.get('[data-cy=constructor]')
      .contains('Ингредиент 4')
      .should('not.exist');
  });
});
