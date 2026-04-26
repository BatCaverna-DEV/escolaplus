-- Adiciona coluna ordem na tabela notas
ALTER TABLE notas ADD COLUMN ordem INT NOT NULL DEFAULT 0;

-- Atualiza registros existentes com base na descrição padrão
UPDATE notas SET ordem = CASE descricao
    WHEN 'N1'    THEN 1
    WHEN 'N2'    THEN 2
    WHEN 'N3'    THEN 3
    WHEN 'N4'    THEN 4
    WHEN 'Rec1'  THEN 5
    WHEN 'N5'    THEN 6
    WHEN 'N6'    THEN 7
    WHEN 'N7'    THEN 8
    WHEN 'N8'    THEN 9
    WHEN 'Rec2'  THEN 10
    WHEN 'Final' THEN 11
    ELSE 99
END;
