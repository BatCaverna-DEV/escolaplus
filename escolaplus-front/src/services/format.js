export function statusPadrao(status) {
    if(status == 1){
        return 'Ativo'
    }else{
        return 'Inativo'
    }
}
export function statusAluno(status){
    if(status == 0){
        return 'Inativo'
    }else{
        return 'Matriculado'
    }
}

export function categoriaFuncionario(categoria){
    if(categoria == 1){
        return 'Secretaria'
    }else if(categoria == 2){
        return 'Docente'
    }else{
        return 'Admin'
    }
}

export function statusMatricula(status){
    if(status === 1){
        return 'Matriculado'
    }else if(status === 2){
        return 'Encerrado'
    }else {
        return 'Cancelado'
    }
}

export function dataBrasil(data) {
    if (!data) return '';

    const d = new Date(data);

    if (isNaN(d)) return ''; // data inválida

    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();

    return `${dia}/${mes}/${ano}`;
}