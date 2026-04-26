 

export const createCommsWorker = async () => {
    return async function start() {
        while(true) {
            const response = await pullCommsStream()
        }
    }
}