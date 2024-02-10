import Joi from "joi";

const sizeRegex = /^\d+-\d+-\d+$/;

//*addProduct
const addProductDto = Joi.object({
    category: Joi.string().required(),          //todo:validation?
    original: Joi.boolean().required(),
    size: Joi.string().pattern(sizeRegex).message("invalid size format. it should be d-d-d").required(),
    weight: Joi.number().required(),
    title: Joi.string().min(5).required(),
    photo: Joi.array().items(Joi.object({
        originalFilename: Joi.string().required(),
        mimetype: Joi.string().required(),
        size: Joi.number().required(),
        filepath: Joi.string().required(),
    }).unknown(true)),
    addData: Joi.object()
});

type addProductDtoType = {
    category: string,
    original: boolean,
    size: string,
    weight: number,
    title: string,
    photo?: object[],
    addData?: object
}

export { addProductDto, addProductDtoType }

//*deletePhoto
const deletePhotoDto = Joi.object({
    uuid: Joi.string().uuid().required(),
    productId: Joi.string().min(18).required()
});

type deletePhotoDtoType = {
    uuid: string,
    productId: string
}

export { deletePhotoDto, deletePhotoDtoType }