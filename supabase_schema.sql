-- ============================================
-- Schema do banco de dados para o projeto IPqM
-- PostgreSQL (Supabase) com timezone UTC
-- Convenções: snake_case para tabelas e colunas
-- ============================================

-- Tabela 1: Eletrônicas
CREATE TABLE IF NOT EXISTS eletronicas (
    numero_serie_eletronica TEXT PRIMARY KEY,
    versao_eletronica TEXT NOT NULL,
    firmware TEXT,
    data_fabricacao DATE NOT NULL,
    data_atualizacao TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE eletronicas IS 'Tabela de eletrônicas (componentes SAASS)';
COMMENT ON COLUMN eletronicas.numero_serie_eletronica IS 'Número de série único da eletrônica (PK)';
COMMENT ON COLUMN eletronicas.versao_eletronica IS 'Versão da eletrônica (ex: v6.0.2)';
COMMENT ON COLUMN eletronicas.firmware IS 'Versão do firmware instalado';
COMMENT ON COLUMN eletronicas.data_fabricacao IS 'Data de fabricação do componente';
COMMENT ON COLUMN eletronicas.data_atualizacao IS 'Data e hora da última atualização (UTC)';

-- Tabela 2: Hidrofones
CREATE TABLE IF NOT EXISTS hidrofones (
    numero_serie_hidrofone TEXT PRIMARY KEY,
    versao_hidrofone TEXT NOT NULL,
    data_fabricacao DATE NOT NULL,
    data_atualizacao TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE hidrofones IS 'Tabela de hidrofones (componentes SAASS)';
COMMENT ON COLUMN hidrofones.numero_serie_hidrofone IS 'Número de série único do hidrofone (PK)';
COMMENT ON COLUMN hidrofones.versao_hidrofone IS 'Versão do hidrofone (ex: v6.0.2)';
COMMENT ON COLUMN hidrofones.data_fabricacao IS 'Data de fabricação do componente';
COMMENT ON COLUMN hidrofones.data_atualizacao IS 'Data e hora da última atualização (UTC)';

-- Tabela 3: Packs de Baterias
CREATE TABLE IF NOT EXISTS packs_baterias (
    numero_serie_pack_baterias TEXT PRIMARY KEY,
    versao_pack_baterias TEXT NOT NULL,
    data_fabricacao DATE NOT NULL,
    data_atualizacao TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE packs_baterias IS 'Tabela de packs de baterias (componentes SAASS)';
COMMENT ON COLUMN packs_baterias.numero_serie_pack_baterias IS 'Número de série único do pack de baterias (PK)';
COMMENT ON COLUMN packs_baterias.versao_pack_baterias IS 'Versão do pack de baterias';
COMMENT ON COLUMN packs_baterias.data_fabricacao IS 'Data de fabricação do componente';
COMMENT ON COLUMN packs_baterias.data_atualizacao IS 'Data e hora da última atualização (UTC)';

-- Tabela 4: Tubos
CREATE TABLE IF NOT EXISTS tubos (
    numero_serie_tubo TEXT PRIMARY KEY,
    versao_tubo TEXT NOT NULL,
    profundidade_metros INTEGER NOT NULL,
    data_fabricacao DATE NOT NULL,
    data_atualizacao TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE tubos IS 'Tabela de tubos (componentes SAASS)';
COMMENT ON COLUMN tubos.numero_serie_tubo IS 'Número de série único do tubo (PK)';
COMMENT ON COLUMN tubos.versao_tubo IS 'Versão do tubo (ex: v6.0.2)';
COMMENT ON COLUMN tubos.profundidade_metros IS 'Profundidade máxima em metros';
COMMENT ON COLUMN tubos.data_fabricacao IS 'Data de fabricação do componente';
COMMENT ON COLUMN tubos.data_atualizacao IS 'Data e hora da última atualização (UTC)';

-- Tabela 5: SAASS
CREATE TABLE IF NOT EXISTS saass (
    numero_serie_saass TEXT PRIMARY KEY,
    numero_serie_eletronica TEXT NOT NULL,
    numero_serie_hidrofone TEXT NOT NULL,
    numero_serie_pack_baterias TEXT NOT NULL,
    numero_serie_tubo TEXT NOT NULL,
    profundidade_metros INTEGER NOT NULL,
    data_fabricacao DATE NOT NULL,
    data_atualizacao TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_saass_eletronica FOREIGN KEY (numero_serie_eletronica)
        REFERENCES eletronicas (numero_serie_eletronica)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_saass_hidrofone FOREIGN KEY (numero_serie_hidrofone)
        REFERENCES hidrofones (numero_serie_hidrofone)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_saass_pack_baterias FOREIGN KEY (numero_serie_pack_baterias)
        REFERENCES packs_baterias (numero_serie_pack_baterias)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_saass_tubo FOREIGN KEY (numero_serie_tubo)
        REFERENCES tubos (numero_serie_tubo)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

COMMENT ON TABLE saass IS 'Tabela de SAASS (sistemas completos)';
COMMENT ON COLUMN saass.numero_serie_saass IS 'Número de série único do SAASS (PK)';
COMMENT ON COLUMN saass.numero_serie_eletronica IS 'Chave estrangeira para eletrônica';
COMMENT ON COLUMN saass.numero_serie_hidrofone IS 'Chave estrangeira para hidrofone';
COMMENT ON COLUMN saass.numero_serie_pack_baterias IS 'Chave estrangeira para pack de baterias';
COMMENT ON COLUMN saass.numero_serie_tubo IS 'Chave estrangeira para tubo';
COMMENT ON COLUMN saass.profundidade_metros IS 'Profundidade máxima em metros';
COMMENT ON COLUMN saass.data_fabricacao IS 'Data de fabricação do SAASS';
COMMENT ON COLUMN saass.data_atualizacao IS 'Data e hora da última atualização (UTC)';

-- Tabela 6: Lançamentos
CREATE TABLE IF NOT EXISTS lancamentos (
    numero_lancamento INTEGER PRIMARY KEY,
    descricao TEXT
);

COMMENT ON TABLE lancamentos IS 'Tabela de lançamentos (missões)';
COMMENT ON COLUMN lancamentos.numero_lancamento IS 'Número do lançamento (PK)';
COMMENT ON COLUMN lancamentos.descricao IS 'Descrição opcional do lançamento';

-- Tabela 7: Lançamento SAASS
CREATE TABLE IF NOT EXISTS lancamentos_saass (
    id_lancamento_saass BIGSERIAL PRIMARY KEY,
    numero_serie_saass TEXT NOT NULL,
    numero_lancamento INTEGER NOT NULL,
    CONSTRAINT fk_lancamentos_saass_saass FOREIGN KEY (numero_serie_saass)
        REFERENCES saass (numero_serie_saass)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_lancamentos_saass_lancamento FOREIGN KEY (numero_lancamento)
        REFERENCES lancamentos (numero_lancamento)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

COMMENT ON TABLE lancamentos_saass IS 'Tabela de associação entre lançamentos e SAASS';
COMMENT ON COLUMN lancamentos_saass.id_lancamento_saass IS 'ID único da associação (PK)';
COMMENT ON COLUMN lancamentos_saass.numero_serie_saass IS 'Chave estrangeira para SAASS';
COMMENT ON COLUMN lancamentos_saass.numero_lancamento IS 'Chave estrangeira para lançamento';

-- Tabela 8: Entrega Lançamento
CREATE TABLE IF NOT EXISTS entregas_lancamentos (
    id_entrega_lancamento BIGSERIAL PRIMARY KEY,
    id_lancamento_saass BIGINT NOT NULL,
    responsavel_entrega TEXT NOT NULL,
    data_hora_entrega TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_entregas_lancamentos_lancamento_saass FOREIGN KEY (id_lancamento_saass)
        REFERENCES lancamentos_saass (id_lancamento_saass)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

COMMENT ON TABLE entregas_lancamentos IS 'Tabela de entregas de SAASS em lançamentos';
COMMENT ON COLUMN entregas_lancamentos.id_entrega_lancamento IS 'ID único da entrega (PK)';
COMMENT ON COLUMN entregas_lancamentos.id_lancamento_saass IS 'Chave estrangeira para lançamento SAASS';
COMMENT ON COLUMN entregas_lancamentos.responsavel_entrega IS 'Nome completo do responsável pela entrega';
COMMENT ON COLUMN entregas_lancamentos.data_hora_entrega IS 'Data e hora da entrega (UTC)';

-- Tabela 9: Retorno Lançamento
CREATE TABLE IF NOT EXISTS retornos_lancamentos (
    id_retorno_lancamento BIGSERIAL PRIMARY KEY,
    id_lancamento_saass BIGINT NOT NULL,
    responsavel_retorno TEXT NOT NULL,
    data_hora_retorno TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_retornos_lancamentos_lancamento_saass FOREIGN KEY (id_lancamento_saass)
        REFERENCES lancamentos_saass (id_lancamento_saass)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

COMMENT ON TABLE retornos_lancamentos IS 'Tabela de retornos de SAASS após lançamentos';
COMMENT ON COLUMN retornos_lancamentos.id_retorno_lancamento IS 'ID único do retorno (PK)';
COMMENT ON COLUMN retornos_lancamentos.id_lancamento_saass IS 'Chave estrangeira para lançamento SAASS';
COMMENT ON COLUMN retornos_lancamentos.responsavel_retorno IS 'Nome completo do responsável pelo retorno';
COMMENT ON COLUMN retornos_lancamentos.data_hora_retorno IS 'Data e hora do retorno (UTC)';

-- ============================================
-- Índices para melhorar performance de joins
-- ============================================

-- Índices para tabela saass (FKs)
CREATE INDEX IF NOT EXISTS idx_saass_eletronica ON saass (numero_serie_eletronica);
CREATE INDEX IF NOT EXISTS idx_saass_hidrofone ON saass (numero_serie_hidrofone);
CREATE INDEX IF NOT EXISTS idx_saass_pack_baterias ON saass (numero_serie_pack_baterias);
CREATE INDEX IF NOT EXISTS idx_saass_tubo ON saass (numero_serie_tubo);

-- Índices para tabela lancamentos_saass (FKs)
CREATE INDEX IF NOT EXISTS idx_lancamentos_saass_saass ON lancamentos_saass (numero_serie_saass);
CREATE INDEX IF NOT EXISTS idx_lancamentos_saass_lancamento ON lancamentos_saass (numero_lancamento);

-- Índices para tabela entregas_lancamentos (FK)
CREATE INDEX IF NOT EXISTS idx_entregas_lancamentos_lancamento_saass ON entregas_lancamentos (id_lancamento_saass);

-- Índices para tabela retornos_lancamentos (FK)
CREATE INDEX IF NOT EXISTS idx_retornos_lancamentos_lancamento_saass ON retornos_lancamentos (id_lancamento_saass);

-- Índices para campos de data (para ordenação e filtros)
CREATE INDEX IF NOT EXISTS idx_saass_data_fabricacao ON saass (data_fabricacao);
CREATE INDEX IF NOT EXISTS idx_entregas_data_hora ON entregas_lancamentos (data_hora_entrega);
CREATE INDEX IF NOT EXISTS idx_retornos_data_hora ON retornos_lancamentos (data_hora_retorno);

-- ============================================
-- Inserção de dados de exemplo (opcional)
-- ============================================

-- Inserir alguns dados de exemplo para testes
-- (comente ou remova em produção)

-- INSERT INTO eletronicas (numero_serie_eletronica, versao_eletronica, firmware, data_fabricacao) VALUES
-- ('ELEC-001', 'v6.0.2', 'FW-1.2.3', '2025-01-15'),
-- ('ELEC-002', 'v6.0.2', 'FW-1.2.4', '2025-02-20');

-- INSERT INTO hidrofones (numero_serie_hidrofone, versao_hidrofone, data_fabricacao) VALUES
-- ('HYDRO-001', 'v6.0.2', '2025-01-10'),
-- ('HYDRO-002', 'v6.0.2', '2025-02-15');

-- INSERT INTO packs_baterias (numero_serie_pack_baterias, versao_pack_baterias, data_fabricacao) VALUES
-- ('BATT-001', 'v1.0', '2025-01-05'),
-- ('BATT-002', 'v1.0', '2025-02-10');

-- INSERT INTO tubos (numero_serie_tubo, versao_tubo, profundidade_metros, data_fabricacao) VALUES
-- ('TUBE-001', 'v6.0.2', 1000, '2025-01-20'),
-- ('TUBE-002', 'v6.0.2', 1500, '2025-02-25');

-- INSERT INTO saass (numero_serie_saass, numero_serie_eletronica, numero_serie_hidrofone, numero_serie_pack_baterias, numero_serie_tubo, profundidade_metros, data_fabricacao) VALUES
-- ('SAASS-001', 'ELEC-001', 'HYDRO-001', 'BATT-001', 'TUBE-001', 1000, '2025-03-01'),
-- ('SAASS-002', 'ELEC-002', 'HYDRO-002', 'BATT-002', 'TUBE-002', 1500, '2025-03-15');

-- INSERT INTO lancamentos (numero_lancamento, descricao) VALUES
-- (134, 'Lançamento de teste no Atlântico Sul'),
-- (135, 'Lançamento operacional no Pacífico');

-- INSERT INTO lancamentos_saass (numero_serie_saass, numero_lancamento) VALUES
-- ('SAASS-001', 134),
-- ('SAASS-002', 135);

-- INSERT INTO entregas_lancamentos (id_lancamento_saass, responsavel_entrega, data_hora_entrega) VALUES
-- (1, 'João Silva', '2026-01-10 14:30:00 UTC'),
-- (2, 'Maria Santos', '2026-01-12 10:15:00 UTC');

-- INSERT INTO retornos_lancamentos (id_lancamento_saass, responsavel_retorno, data_hora_retorno) VALUES
-- (1, 'Carlos Oliveira', '2026-01-20 16:45:00 UTC'),
-- (2, 'Ana Costa', '2026-01-22 09:30:00 UTC');
