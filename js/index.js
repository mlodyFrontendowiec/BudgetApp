class Budget {
  constructor() {
    this.itemsRemoveClass = null;
    this.form = null;
    this.Uiselectors = {
      remove: "[data-remove]",
      send: "[data-send]",
      inputDescription: "[data-description]",
      inputValue: "[data-value]",
      sectionBudget: "section.budget__section",
      buttonAdd: "div.add__type",
      spanBudgetValue: "span.budget__value",
      listItemsBin: ".fa-trash",
    };
    this.state = {
      type: "add",
    };
    this.activeStatement = [];
  }
  initializeBudget() {
    this.itemsRemoveClass = document.querySelectorAll(this.Uiselectors.remove);
    this.form = document.querySelector(this.Uiselectors.send);
    this.descriptionInput = document.querySelector(
      this.Uiselectors.inputDescription
    );
    this.valueInput = document.querySelector(this.Uiselectors.inputValue);
    this.clicker = document.querySelector(this.Uiselectors.buttonAdd);
    this.sectionBudget = document.querySelector(this.Uiselectors.sectionBudget);
    this.addEventListeners();
  }
  addEventListeners() {
    this.clicker.addEventListener("click", () => this.toggleClassFunc());
    this.form.addEventListener("submit", (event) =>
      this.addObjectToStatement(event)
    );
  }
  toggleClassFunc() {
    this.itemsRemoveClass.forEach((item) => item.classList.toggle("remove"));
    this.state.type === "add"
      ? (this.state.type = "remove")
      : (this.state.type = "add");
  }
  addObjectToStatement(event) {
    event.preventDefault();
    this.obj = {
      value: Number(this.valueInput.value),
      description: this.descriptionInput.value,
      type: this.state.type,
      id: Math.floor(Math.random() * 10000000000),
    };
    this.activeStatement.push(this.obj);
    this.createList(this.obj);
    this.listItems = [...document.querySelectorAll(".fa-trash")];
    this.listItems.forEach((item) =>
      item.addEventListener("click", (e) => {
        const objects = this.activeStatement.filter(
          (item) => item.id != e.target.dataset.name
        );
        const deletedObject = this.activeStatement.filter(
          (item) => item.id == e.target.dataset.name
        );
        e.target.parentNode.parentNode.remove();
        this.activeStatement = [...objects];
        this.totalBudgetSpan = document.querySelector(
          this.Uiselectors.spanBudgetValue
        );
        this.budget = 0;
        this.setTotalBudget(this.activeStatement);
        this.setColor();
        this.totalBudgetSpan.innerHTML = `${this.budget}PLN`;
      })
    );
    this.totalBudgetSpan = document.querySelector(
      this.Uiselectors.spanBudgetValue
    );
    this.totalBudgetSpan.innerHTML = `${this.setTotalBudget(
      this.activeStatement
    )}PLN`;
    this.setColor();
    event.target.reset();
  }
  setColor() {
    if (this.budget >= 0) {
      this.totalBudgetSpan.style.color = "#21c43a";
    } else {
      this.totalBudgetSpan.style.color = "red";
    }
  }
  createList(obj) {
    if (this.state.type === "add") {
      if (!this.incomesUl) {
        this.createIncomeUl();
        this.createIncomeLi(obj);
      } else {
        this.createIncomeLi(obj);
      }
    } else if (this.state.type === "remove") {
      if (!this.expenseUl) {
        this.createExpenseUl();
        this.createExpenseLi(obj);
      } else {
        this.createExpenseLi(obj);
      }
    }
  }
  createIncomeUl() {
    const div = `<div class="incomes__wrapper"><h2>Incomes</h2><ul class='list__wrapper--incomes'></ul></div>`;
    this.sectionBudget.innerHTML += div;
    this.incomesUl = document.querySelector(".list__wrapper--incomes");
  }
  createExpenseUl() {
    const div = `<div class="expense__wrapper"><h2>Expense</h2><ul class='list__wrapper--expense'></ul></div>`;
    this.sectionBudget.innerHTML += div;
    this.expenseUl = document.querySelector(".list__wrapper--expense");
  }
  createIncomeLi({ description, value, id }) {
    const li = `<li class='budget__listItems--incomes' ><p>${description}</p><p> + ${value} PLN</p><span class='icon__wrapper'><i data-name="${id}" class="fas fa-trash"></i><i class="fas fa-pen" data-name="${id}"></i></span></li>`;
    this.incomesUl = document.querySelector(".list__wrapper--incomes");
    this.incomesUl.innerHTML += li;
    this.listItems = [...document.querySelectorAll(".fa-trash")];
    this.listItems.forEach((item) =>
      item.addEventListener("click", this.removeListItem)
    );
    this.changeItemValue();
  }
  createExpenseLi({ description, value, id }) {
    const li = `<li class='budget__listItems--expenses' ><p>${description}</p><p> - ${value} PLN</p><span class='icon__wrapper'><i data-name="${id}" class="fas fa-trash"></i><i data-name="${id}" class="fas fa-pen"></i></span></li>`;
    this.expenseUl = document.querySelector(".list__wrapper--expense");
    this.expenseUl.innerHTML += li;
    this.changeItemValue();
  }
  setTotalBudget(arr) {
    this.budgetTable = arr.map(({ type, value }) => {
      if (type === "add") {
        return value;
      } else {
        return Number("-" + value);
      }
    });
    arr.length
      ? (this.budget = this.budgetTable.reduce((a, b) => a + b))
      : (this.budget = 0);
    return this.budget;
  }
  changeItemValue() {
    this.pencilItems = [...document.querySelectorAll(".fa-pen")];
    this.pencilItems.forEach((item) =>
      item.addEventListener("click", (e) => {
        this.editItem = this.activeStatement.filter(
          (item) => item.id == e.target.dataset.name
        );
        const item = this.editItem.reduce((a) => a);
        this.descriptionInput.value = item.description;
        this.valueInput.value = item.value;
        this.newStatement = this.activeStatement.filter(
          (item) => item.id != e.target.dataset.name
        );
        this.activeStatement = [...this.newStatement];
        this.budget = 0;
        this.setTotalBudget(this.activeStatement);
        this.totalBudgetSpan.innerHTML = `${this.budget}PLN`;
        e.target.parentNode.parentNode.remove();
      })
    );
  }
}
const app = new Budget();
app.initializeBudget();
