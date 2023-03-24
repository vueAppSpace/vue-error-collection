/*
 * @Description: localstorage 简单封装
 * @Author: WANGCHENGAE
 * @Date: 2022-12-19 11:00:30
 * @LastEditTime: 2023-03-23 17:46:26
 */

function normalizeKey(key) {
  if (typeof key !== "string") {
    console.error(key + " used as a key, but it is not a string.");
    key = String(key);
  }
  return key;
}

function serialize(value) {
  if (typeof value === "object") {
    value = JSON.stringify(value);
  }
  return value;
}

function deserialize(value) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

export function setStorage(key, value) {
  key = normalizeKey(key);
  value = serialize(value);
  localStorage.setItem(key, value);
}

export function getStorage(key) {
  key = normalizeKey(key);
  return deserialize(localStorage.getItem(key));
}

export function removeStorage(key) {
  key = normalizeKey(key);
  localStorage.removeItem(key);
}

export function clearStorage() {
  localStorage.clear();
}
