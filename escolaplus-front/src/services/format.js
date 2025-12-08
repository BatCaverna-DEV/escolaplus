export function statusCalendario(status){
    if(status === 0){
        return 'Fechado'
    }else{
        return 'Ativo'
    }
}

export function statusUsuario(status){
    if(status === 1){
        return 'Professor'
    }else if(status === 2){
        return 'Coordenador'
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