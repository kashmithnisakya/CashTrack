walker registration {
    has email: EmailStr;
    has password: str;

    class __specs__ {
        has auth: bool = False;
        has entry_type: str = "root";
        has response_model: type = dict;
        has status_code: int = status.HTTP_201_CREATED;
        has tags: list = ["User APIs"];
        has summary: str = "Registration";
    }

    can enter with `root entry {
        req = User.register_type()(
            email=self.email, 
            password=self.password
        );

        log = log_entry("register", req.email, req.printable());
        resp = {"message": "Registration Failed!"};

        with User.Collection.get_session() as session, session.start_transaction() {
            _root = `root().__jac__;

            req_obf: dict = req.obfuscate();
            req_obf["root_id"] = _root.id;
            req_obf["is_admin"] = False;
            is_activated = req_obf["is_activated"] = not Emailer.has_client();

            retry = 0;
            while True {
                try {
                    NodeAnchor.Collection.insert_one(_root.serialize(), session);
                    if id := (
                        User.Collection.insert_one(req_obf, session=session)
                    ).inserted_id {
                        BulkWrite.commit(session);
                        if not is_activated {
                            User.send_verification_code(create_code(id), req.email);
                        }
                        resp = {"message": "Successfully Registered!"};
                        log_exit(resp, log);
                        break;
                    }
                    raise SystemError("Can't create System Admin!");
                } except DuplicateKeyError {
                    raise HTTPException(status.HTTP_409_CONFLICT, "Already Exists!");
                } except (ConnectionFailure, OperationFailure) as ex {
                    if (
                        ex.has_error_label("TransientTransactionError")
                        and retry <= BulkWrite.SESSION_MAX_TRANSACTION_RETRY
                    ) {
                        retry += 1;
                        logger.error(
                            "Error executing bulk write! "
                            f"Retrying [{retry}/{BulkWrite.SESSION_MAX_TRANSACTION_RETRY}] ..."
                        );
                        continue;
                    }
                    logger.exception(
                        f"Error executing bulk write after max retry [{BulkWrite.SESSION_MAX_TRANSACTION_RETRY}] !"
                    );
                    raise;
                } except Exception {
                    logger.exception("Error executing bulk write!");
                    raise;
                }
            }
        }
        _.report(resp, custom=True);
    }
}
