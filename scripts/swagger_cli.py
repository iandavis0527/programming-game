import subprocess
from pathlib import Path

from scripts.utils import npm_installed, print_process_debug


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

    if not process.returncode == 0:
        print_process_debug(process)

        raise RuntimeError(
            "Failed to run swagger-cli bundle(spec={0}, output_filepath={1}, format={2}, encoding={3})".format(
                spec_filepath,
                output_filepath,
                output_format,
                output_encoding,
            )
        )

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
