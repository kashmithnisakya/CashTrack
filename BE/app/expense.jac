import from nodes { expense, expenses }
import from fastapi { HTTPException, status }
import from jac_cloud.jaseci.utils.logger { logger }
import from datetime { datetime }

walker visit_expenses {
    class __specs__ {
        has tags: list = ["Expense APIs"];
        has summary: str = "Visit Expenses";
    }

    can enter with `root entry;
}

walker add_expense(visit_expenses) {
    has amount: float;
    has category: str;
    has date: datetime;
    has description: str;

    class __specs__ {
        has tags: list = ["Expense APIs"];
        has summary: str = "Add Expense";
    }

    can add_expense with expenses entry;
    can update_expense with expense entry;
}