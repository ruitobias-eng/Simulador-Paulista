# Simulador Paulista de Matemática 🧮

O **Simulador Paulista de Matemática** é uma plataforma educacional interativa projetada para apoiar educadores e estudantes na exploração, diagnóstico e consolidação das habilidades matemáticas alinhadas ao **Currículo Paulista**.

O aplicativo atende a toda a jornada do **Ensino Fundamental** (do 1º ao 9º ano) e do **Ensino Médio** (do 1º ao 3º ano), oferecendo recursos interativos de aprendizagem e ferramentas pedagógicas de ponta baseadas em Inteligência Artificial.

---

## 🚀 Principais Funcionalidades

### 🎓 Para Estudantes (Arena do Conhecimento)
* **Simulados Personalizados**: Escolha o ano escolar e a unidade temática para resolver questões contextualizadas geradas em tempo real.
* **Suporte Visual Interativo**: Questões com gráficos, tabelas e representações visuais dinâmicas (como círculos fracionários, organizações retangulares e contadores animados).
* **Explicação Detalhada**: Correção instantânea com justificativas passo a passo para reforçar o aprendizado de forma construtiva.

### 👩‍🏫 Para Professores (Painel Pedagógico)
* **Consulta do Currículo Paulista**: Catálogo integrado de habilidades pedagógicas oficiais de todos os anos da Educação Básica paulista.
* **Gerador de Avaliação Diagnóstica**: Crie provas inteiras em formato misto (aberta & múltipla escolha), com gabarito automático, prontas para impressão ou salvamento em PDF.
* **Elaborador de Plano de Aula**: Estruture planejamentos didáticos completos (com tempo, recursos, metodologias ativas e avaliações) com o auxílio do Gemini.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando uma arquitetura full-stack moderna e de alta performance:

* **Frontend**: React 18, Vite, TypeScript, Tailwind CSS e Framer Motion (para transições fluidas).
* **Backend**: Node.js com Express para orquestração de APIs e entrega estável de ativos.
* **Inteligência Artificial**: **Gemini 3.5 Flash** (via SDK oficial `@google/genai`) para a geração dinâmica e precisa de materiais didáticos e questões personalizadas.

---

## 📦 Estrutura de Diretórios

```bash
├── server.ts                 # Servidor Express com rotas de API e integração com Gemini
├── src/
│   ├── App.tsx               # Componente principal e fluxo de navegação
│   ├── main.tsx              # Ponto de entrada do React
│   ├── index.css             # Estilos globais e configurações do Tailwind
│   ├── types.ts              # Definições de tipos TypeScript compartilhadas
│   ├── data/
│   │   ├── habilidades.ts    # Banco de dados das habilidades do Currículo Paulista (EF/EM)
│   │   └── fallbackQuestions.ts # Banco de questões offline para resiliência
│   ├── components/
│   │   ├── QuizArena.tsx     # Interface de simulados e representações visuais
│   │   ├── StudentDashboard.tsx # Painel de controle do estudante
│   │   └── TeacherDashboard.tsx # Ferramentas pedagógicas do professor
│   └── lib/
│       └── gemini.ts         # Wrapper do SDK da Google Gen AI para chamadas seguras
```

---

## ⚙️ Instalação e Execução Local

### Pré-requisitos
* Node.js (v18+) ou Bun instalado em sua máquina.
* Uma chave de API do Google Gemini (obtenha em [Google AI Studio](https://aistudio.google.com/)).

### Passos para Inicialização

1. **Clonar o Repositório**
   ```bash
   git clone <url-do-repositorio>
   cd simulador-paulista-matematica
   ```

2. **Instalar Dependências**
   ```bash
   npm install
   ```

3. **Configurar Variáveis de Ambiente**
   Crie um arquivo `.env` na raiz do projeto com base no arquivo `.env.example`:
   ```env
   GEMINI_API_KEY=sua_chave_de_api_aqui
   ```

4. **Executar em Modo de Desenvolvimento**
   ```bash
   npm run dev
   ```
   O servidor estará disponível localmente em `http://localhost:3000`.

5. **Gerar Versão de Produção**
   ```bash
   npm run build
   npm start
   ```

---

## 📝 Licença

Este projeto é desenvolvido para fins educacionais de fomento e suporte à rede pública e privada de ensino sob as diretrizes do Currículo Paulista.
