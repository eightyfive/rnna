---
to: app/views/atoms/index.js
inject: true
append: true
skip_if: <%= name %>
---
export { default as <%= name %> } from './<%= h.changeCase.paramCase(name) %>';