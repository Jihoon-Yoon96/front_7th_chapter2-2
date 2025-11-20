import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
// import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  // 1. vNode를 정규화하여 순수 HTML 태그 구조로 만듭니다.
  const normalizedVNode = normalizeVNode(vNode);

  // 2. 렌더링 로직을 결정합니다.
  const oldDOM = container.firstChild;
  console.log(oldDOM);

  if (!oldDOM) {
    // 최초 렌더링: DOM을 새로 생성하여 추가합니다.
    const newDOM = createElement(normalizedVNode);
    container.innerHTML = ""; // 혹시 모를 기존 내용을 비웁니다.
    container.appendChild(newDOM);
  } else {
    // 리렌더링: 기존 DOM과 새 vNode를 비교하여 업데이트합니다.
    // updateElement 함수는 변경된 부분만 효율적으로 업데이트하는 역할을 합니다.
    // (이번 과제에서는 updateElement의 상세 구현보다 전체 흐름이 중요합니다.)
    // updateElement(container, normalizedVNode, oldDOM);
    // updateElement구현 전 임시 로직
    const newDOM = createElement(normalizedVNode);
    container.innerHTML = "";
    container.appendChild(newDOM);
  }

  // 3. 렌더링이 완료된 후, container에 이벤트 위임 리스너를 설정합니다.
  // 이렇게 해야 createElement 과정에서 addEvent로 등록된 이벤트들이 동작합니다.
  setupEventListeners(container);
}
