import sqlalchemy as sql
from web import sql_database as db
from sqlalchemy.orm import relationship


class Member(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    name = sql.Column(sql.String(100), nullable=False, unique=True)
    balance = sql.Column(sql.Integer, default=0, nullable=True)
    hidden = sql.Column(sql.Boolean, nullable=False, default=False)
    password = sql.Column(sql.LargeBinary(length=128), nullable=False)
    salt = sql.Column(sql.String(64), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "balance": self.balance,
            "hidden": self.hidden
        }
