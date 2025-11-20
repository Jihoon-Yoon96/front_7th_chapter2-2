import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

/**
 * DOM 요소의 속성을 업데이트, 추가, 제거합니다.
 * @param {HTMLElement} target - 속성을 업데이트할 DOM 요소
 * @param {object} newProps - 새로운 속성 객체
 * @param {object} oldProps - 이전 속성 객체
 */
function updateAttributes(target, newProps, oldProps) {
  const newP = newProps || {};
  const oldP = oldProps || {};
  const allProps = { ...oldP, ...newP };

  Object.keys(allProps).forEach((key) => {
    const oldValue = oldP[key];
    const newValue = newP[key];

    // 속성이 완전히 동일하면 아무 작업도 하지 않음
    if (oldValue === newValue) {
      return;
    }

    // className 처리
    if (key === "className") {
      if (newValue) {
        target.className = newValue;
      } else {
        // className prop이 없어지면 class 속성을 완전히 제거합니다.
        target.removeAttribute("class");
      }
    }
    // 이벤트 핸들러 처리
    else if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      if (oldValue) {
        removeEvent(target, eventType, oldValue);
      }
      if (newValue) {
        addEvent(target, eventType, newValue);
      }
    }
    // 기타 속성 처리
    else {
      if (newValue === undefined || newValue === null) {
        target.removeAttribute(key);
      } else {
        target.setAttribute(key, newValue);
      }
    }
  });
}

/**
 * 가상 DOM의 변경사항을 실제 DOM에 반영합니다.
 * @param {HTMLElement} parentElement - 부모 DOM 요소
 * @param {object} newNode - 새로운 가상 노드
 * @param {object} oldNode - 이전 가상 노드 또는 DOM 요소
 * @param {number} index - 부모 요소 내에서의 현재 노드의 인덱스
 */
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 1. 이전 노드가 없는 경우: 새 노드 추가
  if (!oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  const targetNode = parentElement.childNodes[index];

  // 2. 새 노드가 없는 경우: 이전 노드 제거
  if (!newNode) {
    parentElement.removeChild(targetNode);
    return;
  }

  // 3. 두 노드가 모두 텍스트 노드이고 내용이 다른 경우: 텍스트 업데이트
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode !== oldNode) {
      targetNode.textContent = newNode;
    }
    return;
  }

  // 4. 노드 타입이 다른 경우: 노드 교체
  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(createElement(newNode), targetNode);
    return;
  }

  // 5. 같은 타입의 노드 업데이트 (재귀의 핵심)
  // 속성 업데이트
  updateAttributes(targetNode, newNode.props, oldNode.props);

  // 자식 노드 재귀적 업데이트
  const newLength = newNode.children.length;
  const oldLength = oldNode.children.length;
  const maxLength = Math.max(newLength, oldLength);

  for (let i = 0; i < maxLength; i++) {
    updateElement(targetNode, newNode.children[i], oldNode.children[i], i);
  }
}
