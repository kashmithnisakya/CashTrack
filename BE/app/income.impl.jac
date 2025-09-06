impl visit_incomes.enter with `root entry {
    visit [-->](`?incomes) else {
        logger.error("incomes | visit_incomes | Incomes Node Not Found! Please Initialize First!");
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Incomes Node Not Found! Please Initialize First!"
        );
    }
}

impl add_income.add_income with incomes entry {
    income_node = here ++> income();
    logger.debug(f"incomes | add_income | Adding Income");
    visit income_node[0];
}

impl add_income.update_income with income entry {
    logger.debug(f"incomes | update_income | Updating Income: {here.income_id}");
    here.amount = self.amount;
    here.date = self.date;
    here.description = self.description;
    here.created_at = datetime.now();
    here.updated_at = datetime.now();

    response = {
        "message": "Income Added Successfully!",
        "income": {
            "income_id": here.income_id,
            "amount": here.amount,
            "date": here.date,
            "description": here.description,
            "created_at": here.created_at,
            "updated_at": here.updated_at
        }
    };
    report response;
}

impl list_incomes.go_to_incomes with incomes entry {
    incomes_nodes = [-->](`?income);
    if (len(incomes_nodes) == 0) {
        logger.warning("incomes | list_incomes | No Incomes Found");
    } else {
        logger.debug(f"incomes | list_incomes | Found {len(incomes_nodes)} Incomes");
        sorted_incomes = sorted(
            incomes_nodes, 
            key=lambda x: income : x.created_at, 
            reverse=True
        );
        paginated_incomes = sorted_incomes[self.skip:self.skip + self.limit];
        visit paginated_incomes;
    }
}

impl list_incomes.list_incomes with income entry {
    income_details = {
        "income_id": here.income_id,
        "amount": here.amount,
        "date": here.date,
        "description": here.description,
        "created_at": here.created_at,
        "updated_at": here.updated_at
    };
    self.incomes_list.append(income_details);
    report income_details;
}