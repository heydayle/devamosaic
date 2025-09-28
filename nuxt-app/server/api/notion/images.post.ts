
export default defineEventHandler(async (event) => {
    const NOTION_SECRET_KEY = useRuntimeConfig().public.NOTION_SECRET_KEY
    const NOTION_IMAGE_DB = useRuntimeConfig().public.NOTION_IMAGE_DB

    const body = await readBody(event)
    const filter = body?.query || undefined

    try {
        return await $fetch('https://api.notion.com/v1/databases/' + NOTION_IMAGE_DB + '/query', {
            method: 'POST',
            headers: {
                Authorization: "Bearer " + NOTION_SECRET_KEY,
                "Notion-Version": "2022-06-28",
                "Content-Type": "application/json"
            },
            body: {
                ...filter
            }
        })
    }
    catch (error) {
        console.log(error);

        return error
    }
})
