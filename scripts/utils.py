import os
import subprocess
from contextlib import contextmanager
from pathlib import Path


def get_script_dir() -> Path:
    return Path(__file__).parent


def get_tools_dir() -> Path:
    return Path(get_repository_root(), "tools")


def get_repository_root() -> Path:
    return get_script_dir().parent


def java_installed():
    process = subprocess.run(["java", "--version"], capture_output=True)
    return process.returncode == 0


def npm_installed():
    return (
        subprocess.run(
            "npm --version",
            capture_output=True,
            shell=True,
        ).returncode
        == 0
    )


def print_process_debug(process):
    if process.stdout:
        print(process.stdout.decode("utf-8"))

    if process.stderr:
        print(process.stderr.decode("utf-8"))


@contextmanager
def working_directory(working_dir):
    current_dir = os.getcwd()

    os.chdir(working_dir)

    try:
        yield
    finally:
        os.chdir(current_dir)
