impl visit_expenses.enter with `root entry {
    visit [-->](`?expenses) else {
        logger.error("expenses | visit_expenses | Expenses Node Not Found! Please Initialize First!");
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expenses Node Not Found! Please Initialize First!"
        );
    }
}

impl add_expense.add_expense with expenses entry {
    expense_node = here ++> expense();
    logger.debug(f"expenses | add_expense | Adding Expense");
    visit expense_node[0];
}

impl add_expense.update_expense with expense entry {
    logger.debug(f"expenses | update_expense | Updating Expense: {here.expense_id}");
    here.amount = self.amount;
    here.category = self.category.value;
    here.date = self.date;
    here.description = self.description;
    here.created_at = datetime.now();
    here.updated_at = datetime.now();

    response = {
        "message": "Expense Added Successfully!",
        "expense": {
            "expense_id": here.expense_id,
            "amount": here.amount,
            "category": here.category,
            "date": here.date,
            "description": here.description,
            "created_at": here.created_at,
            "updated_at": here.updated_at
        }
    };
    report response;
}

impl list_expenses.go_to_expenses with expenses entry {
    expenses_nodes = [-->](`?expense);
    if (len(expenses_nodes) == 0) {
        logger.warning("expenses | list_expenses | No Expenses Found");
    } else {
        logger.debug(f"expenses | list_expenses | Found {len(expenses_nodes)} Expenses");
        sorted_expenses = sorted(
            expenses_nodes, 
            key=lambda x: expense : x.created_at, 
            reverse=True
        );
        paginated_expenses = sorted_expenses[self.skip:self.skip + self.limit];
        visit paginated_expenses;
    }
}

impl list_expenses.list_expenses with expense entry {
    expense_details = {
        "expense_id": here.expense_id,
        "amount": here.amount,
        "category": here.category,
        "date": here.date,
        "description": here.description,
        "created_at": here.created_at,
        "updated_at": here.updated_at
    };
    self.expenses_list.append(expense_details);
    report expense_details;
}
