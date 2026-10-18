import {parseJSON,cleanText} from './assistant.mjs';
export function parseDiagram(text){
  const data=parseJSON(text);
  if(!Array.isArray(data.nodes)||!data.nodes.length||data.nodes.length>30||!Array.isArray(data.edges)||data.edges.length>60)throw Error('Use até 30 blocos e 60 conexões.');
  const ids=new Set();
  const nodes=data.nodes.map(node=>{
    if(!/^[a-zA-Z][a-zA-Z0-9_]{0,24}$/.test(node.id)||ids.has(node.id)||!['step','decision','start','end'].includes(node.kind))throw Error('Bloco inválido ou repetido.');
    ids.add(node.id);return {id:node.id,label:cleanText(node.label,120),kind:node.kind};
  });
  const edges=data.edges.map(edge=>{
    if(!ids.has(edge.from)||!ids.has(edge.to))throw Error('Conexão para bloco inexistente.');
    return {from:edge.from,to:edge.to,label:edge.label?cleanText(edge.label,45):''};
  });
  return {nodes,edges};
}
export function inspectDiagram(graph){
  const parent=graph.getDefaultParent();const vertices=graph.getChildVertices(parent);
  const isolated=vertices.filter(cell=>!(cell.edges&&cell.edges.length));const decisions=vertices.filter(cell=>String(cell.style||'').includes('rhombus'));
  const unlabeled=decisions.filter(cell=>(cell.edges||[]).some(edge=>edge.source===cell&&!String(edge.value||'').trim()));
  const issues=[];
  if(isolated.length>1)issues.push(`${isolated.length} blocos sem conexões; revise se pertencem ao fluxo.`);
  if(unlabeled.length)issues.push(`${unlabeled.length} decisões têm saídas sem rótulo. Identifique os caminhos de cada resposta.`);
  if(!vertices.length)issues.push('A página está vazia. Descreva o processo para gerar um rascunho.');
  return issues;
}
export function addDiagram(graph,data){
  const parent=graph.getDefaultParent();const existing=graph.getChildVertices(parent);
  const right=existing.reduce((max,cell)=>Math.max(max,(cell.geometry?.x||0)+(cell.geometry?.width||0)),-300)+300;
  const cells=new Map();const added=[];const model=graph.getModel();
  model.beginUpdate();
  try{
    data.nodes.forEach((node,index)=>{
      const shape=node.kind==='decision'?'rhombus':(['start','end'].includes(node.kind)?'ellipse':'rectangle');
      const cell=graph.insertVertex(parent,null,node.label,right+(index%3)*280,Math.floor(index/3)*180,220,110,`shape=${shape};rounded=1;whiteSpace=wrap;html=0;fillColor=#e8f6c6;strokeColor=#334b1b;fontColor=#17210b;fontSize=16;`);
      cells.set(node.id,cell);added.push(cell);
    });
    data.edges.forEach(edge=>added.push(graph.insertEdge(parent,null,edge.label,cells.get(edge.from),cells.get(edge.to),'edgeStyle=orthogonalEdgeStyle;html=0;endArrow=block;strokeColor=#536983;fontSize=14;')));
  }catch(error){graph.removeCells(added);throw error;}
  finally{model.endUpdate();}
  graph.setSelectionCells(added);
  if(added[0])graph.scrollCellToVisible(added[0]);
}
