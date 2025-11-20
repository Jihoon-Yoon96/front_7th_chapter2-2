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

    // checked, disabled, selected 등 boolean 프로퍼티 직접 처리
    if (key === "checked" || key === "disabled" || key === "selected") {
      target[key] = !!newValue;
    }
    // className 처리
    else if (key === "className") {
      if (newValue) {
        target.className = newValue;
      } else {
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
    // 기타 일반 속성 처리
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
  if (!oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  const targetNode = parentElement.childNodes[index];

  if (!newNode) {
    parentElement.removeChild(targetNode);
    return;
  }

  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode !== oldNode) {
      targetNode.textContent = newNode;
    }
    return;
  }

  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(createElement(newNode), targetNode);
    return;
  }

  updateAttributes(targetNode, newNode.props, oldNode.props);

  const newLength = newNode.children.length;
  const oldLength = oldNode.children.length;
  const maxLength = Math.max(newLength, oldLength);

  for (let i = 0; i < maxLength; i++) {
    updateElement(targetNode, newNode.children[i], oldNode.children[i], i);
  }
}
