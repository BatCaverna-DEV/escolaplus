export const ficha = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Ficha</title>
    <style>
        * { box-sizing: border-box; }
        html, body { height: 100%; }
        body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            background: #f2f2f2;
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
    <main class="page">
        <header class="header">
            <div class="logoBox" aria-label="Logo"></div>

        <div class="headerText">
            <div class="org">Colégio Espaço Educar</div>
            <div class="dept">Rua Vereador Joel Loureiro - Teresina PI</div>
            <div class="dept">Teresina - PI</div>
        </div>
        </header>

        <div style="display: flex; padding: 2px;">
            <div style="width: 80%;">
                <div style="display: flex;">
                    <div style="width: 78%;">
                        <label style="display: block;" for="nome">NOME DO ALUNO</label>
                        <input style="width: 98%;" type="text" value="Bruno Vicente Alves de Lima" id="nome">
                    </div>
                    <div style="width: 20%;">
                        <label style="display: block;" for="nascimento">NASCIMENTO</label>
                        <input style="width: 98%;" type="text" value="10/05/1989" id="nascimento">
                    </div>
                </div>
                <div style="display: flex; margin-top: 15px;">
                    <div style="width: 20%;">
                        <label style="display: block;" for="cep">CEP</label>
                        <input style="width: 98%;" type="text" value="64049-650" id="cep">
                    </div>
                    <div style="width: 63%;">
                        <label for="endereco" style="display: block;">ENDEREÇO</label>
                        <input style="width: 98%;" type="text" value="Rua Juiz João Almeita, 2251" id="endereco">
                    </div>
                    <div style="width: 15%;">
                        <label for="numero" style="display: block;">NÚMERO</label>
                        <input style="width: 98%;" type="text" value="2251" id="numero">
                    </div>
                </div>

                <div style="display: flex; margin-top: 15px;">
                    <div style="width: 35%;">
                        <label style="display: block;" for="bairro">BAIRRO</label>
                        <input style="width: 98%;" type="text" value="Planalto Ininga" id="bairro">
                    </div>
                    <div style="width: 35%;">
                        <label style="display: block;" for="cidade">CIDADE</label>
                        <input style="width: 98%;" type="text" value="Teresina" id="cidade">
                    </div>
                    <div style="width: 30%;">
                        <label style="display: block;" for="estado">ESTADO</label>
                        <input style="width: 98%;" type="text" value="Piauí" id="estado">
                    </div>
                </div>
            </div>

            <div style="width: 20%;">
                <img src="sem_foto.png" style="width: 100%;"> 
            </div>
        </div>

        <div style="display: flex; padding: 2px; margin-top: 15px;">
            <div style="width: 20%;">
                <label style="display: block;">TELEFONE 1</label>
                <input style="width: 98%;" type="text" value="(86) 95896-8596" id="telefone1">
            </div>  
            <div style="width: 20%;">
                <label style="display: block;">TELEFONE 2</label>
                <input style="width: 98%;" type="text" value="(86) 95896-8596" id="telefone2">
            </div>     
            <div style="width: 20%;">
                <label style="display: block;">TELEFONE 3</label>
                <input style="width: 98%;" type="text" value="(86) 95896-8596" id="telefone3">
            </div>      
            <div style="width: 40%;">
                <label style="display: block;">E-MAIL</label>
                <input style="width: 98%;" type="text" value="brunnovicente@gmail.com" id="email">
            </div>    
        </div>
        <hr style="margin-top: 15px;">
        <h5>Dados dos Pais</h5>
        <div style="display: flex; padding: 2px;">
            <div style="width: 80%;">
                <label style="display: block;">NOME DO PAI</label>
                <input style="width: 98%;" type="text" value="Bruce Wayne" id="pai">
            </div>               
            <div style="width: 20%;">
                <label style="display: block;">CPF DO PAI</label>
                <input style="width: 98%;" type="text" value="635.526.698-98" id="cpf_pai">
            </div>           
        </div>

        <div style="display: flex; padding: 2px; margin-top: 15px;">
            <div style="width: 80%;">
                <label style="display: block;">NOME DA MÃE</label>
                <input style="width: 98%;" type="text" value="Selina Kyle" id="mae">
            </div>               
            <div style="width: 20%;">
                <label style="display: block;">CPF DA MÃE</label>
                <input style="width: 98%;" type="text" value="635.526.698-98" id="cpf_mae">
            </div>           
        </div>

        <hr style="margin-top: 15px;">
        <h5>Outras Informações</h5>
        <div style="padding: 2px; margin-top: 15px;">
            <div>
                <span style="border: 1px solid black; padding: 3px;">SIM</span> Tem plano de saúde?
            </div>
            <div style="margin-top: 12px;">
                <span style="border: 1px solid black; padding: 3px;">SIM</span> Em caso de problemas de saúde ou acidentes pode levar para o hospital público?
            </div>
            <div style="margin-top: 12px;">
                <span style="border: 1px solid black; padding: 3px;">SIM</span> A imagem da criança poderá ser usada nas redes sociais?
            </div>
            <div style="margin-top: 12px;">
                <span style="border: 1px solid black; padding: 3px;">SIM</span> O aluno(a) poderá ir para casa sozinho?
            </div>
        </div>

        <hr style="margin-top: 15px;">
        <h5>Outras Informações</h5>

        <textarea style="width: 100%;">

        </textarea>

    </main>
    

</body>
</html>`