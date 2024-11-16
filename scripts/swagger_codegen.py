import os
import platform
import shutil
import subprocess
from pathlib import Path

from scripts.utils import (
    get_script_dir,
    get_tools_dir,
    java_installed,
    npm_installed,
    print_process_debug,
)

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


def swagger_typescript_installed():
    return (
        subprocess.run(
            "swagger-typescript-api --version",
            capture_output=True,
            shell=True,
        ).returncode
        == 0
    )


def install_swagger_typescript():
    process = subprocess.run(
        ["npm", "install", "-g", "swagger-typescript-api"],
        shell=True,
        capture_output=True,
    )

    if not process.returncode == 0:
        if process.stdout:
            print(process.stdout.decode("utf-8"))

        if process.stderr:
            print(process.stderr.decode("utf-8"))

        raise RuntimeError(
            "Could not install the swagger-typescript-api tool successfully!"
        )


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


def check_existing_output(output_path, assume_yes=False):
    if Path(output_path).exists():
        if assume_yes:
            shutil.rmtree(output_path)
            return True

        response = " "
        print(
            "Output directory exists at {0} Should we delete the directory before generating client library? [Y]/N".format(
                output_path,
            ),
            end=" ",
        )

        while not response in ["y", "n", ""]:
            response = input().lower()

        if response == "n":
            return False

        shutil.rmtree(output_path)

    return True


def swagger_codegen_cli(
    spec_filepath, language, output_path, template_location=None, assume_yes=False
):
    if not java_installed():
        raise RuntimeError(
            "Unable to find java on your system, please install java and ensure it is on your path or JAVA_HOME is set"
        )

    if not swagger_codegen_installed():
        print(
            "Couldn't find swagger-codegen on your system, downloading and installing swagger codegen cli to {0}, please wait...".format(
                SWAGGER_INSTALL_LOCATION
            )
        )
        install_swagger_codegen()

    if not check_existing_output(output_path, assume_yes):
        print(
            "Skipping api generation for {0} as output directory {1} exists and overwriting was denied".format(
                language,
                output_path,
            )
        )
        return

    args = get_swagger_codegen_command()
    args.insert(1, "-Dmodels")
    args.insert(3, "-DmodelTests=false")
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

    if template_location:
        args.append("-t")
        args.append(str(Path(template_location).resolve().absolute()))

    process = subprocess.run(
        args,
        capture_output=True,
        shell=True,
    )

    if process.returncode != 0 or process.stderr:
        print(" ".join(args))
        print_process_debug(process)

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


def swagger_typescript_api(spec_filepath, output_path, assume_yes=False):
    if not npm_installed():
        raise RuntimeError(
            "Could not find NodeJS installed on your machine to run the swagger-typescript-api tool!"
        )

    if not swagger_typescript_installed():
        install_swagger_typescript()

    if not check_existing_output(output_path, assume_yes):
        print(
            "Skipping api generation for typescript as output directory {0} exists and overwriting was denied".format(
                output_path
            )
        )
        return

    args = [
        "swagger-typescript-api",
        "-p",
        spec_filepath,
        "-o",
        output_path,
        "--modular",
    ]
    process = subprocess.run(args, capture_output=True, shell=True)

    if not process.returncode == 0:
        print_process_debug(process)

        raise RuntimeError(
            "Failed to generate swagger typescript models(spec={spec_filepath}, output={output_path})".format(
                spec_filepath=spec_filepath,
                output_path=output_path,
            )
        )

    print(
        "Compiled typescript client libraries into {output_filepath} using openapi spec at {spec_filepath}".format(
            spec_filepath=spec_filepath,
            output_filepath=output_path,
        )
    )


def run_swagger_codegen(
    spec_filepath,
    language,
    output_path,
    template_location=None,
    assume_yes=False,
):
    if language == "typescript-fetch":
        return swagger_typescript_api(spec_filepath, output_path, assume_yes=assume_yes)

    return swagger_codegen_cli(
        spec_filepath,
        language,
        output_path,
        template_location=template_location,
        assume_yes=assume_yes,
    )
