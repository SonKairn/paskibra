export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = await req.formData();
    const file = form.get("fileToUpload");

    if (!file) {
      return res.status(400).json({ error: "No file" });
    }

    const catboxForm = new FormData();
    catboxForm.append("reqtype", "fileupload");
    catboxForm.append("fileToUpload", file);

    const uploadReq = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: catboxForm
    });

    const url = await uploadReq.text();
    return res.status(200).json({ url });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Upload failed" });
  }
  }
