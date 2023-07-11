# This module serves static typescript definition files for client side programming interfaces.
# These are used to inject type hinting into monaco editor on the frontend when writing programs.
# Author: Ian Davis
import os
from pathlib import Path
from flask import Blueprint, abort, Response
from werkzeug.utils import secure_filename
from flask_cors import cross_origin

script_folder = Path(__file__).parent.resolve()
library_folder = Path(script_folder, "lib")
blueprint = Blueprint("type_definitions", __name__)


def get_files_in_directory(directory):
    all_files = []

    for root, _, files in os.walk(directory):
        for file in files:
            filepath = Path(root, file)
            all_files.append(
                {
                    "path": str(filepath),
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


@blueprint.route("/api/load_definition/<filename>")
@cross_origin()
def load_definition_file(filename: str):
    secured_filename = secure_filename(filename)
    print(filename, secured_filename)

    filepath = Path(library_folder, secured_filename).absolute().resolve()

    if not filepath.exists():
        abort(404, "Filename {0} does not exist".format(filename))

    return Response(read_file_in_chunks(filepath), mimetype="text/javascript")
