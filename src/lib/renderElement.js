import { setupEventListeners } from "./eventManager";
// import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  // 1. vNode를 정규화합니다.
  const normalizedVNode = normalizeVNode(vNode);

  // 2. 이전 VNode를 container에서 가져옵니다.
  // 이 oldVNode는 updateElement에서 비교 기준으로 사용됩니다.
  const oldVNode = container.__vdom;

  // 3. updateElement를 호출하여 DOM을 업데이트합니다.
  // 최초 렌더링 시 oldVNode는 undefined이며, updateElement 내부에서 처리됩니다.
  updateElement(container, normalizedVNode, oldVNode);

  // 4. 다음 리렌더링을 위해 현재 VNode를 container에 저장합니다.
  container.__vdom = normalizedVNode;

  // 5. 이벤트 리스너를 설정합니다.
  setupEventListeners(container);
}
