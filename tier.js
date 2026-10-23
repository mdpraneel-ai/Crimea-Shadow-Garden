const ranks = ["S", "A", "B", "C", "D", "pool"];
const status = document.getElementById("status");

// Remember each image's rank
let savedRanks = JSON.parse(
    localStorage.getItem("shadowGardenRanks") || "{}"
);

// Connect to the existing photo library
const request = indexedDB.open("ShadowGardenDB", 1);

request.onsuccess = (event) => {
    const db = event.target.result;

    const transaction = db.transaction("images", "readonly");
    const store = transaction.objectStore("images");
    const getImages = store.getAll();

    getImages.onsuccess = () => {
        const images = getImages.result;

        images.forEach((item) => {
            const img = document.createElement("img");

            img.src = URL.createObjectURL(item.image);
            img.alt = item.name;
            img.title = item.name;
            img.draggable = true;
            img.dataset.id = item.id;

            img.addEventListener("dragstart", (event) => {
                event.dataTransfer.setData(
                    "text/plain",
                    String(item.id)
                );
            });

            const rank = savedRanks[item.id] || "pool";
            const destination = document.getElementById(rank);

            (destination || document.getElementById("pool"))
                .appendChild(img);
        });

        status.textContent =
            images.length + " images loaded. Start ranking!";
    };
};

request.onerror = () => {
    status.textContent = "Could not load your photo library.";
};

// Allow images to be dropped into every tier
ranks.forEach((rank) => {
    const area = document.getElementById(rank);

    area.addEventListener("dragover", (event) => {
        event.preventDefault();
        area.classList.add("drag-over");
    });

    area.addEventListener("dragleave", () => {
        area.classList.remove("drag-over");
    });

    area.addEventListener("drop", (event) => {
        event.preventDefault();
        area.classList.remove("drag-over");

        const id = event.dataTransfer.getData("text/plain");

        const img = [...document.querySelectorAll("img")]
            .find(image => image.dataset.id === id);

        if (!img) return;

        area.appendChild(img);

        // Automatically save the selected rank
        savedRanks[id] = rank;

        localStorage.setItem(
            "shadowGardenRanks",
            JSON.stringify(savedRanks)
        );

        status.textContent = "Tier list saved automatically!";
    });
});