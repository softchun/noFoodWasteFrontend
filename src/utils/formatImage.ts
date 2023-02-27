
type ImageData = {
    contentType: string,
    dataImg: {
        data: Buffer
    }
}

function formatImageSrc(image: ImageData) {
    return 'data:' + image.contentType + ';base64,' + Buffer.from(image.dataImg.data).toString('base64')
}

export default formatImageSrc