import os
import glob
import zipfile
from datetime import datetime
from sqlalchemy import text
from dotenv import load_dotenv, find_dotenv
from sqlalchemy import text
from starlette.responses import JSONResponse
load_dotenv(find_dotenv())


async def upload_patient_data(session, data):
    assertion_error = "В папках не равное количество файлов"
    try:
        name = data.filename
        zip_file_path = os.path.join(os.getenv("BASEDIR"), f"uploaded_data/{name}")
        with open(zip_file_path, 'wb') as f:
            f.write(data.file.read())
        with zipfile.ZipFile(zip_file_path, 'r') as zip_object:
            zip_object.extractall(path='uploaded_data/')
        data_path = os.path.join(os.getenv("BASEDIR"), f"uploaded_data/")
        bpm_files = glob.glob(f'{data_path}{name.split('.')[0]}/bpm/*.csv')
        uc_files = glob.glob(f'{data_path}{name.split('.')[0]}/uterus/*.csv')
        assert len(bpm_files) == len(uc_files), assertion_error
        current_datetime = datetime.now().strftime("%Y-%m-%d_%H:%M:%S")
        current_date = datetime.now().strftime("%Y.%m.%d")
        stmt = text(f"""insert into patients ("lastName", name, surname, type, "folderId", "birthDate")
        values ('uploaded', 'patient', '{current_datetime}', 'uploaded_data', '{name.split('.')[0]}', '{current_date}')""")
        await session.execute(stmt)
        await session.commit()
        return JSONResponse(content={"message": "success"}, status_code=200)
    except AssertionError:
        return JSONResponse(content={"message": assertion_error}, status_code=501)
    except zipfile.BadZipFile:
        return JSONResponse(content={"message": "Ошибка при открытии архива"}, status_code=501)
