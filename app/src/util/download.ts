import { BlobWriter, TextReader, ZipWriter } from "@zip.js/zip.js";

/** download zip of json objects */
export async function downloadZip(
  jsons: Record<string, unknown>,
  filename: string,
) {
  const zipWriter = new ZipWriter(new BlobWriter("application/zip"));
  await Promise.all(
    Object.entries(jsons).map(([key, json]) =>
      zipWriter.add(
        key + ".json",
        new TextReader(JSON.stringify(json, null, 2)),
      ),
    ),
  );
  const blob = await zipWriter.close();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename + ".zip";
  link.click();
  window.URL.revokeObjectURL(url);
}
