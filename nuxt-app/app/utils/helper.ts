import type { NotionPage, SimpleImage } from "@/types/notion";

export const convertFileIdEncodeURL = (url: string) => {
  const parsedUrl = new URL(url);
  const extractedPath = parsedUrl.pathname.split('/').slice(2).join(':')
  return encodeURIComponent('attachment:' + extractedPath)
}

export const getImageLink = (fileId: string, blockId: string, width: number = 500, format: string = 'webp'): string => {
  return `https://www.notion.so/image/${fileId}?table=block&id=${blockId}&format=${format}&width=${width}`
}

export function convertNotionPagesToImageList(notionPages: NotionPage[]): SimpleImage[] {
  return notionPages?.map((page: NotionPage, index: number) => {
    const result: SimpleImage = {
      id: page.id,
      src: "",
      alt: "",
      name: "",
      fileId: "",
      preview: "",
      srcLoading: "",
      img: "",
      url: "",
      // height: 800,
    };

    const fileProperty = page.properties.file;
    if (fileProperty && fileProperty.type === "files" && fileProperty.files.length > 0) {
      const file = fileProperty.files[0];

      if (file.type === "file" && file.file && file.file.url) {
        const fileId = convertFileIdEncodeURL(file.file.url);
        result.fileId = fileId
        result.srcLoading = getImageLink(fileId, page.id, 1)
        result.img = getImageLink(fileId, page.id, 128)
        result.src = getImageLink(fileId, page.id, 340)
        result.preview = getImageLink(fileId, page.id, 4000)
        // result.url = ''
      } else if (file.type === "external" && file.external && file.external.url) {
        result.src = file.external.url ? file.external.url.replace('https://prod-files-secure.s3.us-west-2.amazonaws.com', '') : ''
      }

      if (file.name) {
        result.name = file.name;
        result.alt = file.name; // Use filename as alt text
      }
    }

    const nameProperty = page.properties.Name;
    if (nameProperty && nameProperty.type === "title" && nameProperty.title.length > 0) {
      const titleText = nameProperty.title.map((t: { plain_text: string }) => t.plain_text).join("");
      if (titleText) {
        result.name = titleText;
        result.alt = titleText;
      }
    }

    return result;
  });
}

export const getImageHeight = (url: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img.height);
    img.onerror = () => reject('Không tải được ảnh');
  });
}
