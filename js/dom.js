// 舊版 Safari（iOS 10）沒有 replaceChildren，自己做一個。

export function setChildren(el, nodes) {
  while (el.firstChild) el.removeChild(el.firstChild);
  nodes.forEach((node) => el.appendChild(node));
}
