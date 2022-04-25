import { User } from "../models/User";
import { State } from "../models/State";
import { Category } from "../models/Category";
import bcrypt from 'bcrypt';
import { generateToken } from '../config/passport';
import { Ad } from "../models/Ad";

export const createUser = async (email: string, password: string, name: string, state: string) => {
    //Encriptando a senha
    const hash: string = bcrypt.hashSync(password, 10);

    //Verificando se usuário/e-mail já está cadastrado
    let hasUser = await User.findOne({ where: { email } });

    //Verificando se o Estado existe no BD
    let hasState = await State.findOne({ where: { name: state } })

    //Se não tiver usuario já cadastrado com esse email e o estado existir no BD, então sucesso e cria
    if (!hasUser && hasState) {
        let newUser = await User.create({ email, password: hash, name, state});
        const token = generateToken({ id: newUser?.id });

        let newUserToken = await User.update({ token: token }, {
            where: {
                id: newUser?.id
            }
        })

        if (newUser && newUserToken) {
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

export const matchPassword = (passwordBruto: string, passwordHash: string) => { //tive que retirar o async dessa função para comparar a senha na editUserDetails(), se atentar
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

export const editUserDetails = async (token: string, email: string, password: string, name: string, state: string) => {
    const userByToken = await User.findOne({ where: { token } })

    //checa ali em cima se o Token recebido bate com o token desse usuario cadastrado no banco, se bater, realiza as alterações, se não, retorna erro
    if (userByToken) {
        //checa se o e-mail a ser alterado já está cadastrado, se tiver, retorna erro, se não, altera
        if(email) {
            const emailCheck = await User.findOne({where:{email}});
            if(emailCheck) {
                return new Error('E-mail já cadastrado')
            }
        }

        //checa se o estado a ser alterado está presente na lista de estados cadastrados na State, se não estiver, da erro
        if(state){
            const stateCheck = await State.findOne({where: {name: state}});
            if(!stateCheck) {
                return new Error('Estao invalido')
            }
        }

        //checa se a senha que o usuário está mudando é a mesma que já está cadastrada, se for, não deixa alterar, se não for, gera um hash novo e altera o hash em si no banco, e não a senha pura, se não da falha no login pois ele vai comparar o hash antigo com a senha pura nova
        //antes de fazer a verificação, ele compara com o matchPassword() criada acima e compara a senha bruta recebida do front e a senha com hash do banco
        let hash:string | undefined = undefined;
        if(password) {
            let matchedSenha: boolean = matchPassword(password, userByToken.password)

            if(matchedSenha == true) {
                return new Error('Você não pode trocar a senha pela mesma usada anteriormente')
            } else {
                hash = bcrypt.hashSync(password, 10);
            }
        }

        await User.update({ name, email, password: hash, state }, {
            where: {
                token: userByToken.token
            }
        })
        return userByToken
    } else {
        return new Error('Usuário não encontrado/token não permitido')
    }
}