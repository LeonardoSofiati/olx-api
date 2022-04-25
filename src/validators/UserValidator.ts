import { checkSchema } from "express-validator";

export const userInfo = checkSchema({
    token: {
        notEmpty: true,
        errorMessage: 'Token não enviado'
    }
})

export const userEdit = checkSchema({
    token: {
        notEmpty: true,
        errorMessage: 'Token não enviado'
    },
    name: {
        trim: true, // retira espaços no começo e final da string
        optional: true, //torna campo opcional
        isLength: { //define no minimo 3 caracteres
            options: {min: 3}
        },
        errorMessage: 'Nome precisa ter pelo menos 3 caracteres' //mensagem caso dê erro
    },
    email: {
        optional: true,
        isEmail: true, //verifica se é e-mail
        normalizeEmail: true, // edita o e-mail tudo minusculo, etc.
        errorMessage: 'E-mail invalido'
    },
    password: {
        optional: true,
        isLength: {
            options: {min: 5}
        },
        errorMessage: 'Senha precisa ter pelo menos 5 caracteres'
    },
    state: {
        optional: true,
        errorMessage: 'Estado não preenchido'
    }
})