from os import getenv
from typing import Any

from dotenv import load_dotenv, find_dotenv
from sqlalchemy import BigInteger, Identity, JSON
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

load_dotenv(find_dotenv())

engine = create_async_engine(getenv('DB_POSTGRES'))  #, echo=True)

AsyncSessionMain = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    __abstract__ = True
    type_annotation_map = {dict[str, Any]: JSON}
    id: Mapped[int] = mapped_column(BigInteger, Identity(), primary_key=True)


async def get_async_session():
    async with AsyncSessionMain() as async_session:
        yield async_session

