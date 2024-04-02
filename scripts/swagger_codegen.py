import os
import platform
import subprocess
from pathlib import Path

from scripts.utils import get_script_dir, get_tools_dir

OPENAPI_SPEC_MAJOR = "v3"
SWAGGER_VERSION = "3.0.52"
SWAGGER_REPOSITORY_URL = "https://repo1.maven.org/maven2/io/swagger/codegen/{0}/swagger-codegen-cli/{1}/swagger-codegen-cli-{1}.jar".format(
    OPENAPI_SPEC_MAJOR, SWAGGER_VERSION
)
SWAGGER_INSTALL_LOCATION = Path(get_tools_dir(), "swagger-codegen-cli.jar")


def install_swagger_codegen():
    system = platform.system().lower()
    args = []

    if system == "linux":
        args = [
            "wget",
            SWAGGER_REPOSITORY_URL,
            "-O {0}".format(SWAGGER_INSTALL_LOCATION),
        ]
    elif system == "darwin":
        args = ["brew", "install", "swagger-codegen"]
    elif system == "windows":
        args = [
            "powershell",
            "-Command",
            "Invoke-WebRequest -OutFile {1} {0}".format(
                SWAGGER_REPOSITORY_URL,
                SWAGGER_INSTALL_LOCATION,
            ),
        ]

    if not SWAGGER_INSTALL_LOCATION.parent.exists():
        os.makedirs(SWAGGER_INSTALL_LOCATION.parent)

    process = subprocess.run(args, capture_output=True)

    assert (
        process.returncode == 0
    ), "Failed to install swagger codegen to your system! Please install swagger-codegen.jar to a tools/ directory in this repo.\r\n You can find the swagger codegen here: https://github.com/swagger-api/swagger-codegen?tab=readme-ov-file#prerequisites"


def swagger_codegen_installed():
    return SWAGGER_INSTALL_LOCATION.exists()


def get_swagger_codegen_command():
    os = platform.system().lower()
    command_template = ""

    if os == "linux":
        command_template = "java -jar {0}"
    elif os == "darwin":
        command_template = "swagger-codegen"
    elif os == "windows":
        command_template = "java -jar {0}"

    return command_template.format(SWAGGER_INSTALL_LOCATION).split(" ")


def java_installed():
    process = subprocess.run(["java", "--version"], capture_output=True)
    return process.returncode == 0


def run_swagger_codegen(spec_filepath, language, output_path):
    assert (
        java_installed()
    ), "Unable to find java on your system, please install java and ensure it is on your path or JAVA_HOME is set"

    if not swagger_codegen_installed():
        print(
            "Couldn't find swagger-codegen on your system, downloading and installing swagger codegen cli to {0}, please wait...".format(
                SWAGGER_INSTALL_LOCATION
            )
        )
        install_swagger_codegen()

    args = get_swagger_codegen_command()
    args.extend(
        [
            "generate",
            "-i",
            str(Path(spec_filepath).resolve().absolute()),
            "-l",
            language,
            "-o",
            str(Path(output_path).resolve().absolute()),
        ]
    )

    process = subprocess.run(
        args,
        capture_output=True,
        shell=True,
    )

    if process.returncode != 0:
        print(args)

        if process.stdout:
            print(process.stdout.decode("utf-8"))

        if process.stderr:
            print(process.stderr.decode("utf-8"))

        raise RuntimeError(
            "Failed to run swagger-codegen(spec={0}, language={1}, output={2})".format(
                spec_filepath,
                language,
                output_path,
                process.stdout,
                process.stderr,
            ),
        )

    print(
        "Compiled {language} client libraries into {output_filepath} using openapi spec at {spec_filepath}".format(
            spec_filepath=spec_filepath,
            language=language,
            output_filepath=output_path,
        )
    )
