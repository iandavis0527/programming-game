import os
from contextlib import contextmanager
from pathlib import Path


def get_script_dir() -> Path:
    return Path(__file__).parent


def get_tools_dir() -> Path:
    return Path(get_repository_root(), "tools")


def get_repository_root() -> Path:
    return get_script_dir().parent


@contextmanager
def working_directory(working_dir):
    current_dir = os.getcwd()

    os.chdir(working_dir)

    try:
        yield
    finally:
        os.chdir(current_dir)
