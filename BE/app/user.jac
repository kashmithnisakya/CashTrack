import from nodes { expenses, incomes }
import from jac_cloud.jaseci.utils.logger { logger }

walker init_user {

    can init_user with `root entry {
        visit [-->](`?expenses) else {
            logger.debug("expenses | init_user | Initializing Expenses Node");
            here ++> expenses();
        }

        visit [-->](`?incomes) else {
            logger.debug("incomes | init_user | Initializing Incomes Node");
            here ++> incomes();
        }
    }
}