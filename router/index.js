const router = require("express").Router();

router.post("/upload", (req, res) => {
	let uploadPath = "./upload/";

	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send("No files were uploaded.");
	}

	const files = req.files.file;

	// Si l'élément files n'est pas un tableau, convertissez-le en tableau pour le traitement
	const fileList = Array.isArray(files) ? files : [files];

	for (let i = 0; i < fileList.length; i++) {
		const file = fileList[i];
		const fileName = file.name;

		// Utilisez un chemin unique pour chaque fichier pour éviter les écrasements
		const uniquePath = uploadPath + fileName;
		// Utilisez la méthode mv() pour déplacer le fichier sur le serveur
		file.mv(uniquePath, function (err) {
			if (err) {
				console.log(err);
				//return res.status(500).send(err);
			}

			// Envoyer une requête POST vers un endpoint distant pour enregistrer les détails du fichier
			fetch(`http://${req.hostname}:3000/medias`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					url: `http://${req.hostname}:5000/${fileName}`,
					name: fileName,
				}),
			});
		});
	}

	return res.status(201).send("Media(s) created");
});

// Point de terminaison pour récupérer la liste des fichiers
router.get("/all", async (req, res) => {
	try {
		// Effectuer une requête GET vers le service distant qui stocke les informations sur les fichiers
		const response = await fetch(`http://${req.hostname}:3000/medias`);
		const data = await response.json();

		// Envoyer la liste des fichiers en réponse
		res.json(data);
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

module.exports = router;
