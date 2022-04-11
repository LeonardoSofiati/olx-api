import { User } from "../models/User";
import { State } from "../models/State";
import { Category } from "../models/Category";
import bcrypt from 'bcrypt';
import { generateToken } from '../config/passport';
import { Ad } from "../models/Ad";

export const createUser = async (email: string, password: string, name: string, state: string, token: string) => {
    //Encriptando a senha
    const hash = bcrypt.hashSync(password, 10);

    //Verificando se usuário/e-mail já está cadastrado
    let hasUser = await User.findOne({ where: { email } });

    //Verificando se o Estado existe no BD
    let hasState = await State.findOne({ where: { name: state } })

    //Se não tiver usuario já cadastrado com esse email e o estado existir no BD, então sucesso e cria
    if (!hasUser && hasState) {
        let newUser = await User.create({ email, password: hash, name, state, token });

        if (newUser) {
            return newUser;
        }

        //Se não tiver usuario já cadastrado com esse email mas o estado também não existir no BD, erro
    } else if (!hasUser && !hasState) {
        return new Error('Estado invalido');

        //Se o estado existir no BD porém o usuário já tem um e-mail igual cadastrado, erro
    } else if (hasUser && hasState) {
        return new Error('E-mail já existente');

        //Se já tiver usuario cadastrado com o email e o estado não existir no BD, erro
    } else if (hasUser && !hasState) {
        return new Error('E-mail já existente e Estado invalido');
    }
}

export const findByEmail = async (email: string) => {
    const user = await User.findOne({ where: { email } })

    //aqui verifica se o usuario tem token no BD, se não tiver, cadastra um, se ja tiver, não faz nada
    if (!user?.token) {
        const token = generateToken({ id: user?.id })
        if (token) {
            await User.update({ token: token }, {
                where: {
                    id: user?.id
                }
            })
        }
    }

    return user
}

export const matchPassword = async (passwordBruto: string, passwordHash: string) => {
    const passwordCorrect = bcrypt.compareSync(passwordBruto, passwordHash);

    return passwordCorrect
}

//verifica qual é o usuário baseado no token que o front-end envia
export const findUserDetails = async (token: string) => {
    const userByToken = await User.findOne({ where: { token } })

    //se identificar, retorna os estados, detalhes do user e os Ads relacinados à ele pelo isUser na tabela ads
    if (userByToken) {
        const userState = await State.findOne({ where: { name: userByToken.state } });
        const ads = await Ad.findAll({
            where: {
                iduser: userByToken.id.toString()
            }
        });

        const checkAds = () => {
            if (ads.length > 0) {
                ads.forEach ( async (element) => {
                    const adCategory = await Category.findOne({where: {id: element.category}})
                    ads.map((element) => {//pensar em como adicionar o nome da categoria disponivel na tabela "Category" através da coluna "category" da tabela Ads que contém o ID da categoria em sí
                        
                    })

                    console.log('adCategory', adCategory?.name)
                });
                return ads;
            } else {
                return 'Nenhuma promoção vinculada'
            }
        }

        let userDetails = {
            user: userByToken,
            state: userState,
            ads: checkAds()
        }

        return userDetails
    } else {
        return new Error('Usuário não encontrado')
    }
}