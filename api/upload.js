import multiparty from "multiparty";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Form parse failed" });
    }

    const file = files.fileToUpload?.[0];
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const catboxForm = new FormData();
    catboxForm.append("reqtype", "fileupload");
    catboxForm.append("fileToUpload", fs.createReadStream(file.path));

    try {
      const uploadReq = await fetch("https://catbox.moe/user/api.php", {
        method: "POST",
        body: catboxForm
      });
      const url = await uploadReq.text();

      return res.status(200).json({ url });
    } catch (e) {
      return res.status(500).json({ error: "Upload to Catbox failed" });
    }
  });
}
