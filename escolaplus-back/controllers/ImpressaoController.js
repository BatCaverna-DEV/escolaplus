import puppeteer from "puppeteer";
import Aluno from '../models/Aluno.js'
import Escola from '../models/Escola.js'
import {dataBrasil} from "../helpers/format.js";

class ImpressaoController {

    ficha = async function (req, res) {
        const escola = await Escola.findOne()

        let browser;
        try {
            let id = req.params.id;
            const aluno = await Aluno.findByPk(id)
            browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            })
            const page = await browser.newPage();
            const nome = 'Bruno Vicente'
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
                </style>
            </head>
            <body>
                <main class="">
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