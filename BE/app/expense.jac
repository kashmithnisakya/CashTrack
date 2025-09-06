import from nodes { expense, expenses }
import from fastapi { HTTPException, status }
import from jac_cloud.jaseci.utils.logger { logger }
import from datetime { datetime }

enum ExpenseCategory {
    FOOD = "Food",
    TRANSPORT = "Transportation",
    ENTERTAINMENT = "Entertainment",
    SHOPPING = "Shopping",
    BILLS = "Bills",
    HEALTHCARE = "Healthcare",
    EDUCATION = "Education",
    OTHER = "Other"
}

walker visit_expenses {
    class __specs__ {
        has tags: list = ["Expense APIs"];
        has summary: str = "Visit Expenses";
    }

    can enter with `root entry;
}

walker add_expense(visit_expenses) {
    has amount: float;
    has category: ExpenseCategory;
    has date: datetime;
    has description: str;

    class __specs__ {
        has tags: list = ["Expense APIs"];
        has summary: str = "Add Expense";
    }

    can add_expense with expenses entry;
    can update_expense with expense entry;
}

walker list_expenses(visit_expenses) {
    has skip: int = 0;
    has limit: int = 10;
    has expenses_list: list = [];

    class __specs__ {
        has tags: list = ["Expense APIs"];
        has summary: str = "List Expenses";
        has response_model: type = list[dict];
    }

    can go_to_expenses with expenses entry;
    can list_expenses with expense entry;
}