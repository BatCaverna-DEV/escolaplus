import puppeteer from "puppeteer";
import Aluno from '../models/Aluno.js'
import Escola from '../models/Escola.js'
import {dataBrasil} from "../helpers/format.js";
import Matricula from "../models/Matricula.js";
import Turma from "../models/Turma.js"
import Calendario from "../models/Calendario.js"

class ImpressaoController {

    ficha = async function (req, res) {
        const escola = await Escola.findOne()

        let browser;
        try {
            let id = req.params.id;
            const aluno = await Aluno.findByPk(id)
            const matricula = await Matricula.findOne({
                where: {
                    aluno_id: id
                },
                include: {
                    model: Turma,
                    as: 'turma'
                }
            })
            const calendario = await Calendario.findOne({
                where: {
                    status: 1
                }
            })
            browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            })
            const page = await browser.newPage();
            const html = `
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <title>Ficha</title>
                <style>
                    * { box-sizing: border-box; }
                    html, body { height: 100%; }
                    body {
                        margin: 0;
                        font-family: Arial, Helvetica, sans-serif;
                        /*background: #f2f2f2;*/
                        color: #111;
                    }
                    .page {
                        width: 210mm;
                        min-height: 297mm;
                        margin: 16px auto;
                        background: #fff;
                        padding: 14mm 12mm;
                        border: 1px solid #cfcfcf;
                        box-shadow: 0 10px 30px rgba(0,0,0,.08);
                        }
                    .header {
                        display: grid;
                        grid-template-columns: 22mm 1fr 55mm;
                        gap: 10mm;
                        align-items: center;
                        padding-bottom: 6mm;
                        border-bottom: 2px solid #111;
                        margin-bottom: 8mm;
                    }
                    .logoBox{
                        width: 22mm;
                        height: 22mm;
                        border: 1px solid #111;
                        border-radius: 3mm;
                    }
            
                    .headerText .org{
                        font-weight: 700;
                        font-size: 13pt;
                        line-height: 1.1;
                        text-transform: uppercase;
                    }
                    .headerText .dept{
                        margin-top: 2mm;
                        font-size: 10.5pt;
                    }
                    .headerText .docTitle{
                        margin-top: 3mm;
                        font-weight: 700;
                        font-size: 12pt;
                        letter-spacing: .4px;
                        text-transform: uppercase;
                    }
            
                    input{
                        padding: 4px;
                        border-radius: 4px;
                        border: #111 1px solid;
                    }
                    
                    .page{
                        page-break-after: always;
                    }
                </style>
            </head>
            <body>
                <main >
                    <header class="header">
                        <div class="logoBox" aria-label="Logo">
                        <img src="${escola.logo}" style="width: 100%; border-radius: 3px;">  
                        </div>
            
                    <div class="headerText">
                        <div class="org">${escola.nome}</div>
                        <div class="dept">${escola.endereco} - ${escola.bairro} </div>
                        <div class="dept">${escola.cidade} - ${escola.estado}</div>
                        <div class="dept">EMAIL: ${escola.email}</div>
                        <div class="dept">TELEFONE: ${escola.telefone}</div>
                    </div>
                    </header>
            
                    <div style="display: flex; padding: 2px;">
                        <div style="width: 80%;">
                            <div style="display: flex;">
                                <div style="width: 78%;">
                                    <label style="display: block;" for="nome">NOME DO ALUNO</label>
                                    <input style="width: 98%;" type="text" value="${aluno.nome}" id="nome">
                                </div>
                                <div style="width: 20%;">
                                    <label style="display: block;" for="nascimento">NASCIMENTO</label>
                                    <input style="width: 98%;" type="text" value="${dataBrasil(aluno.nascimento)}" id="nascimento">
                                </div>
                            </div>
                            <div style="display: flex; margin-top: 15px;">
                                <div style="width: 20%;">
                                    <label style="display: block;" for="cep">CEP</label>
                                    <input style="width: 98%;" type="text" value="${aluno.cep}" id="cep">
                                </div>
                                <div style="width: 63%;">
                                    <label for="endereco" style="display: block;">ENDEREÇO</label>
                                    <input style="width: 98%;" type="text" value="${aluno.endereco}" id="endereco">
                                </div>
                                <div style="width: 15%;">
                                    <label for="numero" style="display: block;">NÚMERO</label>
                                    <input style="width: 98%;" type="text" value="${aluno.numero}" id="numero">
                                </div>
                            </div>
            
                            <div style="display: flex; margin-top: 15px;">
                                <div style="width: 35%;">
                                    <label style="display: block;" for="bairro">BAIRRO</label>
                                    <input style="width: 98%;" type="text" value="${aluno.bairro}" id="bairro">
                                </div>
                                <div style="width: 35%;">
                                    <label style="display: block;" for="cidade">CIDADE</label>
                                    <input style="width: 98%;" type="text" value="${aluno.cidade}" id="cidade">
                                </div>
                                <div style="width: 30%;">
                                    <label style="display: block;" for="estado">ESTADO</label>
                                    <input style="width: 96%;" type="text" value="${aluno.estado}" id="estado">
                                </div>
                            </div>
                        </div>
            
                        <div style="width: 20%;">
                            <div style="border-radius: 3px;background-color: #DCDCDC;">
                                <img src="${aluno.foto}" style="width: 100%; border-radius: 3px;">                            
                            </div>
                             
                        </div>
                    </div>
            
                    <div style="display: flex; padding: 2px; margin-top: 15px;">
                        <div style="width: 20%;">
                            <label style="display: block;">TELEFONE 1</label>
                            <input style="width: 98%;" type="text" value="${aluno.telefone1}" id="telefone1">
                        </div>  
                        <div style="width: 20%;">
                            <label style="display: block;">TELEFONE 2</label>
                            <input style="width: 98%;" type="text" value="${aluno.telefone2}" id="telefone2">
                        </div>     
                        <div style="width: 20%;">
                            <label style="display: block;">TELEFONE 3</label>
                            <input style="width: 98%;" type="text" value="${aluno.telefone1}" id="telefone3">
                        </div>      
                        <div style="width: 40%;">
                            <label style="display: block;">E-MAIL</label>
                            <input style="width: 98%;" type="text" value="${aluno.email}" id="email">
                        </div>    
                    </div>
                    <hr style="margin-top: 15px;">
                    <h5>Dados dos Pais</h5>
                    <div style="display: flex; padding: 2px;">
                        <div style="width: 80%;">
                            <label style="display: block;">NOME DO PAI</label>
                            <input style="width: 98%;" type="text" value="${aluno.pai}" id="pai">
                        </div>               
                        <div style="width: 20%;">
                            <label style="display: block;">CPF DO PAI</label>
                            <input style="width: 98%;" type="text" value="${aluno.cpf_pai}" id="cpf_pai">
                        </div>           
                    </div>
            
                    <div style="display: flex; padding: 2px; margin-top: 15px;">
                        <div style="width: 80%;">
                            <label style="display: block;">NOME DA MÃE</label>
                            <input style="width: 98%;" type="text" value="${aluno.mae}" id="mae">
                        </div>               
                        <div style="width: 20%;">
                            <label style="display: block;">CPF DA MÃE</label>
                            <input style="width: 98%;" type="text" value="635.526.698-98" id="${aluno.cpf_mae}">
                        </div>           
                    </div>
            
                    <hr style="margin-top: 15px;">
                    <h5>Outras Informações</h5>
                    <div style="padding: 2px; margin-top: 15px;">
                        <div>
                            <span style="border: 1px solid black; padding: 3px;">${aluno.saude}</span> Tem plano de saúde?
                        </div>
                        <div style="margin-top: 12px;">
                            <span style="border: 1px solid black; padding: 3px;">${aluno.hospital}</span> Em caso de problemas de saúde ou acidentes pode levar para o hospital público?
                        </div>
                        <div style="margin-top: 12px;">
                            <span style="border: 1px solid black; padding: 3px;">${aluno.redes}</span> A imagem da criança poderá ser usada nas redes sociais?
                        </div>
                        <div style="margin-top: 12px;">
                            <span style="border: 1px solid black; padding: 3px;">${aluno.sozinho}</span> O aluno(a) poderá ir para casa sozinho?
                        </div>
                    </div>
            
                    <hr style="margin-top: 15px;">
                    <h5>Outras Informações</h5>
            
                    <textarea style="width: 100%;">
                        ${aluno.obs}
                    </textarea>
            
                </main>
                <br><br>
                <main>
                    <h5 style="text-align: center;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h5>
                    <p style="text-align: justify;">
                        Eu, <strong>${matricula.responsavel}</strong> responsável pela matrícula do (a) <strong>${aluno.nome}</strong> no 
                        <strong>${matricula.turma.descricao}</strong> no ano de <strong>${calendario.ano}</strong>.
                    </p>
                    <p style="text-align: justify;">
                        Sou ciente de que a escolha de escola privada é opção e resulta na obrigação de pagar
                        as mensalidades escolares para recebimentos dos serviços educacionais. Declaro aceitar
                        os itens abaixo:                    
                    </p>
                    
                    <ol type="I">
                        <li style="text-align: justify;">
                            Conhecer e acatar as normas da escola, valor da mensalidade, que poderá ser paga até o dia 05 do mês
                            subsequente ao vencimento sem multa e juros;
                        </li>  
                        <li style="text-align: justify;">
                            Não ser efetivada a matrícula se houver débito relativo à mensalidade do ano letivo anterior ao
                            proposto;
                        </li>  
                        <li style="text-align: justify;">
                           Não ser efetivada a matrícula se o (a) aluno (a) não satisfazer as exigências da legislação de ensino;                         
                        </li>      
                        <li style="text-align: justify;">
                             Estar informado (a) de que o atraso de pagamento de cada parcela acarretará o acréscimo de multa,
juros e atualização monetária, conforme a legislação em vigor;                       
                        </li>          
                        <li style="text-align: justify;">
                            Quando ocorrer a desistência o responsável pela matrícula do (a) aluno (a) deverá procurar
imediatamente a direção;
                        </li >
                        <li style="text-align: justify;">
                            Ao solicitar o cancelamento da matrícula o responsável deverá estar com as mensalidades em dia até a
data do ocorrido;
                        </li>
                        <li style="text-align: justify;">
                            O responsável pela matrícula que optar pela desistência não poderá requerer devolução da matrícula;
                        </li>
                        <li style="text-align: justify;">
                            Caso não haja uma comunicação formal da rescisão deste contrato À direção acarretará no
inadimplemento perante esta empresa a qual poderá usar de cobrança judicial e inclusão do responsável
no SERASA.
                        </li>
                        <li style="text-align: justify;">
                            A partir de três parcelas em atraso implica, a critério da escola, em negativação do nome do
responsável pela matrícula em serviço de proteção de crédito, protesto da dívida e/ou cobrança judicial
                        </li>
                        <li>
                            Reconhecer como prestado o serviço educacional, se não possuir documento comprobatório de
desligamento, transferência ou cancelamento de matrícula do(a) aluno(a) referente ao período,
conforme o contrato;
                        </li>
                        <li style="text-align: justify;">
                            Serem verdadeiras e sujeitas À comprovação por documento, se exigidos, as informações prestadas no
verso deste.
                        </li>
                        <li style="text-align: justify;">
                            Autorizamos a divulgação da imagem da criança/adolescente quando for referente a escola.
                        </li>
                    </ol>
                    <br><br><br>
                    <p style="text-align: center;">_____________________________________________ <br>
                    ${matricula.responsavel}<br>
                    CPF: ${matricula.cpf}
                    </p>
                </main>
                
            
            </body>
            </html>
            `;
            await page.setContent(html, { waitUntil: "networkidle0" });
            const pdfBuffer = await page.pdf({
                format: "A4",
                printBackground: true,
                margin: { top: "20mm", right: "15mm", bottom: "20mm", left: "15mm" },
            });

            res.setHeader("Content-Type", "application/pdf");
            // inline abre no navegador; attachment força download
            res.setHeader(
                "Content-Disposition",
                'attachment; filename="ficha.pdf"'
            );
            res.send(pdfBuffer);
        }catch (err) {
            console.error(err);
            res.status(500).json({ erro: "Falha ao gerar PDF" });
        } finally {
            if (browser) await browser.close();
        }
    }//Fim do Imprimir

}

export default new ImpressaoController();