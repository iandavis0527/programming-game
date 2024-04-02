import argparse
import sys

from scripts.swagger_cli import bundle_swagger_spec
from scripts.swagger_codegen import run_swagger_codegen
from scripts.utils import get_repository_root

REPOSITORY_ROOT = get_repository_root()


def main():
    parser = argparse.ArgumentParser(
        "Build script to bundle OpenAPI spec from docs and generate python and typescript clients with model definitions"
    )
    parser.add_argument(
        "--spec_filepath",
        help="The path to the openapi spec file on the system",
        default="docs/openapi.yaml",
    )

    parser.add_argument(
        "--python_output_filepath",
        help="The path where the python client output will be stored (relative to the repository root)",
        default="common/python/",
    )

    parser.add_argument(
        "--typescript_output_filepath",
        help="The path where the typescript client output will be stored (relative to the repository root)",
        default="common/typescript/",
    )

    parser.add_argument(
        "--spec_bundle_filepath",
        help="The path where the bundled openapi spec file will be generated",
        default="docs/openapi.gen.yaml",
    )

    parser.add_argument(
        "--spec_bundle_format",
        help="The format to store the bundled openapi spec file in",
        default="yaml",
        choices=["yaml", "json"],
    )

    parser.add_argument(
        "--spec_bundle_encoding",
        help="The spec bundle will be re-encoded with this encoding",
        default="utf-8",
    )

    args = parser.parse_args()

    bundle_swagger_spec(
        spec_filepath=args.spec_filepath,
        output_filepath=args.spec_bundle_filepath,
        output_format=args.spec_bundle_format,
    )

    run_swagger_codegen(
        spec_filepath=args.spec_bundle_filepath,
        language="python",
        output_path=args.python_output_filepath,
    )

    run_swagger_codegen(
        spec_filepath=args.spec_bundle_filepath,
        language="typescript-fetch",
        output_path=args.typescript_output_filepath,
    )


if __name__ == "__main__":
    main()
