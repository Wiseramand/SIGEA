/**
 * SIGEA Legal AI — Motor de Demonstração Determinístico
 * 
 * Cenários predefinidos vinculados aos dados fictícios de MOCK_CASES, MOCK_ACTIVITIES,
 * MOCK_DOCUMENTS, MOCK_DEADLINES e MOCK_FEES.
 * 
 * IMPORTANTE: Nenhuma informação é enviada para serviços externos.
 * Todas as respostas são determinísticas e baseadas exclusivamente nos dados simulados.
 */

export type AiDemoCategory = 'SUMMARY' | 'DOCUMENT_ANALYSIS' | 'DRAFT' | 'WORK_ORGANIZATION';

export interface AiSuggestion {
  id: string;
  label: string;
  icon: string; // Lucide icon name
  category: AiDemoCategory;
  description: string;
}

export interface AiResponseSection {
  title: string;
  content: string;
  sourceLabel: string; // e.g. "Dados do processo", "Histórico de actividades", "Documento fictício"
  sourceType: 'CASE_DATA' | 'ACTIVITY_LOG' | 'MOCK_DOCUMENT' | 'DEADLINE_DATA' | 'FEE_DATA' | 'AI_SUGGESTION';
  isActionable?: boolean;
  needsHumanReview?: boolean;
}

export interface AiDemoResponse {
  scenarioId: string;
  title: string;
  category: AiDemoCategory;
  sections: AiResponseSection[];
  disclaimers: string[];
}

// ─── Quick Action Suggestions ─────────────────────────────────────────────────

export const AI_QUICK_SUGGESTIONS: AiSuggestion[] = [
  {
    id: 'summary',
    label: 'Resumir o Processo',
    icon: 'FileText',
    category: 'SUMMARY',
    description: 'Apresentar factos registados, estado actual e próximas diligências'
  },
  {
    id: 'doc-analysis',
    label: 'Analisar Documentos',
    icon: 'Search',
    category: 'DOCUMENT_ANALYSIS',
    description: 'Extrair informações dos documentos juntados ao dossier'
  },
  {
    id: 'draft-client',
    label: 'Rascunho para Cliente',
    icon: 'Mail',
    category: 'DRAFT',
    description: 'Preparar comunicação ao cliente sobre o estado do processo'
  },
  {
    id: 'draft-petition',
    label: 'Modelo de Requerimento',
    icon: 'FilePlus',
    category: 'DRAFT',
    description: 'Estruturar modelo inicial de peça processual'
  },
  {
    id: 'work-tasks',
    label: 'Organizar Tarefas',
    icon: 'ListChecks',
    category: 'WORK_ORGANIZATION',
    description: 'Sugerir tarefas e pontos pendentes a partir do processo'
  },
  {
    id: 'meeting-prep',
    label: 'Preparar Reunião',
    icon: 'Users',
    category: 'WORK_ORGANIZATION',
    description: 'Resumo executivo e questões para reunião com cliente'
  }
];

// ─── Scenario Responses by Case ───────────────────────────────────────────────

export function getDemoResponse(scenarioId: string, caseId: string): AiDemoResponse | null {
  const scenarioMap = DEMO_RESPONSES[caseId];
  if (!scenarioMap) return getFallbackResponse(scenarioId, caseId);
  const response = scenarioMap[scenarioId];
  if (!response) return getFallbackResponse(scenarioId, caseId);
  return response;
}

function getFallbackResponse(scenarioId: string, caseId: string): AiDemoResponse {
  const categoryMap: Record<string, AiDemoCategory> = {
    'summary': 'SUMMARY',
    'doc-analysis': 'DOCUMENT_ANALYSIS',
    'draft-client': 'DRAFT',
    'draft-petition': 'DRAFT',
    'work-tasks': 'WORK_ORGANIZATION',
    'meeting-prep': 'WORK_ORGANIZATION'
  };

  return {
    scenarioId,
    title: 'Cenário Demonstrativo',
    category: categoryMap[scenarioId] || 'SUMMARY',
    sections: [
      {
        title: 'Modo de Demonstração',
        content: `O cenário solicitado ("${scenarioId}") está disponível exclusivamente para os processos fictícios principais do protótipo SIGEA.\n\nNo modo de demonstração, o assistente jurídico apresenta respostas predefinidas baseadas exclusivamente nos dados simulados.\n\nEsta funcionalidade demonstra como o SIGEA Legal AI poderá futuramente ajudar advogados a organizar, resumir e preparar documentos — sempre com revisão humana obrigatória.`,
        sourceLabel: 'Sistema SIGEA (demonstração)',
        sourceType: 'AI_SUGGESTION',
        needsHumanReview: false
      }
    ],
    disclaimers: [
      'Conteúdo demonstrativo — não constitui aconselhamento jurídico.',
      'Nenhuma informação foi enviada para serviços externos.',
      `Processo de referência: ${caseId}`
    ]
  };
}

// ─── CASE-001: Ação Declarativa c/c Indemnização ──────────────────────────────

const CASE_001_RESPONSES: Record<string, AiDemoResponse> = {
  'summary': {
    scenarioId: 'summary',
    title: 'Resumo do Processo 0284/24-C',
    category: 'SUMMARY',
    sections: [
      {
        title: 'Identificação e Estado Actual',
        content: `**Processo nº 0284/24-C** — Ação Declarativa de Rescisão Contratual c/c Indemnização por Danos Patrimoniais\n\n• **Tribunal:** Sala do Cível e Comercial do Tribunal da Comarca de Luanda, 2ª Secção\n• **Fase actual:** Instrução\n• **Prioridade:** CRÍTICA\n• **Juiz titular:** Dr. Valdemar Pascoal\n• **Valor da causa:** 145.000.000,00 Kz\n\n**Autor:** Kwanza Investimentos e Participações SA (representado por Dr. Rui Falcão de Carvalho, OAA 1420)\n**Réu:** Atlas Telecomunicações e Redes SA (representado por Dr. Silvestre Pedro, OAA 0984)`,
        sourceLabel: 'Dados gerais do processo',
        sourceType: 'CASE_DATA'
      },
      {
        title: 'Síntese do Litígio',
        content: `A acção decorre de incumprimento culposo de um contrato de fornecimento de infraestrutura de telecomunicações submarinas. A ré Atlas Telecomunicações e Redes SA contestou por impugnação especificada, alegando caso de força maior na ruptura do cabo submarino de fibra óptica.\n\nO tribunal proferiu despacho saneador e fixou a base instrutória, notificando as partes para apresentação do rol de testemunhas e quesitos periciais.`,
        sourceLabel: 'Descrição e histórico de actividades',
        sourceType: 'ACTIVITY_LOG'
      },
      {
        title: 'Próximos Passos Identificados',
        content: `1. **Prazo crítico em 24/10/2026 (15h30):** Apresentação de Rol de Testemunhas e Requerimento Pericial — prazo peremptório nos termos do CPC angolano.\n2. Preparação da minuta do requerimento de exame pericial informático (tarefa em progresso, atribuída ao estagiário Nzinga Luvumbo).\n3. Alinhamento dos quesitos técnicos a submeter ao perito nomeado.`,
        sourceLabel: 'Prazos e tarefas registados',
        sourceType: 'DEADLINE_DATA',
        isActionable: true
      },
      {
        title: '⚠ Pontos que Requerem Confirmação',
        content: `• Confirmar se o rol de testemunhas já foi finalizado pelo sócio patrono.\n• Verificar se o cliente Kwanza Investimentos aprovou os quesitos propostos.\n• Confirmar o valor actualizado do pedido indemnizatório face a eventuais danos emergentes adicionais.\n• Verificar se a perícia informática requerida exige nomeação de perito externo ao tribunal.`,
        sourceLabel: 'Sugestão gerada para demonstração',
        sourceType: 'AI_SUGGESTION',
        needsHumanReview: true
      }
    ],
    disclaimers: [
      'Conteúdo demonstrativo baseado exclusivamente nos dados fictícios do protótipo.',
      'Não substitui a análise jurídica do advogado responsável.',
      'Nenhuma informação foi enviada para serviços externos.'
    ]
  },

  'doc-analysis': {
    scenarioId: 'doc-analysis',
    title: 'Análise de Documentos — Proc. 0284/24-C',
    category: 'DOCUMENT_ANALYSIS',
    sections: [
      {
        title: 'Documentos Identificados no Dossier',
        content: `Foram identificados **5 documentos** juntados ao processo:\n\n| # | Documento | Categoria | Versão | Visível ao Cliente |\n|---|-----------|-----------|--------|--------------------|\n| 1 | Petição Inicial Devidamente Distribuída | Petição | v1 | ✅ Sim |\n| 2 | Procuração Forense c/ Poderes Especiais | Mandato | v1 | ✅ Sim |\n| 3 | Contrato de Fornecimento Submarino Atlas | Contrato | v2 | ✅ Sim |\n| 4 | Contestação da Ré Atlas Telecomunicações | Prova | v1 | ❌ Não |\n| 5 | Minuta do Requerimento de Perícia Informática | Petição | v3 | ❌ Não |`,
        sourceLabel: 'Documentos registados no dossier',
        sourceType: 'MOCK_DOCUMENT'
      },
      {
        title: 'Informações Extraídas (Demonstrativo)',
        content: `**Do Contrato (doc-003, v2):**\n• Partes: Kwanza Investimentos e Participações SA ↔ Atlas Telecomunicações e Redes SA\n• Objecto: Fornecimento de infraestrutura de telecomunicações submarinas\n• Tipo de incumprimento alegado: ruptura do cabo submarino de fibra óptica\n\n**Da Contestação (doc-004):**\n• Defesa apresentada: Impugnação especificada\n• Argumento principal: Caso de força maior\n• Data de junção: 18/04/2024`,
        sourceLabel: 'Conteúdo simulado dos documentos fictícios',
        sourceType: 'MOCK_DOCUMENT'
      },
      {
        title: '⚠ Campos Ausentes ou a Verificar',
        content: `• O contrato está na versão 2 — verificar que alterações foram introduzidas entre versões.\n• A contestação do réu não está visível no portal do cliente — confirmar se deve ser partilhada.\n• A minuta de perícia (v3) está em progresso — confirmar aprovação pelo advogado responsável antes de submissão.\n• Não foi identificada certidão de registo comercial actualizada de nenhuma das partes.`,
        sourceLabel: 'Sugestão gerada para demonstração',
        sourceType: 'AI_SUGGESTION',
        needsHumanReview: true
      }
    ],
    disclaimers: [
      'Análise demonstrativa — os documentos referidos são fictícios.',
      'A extracção de conteúdo é simulada e não utiliza processamento de linguagem natural.',
      'Nenhuma informação foi enviada para serviços externos.'
    ]
  },

  'draft-client': {
    scenarioId: 'draft-client',
    title: 'Rascunho de Comunicação ao Cliente',
    category: 'DRAFT',
    sections: [
      {
        title: 'Comunicação ao Cliente — Rascunho para Revisão',
        content: `**PARA:** Dr. Baptista Sumbe (PCA)\nKwanza Investimentos e Participações SA\njuridico@kwanza-invest.ao\n\n**ASSUNTO:** Ponto de situação — Proc. nº 0284/24-C — Ação Declarativa c/c Indemnização\n\n---\n\nExmo. Senhor Dr. Baptista Sumbe,\n\nVimos, pela presente, informar V. Exa. sobre a evolução do processo judicial em referência.\n\nO Tribunal da Comarca de Luanda proferiu **despacho saneador e fixou a base instrutória**, o que constitui um avanço significativo na tramitação processual. As partes foram notificadas para apresentação do rol de testemunhas e requerimentos periciais.\n\nO **prazo para apresentação do rol de testemunhas e do requerimento de perícia informática termina em 24 de Outubro de 2026**, pelo que solicitamos a V. Exa. a confirmação dos quesitos técnicos anteriormente discutidos na reunião preparatória.\n\nA ré Atlas Telecomunicações e Redes SA apresentou contestação por impugnação especificada, alegando caso de força maior. A nossa equipa está a preparar os meios de prova adequados para demonstrar o incumprimento culposo.\n\nFicamos ao inteiro dispor para esclarecimentos adicionais.\n\nCom os melhores cumprimentos,\n\n**Dr. Rui Falcão de Carvalho**\nFALCÃO & ASSOCIADOS — Sociedade de Advogados, RL\nOAA 1420`,
        sourceLabel: 'Rascunho gerado para demonstração (requer revisão obrigatória)',
        sourceType: 'AI_SUGGESTION',
        isActionable: true,
        needsHumanReview: true
      },
      {
        title: '📋 Checklist de Revisão',
        content: `Antes de enviar, o advogado deve verificar:\n\n- [ ] Confirmar se o PCA é o interlocutor adequado ou se há procurador delegado.\n- [ ] Validar as datas e prazos mencionados.\n- [ ] Confirmar se a contestação do réu pode ser referida com este nível de detalhe.\n- [ ] Avaliar se o tom e a formalidade são adequados à relação com o cliente.\n- [ ] Adicionar referências a custos ou honorários se necessário.`,
        sourceLabel: 'Sugestão gerada para demonstração',
        sourceType: 'AI_SUGGESTION',
        needsHumanReview: true
      }
    ],
    disclaimers: [
      'RASCUNHO — Requer revisão obrigatória do advogado responsável antes de qualquer envio.',
      'O conteúdo é demonstrativo e não constitui aconselhamento jurídico.',
      'O SIGEA não verifica automaticamente a legislação em vigor.',
      'Nenhuma informação foi enviada para serviços externos.'
    ]
  },

  'draft-petition': {
    scenarioId: 'draft-petition',
    title: 'Modelo de Requerimento — Perícia Informática',
    category: 'DRAFT',
    sections: [
      {
        title: 'Estrutura do Requerimento (Modelo Demonstrativo)',
        content: `**Meritíssimo Juiz de Direito da 2ª Secção do Cível e Comercial**\n**Tribunal da Comarca de Luanda**\n\n**Proc. nº 0284/24-C**\n**Autor:** Kwanza Investimentos e Participações SA\n**Réu:** Atlas Telecomunicações e Redes SA\n\n---\n\n**REQUERIMENTO DE PROVA PERICIAL INFORMÁTICA**\n\n**KWANZA INVESTIMENTOS E PARTICIPAÇÕES SA**, autor nos presentes autos, devidamente representado por mandatário constituído nos autos, vem muito respeitosamente, requerer a V. Exa. a realização de perícia informática, nos termos e para os efeitos do disposto no Código de Processo Civil, e para tanto expõe:\n\n**I. OBJECTO DA PERÍCIA**\n\n[Descrever o objecto técnico da perícia — verificação dos registos de manutenção e operação do cabo submarino de fibra óptica]\n\n**II. QUESITOS**\n\n1. [Quesito sobre a documentação técnica de manutenção]\n2. [Quesito sobre os relatórios de incidentes]\n3. [Quesito sobre o cumprimento dos parâmetros contratuais]\n4. [Quesito sobre a causa técnica da ruptura]\n\n**III. INDICAÇÃO DE PERITO**\n\n[Indicar perito ou solicitar nomeação pelo tribunal]\n\n**Termos em que pede deferimento.**\n\nLuanda, __ de __________ de 2026\n\n**Dr. Rui Falcão de Carvalho**\nOAA 1420`,
        sourceLabel: 'Modelo estrutural gerado para demonstração (requer preenchimento e revisão)',
        sourceType: 'AI_SUGGESTION',
        isActionable: true,
        needsHumanReview: true
      },
      {
        title: '⚠ Notas do Assistente',
        content: `• Os campos entre [parêntesis rectos] devem ser preenchidos pelo advogado.\n• Os artigos de lei específicos devem ser confirmados — o assistente não verifica automaticamente a legislação angolana em vigor.\n• A estrutura segue o formato habitual de requerimentos no contencioso cível angolano, mas deve ser adaptada às regras do tribunal específico.\n• Este é apenas um modelo inicial para facilitar a preparação — não substitui a redacção jurídica profissional.`,
        sourceLabel: 'Sugestão gerada para demonstração',
        sourceType: 'AI_SUGGESTION',
        needsHumanReview: true
      }
    ],
    disclaimers: [
      'MODELO DEMONSTRATIVO — Não utilizar sem revisão e adaptação completa pelo advogado.',
      'O assistente não verifica automaticamente a legislação em vigor nem cita jurisprudência.',
      'Nenhuma informação foi enviada para serviços externos.'
    ]
  },

  'work-tasks': {
    scenarioId: 'work-tasks',
    title: 'Organização de Tarefas — Proc. 0284/24-C',
    category: 'WORK_ORGANIZATION',
    sections: [
      {
        title: 'Tarefas Pendentes Identificadas',
        content: `Com base nos registos do processo, foram identificadas as seguintes tarefas:\n\n**🔴 URGENTE (prazo 24/10/2026)**\n1. Finalizar e submeter o Rol de Testemunhas\n2. Submeter o Requerimento de Perícia Informática\n\n**🟡 EM PROGRESSO**\n3. Redigir minuta do requerimento de exame pericial informático — *atribuída a Nzinga Luvumbo (Estagiário)*\n\n**🔵 A CONFIRMAR**\n4. Obter aprovação do cliente para os quesitos técnicos propostos\n5. Verificar necessidade de certidão comercial actualizada das partes`,
        sourceLabel: 'Prazos e tarefas registados no protótipo',
        sourceType: 'DEADLINE_DATA',
        isActionable: true
      },
      {
        title: 'Tarefas Sugeridas (Demonstração)',
        content: `Com base na fase processual actual (Instrução), o assistente sugere considerar:\n\n6. **Preparar rol de documentos** a juntar em sede de instrução\n7. **Solicitar parecer técnico prévio** sobre a viabilidade da perícia informática proposta\n8. **Actualizar o cliente** sobre o estado do processo e próximos passos\n9. **Rever os prazos processuais** subsequentes à fase instrutória\n10. **Agendar reunião interna** para alinhamento da equipa sobre a estratégia de julgamento`,
        sourceLabel: 'Sugestões geradas para demonstração',
        sourceType: 'AI_SUGGESTION',
        needsHumanReview: true
      },
      {
        title: 'Resumo Financeiro Associado',
        content: `• Honorários totais acordados: **19.750.000,00 Kz**\n• Já liquidado: **12.500.000,00 Kz**\n• Saldo pendente: **7.250.000,00 Kz** (quota litis condicionada ao trânsito em julgado)\n• Despesas forenses registadas: **995.000,00 Kz** (850.000 reembolsados + 145.000 pendentes)`,
        sourceLabel: 'Dados financeiros do processo',
        sourceType: 'FEE_DATA'
      }
    ],
    disclaimers: [
      'As tarefas sugeridas são demonstrativas e devem ser validadas pelo advogado.',
      'Nenhuma informação foi enviada para serviços externos.'
    ]
  },

  'meeting-prep': {
    scenarioId: 'meeting-prep',
    title: 'Preparação de Reunião — Proc. 0284/24-C',
    category: 'WORK_ORGANIZATION',
    sections: [
      {
        title: 'Briefing Executivo para Reunião com o Cliente',
        content: `**REUNIÃO: Kwanza Investimentos e Participações SA**\n**Interlocutor:** Dr. Baptista Sumbe (PCA)\n**Processo:** 0284/24-C — Ação Declarativa c/c Indemnização\n\n---\n\n**1. Estado Actual do Processo**\nO tribunal proferiu despacho saneador e fixou a base instrutória. O processo encontra-se na fase de instrução, com prazo peremptório para apresentação de provas a decorrer.\n\n**2. Decisões Pendentes**\n• Aprovação dos quesitos técnicos para a perícia informática\n• Indicação de testemunhas a arrolar pelo autor\n• Posição sobre eventual proposta de acordo extrajudicial (se aplicável)\n\n**3. Pontos de Risco**\n• Prazo peremptório em **24/10/2026** — preclusão em caso de não cumprimento\n• A ré invocou força maior — necessário reforçar a prova do nexo causal\n• Valor em causa: **145.000.000,00 Kz** — relevância financeira elevada`,
        sourceLabel: 'Dados do processo e histórico de actividades',
        sourceType: 'CASE_DATA'
      },
      {
        title: 'Questões Sugeridas para a Reunião',
        content: `O advogado deve considerar abordar os seguintes temas com o cliente:\n\n1. O cliente tem documentação técnica interna que comprove a causa humana (vs. força maior) da ruptura do cabo?\n2. Existem comunicações escritas entre as partes anteriores à propositura da acção?\n3. O valor do pedido indemnizatório (145M Kz) reflecte os danos reais actualizados?\n4. O cliente está aberto a uma solução negociada, ou pretende o julgamento integral?\n5. Há testemunhas técnicas dentro da empresa que possam depor sobre os factos?`,
        sourceLabel: 'Sugestões geradas para demonstração',
        sourceType: 'AI_SUGGESTION',
        needsHumanReview: true
      }
    ],
    disclaimers: [
      'Briefing demonstrativo — deve ser complementado com a análise completa do advogado.',
      'As questões sugeridas são indicativas e não exaustivas.',
      'Nenhuma informação foi enviada para serviços externos.'
    ]
  }
};

// ─── CASE-002: Impugnação de Despedimento Coletivo ────────────────────────────

const CASE_002_RESPONSES: Record<string, AiDemoResponse> = {
  'summary': {
    scenarioId: 'summary',
    title: 'Resumo do Processo 1105/23-TRAB',
    category: 'SUMMARY',
    sections: [
      {
        title: 'Identificação e Estado Actual',
        content: `**Processo nº 1105/23-TRAB** — Ação de Impugnação de Despedimento Coletivo e Reintegração\n\n• **Tribunal:** Sala de Trabalho do Tribunal da Comarca de Luanda, 1ª Secção\n• **Fase actual:** Audiência de Discussão e Julgamento\n• **Prioridade:** ALTA\n• **Juíza titular:** Dra. Analtina Lourenço\n• **Valor da causa:** 42.000.000,00 Kz\n\n**Autor:** Comissão Sindical dos Estivadores do Porto de Luanda (representada por Dr. João Ganga, OAA 2110)\n**Réu:** Baía Azul Logística & Navegação Lda (representado por Dr. Mateus Afonso Quaresma, OAA 3410)`,
        sourceLabel: 'Dados gerais do processo',
        sourceType: 'CASE_DATA'
      },
      {
        title: 'Contexto do Litígio',
        content: `O processo versa sobre despedimento colectivo impugnado pela comissão sindical dos estivadores. A audiência de discussão e julgamento foi designada para inquirição de 6 testemunhas arroladas pelas partes, com alegações orais sobre o cumprimento do pré-aviso legal.\n\nO escritório Falcão & Associados representa o réu (Baía Azul) na qualidade de empregador.`,
        sourceLabel: 'Histórico de actividades',
        sourceType: 'ACTIVITY_LOG'
      },
      {
        title: 'Próximos Passos',
        content: `1. **Prazo 28/10/2026 (12h00):** Alegações Finais Escritas — sistematização de prova testemunhal produzida na audiência.\n2. Organizar a pasta física de documentos para a audiência (tarefa pendente atribuída ao estagiário).\n3. Preparar alegações finais sobre o processo disciplinar prévio.`,
        sourceLabel: 'Prazos registados no protótipo',
        sourceType: 'DEADLINE_DATA',
        isActionable: true
      }
    ],
    disclaimers: [
      'Conteúdo demonstrativo baseado nos dados fictícios do protótipo.',
      'Nenhuma informação foi enviada para serviços externos.'
    ]
  },

  'draft-client': {
    scenarioId: 'draft-client',
    title: 'Comunicação ao Cliente — Baía Azul Logística',
    category: 'DRAFT',
    sections: [
      {
        title: 'Rascunho de Comunicação — Para Revisão',
        content: `**PARA:** Eng. Domingos Chitapa (Direcção)\nBaía Azul Logística & Navegação Lda\ndirecao@baiaazul-log.ao\n\n**ASSUNTO:** Ponto de situação — Proc. nº 1105/23-TRAB — Impugnação de Despedimento Coletivo\n\n---\n\nExmo. Senhor Eng. Domingos Chitapa,\n\nInformamos que o Tribunal designou data para a audiência de discussão e julgamento, com inquirição de testemunhas arroladas por ambas as partes.\n\nO prazo para apresentação das **alegações finais escritas** termina em **28 de Outubro de 2026**. A nossa equipa está a sistematizar a prova testemunhal produzida, com enfoque na demonstração do cumprimento dos procedimentos legais relativos ao pré-aviso do despedimento colectivo.\n\nSolicitamos a V. Exa. a disponibilidade para uma reunião de alinhamento sobre a argumentação final.\n\nCom os melhores cumprimentos,\n\n**Dr. Mateus Afonso Quaresma**\nFALCÃO & ASSOCIADOS — Sociedade de Advogados, RL\nOAA 3410`,
        sourceLabel: 'Rascunho gerado para demonstração',
        sourceType: 'AI_SUGGESTION',
        isActionable: true,
        needsHumanReview: true
      }
    ],
    disclaimers: [
      'RASCUNHO — Requer revisão pelo advogado responsável.',
      'Conteúdo demonstrativo.',
      'Nenhuma informação foi enviada para serviços externos.'
    ]
  },

  'work-tasks': {
    scenarioId: 'work-tasks',
    title: 'Organização de Tarefas — Proc. 1105/23-TRAB',
    category: 'WORK_ORGANIZATION',
    sections: [
      {
        title: 'Tarefas Identificadas',
        content: `**🟠 URGENTE**\n1. Organizar pasta física de documentos para audiência — *atribuída a Nzinga Luvumbo (Estagiário), prazo 25/10/2026*\n\n**🟡 PRÓXIMO PRAZO (28/10/2026)**\n2. Preparar e submeter Alegações Finais Escritas\n3. Sistematizar prova testemunhal para fundamentação\n\n**🔵 SUGERIDO**\n4. Agendar reunião com o cliente para alinhamento final\n5. Preparar notas de arguição complementar sobre o pré-aviso legal\n6. Verificar avença mensal — saldo de 1.600.000 Kz pendente`,
        sourceLabel: 'Tarefas e prazos registados',
        sourceType: 'DEADLINE_DATA',
        isActionable: true
      }
    ],
    disclaimers: [
      'Sugestões demonstrativas.',
      'Nenhuma informação foi enviada para serviços externos.'
    ]
  }
};

// ─── CASE-003: Inventário e Partilha ──────────────────────────────────────────

const CASE_003_RESPONSES: Record<string, AiDemoResponse> = {
  'summary': {
    scenarioId: 'summary',
    title: 'Resumo do Processo 0078/25-FAM',
    category: 'SUMMARY',
    sections: [
      {
        title: 'Identificação e Estado Actual',
        content: `**Processo nº 0078/25-FAM** — Inventário Facultativo e Partilha de Bens Móveis e Imóveis\n\n• **Tribunal:** Sala de Família e Sucessões do Tribunal da Comarca de Belas\n• **Fase actual:** Fase Inicial\n• **Prioridade:** Normal\n• **Juíza:** Dra. Florinda Simão\n• **Valor:** 85.000.000,00 Kz\n• **🔒 Segredo de Justiça**\n\n**Requerente:** Maria Esperança Van-Dúnem (Cabeça de Casal)\n**Interessados:** Herdeiros Co-interessados Van-Dúnem`,
        sourceLabel: 'Dados gerais do processo',
        sourceType: 'CASE_DATA'
      },
      {
        title: 'Contexto',
        content: `Trata-se de arrolamento de acervo patrimonial hereditário incluindo imóveis no Miramar, Talatona e contas bancárias. O tribunal expediu cartas precatórias para citação pessoal dos herdeiros residentes nos municípios de Belas e Viana.\n\nA advogada responsável Dra. Kieza dos Santos Manuel já completou a revisão das certidões de nascimento dos herdeiros.`,
        sourceLabel: 'Histórico de actividades',
        sourceType: 'ACTIVITY_LOG'
      },
      {
        title: 'Próximos Passos',
        content: `1. **Prazo 05/11/2026 (16h00):** Junção de Certidões Prediais da Conservatória do Registo Predial de Luanda\n2. Verificar resposta às cartas precatórias de citação dos herdeiros\n3. Preparar o mapa de partilha preliminar`,
        sourceLabel: 'Prazos registados',
        sourceType: 'DEADLINE_DATA',
        isActionable: true
      }
    ],
    disclaimers: [
      'Processo sujeito a segredo de justiça — informação restrita.',
      'Conteúdo demonstrativo.',
      'Nenhuma informação foi enviada para serviços externos.'
    ]
  }
};

// ─── CASE-004: Execução Ordinária ─────────────────────────────────────────────

const CASE_004_RESPONSES: Record<string, AiDemoResponse> = {
  'summary': {
    scenarioId: 'summary',
    title: 'Resumo do Processo 0931/24-EXEC',
    category: 'SUMMARY',
    sections: [
      {
        title: 'Identificação e Estado Actual',
        content: `**Processo nº 0931/24-EXEC** — Execução Ordinária de Título de Crédito (Livrança c/ Aval Pessoal)\n\n• **Tribunal:** Secção Cível do Tribunal da Comarca de Benguela, 2ª Secção\n• **Fase actual:** Execução / Penhora\n• **Prioridade:** ALTA\n• **Juiz:** Dr. Abelardo Cassoma\n• **Valor:** 68.000.000,00 Kz\n\n**Exequente:** Construções & Obras Civis Benguela Lda\n**Executado:** Consórcio Minerador do Sul SA`,
        sourceLabel: 'Dados gerais do processo',
        sourceType: 'CASE_DATA'
      },
      {
        title: 'Estado da Execução',
        content: `A execução encontra-se na fase de penhora de contas bancárias e créditos de empreitada retidos no BNA e bancos comerciais. Foi registada uma deslocação forense e custas operacionais de solicitador de execução em Benguela (520.000 Kz — não reembolsável).`,
        sourceLabel: 'Descrição do processo e despesas',
        sourceType: 'CASE_DATA'
      },
      {
        title: 'Próximos Passos',
        content: `1. **Prazo 20/11/2026 (14h00):** Requerimento de Notificação do Banco Fiduciário para Penhora de Saldos\n2. Verificação periódica dos saldos bancários arrestados\n3. Acompanhamento do solicitador de execução em Benguela`,
        sourceLabel: 'Prazos registados',
        sourceType: 'DEADLINE_DATA',
        isActionable: true
      }
    ],
    disclaimers: [
      'Conteúdo demonstrativo.',
      'Nenhuma informação foi enviada para serviços externos.'
    ]
  }
};

// ─── Mapa Global ──────────────────────────────────────────────────────────────

const DEMO_RESPONSES: Record<string, Record<string, AiDemoResponse>> = {
  'case-001': CASE_001_RESPONSES,
  'case-002': CASE_002_RESPONSES,
  'case-003': CASE_003_RESPONSES,
  'case-004': CASE_004_RESPONSES
};
