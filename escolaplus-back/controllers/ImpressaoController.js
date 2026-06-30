import puppeteer from "puppeteer";
import Aluno from '../models/Aluno.js'
import Escola from '../models/Escola.js'
import {dataBrasil} from "../helpers/format.js";
import Matricula from "../models/Matricula.js";
import Turma from "../models/Turma.js"
import Calendario from "../models/Calendario.js"
import Diario from "../models/Diario.js"
import Nota from "../models/Nota.js"

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
                            <input style="width: 98%;" type="text" value="${aluno.cpf_mae}" id="cpf_mae">
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

    boletimTurma = async function (req, res) {
        const escola = await Escola.findOne()
        let browser;
        try {
            const turmaId = req.params.id
            const matriculas = await Matricula.findAll({
                where: { turma_id: turmaId, status: 1 },
                include: [
                    { model: Aluno, as: 'aluno' },
                    { model: Turma, as: 'turma' },
                ],
                order: [[{ model: Aluno, as: 'aluno' }, 'nome', 'ASC']],
            })

            if (!matriculas.length) return res.status(404).json({ erro: 'Nenhum aluno matriculado nesta turma' })

            const diariosDaTurma = await Diario.findAll({ where: { turma_id: turmaId } })

            // Coleta todas as descricoes de notas para montar colunas dinamicamente (mesma lógica do boletim individual)
            const primeiraMatricula = matriculas[0]
            const notasExemplo = await Nota.findAll({ where: { matricula_id: primeiraMatricula.id } })
            const todasDescricoes = [...new Set(notasExemplo.map(n => n.descricao))].sort((a, b) => {
                const ordem = (s) => {
                    const m = s.match(/^([A-Za-z]+)(\d*)$/)
                    const prefixos = ['N', 'Rec', 'Final']
                    const pi = prefixos.findIndex(p => m && m[1].toLowerCase() === p.toLowerCase())
                    return [(pi >= 0 ? pi : 99), parseInt(m?.[2] || '0')]
                }
                const [pa, na] = ordem(a)
                const [pb, nb] = ordem(b)
                return pa !== pb ? pa - pb : na - nb
            })

            const formatarNota = v => v !== null && v !== undefined ? parseFloat(v).toFixed(1).replace('.', ',') : '-'

            const gerarBlocoAluno = async (matricula) => {
                const aluno = matricula.aluno
                const diariosComNotas = await Promise.all(diariosDaTurma.map(async d => {
                    const notas = await Nota.findAll({
                        where: { diario_id: d.id, matricula_id: matricula.id },
                        order: [['semestre', 'ASC'], ['ordem', 'ASC']]
                    })
                    const notasAvaliacao = notas.filter(n => /^N\d+$/.test(n.descricao) && n.valor !== null)
                    const media = notasAvaliacao.length > 0
                        ? notasAvaliacao.reduce((s, n) => s + parseFloat(n.valor), 0) / notasAvaliacao.length
                        : null
                    return { diario: d, notas, media }
                }))

                const linhas = diariosComNotas.map(({ diario, notas, media }) => {
                    const colunas = todasDescricoes.map(desc => {
                        const nota = notas.find(n => n.descricao === desc)
                        return `<td class="nota-cell">${nota ? formatarNota(nota.valor) : '-'}</td>`
                    }).join('')
                    const mediaStr = media !== null ? media.toFixed(1).replace('.', ',') : '-'
                    const aprovado = media !== null ? (media >= 7 ? 'APROVADO' : 'REPROVADO') : '-'
                    const cor = media !== null ? (media >= 7 ? '#15803d' : '#b91c1c') : '#666'
                    return `<tr>
                        <td class="diario-name">${diario.descricao}</td>
                        ${colunas}
                        <td class="nota-cell media-cell">${mediaStr}</td>
                        <td class="sit-cell" style="color:${cor};font-weight:700;">${aprovado}</td>
                    </tr>`
                }).join('')

                return `
                <div class="aluno-page">
                    <header class="header">
                        <div class="logoBox"><img src="${escola.logo}" alt="Logo"></div>
                        <div class="headerText">
                            <div class="org">${escola.nome}</div>
                            <div class="dept">${escola.endereco} - ${escola.bairro}</div>
                            <div class="dept">${escola.cidade} - ${escola.estado}</div>
                            <div class="dept">E-mail: ${escola.email} | Tel: ${escola.telefone}</div>
                            <div class="docTitle">Boletim Escolar</div>
                        </div>
                        <img class="foto-aluno" src="${aluno.foto}" alt="Foto">
                    </header>

                    <div class="aluno-info">
                        <div class="field">Nome: <span>${aluno.nome}</span></div>
                        <div class="field">Nascimento: <span>${dataBrasil(aluno.nascimento)}</span></div>
                        <div class="field">Turma: <span>${matricula.turma.descricao}</span></div>
                        <div class="field">Matrícula: <span>${matricula.matricula}</span></div>
                        <div class="field">Mãe: <span>${aluno.mae || '-'}</span></div>
                        <div class="field">Pai: <span>${aluno.pai || '-'}</span></div>
                    </div>

                    <table class="notas-table">
                        <thead>
                            <tr>
                                <th class="diario-name">Diário / Disciplina</th>
                                ${todasDescricoes.map(d => `<th class="nota-cell">${d}</th>`).join('')}
                                <th class="nota-cell media-cell">Média</th>
                                <th class="sit-cell">Situação</th>
                            </tr>
                        </thead>
                        <tbody>${linhas}</tbody>
                    </table>

                    <div class="rodape">${escola.nome} &nbsp;|&nbsp; Documento gerado em ${new Date().toLocaleDateString('pt-BR')}</div>
                </div>`
            }

            const blocos = await Promise.all(matriculas.map(gerarBlocoAluno))

            const html = `<!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <title>Boletins da Turma</title>
                <style>
                    * { box-sizing: border-box; }
                    body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #111; font-size: 10pt; }
                    .aluno-page {
                        width: 297mm;
                        min-height: 210mm;
                        margin: 0 auto;
                        background: #fff;
                        padding: 10mm 12mm;
                        page-break-after: always;
                    }
                    .aluno-page:last-child { page-break-after: avoid; }
                    .header {
                        display: grid;
                        grid-template-columns: 22mm 1fr 28mm;
                        gap: 8mm;
                        align-items: center;
                        padding-bottom: 5mm;
                        border-bottom: 2px solid #111;
                        margin-bottom: 6mm;
                    }
                    .logoBox { width:22mm; height:22mm; border:1px solid #111; border-radius:3mm; overflow:hidden; }
                    .logoBox img { width:100%; height:100%; object-fit:cover; }
                    .headerText .org { font-weight:700; font-size:13pt; line-height:1.1; text-transform:uppercase; }
                    .headerText .dept { margin-top:2mm; font-size:9pt; }
                    .headerText .docTitle { margin-top:3mm; font-weight:700; font-size:11pt; text-transform:uppercase; }
                    .foto-aluno { width:28mm; height:35mm; object-fit:cover; border-radius:2mm; border:1px solid #ccc; }
                    .aluno-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr 1fr;
                        gap: 4px 12px;
                        margin-bottom: 5mm;
                        padding: 4mm 5mm;
                        border: 1px solid #ddd;
                        border-radius: 3mm;
                        background: #fafafa;
                    }
                    .aluno-info .field { font-size:9pt; }
                    .aluno-info .field span { font-weight:600; }
                    .notas-table { width:100%; border-collapse:collapse; font-size:9pt; }
                    .notas-table th { background:#dbeafe; border:1px solid #93c5fd; padding:3px 6px; text-align:center; font-weight:700; }
                    .notas-table td { border:1px solid #e2e8f0; padding:3px 6px; }
                    .notas-table tbody tr:nth-child(even) { background:#f8fafc; }
                    .diario-name { text-align:left; min-width:30mm; }
                    .nota-cell { text-align:center; min-width:12mm; }
                    .media-cell { font-weight:700; background:#fef9c3 !important; }
                    .sit-cell { text-align:center; min-width:22mm; font-size:8.5pt; }
                    .rodape { margin-top:8mm; text-align:center; font-size:8pt; color:#666; border-top:1px solid #ddd; padding-top:3mm; }
                </style>
            </head>
            <body>${blocos.join('')}</body>
            </html>`

            browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
            const page = await browser.newPage()
            await page.setContent(html, { waitUntil: 'networkidle0' })
            const pdfBuffer = await page.pdf({
                format: 'A4',
                landscape: true,
                printBackground: true,
                margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
            })

            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', `attachment; filename="boletins-turma.pdf"`)
            res.send(pdfBuffer)
        } catch (err) {
            console.error(err)
            res.status(500).json({ erro: 'Falha ao gerar boletins da turma' })
        } finally {
            if (browser) await browser.close()
        }
    }

    boletim = async function (req, res) {
        const escola = await Escola.findOne()
        let browser;
        try {
            const id = req.params.id
            const aluno = await Aluno.findByPk(id)
            if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado' })

            const matriculas = await Matricula.findAll({
                where: { aluno_id: id, status: 1 },
                include: [{ model: Turma, as: 'turma' }],
            })

            const turmasComDiarios = await Promise.all(matriculas.map(async m => {
                const diarios = await Diario.findAll({ where: { turma_id: m.turma_id } })
                const diariosComNotas = await Promise.all(diarios.map(async d => {
                    const notas = await Nota.findAll({
                        where: { diario_id: d.id, matricula_id: m.id },
                        order: [['semestre', 'ASC'], ['ordem', 'ASC']]
                    })
                    // Calcula média de N1, N2, N3, N4 (descricao no padrão N seguido de dígito(s))
                    const notasAvaliacao = notas.filter(n => /^N\d+$/.test(n.descricao) && n.valor !== null)
                    const media = notasAvaliacao.length > 0
                        ? notasAvaliacao.reduce((s, n) => s + parseFloat(n.valor), 0) / notasAvaliacao.length
                        : null
                    return { diario: d, notas, media }
                }))
                return { matricula: m, diarios: diariosComNotas }
            }))

            const formatarNota = v => v !== null && v !== undefined ? parseFloat(v).toFixed(1).replace('.', ',') : '-'

            // Coleta todos os descricaos de notas distintos para montar colunas dinamicamente
            const todasDescricoes = [...new Set(
                turmasComDiarios.flatMap(t => t.diarios.flatMap(d => d.notas.map(n => n.descricao)))
            )].sort((a, b) => {
                const ordem = (s) => {
                    const m = s.match(/^([A-Za-z]+)(\d*)$/)
                    const prefixos = ['N', 'Rec', 'Final']
                    const pi = prefixos.findIndex(p => m && m[1].toLowerCase() === p.toLowerCase())
                    return [(pi >= 0 ? pi : 99), parseInt(m?.[2] || '0')]
                }
                const [pa, na] = ordem(a)
                const [pb, nb] = ordem(b)
                return pa !== pb ? pa - pb : na - nb
            })

            const gerarLinhasDiarios = (diarios) => diarios.map(({ diario, notas, media }) => {
                const colunas = todasDescricoes.map(desc => {
                    const nota = notas.find(n => n.descricao === desc)
                    return `<td class="nota-cell">${nota ? formatarNota(nota.valor) : '-'}</td>`
                }).join('')
                const mediaStr = media !== null ? media.toFixed(1).replace('.', ',') : '-'
                const aprovado = media !== null ? (media >= 7 ? 'APROVADO' : 'REPROVADO') : '-'
                const corSit = media !== null ? (media >= 7 ? '#15803d' : '#b91c1c') : '#666'
                return `
                <tr>
                    <td class="diario-name">${diario.descricao}</td>
                    ${colunas}
                    <td class="nota-cell media-cell">${mediaStr}</td>
                    <td class="sit-cell" style="color:${corSit}; font-weight:700;">${aprovado}</td>
                </tr>`
            }).join('')

            const gerarBlocoMatricula = ({ matricula, diarios }) => `
            <div class="turma-block">
                <div class="turma-header">
                    <span>Turma: <strong>${matricula.turma.descricao}</strong></span>
                    <span>Matrícula: <strong>${matricula.matricula}</strong></span>
                </div>
                <table class="notas-table">
                    <thead>
                        <tr>
                            <th class="diario-name">Diário / Disciplina</th>
                            ${todasDescricoes.map(d => `<th class="nota-cell">${d}</th>`).join('')}
                            <th class="nota-cell media-cell">Média</th>
                            <th class="sit-cell">Situação</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${gerarLinhasDiarios(diarios)}
                    </tbody>
                </table>
            </div>`

            const html = `
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <title>Boletim</title>
                <style>
                    * { box-sizing: border-box; }
                    body {
                        margin: 0;
                        font-family: Arial, Helvetica, sans-serif;
                        color: #111;
                        font-size: 10pt;
                    }
                    .page {
                        width: 297mm;
                        min-height: 210mm;
                        margin: 0 auto;
                        background: #fff;
                        padding: 10mm 12mm;
                    }
                    .header {
                        display: grid;
                        grid-template-columns: 22mm 1fr 28mm;
                        gap: 8mm;
                        align-items: center;
                        padding-bottom: 6mm;
                        border-bottom: 2px solid #111;
                        margin-bottom: 8mm;
                    }
                    .logoBox {
                        width: 22mm;
                        height: 22mm;
                        border: 1px solid #111;
                        border-radius: 3mm;
                        overflow: hidden;
                    }
                    .logoBox img { width: 100%; height: 100%; object-fit: cover; }
                    .headerText .org {
                        font-weight: 700;
                        font-size: 13pt;
                        line-height: 1.1;
                        text-transform: uppercase;
                    }
                    .headerText .dept { margin-top: 2mm; font-size: 9pt; }
                    .headerText .docTitle {
                        margin-top: 3mm;
                        font-weight: 700;
                        font-size: 11pt;
                        letter-spacing: .4px;
                        text-transform: uppercase;
                    }
                    .foto-aluno {
                        width: 28mm;
                        height: 35mm;
                        object-fit: cover;
                        border-radius: 2mm;
                        border: 1px solid #ccc;
                    }
                    .aluno-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 4px 12px;
                        margin-bottom: 6mm;
                        padding: 5mm;
                        border: 1px solid #ddd;
                        border-radius: 3mm;
                        background: #fafafa;
                    }
                    .aluno-info .field { font-size: 9pt; }
                    .aluno-info .field span { font-weight: 600; }
                    .turma-block { margin-bottom: 8mm; }
                    .turma-header {
                        display: flex;
                        justify-content: space-between;
                        background: #1e40af;
                        color: #fff;
                        padding: 3mm 5mm;
                        border-radius: 2mm 2mm 0 0;
                        font-size: 10pt;
                    }
                    .notas-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 9pt;
                    }
                    .notas-table th {
                        background: #dbeafe;
                        border: 1px solid #93c5fd;
                        padding: 3px 6px;
                        text-align: center;
                        font-weight: 700;
                    }
                    .notas-table td {
                        border: 1px solid #e2e8f0;
                        padding: 3px 6px;
                    }
                    .notas-table tbody tr:nth-child(even) { background: #f8fafc; }
                    .diario-name { text-align: left; min-width: 30mm; }
                    .nota-cell { text-align: center; min-width: 12mm; }
                    .media-cell { font-weight: 700; background: #fef9c3 !important; }
                    .sit-cell { text-align: center; min-width: 22mm; font-size: 8.5pt; }
                    .rodape {
                        margin-top: 12mm;
                        text-align: center;
                        font-size: 8pt;
                        color: #666;
                        border-top: 1px solid #ddd;
                        padding-top: 4mm;
                    }
                </style>
            </head>
            <body>
                <div class="page">
                    <header class="header">
                        <div class="logoBox">
                            <img src="${escola.logo}" alt="Logo">
                        </div>
                        <div class="headerText">
                            <div class="org">${escola.nome}</div>
                            <div class="dept">${escola.endereco} - ${escola.bairro}</div>
                            <div class="dept">${escola.cidade} - ${escola.estado}</div>
                            <div class="dept">E-mail: ${escola.email} | Tel: ${escola.telefone}</div>
                            <div class="docTitle">Boletim Escolar</div>
                        </div>
                        <img class="foto-aluno" src="${aluno.foto}" alt="Foto do aluno">
                    </header>

                    <div class="aluno-info">
                        <div class="field">Nome: <span>${aluno.nome}</span></div>
                        <div class="field">Nascimento: <span>${dataBrasil(aluno.nascimento)}</span></div>
                        <div class="field">Mãe: <span>${aluno.mae || '-'}</span></div>
                        <div class="field">Pai: <span>${aluno.pai || '-'}</span></div>
                        <div class="field">Cidade: <span>${aluno.cidade || '-'} - ${aluno.estado || ''}</span></div>
                        <div class="field">Telefone: <span>${aluno.telefone1 || '-'}</span></div>
                    </div>

                    ${turmasComDiarios.map(gerarBlocoMatricula).join('')}

                    <div class="rodape">
                        Documento gerado em ${new Date().toLocaleDateString('pt-BR')} &nbsp;|&nbsp; ${escola.nome}
                    </div>
                </div>
            </body>
            </html>`

            browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
            const page = await browser.newPage()
            await page.setContent(html, { waitUntil: 'networkidle0' })
            const pdfBuffer = await page.pdf({
                format: 'A4',
                landscape: true,
                printBackground: true,
                margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
            })

            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', `attachment; filename="boletim-${aluno.nome}.pdf"`)
            res.send(pdfBuffer)
        } catch (err) {
            console.error(err)
            res.status(500).json({ erro: 'Falha ao gerar boletim' })
        } finally {
            if (browser) await browser.close()
        }
    }

}

export default new ImpressaoController();