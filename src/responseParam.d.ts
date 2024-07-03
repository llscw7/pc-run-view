interface QuickLinkData {
  [key: string]: {
    [key: string]: QuickLinkDataItem
  }
}

interface QuickLinkDataItem {
  id: string;
  _id: string;
  title: string;
  img: string;
  factory: string;
  createTime: string;
  banner: string;
  about: string;
  startLink: string;
  src: string;
  tags: string[];
  title_cn: string;
  collect?: number;
  custom_col?: string[]
}

interface tbNameItem {
  _id?: string;
  name: string;
  value: string;
  sort?: number;
  editFlag?: number;
}

interface SortableEvent extends Event {
  oldIndex: number;
  newIndex: number;
}

interface ImageItem {
  url: string;
  name: string
}

interface PictureItem {
  url: string;
  checked: boolean;
}

declare namespace ResponseParam {
  interface status {
    code: number;
    message?: string;
  }
  
  interface getQuickLinkData {
    status: status,
    result: QuickLinkDataItem[],
  }

  interface FileResult {
    status: status;
    result?: FileData
  }

  interface Result {
    status: status;
    result: any
  }

  interface FileData {
    url: string;
    name?: string;
  }
}

interface collectListParam {
  id: string | number;
  name: string;
  value: string;
}