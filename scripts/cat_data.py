import requests

def main():
    # Send request to cat api for information about every breed.
    url = "https://api.thecatapi.com/v1/breeds"
    resp = requests.get(url)
    # Convert http response to python dictionary containing an entry per breed
    breeds = resp.json()

    cat_ids = set()
    cat_names = set()

    for data in breeds:
        # id: unique identifier for each breed | name: full english title of breed
        cat_ids.add(data['id'])
        cat_names.add(data['name'])

    print(f"Cat ID: {list(cat_ids)}")
    print(f"Cat Name: {list(cat_names)}")
    print(f"IDs: {len(cat_ids)} | Names {len(cat_names)}")

if __name__ == "__main__":
    main()