function createFolder() {

    // Get the folder name
    let name = document.getElementById("folderName").value.trim();

    // Check whether the user entered a name
    if (name === "") {
        alert("Please enter a folder name!");
        return;
    }

    // Create a folder container
    let folder = document.createElement("div");

    // Create its title
    let title = document.createElement("h3");
    title.textContent = "📁 " + name;
    folder.appendChild(title);

    // Create an image upload input
    let upload = document.createElement("input");
    upload.type = "file";
    upload.accept = "image/*";
    upload.multiple = true;

    // Create a gallery
    let gallery = document.createElement("div");
    gallery.className = "gallery";

    // Display selected pictures
    upload.addEventListener("change", function () {

        for (let file of upload.files) {

            if (!file.type.startsWith("image/")) {
                continue;
            }

            let image = document.createElement("img");
            let imageURL = URL.createObjectURL(file);

            image.src = imageURL;

            image.onload = function () {
                URL.revokeObjectURL(imageURL);
            };

            gallery.appendChild(image);
        }

        upload.value = "";
    });

    folder.appendChild(upload);
    folder.appendChild(gallery);

    folder.className = "anime-folder";

    document.getElementById("folderContainer").appendChild(folder);

    // Clear the input
    document.getElementById("folderName").value = "";
}