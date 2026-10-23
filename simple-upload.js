const input = document.getElementById("imageUpload");
const button = document.getElementById("uploadBtn");
const status = document.getElementById("status");
const gallery = document.getElementById("gallery");

let db;

// Open or create the local photo database
const request = indexedDB.open("ShadowGardenDB", 1);

request.onupgradeneeded = (event) => {
    const database = event.target.result;

    if (!database.objectStoreNames.contains("images")) {
        database.createObjectStore("images", {
            keyPath: "id",
            autoIncrement: true
        });
    }
};

request.onsuccess = (event) => {
    db = event.target.result;
    status.textContent = "Photo library is ready!";
    showImages();
};

request.onerror = () => {
    status.textContent = "Could not open the photo library.";
};

// Upload an image
button.addEventListener("click", () => {
    const file = input.files[0];

    if (!file) {
        status.textContent = "Please choose an image first.";
        return;
    }

    if (!file.type.startsWith("image/")) {
        status.textContent = "Please select an image file.";
        return;
    }

    if (!db) {
        status.textContent = "Database is not ready. Try again.";
        return;
    }

    const transaction = db.transaction("images", "readwrite");
    const store = transaction.objectStore("images");

    store.add({
        name: file.name,
        image: file
    });

    transaction.oncomplete = () => {
        status.textContent = "Image saved successfully!";
        input.value = "";
        showImages();
    };

    transaction.onerror = () => {
        status.textContent = "Failed to save image.";
    };
});

// Display saved images
function showImages() {
    gallery.innerHTML = "";

    const transaction = db.transaction("images", "readonly");
    const store = transaction.objectStore("images");
    const request = store.getAll();

    request.onsuccess = () => {
        const images = request.result;

        if (images.length === 0) {
            gallery.textContent = "No images uploaded yet.";
            return;
        }

        images.forEach((item) => {
            const container = document.createElement("div");
            container.style.display = "inline-block";
            container.style.margin = "10px";
            container.style.textAlign = "center";

            const img = document.createElement("img");
            const imageUrl = URL.createObjectURL(item.image);

            img.src = imageUrl;
            img.alt = item.name;
            img.style.width = "150px";
            img.style.borderRadius = "8px";

            img.onload = () => URL.revokeObjectURL(imageUrl);

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.style.display = "block";
            deleteBtn.style.margin = "8px auto";

            deleteBtn.addEventListener("click", () => {
                deleteImage(item.id);
            });

            container.appendChild(img);
            container.appendChild(deleteBtn);
            gallery.appendChild(container);
        });
    };
}

// Delete an image
function deleteImage(id) {
    const transaction = db.transaction("images", "readwrite");
    const store = transaction.objectStore("images");

    store.delete(id);

    transaction.oncomplete = () => {
        status.textContent = "Image deleted.";
        showImages();
    };
}