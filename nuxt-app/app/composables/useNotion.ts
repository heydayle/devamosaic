import { convertNotionPagesToImageList } from '@/utils/helper'
import type { NotionResponse, SimpleImage } from "~/types/notion";


interface Filter {
    property?: string
    [key: string]: string | undefined
}

export const useNotion = async () => {
  const currentCursor = ref<string | null>()
  const isMaxPage = ref(false)
  const query = ref({})

  const results = ref<any>([])
  const allImages = ref<SimpleImage[]>([])
  const indexImage = ref(0)

  const NOTION_API_URL = '/api/notion/images'
  const OPTIONS_API: Record<string, string> = {
      method: "POST",
  }

  const saveNotionData = async (data: Ref<NotionResponse>) => {
    currentCursor.value = data.value?.next_cursor
    const resResults = data.value?.results || []
    results.value = [...results.value, ...resResults]

    indexImage.value = allImages.value.length
    const images = convertNotionPagesToImageList(data.value?.results)
      ?.filter(item => item.src)
      ?.map((item, index) => ({ ...item, index: (indexImage.value + index) })) || []
    allImages.value = [...allImages.value, ...images]
  }
  const notionGetMoreImages = async (cursor: string) => {
      const response = await useFetch(NOTION_API_URL, {
          ...OPTIONS_API,
          body: {
              query: {
                  start_cursor: cursor || undefined
              }
          }
      }) as { data: Ref<NotionResponse>, pending: Ref<boolean> }
      await saveNotionData(response.data)
  }
  return {
      currentCursor,
      allImages,
      saveNotionData,
      notionGetMoreImages,
  }
}
