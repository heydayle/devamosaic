interface NotionUser {
  object: "user";
  id: string;
}

interface DatabaseParent {
  type: "database_id";
  database_id: string;
}

interface NumberProperty {
  id: string;
  type: "number";
  number: number | null;
}

interface FilesProperty {
  id: string;
  type: "files";
  files: Array<any>; // Can be expanded if needed with specific file structure
}

interface TitleProperty {
  id: string;
  type: "title";
  title: Array<any>; // Can be expanded if title items have specific structure
}

interface NotionPageProperties {
  Number: NumberProperty;
  file: FilesProperty;
  Name: TitleProperty;
  [key: string]: any; // For any additional properties
}

interface NotionPage {
  object: "page";
  id: string;
  created_time: string;
  last_edited_time: string;
  created_by: NotionUser;
  last_edited_by: NotionUser;
  cover: null | any; // Can be expanded if needed
  icon: null | any; // Can be expanded if needed
  parent: DatabaseParent;
  archived: boolean;
  in_trash: boolean;
  properties: NotionPageProperties;
  url: string;
  public_url: string;
}

interface SimpleImage {
  id: string
  src: string
  alt: string
  name: string
  fileId: string
  preview: string
  srcLoading: string
  img: string
  url: string
  height?: number
  description?: string
}
interface NotionResponse {
  object: "list";
  results: NotionPage[];
  next_cursor: string | null;
  has_more: boolean;
  type: "page";
  page: {};
}
export type { NotionResponse, NotionPage, SimpleImage, NotionPageProperties, FilesProperty, NotionUser, NumberProperty, TitleProperty, DatabaseParent }
