import urllib

import requests


def test_list_available():
    response = requests.get("http://localhost:5000/api/available_definition_files")
    response.raise_for_status()
    data = response.json()

    has_movement_definitions = False

    for file_data in data:
        if file_data["name"] == "movement_commands.d.ts":
            has_movement_definitions = True

    assert has_movement_definitions


def test_load_movement_definitions():
    response = requests.get(
        "http://localhost:5000/api/load_definition/movement_commands.d.ts"
    )
    response.raise_for_status()
    assert len(response.content) > 0, "Movement command has content"


def test_invalid_filepath():
    # Try reading a parent dir file that doesn't exist.
    response = requests.get(
        "http://localhost:5000/api/load_definition/{0}".format(
            urllib.parse.quote("test/../stuff")
        )
    )

    assert response.status_code == 404

    # try reading a file that actually exists in the parent dir
    response = requests.get(
        "http://localhost:5000/api/load_definition/{0}".format(
            urllib.parse.quote("../../server.py")
        )
    )

    assert response.status_code == 404


def test_access_available():
    response = requests.get("http://localhost:5000/api/available_definition_files")
    response.raise_for_status()
    data = response.json()

    for file_data in data:
        response = requests.get(
            "http://localhost:5000/api/load_definition/{0}".format(file_data["path"])
        )
        response.raise_for_status()

        assert len(response.content) > 0, "Valid response content has no data!"


def main():
    test_list_available()
    test_load_movement_definitions()
    test_invalid_filepath()
    test_access_available()
    print("All tests succeeded!")


if __name__ == "__main__":
    main()
