import puppeteer from "puppeteer";
import Aluno from '../models/Aluno.js'

class ImpressaoController {

    ficha = async function (req, res) {
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
            <!doctype html>
              <html>
              <head>
                <meta charset="utf-8" />
                <style>
                  body { font-family: Arial; padding: 24px; }
                  h1 { margin: 0 0 8px 0; }
                  .box { border: 1px solid #ddd; padding: 16px; border-radius: 8px; }
                </style>
              </head>
              <body>
                <h1>Relatório</h1>
                <div class="box">
                  <p><b>Nome:</b> ${aluno.nome}</p>
                  <p><b>Gerado em:</b> ${new Date().toLocaleString("pt-BR")}</p>
                </div>
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