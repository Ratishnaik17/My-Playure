import os
import uuid
from typing import List, Tuple
from fastapi import UploadFile


def save_upload_file(file: UploadFile, upload_dir: str = "uploads") -> str:
    """
    Save uploaded file locally and return relative access URL path.
    """
    os.makedirs(upload_dir, exist_ok=True)
    ext = os.path.splitext(file.filename)[1] if file.filename else ""
    filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join(upload_dir, filename)

    with open(filepath, "wb") as f:
        f.write(file.file.read())

    return f"/static/uploads/{filename}"


def determine_media_type(filename: str) -> str:
    ext = os.path.splitext(filename)[1].lower()
    if ext in [".mp4", ".mov", ".avi", ".webm", ".mkv"]:
        return "video"
    return "image"
