import { checkSchema } from "express-validator";

export const signup = checkSchema({
    name: {
        trim: true, // retira espaços no começo e final da string
        notEmpty: true, //torna campo obrigatorio
        isLength: { //define no minimo 3 caracteres
            options: {min: 3}
        },
        errorMessage: 'Nome precisa ter pelo menos 3 caracteres' //mensagem caso dê erro
    },
    email: {
        isEmail: true, //verifica se é e-mail
        normalizeEmail: true, // edita o e-mail tudo minusculo, etc.
        errorMessage: 'E-mail invalido'
    },
    password: {
        notEmpty: true,
        isLength: {
            options: {min: 5}
        },
        errorMessage: 'Senha precisa ter pelo menos 5 caracteres'
    },
    state: {
        notEmpty: true,
        errorMessage: 'Estado não preenchido'
    }
});

export const signin = checkSchema({
    email: {
        isEmail: true,
        normalizeEmail: true,
        errorMessage: 'E-mail invalido'
    },
    password: {
        notEmpty: true,
        isLength: {
            options: {min: 5}
        },
        errorMessage: 'Senha precisa ter pelo menos 5 caracteres'
    }
})