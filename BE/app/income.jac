import from nodes { incomes, income }
import from fastapi { HTTPException, status }
import from jac_cloud.jaseci.utils.logger { logger }
import from datetime { datetime }


walker visit_incomes {
    class __specs__ {
        has tags: list = ["Income APIs"];
        has summary: str = "Visit Incomes";
    }

    can enter with `root entry;
}

walker add_income(visit_incomes) {
    has amount: float;
    has date: datetime;
    has description: str;

    class __specs__ {
        has tags: list = ["Income APIs"];
        has summary: str = "Add Income";
    }

    can add_income with incomes entry;
    can update_income with income entry;
}

walker list_incomes(visit_incomes) {
    has skip: int = 0;
    has limit: int = 10;
    has incomes_list: list = [];

    class __specs__ {
        has tags: list = ["Income APIs"];
        has summary: str = "List Incomes";
        has response_model: type = list[dict];
    }

    can go_to_incomes with incomes entry;
    can list_incomes with income entry;
}

walker delete_income(visit_incomes) {
    has income_id: str;

    class __specs__ {
        has tags: list = ["Income APIs"];
        has summary: str = "Delete Income";
    }

    can delete_income with incomes entry;
}