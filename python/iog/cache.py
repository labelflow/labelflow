import os
import json
import time
import shutil
import pickle


class Cache:
    def __init__(
        self, cache_folder="./cache", max_file_number=500, validation_time=86400
    ):
        self.cache_folder = cache_folder
        self.max_file_number = max_file_number
        self.validation_time = validation_time
        os.makedirs(self.cache_folder, exist_ok=True)

    def clear(self):
        shutil.rmtree(self.cache_folder)
        os.makedirs(self.cache_folder)

    def get_file_path(self, id):
        return os.path.join(self.cache_folder, f"{id}.pkl")

    def write(self, object: dict, id: str):
        _, _, files = next(os.walk(self.cache_folder))
        file_count = len(files)
        if file_count >= self.max_file_number:
            print("Cache folder reached size limit, deleting all content.")
            self.clear()
        object["created_at"] = time.time()
        with open(self.get_file_path(id), "wb") as file:
            pickle.dump(object, file)

    def read(self, id: str):
        path_file = self.get_file_path(id)
        try:
            with open(self.get_file_path(id), "rb") as file:
                object = pickle.load(file)
                if time.time() - int(object.get("created_at")) > self.validation_time:
                    os.remove(path_file)
                    raise Exception("Object is out of date.")
                return object
        except Exception as e:
            print(f"Couldn't read cache in {path_file}. \nReceived error {e}.")
            return {}
