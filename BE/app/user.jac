import from nodes { expenses, incomes, profile }
import from jac_cloud.jaseci.utils.logger { logger }
import from jaseci_sdk { get_current_user }

walker init_user {

    can init_user with `root entry {
        visit [-->](`?expenses) else {
            logger.debug("user | init_user | Initializing Expenses Node");
            here ++> expenses();
        }

        visit [-->](`?incomes) else {
            logger.debug("user | init_user | Initializing Incomes Node");
            here ++> incomes();
        }

        visit [-->](`?profile) else {
            logger.debug("user | init_user | creating profile node");
            profile_node = here ++> profile();
            visit profile_node[0];
        }
    }

    can update_email with profile entry {
        if not here.email {
            logger.debug("user | init_user | No email found in profile, fetching current user");
            user_data = get_current_user();
            here.email = user_data.get("email");
        }
    }
}
