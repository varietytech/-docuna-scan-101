import { Directory, File, Paths } from "expo-file-system";

export type Scan = {
  id: string;
  createdAt: number;
  pages: string[]; // file names inside the scan's folder
};

// Every scan gets its own folder: <documents>/scans/<id>/
const root = new Directory(Paths.document, "scans");

function folderFor(id: string) {
  return new Directory(root, id);
}

export function pageUri(scan: Scan, page: string) {
  return new File(folderFor(scan.id), page).uri;
}

// The scanner writes pages to the cache, which Android may clear at any time.
// Copy them somewhere permanent and remember them in scan.json.
export async function saveScan(pageUris: string[]): Promise<Scan> {
  const id = Date.now().toString();
  const folder = folderFor(id);
  folder.create({ intermediates: true, idempotent: true });

  const pages: string[] = [];
  for (const [i, uri] of pageUris.entries()) {
    const page = new File(folder, `page-${i + 1}.jpg`);
    await new File(uri).copy(page);
    pages.push(page.name);
  }

  const scan: Scan = { id, createdAt: Date.now(), pages };
  await new File(folder, "scan.json").write(JSON.stringify(scan));
  return scan;
}
