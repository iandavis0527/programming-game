import subprocess
from pathlib import Path


def npm_installed():
    return (
        subprocess.run(
            "npm --version",
            capture_output=True,
            shell=True,
        ).returncode
        == 0
    )


def swagger_cli_installed():
    return (
        subprocess.run(
            "redocly --version",
            capture_output=True,
            shell=True,
        ).returncode
        == 0
    )


def install_swagger_cli():
    return subprocess.run(
        "npm install -g @redocly/cli@latest",
        capture_output=True,
        shell=True,
    ).returncode


def bundle_swagger_spec(
    spec_filepath,
    output_filepath,
    output_format="yaml",
    output_encoding="utf-8",
):
    assert npm_installed(), "Cannot bundle swagger spec without NodeJS!"

    if not swagger_cli_installed():
        print("Installing Swagger CLI globally via NPM, please wait...")
        install_swagger_cli()

    args = [
        "redocly",
        "bundle",
        str(Path(spec_filepath).resolve().absolute()),
        "--ext",
        output_format,
        "-o",
        str(Path(output_filepath).resolve().absolute()),
    ]

    process = subprocess.run(args, capture_output=True, shell=True)

    assert process.returncode == 0, "Failed to generate initial swagger bundle"

    with open(output_filepath, "r") as initial_output_file:
        initial_output = initial_output_file.read()

    with open(output_filepath, "w", encoding=output_encoding) as encoded_output:
        encoded_output.write(initial_output)

    print(
        "bundled spec {spec_filepath} into {output_filepath} using encoding {encoding} and format {format}".format(
            spec_filepath=spec_filepath,
            output_filepath=output_filepath,
            encoding=output_encoding,
            format=output_format,
        )
    )
