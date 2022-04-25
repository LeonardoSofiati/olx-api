import { Category } from "../models/Category";;
import { Ad } from "../models/Ad";
import { User } from "../models/User";
import { Op } from "sequelize";

export const findCaterogy = async (token: string) => {
    const userByToken = await User.findOne({ where: { token } })

    //aqui verifica se o usuario tem token no BD, se tiver, libera a lista das categorias, se não, retorna erro
    if (userByToken) {
        const categoryList = await Category.findAll();

        if (categoryList) {
            let categoriesListWithImg: any[] = [];

            //aqui ta pegando a lista de categorias do BD e adicionando uma imagem no objeto dela
            categoryList.forEach((element) => {
                categoriesListWithImg.push({
                    ...element,
                    img: `http://localhost:3000/assets/images/${element.slug}.png`
                })
            })

            return categoriesListWithImg;

        } else {
            return new Error('Categoria não encontrada')
        }
    } else {
        return new Error('Token invalido')
    }
}

export const includeAdds = async (token: string, title: string, price: number, pricenegotiable: boolean, description: string, category: string, imageUrl: any) => {
    const userByToken = await User.findOne({ where: { token } });

    console.log('imageUrl', imageUrl)

    if (userByToken) {
        const createAd = await Ad.create({
            iduser: userByToken.id,
            state: userByToken.state,
            category,
            title,
            price,
            pricenegotiable,
            description,
            datecreated: new Date(),
            view: 0,
            status: true,
            image: imageUrl
        })

        if (createAd) {
            return createAd
        }
    } else {
        return new Error('Token invalido')
    }
}

//Realiza filtros mediante informação trazida pelo front e retorna a lista de Anuncios mediante esse filtro
export const adList = async (sort: string, offset: number, limit: number, search: string, category: string, state: string) => {
    const filters: any = {
        where: {
            [Op.and]:
                [{ status: true }]
        },
        order: [['price', sort]],
        offset,
        limit
    };

    if (search) {
        filters.where[Op.and].push({
            [Op.or]: [
                {
                    title: {
                        [Op.iLike]: `%${search}%` || `%${search}` || `${search}%`
                    }
                },
                {
                    description: {
                        [Op.iLike]: `%${search}%` || `%${search}` || `${search}%`
                    }
                }
            ]
        })
    }

    if (state) {
        filters.where[Op.and].push({
            state
        })
    }

    if (category) {
        filters.where[Op.and].push({
            category
        })
    }

    let adList = await Ad.findAll(filters);

    if (adList) {
        return adList
    } else {
        return new Error('Erro na consulta da lista de promoções')
    }
}

export const adItem = async (id: number, other: 'true' | 'false') => {
    let adItem = await Ad.findByPk(id);

    if (adItem) {
        //toda vez que alguem entrar na promoção, adicionar um na 'view' dela, posso fazer isso em um GET mesmo, não precisa ser um PUT
        adItem.view++;
        //mas preciso dar um save nele
        await adItem.save();

        //encontra dados do usuario criador do anuncio para adicionar
        let userOwner = await User.findByPk(adItem.iduser);

        type adDetailsType = {
            infos: Array<{}>
        }

        let adDetails: adDetailsType = {
                infos: [
                    { adInfo: adItem }, 
                    {
                        userOwnder: {
                            name: userOwner?.name,
                            email: userOwner?.email
                        }
                    }
                ]
        }

        //encontra outros anuncios que podem ser do interesse do usuario, podemos buscar por categoria (findall() na categoria), ou por usuario criador, etc.
        if (other == 'true') {
            const filters: Object = {
                where: {
                    status: true,
                    id: {
                        [Op.notIn]: [33]
                    },
                    iduser: adItem.iduser
                }
            }

            let adRelative = await Ad.findAll(filters);

            adDetails.infos.push({
                adRelative
            })
        }

        return adDetails;
    } else {
        return new Error('Promoção não existe')
    }
}

export const changeAds = async (id:number, token: string, title: string, price: number, pricenegotiable: boolean, description: string, category: string, imageUrl: any) => {
    let adToBeChanged= null;
    let userId = null;

    try{
        adToBeChanged = await Ad.findByPk(id);   

        userId = await User.findOne({
            where: {
                token
            }
        })
    } catch(err) {
        return new Error(`Erro ao encontrar o anúncio: ${err}`)
    }

    console.log('adToBeChanged', adToBeChanged?.iduser);
    console.log('userId', userId?.id)

    if (adToBeChanged?.iduser === userId?.id) {
        //aqui pode alterar o anuncio pois o usuario so pode alterar o proprio anuncio

        const filters: any = {
            where: {
                [Op.and]:
                    [{ status: true }]
            },
            order: [['price', sort]],
            offset,
            limit
        };
    
        if (title) {
            filters.where[Op.and].push({
                [Op.or]: [
                    {
                        title: {
                            [Op.iLike]: `%${search}%` || `%${search}` || `${search}%`
                        }
                    },
                    {
                        description: {
                            [Op.iLike]: `%${search}%` || `%${search}` || `${search}%`
                        }
                    }
                ]
            })
        }
    
        if (price) {
            filters.where[Op.and].push({
                price
            })
        }
    
        if (pricenegotiable) {
            filters.where[Op.and].push({
                pricenegotiable
            })
        }

        if (pricenegotiable) {
            filters.where[Op.and].push({
                pricenegotiable
            })
        }

        if (description) {
            filters.where[Op.and].push({
                description
            })
        }

        if (imageUrl) {
            filters.where[Op.and].push({
                imageUrl
            })
        }
    
        let adList = await Ad.findAll(filters);

        return adToBeChanged
        // const changedAd = await Ad.create({
        //     iduser: adToBeChanged.id,
        //     state: adToBeChanged.state,
        //     category,
        //     title,
        //     price,
        //     pricenegotiable,
        //     description,
        //     datecreated: new Date(),
        //     view: 0,
        //     status: true,
        //     image: imageUrl
        // })

        // if (adToBeChanged) {
        //     return adToBeChanged
        // }
    } else {
        //aqui não deixa alterar o anuncio se não for o mesmo usuario que criou
        return new Error('Token ou anuncio inexistentes')
    }
}