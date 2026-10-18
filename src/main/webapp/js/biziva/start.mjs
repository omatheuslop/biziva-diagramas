import {mountAssistant} from './assistant.mjs';
import {parseDiagram,inspectDiagram,addDiagram} from './diagram.mjs';
export function startBiziva(ui){
  if(ui.bizivaCleanup)return;
  const doc=ui.container.ownerDocument;const host=doc.createElement('div');doc.body.append(host);
  ui.bizivaCleanup=mountAssistant(host,{
    title:'Biziva Diagramas',
    description:'Descreva a operação e receba blocos e conexões editáveis no draw.io. A revisão local aponta decisões sem rótulo e blocos desconectados.',
    placeholder:'Um fluxo de venda de sites: contato, diagnóstico, proposta, pagamento e entrega…',
    sourceUrl:'https://github.com/omatheuslop/biziva-diagramas',
    instruction:'Retorne apenas JSON {"nodes":[{"id":"a","label":"Ação","kind":"step"}],"edges":[{"from":"a","to":"b","label":"Sim"}]}. Máximo 30 nodes e 60 edges, IDs ASCII únicos de até 25 caracteres começando por letra. kind: step, decision, start ou end. Labels de bloco até 120 caracteres; conexões até 45. Conexões devem usar IDs existentes. Decisões devem ter saídas rotuladas. Crie um fluxo útil em português sem HTML, XML ou URLs.',
    parse:parseDiagram,
    inspect:()=>inspectDiagram(ui.editor.graph),
    apply:data=>{
      if(!ui.editor.graph.isEnabled())throw Error('Abra um diagrama editável antes de adicionar.');
      addDiagram(ui.editor.graph,data);
    },
  });
}
