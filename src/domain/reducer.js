export const initialFilters = { query: "", status: "all", team: "all", priority: "all", unreadOnly: false };

function updateItem(items, id, patch) {
  return items.map((item) => item.id === id ? { ...item, ...patch } : item);
}

function addActivity(item, activity) {
  return { ...item, activities: [activity, ...item.activities], updatedAt: activity.at };
}

export function queueReducer(state, action) {
  switch (action.type) {
    case "filters/set":
      return { ...state, filters: { ...state.filters, [action.key]: action.value } };
    case "filters/reset":
      return { ...state, filters: initialFilters };
    case "sort/set":
      return { ...state, sort: action.value };
    case "selection/toggle": {
      const selected = new Set(state.selectedIds);
      selected.has(action.id) ? selected.delete(action.id) : selected.add(action.id);
      return { ...state, selectedIds: [...selected] };
    }
    case "selection/setMany":
      return { ...state, selectedIds: [...new Set(action.ids)] };
    case "selection/clear":
      return { ...state, selectedIds: [] };
    case "detail/open":
      return { ...state, activeId: action.id, items: updateItem(state.items, action.id, { unread: false }) };
    case "detail/close":
      return { ...state, activeId: null };
    case "item/patch":
      return { ...state, items: updateItem(state.items, action.id, action.patch) };
    case "item/activity":
      return {
        ...state,
        items: state.items.map((item) => item.id === action.id ? addActivity(item, action.activity) : item),
      };
    case "items/patchMany": {
      const ids = new Set(action.ids);
      return { ...state, items: state.items.map((item) => ids.has(item.id) ? { ...item, ...action.patch } : item) };
    }
    case "notice/show":
      return { ...state, notice: action.message };
    case "notice/clear":
      return { ...state, notice: "" };
    default:
      return state;
  }
}
