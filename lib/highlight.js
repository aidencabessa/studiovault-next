export function highlight(raw) {
  const e = raw.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const KW = new Set(["local","function","end","if","then","else","elseif","for","do","while","repeat","until","return","and","or","not","true","false","nil","in","break","continue"]);
  const BI = new Set(["game","workspace","script","print","task","math","string","table","pairs","ipairs","next","type","tostring","tonumber","error","warn","assert","require","pcall","xpcall","select","Instance","Vector3","CFrame","Color3","UDim2","UDim","TweenService","TweenInfo","Enum","tick","Players","ReplicatedStorage","ServerStorage","PathfindingService","UserInputService","MarketplaceService","DataStoreService","Lighting","Debris"]);
  const o=[]; let i=0;
  while(i<e.length){
    if(e[i]==="-"&&e[i+1]==="-"){let j=e.indexOf("\n",i);if(j<0)j=e.length;o.push(`<span class="ck">${e.slice(i,j)}</span>`);i=j;continue;}
    if(e[i]==='"'||e[i]==="'"){const q=e[i];let j=i+1;while(j<e.length&&e[j]!==q){if(e[j]==="\\")j++;j++;}j++;o.push(`<span class="cs">${e.slice(i,j)}</span>`);i=j;continue;}
    const wm=e.slice(i).match(/^[A-Za-z_]\w*/);
    if(wm){const w=wm[0];if(KW.has(w))o.push(`<span class="ckw">${w}</span>`);else if(BI.has(w))o.push(`<span class="cb">${w}</span>`);else o.push(w);i+=w.length;continue;}
    const nm=e.slice(i).match(/^\d+\.?\d*/);
    if(nm){o.push(`<span class="cn">${nm[0]}</span>`);i+=nm[0].length;continue;}
    o.push(e[i]);i++;
  }
  return o.join("");
}
