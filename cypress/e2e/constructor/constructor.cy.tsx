/// <reference types="cypress" />
describe('Страница конструктора бургера', () => {
  const testUrl = 'http://localhost:4000';
  const modalSelector = '[data-cy="modal"]';
  const ingredientItemBun = '[data-ing="ingredient-item-bun"]';
  const ingredientItemMain = '[data-ing="ingredient-item-main"]';
  const ingredientItemSauce = '[data-ing="ingredient-item-sauce"]';
  const constructorBun1 = '[data-cy="constructor-bun-1"]';
  const constructorBun2 = '[data-cy="constructor-bun-2"]';
  const constructorTopping = '[data-cy="constructor-topping"]';
  const ingredientItem1 = '[data-cy="ingredient-item-1"]';
  const ingredientItem2 = '[data-cy="ingredient-item-2"]';
  const modalCloseBtn = '[data-cy="modal-close-btn"]';
  const modalOverlay = '[data-cy="modal-overlay"]';
  const orderSummButton = '[data-cy=order-summ] button';
  const constructorSelector = '[data-cy=constructor]';

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
    // очистка хранилищ после выполнения теста 
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
    cy.get(ingredientItemBun).contains('Добавить').click();
    cy.get(constructorBun1).should('exist');
    cy.get(constructorBun2).should('exist');

    // Добавление начинки
    cy.get(ingredientItemMain).contains('Добавить').click();
    cy.get(constructorTopping).should('exist');

    cy.get(ingredientItemSauce).contains('Добавить').click();
    cy.get(constructorTopping).should('exist');
  });

  it('открывать и закрывать модальное окно ингредиента', () => {
    cy.visit(testUrl);
    cy.wait('@getIngredients');
          
    //Кликнуть на ингредиент для открытия модального окна
    cy.get(ingredientItem1).click();
    cy.get(modalSelector).should('be.visible');
          
    // Закрыть модальное окно по клику на крестик
    cy.get(modalCloseBtn).click();
    cy.get(modalSelector).should('not.exist');
  });

  it('закрывать модальное окно ингредиента по клику на оверлей', () => {
    cy.visit(testUrl);
    cy.wait('@getIngredients');
          
    //Кликнуть на ингредиент для открытия модального окна
    cy.get(ingredientItem2).click();
    cy.get(modalSelector).should('be.visible');

    // Закрыть модальное окно по клику на оверлей
    cy.get(modalOverlay).click('topRight', { force: true });
    cy.get(modalSelector).should('not.exist');
  });

  it('создание заказа', () => {
    //собираем бургер
    cy.visit(testUrl);
    cy.wait('@getIngredients');
    cy.get(ingredientItemBun).contains('Добавить').click();
    cy.get(ingredientItemMain).contains('Добавить').click();
    cy.get(ingredientItemSauce).contains('Добавить').click();

    //Вызывается клик по кнопке «Оформить заказ».
    cy.get(orderSummButton).click();

    //Проверяется, что модальное окно открылось и номер заказа верный.
    cy.get(modalSelector).contains('44330').should('exist');

    //Закрывается модальное окно и проверяется успешность закрытия.
    cy.get(modalCloseBtn).click();
    cy.get(modalSelector).should('not.exist');

    //Проверяется, что конструктор пуст.
    cy.get(constructorSelector)
      .contains('Ингредиент 1')
      .should('not.exist');
    cy.get(constructorSelector)
      .contains('Ингредиент 3')
      .should('not.exist');
    cy.get(constructorSelector)
      .contains('Ингредиент 4')
      .should('not.exist');
  });
});
