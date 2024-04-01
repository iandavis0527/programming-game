# This module serves static typescript definition files for client side programming interfaces.
# These are used to inject type hinting into monaco editor on the frontend when writing programs.
# Author: Ian Davis
import os
from pathlib import Path

from flask import Blueprint, Response, abort
from flask_cors import cross_origin

script_folder = Path(__file__).parent.resolve()
library_folder = Path(script_folder, "type_lib")
blueprint = Blueprint("type_definitions", __name__)


def get_files_in_directory(directory):
    all_files = []

    for root, _, files in os.walk(directory):
        for file in files:
            filepath = Path(root, file)
            all_files.append(
                {
                    "path": str(filepath).replace(str(library_folder), "").replace("\\", "/").lstrip("/"),
                    "name": str(file),
                }
            )

    return all_files


@blueprint.route("/api/available_definition_files")
@cross_origin()
def available_definition_files():
    """Get a list of all available definition files that the client can use when programming."""
    return get_files_in_directory(library_folder)


def read_file_in_chunks(filepath, chunk_size=4096):
    with open(filepath) as file_object:
        while True:
            data = file_object.read(chunk_size)

            if not data:
                break

            yield data


def ensure_library_file(filename: str):
    return Path(library_folder, filename).resolve().relative_to(library_folder.resolve())


@blueprint.route("/api/load_definition/<path:filename>")
@cross_origin()
def load_definition_file(filename: str):
    if not ensure_library_file(filename):
        abort(404, "Filename {0} does not exist".format(filename))

    filepath = Path(library_folder, filename).absolute().resolve()

    if not filepath.exists():
        abort(404, "Filename {0} does not exist".format(filename))

    return Response(read_file_in_chunks(filepath), mimetype="text/javascript")
