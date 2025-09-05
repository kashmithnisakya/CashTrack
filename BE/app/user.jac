import from nodes { expenses }
import from jac_cloud.jaseci.utils.logger { logger }

walker init_user {

    can init_user with `root entry {
        visit [-->](`?expenses) else {
            logger.debug("expenses | init_user | Initializing Expenses Node");
            here ++> expenses();
        }
    }
}