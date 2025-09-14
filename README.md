# Estrutura de Dados de Login e Usuário

## Etapas

- **Etapa 1 (Login S1)**
- **Etapa 2 (Login S2 / Usuário)**
- **Etapa 3 (Token QR)**

## Comparação de Campos

| Etapa | Campo Original           | Campo Ofuscado |
|-------|-------------------------|----------------|
| 1     | isLoginS1Loading        | ils1l          |
| 1     | isLoginS1Error          | ils1e          |
| 1     | isLoginS1Valid          | ils1v          |
| 2     | nome                    | n              |
| 2     | numSerie                | ns             |
| 2     | tokenType               | tt             |
| 2     | isLoginS2Loading        | ils2l          |
| 2     | isLoginS2Error          | ils2e          |
| 2     | isLoginS2Valid          | ils2v          |
| 3     | isTokenQrLoading        | ils3l          |
| 3     | isTokenQrError          | ils3e          |
