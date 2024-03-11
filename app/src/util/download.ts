import {
  BlobReader,
  BlobWriter,
  TextReader,
  TextWriter,
  ZipReader,
  ZipWriter,
} from "@zip.js/zip.js";

/** download zip of json objects */
export async function downloadZip(
  jsons: Record<string, unknown>,
  filename: string,
) {
  try {
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
  } catch (error) {
    console.error(error);
    window.alert("Error downloading file");
  }
}

/** upload zip of json objects */
export async function uploadZip<T>(data: ArrayBuffer) {
  try {
    const zipReader = new ZipReader(new BlobReader(new Blob([data])));
    const entries = await zipReader.getEntries();
    const files: UploadResult<T> = {};
    await Promise.all(
      entries.map(async (entry) => {
        const text = (await entry.getData?.(new TextWriter())) || "[]";
        files[entry.filename] = JSON.parse(text);
      }),
    );
    await zipReader.close();
    return files;
  } catch (error) {
    console.error(error);
    window.alert("Error uploading file");
  }

  return {};
}

export type UploadResult<T = unknown> = Record<string, T>;
