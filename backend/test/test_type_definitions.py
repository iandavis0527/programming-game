import requests
import urllib


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

    with open("./movement_definitions_downloaded.d.ts", "wb") as output_file:
        output_file.write(response.content)


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


def main():
    test_list_available()
    test_load_movement_definitions()
    test_invalid_filepath()


if __name__ == "__main__":
    main()
