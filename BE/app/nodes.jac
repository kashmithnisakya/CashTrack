import from uuid { uuid4 }
import from datetime { datetime }

node expenses {}

node expense {
    has expense_id: str = uuid4().hex;
    has amount: float = 0.0;
    has description: str = "";
    has date: datetime = datetime.now();
    has category: str = "";
    has created_at: datetime = datetime.now();
    has updated_at: datetime = datetime.now();
}